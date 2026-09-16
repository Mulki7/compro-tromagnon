# 📖 Tromagnon Records — API Documentation

**Base URL:** `http://localhost:8080`
**API Prefix:** `/api`
**Auth:** Bearer JWT Token (untuk semua `/api/admin/*` kecuali login)

---

## 🩺 Health Check

`GET /api/health`

---

## 🔐 Auth

| Method | URL | Auth |
|---|---|---|
| POST | `/api/admin/login` | ❌ |
| GET | `/api/admin/me` | ✅ |

### Login Body:
```json
{
  "email": "admin@tromagnon.com",
  "password": "admin123"
}
```

---

## 🎨 Artists

| Method | URL | Auth |
|---|---|---|
| GET | `/api/artists` | ❌ |
| GET | `/api/artists/:slug` | ❌ |
| GET | `/api/admin/artists` | ✅ |
| GET | `/api/admin/artists/:id` | ✅ |
| POST | `/api/admin/artists` | ✅ |
| PUT | `/api/admin/artists/:id` | ✅ |
| PATCH | `/api/admin/artists/:id` | ✅ |
| DELETE | `/api/admin/artists/:id` | ✅ |

### POST/PUT Body:
```json
{
  "name": "Efek Rumah Kaca",
  "slug": "efek-rumah-kaca",
  "bio": "Band indie rock asal Jakarta.",
  "photo_url": "/uploads/erk-photo.jpg",
  "genre": "Indie Rock",
  "social_links": {
    "instagram": "https://instagram.com/efekrumahkaca",
    "spotify": "https://open.spotify.com/artist/efekrumahkaca"
  },
  "status": "active"
}
```

### PATCH Body (kirim field yang ingin diubah saja):
```json
{ "status": "inactive" }
```

---

## 💿 Releases

| Method | URL | Auth |
|---|---|---|
| GET | `/api/releases` | ❌ |
| GET | `/api/releases/:slug` | ❌ |
| GET | `/api/admin/releases` | ✅ |
| GET | `/api/admin/releases/:id` | ✅ |
| POST | `/api/admin/releases` | ✅ |
| PUT | `/api/admin/releases/:id` | ✅ |
| PATCH | `/api/admin/releases/:id` | ✅ |
| DELETE | `/api/admin/releases/:id` | ✅ |

### POST/PUT Body:
```json
{
  "artist_id": "<uuid-artis>",
  "title": "Rasuk",
  "release_year": 2023,
  "format": "LP",
  "artwork_url": "/uploads/rasuk-cover.jpg",
  "description": "Album ketiga yang penuh eksperimen sonic.",
  "streaming_links": {
    "spotify": "https://open.spotify.com/album/rasuk",
    "apple_music": "https://music.apple.com/album/rasuk"
  },
  "status": "published"
}
```

### PATCH Body:
```json
{ "status": "draft" }
```

---

## 📰 News

| Method | URL | Auth |
|---|---|---|
| GET | `/api/news` | ❌ |
| GET | `/api/news/:slug` | ❌ |
| GET | `/api/admin/news` | ✅ |
| GET | `/api/admin/news/:id` | ✅ |
| POST | `/api/admin/news` | ✅ |
| PUT | `/api/admin/news/:id` | ✅ |
| PATCH | `/api/admin/news/:id` | ✅ |
| DELETE | `/api/admin/news/:id` | ✅ |

### POST/PUT Body:
```json
{
  "title": "Efek Rumah Kaca Rilis Single Baru",
  "slug": "efek-rumah-kaca-rilis-single-baru",
  "content": "Tromagnon Records mengumumkan single terbaru...",
  "cover_image_url": "/uploads/erk-cover.jpg",
  "related_artist_id": "<uuid-artis>",
  "related_release_id": null,
  "status": "draft"
}
```

### PATCH Body (publish artikel):
```json
{ "status": "published" }
```

---

## 🎸 Live Events

| Method | URL | Auth |
|---|---|---|
| GET | `/api/live` | ❌ |
| GET | `/api/admin/live` | ✅ |
| GET | `/api/admin/live/:id` | ✅ |
| POST | `/api/admin/live` | ✅ |
| PUT | `/api/admin/live/:id` | ✅ |
| PATCH | `/api/admin/live/:id` | ✅ |
| DELETE | `/api/admin/live/:id` | ✅ |

### POST/PUT Body:
```json
{
  "artist_id": "<uuid-artis>",
  "event_date": "2027-03-20",
  "city": "Yogyakarta",
  "venue": "Societet Militair",
  "country": "Indonesia",
  "ticket_url": "https://tiket.com/event/tromagnon-jogja-2027",
  "status": "upcoming"
}
```

### PATCH Body (batalkan event):
```json
{ "status": "cancelled" }
```

---

## 🖼️ Hero Banners (Slider Homepage)

| Method | URL | Auth | Keterangan |
|---|---|---|---|
| GET | `/api/hero-banners` | ❌ | List banner aktif (diurutkan `order` asc) |
| GET | `/api/admin/hero-banners` | ✅ | List semua banner |
| GET | `/api/admin/hero-banners/:id` | ✅ | Detail banner by ID |
| POST | `/api/admin/hero-banners` | ✅ | Buat banner baru + upload `banner_image` |
| PUT | `/api/admin/hero-banners/:id` | ✅ | Update banner lengkap |
| PATCH | `/api/admin/hero-banners/:id` | ✅ | Update parsial (`is_active`, `order`) |
| DELETE | `/api/admin/hero-banners/:id` | ✅ | Soft delete banner |

### POST / PUT Form-Data Fields:
- `title` (text): "TROMAGNON RECORDS"
- `subtitle` (text): "Distorting Boundaries Since 2020"
- `cta_text` (text): "Explore Artists"
- `cta_link` (text): "/artists"
- `order` (number): 1
- `is_active` (boolean): true
- `banner_image` (file): upload file gambar banner langsung (opsional jika PUT tanpa ganti gambar)

---

## 📸 Upload File

| Method | URL | Auth | Body |
|---|---|---|---|
| POST | `/api/admin/upload` | ✅ | `form-data` |

- Field name: `file` atau `image`
- Maks: **5 MB**
- Format: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "1789455346-cac4190a.png",
    "url": "/uploads/1789455346-cac4190a.png",
    "size": 15420,
    "mime_type": "image/png"
  },
  "message": "File uploaded successfully"
}
```

---

## 🚀 Cara Jalankan

```powershell
go run cmd/server/main.go
```

Server: `http://localhost:8080`
