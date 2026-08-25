---
name: markitdown
description: Convert documents into Markdown for reading and analysis using Microsoft MarkItDown. Use this whenever the user sends, uploads, attaches, or points at a PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx/.xls), Outlook (.msg), EPub, HTML, CSV/JSON/XML, ZIP archive, image, or audio file and wants its contents read, extracted, quoted, searched, summarized, or converted to Markdown — including when they attach the file without saying what to do with it. Also handles YouTube URLs by fetching the transcript. Trigger on "read this pdf", "what does this document say", "extract the text", "summarize this file", "convert this to markdown", or a bare file attachment.
---

# MarkItDown

Microsoft MarkItDown (`markitdown` on PyPI, MIT, https://github.com/microsoft/markitdown)
converts documents to Markdown that is structure-preserving and token-efficient — headings,
lists, tables and links survive the conversion. It is built for feeding documents to an LLM,
not for high-fidelity conversion for human reading.

## Step 1 — ensure it is installed

Sessions often run in a fresh, ephemeral container, so **check first, every session**. This is
idempotent and costs nothing when the tool is already present:

```bash
export PATH="$HOME/.local/bin:$PATH"
command -v markitdown >/dev/null || uv tool install 'markitdown[all]'
markitdown --version
```

If `uv` is unavailable, fall back to `pip install 'markitdown[all]'` (Python >= 3.10 required),
adding `--break-system-packages` only if pip refuses on a PEP 668 externally-managed install.

The `[all]` extra is what enables PDF, Office, audio and YouTube support. Installing bare
`markitdown` handles almost nothing useful — always install with an extra.

## Step 2 — convert

```bash
markitdown report.pdf                 # to stdout
markitdown report.pdf -o report.md    # to a file
cat report.pdf | markitdown           # from a pipe
```

For long documents write to a file under the scratchpad directory and read that, rather than
pushing the whole conversion through stdout.

As a library, when you need per-file control or want to loop over many inputs:

```python
from markitdown import MarkItDown
md = MarkItDown()
print(md.convert("report.pdf").text_content)
```

## Which skill handles a PDF

Both this skill and the built-in `pdf` skill answer to PDFs. Split them by intent:

| Intent | Use |
|---|---|
| Read, extract, quote, search, summarize, convert to Markdown | **this skill** |
| Merge, split, rotate, watermark, fill forms, encrypt/decrypt, extract images, OCR a scan | `pdf` skill |

Reading is the common case, so MarkItDown is the default for a PDF the user simply sends.

## Limitations worth stating out loud

**Scanned PDFs produce empty or near-empty output.** MarkItDown's PDF path is
pdfminer.six + pdfplumber — it reads embedded text and does no OCR. If the output comes back
blank or as a few stray characters, the PDF is almost certainly a scan. Say so rather than
reporting an empty document, then either OCR it via the `pdf` skill or install the
`markitdown-ocr` plugin, which needs an LLM vision client configured.

**Audio transcription needs ffmpeg** on PATH. Without it, `pydub` emits a RuntimeWarning at
startup and audio conversion fails. That warning is harmless for every non-audio format.

**Complex layouts degrade.** Multi-column pages, nested tables and figure captions can
interleave or lose their reading order. Spot-check any table before relying on its numbers.

**MarkItDown does I/O with this process's privileges** — it will follow what it is pointed at,
like `open()` or `requests.get()`. For untrusted input prefer the narrowest entry point
(`convert_stream()` / `convert_local()`) over letting it fetch arbitrary URLs.
