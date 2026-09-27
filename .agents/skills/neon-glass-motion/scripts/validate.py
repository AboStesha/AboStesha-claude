#!/usr/bin/env python3
"""Validate a neon-glass-motion film.json against engine/shots.manifest.json.

Usage:
    python scripts/validate.py film.json [--engine-dir DIR] [--json] [--quiet]

Prints a beat sheet (index, time range, shot, on-screen text) followed by
errors and warnings. Exit code 0 = valid (warnings allowed), 1 = errors.
Standard library only.
"""
from __future__ import annotations

import argparse
import colorsys
import difflib
import json
import math
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True  # keep the skill folder free of __pycache__
sys.path.insert(0, str(Path(__file__).resolve().parent))
import _env  # noqa: E402

HEX_RE = re.compile(r"^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$")
TOP_KEYS = {"title", "ratio", "fps", "brand", "look", "fonts", "audio", "beats", "_comment", "note", "notes"}
BRAND_KEYS = {"name", "color", "accent", "url", "logo"}
LOOK_KEYS = {"temperature": (-1.0, 1.0), "energy": (0.0, 1.0), "density": (0.0, 1.0)}
FONT_KEYS = {"display", "mono", "arabic"}
LOGO_EXTS = {".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
             ".webp": "image/webp", ".gif": "image/gif"}
MAX_WORDS = 5
LONG_LINE_CHARS = 32


def beat_frames(dur, fps) -> int:
    """Frames for a beat, matching the engine's Math.max(1, Math.round(dur * fps)) (ties round up)."""
    return max(1, int(math.floor(dur * fps + 0.5)))


def word_count(s: str) -> int:
    return len(str(s).split())


def is_num(v) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def hex_lightness(h: str) -> float:
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    return colorsys.rgb_to_hls(r, g, b)[1]


def suggest(name, choices):
    m = difflib.get_close_matches(str(name), list(choices), n=1, cutoff=0.5)
    return f" (did you mean '{m[0]}'?)" if m else ""


class Report:
    def __init__(self):
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.rows: list[dict] = []
        self.fps = 30
        self.ratio = None
        self.size = None
        self.total_frames = 0

    @property
    def duration(self):
        return self.total_frames / self.fps if self.fps else 0

    def err(self, where, msg):
        self.errors.append(f"{where}: {msg}" if where else msg)

    def warn(self, where, msg):
        self.warnings.append(f"{where}: {msg}" if where else msg)

    def as_dict(self):
        return {"ok": not self.errors, "errors": self.errors, "warnings": self.warnings,
                "ratio": self.ratio, "size": self.size, "fps": self.fps,
                "frames": self.total_frames, "duration": round(self.duration, 3), "beats": self.rows}


def resolve_asset(path_str: str, base_dir: Path | None) -> Path:
    p = Path(path_str).expanduser()
    if not p.is_absolute() and base_dir is not None:
        p = base_dir / p
    return p


def _check_words(rep, where, pname, value):
    items = value if isinstance(value, list) else [value]
    for item in items:
        if isinstance(item, str):
            n = word_count(item)
            if n > MAX_WORDS:
                rep.err(where, f"'{pname}' has {n} words (max {MAX_WORDS}): \"{item}\" -- cut it to five words or fewer")
            elif len(item) > LONG_LINE_CHARS and "\n" not in item:
                rep.warn(where, f"'{pname}' is long ({len(item)} characters): \"{item}\" -- it will wrap or shrink")


def _check_param(rep, where, pname, spec, value, icons):
    t = spec.get("type", "string")
    if t == "string":
        if not isinstance(value, str):
            rep.err(where, f"'{pname}' must be a string, got {type(value).__name__}"
                    + (f' -- write it as "{value}"' if is_num(value) else ""))
            return
        if not value.strip():
            (rep.err if spec.get("required") else rep.warn)(where, f"'{pname}' is empty")
    elif t == "boolean":
        if not isinstance(value, bool):
            rep.err(where, f"'{pname}' must be true or false, got {json.dumps(value)}")
    elif t == "number":
        if not is_num(value):
            rep.err(where, f"'{pname}' must be a number, got {json.dumps(value)}")
    elif t == "icon":
        if not isinstance(value, str) or value not in icons:
            rep.err(where, f"'{pname}': unknown icon {json.dumps(value)}{suggest(value, icons)}. "
                           f"Available: {', '.join(icons)}")
    elif t == "icon[]":
        if not isinstance(value, list) or not value:
            rep.err(where, f"'{pname}' must be a non-empty list of icon names")
            return
        for v in value:
            if not isinstance(v, str) or v not in icons:
                rep.err(where, f"'{pname}': unknown icon {json.dumps(v)}{suggest(v, icons)}. "
                               f"Available: {', '.join(icons)}")
    elif t == "string[]":
        if not isinstance(value, list) or not value:
            rep.err(where, f"'{pname}' must be a non-empty list of strings")
            return
        for v in value:
            if not isinstance(v, str) or not v.strip():
                rep.err(where, f"'{pname}' items must be non-empty strings, got {json.dumps(v)}")
    elif t == "enum":
        allowed = list(spec.get("values", []))
        if spec.get("default") == "auto":
            allowed.append("auto")
        if value not in allowed:
            rep.err(where, f"'{pname}' must be one of {', '.join(map(str, allowed))}; got {json.dumps(value)}"
                    + suggest(value, allowed))
    if spec.get("words"):
        _check_words(rep, where, pname, value)


