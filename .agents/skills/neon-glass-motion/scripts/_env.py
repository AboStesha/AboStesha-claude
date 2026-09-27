"""Shared helpers for the neon-glass-motion scripts.

One place for: skill paths, tolerant JSON loading, UTF-8 console output,
Chromium discovery + launch (Playwright), ffmpeg discovery and the per-user
frame cache location. check_env.py and render.py both use this module, so
they always agree about which browser and which ffmpeg get used.

Standard library only. Playwright and imageio-ffmpeg are imported lazily.
"""
from __future__ import annotations

import glob
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
SKILL_DIR = SCRIPTS_DIR.parent
ENGINE_DIR = SKILL_DIR / "engine"
MANIFEST_NAME = "shots.manifest.json"

IS_WIN = sys.platform.startswith("win")
IS_MAC = sys.platform == "darwin"

RATIO_SIZES = {"9:16": (1080, 1920), "1:1": (1080, 1080), "16:9": (1920, 1080)}
FPS_ALLOWED = (24, 25, 30, 60)


# --------------------------------------------------------------------------- console

def setup_stdio() -> None:
    """Make print() safe for Arabic text, arrows and dashes on every OS."""
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)
        except Exception:
            pass


def eprint(*a) -> None:
    print(*a, file=sys.stderr, flush=True)


# --------------------------------------------------------------------------- JSON

class JsonLoadError(Exception):
    pass


def _strip_jsonc(text: str) -> str:
    """Remove // and /* */ comments (outside strings) and trailing commas."""
    out = []
    i, n = 0, len(text)
    in_str = False
    while i < n:
        ch = text[i]
        if in_str:
            out.append(ch)
            if ch == "\\" and i + 1 < n:
                out.append(text[i + 1])
                i += 2
                continue
            if ch == '"':
                in_str = False
            i += 1
            continue
        if ch == '"':
            in_str = True
            out.append(ch)
            i += 1
            continue
        if text.startswith("//", i):
            j = text.find("\n", i)
            i = n if j < 0 else j
            continue
        if text.startswith("/*", i):
            j = text.find("*/", i + 2)
            i = n if j < 0 else j + 2
            continue
        out.append(ch)
        i += 1
    s = "".join(out)
    return re.sub(r",(\s*[}\]])", r"\1", s)


def load_json_file(path, lenient: bool = True):
    """Load JSON. Returns (data, notes). Accepts a UTF-8 BOM and, when lenient,
    // comments and trailing commas (with a note). Raises JsonLoadError with a
    readable location on failure."""
    p = Path(path)
    try:
        text = p.read_text(encoding="utf-8-sig")
    except FileNotFoundError:
        raise JsonLoadError(f"file not found: {p}")
    except UnicodeDecodeError as e:
        raise JsonLoadError(f"{p} is not UTF-8 text ({e})")
    try:
        return json.loads(text), []
    except json.JSONDecodeError as e:
        first = e
    if lenient:
        try:
            data = json.loads(_strip_jsonc(text))
            return data, ["file contains comments or trailing commas (accepted, but plain JSON is preferred)"]
        except json.JSONDecodeError:
            pass
    lines = text.splitlines()
    ln = lines[first.lineno - 1] if 0 < first.lineno <= len(lines) else ""
    pointer = " " * max(0, first.colno - 1) + "^"
    raise JsonLoadError(
        f"{p.name}: invalid JSON at line {first.lineno}, column {first.colno}: {first.msg}\n"
        f"    {ln}\n    {pointer}"
    )


def load_manifest(engine_dir=None):
    """Manifest from engine_dir if it has one, else the skill's own manifest."""
    cands = []
    if engine_dir:
        cands.append(Path(engine_dir) / MANIFEST_NAME)
    cands.append(ENGINE_DIR / MANIFEST_NAME)
    for c in cands:
        if c.is_file():
            data, _ = load_json_file(c, lenient=False)
            return data, c
    raise JsonLoadError(f"shots manifest not found (looked in: {', '.join(str(c) for c in cands)})")


# --------------------------------------------------------------------------- cache dir

def user_cache_dir() -> Path:
    """Per-user cache root for rendered frames and downloaded fonts."""
    env = os.environ.get("NGM_CACHE_DIR")
    if env:
        return Path(env).expanduser()
    home = Path.home()
    if IS_WIN:
        base = Path(os.environ.get("LOCALAPPDATA") or (home / "AppData" / "Local"))
        return base / "neon-glass-motion" / "cache"
    if IS_MAC:
        return home / "Library" / "Caches" / "neon-glass-motion"
    base = Path(os.environ.get("XDG_CACHE_HOME") or (home / ".cache"))
    return base / "neon-glass-motion"


