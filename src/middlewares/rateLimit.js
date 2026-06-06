import rateLimit from 'express-rate-limit'
import { CONFIG } from '../config/env.js'

export const uploadLimiter = rateLimit({
	windowMs: CONFIG.RATE_LIMIT_WINDOW * 60 * 1000,
	max: CONFIG.RATE_LIMIT_MAX,
	message: {
		status: 'error',
		message: `Too many uploads. Try again in ${CONFIG.RATE_LIMIT_WINDOW} minute(s).`,
	},
	standardHeaders: true,
	legacyHeaders: false,
})
