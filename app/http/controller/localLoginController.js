const passport=require("passport")
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

module.exports={localLoginCtrl,adminLoginCtrl}
