# build_ext2.py - extended studio floor for the L4 virtual camera (WIDE / extreme-wide framings).
#
# The plate is continued as one large studio floor: in the WIDE (s=0.30) and EW (s=0.22, dy=0.03) framings the floor
# reaches the left, right and bottom frame edges, the floor-to-void horizon continues straight at the plate's own height
# and the void above stays the plate's black. Replaces build_ext.py / l4_ext.jpg (floor died to black ~600 px outside).
#
#   python3 -I work/build_ext2.py plates/L4 comp/assets/l4_ext2.jpg comp/assets/l4_feather2.png [diag_dir]
#
# l4_ext2.jpg (4640x2680, JPEG q90) covers plate units x in [-3600, 5680), y in [-2560, 2800) at 0.5 px per plate px:
#   fx.js afterPlate: pc.drawImage(ext, -3600, -2560, 9280, 5360)
# (EW s=0.22 dy=0.03 sees x [-3335, 5392], y [-2368, 2541]; margin >= 190 plate px on every side.)
# Inside the plate rectangle it is the plate itself (temporal median of 15 frames), so the live plate can be feathered
# over it without a seam. Deterministic (fixed seed); runs in ~10 s.
#
# Method (half resolution):
#  1. F = temporal median of 15 L4 frames, Lanczos to half res (removes frame noise; Rabee only matters under the live
#     plate). The plate's last 8 rows are darkened by the source: the effective plate bottom is row 1072.
#  2. I = smooth illumination: masked (Rabee/stool excluded) anisotropic Gaussian (12 x 80 plate px) of F, so the
#     horizon profile and the stool shadow stay in I; t = F / I - 1 = floor texture.
#  3. Texture outside the plate by image quilting (64 px blocks, min-error boundary cuts) from the subject-free plate
#     floor (x < 700 or x > 1230), so there is no mirroring, tiling or ghost of Rabee / stool / shadow:
#     - sides: row-locked blocks (source row within +-48 plate px of the target row), so the foreshortening of every
#       row matches the plate; quilted outward starting from the plate's own edge columns (the cut lies in them);
#     - below: blocks from the lower floor, quilted down from the plate/side texture, then warped with a gentle
#       perspective magnification about the plate centre (about x1.9 across / x2.6 down at the EW frame bottom).
#     Mild unsharp mask (0.6 @ 1 px) offsets the canvas' bilinear upscale at HOME (1 ext px = 1.32 screen px).
#  4. Illumination outside, per channel: ambient floor A = AMB (0.68) x the plate edge's floor level, following the
#     plate edge's vertical profile (so the horizon continues at the same height), plus the pool excess decaying with
#     distance (rate matched to the plate's own falloff at its edges). Below the plate the bottom row's excess (incl.
#     the stool shadow) is blurred more with distance and fades (450 px); the near-camera floor is 6% darker.
#     Above the plate the top-centre backdrop glow fades upward (320 px); the void elsewhere is the plate void (2/255).
#  5. ext = I_ext * (1 + t_ext) + static fine grain / dither; JPEG q90.
#  6. l4_feather2.png: live-plate alpha 0 on the quilting seam zones (outer 36 px left/right, rows >= 1038 at the
#     bottom), smoothstep to 1 over the next 96 px (sides) / 46 rows (bottom); the top edge is not feathered.
import sys, os, glob, time
import numpy as np
from PIL import Image
from scipy import ndimage as nd

T0 = time.time()
src_dir, out_jpg, out_fea = sys.argv[1], sys.argv[2], sys.argv[3]
diag = sys.argv[4] if len(sys.argv) > 4 else None
rng = np.random.default_rng(20261020)

