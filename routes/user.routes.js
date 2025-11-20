const express=require("express");
const router =express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const userModel=require("../models/user.model")
router.get("/register",(req,res)=>{
  res.render("register")
})


router.post("/register",
 [
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Enter a valid email"),

    body("username")
      .trim()
      .notEmpty().withMessage("Username is required"),

    body("password")
      .trim()
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),
  ],
  async (req,res)=>{
const errors=validationResult(req);
console.log(errors)

  const {email,username,password}=req.body;

  const hashpassword=await bcrypt.hash(password,10)

  const newUser=await userModel.create({
    email,
    username,
    password:hashpassword
    
  })
  res.json(newUser)
})



router.get("/login",(req,res)=>{
  res.render("login")
})

router.post("/login", async (req,res)=>{
const {username,password}=req.body;
const user=await userModel.findOne({
username:username
})
if(!user){
   return res.status(400).json({
    message:"user or password is incorrect"
   })
}
const isMatch=await bcrypt.compare(password,user.password)
if(!isMatch){
  return res.status(400).json({
    message:"username or password is incorrect"
  })
}

const token=jwt.sign({
  userId:user._id,
  email:user.email,
  username:user.username
},
process.env.JWT_SECRET,
)
res.cookie("token",token)
res.send("loggedn in")
})

module.exports=router;