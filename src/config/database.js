const mongoose = require("mongoose");

const connectToDb = ()=>{
    try{    
         mongoose.connect(process.env.DB_URL).then(()=>{
            console.log("DB connected")
         }).catch(error=> console.log(error));
    }catch(error){
        throw new Error("error connect to db",error)
    }
}

module.exports = connectToDb;