import express from 'express';
import { verifyToken } from '../Middlewares/middlewares.js';
import {Login, signup,addToCart, removeCartProduct, addProducts,updateDetails,logout,getProducts, ValidateOtp } from '../Controllers/controllers.js';
import { upload } from '../Middlewares/multer.middleware.js'; 
const router = express.Router();

router.post('/add', signup);
router.post("/ValidateOtp",ValidateOtp)
router.post('/login',Login);
router.get('/getProducts',getProducts);
router.post('/addTocart',addToCart)
router.post('/removeProduct',removeCartProduct)
router.post('/addtoDb',upload.fields([
    {name:"avatar",maxCount:1},
    {name:"coverImage",maxCount:1}
]),addProducts)
router.post("/logout",logout)
router.post('/updateDetails',updateDetails)

export default router;
