import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    razorpay_order_id: {
        type: String,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: true
    },
    razorpay_signature: {
        type: String, 
        require: true
    }

}, { timestamps: true } );

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;