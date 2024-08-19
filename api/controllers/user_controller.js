import Cart from '../models/cart_model.js'
import Store from '../models/store_model.js'
import Product from '../models/product_model.js'
import Order from '../models/order_model.js'
import User from '../models/user_model.js'
import bcryptjs from 'bcryptjs'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import { errorHandler } from '../utils/error.js'
dotenv.config()


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

        return res.status(200).json({ message: "User's cart has been updated", userCart});
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

        res.status(200).json({ message: 'Product deleted from cart!', userCart });
    } catch (err) {
        next(err);
    }
};

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
                products: products
            };
        });

        const allCartsStore = await Promise.all(allCartsStorePro);
        const cartStoresInArea = allCartsStore.filter(store => store.zipcode === zipcode);

        res.status(200).json({ message: 'success', cartStoresInArea });
    } catch (err) {
        next(err);
    }
};


export const getActiveCart = async (req, res, next) => {
    const { user, store } = req.body;

    try {
        // Find the active cart for the user and store
        let activeCart = await Cart.findOne({ user, store });
        
        if (!activeCart) {
            return res.status(404).json({ message: 'Active cart not found' });
        }

        // Find the store information
        const storeInfo = await Store.findById(store);
        if (!storeInfo) {
            return res.status(404).json({ message: `Store with id ${store} not found` });
        }

        // Map over the products in the cart to find their detailed information
        const productsInfo = await Promise.all(activeCart.products.map(async (product) => {
            const item = await Product.findById(product.product);
            if (!item) {
                throw new Error(`Product with id ${product.product} not found`);
            }

            return {
                ...item._doc,
                ...product._doc
            };
        }));

        // Attach the store info and products info to the active cart
        activeCart = activeCart.toObject();
        activeCart.store = storeInfo;
        activeCart.products = productsInfo;

        // Respond with the active cart
        res.status(200).json({ message: 'success', activeCart });
    } catch (err) {
        next(err);
    }
};



export const getStore = async (req, res, next) => {
    const { storeId } = req.body;

    try {
        const stores = await Store.find({ _id: storeId })
        const store = stores[0]
        res.status(200).json({ mesaage: 'store fetched succesfully', store })
    }
    catch (err) {
        next(err)
    }
};

export const userData = async (req, res, next) => {
    const { user } = req.body;

    try {
        const userData = await User.findOne({ _id: user })
        res.status(200).json({ mesaage: 'user fetched succesfully', userData })
    }
    catch (err) {
        next(err)
    }
};

export const updateAccount = async (req, res, next) => {
    const { user, field, value, currentPassword, newPassword } = req.body;

    try {
        if (field === 'password') {
            const validUser = await User.findOne({ _id: user });
            const validPassword = bcryptjs.compareSync(currentPassword, validUser.password);
            if (!validPassword) {
                return next(errorHandler(401, "Current password doesn't match!"));
            }
            const hashedPass = bcryptjs.hashSync(newPassword, 10);
            await User.updateOne({ _id: user }, { $set: { [field]: hashedPass } });

            const updatedUser = await User.findOne({ _id: user });
            res.status(200).json({ message: 'User updated successfully', userData: updatedUser });
        } else {
            await User.updateOne({ _id: user }, { $set: { [field]: value } });

            const updatedUser = await User.findOne({ _id: user });
            res.status(200).json({ message: 'User updated successfully', userData: updatedUser });
        }
    } catch (err) {
        next(err);
    }
};


export const checkAvailability = async (req, res, next) => {
    const { user, store } = req.body;

    try {
        
        const cart = await Cart.findOne({ user, store }).populate({
            path: 'products.product',
            model: 'Product',
        });

        const storeData = await Store.findById(cart.store).populate('products');

        for (let cartItem of cart.products) {
            const productInStore = storeData.products.find(p => p._id.equals(cartItem.product._id));

            if (!productInStore || productInStore.inStock < cartItem.quantityInCart) {
                return res.status(400).json({
                    avail: false,
                    message: `${cartItem.product.name} is out of stock.`,
                });
            }
        }

        res.status(200).json({ avail: true, message: 'Checkout successful!' });

    } catch (err) {
        next(err);
    }
};

