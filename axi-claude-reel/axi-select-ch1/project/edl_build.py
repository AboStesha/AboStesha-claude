# edl_build.py — axi-select-ch1: shot list on the VO timeline -> comp/edl.json (1920x1080, 25 fps, 3000 frames)
# Output time = VO time + P. All lip-synced clips start at the VO time of the cut (src = VO), so the mouth stays on the
# voice; L5 and L3 carry HeyGen's +23 ms audio lag.
import json, sys

P = 3.0
FPS = 25
END = 120.0
LAG = {"L5": 0.023, "L3": 0.023}
XW = {"ax": 0.5, "ay": 1004 / 1080, "sx": 0.5, "sy": 0.86}

def f(t):  # output seconds -> frame
    return int(round(t * FPS))

# (vo_start, vo_end, clip, cam, note). clip "VC" = L4 under the virtual camera (k_vcam: s0, dy0, drift per s,
# moves [t_vo, dur, s, dy, ease]); s 0.66 HOME, 0.30 WIDE, 0.22 extreme wide.
HOME, WIDE, EW = 0.66, 0.30, 0.22
S = [
    (0.00, 4.40, "VC", dict(s0=HOME, drift=0.006, moves=[[1.50, 0.62, WIDE, 0.0, "pull"]]), "A welcome: HOME, pull-out to WIDE on «Axi Select», lockup in the void"),
    (4.40, 8.84, "L5", dict(z0=1.00, z1=1.05), "B medium: what this video covers (sign-up / stages tiles)"),
    (8.84, 14.88, "L1", dict(z0=1.03, z1=1.08, ax=0.33), "C three-quarter: the Axi Select trading account card"),
    (14.88, 18.50, "VC", dict(s0=WIDE, drift=0.008), "D DROP: smash cut to WIDE, floor ripple, Edge Score gauge to 50"),
    (18.50, 22.62, "L5", dict(z0=1.06, z1=1.11), "E medium: the two conditions (Edge Score 50+, $500)"),
    (22.62, 27.00, "L3", dict(z0=1.00, z1=1.05, ax=0.74), "F1 profile: Axi opens the allocation account"),
    (27.00, 31.92, "VC", dict(s0=HOME, drift=0.005, moves=[[27.08, 0.62, WIDE, 0.0, "pull"]]), "F2 HOME, pull-out to WIDE: both accounts either side, link arc"),
    (31.92, 33.40, "L2", dict(z0=1.00, z1=1.05, ay=0.4, punch=0.05), "G close-up: «مبروك!» flare and sparkles"),
    (33.40, 44.70, "VC", dict(s0=WIDE, drift=0.005, moves=[[40.02, 0.62, EW, 0.03, "pull"]]), "H WIDE: Seed tile lights on the floor, $5,000; I pull-out to extreme wide, six stages"),
    (44.70, 48.00, "L1", dict(z0=1.04, z1=1.09, ax=0.33), "J three-quarter: Incubation"),
    (48.00, 50.36, "L5", dict(z0=1.08, z1=1.12), "K medium: Acceleration"),
    (50.36, 56.30, "VC", dict(s0=EW, dy0=0.03, drift=0.006), "L extreme wide: Pro, Pro 500"),
    (56.30, 58.40, "L2", dict(z0=1.04, z1=1.09, ay=0.4), "M close-up: «والمرحلة الأخيرة»"),
    (58.40, 60.30, "VC", dict(s0=EW * 1.04, dy0=0.03, drift=0.006), "M2 extreme wide: Pro M lights up"),
    (60.30, 64.62, "L5", dict(z0=1.00, z1=1.05), "N1 medium: funding from Axi"),
    (64.62, 68.10, "L1", dict(z0=1.03, z1=1.08, ax=0.33), "N2 three-quarter: share of the profits"),
    (68.10, 77.80, "VC", dict(s0=HOME, drift=0.004, moves=[[69.22, 0.62, WIDE, 0.0, "pull"]]), "O «يعني لنبسّطها أكثر»: HOME, pull-out to WIDE, your account + the funded allocation account"),
    (77.80, 79.02, "L2", dict(z0=1.06, z1=1.12, ay=0.4, punch=0.06), "P close-up: «ملاحظة مهمة»"),
    (79.02, 84.70, "L3", dict(z0=1.00, z1=1.05, ax=0.74), "Q profile: no direct trading, linked automatically"),
    (84.70, 91.04, "VC", dict(s0=WIDE, drift=0.006), "R DROP 2: smash cut to WIDE, trades copied along the arc, ×10"),
    (91.04, 95.95, "L2", dict(z0=1.00, z1=1.06, ay=0.4), "S close-up: «معامل الضرب»"),
    (95.95, 102.15, "L1", dict(z0=1.03, z1=1.08, ax=0.33), "T three-quarter: the rules of every stage"),
    (102.15, 110.88, "VC", dict(s0=WIDE, drift=0.006, moves=[[105.58, 0.70, HOME, 0.0, "push"]]), "U RE-DROP: WIDE, red floor, 10%; V push back HOME: upcoming chapters"),
]

