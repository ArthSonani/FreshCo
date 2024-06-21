import mongoose from 'mongoose'

const vendorSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    businessName: { 
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    zipcode: {
        type: Number,
        require: true
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

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
  