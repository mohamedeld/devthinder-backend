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

const reviewConnectionRequest = asyncHandler(async (req,res,next)=>{
    const {status,requestId} = req?.params;
    const loggedInUser = req?.user?._id;

const allowedStatus = ["accepted","rejected"];
    if(!allowedStatus?.includes(status)){
        return next(new AppError("Invalid status type",400))
    }

    const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser,
        status:"interested"
    });
    if(!connectionRequest){
        return next(new AppError('connection request is not found',400))
    }
    
    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.status(200).json({
        message:"Status changed successfully",
        data
    })
})


module.exports = {
    sendConnectionRequest,
    reviewConnectionRequest
}