#!/usr/bin/env python3
"""Render a neon-glass-motion HTML film to stills and/or an H.264 MP4.

Usage:
    python scripts/render.py film.html                       # -> film.mp4 next to the HTML
    python scripts/render.py film.html --stills DIR          # one PNG per beat + DIR/contact.png (no MP4)
    python scripts/render.py film.html --stills DIR --out film.mp4   # stills and MP4
    python scripts/render.py film.html --at 1.2,4.0          # extra stills at these times
    python scripts/render.py film.html --from 3 --to 7       # MP4 of just 3s..7s
    python scripts/render.py film.html --audio music.mp3     # mux music (fades out over the last second)

How it works: Chromium (via Playwright) opens film.html?render, then every frame is
drawn with NGM.seekFrame(f) and captured with NGM.capture('png'). Frames are cached
per beat, keyed by everything that affects that beat's pixels (not its start time),
in a per-user cache folder. A beat whose frames are all cached is not rendered again,
so a note that changes one beat re-renders only that beat. A full film is encoded as
one H.264 segment per beat (cached too, started while later beats still render) and
joined without re-encoding, then verified (decode + exact frame count); if the join
ever fails its check the film is re-encoded in one pass. Interrupted renders resume
where they stopped: run the same command again. Web fonts are fetched through Python
(proxy/CA friendly), cached, and skipped quickly when offline.

Exit codes: 0 ok | 1 bad input | 2 engine/render/encode failure | 3 no usable Chromium
(the HTML is still a complete deliverable) | 4 no ffmpeg | 5 stopped by --budget
(finished frames are cached; run again to continue) | 130 interrupted.
"""
from __future__ import annotations

import argparse
import asyncio
import base64
import bisect
import hashlib
import html as htmlmod
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.dont_write_bytecode = True  # keep the skill folder free of __pycache__
sys.path.insert(0, str(Path(__file__).resolve().parent))
import _env  # noqa: E402

EXIT_OK, EXIT_USAGE, EXIT_ENGINE, EXIT_NO_BROWSER, EXIT_NO_FFMPEG, EXIT_BUDGET = 0, 1, 2, 3, 4, 5
FONT_HOSTS = ("fonts.googleapis.com", "fonts.gstatic.com")
FRAME_TIMEOUT = 120.0
READY_TIMEOUT = 45.0

CAPTURE_JS = """async (f) => {
  await NGM.seekFrame(f);
  if (typeof NGM.capture === 'function') return await NGM.capture('png');
  return NGM.canvas.toDataURL('image/png').split(',')[1];
}"""

INFO_JS = """() => ({
  version: String(NGM.version || ''),
  fps: NGM.fps(), frames: NGM.frameCount(), size: NGM.size(),
  timeline: NGM.timeline(), film: window.FILM || null,
  manifest: window.NGM_MANIFEST || null,
  renderMode: !!NGM.renderMode,
  canvas: NGM.canvas ? [NGM.canvas.width, NGM.canvas.height] : null,
  fonts: (document.fonts ? Array.from(document.fonts).filter(f => f.status === 'loaded')
          .map(f => [f.family, f.weight, f.style, f.unicodeRange].join('|')).sort() : [])
})"""


class RenderError(Exception):
    def __init__(self, msg, code=EXIT_ENGINE):
        super().__init__(msg)
        self.code = code


def log(msg=""):
    print(msg, flush=True)


# --------------------------------------------------------------------------- helpers

def parse_time(s: str) -> float:
    s = str(s).strip().lower().rstrip("s")
    if ":" in s:
        mm, ss = s.split(":", 1)
        return int(mm) * 60 + float(ss)
    return float(s)


def parse_times(s: str):
    out = []
    for part in re.split(r"[,\s]+", s or ""):
        if part:
            out.append(parse_time(part))
    return out


