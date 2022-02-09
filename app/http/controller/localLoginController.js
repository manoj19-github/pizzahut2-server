const passport=require("passport")
const jwt=require("jsonwebtoken")
const User=require("../../models/userModel")


const loginCtrl=async(req,res)=>{
  try{
    const {email,password}=req.body
    const userExists=await User.findOne({email})
    if(userExists && userExists.authenticate(password)){
      const payload={
        userEmail:userExists.email,
        id:userExists._id,
        isAdmin:userExists.isAdmin
      }
      const token=jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:"1d"})
      return res.status(201)
        .json({
          status:true,
          userToken:token,
          userEmail:userExists.email,
          userId:userExists._id,
          isAdmin:userExists.isAdmin
        })
    }
    return res.status(501).json({status:false})
  }catch(err){
    console.log(err)
    return res.status(501).json({status:false})
  }
}
const adminLoginCtrl=(req,res,next)=>{
  passport.authenticate("local",(err,user,info)=>{
    if(err) throw err
    if(!user) return res.status(501).json({status:false,message:`No User found ${info.message}`})
    if(!user.isAdmin) return res.status(501).json({
      status:false,
      message:"User not valid "
    })
    else{
      req.logIn(user,(err)=>{
        let authUser
        if(err) throw err
        authUser={
          id:req.user.id,
          name:req.user.name,
          email:req.user.email,
          isAdmin:req.user.isAdmin
        }
        return res.status(201).
        json({
          status:true,
          message:"successfully login",
          authUser
        })
      })
    }
  })(req,res,next)

}
const localLoginCtrl=(req,res,next)=>{
  passport.authenticate("local",(err,user,info)=>{
    if(err) throw err
    if(!user) return res.status(501).json({status:false,message:`email or password is invalid`})
    else {

      req.logIn(user,(err)=>{
        let authUser
        if(err) throw err
        if(req.user){
            authUser={
            id:req.user._id,
            name:req.user.name,
            email:req.user.email,
            isAdmin:req.user.isAdmin
          }
        }
        return res.status(201).json({
          status:true,message:"successfully login",authUser
        })


      })
    }
  })(req,res,next)

}

module.exports={localLoginCtrl,adminLoginCtrl,loginCtrl}
