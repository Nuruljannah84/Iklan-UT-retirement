# Protect Your Savings Before Life Happens: whiteboard video

`protect-your-savings.mp4` is 1080×1920 (9:16), 30 fps, **25.0 s**, H.264 + AAC, loudness −14 LUFS,
voiced by Nurul Jannah herself in Bahasa Melayu. All on-screen text is in BM, mirrors her words,
and is written on screen as she says them.

| Time | Scene | Voiceover | On-screen text |
|---|---|---|---|
| 0–5.7s | Saving coins into a jar, question mark | Bertahun kita kumpul simpanan, tapi apa jadi kalau tiba-tiba berlaku krisis kewangan? | BERTAHUN KITA / KUMPUL SIMPANAN. / TAPI, APA JADI KALAU...? |
| 5.7–11.4s | Hospital, patient, jar, bills, money flows out | Kecemasan perubatan, penyakit kritikal atau hilang pendapatan boleh habiskan simpanan anda. | KECEMASAN PERUBATAN, / PENYAKIT KRITIKAL, / HILANG PENDAPATAN. |
| 11.4–15.75s | Jars labelled as named, lightning, jars drain | Dana kecemasan, pelaburan dan persaraan, semuanya boleh terjejas. | SEMUANYA BOLEH / TERJEJAS. |
| 15.75–19.75s | Shield around simpanan / pelaburan / persaraan | Jangan sekadar bina kekayaan, lindunginya juga. | JANGAN SEKADAR / BINA KEKAYAAN. / LINDUNGINYA JUGA. |
| 19.75–25s | End card: photo, name, WhatsApp 012-394 7764, wa.me link, FIMM / takaful code | Semak perlindungan kewangan anda hari ini bersama saya. | SEMAK PERLINDUNGAN / KEWANGAN ANDA HARI INI / BERSAMA SAYA |

## Rebuild

```bash
pip install noisereduce soundfile scipy
./build.sh <original_voice_recording> <work_dir>
```

The voice recording is not in the repo. The build needs Node with Playwright/Chromium and ffmpeg.
If a new recording is made, update `KEEP`/`NOISE` in `voice.py` (cut points, in seconds of the
recording) and the times in `scene.html` (`T` plus the times inside each `at(...)` block).

| File | Role |
|---|---|
| `voice.py` | Cleans her recording: rumble filter, noise reduction (profile from the silence before she speaks), shortened long pauses |
| `music.py` | Synthesised background music: 96 BPM, D major, I–V–vi–IV, any length (`music.py out.wav 25`) |
| `scene.html` | The animation as SVG with a `render(t)` timeline. `T` = scene starts. Text and key drawings are placed on real time inside `at(...)`, synced to her words. Scenes 1 and 4 drawings are warped from a design timeline `D`. Scene 5 is the end card |
| `frames.js` | Renders each frame in headless Chromium and pipes it to ffmpeg (`SUBS=1` adds the optional scene-3 subtitles) |
| `build.sh` | Voice → music → mix (EQ, compression, ducked music, loudness-normalised) → frames → mux |
| `tts.py`, `tts_ms.py` | Earlier synthetic voiceovers (Manglish and BM), kept for reference; not used by the build |

The end-card photo is `../../images/nurul-jannah.webp`.
Fonts (Kalam, Caveat, Montserrat) come from Google Fonts under the SIL Open Font License.
