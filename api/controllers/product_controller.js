import Product from '../models/product_model.js'
import Store from '../models/store_model.js'
import Cart from '../models/cart_model.js'
import { errorHandler } from '../utils/error.js'

export const add = async (req, res, next) => {

    const { name, image, price, quantity, stock, mainCategory, subCategory, description, storeId } = req.body;

    if (!name || !image || !price || !quantity || !description) {
        return res.status(400).json({ message: 'name fields are required' });
    }

    const newProduct = new Product({ name, image, price, quantity, inStock: stock, subCategory, mainCategory, description, storeId });
    const productId = newProduct._id;

    try {
        await newProduct.save(); 
        await Store.findByIdAndUpdate(
                storeId,
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
    const { storeId, search } = req.body;

    try{
        const searchTerm = search === null ? '' : search

        const store = await Store.findOne({ _id: storeId })
        const storeProductIds = store.products
        const storeProducts = await Product.find({
            _id : { $in: storeProductIds}, 
            name: { $regex: searchTerm, $options: 'i' }
        })
        res.status(200).json({message: "succsesfully fetched products!" , storeProducts})
    }
    catch(err){
        next(err)
    }
}

export const update = async (req, res, next) => {
    const { price, inStock, productId } = req.body;

    try{
        await Product.updateOne({_id: productId}, {$set:{price: price, inStock: inStock}})
        res.status(200).json({message: "Product Updated succsesfully!"})
    }
    catch(err){
        next(err)
    }
}

export const remove = async (req, res, next) => {
    const { productId, storeId } = req.body;

    try{

        await Cart.updateMany(
            { 'products.product': productId },
            { $pull: { products: { product: productId } } }
        );

        await Store.updateOne(
            { _id: storeId },
            { $pull: { products: productId } }
        );

        res.status(200).json({message: "Product Deleted succsesfully!"})
    }
    catch(err){
        next(err)  
    }
}