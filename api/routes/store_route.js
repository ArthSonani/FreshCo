import express from 'express'
import { nearStore, storeProducts, storeData, updateAccount, orders, orderCount, updateOrderCount } from '../controllers/store_controller.js'

const router = express.Router()

router.post('/near-store', nearStore)
router.post('/store-products', storeProducts)
router.post('/store-data', storeData)
router.post('/update-account', updateAccount)
router.post('/orders', orders)
router.post('/order-count', orderCount)
router.post('/update-order-count', updateOrderCount)


export default router;