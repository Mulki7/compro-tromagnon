# Design System — Tromagnon Records

> **Versi 1.6** · Diperbarui 28 November 2026 · Standar acuan: WCAG 2.2 (AA)

Panduan visual resmi untuk ekosistem **Tromagnon Records** (Public Website & Label Admin Console): warna, tipografi, spasi, radius, komponen, pola layout, gerak, copywriting UI, dan aksesibilitas. Dirancang bergaya editorial bersih untuk membaca arsip rilisan, profil band, dan katalog fisik (*cassette* & *vinyl*), sekaligus menghadirkan konsol operasional bento yang berkarakter untuk tim label.

## Ringkasan Cepat

| Aspek | Keputusan |
| :--- | :--- |
| **DNA warna** | `#F1F2EE` Archival Off-White · `#111111` Matte Vinyl Ink · `#31605A` Pine Teal · `#224540` Deep Pine |
| **Proporsi warna** | 60% Background · 25% Surface · 10% Aksen · 5% Hover/Aktif (lihat catatan di §1) |
| **Font display** | `Salmont` (`next/font/local`): hero display & `H2` publik, *brand mark* sidebar & Page Title `H1` Admin |
| **Font aksen arsip (Khusus Public)** | `Collisio` (`next/font/local`): stempel format fisik (`12"`, `45 RPM`, `TAPE`), kode katalog (`TR010`), nomor slide, & aksen drop di halaman publik (**tidak dipakai di Admin Console**) |
| **Font utama (UI & Body)** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans): body, bio band, *liner notes*, navigasi, tombol, input form, sel tabel, ringkasan form, & angka KPI |
| **Bentuk (Public)** | Sudut hampir tegas (`2px`–`4px`), garis tipis, terasa seperti cetakan fisik / *vinyl sleeve* |
| **Bentuk (Admin)** | Sudut halus terstruktur (`6px` / `8px` / `12px`), bento full-height (`100dvh`), tanpa bayangan berat |
| **Aksesibilitas** | Teks ≥ 4.5:1, komponen UI ≥ 3:1 (`#767D75`), fokus keyboard 2px, `prefers-reduced-motion` |
| **Prinsip** | Konten arsip jadi pusat; kontras tipografi berat-vs-ringan; copywriting ringkas tanpa teks berulang |

---

## 1. Token Warna

### 1.1 Mode Terang & Semantik Dasar (Default)

| Token CSS | Token Tailwind (`tromagnon` / `admin`) | Nama | HEX | Penggunaan UI |
| :--- | :--- | :--- | :--- | :--- |
| `--bg-primary` | `tromagnon-bg` / `admin-canvas` | Archival Off-White | `#F1F2EE` | Kanvas utama halaman (60%) |
| — | `admin-surface` | Archival Sheet | `#FAFAF8` | Kartu bento utama & kontainer tabel di Admin |
| `--bg-surface` | `tromagnon-surface` / `admin-muted` | Warm Sleeve Stone | `#E4E6E0` | Kartu rilisan publik, panel sekunder / health card Admin (25%) |
| `--bg-elevated` | `tromagnon-elevated` / `admin-elevated` | Soft Paper Hover | `#D8DBD3` | Hover kartu/baris, chip sekunder, latar kontrol nonaktif |
| `--border-subtle` | `tromagnon-border` / `admin-border` | Sleeve Hairline | `#CFD3CA` | Garis pemisah dekoratif, bingkai kartu & grid katalog |
| `--border-strong` | `tromagnon-border-strong` / `admin-border-strong` | Spine Line | `#767D75` | Border input, select, checkbox, segmented control, tombol sekunder (3.76:1) |
| `--text-primary` | `tromagnon-ink` / `admin-ink` | Matte Vinyl Ink | `#111111` | Headline, judul rilisan, teks utama |
| `--text-secondary` | `tromagnon-muted` / `admin-sub` | Archive Graphite | `#565B58` | Metadata katalog, tahun rilis, label form, caption |
| `--text-disabled` | `tromagnon-disabled` / `admin-disabled` | Faded Print | `#8B908C` | Teks kontrol nonaktif (dipasangkan di atas `#D8DBD3`) |
| `--accent-primary` | `tromagnon-accent` / `admin-forest-soft` | Pine Teal | `#31605A` | Tombol CTA utama, tab aktif, stroke chart (10%) |
| `--accent-hover` | `tromagnon-accent-hover` / `admin-forest` | Deep Pine | `#224540` | Hover CTA, cincin fokus, sidebar Admin, panel ringkasan gelap |
| — | `admin-forest-deep` | Midnight Pine | `#16302C` | Border/hover permukaan gelap di dalam sidebar & kartu Deep Pine |
| `--accent-on-primary` | `tromagnon-on-accent` | Off-White on Pine | `#F1F2EE` | Teks/ikon di atas `#31605A` dan `#224540` |
| `--accent-dark-primary` | `admin-lime` | Light Pine Mint | `#7DB4A9` | Pil navigasi aktif di sidebar gelap, kartu KPI highlight, badge panah CTA |
| `--accent-dark-hover` | `admin-lime-hover` | Soft Sage Mint | `#9CCBC1` | Hover elemen highlight `#7DB4A9` & label sekunder di latar gelap |
| `--accent-dark-on-primary` | `admin-on-lime` | Deep Forest Ink | `#0B1A17` | Teks/ikon di atas `#7DB4A9` dan `#9CCBC1` (**7.64:1 AAA**) |

