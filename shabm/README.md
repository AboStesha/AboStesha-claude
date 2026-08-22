# شَبِم · SHBM

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

### 2. The Latin name is SHBM — four consonants, and that is deliberate

The brand is **Arabic first and Arabic only**: the name, the menu, the packaging, the signage, the app.
**SHBM** is a debossed monogram for lids, uniforms and the facade — never a spoken name, never expanded.

The trade-off was raised and accepted by the founder: SHBM has no vowel between B and M, so a non-Arabic
speaker cannot pronounce it on sight. That is the cost of refusing to translate. The two alternatives were
worse for different reasons — SHABAM sits one letter from **SHIBAM**, the UNESCO city in Ḥaḍramawt *and*
Shibam Coffee Co., which holds a filed USPTO mark (97667800) in the same Nice classes; and SHABIM buys
pronounceability by making the Latin form the real name, which is the opposite of the brand's position.

Practical consequence: file the Arabic mark **شَبِم** as the primary, with SHBM as a device mark alongside.

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
| `deck/ref.py` | Renders the cube drawings to PNG, to hand an image model as a visual reference. |
| `deck/img/` | **Drop chosen renders here.** The build finds them by filename and inlines them. See `img/README.md`. |
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
It is **genuinely cold inside**: staff wear winter coats in August. The envelope is solid — nobody can see in
from any angle — and it carries **exactly three square openings** in one row on the service face and nothing
else: right, a touchscreen the customer orders on themselves; centre, a cup-return hatch; left, a collection
hatch with the order number cut into the ice above it. Each is a sealed pass-through with an opaque back panel.
No cashier, no queue at a window.

An ice bar counter and stools, cast from the same material, are **bonded to the block** and wrap three sides —
both flanks and the whole back. The service face stays clear: no seating in front of the openings. AC vents
through the cube body and throws a fine mist, so from a distance the whole thing appears to be steaming with cold.

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
| Baghdad flagship CAPEX | **$371,063** (was $538,944 — rebuilt line by line, see below) |
| Year-2 revenue / EBITDA | $719,250 / $183,426 (26%) |
| Payback / 5-year IRR | **31.8 months** / 42% |
| Iraq franchised Shard — the volume format | $184,842 CAPEX · 38.5-month payback · 36.8% IRR |
| Franchisor, Year 5 | 47 units · $25,357,456 system sales · $1,551,723 EBITDA |
| Raise / return | $1.75M · 45% IRR · 7.5× MOIC |
| *Dubai company-owned Cube, for comparison* | *$573,372 CAPEX · $1,467,270 revenue · 36% EBITDA · 20.6-month payback · 74% IRR* |

**Bear case:** the unit stays cash-positive every month but never repays its capital inside five years.
Size any position against that, not against the base case.

**The cost of the all-cold decision, stated plainly:** December EBITDA is about **$1,900**. Baghdad's winter
trough runs at 47% of the annual average and there is no hot menu to carry it. The deck shows this on-slide
rather than burying it, and the model cuts 30% of the roster in months below 0.60 seasonality.

**The weakness to push on:** the franchisor's *recurring* revenue — royalty plus central supply — does not cover
head office until Year 5. A third of Year-5 EBITDA comes from two company-owned stores.

**Egypt is excluded** from the first five years: both formats return negative unit EBITDA at a corrected
price index, and Cairo has roughly 5–15 days a year above 40 °C against Baghdad's ~134.

---

## The CAPEX was too high. It was rebuilt line by line.

The first build said **$538,944** for a 25 m² booth — about $21,500 per square metre, which is not credible.
It carried four real errors, all now corrected in `financials/assumptions.json` as a 28-line equipment
schedule that the model sums into buckets (nothing is typed twice):

1. **The $45,000 franchise toolkit was on the unit.** The disclosure document, operations manual, training
   curriculum and site-adaptation kit are written once and used by every unit after the first. That is a
   franchisor cost. It was moved to franchisor Year-1 head office — carried, not deleted.
2. **A three-machine ice plant at $34,000** where mature demand is 24 vessels/day and one Clinebell CB300
   yields 30–42. Cut to one machine at $6,500; the second is scheduled for Year 2, because at peak
   (≈38/day in July) one unit runs at 100% with no redundancy. That is disclosed on the slide.
3. **A lump-sum shell estimate** instead of an area calculation. The envelope is now priced per m²:
   98 m² of 25 mm cast acrylic at $153, 98 m² of multiwall polycarbonate at $45, plus frame, freight and erection.

