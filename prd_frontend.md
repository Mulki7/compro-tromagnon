# 📋 PRD — Frontend Tromagnon Records (Public Site & Admin CMS)

> **Dokumen Panduan Spesifikasi Produk & Implementasi Teknis Frontend**
> Dibuat khusus untuk diinstruksikan langsung kepada AI Agent / Frontend Engineer.

---

## 1. Executive Summary & Vision

**Tromagnon Records** adalah label rekaman independen (music label) yang mengusung estetika berkarakter, personal, dan raw namun tetap rapi — terinspirasi visual Siluh Records (siluh.com).

Frontend terdiri dari 2 area utama dalam 1 kesatuan aplikasi:
1. **Public Website:** Wajah publik label rekaman untuk memamerkan artis (*roster*), rilisan musik (*discography*), berita/artikel (*journal/news*), jadwal konser (*live tour*), dan banner dinamis (*hero slideshow*).
2. **Admin CMS Dashboard:** Panel kontrol terlindungi JWT untuk mengelola seluruh konten website (CRUD artis, rilisan, berita, live event, dan hero banner slider).

---

## 2. Tech Stack & Library Specifications

| Layer | Rekomendasi Teknologi | Alasan |
|---|---|---|
| **Framework** | **Next.js 14+ (App Router)** | SEO-friendly (SSR/SSG untuk halaman public), route grouping `(public)` dan `(admin)`, performa tinggi. |
| **Language** | **TypeScript** | Type-safety penuh dengan interface DTO backend. |
| **Styling** | **Tailwind CSS + Tailwind Animate** | Kecepatan styling, konsistensi token warna. |
| **UI Icons** | **Lucide React** | Ikon modern, ringan, dan lengkap. |
| **State & Data Fetching** | **TanStack Query (React Query v5)** atau **SWR** | Caching, invalidation setelah mutasi, loading & error state otomatis. |
| **HTTP Client** | **Axios** | Interceptor otomatis untuk injeksi header JWT `Authorization: Bearer <token>` dan response handling. |
| **Form Handling** | **React Hook Form + Zod** | Validasi form yang kuat, integrasi form-data file upload. |
| **Animations** | **Framer Motion** | Micro-interactions, hover effects, dan transisi antar slide/halaman yang smooth. |

---

## 3. Brand Identity & Design System

### 3.1 Vibe & Aesthetics

- **Nuansa:** Indie, raw namun personal, editorial music label — terinspirasi langsung dari Siluh Records. Dreamy tapi berani, bukan dark-mode/neon.
- **Background Utama:** Putih/off-white bersih (`#FFFFFF` atau `#FAFAFA`) sebagai kanvas utama, dikontraskan dengan hitam pekat (`#0A0A0A`) untuk teks, navigasi aktif, dan elemen solid.
- **Warna Aksen:** Palet dasar **hitam & putih** — bukan neon/electric color untuk elemen UI. Warna hanya boleh muncul secara natural dari foto artis dan artwork rilisan, supaya kontras hitam-putih tetap jadi identitas utama brand (konsisten dengan referensi Siluh Records).
- **Tipografi:**
  - Headings / Display: font serif hangat/rounded yang tidak kaku (kandidat: *Fraunces*, *Instrument Serif*, atau *Bricolage Grotesque*).
  - Body Text: sans-serif bersih dengan keterbacaan tinggi (kandidat: *Inter* atau *Geist*).
- **Komponen Visual:** sudut tegas/minimal (hindari rounded berlebihan atau glassmorphism yang kesannya modern-tech), subtle border tipis, efek hover sederhana (crossfade/scale kecil) pada cover artwork, sentuhan hand-drawn/lettering pada logo "T" dan elemen dekoratif tertentu, cursor-following element di titik-titik tertentu (mis. homepage) untuk kesan hidup tanpa mengorbankan kesan minimalis.

---

## 4. Arsitektur Folder Frontend (Next.js App Router)

