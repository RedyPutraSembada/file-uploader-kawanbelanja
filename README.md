# 📤 Uploader App

Aplikasi ini berfungsi sebagai layanan pengunggah dan pengunduh file/data. Semua file yang diunggah akan disimpan di direktori `public/`.

## 📌 Fitur Utama

- **Upload File**: Upload single atau multiple files
- **Penyimpanan Lokal**: File disimpan di folder `public/`
- **Git Ignore**: Folder `public/` telah masuk dalam daftar `.gitignore` agar file yang diunggah tidak mengotori repositori
- **Multi-Environment**: Mendukung staging dan production untuk berbagai regional melalui Docker Compose dan Makefile

## 🛠 Prasyarat

Sebelum menjalankan aplikasi, pastikan sistem Anda memiliki:

- Docker ≥ 20.x
- Docker Compose ≥ 2.x
- Make (untuk menjalankan perintah otomatisasi Makefile)

### Persiapan Network

Jika konfigurasi Docker Compose Anda menggunakan `external: true`, pastikan network sudah dibuat secara manual:

```bash
docker network create <nama_network>
```

### Konfigurasi Environment

Pastikan file `.env` berikut tersedia di root project:

- `.env.stg_id_uploader.local`
- `.env.prod_id_uploader.local`
- `.env.stg_v2_uploader.local`
- `.env.prod_v2_uploader.local`

**Contoh isi file `.env`:**

```env
PORT=3000
NODE_ENV=production
```

## 📂 Struktur Folder

```plaintext
project/
├── Dockerfile
├── docker-compose.stg-id.yml
├── docker-compose.prod-id.yml
├── docker-compose.stg-v2.yml
├── docker-compose.prod-v2.yml
├── Makefile
├── public/
├── server.js
├── package.json
├── bun.lockb
├── .env.*.local
├── .gitignore
└── README.md
```

## 🚀 Penggunaan Makefile

Kami menggunakan `Makefile` untuk menyederhanakan manajemen container berdasarkan environment yang dipilih.

### Pilihan Environment (`ENV`)

| ENV       | Deskripsi     |
| --------- | ------------- |
| `stg-id`  | Staging ID    |
| `prod-id` | Production ID |
| `stg-v2`  | Staging V2    |
| `prod-v2` | Production V2 |

### Target Perintah

| Target    | Deskripsi                                                 |
| --------- | --------------------------------------------------------- |
| `deploy`  | Build dan jalankan container secara detached              |
| `logs`    | Memantau (follow) log container                           |
| `stop`    | Menghentikan container yang berjalan                      |
| `restart` | Melakukan restart pada container                          |
| `clean`   | Stop container, hapus volume, dan hapus orphan containers |

## 💡 Contoh Perintah

### 1. Deployment

Jalankan aplikasi sesuai dengan environment yang diinginkan:

```bash
make deploy ENV=stg-id   # Staging ID
make deploy ENV=prod-id  # Production ID
make deploy ENV=stg-v2   # Staging V2
make deploy ENV=prod-v2  # Production V2
```

### 2. Monitoring & Management

```bash
# Cek Logs
make logs ENV=stg-id

# Menghentikan Container
make stop ENV=prod-v2

# Restart Container
make restart ENV=prod-id

# Membersihkan Container & Volume
make clean ENV=stg-v2
```

## 📡 API Endpoints

### 1. Upload Single File

Upload satu file ke server.

**Endpoint:** `POST /upload`

**Request:**

- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form-data dengan key `file`

**Response:**

```json
{
	"success": true,
	"message": "File uploaded successfully",
	"file": {
		"filename": "1234567890-document.pdf",
		"originalname": "document.pdf",
		"size": 12345,
		"path": "/path/to/public/1234567890-document.pdf"
	}
}
```

**Contoh cURL:**

```bash
curl -X POST http://localhost:3000/upload \
  -F "file=@/path/to/your/file.pdf"
```

### 2. Upload Multiple Files

Upload beberapa file sekaligus (maksimal 10 file).

**Endpoint:** `POST /upload-multiple`

**Request:**

- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form-data dengan key `files` (multiple)

**Response:**

```json
{
	"success": true,
	"message": "Files uploaded successfully",
	"files": [
		{
			"filename": "1234567890-document1.pdf",
			"originalname": "document1.pdf",
			"size": 12345,
			"path": "/path/to/public/1234567890-document1.pdf"
		},
		{
			"filename": "1234567891-document2.pdf",
			"originalname": "document2.pdf",
			"size": 54321,
			"path": "/path/to/public/1234567891-document2.pdf"
		}
	]
}
```

**Contoh cURL:**

```bash
curl -X POST http://localhost:3000/upload-multiple \
  -F "files=@/path/to/file1.pdf" \
  -F "files=@/path/to/file2.pdf"
```

## 💾 Persistent Data

Data yang diunggah bersifat persisten karena folder `public/` di-mount sebagai volume di dalam Docker Compose. Hal ini menjamin data tidak akan hilang meskipun container dihapus atau di-rebuild.

**Contoh konfigurasi volume di `docker-compose.yml`:**

```yaml
services:
  uploader:
    volumes:
      - ./public:/app/public
```

## 🔒 Keamanan

Beberapa hal yang perlu diperhatikan terkait keamanan:

- **File Size Limit**: Pertimbangkan untuk menambahkan limit ukuran file
- **File Type Validation**: Validasi tipe file yang diperbolehkan
- **Rate Limiting**: Batasi jumlah request untuk mencegah abuse
- **Sanitize Filename**: Nama file sudah di-sanitize dengan timestamp

## 📝 Catatan Tambahan

- **Port**: Pastikan variabel `PORT` di dalam file `.env` masing-masing sudah sesuai dan tidak bentrok
- **Automasi**: Makefile secara otomatis akan memilih file `.env` dan `docker-compose.yml` yang relevan berdasarkan variabel `ENV` yang dimasukkan
- **File Naming**: File yang diupload akan diberi prefix timestamp dan random number untuk menghindari konflik nama
- **Max Files**: Upload multiple files dibatasi maksimal 10 file per request

# Staging ID

make deploy ENV=stg-id

# Production ID

make deploy ENV=prod-id

# Staging V2

make deploy ENV=stg-v2

# Production V2

make deploy ENV=prod-v2

**Dibuat dengan ❤️ menggunakan Node.js & Docker**
