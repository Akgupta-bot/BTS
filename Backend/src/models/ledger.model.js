const mongoose =require("mongoose")
const ledgerSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Ledger must be associated with an account"],
        intex:true,
        immutable:true,
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a ledger"],
        min:[0,"Ledger amount cannot be nagative"],
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"Ledger must be associated with a transaction"],
        immutable:true,
        index:true
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type can be either CREDIT or DEBIT"
        },
        required:[true,"Type is required for creating a ledger"],
        immutable:true
    }
})

function preventLedgerModification(){
  throw new Error("Ledger entries are immutable and cannot be modified or deleted.")
}
 ledgerSchema.pre("updateOne",preventLedgerModification)
 ledgerSchema.pre("updateMany",preventLedgerModification)
 ledgerSchema.pre("deleteOne",preventLedgerModification)
 ledgerSchema.pre("deleteMany",preventLedgerModification)
 ledgerSchema.pre("findOneAndUpdate",preventLedgerModification)
 ledgerSchema.pre("findOneAndDelete",preventLedgerModification)
 ledgerSchema.pre("remove",preventLedgerModification)
 ledgerSchema.pre("findOneAndReplace",preventLedgerModification)
 ledgerSchema.pre("replaceOne",preventLedgerModification)

 const ledgerModel=mongoose.model("ledger",ledgerSchema)
 module.exports=ledgerModel
 