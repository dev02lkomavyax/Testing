import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
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
    quantity:{
        type:Number,
        required:true
    }
})

const Product = mongoose.model("Product",productSchema)
export default Product