shots = [{"f0": 0, "f1": f(P), "special": {"type": "k_card"}, "k_title": True, "note": "title card «(1) كيف تبدأ / مع Axi Select»"}]
for vs, ve, clip, c, note in S:
    sh = {"f0": f(vs + P), "f1": f(ve + P), "note": note}
    if clip == "VC":
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
shots.append({"f0": f(110.88 + P), "f1": f(END), "special": {"type": "k_card"}, "k_end": True, "note": "slash wipe -> Axi Select end card, fade to black"})

# subtitles (VO times) — Rabee's words, lightly normalised spelling
SUBS = [
    (0.00, 2.25, "مرحباً بك في برنامج التمويل Axi Select"),
    (2.32, 5.15, "في هذا الفيديو سنتعرّف على كيفية الاشتراك"),
    (5.20, 8.75, "والتقدّم في مراحل البرنامج التمويلي Axi Select"),
    (8.88, 12.55, "ستقوم بفتح حساب تداول اسمه Axi Select مع شركة Axi"),
    (12.60, 14.70, "وبدء التداول عليه بالشكل الاعتيادي"),
    (14.94, 18.45, "وبمجرّد حصولك على Edge Score أو علامة لا تقلّ عن 50"),
    (18.58, 22.55, "ولديك 500 دولار في حساب التداول الخاص بك"),
    (22.62, 26.80, "ستقوم شركة Axi بفتح حساب آخر اسمه حساب التخصيص"),
    (26.86, 29.60, "سيكون هذا الحساب مخصّصاً للمبلغ التمويلي"),
    (29.64, 31.85, "الذي ستقدّمه لك شركة Axi"),
    (31.92, 32.48, "مبروك!"),
    (32.52, 34.42, "أنت الآن في المرحلة الأولى"),
    (34.46, 36.75, "من مراحل البرنامج التمويلي Axi Select"),
    (36.84, 40.05, "ولديك تمويل بقيمة 5,000 دولار"),
    (40.14, 42.35, "و Axi Select عبارة عن ستّ مراحل"),
    (42.42, 44.65, "المرحلة الأولى تُسمّى مرحلة Seed"),
    (44.72, 46.30, "أمّا بالنسبة للمرحلة الثانية"),
    (46.36, 47.95, "فهي مرحلة Incubation"),
    (48.02, 50.30, "والمرحلة الثالثة هي Acceleration"),
    (50.36, 52.70, "والمرحلة الرابعة هي مرحلة Pro"),
    (52.78, 54.60, "أمّا بالنسبة للمرحلة الخامسة"),
    (54.64, 56.20, "فهي مرحلة Pro 500"),
    (56.30, 60.10, "والمرحلة الأخيرة هي مرحلة Pro M"),
    (60.30, 62.25, "في كل مرحلة من هذه المراحل"),
    (62.30, 64.55, "تقوم الشركة بتمويلك بمبلغ من المال"),
    (64.62, 66.00, "يمكنك التداول به"),
    (66.06, 68.10, "وسحب نسبة محدّدة من الأرباح"),
    (68.18, 69.60, "يعني لنبسّطها أكثر"),
    (69.66, 72.50, "عندك حساب تداول عم تتداول عليه بشكل اعتيادي"),
    (72.60, 75.15, "بالإضافة إلى حساب تخصيص مموَّل"),
    (75.20, 77.75, "مقدَّم من شركة Axi"),
    (77.88, 78.98, "ملاحظة مهمّة"),
    (79.02, 82.45, "حساب التخصيص لا يمكن التداول عليه بشكل مباشر"),
    (82.54, 85.95, "وإنّما هو مربوط تلقائياً بحساب التداول"),
    (86.04, 88.50, "ويقوم بنسخ جميع الصفقات المنفَّذة"),
    (88.56, 90.95, "بمعامل الضرب لكل مرحلة"),
    (91.04, 92.70, "احفظ كلمة «معامل الضرب»"),
    (92.74, 95.85, "لأنّه رح نشرحها بالتفصيل في الفيديوهات القادمة"),
    (96.00, 98.05, "في كل مرحلة من هذه المراحل"),
    (98.12, 101.30, "هناك مجموعة من القواعد يجب القيام بها"),
    (101.40, 105.50, "وأهمّها ألّا يصل انعكاس حساب التخصيص 10%"),
    (105.58, 107.60, "لتعرف تفاصيل وقواعد كل مرحلة"),
    (108.16, 110.30, "انتقل إلى الفيديوهات القادمة"),
]

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
    "k_t": {"P": P, "subs": SUBS},
}
if "--cover" in sys.argv:
    E["canvas"]["frames"] = 1
    E["shots"] = [{"f0": 0, "f1": 1, "clip": "L2", "src": 57.42, "cam": {"cover": True, "ax": 0.62, "ay": 0.42, "sx": 0.66, "sy": 0.46, "zoom": {"z0": 1.06, "z1": 1.06}}}]
    E["k_cover"] = True
    E["audio"] = {"src": None}
for a in sys.argv[1:]:
    if a == "--no-text": E["k_no_text"] = True
    if a == "--no-subs": E["k_no_subs"] = True
out = "comp/edl.json" if not any(a.startswith("--out=") for a in sys.argv) else [a[6:] for a in sys.argv if a.startswith("--out=")][0]
json.dump(E, open(out, "w"), ensure_ascii=False, indent=1)
print("wrote", out, "shots", len(shots), "frames", E["canvas"]["frames"])
