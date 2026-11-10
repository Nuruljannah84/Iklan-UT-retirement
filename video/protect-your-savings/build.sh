#!/usr/bin/env bash
# Build the 20 s vertical video: voiceover -> music -> frames -> mux.
# Usage: ./build.sh <models_dir> <work_dir>
#   models_dir needs kokoro-v1.0.onnx + voices-v1.0.bin
#   (github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0)
set -euo pipefail
cd "$(dirname "$0")"
M=$1; W=$2; mkdir -p "$W"

# 1. Malay voiceover (one clip per scene): Kokoro voice ef_dora at speed 1.05, then a light,
#    formant-preserving time-stretch so the five lines fit 20 s. (tts.py = earlier Manglish version.)
python3 tts_ms.py "$M" "$W" ef_dora 1.05
for i in 1 2 3 4 5; do ffmpeg -v error -y -i "$W/vo$i.wav" -af "rubberband=tempo=1.04:formant=preserved" -ar 44100 -ac 1 "$W/vo${i}f.wav"; done

# 2. music
python3 music.py "$W/music.wav"

# 3. mix: VO starts at 0.15 / 4.72 / 10.04 / 13.91 / 16.71 s, music ducked under the voice
ffmpeg -v error -y -i "$W/vo1f.wav" -i "$W/vo2f.wav" -i "$W/vo3f.wav" -i "$W/vo4f.wav" -i "$W/vo5f.wav" -i "$W/music.wav" -filter_complex "
 [0]adelay=150|150[a];[1]adelay=4720|4720[b];[2]adelay=10040|10040[c];[3]adelay=13910|13910[d];[4]adelay=16710|16710[e];
 [a][b][c][d][e]amix=inputs=5:normalize=0,apad,atrim=0:20,pan=stereo|c0=c0|c1=c0,
  highpass=f=80,equalizer=f=3500:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,asplit=2[vo][key];
 [5]volume=-15dB[mus];
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
