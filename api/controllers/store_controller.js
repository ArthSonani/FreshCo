import Vendor from '../models/vendor_model.js'
import Product from '../models/product_model.js'
import { errorHandler } from '../utils/error.js'


export const nearStore = async (req, res, next) => {

    const { zipCode, filter } = req.body;

    try{
        let storeData = null;
        if(filter === 'all-stores'){
            console.log('all')
            storeData = await Vendor.find({zipcode: zipCode})
        }
        else{
            console.log('other')
            storeData = await Vendor.find({zipcode: zipCode, categories: { $in: [filter] }})
        }
        console.log(storeData)
        res.status(200).json({mesaage: 'data fetched succesfully!', storeData})
    }
    catch(err){
        next(err);
    }
};

export const storeProducts = async (req, res, next) => {
    const { storeId } = req.body;

    try{
        const products = await Product.find({vendorId : storeId})
        const store = await Vendor.find({_id : storeId}, {businessName : 1})
        const storeName = store[0].businessName
        res.status(200).json({mesaage: `products of ${storeName}`, products, storeName})
    }
    catch(err){
        next(err)
    }
};