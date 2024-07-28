import Cart from '../models/cart_model.js'
import Store from '../models/store_model.js'
import Product from '../models/product_model.js'
import User from '../models/user_model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'


export const updateCart = async (req, res, next) => {
    const { user, store, products, type } = req.body;

    try {
        let userCart = await Cart.findOne({ user, store });

        if (!userCart) {
            userCart = new Cart({ user, store, products: [] });
        }

        const productIndex = userCart.products.findIndex(pro => pro.product.toString() === products.product.toString());

        if (productIndex === -1) {
            userCart.products.push(products);
        } else {
            if (type === 'add') {
                userCart.products[productIndex].quantityInCart += 1;
            } else if (type === 'remove') {
                userCart.products[productIndex].quantityInCart -= 1;
            }
        }

        await userCart.save();

        return res.status(200).json({ message: "User's cart has been updated" });
    } catch (err) {
        next(err);
    }
};


export const previousQty = async (req, res, next) => {
    const { user, store, product } = req.body;

    try {
        const userCart = await Cart.findOne({ user, store });

        if (!userCart) {
            return res.status(200).json({ qty: 0 });
        }

        const productIndex = userCart.products.findIndex(pro => pro.product.toString() === product.toString());
        if (productIndex === -1) {
            return res.status(200).json({ qty: 0 });
        }

        return res.status(200).json({ qty: userCart.products[productIndex].quantityInCart });
    } catch (err) {
        next(err);
    }
};

export const deleteCartProduct = async (req, res, next) => {
    const { user, store, product } = req.body;

    try {
        const userCart = await Cart.findOne({ user, store });

        const productIndex = userCart.products.findIndex(pro => pro.product.toString() === product.toString());

        if (productIndex !== -1) {
            userCart.products.splice(productIndex, 1);
            await userCart.save();
        }

        res.status(200).json({ message: 'Product deleted from cart!' });
    } catch (err) {
        next(err);  
    }
};

// export const cartsInzip = async (req, res, next) => {
//     const { zipcode, user } = req.body;

//     try {
//         const allCarts = await Cart.find({ user });
//         const allCartsStorePro = allCarts.map(async (cart)=>{ 
//             const store = await Store.findOne({ _id: cart.store });
//             const products = await Promise.all (cart.products.map(async (product)=>{
//                 const item = await Product.findOne({ _id : product.product})
//                 return {
//                     ...item._doc,
//                     ...product._doc
//                 }
//             }))
            
//             return {
//                 ...store._doc, 
//                 ... cart._doc,
//                 products : products,
//                 productCount: cart.products.length
//             };
//         } )

//         const allCartsStore = await Promise.all(allCartsStorePro);
//         const cartStoresInArea = allCartsStore.filter(store=> store.zipcode === zipcode)

//         res.status(200).json({ message: 'success' , cartStoresInArea});
//     } catch (err) {
//         next(err);
//     }
// };

export const cartsInzip = async (req, res, next) => {
    const { zipcode, user } = req.body;
  
    try {
      const allCarts = await Cart.find({ user });
      const allCartsStorePro = allCarts.map(async (cart) => {
        const store = await Store.findOne({ _id: cart.store });
        if (!store) {
          throw new Error(`Store with id ${cart.store} not found`);
        }
  
        const products = await Promise.all(cart.products.map(async (product) => {
          const item = await Product.findOne({ _id: product.product });
          if (!item) {
            throw new Error(`Product with id ${product.product} not found`);
          }
  
          return {
            ...item._doc,
            ...product._doc
          };
        }));
  
        return {
          ...store._doc,
          ...cart._doc,
          products: products,
          productCount: cart.products.length
        };
      });
  
      const allCartsStore = await Promise.all(allCartsStorePro);
      const cartStoresInArea = allCartsStore.filter(store => store.zipcode === zipcode);
  
      res.status(200).json({ message: 'success', cartStoresInArea });
    } catch (err) {
      next(err);
    }
  };
  

export const getStore = async (req, res, next) => {
    const { storeId } = req.body;

    try{
        const stores = await Store.find({_id : storeId})
        const store = stores[0]
        res.status(200).json({mesaage: 'store fetched succesfully', store})
    }
    catch(err){
        next(err)
    }
};

export const userData = async (req, res, next) => {
    const { user } = req.body;

    try{
        const userData = await User.findOne({_id : user})
        res.status(200).json({mesaage: 'user fetched succesfully', userData})
    }
    catch(err){
        next(err)
    }
};

export const updateAccount = async (req, res, next) => {
    const { user, field, value, currentPassword, newPassword } = req.body;

    try{
        
        if(field === 'password'){
            const validUser = await User.findOne({_id: user}) 
            const validPassword = bcryptjs.compareSync(currentPassword, validUser.password)
            if(!validPassword) return next(errorHandler(401, "Current password does't match!"))
            const hasedPass = bcryptjs.hashSync(newPassword, 10)
            await User.updateOne({_id: user}, {$set:{[field]: hasedPass}})
            res.status(200).json({mesaage: 'user updated succesfully'})
        }
        else{
            await User.updateOne({_id: user}, {$set:{[field]: value}})
            res.status(200).json({mesaage: 'user updated succesfully'})
        }
       
    }
    catch(err){
        next(err)
    }
};