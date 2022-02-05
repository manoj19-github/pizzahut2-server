const Product=require("../../models/productModel")
const productCtrl=()=>{
  return{
    async getProducts(req,res){
      try{
        const products=await Product.find({},null,{sort:{createdAt:-1}})
        return res.status(201).json({
          status:true,
          message:"products found",
          products
        })

      }catch(err){
        console.log("error in productCtrl : ",err)
        return res.status(501).json({
          status:false,
          message:"Something went wrong",
        })
      }
    },
    async getProduct(req,res){
      try{
        console.log(req.query.productId)
        const product=await Product.findById(req.query.productId)
        return res.status(201).json({
          status:true,
          message:"products found",
          product
        })

      }catch(err){
        console.log(`error in productCtrl : err`,err)
        return res.status(501).json({
          status:false,
          message:"Something went wrong",
        })
      }
    }
  }
}
module.exports=productCtrl
