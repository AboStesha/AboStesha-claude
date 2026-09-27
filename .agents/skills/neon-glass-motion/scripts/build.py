#!/usr/bin/env python3
"""Build a self-contained neon-glass-motion HTML film from a film.json.

Usage:
    python scripts/build.py film.json [-o film.html] [--engine-dir DIR]

Validates first (errors abort), then assembles engine/template.html +
engine/core.js + engine/shots/*.js (manifest order) into one HTML file with
the film settings as readable, editable JSON at the top. The logo is inlined
as a data URI so the file works anywhere, offline included.
Standard library only.
"""
from __future__ import annotations

import argparse
import base64
import html
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

sys.dont_write_bytecode = True  # keep the skill folder free of __pycache__
sys.path.insert(0, str(Path(__file__).resolve().parent))
import _env  # noqa: E402
import validate as V  # noqa: E402

PLACEHOLDER_RE = re.compile(r"\{\{(TITLE|FILM_CONFIG|ENGINE)\}\}")
TOP_ORDER = ["title", "ratio", "fps", "brand", "look", "fonts", "audio", "beats"]
BRAND_ORDER = ["name", "color", "accent", "url", "logo"]


# --------------------------------------------------------------------------- escaping

def js_safe(code: str) -> str:
    """Make text safe to sit inside an inline <script> element."""
    code = re.sub(r"</(script)", r"<\\/\1", code, flags=re.IGNORECASE)
    code = code.replace("<!--", "\\x3C!--")
    return code


def json_safe(text: str) -> str:
    """JSON text that is also safe inside <script> (valid JSON and valid JS)."""
    text = text.replace("</", "<\\/").replace("<!--", "\\u003C!--")
    return text.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")


def comment_safe(text: str) -> str:
    text = str(text).replace("*/", "* /")
    text = re.sub(r"</(script)", r"< /\1", text, flags=re.IGNORECASE)
    return text.replace("<!--", "< !--")


def dumps_line(v) -> str:
    return json.dumps(v, ensure_ascii=False, separators=(", ", ": "))


# --------------------------------------------------------------------------- film config

def ordered(d: dict, first: list) -> dict:
    out = {k: d[k] for k in first if k in d}
    out.update({k: v for k, v in d.items() if k not in out})
    return out


def order_beat(beat: dict, manifest: dict) -> dict:
    spec = manifest.get("shots", {}).get(beat.get("shot"), {})
    first = ["id", "shot", "dur"] + list(spec.get("params", {})) + ["camera", "cut", "hero"]
    out = ordered(beat, first)
    if "note" in out:  # notes read best at the end of the line
        out["note"] = out.pop("note")
    return out


def film_to_js(film: dict, manifest: dict) -> str:
    """window.FILM = {...}; with one beat per line so beats are easy to reorder/delete."""
    f = ordered(film, TOP_ORDER)
    lines = ["window.FILM = {"]
    keys = list(f)
    for i, k in enumerate(keys):
        comma = "," if i < len(keys) - 1 else ""
        v = f[k]
        if k == "beats" and isinstance(v, list):
            lines.append('  "beats": [')
            for j, b in enumerate(v):
                bc = "," if j < len(v) - 1 else ""
                b2 = order_beat(b, manifest) if isinstance(b, dict) else b
                lines.append("    " + dumps_line(b2) + bc)
            lines.append("  ]" + comma)
        else:
            if k == "brand" and isinstance(v, dict):
                v = ordered(v, BRAND_ORDER)
            lines.append(f"  {json.dumps(k)}: {dumps_line(v)}{comma}")
    lines.append("};")
    return json_safe("\n".join(lines))