export const updateInventory = async (req, res, next) => {
    const { user, store } = req.body;

    try {
        // Find the user's cart for the given store
        const cart = await Cart.findOne({ user, store }).populate({
            path: 'products.product',
            model: 'Product',
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
        }

        // Fetch store's inventory (products)
        const storeData = await Store.findById(cart.store).populate('products');

        for (let cartItem of cart.products) {
            const productInStore = storeData.products.find(p => p._id.equals(cartItem.product._id));

            if (productInStore) {
                // Fetch the actual product document to update its stock
                const product = await Product.findById(cartItem.product._id);
                
                if (product) {
                    // Deduct the quantity from the product's stock
                    product.inStock -= cartItem.quantityInCart;

                    // Save the updated product
                    await product.save();
                }
            }
        }

        // Save the updated store's inventory
        await storeData.save();

        res.status(200).json({ message: 'Inventory updated successfully' });

    } catch (err) {
        next(err);
    }
};



export const saveOrder = async (req, res, next) => {
    const { user, store, totalAmount } = req.body;

    try {
        const cart = await Cart.findOne({ user, store });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found!" });
        }

        const newOrder = new Order({
            user,
            store,
            products: cart.products,
            totalAmount
        });

        await newOrder.save();

        const currentUser = await User.findById(user);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        const productsDetails = await Promise.all(cart.products.map(async (orderProduct) => {
            const product = await Product.findById(orderProduct.product);
            if (!product) {
                throw new Error(`Product with id ${orderProduct.product} not found at save order`);
            }

            return {
                name: product.name,
                quantityInCart: orderProduct.quantityInCart,
                price: product.price,
                size: product.quantity,
                imageUrl: product.image
            };
        }));

        cart.products = [];
        await cart.save();

        console.log(productsDetails);

        const productsHtml = productsDetails.map(product => `
            <div style="width: 100%; height: 120px; margin-bottom: 10px; overflow: hidden;">
                <div style="width: 65px; height: 100%; display: table; float: left;">
                    <div style="height: 65px; width: 100%; display: table-cell; vertical-align: middle;">
                        <img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; background-size: contain; background-position: center; background-repeat: no-repeat;">
                    </div>
                </div>
                <div style="width: calc(100% - 85px); height: 100%; display: inline-block; float: left; padding-left: 20px;">
                    <h4 style="font-weight: 500; margin-bottom: 5px; color: black;">${product.name}</h4>
                    <span style="font-size: 13px; color: rgba(0,0,0,0.5); margin: 2px;">Size:&nbsp; ${product.size}</span><br />
                    <span style="font-size: 13px; color: rgba(0,0,0,0.5); margin: 2px;">Qty:&nbsp; ${product.quantityInCart}</span><br/>
                    <span style="font-size: 13px; color: rgba(0,0,0,0.5); margin: 2px;">Amt:&nbsp; ₹&nbsp;${product.price * product.quantityInCart}</span>
                </div>
            </div>
        `).join('');
        

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.COMPANY_MAIL,
                pass: process.env.MAIL_APP_PASSWORD
            }
        });

        const mailOptions = {
            from: {
                name: "FRESHCO",
                address: process.env.COMPANY_MAIL
            },
            to: currentUser.email,
            subject: 'New Order Placed',
            html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>

                    <body style="font-family: 'Montserrat', sans-serif; font-optical-sizing: auto; font-style: normal; margin: 0; padding: 0; background-color: white; color: black;">
                        <div style="width: 100%; height: auto; background-color: white; padding: 10px;">
                            <div style="width: 350px; height: 250px; margin: 0 auto; margin-top: 20px;">
                                <img src="https://firebasestorage.googleapis.com/v0/b/grocerblink.appspot.com/o/order_confirm.jpg?alt=media&token=7f83389c-da07-4a30-b366-bb71e05e7179" alt="Order Confirmation" style="height: 100%; width: 100%; background-position: center; background-size: contain; background-repeat: no-repeat;">
                            </div>
                            <p style="width: 80%; text-align: center; font-size: 13px; margin: 0 auto; margin-bottom: 20px; margin-top: 20px; color: rgba(0,0,0,0.5);">Hi, we are happy to inform you that your order has been confirmed. We will ship your order in the next 24-48 hours. Meanwhile, you can visit My Orders section to get further updates on your order.</p>
                            <h3 style="margin: 0 auto; text-align: center; font-size: medium; font-weight: 600;">ORDER ID: ${newOrder._id}</h3>
                            <div style="width: 80%; border-bottom: 1px solid rgba(0,0,0,0.5); margin: 10px auto;"></div>
                            <p style="font-weight: 500; text-align: center; margin: 0 auto; margin-bottom: 20px; color: black;">Here's what you ordered</p>
                            <div style="width: 80%; margin: 0 auto;">
                                ${productsHtml}
                            </div>
                            <div style="width: 80%; height: auto; border: 0.5px solid black; border-radius: 10px; margin: 0 auto; padding: 15px;">
                                <h5 style="font-weight: 600; font-size: medium; text-align: center; margin: 10px; margin-bottom: 15px; color: black;">ORDER PLACED ON: ${new Date().toLocaleDateString()}</h5>
                                <div style="font-size: 15px; width: 100%; color: black;">SHIPPING ADDRESS: <span style="font-size: 15px; color: rgba(0,0,0,0.5);">${currentUser.address}</span></div>
                                <div style="width: 100%;">
                                    <p style="width: 100%; text-align: start; font-size: 15px; color: black;">MODE: PREPAID</p>
                                    <p style="width: 100%; text-align: start; font-size: 15px; color: black;">GRAND TOTAL: ₹${totalAmount}</p>
                                </div>
                            </div>
                        </div>
                    </body>

                    </html>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email sent: ' + info.response);
        });

        res.status(200).json({ message: "Order saved successfully!" });
    } catch (err) {
        next(err);
    }
};


export const userOrders = async (req, res, next) => {
    const { user } = req.body;

    try {
        const allOrders = await Order.find({ user }).sort({ createdAt: -1 });

        const allOrdersWithDetails = await Promise.all(
            allOrders.map(async (order) => {
                const store = await Store.findById(order.store);
                if (!store) {
                    throw new Error(`Store with id ${order.store} not found`);
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
                    store: store._doc,
                    products: products,
                };
            })
        );

        res.status(200).json({ message: 'success', orders: allOrdersWithDetails });
    } catch (err) {
        next(err);
    }
};
