# Video: Agihan Gaji 50/10/10/10/10/10

Video menegak 1080x1920, 66 saat, untuk Reels / TikTok / Story. Tiada audio (trek senyap): tambah muzik dari pustaka IG/TikTok semasa posting.

| Fail | Guna |
|---|---|
| `agihan-gaji-50-10.mp4` | Video siap |
| `index.html` | Sumber animasi. Buka dalam pelayar untuk pratonton |
| `render.js` | Rakam semula: `node render.js` (perlu Playwright + ffmpeg) |

## Suara latar (ElevenLabs)
Skrip suara ada dalam `voice/script.json` (satu baris setiap babak). `voice/tts.py` menjana suara, memanjangkan babak video supaya muat dengan suara, dan menggabungkan audio.

**Cara A, API (automatik):** simpan API key ElevenLabs sebagai network secret untuk `api.elevenlabs.io` (header `xi-api-key`), kemudian:
```
cd voice && python3 tts.py --voice <VOICE_ID> && cd .. && node render.js
```
**Cara B, manual:** jana setiap baris dalam `script.json` di laman ElevenLabs, simpan sebagai `voice/clips/<id>.mp3` (`hook.mp3`, `prob.mp3`, `formula.mp3`, `b0.mp3` … `b5.mp3`, `sum.mp3`, `tip.mp3`, `real.mp3`, `cta.mp3`), kemudian jalankan arahan yang sama tanpa `--voice`.

Model asal `eleven_multilingual_v2`. Untuk sebutan Melayu, pilih suara Melayu dari Voice Library.

## Tukar kandungan
Dalam `index.html`: `SALARY` (contoh gaji), senarai `B` (peratus, tajuk, poin, nota), dan teks CTA di bahagian `<!-- CTA -->`.

## Jalan cerita
| Masa | Babak |
|---|---|
| 0–5s | Hook: gaji RM4,000 susut ke RM0 |
| 5–9.5s | Masalah: duit tak ada "alamat" |
| 9.5–12.5s | Formula 50/10/10/10/10/10 (gaji bersih) |
| 12.5–46.5s | 6 bahagian: Komitmen, Zakat & Sedekah, Simpanan Kecemasan, Perlindungan, Pelaburan, Kehendak |
| 46.5–51.5s | Ringkasan RM4,000 |
| 51.5–55.7s | Tip: automasikan hari gaji |
| 55.7–59.7s | Panduan umum, sesuaikan sendiri |
| 59.7–66s | CTA: semakan kewangan percuma |

Dapatkan kelulusan pematuhan syarikat sebelum dikongsi secara meluas (lihat README utama).
