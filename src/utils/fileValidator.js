import { fileTypeFromFile } from 'file-type'
import fs from 'fs'
import path from 'path'
import { ALLOWED_MIME_TYPES, DANGEROUS_EXTENSIONS } from '../config/env.js'

export const validateFileContent = async (filePath, originalName) => {
	try {
		// 1. Cek Ekstensi Berbahaya
		const ext = path.extname(originalName).toLowerCase()
		if (DANGEROUS_EXTENSIONS.includes(ext)) {
			throw new Error(`Blocked dangerous extension: ${ext}`)
		}

		// 2. Cek Magic Number / Real MIME Type
		const fileType = await fileTypeFromFile(filePath)

		// Fallback jika fileType null (misal text/csv kadang tidak terdeteksi magic numbernya)
		// Namun untuk keamanan ketat, sebaiknya reject jika null kecuali text plain
		if (!fileType && !ALLOWED_MIME_TYPES.includes('text/plain')) {
			throw new Error('Could not determine file type')
		}

		const mime = fileType ? fileType.mime : 'text/plain' // Simplifikasi fallback

		if (!ALLOWED_MIME_TYPES.includes(mime)) {
			throw new Error(`Invalid or corrupted file. Detected: ${mime}`)
		}

		// 3. Scan Malicious Content (Scripts) pada Image/PDF
		if (mime.startsWith('image/') || mime === 'application/pdf') {
			const content = fs.readFileSync(filePath, 'utf8').toLowerCase()
			// Regex sederhana untuk menangkap script injection
			if (/<script|<\?php|javascript:|onerror=|onload=/i.test(content)) {
				throw new Error('Malicious content detected inside file')
			}
		}

		return { isValid: true, mimeType: mime }
	} catch (error) {
		// Hapus file jika validasi gagal
		if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
		throw error
	}
}
