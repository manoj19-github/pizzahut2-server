const Order=require("../../models/orderModel")
const Cart=require("../..//models/cartModel")
const uuid=require("uuid").v4
const stripe=require("stripe")(`${process.env.STRIPE_SECRET_KEY}`)
const mailTransporter=require("../../config/mailConfig")
const twilioClient=require("twilio")(process.env.ACCOUNT_SID,process.env.AUTH_TOKEN)

const orderCtrl=()=>{
  return{
    async getOrder(req,res){
      try{
        const orderData=await Order.findOne({$and:[{user:req.user._id},{_id:req.params.productId}]},
          {address:1,city:1,name:1,orderPrice:1,paymentType:1,paymentStatus:1,status:1,createdAt:1},
        )
        return res.status(201).json({status:true,products:orderData})
      }catch(err){
        console.log(err)
        return res.status(201).json({
          status:false,
          products:null
        })
      }

    },
    async getOrders(req,res){
      try{
        const orderData=await Order.find({user:req.user._id},
          {address:1,city:1,name:1,orderPrice:1,paymentType:1,paymentStatus:1,status:1,createdAt:1},
          {sort:{createdAt:-1}}).limit(50)
        return res.status(201).json({status:true,products:orderData})
      }catch(err){
        console.log(err)
        return res.status(201).json({
          status:false,
          products:null
        })
      }

    },
    async payment(req,res){

      try{
      console.log("this body",req.body)
      switch(req.body.orderData.option){
        case 1:{
          const {token,orderData}=req.body

          const {cartItems,cartProductAmount,
              deliveryAddress,paymentOption
          }=orderData
          let userPhone=`+91${deliveryAddress.phone}`


          const customer=await stripe.customers.create({
            email:token.email,
            source:token.id,
          })
          const idempotencyKey=uuid()
          const charge=await stripe.charges.create({
            amount:cartProductAmount*100,
            currency:"inr",
            customer:customer.id,
            receipt_email:token.email,
            description:`Purchased by ${req.user._id}`,
            shipping:{
              name:token.card.name,
              address:{
                line1:token.card.address_line1,
                line2:token.card.address_line2,
                city:token.card.address_city,
                country:token.card.address_country,
                postal_code:token.card.addres_zip,
              },
            },
          },{
            idempotencyKey,
          })
          console.log("status charge",charge)
          const newOrder=new Order({
            customerId:req.user._id,
            name:deliveryAddress.name,
            product:cartItems,
            orderPrice:cartProductAmount,
            pin:deliveryAddress.pincode,
            phone:userPhone,
            email:deliveryAddress.email,
            address:deliveryAddress.address,
            locality:deliveryAddress.locality,
            city:deliveryAddress.city,
            paymentStatus:charge.paid,
            paymentType:paymentOption,
            paymentDetails:{
                card_id:charge.payment_method,
                status:charge.outcome.seller_message,
                receipt_email:charge.receipt_email,
                amount:charge.amount,
                card_type:charge.payment_method_details.card.brand,
                name:charge.billing_details.name,
                customer:charge.customer,
                currency:charge.currency,
                description:charge.description
            }
          })
          const orderPlaced=await newOrder.save()
          const cartProduct=await Cart.findOneAndDelete({user:req.user._id})
          console.log("new order",orderPlaced)
          // order message send through mail
          const orderMessage1={
              from:process.env.SMTP_USER,
              to:deliveryAddress.email,
              subject:"Order Confirmation Message from PizzaHut",
              text:`Mr. ${req.user.name.split(" ")[1]} your order is placed
                    we will deliver your  product within 2 hours from ordered time
                    we deliver your product at ${deliveryAddress.address}
                    track your order with this orderId : ${orderPlaced._id}
              `
          }
          // payment message send through mail
          const paymentMessage1={
              from:process.env.SMTP_USER,
              to:deliveryAddress.email,
              subject:"Payment Confirmation Message from PizzaHut",
              text:`Mr. ${req.user.name.split(" ")[1]} your payment is successfull
                you  paid ${cartProductAmount} rs. using ${charge.payment_method_details.card.brand} card
                track your order with this orderId : ${orderPlaced._id} `
          }
          mailTransporter.sendMail(orderMessage1,(err,info)=>{
            if(err){
              console.log("error ",err)

            }
          })
          mailTransporter.sendMail(paymentMessage1,(err,info)=>{
            if(err){
              console.log("error ",err)

            }
          })
          twilioClient.messages.create({
            body:`Mr. ${req.user.name.split(" ")[1]} your order is placed
                  we will deliver your  product within 2 hours from ordered time
                  we deliver your product at ${deliveryAddress.address}
                  track your order with this orderId : ${orderPlaced._id}
            `,
            from:process.env.TWILIO_PHONE_NUMBER,
            to:userPhone
          }).then((message)=>{
            console.log("message send")
          }).catch(err=>{
            console.log("message err",err)
          })
          twilioClient.messages.create({
            body:`Mr. ${req.user.name.split(" ")[1]} your payment is successfull
              you  paid ${cartProductAmount} rs. using ${charge.payment_method_details.card.brand} card
              track your order with this orderId : ${orderPlaced._id} `,
            from:process.env.TWILIO_PHONE_NUMBER,
            to:userPhone
          }).then((message)=>{
            console.log("message send")
          }).catch(err=>{
            console.log("message err",err)
          })


           return res.status(201).
          json({status:true,msg:"successfull",orderPlaced})
        }
        case 2:{
          const {cartItems,cartProductAmount,
              deliveryAddress,paymentOption
          }=req.body.orderData
            let userPhone=`+91${deliveryAddress.phone}`

          const newOrder=new Order({
            customerId:req.user._id,
            name:deliveryAddress.name,
            product:cartItems,
            orderPrice:cartProductAmount,
            pin:deliveryAddress.pincode,
            phone:userPhone,
            email:deliveryAddress.email,
            address:deliveryAddress.address,
            locality:deliveryAddress.locality,
            city:deliveryAddress.city,
            paymentType:paymentOption,
          })
          const orderPlaced=await newOrder.save()
          const cartProduct=await Cart.findOneAndDelete({user:req.user._id})

          const orderMessage2={
              from:process.env.SMTP_USER,
              to:deliveryAddress.email,
              subject:"Order Confirmation Message from PizzaHut",
              text:`Mr. ${req.user.name.split(" ")[1]} your order is placed
                    we will deliver your  product within 2 hours from ordered time
                    we deliver your product at ${deliveryAddress.address}
                    we collect product Amount (with GST) ${cartProductAmount}
                    at the time of delivery
                    track your order with this orderId : ${orderPlaced._id}
              `
          }
          const paymentMessage2={
              from:process.env.SMTP_USER,
              to:deliveryAddress.email,
              subject:"Cash on Delivery Message from PizzaHut",
              text:`Mr. ${req.user.name.split(" ")[1]} please keep the amount ${cartProductAmount},
                we collect the price at the time of delivery,
                track your order with this orderId : ${orderPlaced._id} `
          }
          mailTransporter.sendMail(orderMessage2,(err,info)=>{
            if(err){
              console.log("error ",err)

            }
          })
          mailTransporter.sendMail(paymentMessage2,(err,info)=>{
            if(err){
              console.log("error ",err)

            }
          })
          twilioClient.messages.create({
            body:`Mr. ${req.user.name.split(" ")[1]} your order is placed
                  we will deliver your  product within 2 hours from ordered time
                  we deliver your product at ${deliveryAddress.address}
                  we collect product Amount (with GST) ${cartProductAmount}
                  at the time of delivery
                  track your order with this orderId : ${orderPlaced._id}
            `,
            from:process.env.TWILIO_PHONE_NUMBER,
            to:userPhone
          }).then((message)=>{
            console.log("message send")
          }).catch(err=>{
            console.log("message err",err)
          })
          twilioClient.messages.create({
            body:`Mr. ${req.user.name.split(" ")[1]} please keep the amount ${cartProductAmount},
              we collect the price at the time of delivery,
              track your order with this orderId : ${orderPlaced._id}
            `,
            from:process.env.TWILIO_PHONE_NUMBER,
            to:userPhone
          }).then((message)=>{
            console.log("message send")
          }).catch(err=>{
            console.log("message err",err)
          })

           return res.status(201).
          json({status:true,msg:"successfull",orderPlaced})

        }
      }
    }catch(err){
      console.log(`error `,err)
      return res.status(201).
     json({status:false})
    }
  },
  }
}
module.exports=orderCtrl
