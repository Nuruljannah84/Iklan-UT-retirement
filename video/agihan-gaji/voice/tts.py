"""Jana suara latar dengan ElevenLabs dan selaraskan dengan video.

Langkah:
  1. Untuk setiap babak dalam script.json, guna clips/<id>.mp3 jika sudah ada
     (contohnya dimuat turun sendiri dari laman ElevenLabs), jika tidak panggil API ElevenLabs.
  2. Ukur panjang setiap klip, panjangkan babak video supaya muat (timing.json).
  3. Gabungkan klip pada masa mula setiap babak -> voiceover.m4a.
Kemudian jalankan: node ../render.js

Guna:  python3 tts.py --voice <VOICE_ID> [--model eleven_multilingual_v2] [--force]
Key: ELEVENLABS_API_KEY, atau network secret pada persekitaran (proksi menyuntiknya).
"""
import argparse, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CLIPS = os.path.join(HERE, "clips")
# Mesti sama dengan DEF dalam index.html
DEF = {"hook": 5, "prob": 4.5, "formula": 3, "b": [6.5, 5.5, 5.5, 5.5, 5.5, 5.5],
       "sum": 5, "tip": 4.2, "real": 4, "cta": 6.3}
LEAD, TAIL = 0.25, 0.55   # senyap sebelum / selepas suara dalam setiap babak

ap = argparse.ArgumentParser()
ap.add_argument("--voice", help="ElevenLabs voice ID (perlu jika ada klip yang belum dijana)")
ap.add_argument("--model", default="eleven_multilingual_v2")
ap.add_argument("--speed", type=float, default=1.0)
ap.add_argument("--force", action="store_true", help="jana semula semua klip")
a = ap.parse_args()

script = json.load(open(os.path.join(HERE, "script.json")))
os.makedirs(CLIPS, exist_ok=True)

def tts(i, item, out):
    if not a.voice:
        sys.exit(f"Klip {item['id']} tiada. Beri --voice <VOICE_ID> atau letak clips/{item['id']}.mp3")
    body = {"text": item["text"], "model_id": a.model,
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.15, "speed": a.speed},
            "previous_text": script[i - 1]["text"] if i > 0 else None,
            "next_text": script[i + 1]["text"] if i + 1 < len(script) else None}
    if "2_5" in a.model:
        body["language_code"] = "ms"
    key = os.environ.get("ELEVENLABS_API_KEY", "injected-by-proxy")
    r = subprocess.run(["curl", "-sS", "-w", "%{http_code}", "-o", out, "-X", "POST",
        f"https://api.elevenlabs.io/v1/text-to-speech/{a.voice}?output_format=mp3_44100_128",
        "-H", f"xi-api-key: {key}", "-H", "Content-Type: application/json", "-d", json.dumps(body)],
        capture_output=True, text=True)
    if r.stdout.strip() != "200":
        msg = open(out, errors="replace").read()[:400] if os.path.exists(out) else r.stderr
        os.path.exists(out) and os.remove(out)
        sys.exit(f"ElevenLabs gagal ({r.stdout.strip()}) untuk {item['id']}: {msg}")
    print("  dijana", item["id"])

def dur(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                          "-of", "csv=p=0", f]).strip())

lens = {}
for i, item in enumerate(script):
    out = os.path.join(CLIPS, item["id"] + ".mp3")
    if a.force or not os.path.exists(out):
        tts(i, item, out)
    lens[item["id"]] = dur(out)

def fit(default, d):
    return round(max(default, LEAD + d + TAIL), 2)

timing = {k: fit(DEF[k], lens[k]) for k in ("hook", "prob", "formula", "sum", "tip", "real")}
timing["b"] = [fit(DEF["b"][j], lens[f"b{j}"]) for j in range(6)]
timing["cta"] = fit(DEF["cta"], lens["cta"] + 2.0)   # tahan CTA lebih lama
json.dump(timing, open(os.path.join(HERE, "timing.json"), "w"), indent=2)

# Masa mula setiap babak
order = ["hook", "prob", "formula", "b0", "b1", "b2", "b3", "b4", "b5", "sum", "tip", "real", "cta"]
seq = [timing["hook"], timing["prob"], timing["formula"], *timing["b"], timing["sum"], timing["tip"], timing["real"], timing["cta"]]
starts, t = {}, 0.0
for k, L in zip(order, seq):
    starts[k] = t; t += L
total = t

inputs, filt = [], []
for n, k in enumerate(order):
    inputs += ["-i", os.path.join(CLIPS, k + ".mp3")]
    ms = int((starts[k] + LEAD) * 1000)
    filt.append(f"[{n}:a]aresample=44100,adelay={ms}|{ms}[a{n}]")
filt.append("".join(f"[a{n}]" for n in range(len(order))) +
            f"amix=inputs={len(order)}:normalize=0,apad,atrim=0:{total:.2f},loudnorm=I=-16:TP=-1.5[out]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(filt),
                "-map", "[out]", "-ac", "2", "-c:a", "aac", "-b:a", "160k", os.path.join(HERE, "voiceover.m4a")], check=True)
print(f"Siap: voiceover.m4a ({total:.1f}s) + timing.json. Seterusnya: node ../render.js")
