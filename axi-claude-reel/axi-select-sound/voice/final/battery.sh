cd /home/user/rr/sound3/voice/final
C=$1
python3 meas.py $C.wav > meas_$C.log 2>&1
python3 g2.py v3 $C.wav > g2_$C.log 2>&1
python3 evalz.py X0.wav $C.wav > evalz_$C.log 2>&1
python3 artic.py v3 $C.wav > artic_$C.log 2>&1
python3 tails.py v3 $C.wav > tails_$C.log 2>&1
python3 asrx.py asr_$C.json $C=/home/user/rr/sound3/voice/final/$C.wav > asr_$C.log 2>&1
python3 fcx.py cases_all.json fc_$C.json $C=/home/user/rr/sound3/voice/final/$C.wav > fc_$C.log 2>&1
echo BATTERY_DONE
