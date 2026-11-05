# Landing Page Perancangan Persaraan

Landing page satu halaman untuk mengiklankan perkhidmatan perancangan persaraan (Unit Trust & PRS).

## Kandungan

- `index.html`: kandungan halaman
- `style.css`: reka bentuk dan warna
- `script.js`: tetapan, kalkulator persaraan dan pautan WhatsApp

## Tukar maklumat anda

Buka `script.js` dan ubah bahagian `CONFIG` di bahagian atas:

```js
const CONFIG = {
  brand: "Jannah Financial",
  name: "Nurul Jannah",
  fimm: "XXXXXXXX",
  whatsapp: "60123456789",   // kod negara 60, tanpa "+" atau sengkang
  ...
};
```

Teks lain (tajuk, testimoni, soalan lazim) boleh diubah terus dalam `index.html`.
Testimoni sedia ada hanyalah contoh, jadi gantikan dengan testimoni sebenar (dengan kebenaran pelanggan).

## Online-kan dengan GitHub Pages (percuma)

1. Gabungkan (merge) fail ini ke branch `main`.
2. Di GitHub, pergi ke **Settings → Pages**.
3. Di bawah **Build and deployment**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, kemudian **Save**.
4. Selepas 1–2 minit, laman akan tersedia di `https://nuruljannah84.github.io/Iklan-UT-retirement/`.

## Lihat secara lokal

Buka `index.html` terus dalam pelayar (browser).
