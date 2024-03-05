import mongoose from "mongoose";

const cartSchema= new mongoose.Schema({
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

const cart = mongoose.model("Cart",cartSchema)
export default cart