#!/usr/bin/env python3
"""share_report.py - Seedance share of a locked cut (ledger-continuity-physics.md L.5).

Usage:  python3 -I scripts/share_report.py SLA_LOCK_v05.xml ledger/SLA_LEDGER.csv [intro_seconds]

Reads a Premiere "File > Export > Final Cut Pro XML" file (xmeml) and the ledger CSV.
Reads only; writes nothing. Standard library only.

Picture: per frame, the top enabled video item that is not a transparent overlay decides
the class. Empty frames count as NONAI (black). Inside a dissolve the outgoing clip counts.
Audio: covered seconds per track and per origin class (Seedance classes collapse to SD).
FLAG lines block gate G-L2. NOTE lines need an eye check on the timeline but do not block.
"""
import csv
import os
import sys
import urllib.parse
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict

SEEDANCE = {"SD", "SD+TXT", "SD-COMP"}
KNOWN = SEEDANCE | {"SD-STILL", "AI-OTHER", "NONAI", "OVERLAY", "REF", "DRAFT"}
ITEMS = ("clipitem", "generatoritem", "transitionitem")
OPAQUE_NO_FILE = ("black", "matte", "slug", "colour", "color", "bars")


def main(argv):
    if len(argv) < 3:
        sys.exit(__doc__)
    root = ET.parse(argv[1]).getroot()
    seq = root if root.tag == "sequence" else root.find(".//sequence")
    with open(argv[2], encoding="utf-8-sig", newline="") as fh:
        ledger = {r["file_name"]: r for r in csv.DictReader(fh)}
    fps = int(seq.findtext("rate/timebase"))
    dur = int(seq.findtext("duration"))
    if seq.findtext("rate/ntsc", "FALSE").strip().upper() == "TRUE":
        print("WARNING: sequence is NTSC (23.976); the film is 24/1. Fix the sequence first.")
    skip = round(float(argv[3]) * fps) if len(argv) > 3 else 0
    paths = {f.get("id"): f.findtext("pathurl") for f in root.iter("file") if f.findtext("pathurl")}
    flags, notes = Counter(), Counter()

    def classify(k):
        f = k.find("file")
        url = paths.get(f.get("id")) if f is not None else None
        if url:
            name = os.path.basename(urllib.parse.unquote(urllib.parse.urlparse(url).path))
        else:
            name = k.findtext("name", "?")
        if k.find("sequence") is not None:
            flags["nested sequence (counts as non-Seedance; un-nest or export it separately): " + name] += 1
            return "NESTED", name
        row = ledger.get(name)
        if row:
            cls = (row.get("origin_class") or "").strip()
            if cls not in KNOWN:
                flags["unknown origin_class '%s' in ledger: %s" % (cls, name)] += 1
            elif cls in ("DRAFT", "REF"):
                flags["draft/reference file in the cut: " + name] += 1
            if (row.get("review_status") or "").strip() != "APPROVED":
                flags["in the cut but not APPROVED in the ledger: " + name] += 1
            return cls, name
        if url is None:
            if any(w in name.lower() for w in OPAQUE_NO_FILE):
                return "NONAI", name
            notes["file-less item treated as transparent OVERLAY (check by eye): " + name] += 1
            return "OVERLAY", name
        flags["not in ledger (counts as non-Seedance): " + name] += 1
        return "UNLEDGERED", name

    def spans(track):
        kids = [k for k in track if k.tag in ITEMS]
        for i, k in enumerate(kids):
            if k.tag == "transitionitem" or k.findtext("enabled", "TRUE").strip().upper() == "FALSE":
                continue
            s, e = int(k.findtext("start")), int(k.findtext("end"))
            if s < 0 and i > 0:                      # -1 = starts inside a transition
                s = int(kids[i - 1].findtext("start"))
            if e < 0 and i + 1 < len(kids):          # -1 = ends inside a transition
                e = int(kids[i + 1].findtext("end"))
            cls, name = classify(k)
            yield s, e, cls, name

    def tracks(kind):
        for t in seq.findall("media/%s/track" % kind):
            if t.findtext("enabled", "TRUE").strip().upper() == "FALSE":
                continue
            yield t

    vtracks = [list(spans(t)) for t in tracks("video")]   # V1 first in the XML
    pic, per_file = Counter(), Counter()
    for fr in range(skip, dur):
        cls = "NONAI"                                        # empty frame = black
        for tr in reversed(vtracks):                         # top track first
            hit = [(c, n) for s, e, c, n in tr if s <= fr < e and c != "OVERLAY"]
            if hit:
                cls = hit[0][0]
                per_file[hit[0][1]] += 1
                break
        pic[cls] += 1
    T = sum(pic.values()) / fps
    if T <= 0:
        sys.exit("empty sequence after the intro skip")
    sd = sum(v for k, v in pic.items() if k in SEEDANCE) / fps
    ai = sd + (pic.get("SD-STILL", 0) + pic.get("AI-OTHER", 0)) / fps
    print("T (titles+story+credits) = %.2f s" % T)
    print("R1 Seedance picture = %.2f s = %.1f %%  (target >= 90, floor 80, rule 70)" % (sd, 100 * sd / T))
    print("R2 gen-AI picture   = %.2f s = %.1f %%" % (ai, 100 * ai / T))
    for k, v in sorted(pic.items()):
        print("  picture %-11s %8.2f s  %5.1f %%" % (k, v / fps, 100 * v / fps / T))
    audio_file = defaultdict(set)
    for i, t in enumerate(tracks("audio"), 1):
        cov = defaultdict(set)
        for s, e, c, n in spans(t):
            frames = range(max(s, skip), e)
            cov["SD" if c in SEEDANCE else c].update(frames)
            audio_file[n].update(frames)
        print("  A%d: " % i + (", ".join("%s %.1f s" % (c, len(f) / fps) for c, f in sorted(cov.items())) or "empty"))
    for n, v in sorted(per_file.items()):
        print("  seconds_in_final (picture) %7.2f  %s" % (v / fps, n))
    for n, f in sorted(audio_file.items()):
        if n not in per_file:
            print("  seconds_in_final (audio)   %7.2f  %s" % (len(f) / fps, n))
    for m, c in sorted(notes.items()):
        print("  NOTE", m, "(x%d)" % c)
    for m, c in sorted(flags.items()):
        print("  FLAG", m, "(x%d)" % c)
    print("FLAGS: %d" % len(flags))


if __name__ == "__main__":
    main(sys.argv)