```text
frontend/
├── public/
│   ├── favicon.ico
│   └── placeholders/
├── src/
│   ├── app/
│   │   ├── (public)/                 # Layout & Page Publik
│   │   │   ├── layout.tsx            # Navbar & Footer Publik
│   │   │   ├── page.tsx              # Homepage (Hero, Roster, Releases, News, Tour)
│   │   │   ├── artists/
│   │   │   │   ├── page.tsx          # Roster List
│   │   │   │   └── [slug]/page.tsx   # Detail Artis
│   │   │   ├── releases/
│   │   │   │   ├── page.tsx          # Catalog Rilisan
│   │   │   │   └── [slug]/page.tsx   # Detail Rilisan Album/Single
│   │   │   ├── news/
│   │   │   │   ├── page.tsx          # Daftar Berita / Journal
│   │   │   │   └── [slug]/page.tsx   # Detail Artikel Berita
│   │   │   └── live/
│   │   │       └── page.tsx          # Jadwal Tour & Konser
│   │   ├── (admin)/                  # Layout & Page Admin CMS
│   │   │   ├── admin/
│   │   │   │   ├── login/page.tsx    # Halaman Login Admin
│   │   │   │   └── (dashboard)/      # Protected Route
│   │   │   │       ├── layout.tsx    # Sidebar & Header Admin
│   │   │   │       ├── page.tsx      # Dashboard Overview (Statistik)
│   │   │   │       ├── hero/page.tsx # Manajemen Hero Banner Slider
│   │   │   │       ├── artists/
│   │   │   │       │   ├── page.tsx  # List Artis
│   │   │   │       │   ├── create/   # Form Tambah Artis
│   │   │   │       │   └── [id]/     # Form Edit Artis
│   │   │   │       ├── releases/
│   │   │   │       │   ├── page.tsx  # List Rilisan
│   │   │   │       │   ├── create/
│   │   │   │       │   └── [id]/
│   │   │   │       ├── news/
│   │   │   │       │   ├── page.tsx  # List Berita
│   │   │   │       │   ├── create/
│   │   │   │       │   └── [id]/
│   │   │   │       └── live/
│   │   │   │           ├── page.tsx  # List Event
│   │   │   │           ├── create/
│   │   │   │           └── [id]/
│   │   ├── globals.css
│   │   └── layout.tsx                # Root layout & Theme provider
│   ├── components/
│   │   ├── public/                   # Navbar, Footer, HeroSlider, ReleaseCard, dll.
│   │   ├── admin/                    # AdminSidebar, ImageDropzone, TagInput, ConfirmModal
│   │   └── ui/                       # Button, Dialog, Input, Badge, Dropdown
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts             # Axios instance + interceptors
│   │   │   ├── auth.ts               # Auth API calls
│   │   │   ├── artists.ts
│   │   │   ├── releases.ts
│   │   │   ├── news.ts
│   │   │   ├── live.ts
│   │   │   └── hero.ts
│   │   └── utils.ts                  # Helper format tanggal, format URL image, cn()
│   ├── hooks/                        # Custom hooks (useAuth, useToast)
│   └── types/                        # TypeScript Interfaces (mirror backend)
└── .env.local
```

---

## 5. Integrasi Backend & API Contract

### 5.1 Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_SERVER_ORIGIN=http://localhost:8080
```

### 5.2 Standar Format Response Backend
Backend Go Fiber Tromagnon Records membungkus seluruh response dalam format envelope:

```typescript
// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}
```

### 5.3 Helper Konversi URL Gambar
File yang diupload disimpan di `/uploads/:filename`. Di frontend, buat helper function:
```typescript
export function getMediaUrl(path?: string | null): string {
  if (!path) return "/placeholders/no-image.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_ORIGIN || "http://localhost:8080";
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}
```

---

## 6. TypeScript Data Models (Mirror Backend)

```typescript
// types/models.ts

export type StatusType = "active" | "inactive" | "draft" | "published" | "upcoming" | "past" | "cancelled";

