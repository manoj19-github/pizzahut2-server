const Slide=require("../../models/slideModel")
const getSlideCtrl=async(req,res)=>{
  try{
    const slides=await Slide.find({},null,{$sort:{createdAt:-1}})
    return res.status(201).json({status:true,slides})
  }catch(err){
    console.log("error in getSlideCtrl ",err)
    return res.status(501).json({status:false})
  }
}
module.exports=getSlideCtrl
