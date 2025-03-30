const asyncHandler = require("../config/asyncHandler");
const ConnectionRequest = require("../models/connectionRequestModel");

const sendConnectionRequest = asyncHandler(async(req,res,next)=>{
    const {status,toUserId} = req.params;
    const fromUserId = req?.user?._id;
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