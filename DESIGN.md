# Design System — Tromagnon Records: Satelit Light

Panduan warna dan tipografi mode terang untuk website **Tromagnon Records**, diturunkan langsung dari identitas visual proyek kompilasi vinyl **Satelit** (Tromagnon Records x Loide Records). Dirancang untuk tampilan editorial ala *vinyl sleeve*, *liner notes*, dan arsip katalog bacaan yang bersih tanpa kehilangan karakter hijau Satelit.

- **DNA Warna Inti:** `#F1F2EE` (Archival Off-White), `#111111` (Matte Vinyl Ink), `#31605A` (Satelit Pine Teal)
- **Aturan Proporsi:** 60% Background · 25% Surface · 10% Primary Accent · 5% Hover / Active Accent
- **Tipografi Utama:** [Archivo Narrow](https://fonts.google.com/specimen/Archivo+Narrow) (Google Fonts — *variable neo-grotesque* sempit untuk cetak & digital)

## 1. Token Warna

| Token | Nama Warna | HEX | RGB | Proporsi | Penggunaan UI |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--bg-primary` | Archival Off-White | `#F1F2EE` | `241, 242, 238` | 60% | Kanvas utama halaman |
| `--bg-surface` | Warm Sleeve Stone | `#E4E6E0` | `228, 230, 224` | 25% | Kartu rilisan, panel roster, box kutipan |
| `--bg-elevated` | Soft Paper Hover | `#D8DBD3` | `216, 219, 211` | — | Hover kartu, chip sekunder |
| `--border-subtle` | Sleeve Hairline | `#CFD3CA` | `207, 211, 202` | — | Garis pemisah tipis & grid katalog |
| `--text-primary` | Matte Vinyl Ink | `#111111` | `17, 17, 17` | — | Headline, judul rilisan, body copy |
| `--text-secondary` | Archive Graphite | `#565B58` | `86, 91, 88` | — | Metadata katalog, tahun rilis, caption |
| `--accent-primary` | Satelit Pine Teal | `#31605A` | `49, 96, 90` | 10% | Tombol CTA utama, judul aksen, daftar band |
| `--accent-hover` | Deep Bogor Pine | `#224540` | `34, 69, 64` | 5% | Hover tombol CTA, link aktif, border fokus |

## 2. Tipografi — Archivo Narrow

`Archivo Narrow` dipilih karena proporsinya ramping, tegas, dan dibuat khusus untuk menjembatani karakter cetak arsip (*sleeve*, poster, *liner notes*) dengan keterbacaan layar modern.

### Import Google Fonts

```html
<!-- HTML <head> -->
<link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
<link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
<link href="[https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&display=swap](https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&display=swap)" rel="stylesheet">
```

```css
/* Alternatif via CSS */
@import url('[https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&display=swap](https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&display=swap)');
```

### Skala Tipografi

| Peran | Ukuran (Desktop / Mobile) | Weight | Line Height | Letter Spacing | Warna Default |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero (`H1`)** | `4.5rem` (72px) / `3rem` (48px) | `700` (Bold) | `0.95` | `-0.02em` | `--text-primary` |
| **Section Heading (`H2`)** | `2.5rem` (40px) / `2rem` (32px) | `700` (Bold) | `1.05` | `-0.015em` | `--text-primary` |
| **Roster Band / List (`H3`)** | `1.75rem` (28px) / `1.5rem` (24px) | `600` (SemiBold) | `1.15` | `-0.01em` | `--accent-primary` |
| **Body Copy** | `1.0625rem` (17px) / `1rem` (16px) | `400` (Regular) | `1.55` | `0em` | `--text-primary` |
| **Navigasi & Tombol CTA** | `0.875rem` (14px) | `600` (SemiBold) | `1.0` | `0.06em` (Uppercase) | `--text-primary` / `--accent-on-primary` |
| **Metadata / Kode Katalog** | `0.8125rem` (13px) | `500` (Medium) | `1.3` | `0.08em` (Uppercase) | `--text-secondary` |

### Catatan Penggunaan Font

- Karena `Archivo Narrow` bertipe *condensed*, gunakan ukuran `body` minimal **16px–17px** dengan `line-height: 1.55` agar paragraf *liner notes* tetap lega dan nyaman dibaca.
- Untuk daftar 12 band Satelit atau judul rilisan, bobot **SemiBold (`600`)** dan **Bold (`700`)** dengan `letter-spacing` agak rapat (`-0.01em` sampai `-0.02em`) paling mendekati proporsi poster resmi Satelit.
- Jika suatu saat butuh judul super berat bergaya poster fisik mirip Blezja, `Archivo Narrow` sangat serasi dipasangkan dengan keluarga satu serinya, [Archivo Black](https://fonts.google.com/specimen/Archivo+Black), khusus untuk `H1`.

## 3. CSS Variables

```css
:root {
  /* Colors — Satelit Light */
  --bg-primary: #F1F2EE;
  --bg-surface: #E4E6E0;
  --bg-elevated: #D8DBD3;
  --border-subtle: #CFD3CA;

  --text-primary: #111111;
  --text-secondary: #565B58;

  --accent-primary: #31605A;
  --accent-on-primary: #F1F2EE;
  --accent-hover: #224540;

  /* Typography */
  --font-primary: "Archivo Narrow", -apple-system, BlinkMacSystemFont, sans-serif;
  --tracking-display: -0.02em;
  --tracking-label: 0.08em;
}
```

## 4. Konfigurasi Tailwind CSS

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        satelit: {
          bg: "#F1F2EE",
          surface: "#E4E6E0",
          elevated: "#D8DBD3",
          border: "#CFD3CA",
          ink: "#111111",
          muted: "#565B58",
          accent: "#31605A",
          "on-accent": "#F1F2EE",
          "accent-hover": "#224540",
        },
      },
      fontFamily: {
        sans: ['"Archivo Narrow"', "sans-serif"],
        satelit: ['"Archivo Narrow"', "sans-serif"],
      },
    },
  },
};
```

## 5. Catatan Aksesibilitas

- Warna asli `#31605A` di atas latar `#F1F2EE` memiliki rasio kontras sekitar **6.4:1** (lolos WCAG AA untuk teks normal maupun besar).
- Warna `#111111` di atas `#F1F2EE` menghasilkan kontras tajam tanpa terasa terlalu silau dibanding putih murni `#FFFFFF`.
- Hindari memakai `Archivo Narrow` di bawah `13px` untuk informasi penting karena lebar hurufnya yang sempit bisa mengurangi keterbacaan di layar ponsel.