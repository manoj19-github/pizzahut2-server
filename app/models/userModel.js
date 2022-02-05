const bcrypt=require("bcryptjs")
const mongoose=require("mongoose")
const validator=require("validator")
const userSchema=mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true,
    lowercase:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    validate(val){
      if(!validator.isEmail(val)){
        throw new Errpr("email is not valid")
      }
    },
    trim:true
  },
  password:{
    type:String,
    required:true,
    trim:true
  },
  isAdmin:{
    type:Boolean,
    required:true,
    default:false
  },
  googleId:{
    type:String
  },
  confirmCode:{
    type:String,
    default:"pizzahut"
  }
},{timestamps:true})

userSchema.pre("save",async function(next){
  if(!this.isModified) next()
  this.name=this.name.toLowerCase()
  const salt=await bcrypt.genSalt(10)
  this.password=await bcrypt.hash(this.password,salt)
})

userSchema.methods={
  async authenticate(password){
    return await bcrypt.compare(password,this.password)
  }
}

const User=mongoose.model("User",userSchema)
module.exports=User
