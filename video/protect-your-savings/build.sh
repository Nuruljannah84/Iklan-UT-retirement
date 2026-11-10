#!/usr/bin/env bash
# Build the 25 s vertical video from the consultant's own voice recording.
# Usage: ./build.sh <voice_recording> <work_dir>
#   voice_recording: the original phone recording (any format ffmpeg reads)
set -euo pipefail
cd "$(dirname "$0")"
V=$1; W=$2; mkdir -p "$W"
DUR=25

# 1. voice: rumble filter, noise reduction, tightened pauses (cut list in voice.py)
python3 voice.py "$V" "$W/vo.wav"

# 2. music (10 bars of 2.5 s)
python3 music.py "$W/music.wav" $DUR

# 3. mix: voice starts at 0.25 s; gentle EQ + compression; music ducked under the voice
ffmpeg -v error -y -i "$W/vo.wav" -i "$W/music.wav" -filter_complex "
 [0]adelay=250|250,apad,atrim=0:$DUR,pan=stereo|c0=c0|c1=c0,
  equalizer=f=250:t=q:w=1:g=-2,equalizer=f=3500:t=q:w=1.2:g=2.5,
  acompressor=threshold=-22dB:ratio=3:attack=5:release=90:makeup=2,asplit=2[vo][key];
 [1]volume=-18dB[mus];
 [mus][key]sidechaincompress=threshold=0.03:ratio=4:attack=30:release=350[duck];
 [vo][duck]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=7,atrim=0:$DUR,afade=t=out:st=$((DUR-1)).4:d=0.6[out]" \
 -map "[out]" -ar 48000 "$W/mix.wav"

# 4. frames (headless Chromium) -> H.264, then mux
node frames.js "$W/video_noaudio.mp4" 30
ffmpeg -v error -y -i "$W/video_noaudio.mp4" -i "$W/mix.wav" -c:v copy -c:a aac -b:a 192k -shortest -t $DUR \
  -movflags +faststart protect-your-savings.mp4
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact protect-your-savings.mp4
