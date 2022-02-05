const cloudinary=require("cloudinary").v2
const uploadCloudinary=async(filepath)=>{
  let uploadedFile
  try{
    uploadedFile=await cloudinary.uploader.upload(filepath,{
      folder:"pizzahut2",
      resource_type:"auto"
    })
    const {secure_url}=uploadedFile
    console.log("secure_url",secure_url)
    return secure_url
  }catch(err){
    console.log(`cloudinary uploading error in uploadCloudinary page`,err)
    return null
  }
}
module.exports=uploadCloudinary
