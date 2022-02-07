const Router=require("express").Router()
const isAdmin=require("../../app/http/middleware/isAdmin")
const multer=require("multer")
const storage=multer.diskStorage({})
const uploads=multer({storage})
const dashboardLabelCtrl=require("../../app/http/controller/admin/dashboardLabelCtrl")
Router.get("/dashboard/label",isAdmin,dashboardLabelCtrl().labelData)
Router.get("/dashboard/lastFive",isAdmin,dashboardLabelCtrl().lastFiveOrder)
Router.get("/dashboard/customers",isAdmin,dashboardLabelCtrl().getCustomers)
Router.get("/dashboard/products",isAdmin,dashboardLabelCtrl().getProducts)
Router.get("/dashboard/orders",dashboardLabelCtrl().getOrders)
Router.post("/dashboard/addSlide",uploads.single("slide"),dashboardLabelCtrl().setSlide)
Router.post("/dashboard/delSlide",dashboardLabelCtrl().delSlide)


module.exports=Router
