# Video iklan: Modal Kerja PKS (Fintech Advisory)

Video pendek 9:16 (1080x1920, 35 saat, latar biru) untuk Reels, TikTok, Shorts dan WhatsApp Status.

| Fail | Kegunaan |
|---|---|
| `modal-kerja-pks.mp4` | Video siap, dengan suara, muzik latar dan kesan bunyi |
| `voiceover.m4a` | Rakaman suara. Masa babak dalam `scene.html` diselaraskan dengan rakaman ini |
| `scene.html` | Semua teks dan animasi. Buka dalam pelayar untuk pratonton |
| `music.py` | Jana muzik latar dan kesan bunyi daripada kod (bebas hak cipta) |
| `render.js` | Tukar `scene.html` dan audio kepada MP4 |

## Suara latar

Jika anda rakam semula suara, masa setiap babak (`data-scene` dan `data-in` dalam `scene.html`) perlu diselaraskan semula.

1. Rakam skrip di bawah guna telefon, di tempat yang senyap. Mula bercakap pada saat 0.
2. Simpan sebagai `voiceover.m4a` (atau `.mp3` / `.wav`) dalam folder ini.
3. Render semula. Muzik akan diperlahankan secara automatik bila anda bercakap.

| Masa | Skrip suara |
|---|---|
| 0 – 4s | "Pemilik bisnes PKS. Bisnes nak berkembang, tapi *cash flow* tersekat?" |
| 4 – 9.5s | "Nak tambah stok, gaji dan supplier perlu dibayar, projek besar pula masuk…" |
| 9.5 – 14s | "Penyelesaiannya: pembiayaan modal kerja untuk PKS." |
| 14 – 19s | "Ada pilihan pembiayaan Islamik, dan skim jaminan pembiayaan seperti CGC." |
| 19 – 24.5s | "Kami berpanel dengan 30 bank, dan bantu padankan bisnes anda dengan bank yang sesuai." |
| 24.5 – 29.5s | "Konsultasi dan semakan kelayakan, percuma." |
| 29.5 – 36s | "WhatsApp saya, Nurul Jannah dari Fintech Advisory, di 012-394 7764. Semak kelayakan bisnes anda hari ini." |

## Tukar teks dan render semula

1. Ubah teks dalam `scene.html` (setiap babak ditanda dengan komen, cth. `<!-- 5. 30 BANK PANEL -->`).
   Kesan bunyi ikut tanda `data-sfx` dan masa babak, jadi ia kekal selari bila masa berubah.
2. Jalankan dari folder utama repo (perlu Node, Playwright, ffmpeg, Python dengan numpy dan scipy):

```bash
node video/modal-kerja/render.js
```
