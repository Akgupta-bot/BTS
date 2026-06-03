const transactionModel=require("../models/transaction.model")
const ledgerModel=require("../models/ledger.model")
const accountModel=require("../models/account.model")
const emailService=require("../services/email.services")
const mongoose=require("mongoose")


async function createTransaction(req,res){
    const {fromAccount,toAccount,amount,idempotencyKey}=req.body
    if(!fromAccount||!toAccount||!amount||!idempotencyKey){
       return res.status(400).json({
            message:"fromAccount,toAccount,amount,idempotencyKey are required"
        })
    }
    const fromUserAccount=await accountModel.findOne({
        _id:fromAccount,
    })

    const toUserAccount=await accountModel.findOne({
        _id:toAccount,
    })
    if(!fromUserAccount||!toUserAccount){
        res.status(400),json({
            message:"Invalid fromAccount or toAccount"
        })
    }
    /**
     * 2.Validate idempotency Key
     */
    const isTransactionAlreadyExists =await transactionModel.findOne({
        idempotencyKey:idempotencykey
    })
    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status==="COMPLETED"){
            return res.status(200).json({
            message:"Trancsation already processed",
            transaction:isTransactionAlreadyExists
            })
        }
         if(isTransactionAlreadyExists.status==="PENDING"){
            return res.status(200).json({
            message:"Trancsation is still processing"
            })
        }
        if(isTransactionAlreadyExists.status==="FAILED"){
            return res.status(500).json({
            message:"Trancsation processing failed, Please retry"
            })
        }
         if(isTransactionAlreadyExists.status==="FAILED"){
            return res.status(500).json({
            message:"Trancsation was reversed, Please retry"
            })
        }
    }
    /**
     * check account Status
     */

    if(fromUserAccount.status!=="ACTIVE"||toUserAccount.status!=="ACTIVE"){
        return res.status(400)({
            message:"Both fromAccount and toAccount must be active to process the transaction"
        })
    }

    const balance =await fromUserAccount.getBalance()
    if(balance<amount){
        return res.status(400).json({
            message:`Insufficient balance. Current balance is ${balance}.Requested amount is ${amount}`
        })
    }

    /**
     * Create transaction pending
     */
    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction =await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"pending"
    },{
        session
    })
    const debitLedgerEntry = await ledgerModel.create({
        account :fromAccount,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    },{
        session
    
    })
     const creditLedgerEntry = await ledgerModel.create({
        account :toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    },{
        session
    
    })
    transaction.status="COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    /**
     * send email notification
     * 
     */

     await emailServices.sendTransactionEmail(req.user.email, req.user.name,amount,toAccount)
     return res.status(201).json({
        message:"Transaction completed successfully",
        transaction:transaction
     })

    

}

async function createInitialFundsTransaction(req,res){
    const {toAccount,amount,idempotencyKey}=req.body
    if(!toAccount||!amount||!idempotencyKey){
        message:"toAccount,amount,idempotencyKey are required"

    }
    const toUserAccount=await accountModel.findOne({
        _id:toAccount,
    })
    if(!toUserAccount){
        return res.status(400).json({
            message:"Invalid toAccount"
        })

    }
    const fromUserAccount = await accountModel.findOne({
        userId:req.user._id
    })
    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user account not found"
        })
    }
     const session = await mongoose.startSession()
    session.startTransaction()

    const transaction =new transactionModel({
        fromAccount:fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"pending"
    })
    const debitLedgerEntry = await ledgerModel.create([{
        account :fromUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    }],{
        session
    
    })
     const creditLedgerEntry = await ledgerModel.create([{
        account :toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    }],{
        session
    
    })
    transaction.status="COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message:"Transaction completed successfully",
        transaction:transaction
     })
}

module.exports={createTransaction,createInitialFundsTransaction}
