const express = require("express");
const connectToDb = require("./config/database");
const globalError = require("./middleware/globalMiddleware")
const cookieParser = require('cookie-parser');

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 8080;
let server;

app.use(globalError)

connectToDb().then(()=>{
    console.log("DB connected")
    server = app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
 }).catch(error=> console.log(error));;

process.on('unhandledRejection',function(error){
    console.log(`unhandledRejection ${error}`);
    server.close(()=>{
        console.error(`Shut down...`);
        process.exit(1);
    })
})