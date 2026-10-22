cd /home/user/rr/sound3/voice/final
while ! grep -q SEPDONE sep2/runall.log; do sleep 10; done
python3 mkcomp.py cand9.wav > /dev/null
mv sep2/kim_fin sep2/kim_fin_cand7; mv sep2/kim_fin.log sep2/kim_fin_cand7.log
env -u PYTHONPATH /home/user/venv_dm/bin/python /home/user/rr/voice3/ver/runsep.py /home/user/rr/sound3/voice/final/sep2/C_fin.wav vocals_mel_band_roformer.ckpt /home/user/rr/sound3/voice/final/sep2/kim_fin > sep2/kim_fin.log 2>&1
python3 resid2.py fin v3 dryA > sep2/resid2.log 2>&1
python3 asrx.py asr_cand9.json cand9=/home/user/rr/sound3/voice/final/cand9.wav > asr_cand9.log 2>&1
python3 fcx.py cases_all.json fc_cand9.json cand9=/home/user/rr/sound3/voice/final/cand9.wav > fc_cand9.log 2>&1
python3 meas.py cand9.wav > meas_cand9.log 2>&1
python3 g2.py v3 cand9.wav enh > g2_cand9.log 2>&1
echo AFTER_DONE
