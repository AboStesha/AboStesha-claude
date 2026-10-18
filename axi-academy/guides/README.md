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

| Course | Lesson | Title | Pages | File |
|---|---|---|---|---|
| الكورس الأول · الفوركس من الصفر | 1 | ما هو الفوركس؟ | 10 | `pdf/AxiAcademy_Guide_L01.pdf` |
| الكورس الأول · الفوركس من الصفر | 2 | لماذا تتداول الفوركس؟ | 9 | `pdf/AxiAcademy_Guide_L02.pdf` |
| الكورس الأول · الفوركس من الصفر | 3 | كيف تتداول الفوركس؟ | 10 | `pdf/AxiAcademy_Guide_L03.pdf` |
| الكورس الأول · الفوركس من الصفر | 4 | مصطلحات الفوركس | 10 | `pdf/AxiAcademy_Guide_L04.pdf` |
| الكورس الأول · الفوركس من الصفر | 5 | ما هي أنواع الرسوم البيانية؟ | 10 | `pdf/AxiAcademy_Guide_L05.pdf` |
| الكورس الثاني · أساسيات التداول | 6 | ما هي ميتا تريدر؟ | 9 | `pdf/AxiAcademy_Guide_L06.pdf` |
| الكورس الثاني · أساسيات التداول | 7 | الرافعة المالية (Leverage) | 10 | `pdf/AxiAcademy_Guide_L07.pdf` |
| الكورس الثاني · أساسيات التداول | 8 | الهامش (Margin) | 9 | `pdf/AxiAcademy_Guide_L08.pdf` |
| الكورس الثاني · أساسيات التداول | 9 | جني الأرباح (Take Profit) | 8 | `pdf/AxiAcademy_Guide_L09.pdf` |
| الكورس الثاني · أساسيات التداول | 10 | وقف الخسارة (Stop Loss) | 8 | `pdf/AxiAcademy_Guide_L10.pdf` |
| الكورس الثاني · أساسيات التداول | 11 | سعر الشراء والبيع | 9 | `pdf/AxiAcademy_Guide_L11.pdf` |
| الكورس الثاني · أساسيات التداول | 12 | رسوم التبييت (Swap) | 9 | `pdf/AxiAcademy_Guide_L12.pdf` |
| الكورس الثاني · أساسيات التداول | 13 | ما هي الوحدة؟ | 10 | `pdf/AxiAcademy_Guide_L13.pdf` |
| الكورس الثالث · كيف تصبح متداولاً محترفاً | 14 | سيكولوجية التداول | 9 | `pdf/AxiAcademy_Guide_L14.pdf` |
| الكورس الثالث · كيف تصبح متداولاً محترفاً | 15 | إدارة المخاطر | 10 | `pdf/AxiAcademy_Guide_L15.pdf` |
| الكورس الثالث · كيف تصبح متداولاً محترفاً | 16 | التحليل الأساسي مقابل التحليل الفني | 9 | `pdf/AxiAcademy_Guide_L16.pdf` |
| الكورس الثالث · كيف تصبح متداولاً محترفاً | 17 | استراتيجيات التداول | 10 | `pdf/AxiAcademy_Guide_L17.pdf` |
| الكورس الثالث · كيف تصبح متداولاً محترفاً | 18 | نصائح قبل أول إيداع | 9 | `pdf/AxiAcademy_Guide_L18.pdf` |
| كورس للمحترفين · احترف تداول الذهب | 1 | كيف تتداول الذهب؟ | 9 | `pdf/AxiAcademy_Guide_G1.pdf` |
| كورس للمحترفين · احترف تداول الذهب | 2 | ما الذي يحرّك سعر الذهب؟ | 9 | `pdf/AxiAcademy_Guide_G2.pdf` |
| كورس للمحترفين · احترف تداول الذهب | 3 | الذهب بالأرقام | 10 | `pdf/AxiAcademy_Guide_G3.pdf` |
| كورس للمحترفين · احترف تداول الذهب | 4 | أوقات تداول الذهب | 8 | `pdf/AxiAcademy_Guide_G4.pdf` |

## What every guide contains

- **Cover:** the course, the lesson, the title, a two-line summary of what the guide adds, and a contents list with page numbers.
- **Sections:** 5–8 numbered sections of short paragraphs, lists and reference tables.
- **Worked examples:** at least 3, with numbered steps and the result highlighted.
- **Takeaways:** a takeaways box near the end.
- **Glossary:** the last section, «مصطلحات هذا الدليل», lists each term in Arabic with its English name and meaning.
- **Closing:** the Axi Iraq logo and the standard risk warning. They appear as a card after the glossary, or on a branded back page when the card does not fit on the last page (lessons 4 and 11).
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
  - word count (about 1,900–2,200 Arabic words per guide).
- **Arithmetic.** Every calculation was recomputed in Python by the writer and again by an independent checker.
- **Fact-check.** Each guide was checked by a second agent that did not write it, against official sources where they could be reached: BIS, the World Gold Council, ESMA/FCA/ASIC texts, the MetaTrader 4/5 help, CME/LBMA, the Fed calendar, FRED and the ISO 4217 list.
- **Layout.** Every guide renders to 8–10 A4 pages, 204 pages in all. Tables split between rows and repeat their header, and a heading always stays with the block that follows it.
- **Video errors found and corrected in the guides (not in the videos):**
  - **L02:** the video says more liquidity means more volatility. The guide explains that liquidity and volatility are different things.
  - **L04:** the video says $100 at 1:100 gives "$10,000 of free margin". Free margin before any trade equals the equity ($100); $10,000 is only the largest position that margin allows.
  - **L08:** the video says margin is always calculated in the quote currency. MetaTrader computes forex margin in the base currency and converts it to the account currency. The video also says margin level shows the money available for new trades, which is free margin; margin level is a ratio.
  - **L13:** the gold example (2 lots, a $1 move) is $200, not $100.
  - **L10, L11, L12:** smaller simplifications, each shown correctly in the guide:
    - a stop loss can fill worse than its level;
    - an order's trigger price is not the same as the quoted Bid/Ask;
    - swap is the interest-rate difference plus the broker's markup, and its value is in the symbol's specification window.
- **Promotional lines in the videos that the guides do not repeat** (worth a compliance look):
  - "the best platform in the world" (L06)
  - "up to 1:1000" (L07)
  - "the best swap rates in the world" (L12)
- **The G4 video** asks viewers to "answer all the questions in the guide". The guides contain worked examples only; the questions are in the question bank.

## Build

```
python3 tool/lint.py src/*.md
python3 ../quizzes/tool/fonts.py <fonts_dir>     # once: static Readex Pro / Inter from the variable fonts (needs fontTools)
PW_MODULE=<path>/playwright/index.mjs node tool/render.mjs <fonts_dir> ../brand/AxiIraq_Logo_Stacked_Ink.png pdf src/*.md
```

- `<fonts_dir>` holds `ReadexPro.ttf` and `Inter.ttf`, as for the question bank. Readex Pro stands in for Rabar.
- `render.mjs` prints the page count of each guide and fails if a guide falls outside 6–10 pages or a block does not fit on a page.
- It embeds a 700 px copy of the official stacked logo.
