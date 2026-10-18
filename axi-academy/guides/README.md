# Axi Academy: lesson companion guides (الدليل المرافق)

There are 22 PDF guides, one for each lesson video: lessons 1–18 of the beginner courses and lessons 1–4 of the gold course. Each guide is on the same topic as its video but does not repeat it. It adds the details the video leaves out:
- complete reference lists, such as every currency code or every order type
- formulas and worked examples
- how things look and work on MetaTrader
- edge cases, common mistakes, and what changes from broker to broker

## Files

- `pdf/AxiAcademy_Guide_<id>.pdf`: the 22 guides. They are A4, in Arabic, with Axi Iraq branding.
- `AxiAcademy_Guides.zip`: all 22 PDFs in one archive.
- `src/<id>.md`: the text of each guide. Edit here and rebuild.
- `SPEC.md`: the writing rules.
- `PLAN.md`: what each guide adds beyond its video, and which guide owns each shared topic.
- `tool/`:
  - `lint.py` checks a source against the spec.
  - `render.mjs` builds the PDFs.
  - `bookmarks.py` adds the PDF bookmarks and metadata.
  - `ordinals.py` writes cross-references as lesson numbers.

## Guides

{TABLE}

## What every guide contains

- **Cover:** the course, the lesson, the title, a two-line summary of what the guide adds, and a contents list with page numbers.
- **Sections:** 5–8 numbered sections of short paragraphs, lists and reference tables.
- **Worked examples:** at least 3, with numbered steps and the result highlighted.
- **Takeaways:** a takeaways box near the end.
- **Glossary:** the last section, «مصطلحات هذا الدليل», lists each term in Arabic with its English name and meaning.
- **Closing card:** the Axi Iraq logo and the standard risk warning.
- **PDF bookmarks:** one for each section.

## Editorial decisions

- **Language.**
  - All guides are in simplified Modern Standard Arabic, including the gold course, whose videos are in Iraqi dialect.
  - The two gold titles in dialect are written in MSA: G1 «كيف تتداول الذهب؟» and G2 «ما الذي يحرّك سعر الذهب؟».
- **English terms.** Each trading term appears in brackets at its first use, for example «الهامش الحر (Free Margin)».
- **Digits.** Western digits are used throughout.
- **Shared terms.** The same term is used in every guide:

  | English | Arabic |
  |---|---|
  | Ask | سعر العرض |
  | Bid | سعر الطلب |
  | Pip | النقطة |
  | Pipette (MetaTrader's Point) | النقطة الجزئية |
  | Lot | العقد (also called «اللوت») |
  | Stop Out | التصفية الإجبارية |
  | Futures | العقود المستقبلية |
  | Forward | العقد الآجل |

- **Numbers.**
  - Invented prices are labelled «مثال افتراضي».
  - Figures that change over time carry their source and year. Examples are the BIS survey, the World Gold Council 2025 demand figures, and the ESMA, FCA and ASIC leverage rules.
  - Broker-dependent values carry «قد يختلف حسب الوسيط». Examples are contract size, swap, stop-out level and server time.
- **No Axi product claims.** No guide states Axi's own leverage, spreads, licences or account types, and none repeats the promotional lines in the videos. Readers are told to check their symbol's specification and their broker's terms.
- **Shared topics have one owner.** Each topic is explained fully in one guide, and the other guides point to it:
  - lot size and pip value: lesson 13
  - position sizing: lesson 15
  - order types: lesson 6
  - account figures: lesson 8
  - forex sessions: lesson 2
  - gold sessions: gold lesson 4
- **Video errors.** Where a video gets something wrong, the guide shows the correct version without mentioning the video. The errors are listed under QA.

## QA

- `lint.py` passes for all 22 sources. It checks:
  - structure and the number of tables and examples;
  - banned phrases, story characters, Eastern digits and dialect words;
  - table size;
  - word count (about 1,900–2,100 Arabic words per guide).
- **Arithmetic.** Every calculation was recomputed in Python by the writer and again by an independent checker.
- **Fact-check.** Each guide was checked by a second agent that did not write it, against official sources where they could be reached: BIS, the World Gold Council, ESMA/FCA/ASIC texts, the MetaTrader 4/5 help, CME/LBMA, the Fed calendar, FRED and the ISO 4217 list.
- **Layout.** Every guide renders to 6–10 A4 pages. Tables split between rows and repeat their header, and a heading always stays with the block that follows it.
- **Video errors found and corrected in the guides (not in the videos):**
{ERRORS}

## Build

```
python3 tool/lint.py src/*.md
python3 ../quizzes/tool/fonts.py <fonts_dir>     # once: static Readex Pro / Inter from the variable fonts (needs fontTools)
PW_MODULE=<path>/playwright/index.mjs node tool/render.mjs <fonts_dir> ../brand/AxiIraq_Logo_Stacked_Ink.png pdf src/*.md
```

- `<fonts_dir>` holds `ReadexPro.ttf` and `Inter.ttf`, as for the question bank. Readex Pro stands in for Rabar.
- `render.mjs` prints the page count of each guide and fails if a guide falls outside 6–10 pages or a block does not fit on a page.
- It embeds a 700 px copy of the official stacked logo.
