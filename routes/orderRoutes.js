const Router=require("express").Router()
const isLoggedIn=require("../app/http/middleware/isLoggedIn")
const orderCtrl=require("../app/http/controller/orderCtrl")
const passport=require("passport")

Router.post("/order",passport.authenticate("jwt",{session:false}),isLoggedIn,orderCtrl().payment)
Router.get("/order",passport.authenticate("jwt",{session:false}),isLoggedIn,orderCtrl().getOrders)
Router.get("/order/:productId",passport.authenticate("jwt",{session:false}),isLoggedIn,orderCtrl().getOrder)

module.exports=Router
