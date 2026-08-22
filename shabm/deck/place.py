#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Take the renders in raw/ and put them where the deck expects them.

Files keep their Higgsfield job id in the filename, so the mapping below is
keyed on that: drop a file in raw/ under any name containing its id and this
resizes it, converts it to WebP and writes img/<slot>.webp. The deck inlines
whatever it finds there and falls back to its own drawing for anything absent.
"""
import os, sys, glob
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
RAW, OUT = os.path.join(HERE, "raw"), os.path.join(HERE, "img")
LONG_EDGE, QUALITY = 1500, 74          # keeps the published page well under 16 MB

SLOTS = {
    # the final exterior set: a closed block, three openings, menu flank
    "8fbf79e6": "cube_day",      "6e3a36c6": "cube_night",
    "b95d8990": "cube_dawn",     "265d06aa": "face_detail",
    "799dd8b6": "menu_flank",    "e098dac5": "menu_flank_macro",
    # products
    "b2491ca7": "p_saqee80",     "eee0f1da": "p_qalab",
    "fe961503": "p_boba",        "f56a0493": "p_lafaif",
    "010d8564": "p_jana",        "16239204": "p_radhadh",
    "1730bd76": "spread",
    # brand and collateral
    "a5ef67ba": "packaging",     "2de12499": "uniform",
    "3cdc352e": "card",          "be537ac8": "menu_card",
    "a61ccda3": "brand_sheet",
    # place and process
    "18949487": "line",          "40430f55": "ice_room",
    "8ff5d854": "barista",       "ef43e554": "interior",
    "255a23da": "interior_menu", "d7bd708f": "order_screen",
    "ede9dfd2": "hatch_collect", "6a49c6fa": "hatch_return",
    "6f5b7336": "face_detail",   "edf0d675": "cube_dawn",
    "d9dc4bca": "cube_rear",
}


def main():
    os.makedirs(OUT, exist_ok=True)
    placed, unknown = [], []
    for path in sorted(glob.glob(os.path.join(RAW, "*"))):
        name = os.path.basename(path)
        slot = next((v for k, v in SLOTS.items() if k in name), None)
        if not slot:
            unknown.append(name)
            continue
        im = Image.open(path).convert("RGB")
        im.thumbnail((LONG_EDGE, LONG_EDGE), Image.LANCZOS)
        dst = os.path.join(OUT, slot + ".webp")
        im.save(dst, "WEBP", quality=QUALITY, method=6)
        placed.append((slot, os.path.getsize(dst)))
    for slot, size in placed:
        print(f"  {slot:16s} {size/1024:6.0f} KB")
    if unknown:
        print("\n  not mapped (add its job id to SLOTS):")
        for n in unknown:
            print("   ", n)
    total = sum(s for _, s in placed)
    print(f"\n  {len(placed)} placed · {total/1024/1024:.2f} MB on disk "
          f"· ~{total*1.34/1024/1024:.2f} MB inlined")


if __name__ == "__main__":
    main()
