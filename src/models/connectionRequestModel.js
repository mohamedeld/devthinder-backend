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
            values:['accepted','interested','rejected','ignored'],
            message:`{VALUE} is incorrect status type`
        },
        required:[true,'status is required']
    }
},{timestamps:true});
connectionRequestSchema.index({fromUserId:1,toUserId:1})
connectionRequestSchema.pre('save',function(next){
    // check if fromUserId is same as toUserId
    if(this?.fromUserId?.equals(this?.toUserId)){
        throw new Error("can not send connection request to yourself");
    }
    next();
})


const ConnectionRequest = models.ConnectionRequest || model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
