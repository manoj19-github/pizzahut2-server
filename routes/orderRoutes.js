const Router=require("express").Router()
const isLoggedIn=require("../app/http/middleware/isLoggedIn")
const orderCtrl=require("../app/http/controller/orderCtrl")
Router.post("/order",isLoggedIn,orderCtrl().payment)
Router.get("/order",isLoggedIn,orderCtrl().getOrders)
Router.get("/order/:productId",isLoggedIn,orderCtrl().getOrder)





module.exports=Router
