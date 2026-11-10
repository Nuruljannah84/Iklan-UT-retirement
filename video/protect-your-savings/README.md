# Protect Your Savings Before Life Happens: 20s whiteboard video

`protect-your-savings.mp4` is 1080×1920 (9:16), 30 fps, exactly 20.0 s, H.264 + AAC, loudness −14 LUFS,
with a **Bahasa Melayu** voiceover.
`protect-your-savings-subtitle.mp4` is the same video with karaoke subtitles on the scene-3 line.

| Time | Scene | Voiceover (BM) |
|---|---|---|
| 0–4.6s | Professional saves coins in a jar, question mark | Bertahun kita kumpul simpanan. Apa jadi kalau tiba-tiba berlaku krisis kewangan? |
| 4.6–9.9s | Hospital, patient, bills, coins flow out | Kecemasan perubatan, penyakit kritikal, atau hilang pendapatan, boleh habiskan simpanan anda. |
| 9.9–13.8s | Lightning drains Emergency Fund / Investment / Retirement jars | Dana kecemasan, pelaburan dan persaraan, semuanya boleh terjejas. |
| 13.8–16.6s | Shield around savings, investment, retirement | Jangan sekadar bina kekayaan. Lindunginya juga. |
| 16.6–20s | End card: photo, name, WhatsApp 012-394 7764, wa.me link, FIMM / takaful code | Semak perlindungan kewangan anda hari ini. |

The on-screen headlines stay in English, except the end card, which is in BM.

## Rebuild

```bash
pip install kokoro-onnx soundfile
./build.sh <models_dir> <work_dir>
```

`models_dir` must contain `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the kokoro-onnx `model-files-v1.0`
release. The build also needs Node with Playwright/Chromium and ffmpeg built with rubberband. It renders both versions.

| File | Role |
|---|---|
| `tts_ms.py` | BM voiceover. Kokoro has no Malay voice, so every word is written as Malaysian Malay IPA (`IPA` dict) and read by the `ef_dora` voice, chosen because it scored best under Malay speech recognition |
| `tts.py` | Earlier Manglish voiceover (English parts via espeak, Malay words via IPA) |
| `music.py` | Synthesised background music: 96 BPM, D major, I–V–vi–IV |
| `scene.html` | The whole animation as SVG with a `render(t)` timeline. Scenes 1–4 are laid out on a design timeline `D` and warped onto the real timing `T`. Scene 5 is the end card. `SUBS` holds the subtitles |
| `frames.js` | Renders each frame in headless Chromium and pipes it to ffmpeg (`SUBS=1` adds subtitles) |
| `build.sh` | Voiceover → music → mix (ducked, loudness-normalised) → frames → mux, for both versions |

The end-card photo is `../../images/nurul-jannah.webp`.
Fonts (Kalam, Caveat, Montserrat) come from Google Fonts under the SIL Open Font License.
