#!/bin/bash
# clips/<name>.mp4 (24 fps, 720x1280) -> frames24/<name>/NNNN.jpg at the native 24 fps; then rebuild clips.js
cd "$(dirname "$0")"
for f in clips/*.mp4; do n=$(basename "$f" .mp4); if [ -f frames24/$n/.done ]; then continue; fi
  rm -rf frames24/$n; mkdir -p frames24/$n
  ffmpeg -v error -y -i "$f" -vf "scale=720:1280:flags=lanczos" -q:v 2 frames24/$n/%04d.jpg && touch frames24/$n/.done; echo "$n $(ls frames24/$n/*.jpg | wc -l)"; done
python3 - <<'PY'
import os, json
c = {n: len([f for f in os.listdir('frames24/' + n) if f.endswith('.jpg')]) for n in sorted(os.listdir('frames24'))}
open('clips.js', 'w').write('window.CLIPS = ' + json.dumps(c) + ';\n'); print(c)
PY
