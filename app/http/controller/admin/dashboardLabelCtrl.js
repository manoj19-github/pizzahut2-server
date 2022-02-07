const Order=require("../../../models/orderModel")
const Cart=require("../../../models/cartModel")
const User=require("../../../models/userModel")
const Product=require("../../../models/productModel")
const Slide=require("../../../models/slideModel")
const uploadCloudinary=require("../../../utils/uploadCloudinary")
const dashboardLabelCtrl=()=>{
  return{
    async delSlide(req,res){
      try{
        const slideDeleted=await Slide.findByIdAndDelete(req.body.slideId)
        return res.status(201).json({status:true,slides:slideDeleted})

      }catch(err){
        console.log("error in delSlide",err)
        return res.status(501).json({status:false})
      }
    },
    async setSlide(req,res){
      try{
        if(req.file){
          const filePath=await uploadCloudinary(req.file.path)
          const newSlide=await Slide.create({slideImage:filePath})
          return res.status(201).json({
            status:true,
            slide:newSlide
          })
        }
        return res.status(501).json({
          status:false
        })
      }catch(err){
        console.log("error in slide ctrl ",err)
        return res.status(501).json({
          status:false
        })
      }

    },
    async getOrders(req,res){
      try{
        var orders=await Order.find({status:{$nin:["order_delivered","order_rejected"]}},
          {customerId:1,name:1,product:1,address:1,orderPrice:1,phone:1,email:1,paymentStatus:1,paymentType:1,
            status:1,createdAt:1
          },{
            $sort:{createdAt:-1}
          }
        )
        orders=await User.populate(orders,{
          path:"customerId",
          select:"name email"
        })
        return res.status(201).json({orders,status:true})
      }catch(err){
        console.log(err)
        return res.status(501).json({status:false})
      }
    },
    async getProducts(req,res){
      try{
        const products=await Product.find({},{
          name:1,image:1,base_price:1,"ingridients.text":1
        },{
          $sort:{createdAt:-1}
        })
        return res.status(201).json({
          products,status:true
        })
      }catch(err){
        console.log(err)
        return res.status(501).json({status:false})
      }

    },
    async getCustomers(req,res){
      try{
        var cartProduct=await Cart.aggregate([
          {
            $group:{
              _id:{user:"$user",product:"$cartItems.product"}

            }
          }
        ])
        var orderProduct=await Order.aggregate([
          {
            $group:{
              _id:"$customerId",
              count:{$sum:1}

            }
          }
        ])
        orderProduct=await User.populate(orderProduct,{
          path:"_id",
          select:"name email"
        })
        cartProduct=await User.populate(cartProduct,{
          path:"_id.user",
          select:"name email"
        })
        return res.status(201).json({cartProduct,orderProduct,status:true})


      }catch(err){
        console.log(err)
        return res.status(501).json({status:false})
      }
    },
    async lastFiveOrder(req,res){
      try{
        const lastFiveDays=await Order.aggregate([{
          $group:{
            _id:{$dateToString:{format:"%Y-%m-%d",date:"$createdAt"}},
            totalOrder:{$sum:"$orderPrice"}
          }
        },{
          $sort:{_id:1}
        },{
          $limit:5
        }])
        const lastFivePaid=await Order.aggregate([
          {
            $match:{paymentStatus:true}
          },
          {
          $group:{
            _id:{$dateToString:{format:"%Y-%m-%d",date:"$createdAt"}},
            totalOrder:{$sum:"$orderPrice"}
          }
        },{
          $sort:{_id:1}
        },
        {
          $limit:5
        }])

        var topFiveCustomer=await Order.aggregate([
          {
            $group:{
              _id:"$customerId",
              count:{$sum:1}
            },
          },
          {
            $sort:{count:-1}
          },
          {
            $limit:5
          }

        ])
        var topSalesProduct=await Order.aggregate([
          {
            $group:{
              _id:"$product.product._id",
              count:{$sum:1}
            },
          },
          {
            $sort:{count:-1}
          },
          {
            $limit:5
          }

        ])
        topSalesProduct=await Product.populate(topSalesProduct,{
          path:"_id",
          select:"name image base_price"
        })

        topFiveCustomer=await User.populate(topFiveCustomer,{
          path:"_id",
          select:"name email"
        })
        var latestOrder=await Order.find({},{
          customerId:1,orderPrice:1,paymentStatus:1,status:1,createdAt:1
        },{
          $sort:{createdAt:-1}
        }).limit(5)
        latestOrder=await User.populate(latestOrder,{
          path:"customerId",
          select:"name email"
        })
        return res.status(201).json({lastFiveOrder:lastFiveDays,
          lastFivePaid,
          topFiveCustomer:topFiveCustomer,topSalesProduct,
          latestOrder,status:true})
      }catch(err){
        console.log(err)
        return res.status(501).json({status:false})
      }

    },
    async labelData(req,res){
      try{
        const OrderTotal=await Order.aggregate([
          {
            $group:{
              _id:null,
              totalAmount:{$sum:"$orderPrice"}
            }
          }
        ])
        const cartData=await Cart.find({})
        const cartAmount=cartData.map(cart=>cart.cartItems)
        const getCartTotal=(cartAmount)=>{
          var price=[]
          cartAmount.map((cart,index)=>{
            cart.map((item,index)=>{
              price.push(item.price*item.quantity)

            })
          })
          return price.reduce((total,priceVal)=>total+priceVal,0)
        }
        // function mymemo(fn,context){
        //   const res={}
        //   return function(...args){
        //     var argsCache=JSON.stringify(args)
        //     if(!res[argsCache]){
        //       res[argsCache]=fn.call(context||this,...args)
        //     }else{
        //       return res[argsCache]
        //     }
        //   }
        // }
        const cartTotal=getCartTotal(cartAmount)
        const codTotal=await Order
        .aggregate(
          [
            {
              $match: { paymentType: "cod" }
            },
            {
              $group:{
                _id:null,
                totalCod:{$sum:"$orderPrice"}
              }
            }
          ]
        )
        const paidTotal=await Order
        .aggregate(
          [
            {
              $match: { paymentStatus:true }
            },
            {
              $group:{
                _id:null,
                totalPaid:{$sum:"$orderPrice"}
              }
            }
          ]
        )


        return res.status(201).json({orderTotal:OrderTotal[0].totalAmount,cartTotal,
          codTotal:codTotal[0].totalCod,paidTotal:paidTotal[0].totalPaid,status:true})
      }catch(err){
        console.log(err)
        return res.status(501).json({status:false})
      }

    }
  }
}
module.exports=dashboardLabelCtrl
