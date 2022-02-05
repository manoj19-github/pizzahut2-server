const Router=require("express").Router()
const cartCtrl=require("../app/http/controller/cartCtrl")
const isLoggedIn=require("../app/http/middleware/isLoggedIn")

Router.post("/add",isLoggedIn,cartCtrl().addProduct)
Router.post("/del",isLoggedIn,cartCtrl().deleteCart)
Router.post("/edit",isLoggedIn,cartCtrl().editQty)
Router.get("/",isLoggedIn,cartCtrl().getCartProduct)
module.exports=Router
