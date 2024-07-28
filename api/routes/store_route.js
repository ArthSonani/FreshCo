import express from 'express'
import { nearStore, storeProducts } from '../controllers/store_controller.js'

const router = express.Router()

router.post('/near-store', nearStore)
router.post('/store-products', storeProducts)

export default router;