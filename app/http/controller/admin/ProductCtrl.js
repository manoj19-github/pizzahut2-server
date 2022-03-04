const uploadCloudinary=require("../../../utils/uploadCloudinary")
const Product =require("../../../models/productModel")
const productCtrl=()=>{
    return{
      async addOrUpdate(req,res){
        try{
          const eventEmitter=req.app.get("eventEmitter")
          const {name,base_price,sizes,ingridients,details}=req.body
          if(req.body?.updateId){
              const updateProduct=await Product.findByIdAndUpdate(updateId,{
                name,base_price,sizes,ingridients,details
              })
              eventEmitter.emit("productAdded",updateProduct)
              return res.status(201).json({
                status:true,
                message:"successfully updated",
                products:updateProduct
              })
            }else{
              const newProduct=await Product.create({
                name,base_price,sizes,ingridients,details
              })
              eventEmitter.emit("productAdded",newProduct)
              return res.status(201).json({
                status:true,
                message:"successfully inserted",
                products:newProduct
              })
            }
        }catch(err){
          console.log(err)
          return res.status(501)
          .json({
            status:false,
            message:"something went wrong please check",
            error:err
          })
        }

      },
      async delete(req,res){
        try{

          const delProduct=await Product.findByIdAndDelete(req.body.productId)
          return res.status(201).json({
            status:true,
            message:"product deleted successfully",
            products:delProduct
          })
        }catch(err){
          console.log("product id delete not work",err)
          return res.status(501).json({
            status:false,
            message:"something went wrong ",
          })
        }

      },
      async getProducts(req,res){
        try{
          const products=await Product.find({}).sort({"createdAt":"desc"})

          return res.status(201).json({
            status:true,
            message:"products fetched successfully",
            products
          })
        }catch(err){
          console.log(`err in getProducts`,err)
          return res.status(501).json({
            status:false,
            message:"products not fetched",
          })
        }
      },
      async getProductById(req,res){
        try{
          const product=await Product.findById(req.params.productId)

          return res.status(201).json({
            status:true,
            message:"products fetched successfully",
            product
          })
        }catch(err){
          console.log(`err in getProductById`,err)
          return res.status(501).json({
            status:false,
            message:"products not fetched",
          })
        }


      },
      async editImage(req,res){
        try{
          if(req.file){
            const imageUrl=await uploadCloudinary(req.file.path)
            const products=await Product.findByIdAndUpdate(req.body.productId,{image:imageUrl})
            return res.status(201).json({
              status:true,
              message:"product Image updated",
              products
            })
          }else{
            return res.status(201).json({
              status:false,
              message:"product Image not updated",
            })
          }

        }catch(err){
          console.log("product image",err)
          return res.status(201).json({
            status:false,
            message:"product Image not updated",
          })
        }
      }
    }
}
module.exports=productCtrl