def png_dims(data: bytes):
    if len(data) < 24 or data[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    return int.from_bytes(data[16:20], "big"), int.from_bytes(data[20:24], "big")


def safe_name(s: str, limit=24) -> str:
    s = re.sub(r"[^A-Za-z0-9_-]+", "-", str(s)).strip("-")
    return (s or "beat")[:limit]


def engine_fingerprint(html_text: str) -> str:
    """Hash of everything in the HTML except the film settings script and <title>.
    Any change to the engine code (core or a shot) therefore invalidates the cache."""
    text = html_text
    for m in re.finditer(r"<script\b[^>]*>(.*?)</script>", text, flags=re.DOTALL | re.IGNORECASE):
        if "window.FILM" in m.group(1) and "=" in m.group(1):
            text = text[:m.start()] + text[m.end():]
            break
    text = re.sub(r"<title>.*?</title>", "", text, count=1, flags=re.DOTALL | re.IGNORECASE)
    return hashlib.sha1(text.encode("utf-8", "replace")).hexdigest()


def guess_size(html_text: str):
    m = re.search(r'"ratio"\s*:\s*"(9:16|1:1|16:9)"', html_text)
    return _env.RATIO_SIZES.get(m.group(1) if m else "9:16")


# --------------------------------------------------------------------------- network router

class NetRouter:
    """Serves Google Fonts through Python (works behind proxies / custom CAs where the
    browser's own TLS fails), caches them on disk, fails fast offline, and blocks every
    other network request so a render never hangs on the network."""

    def __init__(self, cache_root: Path):
        self.dir = cache_root / "fonts"
        self.locks = {}
        self.dead = None
        self.stats = {"disk": 0, "fetched": 0, "failed": 0, "blocked": 0}

    def _paths(self, url):
        k = hashlib.sha1(url.encode()).hexdigest()
        return self.dir / k, self.dir / (k + ".type")

    def _read(self, url):
        body_p, type_p = self._paths(url)
        if body_p.is_file() and type_p.is_file():
            return body_p.read_bytes(), type_p.read_text().strip()
        return None

    def _fetch(self, url, headers):
        h = {"User-Agent": headers.get("user-agent", "Mozilla/5.0"), "Accept": headers.get("accept", "*/*")}
        req = urllib.request.Request(url, headers=h)
        with urllib.request.urlopen(req, timeout=8) as r:
            body = r.read()
            ctype = r.headers.get("Content-Type") or "application/octet-stream"
        self.dir.mkdir(parents=True, exist_ok=True)
        body_p, type_p = self._paths(url)
        tmp = body_p.with_name(body_p.name + f".{os.getpid()}.tmp")
        tmp.write_bytes(body)
        os.replace(tmp, body_p)
        type_p.write_text(ctype)
        return body, ctype

    async def handle(self, route):
        req = route.request
        url = req.url
        scheme = url.split(":", 1)[0].lower()
        if scheme not in ("http", "https"):
            await route.continue_()
            return
        host = (urllib.parse.urlparse(url).hostname or "").lower()
        if host in ("localhost", "127.0.0.1", "::1"):
            await route.continue_()
            return
        if host not in FONT_HOSTS:
            self.stats["blocked"] += 1
            await route.abort()
            return
        got = self._read(url)
        if got:
            self.stats["disk"] += 1
        elif not self.dead:
            lock = self.locks.setdefault(url, asyncio.Lock())
            async with lock:
                got = self._read(url)
                if not got and not self.dead:
                    try:
                        got = await asyncio.to_thread(self._fetch, url, dict(req.headers))
                        self.stats["fetched"] += 1
                    except Exception as e:  # noqa: BLE001
                        self.dead = str(e)[:160]
        if not got:
            self.stats["failed"] += 1
            await route.abort()
            return
        body, ctype = got
        await route.fulfill(status=200, body=body, headers={
            "content-type": ctype, "access-control-allow-origin": "*", "cache-control": "max-age=31536000"})


# --------------------------------------------------------------------------- cache

def prune_cache(frames_root: Path, keep: set, max_bytes: int):
    if max_bytes <= 0 or not frames_root.is_dir():
        return 0
    dirs = []
    total = 0
    for d in frames_root.iterdir():
        if not d.is_dir():
            continue
        size = 0
        for f in os.scandir(d):
            try:
                size += f.stat().st_size
            except OSError:
                pass
        total += size
        dirs.append((d.stat().st_mtime, d, size))
    freed = 0
    if total <= max_bytes:
        return 0
    for _, d, size in sorted(dirs):
        if d.name in keep:
            continue
        shutil.rmtree(d, ignore_errors=True)
        total -= size
        freed += size
        if total <= max_bytes:
            break
    return freed


# --------------------------------------------------------------------------- progress

class Progress:
    def __init__(self, total, label, step=0.05, min_gap=1.5):
        self.total = max(1, total)
        self.label = label
        self.done = 0
        self.t0 = time.time()
        self.step = step
        self.next = step
        self.min_gap = min_gap
        self.last = 0.0

    def tick(self, n=1):
        self.done += n
        frac = self.done / self.total
        now = time.time()
        final = self.done >= self.total
        if final or (frac + 1e-9 >= self.next and now - self.last >= self.min_gap):
            while self.next <= frac + 1e-9:
                self.next += self.step
            self.last = now
            el = now - self.t0
            fps = self.done / el if el > 0 else 0
            eta = (self.total - self.done) / fps if fps > 0 else 0
            log(f"[{self.label}] {self.done}/{self.total} frames {frac * 100:5.1f}% | {fps:5.1f} fps | "
                f"elapsed {_env.fmt_time(el)} | ETA {_env.fmt_time(eta)}")


# --------------------------------------------------------------------------- browser session

class Session:
    def __init__(self, args, html_path: Path, cache_root: Path):
        self.args = args
        self.html_path = html_path
        self.url = html_path.resolve().as_uri() + "?render"
        self.cache_root = cache_root
        self.router = NetRouter(cache_root)
        self.errors = {}  # message -> count
        self.browser = None
        self.contexts = []
        self.info = None
        self.W = self.H = None

    def _add_error(self, text):
        first = next((ln.strip() for ln in str(text).splitlines() if ln.strip()), str(text))
        first = re.sub(r"\s+(Error|TypeError|ReferenceError|RangeError|SyntaxError): .*$", "", first) or first
        self.errors[first] = self.errors.get(first, 0) + 1

    def _on_console(self, msg):
        try:
            if msg.type == "error":
                t = msg.text
                if "Failed to load resource" in t or "net::ERR_" in t:
                    return
                self._add_error(t)
        except Exception:
            pass

    def _on_pageerror(self, exc):
        self._add_error(f"uncaught: {exc}")

    async def open_page(self, size):
        ctx = await self.browser.new_context(viewport={"width": size[0], "height": size[1]},
                                             device_scale_factor=1, java_script_enabled=True)
        self.contexts.append(ctx)
        await ctx.route("**/*", self.router.handle)
        await ctx.add_init_script("window.__NGM_RENDER = true;")
        page = await ctx.new_page()
        page.on("console", self._on_console)
        page.on("pageerror", self._on_pageerror)
        await page.goto(self.url, wait_until="domcontentloaded", timeout=90000)
        try:
            await page.wait_for_function("() => !!(window.NGM && window.NGM.ready)", timeout=20000)
        except Exception:
            has = await page.evaluate("() => typeof window.NGM")
            detail = "; ".join(list(self.errors)[:5]) or "no error was reported"
            raise RenderError(f"the engine did not start in {self.html_path.name} (window.NGM is {has}). "
                              f"Page errors: {detail}")
        try:
            await asyncio.wait_for(page.evaluate("() => Promise.resolve(NGM.ready).then(() => true)"),
                                   timeout=READY_TIMEOUT)
        except asyncio.TimeoutError:
            log(f"warning: NGM.ready did not resolve within {READY_TIMEOUT:.0f}s; rendering anyway")
        return page


async def start_browser(p):
    try:
        browser, desc, _ = await _env.launch_chromium_async(p, extra_args=["--disable-gpu"])
    except _env.BrowserUnavailable as e:
        raise RenderError(_env.browser_help_text(e.attempts), EXIT_NO_BROWSER)
    return browser, desc


# --------------------------------------------------------------------------- frame rendering

async def render_frames(sess: Session, pages, jobs, budget_deadline, progress: Progress, on_done=None):
    """jobs: list of (global_frame, Path). Returns (done, stopped_by_budget).
    on_done(frame) is called after each frame is safely in the cache."""
    queue = list(reversed(jobs))  # pop() from the end = in frame order
    W, H = sess.W, sess.H
    state = {"done": 0, "stopped": False, "fatal": None}

    async def worker(wid, page):
        restarts = 0
        while queue and not state["fatal"]:
            if budget_deadline and time.time() >= budget_deadline:
                state["stopped"] = True
                return
            f, path = queue.pop()
            try:
                b64 = await asyncio.wait_for(page.evaluate(CAPTURE_JS, f), timeout=FRAME_TIMEOUT)
            except asyncio.TimeoutError:
                state["fatal"] = RenderError(f"frame {f} took longer than {FRAME_TIMEOUT:.0f}s to draw "
                                             "(a shot may be stuck in a loop)")
                return
            except Exception as e:  # noqa: BLE001
                msg = str(e)
                if ("crash" in msg.lower() or "closed" in msg.lower()) and restarts < 2:
                    restarts += 1
                    log(f"warning: worker {wid} page crashed at frame {f}; reopening it")
                    queue.append((f, path))
                    try:
                        page = await sess.open_page((W, H))
                        continue
                    except Exception as e2:  # noqa: BLE001
                        state["fatal"] = RenderError(f"could not reopen a crashed page: {e2}")
                        return
                state["fatal"] = RenderError(f"frame {f} failed: {msg.splitlines()[0] if msg else e!r}")
                return
            if not isinstance(b64, str) or not b64:
                state["fatal"] = RenderError(f"NGM.capture returned no image for frame {f}")
                return
            data = base64.b64decode(b64)
            dims = png_dims(data)
            if dims != (W, H):
                state["fatal"] = RenderError(
                    f"captured frame is {dims[0]}x{dims[1] if dims else '?'} but the film is {W}x{H} "
                    "(render mode not active?)" if dims else f"frame {f}: capture did not return a PNG")
                return
            tmp = path.with_name(f"{path.name}.{os.getpid()}-{wid}.tmp")
            tmp.write_bytes(data)
            os.replace(tmp, path)
            state["done"] += 1
            progress.tick()
            if on_done:
                on_done(f)

    await asyncio.gather(*(worker(i, pg) for i, pg in enumerate(pages)))
    if state["fatal"]:
        raise state["fatal"]
    return state["done"], state["stopped"]


# --------------------------------------------------------------------------- contact sheet

async def contact_sheet(sess: Session, stills, out_path: Path, film_title: str, meta_line: str):
    """stills: [(Path, caption_title, caption_sub, caption_text)]. Rendered by Chromium (no PIL needed)."""
    W, H = sess.W, sess.H
    if H > W:
        thumb, maxcols = 240, 6
    elif W > H:
        thumb, maxcols = 440, 3
    else:
        thumb, maxcols = 320, 4
    cols = max(1, min(maxcols, len(stills)))
    cards = []
    for path, t1, t2, t3 in stills:
        b64 = base64.b64encode(path.read_bytes()).decode("ascii")
        cards.append(
            f'<figure><img src="data:image/png;base64,{b64}"><figcaption>'
            f'<div class="t1">{htmlmod.escape(t1)}</div><div class="t2">{htmlmod.escape(t2)}</div>'
            f'<div class="t3">{htmlmod.escape(t3)}</div></figcaption></figure>')
    doc = f"""<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{{margin:0;background:#050507}}
    #sheet{{display:inline-block;padding:28px 28px 22px;background:#050507;color:#e9e9f0;
      font-family:'DejaVu Sans Mono','Menlo','Consolas',monospace}}
    .hd{{font:700 20px/1.3 'DejaVu Sans','Helvetica Neue',Arial,sans-serif;margin:0 0 4px}}
    .meta{{font-size:13px;color:#8d8d9a;margin:0 0 20px}}
    .grid{{display:grid;grid-template-columns:repeat({cols},{thumb}px);gap:22px 18px}}
    figure{{margin:0;width:{thumb}px}}
    img{{display:block;width:{thumb}px;height:auto;border-radius:6px;outline:1px solid #25252d}}
    .t1{{font-size:13px;font-weight:700;margin-top:9px;color:#fff}}
    .t2{{font-size:12px;color:#9a9aa8;margin-top:2px}}
    .t3{{font:13px/1.4 'DejaVu Sans','Noto Sans Arabic','Segoe UI','Helvetica Neue',Arial,sans-serif;
      color:#c9c9d6;margin-top:4px;word-break:break-word;unicode-bidi:plaintext;text-align:start}}
    </style></head><body><div id="sheet"><div class="hd">{htmlmod.escape(film_title)}</div>
    <div class="meta">{htmlmod.escape(meta_line)}</div><div class="grid">{''.join(cards)}</div></div></body></html>"""
    ctx = await sess.browser.new_context(viewport={"width": cols * (thumb + 18) + 60, "height": 400},
                                         device_scale_factor=1)
    try:
        page = await ctx.new_page()
        await page.set_content(doc, wait_until="load")
        await page.wait_for_function("() => Array.from(document.images).every(i => i.complete)", timeout=30000)
        await page.locator("#sheet").screenshot(path=str(out_path))
    finally:
        await ctx.close()


def contact_sheet_ffmpeg(ffmpeg, stills, out_path: Path, W, H):
    """Fallback: unlabeled grid via ffmpeg's tile filter."""
    n = len(stills)
    cols = min(n, 6 if H > W else 3 if W > H else 4)
    rows = math.ceil(n / cols)
    tw = 240 if H > W else 440 if W > H else 320
    with tempfile.TemporaryDirectory() as td:
        for i, (p, *_rest) in enumerate(stills):
            shutil.copyfile(p, Path(td) / f"{i:04d}.png")
        cmd = [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-framerate", "1", "-i",
               str(Path(td) / "%04d.png"), "-vf", f"scale={tw}:-2,tile={cols}x{rows}:padding=14:margin=18:color=0x24242c",
               "-frames:v", "1", str(out_path)]
        subprocess.run(cmd, check=True, capture_output=True)


# --------------------------------------------------------------------------- encode

def encoder_args(ff, crf, preset, W, H, fps):
    enc = "libx264" if "libx264" in ff["h264"] else ff["h264"][0]
    if enc == "libx264":
        return enc, ["-c:v", "libx264", "-preset", preset, "-crf", str(crf), "-profile:v", "high",
                     "-x264-params", "aq-mode=3"]
    rate = max(6, int(W * H * fps / (1920 * 1080 * 30) * 16))
    args = ["-c:v", enc, "-b:v", f"{rate}M", "-maxrate", f"{rate * 2}M", "-bufsize", f"{rate * 2}M"]
    if enc in ("h264_videotoolbox", "h264_nvenc", "h264_qsv", "h264_amf"):
        args += ["-profile:v", "high"]
    return enc, args


def _audio_args(audio, dur, input_index, audio_offset=0.0):
    """(input args, output args) that mux `audio` padded/trimmed to exactly `dur`, fading out at the end."""
    if not audio:
        return [], []
    inp = (["-ss", f"{audio_offset:.3f}"] if audio_offset > 0 else []) + ["-i", str(audio)]
    fade = min(1.0, dur / 4)
    out = ["-map", f"{input_index}:a:0?", "-af", f"apad,afade=t=out:st={max(0.0, dur - fade):.3f}:d={fade:.3f}",
           "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", f"{dur:.6f}"]
    return inp, out


def _run_ffmpeg_to(cmd, tmp_out: Path, out_path: Path, feed=None, progress=None):
    """Run ffmpeg writing tmp_out (optionally feeding PNG files on stdin), then move it into place."""
    errf = tempfile.TemporaryFile()
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE if feed is not None else subprocess.DEVNULL,
                            stdout=subprocess.DEVNULL, stderr=errf)
    if feed is not None:
        try:
            for p in feed:
                with open(p, "rb") as fh:
                    proc.stdin.write(fh.read())
                if progress:
                    progress.tick()
            proc.stdin.close()
        except (BrokenPipeError, OSError):
            pass
    rc = proc.wait()
    errf.seek(0)
    err = errf.read().decode("utf-8", "replace").strip()
    errf.close()
    if rc != 0:
        try:
            tmp_out.unlink()
        except OSError:
            pass
        raise RenderError(f"ffmpeg failed (exit {rc}):\n{err[-2000:]}")
    try:
        os.replace(tmp_out, out_path)
    except PermissionError:
        raise RenderError(f"could not write {out_path} (is it open in a video player?). "
                          f"The new file is at {tmp_out}")
    return err


