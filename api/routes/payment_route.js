import express from 'express'
import { order, verify } from '../controllers/payment_controller.js'

const router = express.Router();

router.post('/order', order)
router.post('/verify', verify)

export default router;
