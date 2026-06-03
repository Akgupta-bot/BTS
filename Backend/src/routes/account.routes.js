const express=require("express")
const authMiddleWare=require("../middleware/auth.middleware")
const accountController=require("../controller/account.controller")

const router=express.Router()

router.post("/",authMiddleWare.authMiddleWare,accountController.createAccountController)
router.get("/",authMiddleWare.authMiddleWare,accountController.getUserAccountsController)
router.get("/balance/:accountId",authMiddleWare.authMiddleWare,accountController.getAccountBalanceController)
module.exports=router