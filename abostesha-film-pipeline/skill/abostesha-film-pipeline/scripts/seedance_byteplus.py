#!/usr/bin/env python3
"""seedance_byteplus.py - Seedance 2.5 on BytePlus ModelArk, stdlib only.

NOT USED (decision 2026-11-01): every Seedance job runs in Higgsfield (05). Kept only in case
AboStesha later chooses the BytePlus API; never run it without their explicit decision to switch route.

draft  -> create a 480p Draft task (draft=true) with prompt + role-tagged references
          (--direct-1080p: edit/extend only, when 05-T9 shows those cannot be drafted)
final  -> create the 1080p final from an approved Draft task ID (content type draft_task)
poll   -> poll a task; on success download video (+ last frame) at once, hash, log a ledger row
review -> write the user's verdict into the review cells of one ledger row (APPROVED needs the user's own words)
list   -> list recent tasks (recovery when an ID was lost; 1 QPS limit)
cancel -> cancel a task that is still QUEUED (refuses any other status)

API key: environment variable ARK_API_KEY (never printed, never written to disk).
Every request is validated locally first; --dry-run prints the request and a cost estimate only.

Verified 2026-10-30 against the BytePlus ModelArk docs (Markdown versions):
  create-video-generation-task-api.md, get-video-generation-task-api.md,
  list-video-generation-tasks-api.md, cancel-or-delete-video-generation-tasks-api.md,
  seedance-2-5.md (Draft mode, limits, retention, rate limits), model-pricing.md, error-codes.md
Anything marked UNVERIFIED below is documented ambiguously or not yet exercised on a live key.
Module: references/05-seedance-production.md. Ledger schema: references/ledger-continuity-physics.md L.2.
"""
import argparse, base64, csv, datetime as dt, hashlib, http.client, json, os, re, shutil, struct, subprocess, sys, time
import urllib.error, urllib.parse, urllib.request, wave

NET_ERRORS = (urllib.error.URLError, TimeoutError, ConnectionError, http.client.HTTPException)  # read timeouts are not URLErrors

API_BASE = os.environ.get("SEEDANCE_API_BASE", "https://ark.ap-southeast.bytepluses.com/api/v3")  # AP region only serves video


def _check_api_base(base):
    """The bearer key goes only to BytePlus over HTTPS, or to a local mock server (tests)."""
    u = urllib.parse.urlparse(base)
    host = (u.hostname or "").lower()
    if host in ("127.0.0.1", "localhost", "::1"):
        return
    if u.scheme != "https" or not (host == "bytepluses.com" or host.endswith(".bytepluses.com")):
        sys.exit(f"ERROR: SEEDANCE_API_BASE={base!r} is not a BytePlus HTTPS endpoint or localhost; "
                 "refusing to send ARK_API_KEY there")


_check_api_base(API_BASE)
MODEL_ID = "dreamina-seedance-2-5-260628"   # Dreamina Seedance 2.5 (model list, 2026-10-30)
ROUTE = "BytePlus-ModelArk-API"
TOOL = "ByteDance Dreamina Seedance 2.5"
# USD per 1M tokens, online inference, 2026-10-30 (model-pricing.md). Draft = normal 480p price.
RATE = {("low", False): 10.70, ("high", False): 11.70, ("low", True): 6.40, ("high", True): 7.00}
PIXELS = {"480p": {"16:9": (854, 480), "4:3": (752, 560), "1:1": (640, 640), "3:4": (560, 752), "9:16": (480, 854), "21:9": (992, 432)},
          "1080p": {"16:9": (1920, 1080), "4:3": (1664, 1248), "1:1": (1440, 1440), "3:4": (1248, 1664), "9:16": (1080, 1920), "21:9": (2206, 946)}}
DRAFT_14D_FROM = dt.datetime(2026, 10, 28, 2, 0, tzinfo=dt.timezone.utc)  # 10:00 UTC+8: drafts after this live 14 d, else 7 d
LEDGER_HEADER = ("gen_id,film,step,kind,shot_id,asset_id,line_or_cue_id,purpose,tool,model_id,model_snapshot,mode,route,account,"
                 "plan_tier,params,prompt_file,prompt_sha256,prompt_origin,references,parent_gen_id,task_id,draft_task_id,seed_returned,"
                 "submitted_utc,completed_utc,downloaded_utc,url_expires_utc,draft_expires_utc,file_name,file_sha256,tech,c2pa_status,"
                 "watermark,cost,outcome,review_status,approved_by,approved_utc,approval_words,human_contribution,post_edits,"
                 "synthetic_or_real,consent_ref,licence_ref,in_final,origin_class,seconds_in_final,share_of_film_pct,notes").split(",")
IMG_FMT = {".png": "png", ".jpg": "jpeg", ".jpeg": "jpeg", ".webp": "webp", ".bmp": "bmp", ".tif": "tiff", ".tiff": "tiff",
           ".gif": "gif", ".heic": "heic", ".heif": "heif"}
PARAM_WORDS = re.compile(r"\b(16:9|21:9|9:16|4:3|3:4|1080p|720p|480p|4k|\d+\s?fps|aspect ratio|\d+[- ]second(s)? (video|clip|long))\b", re.I)


class ApiError(Exception):
    def __init__(self, status, code, message, raw):
        super().__init__(f"HTTP {status} {code}: {message}")
        self.status, self.code, self.message, self.raw = status, code, message, raw


def die(msg):
    sys.exit("ERROR: " + msg)


def now():
    return dt.datetime.now(dt.timezone.utc)


