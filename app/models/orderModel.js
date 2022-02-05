const mongoose=require("mongoose")
const validator=require("validator")
const orderSchema=mongoose.Schema({
  customerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  name:{
    type:String,
    required:true,
  },
  product:{
    type:Object,
    required:true
  },
  orderPrice:{
    type:Number,
    required:true
  },
  pin:{
    type:String,
    required:true
  },
  phone:{
    type:String,
    required:true
  },
  email:{
    type:String,
    trim:true,
    validate(val){
      if(!validator.isEmail(val)){
        throw new Errpr("email is not valid")
      }
    }

  },
  address:{
    type:String,
    required:true,
  },
  locality:{
    type:String,
    required:true,
  },
  city:{
    type:String,
    required:true,
  },
  paymentStatus:{
    type:Boolean,
    default:false
  },
  paymentType:{
    type:String,
  },
  paymentDetails:{
    type:Object
  },
  status:{
    type:String,
    default:"order_placed",
  }
},{timestamps:true})
const orderModel=mongoose.model("Order",orderSchema)

module.exports=orderModel