def config_comment(film: dict, rep, manifest: dict) -> str:
    title = comment_safe(film.get("title") or "Untitled film")
    size = f"{rep.size[0]} x {rep.size[1]}" if rep.size else "?"
    shots = ", ".join(manifest.get("shots", {}))
    icons = manifest.get("icons", [])
    icon_lines, cur = [], "     "
    for ic in icons:
        if len(cur) + len(ic) + 2 > 78:
            icon_lines.append(cur.rstrip())
            cur = "     "
        cur += ic + ", "
    icon_lines.append(cur.rstrip().rstrip(","))

    beat_lines = []
    for r in rep.rows:
        txt = comment_safe(re.sub(r"\s+\[[^\]]*\]$", "", r["text"]))
        if len(txt) > 64:
            txt = txt[:61] + "..."
        beat_lines.append(f"     {r['index']:>2}. {comment_safe(r['id']):<8} {comment_safe(r['shot']):<8} "
                          f"{r['start']:5.1f} - {r['end']:5.1f}s   {txt}")

    c = f"""/* ============================================================================
   NEON GLASS MOTION  -  FILM SETTINGS
   {title}
   {rep.ratio or '?'} ({size})  |  {rep.fps} fps  |  {rep.duration:.1f} seconds  |  {len(rep.rows)} beats

   Everything the film shows is set right here, in plain text. Edit a value in
   any text editor, save the file, then re-open it (or press refresh in your
   browser) and the film plays with your change. No other step is needed.

   THE BEATS, in the order they play:
{chr(10).join(beat_lines)}

   TIMING
   * "dur" is how long a beat stays on screen, in SECONDS ("dur": 3.4).
     Make a beat longer or shorter and every beat after it simply moves.
   * The whole film lasts as long as all the "dur" values added together.

   WORDS
   * "text", "sub", "label", "cta", "items", "lines", "labels" are the words
     on screen. Keep each line to five words or fewer - short lines hit hard.
   * "value" on a number beat is the figure itself, e.g. "40%", "9s", "10x".

   ORDER - reordering or removing beats
   * Each beat is ONE line inside "beats": [ ... ]. Cut and paste a whole line
     to move a beat; delete a whole line to drop it. Every beat line ends with
     a comma except the last one.
   * The colours travel cool-to-warm across the beats, so they re-flow by
     themselves when the order changes.

   BRAND COLOURS
   * "brand" -> "color" is your hero colour and "accent" an optional second
     colour, both as hex codes like "#6633EE". Beats with "hero": true (and the
     end card) wear the brand colour; the neon spectrum is built around it.
     Remove "color" for the pure cyan -> violet -> magenta spectrum.
   * "name" and "url" appear on the end card.

   LOOK - three dials
   * "temperature": -1 = colder (cyan and blue) ... 0 ... +1 = warmer (magenta,
     orange). It rotates the whole colour arc.
   * "energy": 0 = calm, soft glow ... 1 = strong bloom, bigger push-ins.
     Raise it to make the film pop more.
   * "density": 0 = sparse, one object per beat ... 1 = more particles and
     secondary objects. Lower it if the film feels busy.

   MORE BEAT OPTIONS
   * "shot": {shots}
   * "camera": "push" (default) | "pull" | "drift" | "still"
   * "cut": "hard" (default) | "flash" (a white-hot flash as the beat starts)
   * "icon" names:
{chr(10).join(icon_lines)}

   Keep the punctuation intact: straight double quotes around words, a colon
   after each name, commas between items. If the screen stays black after an
   edit, a comma or a quote went missing - undo the last change and reload.
   ============================================================================ */"""
    return c


def build_config(film: dict, rep, manifest: dict, logo_data: str | None, logo_name: str | None) -> str:
    safe_film = json.loads(json.dumps(film))  # deep copy
    if logo_data and isinstance(safe_film.get("brand"), dict):
        safe_film["brand"]["logo"] = logo_name or "logo"
    comment = config_comment(film, rep, manifest)
    out = [comment, film_to_js(safe_film, manifest)]
    if logo_data:
        out.append("/* The logo image, embedded so this file works offline. To change the logo, put the new file\n"
                   "   next to your film.json, set \"logo\" there and build again. */")
        out.append("window.FILM.brand.logo = " + json_safe(json.dumps(logo_data)) + ";")
    return js_safe("\n".join(out))


# --------------------------------------------------------------------------- logo

def _svg_with_size(data: bytes) -> bytes:
    """Give an SVG explicit width/height from its viewBox when it has none, so it
    has an intrinsic size when drawn to canvas."""
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError:
        return data
    m = re.search(r"<svg\b[^>]*>", text, flags=re.IGNORECASE | re.DOTALL)
    if not m:
        return data
    tag = m.group(0)
    has_w = re.search(r"\swidth\s*=", tag)
    has_h = re.search(r"\sheight\s*=", tag)
    vb = re.search(r"viewBox\s*=\s*[\"']\s*([-\d.eE]+)[\s,]+([-\d.eE]+)[\s,]+([\d.eE]+)[\s,]+([\d.eE]+)", tag)
    if (has_w and has_h) or not vb:
        return data
    w, h = float(vb.group(3)), float(vb.group(4))
    if w <= 0 or h <= 0:
        return data
    scale = 512.0 / max(w, h)  # decent raster size for canvas drawing
    add = ""
    if not has_w:
        add += f' width="{w * scale:.0f}"'
    if not has_h:
        add += f' height="{h * scale:.0f}"'
    new_tag = tag[:4] + add + tag[4:]
    return (text[:m.start()] + new_tag + text[m.end():]).encode("utf-8")