# --------------------------------------------------------------------------- ffmpeg

_FFMPEG_CACHE = None

H264_ENCODERS = ("libx264", "libopenh264", "h264_videotoolbox", "h264_mf", "h264_nvenc", "h264_qsv", "h264_amf")


def _probe_ffmpeg(exe: str):
    try:
        v = subprocess.run([exe, "-hide_banner", "-version"], capture_output=True, text=True,
                           timeout=20, errors="replace")
        if v.returncode != 0:
            return None
        version = (v.stdout.splitlines() or ["ffmpeg"])[0]
        enc = subprocess.run([exe, "-hide_banner", "-encoders"], capture_output=True, text=True,
                             timeout=20, errors="replace").stdout
    except Exception:
        return None
    found = [e for e in H264_ENCODERS if re.search(r"\s%s\s" % re.escape(e), enc)]
    return {"path": exe, "version": version, "h264": found, "png": bool(re.search(r"\spng\s", enc))}


def find_ffmpeg(refresh: bool = False):
    """Return {'path','version','h264':[encoders],'source'} or None.

    Order: $NGM_FFMPEG / $FFMPEG_BINARY / $IMAGEIO_FFMPEG_EXE, ffmpeg on PATH,
    then the imageio-ffmpeg wheel. An ffmpeg with libx264 is preferred."""
    global _FFMPEG_CACHE
    if _FFMPEG_CACHE is not None and not refresh:
        return _FFMPEG_CACHE or None
    cands = []
    for var in ("NGM_FFMPEG", "FFMPEG_BINARY", "IMAGEIO_FFMPEG_EXE"):
        v = os.environ.get(var)
        if v:
            cands.append((v, "$" + var))
    w = shutil.which("ffmpeg")
    if w:
        cands.append((w, "PATH"))
    try:
        import imageio_ffmpeg  # type: ignore
        cands.append((imageio_ffmpeg.get_ffmpeg_exe(), "imageio-ffmpeg"))
    except Exception:
        pass
    best = None
    seen = set()
    for exe, src in cands:
        key = os.path.realpath(exe) if os.path.exists(exe) else exe
        if key in seen:
            continue
        seen.add(key)
        info = _probe_ffmpeg(exe)
        if not info:
            continue
        info["source"] = src
        if "libx264" in info["h264"]:
            best = info
            break
        if best is None and info["h264"]:
            best = info
    _FFMPEG_CACHE = best or False
    return best


def ffprobe_like(ffmpeg: str, path) -> dict:
    """Parse `ffmpeg -i file` stderr into duration / size / fps / codecs."""
    r = subprocess.run([ffmpeg, "-hide_banner", "-i", str(path)], capture_output=True, text=True, errors="replace")
    err = r.stderr
    info = {"raw": err}
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", err)
    if m:
        info["duration"] = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
    m = re.search(r"Stream #\d+:\d+.*?: Video: (\w+)[^\n]*?(\d{2,5})x(\d{2,5})", err)
    if m:
        info["vcodec"] = m.group(1)
        info["w"], info["h"] = int(m.group(2)), int(m.group(3))
    m = re.search(r"Video:[^\n]*?([\d.]+) fps", err)
    if m:
        info["fps"] = float(m.group(1))
    m = re.search(r"Stream #\d+:\d+.*?: Audio: (\w+)", err)
    info["acodec"] = m.group(1) if m else None
    m = re.search(r"Video: \w+ \(([^)]+)\)", err)
    info["profile"] = m.group(1) if m else None
    m = re.search(r"Video:[^\n]*?(yuv\w+|rgb\w+|gbr\w+)", err)
    info["pix_fmt"] = m.group(1) if m else None
    return info


def count_decoded_frames(ffmpeg: str, path, timeout=600):
    """Fully decode the video stream. Returns (frames, error_text)."""
    cmd = [ffmpeg, "-hide_banner", "-v", "error", "-nostats", "-i", str(path), "-map", "0:v:0",
           "-f", "null", "-progress", "pipe:1", "-"]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, errors="replace")
    except subprocess.TimeoutExpired:
        return None, "decode check timed out"
    frames = None
    for line in r.stdout.splitlines():
        if line.startswith("frame="):
            try:
                frames = int(line.split("=", 1)[1].strip())
            except ValueError:
                pass
    err = r.stderr.strip()
    if r.returncode != 0 and not err:
        err = f"ffmpeg exited with code {r.returncode}"
    return frames, err


# --------------------------------------------------------------------------- Chromium

