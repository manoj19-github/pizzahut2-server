require("dotenv").config()
const express=require("express")
const mongoose=require("mongoose")
const passport=require("passport")
const connDB=require("./app/config/dbConn")
const MongoStore=require("connect-mongo")





const session=require("express-session")
const helmet=require("helmet")
const morgan=require("morgan")
const cors=require("cors")
const bodyParser=require("body-parser")
const app=express()
const cloudinaryConfig=require("./app/config/cloudinary")
// routers
const authRoutes=require("./routes/authRoutes")
const adminProductRoutes=require("./routes/admin/productRoutes")
const cartRoutes=require("./routes/cartRoutes")
const orderRoutes=require("./routes/orderRoutes")
const productRoutes=require("./routes/productRoutes")
const dashboardRoutes=require("./routes/admin/dashboardRoutes")

// middlewares

app.use(
  session({
    secret:process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    key:"User_id",
    store:MongoStore.create({
      mongoUrl:process.env.DB_URL,
      autoRemove:"interval",
      autoRemoveInterval:20,
      collectionName:"mysession"
    }),
    cookie:{maxAge:1000*60*60},
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(
  cors({
    origin:process.env.CLIENT_SERVER,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(morgan("dev"))
app.use(helmet())
require("./app/config/passportSetup")
app.use("/api/auth",authRoutes)
app.use("/api/admin",adminProductRoutes)
app.use("/api/admin",dashboardRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api",productRoutes)
app.use("/api",orderRoutes)







// cludinary setup
cloudinaryConfig()

// SERVER LISTENING
const PORT=process.env.PORT||4000
const server=app.listen(PORT,async()=>{
  // DATABASE CONNECTION
  await connDB()
  console.log(`server is running on port ${process.env.PORT}`)
})
