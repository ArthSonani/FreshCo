import express from 'express'
import { signup, signin, signout, updateZip } from '../controllers/user_auth_controller.js'

const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.get('/signout', signout)
router.post('/update-zip', updateZip)

export default router
