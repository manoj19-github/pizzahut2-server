const isAdmin=(req,res,next)=>{
  console.log("req.user",req.user)
  if(req.user && req.user.isAdmin) next()
  else{
    console.log("admin denined")
    return res.status(501).json({
      status:false,
      message:"access denied"
    })

  }

}
module.exports=isAdmin