def _shot_specific(rep, where, shot, beat):
    if shot == "number":
        v = beat.get("value")
        if isinstance(v, str) and len(v) > 6:
            rep.warn(where, f"'value' \"{v}\" is {len(v)} characters; keep figures to 6 or fewer so they hit hard")
    elif shot == "orbit":
        items = beat.get("items")
        if isinstance(items, list) and not 2 <= len(items) <= 6:
            rep.warn(where, f"'items' has {len(items)} entries; 2-6 read best")
    elif shot == "stack":
        lines = beat.get("lines")
        if isinstance(lines, list) and not 2 <= len(lines) <= 3:
            rep.warn(where, f"'lines' has {len(lines)} entries; stack is designed for 2-3 lines")
    elif shot == "tiles":
        icons = beat.get("icons")
        labels = beat.get("labels")
        if isinstance(icons, list) and not 3 <= len(icons) <= 6:
            rep.warn(where, f"'icons' has {len(icons)} entries; 3-6 tiles read best")
        if isinstance(labels, list) and isinstance(icons, list) and len(labels) != len(icons):
            rep.warn(where, f"{len(labels)} labels for {len(icons)} icons; give one label per tile")
        if isinstance(labels, list):
            for lab in labels:
                if isinstance(lab, str) and 2 < word_count(lab) <= MAX_WORDS:
                    rep.warn(where, f"tile label \"{lab}\" is {word_count(lab)} words; 1-2 words fit a tile best")


def describe_beat(beat, spec, film):
    """Short human description of what is on screen."""
    params = (spec or {}).get("params", {})
    parts, tags = [], []
    shot = beat.get("shot")
    if shot == "endcard":
        brand = film.get("brand") if isinstance(film.get("brand"), dict) else {}
        if brand.get("name"):
            parts.append(str(brand["name"]))
    for pname, ps in params.items():
        if pname not in beat:
            continue
        v = beat[pname]
        if ps.get("words") or pname == "value":
            if isinstance(v, list):
                parts.append(" / ".join(f'"{x}"' for x in v))
            else:
                parts.append(f'"{v}"')
        elif pname == "url":
            parts.append(str(v))
        elif isinstance(v, bool):
            if v:
                tags.append(pname)
        elif isinstance(v, list):
            tags.append(f"{pname}: {', '.join(map(str, v))}")
        else:
            tags.append(f"{pname}: {v}")
    if shot == "endcard" and "url" not in beat:
        brand = film.get("brand") if isinstance(film.get("brand"), dict) else {}
        if brand.get("url"):
            parts.append(str(brand["url"]))
    if beat.get("hero"):
        tags.append("hero")
    if beat.get("cut") == "flash":
        tags.append("flash cut")
    if beat.get("camera") and beat.get("camera") != "push":
        tags.append(f"camera: {beat['camera']}")
    s = "  ".join(parts) if parts else "(no text)"
    if tags:
        s += "  [" + "; ".join(tags) + "]"
    return s


