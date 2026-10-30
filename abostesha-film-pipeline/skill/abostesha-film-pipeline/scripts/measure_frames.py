#!/usr/bin/env python3
"""measure_frames.py - measure the look of still frames (AboStesha Film Pipeline, 02 §2.3 and 07 §7.6).

Prints, per image: luma p1/p50/p99, % clipped (> 0.98) and % crushed (< 0.02) pixels, mean saturation,
the mean colour of the darkest 15% (shadow tint) and brightest 15% (highlight tint), and 6 median-cut
colour clusters with their share of the frame. Values are display-referred (Rec.709 luma weights on
encoded RGB), which matches AI stills and Seedance clips.

Usage (always with `python3 -I`, so nothing is imported from the working directory):
  python3 -I scripts/measure_frames.py reference-frames/*.png > measurements.txt
  python3 -I scripts/measure_frames.py --csv before.png after.png hero.png > pair.csv

Requires Python >= 3.9, Pillow >= 9.1 and numpy. Reads only the images given; no network, no writes.
Original code for this pipeline (tested 2026-10-30).
"""
import argparse
import csv
import sys

import numpy as np
from PIL import Image

LUMA = np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
FIELDS = ["file", "p1", "p50", "p99", "clipped_pct", "crushed_pct", "mean_sat",
          "shadow_tint", "highlight_tint", "clusters"]


def hexcol(rgb):
    return "#%02x%02x%02x" % tuple(int(round(min(max(v, 0.0), 1.0) * 255)) for v in rgb)


def measure(path):
    im = Image.open(path).convert("RGB")
    im.thumbnail((640, 640))
    a = np.asarray(im, dtype=np.float32) / 255.0
    y = a @ LUMA
    p1, p50, p99 = np.percentile(y, [1, 50, 99])
    lo, hi = np.percentile(y, [15, 85])
    sat = np.asarray(im.convert("HSV"), dtype=np.float32)[..., 1].mean() / 255.0
    q = im.quantize(colors=6, method=Image.Quantize.MEDIANCUT)
    pal, n = q.getpalette(), im.width * im.height
    clusters = ["#%02x%02x%02x %d%%" % (*pal[i * 3:i * 3 + 3], round(c * 100 / n))
                for c, i in sorted(q.getcolors(), reverse=True)]
    return {"file": path, "p1": round(float(p1), 3), "p50": round(float(p50), 3),
            "p99": round(float(p99), 3),
            "clipped_pct": round(float((y > 0.98).mean() * 100), 1),
            "crushed_pct": round(float((y < 0.02).mean() * 100), 1),
            "mean_sat": round(float(sat), 3),
            "shadow_tint": hexcol(a[y <= lo].mean(0)), "highlight_tint": hexcol(a[y >= hi].mean(0)),
            "clusters": ", ".join(clusters)}


def main():
    ap = argparse.ArgumentParser(description="Measure luma, saturation, tints and colour clusters.")
    ap.add_argument("images", nargs="+")
    ap.add_argument("--csv", action="store_true", help="write CSV to stdout instead of text")
    args = ap.parse_args()
    out = csv.DictWriter(sys.stdout, FIELDS) if args.csv else None
    if out:
        out.writeheader()
    failed = 0
    for p in args.images:
        try:
            m = measure(p)
        except (OSError, ValueError) as e:
            print(f"skip {p}: {e}", file=sys.stderr)
            failed += 1
            continue
        if out:
            out.writerow(m)
        else:
            print(f"{p}\n  luma p1/p50/p99 {m['p1']:.2f}/{m['p50']:.2f}/{m['p99']:.2f}  "
                  f"clipped {m['clipped_pct']:.1f}%  crushed {m['crushed_pct']:.1f}%  "
                  f"mean sat {m['mean_sat']:.2f}\n  shadow tint {m['shadow_tint']}  "
                  f"highlight tint {m['highlight_tint']}\n  6 clusters: {m['clusters']}")
    return 1 if failed == len(args.images) else 0


if __name__ == "__main__":
    sys.exit(main())