**Warna status** (wajib dipasangkan dengan ikon SVG + teks, jangan pernah mengandalkan warna saja):

| Token | Tailwind (`admin`) | Teks/Ikon HEX | Latar Tint HEX | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| `--status-success` | `admin-success` / `admin-success-soft` | `#2B6B3A` | `#DCEBDD` | Published, Active, Visible, baris tabel terpilih |
| `--status-warning` | `admin-amber` / `admin-amber-soft` | `#7A4F00` | `#F4E8CC` | Draft, aset belum lengkap (tanpa artwork/foto) |
| `--status-error` | `admin-danger` / `admin-danger-soft` | `#A3261F` | `#F3DEDB` | Error form, status Cancelled, aksi hapus |
| `--status-info` | `admin-info` / `admin-info-soft` | `#2F5E8C` | `#DCE6F0` | Upcoming show, informasi jadwal |

### 1.2 Mode Gelap (Opsional untuk Halaman Publik)

Aktif mengikuti `prefers-color-scheme` atau atribut `data-theme="dark"`.

| Token | HEX | Catatan |
| :--- | :--- | :--- |
| `--bg-primary` | `#101412` | Kanvas |
| `--bg-surface` | `#181D1B` | Kartu, panel |
| `--bg-elevated` | `#222826` | Hover, chip |
| `--border-subtle` | `#2E3532` | Pemisah dekoratif |
| `--border-strong` | `#6B746F` | Border kontrol interaktif |
| `--text-primary` | `#ECEEE9` | Teks utama |
| `--text-secondary` | `#A3AAA5` | Metadata |
| `--accent-primary` | `#7DB4A9` | Pine Teal versi terang |
| `--accent-hover` | `#9CCBC1` | Hover/aktif/fokus |
| `--accent-on-primary` | `#0B1A17` | Teks di atas tombol aksen |
| `--status-error` | `#F0A29B` | Error |
| `--status-success` | `#8FCB9F` | Sukses |

### 1.3 Aturan Penggunaan Warna

- **Tautan tekstual wajib bergaris bawah.** Kontras `#31605A` terhadap `#111111` hanya ~2.65:1, sehingga warna saja tidak cukup membedakan tautan dari teks biasa (WCAG 1.4.1).
- **`--border-subtle` (`#CFD3CA`) hanya untuk pemisah dekoratif & bingkai kartu.** Kontrasnya 1.35:1 terhadap latar; semua kontrol interaktif (input, select, checkbox, tombol sekunder, wrapper segmented) wajib memakai `--border-strong` (`#767D75`, kontras 3.76:1).
- Jangan menaruh teks sekunder lebih terang dari `#565B58` di atas kanvas terang.

---

## 2. Tipografi — Salmont, Plus Jakarta Sans, & Collisio (Public Only)

