const AppError = require("../config/apiError");
const asyncHandler = require("../config/asyncHandler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const ConnectionRequest = require("../models/connectionRequestModel");

const signUp = asyncHandler(async(req,res,next)=>{
    const {firstName,lastName,email,password} = req.body;

    const user = await User.findOne({email});
    if(user){
        return next(new AppError("User is found",400))
    }
    const newUser = new User({
        firstName,
        lastName,
        email,
        password
    })
    await newUser.save();
    res.status(201).json({
        message:"User registered successfully"
    })
})



const login = asyncHandler(async (req,res,next)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return next(new AppError("User is not found",404))
    }

    const isCorrect = await bcrypt.compare(password,user?.password)
    if(!isCorrect){
        return next(new AppError("Password is not correct",401))
    }
    const token = user?.generateToken();
    res.cookie('token',token)
    res.status(200).json({
        message:"user logged in successfully",
    })
})

const protect = asyncHandler(async (request,response,next)=>{
  
  
    let token;
    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')){
      token = request.headers.authorization.split(' ')[1];
    }
    if (!token) {
      throw new Error("access denied")
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
      throw new Error(
        "the user that belong to this token does no longer exist"
      );
    }
    request.user = currentUser;
    next();
  
});

const allowedTo = (...roles) =>{
  return (request, response, next) => {
      if (!roles.includes(request.user.role)) {
        return next(new Error("you don't have permission for this role", 403));
      }
      next();
    } 
  };

  const logout = asyncHandler(async (req,res,next)=>{
    // res.clearCookie('token');
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.status(200).json({
        message:"logout successfully"
    })
  })


const userConnection = asyncHandler(async(req,res,next)=>{
  const loggedInUser = req?.user?._id;
  const connectionRequests = await ConnectionRequest.find({
    $or:[
      {toUserId:loggedInUser,status:"accepted"},
      {fromUserId:loggedInUser,status:"accepted"},
    ]
  }).populate({
    path:"fromUserId",
    select:"_id firstName lastName"
  }).populate({
    path:"toUserId",
    select:"_id firstName lastName"
  })
  const data = connectionRequests?.map((row)=>{
    if(row?.fromUserId === loggedInUser){
      return row?.toUserId;
    }
    return row?.fromUserId;
  })
  res.status(200).json({
    connections:data
  })
})

const userRequests = asyncHandler(async(req,res,next)=>{
  const loggedInUser = req?.user?._id;
  const connectionRequests = await ConnectionRequest.find({
    toUserId:loggedInUser,
    status:"interested"
  }).populate({
    path:"fromUserId",
    select:"_id firstName lastName"
  }).populate({
    path:"toUserId",
    select:"_id firstName lastName"
  })

  res.status(200).json({
    requests:connectionRequests
  })
})

const userFeed = asyncHandler(async(req,res,next)=>{
  const loggedInUser = req?.user?._id;
  const connectionRequests = await ConnectionRequest.find({
    $or:[
      {fromUserId:loggedInUser},
      {toUserId:loggedInUser}
    ]
  }).populate({
    path:"fromUserId",
    select:"firstName"
  }).populate({
    path:"toUserId",
    select:"firstName"
  })
  res.status(200).json(connectionRequests)
})


module.exports = {
    signUp,
    login,
    protect,
    userFeed,
    logout,
    allowedTo,
    userConnection,
    userRequests
}