#!/bin/bash
# clips/<name>.mp4 (24 fps, 720x1280) -> frames24/<name>/NNNN.jpg at the native 24 fps; comp.html cross-blends neighbours by the fractional source frame
for f in "$@"; do n=$(basename "$f" .mp4); mkdir -p frames24/$n; [ -f frames24/$n/0001.jpg ] && continue
  ffmpeg -v error -y -i "$f" -vf "scale=720:1280:flags=lanczos" -q:v 2 frames24/$n/%04d.jpg; echo "$n $(ls frames24/$n | wc -l)"; done
