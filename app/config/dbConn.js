const mongoose=require("mongoose")

const connDB=async()=>{
  try{
    await mongoose.connect(process.env.DB_URL,{
      useNewUrlParser:true,useUnifiedTopology:true
    })
  }catch(err){
    console.log(`database connection error try again : ${err}`)
  }
  const {connection}=mongoose
  if(connection.readyState>=1){
    console.log(`database connection established`)
    return
  }
  connection.on("error",()=>{
    console.log(`database not connected`)
  })
}
module.exports=connDB
