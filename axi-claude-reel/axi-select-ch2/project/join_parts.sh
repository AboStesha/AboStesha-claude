# join the rendered parts of one cut (in frame order) and mux the final mix: sh work/join_parts.sh <subs|clean>
set -e
W=/home/user/rr/axi-select-ch2
cd $W
ls out/part_$1_*.mp4 | sort -t_ -k3 -n | sed "s|^|file '$W/|; s|$|'|" > out/parts_$1.txt
O=out/comp_ep2.mp4; [ "$1" = "clean" ] && O=out/comp_ep2_clean.mp4
ffmpeg -v error -y -f concat -safe 0 -i out/parts_$1.txt -i audio/mix.m4a -map 0:v -map 1:a -c copy -movflags +faststart -t 91.0 $O
ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames,width,height,r_frame_rate -of csv=p=0 $O
echo "joined $O"
