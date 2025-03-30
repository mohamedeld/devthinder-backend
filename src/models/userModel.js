const { Schema, model, models } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    age: Number,
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    photoUrl:{
      type:String
    },
    about:String,
    skills:[String]
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateToken =function(){
  return jwt.sign({id:this?._id,email:this?.email},process.env.JWT_SECRET,{
    expiresIn:'90d'
  })
}
const User = models.User || model("User", userSchema);

module.exports = User;
