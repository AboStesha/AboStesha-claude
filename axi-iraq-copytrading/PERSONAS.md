# Axi Iraq persona library (copy-trading reel)

Source: client Google Drive folder `10-fSuuCuD-gmL-NVcGCu5xUgdUUEzSOd`. The client owns full rights to these images.
There are 6 persona sub-folders and 39 images. All 39 were downloaded byte-exact and opened cleanly in PIL.

- Local files: `src/personas/<Persona>/<original filename>`
- Contact sheets: `src/personas/<Persona>/_contact.png` and `src/personas/_overview.png`. Each thumbnail carries its code (AE01, AS01...).
- 9:16 crop boxes: `src/personas/_crops_9x16.json`. Each box is `[x0, y0, x1, y1]` in source pixels and uses the full image height. I checked every crop visually.
- `src/personas/test.png` is a byte-identical duplicate of `Sarmad/AxiIraq_Sarmad_02_CloseUp.png` (same md5).

## How the library is built

- **The core look is a clean grey studio.** Sarmad, Rojin and Noor each have a numbered `AxiIraq_` set, and Asmaa's AS01 and AS12-AS15 share the same look:
  - a seamless cool blue-grey paper backdrop (roughly RGB 150-190 on the lit side, 75-100 in the falloff)
  - a soft vignette
  - a large soft key from camera-left/front, so the backdrop is brighter on the left and falls off darker to the right
  - a gentle rim light and a cool, neutral, low-saturation grade
- **Signature prop.** Every persona carries an Axi-red object (phone, tablet or laptop). This brand-red accent repeats across all the shots and matches the Axi global persona cards (AE01, SE02).
- **Wardrobe palette.** The clothes stay neutral: charcoal, light grey, ivory/cream, black. Against the grey backdrop, the red prop is the only saturated colour.
- **The standard numbered shot types are:**
  - 01 Main: 3:4 portrait, waist/thigh-up
  - 02 CloseUp: 1:1
  - 03 FullLength or OverShoulder: 1:1
  - 04/05 Seated_Laptop: 1:1
  - Wide_Ad: 16:9 with large empty negative space on the left for copy
  - Place: 16:9 cinematic Iraqi landscape with a tiny figure
- **Gaps for this reel.** No image shows family, a holiday or a beach, and none shows a real phone UI or the Axi Copy app. Those beats have to be generated with a persona as the identity reference, or built as motion-graphics glass cards over the grey frames. The Place shots are misty and moody, not sunny holiday images. Grade them warmer or use them for "your time, your freedom".
- **Resolution for Seedance i2v.**
  - 2048 squares crop to 1152x2048, 3:4 frames to 1314x2336, 3:4-ish (1792x2400) frames to 1350x2400, and 4K 16:9 frames to 1215x2160. All of these are excellent.
  - 2752x1536 16:9 frames crop to 864x1536. That is fine for 720p, but needs about 1.25x upscaling for 1080x1920.
  - The composites (AE01, SE02) are too small to use as start frames. Use them only as identity or style references.

## Per-image catalogue

Legend:
- **Clean grey?** asks whether the background is the clean grey studio described above.
- **i2v start frame** rates the image as a Seedance image-to-video start frame: A = excellent, B = usable, C = reference only.
- **9:16 crop** gives the box from `_crops_9x16.json`.

### Aesha (woman, approx. 25-30). Axi global persona card. 1 image

| Code | File | Description |
|---|---|---|
| AE01 | `Aesha/Aesha.png` (1711x834, RGBA) | **Composite brand card**, not a single photo. It is labelled "Aisha / Middle East". The left panel is a 3/4 portrait holding a red phone. Three small panels show a close-up with the red phone, a medium shot with the phone and a medium shot with a red laptop. A wide panel shows a tiny figure walking through dark blue volcanic rock. Outfit: white hijab, white turtleneck, oversized white blazer. Background: a pale grey-to-white gradient that fades out at the bottom, in the Axi global style. Soft, even, high-key lighting. **Clean grey: yes (Axi global gradient).** **i2v: C.** Each panel is only about 300-575 px wide, so the image is too small for a start frame. Use it as an identity and wardrobe reference, or as the style template for the global look (fade-to-white grey gradient, red prop, rock "journey" landscape). Roles: young beginner investor, "no trading skills needed". She would have to be regenerated at high resolution first. |

