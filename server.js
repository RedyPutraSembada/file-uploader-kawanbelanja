import app from './src/app.js'
import { CONFIG } from './src/config/env.js'

app.listen(CONFIG.PORT, () => {
	console.log(`Server running at http://localhost:${CONFIG.PORT}`)
	console.log(`Storage path: ${process.env.UPLOAD_URI || 'local'}/public`)
})
