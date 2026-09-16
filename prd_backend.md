# PRD — Tromagnon Records Backend API (Go)

## 1. Overview

Dokumen ini fokus ke backend API untuk website Tromagnon Records fase MVP (company profile — belum termasuk shop/e-commerce). Backend dibangun pakai **Go + Fiber**, menyediakan data untuk public site dan dashboard admin (Next.js).

**Tujuan:** REST API yang jadi sumber data untuk frontend, dengan endpoint publik (dibaca semua orang) dan endpoint admin (dilindungi JWT) untuk kelola konten.

## 2. Tech Stack

| Komponen | Pilihan |
|---|---|
| Bahasa | Go |
| Web framework | Fiber |
| Database | PostgreSQL (lokal) |
| ORM/Query | GORM atau sqlc (pilih salah satu — GORM lebih cepat setup, sqlc lebih type-safe) |
| Auth | JWT (untuk admin) |
| Password hashing | bcrypt |
| Env config | godotenv (`.env` file) |

## 3. Struktur Project

```
tromagnon-api/
  cmd/
    server/
      main.go
  internal/
    config/
      config.go
    database/
      postgres.go
    middleware/
      auth.go
      cors.go
    artist/
      handler.go
      service.go
      repository.go
      model.go
    release/
      handler.go
      service.go
      repository.go
      model.go
    news/
      handler.go
      service.go
      repository.go
      model.go
    live/
      handler.go
      service.go
      repository.go
      model.go
    settings/
      handler.go
      service.go
      repository.go
      model.go
    auth/
      handler.go
      service.go
      model.go
  pkg/
    response/
      response.go
  go.mod
  go.sum
  .env.example
```

**Pola arsitektur:** layered per fitur (handler → service → repository).
- **Handler** — terima HTTP request, validasi input dasar, panggil service, format response
- **Service** — logic bisnis
- **Repository** — satu-satunya lapisan yang query ke database langsung

## 4. Data Models (struct Go, dari skema PostgreSQL)

```go
// internal/artist/model.go
type Artist struct {
    ID          uuid.UUID `json:"id"`
    Name        string    `json:"name"`
    Slug        string    `json:"slug"`
    Bio         string    `json:"bio"`
    PhotoURL    string    `json:"photo_url"`
    Genre       string    `json:"genre"`
    SocialLinks datatypes.JSON `json:"social_links"`
    Status      string    `json:"status"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}

// internal/release/model.go
type Release struct {
    ID              uuid.UUID `json:"id"`
    ArtistID        uuid.UUID `json:"artist_id"`
    Title           string    `json:"title"`
    Slug            string    `json:"slug"`
    ReleaseYear     int       `json:"release_year"`
    Format          string    `json:"format"`
    ArtworkURL      string    `json:"artwork_url"`
    Description     string    `json:"description"`
    StreamingLinks  datatypes.JSON `json:"streaming_links"`
    Status          string    `json:"status"`
    CreatedAt       time.Time `json:"created_at"`
    UpdatedAt       time.Time `json:"updated_at"`
}

// internal/news/model.go
type News struct {
    ID               uuid.UUID  `json:"id"`
    Title            string     `json:"title"`
    Slug             string     `json:"slug"`
    Content          string     `json:"content"`
    CoverImageURL    string     `json:"cover_image_url"`
    RelatedArtistID  *uuid.UUID `json:"related_artist_id"`
    RelatedReleaseID *uuid.UUID `json:"related_release_id"`
    PublishedAt      *time.Time `json:"published_at"`
    Status           string     `json:"status"`
    CreatedAt        time.Time  `json:"created_at"`
    UpdatedAt        time.Time  `json:"updated_at"`
}

// internal/live/model.go
type LiveEvent struct {
    ID          uuid.UUID  `json:"id"`
    ArtistID    *uuid.UUID `json:"artist_id"`
    EventDate   time.Time  `json:"event_date"`
    City        string     `json:"city"`
    Venue       string     `json:"venue"`
    Country     string     `json:"country"`
    TicketURL   string     `json:"ticket_url"`
    Status      string     `json:"status"`
    CreatedAt   time.Time  `json:"created_at"`
    UpdatedAt   time.Time  `json:"updated_at"`
}

// internal/settings/model.go
type SiteSettings struct {
    ID            uuid.UUID `json:"id"`
    HeroTitle     string    `json:"hero_title"`
    HeroSubtitle  string    `json:"hero_subtitle"`
    HeroImageURL  string    `json:"hero_image_url"`
    UpdatedAt     time.Time `json:"updated_at"`
}

// internal/auth/model.go
type Admin struct {
    ID           uuid.UUID `json:"id"`
    Email        string    `json:"email"`
    PasswordHash string    `json:"-"`
    Name         string    `json:"name"`
    CreatedAt    time.Time `json:"created_at"`
}
```

## 5. Endpoint List

### Public (tanpa auth)

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/artists` | List semua artis (status=active) |
| GET | `/api/artists/:slug` | Detail satu artis |
| GET | `/api/releases` | List semua rilisan (status=published) |
| GET | `/api/releases/:slug` | Detail satu rilisan |
| GET | `/api/news` | List berita (status=published) |
| GET | `/api/news/:slug` | Detail satu berita |
| GET | `/api/live` | List jadwal live (status=upcoming, urut tanggal) |
| GET | `/api/settings/hero` | Ambil data hero/banner homepage |