def inline_logo(logo: str, base_dir: Path):
    """Returns (data_uri, display_name, warning)."""
    if not logo:
        return None, None, None
    if logo.startswith("data:"):
        return logo, "embedded", None
    if re.match(r"^https?://", logo):
        try:
            req = urllib.request.Request(logo, headers={"User-Agent": "Mozilla/5.0 neon-glass-motion"})
            with urllib.request.urlopen(req, timeout=15) as r:
                data = r.read()
                ctype = (r.headers.get("Content-Type") or "").split(";")[0].strip()
        except Exception as e:  # noqa: BLE001
            return None, None, f"could not download the logo ({e}); the end card uses the wordmark instead"
        ext = Path(logo.split("?")[0]).suffix.lower()
        mime = V.LOGO_EXTS.get(ext) or ctype or "image/png"
        if not mime.startswith("image/"):
            return None, None, f"the logo URL did not return an image ({mime}); the end card uses the wordmark"
        name = Path(logo.split("?")[0]).name or "logo"
    else:
        p = V.resolve_asset(logo, base_dir)
        data = p.read_bytes()
        mime = V.LOGO_EXTS[p.suffix.lower()]
        name = p.name
    if mime == "image/svg+xml":
        data = _svg_with_size(data)
    return f"data:{mime};base64,{base64.b64encode(data).decode('ascii')}", name, None


# --------------------------------------------------------------------------- engine

def engine_js(engine_dir: Path, manifest: dict, used_shots: set):
    """Returns (list of (label, code) chunks, warnings)."""
    warnings = []
    core = engine_dir / "core.js"
    manifest_js = "window.NGM_MANIFEST = " + json_safe(json.dumps(manifest, ensure_ascii=False,
                                                                  separators=(",", ":"))) + ";\n"
    chunks = [("core.js", manifest_js + "/* ---- core.js ---- */\n" + core.read_text(encoding="utf-8"))]
    n_shots = 0
    missing = []
    for name, spec in manifest.get("shots", {}).items():
        rel = spec.get("file") or f"shots/{name}.js"
        p = engine_dir / rel
        if not p.is_file():
            missing.append(name)
            continue
        chunks.append((rel, f"/* ---- {rel} ---- */\n" + p.read_text(encoding="utf-8")))
        n_shots += 1
    if missing:
        warnings.append(f"shot files missing in {engine_dir / 'shots'}, skipped: {', '.join(missing)}")
        used_missing = [m for m in missing if m in used_shots]
        if used_missing:
            warnings.append(f"this film USES {', '.join(used_missing)}: those beats will show an error "
                            "instead of the shot")
    return chunks, warnings, n_shots


def assemble(template: str, title: str, config: str, chunks) -> str:
    """Fill the three placeholders in one pass (inserted text is never re-scanned).

    When {{ENGINE}} sits alone in a <script> element, each engine file gets its own
    <script> element, so a syntax error in one shot cannot take the others down."""
    m = re.search(r"(<script\b[^>]*>)\s*\{\{ENGINE\}\}\s*</script>", template, flags=re.IGNORECASE)
    if m and "src=" not in m.group(1).lower():
        open_tag = m.group(1)
        engine = f"\n</script>\n{open_tag}\n".join(js_safe(code) for _, code in chunks)
    else:
        parts = []
        for label, code in chunks:
            if label.startswith("shots/"):
                parts.append("try {\n" + js_safe(code) + "\n} catch (e) { console.error('[NGM] " + label +
                             " failed to load:', e); }")
            else:
                parts.append(js_safe(code))
        engine = "\n".join(parts)
    values = {"TITLE": html.escape(title, quote=True), "FILM_CONFIG": config, "ENGINE": engine}
    return PLACEHOLDER_RE.sub(lambda mm: values[mm.group(1)], template)


