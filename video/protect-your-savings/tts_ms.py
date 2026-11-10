"""Bahasa Melayu voiceover, one WAV per scene, with Kokoro (offline TTS).

Kokoro has no Malay voice, so every word is given as hand-written Malaysian Malay IPA
(final -a as schwa, tapped r; note the model spells g as ɡ, U+0261) and spoken by one of its voices.
Usage: python3 tts_ms.py <models_dir> <out_dir> [voice] [speed]
"""
import re, sys, json
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from tts import tighten

IPA = {
    "bertahun": "bəɾtˈahun", "kita": "kˈitə", "kumpul": "kˈumpul", "simpanan": "simpˈanan",
    "tapi": "tˈapi", "apa": "ˈapə", "jadi": "ʤˈadi", "kalau": "kˈalaw", "tiba-tiba": "tˈibə tˈibə",
    "berlaku": "bəɾlˈaku", "krisis": "kɾˈisis", "kewangan": "kəwˈaŋan",
    "kecemasan": "kəʧəmˈasan", "perubatan": "pəɾubˈatan", "penyakit": "pəɲˈakit",
    "kritikal": "kɾitˈikal", "atau": "ˈataw", "hilang": "hˈilaŋ", "pendapatan": "pəndapˈatan",
    "boleh": "bˈolɛh", "habiskan": "habˈiskan", "anda": "ˈandə",
    "dana": "dˈana", "pelaburan": "pəlabˈuɾan", "dan": "dan", "persaraan": "pəɾsaɾˈaan",
    "semuanya": "səmuˈaɲə", "terjejas": "təɾʤˈɛʤas",
    "sebab": "səbˈab", "itu": "ˈitu", "perlindungan": "pəɾlindˈuŋan", "penting": "pəntˈiŋ",
    "jangan": "ʤˈaŋan", "sekadar": "səkˈadaɾ", "bina": "bˈinə", "kekayaan": "kəkajˈaan",
    "lindunginya": "linduŋˈiɲə", "juga": "ʤˈuɡə",
    "semak": "səmˈak", "hari": "hˈaɾi", "ini": "ˈini",
}
SCENES = [
    "Bertahun kita kumpul simpanan. Apa jadi kalau tiba-tiba berlaku krisis kewangan?",
    "Kecemasan perubatan, penyakit kritikal, atau hilang pendapatan, boleh habiskan simpanan anda.",
    "Dana kecemasan, pelaburan dan persaraan, semuanya boleh terjejas.",
    "Jangan sekadar bina kekayaan. Lindunginya juga.",
    "Semak perlindungan kewangan anda hari ini.",
]

def phonemes(line):
    out = []
    for tok in re.findall(r"[\w-]+|[.,?!]", line):
        out.append(tok if tok in ".,?!" else IPA[tok.lower()])
    return re.sub(r" ([.,?!])", r"\1", " ".join(out))

def main():
    models, out = sys.argv[1], sys.argv[2]
    voice = sys.argv[3] if len(sys.argv) > 3 else "if_sara"
    speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
    k = Kokoro(f"{models}/kokoro-v1.0.onnx", f"{models}/voices-v1.0.bin")
    info = []
    for i, line in enumerate(SCENES, 1):
        ph = phonemes(line)
        audio, sr = k.create(ph, voice=voice, speed=speed, is_phonemes=True)
        audio = tighten(np.asarray(audio, dtype=np.float32), sr)
        sf.write(f"{out}/vo{i}.wav", audio, sr)
        info.append({"scene": i, "seconds": round(len(audio) / sr, 2), "text": line, "phonemes": ph})
    json.dump(info, open(f"{out}/vo.json", "w"), indent=1, ensure_ascii=False)
    print(voice, speed, [x["seconds"] for x in info], round(sum(x["seconds"] for x in info), 2))

if __name__ == "__main__":
    main()
