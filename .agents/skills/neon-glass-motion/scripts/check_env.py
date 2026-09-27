#!/usr/bin/env python3
"""Check what this machine can produce for neon-glass-motion.

Usage:
    python scripts/check_env.py            # report
    python scripts/check_env.py --install  # also try to install what is missing
    python scripts/check_env.py --json     # one JSON line, then the CAPABILITY line

Checks: Python, the playwright package, a launchable Chromium (same discovery
as render.py), ffmpeg with an H.264 encoder (PATH, then imageio-ffmpeg), web
font reachability and the frame cache. The last line is always one of:

    CAPABILITY: mp4        -> full pipeline: MP4 + stills + HTML
    CAPABILITY: stills     -> Chromium works but no ffmpeg: stills + HTML
    CAPABILITY: html-only  -> no usable browser: deliver the HTML film only
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

sys.dont_write_bytecode = True  # keep the skill folder free of __pycache__
sys.path.insert(0, str(Path(__file__).resolve().parent))
import _env  # noqa: E402

CANVAS_TEST = """<!doctype html><canvas id=c width=64 height=64></canvas><script>
const x=document.getElementById('c').getContext('2d');x.fillStyle='#000';x.fillRect(0,0,64,64);
x.filter='blur(2px)';x.fillStyle='#8B5CF6';x.beginPath();x.arc(32,32,14,0,7);x.fill();
window.png=document.getElementById('c').toDataURL('image/png');</script>"""


def check_python():
    ok = sys.version_info >= (3, 9)
    return {"ok": ok, "version": sys.version.split()[0], "exe": sys.executable}


def check_playwright():
    try:
        import playwright  # noqa: F401
        return {"ok": True, "version": _env.playwright_version()}
    except ImportError:
        return {"ok": False, "version": None}


def check_chromium(pw_ok):
    if not pw_ok:
        return {"ok": False, "reason": "playwright not installed", "attempts": []}
    from playwright.sync_api import sync_playwright
    t = time.time()
    try:
        with sync_playwright() as p:
            try:
                browser, desc = _env.launch_chromium_sync(p, extra_args=["--disable-gpu"])
            except _env.BrowserUnavailable as e:
                return {"ok": False, "reason": "no launchable Chromium", "attempts": e.attempts}
            try:
                page = browser.new_page()
                page.set_content(CANVAS_TEST)
                png = page.evaluate("() => window.png || ''")
                capture_ok = png.startswith("data:image/png;base64,iVBOR")
            finally:
                browser.close()
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "reason": f"playwright failed to start: {_env._short(e)}", "attempts": []}
    return {"ok": capture_ok, "browser": desc, "capture": capture_ok, "seconds": round(time.time() - t, 2),
            "reason": None if capture_ok else "canvas capture failed"}


def check_ffmpeg():
    ff = _env.find_ffmpeg(refresh=True)
    if not ff:
        return {"ok": False}
    return {"ok": True, "path": ff["path"], "source": ff["source"], "version": ff["version"],
            "h264": ff["h264"], "libx264": "libx264" in ff["h264"]}


def check_fonts():
    url = "https://fonts.googleapis.com/css2?family=Inter:wght@800&display=block"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 Chrome/140"})
        with urllib.request.urlopen(req, timeout=6) as r:
            ok = r.status == 200 and b"@font-face" in r.read()
        return {"ok": ok}
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "reason": str(e)[:120]}


def check_cache():
    d = _env.user_cache_dir()
    used = 0
    if d.is_dir():
        for root, _dirs, files in os.walk(d):
            for f in files:
                try:
                    used += os.path.getsize(os.path.join(root, f))
                except OSError:
                    pass
    probe = d if d.exists() else Path.home()
    try:
        free = shutil.disk_usage(probe).free
    except OSError:
        free = None
    return {"dir": str(d), "used": used, "free": free}


def run_checks():
    r = {"python": check_python(), "playwright": check_playwright()}
    r["chromium"] = check_chromium(r["playwright"]["ok"])
    r["ffmpeg"] = check_ffmpeg()
    r["fonts"] = check_fonts()
    try:
        import PIL  # noqa: F401
        r["pil"] = True
    except ImportError:
        r["pil"] = False
    r["cache"] = check_cache()
    if r["chromium"]["ok"] and r["ffmpeg"]["ok"]:
        r["capability"] = "mp4"
    elif r["chromium"]["ok"]:
        r["capability"] = "stills"
    else:
        r["capability"] = "html-only"
    return r


def print_report(r):
    def line(name, ok, text):
        mark = "ok  " if ok else ("--  " if ok is None else "MISSING")
        print(f"  {name:<11} {mark:<8} {text}")

    print("neon-glass-motion environment check")
    py = r["python"]
    line("python", py["ok"], py["version"] + ("" if py["ok"] else "  (needs 3.9 or newer)"))
    pw = r["playwright"]
    line("playwright", pw["ok"], pw["version"] or "pip install playwright")
    ch = r["chromium"]
    if ch["ok"]:
        line("chromium", True, f"{ch['browser']}  [canvas capture ok, {ch['seconds']}s]")
    else:
        line("chromium", False, ch.get("reason") or "not available")
        for label, exe, err in (ch.get("attempts") or [])[:6]:
            print(f"              tried {label}: {exe}\n                {err}")
    ff = r["ffmpeg"]
    if ff["ok"]:
        enc = "libx264" if ff["libx264"] else ", ".join(ff["h264"])
        line("ffmpeg", True, f"{ff['path']} ({ff['source']}) | H.264: {enc}")
    else:
        line("ffmpeg", False, "no ffmpeg with an H.264 encoder (pip install imageio-ffmpeg)")
    fo = r["fonts"]
    line("web fonts", fo["ok"] if fo["ok"] else None,
         "Google Fonts reachable (Inter, JetBrains Mono, Noto Kufi Arabic)" if fo["ok"]
         else "offline: renders use fallback system fonts; the HTML loads the real fonts when online")
    line("PIL", True if r["pil"] else None, "installed" if r["pil"] else "not installed (optional, not needed)")
    c = r["cache"]
    free = _env.human_bytes(c["free"]) if c["free"] is not None else "?"
    line("frame cache", True, f"{c['dir']} ({_env.human_bytes(c['used'])} used, {free} free)")
    print()
    cap = r["capability"]
    if cap == "mp4":
        print("Ready: MP4 + stills + HTML.")
    elif cap == "stills":
        py = Path(sys.executable).name if sys.executable else "python3"
        print(f"Stills + HTML only: install an ffmpeg for MP4  ->  {py} -m pip install imageio-ffmpeg")
    else:
        print(_env.browser_help_text(r["chromium"].get("attempts"), playwright_missing=not r["playwright"]["ok"]))


def pip_install(pkgs):
    base = [sys.executable, "-m", "pip", "install", "--quiet", "--disable-pip-version-check"]
    attempts = [base + pkgs]
    if not (hasattr(sys, "real_prefix") or sys.prefix != getattr(sys, "base_prefix", sys.prefix)):
        attempts.append(base + ["--user"] + pkgs)
        attempts.append(base + ["--break-system-packages"] + pkgs)
    for cmd in attempts:
        print("  $ " + " ".join(cmd[2:]), flush=True)
        r = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
        if r.returncode == 0:
            return True
        tail = (r.stderr or r.stdout).strip().splitlines()[-1:] or [""]
        print(f"    failed: {tail[0][:200]}", flush=True)
    return False


def do_install(r):
    print("Installing what is missing...", flush=True)
    changed = False
    pkgs = []
    if not r["playwright"]["ok"]:
        pkgs.append("playwright")
    if not r["ffmpeg"]["ok"]:
        pkgs.append("imageio-ffmpeg")
    if pkgs:
        changed |= pip_install(pkgs)
    chromium_ok = r["chromium"]["ok"]
    if not chromium_ok:
        # re-check in a fresh process in case playwright was just installed
        chk = subprocess.run([sys.executable, str(Path(__file__).resolve()), "--json"], capture_output=True,
                             text=True, errors="replace")
        try:
            chromium_ok = json.loads(chk.stdout.splitlines()[0])["chromium"]["ok"]
        except Exception:  # noqa: BLE001
            chromium_ok = False
    if not chromium_ok:
        cmd = [sys.executable, "-m", "playwright", "install", "chromium"]
        print("  $ " + " ".join(cmd[1:]), flush=True)
        res = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
        if res.returncode != 0:
            print("    failed: " + ((res.stderr or res.stdout).strip().splitlines() or [""])[-1][:300], flush=True)
        else:
            changed = True
        attempts = r["chromium"].get("attempts") or []
        needs_deps = any(_env._missing_deps(a[2]) for a in attempts)
        if sys.platform.startswith("linux") and hasattr(os, "geteuid") and os.geteuid() == 0 and (
                needs_deps or res.returncode != 0):
            cmd = [sys.executable, "-m", "playwright", "install-deps", "chromium"]
            print("  $ " + " ".join(cmd[1:]), flush=True)
            res2 = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
            if res2.returncode != 0:
                print("    failed: " + ((res2.stderr or res2.stdout).strip().splitlines() or [""])[-1][:300],
                      flush=True)
            else:
                changed = True
    if not changed:
        print("  nothing could be installed (offline or no permission); see the report below.", flush=True)
    print(flush=True)


def main(argv=None):
    _env.setup_stdio()
    ap = argparse.ArgumentParser(description="Check (and optionally install) what neon-glass-motion needs.")
    ap.add_argument("--install", action="store_true",
                    help="pip-install playwright + imageio-ffmpeg if missing; download Chromium only if none works")
    ap.add_argument("--json", action="store_true", help="print one JSON line before the CAPABILITY line")
    a = ap.parse_args(argv)

    r = run_checks()
    if a.install and r["capability"] != "mp4":
        do_install(r)
        # fresh interpreter so newly installed packages are importable
        res = subprocess.run([sys.executable, str(Path(__file__).resolve())] + (["--json"] if a.json else []))
        return res.returncode
    if a.json:
        print(json.dumps(r, ensure_ascii=False, default=str))
    else:
        print_report(r)
    print(f"CAPABILITY: {r['capability']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