EXE_NAMES = {
    "chrome", "chrome.exe", "headless_shell", "headless_shell.exe", "chrome-headless-shell",
    "chrome-headless-shell.exe", "Chromium", "Google Chrome for Testing",
}


def playwright_version():
    try:
        from importlib.metadata import version
        return version("playwright")
    except Exception:
        try:
            import playwright  # type: ignore
            return getattr(playwright, "__version__", "unknown")
        except Exception:
            return None


def playwright_browser_roots():
    roots = []
    env = os.environ.get("PLAYWRIGHT_BROWSERS_PATH")
    if env and env != "0":
        roots.append(Path(env).expanduser())
    home = Path.home()
    if IS_WIN:
        la = os.environ.get("LOCALAPPDATA")
        if la:
            roots.append(Path(la) / "ms-playwright")
    elif IS_MAC:
        roots.append(home / "Library" / "Caches" / "ms-playwright")
    else:
        roots.append(Path(os.environ.get("XDG_CACHE_HOME") or (home / ".cache")) / "ms-playwright")
        roots.append(home / ".cache" / "ms-playwright")
        roots.append(Path("/opt/pw-browsers"))
        roots.append(Path("/ms-playwright"))
    try:
        import playwright  # type: ignore
        roots.append(Path(playwright.__file__).resolve().parent / "driver" / "package" / ".local-browsers")
    except Exception:
        pass
    out, seen = [], set()
    for r in roots:
        k = str(r)
        if k not in seen:
            seen.add(k)
            out.append(r)
    return out


def _walk_for_exes(root: Path, max_depth: int = 5):
    found = []
    root_depth = len(root.parts)
    for dirpath, dirnames, filenames in os.walk(root):
        depth = len(Path(dirpath).parts) - root_depth
        if depth >= max_depth:
            dirnames[:] = []
        # do not descend into locales/resources etc.
        dirnames[:] = [d for d in dirnames if d not in ("locales", "resources", "swiftshader", "MEIPreload",
                                                        "Resources", "Frameworks", "Libraries")]
        for f in filenames:
            if f in EXE_NAMES:
                p = Path(dirpath) / f
                if IS_WIN or os.access(p, os.X_OK):
                    found.append(p)
    return found


def _build_no(p: Path) -> int:
    for part in p.parts:
        m = re.match(r"chromium(?:_headless_shell|_tip_of_tree)?-(\d+)$", part)
        if m:
            return int(m.group(1))
    return 0


def chromium_candidates():
    """Ordered list of (path, label) Chromium-family executables to try."""
    cands = []
    for var in ("NGM_CHROMIUM", "CHROME_PATH", "CHROMIUM_PATH", "PUPPETEER_EXECUTABLE_PATH"):
        v = os.environ.get(var)
        if v and os.path.exists(v):
            cands.append((Path(v), "$" + var))
    pw = []
    for root in playwright_browser_roots():
        if not root.is_dir():
            continue
        for d in sorted(glob.glob(str(root / "chrom*"))):
            dp = Path(d)
            if dp.is_dir():
                for exe in _walk_for_exes(dp):
                    pw.append(exe)
    # Newest build first; headless shell before full chrome within a build (lighter, starts faster).
    pw.sort(key=lambda p: (-_build_no(p), 0 if "headless" in str(p).lower() else 1, str(p)))
    cands += [(p, "playwright-cache") for p in pw]
    for name in ("chromium", "chromium-browser", "google-chrome", "google-chrome-stable", "chrome",
                 "microsoft-edge", "microsoft-edge-stable", "msedge"):
        w = shutil.which(name)
        if w:
            cands.append((Path(w), "PATH:" + name))
    if IS_MAC:
        for base in (Path("/Applications"), Path.home() / "Applications"):
            for rel in ("Google Chrome.app/Contents/MacOS/Google Chrome",
                        "Chromium.app/Contents/MacOS/Chromium",
                        "Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
                        "Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary"):
                p = base / rel
                if p.exists():
                    cands.append((p, "app"))
    if IS_WIN:
        bases = [os.environ.get(v) for v in ("PROGRAMFILES", "PROGRAMFILES(X86)", "LOCALAPPDATA")]
        for b in filter(None, bases):
            for rel in (r"Google\Chrome\Application\chrome.exe", r"Chromium\Application\chrome.exe",
                        r"Microsoft\Edge\Application\msedge.exe"):
                p = Path(b) / rel
                if p.exists():
                    cands.append((p, "installed"))
    out, seen = [], set()
    for p, label in cands:
        k = os.path.realpath(str(p))
        if k not in seen:
            seen.add(k)
            out.append((p, label))
    return out


