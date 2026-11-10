"""Prepare the consultant's own voice recording for the video.

1. high-pass (removes the <100 Hz rumble), 2. stationary noise reduction using the
silence before she starts speaking as the noise profile, 3. tighten long pauses,
4. light EQ/compression is done later in the mix (build.sh).
Usage: python3 voice.py <in_audio> <out.wav>
Cut list and cue times are in seconds of the ORIGINAL recording.
"""
import sys, subprocess, tempfile, os
import numpy as np, soundfile as sf, noisereduce as nr

KEEP = [(0.90, 6.30), (6.56, 12.35), (12.50, 16.80), (17.03, 21.00), (21.15, 24.75)]  # cut inside pauses
NOISE = [(0.20, 0.95), (25.30, 27.00)]                                                  # room tone only

def main(src, dst):
    tmp = os.path.join(tempfile.mkdtemp(), "hp.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ac", "1", "-ar", "48000",
                    "-af", "highpass=f=90:poles=2,highpass=f=90:poles=2", tmp], check=True)
    a, sr = sf.read(tmp, dtype="float32")
    noise = np.concatenate([a[int(x * sr):int(y * sr)] for x, y in NOISE])
    a = nr.reduce_noise(y=a, sr=sr, y_noise=noise, stationary=True, prop_decrease=0.85,
                        n_std_thresh_stationary=1.5, freq_mask_smooth_hz=300, time_mask_smooth_ms=60)
    f = int(sr * 0.012)
    parts = []
    for x, y in KEEP:
        p = a[int(x * sr):int(y * sr)].copy()
        p[:f] *= np.linspace(0, 1, f); p[-f:] *= np.linspace(1, 0, f)
        parts.append(p)
    out = np.concatenate(parts)
    out = out / np.abs(out).max() * 0.7
    sf.write(dst, out, sr)
    print(f"{len(out) / sr:.2f}s written")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
