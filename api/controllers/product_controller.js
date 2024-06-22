import Product from '../models/product_model.js'
import Vendor from '../models/vendor_model.js';
import { errorHandler } from '../utils/error.js'

export const add = async (req, res, next) => {

    const { name, image, price, quantity, category, description, vendorId } = req.body;

    if (!name || !image || !price || !quantity || !category || !description) {
        return res.status(400).json({ message: 'name fields are required' });
    }

    const newProduct = new Product({ name, image, price, quantity, category, description, vendorId });
    const productId = newProduct._id;

    try {
        await newProduct.save();
        await Vendor.findByIdAndUpdate(
                vendorId,
                { $push: { products: productId } },
                { new: true, useFindAndModify: false }
            )
        res.status(201).json({ message: 'New Product Created', product: newProduct });   
    } 
    catch (err) {
        next(err);
    }
};

export const getData = async (req, res, next) => {
    const { vendorId } = req.body;

    try{
        const vendor = await Vendor.findOne({ _id: vendorId })
        const vendorProductIds = vendor.products
        const vendorProducts = await Product.find({_id : { $in: vendorProductIds}})
        res.status(200).json({message: "succsesfully fetched products!" , vendorProducts})
    }
    catch(err){
        next(err)
    }
}

export const update = async (req, res, next) => {
    const { price, quantity, productId } = req.body;

    try{
        await Product.updateOne({_id: productId}, {$set:{price: price, quantity: quantity}})
        res.status(200).json({message: "Product Updated succsesfully!"})
    }
    catch(err){
        next(err)
    }
}

export const remove = async (req, res, next) => {
    const { productId } = req.body;

    try{
        await Product.deleteOne({_id: productId})
        res.status(200).json({message: "Product Deleted succsesfully!"})
    }
    catch(err){
        next(err)
    }
}