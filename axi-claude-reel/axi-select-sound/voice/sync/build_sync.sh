#!/bin/bash
# build_sync.sh -- reproducible build of /home/user/rr/axi-select-ch2/audio/vo/vo2_sync.wav from vo2_final.wav
#   1. vo2_sync.wav            (make_sync.py: move the early-timed stretches 4094 samples later, joins; ~10 s)
#   2. work/vo_pauses_sync.json (voice3/chk/pauses.py, same parameters as vo_pauses_vo.json)
#   3. work/asr/sync_words.json (forced alignment of the v3_words word list on vo2_sync, ~3 min on 1 CPU; skip with NOWORDS=1)
set -euo pipefail
cd /home/user/rr/sound3/voice/sync
IN=/home/user/rr/axi-select-ch2/audio/vo/vo2_final.wav
OUT=/home/user/rr/axi-select-ch2/audio/vo/vo2_sync.wav
PJ=/home/user/rr/axi-select-ch2/work/vo_pauses_sync.json
WJ=/home/user/rr/axi-select-ch2/work/asr/sync_words.json
echo "0b4d6c3689950486918515cb4c8b2fcf  $IN" | md5sum -c -
python3 make_sync.py "$OUT" --meta vo2_sync_build.json
echo "a359c2a20778c554fb940821c0d14bae  $OUT" | md5sum -c -
python3 /home/user/rr/voice3/chk/pauses.py "$OUT" "$PJ"
if [ "${NOWORDS:-0}" != "1" ]; then
  python3 falign_sync.py "$OUT" "$PJ" falign_sync.json
  python3 words_sync.py "$OUT" falign_sync.json "$PJ" "$WJ"
fi
echo BUILD_OK