PW, PH = 1920, 1080
X0, Y0, EWp, EHp = -3600, -2560, 9280, 5360      # plate units
Q = 0.5                                           # image px per plate px
EWi, EHi = int(EWp * Q), int(EHp * Q)             # 4640 x 2680
OX, OY = int(-X0 * Q), int(-Y0 * Q)               # plate origin in ext px (1800, 1280)
pw, ph = int(PW * Q), int(PH * Q)                 # plate size in ext px (960, 540)
AMB = 0.68                                        # ambient floor level / plate edge floor level
PHE = 536                                         # effective plate bottom (half rows): the last plate rows are darkened
SUBJ = (700, 1230)                                # plate px columns holding Rabee, stool and their shadow

def log(*a):
    print("[%5.1fs]" % (time.time() - T0), *a, flush=True)

# ---------------------------------------------------------------- 1. median plate (half res)
files = sorted(glob.glob(os.path.join(src_dir, "*.jpg")))
idx = np.linspace(40, len(files) - 41, 15).astype(int)
stack = np.stack([np.asarray(Image.open(files[i]).convert("RGB")) for i in idx])
Ff = np.median(stack, axis=0).astype(np.float32)           # full-res median (1080, 1920, 3)
del stack
# Lanczos to half resolution (keeps more fine texture than a box average)
F = np.dstack([np.asarray(Image.fromarray(Ff[..., c], "F").resize((pw, ph), Image.LANCZOS)) for c in range(3)])
F = np.clip(F, 0, 255).astype(np.float32)                   # (540, 960, 3)
del Ff
Yf = F.mean(-1)
log("median of", len(idx), "frames")

# void level: outer columns above the floor
vmask = np.zeros((ph, pw), bool)
vmask[50:270, :150] = True; vmask[50:270, -150:] = True
v0 = np.median(F[vmask], axis=0)                           # per channel
log("void", v0.round(2))

# ---------------------------------------------------------------- 2. illumination + texture
xs = np.arange(pw); ys = np.arange(ph)
box = np.zeros((ph, pw), bool)
box[40:528, int(SUBJ[0] * Q):int(SUBJ[1] * Q)] = True
loc = nd.uniform_filter(Yf, 60)
nonfloor = box & (Yf < 0.55 * np.maximum(loc, 8)) & (ys[:, None] > 280)
nonfloor |= box & (ys[:, None] <= 280) & (Yf > 6)          # his body above the floor line
nonfloor = nd.binary_dilation(nonfloor, iterations=4)
nonfloor[PHE:] = True                                      # dark bottom border rows of the plate: not floor
wm = (~nonfloor).astype(np.float32)

def mblur(A, sy, sx):
    num = nd.gaussian_filter(A * wm[..., None], (sy, sx, 0), mode="nearest")
    den = nd.gaussian_filter(wm, (sy, sx), mode="nearest")[..., None]
    return num / np.maximum(den, 1e-4)

I = mblur(F, 6, 40)                                         # sigma 12 x 80 plate px
I = np.maximum(I, 0.3)
t_p = F / I - 1.0
t_p[nonfloor] = 0
# reliability weight for the quilting error (near-void rows count little)
Wt = np.clip(I.mean(-1) / 30.0, 0, 1) ** 2
log("illum + texture; t std floor", t_p[300:540, :300].std().round(4))

# ---------------------------------------------------------------- 3. quilting helpers
B, O = 64, 16          # block, overlap (ext px)
ST = B - O

def vseam(err):        # err (h, w): min-cost top->bottom path; returns per-row column index of the cut
    h, w = err.shape
    C = err.copy()
    for i in range(1, h):
        p = C[i - 1]
        l = np.r_[np.inf, p[:-1]]; r = np.r_[p[1:], np.inf]
        C[i] += np.minimum(np.minimum(l, p), r)
    path = np.zeros(h, int)
    path[-1] = int(np.argmin(C[-1]))
    for i in range(h - 2, -1, -1):
        j = path[i + 1]
        lo, hi = max(0, j - 1), min(w, j + 2)
        path[i] = lo + int(np.argmin(C[i, lo:hi]))
    return path

