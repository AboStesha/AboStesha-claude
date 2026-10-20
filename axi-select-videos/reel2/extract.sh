#!/bin/bash
# clips/<name>.mp4 (24 fps, 720x1280) -> frames/<name>/NNNN.jpg at 30 fps (frame-blend free: nearest-frame resample)
for f in "$@"; do n=$(basename "$f" .mp4); mkdir -p frames/$n; [ -f frames/$n/0001.jpg ] && continue
  ffmpeg -v error -y -i "$f" -vf "fps=30,scale=720:1280:flags=lanczos" -q:v 2 frames/$n/%04d.jpg; echo "$n $(ls frames/$n | wc -l)"; done
