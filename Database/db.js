import mongoose from "mongoose";
import dotenv from 'dotenv'


dotenv.config();
const MONGO_URL=process.env.MONGO_URL
export const Connection= async()=>{
    // const URL=`mongodb://127.0.0.1:27017/Chatapp`
    try {
       await mongoose.connect(MONGO_URL,{useUnifiedTopoLogy:true,
        useNewUrlParser:true})
        console.log('Database connected successfully')
    } catch (error) {
       console.log('error while connecting to the database',error) 
    }
}
export default Connection