import express from 'express'
import { add, getData } from '../controllers/product_controller.js'

const router = express.Router();

router.post('/add-product', add)
router.post('/data', getData)

export default router
