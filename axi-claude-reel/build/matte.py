import sys, subprocess, numpy as np
from rembg import new_session, remove
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
W,H=540,960
sess = new_session('u2net_human_seg')
dec = subprocess.Popen(['ffmpeg','-v','error','-i',src,'-vf',f'scale={W}:{H}','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','gray','-s',f'{W}x{H}','-r','25','-i','-','-c:v','libx264','-crf','12','-pix_fmt','yuv420p',out],stdin=subprocess.PIPE)
n=0
while True:
    b=dec.stdout.read(W*H*3)
    if len(b)<W*H*3: break
    img=Image.fromarray(np.frombuffer(b,np.uint8).reshape(H,W,3))
    m=remove(img,session=sess,only_mask=True)
    enc.stdin.write(np.array(m.convert('L')).tobytes()); n+=1
    if n%100==0: print(n,flush=True)
enc.stdin.close(); enc.wait(); print('done',n)
