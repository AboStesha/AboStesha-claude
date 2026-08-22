# شَبِم · SHABIM

An Arabic cold-drinks and frozen-dessert brand engineered for 45 °C — Baghdad first, then the Gulf.

**Investor deck:** https://claude.ai/code/artifact/809bf328-6f1c-449a-9369-ed31b64e0b2d

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

---

## What is in here

| Path | What it is |
|---|---|
| `deck/deck.html` | The investor deck. Generated — edit `deck/build.py`, not this. |
| `deck/build.py` | Deck generator. Pulls every number live from the model output. |
| `deck/style.css` | Design system: tokens, light/dark, type scale, components. |
| `financials/model.py` | The financial model. Three entities: flagship, franchisee, franchisor. |
| `financials/assumptions.json` | Every input, each with a sourcing note graded H (sourced) or E (estimate). |
| `financials/model_output.json` | Model output, consumed by the deck. |
| `research/` | Seven research dossiers with full sourcing. |
| `research/poetry_report.md` | The 58-page language and poetry verification. Read §2, §3 and §4. |

Rebuild after changing any assumption:

```bash
cd financials && python3 model.py && cd ../deck && python3 build.py
```

---

## Headline numbers

| | |
|---|---|
| Baghdad flagship CAPEX | $448,784 |
| Year-2 revenue / EBITDA | $706,457 / $157,648 (22%) |
| Payback / 5-year IRR | 42 months / 30% |
| Iraq franchised Shard — the volume format | $168,792 CAPEX · 41-month payback · 33% IRR |
| Franchisor, Year 5 | 47 units · $24,709,709 system sales · $1,424,457 EBITDA |
| Raise / return | $1.75M · 42% IRR · 6.8× MOIC |

**Bear case:** the unit stays cash-positive every month but never repays its capital inside five years.
Size any position against that, not against the base case.

**The weakness to push on:** the franchisor's *recurring* revenue — royalty plus central supply — does not cover
head office until Year 5, and even then only by $181,409. A third of Year-5 EBITDA comes from two company-owned
stores. On these assumptions SHABIM reaches Year 5 as a promising franchisor, not yet a self-sustaining one.

**Egypt is excluded** from the first five years: both formats return negative unit EBITDA at a corrected
price index, and the core argument does not transfer — Cairo has roughly 5–15 days a year above 40 °C
against Baghdad's ~134.

---

## Open items, in the order to close them

1. Trademark clearance searches — SAIP (Saudi) and the Iraqi Ministry of Industry and Minerals.
2. Supplier quotes for the nine imported equipment categories.
3. Three landlord conversations on named Baghdad corners, to replace an estimated rent with a real one.
4. A tax ruling on whether SHABIM is a "deluxe" venue for Iraq's 10% sales tax (assumed yes in the base case).
5. Confirm three verse wordings against printed critical editions before they go on a primary SKU.
6. Whether Iraq is a Madrid Protocol party — decides one international filing versus seven national ones.
7. Talabat and Lezzoo Iraq commission rates, from a merchant conversation rather than a regional average.
8. Test whether شبم carries any unintended sense in Baghdadi, Basrawi, Khaliji, Egyptian or Levantine colloquial.
