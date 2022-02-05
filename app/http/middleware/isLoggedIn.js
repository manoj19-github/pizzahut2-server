const isLoggedIn=(req,res,next)=>{
    console.log("req.user",req.user)
  if(req.user){
    req.isAuthenticate=true
    next()
  }else{
    return res.status(201).json({redirectToLogin:true,message:'user not authenticate',status:false})
  }

}
module.exports =isLoggedIn
