"""Synthesise a soft, inspiring corporate instrumental, 96 BPM, D major (2.5 s per bar).
I-V-vi-IV (D A Bm G) looped; piano + pad from the start, plucked arpeggio and a soft
pulse join for the build, resolving on D for the call to action.
Usage: python3 music.py out.wav [seconds, default 20]
"""
import sys
import numpy as np, soundfile as sf

SR, BPM = 44100, 96
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 20.0
BEAT = 60 / BPM
BAR = 4 * BEAT
t_all = np.arange(int(SR * DUR)) / SR
mix = np.zeros((len(t_all), 2))
rng = np.random.default_rng(7)

def hz(m): return 440 * 2 ** ((m - 69) / 12)

def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= len(mix): return
    sig = sig[: len(mix) - i] * gain
    mix[i:i + len(sig), 0] += sig * np.sqrt(0.5 * (1 - pan))
    mix[i:i + len(sig), 1] += sig * np.sqrt(0.5 * (1 + pan))

def piano(m, dur, vel=1.0):
    t = np.arange(int(SR * (dur + 1.2))) / SR
    f = hz(m)
    s = sum(a * np.sin(2 * np.pi * f * k * (1 + 0.0004 * k * k) * t) * np.exp(-t * (1.6 + 1.1 * k))
            for k, a in enumerate([1, .45, .22, .12, .06, .03], 1))
    env = np.minimum(t / 0.006, 1) * np.where(t < dur, 1, np.exp(-(t - dur) * 6))
    return s * env * vel

def pad(m, dur):
    t = np.arange(int(SR * (dur + 0.8))) / SR
    f = hz(m)
    s = sum(np.sin(2 * np.pi * f * d * t + rng.uniform(0, 6)) for d in (0.997, 1.0, 1.003))
    s += 0.25 * sum(np.sin(2 * np.pi * 2 * f * d * t) for d in (0.998, 1.002))
    env = np.minimum(t / 0.9, 1) * np.where(t < dur, 1, np.exp(-(t - dur) * 4))
    return s * env * (0.8 + 0.2 * np.sin(2 * np.pi * 0.3 * t))

def pluck(m):
    t = np.arange(int(SR * 0.9)) / SR
    f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 9)
    return s * np.exp(-t * 6) * np.minimum(t / 0.003, 1)

def kick():
    t = np.arange(int(SR * 0.35)) / SR
    return np.sin(2 * np.pi * (48 + 70 * np.exp(-t * 30)) * t) * np.exp(-t * 11)

def shaker():
    t = np.arange(int(SR * 0.08)) / SR
    n = np.diff(rng.standard_normal(len(t) + 1))
    return n * np.exp(-t * 60)

# D, A, Bm, G voicings (MIDI)
CHORDS = [
    (50, [62, 66, 69, 74]), (45, [61, 64, 69, 73]),
    (47, [62, 66, 71, 74]), (43, [62, 67, 71, 74]),
]
NB = int(round(DUR / BAR))
for bar in range(NB):
    t0 = bar * BAR
    root, notes = CHORDS[bar % 4]
    last = bar == NB - 1
    if last: root, notes = 50, [62, 66, 69, 74, 78]
    for m in notes:
        add(pad(m, BAR if not last else 1.6), t0, pan=rng.uniform(-.4, .4), gain=0.018)
    add(pad(root - 12, BAR), t0, gain=0.03)                    # warm sub
    # piano: rolled chord on beat 1, soft re-strike on beat 3
    for j, m in enumerate(notes):
        add(piano(m, BEAT * 2), t0 + j * 0.018, pan=-.2 + .1 * j, gain=0.05)
        if not last:
            add(piano(m, BEAT * 1.5, .6), t0 + 2 * BEAT + j * 0.012, pan=-.2 + .1 * j, gain=0.05)
    add(piano(root, BAR * 0.9), t0, gain=0.06)
    # plucked arpeggio from bar 2 (builds), 8th notes
    if 1 <= bar <= NB - 2:
        arp = [notes[0] + 12, notes[1] + 12, notes[2] + 12, notes[3] + 12]
        seq = arp + arp[::-1]
        for k in range(8):
            add(pluck(seq[k]), t0 + k * BEAT / 2, pan=0.35 if k % 2 else -0.35,
                gain=(0.02 if bar < 3 else 0.03) * (1 if k % 2 == 0 else .7))
    # soft pulse in the build (bars 3-6)
    if 3 <= bar <= NB - 2:
        for b in (0, 2):
            add(kick(), t0 + b * BEAT, gain=0.16)
        for k in range(8):
            add(shaker(), t0 + k * BEAT / 2 + BEAT / 4, pan=.3, gain=0.012 * (1.4 if k % 2 else 1))

# gentle reverb: convolve with a decaying noise tail
ir_t = np.arange(int(SR * 2.2)) / SR
ir = rng.standard_normal((len(ir_t), 2)) * np.exp(-ir_t * 3.2)[:, None]
ir /= np.sqrt((ir ** 2).sum(0))
L = len(mix) + len(ir)
nfft = 1 << (L - 1).bit_length()
wet = np.stack([np.fft.irfft(np.fft.rfft(mix[:, c], nfft) * np.fft.rfft(ir[:, c], nfft), nfft)[:len(mix)]
                for c in range(2)], 1)
out = 0.78 * mix + 0.32 * wet
out[: int(SR * 0.4)] *= np.linspace(0, 1, int(SR * 0.4))[:, None]          # fade in
fo = int(SR * 1.2)
out[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5                            # fade out to the end
out = np.tanh(out / np.abs(out).max() * 1.2) * 0.85
sf.write(sys.argv[1], out.astype(np.float32), SR)
