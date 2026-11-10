"""Generate the Manglish voiceover, one WAV per scene, with Kokoro (offline TTS).

English is phonemised by espeak (British English); Malay words are given as
hand-written Malay IPA so they are not read with an English accent.
Usage: python3 tts.py <models_dir> <out_dir> [voice] [speed]
"""
import re, sys, json
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

MALAY = {  # Standard Malay pronunciation
    "kita": "kˈita", "kalau": "kˈalaʊ", "tiba-tiba": "tˈiba tˈiba",
    "berlaku": "bəɾlˈaku", "boleh": "bˈolɛ", "terjejas": "təɾʤəʤˈas",
}
SCENES = [
    "{kita} spend years building our savings. But have you ever thought, what happens {kalau} {tiba-tiba} {berlaku} unexpected financial crisis?",
    "Medical emergency, critical illness, or loss of income, {boleh} force you to use all those savings.",
    "Without proper financial protection, your emergency fund, investment, and retirement savings {boleh} {terjejas}.",
    "That's why protection matters. Don't just build your wealth. Protect what you've worked so hard to build.",
]

def phonemes(k, line, lang):
    out = []
    for part in re.split(r"(\{[^}]+\})", line):
        if part.startswith("{"):
            out.append(MALAY[part[1:-1]])
        elif part.strip():
            out.append(k.tokenizer.phonemize(part, lang))
    return " ".join(out)

def tighten(audio, sr, keep=0.12, win=0.01, floor=0.006):
    """Trim edges and shorten every internal pause to at most `keep` seconds."""
    n = int(sr * win)
    frames = len(audio) // n
    rms = np.sqrt((audio[: frames * n].reshape(frames, n) ** 2).mean(1))
    loud = rms > floor
    first, last = np.argmax(loud), frames - np.argmax(loud[::-1])
    out, run, maxrun = [], 0, int(keep / win)
    for f in range(max(first - 4, 0), min(last + 8, frames)):
        run = 0 if loud[f] else run + 1
        if run <= maxrun:
            out.append(audio[f * n:(f + 1) * n])
    out = np.concatenate(out)
    fade = int(sr * 0.015)
    out[:fade] *= np.linspace(0, 1, fade); out[-fade:] *= np.linspace(1, 0, fade)
    return out

def main():
    models, out = sys.argv[1], sys.argv[2]
    voice = sys.argv[3] if len(sys.argv) > 3 else "bf_emma"
    speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
    lang = "en-gb" if voice.startswith("b") else "en-us"
    k = Kokoro(f"{models}/kokoro-v1.0.onnx", f"{models}/voices-v1.0.bin")
    info = []
    for i, line in enumerate(SCENES, 1):
        ph = phonemes(k, line, lang)
        audio, sr = k.create(ph, voice=voice, speed=speed, is_phonemes=True)
        audio = np.asarray(audio, dtype=np.float32)
        audio = tighten(audio, sr)
        sf.write(f"{out}/vo{i}.wav", audio, sr)
        info.append({"scene": i, "seconds": round(len(audio) / sr, 2), "phonemes": ph})
        print(info[-1])
    json.dump(info, open(f"{out}/vo.json", "w"), indent=1, ensure_ascii=False)

if __name__ == "__main__":
    main()
