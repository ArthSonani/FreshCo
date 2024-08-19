import Payment from '../models/payment_model.js';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { randomBytes } from 'crypto';
import { errorHandler } from '../utils/error.js'
import crypto from 'crypto'
dotenv.config()

const razorpayInstance = new Razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_SECRETE_KEY
})

export const order = async (req, res, next) => {

    const { amount } = req.body;

    const amountInPaise = Number(Math.round(Number(amount) * 100));

    if (!Number.isInteger(amountInPaise) || amountInPaise < 100) {
        return res.status(400).json({ message: "Invalid amount." });
    }

    try {
        const options = {
            amount : amountInPaise,
            currency : "INR",
            receipt : randomBytes(10).toString('hex')
        }

        razorpayInstance.orders.create(options, (error, order) => {
            if(error){
                return res.status(500).json({message: error})
            }
            res.status(200).json({ order })
        })

    } 
    catch (err) {
        console.log(err)
        next(err);
    }
    
};


export const verify = async (req, res, next) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECRETE_KEY)
        .update(sign.toString())
        .digest("hex");

        const isAuthentic = expectedSign === razorpay_signature;

        if(isAuthentic){
            const payment = new Payment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            })

            await payment.save()

            res.status(200).json({message : "Payment Successfully"})
        }

    } 
    catch (err) {
        next(err);
    }
    
};