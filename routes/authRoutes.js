const express=require("express")
const Router=express.Router()
const User=require("../app/models/userModel")
const registerController=require("../app/http/controller/registerController")
const sendConfirmationCtrl=require("../app/http/controller/sendConfirmationCtrl")
const loginCtrl=require("../app/http/controller/localLoginController")
const isLoggedIn=require("../app/http/middleware/isLoggedIn")
const passport=require("passport")
const jwt=require("jsonwebtoken")

Router.post("/register",registerController)
Router.post("/login",loginCtrl)
Router.post("/login-check",passport.authenticate("jwt",{session:false}),isLoggedIn,
  (req,res)=>{
    console.log("req.user",req.user)
    return res.status(201).json({user:req.user})
  }


)


Router.get("/google/callback",passport.authenticate("google",{
  failureRedirect: "/login/failed",
  session:false
}),
  (req,res)=>{
    const payload={
      id:req.user._id,
      email:req.user.email
    }
    const token=jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:"1d"})
    res.redirect(`${process.env.CLIENT_SERVER}?token=${token}`)
  })
Router.get("/login/google",passport.authenticate("google",{
  scope:["email","profile"]
}))
Router.get("/login/success",passport.authenticate("jwt",{session:false}),isLoggedIn,(req,res)=>{
  return res.status(201).json({
    status:true,
    userEmail:req.user.email,
    userId:req.user._id,
    isAdmin:req.user.isAdmin
  })

})
Router.post("/forgot-password",sendConfirmationCtrl().sendConfirmation)
Router.post("/setNew-password",sendConfirmationCtrl().setNewPassword)


Router.get("/logout",passport.authenticate("jwt",{session:false}),isLoggedIn,(req,res)=>{
  try{
    req.logout()
    req.user=null
    return res.status(201).json({message:"user logout successfully ",status:true})

  }catch(err){
    console.log("err in logout ",err)
  }

})
module.exports=Router