def ffmpeg_encode(ff, frame_paths, out_path: Path, fps, W, H, crf, preset, audio=None, audio_offset=0.0,
                  progress_label="encode"):
    """PNG frames (in order) -> H.264 MP4 (bt709, yuv420p, exact frame count), optional audio."""
    n = len(frame_paths)
    dur = n / fps
    enc, vargs = encoder_args(ff, crf, preset, W, H, fps)
    vf = "scale=out_color_matrix=bt709:out_range=tv"
    if W % 2 or H % 2:
        vf = "pad=ceil(iw/2)*2:ceil(ih/2)*2:0:0:black," + vf
    vf += ",format=yuv420p"
    ain, aout = _audio_args(audio, dur, 1, audio_offset)
    cmd = [ff["path"], "-hide_banner", "-loglevel", "error", "-y",
           "-f", "image2pipe", "-framerate", str(fps), "-c:v", "png", "-i", "-"] + ain + ["-map", "0:v:0"] + aout
    cmd += ["-vf", vf] + vargs + [
        "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
        "-color_range", "tv", "-r", str(fps), "-frames:v", str(n), "-movflags", "+faststart", "-f", "mp4"]
    tmp_out = out_path.with_name(out_path.stem + f".partial-{os.getpid()}.mp4")
    cmd.append(str(tmp_out))
    prog = Progress(n, progress_label, step=0.1) if progress_label else None
    _run_ffmpeg_to(cmd, tmp_out, out_path, feed=frame_paths, progress=prog)
    return enc


