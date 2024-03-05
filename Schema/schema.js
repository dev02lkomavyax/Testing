import mongoose from "mongoose";

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
    cart:{type:Array,ref:"seller"},
})
const User = mongoose.model('user',schema)
export default User