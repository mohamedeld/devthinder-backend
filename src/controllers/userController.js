const AppError = require("../config/apiError");
const asyncHandler = require("../config/asyncHandler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

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