### Asmaa (woman, approx. 45-55). The mature, trusted figure. 15 images

She always wears a blush/beige chiffon hijab and an ivory/cream tailored blazer, with a wedding ring. She has a warm, composed smile.
AS02-AS11 are **Axi Academy TV-studio** frames, not clean grey: a red-and-white Axi set with baked-in on-screen graphics about forex topics.
AS01 and AS12-AS15 are clean grey studio frames.

| Code | File | Framing / pose | Background / location | Lighting | Seedance i2v (9:16 crop) | Story roles |
|---|---|---|---|---|---|---|
| AS01 | `hf_20261016_001128_...png` (3840x2160) | Medium, waist-up. Body angled, face to camera, holding a red phone in both hands at chest height | **Clean grey** blue-grey studio | Soft key from camera-left, even | **B.** Crop `[1082,0,2297,2160]` is tight: it trims the right shoulder and the phone sits at the bottom-left edge. Outpainting top and bottom to 9:16 is better | Busy mother or parent glancing at the app; "no huge capital"; the moment a "trade copied" notification arrives |
| AS02 | `سعر الشراء او البيع.png` ("buy/sell price") (2752x1536) | Medium, standing behind a glass desk, hands on the desk | Axi TV studio with an EURUSD SELL 1.0850 / spread 2 pips / BUY board, a ticker and a red Axi logo | Bright broadcast lighting | **C/B.** Crop `[1384,0,2248,1536]`. Busy set; baked-in AI text has errors (ticker "EURPCKI", mirrored text) | Educator cameo only. Off-topic (spreads) |
| AS03 | `ما هي الوحدة ؟.png` ("what is a lot") | Medium, at a glass desk with stacks of gold coins (micro/mini/standard) | Axi studio, "1 LOT = 100,000 UNITS" screen | Broadcast | **C/B.** Crop `[1357,0,2221,1536]` | Educator only. Off-topic |
| AS04 | `رسوم التبييت.png` ("swap fees") (1344x752, low-res) | Seated at a curved news desk, hands clasped | Dark night-city studio with a clock and "OVERNIGHT FEE (SWAP)" screen | Moody, dark blue | **C.** Crop `[649,0,1072,752]` gives only 423x752. Too small | Avoid |
| AS05 | `hf_20260816_164354_...png` (2752x1536) | **Close-up**, head and shoulders, direct eye contact, gentle smile | Out-of-focus "axi / Axi Academy" red screen with a red diagonal | Soft, flattering | **B+.** Crop `[1302,0,2166,1536]` keeps the face clean, with a blurred red brand backdrop | "Trusted Axi voice" or educator; could also be an approving nod at the end card. Not grey, but on-brand red |
| AS06 | `وقف الخسارة.png` ("stop loss") | Medium-3/4, standing, gesturing toward the screen | Grey-black studio with a "STOP LOSS" red-candle chart and a red Axi logo | Broadcast | **C/B.** Crop `[1439,0,2303,1536]` loses the screen | Avoid. Shows losses or risk |
| AS07 | `جني الأرباح.png` ("take profit") | Medium, seated at a white desk, hands clasped | Green "TAKE PROFIT" rising-candle screen, white wall with a red Axi logo; green colour cast | Bright | **C/B.** Crop `[972,0,1836,1536]`; green cast on her face | Avoid. Implies profit promises (compliance) and the green clashes with the grey look |
| AS08 | `ما هو ميتا تريدر.png` ("what is MetaTrader") | Medium-3/4, standing, **holding up a phone showing a candle chart** next to an MT4-style monitor | Warm beige wall with red Axi diagonal and logo | Warm, even | **B.** Crop `[1123,0,1987,1536]` keeps the phone in frame. The baked-in platform UI is garbled | "Watch and analyse the trader's past performance on the app" (a phone in hand). Warm, not grey |
| AS09 | `الرافعة المالية.png` ("leverage") | Medium, seated at a white desk | "LEVERAGE 1:1000" seesaw with gold bars, red/white Axi set | Bright | **C.** Crop `[1577,0,2441,1536]` | **Avoid** (leverage messaging is a compliance risk) |
| AS10 | `الهامش.png` ("margin") | Medium, standing, hands clasped | Navy studio with a margin-level gauge (margin call / stop out) | Cool blue | **C.** Crop `[504,0,1368,1536]` | Avoid |
| AS11 | `hf_20260816_163908_...png` (RGBA) | Medium, seated at a white desk, hands clasped, smiling | Bright white wall with a large red "axi" logo; red falling-chart screen on the left | Bright high-key | **B.** Crop `[586,0,1450,1536]`: clean white/red Axi backdrop | Brand sign-off or "Axi Iraq is with you" end-card presenter |
| AS12 | `hf_20260911_134642_...png` (2048x2048) | 3/4 length to the thighs, body turned, looking at camera, red phone in both hands | **Clean grey** studio | Soft key camera-left | **A.** Crop `[448,0,1600,2048]` | Copier checking the app; "just watch, they do the work"; parent |
| AS13 | `hf_20260911_134630_abe6...png` (RGBA) | 3/4 to full length, long ivory coat, red tablet/folder held at the hip | **Clean grey** | Soft key camera-left | **A.** Crop `[448,0,1600,2048]` | Confident investor; "on your way" walk-in; an i2v push-in |
| AS14 | `hf_20260911_134630_a179...png` (1792x2400) | Medium-3/4, body turned three-quarters, smiling, red phone raised at chest | **Clean grey** | Soft key, slight rim | **A.** Crop `[221,0,1571,2400]` | Notification or app-reveal beat ("a pro just opened a trade for you"); a relaxed copier |
| AS15 | `hf_20260911_134630_2cd5...png` (2048x2048) | **Extreme close-up** of the face, serious and direct gaze, red phone raised into frame on the right | **Clean grey** | Soft, contrasty | **A.** Crop `[448,0,1600,2048]`: face is complete, phone partly in | **Hook frame** ("Still trying to trade alone?") or a deadpan pattern-interrupt |

