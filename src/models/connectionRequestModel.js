const { Schema, model, models } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const connectionRequestSchema = new Schema({
    fromUserId:{
        type:Schema.Types.ObjectId,
        required:[true,'from user id is required'],
        ref:'User'
    },
    toUserId:{
        type:Schema.Types.ObjectId,
        required:[true,'to user id is required'],
        ref:'User'
    },
    status:{
        type:String,
        enum:{
            values:['accepted','interested','rejected','ignore'],
            message:`{VALUE} is incorrect status type`
        }
    }
},{timestamps:true});


const ConnectionRequest = models.ConnectionRequest || model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
