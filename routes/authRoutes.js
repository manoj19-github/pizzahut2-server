const express=require("express")
const Router=express.Router()
const User=require("../app/models/userModel")
const registerController=require("../app/http/controller/registerController")
const sendConfirmationCtrl=require("../app/http/controller/sendConfirmationCtrl")
const {localLoginCtrl,adminLoginCtrl}=require("../app/http/controller/localLoginController")
const isLoggedIn=require("../app/http/middleware/isLoggedIn")
const passport=require("passport")

Router.post("/register",registerController)
Router.post("/login",localLoginCtrl)
Router.post("/admin/login",adminLoginCtrl)

Router.get("/login/facebook",passport.authenticate("facebook",{scope:["profile"]}))

Router.get("/facebook/callback",passport.authenticate("facebook",{
  successRedirect:`${process.env.CLIENT_SERVER}`,
  failureRedirect:"/login/failed"
}))
Router.get("/google/callback",passport.authenticate("google",{
  successRedirect:`${process.env.CLIENT_SERVER}`,
  failureRedirect: "/login/failed",
}))
Router.get("/login/google",passport.authenticate("google",{
  scope:["email","profile"]
}))
Router.get("/login/success",(req,res)=>{
  var authUser
  if(req.user){
    authUser={
      id:req.user._id,
      name:req.user.name,
      email:req.user.email,
      isAdmin:req.user.isAdmin
    }
    return res.status(201).json({message:"user logged In ",status:true,authUser})
  }
  return res.status(501).json({status:false})
})

Router.post("/forgot-password",sendConfirmationCtrl().sendConfirmation)
Router.post("/setNew-password",sendConfirmationCtrl().setNewPassword)


Router.post("/logout",isLoggedIn,(req,res)=>{
  req.logout()
  return res.status(201).json({message:"user logout successfully ",status:true})
})
module.exports=Router
