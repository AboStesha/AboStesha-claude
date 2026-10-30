#!/usr/bin/env python3
"""srt_check.py - validate or shift an SRT subtitle file (AboStesha Film Pipeline, 07 §7.10).

Checks every cue against the house subtitle rules (Netflix Timed Text Style Guide values):
  * at most 2 lines and 42 characters per line (spaces count; tags, {\\an8}-style overrides,
    bidi marks and Arabic diacritics do not);
  * reading speed <= --max-cps (default 17, the children's limit chosen for a G-rated film);
  * duration >= 20 frames (5/6 s) and <= 7 s;
  * gap to the previous cue: >= 2 frames, and never 3-11 frames at 24 fps (chain to 2 or open to >= 12);
  * in < out, times in order, times on frame boundaries;
  * '...' instead of the single character U+2026; with --lang ar: any italics, and a UTF-8 BOM.
Exit code 1 if any cue has an issue.

Shift mode writes a copy with every time moved by SECONDS (for the Summit file, where the intro sits
before the film): python3 -I scripts/srt_check.py SLA_subs_en_v03.srt --shift 15.5 --out summit_en.srt

Usage (always with `python3 -I`):
  python3 -I scripts/srt_check.py SLA_subs_en_v03.srt
  python3 -I scripts/srt_check.py SLA_subs_ar_v03.srt --lang ar --fps 24 --max-cps 17
Python >= 3.8, standard library only. Reads the file given; writes only with --shift/--out.
Original code for this pipeline (tested 2026-10-30).
"""
import argparse
import re
import sys
import unicodedata

TIME = re.compile(r"(\d+):(\d{2}):(\d{2})[,.](\d{3})")
STRIP = re.compile(r"<[^>]+>|\{\\[^}]*\}|[‎‏‪-‮⁦-⁩؜﻿]")


def to_sec(m):
    h, mi, s, ms = (int(x) for x in m.groups())
    return h * 3600 + mi * 60 + s + ms / 1000.0


def fmt(t):
    ms = max(0, int(round(t * 1000)))
    return "%02d:%02d:%02d,%03d" % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)


def visible_len(line):
    return sum(1 for ch in STRIP.sub("", line) if not unicodedata.combining(ch))


def parse(raw):
    cues = []
    for blk in re.split(r"\n\s*\n", raw.strip()):
        rows = blk.split("\n")
        k = next((i for i, r in enumerate(rows) if "-->" in r), None)
        if k is None:
            cues.append({"id": rows[0].strip(), "bad": "no '-->' timing line"})
            continue
        ms = list(TIME.finditer(rows[k]))
        if len(ms) < 2:
            cues.append({"id": rows[0].strip(), "bad": "unreadable times: " + rows[k].strip()})
            continue
        cues.append({"id": rows[k - 1].strip() if k else "?", "tin": to_sec(ms[0]), "tout": to_sec(ms[1]),
                     "timing": rows[k], "text": [r for r in rows[k + 1:] if r.strip()]})
    return cues


def check(cues, fps, max_cps, max_chars, lang, has_bom):
    n_bad, prev_out = 0, None
    if lang == "ar" and has_bom:
        print("file: UTF-8 BOM present (deliver Arabic sidecars as UTF-8 without BOM)")
        n_bad += 1
    for c in cues:
        if "bad" in c:
            print("cue %s: %s" % (c["id"], c["bad"]))
            n_bad += 1
            continue
        issues, text = [], c["text"]
        dur = c["tout"] - c["tin"]
        if dur <= 0:
            issues.append("out-time not after in-time")
        if len(text) > 2:
            issues.append("%d lines (max 2)" % len(text))
        if not text:
            issues.append("empty cue")
        for i, r in enumerate(text):
            n = visible_len(r)
            if n > max_chars:
                issues.append("line %d: %d chars (max %d)" % (i + 1, n, max_chars))
            if "..." in r:
                issues.append("line %d: '...' (use the single character U+2026)" % (i + 1))
            if lang == "ar" and re.search(r"</?i>", r):
                issues.append("line %d: italics (none in Arabic)" % (i + 1))
        chars = sum(visible_len(r) for r in text)
        if dur > 0 and chars / dur > max_cps + 1e-9:
            issues.append("%.1f cps (max %g)" % (chars / dur, max_cps))
        if 0 < dur < 20.0 / fps - 1e-6:
            issues.append("%.3f s < 20 frames" % dur)
        if dur > 7.0 + 1e-6:
            issues.append("%.2f s > 7 s" % dur)
        for label, t in (("in", c["tin"]), ("out", c["tout"])):
            if abs(t * fps - round(t * fps)) * 1000.0 / fps > 1.0:
                issues.append("%s-time %s not on a frame boundary" % (label, fmt(t)))
        if prev_out is not None:
            gap = round((c["tin"] - prev_out) * fps, 2)
            if gap < 1.9:
                issues.append("gap %g f < 2 frames (overlap or out of order?)" % gap)
            elif 2.1 < gap < fps / 2.0 - 0.1:
                issues.append("gap %g f: chain to 2 f or open to >= %g f" % (gap, fps / 2.0))
        prev_out = c["tout"]
        if issues:
            n_bad += 1
            print("cue %s @ %s: %s" % (c["id"], fmt(c["tin"]), "; ".join(issues)))
    print("%d cue(s) checked, %d with issues" % (len(cues), n_bad))
    return n_bad


def shift(raw, seconds):
    def move(m):
        return fmt(to_sec(m) + seconds)
    return "\n".join(TIME.sub(move, line) if "-->" in line else line for line in raw.split("\n"))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("srt")
    ap.add_argument("--fps", type=float, default=24.0)
    ap.add_argument("--max-cps", type=float, default=17.0)
    ap.add_argument("--max-chars", type=int, default=42)
    ap.add_argument("--lang", default="en", help="'ar' adds the no-italics and no-BOM checks")
    ap.add_argument("--shift", type=float, help="seconds to add to every time (writes --out, no check)")
    ap.add_argument("--out", help="output path for --shift")
    a = ap.parse_args()
    with open(a.srt, "rb") as f:
        data = f.read()
    has_bom = data.startswith(b"\xef\xbb\xbf")
    raw = data.decode("utf-8-sig").replace("\r\n", "\n").replace("\r", "\n")
    if a.shift is not None:
        if not a.out:
            ap.error("--shift needs --out")
        with open(a.out, "w", encoding="utf-8", newline="\n") as f:
            f.write(shift(raw, a.shift).rstrip("\n") + "\n")
        print("wrote %s (shifted %+.3f s)" % (a.out, a.shift))
        return 0
    return 1 if check(parse(raw), a.fps, a.max_cps, a.max_chars, a.lang, has_bom) else 0


if __name__ == "__main__":
    sys.exit(main())
