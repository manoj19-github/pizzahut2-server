const mongoose=require("mongoose")
const productSchema=mongoose.Schema({
  name:{
      type:String,
      required:true,
      trim:true,

  },
  image:{
    type:String,
    default:"https://res.cloudinary.com/santra-devshow/image/upload/v1642601052/pizzahut2/qbxwlodaizmfrwzjb7o3.jpg",
    trim:true,
  },
  base_price:{
    type:Number,
    required:true
  },
  details:{
    type:String,

  },
  sizes:[
    {
      size:[String],
      price:Number
    }
  ],
  ingridients:[
    {
      text:{type:String},
      price:{type:Number}
    }
  ]
},{timestamps:true})
const Product=mongoose.model("Product",productSchema)
module.exports=Product
