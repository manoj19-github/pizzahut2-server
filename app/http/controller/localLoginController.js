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


module.exports=loginCtrl
