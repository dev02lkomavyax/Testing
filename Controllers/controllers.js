import User from "../Schema/schema.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
// All the important functions up here
const Secret_key= process.env.SECRET_KEY
// For hashing the passwords
const hashPass= async(password)=>{
    return await bcrypt.hash(password,10)
}
// For comparing the password while login
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
                pass:"qwvuqjhbjteczaoi"
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
            res.status(501).send('Email Already exists')
        }
        else if(email.length<5 ||password.length<6  ||task.length<3){
            res.status(501).send('please enter the correct details');

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
                res.status(201).send('And here we go Buddy!')
            }
            else{
                console.log('Please try again later')
            }
        }
      
    } catch (error) {
        res.status(501).send('an error occured')
        console.log('An error Occured',error)
    }
}

export const Login=async(req,res)=>{
     console.log(req.body)
     const {email,password}=req.body

     try {
        const user =await User.findOne({email})
        if(!user){
            res.status(501).send('User doesn"t exist');
        }
        else
       {
        if(!email || email.length<5){
            res.status(501).send('Please enter your email');
        }
        else if(!password ||password.length<6){
            res.status(501).send('password is incorrect');
        }
        else{
            const isValid= await comparePass(password,user.password)
            if(!isValid){
                res.status(501).send('Your password is invalid');
            }
            else{
                const token= jwt.sign({email:email,userId:user._id},Secret_key,{expiresIn:"1d"})
                res.status(201).send({success:'Login successful',token:token,userId:user._id})
            }
        }
       }
     } catch (error) {
        res.status(501).send('something went wrong');
        console.log(error)
     }
}

export const addToCart = async (req, res) => {
    console.log(req.body);
    const { productName, price, brand, email, productId, quantity } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(501).send('Please signup to add products to cart');
        }

        const product = user.cart.find(item => item.productId === productId);
        if (product) {
            
            product.quantity = parseInt(product.quantity) + parseInt(quantity);
            await user.save();

            console.log('Updated quantity:', product.quantity);
            return res.status(201).send(`${quantity} product added to the cart`);
        } else {
            const cartProduct = { productName, price, brand, productId, quantity };
            user.cart.push(cartProduct);
            await user.save();
            return res.status(201).send(`${quantity} product added to the cart`);
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
            return res.status(501).send('Please signup/login to remove')
        }
        else{
            const product = user.cart.findIndex(item => item.productId === productId);
            if(!product===-1){
               return res.status(404).send('product not found')
            }
            else{
                user.cart= user.cart.filter(item=>item.productId !==productId)
                    await user.save();
                    return res.status(200).send('Product removed from cart');
                
            }
        }
    } catch (error) {
          console.log('Something went wrong',error)
    }
}

// export const updateCart= async(req,res)=>{
//         console.log(req.body)
//         const {productId}
// }