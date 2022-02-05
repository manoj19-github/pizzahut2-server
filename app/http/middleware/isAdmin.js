const isAdmin=(req,res)=>{
  if(req.user.isAdmin) next()
  return res.status(501).json({
    status:true,
    message:"access denied"
  })
}
module.exports=isAdmin