### Admin (butuh JWT di header `Authorization: Bearer <token>`)

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/api/admin/login` | Login admin, return JWT |
| GET | `/api/admin/artists` | List semua artis (termasuk draft/inactive) |
| POST | `/api/admin/artists` | Tambah artis |
| PUT | `/api/admin/artists/:id` | Edit artis |
| DELETE | `/api/admin/artists/:id` | Hapus artis |
| (pola CRUD sama untuk `releases`, `news`, `live`) | | |
| PUT | `/api/admin/settings/hero` | Update hero/banner homepage |

## 6. Auth Flow

1. Admin login via `POST /api/admin/login` dengan email + password
2. Backend cek password pakai bcrypt, kalau cocok → generate JWT (payload: admin ID, expiry)
3. Frontend simpan token (httpOnly cookie atau localStorage), sertakan di header tiap request ke `/api/admin/*`
4. Middleware `auth.go` verifikasi token di setiap request admin, tolak (401) kalau invalid/expired

## 7. Response Format (konsisten di semua endpoint)

```json
// Sukses
{
  "success": true,
  "data": { },
  "message": ""
}

// Error
{
  "success": false,
  "data": null,
  "message": "Artist not found"
}
```

## 8. Database Schema

```sql
-- ARTISTS
CREATE TABLE artists (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    slug          VARCHAR(255) UNIQUE NOT NULL,
    bio           TEXT,
    photo_url     VARCHAR(500),
    genre         VARCHAR(100),
    social_links  JSONB,
    status        VARCHAR(20) DEFAULT 'active',
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now()
);

-- RELEASES
CREATE TABLE releases (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id     UUID REFERENCES artists(id) ON DELETE SET NULL,
    title         VARCHAR(255) NOT NULL,
    slug          VARCHAR(255) UNIQUE NOT NULL,
    release_year  INTEGER,
    format        VARCHAR(50),           -- 'LP', 'CD', 'Tape', 'Digital'
    artwork_url   VARCHAR(500),
    description   TEXT,
    streaming_links JSONB,               -- {"spotify": "...", "deezer": "..."}
    status        VARCHAR(20) DEFAULT 'published',
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now()
);

-- NEWS
CREATE TABLE news (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         VARCHAR(255) NOT NULL,
    slug          VARCHAR(255) UNIQUE NOT NULL,
    content       TEXT NOT NULL,
    cover_image_url VARCHAR(500),
    related_artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
    related_release_id UUID REFERENCES releases(id) ON DELETE SET NULL,
    published_at  TIMESTAMPTZ,
    status        VARCHAR(20) DEFAULT 'draft',   -- 'draft' / 'published'
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now()
);

-- LIVE EVENTS
CREATE TABLE live_events (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id     UUID REFERENCES artists(id) ON DELETE SET NULL,
    event_date    DATE NOT NULL,
    city          VARCHAR(100),
    venue         VARCHAR(255),
    country       VARCHAR(100),
    ticket_url    VARCHAR(500),
    status        VARCHAR(20) DEFAULT 'upcoming',  -- 'upcoming' / 'past' / 'cancelled'
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now()
);

-- SITE SETTINGS (singleton — satu baris data)
CREATE TABLE site_settings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_title      VARCHAR(255),
    hero_subtitle   TEXT,
    hero_image_url  VARCHAR(500),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ADMINS
CREATE TABLE admins (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(255),
    created_at    TIMESTAMPTZ DEFAULT now()
);
```

**Relasi:**
```
artists (1) ──< (N) releases
artists (1) ──< (N) news        (opsional)
artists (1) ──< (N) live_events (opsional)
releases (1) ──< (N) news       (opsional)
```

## 9. Non-Functional Requirements

- Jalan sepenuhnya lokal untuk saat ini (Postgres lokal, tanpa deployment)
- CORS diaktifkan untuk domain frontend lokal (`localhost:3000`)
- Validasi input dasar di setiap handler (field wajib, format slug, dll)
- Struktur project mengikuti layered architecture agar mudah dites dan di-extend ke fase shop nanti

## 10. Out of Scope (Fase Ini)

- Endpoint shop (`products`, `orders`) — menyusul di fase berikutnya
- Integrasi Midtrans
- Rate limiting, caching, atau optimasi performa lanjutan
- Multi-role admin (saat ini cukup satu level admin)

## 11. Urutan Pengerjaan yang Disarankan

1. Setup project Go + Fiber + koneksi database
2. Buat migration untuk semua tabel
3. Implementasi modul `artist` end-to-end (model → repository → service → handler → route) sebagai pola acuan
4. Replikasi pola yang sama untuk `release`, `news`, `live`, `settings`
5. Implementasi `auth` (login admin + middleware JWT)
6. Testing manual tiap endpoint (bisa pakai Postman/Thunder Client/curl)