def concat_segments(ff, seg_paths, out_path: Path, n_frames, fps, audio=None):
    """Join per-beat H.264 segments without re-encoding, adding audio if given."""
    dur = n_frames / fps
    fd, list_path = tempfile.mkstemp(suffix=".txt", prefix="ngm-concat-")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            for p in seg_paths:
                fh.write("file '" + Path(p).resolve().as_posix().replace("'", "'\\''") + "'\n")
        ain, aout = _audio_args(audio, dur, 1)
        cmd = [ff["path"], "-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0",
               "-i", list_path] + ain + ["-map", "0:v:0"] + aout + [
               "-c:v", "copy", "-movflags", "+faststart", "-f", "mp4"]
        tmp_out = out_path.with_name(out_path.stem + f".partial-{os.getpid()}.mp4")
        cmd.append(str(tmp_out))
        _run_ffmpeg_to(cmd, tmp_out, out_path)
    finally:
        try:
            os.unlink(list_path)
        except OSError:
            pass


class SegmentEncoder:
    """Encodes one H.264 segment per beat as soon as that beat's frames are all cached (overlapping
    with the rendering of later beats). Segments are cached next to the frames, so a refinement
    that changes one beat re-encodes only that beat; the film is then joined without re-encoding."""

    def __init__(self, ff, fps, W, H, crf, preset, beat_dirs, frames_of, labels, concurrency=2):
        self.ff, self.fps, self.W, self.H, self.crf, self.preset = ff, fps, W, H, crf, preset
        self.frames_of = frames_of
        self.labels = labels
        self.enc, vargs = encoder_args(ff, crf, preset, W, H, fps)
        self.paths = []
        for d in beat_dirs:
            k = hashlib.sha1(json.dumps([d.name, ff.get("version"), vargs, fps, W, H]).encode()).hexdigest()[:12]
            self.paths.append(d / f"seg-{k}.mp4")
        self.sem = asyncio.Semaphore(concurrency)
        self.tasks = {}
        self.encoded = 0
        self.seconds = 0.0

    def ready(self, i):
        p = self.paths[i]
        return p.is_file() and p.stat().st_size > 0

    def submit(self, i):
        if i in self.tasks or self.ready(i):
            return
        self.tasks[i] = asyncio.ensure_future(self._run(i))

    async def _run(self, i):
        async with self.sem:
            t = time.time()
            frames = self.frames_of(i)
            await asyncio.to_thread(ffmpeg_encode, self.ff, frames, self.paths[i], self.fps, self.W, self.H,
                                    self.crf, self.preset, None, 0.0, None)
            dt = time.time() - t
            self.encoded += 1
            self.seconds += dt
            log(f"[encode] beat {i + 1} {self.labels[i]}: {len(frames)} frames -> segment in {dt:.1f}s")

    async def finish(self, n_beats):
        for i in range(n_beats):
            self.submit(i)
        if self.tasks:
            results = await asyncio.gather(*self.tasks.values(), return_exceptions=True)
            for r in results:
                if isinstance(r, BaseException):
                    raise r if isinstance(r, RenderError) else RenderError(f"segment encode failed: {r}")

    def discard(self):
        for p in self.paths:
            try:
                p.unlink()
            except OSError:
                pass


