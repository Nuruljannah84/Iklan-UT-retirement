# Templat Video: Skrip A "Kos Menunggu"

Iklan menegak 9:16 (1080×1920, 30fps, 25s) berdasarkan Skrip A dalam `../skrip-hook.md`.

## Babak

| Masa | Babak | Fail |
|---|---|---|
| 0–3s | Hook | `src/babak/BabakHook.tsx` |
| 3–15s | Perbandingan bar "Mula 30 vs Mula 40" | `src/babak/BabakBanding.tsx` |
| 15–21s | "Masa > Jumlah" | `src/babak/BabakMesej.tsx` |
| 21–25s | CTA WhatsApp + penafian | `src/babak/BabakCTA.tsx` |

Tiga komposisi dalam `src/Root.tsx` (`KosMenunggu-H1`, `-H2`, `-H3`) berbeza pada hook sahaja. Ini disengajakan untuk ujian A/B: hanya satu pemboleh ubah yang berubah.

## Guna

```bash
npm i
npm run dev          # buka Remotion Studio untuk preview dan edit
npx remotion render KosMenunggu-H1 out/KosMenunggu-H1.mp4
```

- **Tukar hook:** ubah `defaultProps` dalam `src/Root.tsx`, atau ubah terus di panel Props dalam Studio.
- **Tukar angka** (bulanan, % pulangan, umur): ubah props `<BabakBanding>` dalam `src/KosMenunggu.tsx`. Bar, nilai RM dan peratus dikira semula secara automatik guna formula yang sama dengan kalkulator laman web.
- **Tambah variasi:** salin satu `<Composition>` dalam `Root.tsx`, beri `id` baru dan hook baru.

Jika render gagal memuat turun Chrome (rangkaian terhad), tambah `--browser-executable=/path/ke/chromium`.

## Sebelum disiarkan

- Dapatkan kelulusan pematuhan Manulife. Video ini memaparkan angka ilustrasi.
- Babak 1, 3 dan 4 lebih berkesan jika diganti atau dilapis dengan rakaman wajah Nurul. Tambah `<Video>` pada trek berasingan dalam `KosMenunggu.tsx`.
- Kawasan bawah ~300px dan atas ~200px dilitupi UI Reels/TikTok. Kandungan penting sudah diletakkan di tengah.

## Lesen

Remotion percuma untuk individu dan pasukan sehingga 3 orang. Lihat https://www.remotion.dev/docs/license.
