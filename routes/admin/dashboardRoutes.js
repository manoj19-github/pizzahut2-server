const Router=require("express").Router()
const isAdmin=require("../../app/http/middleware/isAdmin")
const dashboardLabelCtrl=require("../../app/http/controller/admin/dashboardLabelCtrl")
Router.get("/dashboard/label",dashboardLabelCtrl().labelData)
Router.get("/dashboard/lastFive",dashboardLabelCtrl().lastFiveOrder)
Router.get("/dashboard/customers",dashboardLabelCtrl().getCustomers)
Router.get("/dashboard/products",dashboardLabelCtrl().getProducts)
Router.get("/dashboard/orders",dashboardLabelCtrl().getOrders)

module.exports=Router
