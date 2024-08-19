import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
        
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
     
  }, { timeseries: true } );
  

  const Cart = mongoose.model('Cart', cartSchema);
  export default Cart;




  // do not place order if user not updated address and password