# --------------------------------------------------------------------------- main flow

async def run(args, html_path: Path, t_start: float):
    html_text = html_path.read_text(encoding="utf-8", errors="replace")
    engine_fp = engine_fingerprint(html_text)
    cache_root = Path(args.cache).expanduser().resolve() if args.cache else _env.user_cache_dir()
    frames_root = cache_root / "frames"
    try:
        frames_root.mkdir(parents=True, exist_ok=True)
        probe_file = frames_root / f".write-test-{os.getpid()}"
        probe_file.write_bytes(b"ok")
        probe_file.unlink()
    except OSError as e:
        if args.cache:
            raise RenderError(f"cannot write to the cache folder {frames_root}: {e}", EXIT_USAGE)
        cache_root = Path(tempfile.gettempdir()) / "neon-glass-motion-cache"
        frames_root = cache_root / "frames"
        frames_root.mkdir(parents=True, exist_ok=True)
        log(f"note: the per-user cache folder is not writable ({e}); using {cache_root}")

    want_stills = args.stills is not None
    want_at = bool(args.at)
    want_mp4 = not args.no_mp4 and (args.out is not None or not (want_stills or want_at))

    try:
        from playwright.async_api import async_playwright  # noqa: WPS433
    except ImportError:
        raise RenderError(_env.browser_help_text(playwright_missing=True), EXIT_NO_BROWSER)

    sess = Session(args, html_path, cache_root)
    async with async_playwright() as p:
        # The browser is checked first: without one nothing can be rendered (exit 3, deliver the HTML);
        # a missing ffmpeg only rules out the MP4 (exit 4).
        sess.browser, desc = await start_browser(p)
        log(f"browser: {desc}")
        ff = None
        if want_mp4:
            ff = _env.find_ffmpeg()
            if not ff:
                try:
                    await sess.browser.close()
                except Exception:
                    pass
                raise RenderError(
                    "no ffmpeg with an H.264 encoder was found, so the MP4 cannot be encoded.\n"
                    f"  Fix: {Path(sys.executable).name} -m pip install imageio-ffmpeg   (or install ffmpeg on PATH)\n"
                    "  Stills still work: run with --stills DIR (and no --out). The .html film is complete on its own.",
                    EXIT_NO_FFMPEG)
        try:
            return await _run_with_browser(args, sess, html_path, html_text, engine_fp, frames_root,
                                           cache_root, want_stills, want_at, want_mp4, ff, t_start)
        finally:
            try:
                await sess.browser.close()
            except Exception:
                pass


