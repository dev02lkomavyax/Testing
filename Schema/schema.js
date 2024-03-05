import mongoose from "mongoose";
import productSchema from "./seller.js";
import cart from "./cart.js";
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    task:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
        
    },
    expiry:{
        type:String,
        required:true,
    },
    
    cart: [{ 
        productName: String,
        price: Number,
        brand: String,
        productId: mongoose.Schema.Types.ObjectId,
        quantity: Number
    }]})
const User = mongoose.model('user',schema)
export default User