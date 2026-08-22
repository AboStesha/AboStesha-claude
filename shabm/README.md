# شَبِم · SHABIM

An Arabic **all-cold** drinks and frozen-dessert brand engineered for 45 °C — Baghdad first, then the Gulf.

**Investor deck (Arabic):** https://claude.ai/code/artifact/809bf328-6f1c-449a-9369-ed31b64e0b2d

---

## Read this before anything else

### 1. Seven of the eight poems in the original brief do not exist

Only al-Mutanabbī's line survived verification against the Arabic poetry corpus. The verses attributed to
الشريف الرضي، الأخطل، عنترة، ابن الرومي، البحتري، ذو الرمّة، العباس بن الأحنف are **not attested anywhere**.

Two are provably impossible, not merely unfound:

- The ʿAntara verse rhymes in **باء**; his Muʿallaqa is a **مِيمِيّة**. It cannot be from that poem.
- The ʿAbbās b. al-Aḥnaf verse uses **شَبائِم** as a plural of شبم. No dictionary lists it. Zero corpus hits.

The set has the signature of chatbot generation: one real anchor verse, seven metrically competent pastiches,
each attached to a famous name. **Do not print any of them.**

Verified replacements are in `research/poetry_report.md` §3. The lead line is Kaʿb b. Zuhayr's, from
**بانَتْ سُعادُ** — the Burda — and Lisān al-ʿArab cites it under the entry شبم itself:

> شُجَّتْ بِذي شَبَمٍ مِن ماءِ مَحنِيَةٍ ❊ صافٍ بِأَبطَحَ أَضحى وَهْوَ مَشمولُ

Two texts are prohibited outright: «خَيْرُ الماءِ الشَّبِمُ» reads as hadith and was graded **موضوع**
(fabricated) by al-Albānī; and Qurʾānic text cannot go on disposable packaging.

### 2. The Latin name should be SHABIM, not SHABM

- **SHABM** has no vowel between B and M. No English, French or Turkish speaker can pronounce it on sight —
  fatal for a franchise that spreads by word of mouth.
- **SHABAM**, the obvious fix, sits one letter from **SHIBAM** — the UNESCO city in Ḥaḍramawt *and*
  Shibam Coffee Co., a live Yemeni-coffee chain with a filed USPTO mark (97667800) in the same Nice classes.
- **SHABIM** is the ALA-LC transliteration of شَبِم — the exact vocalisation in al-Mutanabbī's line.

Keep **SHBM** as an etched monogram for lids, uniforms and the facade. Never as the spoken name.

### 3. الشَّبَم is the modern Arabic medical term for phimosis

Arabic Wikipedia's article at the exact string **شبم** is the urology page. MSD Manuals Arabic, WebTeb and
the German health ministry's Arabic edition all use it. Someone will find this.

It is manageable, not fatal, and the mitigation is one diacritic: the medical term is **الشَّبَم** (fatḥa);
the brand is **شَبِم** (kasra). Always vocalise. Never let the bare word travel without
«شَبِم · بَرْدُ الماء» locked to it.

### 4. «ايس رول» already means something else on Iraqi menus

Baghdad Ice Cream's own menu lists **الايس رول** as an existing category for a different product. This is why
the rolled-ice-cream SKU is named **لَفائِف**, never «ايس رول». Confirm with a Baghdad field sweep before print.

---

## What is in here

| Path | What it is |
|---|---|
| `deck/deck.html` | The investor deck, in Arabic. Generated — edit `deck/build_ar.py`, not this. |
| `deck/build_ar.py` | Deck generator. Pulls every number live from the model output. |
| `deck/glass.css` | The colourless design system: achromatic tokens, glass surfaces, light/dark. |
| `deck/art.py` | Hand-authored SVG: the tilted melting cube, the booth interior, six product icons. |
| `deck/mkpreview.py` | Wraps `deck.html` in the host's `<head>` skeleton so it can be screenshotted locally. |
| `deck/shot.py` | Playwright screenshot pass. `python3 shot.py light` / `dark`. |
| `financials/model.py` | The financial model. Three entities: flagship, franchisee, franchisor. |
| `financials/assumptions.json` | Every input, each with a sourcing note graded H (sourced) or E (estimate). |
| `financials/model_output.json` | Model output, consumed by the deck. |
| `research/` | Twelve research dossiers with full sourcing. |
| `research/products/` | Six per-product dossiers: origin, dated virality, view counts, taste, moat. |
| `research/poetry_report.md` | The 58-page language and poetry verification. Read §2, §3 and §4. |

Rebuild after changing any assumption:

```bash
cd financials && python3 model.py && cd ../deck && python3 build_ar.py && python3 mkpreview.py
```

---

## The concept, as it now stands