def validate_film(film, manifest, base_dir: Path | None = None) -> Report:
    rep = Report()
    shots = manifest.get("shots", {})
    icons = manifest.get("icons", [])
    common = manifest.get("commonBeatFields", {})

    if not isinstance(film, dict):
        rep.err("", "film.json must contain a JSON object")
        return rep

    for k in film:
        if k not in TOP_KEYS:
            rep.warn("film", f"unknown top-level key '{k}' is ignored{suggest(k, TOP_KEYS)}")

    if not isinstance(film.get("title", ""), str):
        rep.err("title", "must be a string")
    elif not film.get("title"):
        rep.warn("title", "missing; the player and file title will say 'Untitled film'")

    ratio = film.get("ratio")
    if ratio is None:
        rep.err("ratio", f"missing; use one of {', '.join(_env.RATIO_SIZES)}")
    elif ratio not in _env.RATIO_SIZES:
        hint = ""
        if isinstance(ratio, str):
            norm = ratio.replace("x", ":").replace("X", ":").replace("/", ":").replace(" ", "")
            if norm in _env.RATIO_SIZES:
                hint = f" (write it as \"{norm}\")"
        rep.err("ratio", f"{json.dumps(ratio)} is not supported; use one of {', '.join(_env.RATIO_SIZES)}{hint}")
    else:
        rep.ratio = ratio
        rep.size = list(_env.RATIO_SIZES[ratio])

    fps = film.get("fps", 30)
    if not is_num(fps) or fps not in _env.FPS_ALLOWED or int(fps) != fps:
        rep.err("fps", f"{json.dumps(fps)} is not supported; use one of {', '.join(map(str, _env.FPS_ALLOWED))}")
        fps = 30
    fps = int(fps)
    rep.fps = fps

    # ---- brand
    brand = film.get("brand")
    if brand is None:
        brand = {}
        rep.warn("brand", "missing; the endcard needs at least brand.name")
    elif not isinstance(brand, dict):
        rep.err("brand", "must be an object like {\"name\": \"Meridian\", \"color\": \"#6633EE\"}")
        brand = {}
    for k in brand:
        if k not in BRAND_KEYS:
            rep.warn("brand", f"unknown key '{k}' is ignored{suggest(k, BRAND_KEYS)}")
    if brand and not brand.get("name"):
        rep.warn("brand.name", "missing; the endcard wordmark will be empty")
    elif "name" in brand and not isinstance(brand["name"], str):
        rep.err("brand.name", "must be a string")
    for key in ("color", "accent"):
        if key in brand and brand[key] is not None:
            v = brand[key]
            if not isinstance(v, str) or not HEX_RE.match(v):
                rep.err(f"brand.{key}", f"{json.dumps(v)} is not a hex colour; use #RRGGBB, e.g. \"#6633EE\"")
            else:
                light = hex_lightness(v)
                if light < 0.2:
                    rep.warn(f"brand.{key}", f"{v} is very dark; it will be brightened so it reads as light on black")
                elif light > 0.92:
                    rep.warn(f"brand.{key}", f"{v} is nearly white; neon accents need a saturated hue")
    if "url" in brand and brand["url"] is not None and not isinstance(brand["url"], str):
        rep.err("brand.url", "must be a string like \"meridian.app\"")
    logo = brand.get("logo")
    if logo:
        if not isinstance(logo, str):
            rep.err("brand.logo", "must be a file path (relative to the film.json) or a URL")
        elif logo.startswith("data:"):
            pass
        elif re.match(r"^https?://", logo):
            rep.warn("brand.logo", "remote logo will be downloaded and embedded at build time")
        else:
            lp = resolve_asset(logo, base_dir)
            ext = lp.suffix.lower()
            if ext not in LOGO_EXTS:
                rep.err("brand.logo", f"unsupported logo format '{ext or '?'}'; use SVG, PNG, JPG, WEBP or GIF")
            elif not lp.is_file():
                rep.err("brand.logo", f"file not found: {lp} (paths are relative to the film.json)")
            elif lp.stat().st_size > 3 * 1024 * 1024:
                rep.warn("brand.logo", f"logo is {_env.human_bytes(lp.stat().st_size)}; it is embedded in the HTML, "
                                       "a smaller file keeps the player light")

    # ---- look
    look = film.get("look", {})
    if look is None:
        look = {}
    if not isinstance(look, dict):
        rep.err("look", "must be an object like {\"temperature\": 0, \"energy\": 0.6, \"density\": 0.6}")
        look = {}
    for k, v in look.items():
        if k not in LOOK_KEYS:
            rep.warn("look", f"unknown key '{k}' is ignored{suggest(k, LOOK_KEYS)}")
            continue
        lo, hi = LOOK_KEYS[k]
        if not is_num(v):
            rep.err(f"look.{k}", f"must be a number between {lo:g} and {hi:g}, got {json.dumps(v)}")
        elif not lo <= v <= hi:
            rep.err(f"look.{k}", f"{v} is outside {lo:g}..{hi:g}")

    # ---- fonts
    fonts = film.get("fonts")
    if fonts is not None:
        if not isinstance(fonts, dict):
            rep.err("fonts", "must be an object like {\"display\": \"Inter\"}")
        else:
            for k, v in fonts.items():
                if k not in FONT_KEYS:
                    rep.warn("fonts", f"unknown key '{k}' is ignored{suggest(k, FONT_KEYS)}")
                elif not isinstance(v, str) or not v.strip():
                    rep.err(f"fonts.{k}", "must be a font family name")
            disp = fonts.get("display") if isinstance(fonts, dict) else None
            if isinstance(disp, str) and disp.strip() and disp.strip() != "Inter":
                rep.warn("fonts.display", f"'{disp}' is not loaded by the template (only Inter, JetBrains Mono and "
                                          "Noto Kufi Arabic are); it is used only if installed on the viewing machine")

    # ---- audio
    audio = film.get("audio")
    if audio not in (None, ""):
        if not isinstance(audio, str):
            rep.err("audio", "must be a file path or null")
        else:
            ap = resolve_asset(audio, base_dir)
            if not ap.is_file():
                rep.warn("audio", f"file not found: {ap} -- the MP4 will be silent unless render.py gets --audio")

    # ---- beats
    beats = film.get("beats")
    if not isinstance(beats, list) or not beats:
        rep.err("beats", "must be a non-empty list of beat objects")
        return rep
    n = len(beats)
    if n < 2 or n > 12:
        rep.err("beats", f"{n} beats; a film needs 2-12 (4-7 is the sweet spot)")
    elif not 4 <= n <= 7:
        rep.warn("beats", f"{n} beats; 4-7 beats usually cut best")

    seen_ids = {}
    frame = 0
    endcards = []
    common_keys = set(common) | {"shot", "dur"}
    for i, beat in enumerate(beats):
        where = f"beat {i + 1}"
        if not isinstance(beat, dict):
            rep.err(where, "must be an object")
            continue
        bid = beat.get("id")
        if bid is not None:
            if not isinstance(bid, str) or not bid.strip():
                rep.err(where, "'id' must be a non-empty string")
            else:
                where = f"beat {i + 1} \"{bid}\""
                if bid in seen_ids:
                    rep.warn(where, f"id also used by beat {seen_ids[bid]}; ids should be unique")
                seen_ids.setdefault(bid, i + 1)
        shot = beat.get("shot")
        spec = shots.get(shot) if isinstance(shot, str) else None
        if shot is None:
            rep.err(where, f"missing 'shot'; use one of {', '.join(shots)}")
        elif spec is None:
            rep.err(where, f"unknown shot {json.dumps(shot)}{suggest(shot, shots)}; use one of {', '.join(shots)}")
        else:
            where += f" ({shot})"
        if shot == "endcard":
            endcards.append(i)

        dur = beat.get("dur")
        nframes = 0
        if dur is None:
            rep.err(where, "missing 'dur' (seconds)")
        elif not is_num(dur):
            rep.err(where, f"'dur' must be a number of seconds, got {json.dumps(dur)}")
        elif dur <= 0.5:
            rep.err(where, f"'dur' {dur}s is too short; beats must be longer than 0.5s")
            nframes = beat_frames(dur, fps) if dur > 0 else 0
        else:
            nframes = beat_frames(dur, fps)
            if spec:
                lo, hi = spec.get("minDur", 0), spec.get("maxDur", 1e9)
                if dur < lo:
                    rep.warn(where, f"'dur' {dur}s is below this shot's comfortable minimum {lo}s -- it may feel rushed")
                elif dur > hi:
                    rep.warn(where, f"'dur' {dur}s is above this shot's maximum {hi}s -- it may drag")

        # common fields
        for cname, cspec in common.items():
            if cname in ("id", "dur", "shot") or cname not in beat:
                continue
            v = beat[cname]
            if cspec.get("type") == "enum" and "values" in cspec:
                if v not in cspec["values"]:
                    rep.err(where, f"'{cname}' must be one of {', '.join(cspec['values'])}; got {json.dumps(v)}"
                            + suggest(v, cspec["values"]))
            elif cspec.get("type") == "boolean" and not isinstance(v, bool):
                rep.err(where, f"'{cname}' must be true or false")
            elif cspec.get("type") == "string" and not isinstance(v, str):
                rep.err(where, f"'{cname}' must be a string")
        if beat.get("hero") and not (isinstance(brand, dict) and brand.get("color")):
            rep.warn(where, "'hero' is set but brand.color is missing; the beat keeps its spectrum colour")

        if spec:
            params = spec.get("params", {})
            for pname, ps in params.items():
                if ps.get("required") and pname not in beat:
                    rep.err(where, f"missing required '{pname}'" + (f" ({ps['note']})" if ps.get("note") else ""))
            for pname, v in beat.items():
                if pname in common_keys:
                    continue
                if pname in params:
                    _check_param(rep, where, pname, params[pname], v, icons)
                else:
                    rep.warn(where, f"unknown param '{pname}' is ignored by '{shot}'"
                             f"{suggest(pname, list(params) + list(common_keys))}")
            _shot_specific(rep, where, shot, beat)

        rep.rows.append({
            "index": i + 1, "id": bid if isinstance(bid, str) else f"b{i + 1}", "shot": shot,
            "start": frame / fps, "end": (frame + nframes) / fps, "dur": dur, "frames": nframes,
            "text": describe_beat(beat, spec, film),
        })
        frame += nframes

    rep.total_frames = frame
    if endcards:
        if endcards[-1] != n - 1:
            rep.warn("beats", "the endcard should be the last beat")
        if len(endcards) > 1:
            rep.warn("beats", f"{len(endcards)} endcards; use one, at the end")
    else:
        rep.warn("beats", "no endcard; end on an 'endcard' beat with the brand, call to action and URL")

    total = rep.duration
    if frame:
        if total < 4 or total > 120:
            rep.err("duration", f"total {total:.2f}s; films must be 4-120 seconds")
        elif total < 12:
            rep.warn("duration", f"total {total:.2f}s; under 12s tends to feel rushed")
        elif total > 45:
            rep.warn("duration", f"total {total:.2f}s; over 45s needs a real narrative to hold attention")
    return rep