// 1. HERO BANNER
export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 2. ARTIST
export interface ArtistSocialLinks {
  instagram?: string;
  spotify?: string;
  youtube?: string;
  twitter?: string;
  bandcamp?: string;
  [key: string]: string | undefined;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  photo_url: string;
  genre: string[]; // JSONB Array, contoh: ["Indie Rock", "Alternative"]
  social_links: ArtistSocialLinks;
  status: "active" | "inactive";
  releases?: Release[];
  events?: LiveEvent[];
  created_at: string;
  updated_at: string;
}

// 3. RELEASE
export interface ReleaseStreamingLinks {
  spotify?: string;
  apple_music?: string;
  bandcamp?: string;
  youtube_music?: string;
  [key: string]: string | undefined;
}

export interface Release {
  id: string;
  artist_id: string;
  artist?: Artist;
  title: string;
  slug: string;
  release_year: number;
  format: string[]; // JSONB Array, contoh: ["LP", "Digital", "Cassette"]
  artwork_url: string;
  description: string;
  streaming_links: ReleaseStreamingLinks;
  status: "published" | "draft";
  created_at: string;
  updated_at: string;
}

// 4. NEWS / JOURNAL
export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image_url: string;
  author: string;
  related_artist_id?: string | null;
  related_release_id?: string | null;
  related_artist?: Artist;
  related_release?: Release;
  status: "draft" | "published";
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

// 5. LIVE EVENT
export interface LiveEvent {
  id: string;
  artist_id: string;
  artist?: Artist;
  event_date: string; // YYYY-MM-DD
  city: string;
  venue: string;
  country: string;
  ticket_url: string;
  status: "upcoming" | "past" | "cancelled";
  created_at: string;
  updated_at: string;
}

