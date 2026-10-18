# Axi Academy: quiz question bank

There are 380 multiple-choice questions for the four Axi Academy courses, in simplified Modern Standard Arabic.

- **Each lesson:** 10 questions, 220 in all.
- **Each course:** 40 new questions for the end-of-course exam, 160 in all.
- **Each question:** 4 options and exactly one correct answer.

## Files

| File | What it is |
|---|---|
| `AxiAcademy_QuestionBank.pdf` | The bank in Axi Iraq branding (A4, 111 pages). The correct answer is shaded mint with a check mark, and every lesson and exam ends with an answer key. It has bookmarks for every course and lesson, and the contents page is clickable. |
| `AxiAcademy_QuestionBank.xlsx` | The same questions, one row per question, for loading into the quiz system. The correct option's cell is shaded. A second sheet has counts per lesson. |
| `questions.json` | Machine-readable bank. `answer` is the 0-based index of the correct option. |
| `bank/c1.md` to `bank/c4.md` | The source the files above are built from, one file per course. |
| `transcripts/` | What each lesson actually says. The questions were written from these files. |
| `tool/` | Build scripts (see the end of this file). |

## How the bank is meant to be used

- A student sees 5 questions per quiz, drawn from the lesson's 10 or the course's 40.
- When a student gets a question wrong, it is swapped for another question from the same set that the student has not seen yet.
- The questions only test what the videos teach.
  - The end-of-course exams apply that content in new ways: small calculations, scenarios, and links between lessons.
  - No exam question repeats a lesson question.
- Prices and figures in the questions are teaching examples.

## Courses

| Course | Lessons | Questions |
|---|---|---|
| الكورس الأول · الفوركس من الصفر | 1–5 | 50 + 40 |
| الكورس الثاني · أساسيات التداول | 6–13 | 80 + 40 |
| الكورس الثالث · كيف تصبح متداولاً محترفاً | 14–18 | 50 + 40 |
| كورس للمحترفين · احترف تداول الذهب | 1–4 | 40 + 40 |

## Sources and decisions

- **Lesson content.**
  - Eleven lessons already had corrected scripts in this repo from the video work: 1, 2, 5, 11, 16, 17, 18 and gold 1–4.
  - The other eleven were transcribed from the final renders on Drive using faster-whisper `large-v3-turbo`. These transcripts are machine output and contain small errors; the questions follow what the presenter says.
  - Lesson 14 is not in the final-render folders, so it was transcribed from its source audio, `14 - trading psychology.wav`.
- **Error in the lesson 13 video.**
  - At about 2:25 the video says that 2 gold contracts (200 oz) × $1 = $100 profit. The correct figure is $200. A second transcription with `large-v3` confirmed the video says 100.
  - The bank leaves that example out and only uses 1 contract × $1 = $100.
  - The video should be fixed.
- **Lesson claims the bank deliberately does not test:**
  - Lesson 2: "more liquidity means more volatility" and "forex is more volatile than stocks". Both are doubtful.
  - Lesson 7: "leverage up to 1:1000 at Axi", and lesson 12: "the best swap rates in the world". These are promotional claims, and they depend on the entity and the regulator.
  - Lesson 9: "every trade has two possible outcomes". This contradicts the three exits taught in lesson 17.
- **Lesson 1 at the client's request.**
  - The questions are about forex in general and don't mention the story's character.
  - The video's currency-exchange story is replaced by four worked conversion problems: AUD→USD, EUR round trip, AUD round trip with profit, and GBP round trip with loss.
  - Their wrong options are the usual slips: dividing instead of multiplying, reversing the rate, and subtracting the rates.
- **Terms.** Ask/Bid follow the lessons: «سعر العرض (Ask)» is the buy price and «سعر الطلب (Bid)» is the sell price. The English term is added in brackets so the two can't be confused.
- **Brand.**
  - The text uses Western digits, and English only for trading terms and symbols.
  - Fraud warnings are worded without the banned phrases in `../BRAND.md`.
  - The PDF ends with the standard risk warning.

## Checks

- `tool/build.py` checks every build:
  - 10 questions per lesson and 40 per exam.
  - 4 options each, exactly one correct, and no repeated options or questions.
  - No banned phrases and no Eastern Arabic digits.
- **Balanced answers.** The script spreads the correct answer evenly over أ/ب/ج/د within each set. Questions whose options are numbers keep them in ascending order.
- **Independent review.** A second review checked every question against the transcripts and recomputed every calculation:
  - pips, lots and margin
  - percentages
  - ounce, gram and mithqal conversions
  - Baghdad time conversions, against the time-zone database
- **What the review found.** No answer key was wrong. It found 24 smaller issues, and all of them are fixed:
  - **One date.** Iraq last used summer time in 2007, so the question now asks after which year it stopped.
  - **Five arguable options.** Each was either replaced or given «حسب الدرس».
    - Example: 5 PM New York is midnight in Baghdad during US summer time, so «midnight Baghdad» could not stay as a wrong option.
  - **Two compliance wordings.**
    - A stop loss limits a loss but does not guarantee the closing price.
    - Protection against negative balances depends on the regulator.
  - **Fourteen giveaways.** In each, one question's wording revealed the answer to another question in the same set. Because students draw replacement questions from the same set, both can appear in one quiz.
  - **Two wording slips.**
  - The layout check found one more giveaway in the course 1 exam, which is also fixed.
- **Layout.** The PDF was checked page by page:
  - Every lesson and exam starts on a new page.
  - No question is split across pages.
  - The contents page numbers are filled in after layout.

## Build

```
python3 tool/build.py                                   # bank/*.md -> questions.json (and checks)
python3 tool/export_xlsx.py questions.json AxiAcademy_QuestionBank.xlsx
python3 tool/fonts.py <fonts_dir>                       # once: static Readex Pro / Inter from the variable fonts (needs fontTools)
PW_MODULE=<path>/playwright/index.mjs node tool/render.mjs questions.json <fonts_dir> ../brand/AxiIraq_Logo_Stacked_Ink.png AxiAcademy_QuestionBank.pdf
```

`render.mjs` runs `tool/bookmarks.py` (pypdf) at the end. It writes the bookmarks itself because Chromium stores right-to-left bookmark titles with the words in reverse order.

`<fonts_dir>` holds `ReadexPro.ttf` and `Inter.ttf`. Readex Pro stands in for Rabar, which we don't have, the same as on the thumbnails. The logo is the official Axi Iraq stacked logo in ink.

Source format (`bank/*.md`):
- `# C1 | name | label` starts a course.
- `## L01 | 1 | title` starts a lesson, and `## EX | title` starts the exam.
- `?` marks a question whose options get shuffled. `?=` keeps the options in the written order.
- `+` marks the correct option and `-` marks a wrong one.
