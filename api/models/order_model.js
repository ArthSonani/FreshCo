import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
        
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    products: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        quantityInCart: { 
            type: Number, 
            required: true 
        }
    }],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
     
}, { timeseries: true } );
  

const Order = mongoose.model('Order', orderSchema);
export default Order;
