# Design System — Tromagnon Records

> **Versi 1.1** · Diperbarui 28 November 2026 · Standar acuan: WCAG 2.2 (AA)

Panduan visual untuk website **Tromagnon Records**: warna, tipografi, spasi, komponen, gerak, dan aksesibilitas. Pendekatannya mode terang bergaya editorial. Bersih untuk membaca arsip rilisan, profil band, dan katalog fisik (*cassette* & *vinyl*), dengan aksen hijau *pine teal* yang khas. Mode gelap tersedia sebagai opsi.

## Ringkasan Cepat

| Aspek | Keputusan |
| :--- | :--- |
| **DNA warna** | `#F1F2EE` Archival Off-White · `#111111` Matte Vinyl Ink · `#31605A` Pine Teal |
| **Proporsi warna** | 60% Background · 25% Surface · 10% Aksen · 5% Hover/Aktif (lihat catatan di §1) |
| **Font utama** | [Archivo Narrow](https://fonts.google.com/specimen/Archivo+Narrow): display, heading, roster, navigasi, CTA |
| **Font sekunder** | [Archivo](https://fonts.google.com/specimen/Archivo): body, bio band, *liner notes*, metadata |
| **Bentuk** | Sudut hampir tegas (2–4px), garis tipis, tanpa bayangan berat; terasa seperti cetakan |
| **Aksesibilitas** | Teks ≥ 4.5:1, komponen UI ≥ 3:1, target sentuh ≥ 44px (minimum WCAG 24px) |
| **Prinsip** | Konten arsip jadi pusat; dekorasi minimal; setiap warna punya tugas jelas |

---

## 1. Token Warna

### 1.1 Mode Terang (default)

| Token | Nama | HEX | RGB | Penggunaan UI |
| :--- | :--- | :--- | :--- | :--- |
| `--bg-primary` | Archival Off-White | `#F1F2EE` | `241, 242, 238` | Kanvas utama halaman (60%) |
| `--bg-surface` | Warm Sleeve Stone | `#E4E6E0` | `228, 230, 224` | Kartu rilisan, panel roster, box kutipan (25%) |
| `--bg-elevated` | Soft Paper Hover | `#D8DBD3` | `216, 219, 211` | Hover kartu, chip sekunder, baris tabel aktif |
| `--border-subtle` | Sleeve Hairline | `#CFD3CA` | `207, 211, 202` | Garis pemisah dekoratif & grid katalog |
| `--border-strong` | Spine Line | `#767D75` | `118, 125, 117` | Border input, checkbox, dan kontrol interaktif |
| `--text-primary` | Matte Vinyl Ink | `#111111` | `17, 17, 17` | Headline, judul rilisan, body copy |
| `--text-secondary` | Archive Graphite | `#565B58` | `86, 91, 88` | Metadata katalog, tahun rilis, caption |
| `--text-disabled` | Faded Print | `#8B908C` | `139, 144, 140` | Teks kontrol nonaktif (dikecualikan dari syarat kontras WCAG) |
| `--accent-primary` | Pine Teal | `#31605A` | `49, 96, 90` | Tombol CTA utama, judul aksen, tautan (10%) |
| `--accent-hover` | Deep Pine | `#224540` | `34, 69, 64` | Hover CTA, link aktif, cincin fokus (5%) |
| `--accent-on-primary` | Off-White on Pine | `#F1F2EE` | `241, 242, 238` | Teks/ikon di atas `--accent-primary` dan `--accent-hover` |

**Warna status** (selalu dipasangkan dengan ikon atau teks, jangan warna saja):

| Token | HEX | Latar tint | Penggunaan |
| :--- | :--- | :--- | :--- |
| `--status-error` | `#A3261F` | `#F3DEDB` | Error form, stok habis |
| `--status-warning` | `#7A4F00` | `#F4E8CC` | Peringatan, pre-order tertunda |
| `--status-success` | `#2B6B3A` | `#DCEBDD` | Pesanan berhasil, stok tersedia |
| `--status-info` | `#2F5E8C` | `#DCE6F0` | Informasi netral |

**Catatan proporsi:** aturan 60/25/10/5 adalah panduan komposisi visual per layar, bukan angka yang dihitung. Hover dan aktif adalah *state* dari aksen, jadi 5% itu anggaran maksimum kemunculan `--accent-hover` saat interaksi. Jaga agar `--accent-primary` tidak lebih dari kira-kira 10% area layar, supaya CTA tetap menonjol.

### 1.2 Mode Gelap (opsional)

Aktif mengikuti `prefers-color-scheme` atau atribut `data-theme="dark"`. Aksen diterangkan agar tetap lolos kontras di latar gelap.

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

- **Tautan di dalam paragraf wajib bergaris bawah.** Kontras `#31605A` terhadap `#111111` hanya sekitar 2.65:1, jadi warna saja tidak cukup membedakan tautan dari teks biasa (WCAG 1.4.1).
- **`--border-subtle` hanya untuk dekorasi** (garis grid, pemisah kartu). Kontrasnya 1.35:1 terhadap latar, jadi jangan dipakai sebagai satu-satunya penanda batas input atau tombol sekunder. Pakai `--border-strong`.
- Teks `--text-secondary` boleh dipakai di `--bg-primary`, `--bg-surface`, dan `--bg-elevated`. Jangan turunkan lebih terang dari `#565B58`.
- Jangan menaruh `--accent-primary` sebagai teks kecil di atas `--bg-elevated` tanpa cek ulang. Kontrasnya 5.08:1, masih lolos tapi sudah mepet.

---

## 2. Tipografi — Archivo Narrow & Archivo

Keduanya berasal dari keluarga huruf yang sama sehingga anatomi dan *x-height*-nya menyatu: `Archivo Narrow` menjaga karakter cetak arsip yang rapat dan tegas pada judul serta daftar rilisan, sementara `Archivo` (lebar normal) memberi ruang baca lega pada bio band dan artikel panjang.

### 2.1 Memuat Font

```html
<!-- HTML <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400..700;1,400..700&family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&display=swap">
```

```css
/* Alternatif via CSS (lebih lambat dari <link>, pakai hanya jika terpaksa) */
@import url("https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400..700;1,400..700&family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&display=swap");
```

**Performa & privasi:** untuk produksi, pertimbangkan *self-host* file `woff2` (misalnya lewat [Fontsource](https://fontsource.org/fonts/archivo-narrow)) agar tidak bergantung pada pihak ketiga dan bisa di-*preload*. Muat hanya weight yang dipakai (`400`, `500`, `600`, `700`). Pertahankan `font-display: swap`.

### 2.2 Skala Tipografi

Ukuran heading memakai `clamp()` supaya mengalir mulus antar lebar layar, tanpa lompatan breakpoint.

| Peran | Font | Ukuran fluid (min → maks) | Weight | Line Height | Letter Spacing | Warna Default |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero (`H1`)** | Archivo Narrow | `clamp(3rem, 2rem + 4vw, 4.5rem)` (48 → 72px) | `700` | `0.95` | `-0.02em` | `--text-primary` |
| **Section Heading (`H2`)** | Archivo Narrow | `clamp(2rem, 1.5rem + 2vw, 2.5rem)` (32 → 40px) | `700` | `1.05` | `-0.015em` | `--text-primary` |
| **Roster Band / List (`H3`)** | Archivo Narrow | `clamp(1.5rem, 1.25rem + 1vw, 1.75rem)` (24 → 28px) | `600` | `1.15` | `-0.01em` | `--accent-primary` |
| **Body Copy / Bio Band** | Archivo | `1rem` (16px) | `400` | `1.6` | `0` | `--text-primary` |
| **Navigasi & Tombol CTA** | Archivo Narrow | `0.875rem` (14px) | `600` | `1.0` | `0.06em`, uppercase | `--text-primary` / `--accent-on-primary` |
| **Metadata / Kode Katalog** | Archivo | `0.8125rem` (13px) | `500` | `1.35` | `0.06em`, uppercase | `--text-secondary` |

**Perubahan dari versi sebelumnya:** body di mobile naik dari 15px ke **16px**. Ukuran di bawah 16px pada kolom input memicu *auto-zoom* di iOS Safari, dan 16px lebih nyaman dibaca untuk bio band yang panjang.

### 2.3 Aturan Penggunaan Font

- **Archivo Narrow** (`600`–`700`): elemen penarik perhatian seperti judul halaman, nama artis, judul rilisan, navigasi, tombol.
- **Archivo** (`400`–`500`): paragraf, deskripsi album, *liner notes*, metadata kecil. Pakai Archivo (bukan Narrow) untuk semua teks di bawah 14px.
- **Lebar baris** teks panjang: 60–75 karakter (`max-width: 68ch`). Bio band dan *liner notes* jangan melebar penuh di desktop.
- **Angka katalog** (kode rilisan, tahun, harga): tambahkan `font-variant-numeric: tabular-nums` agar kolom angka sejajar rapi.
- **Perataan:** rata kiri untuk teks panjang. Hindari *justify* dan teks tengah di paragraf lebih dari tiga baris.
- **Uppercase** hanya untuk label pendek (navigasi, tombol, metadata). Jangan untuk kalimat utuh.
- **Opsional:** untuk judul bergaya poster fisik yang sangat berat, [Archivo Black](https://fonts.google.com/specimen/Archivo+Black) serasi dipasangkan khusus untuk `H1`.

---

## 3. Spasi, Bentuk, & Layout

### 3.1 Skala Spasi (basis 4px)

| Token | Nilai | Pemakaian umum |
| :--- | :--- | :--- |
| `--space-1` | `4px` | Jarak ikon–teks |
| `--space-2` | `8px` | Padding chip, jarak elemen rapat |
| `--space-3` | `12px` | Padding vertikal tombol |
| `--space-4` | `16px` | Gutter mobile, padding kartu kecil |
| `--space-6` | `24px` | Padding kartu, gutter desktop |
| `--space-8` | `32px` | Jarak antar grup konten |
| `--space-12` | `48px` | Jarak antar blok |
| `--space-16` | `64px` | Jarak antar seksi (mobile) |
| `--space-24` | `96px` | Jarak antar seksi (desktop) |

### 3.2 Bentuk & Elevasi

| Token | Nilai | Pemakaian |
| :--- | :--- | :--- |
| `--radius-sm` | `2px` | Chip, tag, input |
| `--radius-md` | `4px` | Tombol, kartu |
| `--border-width` | `1px` | Semua garis tipis |
| `--shadow-none` | `none` | Default. Elevasi dibangun lewat perubahan warna latar, bukan bayangan |
| `--shadow-pop` | `0 4px 16px rgb(17 17 17 / 0.12)` | Hanya untuk dropdown, modal, dan toast |

### 3.3 Grid & Breakpoint

- **Container:** `max-width: 1200px`, padding sisi `16px` (mobile) / `24px` (≥ 768px).
- **Kolom:** 4 kolom (mobile), 8 kolom (tablet), 12 kolom (desktop). Gap `16px` / `24px`.
- **Breakpoint:** `640px` · `768px` · `1024px` · `1280px` (pendekatan *mobile-first*, pakai `min-width`).
- **Grid katalog rilisan:** 2 kolom (mobile), 3 kolom (tablet), 4 kolom (desktop). Sampul rilisan selalu `aspect-ratio: 1 / 1`.

---

## 4. Komponen Inti

### 4.1 Tombol

| Varian | Latar | Teks | Border | Hover | Penggunaan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary** | `--accent-primary` | `--accent-on-primary` | tidak ada | `--accent-hover` | 1 aksi utama per layar (Beli, Dengarkan) |
| **Secondary** | transparan | `--text-primary` | 1px `--border-strong` | latar `--bg-elevated` | Aksi pendukung |
| **Text / Link** | transparan | `--accent-primary` + garis bawah | tidak ada | `--accent-hover` | Aksi tersier, navigasi dalam konten |

- Tinggi minimum **44px** (WCAG 2.2 mensyaratkan minimal 24×24px; 44px lebih nyaman untuk jempol). Padding `12px 20px`.
- Label memakai gaya *Navigasi & Tombol CTA* (§2.2).
- State **disabled**: opacity tidak dipakai. Gunakan `--bg-elevated` + `--text-disabled`, dan `cursor: not-allowed`.

### 4.2 Kartu Rilisan

- Latar `--bg-surface`, radius `--radius-md`, tanpa bayangan; hover mengubah latar ke `--bg-elevated`.
- Susunan: sampul 1:1 → kode katalog (metadata) → judul (Archivo Narrow 600) → artis → format (*cassette* / *vinyl*) dan tahun.
- Seluruh kartu adalah satu target klik. Gunakan satu tautan utama, jangan menumpuk beberapa tautan di dalam kartu.
- Sampul wajib punya `alt` bermakna (judul + artis), dan `loading="lazy"` di bawah fold.

### 4.3 Form & Input

- Tinggi `44px`, latar `--bg-primary`, border 1px `--border-strong` (kontras 3.76:1, lolos syarat 3:1 untuk komponen UI).
- Label selalu terlihat di atas input. Placeholder bukan pengganti label.
- Error: border + teks `--status-error`, ikon, dan pesan spesifik di bawah input. Jangan mengandalkan warna saja.
- Checkout dan login: jangan memblokir *paste*, mendukung *autofill* dan pengelola kata sandi (WCAG 3.3.8, 3.3.7).

### 4.4 Navigasi

- Teks Archivo Narrow 600 uppercase. Halaman aktif ditandai garis bawah 2px `--accent-primary`, bukan hanya warna.
- Header yang menempel (*sticky*) tidak boleh menutupi elemen yang sedang fokus keyboard. Tambahkan `scroll-padding-top` setara tinggi header (WCAG 2.4.11).

---

## 5. Gerak (Motion)

| Token | Nilai | Pemakaian |
| :--- | :--- | :--- |
| `--duration-fast` | `120ms` | Hover, perubahan warna |
| `--duration-base` | `200ms` | Buka/tutup menu, fade |
| `--duration-slow` | `320ms` | Transisi halaman, modal |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Semua transisi |

- Animasikan `opacity`, `transform`, dan warna. Hindari menganimasikan ukuran atau posisi layout.
- **Wajib** hormati preferensi pengguna: dalam `prefers-reduced-motion: reduce`, matikan animasi non-esensial, parallax, dan *autoplay*.
- Gaya katalog arsip cocok dengan gerak yang tenang. Hindari efek scroll yang mencolok yang bersaing dengan konten.
- Pemutar audio dan video tidak boleh *autoplay* bersuara. Sediakan kontrol jeda yang jelas.

---

## 6. CSS Variables

```css
:root {
  color-scheme: light dark;

  /* Colors — light */
  --bg-primary: #F1F2EE;
  --bg-surface: #E4E6E0;
  --bg-elevated: #D8DBD3;
  --border-subtle: #CFD3CA;
  --border-strong: #767D75;

  --text-primary: #111111;
  --text-secondary: #565B58;
  --text-disabled: #8B908C;

  --accent-primary: #31605A;
  --accent-on-primary: #F1F2EE;
  --accent-hover: #224540;

  --status-error: #A3261F;
  --status-error-bg: #F3DEDB;
  --status-warning: #7A4F00;
  --status-warning-bg: #F4E8CC;
  --status-success: #2B6B3A;
  --status-success-bg: #DCEBDD;
  --status-info: #2F5E8C;
  --status-info-bg: #DCE6F0;

  /* Typography */
  --font-primary: "Archivo Narrow", "Arial Narrow", "Helvetica Neue", Arial, sans-serif;
  --font-secondary: "Archivo", "Helvetica Neue", Arial, system-ui, sans-serif;
  --tracking-display: -0.02em;
  --tracking-label: 0.06em;

  --text-h1: clamp(3rem, 2rem + 4vw, 4.5rem);
  --text-h2: clamp(2rem, 1.5rem + 2vw, 2.5rem);
  --text-h3: clamp(1.5rem, 1.25rem + 1vw, 1.75rem);
  --text-body: 1rem;
  --text-label: 0.875rem;
  --text-meta: 0.8125rem;

  /* Spacing, shape, motion */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px; --space-24: 96px;
  --radius-sm: 2px;
  --radius-md: 4px;
  --shadow-pop: 0 4px 16px rgb(17 17 17 / 0.12);
  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 320ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
}

/* Mode gelap: otomatis mengikuti sistem, kecuali pengguna memaksa terang */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg-primary: #101412;
    --bg-surface: #181D1B;
    --bg-elevated: #222826;
    --border-subtle: #2E3532;
    --border-strong: #6B746F;
    --text-primary: #ECEEE9;
    --text-secondary: #A3AAA5;
    --accent-primary: #7DB4A9;
    --accent-hover: #9CCBC1;
    --accent-on-primary: #0B1A17;
    --status-error: #F0A29B;
    --status-success: #8FCB9F;
  }
}

/* Pilihan manual lewat toggle */
:root[data-theme="dark"] {
  --bg-primary: #101412;
  --bg-surface: #181D1B;
  --bg-elevated: #222826;
  --border-subtle: #2E3532;
  --border-strong: #6B746F;
  --text-primary: #ECEEE9;
  --text-secondary: #A3AAA5;
  --accent-primary: #7DB4A9;
  --accent-hover: #9CCBC1;
  --accent-on-primary: #0B1A17;
  --status-error: #F0A29B;
  --status-success: #8FCB9F;
}

/* Dasar */
body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-secondary);
  font-size: var(--text-body);
  line-height: 1.6;
}

h1, h2, h3, nav, .btn { font-family: var(--font-primary); }

p a { color: var(--accent-primary); text-decoration: underline; text-underline-offset: 0.2em; }
p a:hover { color: var(--accent-hover); }

/* Fokus keyboard: terlihat jelas di semua elemen interaktif */
:focus-visible {
  outline: 2px solid var(--accent-hover);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Header sticky tidak menutupi elemen yang difokus */
html { scroll-padding-top: 5rem; }

/* Hormati preferensi gerak */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Konfigurasi Tailwind CSS

### Tailwind v4 (CSS-first, direkomendasikan)

```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-tromagnon-bg: #F1F2EE;
  --color-tromagnon-surface: #E4E6E0;
  --color-tromagnon-elevated: #D8DBD3;
  --color-tromagnon-border: #CFD3CA;
  --color-tromagnon-border-strong: #767D75;
  --color-tromagnon-ink: #111111;
  --color-tromagnon-muted: #565B58;
  --color-tromagnon-accent: #31605A;
  --color-tromagnon-on-accent: #F1F2EE;
  --color-tromagnon-accent-hover: #224540;

  --font-display: "Archivo Narrow", "Arial Narrow", "Helvetica Neue", Arial, sans-serif;
  --font-sans: "Archivo", "Helvetica Neue", Arial, system-ui, sans-serif;
}
```

### Tailwind v3 (`tailwind.config.js`)

```js
export default {
  theme: {
    extend: {
      colors: {
        tromagnon: {
          bg: "#F1F2EE",
          surface: "#E4E6E0",
          elevated: "#D8DBD3",
          border: "#CFD3CA",
          "border-strong": "#767D75",
          ink: "#111111",
          muted: "#565B58",
          accent: "#31605A",
          "on-accent": "#F1F2EE",
          "accent-hover": "#224540",
        },
      },
      fontFamily: {
        display: ['"Archivo Narrow"', '"Arial Narrow"', "Arial", "sans-serif"],
        sans: ['"Archivo"', '"Helvetica Neue"', "Arial", "sans-serif"],
      },
    },
  },
};
```

---

## 8. Aksesibilitas

### 8.1 Rasio Kontras Terverifikasi

Dihitung dengan rumus kontras WCAG 2.x. Ambang: teks normal ≥ 4.5:1, teks besar (≥ 24px, atau ≥ 18.66px bold) ≥ 3:1, komponen UI ≥ 3:1.

**Mode terang**

| Teks / Elemen | Latar | Rasio | Hasil |
| :--- | :--- | :--- | :--- |
| `--text-primary` `#111111` | `--bg-primary` | **16.79:1** | AAA |
| `--text-primary` | `--bg-surface` | **15.01:1** | AAA |
| `--text-primary` | `--bg-elevated` | **13.48:1** | AAA |
| `--text-secondary` `#565B58` | `--bg-primary` | **6.16:1** | AA |
| `--text-secondary` | `--bg-surface` | **5.50:1** | AA |
| `--text-secondary` | `--bg-elevated` | **4.94:1** | AA |
| `--accent-primary` `#31605A` | `--bg-primary` | **6.33:1** | AA |
| `--accent-primary` | `--bg-surface` | **5.66:1** | AA |
| `--accent-primary` | `--bg-elevated` | **5.08:1** | AA |
| `--accent-hover` `#224540` | `--bg-primary` | **9.37:1** | AAA |
| `--accent-on-primary` | `--accent-primary` (tombol) | **6.33:1** | AA |
| `--accent-on-primary` | `--accent-hover` (tombol hover) | **9.37:1** | AAA |
| `--border-strong` `#767D75` | `--bg-primary` | **3.76:1** | Lolos komponen UI |
| `--border-strong` | `--bg-surface` | **3.37:1** | Lolos komponen UI |
| `--border-subtle` `#CFD3CA` | `--bg-primary` | 1.35:1 | Hanya dekoratif |
| `--status-error` `#A3261F` | `--bg-primary` | **6.54:1** | AA |
| `--status-success` `#2B6B3A` | `--bg-primary` | **5.72:1** | AA |
| `--status-warning` `#7A4F00` | `--bg-primary` | **6.34:1** | AA |
| `--status-info` `#2F5E8C` | `--bg-primary` | **6.02:1** | AA |

**Mode gelap**

| Teks / Elemen | Latar | Rasio | Hasil |
| :--- | :--- | :--- | :--- |
| `--text-primary` `#ECEEE9` | `--bg-primary` `#101412` | **15.89:1** | AAA |
| `--text-secondary` `#A3AAA5` | `--bg-primary` | **7.83:1** | AAA |
| `--text-secondary` | `--bg-elevated` `#222826` | **6.32:1** | AA |
| `--accent-primary` `#7DB4A9` | `--bg-primary` | **7.94:1** | AAA |
| `--accent-on-primary` `#0B1A17` | `--accent-primary` (tombol) | **7.64:1** | AAA |
| `--border-strong` `#6B746F` | `--bg-primary` | **3.85:1** | Lolos komponen UI |
| `--status-error` `#F0A29B` | `--bg-primary` | **9.15:1** | AAA |

### 8.2 Checklist WCAG 2.2

| Kriteria | Level | Penerapan di sistem ini |
| :--- | :--- | :--- |
| 1.4.3 Contrast (Minimum) | AA | Semua pasangan teks di §8.1 lolos |
| 1.4.11 Non-text Contrast | AA | Border input dan kontrol memakai `--border-strong` |
| 1.4.1 Use of Color | A | Tautan bergaris bawah; status selalu disertai ikon/teks |
| 2.4.7 / 2.4.11 Focus Visible & Not Obscured | AA | `:focus-visible` + `scroll-padding-top` untuk header sticky |
| 2.4.13 Focus Appearance | AAA | Cincin fokus 2px `--accent-hover` (kontras 9.37:1 terhadap latar) memenuhi ketebalan dan kontras yang disyaratkan |
| 2.5.8 Target Size (Minimum) | AA | Target ≥ 24×24px; standar internal 44px |
| 3.3.7 / 3.3.8 Redundant Entry & Accessible Authentication | A / AA | Form checkout mengizinkan *paste* dan *autofill* |
| 2.3.3 / `prefers-reduced-motion` | AAA / praktik baik | Animasi non-esensial dimatikan |

### 8.3 Catatan Lain

- **Jangan andalkan kontras APCA / WCAG 3.** Per April 2026, WCAG 3.0 masih berstatus draf dan metode kontrasnya belum ditetapkan. WCAG 2.x tetap standar yang harus dipenuhi dan dirujuk secara hukum.
- Ikon fungsional dan teks pada gambar sampul rilisan perlu `alt` atau label teks. Jangan menyampaikan info penting hanya lewat gambar.
- Tes rutin: navigasi keyboard penuh, zoom 200% tanpa kehilangan konten, pembaca layar (VoiceOver/TalkBack), dan mode gelap.
- Untuk produksi, uji ulang di alat seperti axe DevTools atau Lighthouse, karena kontras di atas gambar atau gradasi tidak bisa dihitung dari token saja.

---

## 9. Roadmap Berikutnya

Bagian yang belum ada di versi ini dan bisa ditambahkan seiring website berkembang:

- **Design tokens lintas platform:** spesifikasi [Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/2025.10/) dari W3C Design Tokens Community Group sudah mencapai versi stabil pertama. Cocok bila token ingin dibagi ke Figma, web, dan aplikasi lain dari satu sumber JSON.
- Panduan **ikonografi** (gaya garis, ukuran 20/24px).
- Panduan **fotografi & sampul** (rasio, perlakuan warna, cara menampilkan foto band).
- **Pola halaman**: detail rilisan, profil band, keranjang/checkout, halaman arsip.
- **Voice & tone** copy (nama format, penulisan kode katalog, bahasa Indonesia vs Inggris).