def format_report(rep: Report, film=None, show_table=True) -> str:
    out = []
    if show_table and rep.rows:
        title = (film or {}).get("title") if isinstance(film, dict) else None
        if title:
            out.append(f"Beat sheet: {title}")
        heads = ("#", "id", "time", "shot", "on screen")
        rows = []
        for r in rep.rows:
            rows.append((str(r["index"]), str(r["id"]), f"{r['start']:5.2f}-{r['end']:5.2f}s",
                         str(r["shot"]), r["text"]))
        w = [max(len(h), *(len(row[c]) for row in rows)) for c, h in enumerate(heads[:4])]
        fmt = "  ".join("{:<%d}" % x for x in w) + "  {}"
        out.append(fmt.format(*heads))
        out.append(fmt.format(*("-" * x for x in w), "-" * 9))
        for row in rows:
            out.append(fmt.format(*row))
        size = f"{rep.size[0]}x{rep.size[1]} ({rep.ratio})" if rep.size else "size unknown"
        out.append(f"Total {rep.duration:.2f}s  |  {rep.total_frames} frames @ {rep.fps} fps  |  {size}  |  "
                   f"{len(rep.rows)} beats")
        out.append("")
    for e in rep.errors:
        out.append(f"ERROR   {e}")
    for w_ in rep.warnings:
        out.append(f"warning {w_}")
    if rep.errors:
        out.append(f"\n{len(rep.errors)} error(s), {len(rep.warnings)} warning(s) -- fix the errors and run again.")
    else:
        out.append(f"OK: valid film ({len(rep.warnings)} warning(s)).")
    return "\n".join(out)


