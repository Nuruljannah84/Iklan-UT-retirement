# Video iklan: Modal Kerja PKS

Video pendek 9:16 (1080x1920, 31 saat) untuk Reels, TikTok, Shorts dan WhatsApp Status.

- `modal-kerja-pks.mp4`: video siap (tanpa suara, ada trek audio senyap supaya boleh tambah lagu di TikTok/IG).
- `scene.html`: semua teks dan animasi. Buka dalam pelayar untuk pratonton.
- `render.js`: tukar `scene.html` kepada MP4.

## Tukar teks dan render semula

1. Ubah teks dalam `scene.html` (setiap babak ditanda dengan komen, cth. `<!-- 4. 30 BANK PANEL -->`).
2. Jalankan dari folder utama repo (perlu Node, Playwright dan ffmpeg):

```bash
node video/modal-kerja/render.js
```