# --------------------------------------------------------------------------- main

def default_out(film_path: Path) -> Path:
    name = film_path.name
    if name.endswith(".film.json"):
        return film_path.with_name(name[: -len(".film.json")] + ".html")
    return film_path.with_suffix(".html")


def build(film_path, out=None, engine_dir=None, quiet=False) -> int:
    film_path = Path(film_path).resolve()
    engine_dir = Path(engine_dir).resolve() if engine_dir else _env.ENGINE_DIR
    try:
        film, rep, manifest = V.load_and_validate(film_path, engine_dir)
    except _env.JsonLoadError as e:
        print(f"ERROR   {e}")
        return 1
    print(V.format_report(rep, film, show_table=not quiet))
    if rep.errors:
        print("\nBuild aborted: fix the errors above.")
        return 1

    template_p = engine_dir / "template.html"
    core_p = engine_dir / "core.js"
    missing = [str(p) for p in (template_p, core_p) if not p.is_file()]
    if missing:
        print("\nERROR   engine files missing: " + ", ".join(missing))
        return 2
    template = template_p.read_text(encoding="utf-8")
    for ph in ("{{FILM_CONFIG}}", "{{ENGINE}}"):
        if ph not in template:
            print(f"\nERROR   {template_p} has no {ph} placeholder")
            return 2
    warns = []
    if "{{TITLE}}" not in template:
        warns.append("template has no {{TITLE}} placeholder")

    brand = film.get("brand") if isinstance(film.get("brand"), dict) else {}
    logo_data, logo_name, w = inline_logo(brand.get("logo") or "", film_path.parent)
    if w:
        warns.append("brand.logo: " + w)
        if isinstance(film.get("brand"), dict):
            film["brand"].pop("logo", None)

    out_p = Path(out).resolve() if out else default_out(film_path)
    out_p.parent.mkdir(parents=True, exist_ok=True)

    # audio path: keep it working relative to the output HTML
    audio = film.get("audio")
    if isinstance(audio, str) and audio and not re.match(r"^[a-z]+:", audio, flags=re.I):
        ap = V.resolve_asset(audio, film_path.parent).resolve()
        try:
            film["audio"] = Path(os.path.relpath(ap, out_p.parent)).as_posix()
        except ValueError:  # different drive on Windows
            film["audio"] = ap.as_posix()

    used = {b.get("shot") for b in film.get("beats", []) if isinstance(b, dict)}
    chunks, shot_warns, n_shots = engine_js(engine_dir, manifest, used)
    warns += shot_warns

    config = build_config(film, rep, manifest, logo_data, logo_name)
    title = film.get("title") or "Untitled film"
    doc = assemble(template, title, config, chunks)
    tmp = out_p.with_name(out_p.name + ".tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(doc)
    os.replace(tmp, out_p)

    for w_ in warns:
        print(f"warning {w_}")
    size = out_p.stat().st_size
    print(f"\nBuilt {out_p}  ({_env.human_bytes(size)})")
    print(f"  {len(rep.rows)} beats | {rep.duration:.2f}s | {rep.total_frames} frames | "
          f"{rep.size[0]}x{rep.size[1]} @ {rep.fps} fps | logo: {logo_name or 'none'} | "
          f"audio: {film.get('audio') or 'none'}")
    print(f"  engine: {engine_dir}  (core.js + {n_shots} shot files)")
    here = Path(__file__).resolve().parent
    py = Path(sys.executable).name if sys.executable else "python"
    print("Next: open the .html in a browser to play it, or check composition with:\n"
          f"  {py} \"{here / 'render.py'}\" \"{out_p}\" --stills \"{out_p.parent / (out_p.stem + '-stills')}\"")
    return 0


def main(argv=None):
    _env.setup_stdio()
    ap = argparse.ArgumentParser(description="Build a self-contained HTML film from a film.json.")
    ap.add_argument("film", help="path to film.json")
    ap.add_argument("-o", "--out", help="output .html (default: next to the film.json)")
    ap.add_argument("--engine-dir", help="engine folder to build from (default: the skill's engine/)")
    ap.add_argument("--quiet", action="store_true", help="omit the beat sheet table")
    a = ap.parse_args(argv)
    return build(a.film, a.out, a.engine_dir, a.quiet)


if __name__ == "__main__":
    sys.exit(main())
