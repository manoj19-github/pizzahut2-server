const Router=require("express").Router()
const productCtrl=require("../../app/http/controller/admin/ProductCtrl")
const isAdmin=require("../../app/http/middleware/isAdmin")
const multer=require("multer")
const storage=multer.diskStorage({})
const uploads=multer({storage})
const passport=require("passport")
Router.post("/product/insert",passport.authenticate("jwt",{session:false}),isAdmin,productCtrl().addOrUpdate)
Router.post("/product/delete",passport.authenticate("jwt",{session:false}),isAdmin,productCtrl().delete)
Router.post("/product/image",passport.authenticate("jwt",{session:false}),isAdmin,uploads.single("image"),productCtrl().editImage)
Router.get("/product/:productId",productCtrl().getProductById),
Router.get("/product",productCtrl().getProducts)
module.exports=Router
