# Jannah Financial: Website Perancangan Kewangan Holistik

Website untuk servis perancangan kewangan holistik (Takaful, Unit Trust & PRS) serta pengambilan perunding baharu.

Laman langsung: https://jannahfinancial.netlify.app/

## Halaman

| Fail | Kandungan |
|---|---|
| `index.html` | Laman utama: tiga tiang kewangan, semakan kesihatan kewangan, profil, borang hubungi |
| `perlindungan.html` | Takaful perubatan, penyakit kritikal, hayat/hibah dan kalkulator keperluan perlindungan |
| `persaraan.html` | Unit Trust, PRS dan kalkulator persaraan |
| `kerjaya.html` | Pengambilan (recruitment): kenapa sertai, langkah menyertai, borang daftar minat |
| `style.css` | Reka bentuk dan warna |
| `script.js` | Tetapan, kalkulator dan pautan WhatsApp |
| `images/` | Gambar profil dan gambar pratonton pautan (`og-image.jpg`) |

## Tukar maklumat anda

Buka `script.js` dan ubah bahagian `CONFIG` di bahagian atas:

```js
const CONFIG = {
  brand: "Jannah Financial",
  name: "Nurul Jannah Mahmud",
  fimm: "F02024801",
  takaful: "8431Q",         // kod ejen AIA PUBLIC Takaful; kosong = tidak dipaparkan
  whatsapp: "60123947764",  // kod negara 60, tanpa "+" atau sengkang
  ...
};
```

Teks lain (tajuk, penerangan, soalan lazim) boleh diubah terus dalam fail `.html` berkaitan.
Nombor WhatsApp yang dipaparkan di footer (`012-394 7764`) juga ditulis terus dalam setiap fail `.html`.

## Untuk ahli pasukan

Ahli pasukan boleh guna templat ini untuk website sendiri:
1. Fork / salin repo ini.
2. Tukar `CONFIG` dalam `script.js` (nama, FIMM, kod ejen takaful, WhatsApp).
3. Ganti gambar dalam `images/` dengan gambar sendiri (nama fail yang sama).
4. Hidupkan GitHub Pages (lihat di bawah).

## Hosting (Netlify, percuma)

Laman dihoskan di Netlify dan disambungkan terus ke repo ini. Setiap kali perubahan di-push,
Netlify akan kemas kini laman secara automatik dalam 1–2 minit.

- Tetapan build ada dalam `netlify.toml` (laman statik, tiada build).
- Nama laman ditukar di Netlify: **Site configuration → Change site name**.
- Jika nama laman bertukar, kemas kini juga pautan `og:image` dalam setiap fail `.html`.

## Pematuhan

Sebelum berkongsi secara meluas, dapatkan kelulusan pematuhan (compliance) daripada Manulife Investment Management (M) Berhad dan AIA PUBLIC Takaful Bhd., kerana kebanyakan syarikat mewajibkan bahan pemasaran ejen diluluskan terlebih dahulu.
