# Lesson companion guides: writing spec

Each Axi Academy lesson video teaches the basics. Each lesson also gets a companion guide (PDF) with the details the video leaves out. The guide is the "file below the video" that several lessons promise:
- the pair names in lesson 3
- chart types in detail in lesson 5
- the products table in lesson 13
- the strategies book in lesson 17
- the written guide in the gold lessons

There are 22 guides: beginner lessons L01–L18 and gold lessons G1–G4.

## The rule that matters most: complement the video, never repeat it

- The student has watched the video. Its script is in `../quizzes/transcripts/<id>.txt`. Read it first.
- Do not re-explain anything the video already explains. You may refer to it in one short clause («كما رأيت في الفيديو، …») and then go further.
- Go further means more detail and precision:
  - the mechanics behind what the video says
  - complete lists and reference tables, such as every currency code or every order type
  - formulas and worked numbers
  - how it looks and works on MetaTrader
  - edge cases, common mistakes, and what changes from broker to broker
- Do not use story characters, such as جون or سعيد. Use generic examples («متداول»، «حسابك»).

## Language and brand

- **Arabic register.** Use simplified Modern Standard Arabic («الفصحى البيضاء»), with no Iraqi dialect, even for the gold course. Keep sentences short, with one idea per sentence. Address the reader as «أنت».
- **English.** Use it only for trading terms, symbols and acronyms. Put the term in brackets at its first use in the guide: «الهامش (Margin)», `EUR/USD`, «مؤشر القوة النسبية (RSI)».
- **Digits.** Always use Western digits 0–9. Write thousands as `1,000` and decimals as `1.0850`. Never use Eastern Arabic digits.
- **Names.** Write «آكسي» with the madda, and «أكاديمية آكسي».
- **Banned anywhere, even as a counter-example:** ربح مضمون · بلا مخاطر · دخل ثابت · مضاعفة رأس المال · توصية مؤكدة · إشارة 100% · لا تخسر أبداً · مرخّص في العراق.
- **No promises.** Do not promise or imply profit, and do not recommend a specific trade. Strategies are examples for learning. Mention risk where it is relevant, without preaching.
- **No Axi-specific product claims.** Leave out Axi's own leverage, spreads, licences and account types. Tell the reader to check the specification of their symbol, or the terms of their broker.
- **No politics.** Stay out of politics and religious rulings. On swap-free accounts, say «للأسئلة الشرعية راجع أهل الاختصاص».

## Accuracy

- Use only standard, checkable facts.
- **Figures that change over time** need a source and a year: regulatory limits, survey statistics, demand figures. For example: «حسب مسح بنك التسويات الدولية لعام 2022».
- **Invented numbers** must be labelled: «مثال افتراضي».
- **Broker-dependent values** (contract sizes, swap, stop-out level, server time) are given as typical values with «قد يختلف حسب الوسيط».
- **Calculations.** Recompute every one. A wrong number is the worst possible error in these guides.

## Length and structure (one guide gives 6–10 A4 pages)

- **Length:** about 1,800–2,800 Arabic words.
- **Sections:** 5–8 sections (`##`), each 2–5 short paragraphs and/or lists. Use `###` sub-headings where they help.
- **Worked examples:** at least 3 `:::example` blocks. Each has numbered steps and the result in bold.
- **Tables:** at least 2. Keep each table to about 14 rows or fewer, and split longer lists by category.
- **Takeaways:** one `:::key` block near the end with 4–6 bullets.
- **Glossary:** the last section is `## مصطلحات هذا الدليل`. It is a table with the columns `المصطلح | بالإنجليزية | المعنى` and 8–15 rows.

## Source format (`src/<id>.md`)

```
id: L07
title: الرافعة المالية (Leverage)
lead: جملة أو جملتان تقولان ماذا يضيف هذا الدليل إلى الفيديو.
---
## عنوان القسم
فقرة. أسطر متتالية = فقرة واحدة. **غامق** و `XAU/USD أو معادلة` (نص لاتيني/معادلة من اليسار لليمين).

### عنوان فرعي
- عنصر قائمة
1. عنصر قائمة مرقّمة

| العمود 1 | العمود 2 |
|---|---|
| خلية | خلية |

:::example مثال محلول: عنوان المثال
1. خطوة…
2. خطوة…
**النتيجة: …**
:::
```

- **Callout kinds:**
  - `:::example` for a worked example
  - `:::note` for a note
  - `:::tip` for a practical tip
  - `:::warning` for a warning
  - `:::formula` for a formula: one formula per line, inside backticks or plain
  - `:::key` for the takeaways
- Write the callout's title after the kind, on the same line. A callout may contain paragraphs, lists and one table.
- **Headings.** Do not number them, because the renderer numbers the sections. Do not add a title heading, because the cover is built from `title` and `lead`.
- **Check.** Run `python3 tool/lint.py src/<id>.md` and fix everything it reports.
