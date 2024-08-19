import express from 'express'
import { signin, signup, signout, checkEmail, generateOTP } from '../controllers/vendor_auth_controller.js'

const router = express.Router();

router.post('/signin', signin)
router.post('/signup', signup)
router.get('/signout', signout)
router.post('/check-email', checkEmail)
router.post('/generate-otp', generateOTP)

export default router
