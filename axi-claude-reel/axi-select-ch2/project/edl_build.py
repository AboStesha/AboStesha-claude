# edl_build.py — axi-select-ch2: shot list on the VO timeline -> comp/edl.json (1920x1080, 25 fps, 2275 frames)
# Output time = VO time + P. All lip-synced clips start at the VO time of the cut (src = VO), so the mouth stays on the
# voice; L5 and L3 carry HeyGen's +23 ms audio lag (measured again on the ep2 renders).
# Every cut sits on the frame grid VO = 0.01 + 0.04n inside a measured voice pause (work/vo_pauses_vo.json); F -> G is
# drop 1 (output 33.00) and O -> P drop 2 (boom at output 76.69), from work/audio_build.py.
import json, sys

P = 0.63
FPS = 25
END = 91.0
LAG = {"L5": 0.023, "L3": 0.023}
TITLE_VO = 2.37            # title card output 0-3.00
WIPE = [84.09, 84.61]      # VO: end wipe over Q (output 84.72-85.24), then the end card to END
BUG = [8.81, 77.21]        # VO: the logo bug on presenter shots, from the A -> B cut to the P -> Q cut

def f(t):  # output seconds -> frame
    return int(round(t * FPS))

# (vo_start, vo_end, clip, cam, note, beat). clip "BR" = full-screen motion-graphics B-roll; "VC" = L4 under the virtual
# camera (k_vcam: s0, dy0, drift per s, moves [t_vo, dur, s, dy, ease]); s 0.66 HOME, 0.30 WIDE, 0.22 extreme wide.
# Groups pick their shots by k_beat.
HOME, WIDE, EW = 0.66, 0.30, 0.22
S = [
    (2.37, 8.81, "VC", dict(s0=HOME, drift=0.006, moves=[[3.05, 0.62, WIDE, 0.0, "pull"]]), "A welcome (f 75-236): HOME clean, pull to WIDE on «في المرحلة», kicker «المرحلة الثانية» + official lockup in the void, «مرحلة Incubation» line, stage-2 floor pad, four DIM condition pips", "A"),
    (8.81, 10.09, "L2", dict(z0=1.06, z1=1.12, ay=0.4, punch=0.06), "B close-up (f 236-268): «ملاحظة مهمّة» red note tag; bug on from this cut", "B"),
    (10.09, 17.09, "BR", dict(id=1), "C B-ROLL 1 (f 268-443, full-screen MG): the withdrawal window, open until the first trade, then locked", "C"),
    (17.09, 21.85, "VC", dict(s0=EW, dy0=0.03, drift=0.006), "D (f 443-562): hard cut to extreme wide, staircase built, S1 done, S2 lit, the rule mark stamped on all six landings", "D"),
    (21.85, 28.05, "L1", dict(z0=1.03, z1=1.08, ax=0.33), "E three-quarter (f 562-717): qualify for Incubation, Edge Score gauge to 60+", "E"),
    (28.05, 32.37, "L5", dict(z0=1.0, z1=1.05), "F medium (f 717-825): the two conditions met (60+ Edge Score, $1,000+ in the trading account)", "F"),
    (32.37, 36.41, "VC", dict(s0=WIDE, drift=0.008), "G DROP 1 (f 825-926): smash cut to WIDE in the pause before «ستقوم», page-8 'x10' hero, «تمويلك حتى», chip '$1,000'", "G"),
    (36.41, 47.41, "BR", dict(id=2), "H B-ROLL 2 (f 926-1201, full-screen MG): the x10 gate, $1,000 → ten blocks ($10,000), $2,000 → twenty blocks", "H"),
    (47.41, 50.65, "L3", dict(z0=1.0, z1=1.05, ax=0.74), "I profile (f 1201-1282): card-less page-8 hero '$20,000', the Incubation cap", "I"),
    (50.65, 54.65, "L5", dict(z0=1.06, z1=1.1), "J medium (f 1282-1382): condition 1, 40 trades (ticket grid, '40+')", "J"),
    (54.65, 57.01, "L2", dict(z0=1.0, z1=1.05, ay=0.4, punch=0.05), "K close-up (f 1382-1441): condition 2, +7% (target line, '7%' ▲▲▲)", "K"),
    (57.01, 61.49, "VC", dict(s0=WIDE, drift=0.006), "L WIDE (f 1441-1553, hard cut, no drop): condition 3, the limit ring on the floor, equity line that never reaches −10%, '−10%' + footnote", "L"),
    (61.49, 67.53, "L1", dict(z0=1.04, z1=1.09, ax=0.33), "M three-quarter (f 1553-1704): condition 4, 60 days from the first trade, then the pip recap", "M"),
    (67.53, 72.37, "VC", dict(s0=EW, dy0=0.03, drift=0.006), "N extreme wide (f 1704-1825): the staircase already standing, the flag climbs S2 → S3, Acceleration lights", "N"),
    (72.37, 76.05, "L3", dict(z0=1.02, z1=1.07, ax=0.74), "O profile (f 1825-1917): the six episode chips (01 done, 02 this video, 03 next), next-video deck '(3)' Acceleration, red pill", "O"),
    (76.05, 77.21, "L2", dict(z0=1.04, z1=1.1, ay=0.4, punch=0.06), "P DROP 2 (f 1917-1946): close-up, «مبروك!» punch; bug off at this shot's end", "P"),
    (77.21, 84.61, "VC", dict(s0=WIDE, drift=0.005, moves=[[82.13, 0.70, HOME, 0.0, "push"]]), "Q WIDE (f 1946-2131): 40% share donut + the Axi Select account card, push to HOME in the pause, official logo builds in the card; held into the end wipe (VO 84.09-84.61); no bug", "Q"),
]

