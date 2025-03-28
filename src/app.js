const express = require("express");
require("dotenv").config();

const app = express();


const PORT = process.env.PORT || 8080;
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