def cutmask(err_l, err_t):
    """weight of the NEW block over (B,B): 0 left of the vertical cut / above the horizontal cut, 1-px soft edges"""
    m = np.ones((B, B), np.float32)
    jj = np.arange(B)[None, :]
    if err_l is not None:
        p = vseam(err_l)                                       # (B,) cut col in [0,O)
        m *= np.clip((jj - p[:, None]) / 2.0 + 0.5, 0, 1)
    if err_t is not None:
        p = vseam(err_t.T)                                     # (B,) cut row per column
        ii = np.arange(B)[:, None]
        m *= np.clip((ii - p[None, :]) / 2.0 + 0.5, 0, 1)
    return m

def quilt_place(canvas, wcan, y, x, srcT, cands, top_ok, left_ok, pick_tol=1.12):
    """place one block at canvas[y:y+B, x:x+B] choosing among candidate source windows (cy, cx) in srcT."""
    cy, cx = cands
    ii = np.arange(B)[:, None]; jj = np.arange(B)[None, :]
    old = canvas[y:y + B, x:x + B]
    known = ~np.isnan(old[..., 0])
    errs = np.zeros(len(cy), np.float64)
    wgt = wcan[y:y + B, x:x + B]
    if left_ok:
        o = np.nan_to_num(old[:, :O]); k = (known[:, :O] * wgt[:, :O])[None, ..., None]
        s = srcT[cy[:, None, None] + ii, cx[:, None, None] + jj[:, :O]]
        errs += ((s - o[None]) ** 2 * k).sum(axis=(1, 2, 3))
    if top_ok:
        o = np.nan_to_num(old[:O, :]); k = (known[:O, :] * wgt[:O, :])[None, ..., None]
        s = srcT[cy[:, None, None] + ii[:O], cx[:, None, None] + jj]
        errs += ((s - o[None]) ** 2 * k).sum(axis=(1, 2, 3))
    if left_ok or top_ok:
        good = np.flatnonzero(errs <= errs.min() * pick_tol + 1e-9)
        c = rng.choice(good)
    else:
        c = rng.integers(len(cy))
    blk = srcT[cy[c]:cy[c] + B, cx[c]:cx[c] + B]
    el = et = None
    if left_ok:
        el = (((blk[:, :O] - np.nan_to_num(old[:, :O])) ** 2).sum(-1) * known[:, :O] + 1e-6)
    if top_ok:
        et = (((blk[:O, :] - np.nan_to_num(old[:O, :])) ** 2).sum(-1) * known[:O, :] + 1e-6)
    m = cutmask(el, et)[..., None]
    m = np.where(known[..., None], m, 1.0)
    canvas[y:y + B, x:x + B] = np.where(np.isnan(old), blk, old * (1 - m) + blk * m)
    return cy[c], cx[c]

# subject-free source columns (block windows fully outside the subject band)
def valid_cols():
    cols = np.arange(0, pw - B + 1)
    a, b = SUBJ[0] * Q, SUBJ[1] * Q
    return cols[(cols + B <= a) | (cols >= b)]

# ---------------------------------------------------------------- 3a. sides: row-locked quilting in plate rows
side_rows = [PHE - B - ST * k for k in range(6)][::-1]      # last block ends at the effective plate bottom row
log("side rows", side_rows)

def quilt_side(flip):
    """returns texture for the region outside one plate side, in 'outward' orientation:
    canvas columns [0, O) = plate edge columns, then outward. flip=True for the left side."""
    tp = t_p[:, ::-1] if flip else t_p
    wp = Wt[:, ::-1] if flip else Wt
    out_w = OX if flip else EWi - OX - pw                   # ext px from the plate edge to the ext border
    ncol = int(np.ceil((out_w + O) / ST)) + 1
    Wc = O + ncol * ST + O
    can = np.full((ph, Wc, 3), np.nan, np.float32)
    can[:, :O] = tp[:, pw - O:]                             # plate's own outer columns (the overlap)
    wcan = np.zeros((ph, Wc), np.float32)
    wcan[:, :] = wp[:, pw - O:pw - O + 1]                   # per-row weight (same rows)
    cols = valid_cols()
    if flip:  # valid source columns in the flipped plate
        cols = (pw - B) - cols
    for c in range(ncol):
        x = c * ST
        for r, y in enumerate(side_rows):
            ylo, yhi = max(0, y - 24), min(ph - B, y + 24)
            n = 160
            cy = rng.integers(ylo, yhi + 1, n)
            cx = rng.choice(cols, n)
            quilt_place(can, wcan, y, x, tp, (cy, cx), top_ok=(r > 0), left_ok=True)
    return can