def iso(t):
    return t.astimezone(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ") if t else "not_provided"


def key():
    k = os.environ.get("ARK_API_KEY", "").strip()
    if not k:
        die("set ARK_API_KEY in the environment (never paste it into a prompt, file or ledger)")
    return k


def api(method, path, body=None, query=None, post_retries=3):
    url = API_BASE.rstrip("/") + path + ("?" + urllib.parse.urlencode(query, doseq=True) if query else "")
    data = json.dumps(body).encode("utf-8") if body is not None else None
    attempt = 0
    while True:
        attempt += 1
        req = urllib.request.Request(url, data=data, method=method,
                                     headers={"Authorization": "Bearer " + key(), "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                txt = r.read().decode("utf-8")
                return json.loads(txt) if txt.strip() else {}
        except urllib.error.HTTPError as e:
            raw = e.read().decode("utf-8", "replace")
            try:
                err = json.loads(raw).get("error") or {}
            except ValueError:
                err = {}
            ae = ApiError(e.code, err.get("code", "unknown"), err.get("message", raw[:300]), raw)
            # 429 = rejected, no task created -> safe to wait and retry. Never retry a POST on 5xx (a task may exist).
            retry = e.code == 429 or (method == "GET" and e.code >= 500)
            if retry and attempt <= (post_retries if method == "POST" else 5):
                wait = 30 if e.code == 429 else 5 * attempt
                print(f"  {ae} -> retry {attempt} in {wait}s", file=sys.stderr)
                time.sleep(wait)
                continue
            raise ae
        except NET_ERRORS as e:
            if method == "GET" and attempt <= 5:
                time.sleep(5 * attempt)
                continue
            if method == "POST":
                die(f"network error after sending ({e}). A task MAY exist. Do NOT resubmit: run "
                    f"`list --status queued` and `list --status running` first.")
            raise


# ---------- local checks on references ----------
def image_dims(path):
    """(w, h, jpeg_sampling or None) for PNG/JPEG; (None, None, None) for other formats."""
    with open(path, "rb") as f:
        head = f.read(32)
        if head[:8] == b"\x89PNG\r\n\x1a\n":
            w, h = struct.unpack(">II", head[16:24])
            return w, h, None
        if head[:2] != b"\xff\xd8":
            return None, None, None
        f.seek(2)
        while True:
            b = f.read(1)
            while b and b != b"\xff":
                b = f.read(1)
            while b == b"\xff":
                b = f.read(1)
            if not b:
                return None, None, None
            m = b[0]
            if m in (0xD8, 0x01) or 0xD0 <= m <= 0xD7:
                continue
            seglen = struct.unpack(">H", f.read(2))[0]
            if m in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                seg = f.read(seglen - 2)
                h, w, n = struct.unpack(">HHB", seg[1:6])
                samp = tuple(((seg[6 + 3 * i + 1] >> 4), (seg[6 + 3 * i + 1] & 15)) for i in range(n))
                return w, h, samp
            f.seek(seglen - 2, 1)


def standard_chroma(samp):
    """4:2:0, 4:2:2 or 4:4:4 (prompt-guide FAQ). Compares luma/chroma ratios, so (2,2)(2,2)(2,2) is 4:4:4."""
    (yh, yv), (cbh, cbv), cr = samp
    if (cbh, cbv) != cr or not cbh or not cbv or yh % cbh or yv % cbv:
        return False
    return (yh // cbh, yv // cbv) in {(2, 2), (2, 1), (1, 1)}


def resolve_image(val, warn):
    if re.match(r"^(https?://|asset://|data:image/)", val):
        return val
    if not os.path.isfile(val):
        die(f"image not found: {val}")
    ext = os.path.splitext(val)[1].lower()
    if ext not in IMG_FMT:
        die(f"image format not accepted by Seedance 2.5: {val}")
    size = os.path.getsize(val)
    if size >= 30 * 1024 * 1024:
        die(f"image must be < 30 MB: {val}")
    if size > 8 * 1024 * 1024:
        warn.append(f"{os.path.basename(val)} is {size/1e6:.1f} MB as Base64; docs say do not inline large files - host it (TOS presigned URL)")
    w, h, samp = image_dims(val)
    if w:
        if not (300 <= w <= 6000 and 300 <= h <= 6000 and 0.4 <= w / h <= 2.5):
            die(f"{val}: {w}x{h} outside 300-6000 px per side or aspect 0.4-2.5")
        if max(w, h) > 1920:
            warn.append(f"{os.path.basename(val)} is {w}x{h}: resize to <= output resolution (official fix for fingerprint-like textures)")
        if samp and len(samp) == 3 and not standard_chroma(samp):
            die(f"{val}: non-standard JPEG chroma subsampling {samp} -> HTTP 400. Fix: ffmpeg -i in.jpg -pix_fmt yuvj420p out.jpg")
    with open(val, "rb") as f:
        return f"data:image/{IMG_FMT[ext]};base64," + base64.b64encode(f.read()).decode()


def wav_seconds(path):
    try:
        with wave.open(path, "rb") as w:
            return w.getnframes() / float(w.getframerate())
    except (wave.Error, EOFError):
        return None


def resolve_audio(val, warn, secs):
    if re.match(r"^(https?://|asset://|data:audio/)", val):
        return val
    if not os.path.isfile(val):
        die(f"audio not found: {val}")
    ext = os.path.splitext(val)[1].lower()
    if ext not in (".wav", ".mp3"):
        die("reference audio must be wav or mp3")
    if os.path.getsize(val) > 15 * 1024 * 1024:
        die(f"audio must be <= 15 MB: {val}")
    s = wav_seconds(val) if ext == ".wav" else None
    if s is not None:
        if not 2.0 <= s <= 30.0:
            die(f"{val}: {s:.2f} s; each audio clip must be 2-30 s (pad short lines, 05 §5.1)")
        secs.append(s)
    else:
        warn.append(f"{os.path.basename(val)}: duration not measured (mp3 or non-PCM wav); confirm 2-30 s with ffprobe")
    warn.append("audio sent as Base64: documented as accepted by the API, but arkcli reports inline audio rejected "
                "(UNVERIFIED). If HTTP 400, host it on a TOS presigned URL")
    with open(val, "rb") as f:
        return f"data:audio/{ext[1:]};base64," + base64.b64encode(f.read()).decode()


def split_label(v):
    return v.split("::", 1) if "::" in v else (None, v)


def public_ref(v):
    """Ledger-safe form: no signature query strings, no Base64 payloads."""
    if v.startswith("data:"):
        return v.split(";", 1)[0] + ";base64(local file)"
    return v.split("?", 1)[0]


HANDLE = re.compile(r"@(Image|Video|Audio)(\s?)(\d+)")


def check_handles(prompt, counts, warn):
    """Every @handle must point at an uploaded asset of that type; every upload should be named (or listed as unused)."""
    used = {"Image": set(), "Video": set(), "Audio": set()}
    spaced = False
    for kind, sp, n in HANDLE.findall(prompt):
        used[kind].add(int(n))
        spaced = spaced or bool(sp)
    if spaced:
        warn.append("prompt uses spaced handles ('@Image 1'); 05 §5.2 writes '@Image1' - never mix the two forms")
    for kind, n in counts.items():
        over = sorted(i for i in used[kind] if i > n)
        if over:
            die(f"prompt names @{kind}{over[0]} but only {n} {kind.lower()} reference(s) are uploaded: renumber by upload order")
        unnamed = [i for i in range(1, n + 1) if i not in used[kind]]
        if unnamed and "Unused Assets" not in prompt:
            warn.append(f"uploaded @{kind}{unnamed[0]} is never named in the prompt: give it a role or list it under 【Unused Assets】")


# ---------- ledger ----------
def ledger_paths(ledger):
    base = os.path.dirname(os.path.abspath(ledger))
    return os.path.join(base, "raw"), os.path.join(base, "inflight")


def read_ledger(ledger):
    if not os.path.isfile(ledger):
        return []
    with open(ledger, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def next_gen_id(ledger):
    n = 0
    ids = [r.get("gen_id", "") for r in read_ledger(ledger)]
    infl = ledger_paths(ledger)[1]
    if os.path.isdir(infl):
        for fn in os.listdir(infl):
            if fn.endswith(".json"):
                with open(os.path.join(infl, fn), encoding="utf-8") as f:
                    ids.append(json.load(f).get("gen_id", ""))
    for g in ids:
        m = re.match(r"^G05-(\d{4,})$", g or "")
        if m:
            n = max(n, int(m.group(1)))
    return f"G05-{n + 1:04d}"


def append_ledger(ledger, row):
    os.makedirs(os.path.dirname(os.path.abspath(ledger)), exist_ok=True)
    new = not os.path.isfile(ledger) or os.path.getsize(ledger) == 0
    header = LEDGER_HEADER
    if not new:
        with open(ledger, encoding="utf-8", newline="") as f:
            header = next(csv.reader(f))
    full = {h: (str(row[h]) if row.get(h) not in (None, "") else "not_provided") for h in header}
    with open(ledger, "a", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=header, extrasaction="ignore")
        if new:
            w.writeheader()
        w.writerow(full)


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def ffprobe(path):
    if not shutil.which("ffprobe"):
        return "not_checked (ffprobe missing)"
    try:
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                              "stream=codec_type,codec_name,profile,width,height,r_frame_rate,pix_fmt,channels,sample_rate:format=duration",
                              "-of", "compact=p=0", path], capture_output=True, text=True, timeout=60).stdout
        return " | ".join(l.strip() for l in out.splitlines() if l.strip()) or "ffprobe: no output"
    except (OSError, subprocess.SubprocessError) as e:
        return f"ffprobe failed: {e}"


def download(url, path):
    """GET (never HEAD: the signature is bound to the method) into a new file; never overwrites."""
    if os.path.exists(path):
        stem, ext = os.path.splitext(path)
        i = 2
        while os.path.exists(f"{stem}_dl{i}{ext}"):
            i += 1
        path = f"{stem}_dl{i}{ext}"
        print(f"  WARNING: name taken; saved as {os.path.basename(path)} (do not rename logged files)", file=sys.stderr)
    tmp = path + ".part"
    for attempt in range(1, 6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, method="GET"), timeout=300) as r, open(tmp, "wb") as f:
                shutil.copyfileobj(r, f, 1 << 20)
            os.replace(tmp, path)
            return path
        except (OSError, http.client.HTTPException) as e:   # URLError and timeouts are OSErrors
            print(f"  download attempt {attempt} failed: {e}", file=sys.stderr)
            time.sleep(5 * attempt)
    die(f"download failed 5 times; the URL lives 24 h and allows 100 downloads. Retry: poll --task-id <id>")


def est_cost(res, ratio, out_s, in_video_s):
    w, h = PIXELS.get(res, {}).get(ratio, (0, 0))
    tok = (in_video_s + out_s) * w * h * 24 / 1024
    rate = RATE[("high" if res == "1080p" else "low", in_video_s > 0)]
    return tok, tok * rate / 1e6, rate


# ---------- commands ----------
def build_draft(a):
    warn, audio_secs = [], []
    if not re.match(r"^S\d{2}-SH\d{2}[A-Z]?$", a.shot):
        die("--shot must look like S03-SH02 (01's IDs, never renumbered)")
    with open(a.prompt_file, encoding="utf-8") as f:
        prompt = f.read().strip()
    if not prompt:
        die("empty prompt")
    if "asset://" in prompt:
        die("never name asset IDs in the prompt; refer to @ImageN by upload order")
    if "{{" in prompt or "}}" in prompt or "PREVIEW" in os.path.basename(a.prompt_file).upper():
        die("prompt still has {{slots}} or is a PREVIEW file (05 §5.1 entry step 4): fill every slot from the locked files first")
    if PARAM_WORDS.search(prompt):
        warn.append(f"prompt mentions a job parameter ('{PARAM_WORDS.search(prompt).group(0)}'): set it via the API, not in prose")
    words = len(prompt.split())
    if words > 1000:
        warn.append(f"prompt is {words} words; official recommendation is <= 1,000 English words")
    content, refs = [{"type": "text", "text": prompt}], []
    frames = [("first_frame", a.first_frame), ("last_frame", a.last_frame)]
    if any(v for _, v in frames) and (a.image or a.video or a.audio):
        die("first/last-frame mode cannot be mixed with reference images, videos or audio (official). "
            "Use --image plus 'Use @Image1 as the first frame.' in the prompt instead")
    if a.last_frame and not a.first_frame:
        die("--last-frame needs --first-frame")
    for role, v in frames:
        if v:
            lab, val = split_label(v)
            content.append({"type": "image_url", "image_url": {"url": resolve_image(val, warn)}, "role": role})
            refs.append(f"{role}={public_ref(val)}" + (f"({lab})" if lab else ""))
    for i, v in enumerate(a.image or [], 1):
        lab, val = split_label(v)
        content.append({"type": "image_url", "image_url": {"url": resolve_image(val, warn)}, "role": "reference_image"})
        refs.append(f"@Image{i}={public_ref(val)}" + (f"({lab})" if lab else ""))
    for i, v in enumerate(a.video or [], 1):
        lab, val = split_label(v)
        if not re.match(r"^(https?://|asset://)", val):
            die(f"video must be a URL or asset:// ID (no Base64, no local path): {val}. Host it as a TOS presigned GET URL (05 §5.1)")
        content.append({"type": "video_url", "video_url": {"url": val}, "role": "reference_video"})
        refs.append(f"@Video{i}={public_ref(val)}" + (f"({lab})" if lab else ""))
    for i, v in enumerate(a.audio or [], 1):
        lab, val = split_label(v)
        content.append({"type": "audio_url", "audio_url": {"url": resolve_audio(val, warn, audio_secs)}, "role": "reference_audio"})
        refs.append(f"@Audio{i}={public_ref(val)}" + (f"({lab})" if lab else ""))
    ni, nv, na = len(a.image or []), len(a.video or []), len(a.audio or [])
    if ni > 30 or nv > 10 or na > 10 or ni + nv + na > 50:
        die("limits: 30 images, 10 videos, 10 audio, 50 assets in total")
    check_handles(prompt, {"Image": ni, "Video": nv, "Audio": na}, warn)
    if a.first_frame and a.task_type:
        die("--task-type applies to omni-reference tasks only; first/last-frame mode takes no omni_reference_task_type")
    if sum(audio_secs) > 30:
        die(f"reference audio totals {sum(audio_secs):.1f} s; the cap is 30 s per request")
    if a.video_seconds > 30:
        die("reference videos total more than 30 s")
    if nv and a.video_seconds <= 0:
        warn.append("--video-seconds not given: cost estimate assumes the playblast lasts --duration seconds")
    vin = a.video_seconds if a.video_seconds > 0 else (float(a.duration) if nv else 0.0)
    tt = a.task_type
    if tt is None:
        tt = "reference" if (ni or nv or na) else None
    if tt in ("edit", "extend") and not nv:
        die(f"task type {tt} needs at least one reference video")
    ratio = a.ratio
    if a.first_frame or tt in ("edit", "extend"):
        if ratio != "adaptive":
            warn.append("first-frame, edit and extend tasks accept only ratio=adaptive: forced")
        ratio = "adaptive"
    if tt == "edit":
        a.duration = -1
    if not (a.duration == -1 or 4 <= a.duration <= 30):
        die("duration must be 4-30 s or -1")
    if a.duration == -1 and tt != "edit":
        die("set the exact shot length (04's G); -1 lets the model choose, and Auto was reported priced at the 30 s cap")
    direct = a.direct_1080p
    if direct and tt not in ("edit", "extend"):
        die("--direct-1080p is only for edit/extend tasks after 05-T9 showed they cannot be drafted (hard rule 2: draft first)")
    if tt in ("edit", "extend") and a.output_format != "mov":
        warn.append("edit/extend: the official guide recommends mov for both the source and the output")
    res = "1080p" if direct else "480p"
    body = {"model": MODEL_ID, "content": content, "resolution": res, "ratio": ratio,
            "duration": a.duration, "generate_audio": a.generate_audio == "true", "watermark": a.watermark == "true",
            "output_format": a.output_format, "priority": a.priority, "execution_expires_after": a.expires}
    if direct:
        body["return_last_frame"] = True
    else:
        body["draft"] = True
    if tt:
        body["omni_reference_task_type"] = tt
    if a.extra_body:
        body.update(json.loads(a.extra_body))
        warn.append("--extra-body merged into the request (forward-compat only; field UNVERIFIED by this script)")
    if len(json.dumps(body)) > 64 * 1024 * 1024:
        die("request body exceeds 64 MB: host large references as URLs")
    params = (f"draft={str(not direct).lower()};resolution={res};ratio={ratio};duration={a.duration};"
              f"generate_audio={a.generate_audio};watermark={a.watermark};output_format={a.output_format};"
              f"omni_reference_task_type={tt or 'n/a'};priority={a.priority};execution_expires_after={a.expires};"
              f"video_in_s={vin:g}")
    op = {"edit": "EDT", "extend": "EXT"}.get(tt, "FIN") if direct else "DRF"
    meta = {"kind": "final" if direct else "draft", "mode": tt if direct else "draft", "op": op, "e_index": a.e_index,
            "shot": a.shot, "version": a.version, "take": a.take, "f_index": 1,
            "purpose": a.purpose, "params": params, "prompt_file": a.prompt_file,
            "prompt_sha256": hashlib.sha256(prompt.encode("utf-8")).hexdigest(), "prompt_origin": a.prompt_origin,
            "references": ";".join(refs) or "none (text only)", "parent_gen_id": "n/a", "draft_task_id": None,
            "video_in_s": vin, "ratio": ratio, "duration": a.duration, "output_format": a.output_format,
            "watermark": a.watermark, "line_ids": a.line_ids, "human": a.human, "notes": a.notes, "film": a.film}
    clash = name_taken(a.ledger, meta)
    if clash:
        die(f"{out_name(meta)} already belongs to {clash}. Never resubmit (hard rule 5): poll that task, or use the "
            f"next --take (same version) or --e-index")
    return body, meta, warn


def name_taken(ledger, meta):
    """The output name is the ledger key (L.1): refuse a request whose file name an OK row or a live task already owns."""
    stem = os.path.splitext(out_name(meta))[0]
    for r in read_ledger(ledger):
        if r.get("outcome") == "OK" and os.path.splitext(r.get("file_name", ""))[0] == stem:
            return f"ledger row {r.get('gen_id')}"
    infl = ledger_paths(ledger)[1]
    for fn in sorted(os.listdir(infl)) if os.path.isdir(infl) else []:
        if fn.endswith(".json"):
            with open(os.path.join(infl, fn), encoding="utf-8") as f:
                m = json.load(f)
            if all(k in m for k in ("film", "shot", "kind", "version", "take")) and os.path.splitext(out_name(m))[0] == stem:
                return f"in-flight task {m.get('task_id')}"
    return None


def build_final(a):
    warn, rows = [], read_ledger(a.ledger)
    src = next((r for r in rows if r.get("task_id") == a.draft_task_id and r.get("mode") == "draft"), None)
    if not src and not a.force_unapproved:
        die("draft task not found in the ledger: log it first (`poll --task-id <draft id>`), or pass --force-unapproved")
    if not src:
        warn.append("draft task not in the ledger: shot/version/take must be given and the cost rate is assumed")
    elif src.get("outcome") != "OK":
        die(f"draft {a.draft_task_id} has outcome {src.get('outcome')}; only a succeeded draft can be finalised")
    if src and src.get("review_status") != "APPROVED" and not a.force_unapproved:
        die("the draft row is not APPROVED in the ledger. Record the user's approval words first (05 Gate G5-D), "
            "or pass --force-unapproved for a logged test")
    if src and src.get("draft_expires_utc", "").endswith("Z"):
        exp = dt.datetime.strptime(src["draft_expires_utc"], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=dt.timezone.utc)
        if now() > exp:
            die("draft ID expired: re-draft (a final cannot be made from an expired draft)")
        if exp - now() < dt.timedelta(days=2):
            warn.append(f"draft expires {iso(exp)}: finalise today")
    shot = a.shot or (src or {}).get("shot_id")
    pm = dict(kv.split("=", 1) for kv in (src or {}).get("params", "").split(";") if "=" in kv)
    m = re.search(r"_v(\d+)_t(\d+)", (src or {}).get("file_name", ""))
    version = a.version or (int(m.group(1)) if m else None)
    take = a.take or (int(m.group(2)) if m else None)
    if not (shot and version and take):
        die("give --shot --version --take (draft not found in the ledger)")
    vin = float(pm.get("video_in_s", 0) or 0)
    body = {"model": MODEL_ID, "content": [{"type": "draft_task", "draft_task": {"id": a.draft_task_id}}],
            "resolution": "1080p", "output_format": a.output_format, "return_last_frame": not a.no_last_frame,
            "watermark": a.watermark == "true", "priority": a.priority, "execution_expires_after": a.expires}
    # Never resend prompt, references, duration, ratio, seed, generate_audio or omni_reference_task_type: the API
    # reuses them from the draft and errors if they are sent again (seedance-2-5.md, Draft mode step 2).
    params = (f"final_from_draft={a.draft_task_id};resolution=1080p;output_format={a.output_format};"
              f"return_last_frame={str(not a.no_last_frame).lower()};watermark={a.watermark};priority={a.priority};"
              f"inherited:{(src or {}).get('params', 'unknown')}")
    op = {"edit": "EDT", "extend": "EXT"}.get(pm.get("omni_reference_task_type"), "FIN")   # L.1 names
    meta = {"kind": "final", "mode": "final-from-draft", "op": op, "e_index": a.e_index, "shot": shot,
            "version": int(version), "take": int(take), "f_index": a.f_index, "purpose": a.purpose, "params": params,
            "prompt_file": (src or {}).get("prompt_file", "inherited from draft"),
            "prompt_sha256": (src or {}).get("prompt_sha256", "inherited"), "prompt_origin": (src or {}).get("prompt_origin", "inherited"),
            "references": (src or {}).get("references", "inherited from draft"), "parent_gen_id": (src or {}).get("gen_id", "not_provided"),
            "draft_task_id": a.draft_task_id, "video_in_s": vin, "ratio": pm.get("ratio", "16:9"),
            "duration": int(pm.get("duration", "0") or 0), "output_format": a.output_format, "watermark": a.watermark,
            "line_ids": (src or {}).get("line_or_cue_id", a.line_ids), "human": a.human, "notes": a.notes, "film": a.film}
    clash = name_taken(a.ledger, meta)
    if clash:
        die(f"{out_name(meta)} already belongs to {clash}. A second final from this draft is a new billed generation "
            f"that may differ: only with the user's yes, as --f-index {a.f_index + 1} (05 §5.7)")
    return body, meta, warn


def show(body, meta, warn, res):
    shown = json.loads(json.dumps(body))
    for c in shown.get("content", []):
        for k in ("image_url", "video_url", "audio_url"):
            u = c.get(k, {}).get("url", "")
            if u.startswith("data:"):
                c[k]["url"] = u[:48] + f"...<{len(u)} chars>"
            elif "?" in u:  # presigned URLs: the signature grants read access until expiry (holdback, hard rule 11)
                c[k]["url"] = u.split("?", 1)[0] + "?<signature hidden>"
    print(json.dumps(shown, indent=2, ensure_ascii=False))
    out_s = meta["duration"] if meta["duration"] and meta["duration"] > 0 else 0
    if meta["duration"] == -1:          # edit: output follows the source video (up to ~0.4 s shorter)
        out_s = meta["video_in_s"]
    if out_s:
        tok, usd, rate = est_cost(res, meta["ratio"] if meta["ratio"] in PIXELS[res] else "16:9", out_s, meta["video_in_s"])
        print(f"COST ESTIMATE {res}: ~{tok:,.0f} tokens x ${rate}/1M = ~${usd:.2f}"
              + (" (minimum token charge may apply with video input)" if meta["video_in_s"] else ""))
    for w in warn:
        print("WARNING:", w, file=sys.stderr)


def submit(a, body, meta):
    gen_id = a.gen_id or next_gen_id(a.ledger)
    raw_dir, infl = ledger_paths(a.ledger)
    os.makedirs(infl, exist_ok=True)
    meta.update(gen_id=gen_id, submitted_utc=iso(now()), account=a.account, plan=a.plan, out_dir=os.path.abspath(a.out_dir))
    try:
        r = api("POST", "/contents/generations/tasks", body)
    except ApiError as e:  # synchronous rejection: no task was created, nothing is billed; still logged (history)
        if e.status >= 500:
            die(f"{e}. A server error after sending: a task MAY exist and may bill. Do NOT resubmit: run "
                f"`list --status queued` and `list --status running` first, then `poll` any task you find")
        out = "FILTERED" if "SensitiveContentDetected" in e.code else "FAILED"
        log_row(a.ledger, meta, None, out, notes=f"rejected at submit: {e.code}: {e.message}")
        die(f"{e} -> logged {gen_id} as {out}. See 05 §5.9 before changing anything")
    tid = r.get("id")
    if not tid:
        die(f"no task id in response: {r}")
    meta["task_id"] = tid
    with open(os.path.join(infl, f"{tid}.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=1, ensure_ascii=False)
    print(f"SUBMITTED {gen_id} task {tid} ({meta['kind']}, {meta['shot']} v{meta['version']:02d} t{meta['take']})")
    print(f"  poll: python3 seedance_byteplus.py poll --task-id {tid} --wait --ledger {a.ledger}")
    return tid


def out_name(meta):
    """Ledger L.1: _SD25-DRF_vNN_tK, _SD25-FIN_vNN_tK[_f2], _SD25-EDT|EXT_vNN_tK_eNN."""
    ext = "mov" if meta.get("output_format") == "mov" else "mp4"
    op = meta.get("op") or ("DRF" if meta["kind"] == "draft" else "FIN")
    f = f"_f{meta['f_index']}" if (meta.get("f_index") or 1) > 1 else ""
    e = f"_e{int(meta.get('e_index') or 1):02d}" if op in ("EDT", "EXT") else ""
    return f"{meta['film']}_{meta['shot']}_SD25-{op}_v{int(meta['version']):02d}_t{meta['take']}{f}{e}.{ext}"


def log_row(ledger, meta, r, outcome, file_name="n/a", file_sha="n/a", tech="n/a", downloaded=None, notes=""):
    r = r or {}
    created = dt.datetime.fromtimestamp(r["created_at"], dt.timezone.utc) if r.get("created_at") else None
    updated = dt.datetime.fromtimestamp(r["updated_at"], dt.timezone.utc) if r.get("updated_at") else None
    is_draft = meta["kind"] == "draft"
    dexp = "n/a"
    if is_draft and created and outcome == "OK":
        dexp = iso(created + dt.timedelta(days=14 if created >= DRAFT_14D_FROM else 7))
    cost = "n/a (not billed: only successful videos are charged)"
    tok = (r.get("usage") or {}).get("completion_tokens")
    if outcome == "OK" and tok:
        res = r.get("resolution") or ("480p" if is_draft else "1080p")
        rate = RATE[("high" if res == "1080p" else "low", meta.get("video_in_s", 0) > 0)]
        cost = f"usd_est={tok * rate / 1e6:.3f} (completion_tokens={tok} x ${rate}/1M, list price 2026-10-30)"
    append_ledger(ledger, {
        "gen_id": meta["gen_id"], "film": meta["film"], "step": "05", "kind": "video", "shot_id": meta["shot"],
        "asset_id": "n/a", "line_or_cue_id": meta.get("line_ids") or "n/a", "purpose": meta["purpose"], "tool": TOOL,
        "model_id": MODEL_ID, "model_snapshot": r.get("model", "not_provided"), "mode": meta["mode"], "route": ROUTE,
        "account": meta.get("account"), "plan_tier": meta.get("plan"), "params": meta["params"],
        "prompt_file": meta["prompt_file"], "prompt_sha256": meta["prompt_sha256"], "prompt_origin": meta["prompt_origin"],
        "references": meta["references"], "parent_gen_id": meta["parent_gen_id"], "task_id": meta.get("task_id") or "none",
        "draft_task_id": (meta.get("task_id") if is_draft else meta.get("draft_task_id")) or "n/a",
        "seed_returned": r.get("seed", "not_provided"), "submitted_utc": meta["submitted_utc"],
        "completed_utc": iso(updated) if updated else "n/a", "downloaded_utc": iso(downloaded) if downloaded else "n/a",
        "url_expires_utc": iso(created + dt.timedelta(hours=24)) if (created and outcome == "OK") else "n/a",
        "draft_expires_utc": dexp, "file_name": file_name, "file_sha256": file_sha, "tech": tech,
        "c2pa_status": "not_checked" if outcome == "OK" else "n/a",
        "watermark": "visible" if meta.get("watermark") == "true" else "none", "cost": cost, "outcome": outcome,
        "review_status": "CANDIDATE" if outcome == "OK" else "REJECTED", "approved_by": "n/a", "approved_utc": "n/a",
        "approval_words": "n/a", "human_contribution": meta.get("human") or "not_provided", "post_edits": "none",
        "synthetic_or_real": "synthetic", "consent_ref": "n/a", "licence_ref": "BytePlus ModelArk terms (see version-pins.md)",
        "in_final": "N", "origin_class": "DRAFT" if is_draft else "SD", "seconds_in_final": "n/a",
        "share_of_film_pct": "n/a", "notes": "; ".join(x for x in (meta.get("notes"), notes) if x) or "none"})


def finish(a, tid, r):
    raw_dir, infl = ledger_paths(a.ledger)
    mpath = os.path.join(infl, f"{tid}.json")
    if any(row.get("task_id") == tid for row in read_ledger(a.ledger)):
        print(f"task {tid} is already in the ledger; nothing written (re-download manually if needed)")
        return
    if os.path.isfile(mpath):
        with open(mpath, encoding="utf-8") as f:
            meta = json.load(f)
    else:
        print("WARNING: no inflight record; logging with minimal metadata", file=sys.stderr)
        meta = {"gen_id": next_gen_id(a.ledger), "kind": "draft" if r.get("draft") else "final", "shot": a.shot or "S00-SH00",
                "version": a.version or 0, "take": a.take or 0, "f_index": 1, "purpose": "recovered",
                "mode": "draft" if r.get("draft") else "final-from-draft", "params": "unknown (recovered)",
                "prompt_file": "unknown", "prompt_sha256": "unknown", "prompt_origin": "unknown", "references": "unknown",
                "parent_gen_id": "unknown", "draft_task_id": r.get("draft_task_id"), "video_in_s": 0, "ratio": r.get("ratio"),
                "duration": r.get("duration"), "output_format": r.get("output_format", "mp4"), "watermark": "unknown",
                "film": a.film, "submitted_utc": "not_provided", "account": a.account, "plan": a.plan, "out_dir": a.out_dir,
                "task_id": tid}
    os.makedirs(raw_dir, exist_ok=True)
    with open(os.path.join(raw_dir, f"{meta['gen_id']}.json"), "w", encoding="utf-8") as f:
        json.dump(r, f, indent=1, ensure_ascii=False)       # generation history evidence (cl. 5.5)
    st = r.get("status")
    if st == "succeeded":
        url = (r.get("content") or {}).get("video_url")
        if not url:
            die("succeeded but no content.video_url")
        out_dir = meta.get("out_dir") or a.out_dir
        os.makedirs(out_dir, exist_ok=True)
        path = download(url, os.path.join(out_dir, out_name(meta)))
        got = now()
        notes = f"duration_returned={r.get('duration')} (floor of frames/24); fps={r.get('framespersecond')}"
        lf = (r.get("content") or {}).get("last_frame_url")
        if lf:  # JPEG, no watermark; a trusted input for 30 days only while unedited - never re-encode it
            lfp = download(lf, os.path.splitext(path)[0] + "_LF.jpg")
            notes += f"; last_frame={os.path.basename(lfp)} sha256={sha256(lfp)}"
        log_row(a.ledger, meta, r, "OK", os.path.basename(path), sha256(path), ffprobe(path), got, notes)
        print(f"DOWNLOADED {path}\n  logged {meta['gen_id']} OK. Review it now (05 §5.5); the URL dies 24 h after creation.")
    else:
        err = r.get("error") or {}
        code = err.get("code", st)
        outcome = "TIMEOUT" if st == "expired" else ("FILTERED" if "SensitiveContentDetected" in str(code) else "FAILED")
        log_row(a.ledger, meta, r, outcome, notes=f"status={st}; error={code}: {err.get('message', '')}")
        print(f"TASK {tid} {st}: {code} {err.get('message', '')}\n  logged {meta['gen_id']} as {outcome} (not billed)")
    if os.path.isfile(mpath):
        os.remove(mpath)


def poll(a, tid):
    t0 = time.monotonic()
    while True:
        try:
            r = api("GET", f"/contents/generations/tasks/{tid}")
        except ApiError as e:
            die(f"retrieve {tid} failed: {e}. Check the ID and the key's region (task IDs live 7 days, drafts 14); "
                f"never resubmit to 'recover' a task")
        st = r.get("status")
        print(f"  {iso(now())} {tid}: {st}")
        if st in ("succeeded", "failed", "expired", "cancelled"):
            return finish(a, tid, r)
        if not a.wait:
            print("  still in progress; poll again later (never resubmit a running task)")
            return
        if time.monotonic() - t0 > a.timeout:
            print(f"  local timeout after {a.timeout}s. The task is still alive and still billable: poll again later. "
                  f"NEVER resubmit (that bills a second generation).")
            return
        time.sleep(max(5, a.interval))


def cmd_list(a):
    q = {"page_num": a.page, "page_size": a.page_size}
    if a.status:
        q["filter.status"] = a.status
    if a.task_ids:
        q["filter.task_ids"] = a.task_ids  # repeated key: filter.task_ids=id1&filter.task_ids=id2 (list API doc)
    r = api("GET", "/contents/generations/tasks", query=q)
    for it in r.get("items", []):
        c = dt.datetime.fromtimestamp(it.get("created_at", 0), dt.timezone.utc)
        print(f"{it.get('id')}  {str(it.get('status')):<9}  draft={it.get('draft')}  {iso(c)}  {it.get('model')}  "
              f"{it.get('resolution')} {it.get('duration')}s  draft_task_id={it.get('draft_task_id')}")
    print(f"total={r.get('total', '?')}")


def cmd_review(a):
    """Update only the review cells of one row (ledger rule 2: every other cell is a frozen fact)."""
    rows = read_ledger(a.ledger)
    hits = [r for r in rows if r.get("task_id") == a.task_id]
    if len(hits) != 1:
        die(f"expected exactly one ledger row with task_id {a.task_id}, found {len(hits)}")
    if hits[0].get("outcome") != "OK":
        die("only a succeeded generation can be reviewed")
    if a.status == "APPROVED" and not a.words:
        die("APPROVED needs the user's own words, verbatim (--words)")
    hits[0].update(review_status=a.status, approved_by=a.by if a.status == "APPROVED" else "n/a",
                   approved_utc=iso(now()) if a.status == "APPROVED" else "n/a", approval_words=a.words or "n/a")
    with open(a.ledger, encoding="utf-8", newline="") as f:
        header = next(csv.reader(f))
    tmp = a.ledger + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=header, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)
    os.replace(tmp, a.ledger)
    print(f"{hits[0]['gen_id']} ({hits[0]['file_name']}) -> {a.status}")


def cmd_cancel(a):
    r = api("GET", f"/contents/generations/tasks/{a.task_id}")
    if r.get("status") != "queued":
        die(f"status is {r.get('status')}: only a QUEUED task can be cancelled. DELETE on a succeeded task erases its "
            f"record (and a draft ID with it), so this script refuses.")
    if not a.yes:
        die("re-run with --yes to cancel this queued task")
    api("DELETE", f"/contents/generations/tasks/{a.task_id}")
    print(f"cancelled {a.task_id}. Log it now with `poll --task-id {a.task_id}`: cancelled records are deleted "
          f"after 24 h (list API doc), and the inflight record stays until poll logs it")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--ledger", default=os.environ.get("SEEDANCE_LEDGER", "ledger/SLA_LEDGER.csv"))
    common.add_argument("--film", default="SLA")
    common.add_argument("--out-dir", default=".")
    common.add_argument("--account", default=os.environ.get("SEEDANCE_ACCOUNT", "not_provided"), help="login/project name, never a key")
    common.add_argument("--plan", default="not_provided")
    common.add_argument("--dry-run", action="store_true", help="validate and print the request + cost; send nothing")
    common.add_argument("--wait", action="store_true")
    common.add_argument("--interval", type=int, default=20)
    common.add_argument("--timeout", type=int, default=3600, help="local wait limit (s); the task keeps running")
    common.add_argument("--shot"); common.add_argument("--version", type=int); common.add_argument("--take", type=int)
    common.add_argument("--purpose")
    common.add_argument("--line-ids", default="n/a")
    common.add_argument("--human", default="not_provided", help="human contribution for the authorship record")
    common.add_argument("--notes", default="")
    common.add_argument("--gen-id")
    common.add_argument("--watermark", choices=["true", "false"], default="false")
    common.add_argument("--output-format", choices=["mp4", "mov"], default="mp4")
    common.add_argument("--expires", type=int, default=43200, help="execution_expires_after, 3600-259200 s")
    common.add_argument("--e-index", type=int, default=1, help="edit/extend pass number for _SD25-EDT|EXT_..._eNN names")
    sub = p.add_subparsers(dest="cmd", required=True)
    d = sub.add_parser("draft", parents=[common], help="480p Draft task")
    d.add_argument("--prompt-file", required=True)
    d.add_argument("--image", action="append", help="[LABEL::]URL|asset://ID|local path -> role reference_image (@Image1..)")
    d.add_argument("--video", action="append", help="[LABEL::]URL|asset://ID -> role reference_video (@Video1..)")
    d.add_argument("--audio", action="append", help="[LABEL::]URL|asset://ID|wav/mp3 -> role reference_audio (@Audio1..)")
    d.add_argument("--first-frame"); d.add_argument("--last-frame")
    d.add_argument("--video-seconds", type=float, default=0.0, help="total reference video seconds (cost estimate)")
    d.add_argument("--duration", type=int, required=True, help="04's G (4-30); -1 only for edit tasks")
    d.add_argument("--ratio", default="16:9", choices=["16:9", "4:3", "1:1", "3:4", "9:16", "21:9", "adaptive"])
    d.add_argument("--generate-audio", choices=["true", "false"], required=True, help="decided now: the final inherits it")
    d.add_argument("--task-type", choices=["auto", "reference", "edit", "extend"])
    d.add_argument("--priority", type=int, default=0, choices=range(0, 10))
    d.add_argument("--prompt-origin", default="C", help="01's origin codes: H, H/C, C, G, T, F")
    d.add_argument("--extra-body", help="JSON merged into the body (new server fields only)")
    d.add_argument("--direct-1080p", action="store_true",
                   help="edit/extend only, after 05-T9 showed drafts are refused and the user said yes: 1080p, no draft")
    f = sub.add_parser("final", parents=[common], help="1080p final from an approved Draft task ID")
    f.add_argument("--draft-task-id", required=True)
    f.add_argument("--f-index", type=int, default=1, help="2 for a second final from the same draft (_f2)")
    f.add_argument("--no-last-frame", action="store_true")
    f.add_argument("--priority", type=int, default=5, choices=range(0, 10))
    f.add_argument("--force-unapproved", action="store_true")
    q = sub.add_parser("poll", parents=[common]); q.add_argument("--task-id", required=True)
    l = sub.add_parser("list", parents=[common])
    l.add_argument("--status", choices=["queued", "running", "cancelled", "succeeded", "failed", "expired"])
    l.add_argument("--task-ids", action="append"); l.add_argument("--page", type=int, default=1)
    l.add_argument("--page-size", type=int, default=20)
    c = sub.add_parser("cancel", parents=[common]); c.add_argument("--task-id", required=True)
    c.add_argument("--yes", action="store_true")
    v = sub.add_parser("review", parents=[common], help="set review cells of one ledger row (user's verdict)")
    v.add_argument("--task-id", required=True)
    v.add_argument("--status", required=True, choices=["APPROVED", "REJECTED", "SUPERSEDED", "CANDIDATE"])
    v.add_argument("--by", default="AboStesha"); v.add_argument("--words", default="")
    a = p.parse_args()
    if not 3600 <= a.expires <= 259200:
        die("--expires must be 3600-259200 s")
    if a.cmd in ("draft", "final"):
        if a.cmd == "draft":
            a.purpose = a.purpose or "draft"
            if a.version is None or a.take is None or not a.shot:
                die("draft needs --shot --version --take")
            body, meta, warn = build_draft(a)
            show(body, meta, warn, body["resolution"])
        else:
            a.purpose = a.purpose or "final"
            body, meta, warn = build_final(a)
            show(body, meta, warn, "1080p")
        if a.dry_run:
            print("DRY RUN: nothing sent, nothing logged.")
            return
        tid = submit(a, body, meta)
        if a.wait:
            poll(a, tid)
    elif a.cmd == "poll":
        poll(a, a.task_id)
    elif a.cmd == "list":
        cmd_list(a)
    elif a.cmd == "cancel":
        cmd_cancel(a)
    elif a.cmd == "review":
        cmd_review(a)


if __name__ == "__main__":
    main()
