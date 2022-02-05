const cartModel=require("../../models/cartModel")
const Product=require("../../models/productModel")
const cartCtrl=()=>{
  return{
    async addProduct(req,res){
      try{
        const cartExists=await cartModel.findOne({user:req.user._id})
        if(cartExists){
          const itemExists=cartExists.cartItems.find(cart=>{
            return cart.product==req.body.cartItems.product
          })

          let condition,action
          if(itemExists){
            condition={"user":req.user._id,"cartItems.product":req.body.cartItems.product}
            action={
              "$set":{
                "cartItems.$":{
                  ...req.body.cartItems,
                  quantity:itemExists.quantity+req.body.cartItems.quantity
                }
              }
            }
            const updatedCart=await cartModel.findOneAndUpdate(condition,action)
            if(updatedCart){
              return res.status(201).json({cartProduct:updatedCart,status:true})
            }
          }else{
            condition={user:req.user._id}
            action={
              "$push":{
                "cartItems":req.body.cartItems
              }
            }
            const updatedCart=await cartModel.findOneAndUpdate(condition,action)
            if(updatedCart){
              return res.status(201).json({cartProduct:updatedCart,status:true})
            }

          }

        }else{
          const cartObj=new cartModel({
            user:req.user._id,
            cartItems:[req.body.cartItems]
          })
          const cartSaved=await cartObj.save()
          return res.status(201).json({
            status:true,
            cartProduct:cartSaved
          })
        }

      }catch(err){
        return res.status(501).json({
          status:false,
          message:"sorry something went wrong"
        })
      }
    },
    async deleteCart(req,res){
      console.log("cartId",req.body.cartId)
      try{
        const cartExists=await cartModel.findOne({user:req.user._id})
        if(cartExists){
            const condition={user:req.user._id}
            const action={
              $pull:{
                "cartItems":{"_id":req.body.cartId}
              }
            }
            var cartDeleted=await cartModel.findOneAndUpdate(condition,action,{new:true})
            cartDeleted=await Product.populate(cartDeleted,{
              path:"cartItems.product",
              select:"name image"
            })
            return res.status(201).json({
              status:true,
              cartProduct:cartDeleted
            })
        }
      }catch(err){
        console.log(err)
        return res.status(501).json({
          status:false,
          message:"cart not deleted"

        })
      }
    },
    async getCartProduct(req,res){
      try{
        var cartExists=await cartModel.findOne({user:req.user._id})
        cartExists=await Product.populate(cartExists,{
          path:"cartItems.product",
          select:"name image"
        })
        if(cartExists){
        console.log("cartExists",cartExists)
          return res.status(201).json({
            status:true,
            cartProduct:cartExists
          })
        }
        return res.status(201).json({
            status:false,
            cartProduct:null,
            message:"cart not found"
          })
      }catch(err){
        return res.status(501).json({
            status:false,
            cartProduct:null,
            error:err,
            message:"cart not found"
          })
      }

    },
    async editQty(req,res){
      try{
        const cartExists=await cartModel.findOne({user:req.user._id})
        if(cartExists){
        const condition={$and:[{user:req.user._id},{"cartItems.product":req.body.productId}]}
        const action={
          "$set":{
            "cartItems.$.quantity":req.body.newQty
          }
        }
        var updatedCart=await cartModel.findOneAndUpdate(condition,action,{new:true})
        updatedCart=await Product.populate(updatedCart,{
          path:"cartItems.product",
          select:"name image"
        })

        console.log("updatedCart",updatedCart)
        if(updatedCart){
          return res.status(201).json({
            status:true,
            cartProduct:updatedCart
          })
        }

      }
    }catch(err){
      console.log("error in editcart " , err)
      return res.status(501).json({
        status:false,
        cartProduct:null,
        error:err
      })
    }
  }
  }
}
module.exports=cartCtrl