Sistem tipografi memisahkan kebutuhan ekspresif **Public Website** (3 font) dari kejernihan operasional **Admin Console** (**2 font saja: `Salmont` + `Plus Jakarta Sans`**):
- **`Salmont` (`font-display`, via `next/font/local` → `--font-salmont`)**: Dimuat dari `src/app/fonts/Salmont.woff2` (`display: "swap"`). Menjadi jangkar utama untuk *hero display* & `H2` publik, serta *brand mark* sidebar/login dan *Page Title* (`H1`) di Admin Console.
- **`Plus Jakarta Sans` (`font-sans` / `font-admin`, via `next/font/google` → `--font-plus-jakarta-sans`)**: Dimuat dengan bobot `300`, `400`, `500`, `600`, `700` (`display: "swap"`). Menjadi tulang punggung seluruh *body copy*, bio band, *liner notes*, navigasi, tombol, input form, sel tabel, ringkasan form, dan angka KPI.
- **`Collisio` (`font-stamp`, via `next/font/local` → `--font-collisio`, khusus Public Website)**: Dimuat dari `src/app/fonts/Collisio_Beta.otf` (`display: "swap"`). Digunakan terbatas **hanya di halaman publik** sebagai stempel arsip & aksen eksperimental—format fisik (`12"`, `45 RPM`, `TAPE`), kode katalog (`TR008`, `TR010`), nomor urutan slide (`01`, `02`), serta angka/judul drop spesial. **Tidak digunakan di Admin Console.**

### 2.1 Skala Tipografi

| Peran | Konteks | Font | Ukuran | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero (`H1`)** | Public | Salmont | `clamp(3rem, 2.2rem + 4.5vw, 5.25rem)` | `400` | `0.96` | `-0.02em` |
| **Section Heading (`H2`)** | Public | Salmont | `clamp(2rem, 1.5rem + 2vw, 2.75rem)` | `400` | `1.04` | `-0.015em` |
| **Page Title (`H1`) & Brand Mark** | Admin | Salmont | `24px` – `28px` (`34px` pada cover login) | `400` | `1.05` | `-0.015em` |
| **Card Title (`H2`)** | Admin | Plus Jakarta Sans | `18px` – `19px` | `700` | `1.2` | `-0.015em` |
| **Stempel Format / Kode Katalog** | Public Only | Collisio | `16px` – `22px` (label) · `40px–72px` (aksen promo) | `400` | `1.0` | `0.02em` |
| **Roster / Row Title (`H3`)** | Public / Admin | Plus Jakarta Sans | `20px–24px` (Public) · `15px–16px` (Admin) | `600` | `1.25` | `-0.01em` |
| **Body & Bio Band** | Public | Plus Jakarta Sans | `15px` – `16px` | `300`–`400` | `1.6` | `0` |
| **Input Form & Sel Tabel** | Admin | Plus Jakarta Sans | `14px` – `15px` | `400`–`500` | `1.45` | `0` |
| **Tombol & Navigasi** | Public / Admin | Plus Jakarta Sans | `13.5px` – `14.5px` | `500`–`600` | `1.0` | `0.06em` uppercase (Public) · sentence case (Admin) |
| **Metadata & Badge Status** | Public / Admin | Plus Jakarta Sans | `12px` – `13px` | `500` | `1.35` | `0.06em` uppercase (Public) · sentence case (Admin) |

### 2.2 Aturan Tipografi & Disiplin Peran Font

