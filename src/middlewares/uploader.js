import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { CONFIG, UPLOAD_BASE_DIR } from '../config/env.js'

// Pastikan base dir ada
if (!fs.existsSync(UPLOAD_BASE_DIR))
	fs.mkdirSync(UPLOAD_BASE_DIR, { recursive: true })

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		const today = new Date()
		const folderName = `${today.getFullYear()}-${(today.getMonth() + 1)
			.toString()
			.padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`

		const folderPath = path.join(UPLOAD_BASE_DIR, folderName)

		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true })
		}

		cb(null, folderPath)
	},
	filename: (_, file, cb) => {
		const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
		cb(null, unique + path.extname(file.originalname))
	},
})

export const uploadMiddleware = multer({
	storage,
	limits: { fileSize: CONFIG.MAX_FILE_SIZE * 1024 * 1024 },
})
