#!/usr/bin/env bash
# Build the 20 s vertical video: voiceover -> music -> frames -> mux.
# Usage: ./build.sh <models_dir> <work_dir>
#   models_dir needs kokoro-v1.0.onnx + voices-v1.0.bin
#   (github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0)
set -euo pipefail
cd "$(dirname "$0")"
M=$1; W=$2; mkdir -p "$W"

# 1. voiceover (one clip per scene), lightly time-compressed to fit 20 s
python3 tts.py "$M" "$W" bf_emma 1.25
for i in 1 2 3 4; do ffmpeg -v error -y -i "$W/vo$i.wav" -af "atempo=1.09" -ar 44100 -ac 1 "$W/vo${i}f.wav"; done

# 2. music
python3 music.py "$W/music.wav"

# 3. mix: VO starts at 0.20 / 6.15 / 10.55 / 15.50 s, music ducked under the voice
ffmpeg -v error -y -i "$W/vo1f.wav" -i "$W/vo2f.wav" -i "$W/vo3f.wav" -i "$W/vo4f.wav" -i "$W/music.wav" -filter_complex "
 [0]adelay=200|200[a];[1]adelay=6150|6150[b];[2]adelay=10550|10550[c];[3]adelay=15500|15500[d];
 [a][b][c][d]amix=inputs=4:normalize=0,apad,atrim=0:20,pan=stereo|c0=c0|c1=c0,
  highpass=f=80,equalizer=f=3500:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,asplit=2[vo][key];
 [4]volume=-15dB[mus];
 [mus][key]sidechaincompress=threshold=0.03:ratio=4:attack=30:release=350[duck];
 [vo][duck]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=7,atrim=0:20,afade=t=out:st=19.5:d=0.5[out]" \
 -map "[out]" -ar 48000 "$W/mix.wav"

# 4. frames (headless Chromium) -> H.264, then mux
node frames.js "$W/video_noaudio.mp4" 30
ffmpeg -v error -y -i "$W/video_noaudio.mp4" -i "$W/mix.wav" -c:v copy -c:a aac -b:a 192k -shortest -t 20 \
  -movflags +faststart protect-your-savings.mp4

# 5. second version with scene-3 subtitles
SUBS=1 node frames.js "$W/video_subs_noaudio.mp4" 30
ffmpeg -v error -y -i "$W/video_subs_noaudio.mp4" -i "$W/mix.wav" -c:v copy -c:a aac -b:a 192k -shortest -t 20 \
  -movflags +faststart protect-your-savings-subtitle.mp4
for f in protect-your-savings.mp4 protect-your-savings-subtitle.mp4; do
  ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact "$f"
done
