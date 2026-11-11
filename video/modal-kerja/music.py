"""Jana muzik latar + kesan bunyi (SFX) untuk scene.html.

Semua bunyi dicipta dari kod (tiada sampel luar), jadi bebas hak cipta.
Masa babak dan SFX dibaca terus dari scene.html:
  - setiap data-scene="mula tamat"  -> bunyi "whoosh" pada mula babak
  - data-sfx="pop|impact|ding" pada elemen -> bunyi pada masa data-in elemen itu
  - data-sfx-at="t"                  -> bunyi "pop" pada masa t

Guna: python3 music.py [output.wav]
"""
import re
import sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
HERE = Path(__file__).parent
html = (HERE / "scene.html").read_text(encoding="utf-8")
DUR = float(re.search(r"const DURATION = ([\d.]+)", html).group(1))
N = int(DUR * SR)
rng = np.random.default_rng(7)

BPM = 96
BEAT = 60 / BPM
BAR = BEAT * 4
DRUMS_FROM = 4.0          # dram masuk bila babak "masalah" bermula
FADE_OUT = 2.5


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def t_arr(sec):
    return np.arange(int(sec * SR)) / SR


def add(buf, sig, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    buf[i : i + len(sig)] += sig


def saw(freq, sec, harmonics=10, detune=0.0):
    t = t_arr(sec)
    out = np.zeros_like(t)
    for d in (-detune, detune) if detune else (0,):
        f = freq * (1 + d)
        for k in range(1, harmonics + 1):
            if f * k > SR / 2:
                break
            out += np.sin(2 * np.pi * f * k * t) / k
    return out


# Progresi kord (C – G – Am – F), satu kord satu bar
CHORDS = [
    (48, [60, 64, 67, 72]),   # C
    (43, [59, 62, 67, 71]),   # G
    (45, [60, 64, 69, 72]),   # Am
    (41, [60, 65, 69, 72]),   # F
]

pad = np.zeros(N)
bass = np.zeros(N)
pluck = np.zeros((2, N))
drums = np.zeros(N)

bars = int(np.ceil(DUR / BAR))
for b in range(bars):
    root, notes = CHORDS[b % 4]
    start = b * BAR
    # Pad lembut
    seg = sum(saw(midi(n), BAR + 0.6, harmonics=8, detune=0.004) for n in notes) / len(notes)
    env = np.minimum(1, t_arr(BAR + 0.6) / 0.35) * np.minimum(1, (BAR + 0.6 - t_arr(BAR + 0.6)) / 0.6)
    add(pad, seg * env, start)
    # Bass pada ketukan 1 dan 3
    for beat in (0, 2):
        tt = t_arr(BEAT * 1.8)
        s = np.sin(2 * np.pi * midi(root) * tt) + 0.3 * np.sin(4 * np.pi * midi(root) * tt)
        add(bass, s * np.exp(-tt * 2.2) * np.minimum(1, tt / 0.01), start + beat * BEAT)
    # Arpeggio not 1/8
    arp = notes + [notes[1] + 12, notes[2] + 12, notes[3], notes[2]]
    for i in range(8):
        at = start + i * BEAT / 2
        tt = t_arr(0.5)
        f = midi(arp[i % len(arp)] + 12)
        s = (2 / np.pi) * np.arcsin(np.sin(2 * np.pi * f * tt))   # gelombang segi tiga
        s *= np.exp(-tt * 9) * np.minimum(1, tt / 0.004)
        ch = i % 2
        add(pluck[ch], s, at)
        add(pluck[1 - ch], s * 0.55, at + 0.012)
    # Dram
    if start + BAR > DRUMS_FROM:
        for beat in range(4):
            at = start + beat * BEAT
            if at < DRUMS_FROM:
                continue
            if beat in (0, 2):  # kick
                tt = t_arr(0.35)
                f = 45 + 85 * np.exp(-tt * 30)
                add(drums, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * 1.0, at)
            else:               # clap
                tt = t_arr(0.2)
                add(drums, bp(rng.standard_normal(len(tt)), 900, 3500) * np.exp(-tt * 22) * 0.45, at)
            for h in (0, 0.5):  # hi-hat
                tt = t_arr(0.06)
                add(drums, hp(rng.standard_normal(len(tt)), 7000) * np.exp(-tt * 70) * 0.18, at + h * BEAT)

# Penapis pad terbuka perlahan dalam intro
pad = lp(pad, 1600)
pluck = np.stack([lp(ch, 3800) for ch in pluck])
intro = np.clip(np.arange(N) / SR / DRUMS_FROM, 0, 1)
pad *= 0.6 + 0.4 * intro

# ---------- Kesan bunyi ----------
sfx = np.zeros(N)


def whoosh():
    sec = 0.55
    tt = t_arr(sec)
    noise = rng.standard_normal(len(tt))
    out = np.zeros_like(tt)
    chunks = 24
    edges = np.linspace(0, len(tt), chunks + 1, dtype=int)
    for c in range(chunks):
        centre = 400 * (12 ** (c / chunks))
        seg = bp(noise, centre * 0.7, min(centre * 1.4, SR / 2 - 100))
        out[edges[c] : edges[c + 1]] = seg[edges[c] : edges[c + 1]]
    env = np.sin(np.pi * np.clip(tt / sec, 0, 1)) ** 2
    return out * env * 0.35


def pop():
    tt = t_arr(0.12)
    f = 700 + 900 * (tt / 0.12)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 35) * 0.35


def impact():
    tt = t_arr(1.4)
    f = 38 + 70 * np.exp(-tt * 12)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.2)
    crack = lp(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 25) * 0.6
    return (boom + crack) * 0.75


def ding():
    tt = t_arr(1.6)
    out = np.zeros_like(tt)
    for f, a, d in ((1318.5, 1, 2.5), (1975.5, 0.6, 3.2), (2637, 0.3, 4.5), (3520 * 1.01, 0.12, 6)):
        out += a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * d)
    return out * np.minimum(1, tt / 0.003) * 0.22


SFX = {"pop": pop, "impact": impact, "ding": ding}

for m in re.finditer(r'data-scene="([\d.]+) ([\d.]+)"', html):
    start = float(m.group(1))
    if start > 0:
        add(sfx, whoosh(), start - 0.4)

for tag in re.findall(r"<[^>]*data-sfx=\"\w+\"[^>]*>", html):
    kind = re.search(r'data-sfx="(\w+)"', tag).group(1)
    at = float(re.search(r'data-in="([\d.]+)"', tag).group(1))
    add(sfx, SFX[kind](), at + 0.05)

for at in re.findall(r'data-sfx-at="([\d.]+)"', html):
    add(sfx, pop(), float(at))

# ---------- Campur ----------
ir_t = t_arr(1.2)
ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 4.5)
ir /= np.sqrt(np.sum(ir ** 2))


def verb(x, wet):
    return x + wet * fftconvolve(x, ir)[: len(x)]


mono = verb(pad * 0.22, 0.5) + bass * 0.35 + drums * 0.55 + verb(sfx, 0.25)
left = mono + verb(pluck[0] * 0.16, 0.4)
right = mono + verb(pluck[1] * 0.16, 0.4)
mix = np.stack([left, right], axis=1)

fade = np.clip((DUR - np.arange(N) / SR) / FADE_OUT, 0, 1)[:, None]
mix *= fade
mix *= np.clip(np.arange(N) / SR / 0.05, 0, 1)[:, None]
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.4) / np.tanh(1.4) * 0.89

out = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "music.wav"
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print(f"Siap: {out} ({DUR:g}s)")
