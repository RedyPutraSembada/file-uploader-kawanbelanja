import express from 'express'
import {
	uploadMultiple,
	uploadSingle,
} from '../controllers/uploadController.js'
import { apiKeyMiddleware } from '../middlewares/auth.js'
import { uploadLimiter } from '../middlewares/rateLimit.js'
import { uploadMiddleware } from '../middlewares/uploader.js'

const router = express.Router()

// Group middleware yang sama
const protectUpload = [apiKeyMiddleware, uploadLimiter]

router.post(
	'/upload',
	...protectUpload,
	uploadMiddleware.single('file'),
	uploadSingle,
)

router.post(
	'/uploads',
	...protectUpload,
	uploadMiddleware.array('files', 5),
	uploadMultiple,
)

export default router