LAUNCH_ARGS = [
    "--force-color-profile=srgb",
    "--font-render-hinting=none",
    "--hide-scrollbars",
    "--mute-audio",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
    "--disable-features=CalculateNativeWinOcclusion",
]


class BrowserUnavailable(Exception):
    def __init__(self, attempts):
        self.attempts = attempts
        super().__init__("no launchable Chromium")


def _short(e: Exception) -> str:
    s = str(e).strip()
    # Playwright errors carry a big box-drawn banner; keep the first informative line.
    lines = [ln.strip().strip("╔╗╚╝═║ ").strip() for ln in s.splitlines()]
    lines = [ln for ln in lines if ln and not ln.startswith("=")]
    first = (lines[0] if lines else s)[:300]
    if _missing_deps(s) and not _missing_deps(first):
        first += " [missing dependencies: the host lacks system libraries this browser needs]"
    return first


def _missing_deps(msg: str) -> bool:
    return "missing dependencies" in msg or "error while loading shared libraries" in msg


def launch_order():
    """[(executable_path or None for Playwright's default, label)]."""
    cands = chromium_candidates()
    order = [(p, l) for p, l in cands if l.startswith("$")]  # explicit env override first
    order.append((None, "playwright default"))
    order += [(p, l) for p, l in cands if not l.startswith("$")]
    return order


def launch_chromium_sync(p, headless=True, extra_args=None):
    """Launch with the sync API. Returns (browser, description)."""
    attempts = []
    args = LAUNCH_ARGS + list(extra_args or [])
    for exe, label in launch_order():
        try:
            kw = {"headless": headless, "args": args}
            if exe is not None:
                kw["executable_path"] = str(exe)
            b = p.chromium.launch(**kw)
            return b, f"{label}: {exe or 'bundled'} (Chromium {b.version})"
        except Exception as e:  # noqa: BLE001
            attempts.append((label, str(exe or "bundled"), _short(e)))
    raise BrowserUnavailable(attempts)


async def launch_chromium_async(p, headless=True, extra_args=None, preferred=None):
    """Launch with the async API. `preferred` = executable path that worked before."""
    attempts = []
    args = LAUNCH_ARGS + list(extra_args or [])
    order = launch_order()
    if preferred:
        order = [(Path(preferred), "cached")] + order
    for exe, label in order:
        try:
            kw = {"headless": headless, "args": args}
            if exe is not None:
                kw["executable_path"] = str(exe)
            b = await p.chromium.launch(**kw)
            return b, f"{label}: {exe or 'bundled'} (Chromium {b.version})", (str(exe) if exe else None)
        except Exception as e:  # noqa: BLE001
            attempts.append((label, str(exe or "bundled"), _short(e)))
    raise BrowserUnavailable(attempts)


def browser_help_text(attempts=None, playwright_missing=False) -> str:
    """Exactly what to do when no browser can be launched."""
    py = Path(sys.executable).name if sys.executable else "python"
    chk = SCRIPTS_DIR / "check_env.py"
    chk_s = f'"{chk}"' if " " in str(chk) else str(chk)
    lines = []
    if playwright_missing:
        lines.append("The Python package 'playwright' is not installed.")
    elif attempts:
        lines.append("Could not launch any Chromium. Tried:")
        for label, exe, err in attempts[:8]:
            lines.append(f"  - {label}: {exe}\n      {err}")
        if any(_missing_deps(a[2]) for a in attempts):
            lines.append("A browser was found but the system is missing libraries it needs.")
    lines += [
        "",
        "To enable MP4/still rendering, run ONE of:",
        f"  {py} {chk_s} --install",
        "      (installs playwright + imageio-ffmpeg, and downloads Chromium only if none works)",
        f"  {py} -m pip install playwright imageio-ffmpeg && {py} -m playwright install chromium",
        "  or point NGM_CHROMIUM at an existing Chrome/Chromium/Edge executable.",
    ]
    if sys.platform.startswith("linux"):
        lines.append(f"  (Linux, missing libraries: {py} -m playwright install-deps chromium  -- needs root)")
    lines += [
        "",
        "Without a browser the film is still complete: open the .html file in any browser to play,",
        "scrub and export frames. That HTML is the deliverable in HTML-only environments.",
    ]
    return "\n".join(lines)


# --------------------------------------------------------------------------- misc

def fmt_time(sec: float) -> str:
    sec = max(0, int(round(sec)))
    m, s = divmod(sec, 60)
    h, m = divmod(m, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def human_bytes(n: float) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.1f} {unit}" if unit != "B" else f"{int(n)} B"
        n /= 1024
    return f"{n:.1f} GB"
