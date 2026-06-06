import fs from 'fs'
import path from 'path'
import { CONFIG, UPLOAD_BASE_DIR } from '../config/env.js'
import { validateFileContent } from '../utils/fileValidator.js'

const generateFileUrl = (filePath) => {
	const relativePath = path
		.relative(UPLOAD_BASE_DIR, filePath)
		.replace(/\\/g, '/')
	return `${CONFIG.URI}/public/${relativePath}`
}

export const uploadSingle = async (req, res, next) => {
	try {
		if (!req.file) throw new Error('No file uploaded')

		// Validasi konten file (Magic number & script check)
		// Jika gagal, validateFileContent otomatis menghapus file
		const { mimeType } = await validateFileContent(
			req.file.path,
			req.file.originalname,
		)

		res.json({
			status: 'success',
			file: {
				filename: req.file.filename,
				mimeType: mimeType,
				size: req.file.size,
				url: generateFileUrl(req.file.path),
			},
		})
	} catch (error) {
		// Pastikan file terhapus jika terjadi error di level controller (double safety)
		if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
		next(error)
	}
}

export const uploadMultiple = async (req, res, next) => {
	try {
		if (!req.files || req.files.length === 0)
			throw new Error('No files uploaded')

		const resultFiles = []

		// Loop through files
		for (const file of req.files) {
			try {
				const { mimeType } = await validateFileContent(
					file.path,
					file.originalname,
				)

				resultFiles.push({
					filename: file.filename,
					mimeType: mimeType,
					size: file.size,
					url: generateFileUrl(file.path),
				})
			} catch (err) {
				// Jika satu file gagal validasi, kita throw error
				// Ini akan memicu catch block bawah untuk menghapus SEMUA file batch ini
				throw new Error(`File ${file.originalname}: ${err.message}`)
			}
		}

		res.json({
			status: 'success',
			total: resultFiles.length,
			files: resultFiles,
		})
	} catch (error) {
		// Rollback: Hapus semua file yang sempat terupload dalam request ini jika ada error
		if (req.files) {
			req.files.forEach((f) => {
				if (fs.existsSync(f.path)) fs.unlinkSync(f.path)
			})
		}
		next(error)
	}
}
