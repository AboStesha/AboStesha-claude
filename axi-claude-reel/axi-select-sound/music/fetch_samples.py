# fetch_samples.py - download the CC0 VSCO-2-CE sample subset used by compose.py (idempotent)
# python3 fetch_samples.py  -> /home/user/rr/sound3/music/samples/vsco/<repo path>
import json, os, re, subprocess, sys, urllib.parse
ROOT = "/home/user/rr/sound3/music/samples"
BASE = "https://raw.githubusercontent.com/sgossner/VSCO-2-CE/master/"
tree = json.load(open(ROOT + "/tree.json"))["tree"]
paths = [e["path"] for e in tree if e["type"] == "blob"]
PAT = [
    r"^Strings/Cello Section/susvib/susvib_[A-G]\d_v[13]_1\.wav$",
    r"^Strings/Cello Section/spic/spic_[A-G]\d_v[12]_RR[12]\.wav$",
    r"^Strings/Cello Section/trem/trem_[A-G]\d_v1_1\.wav$",
    r"^Strings/Solo Contrabass/SusNV/BKCtbss_SusNV_[A-G]#?\d_v[13]_rr1\.wav$",
    r"^Strings/Solo Contrabass/Spic/BKCtbss_Spic_[A-G]#?\d_v1_rr1\.wav$",
    r"^Strings/Viola Section/susvib/ViolaEns_susvib_[A-G]\d_v1_1\.wav$",
    r"^Strings/Violin Section/susVib/VlnEns_susVib_[A-G]#?\d_v1\.wav$",
    r"^Strings/Violin Section/Trem/VlnEns_Trem_[A-G]#?\d_v1\.wav$",
    r"^Keys/Upright Piano/Player_dyn[12]_rr1_0(0[4-9]|[12]\d|3[0-4])\.wav$",
    r"^Keys/Upright Piano/(Info|MappingChart)\.txt$",
    r"^Percussion/Timpani/Timpani\d_Hit_v[13]_rr1_Sum\.wav$",
    r"^Percussion/Timpani/Rolls/Timpani[125]_Roll_v3_rr1_Sum\.wav$",
    r"^Percussion/BDrumNewhit_v[357]_rr1_Sum\.wav$",
    r"^VSCO 1 Percussion/drums/bass/bdrum_(f_1|mp_1|pp_1|roll_long1|muted_mf_1|muted_pp_1)\.wav$",
    r"^VSCO 1 Percussion/varMetal/Gong/gong_(hit_p|hit_mf|hit_f|hit_pppp|scrape_[123]|roll_medium_f)\.wav$",
    r"^VSCO 1 Percussion/varMetal/Cymbals/(susp/)?susp_(FX_scrape_[123]|hit_softmall_roll2_cresc|hit_softmall_roll5_long_p|hit_softmall_p)\.wav$",
    r"^VSCO 1 Percussion/varWood/(wood_click_pp_[123]|claves_pp1|claves_mp)\.wav$",
    r"^Percussion/Snare2-taps_v1_rr[12]_Sum\.wav$",
    r"^(LICENSE|README\.md|Readme\.txt)$",
]
sel = [p for p in paths if any(re.match(r, p) for r in PAT)]
print(len(sel), "files")
for p in sel:
    dst = os.path.join(ROOT, "vsco", p)
    if os.path.exists(dst) and os.path.getsize(dst) > 0: continue
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    url = BASE + urllib.parse.quote(p)
    r = subprocess.run(["curl", "-sSfL", "--retry", "3", "-m", "120", "-o", dst + ".part", url])
    if r.returncode == 0: os.replace(dst + ".part", dst); print("ok", p, flush=True)
    else: print("FAIL", p, flush=True)
print("done")
