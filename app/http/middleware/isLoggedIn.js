const isLoggedIn=(req,res,next)=>{
  if(req.user){
    req.isAuthenticate=true
    next()
  }else{
    return res.status(201).json({redirectToLogin:true,message:'user not authenticate',status:false})
  }

}
module.exports =isLoggedIn
