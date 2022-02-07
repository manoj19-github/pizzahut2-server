const isAdmin=(req,res,next)=>{
  if(req.user && req.user.isAdmin) next()
  else{
    return res.status(501).json({
      status:false,
      message:"access denied"
    })

  }

}
module.exports=isAdmin