tL = quilt_side(True)
log("left side quilted", tL.shape)
tR = quilt_side(False)
log("right side quilted", tR.shape)

# assemble the plate-row band (rows of the plate, all ext columns)
y_top_q = side_rows[0]                                      # quilted rows start here (plate half rows)
band = np.zeros((ph, EWi, 3), np.float32)  # rows >= PHE unused
band[:, OX:OX + pw] = t_p
nl = OX
L = tL[:, O:O + nl][:, ::-1]                                # outward from the edge -> flip back
band[:, :OX] = L
band[:, OX + pw - O:OX + pw] = tR[:, :O]                    # overlap zone (cut) on the right edge
band[:, OX:OX + O] = tL[:, :O][:, ::-1]                     # overlap zone (cut) on the left edge
nr = EWi - OX - pw
band[:, OX + pw:] = tR[:, O:O + nr]
band[:y_top_q] = 0.0
band = np.nan_to_num(band)

# ---------------------------------------------------------------- 3b. below the plate: quilt in warped space
c_mag = 0.70 / 1000.0
def kh(dyp):   # horizontal magnification at dyp plate px below the plate (C1 at 0)
    return 1 + c_mag * dyp ** 2 / (dyp + 200.0)
def kv(dyp):
    return kh(dyp) ** 1.5
dy_max = (EHi - (OY + PHE)) / Q + 4
dd = np.linspace(0, dy_max, 20001)
vcum = np.concatenate([[0], np.cumsum((1 / kv(dd[1:]) + 1 / kv(dd[:-1])) / 2 * np.diff(dd))])   # plate px
VQ = int(np.ceil(vcum[-1] * Q)) + 2                          # Q rows needed below the seam row
nrow = int(np.ceil((VQ + O) / ST)) + 1
Hq = O + nrow * ST + O
ncolq = int(np.ceil((EWi - O) / ST)) + 1
Wq = O + ncolq * ST
qc = np.full((Hq, Wq, 3), np.nan, np.float32)
qc[:O, :EWi] = band[PHE - O:PHE]                             # existing texture above the seam
wq = np.ones((Hq, Wq), np.float32)
# sources: lower plate floor (rows 380..540 half), both orientations
srcB = np.concatenate([t_p, t_p[:, ::-1]], axis=1)
colsB = valid_cols()
colsB = np.concatenate([colsB, (2 * pw - B) - colsB])
log("below: Q rows", VQ, "grid", nrow, "x", ncolq)
for r in range(nrow):
    y = r * ST
    for c in range(ncolq):
        x = c * ST
        n = 140
        cy = rng.integers(380, PHE - B + 1, n)
        cx = rng.choice(colsB, n)
        quilt_place(qc, wq, y, x, srcB, (cy, cx), top_ok=True, left_ok=(c > 0))
qc = np.nan_to_num(qc[:, :EWi])
log("below quilted", qc.shape)

# ---------------------------------------------------------------- texture field over the whole ext
T = np.zeros((EHi, EWi, 3), np.float32)
T[OY:OY + PHE] = band[:PHE]
# rows below the plate via the warp (rows OY+ph-O .. end); Q row 0 = ext row OY+ph-O
yy = np.arange(OY + PHE, EHi)
dyp = (yy - (OY + PHE)) / Q
vq = O + np.interp(dyp, dd, vcum) * Q                          # Q row (float)
xc = (960 - X0) * Q
XX = np.arange(EWi)[None, :]
U = xc + (XX - xc) / kh(dyp)[:, None]
VV = np.broadcast_to(vq[:, None], U.shape)
for ch in range(3):
    T[OY + PHE:, :, ch] = nd.map_coordinates(qc[..., ch], [VV, U], order=3, mode="nearest")
