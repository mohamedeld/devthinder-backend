const AppError = require("../config/apiError");
const asyncHandler = require("../config/asyncHandler");
const ConnectionRequest = require("../models/connectionRequestModel");
const User = require("../models/userModel");

const sendConnectionRequest = asyncHandler(async(req,res,next)=>{
    const {status,toUserId} = req.params;
    const fromUserId = req?.user?._id;
    const allowedStatus = ["interested","ignored"];

    const user = await User.findById(toUserId);
    if(!user){
        return next(new AppError('User is not found',400))
    }
    if(!allowedStatus?.includes(status)){
        return next(new AppError("Invalid status type",400))
    }
    // if there is an existing connection request
    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId, toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ]
    })
    if(existingConnectionRequest){
        return next(new AppError("Request is already sent",400))
    }
    const newConnection = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    })
    const data = await newConnection.save();
    res.status(200).json({
        message:"Connection Request Sent Successfully",
        data
    })
})


module.exports = {
    sendConnectionRequest
}