import Store from '../models/store_model.js'
import Order from '../models/order_model.js'
import Product from '../models/product_model.js'
import User from '../models/user_model.js'
import { errorHandler } from '../utils/error.js'

import bcryptjs from 'bcryptjs'


export const nearStore = async (req, res, next) => {

    const { zipCode, filter, search } = req.body;

    try{
        let storeData = null;
        const searchTerm = search === null ? '' : search
        if(filter === 'all-stores'){
            storeData = await Store.find({zipcode: zipCode, businessName: { $regex: searchTerm, $options : 'i'}})
        }
        else{
            storeData = await Store.find({zipcode: zipCode, categories: { $in: [filter] }, businessName: { $regex: searchTerm, $options : 'i'}})
        }
        res.status(200).json({mesaage: 'data fetched succesfully!', storeData})
    }
    catch(err){
        next(err);
    }
};

export const storeProducts = async (req, res, next) => {
    const { storeId, filter, search } = req.body;

    try{
        const x = filter.split('-');
        let products = null;

        const searchTerm = search === null ? '' : search
        if(filter === 'shop-all'){
            products = await Product.find({storeId, name : { $regex: searchTerm, $options : 'i'}})
        }
        else if(x[x.length - 1] === 'main'){
            products = await Product.find({storeId, mainCategory: filter.replace('-main', ''), name : { $regex: searchTerm, $options : 'i'}})
        }
        else{
            products = await Product.find({storeId, subCategory: filter, name : { $regex: searchTerm, $options : 'i'}})
        }
        
        const stores = await Store.find({_id : storeId})
        const store = stores[0]
        res.status(200).json({mesaage: 'store fetched succesfully', products, store})
    }
    catch(err){
        next(err)
    }
};



export const storeData = async (req, res, next) => {
    const { store } = req.body;

    try {
        const storeData = await Store.findOne({ _id: store })
        res.status(200).json({ mesaage: 'user fetched succesfully', storeData })
    }
    catch (err) {
        next(err)
    }
};

export const updateAccount = async (req, res, next) => {
    const { store, field, value, currentPassword, newPassword } = req.body;

    try {

        if (field === 'password') {
            const validStore = await Store.findOne({ _id: store })
            const validPassword = bcryptjs.compareSync(currentPassword, validStore.password)
            if (!validPassword) return next(errorHandler(401, "Current password does't match!"))
            const hasedPass = bcryptjs.hashSync(newPassword, 10)
            await Store.updateOne({ _id: store }, { $set: { [field]: hasedPass } })

            const storeData = await Store.findOne({ _id: store })
            res.status(200).json({ mesaage: 'store updated succesfully' , storeData})
        }
        else if (field === 'categories') {
            await Store.updateOne({ _id: store }, { $set: { [field]: value } })

            const storeProducts = await Product.find({ storeId: store });
            const productsToRemove = storeProducts.filter(product => !value.includes(product.mainCategory));
            // await Product.deleteMany({ _id: { $in: productsToRemove.map(product => product._id) } });
            
            await Store.updateOne(
                { _id: store },
                { $pull: { products: { $in: productsToRemove.map(product => product._id) } } }
            );

            const storeData = await Store.findOne({ _id: store })
            res.status(200).json({ mesaage: 'store updated succesfully' , storeData})
        }
        else {
            await Store.updateOne({ _id: store }, { $set: { [field]: value } })

            const storeData = await Store.findOne({ _id: store })
            res.status(200).json({ mesaage: 'store updated succesfully' , storeData})
        }

    }
    catch (err) {
        next(err)
    }
};


export const orders = async (req, res, next) => {
    const { store } = req.body;

    try {
        const allOrders = await Order.find({ store }).sort({ createdAt: -1 });

        const allOrdersWithDetails = await Promise.all(
            allOrders.map(async (order) => {
                const user = await User.findById(order.user);
                if (!user) {
                    throw new Error(`User with id ${order.user} not found`);
                }

                const products = await Promise.all(
                    order.products.map(async (orderProduct) => {
                        const product = await Product.findById(orderProduct.product);
                        if (!product) {
                            throw new Error(`Product with id ${orderProduct.product} not found`);
                        }

                        return {
                            ...product._doc,
                            quantityInCart: orderProduct.quantityInCart,
                        };
                    })
                );

                return {
                    ...order._doc,
                    user: user._doc,
                    products: products,
                };
            })
        );

        res.status(200).json({ message: 'success', orders: allOrdersWithDetails });
    } catch (err) {
        next(err);
    }
};


export const orderCount = async (req, res, next) => {
    const { store } = req.body;

    try {

        if(store){
            
        const orderCount = await Order.countDocuments({ store });
            res.status(200).json({ message: 'success', orderCount });
        }
        else{
            res.status(200).json({ message: 'no problem'});
        }

    } catch (err) {
        next(err);
    }
};


export const updateOrderCount = async (req, res, next) => {
    const { store } = req.body;

    try {
        const orderCount = await Order.countDocuments({ store });

        const updatedStore = await Store.findOneAndUpdate(
            { _id: store },
            { $set: { orderCount } },
            { new: true } 
        );

        res.status(200).json({ message: 'success', updatedStore });
    } catch (err) {
        next(err);
    }
};