### Sarmad (man, approx. 45-50). The "pro trader" archetype. 6 images

He has salt-and-pepper hair, a moustache and light stubble, and an assured, slightly serious look. He wears a black fine-knit turtleneck with a charcoal herringbone blazer and trousers. Props: red phone and red laptop.

| Code | File | Framing / pose | Background | Lighting | Seedance i2v (9:16 crop) | Story roles |
|---|---|---|---|---|---|---|
| SA01 | `AxiIraq_Sarmad_01_Main.png` (1744x2336) | Medium 3/4 to the hips, body angled, head tilted, direct gaze, red phone in both hands low | **Clean grey** studio | Soft key camera-left, backdrop darker on the right | **A.** Crop `[215,0,1529,2336]` | **Top strategy provider / pro trader** profile card (stats glass panel beside him) |
| SA02 | `AxiIraq_Sarmad_02_CloseUp.png` (2048x2048) | Close-up with a strong head tilt and intense gaze, red phone in the foreground bottom-left | **Clean grey** | Soft, moody | **A.** Crop `[346,0,1498,2048]` | **Hook** ("Let a pro trade for you"); expert close-up reaction |
| SA03 | `AxiIraq_Sarmad_03_FullLength.png` | Near full length (cut at the lower legs), standing front-on, phone in his right hand at the chest | **Clean grey**, faint window-light shape on the backdrop at bottom-left | Soft key | **A.** Crop `[448,0,1600,2048]` | "World-class traders" line-up; one of several traders sliding in |
| SA04 | `AxiIraq_Sarmad_04_Seated_Laptop.png` | Seated on a grey stool, red laptop on his knee, typing, looking at camera | **Clean grey** | Soft key | **A.** Crop `[325,0,1477,2048]` | **Pro doing the hard work** while you relax (split-screen against a copier on holiday) |
| SA05 | `AxiIraq_Sarmad_05_Wide_Ad.png` (2752x1536) | Medium, subject on the right third, phone at the waist; left 60% is empty grey | **Clean grey**, Wide_Ad | Soft key | **B+.** Crop `[1687,0,2551,1536]` gives 864x1536 (needs about 1.25x upscale for 1080p). The 16:9 original is ideal for a horizontal glass card or a copy-space layout | Trader profile with stats; CTA frame |
| SA06 | `AxiIraq_Sarmad_06_Place_Kurdistan.png` | Extreme wide: a tiny figure on a ridge above layered misty Kurdistan mountains | Outdoor, Kurdistan mountains at dawn or dusk | Hazy, low-contrast, cool | **B.** Crop `[944,0,1808,1536]` gives a vertical misty landscape with a tiny figure | "Global reach" or vision; "while you're out exploring, they trade". Moody, not a sunny holiday |