async def _run_with_browser(args, sess, html_path, html_text, engine_fp, frames_root, cache_root,
                            want_stills, want_at, want_mp4, ff, t_start):
    probe = await sess.open_page(guess_size(html_text))
    info = await probe.evaluate(INFO_JS)
    sess.info = info
    fps = int(info["fps"])
    N = int(info["frames"])
    W, H = int(info["size"]["w"]), int(info["size"]["h"])
    sess.W, sess.H = W, H
    if (W, H) != tuple(guess_size(html_text)):
        await probe.set_viewport_size({"width": W, "height": H})
    if N <= 0:
        raise RenderError("the film has no frames (NGM.frameCount() is 0)")
    if info.get("canvas") and tuple(info["canvas"]) != (W, H):
        raise RenderError(f"canvas is {info['canvas'][0]}x{info['canvas'][1]} but NGM.size() is {W}x{H}")
    film = info.get("film") or {}
    tl = sorted(info["timeline"], key=lambda b: b["startFrame"])
    if not tl or tl[0]["startFrame"] != 0 or tl[-1]["endFrame"] != N or any(
            a["endFrame"] != b["startFrame"] for a, b in zip(tl, tl[1:])):
        raise RenderError("NGM.timeline() is not a contiguous cover of all frames")
    fams = sorted({f.split("|")[0].strip("'\"") for f in (info.get("fonts") or [])})
    if fams:
        log(f"fonts: {', '.join(fams)}")
    else:
        why = f" ({sess.router.dead})" if sess.router.dead else ""
        log(f"fonts: web fonts unavailable{why}; system fallback fonts are used")

    # ---- per-beat cache keys
    globals_ = {k: film.get(k) for k in ("ratio", "fps", "brand", "look", "fonts")}
    beats_json = film.get("beats") or []
    # web fonts either work (every beat gets the right face for its own text) or fall back;
    # only that switch, not the list of loaded subsets, may change a beat's pixels
    fonts_state = "web" if fams else "fallback"
    beat_dirs = []
    for b in tl:
        idx = int(b.get("index", tl.index(b)))
        beat_key = beats_json[idx] if 0 <= idx < len(beats_json) else None
        if isinstance(beat_key, dict):  # "note" is for humans and never drawn: editing it must not re-render
            beat_key = {k: v for k, v in beat_key.items() if k != "note"}
        payload = {
            "engine": engine_fp, "hash": b.get("hash"), "index": idx, "count": len(tl),
            "frames": b["endFrame"] - b["startFrame"], "fps": fps, "size": [W, H],
            "beat": beat_key,
            "film": globals_, "fonts": fonts_state, "ver": info.get("version"),
        }
        key = hashlib.sha1(json.dumps(payload, sort_keys=True, ensure_ascii=False).encode("utf-8")).hexdigest()
        d = frames_root / f"{safe_name(b.get('id') or 'beat')}-{key[:16]}"
        beat_dirs.append(d)
    starts = [b["startFrame"] for b in tl]

    def locate(g):
        i = bisect.bisect_right(starts, g) - 1
        return i, g - tl[i]["startFrame"]

    def frame_path(g):
        i, lf = locate(g)
        return beat_dirs[i] / f"f{lf:05d}.png"

    if args.fresh:
        for d in beat_dirs:
            shutil.rmtree(d, ignore_errors=True)

    # ---- which frames are needed
    f0, f1 = 0, N
    if args.from_ is not None:
        f0 = max(0, min(N - 1, int(math.floor(args.from_ * fps + 1e-6))))
    if args.to is not None:
        f1 = max(1, min(N, int(math.ceil(args.to * fps - 1e-6))))
    if f1 <= f0:
        raise RenderError(f"--from/--to select no frames (film is {N / fps:.2f}s)", EXIT_USAGE)
    needed = set()
    if want_mp4 or not (want_stills or want_at):
        needed.update(range(f0, f1))
    still_frames = []
    if want_stills:
        for i, b in enumerate(tl):
            n = b["endFrame"] - b["startFrame"]
            still_frames.append((i, b["startFrame"] + min(n - 1, int(math.floor(0.6 * n)))))
        needed.update(g for _, g in still_frames)
    at_frames = []
    for t in args.at or []:
        g = int(math.floor(t * fps + 1e-6))
        if not 0 <= g < N:
            log(f"warning: --at {t}s is outside the film (0-{N / fps:.2f}s); clamped")
            g = max(0, min(N - 1, g))
        at_frames.append((t, g))
        needed.add(g)

    for d in beat_dirs:
        d.mkdir(parents=True, exist_ok=True)
        try:
            os.utime(d, None)
        except OSError:
            pass
    todo = sorted(g for g in needed if not (frame_path(g).is_file() and frame_path(g).stat().st_size > 0))

    # ---- beat table
    log(f"film: {film.get('title') or html_path.stem} | {W}x{H} @ {fps} fps | {N} frames | {N / fps:.2f}s | "
        f"{len(tl)} beats | engine {info.get('version') or '?'}")
    need_by_beat = {}
    for g in needed:
        need_by_beat.setdefault(locate(g)[0], [0, 0])[0] += 1
    for g in todo:
        need_by_beat[locate(g)[0]][1] += 1
    for i, b in enumerate(tl):
        nb = b["endFrame"] - b["startFrame"]
        need, rend = need_by_beat.get(i, [0, 0])
        if need == 0:
            state = "not needed"
        elif rend == 0:
            state = f"cached ({need} frame{'s' if need != 1 else ''})"
        elif rend == need:
            state = f"render {rend} frame{'s' if rend != 1 else ''}"
        else:
            state = f"render {rend} of {need} frames (rest cached)"
        log(f"  {i + 1:>2} {str(b.get('id')):<10} {str(b.get('shot')):<8} {b['t0']:6.2f}-{b['t1']:6.2f}s "
            f"{nb:>4}f  {state}")
    log(f"cache: {frames_root}")

    # ---- disk space: make room in the cache first, refuse early rather than fail half way
    if todo:
        sizes = [p.stat().st_size for d in beat_dirs if d.is_dir() for p in list(d.glob("f*.png"))[:20]]
        per_frame = (sum(sizes) / len(sizes)) if sizes else W * H * 0.35
        need_bytes = int(per_frame * len(todo) * 1.15)
        cap = int(args.cache_max_gb * 1024 ** 3)
        prune_cache(frames_root, {d.name for d in beat_dirs}, max(0, cap - need_bytes))
        try:
            free = shutil.disk_usage(frames_root).free
        except OSError:
            free = None
        if free is not None and free < need_bytes + 100 * 1024 ** 2:
            raise RenderError(f"not enough disk space for the frame cache: about {_env.human_bytes(need_bytes)} "
                              f"needed, {_env.human_bytes(free)} free at {frames_root}. Free some space or pass "
                              "--cache DIR on a bigger disk.")

    # ---- MP4 plan: a full film is encoded as one segment per beat (each starts as soon as its
    # beat's frames are cached, overlapping with rendering); a --from/--to range in one pass
    seg_mode = want_mp4 and (f0, f1) == (0, N)
    segenc = None
    on_done = None
    if seg_mode:
        segenc = SegmentEncoder(
            ff, fps, W, H, args.crf, args.preset, beat_dirs,
            lambda i: [beat_dirs[i] / f"f{lf:05d}.png" for lf in range(tl[i]["endFrame"] - tl[i]["startFrame"])],
            [f"{b.get('id')} ({b.get('shot')})" for b in tl])
        remaining = [0] * len(tl)
        for g in todo:
            remaining[locate(g)[0]] += 1
        for i in range(len(tl)):
            if remaining[i] == 0:
                segenc.submit(i)

        def on_done(g):
            i = locate(g)[0]
            remaining[i] -= 1
            if remaining[i] == 0:
                segenc.submit(i)

    # ---- render
    stopped = False
    if todo:
        nworkers = max(1, min(args.workers, len(todo) // 12 + 1))
        pages = [probe]
        if nworkers > 1:
            pages += await asyncio.gather(*(sess.open_page((W, H)) for _ in range(nworkers - 1)))
        log(f"rendering {len(todo)} frames with {len(pages)} worker{'s' if len(pages) > 1 else ''} "
            f"({len(needed) - len(todo)} cached)")
        prog = Progress(len(todo), "render")
        deadline = (t_start + args.budget) if args.budget else None
        done, stopped = await render_frames(sess, pages, [(g, frame_path(g)) for g in todo], deadline, prog,
                                            on_done)
        el = time.time() - prog.t0
        log(f"rendered {done} frames in {_env.fmt_time(el)} ({done / el if el else 0:.1f} fps)")
    else:
        log(f"all {len(needed)} needed frames are cached; nothing to render")

    # engine errors: attribute to beats and remember them next to the cached frames, so a later
    # run that takes those frames from the cache still reports them
    for msg in list(sess.errors):
        m = re.search(r"\bbeat (\d+)\b", msg)
        if m and 0 < int(m.group(1)) <= len(beat_dirs):
            ef = beat_dirs[int(m.group(1)) - 1] / "errors.txt"
            old_lines = ef.read_text(encoding="utf-8").splitlines() if ef.is_file() else []
            if msg not in old_lines:
                with open(ef, "a", encoding="utf-8") as fh:
                    fh.write(msg + "\n")
    for i in sorted({locate(g)[0] for g in needed}):
        ef = beat_dirs[i] / "errors.txt"
        if ef.is_file():
            for line in ef.read_text(encoding="utf-8").splitlines():
                if line.strip() and line not in sess.errors:
                    sess.errors[line] = 1
    if sess.errors:
        log(f"\nENGINE ERRORS reported by the page ({len(sess.errors)} distinct):")
        for msg, cnt in list(sess.errors.items())[:10]:
            log(f"  {msg[:300]}" + (f"  (x{cnt})" if cnt > 1 else ""))
        log("  (stills show the failing beat with red error text)\n")

    if stopped:
        if segenc and segenc.tasks:  # let segments of finished beats complete; they are reused next run
            await asyncio.gather(*segenc.tasks.values(), return_exceptions=True)
        left = sum(1 for g in needed if not frame_path(g).is_file())
        log(f"\nSTOPPED at the --budget of {args.budget:.0f}s: {len(needed) - left}/{len(needed)} frames are cached.")
        log("Run the same command again to continue where it stopped.")
        return EXIT_BUDGET

    # ---- stills
    results = {}
    manifest = info.get("manifest") or {}
    if want_stills or want_at:
        sdir = Path(args.stills).expanduser().resolve() if want_stills else (
            html_path.parent / f"{html_path.stem}-stills")
        sdir.mkdir(parents=True, exist_ok=True)
        sheet_items = []
        written = []
        for i, g in still_frames:
            b = tl[i]
            dst = sdir / f"{i + 1:02d}-{safe_name(b.get('id'))}.png"
            shutil.copyfile(frame_path(g), dst)
            written.append(dst)
            beat = beats_json[b.get("index", i)] if b.get("index", i) < len(beats_json) else {}
            text = describe(beat, manifest, film)
            sheet_items.append((dst, f"{i + 1:02d}  {b.get('id')}  ·  {b.get('shot')}",
                                f"{b['t0']:.2f}-{b['t1']:.2f}s  ·  still at {g / fps:.2f}s", text))
        for t, g in at_frames:
            dst = sdir / f"at-{g / fps:.2f}s.png"
            shutil.copyfile(frame_path(g), dst)
            written.append(dst)
        if want_stills and sheet_items:
            sheet = sdir / "contact.png"
            meta = (f"{film.get('ratio', '')}  {W}x{H}  ·  {N / fps:.2f}s  ·  {N} frames @ {fps} fps  ·  "
                    f"{len(tl)} beats  ·  stills at 60% of each beat")
            try:
                await contact_sheet(sess, sheet_items, sheet, film.get("title") or html_path.stem, meta)
            except Exception as e:  # noqa: BLE001
                ffx = _env.find_ffmpeg()
                if ffx:
                    log(f"note: labelled contact sheet failed ({str(e)[:120]}); using ffmpeg tiles")
                    contact_sheet_ffmpeg(ffx["path"], sheet_items, sheet, W, H)
                else:
                    log(f"warning: contact sheet failed: {str(e)[:200]}")
                    sheet = None
            results["contact"] = sheet
        results["stills"] = written
        results["stills_dir"] = sdir

    await sess.browser.close()

    # ---- encode
    if want_mp4:
        frames = [frame_path(g) for g in range(f0, f1)]
        missing = [p for p in frames if not p.is_file()]
        if missing:
            raise RenderError(f"{len(missing)} frames are missing from the cache after rendering")
        if args.out:
            out = Path(args.out).expanduser().resolve()
        elif (f0, f1) != (0, N):
            out = html_path.with_name(f"{html_path.stem}_{f0 / fps:.2f}-{f1 / fps:.2f}s.mp4")
        else:
            out = html_path.with_suffix(".mp4")
        out.parent.mkdir(parents=True, exist_ok=True)
        audio = None
        if args.audio and args.audio.lower() != "none":
            audio = Path(args.audio).expanduser().resolve()
        elif args.audio is None and film.get("audio"):
            a = str(film["audio"])
            ap = Path(a) if os.path.isabs(a) else (html_path.parent / a)
            audio = ap.resolve()
        if audio and not audio.is_file():
            if args.audio:
                raise RenderError(f"audio file not found: {audio}", EXIT_USAGE)
            log(f"warning: film audio not found ({audio}); the MP4 will be silent")
            audio = None
        aud_note = f" + audio {audio.name}" if audio else ""
        t_enc = time.time()
        enc_note = "single pass"
        if seg_mode:
            try:
                await segenc.finish(len(tl))
                log(f"joining {len(tl)} beat segments -> {out.name}{aud_note}")
                concat_segments(ff, segenc.paths, out, N, fps, audio)
                got, derr = _env.count_decoded_frames(ff["path"], out)
                if got != N or derr:
                    raise RenderError(f"{got} frames, expected {N}" + (f"; {derr[:200]}" if derr else ""))
                enc = segenc.enc
                enc_note = (f"{segenc.encoded} of {len(tl)} beat segments encoded"
                            + (f", {len(tl) - segenc.encoded} reused" if segenc.encoded < len(tl) else ""))
            except RenderError as e:
                log(f"warning: joining beat segments failed ({str(e).strip()[:240]}); "
                    "re-encoding the film in one pass")
                segenc.discard()
                seg_mode = False
        if not seg_mode:
            log(f"encoding {len(frames)} frames -> {out.name} with {ff['source']} ffmpeg{aud_note}")
            enc = ffmpeg_encode(ff, frames, out, fps, W, H, args.crf, args.preset, audio, f0 / fps)
            got, derr = _env.count_decoded_frames(ff["path"], out)
        enc_time = time.time() - t_enc
        pr = _env.ffprobe_like(ff["path"], out)
        results.update({"mp4": out, "frames": got, "expected": len(frames), "probe": pr,
                        "encoder": enc, "enc_time": enc_time, "decode_err": derr, "enc_note": enc_note})

    # ---- prune + summary
    freed = prune_cache(frames_root, {d.name for d in beat_dirs}, int(args.cache_max_gb * 1024 ** 3))
    log("")
    log("DONE")
    rc = EXIT_OK
    if "mp4" in results:
        pr = results["probe"]
        size = results["mp4"].stat().st_size
        ok = results["frames"] == results["expected"] and not results["decode_err"]
        log(f"  MP4     {results['mp4']}")
        log(f"          {pr.get('duration', 0):.2f}s | {results['frames']} frames (expected {results['expected']}) | "
            f"{pr.get('w')}x{pr.get('h')} | {pr.get('fps')} fps | {pr.get('vcodec')} {pr.get('profile') or ''} "
            f"{pr.get('pix_fmt') or ''} | audio: {pr.get('acodec') or 'none'} | {_env.human_bytes(size)} | "
            f"{results['encoder']}")
        log(f"          encode: {results['enc_note']}; {_env.fmt_time(results['enc_time'])} after rendering")
        if ok:
            log("          verified: decodes cleanly, exact frame count")
        else:
            log(f"  ERROR   output check failed: frames {results['frames']} vs {results['expected']}; "
                f"{results['decode_err'][:300] if results['decode_err'] else ''}")
            rc = EXIT_ENGINE
    if results.get("stills") is not None:
        log(f"  STILLS  {results['stills_dir']}  ({len(results['stills'])} PNG)")
        if results.get("contact"):
            log(f"  SHEET   {results['contact']}")
    if not want_mp4 and not (want_stills or want_at):
        log(f"  frames cached in {frames_root} (no MP4 requested)")
    if sess.errors:
        log("  ERROR   the engine reported errors while drawing (listed above); the output contains error")
        log("          frames. Fix the film or the shot, then render again (unchanged beats come from cache).")
        rc = rc or EXIT_ENGINE
    log(f"  total   {_env.fmt_time(time.time() - t_start)}" + (f" | pruned {_env.human_bytes(freed)} of old cache"
                                                                 if freed else ""))
    return rc


def describe(beat, manifest, film):
    try:
        import validate as V
        spec = (manifest.get("shots") or {}).get(beat.get("shot")) if isinstance(beat, dict) else None
        return V.describe_beat(beat, spec, film) if isinstance(beat, dict) else ""
    except Exception:  # noqa: BLE001
        return str(beat.get("text", "")) if isinstance(beat, dict) else ""


def main(argv=None):
    _env.setup_stdio()
    ap = argparse.ArgumentParser(
        description="Render a neon-glass-motion HTML film to stills and/or an H.264 MP4.",
        epilog="With --stills or --at alone, no MP4 is made; add --out to get both.")
    ap.add_argument("html", help="the built film .html (a film.json is built first)")
    ap.add_argument("--out", help="output .mp4 (default: next to the HTML)")
    ap.add_argument("--stills", metavar="DIR", help="write one PNG per beat (at 60%% of the beat) + contact.png")
    ap.add_argument("--at", metavar="T[,T...]", help="also write stills at these times (seconds)")
    ap.add_argument("--workers", type=int, default=0, help="parallel browser pages (default: min(4, CPUs))")
    ap.add_argument("--cache", metavar="DIR", help="frame cache folder (default: per-user cache, or $NGM_CACHE_DIR)")
    ap.add_argument("--audio", help="music file to mux (fades out over the last second); 'none' = silent")
    ap.add_argument("--crf", type=int, default=18, help="H.264 quality, lower = better (default 18)")
    ap.add_argument("--preset", default="medium", help="x264 preset (default medium)")
    ap.add_argument("--from", dest="from_", metavar="T", help="start time in seconds (MP4 of a range)")
    ap.add_argument("--to", metavar="T", help="end time in seconds")
    ap.add_argument("--no-mp4", action="store_true", help="do not encode an MP4")
    ap.add_argument("--budget", type=float, metavar="SEC",
                    help="stop rendering after SEC seconds (exit 5); run again to resume from the cache")
    ap.add_argument("--fresh", action="store_true", help="ignore cached frames for this film and render again")
    ap.add_argument("--cache-max-gb", type=float, default=4.0,
                    help="prune least-recently-used cached beats above this size (default 4)")
    a = ap.parse_args(argv)

    html_path = Path(a.html).expanduser().resolve()
    if not html_path.is_file():
        log(f"ERROR   file not found: {html_path}")
        return EXIT_USAGE
    if html_path.suffix.lower() == ".json":  # convenience: build the film first
        import build as B
        log(f"building {html_path.name} first...")
        rc = B.build(html_path, quiet=True)
        if rc != 0:
            return rc
        html_path = B.default_out(html_path)
        log("")
    try:
        a.at = parse_times(a.at) if a.at else []
        a.from_ = parse_time(a.from_) if a.from_ is not None else None
        a.to = parse_time(a.to) if a.to is not None else None
    except ValueError as e:
        log(f"ERROR   bad time value: {e}")
        return EXIT_USAGE
    if a.workers <= 0:
        a.workers = max(1, min(4, os.cpu_count() or 1))
    t_start = time.time()
    try:
        return asyncio.run(run(a, html_path, t_start))
    except RenderError as e:
        if e.code == EXIT_NO_BROWSER:
            log("NO BROWSER: MP4 and stills need a Chromium that Playwright can launch.\n")
        log(f"ERROR   {e}" if e.code != EXIT_NO_BROWSER else str(e))
        return e.code
    except KeyboardInterrupt:
        log("\nInterrupted. Finished frames are cached; run the same command again to resume.")
        return 130


if __name__ == "__main__":
    sys.exit(main())
