import express from 'express'
import { updateCart, deleteCartProduct, previousQty, cartsInzip, getStore, userData, updateAccount, saveOrder, userOrders, getActiveCart, checkAvailability, updateInventory } from '../controllers/user_controller.js'

const router = express.Router()

router.post('/update-cart', updateCart)
router.post('/delete-cart-product', deleteCartProduct)
router.post('/previous-qty', previousQty)
router.post('/carts', cartsInzip)
router.post('/get-store', getStore)
router.post('/user-data', userData)
router.post('/update-account', updateAccount)
router.post('/save-order', saveOrder)
router.post('/user-orders', userOrders)
router.post('/get-active-cart', getActiveCart)
router.post('/check-availability', checkAvailability)
router.post('/update-inventory', updateInventory);

export default router;