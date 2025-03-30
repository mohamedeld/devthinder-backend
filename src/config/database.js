const mongoose = require("mongoose");

const connectToDb = async ()=>{
    try{    
        await mongoose.connect(process.env.DB_URL);
    }catch(error){
        throw new Error("error connect to db",error)
    }
}


module.exports = connectToDb;