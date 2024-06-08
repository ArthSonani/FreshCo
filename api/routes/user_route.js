import express from 'express'
import { test, check } from '../controllers/user_controllers.js'

const router = express.Router();

router.get('/test', test)
router.post('/check',check)

export default router