T[OY + PHE - O:OY + PHE] = qc[:O]                            # seam rows (cut between plate/side and below)
del qc, band
log("texture field")

# ---------------------------------------------------------------- 4. illumination outside the plate
fI = I - v0                                                  # floor component (per channel)
eL = fI[:, :8].mean(1)                                       # (ph, 3) left edge profile
eR = fI[:, -10:-2].mean(1)
# pool falloff rate at the edges (relative slope of the floor level over the outer 120 plate px), floor rows only
rows = slice(int(820 * Q), int(1060 * Q))
def relslope(a_in, a_out):
    return float(np.mean(np.log(np.maximum(a_in[rows].mean(-1), 1)) - np.log(np.maximum(a_out[rows].mean(-1), 1)))) / 120.0
kL = relslope(fI[:, int(120 * Q):int(120 * Q) + 8].mean(1), eL)
kR = relslope(fI[:, pw - int(120 * Q) - 10:pw - int(120 * Q) - 2].mean(1), eR)
Lx_L = np.clip((1 - AMB) / max(kL, 1e-5), 250, 1200)
Lx_R = np.clip((1 - AMB) / max(kR, 1e-5), 250, 1200)
eB = fI[PHE - 4:PHE].mean(0)                                 # (pw, 3) effective bottom row
kB = float(np.mean(np.log(np.maximum(fI[PHE - 40:PHE - 34].mean(0).mean(-1), 1)) - np.log(np.maximum(eB.mean(-1), 1)))) / 72.0
Ly = 450.0
log("edge rel. slopes /px  L %.5f R %.5f B %.5f -> Lx %.0f %.0f" % (kL, kR, kB, Lx_L, Lx_R))
Xp = (np.arange(EWi) / Q) + X0                               # plate x of each ext column
Yp = (np.arange(EHi) / Q) + Y0
dxL = np.maximum(0, -Xp); dxR = np.maximum(0, Xp - (PW - 1))
PxL = np.exp(-dxL / Lx_L); PxR = np.exp(-dxR / Lx_R)
Iext = np.zeros((EHi, EWi, 3), np.float32)
# (a) plate rows
r0, r1 = OY, OY + PHE
fa = np.zeros((ph, EWi, 3), np.float32)
fa[:, OX:OX + pw] = fI
L_ = (AMB * eL)[:, None, :] + ((1 - AMB) * eL)[:, None, :] * PxL[None, :OX, None]
fa[:, :OX] = L_
R_ = (AMB * eR)[:, None, :] + ((1 - AMB) * eR)[:, None, :] * PxR[None, OX + pw:, None]
fa[:, OX + pw:] = R_
Iext[r0:r1] = fa[:PHE]
# (b) below the plate: ambient + decaying excess of the bottom row, blurred more with distance
dyb = Yp[r1:] - (PHE / Q - 1)
hamb = 1.0 - 0.06 * (1 - np.exp(-dyb / 1400.0))              # near-camera floor slightly darker
bot = np.zeros((EWi, 3), np.float32)
bot[OX:OX + pw] = eB
eLb, eRb = eL[PHE - 4:PHE].mean(0), eR[PHE - 4:PHE].mean(0)
bot[:OX] = (AMB * eLb)[None] + ((1 - AMB) * eLb)[None] * PxL[:OX, None]
bot[OX + pw:] = (AMB * eRb)[None] + ((1 - AMB) * eRb)[None] * PxR[OX + pw:, None]
wx = np.clip(Xp / (PW - 1), 0, 1)[:, None]
ambB = wx * (AMB * eRb)[None] + (1 - wx) * (AMB * eLb)[None]   # (EWi, 3)
exc = bot - ambB
sig_levels = np.array([0, 20, 40, 80, 160, 320, 640.0])      # plate px
excs = [exc] + [nd.gaussian_filter1d(exc, s * Q, axis=0, mode="nearest") for s in sig_levels[1:]]
excs = np.stack(excs)                                        # (n, EWi, 3)
sig_row = 15 + 0.8 * dyb
li = np.interp(sig_row, sig_levels, np.arange(len(sig_levels)))
i0 = np.floor(li).astype(int); i1 = np.minimum(i0 + 1, len(sig_levels) - 1); fr = (li - i0)[:, None, None]
exc_rows = excs[i0] * (1 - fr) + excs[i1] * fr               # (nrows, EWi, 3)
Py = np.exp(-dyb / Ly)[:, None, None]
Iext[r1:] = ambB[None] * hamb[:, None, None] + exc_rows * Py
# (c) above the plate: top-centre glow fades upward; elsewhere void
dyt = np.maximum(0, -Yp[:r0])                                # plate px above the plate
top = fI[:6].mean(0)                                         # (pw, 3)
topx = np.zeros((EWi, 3), np.float32); topx[OX:OX + pw] = np.maximum(top, 0)
glv = [topx] + [nd.gaussian_filter1d(topx, s * Q, axis=0, mode="constant") for s in sig_levels[1:]]
glv = np.stack(glv)
sig_t = 12 + 0.6 * dyt
lt = np.interp(sig_t, sig_levels, np.arange(len(sig_levels)))
j0 = np.floor(lt).astype(int); j1 = np.minimum(j0 + 1, len(sig_levels) - 1); ft = (lt - j0)[:, None, None]
Iext[:r0] = (glv[j0] * (1 - ft) + glv[j1] * ft) * np.exp(-dyt / 320.0)[:, None, None]
Iext += v0[None, None, :]
log("illumination")