### Saeed (man, approx. 28-33). Axi global persona. 2 images

He has curly black hair, a trimmed beard and an intense gaze. He wears a black turtleneck under a black wool overshirt/chore jacket. Prop: red phone.

| Code | File | Framing / pose | Background | Lighting | Seedance i2v (9:16 crop) | Story roles |
|---|---|---|---|---|---|---|
| SE01 | `saeed cu.png` (3840x2160) | Medium close-up (chest-up), front-on, red phone held at the chest, serious direct gaze | **Clean grey-blue gradient fading to white at the bottom**, the Axi global look | Soft, even, slightly top-lit | **A.** Crop `[1274,0,2489,2160]` cuts the shoulders and keeps the face and phone | Young professional and beginner, "no trading skills needed"; "everything from one app"; hook gaze |
| SE02 | `Saeed.png` (1710x819, RGBA) | **Composite brand card** "Saeed / Middle East": 3/4 portrait, close-up, two full-length panels, and a figure under a red-rock arch | Grey-to-white gradient panels and a rock landscape | Even | **C.** Panels are too small. Use as an identity and style reference only | Reference |

### Rojin (woman, approx. 24-30). Kurdish young professional. 8 images

She has very long straight black hair, a polished make-up look and a warm smile. She wears a light-grey suit (blazer and trousers) with an ivory silk blouse and nude heels. Props: red tablet and red laptop.

| Code | File | Framing / pose | Background | Lighting | Seedance i2v (9:16 crop) | Story roles |
|---|---|---|---|---|---|---|
| RO01 | `AxiIraq_Rojin_01_Main.png` (1744x2336) | Medium 3/4 to the hips, front-on, red tablet hugged to the chest, soft smile | **Clean grey** | Soft key camera-left | **A.** Crop `[215,0,1529,2336]` | **Beginner / new investor** ("no experience needed"); copier choosing a trader |
| RO02 | `AxiIraq_Rojin_02_CloseUp.png` | Close-up, red tablet held up beside her face, direct gaze | **Clean grey** | Soft beauty light | **A.** Crop `[612,0,1764,2048]` | **Hook** (the tablet can become a glass "Axi Copy" screen); a "pick your pro" reveal |
| RO03 | `AxiIraq_Rojin_03_OverShoulder.png` | 3/4 length, back turned, looking over her shoulder, tablet at the hip | **Clean grey** | Soft key, rim on the hair | **A.** Crop `[448,0,1600,2048]` | Turn-to-camera transition ("Follow the best"); a whip-pan match cut |
| RO04 | `AxiIraq_Rojin_04_FullLength.png` | Full length head to toe, standing, tablet in her left hand | **Clean grey** studio floor and backdrop (cyclorama) | Soft key, floor shadow | **A.** Crop `[448,0,1600,2048]`; the subject is small, so allow a push-in | Walk-forward start frame; line-up of copiers |
| RO05 | `AxiIraq_Rojin_05_Seated_Laptop.png` | Seated on a stool, legs crossed, red laptop on her lap, typing, looking at camera | **Clean grey** | Soft key | **A.** Crop `[407,0,1559,2048]` | "Analyse their past performance"; choosing and setting a small amount |
| RO06 | `AxiIraq_Rojin_06_Walking.png` (1792x2400) | Medium-3/4, **walking toward camera**, big smile, hair in motion, tablet under her arm | **Clean grey** | Soft key | **A** (motion is built in). Crop `[257,0,1607,2400]` | **Carefree / stress-free** ("let the pros do the hard work"); energetic transition shot |
| RO07 | `AxiIraq_Rojin_07_Wide_Ad.png` (2752x1536) | Medium, subject on the right third, smiling, tablet at the chest; left side empty | **Clean grey**, Wide_Ad | Soft key | **B+.** Crop `[1742,0,2606,1536]`; the 16:9 original suits a copy-space or CTA layout | CTA ("Download the app"); end card |
| RO08 | `AxiIraq_Rojin_08_Place_Kurdistan.png` | Extreme wide: a tiny figure in the grey suit walking a dirt track in a green Kurdistan valley under misty mountains | Outdoor, Kurdistan valley | Overcast, misty | **B.** Crop `[944,0,1808,1536]` | **Freedom / time for yourself / travel** while the copied trader works. Needs a warmer grade for "holiday" |

