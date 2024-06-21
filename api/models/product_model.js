import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    vendorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Vendor', 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    quantity: { 
        type: Number,  
        default: 0 
    },
    image: { 
        type: String,
        require: true 
    }
   
  }, { timeseries: true } );
  

  const Product = mongoose.model('Product', productSchema);
  export default Product;

