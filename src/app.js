const express = require("express");
const connectToDb = require("./config/database")
require("dotenv").config();
const app = express();


const PORT = process.env.PORT || 8080;

connectToDb();
const server = app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

process.on('unhandledRejection',function(error){
    console.log(`unhandledRejection ${error}`);
    server.close(()=>{
        console.error(`Shut down...`);
        process.exit(1);
    })
})