import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    
    zipcode: {
        type: Number, 
        require: true
    },
    area: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true,
        default: null
    },
    phone: {
        type: Number,
        require: true,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

}, { timestamps: true } );

const User = mongoose.model('User', userSchema);

export default User;