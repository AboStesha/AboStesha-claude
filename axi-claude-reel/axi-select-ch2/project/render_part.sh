# render one contiguous frame range of the subtitled or clean cut (no audio), so the 2275-frame film fits the sandbox's
# 15-minute background-job cap: sh work/render_part.sh <subs|clean> <A> <B>   -> out/part_<mode>_<A>.mp4
# (run the parts as parallel background jobs on the XL sandbox, then sh work/join_parts.sh <mode>)
set -e
export RR_CHROME_FLAGS="--disable-background-timer-throttling --disable-renderer-backgrounding --disable-backgrounding-occluded-windows --disable-features=IntensiveWakeUpThrottling"
R=$HF_WORKFLOWS/katana/scripts/comp/render.py
W=/home/user/rr/axi-select-ch2
cd $W
E=comp/edl.json; [ "$1" = "clean" ] && E=comp/edl_clean.json
python3 $R render $W --edl $E --no-sfx --audio none --jobs 1 --frames $2:$3 --out out/part_$1_$2.mp4 > logs/part_$1_$2.log 2>&1
echo "part $1 $2-$3 done"