4. **$18,300 of finish and identity inside a block nobody can see.** The envelope is solid, the three
   openings are sealed pass-throughs with opaque back panels, and no customer ever enters. So the interior
   carries no engraved menu wall, no screens sunk into ice, no designed finish: interior fitout drops from
   $520 to **$340/m²** (cold-room panel, stainless, epoxy floor with drains) and interior lighting becomes
   an industrial white strip. The edge-lit carving and the carved name stay where they earn their keep —
   on the outside. The menu moved to where it belongs: the ordering screen, which is better than a carved
   wall anyway — it changes without a joiner, shows sold-out the moment it happens, and can push one item
   over another. Marketing photography of the interior is AI-generated from the design spec, so there is no
   shoot day, no crew, and no closed store.

Also raised, not cut: the juice/slush station went **$9,000 → $14,000**, because a $700–1,800 granita machine
does not survive a Baghdad summer on 8–12 hours of grid power, and بَرَد is 21% of units.

Net: **$371,063**, and payback falls from 42.5 to **31.8 months** — inside the 24–36 month band Gulf investors
underwrite to, where it previously sat outside.

---

## Dubai vs Baghdad

A company-owned Dubai Cube is modelled as `dubai_own` for a like-for-like comparison. It is **better on every
financial line**: 20.6-month payback against 31.8, 74% IRR against 42%, 36% EBITDA margin against 26%. The deck
says so plainly rather than burying it.

Baghdad still goes first, for reasons the model does not price: the first unit will be wrong somewhere, and
learning on $371k is cheaper than learning on $573k; Iraq has 1.8 branded outlets per million people and no
competitor, while Dubai has 3,257 coffee shops and **two operators already serving coffee in an ice cube**
(The Pods, La Letizia); and the founder can be on site daily in year one.

**The number to attack in the Dubai case is rent.** The model carries $6,820/month, which is plausible for a
street or community-mall pitch and clearly low for super-prime. Doubling it costs roughly six months of payback.

The strategic conclusion the deck now draws: Dubai in year two or three as a **company-owned** unit, not a
franchise — its economics are too strong to give away at this stage.

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

## Photography

The deck ships with hand-authored SVG drawings in every image slot, so it is complete without a single
external file. Thirty photoreal renders were generated on Higgsfield against those drawings as visual
references — exterior day/night/dawn/rear, the three openings, the interior and production line, all six
products, packaging, uniform, business card, engraved menu.

**They are not in the HTML.** This session's egress policy blocks the CDN those renders are served from
(`d8j0ntlcm91z4.cloudfront.net` returns 403 at the proxy), so the bytes cannot be fetched here, and the
published page runs under a CSP that blocks external images anyway — every image has to be inlined.

To put them in: download the picks from the Higgsfield gallery, drop them into `deck/img/` under the
filenames listed in `deck/img/README.md`, then run `python3 build_ar.py && python3 mkpreview.py`. Each slot
falls back to its drawing when the file is absent, so a partial set is fine and nothing breaks.

---

## Open items, in the order to close them

1. Trademark clearance searches — SAIP (Saudi) and the Iraqi Ministry of Industry and Minerals.
2. Supplier quotes for the nine imported equipment categories.
3. Three landlord conversations on named Baghdad corners, to replace an estimated rent with a real one.
4. A tax ruling on whether SHBM is a "deluxe" venue for Iraq's 10% sales tax (assumed yes in the base case).
5. Confirm three verse wordings against printed critical editions before they go on a primary SKU.
6. Whether Iraq is a Madrid Protocol party — decides one international filing versus seven national ones.
7. Price-tier the بَرَد line; the flat 5,000 IQD is the largest remaining pricing defect on the menu.
8. **Two contractor bids on the shell and installation.** The imported equipment lines are priced off observed
   bands; the build lines are estimates and are the last numbers that should move before signing.
9. **A real Dubai rent quote** for a named pitch. It is the single assumption the Dubai case turns on.
10. Re-verify three model-knowledge claims in the لُؤلُؤ dossier before showing them to an investor:
   the 2019 Japanese buzzword listing, Mixue's outlet count at IPO, and The Alley's counterfeit ratio.
11. Talabat and Lezzoo Iraq commission rates, from a merchant conversation rather than a regional average.
12. Test whether شبم carries any unintended sense in Baghdadi, Basrawi, Khaliji, Egyptian or Levantine colloquial.
