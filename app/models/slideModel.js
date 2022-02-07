const mongoose=require("mongoose")
const slideSchema=new mongoose.Schema({
  slideImage:{type:String,required:true}
})
module.exports=mongoose.model("Slide",slideSchema)
