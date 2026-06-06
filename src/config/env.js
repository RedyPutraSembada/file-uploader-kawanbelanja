import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Base directory untuk upload (naik 2 level dari src/config ke root/public)
export const UPLOAD_BASE_DIR = path.join(__dirname, '../../public')

export const CONFIG = {
	PORT: process.env.PORT || 4007,
	URI: process.env.UPLOAD_URI || 'http://localhost',
	MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 50, // MB
	API_KEY: process.env.UPLOAD_API_KEY || 'supersecret123',
	RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 5,
	RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 1,
	ALLOWED_ORIGINS:
		process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()) || [],
}

export const ALLOWED_MIME_TYPES = process.env.MIME_TYPE_ALLOWED
	? process.env.MIME_TYPE_ALLOWED.split(',').map((m) => m.trim())
	: [
			// Images
			'image/jpeg',
			'image/png',
			'image/gif',
			'image/webp',
			// Documents
			'application/pdf',
			'application/msword', // .doc
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
			'application/vnd.ms-excel', // .xls
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
			'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
			'text/csv',
			'text/plain',
			// Video
			'video/mp4',
			'video/webm',
	  ]

export const DANGEROUS_EXTENSIONS = [
	// Executables & Scripts
	'.exe',
	'.bat',
	'.cmd',
	'.sh',
	'.js',
	'.mjs',
	'.cjs',
	'.php',
	'.phtml',
	'.vbs',
	'.vbe',
	'.ps1',
	'.py',
	'.rb',
	'.pl',
	// Web & Injection
	'.html',
	'.htm',
	'.svg',
	'.xml',
	// Installers & System
	'.jar',
	'.apk',
	'.msi',
	'.msp',
	'.reg',
	'.scr',
	'.com',
	'.lnk',
	'.dmg',
	'.pkg',
]
