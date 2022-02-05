const mailTransporter=require("../../config/mailConfig")
const User=require("../../models/userModel")
const uuid=require("uuid").v4
const bcrypt=require("bcryptjs")
const sendConfirmationCtrl=()=>{

  return{
    async setNewPassword(req,res){

      try{
        const {newPassword,userEmail,confirmCode}=req.body
        const cryptedPassword=await bcrypt.hash(newPassword.newPass,10)
        const editUser=await User.findOneAndUpdate({$and:[{email:userEmail},{confirmCode}]},
          {password:cryptedPassword})

        return res.status(201).json({
          status:true,
          msg:"user Data updated successfully"
        })
      }catch(err){
        console.log(`error occured `,err)
        return res.status(501).json({status:false})
      }

    },
    async sendConfirmation(req,res){
      const {userEmail}=req.body

      try{
        const uniqueId=uuid()
        const validUser=await User.findOneAndUpdate({email:userEmail},{confirmCode:uniqueId},{returnOriginal:true})

        if(!validUser){
          return res.status(501).json({
            status:false,
            msg:"email not valid"
          })
        }


        const siteUrl=`${process.env.CLIENT_SERVER}/forgot/${uniqueId}`
        const mailMessage={
          from:process.env.SMTP_USER,
          to:validUser.email,
          subject:`confirmation Link from PizzaHut`,
          text:`To set your password click the link \n
          ${siteUrl}`
        }
        mailTransporter.sendMail(mailMessage,(err,info)=>{
          if(err){
            console.log(err)
            return res.status(501)
            .json({status:false,msg:"server error"})
          }
          return res.status(201)
          .json({status:true,userEmail:validUser.email})
        })
      }catch(err){
        console.log("error in sendConfirmationCtrl",err)
        return res.status(501)
        .json({
          status:false

        })
      }


    }
  }
}
module.exports=sendConfirmationCtrl
