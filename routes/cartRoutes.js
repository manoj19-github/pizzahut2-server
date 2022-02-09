const Router=require("express").Router()
const cartCtrl=require("../app/http/controller/cartCtrl")
const isLoggedIn=require("../app/http/middleware/isLoggedIn")
const passport=require("passport")

Router.post("/add",passport.authenticate("jwt",{session:false}),isLoggedIn,cartCtrl().addProduct)
Router.post("/del",passport.authenticate("jwt",{session:false}),isLoggedIn,cartCtrl().deleteCart)
Router.post("/edit",passport.authenticate("jwt",{session:false}),isLoggedIn,cartCtrl().editQty)
Router.get("/",passport.authenticate("jwt",{session:false}),isLoggedIn,cartCtrl().getCartProduct)
module.exports=Router