- **Admin Console murni 2 font (`Salmont` + `Plus Jakarta Sans`):** Jangan pernah menggunakan `Collisio` (`font-stamp`) di dalam `/admin`. Seluruh badge, nomor urutan, format rilisan, tabel, tombol, dan panel ringkasan di Admin menggunakan `Plus Jakarta Sans` agar fokus operasional tetap bersih dan mudah dipindai.
- **Batas penggunaan `Salmont`:** Hanya untuk teks pendek berukuran `≥ 24px` (`H1`/`H2` publik, *brand mark* sidebar/login, *hero cover* login, dan *Page Title* `H1` Admin). Jangan dipakai untuk paragraf, judul kartu kecil, label form, atau tombol.
- **Batas penggunaan `Collisio` (Khusus Public Website):** Maksimal **1–3 kata atau angka per elemen** (contoh: `TR010`, `12" LP`, `45 RPM`, `01`, `SOLD OUT`), dan **jangan pernah ditaruh di satu baris judul yang sama dengan `Salmont`**.
- **Kontras Bobot di Halaman Publik:** Pasangkan `Salmont` dengan `Plus Jakarta Sans` bobot `300` (Light) atau `400` (Regular) pada teks pengantar/deskripsi agar komposisi terasa lapang.
- **Tabular Numerals:** Selalu aktifkan `tabular-nums` pada `Plus Jakarta Sans` untuk angka KPI, jumlah item, tahun rilis, dan tanggal.
- **Lebar Baris:** Batasi teks panjang maksimal `68ch` agar bio dan *liner notes* nyaman dibaca.
- **Anti-Noise di Admin Console:**
  - Gunakan **sentence case** pada tab, tombol, badge status, dan judul kartu di Admin supaya antarmuka terasa tenang dan tidak ramai oleh *ALL-CAPS*.
  - **Hindari informasi ganda:** Jika tanggal sudah tampil di TopBar dan jumlah item sudah tampil di kartu KPI, jangan ulangi lagi di *eyebrow* header halaman.
  - Potong daftar tag/format panjang menjadi ringkas (contoh: `LP, EP +3`) agar baris tabel tetap bersih satu baris.

---

## 3. Spasi, Radius, & Arsitektur Layout

### 3.1 Skala Spasi (Basis 4px)

- `4px` (`p-1` / `gap-1`): Padding dalam wrapper segmented, jarak rapat ikon-badge.
- `6px` (`gap-1.5`): **Jarak wajib antar tombol di dalam Segmented Control / Tab Switcher** agar state hover tidak pernah menempel/bertabrakan dengan tab aktif.
- `8px` (`gap-2`): Jarak grup tombol aksi & chip.
- `14px`–`16px` (`gap-3.5` / `p-4`): Gap antar kartu bento & padding kartu kompak di Admin.
- `20px`–`24px` (`p-5` / `p-6`): Padding seksi form & gutter halaman publik.
- `64px`–`96px`: Jarak vertikal antar seksi di halaman publik.

### 3.2 Skala Radius & Elevasi

Sistem ini membedakan karakter sudut antara **Public Website** (cetakan fisik) dan **Admin Console** (alat kerja harian yang luwes):

| Konteks | Elemen | Radius | Kelas Tailwind |
| :--- | :--- | :--- | :--- |
| **Public Website** | Chip, tag, kartu rilisan, tombol | `2px` – `4px` | `rounded-[2px]` / `rounded-[4px]` |
| **Admin Console** | Badge status, chip format/genre, tombol dalam segmented, thumbnail kecil, checkbox | `6px` (`--radius-sm`) | `rounded-md` |
| **Admin Console** | Input, select, tombol CTA/sekunder, wrapper segmented, baris item dalam kartu | `8px` (`--radius-md`) | `rounded-lg` |
| **Admin Console** | Floating sidebar, kartu bento utama, kontainer tabel, panel ringkasan, modal | `12px` (`--radius-lg`) | `rounded-xl` |

- **Elevasi Tonal (Tanpa Bayangan Berat):** Semua kartu statis menggunakan `box-shadow: none` (`shadow-admin-card`). Pemisahan ruang dibangun dari kontras bidang warna (`#F1F2EE` → `#FAFAF8` → `#E4E6E0` → `#224540`) dan border `1px`.
- **Shadow Pop (`--shadow-pop`):** `0 4px 16px rgb(17 17 17 / 0.12)` (`shadow-admin-pop`) **hanya** digunakan untuk elemen mengambang: hasil pencarian global, popover notifikasi, mobile drawer, dan modal konfirmasi.

### 3.3 Pola Layout Admin Console (`/admin`)

