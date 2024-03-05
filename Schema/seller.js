import mongoose from "mongoose";

const sellerSchema= new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true,
    },
    brand:{
        type:String,
        required:true
    },
    productId:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
})

const seller = mongoose.model("seller",sellerSchema)
export default seller