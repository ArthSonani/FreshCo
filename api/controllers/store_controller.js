import Store from '../models/store_model.js'
import Product from '../models/product_model.js'
import { errorHandler } from '../utils/error.js'


export const nearStore = async (req, res, next) => {

    const { zipCode, filter, search } = req.body;

    try{
        let storeData = null;
        if(filter === 'all-stores'){
            const searchTerm = search === null ? '' : search
            storeData = await Store.find({zipcode: zipCode, businessName: { $regex: searchTerm, $options : 'i'}})
        }
        else{
            storeData = await Store.find({zipcode: zipCode, categories: { $in: [filter] }})
        }
        res.status(200).json({mesaage: 'data fetched succesfully!', storeData})
    }
    catch(err){
        next(err);
    }
};

export const storeProducts = async (req, res, next) => {
    const { storeId, filter } = req.body;

    try{
        const x = filter.split('-');
        let products = null;
        if(filter === 'shop-all'){
            products = await Product.find({storeId})
        }
        else if(x[x.length - 1] === 'main'){
            products = await Product.find({storeId, mainCategory: filter.replace('-main', '')})
        }
        else{
            products = await Product.find({storeId, subCategory: filter})
        }
        
        const stores = await Store.find({_id : storeId})
        const store = stores[0]
        res.status(200).json({mesaage: 'store fetched succesfully', products, store})
    }
    catch(err){
        next(err)
    }
};