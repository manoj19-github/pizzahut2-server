const User=require("../../models/userModel")
const validator=require("validator")
const registerController=async(req,res)=>{
  try{
    const {name,password,email}=req.body
    if(!name || !password|| !email || !validator.isEmail(email)){
      return res.status(501).json({
        status:false,
        message:"please fill all the field correctly"
      })
    }
    const userExists=await User.findOne({email})
    if(userExists){
      return res.status(501).json({
        status:false,
        message:"User already exists"
      })
    }
    const newUser=new User({
      name,
      email,
      password
    })
    const userSaved=await newUser.save()
    return res.status(201).json({
      status:true,
      message:"new User saved successfully",
      user:{
        name:userSaved.name,
        email:userSaved.email,
        _id:userSaved._id
      }
    })

  }catch(err){
    console.log("error in register ctrl",err)
    return res.status(501).json({
      status:false,
      message:"something went wrong "
    })
  }
}
module.exports=registerController