### Noor (woman, approx. 30-35). Polished Baghdad professional. 7 images

She has long dark-brown hair, hazel eyes, small gold hoop earrings and a confident, slightly knowing smile. She wears a charcoal double-breasted suit with a black top and black heels. Props: red tablet and red laptop.

| Code | File | Framing / pose | Background | Lighting | Seedance i2v (9:16 crop) | Story roles |
|---|---|---|---|---|---|---|
| NO01 | `AxiIraq_Noor_01_Main.png` (1744x2336) | Medium 3/4 to the thighs, hand in pocket, tablet in her other hand | **Clean grey** | Soft key camera-left | **A.** Crop `[110,0,1424,2336]` | **Pro trader / strategy provider** (her authority suits it) or a smart, confident copier |
| NO02 | `AxiIraq_Noor_02_CloseUp.png` | Close-up, red tablet pressed beside her face, direct gaze | **Clean grey** | Soft, contrasty | **A.** Crop `[284,0,1436,2048]` | **Hook**; "the pros, in your pocket" |
| NO03 | `AxiIraq_Noor_03_OverShoulder.png` | 3/4 length, back turned, looking over her shoulder, tablet in hand | **Clean grey** | Soft key, hair rim | **A.** Crop `[346,0,1498,2048]` | Turn reveal; match cut with RO03 |
| NO04 | `AxiIraq_Noor_04_FullLength.png` (RGBA) | Full length head to toe, hand in pocket, tablet at her side | **Clean grey** cyclorama | Soft key, floor shadow | **A.** Crop `[448,0,1600,2048]`; small subject, so push in | Trader line-up ("hand-picked from around the world") |
| NO05 | `AxiIraq_Noor_05_Seated_Laptop.png` | Seated on a stool, legs crossed, red laptop, looking at camera | **Clean grey** | Soft key | **A.** Crop `[448,0,1600,2048]` | **Pro at work** or "analyse the stats" |
| NO06 | `AxiIraq_Noor_06_Wide_Ad.png` (2752x1536) | Medium, subject on the right third, using the tablet with both hands; left side empty | **Clean grey**, Wide_Ad | Soft key | **B+.** Crop `[1536,0,2400,1536]`; the 16:9 original suits copy space | Using the app; CTA |
| NO07 | `AxiIraq_Noor_07_Place_Tigris.png` (2752x1536) | Wide: Noor seen from behind or side, small in frame on the right, on the Tigris riverbank checking a glowing red phone; Baghdad skyline lights, palms and mist | Outdoor, Baghdad, Tigris at blue hour | Cool blue dusk with practical city lights | **B+.** Crop `[1439,0,2303,1536]` keeps her, the palms and the river | **"Your portfolio in your pocket" while you live your life**; local Iraqi pride; relaxed evening |

## Quick casting guide for the copy-trading reel

- **Hook (0-2 s, direct gaze close-ups):** SA02, AS15, RO02, NO02, SE01
- **"Pro traders from around the world":** Sarmad (SA01, SA03, SA04, SA05) and Noor (NO01, NO04, NO05) as the experts, shown as a line-up or as profile glass cards with stats
- **Beginner / "no skills, no big capital needed":** Rojin (RO01, RO05), Saeed (SE01), Asmaa (AS12, AS14)
- **"Watch and analyse past performance":** RO05, NO05, NO06, AS08 (phone with chart, but on a warm set)
- **"Relax, holiday, family; the pros do the work":** RO06 (walking, smiling), RO08 (Kurdistan valley), NO07 (Tigris at dusk), SA06 (mountains). No family or holiday image exists, so generate one with persona references.
- **App or notification beats (red phone or tablet):** AS14, AS12, AS15, SE01, NO06
- **CTA / end card with copy space:** SA05, RO07, NO06 (16:9 Wide_Ad), AS11 (white Axi logo wall)
- **Avoid for this reel:** AS02, AS03, AS04, AS06, AS07, AS09, AS10. They are off-topic forex-education sets with baked-in AI text, risk or leverage messaging, or green/red casts that break the grey look.
