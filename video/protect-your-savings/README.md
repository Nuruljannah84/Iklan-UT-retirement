# Protect Your Savings Before Life Happens: 20s whiteboard video

`protect-your-savings.mp4` is 1080×1920 (9:16), 30 fps, exactly 20.0 s, H.264 + AAC, loudness −14 LUFS.

| Time | Scene | On-screen text |
|---|---|---|
| 0.0–5.95s | Professional drops RM coins into a savings jar, question mark appears | YOU WORK HARD TO BUILD YOUR SAVINGS. |
| 5.95–10.4s | Hospital, patient, medical bills, coins flow out of the jar | UNEXPECTED RISKS. UNEXPECTED COSTS. |
| 10.4–15.35s | Lightning "event" drains three jars: Emergency Fund, Investment, Retirement | ONE EVENT CAN AFFECT YOUR ENTIRE FINANCIAL PLAN. |
| 15.35–20s | Shield drawn around savings, investment and retirement icons, then the CTA | DON'T JUST BUILD WEALTH. PROTECT IT. / Start Reviewing Your Financial Protection Today |

Voiceover lines start at 0.20, 6.15, 10.55 and 15.50 s.

## Rebuild

```bash
pip install kokoro-onnx soundfile
./build.sh <models_dir> <work_dir>
```

`models_dir` must contain `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the
kokoro-onnx `model-files-v1.0` release. The build also needs Node with Playwright/Chromium and ffmpeg.

| File | Role |
|---|---|
| `tts.py` | Voiceover (Kokoro TTS, voice `bf_emma`). English goes through espeak; Malay words use hand-written Malay IPA (edit `MALAY`) |
| `music.py` | Synthesised background music: 96 BPM, D major, I–V–vi–IV |
| `scene.html` | The whole animation as SVG with a `render(t)` timeline (edit the text, drawings and timing here) |
| `frames.js` | Renders each frame in headless Chromium and pipes it to ffmpeg |
| `build.sh` | Voiceover → music → mix (ducked, loudness-normalised) → frames → mux |

Fonts (Kalam, Caveat, Montserrat) come from Google Fonts under the SIL Open Font License.