shots = [{"f0": 0, "f1": f(TITLE_VO + P), "special": {"type": "k_card", "allow": ["grain", "vignette"]}, "k_title": True, "k_beat": "TITLE",
          "note": "title card «(2) مرحلة Incubation» / «مع» + official logo"}]
for vs, ve, clip, c, note, beat in S:
    sh = {"f0": f(vs + P), "f1": f(ve + P), "note": note, "k_beat": beat}
    if clip == "BR":  # full-screen motion graphics, no presenter (the voice carries on)
        sh["special"] = {"type": "k_card", "allow": ["grain", "vignette"]}
        sh["k_broll"] = c["id"]
    elif clip == "VC":
        sh["clip"] = "L4"
        sh["k_vcam"] = {"t0": vs, **c}
        sh["cam"] = {"fit": "cover", "z": 1.0}
        sh["bg"] = "#000000"
        sh["src"] = round(vs, 3)
    else:
        sh["clip"] = clip
        cam = {"cover": True, "ax": c.get("ax", 0.5), "ay": c.get("ay", 0.5), "sx": c.get("ax", 0.5), "sy": c.get("ay", 0.5),
               "zoom": {"z0": c["z0"], "z1": c["z1"], "ease": "inout"}}
        if c.get("punch"):
            cam["punch"] = {"v": c["punch"], "d": 0.35, "at": 0}
        sh["cam"] = cam
        sh["src"] = round(vs + LAG.get(clip, 0.0), 3)
    shots.append(sh)
assert all(a["f1"] == b["f0"] for a, b in zip(shots, shots[1:])), "gap or overlap in the shot list"
assert shots[-1]["f1"] == f(WIPE[1] + P)
shots.append({"f0": f(WIPE[1] + P), "f1": f(END), "special": {"type": "k_card", "allow": ["grain", "vignette"]}, "k_end": True, "k_beat": "END",
              "note": "Axi Select end card (logo build on the music's ending hit, output 85.36), fade to black"})

