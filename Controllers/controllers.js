import User from "../Schema/schema.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
import Product from '../Schema/seller.js'
import uploadOnCloudinary from '../utils/cloudinary.js'
// All the important functions up here
const Secret_key= process.env.SECRET_KEY
// For hashing the passwords
const hashPass= async(password)=>{
    return await bcrypt.hash(password,10)
}

const comparePass= async(password,dbPassword)=>{
    return await bcrypt.compare(password,dbPassword);
}
// For sending a mail using nodemailer
const sendMail = async(email,otp)=>{
    const transport = nodemailer.createTransport(
        {
            service:'Gmail',
            auth:{
                user:"aditya22950@gmail.com",
                pass:"qwvuqjhbjtezaoi"
            }
        }
    )
    const mailOptions={
        from:"aditya22950@gmail.com",
        to:email,
        subject:'Welcome to our place',
        text:`Your otp for verification is ${otp}`
    }
    
    try {
       const result= await transport.sendMail(mailOptions)
       console.log('email sent successfully')
       return true

    } catch (error) {
        // res.status(501).send('Something went wrong')
        console.log('email send failed',error)
        return false
    }
}

export const signup= async(req,res)=>{
    console.log(req.body)
    console.log(req.cookies)
    const customUser= req.body;
    const newUser= new User(customUser)
    try {
        const {email,password, name,task}= req.body
        const user = await User.findOne({email})
        if(user){
            res.status(501).json({error:'Email Already exists'})
        }
        else if(email.length<5 ||password.length<6  ||task.length<3){
            res.status(501).json({error:'please enter the correct details'});

        }   
        else{
            const otp = Math.floor(100000 + Math.random() * 900000);
            const expiry = new Date();
            expiry.setMinutes(expiry.getMinutes() + 5);
            const verifiedMail= await sendMail(email,otp)
            if(verifiedMail){
                const hashPassword=await hashPass(password)
                const newUser= new User({name,email,task,password:hashPassword,otp,expiry})
                await newUser.save();
                return res.status(201).json({ success: 'And here we go Buddy!', email });
            }
            else{
                return res.status(401).json({error:'Please try again later'})
            }
        }
      
    } catch (error) {
        res.status(501).json({message:'an error occured'})
        console.log('An error Occured',error)
    }
}

export const updateDetails=async(req,res)=>{
    console.log(req.body)
    const {name,email,password,task}=req.body

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(501).json({error:'User Doesn"nt exist'})
        }
        else{
            if(name) user.name=name;
            if(task) user.task=task;
            if(email) user.email=email;
            if(password){
                const updatedPassword=await hashPass(password);
                user.password=updatedPassword;
            }
            await user.save();
            return res.status(201).json({success:"Updated successfully"})
        }
        
    } catch (error) {
        return res.status(501).send("Error occured")
        // console.log("Something went wrong",error)
    }
}

// For adding products to Db
export const addProducts = async (req, res) => {
    const { quantity, productName, price, brand } = req.body;
    console.log(req.files.avatar[0].path)

    try {
        if (!req.files) {
            return res.status(400).json({error:'No file uploaded'});
        }
        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path
        if(!avatarLocalPath){
           return res.status(404).json({error:'no files found'})
        }
        const avatarResponse= await uploadOnCloudinary(avatarLocalPath)
        const coverImage= await uploadOnCloudinary(coverImageLocalPath)
        console.log(avatarResponse)
        console.log(coverImage)
        
        if(!avatarResponse){
            console.log('an error occured')
            return res.status(500).json({error:"No files found"})
        }
        const newProduct = new Product({
            quantity: quantity,
            productImage: avatarResponse.url,
            coverImage:coverImage?.url || "",
            productName: productName,
            price: price,
            brand: brand
        });

        await newProduct.save();
        return res.status(201).json({success:'Product saved successfully'});
            
        }
     catch (error) {
        console.error('An error occurred', error);
        return res.status(500).send('An error occurred');
    }
};
export const logout= async(req,res)=>{
    // console.log(req.cookies)
    console.log(JSON.stringify(req.cookies));
    try {

        res.clearCookie('token');
        res.status(200).json({success:'Logout successful'});
    } catch (error) {
       res.status(501).send('something went wrong')
    }
}
export const getProducts= async(req,res)=>{
    try {
        const products= await Product.find();
        return res.status(201).json(products)
    } catch (error) {
        console.log('Something went wrong',error)
        return res.status(501).send("An error occured")
    }
}
export const Login=async(req,res)=>{
     console.log(req.body)
     const {email,password}=req.body

     try {
        const user =await User.findOne({email})
        if(!user){
            res.status(501).json({error:'User doesn"t exist'});
        }
        else
       {
        if(!email || email.length<5){
            res.status(501).json({error:'Please enter your email'});
        }
        else if(!password ||password.length<6){
            res.status(501).json({error:'password is incorrect'});
        }
        else{
            const isValid= await comparePass(password,user.password)
            if(!isValid){
                res.status(501).json({error:'Your password is invalid'});
            }
            else{
                const token= jwt.sign({email:email,userId:user._id},Secret_key,{expiresIn:"1d"})
                res.cookie('authToken', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                res.status(201).json({success:'Login successful',token:token,userId:user._id})
            }
        }
       }
     } catch (error) {
        res.status(501).send('something went wrong');
        console.log(error)
     }
}

export const ValidateOtp= async(req,res)=>{
    console.log(req.body);
    const{email,otp}=req.body
    try {
        const user = await User.findOne({email})
        if(!user){
           return res.status(400).json({error:"please try again"});
        }
        else{
            if(otp===user.otp){
                user.isVerified=true;
                await user.save();
                return res.status(201).json({success:"user registered successfully"})
            }
            else if(otp!==user.otp){
                return res.status(400).json({error:"Invalid Otp"})
            }
            else{
                return res.status(500).send("something went wrong please try again later")
            }
        }
    } catch (error) {
        console.log("something went wrong")
    }
}
export const addToCart = async (req, res) => {
    console.log(req.body);
    const { productName, price, brand, email, productId, quantity } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(501).json({error:'Please signup to add products to cart'});
        }

        let product = user.cart.find(item => item.productId.toString() === productId.toString());
        if (product) {
            product.quantity = parseInt(product.quantity) + parseInt(quantity);
            await user.save();
            console.log('Updated quantity:', product.quantity);
            return res.status(201).json({success:`${quantity} product added to the cart`});
        } else {
            const cartProduct = { productName, price, brand, productId, quantity };
            user.cart.push(cartProduct);
            await user.save();
            return res.status(201).json({success:`${quantity} product added to the cart`});
        }
    } catch (error) {
        console.error('An error occurred', error);
        return res.status(500).send('An error occurred');
    }
};

export const removeCartProduct =async(req,res)=>{
    const {productId,email}=req.body
    console.log(req.body)
    try {
        const user =await User.findOne({email})
        if(!user){
            return res.status(501).json({error:'Please signup/login to remove'})
        }
        else {
            user.cart = user.cart.filter(item => item.productId.toString() !== productId.toString());
            await user.save();
            console.log(user.cart);
            return res.status(200).json({success:'Product removed from cart'});
        }        
    } catch (error) {
        return res.status(501).send("An internal server error")
          console.log('Something went wrong',error)
    }
}