A tilted, eroding ice cube on a Baghdad pavement — 25 m² of booth, 38 m² of terrace, 26 perimeter bar seats.
It is **genuinely cold inside**: staff wear winter coats in August. Two through-wall hatches replace the
counter — right to order, left to collect, with the order number cut into the ice above — plus a third for
returning cups. No cashier, no queue at a window. The menu is engraved into the back wall; the screens sit in
openings cut through the ice-material. AC vents through the cube body and throws a fine mist, so from a
distance the whole thing appears to be steaming with cold.

**Nothing hot. Ever.** Six cold SKUs:

| | | |
|---|---|---|
| **صَقيع ٨٠−** | −86 °C frozen-glass dirty latte | Tokyo 2010 (Tanaka) → Shanghai June 2025 |
| **القالَب** | coffee served inside a carved clear-ice block | Kobe 1973, continuous since 1974 |
| **لُؤلُؤ** | brown-sugar boba in a frozen cup | Taichung 1988; tiger stripes 2017 |
| **لَفائِف** | rolled ice cream off a −30 °C pan | Bangkok c.2009 — **and in documented decline** |
| **جَنى** | fruit-shaped frozen sorbet | the one living its peak right now |
| **بَرَد** | fresh juice and fruit slush | the frequency engine, not a viral SKU |

---

## Headline numbers

| | |
|---|---|
| Baghdad flagship CAPEX | $538,944 |
| Year-2 revenue / EBITDA | $719,250 / $183,426 (26%) |
| Payback / 5-year IRR | 42.5 months / 29.6% |
| Iraq franchised Shard — the volume format | $184,842 CAPEX · 38.5-month payback · 36.8% IRR |
| Franchisor, Year 5 | 47 units · $25,357,456 system sales · $1,551,723 EBITDA |
| Raise / return | $1.75M · 45% IRR · 7.5× MOIC |

**Bear case:** the unit stays cash-positive every month but never repays its capital inside five years.
Size any position against that, not against the base case.

**The cost of the all-cold decision, stated plainly:** December EBITDA is about **$1,900**. Baghdad's winter
trough runs at 47% of the annual average and there is no hot menu to carry it. The deck shows this on-slide
rather than burying it, and the model cuts 30% of the roster in months below 0.60 seasonality.

**The weakness to push on:** the franchisor's *recurring* revenue — royalty plus central supply — does not cover
head office until Year 5. A third of Year-5 EBITDA comes from two company-owned stores. On these assumptions
SHABIM reaches Year 5 as a promising franchisor, not yet a self-sustaining one.

**Egypt is excluded** from the first five years: both formats return negative unit EBITDA at a corrected
price index, and the core argument does not transfer — Cairo has roughly 5–15 days a year above 40 °C
against Baghdad's ~134.

---

## What the product research changed

Six independent dossiers (`research/products/`) traced each SKU's real chronology. Three findings moved
numbers or copy:

1. **The −80 format is fourteen months old, not established.** It was invented at 三立方, 58 Yongkang Road,
   Shanghai, on 20 June 2025 — three weeks before the 15 July rainstorm-queue that made it national news.
   Tokyo 2010 invented the *drink*; Shanghai 2025 invented the *spectacle*. The deck no longer conflates them.
2. **The ice-vessel coffee is fifty years older than the English-language internet says** (Kobe 1973/74, not
   2022) — and Dubai already has two operators. Iraq, Saudi and Kuwait have none. The white-space claim was
   narrowed to what is true.
3. **The juice/slush station was under-provisioned at $9,000.** A $700–1,800 granita machine does not survive
   a Baghdad summer on 8–12 hours of grid power; the spec is a Ugolini HT 3/1 or Elmeco FC-3 at $5,500–7,500
   plus a commercial press. Raised to **$14,000**. بَرَد is 21% of units — this was the third under-provisioned line.

Still open from that research: **بَرَد is sold at one flat price that hides a 40-point gross-margin spread**
(slush 78.3% vs pomegranate 38.2%). Tier it before opening.

---

## Open items, in the order to close them

1. Trademark clearance searches — SAIP (Saudi) and the Iraqi Ministry of Industry and Minerals.
2. Supplier quotes for the nine imported equipment categories.
3. Three landlord conversations on named Baghdad corners, to replace an estimated rent with a real one.
4. A tax ruling on whether SHABIM is a "deluxe" venue for Iraq's 10% sales tax (assumed yes in the base case).
5. Confirm three verse wordings against printed critical editions before they go on a primary SKU.
6. Whether Iraq is a Madrid Protocol party — decides one international filing versus seven national ones.
7. Price-tier the بَرَد line; the flat 5,000 IQD is the largest remaining pricing defect on the menu.
8. Re-verify three model-knowledge claims in the لُؤلُؤ dossier before showing them to an investor:
   the 2019 Japanese buzzword listing, Mixue's outlet count at IPO, and The Alley's counterfeit ratio.
9. Talabat and Lezzoo Iraq commission rates, from a merchant conversation rather than a regional average.
10. Test whether شبم carries any unintended sense in Baghdadi, Basrawi, Khaliji, Egyptian or Levantine colloquial.