1. **Full-Viewport Bento Shell (`lg:h-dvh lg:overflow-hidden`)**:
  - Di layar desktop (`≥ 1024px`), sidebar Deep Pine (`w-[224px] rounded-xl`) mengambang di sisi kiri dengan padding luar tipis (`p-2.5`).
  - Halaman **Overview (`/admin`)** dan **5 Halaman List (`releases`, `artists`, `news`, `live`, `hero`)** terkunci penuh `100dvh` tanpa scroll halaman luar: area daftar/tabel menggunakan `min-h-0 flex-1 overflow-auto` sehingga hanya isi daftar yang di-scroll bila item banyak, sementara header, KPI filter, dan strip bawah tetap utuh terlihat.
2. **Halaman List dengan Kartu Filter KPI (`KpiFilterRow`)**:
  - Baris kartu metrik interaktif (`All`, `Published`/`Active`, `Drafts`, dll.) berfungsi langsung sebagai filter tabel.
  - Mendukung seleksi multi-baris dengan **Bulk Action Bar** berwarna Deep Pine (`#224540`) yang muncul kontekstual di atas tabel.
3. **Halaman Form Create & Edit (2 Kolom Asimetris)**:
  - Kolom kiri (`lg:col-span-8`): Kartu form putih bersih (`#FAFAF8`) dengan `SegmentedToggle` untuk status, drag-and-drop `ImageUpload`, dan quick-add chips untuk genre/format.
  - Kolom kanan sticky (`lg:col-span-4`): `FormSummaryCard` berlapis Deep Pine (`#224540`) untuk ringkasan live + peringatan aset yang belum lengkap + kartu `Checklist` (`#E4E6E0`) dengan indikator progres.

---

## 4. Komponen Inti & Interaksi

### 4.1 Tombol

- **Primary (Light Surface):** Latar `#31605A`, teks `#F1F2EE`, hover `#224540`. Varian CTA utama di Admin (`PrimaryCtaPill`) menyertakan kotak aksen `#7DB4A9` berisi ikon panah di sisi kanan.
- **Primary on Dark Panel (`btnLime`):** Latar `#7DB4A9`, teks `#0B1A17`, hover `#9CCBC1` (dipakai di dalam panel ringkasan gelap `#224540`).
- **Secondary:** Latar `#FAFAF8` / transparan, teks `#111111`, border `1px solid #767D75`, hover `#D8DBD3`.
- **Danger:** Latar `#F3DEDB`, teks & border `#A3261F`, hover penuh `#A3261F` dengan teks `#F1F2EE`.
- **Disabled:** Jangan gunakan `opacity`. Gunakan latar `#D8DBD3` + teks `#8B908C` + `cursor: not-allowed`.

### 4.2 Segmented Control / Tab Switcher

- Wrapper wajib memakai `inline-flex items-center gap-1.5 rounded-lg border border-admin-border-strong bg-admin-muted p-1`.
- Setiap opsi di dalamnya memakai `rounded-md px-3`–`px-3.5`:
  - Aktif: `bg-admin-forest-soft text-[#F1F2EE]`
  - Nonaktif: `text-admin-sub hover:bg-admin-surface hover:text-admin-ink`

### 4.3 Input, Textarea, & Autentikasi

- Input satu baris (`inputClass`) memakai tinggi `40px`–`44px`, latar `#F1F2EE`, fokus berpindah ke `#FAFAF8` dengan border `#224540`.
- Textarea multi-baris wajib memakai `textareaClass` (tanpa tinggi tetap `h-10`) dengan `line-height: 1.55`.
- Label selalu terlihat di atas input (`labelClass`); placeholder bukan pengganti label.
- Form login menyediakan tombol *show/hide password*, mendukung *paste*, serta mengizinkan *autofill* pengelola kata sandi (WCAG 3.3.8).

---

## 5. Gerak (Motion)

| Token | Nilai | Pemakaian |
| :--- | :--- | :--- |
| `--duration-fast` | `120ms` | Hover tombol/baris, perubahan warna & border |
| `--duration-base` | `200ms` | Buka/tutup drawer, progress bar, fade |
| `--duration-slow` | `320ms` | Transisi donut chart, modal |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Kurva standar seluruh transisi (`ease-tromagnon`) |

- Hanya animasikan `opacity`, `transform`, `stroke-dashoffset`, dan warna. Jangan menganimasikan ukuran layout (`width`/`height` kontainer).
- **Wajib** menghormati `prefers-reduced-motion: reduce` (semua durasi diturunkan ke `0.01ms` di `globals.css`).

