import express from 'express';
import { verifyToken } from '../Middlewares/middlewares.js';
import {Login, signup,addToCart, removeCartProduct } from '../Controllers/controllers.js';

const router = express.Router();

router.post('/add', signup);
router.post('/login',Login);
router.post('/addTocart',addToCart)
router.post('/removeProduct',removeCartProduct)

export default router;
