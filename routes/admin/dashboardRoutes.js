const Router=require("express").Router()
const isAdmin=require("../../app/http/middleware/isAdmin")
const multer=require("multer")
const storage=multer.diskStorage({})
const uploads=multer({storage})
const passport=require("passport")
const dashboardLabelCtrl=require("../../app/http/controller/admin/dashboardLabelCtrl")
Router.get("/dashboard/label",passport.authenticate("jwt",{session:false}),isAdmin,dashboardLabelCtrl().labelData)
Router.get("/dashboard/lastFive",passport.authenticate("jwt",{session:false}),isAdmin,dashboardLabelCtrl().lastFiveOrder)
Router.get("/dashboard/customers",passport.authenticate("jwt",{session:false}),isAdmin,dashboardLabelCtrl().getCustomers)
Router.get("/dashboard/products",passport.authenticate("jwt",{session:false}),isAdmin,dashboardLabelCtrl().getProducts)
Router.get("/dashboard/orders",passport.authenticate("jwt",{session:false}),isAdmin,dashboardLabelCtrl().getOrders)
Router.post("/dashboard/addSlide",passport.authenticate("jwt",{session:false}),isAdmin,uploads.single("slide"),dashboardLabelCtrl().setSlide)
Router.post("/dashboard/delSlide",passport.authenticate("jwt",{session:false}),isAdmin,dashboardLabelCtrl().delSlide)
Router.post("/order/statusChange",passport.authenticate("jwt",{session:false}),isAdmin,dashboardLabelCtrl().orderStatusChange)


module.exports=Router
