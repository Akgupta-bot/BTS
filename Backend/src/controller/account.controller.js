    const accountModel=require("../models/account.model")
    async function createAccountController(req,res){
    const user = req.user
    const account = await accountModel.create({
        userId:user._id
    })
    res.status(201).json({
        account
    })
    }

    async function getUserAccountsController(req,res){
        const accounts = await accountModel.find({
            userId:req.user._id
        })
        res.status(200).json({
            accounts
        })

    }
    async function getAccountBalanceController(req,res){
        const {accountId}=req.params;
        const account =await accountModel.findOne({
             _id:accountId,
             userId:req.user._id
        })
        if(!account){
            return res.status(404).json({
                message:'Account not found'
            })
        }
        const balance = await account.getBalance();

    return res.status(200).json({
        accountId,
        balance
    });
    }
    module.exports={createAccountController,getUserAccountsController,getAccountBalanceController}