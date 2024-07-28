import express from 'express'
import { updateCart, deleteCartProduct, previousQty, cartsInzip, getStore, userData, updateAccount } from '../controllers/user_controller.js'

const router = express.Router()

router.post('/update-cart', updateCart)
router.post('/delete-cart-product', deleteCartProduct)
router.post('/previous-qty', previousQty)
router.post('/carts', cartsInzip)
router.post('/get-store', getStore)
router.post('/user-data', userData)
router.post('/update-account', updateAccount)

export default router;