# subtitles (VO times) — Rabee's words, lightly normalised spelling (mg_ep2_final.json subs)
SUBS = [
    (2.43, 4.30, "مرحباً بك في المرحلة الثانية"),
    (4.34, 5.55, "من مراحل Axi Select"),
    (5.68, 6.74, "مرحلة الـ Incubation"),
    (6.78, 8.74, "قبل أن أتعرّض لتفاصيل هذه المرحلة"),
    (8.95, 9.87, "ملاحظة مهمّة"),
    (10.20, 12.82, "إذا أردت القيام بأي عملية سحب للأموال"),
    (12.96, 14.04, "عليك القيام بذلك"),
    (14.29, 17.07, "قبل تنفيذ أي صفقة تداول في هذه المرحلة"),
    (17.19, 19.30, "وهذه القاعدة يتم تطبيقها"),
    (19.44, 21.75, "في جميع مراحل Axi Select"),
    (21.96, 23.61, "للتأهّل لمرحلة الـ Incubation"),
    (23.79, 25.74, "يجب أن تكون علامة الـ Edge Score"),
    (25.78, 27.98, "الخاصة بك لا تقلّ عن 60"),
    (28.12, 30.72, "وأقلّ مبلغ في حساب التداول الخاص بك"),
    (30.79, 31.97, "يجب أن يكون \u20661,000\u2069"),
    (32.40, 34.40, "ستقوم Axi بتمويلك"),
    (34.45, 36.29, "لغاية عشرة أضعاف هذا المبلغ"),
    (36.51, 38.56, "يعني إذا كان حسابك \u20661,000\u2069 دولار"),
    (38.75, 41.90, "ستقوم Axi بتمويلك بمبلغ \u206610,000\u2069 دولار"),
    (41.93, 43.91, "أمّا إذا كان حسابك \u20662,000\u2069 دولار"),
    (44.18, 45.95, "ستقوم Axi بتمويلك أيضاً"),
    (45.99, 47.35, "بعشرة أضعاف هذا المبلغ"),
    (47.48, 50.62, "لتصل قيمة التمويل إلى \u206620,000\u2069 دولار"),
    (50.68, 52.28, "في هذه المرحلة يجب عليك"),
    (52.33, 54.53, "إتمام 40 صفقة مستقلّة على الأقل"),
    (54.70, 56.96, "وتحقيق عائد لا يقلّ عن \u20667%\u2069"),
    (57.08, 59.85, "مع عدم الوصول إلى نسبة انعكاس \u206610%\u2069"),
    (60.08, 61.32, "في أي وقت من الأوقات"),
    (61.66, 64.14, "وخلال فترة لا تقلّ عن 60 يوماً"),
    (64.38, 65.93, "من تاريخ أول صفقة"),
    (66.22, 67.47, "عند تحقيق هذه الشروط"),
    (67.64, 70.21, "ستصبح مؤهّلاً للانتقال للمرحلة الثالثة"),
    (70.47, 72.08, "وهي مرحلة الـ Acceleration"),
    (72.45, 74.40, "والتي سنتعرّف عليها بالتفصيل"),
    (74.57, 76.08, "في الفيديو القادم"),
    (76.29, 77.10, "مبروك!"),
    (77.33, 80.53, "أصبح لك الآن حصّة مشاركة بنسبة \u206640%\u2069"),
    (80.81, 83.97, "من الأرباح المحقّقة في حساب Axi Select"),
]

# subtitle spans in OUTPUT seconds: [start, end, text, hard_in, hard_out]. A boundary within 0.2 s of a picture cut is
# snapped onto the cut and switches hard there; otherwise the renderer fades
# (in from start - 0.05, out ending at end = spoken end + 0.12, never past the next start - 0.05).
CUTS = sorted({sh["f0"] / FPS for sh in shots if sh["f0"] > 0} | {(WIPE[0] + P)})
def near_cut(t, lo, hi):
    c = [k for k in CUTS if t - lo <= k <= t + hi]
    return min(c, key=lambda k: abs(k - t)) if c else None
SPANS = []
for a, b, text in SUBS:
    s0 = a + P
    c = near_cut(s0, 0.2, 0.2)
    SPANS.append([c if c is not None else s0, b + P, text, c is not None, False])
for i, sp in enumerate(SPANS):
    nxt = SPANS[i + 1][0] - (0.0 if SPANS[i + 1][3] else 0.05) if i + 1 < len(SPANS) else WIPE[0] + P
    end = min(sp[1] + 0.12, nxt)
    c = near_cut(end, 0.2, 0.2)
    if c is not None and c > sp[0] + 0.3:
        end, sp[4] = c, True
    sp[1] = round(end, 4); sp[0] = round(sp[0], 4)
