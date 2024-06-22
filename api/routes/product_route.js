import express from 'express'
import { add, getData, update, remove } from '../controllers/product_controller.js'

const router = express.Router();

router.post('/add-product', add)
router.post('/data', getData)
router.post('/update', update)
router.post('/remove', remove)

export default router
