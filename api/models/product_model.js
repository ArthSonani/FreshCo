import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    storeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Store', 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    mainCategory: { 
        type: String, 
        required: true 
    },
    subCategory: {
        type: String,
        require: true
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
        type: String,
        require: true
    },
    inStock: { 
        type: Number,  
        default: 0, 
        require: true
    },
    image: { 
        type: String,
        require: true 
    }
   
  }, { timeseries: true } );
  

  const Product = mongoose.model('Product', productSchema);
  export default Product;