---

## 6. Implementasi di Codebase

### 6.1 File Referensi Utama

- `src/app/fonts/Salmont.woff2` — File font lokal `Salmont` (display utama Public & Admin `H1` / Brand Mark).
- `src/app/fonts/Collisio_Beta.otf` — File font lokal `Collisio` (stempel format & kode katalog khusus halaman publik).
- `src/app/layout.tsx` — Pemuatan `localFont` untuk `Salmont` (`--font-salmont`) & `Collisio` (`--font-collisio`), serta `Plus_Jakarta_Sans` (`--font-plus-jakarta-sans`).
- `src/app/globals.css` — Variabel CSS `:root`, aturan fokus `:focus-visible`, scrollbar, dan `prefers-reduced-motion`.
- `tailwind.config.ts` — Palet `tromagnon` dan `admin`, font family (`display` → `--font-salmont`, `stamp` → `--font-collisio`, `sans` & `admin` → `--font-plus-jakarta-sans`), shadow `admin-pop`, serta `ease-tromagnon`.
- `src/components/admin/formStyles.ts` — Kelas standar `inputClass`, `textareaClass`, `labelClass`, `formSectionClass`, dan varian tombol admin.
- `src/components/admin/ListControls.tsx` — `KpiFilterRow`, `SegmentedToggle`, `PrimaryCtaPill`, `SearchField`, `Thumb`, `RowActions`.
- `src/components/admin/FormSummaryCard.tsx` — Panel ringkasan sticky Deep Pine & checklist kelengkapan aset.

---

## 7. Aksesibilitas & Rasio Kontras Terverifikasi (WCAG 2.2 AA)

| Teks / Elemen | Latar | Rasio | Hasil |
| :--- | :--- | :--- | :--- |
| `#111111` (`admin-ink`) | `#F1F2EE` / `#FAFAF8` | **16.79:1 – 18.1:1** | AAA |
| `#565B58` (`admin-sub`) | `#F1F2EE` / `#FAFAF8` | **6.16:1 – 6.64:1** | AA |
| `#565B58` (`admin-sub`) | `#E4E6E0` (`admin-muted`) | **5.50:1** | AA |
| `#F1F2EE` (teks tombol) | `#31605A` (`admin-forest-soft`) | **6.33:1** | AA |
| `#F1F2EE` (teks sidebar/panel) | `#224540` (`admin-forest`) | **9.37:1** | AAA |
| `#0B1A17` (`admin-on-lime`) | `#7DB4A9` (`admin-lime`) | **7.64:1** | AAA |
| `#767D75` (`admin-border-strong`) | `#F1F2EE` / `#E4E6E0` | **3.37:1 – 3.76:1** | Lolos UI (1.4.11) |
| `#A3261F` (`status-error`) | `#F3DEDB` / `#F1F2EE` | **5.8:1 – 6.54:1** | AA |
| `#2B6B3A` (`status-success`) | `#DCEBDD` / `#F1F2EE` | **5.1:1 – 5.72:1** | AA |
| `#7A4F00` (`status-warning`) | `#F4E8CC` / `#F1F2EE` | **5.6:1 – 6.34:1** | AA |
| `#2F5E8C` (`status-info`) | `#DCE6F0` / `#F1F2EE` | **5.3:1 – 6.02:1** | AA |

### Checklist Kepatuhan

- **1.4.1 Use of Color (A):** `StatusBadge` selalu menampilkan ikon semantik + teks; tautan memiliki garis bawah.
- **1.4.3 & 1.4.11 Contrast (AA):** Seluruh teks ≥ 4.5:1 dan seluruh batas kontrol interaktif memakai `#767D75` (≥ 3:1).
- **2.4.7, 2.4.11, & 2.4.13 Focus Appearance (AA/AAA):** Cincin `:focus-visible` `2px solid #224540` + `scroll-padding-top: 5rem` + skip-to-content link di layout admin.
- **2.1.1 & Modal Focus Trap (A):** `ConfirmDialog` mengunci fokus `Tab`, mendukung tutup dengan `Escape`, dan mengembalikan fokus ke tombol pemicu.