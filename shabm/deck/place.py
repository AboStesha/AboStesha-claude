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
    # approved by the founder and dropped in raw/ under their own slot name,
    # because the Higgsfield CDNs are blocked to this session and the files
    # arrive by hand through Drive instead of by job id.
    "cube_hero": "cube_hero", "face_detail": "face_detail",
    "menu_card": "menu_card", "spread": "spread",
    "frozen_wall": "frozen_wall", "ice_bar": "ice_bar",
    # the final exterior set: a closed block, three openings, menu flank
    "99459816": "cube_day",      "7478ee00": "cube_night",
    "2f54bf6b": "cube_dawn",     "a8366b1c": "face_detail",
    "e5feb902": "cube_hero",     "965bbc8e": "logo_carved",
    "c6fb0dc8": "cube_corner",   "52412c86": "cube_square",
    "799dd8b6": "menu_flank",    "e098dac5": "menu_flank_macro",
    # products
    "adbfb895": "p_saqee80",     "9513411e": "p_qalab",
    "fe961503": "p_boba",        "4fb9c19b": "p_lafaif",
    "f56a0493": "line",
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
