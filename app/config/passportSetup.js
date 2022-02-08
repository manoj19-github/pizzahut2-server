const passport=require("passport")
const LocalStrategy=require("passport-local").Strategy;
const GoogleStrategy=require("passport-google-oauth20").Strategy
const User=require("../models/userModel")

passport.use(new LocalStrategy({usernameField:"email"},async(email,password,done)=>{
  try{
    const user=await User.findOne({email})
    if(!user) return done(null,false)
    if(user.authenticate(password)){
      done(null,user)
    }else{
      done(null,false)
    }
  }catch(err){
    done(err,false)
  }
}))

passport.use(new GoogleStrategy({
  callbackURL:process.env.GOOGLE_CALLBACK_URL,
  clientID:process.env.CLIENT_ID,
  clientSecret:process.env.CLIENT_SECRET
},async(req,accessToken,refreshToken,profile,done)=>{
  try{

    const user=await User.findOne({googleId:profile.id})
    if(user){
      console.log("google user",user)
      return done(null,user)
    }else{
      const newUser=await User.create({
        name:`${profile.name.givenName} ${profile.name.familyName}`,
        email:`${profile.emails[0].value}`,
        password:`${profile.id}`,
        googleId:profile.id,
      })
      return done(null,newUser)
    }
  }catch(err){
    done(err,null)
  }
}))


passport.serializeUser((user,done)=>{
  return done(null,user.id)
})

passport.deserializeUser(async(id,done)=>{
  try{
    const userExists=await User.findById(id)
    done(null,userExists)
  }catch(err){
    done(err,null)
  }
})
