const express =require("express")
const authMiddleWare=require("../middleware/auth.middleware")
const transactionController=require("../controller/transaction.controller")

const Router=express.Router()

Router.post("/",authMiddleWare.authMiddleWare,transactionController.createTransaction)
Router.post("/system/initial-funds",authMiddleWare.authSystemUserMiddleware,transactionController.createInitialFundsTransaction)
module.exports=Router

