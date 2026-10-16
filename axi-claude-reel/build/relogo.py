import sys, subprocess, numpy as np, cv2
from PIL import Image
src, out, L = sys.argv[1], sys.argv[2], sys.argv[3]
W, H = 1080, 1920
axi = np.array(Image.open(f'{L}/axi_white_wordmark.png').convert('RGBA'))
cla = np.array(Image.open(f'{L}/claude_orange.png').convert('RGBA'))
word = np.array(Image.open(f'{L}/claude_word.png').convert('RGBA'))

def paste(img, logo, cx, cy, w, shop=.28):
    h = int(logo.shape[0] * w / logo.shape[1])
    lg = cv2.resize(logo, (w, h), interpolation=cv2.INTER_AREA).astype(np.float32)
    a = lg[..., 3:] / 255
    x0, y0 = int(cx - w / 2), int(cy - h / 2)
    # soft clay-like emboss: dark shadow offset down-right, then the logo
    sh = cv2.GaussianBlur(a[..., 0], (0, 0), max(2, w / 90))
    for (dx, dy, col, op, m) in [(int(w * .012) + 2, int(w * .016) + 2, 0, shop, sh), (0, 0, None, 1, a[..., 0])]:
        X0, Y0 = x0 + dx, y0 + dy
        cx0, cy0 = max(0, -X0), max(0, -Y0)
        cx1, cy1 = min(w, img.shape[1] - X0), min(h, img.shape[0] - Y0)
        if cx1 <= cx0 or cy1 <= cy0: continue
        roi = img[Y0 + cy0:Y0 + cy1, X0 + cx0:X0 + cx1].astype(np.float32)
        mm = (m * op)[cy0:cy1, cx0:cx1, None]
        fill = np.zeros_like(roi) if col is not None else lg[cy0:cy1, cx0:cx1, :3] * .97 + 4
        img[Y0 + cy0:Y0 + cy1, X0 + cx0:X0 + cx1] = (roi * (1 - mm) + fill * mm).astype(np.uint8)

def blocks(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_RGB2HSV)
    hch, sat, val = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    base = (sat > 90) & (val > 60)
    res = []
    for m in [base & ((hch >= 165) | (hch <= 3)), base & (hch >= 5) & (hch <= 20)]:
        m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((31, 31), np.uint8))
        n, lab, st, _ = cv2.connectedComponentsWithStats(m)
        if n < 2: return []
        i = max(range(1, n), key=lambda i: st[i, 4])
        mm = (lab == i).astype(np.uint8)
        cnts, _ = cv2.findContours(mm, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        hull = np.zeros_like(mm); cv2.drawContours(hull, [cv2.convexHull(max(cnts, key=cv2.contourArea))], -1, 1, -1)
        x, y, w, h = st[i, :4]
        res.append((hull, x, y, w, h))
    return res

dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '25', '-i', '-',
                        '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
k = 0
while True:
    b = dec.stdout.read(W * H * 3)
    if len(b) < W * H * 3: break
    fr = np.frombuffer(b, np.uint8).reshape(H, W, 3).copy()
    bl = blocks(fr)
    if len(bl) == 2:
        hsv = cv2.cvtColor(fr, cv2.COLOR_RGB2HSV)
        for j, (hull, x, y, w, h) in enumerate(bl):
            inner = cv2.erode(hull, np.ones((15, 15), np.uint8))
            light = ((hsv[..., 1] < 110) & (hsv[..., 2] > 150)).astype(np.uint8) & inner
            light = cv2.dilate(light, np.ones((9, 9), np.uint8)) & inner
            pad = 20; x0, y0, x1, y1 = max(0, x - pad), max(0, y - pad), min(W, x + w + pad), min(H, y + h + pad)
            crop = cv2.cvtColor(fr[y0:y1, x0:x1], cv2.COLOR_RGB2BGR)
            crop = cv2.inpaint(crop, light[y0:y1, x0:x1] * 255, 9, cv2.INPAINT_TELEA)
            fr[y0:y1, x0:x1] = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
            ys, xs = np.nonzero(inner)
            cy = (ys.min() + ys.max()) / 2
            o = bl[1 - j]; ow = o[3]
            bw = max(xs.max() - xs.min(), ow - 14) if (x <= 1 or x + w >= W - 1) else xs.max() - xs.min()
            if x <= 1: cx = xs.max() - bw / 2
            elif x + w >= W - 1: cx = xs.min() + bw / 2
            else: cx = (xs.min() + xs.max()) / 2
            if j == 0: paste(fr, axi, cx, cy, int(bw * .70))
            else:
                # recolour orange clay to white clay, keep shading
                fm = cv2.GaussianBlur(cv2.dilate(hull, np.ones((7, 7), np.uint8)).astype(np.float32), (0, 0), 3)[..., None]
                hv = cv2.cvtColor(fr, cv2.COLOR_RGB2HSV)[..., 2].astype(np.float32)
                med = np.median(hv[inner > 0]); sh = np.clip(hv / med, 0.55, 1.12)[..., None]
                white = np.array([250, 250, 253], np.float32) * sh ** 1.1
                tint = np.array([222, 225, 246], np.float32)
                col = white * np.clip(sh, 0, 1) + tint * (1 - np.clip(sh, 0, 1))
                fr[:] = (fr * (1 - fm) + np.clip(col, 0, 255) * fm).astype(np.uint8)
                bh = ys.max() - ys.min()
                paste(fr, cla, cx, cy - bh * .13, int(bw * .47), .12)
                paste(fr, word, cx, cy + bh * .23, int(bw * .58), .0)
    enc.stdin.write(fr.tobytes()); k += 1
enc.stdin.close(); enc.wait(); print('frames', k)
