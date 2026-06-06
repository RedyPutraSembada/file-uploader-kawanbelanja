import multer from 'multer'
import { CONFIG } from '../config/env.js'

export const globalErrorHandler = (err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		if (err.code === 'LIMIT_FILE_SIZE') {
			return res.status(400).json({
				message: `File too large. Max size is ${CONFIG.MAX_FILE_SIZE} MB`,
			})
		}
		return res.status(400).json({ message: err.message })
	}

	// Custom errors atau error sistem lainnya
	const status = err.statusCode || 500
	res.status(status).json({ message: err.message || 'Internal server error' })
}
