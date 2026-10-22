#!/bin/bash
cd /home/user/rr/sound3/voice/sync
while [ ! -f /home/user/.bg/427231dd.exit ]; do sleep 5; done
python3 falign_sync.py /home/user/rr/axi-select-ch2/audio/vo/vo2_sync.wav /home/user/rr/axi-select-ch2/work/vo_pauses_sync.json falign_sync.json > falign_sync.log 2>&1
python3 words_sync.py /home/user/rr/axi-select-ch2/audio/vo/vo2_sync.wav falign_sync.json /home/user/rr/axi-select-ch2/work/vo_pauses_sync.json /home/user/rr/axi-select-ch2/work/asr/sync_words.json > words_sync.log 2>&1
python3 fc_sync.py cases_extra.json final,sync '{"final":"/home/user/rr/axi-select-ch2/audio/vo/vo2_final.wav","sync":"/home/user/rr/axi-select-ch2/audio/vo/vo2_sync.wav"}' fc_extra_rows.jsonl > fc_extra.log 2>&1
echo AFTER_DONE