def load_and_validate(film_path, engine_dir=None):
    """Returns (film or None, report, manifest)."""
    manifest, _ = _env.load_manifest(engine_dir)
    rep = Report()
    try:
        film, notes = _env.load_json_file(film_path)
    except _env.JsonLoadError as e:
        rep.err("", str(e))
        return None, rep, manifest
    rep = validate_film(film, manifest, Path(film_path).resolve().parent)
    for n in notes:
        rep.warnings.insert(0, f"film.json: {n}")
    return film, rep, manifest


def main(argv=None):
    _env.setup_stdio()
    ap = argparse.ArgumentParser(description="Validate a neon-glass-motion film.json and print its beat sheet.")
    ap.add_argument("film", help="path to film.json")
    ap.add_argument("--engine-dir", help="engine folder whose shots.manifest.json to use (default: the skill's)")
    ap.add_argument("--json", action="store_true", help="print a machine-readable JSON report")
    ap.add_argument("--quiet", action="store_true", help="omit the beat sheet table")
    a = ap.parse_args(argv)
    try:
        film, rep, _ = load_and_validate(a.film, a.engine_dir)
    except _env.JsonLoadError as e:
        print(f"ERROR   {e}")
        return 1
    if a.json:
        print(json.dumps(rep.as_dict(), ensure_ascii=False, indent=2))
    else:
        print(format_report(rep, film, show_table=not a.quiet))
    return 1 if rep.errors else 0


if __name__ == "__main__":
    sys.exit(main())