# back-to-back lines (< 0.20 s apart in speech) would dip to blank between the fade-out and the fade-in (QA: J 52.9,
# H 46.6): switch them hard instead, just before the next word (the end of the voice pause between them, else the next
# line's start)
try:
    PZ = json.load(open("work/vo_pauses_vo.json"))
except OSError:
    PZ = []
for i in range(len(SUBS) - 1):
    a_end, b_start = SUBS[i][1], SUBS[i + 1][0]
    if b_start - a_end < 0.20 and not SPANS[i][4] and not SPANS[i + 1][3]:
        pz = [q for q in PZ if q[1] >= a_end - 0.1 and q[0] <= b_start + 0.25]
        sw = (min(pz, key=lambda q: abs(q[1] - b_start))[1] - 0.04) if pz else b_start
        SPANS[i][1] = SPANS[i + 1][0] = round(sw + P, 4)
        SPANS[i][4] = SPANS[i + 1][3] = True

def srt_time(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s_, ms = divmod(ms, 1000)
    return "%02d:%02d:%02d,%03d" % (h, m, s_, ms)

E = {
    "canvas": {"w": 1920, "h": 1080, "fps": FPS, "frames": f(END), "bg": "#000000", "boil": 2},
    "palette": {"red": "#E4002E", "mint": "#76DFC3", "ink": "#090A0D", "accent": "#E4002E"},
    "fonts": [
        {"family": "AlexAr", "weight": "100 900", "url": "comp/fonts/alex_ar.woff2"},
        {"family": "AlexLat", "weight": "100 900", "url": "comp/fonts/alex_lat.woff2"},
        {"family": "InterV", "weight": "100 900", "url": "comp/fonts/inter.ttf"},
    ],
    "look": {"type": "grade", "filter": "contrast(1.05) saturate(0.93) brightness(1.01)",
             "layers": [{"op": "soft-light", "color": "rgba(52,78,96,1)", "alpha": 0.14}]},
    "clips": {c: {"frames_dir": f"plates/{c}"} for c in ["L4", "L5", "L1", "L2", "L3"]},
    "shots": shots,
    "post": {"grain": {"amt": 0.07}, "vignette": {"v": 0.2}},
    "sfx": {"auto": False, "cues": [], "hits": False},
    "audio": {"src": "audio/mix.m4a", "start": 0, "sfx": False, "codec": "copy"},
    "k_t": {"P": P, "subs": SPANS, "bug": BUG, "wipe": WIPE},
}
if "--cover" in sys.argv:
    E["canvas"]["frames"] = 1
    E["shots"] = [{"f0": 0, "f1": 1, "clip": "L2", "src": 55.84, "k_beat": "COVER", "cam": {"cover": True, "ax": 0.62, "ay": 0.42, "sx": 0.66, "sy": 0.46, "zoom": {"z0": 1.06, "z1": 1.06}}}]
    E["k_cover"] = True
    E["audio"] = {"src": None}
for a in sys.argv[1:]:
    if a == "--no-text": E["k_no_text"] = True
    if a == "--no-subs": E["k_no_subs"] = True
for a in sys.argv[1:]:
    if a.startswith("--srt="):  # the same spans as the burned-in subtitles (bidi isolates dropped)
        with open(a[6:], "w", encoding="utf-8") as fh:
            for i, (s0, s1, text, _, _) in enumerate(SPANS, 1):
                fh.write("%d\n%s --> %s\n%s\n\n" % (i, srt_time(s0), srt_time(s1), text.replace("\u2066", "").replace("\u2069", "")))
        print("wrote", a[6:], len(SPANS), "subtitles")
out = "comp/edl.json" if not any(a.startswith("--out=") for a in sys.argv) else [a[6:] for a in sys.argv if a.startswith("--out=")][0]
json.dump(E, open(out, "w"), ensure_ascii=False, indent=1)
print("wrote", out, "shots", len(shots), "frames", E["canvas"]["frames"])
