const Router=require("express").Router()
const getSlideCtrl=require("../app/http/controller/getSlideCtrl")
Router.get("/slides",getSlideCtrl)
module.exports=Router
