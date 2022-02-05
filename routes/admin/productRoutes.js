const Router=require("express").Router()
const productCtrl=require("../../app/http/controller/admin/ProductCtrl")
const isAdmin=require("../../app/http/middleware/isAdmin")
const multer=require("multer")
const storage=multer.diskStorage({})
const uploads=multer({storage})
Router.post("/product/insert",isAdmin,productCtrl().addOrUpdate)
Router.post("/product/delete",isAdmin,productCtrl().delete)
Router.post("/product/image",isAdmin,uploads.single("image"),productCtrl().editImage)
Router.get("/product/:productId",isAdmin,productCtrl().getProductById),
Router.get("/product",isAdmin,productCtrl().getProducts)
module.exports=Router
