const Router=require("express").Router()
const isAdmin=require("../../app/http/middleware/isAdmin")
const multer=require("multer")
const storage=multer.diskStorage({})
const uploads=multer({storage})
const passport=require("passport")
const dashboardLabelCtrl=require("../../app/http/controller/admin/dashboardLabelCtrl")
Router.get("/dashboard/label",dashboardLabelCtrl().labelData)
Router.get("/dashboard/lastFive",dashboardLabelCtrl().lastFiveOrder)
Router.get("/dashboard/customers",dashboardLabelCtrl().getCustomers)
Router.get("/dashboard/products",dashboardLabelCtrl().getProducts)
Router.get("/dashboard/orders",dashboardLabelCtrl().getOrders)
Router.post("/dashboard/addSlide",passport.authenticate("jwt",{session:false}),isAdmin,uploads.single("slide"),dashboardLabelCtrl().setSlide)
Router.post("/dashboard/delSlide",passport.authenticate("jwt",{session:false}),isAdmin,dashboardLabelCtrl().delSlide)
Router.post("/order/statusChange",passport.authenticate("jwt",{session:false}),isAdmin,dashboardLabelCtrl().orderStatusChange)


module.exports=Router