// 6. ADMIN & AUTH
export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponseData {
  token: string;
  admin: AdminUser;
}
```

---

## 7. Aturan Upload & Mutasi Data (PENTING)

1. **Direct Multipart Form-Data untuk Entity yang Memiliki Gambar:**
   - **Artist:** Field file `photo` (opsional jika update tanpa ganti gambar).
   - **Release:** Field file `artwork` (opsional saat edit).
   - **News:** Field file `cover` (opsional saat edit).
   - **Hero Banner:** Field file `banner_image` (opsional saat edit).
   - *Catatan:* Jika user tidak mengunggah file baru saat `PUT`/`PATCH`, jangan lampirkan file di `FormData`. Backend akan mempertahankan file gambar lama.

2. **Format Array untuk `genre` dan `format`:**
   - Saat submit `FormData`, kirim sebagai JSON string:
     ```typescript
     formData.append("genre", JSON.stringify(["Indie Rock", "Post-Rock"]));
     formData.append("format", JSON.stringify(["LP", "Digital"]));
     ```

3. **Format Object JSON untuk `social_links` & `streaming_links`:**
   - Kirim sebagai JSON string di `FormData`:
     ```typescript
     formData.append("social_links", JSON.stringify({ instagram: "...", spotify: "..." }));
     formData.append("streaming_links", JSON.stringify({ spotify: "...", apple_music: "..." }));
     ```

4. **Live Events:**
   - Tidak memiliki gambar, dikirim menggunakan **Raw JSON Body** (`application/json`).

---

## 8. Spesifikasi Detail Halaman (Pages & Features)

### 8.1 Public Pages

#### 1. Homepage (`/`)
- **Hero Slider:** Menampilkan list aktif dari `GET /api/hero-banners`. Slideshow otomatis / tombol navigasi panah. Menampilkan `title`, `subtitle`, background `image_url`, tombol CTA (`cta_text` & `cta_link`).
- **Featured / Latest Releases:** Grid 4-6 rilisan terbaru (`GET /api/releases`), menampilkan artwork hover effect, nama artis, judul album, dan format badge.
- **Roster Spotlight:** Carousel atau grid foto artis (`GET /api/artists`).
- **Upcoming Tour Dates:** Tabel mini tour date (`GET /api/live`) dengan link beli tiket langsung.
- **Latest News / Dispatch:** 3 artikel berita terbaru (`GET /api/news`).
- **Footer:** Brand logo, navigasi cepat, copyright, tautan media sosial Tromagnon Records.

#### 2. Artists Page (`/artists` & `/artists/[slug]`)
- **Roster Index (`/artists`):** Grid kartu artis interaktif, search bar berdasarkan nama artis / filter berdasarkan genre badge.
- **Artist Detail (`/artists/[slug]`):**
  - Banner foto besar, nama artis, genre tags, biografi lengkap.
  - Tautan sosial media (Spotify, Instagram, YouTube) berbentuk icon button.
  - **Discography Section:** Grid rilisan yang hanya dimiliki artis tersebut.
  - **Upcoming Shows Section:** Daftar konser live event mendatang milik artis tersebut.

#### 3. Releases Page (`/releases` & `/releases/[slug]`)
- **Catalog Index (`/releases`):** Filter dropdown berdasarkan Format (`LP`, `EP`, `CD`, `Digital`), sorting tahun, dan search judul.
- **Release Detail (`/releases/[slug]`):**
  - Tampilan cover artwork resolusi tinggi (dengan efek vinyl record keluar saat hover jika memungkinkan).
  - Judul, artis (link ke `/artists/[slug]`), tahun rilis, badge format.
  - Deskripsi liner notes album.
  - **Streaming Embed / Links:** Tombol langsung menuju Spotify, Apple Music, Bandcamp.

#### 4. News / Journal (`/news` & `/news/[slug]`)
- **Index:** Layout bergaya editorial magazine. Tampilan kartu berita featured besar di atas, diikuti grid artikel lainnya. Tanggal rilis & nama penulis.
- **Detail:** Tampilan artikel panjang yang nyaman dibaca, cover header, author badge, format tanggal ramah manusia (contoh: *15 September 2026*), rekomendasi artis atau rilisan terkait.

#### 5. Live Events / Tour (`/live`)
- Tampilan list jadwal panggung rapi:
  - Kolom Tanggal (Badge besar), Venue & Kota, Artis, Status (`upcoming`, `past`, `cancelled`).
  - Tombol **"Get Tickets"** jika status `upcoming` dan `ticket_url` tersedia.
  - Tab Switcher: "Upcoming Dates" vs "Past Shows".

---

### 8.2 Admin CMS Pages (`/admin`)

#### 1. Login (`/admin/login`)
- Form email & password.
- Animasi loading saat submit.
- Menyimpan JWT token ke `cookie` (atau `localStorage`) & state global.
- Redirect otomatis ke `/admin` setelah login berhasil.
- Proteksi route: jika sudah login, dilarang buka `/admin/login`.

#### 2. Dashboard Overview (`/admin`)
- Ringkasan statistik (Cards): Total Artis, Total Rilisan, Berita Terbit, Event Mendatang, Banner Aktif.
- Tombol aksi cepat: "+ Tambah Artis", "+ Rilis Album", "+ Buat Berita", "+ Jadwalkan Live".

#### 3. Hero Banners Management (`/admin/hero`)
- Tabel list seluruh banner dengan urutan `order`.
- Kolom: Preview Gambar, Judul, Subtitle, Urutan (`order`), Status Aktif (`is_active`), Aksi (Edit, Delete).
- Form modal / page tambah & edit:
  - Upload `banner_image` dengan live preview.
  - Input: Judul, Subtitle, CTA Text, CTA Link, Nomor Urutan (`order`), Toggle Switch `is_active`.

#### 4. Artists Management (`/admin/artists`)
- List tabel dengan pagination / search. Menampilkan foto thumbnail, nama artis, status badge (`active`/`inactive`), genre tags.
- Form Tambah / Edit:
  - Drag & drop foto artis (`photo`).
  - Multi-input untuk Genre (user bisa mengetik dan menekan Enter untuk membuat tag).
  - Input Social Links (Instagram URL, Spotify URL, dll).
  - Rich text editor atau textarea untuk Biografi.
  - Status switch: `active` atau `inactive`.
- Tombol Soft Delete dengan konfirmasi modal.

#### 5. Releases Management (`/admin/releases`)
- List tabel rilisan lengkap dengan cover thumbnail, judul, nama artis, tahun, dan format.
- Form Tambah / Edit:
  - Dropdown pilih Artis (diambil dari `GET /api/admin/artists`).
  - Drag & drop `artwork`.
  - Multi-select format (`LP`, `EP`, `CD`, `Digital`, `Cassette`).
  - Input tahun rilis, deskripsi, dan URL streaming (Spotify, Apple Music, Bandcamp).
  - Status switch: `published` atau `draft`.

#### 6. News Management (`/admin/news`)
- List tabel artikel dengan cover, judul, author, status (`published`/`draft`), tanggal rilis.
- Form Tambah / Edit:
  - Drag & drop `cover` artikel.
  - Dropdown opsional: Relasi ke Artis tertentu atau Rilisan tertentu.
  - Input Penulis (*author*) dan Konten artikel.
  - Tombol aksi cepat: "Simpan sebagai Draft" vs "Terbitkan (Publish)".

#### 7. Live Events Management (`/admin/live`)
- List tabel event dengan tanggal, artis, kota, venue, status.
- Form Tambah / Edit:
  - Dropdown pilih Artis.
  - Date picker untuk `event_date` (format: `YYYY-MM-DD`).
  - Input: Kota, Negara, Venue, URL Tiket.
  - Dropdown Status: `upcoming`, `past`, `cancelled`.

---

## 9. Penanganan Error, Loading & UX Checklist

- [ ] **Skeletons & Shimmer Loading:** Gunakan skeleton loading card untuk list rilisan, list artis, dan hero slider sebelum data siap.
- [ ] **Empty States:** Tampilan ilustrasi / pesan ramah saat belum ada data (misal: "Belum ada jadwal konser mendatang").
- [ ] **Toast Notifications:** Feedback jelas saat aksi berhasil atau gagal (misal: "Artis berhasil ditambahkan!", "Gagal mengunggah gambar").
- [ ] **Confirm Dialogs:** Modal konfirmasi sebelum melakukan aksi destruktif (Soft Delete).
- [ ] **Mobile Responsiveness:** Menu navigasi hamburger di mobile, grid responsif 1 kolom (mobile) hingga 3-4 kolom (desktop).
- [ ] **SEO & Metadata:** Dynamic OpenGraph tags di Next.js untuk setiap artis, rilisan, dan berita.

---

## 10. Panduan Perintah Prompt untuk AI Agent Frontend

Gunakan prompt berikut saat memberikan tugas ke AI Agent pembuat frontend:

```markdown
Hai Agent, tolong bangunkan aplikasi Frontend untuk label rekaman "Tromagnon Records" menggunakan Next.js (App Router), TypeScript, dan Tailwind CSS sesuai dengan dokumen spesifikasi di PRD (prd_frontend.md).

Prioritas pengerjaan:
1. Setup konfigurasi Next.js, Tailwind, Axios client (dengan base URL http://localhost:8080/api), dan TypeScript interfaces.
2. Bangun halaman Publik:
   - Homepage dengan dynamic Hero Banner Slider, Featured Releases, Artist Spotlight, dan Tour Dates.
   - Halaman katalog & detail Artis (/artists & /artists/[slug]).
   - Halaman katalog & detail Rilisan (/releases & /releases/[slug]).
   - Halaman Berita & Detail Berita (/news & /news/[slug]).
   - Halaman Jadwal Konser (/live).
3. Bangun halaman Admin CMS (/admin):
   - Auth flow (Login, penyimpanan JWT, route protection).
   - CRUD lengkap dengan direct image upload multipart untuk Hero Banners, Artists, Releases, News, dan Live Events.
Pastikan tampilan memiliki estetika hitam-putih yang bersih, personal namun rapi (terinspirasi Siluh Records), responsive, dan bebas error TypeScript!
```