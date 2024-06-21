import Product from '../models/product_model.js'
import Vendor from '../models/vendor_model.js';
import { errorHandler } from '../utils/error.js'

export const add = async (req, res, next) => {

    const { name, image, price, quantity, category, description, vendorId } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'name fields are required' });
    }
    if (!price) {
        return res.status(400).json({ message: 'price fields are required' });
    }

    if (!quantity) {
        return res.status(400).json({ message: 'quantity fields are required' });
    }

    if (!category) {
        return res.status(400).json({ message: 'category fields are required' });
    }

    if (!description) {
        return res.status(400).json({ message: 'description fields are required' });
    }

    if (!image) {
        return res.status(400).json({ message: 'image fields are required' });
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