const Router=require("express").Router()
const isLoggedin=require("../app/http/middleware/isLoggedIn")
const getProductCtrl=require("../app/http/controller/productCtrl")
Router.get("/products",getProductCtrl().getProducts)
Router.get("/product",getProductCtrl().getProduct)
module.exports=Router
