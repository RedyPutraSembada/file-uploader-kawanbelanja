import { CONFIG } from '../config/env.js'

export const apiKeyMiddleware = (req, res, next) => {
	const apiKey = req.headers['x-api-key']
	if (!apiKey || apiKey !== CONFIG.API_KEY) {
		return res.status(401).json({ message: 'Unauthorized: Invalid API Key' })
	}
	next()
}
