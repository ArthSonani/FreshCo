import mongoose from 'mongoose'

const storeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    businessName: { 
        type: String, 
        required: true 
    },
    logo: {
        type: String,
        require: true
    },
    area: {
        type: String,
        require: true
    },
    zipcode: {
        type: Number,
        require: true
    },
    categories: [{
        type: String
    }],
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    products: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    }]

  }, { timestamps: true } );

const Store = mongoose.model('Store', storeSchema);

export default Store;
  