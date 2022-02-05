const nodemailer=require("nodemailer")
const mailTransporter=nodemailer.createTransport({
  host:"smtp.gmail.com",
  port:process.env.SMTP_PORT,
  secure:false,
  auth:{
    user:process.env.SMTP_USER,
    pass:process.env.SMTP_PASSWORD
  },
  tls:{
    rejectUnAuthorized:false
  }
})
module.exports=mailTransporter