# ---------------------------------------------------------------- 5. compose
# mild unsharp mask on texture and plate interior: offsets the canvas' bilinear upscale at HOME (1 ext px = 1.32 px)
SH, SHS = 0.6, 1.0
T = T + SH * (T - nd.gaussian_filter(T, (SHS, SHS, 0)))
Fs = F + SH * (F - nd.gaussian_filter(F, (SHS, SHS, 0)))
E = Iext * (1 + T)
E[OY:OY + PHE - O, OX + O:OX + pw - O] = Fs[: PHE - O, O:pw - O]  # plate interior (median frame)
# dither / fine grain (static): luma-proportional on the floor, +-0.5 level everywhere
g = rng.standard_normal((EHi, EWi)).astype(np.float32)
E += (0.45 + 0.010 * Iext.mean(-1))[..., None] * g[..., None]
E = np.clip(E + rng.uniform(-0.5, 0.5, E.shape).astype(np.float32), 0, 255)
img = Image.fromarray(np.round(E).astype(np.uint8))
img.save(out_jpg, quality=90, optimize=True)
log("saved", out_jpg, img.size, os.path.getsize(out_jpg), "bytes")

# ---------------------------------------------------------------- 6. feather mask for the live plate
def ss(u):
    u = np.clip(u, 0, 1); return u * u * (3 - 2 * u)
x = np.arange(PW)[None, :].astype(np.float32); y = np.arange(PH)[:, None].astype(np.float32)
a = ss((x - 36) / 96.0) * ss((PW - 1 - 36 - x) / 96.0) * ss((PHE / Q - O / Q - 2 - y) / 46.0)
a8 = np.round(a * 255).astype(np.uint8)
Image.fromarray(np.dstack([np.full((PH, PW), 255, np.uint8)] * 3 + [a8]), "RGBA").save(out_fea)
log("saved", out_fea)

if diag:
    os.makedirs(diag, exist_ok=True)
    Image.fromarray(np.round(np.clip(E, 0, 255)).astype(np.uint8)).resize((EWi // 4, EHi // 4), Image.LANCZOS).save(diag + "/ext2_small.jpg", quality=88)
    np.save(diag + "/I_plate.npy", I); np.save(diag + "/F_half.npy", F)
    log("diag")
