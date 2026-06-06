import cors from 'cors'
import express from 'express'
import { CONFIG, UPLOAD_BASE_DIR } from './config/env.js'
import { globalErrorHandler } from './middlewares/errorHandler.js'
import apiRoutes from './routes/api.js'

const app = express()

// Middleware Global
app.use(
	cors({
		origin(origin, callback) {
			if (!origin || CONFIG.ALLOWED_ORIGINS.includes(origin)) {
				callback(null, true)
			} else {
				callback(new Error('Not allowed by CORS'))
			}
		},
	}),
)

// Static Files
app.use('/public', express.static(UPLOAD_BASE_DIR))

// Routes
app.use('/', apiRoutes)

// Error Handling Global
app.use(globalErrorHandler)

export default app
