v2 replaced because the client wants an institutional voice, not drama. Client note on v2: "I don't want the script to be like a drama emotional. I want it to be like a WORLD-CLASS INSTITUTION that can feel the trader because it's BUILT BY TRADERS. Change the whole script." (v2, the first-person «لا يفهم هذا الشعور إلا متداول» film, is in git `59d9caa`.)

# Axi Iraq · Brand film «نعرف» · final script v3 (60 s)

- **Format:** 60.000 s, 9:16, 1080x1920, 30 fps (f0–f1799). `f` = floor(t × 30). No voice-over. Music, sparse sound and on-screen Arabic carry everything.
- **Music:** `src/music/ad_music_60.wav` with `src/music/grid_60.json` (Mixkit #543 "A New Life", 128 BPM, beat 0.46875 s, bar 1.875 s). Every cut sits on a grid time. The one deliberate exception is the red card's exit at 57.250 (f1717), 2 frames after beat 122, so the card holds a full 1.0 s (IQ p44).
- **Facts:** every Axi claim maps to `docs/FACTS.md` (IDs in brackets). The research behind the moments is in `docs/EMOTION_MAP.md` (§3, §4). "IQ pNN" is a page of the Axi Iraq guidelines.
- **Cast:** the five approved faces (IQ p46): Noor, Aesha, Saeed, Sarmad, Rojin. One persona per shot.
- **Voice:** Axi, an institution that has served traders since 2007 and was built by traders [1.1, 1.3, 1.4]. It speaks once, as an unseen «نحن», with calm authority. Its empathy is knowledge: it names the trader's moments with a watchmaker's precision (a minute, a second, a session, the close, a night, a morning) and states them as observed truths, never as confessions.
- **Spine:** the first 45 seconds are **one Arabic sentence**. One verb, «نعرف», governs fourteen things the house knows: eight hard moments, the silence of the breath, and on the LIFT «ونعرف الصباح أيضا» with six good ones. The sentence closes on «لأننا في آكسي متداولون مثلك». Then two plain statements, «نسمي المخاطر بأسمائها» and «معك في كل صفقة», and the signature on the C-major arrival: «بناها متداولون / من أجل المتداولين».

---

## 1. Scoring the three drafts

Scores are 1–10 per criterion.

| Draft | Institutional authority, restraint | Trader feels understood | Hardest and best, truthfully | Line quality, screenshot-ability | Clarity without VO | Compliance | Cinematic fit | **Total /70** |
|---|---|---|---|---|---|---|---|---|
| **A · «البيت الذي يعرف»** (one «نعرف» sentence) | **10** | 9 | 9 | 7 | **8** | **9** | **9** | **61** |
| **B · Principles learned the hard way** (codex 01–10) | 8 | 7 | 8 | **9** | 8 | 7 | 8 | 55 |
| **C · «ساعات المتداول»** (time-coded log) | 8 | **9** | 9 | 8 | 6 | 7 | 8 | 55 |

**A: strengths.**
- It is the client's sentence turned into grammar. "An institution that can feel the trader because it is built by traders" becomes «نعرف … لأننا في آكسي متداولون مثلك»: the empathy is knowledge, and the reason is the brand line.
- One voice, no «أنا», no adjective of pain, no question or exclamation marks. The drama is removed at the level of grammar, not only of wording.
- The best directing grammar of the three: a locked, observing camera before 30.000 and a forward one after it; twins that return to the same place (window, rock, river); the type never flinches on the stabs.
- The cleanest compliance: «بقرار اتخذته بنفسك» keeps every decision with the trader, «أيا كانت النتيجة» is outcome-neutral, and «ونسمي المخاطر بأسمائها» turns the risk strip into part of the voice.

**A: weaknesses (all fixed in v3).**
- «والشك» alone is the weakest card in the film: one generic word.
- «والصبر الذي يبدو كأنه لا شيء» can be read as "patience is worthless".
- «كتبت في الهدوء», «حين يهدأ الضجيج» and «والهدوء» use one root three times in 32 seconds, and "in calm" is softer than the film's time motif.
- «نشارك ما تعلمناه» is generic, needs Legal, and takes a bar from the payoff, which gets only one bar (5 words in 1.875 s).
- Several holds are too short to read: line 2 of the loss lands at 9.375 and has 0.5 s; «حين يهدأ الضجيج» lands at 34.69 and is still settling at the cut; «معك في كل صفقة» at one word per beat finishes on the cut.
- It assumes three things the delivered stills don't give: N2 is not N1's framing, R2 has no notebook, and N1 has Noor one step from the quay edge. Its anger plate, `se_154022`, puts Saeed on a rock edge in a dark beat, with his head where the type must sit.
- The end card repeats the brand line, and the pill «أرسله لمتداول يعرف» leaves "knows what?" open.

**B: strengths.** The most screenshot-ready lines («القاعدة لا تنكسر / إلا بيد من كتبها», «الهدوء ليس غياب الخوف»). The best hinge idea: the night line does not vanish on the LIFT, it stays dimmed while the bright line arrives beneath it, so nothing is "cured". The matched eye-line spec for the face chain.
**B: weaknesses.** Principles are a mentor's voice, not an institution that feels the trader. Several lines edge toward advice («الانتظار أيضا قرار», «تقاس الصفقة بتنفيذها لا بنتيجتها»). «تعلمناها أمام الشاشة» claims Axi's staff learned every lesson the hard way, which goes past FACTS 1.4, as v2's «عشناها مثلك» did. Folios 01–10 read as a listicle, and «03» appearing twice confuses.

**C: strengths.** The most insider observations: «الدقيقة التالية / أخطر من الخسارة نفسها», «الشك لا يأتي / أثناء الجلسة», «وقف الخسارة / جزء من العمل». The hinge as a number changing in place on the LIFT. «منذ 2007» as the house mark. One fixed text axis: the words never move, the world changes under them.
**C: weaknesses.** Three layers of reading per beat (time code, chapter word, line). Time codes don't travel across the Arab world's time zones and are not screenshot cards on their own. Five people in five places pretend to be one trader's day. Doubt on N1 puts Noor at a waterline at night, which the safety rules forbid.

### Decision

**Backbone: Draft A.** Its single «نعرف» sentence is the only structure that dramatizes the brief itself: an institution that knows these moments, because it is made of traders.

| Graft | From | What | Where |
|---|---|---|---|
| 1 | **C** | Doubt becomes an insider truth: «والشك / بعد الإغلاق» (doubt arrives after the close, never during the session). Its picture is Noor riding down after the day is over | B07 |
| 2 | **C** | One fixed text slot for the whole film. The words always sit in the same place; only the world changes under them | All beats |
| 3 | **C** | «منذ 2007» under the Axi logo on the end card [1.1, S19] | B22 |
| 4 | **B** | The night is not erased: «والليالي الطويلة» stays on screen through the breath, dimming to 35%, and «ونعرف الصباح أيضا» settles beneath it on the LIFT | B08 → B10 |
| 5 | **B** | The face chain's matched spec: eyes at the same height, top of head at or below y≈640, same lens, same drift, sun from frame right | B16 |
| New | | «قبل الجلسة» replaces «في الهدوء» in the rule twins. It completes the time motif (minute, second, session, minute, close) and frees «الهدوء» for the calm beat | B04, B13 |
| New | | «والصبر / الذي لا يراه أحد» replaces «الذي يبدو كأنه لا شيء». It cannot be misread, and it fits the picture: the crowd roars for someone else | B12 |
| New | | «نشارك ما تعلمناه» is dropped. The payoff «لأننا في آكسي / متداولون مثلك» gets two full bars | B16 |
| New | | Anger moves to Saeed seated on broad rock (`se_150800`), contained and with no edge in frame. The same plate at first light carries «نسمي المخاطر بأسمائها», so the twin is exact | B05 ↔ B17 |
| New | | Every hold retimed for reading (§7). The CTA becomes «شاركه مع متداول تعرفه», which echoes «نعرف» and is unambiguous | All |

**Not taken:** B's folios and its «تعلمناها أمام الشاشة» (overclaim); C's time codes (busy, time-zone bound) and its flash-forward hook; the 1923 quote on screen (it would add a second voice to a film whose authority comes from one; it lives in the caption, and §14 has the on-screen swap).

---

## 2. The voice

**What changed from v2.** Every confession became an observed truth.

| v2 (first person, drama) | v3 (the house, knowledge) |
|---|---|
| «سقط السعر / وسقط قلبي معه» | «والصمت / الذي يلي الخسارة» |
| «وعدت نفسي / ثم كسرت وعدي بيدي» | «وقاعدة كتبت قبل الجلسة / وكسرت في دقيقة» |
| «أريد أن أنتقم الآن / والسوق لا يعرف اسمي» | «والصفقة التالية / حين يكتبها الغضب» |
| «قلت لهم أنا بخير / ولم أكن بخير» | «والابتسامة التي تخفي / يوما صعبا» |
| «هل أنا أهل لهذا؟» | «والشك / بعد الإغلاق» |
| «حين انطفأت الشاشة / انطفأ شيء بداخلي» | «والليالي الطويلة», then silence |
| «خسرت الصفقة / ولم أخسر نفسي» | «ونعرف الصباح أيضا» |
| «تحرك السعر / وقلبي في مكانه» | «والهدوء / أيا كانت النتيجة» |

**Rules of the voice.**
1. **One sentence, one verb.** «نعرف» is said twice: at frame 0, and on the LIFT («ونعرف الصباح أيضا»). Every other line from 3.75 to 45.0 is an object of it, so each starts with «و». The litany is the rhythm.
2. **«نحن», never «أنا».** The house is unseen. The only "you" is in «مثلك», «بنفسك», «معك», which carry no gender without diacritics.
3. **Nouns and passive forms.** الدقيقة، الثانية، الصمت، القاعدة، الصفقة، الابتسامة، الشك، الليالي، الصباح، الوضوح، الصبر، الثقة، الهدوء. Passive past forms (كتبت، كسرت، احترمت) read the same for a man or a woman.
4. **No adjectives of pain, no question marks, no exclamation marks, no imperatives** (except the share pill on the end card).
5. **Units of time are the empathy.** The minute before the open, the second before the decision, the rule written before the session and broken in a minute, the doubt after the close, the long nights, the morning. Precision is how an insider shows he has been there.
6. **The risk is named, never removed.** The night stays on screen under the morning; the wind keeps blowing when Saeed faces it; calm holds "whatever the outcome".

---

## 3. Directing grammar

1. **The camera is the house.** Before 30.000 it observes: locked off, long lens, symmetrical one-point frames, the human small against glass, rock and river. From the LIFT it moves forward. It walks beside a trader exactly once, on «معك في كل صفقة».
2. **Twins** return to the same place, graded night and day from one plate:

| Persona | Hard | Good | The rhyme |
|---|---|---|---|
| **Sarmad** | B02 the second before / B08 the long nights | B10 the morning | The same window, night → dawn, mirror cut on 30.000. The night line stays under the morning line |
| **Rojin** | B04 the rule broken | B13 the rule kept | The same rock and notebook. Line 1 is the same layer to the pixel; only line 2 changes, and its tempo (fast → slow) |
| **Saeed** | B05 anger, seated, gripping | B17 the risk named: he stands and faces the wind | The same rock, overcast dusk → first light. Jump-ins → one continuous push |
| **Saeed** | B03 stops dead at a buzz | B11 walks out of the dark | Stillness → movement |
| **Noor** | B01 the river at night | B19 the river at sunrise | The hook's river becomes the brand's river |
| **Noor** | B03 (Saeed) one buzz stops a man dead | B15 one buzz, she glances and nods | The same haptic buzz, met with composure |
| **Aesha** | B06 a smile for others | B12 a private half-smile, the first look into the lens | Warm voices → a roar for someone else |

3. **Eye contact.** Nobody looks into the lens before Aesha at 35.625. Then Noor at 43.125, the chain at 45.0, and Noor at 54.375.
4. **Every cut has a motive:** a stab, a sound, a light shape, a hand, an eye-line, a footfall. No whip pans, glitches, flares, flash frames or whooshes.
5. **The red device is the thread.** Every persona carries the Axi-red phone (Noor's device may be the red tablet or folio), the only saturated colour on screen. At the end it fills the lens and becomes the red card. Screens always face away from camera.
6. **Look (IQ p55).** Practical light only: phone glow, city windows, fog daylight, low sun through glass. Desaturate 30–40%, cool the temperature, lift the shadows slightly, haze in depth, fine 35 mm grain. Night is blue-grey; dawn is cool with a soft warm core, at most 8% warmer. No green or mint: valleys graded to grey-olive. Every chart and piece of UI painted out. **Type contrast:** every plate gets a soft top burn in the grade (−0.7 to −1.2 stop, feathered, over y 192–700) so white Light type holds 4.5:1 or better. No boxes, no drop shadows.

---

## 4. Final beat sheet

| # | Time (s) · frames | Music (grid_60) | Moment | Persona · photo | On-screen Arabic (gloss) |
|---|---|---|---|---|---|
| **B01** | 0.000–3.750 · f0–111 | Intimate, E drone | HOOK · the wait before the open | Noor · **N1** `Noor/no_N1_river_night.png` | «نعرف الدقيقة» / «التي تسبق افتتاح السوق» (We know the minute / before the market opens) |
| **B02** | 3.750–7.500 · f112–224 | A-minor pad from 3.75 | Fear before the click | Sarmad · `Sarmad/sa_170008.png` → SA-W wide + SA-M macro | «والثانية» / «التي تسبق القرار» (And the second / before the decision) |
| **B03** | 7.500–11.250 · f225–336 | Melody notes 9.375 | A loss | Saeed · `Saeed/se_155202.png` | «والصمت» / «الذي يلي الخسارة» (And the silence / that follows a loss) |
| **B04** | 11.250–15.000 · f337–449 | Soft stab 11.25; **shimmer, strings, ostinato 13.125** | Broken discipline | Rojin · **R1** `Rojin/ro_R1_dusk_rock.png` | «وقاعدة كتبت قبل الجلسة» / «وكسرت في دقيقة» (And a rule written before the session / broken in a minute) |
| **B05** | 15.000–20.625 · f450–617 | Ostinato; **stabs 1: 18.750 · 19.219 · 19.688 · 20.156** | Anger, the revenge trade | Saeed · `Saeed/se_150800.png` (overcast dusk grade) | «والصفقة التالية» / «حين يكتبها الغضب» (And the next trade / when anger writes it) |
| **B06** | 20.625–24.375 · f618–730 | **Tension wave 2** | Shame, the hidden loss | Aesha · `Aesha/ae_plaza_fountains_night.png` | «والابتسامة التي تخفي» / «يوما صعبا» (And the smile that hides / a hard day) |
| **B07** | 24.375–26.250 · f731–786 | Wave 2, accent 25.3125 | Doubt | Noor · `Noor/no_glass_elevator_night.png` | «والشك» / «بعد الإغلاق» (And doubt / after the close) |
| **B08** | 26.250–28.125 · f787–842 | **Stabs 2: 26.250 · 26.719 · 27.188 · 27.656** | The long nights | Sarmad · SA-W, then SA-S (seated) | «والليالي الطويلة» (And the long nights) |
| **B09** | 28.125–30.000 · f843–899 | **BREATH** (near-silence) | Nothing is said | Sarmad · SA-S, near black | «والليالي الطويلة» held, dimming to 35% |
| **B10** | **30.000**–33.750 · f900–1011 | **LIFT** (hit + sub boom) | The morning after | Sarmad · SA-S last frame regraded to dawn | «ونعرف الصباح أيضا» (And we know the morning, too), under the 35% night line |
| **B11** | 33.750–35.625 · f1012–1067 | Breathing bar, accent 34.6875 | Clarity | Saeed · `Saeed/se_154043.png` (outpainted) | «والوضوح» / «حين يهدأ الضجيج» (And clarity / when the noise settles) |
| **B12** | 35.625–37.500 · f1068–1124 | **Crash 1** | Patience | Aesha · `Aesha/ae_stadium_concourse.png` | «والصبر» / «الذي لا يراه أحد» (And the patience / no one sees) |
| **B13** | 37.500–41.250 · f1125–1236 | **F-major step-up** | Discipline, a plan executed | Rojin · **R2** `Rojin/ro_R2_sunrise_rock.png` (prepped) | «وقاعدة كتبت قبل الجلسة» / «واحترمت حتى النهاية» (And a rule written before the session / kept to the end) |
| **B14** | 41.250–43.125 · f1237–1292 | F phrase, accent 42.1875 | Trust in one's own decision | Aesha · `Aesha/ae_airport_sunrise.png` | «والثقة» / «بقرار اتخذته بنفسك» (And trust / in a decision you made yourself) |
| **B15** | 43.125–45.000 · f1293–1349 | **Crash 2** | Calm | Noor · **N3** `Noor/no_N3_closeup_sunrise.png` | «والهدوء» / «أيا كانت النتيجة» (And calm / whatever the outcome) |
| **B16** | 45.000–48.750 · f1350–1461 | **D-minor phrase** | Who "we" is | Chain: Saeed · Sarmad · Aesha · Rojin (0.469 s each), then Rojin · **R3** `Rojin/ro_R3_valley_walk.png` | «لأننا في آكسي» / «متداولون مثلك» (Because at Axi / we are traders, like you) |
| **B17** | 48.750–50.625 · f1462–1517 | **G dominant**, accent 49.21875 | The risk, named | Saeed · `Saeed/se_150800.png` (first-light grade) | «نسمي المخاطر» / «بأسمائها» (We call risks / by their names) |
| **B18** | 50.625–52.500 · f1518–1574 | Fill, sub out | Beside the trader | Noor · **N4** `Noor/no_N4_walk_sunrise.png` (flopped) | «معك في كل صفقة» (With you, in every trade) |
| **B19** | **52.500**–54.375 · f1575–1630 | **C-major arrival** | The signature | Noor · **N2** `Noor/no_N2_river_sunrise.png` | «بناها متداولون» / «من أجل المتداولين» (Built by traders / for traders) + `Built by traders, for traders` |
| **B20** | 54.375–56.250 · f1631–1686 | Resolve | Handover; **risk strip in** | Noor · **N3**, second take | Brand block holds, then releases · risk strip |
| **B21** | 56.250–57.250 · f1687–1716 | Resolve | Red card (IQ p44) | none · vector logo | none · risk strip |
| **B22** | 57.250–60.000 · f1717–1799 | Strings release; **fade 58.5–60.0** | End card | none · motion graphics | «منذ 2007» (Since 2007) · pill «شاركه مع متداول تعرفه» (Share it with a trader you know) · risk strip |

**Screen time:** Saeed 13.6 s · Noor 13.1 s · Sarmad 11.7 s · Rojin 9.8 s · Aesha 8.0 s. Footage covers 0–56.25.

### 4.1 Beat by beat

**B01 · 0.000–3.750 · f0–111 · HOOK: THE MINUTE BEFORE THE OPEN**
- **Picture (S01, from N1):** frame 0 is already moving. Mist drifts RTL across the water and the far-bank lights shimmer. Noor stands on the paved quay on the right of frame, two paving rows back from the edge, reading the red device with the screen away; its glow is the only warm light. She lowers it to chest height and waits, breathing slowly. She never turns toward the water. Locked, 85 mm feel, an imperceptible 1% push-in. Deep blue pre-dawn, sodium far-bank lights diffused in the mist.
- **Text:** «نعرف الدقيقة» settles RTL from f0 (6-frame stagger, 12-frame settle), set by 0.6 s. «التي تسبق افتتاح السوق» settles from beat 2 (0.9375, f28) at a 4-frame stagger, set by 1.73 s. Dead still, then a 10-frame fade in place from f102.
- **Overlays:** white «آكسي العراق» lockup top-right (≥120 px, y≈200–330) from 0 to 1.5 s, fading out 1.3–1.5. Axi watermark from f0 to the last frame.
- **Sound · cut:** river lapping, a distant city hum; no hit. Hard cut at 3.75 (f112) on the A-minor pad entry: the small device glow on the right becomes the red phone's glow at the centre of Sarmad's frame.

**B02 · 3.750–7.500 · f112–224 · FEAR BEFORE THE CLICK**
- **Picture:** 3.75–5.625 (S02, SA-W): a symmetrical wide. Sarmad stands centred, full figure, a step back from the floor-to-ceiling glass, three-quarter back to camera, the night city below. The red phone is at chest height, screen away, his thumb over it. Only his shoulders move with his breath. 5.625–7.5 (S03, SA-M): an axial macro cut-in on bar 3: the thumb 1 cm above the red phone, trembling 1 mm. It never presses. Locked throughout. City glow as backlight, the phone as key on his hand and jaw.
- **Text:** «والثانية» settles alone at f112 (14 frames). «التي تسبق القرار» settles from beat 10 (4.6875, f140) at an 8-frame stagger, set by 5.67 s, and holds still across the cut to the macro. Fade f215–224.
- **Sound · cut:** room tone, a faint glass hum, his breath. Hard cut at 7.5 (f225) before the thumb lands: the outcome is never shown.

**B03 · 7.500–11.250 · f225–336 · A LOSS**
- **Picture (S04, `se_155202`):** frame 0, Saeed walks toward camera down the axis between the two glass towers, reading the red phone (screen away). One haptic buzz at ≈8.0. He stops mid-stride and stands completely still, then slowly lowers the phone to his side. Only the fog moves. Locked long lens, a 2% pull-back that stops when he stops. Flat cold fog light.
- **Text:** «والصمت» settles alone at f225 with a slow 20-frame settle. «الذي يلي الخسارة» settles from beat 18 (8.4375, f253), in the silence after he stops, at an 8-frame stagger. The melody enters under the held line at 9.375. Fade f327–336.
- **Sound · cut:** footsteps on wet stone and the city hum; the buzz at ≈8.0; when he stops every sound effect drops out and only the music remains. Cut at 11.25 (f337) on the soft stab, matched on hand height: his lowered hand becomes Rojin's hand on the notebook.

**B04 · 11.250–15.000 · f337–449 · BROKEN DISCIPLINE**
- **Picture (S05, R1):** Rojin sits on the broad low rock at dusk, the dirt track winding behind her. She opens the small dark notebook on her knee: her own handwriting, one rule underlined, nothing legible. The red phone is in her other hand, screen away. Her thumb hovers, hesitates, and **presses on 13.125**. She closes her eyes, then slowly closes the notebook. Locked medium, a 2% creep in. Blue dusk; the phone glow on her face and the page. Greens graded to grey-olive.
- **Text:** «وقاعدة كتبت قبل الجلسة» settles RTL from f337 at an 8-frame stagger. **Build it as its own layer:** B13 reuses it untouched. «وكسرت في دقيقة» arrives with the press on 13.125 (f393) as the film's one fast line: 3-frame stagger, a 6-frame opacity-only settle, no rise. Fade f440–449.
- **Sound · cut:** wind in dry grass, a page turning at 11.3, one dry tap on the press under the shimmer, strings and ostinato that enter at 13.125. The soft close of the notebook at ≈14.9 is the cut at 15.0 (f450).

**B05 · 15.000–20.625 · f450–617 · ANGER: THE NEXT TRADE**
- **Picture:** 15.0–18.75 (S06a, `se_150800` graded to overcast dusk): Saeed sits on the broad rock, jaw set. He grips the red phone, lifts it to eye level with his thumb over it, and freezes, breathing through his nose, the wind in his coat and hair. He never taps. 18.75–20.625: four axial jump-ins on stabs 1: a time-jump inside the wide (f562), MCU (f576, S06b), eyes (f590, S06b punched in 1.6x), white knuckles on the red phone (f604, S06c). It ends unresolved, still gripping. Locked throughout. Hard cold overcast, wind-blown grit, no sun, no drop in frame.
- **Text:** «والصفقة التالية» settles RTL at f450. «حين يكتبها الغضب» settles from 16.875 (f506), set by 17.87 s. Through the stabs the type does not move, flash or swap: the picture jumps four times under words that stay perfectly still. Fade f608–617.
- **Sound · cut:** steady mountain wind, his breath through his nose. **Nothing on the stabs**; the music carries them. Cut at 20.625 (f618) on tension wave 2, a red baton: his white-knuckled red phone becomes Aesha's red phone at the same screen position. Fountain and warm voices J-cut in from 20.4.

**B06 · 20.625–24.375 · f618–730 · SHAME: THE HIDDEN LOSS**
- **Picture (S07, `ae_plaza_fountains_night`):** Aesha walks toward camera across the wet plaza reading the red phone. Warm voices call her from off-frame right. She slides the phone into her pocket, finds a composed smile and gives a small "all good" wave, then turns back toward camera; the smile settles slowly into stillness. One breath. The fountains keep playing. Locked long lens, symmetrical on the glass entrance; it never moves toward her. Cold blue night, warm spill from the entrance, the white suit glowing.
- **Text:** «والابتسامة التي تخفي» settles RTL with her smile from f618. «يوما صعبا» settles at 80% opacity on the 22.03125 accent (f660), as the smile settles: the quieter truth is set quieter. Fade f721–730.
- **Sound · cut:** the fountain and the voices, low-passed into an elevator hum by 24.3. Cut at 24.375 (f731) on an eye-trace: her eyes lower; Noor's eyes meet her own reflection at the same height.

**B07 · 24.375–26.250 · f731–786 · DOUBT**
- **Picture (S08, `no_glass_elevator_night`, outpainted upward):** Noor rides down inside the glass elevator after the day is done. She looks not at the device but at her own reflection over the city lights. The reflection holds her gaze; she looks away first. The cabin frame stays in shot; she never looks down. Locked; the city lights slide upward past the glass. Cold city glow, her face half lit.
- **Text:** «والشك» settles alone at f731 (18 frames, slower than the rest). «بعد الإغلاق» follows from f749 at a 6-frame stagger, set by 25.57 s. Fade f781–786.
- **Sound · cut:** the elevator hum, one glass creak. Hard cut on stab 1 of wave 2 at 26.25 (f787), a light match: the rising streaks of city light become the still city in Sarmad's window.

**B08 · 26.250–28.125 · f787–842 · THE LONG NIGHTS**
- **Picture:** four cuts of one locked frame on stabs 2, each a jump forward inside the same night. f787: SA-W, he stands at the window, the city fully lit (S02, a second stretch). f801: SA-S, he sits in a low armchair well inside the room, facing the glass from a distance; a third of the city is dark. f815: SA-S, head bowed, the red phone face down on the side table; half the city is dark. f829: SA-S, only a few lights remain; he sits perfectly still. Locked; framing identical in all four. The city is the only source, going out block by block (city lights masked in comp).
- **Text:** «والليالي الطويلة» settles at f787, 2 words at an 8-frame stagger, and holds still across the four cuts.
- **Sound:** **nothing on the stabs.** Faint room tone. No cut at 28.125: the shot runs on into the breath.

**B09 · 28.125–30.000 · f843–899 · THE BREATH**
- **Picture (S09, SA-S):** locked. The last lights go out; near black (3–5% luma), his silhouette in the armchair against a faint sky. One slow exhale at ≈28.6. Nothing moves after 29.9. Safety: inside the room, seated, well back from the glass. **Save the last frame.**
- **Text:** nothing new appears. «والليالي الطويلة» dims linearly from 92% to 35% over f843–f896. The house says nothing at the darkest point; it only lets the night fade.
- **Sound · cut:** one exhale, a faint room tone. **All sound is out by 29.97**, so the LIFT hits from silence. Mirror cut at 30.000 (f900): the same locked frame at dawn.

**B10 · 30.000–33.750 · f900–1011 · THE MORNING (THE LIFT)**
- **Picture (S10):** S09's last frame regraded to first light, so the start frame matches to the pixel. Low sun pours through the glass across the floor. He opens his eyes, breathes in, stands, walks to the window and looks out at the city in first light, shoulders down. The film's first forward move: a slow push-in rising with him. Low warm sun, long mullion shadows, cool haze over the city.
- **Text:** «والليالي الطويلة» stays exactly where it was at 35%: the night is not erased. On the hit (f900) «ونعرف الصباح أيضا» settles RTL on the line-2 baseline, at full 96 px and 92%, 8-frame stagger, with the film's only glow: a soft 20% white glow that breathes once over 24 frames. On bar 17 (31.875, f956) the 35% night line fades out over 10 frames, leaving the morning alone. Fade f1002–1011.
- **Sound · cut:** one inhale on the hit (the twin of the exhale), then the music. Cut at 33.75 (f1012) on a shape-and-light match: the bright window beside him becomes the bright cave opening in the same screen area.

**B11 · 33.750–35.625 · f1012–1067 · CLARITY**
- **Picture (S11, `se_154043`, outpainted upward):** a symmetrical frame of black rock around a tall bright opening. Saeed, a silhouette, walks out of the dark toward the light, unhurried, phone in pocket. A slow push follows him. Black rock, a cool white sky blooming, dust in the shaft of light.
- **Text:** one continuous RTL sequence on the dark arch above the opening: «والوضوح» at f1012, then «حين يهدأ الضجيج» from f1018 (6-frame stagger, 12-frame settle), set by 34.73 s. Fade f1062–1067.
- **Sound · cut:** wind in the cave that falls away as he reaches the light; footsteps on rock. Out on crash 1 at 35.625 (f1068): the opening blooms to white over 4 frames and resolves on Aesha.

**B12 · 35.625–37.500 · f1068–1124 · PATIENCE**
- **Picture (S12, `ae_stadium_concourse`):** MCU by the pillar. On crash 1 a crowd roar bursts from the stands off-frame; it is for someone else. Aesha does not turn toward it; the red phone stays still at her side. She lifts her eyes to the lens with a composed, private half-smile: **the film's first look into the lens.** Slow 3% push-in. Cool concourse daylight, a soft rim on the white hijab.
- **Text:** «والصبر» at f1068, then «الذي لا يراه أحد» from f1073 (5-frame stagger, 12-frame settle), set by 36.67 s. Fade f1121–1124.
- **Sound · cut:** a muffled roar for someone else, decayed by 37.3. Cut on the F-major step-up at 37.5 (f1125) on a hand match: her still hand becomes Rojin's hand resting near the phone on the stone.

**B13 · 37.500–41.250 · f1125–1236 · DISCIPLINE: THE RULE KEPT**
- **Picture (S13, R2 prepped):** the same rock at sunrise. The red phone lies face down on the stone. Her hand drifts toward it, stops, and returns to the notebook. One small tick, illegible; she closes the notebook gently. A small private smile; she stands and looks out over the valley. R1's framing, then a slow rise with her. First sun, a warm rim on a cool grey-olive valley.
- **Text:** «وقاعدة كتبت قبل الجلسة» is simply there on f1125, with no animation: B04's layer, size and position, so the viewer recognises it before reading it. «واحترمت حتى النهاية» settles at 38.4375 (f1153), where «وكسرت في دقيقة» once snapped on, now at the standard slow settle: the same place, the opposite tempo. Fade f1227–1236.
- **Sound · cut:** early birds, wind, a pen tick at ≈38.9, the soft close of the notebook at ≈40.4. Cut at 41.25 (f1237) on her rising motion: Rojin stands, and the cut lands on Aesha mid-stride.

**B14 · 41.250–43.125 · f1237–1292 · TRUST IN ONE'S OWN DECISION**
- **Picture (S14, `ae_airport_sunrise`):** Aesha walks away from camera down the long symmetrical hall toward the sunrise, among out-of-focus, faceless travellers. The phone stays in her pocket; she never looks down. At ≈42.6 she glances at the light, a calm half-smile in profile. Centred, a slow push behind her. Low sun through the glass wall, long reflections on the floor.
- **Text:** «والثقة» at f1237, then «بقرار اتخذته بنفسك» from f1243 (6-frame stagger), set by 42.23 s. Fade f1287–1292.
- **Sound · cut:** footsteps on the beats, an airy hall tone. Cut on crash 2 at 43.125 (f1293), a sun-position match: the low sun in the airport glass becomes the sun behind Noor on the river.

**B15 · 43.125–45.000 · f1293–1349 · CALM, WHATEVER THE OUTCOME**
- **Picture (S15, N3 with 8% headroom added):** Noor faces the lens, the misty river behind her. The red phone in her hands buzzes once. She glances down at it (screen away), back up to the lens, unhurried, and gives one slow nod. She does not lift it. Slow 2% push-in. First sun on her face, a warm rim, the mist backlit.
- **Text:** «والهدوء» at f1293, then «أيا كانت النتيجة» from f1299, set by 44.1 s, then dead still. Fade f1344–1349.
- **Sound · cut:** the buzz, barely audible: the same buzz that stopped Saeed dead at 8.0, now met with a nod. Then breath and water; nothing added on crash 2. Hard cut on the D-minor phrase at 45.0 (f1350).

**B16 · 45.000–48.750 · f1350–1461 · WHO "WE" IS**
- **Picture:** 45.0–46.875: four first-light MCU portraits cut on beats 96–99 (S16a–d): Saeed (f1350), Sarmad (f1364), Aesha (f1378), Rojin (f1392). Each turns from the world to the lens and gives one small nod, no more than a trace of a smile. Matched like an annual-report portrait series: eyes at y≈860, top of head at or below y≈640, a 50 mm feel, sun from frame right, one slow RTL drift at the same speed in all four. 46.875–48.75 (S17, R3): a scale cut from Rojin's face to Rojin small in the valley at sunrise, walking the dirt track, mist in the folds of the mountains. A very slow crane up and back.
- **Text:** «لأننا في آكسي» settles at f1350 (8-frame stagger). «آكسي» is set in the same Light weight and the same white as every other word. «متداولون مثلك» settles at 45.9375 (f1378), set by 46.67 s. The block holds perfectly still across all five cuts. Fade f1452–1461. This closes the 45-second sentence.
- **Sound · cut:** one air bed, no whooshes; valley wind and early birds from 46.875. Hard cut on G at 48.75 (f1462).

**B17 · 48.750–50.625 · f1462–1517 · THE RISK, NAMED**
- **Picture (S18, `se_150800` graded to first light):** B05's rock and framing at first light. The same mountain wind blows. Saeed stands up from the rock and faces straight into it, phone in pocket, shoulders down, eyes open, still. The wind does not stop: he faces it. One slow continuous push-in, the inverse of B05's jump-ins. A cold sky with a warm edge of first light.
- **Text:** «نسمي المخاطر» settles at f1462 (6-frame stagger). «بأسمائها» lands alone on the 49.21875 accent (f1476) and holds like a full stop. Fade f1510–1517. The risk strip, 5.6 s later, proves the line on screen.
- **Sound · cut:** the same wind as B05, without the held breath. Cut at 50.625 (f1518) on the fill as the sub drops out, matched on movement: his first step forward becomes Noor mid-stride.

**B18 · 50.625–52.500 · f1518–1574 · WITH YOU, IN EVERY TRADE**
- **Picture (S19, N4 flopped so she walks RTL):** Noor walks the stone river path at her own pace at sunrise, the red device at her side. At ≈52.2 she slows and turns toward the river. A side-track at shoulder height, walking beside her at her pace: **the only time in the film the camera walks beside a trader.** Sunrise mist, a warm rim, cool water.
- **Text:** «معك في كل صفقة» settles RTL in step with her stride (7-frame stagger), set by 51.7 s. Fade f1568–1574.
- **Sound · cut:** her footsteps on the beats, one river lap just before the arrival. Cut on her stop at 52.5 (f1575) to the wide.

**B19 · 52.500–54.375 · f1575–1630 · THE SIGNATURE**
- **Picture (S20, N2):** the river of the hook, now at sunrise. Noor stands on the bank as the sun clears the mist. Hold 12 frames, then a very slow crane up and back toward an extreme wide. Full sunrise, a gold core in cool haze.
- **Text:** the film's one size step. «بناها متداولون» settles RTL on the sub boom (f1575, 6-frame stagger, 104 px). «من أجل المتداولين» settles from 52.96875 (f1589, 84 px). `Built by traders, for traders` fades up as one unit on its own line at 53.4375 (f1603), 12 frames. The block holds across the next cut. It is a "built by" claim, never "founded by" [1.3, 9.7].
- **Sound · cut:** nothing added on the chord. Axial cut-in at 54.375 (f1631) to Noor's MCU; the brand block holds.

**B20 · 54.375–56.250 · f1631–1686 · HANDOVER · RISK STRIP IN**
- **Picture (S21, N3 second take):** Noor turns to the lens, a calm nod, and raises the red phone back-first toward the lens until the red fills the frame at ≈56.1, with no more than 6 frames of full red. Slow push-in. First sun, a warm rim.
- **Text:** the brand block holds from 52.5 without animating again and releases over f1674–1683 as the phone rises. **The risk strip slides up 40 px in 10 frames at f1631 and never fades** (spec in §10).
- **Sound · cut:** music only, the resolve. If the strip needs air, duck the music 2–3 dB from 54.0. Red match cut at 56.25 (f1687): the phone's red back becomes the flat Axi red card.

**B21 · 56.250–57.250 · f1687–1716 · RED CARD (IQ p44)**
- No AI footage. Flat Axi Red #E4002E with the white Axi logo from vector, static, optically centred above the strip at (540, 760). Exactly 30 frames. The risk strip and the watermark stay on top. Straight cut at 57.25 (f1717). The official ident sound if supplied; otherwise music only.

**B22 · 57.250–60.000 · f1717–1799 · END CARD**
- The red drops to the dark gradient #171819 → #0B0D0D while the white Axi logo holds its exact position, so the card reads as one sign-off. «منذ 2007» fades in under the logo (f1717, 8 frames). The pill «شاركه مع متداول تعرفه» fades up at 57.65625 (f1729), 10 frames, no spring, no pulse. The pill fades on the last beat (f1785–1799). The logo, «منذ 2007», the strip and the watermark hold to the last frame. Layout in §10.
- **Sound:** the music's own fade 58.5–60.0 into digital silence. The last frame is dark, so the loop lands back on the night river and «نعرف الدقيقة».

---

## 5. Sound

No voice-over; the music is untouched. Sound effects are sparse and diegetic, and they lead the picture.

| Time | Sound |
|---|---|
| 0.000 | River lapping, a distant city hum. No hit |
| 3.75 | Room tone, a faint glass hum, his breath |
| ≈8.0 | **One haptic buzz.** He stops; every effect drops out. The melody enters into the silence at 9.375 |
| 11.3 · 13.125 · ≈14.9 | Page turn · one dry tap on the press · the soft close of the notebook = the cut |
| 15.0–18.7 | Steady mountain wind, breath through the nose |
| **18.75–20.16** | **Nothing.** The stabs carry it |
| 20.4 | Fountain and warm voices (J-cut), low-passed into an elevator hum by 24.3 |
| 24.375 | Elevator hum, one glass creak |
| **26.25–27.66** | **Nothing** |
| 28.125–29.97 | One exhale (≈28.6), faint room tone. **Everything out by 29.97** |
| 30.000 | One inhale on the hit |
| 33.75 | Cave wind falling away as he reaches the light; footsteps on rock |
| 35.625 | A muffled crowd roar for someone else, out by 37.3 |
| 37.5 | Early birds, wind, a pen tick (≈38.9), the notebook closing softly (≈40.4) |
| 41.25 | Footsteps on the beats, an airy hall tone |
| ≈43.4 | **The buzz again**, barely audible; breath and water. Nothing on crash 2 |
| 45.0 | One air bed; valley wind and early birds from 46.875 |
| 48.75 | The same mountain wind as 15.0 |
| 50.625 | Footsteps on the beats; one river lap at ≈52.3 |
| 52.5 | Nothing added on the chord |
| 56.25 | Official ident sound if supplied, otherwise music only |
| 58.5–60.0 | The music's own fade. Duck 2–3 dB from 54.0 only if the strip needs air |

---

## 6. Text system: institutional typography

**One family, one weight, one slot.** The words always sit in the same place; only the world changes under them.

| Element | Font | Size | Colour | Notes |
|---|---|---|---|---|
| Line 1 | Rabar 018 Light | 96 px | white 92% | Single-line beats also use 96 px on the line-1 baseline |
| Line 2 | Rabar 018 Light | 76 px | white 92% | B06 line 2 at 80% (the quieter truth); B10's morning line sits on the line-2 baseline at 96 px |
| Brand line (B19 only) | Rabar 018 Light | 104 / 84 px | white 92% | The film's only size step |
| Latin | Axi Font Light (Inter Light fallback) | 40 px, tracking +3% | white 75% | Always its own line |
| «منذ 2007» | Rabar 017 Regular | 32 px | white 70% | End card only |
| Pill | Rabar 016 Bold | 30 px | white on #E4002E, 72 px tall | End card only. The only bold in the film |
| Risk strip | Rabar 017 Regular | ≥39 px | Carbon #242528 on 92% white | §10 |

Rabar TTFs come from the asset pack (IQ p69); the sanctioned fallback is Noto Sans Arabic. «آكسي» is never bold, never red, never larger than its neighbours.

**Spacing.** Arabic tracking 0 (letter-spacing breaks the joins); word spacing +15%; no kashida; no diacritics; no full stops at line ends. Line-1 baseline y≈420, line-2 baseline y≈530 (110 px gap). Latin baseline y≈600 (B19 only).

**The slot (V).** Centred, x 108–972, baselines y≈420 / 530. Every plate is composed or outpainted so the top of any head sits at or below y≈640 and the slot falls on sky, glass, dark wall or rock. Text never sits over a face. Persistent layers keep to y 192–1632.

**Motion: only these.**

| Move | Spec | Used |
|---|---|---|
| **Settle** (standard) | Per word, RTL: opacity 0→92%, rise 8 px, blur 3→0 px, 14 frames, cubic ease-out, 8-frame stagger | Two-bar beats |
| **Settle, compact** | Same move, 12 frames, 5–7-frame stagger, both lines as one continuous RTL sequence | One-bar beats (B07, B11, B12, B14, B15, B18) |
| **Hook settle** | 12 frames; 6-frame stagger (line 1), 4-frame stagger (line 2) | B01 |
| **Slow settle** | 18–20 frames for a single opening word | «والصمت», «والشك» |
| **Fast line** | Opacity only, 6 frames, 3-frame stagger, no rise | «وكسرت في دقيقة» only |
| **Present** | Already there on the cut frame, no animation | B13 line 1 (twin layer) |
| **Dim** | Linear opacity change in place | «والليالي الطويلة» 92→35% in the breath |
| **Glow** | Soft 20% white glow, breathes once over 24 frames | B10 only, on the LIFT |
| **Exit** | Fade in place, 10 frames (6 on one-bar beats), finished before the cut | All |

**Never:** per-letter animation, scale, bounce, slide, glitch, colour, red text on footage, drop shadows or boxes. **On the stabs the type does not move**: the picture cuts and the words hold.

**Persistent layers.**
- Opening lockup: white «آكسي العراق», ≥120 px, top-right y≈200–330, 0–1.5 s, over the hook.
- Watermark: white Axi logo at 60%, 54 px wide, x=54, y≈1590–1630, f0 to the last frame (IQ p44).

---

## 7. Arabic check: copy, holds, grammar

Plain white MSA, no diacritics, ≤5 words per line, ≤2 Arabic lines per beat. The only digits on screen are «2007» (Western digits). "Set by" is when the last word finishes settling; "hold" is the still time after that, before the exit.

| Beat | Line(s) | Words | Beat (s) | Set by (s) | Hold (s) | Words/s over the beat |
|---|---|---|---|---|---|---|
| B01 | «نعرف الدقيقة» / «التي تسبق افتتاح السوق» | 2 / 4 | 3.75 | 1.73 | 1.67 | 1.6 |
| B02 | «والثانية» / «التي تسبق القرار» | 1 / 3 | 3.75 | 5.67 | 1.50 | 1.1 |
| B03 | «والصمت» / «الذي يلي الخسارة» | 1 / 3 | 3.75 | 9.43 | 1.47 | 1.1 |
| B04 | «وقاعدة كتبت قبل الجلسة» / «وكسرت في دقيقة» | 4 / 3 | 3.75 | 13.50 | 1.17 | 1.9 |
| B05 | «والصفقة التالية» / «حين يكتبها الغضب» | 2 / 3 | 5.63 | 17.87 | 2.40 | 0.9 |
| B06 | «والابتسامة التي تخفي» / «يوما صعبا» | 3 / 2 | 3.75 | 22.73 | 1.30 | 1.3 |
| B07 | «والشك» / «بعد الإغلاق» | 1 / 2 | 1.88 | 25.57 | 0.47 | 1.6 |
| B08–B09 | «والليالي الطويلة» | 2 | 3.75 | 26.97 | to 31.9 | 0.5 |
| B10 | «ونعرف الصباح أيضا» | 3 | 3.75 | 31.00 | 2.40 | 0.8 |
| B11 | «والوضوح» / «حين يهدأ الضجيج» | 1 / 3 | 1.88 | 34.73 | 0.67 | 2.1 |
| B12 | «والصبر» / «الذي لا يراه أحد» | 1 / 4 | 1.88 | 36.67 | 0.70 | 2.7 |
| B13 | «وقاعدة كتبت قبل الجلسة» / «واحترمت حتى النهاية» | 4 (known) / 3 | 3.75 | 39.43 | 1.47 | 0.8 new |
| B14 | «والثقة» / «بقرار اتخذته بنفسك» | 1 / 3 | 1.88 | 42.23 | 0.67 | 2.1 |
| B15 | «والهدوء» / «أيا كانت النتيجة» | 1 / 3 | 1.88 | 44.10 | 0.70 | 2.1 |
| B16 | «لأننا في آكسي» / «متداولون مثلك» | 3 / 2 | 3.75 | 46.67 | 1.73 | 1.3 |
| B17 | «نسمي المخاطر» / «بأسمائها» | 2 / 1 | 1.88 | 49.67 | 0.67 | 1.6 |
| B18 | «معك في كل صفقة» | 4 | 1.88 | 51.70 | 0.57 | 2.1 |
| B19–B20 | «بناها متداولون» / «من أجل المتداولين» | 2 / 3 | 3.30 | 53.83 | 1.97 | 1.5 |
| B22 | «منذ 2007» · pill «شاركه مع متداول تعرفه» | 2 · 4 | 2.75 | 57.97 | 1.53 | 2.2 |

Every beat reads at 2.7 words a second or slower. The one-bar beats reveal both lines as one continuous sequence, so the eye reads while the words arrive.

**Grammar.**
- **The sentence.** Every line from B02 to B15 is a direct object of «نعرف» (B01) or «ونعرف» (B10), joined by «و». The 45-second sentence closes with «لأننا في آكسي متداولون مثلك»: «متداولون» is the predicate of «أنّ», nominative ✓.
- **«وقاعدة كتبت قبل الجلسة / وكسرت في دقيقة»** and **«واحترمت حتى النهاية»:** «قاعدة» is indefinite, so the verbs are adjectival clauses read as passives (كُتبت، كُسرت، احتُرمت) ✓. «الجلسة» is the trading session, standard in Arab financial media.
- **«والصمت الذي يلي الخسارة»:** «يلي» = follows ✓.
- **«والصفقة التالية حين يكتبها الغضب»:** echoes «كتبت»; the rule is written by the trader, the next trade by anger ✓.
- **«يوما صعبا»:** accusative object of «تخفي», alif of tanween kept (a letter, not a diacritic) ✓.
- **«والشك بعد الإغلاق»:** «الإغلاق» reads as the market close and as closing a position; both are true ✓. It answers «افتتاح السوق» in the hook.
- **«والصبر الذي لا يراه أحد»:** «يراه» indicative after «لا» ✓.
- **«أيا كانت النتيجة»:** conditional «أيًّا كان», written «أيا» without diacritics ✓.
- **«بقرار اتخذته بنفسك»:** «بنفسك» fixes the reading as "you made" (not "I made"); gender-neutral without diacritics ✓.
- **«نسمي المخاطر بأسمائها»:** from the idiom «نسمي الأشياء بأسمائها»; hamza on the yaa' seat in «بأسمائها» (genitive) ✓. It starts a new sentence, with no «و», so it does not hang on «لأننا».
- **«بناها متداولون»:** «ها» = آكسي (a company, feminine), named on screen 4 s earlier and present as the watermark ✓.
- **«شاركه مع متداول تعرفه»:** «ه» = the film. Generic masculine imperative, the MSA convention for CTAs (as «افتح حسابك») ✓.
- **Hamza seats:** أيضا، أيا، أحد، أسمائها، آكسي، أجل، إغلاق ✓. Hamzat wasl, so none written: افتتاح، الإغلاق، اتخذته، احترمت ✓.
- **Gender:** no line has a gendered subject. «مثلك»، «بنفسك»، «معك» read for men and women alike.
- **Deliberate repetitions:** «التي تسبق» in B01 and B02 (minute, then second); «وقاعدة كتبت قبل الجلسة» in B04 and B13 (the twin); the «هدأ» root once in B11 and once in B15 (clarity leads to calm).

---

## 8. Photos

All new stills are 1536x2752: trim 21 px of height for an exact 9:16 (1536x2731) before upscaling to 1080x1920.

**Used, with prep before i2v:**

| Persona | File | Beats | Prep |
|---|---|---|---|
| Noor | `Noor/no_N1_river_night.png` (N1) | B01 | **Safety:** paint her one metre inland, two paving rows clear of the quay edge. Check the far-bank skyline for identifiable towers or domes |
| Noor | `Noor/no_N2_river_sunrise.png` (N2) | B19 | Check the skyline. Note: N2 is a rocky stretch of the bank, not N1's framing (§14.8) |
| Noor | `Noor/no_N3_closeup_sunrise.png` (N3) | B15, B20 | Outpaint 8% headroom so the top of her head sits at y≈640. Check the skyline |
| Noor | `Noor/no_N4_walk_sunrise.png` (N4) | B18 | Flop horizontally so she walks RTL (no text or logos to mirror). Check the skyline |
| Noor | `Noor/no_glass_elevator_night.png` | B07 | Paint out the green chart tower. Outpaint upward ≈30% (more glass and city) so her head drops to y≈700 and slot V is clear |
| Rojin | `Rojin/ro_R1_dusk_rock.png` (R1) | B04 | None; the notebook is already on her lap |
| Rojin | `Rojin/ro_R2_sunrise_rock.png` (R2) | B13, B16 chain | **Image edit:** add R1's dark notebook on her knee and lay the red phone face down on the rock beside her. Outpaint ≈15% so her scale and head height match R1 and the twin reads instantly |
| Rojin | `Rojin/ro_R3_valley_walk.png` (R3) | B16 | None |
| Sarmad | `Sarmad/sa_170008.png` | B02, B08, B09, B10, B16 chain | Paint out the chart reflections. Generate three plates from it: **SA-W** (symmetrical night wide, full figure, a step back from the glass, head at y≈800), **SA-M** (macro of the thumb over the red phone), **SA-S** (the same framing, seated in a low armchair well inside the room). The dawn plate is SA-S's last frame regraded |
| Saeed | `Saeed/se_155202.png` | B03 | Check the glass for text or logos |
| Saeed | `Saeed/se_150800.png` | B05 (overcast dusk), B17 (first light), B16 chain | Outpaint 10% headroom. Two grades from one plate. Keep any drop out of frame. Generate the MCU and the knuckle insert for the stabs |
| Saeed | `Saeed/se_154043.png` | B11 | Outpaint upward ≈20% so the dark arch rock fills y 192–600 above the opening (slot V sits on rock, not on the white sky) |
| Aesha | `Aesha/ae_plaza_fountains_night.png` | B06 | Paint out the chart billboard; check the façade for signage |
| Aesha | `Aesha/ae_stadium_concourse.png` | B12, face reference | Paint out the chart screens; no club or third-party marks |
| Aesha | `Aesha/ae_airport_sunrise.png` | B14, chain world | Paint out the chart screen and the flight-board text; no livery; soften the control tower so it reads as no particular airport |

**Not used:**

| File | Why |
|---|---|
| `Saeed/se_154022.png` | A rock edge with a drop behind him in a dark beat, and his head sits where the type must go. Spare for a bright cutdown |
| `Sarmad/sa_165949.png` | Charts on the towers; a riverside edge at night |
| `Sarmad/sa_170014.png`, `sa_170020.png` | Spares. `sa_170014` (back seat at night) is the fallback for B05 if Saeed seated reads too calm |
| `Saeed/se_chat_river_walk.png`, `se_155156.png`, `se_155128.png`, `se_155139.png`, `se_154938.png`, `Noor/no_citadel_walk.png`, `no_ziggurat_dust.png` | Recognisable tower, citadel, flag, minaret, colonnade, ziggurat |
| `Noor/no_trading_floor_night.png` | Charts everywhere |
| `Aesha/ae_mall_atrium_night.png`, `ae_riverwalk_topdown_night.png` | High balustrade; water edge and green reflections |
| `Noor/no_rock_summit_tablet.png`, `Saeed/se_150807.png`, `se_153950.png`, `se_155209.png` | Summits and ridges read as height |
| `AxiIraq_*` studio portraits | Identity references only |

---

## 9. Seedance shot list

26 i2v takes at 9:16. Generate 5 s takes and use the best stretch.

| Take | Beat | Start photo | Action | Camera | Light | Seconds needed |
|---|---|---|---|---|---|---|
| S01 | B01 | N1 (prepped) | Frame 0 moving: mist drifts RTL, far-bank lights shimmer. She reads the red device (screen away), lowers it to chest height, waits, breathes. Never turns toward the water | Locked, 85 mm feel, 1% push-in | Deep blue pre-dawn, sodium lights in mist, device glow as key | 3.75 |
| S02 | B02, B08 (f787) | SA-W from `sa_170008` | Stands centred, three-quarter back, red phone at chest, thumb over it; only his breath moves. Never presses | Locked long lens, symmetrical | City backlight, phone key on hand and jaw | 1.875 + 0.47 |
| S03 | B02 | SA-M from S02 | Thumb 1 cm above the red phone, trembling 1 mm; never presses | Locked macro, axial | Phone glow, city bokeh | 1.875 |
| S04 | B03 | `se_155202` | Walks toward camera reading the phone; one buzz at ≈0.5 s; stops mid-stride, completely still; slowly lowers the phone; fog keeps moving | Locked long lens, 2% pull-back that stops when he stops | Flat cold fog, faint phone glow | 3.75 |
| S05 | B04 | R1 | Opens the notebook (one underlined rule, illegible); thumb hovers over the red phone, hesitates, presses at ≈1.9 s; closes her eyes; closes the notebook at ≈3.65 s | Locked medium, 2% creep in | Blue dusk, phone glow on face and page | 3.75 |
| S06a | B05 | `se_150800`, overcast-dusk grade, headroom added | Seated on the broad rock, jaw set; grips the red phone, lifts it to eye level, thumb over it, freezes, breathes through the nose; wind in coat and hair; never taps | Locked wide | Hard cold overcast, wind-blown grit | 3.75 + 0.47 |
| S06b | B05 | MCU generated from S06a | Still gripping, eyes fixed, breathing | Locked (eyes = 1.6x punch-in) | Same | 2 × 0.47 |
| S06c | B05 | Insert generated from S06a | White knuckles tighten on the red phone, screen away | Locked macro | Same | 0.47 |
| S07 | B06 | `ae_plaza_fountains_night` (painted) | Walks toward camera reading; voices off-frame right; pockets the phone, composed smile, small wave; turns back; the smile settles into stillness; one breath | Locked long lens, symmetrical | Cold blue night, warm entrance spill, wet reflections | 3.75 |
| S08 | B07 | `no_glass_elevator_night` (painted, outpainted) | Rides down; holds her reflection's gaze; looks away first; cabin frame in shot; never looks down | Locked; city lights slide upward | Cold city glow, face half lit | 1.875 |
| S09 | B08, B09 | SA-S from `sa_170008` | Seated in the armchair well inside the room; head bowed, phone face down on the side table; lifts his head; perfectly still; one slow exhale; nothing moves in the last 0.2 s | Locked, identical to SA-W | City as the only source (lights masked out in comp), ending at 3–5% luma | 3 × 0.47 + 1.875. **Save the last frame** |
| S10 | B10 | S09's last frame regraded to dawn | Opens his eyes, breathes in, stands, walks to the glass, looks out, shoulders down | Slow push-in rising with him | Low warm sun, long mullion shadows, cool haze | 3.75 |
| S11 | B11 | `se_154043` (outpainted) | Silhouette walks out of the dark toward the opening, unhurried, phone in pocket | Slow push following him | Black rock, cool white sky blooming, dust in the light | 1.875 |
| S12 | B12 | `ae_stadium_concourse` (painted) | A roar off-frame on the crash; she doesn't turn; phone still at her side; lifts her eyes to the lens, private half-smile | Slow 3% push-in | Cool concourse daylight, soft rim on the hijab | 1.875 |
| S13 | B13 | R2 (edited, scale-matched) | Hand drifts toward the face-down phone, stops, returns to the notebook; one small tick; closes it gently; small smile; stands and looks out over the valley | R1's framing, then a slow rise with her | First sun, warm rim, grey-olive valley | 3.75 |
| S14 | B14 | `ae_airport_sunrise` (painted) | Walks away down the hall toward the sunrise among faceless travellers; phone in pocket; glances at the light at ≈1.4 s, calm half-smile in profile | Centred, slow push behind her | Low sun through glass, long floor reflections | 1.875 |
| S15 | B15 | N3 (headroom added) | Faces the lens; the red phone buzzes once; glances down (screen away), back to the lens, one slow nod; does not lift it | Slow 2% push-in | First sun, warm rim, mist backlit | 1.875 |
| S16a | B16 | MCU from `se_150800`, first light | Turns from the world to the lens, one small nod | Eyes at y≈860, head top ≥ y 640, 50 mm feel, slow RTL drift | Sun from frame right | 0.47 |
| S16b | B16 | MCU from S10's dawn plate | Same | Same | Same | 0.47 |
| S16c | B16 | MCU from `ae_airport_sunrise` (world) + `ae_stadium_concourse` (face) | Same | Same | Same | 0.47 |
| S16d | B16 | MCU from R2 | Same | Same | Same | 0.47 |
| S17 | B16 | R3 | Small on the dirt track, walking slowly; mist moves in the folds of the mountains | Very slow crane up and back | Low sun, long cool shadows, grey-olive | 1.875 |
| S18 | B17 | `se_150800`, first-light grade (S06a's plate) | Stands up from the rock and faces into the wind; coat moves; phone in pocket; shoulders down; still. The wind does not stop | One slow continuous push-in | Cold sky, warm edge of first light | 1.875 |
| S19 | B18 | N4 (flopped) | Walks RTL along the stone path at her own pace, red device at her side; slows at ≈1.6 s and turns toward the river | Side-track at shoulder height, at her pace | Sunrise mist, warm rim, cool water | 1.875 |
| S20 | B19 | N2 | Stands on the bank as the sun clears the mist; one slow breath; hair moves | Holds 12 frames, then a very slow crane up and back | Full sunrise, gold core in cool haze | 1.875 |
| S21 | B20 | N3, second take | Turns to the lens, calm nod, raises the red phone back-first until red fills the frame at ≈1.75 s (≤6 frames full red) | Slow push-in | First sun, warm rim | 1.875 |

**Rules for every prompt.**
- One persona per shot, the library wardrobe, one red device. Screens face away from camera.
- No text, UI, digits, charts or logos in the footage.
- Frame 0 is already moving.
- Before 30.000 the camera never travels with a trader; after it, forward moves, and one walk beside (S19).
- Dark beats (B01–B09): nobody at an edge, a waterline or a height; nobody looks down into water. Check every take.
- Twins start from one plate graded two ways (SA-S night/dawn, `se_150800` dusk/first light, R1/R2 scale-matched), so the start frames match.
- The four S16 portraits match: eye line, lens feel, drift speed and sun direction.

---

## 10. End card and risk strip

| Time | Element |
|---|---|
| 45.0 (D minor) | «لأننا في آكسي» / «متداولون مثلك» [S2, 1.4], closing the 45-second sentence |
| 48.75 (G) | «نسمي المخاطر» / «بأسمائها» [7.3, 7.7, SC §4] |
| 50.625 (fill) | «معك في كل صفقة» [2.1, Axi's own Arabic heading, verbatim] |
| **52.5 (C-major arrival)** | **«بناها متداولون» / «من أجل المتداولين» / `Built by traders, for traders`** [1.3, S17] |
| **54.375 → 60.000** | **Risk strip**, 5.625 s (the rule asks for at least the last 3 s) |
| 56.25–57.25 | Red card: #E4002E, white Axi logo at (540, 760), 1.0 s |
| 57.25–60.0 | End card on #171819 → #0B0D0D |

**End card layout (57.25–60.0).**
- White «آكسي العراق» lockup top-right, ≥120 px, y≈200–330.
- White Axi logo at (540, 760), ≈260 px wide, held in place from the red card.
- «منذ 2007» [1.1, S19] under the Axi logo at y≈870, Rabar 017 Regular 32 px, 70% white. It always sits under the Axi logo, never under «آكسي العراق» (Axi Iraq is not "since 2007").
- Red pill (#E4002E, 72 px tall, y≈1100–1172, x ≤ 940): «شاركه مع متداول تعرفه» in Rabar 016 Bold 30 px white. It fades up at 57.65625 (f1729) over 10 frames, with no spring and no pulse, and fades on the last beat (f1785–1799). Paid variant: «افتح حسابك».
- Two 26 px red triangles in the bottom corners, above the strip.
- The music fades 58.5–60.0.

**Risk strip, verbatim from `axi-iraq-copytrading/SCRIPT.md` §4:**

> ينطوي التداول على مخاطر. قد تخسر أكثر مما تستثمر. الأداء السابق لا يضمن النتائج المستقبلية. تروج بواسطة شركة AxiTrader LLC.

Set in three lines of 70 characters or fewer:
1. «ينطوي التداول على مخاطر. قد تخسر أكثر مما تستثمر.»
2. «الأداء السابق لا يضمن النتائج المستقبلية.»
3. «تروج بواسطة شركة AxiTrader LLC.»

**Spec:** Rabar 017 Regular ≥39 px, Carbon #242528 on a 92% white strip, box y 1350–1580, x 54–940, clear of the watermark and the Reels rail. It slides up 40 px in 10 frames at f1631 and **never fades**; only the pill fades. If Legal requires the 4-line IQ p60 strip, raise the box top to y≈1300.

---

## 11. Compliance check

| Check | Status |
|---|---|
| No «لن تمشي وحدك» / "You'll Never Walk Alone" [9.5]. No «الوحدة», «الغربة» or «لست وحدك» | Pass |
| No promise of profit or success, no "guarantee" [9.1, 9.2]. The good half is about how a trader stands; «أيا كانت النتيجة» is outcome-neutral; no money, P/L, green or celebration | Pass |
| Nothing implies Axi trades, decides or advises [9.3]. «بقرار اتخذته بنفسك» keeps the decision with the trader; «معك في كل صفقة» is Axi's heading for support and resources; no "get it back" anywhere | Pass |
| Nothing removes risk or emotion [9.4, 3.4]. The night line stays on screen under the morning; the wind keeps blowing in B17; calm is "whatever the outcome", never "no fear" | Pass |
| No advice: no line tells anyone to trade, wait, exit or size; the rule lines describe, they don't prescribe. The only imperative is the share pill | Pass |
| No founders claim [9.7]: «بناها متداولون» [1.3], «لأننا في آكسي متداولون مثلك» [1.4, P] | Pass |
| «منذ 2007» [1.1, V] under the Axi logo only | Pass |
| «نسمي المخاطر بأسمائها» claims plain risk disclosure; basis 7.3, 7.7 and the on-screen strip | **Legal to approve (§14)** |
| No numbers, awards, community or support-hours claims [9.6, 9.8–9.14]. The nights show the trader's night, never Axi answering | Pass |
| Personas are fictional brand characters [8.6]: no «أنا», no results, no testimonial. Caption: «الشخصيات في الفيديو شخصيات تمثيلية»; use Instagram's AI label | Pass |
| The 1923 quote: caption only, public domain, our own translation, credited to the book, never to Livermore | Pass, **Legal to approve** |
| Self-harm reading: N1 painted inland from the quay edge; Sarmad inside the room, seated, back from the glass; Saeed seated on broad rock, no drop in frame; the elevator enclosed; nobody looks into water | Pass, **check every take** |
| Only the five approved faces, one per shot [8.1] | Pass, **five in one film needs the exception (§14)** |
| No landmarks, flags, domes, minarets, religious or political symbols; all charts painted out [8.4, 9.17] | Pass, **check every plate** |
| Red ≤10% of each frame; no red text on footage; full red ≤6 frames of the phone push, then the red card; no green or mint [8.8] | Pass |
| Video structure: lockup 0–1.5 s, watermark throughout, 1 s red card, CTA with a red button, risk strip in the last ≥3 s [8.9] | Pass, lockup over the hook (§14) |
| Arabic: white MSA, no diacritics, ≤5 words a line, ≤2 lines a beat, Western digits, Latin on its own line, word-by-word animation only [8.7] | Pass |
| Audio disclosure at the end of a promotional video (IQ p60) | **Open (§14)** |
| Music: Mixkit Free licence, inside the video only, no Content ID, not cleared for TV or radio | Pass |

---

## 12. Caption and hashtags

```
نعرف الدقيقة التي تسبق افتتاح السوق.
والثانية التي تسبق القرار.
والصمت الذي يلي الخسارة.
وقاعدة كتبت قبل الجلسة، وكسرت في دقيقة.
والصفقة التالية، حين يكتبها الغضب.
والابتسامة التي تخفي يوما صعبا.
والشك، بعد الإغلاق.
والليالي الطويلة.

ونعرف الصباح أيضا.
والوضوح، حين يهدأ الضجيج.
والصبر الذي لا يراه أحد.
وقاعدة كتبت قبل الجلسة، واحترمت حتى النهاية.
والثقة بقرار اتخذته بنفسك.
والهدوء، أيا كانت النتيجة.

لأننا في آكسي متداولون مثلك.
نسمي المخاطر بأسمائها.
معك في كل صفقة.

آكسي، منذ 2007. بناها متداولون، من أجل المتداولين.
Built by traders, for traders

ومن كتاب صدر عام 1923:
«الأمل والخوف لا ينفصلان عن طبيعة الإنسان»
Reminiscences of a Stock Operator

أي لحظة من هذه تعرفها أكثر؟
وشارك الفيديو مع متداول تعرفه.

الشخصيات في الفيديو شخصيات تمثيلية. ترجمة الاقتباس من إعدادنا.

تحذير المخاطر: ينطوي التداول على مخاطر. قد تخسر أكثر مما تستثمر. الأداء السابق لا يضمن النتائج المستقبلية. تعتبر العقود المشتقة خارج البورصة (OTC) أدوات معقدة وتنطوي على مخاطر عالية لخسارة أكثر من استثمارك الأولي بسرعة بسبب الرافعة المالية. لا تعد شركة AxiTrader مستشارا ماليا، ويتم تقديم جميع الخدمات على أساس التنفيذ فقط. هذا المحتوى ليس نصيحة استثمارية، وقد لا يكون متاحا في منطقتك. تروج بواسطة شركة AxiTrader LLC.

#من_متداول_لمتداول #آكسي_العراق #AxiIraq #BuiltByTraders #TradeYourEdge #تداول
```

- The caption is the film's sentence written out, so the post reads as a manifesto even with the sound off.
- The quote is Lefèvre, *Reminiscences of a Stock Operator* (1923), ch. X, verbatim "It is inseparable from human nature to hope and to fear." (checked against Project Gutenberg #60979; see EMOTION_MAP §4). The book is credited, never Livermore.
- The risk paragraph combines [7.7], [7.3] and [7.2] (diacritics removed), the SC §4 entity line and the IQ p60 "not advice / may not be available" lines.
- **Comment moderation:** reply in calm white MSA, in the house voice. Never give advice, forecasts or signals; never mention support hours; never say «نعوضك» or «سترجع خسارتك»; never reference Livermore's death.
- **Posting:** organic, 22:00–01:00 Baghdad time, when the trader the film describes is awake at the screen.

---

## 13. Hooks (A/B)

Same plate (N1) and the same timing for all three: line 1 settles from f0, line 2 from 0.9375.

| # | Hook | Use |
|---|---|---|
| **H1 (chosen)** | «نعرف الدقيقة» / «التي تسبق افتتاح السوق» (We know the minute / before the market opens) | The institution speaks first, with precision. It opens the time motif (minute → second → session → the close → nights → morning) |
| H2 | «نعرف» / «ما لا تظهره الشاشة» (We know / what the screen doesn't show) | The broadest thumb-stop: it names the film's subject in 4 words. The litany continues unchanged from B02. Best A/B against H1 |
| H3 | «كل متداول يعرف» / «هذه الدقيقة» (Every trader knows / this minute) | Identity call-out for cold reach and paid cutdowns. The house's «نحن» then enters on the LIFT with «ونعرف الصباح أيضا» |

---

## 14. Open decisions (clear before publishing)

1. **The «نعرف» device.** v1 also used «نعرف…», then for feelings («حين شعرت أنك وحدك»). v3 uses it as the governing verb of one institutional sentence about precise moments, across both halves. If the client reads it as a return to v1, Draft B's codex («لكل مبدأ في التداول / ثمن دفعه أحدهم») is the fallback structure.
2. **Five faces in one film.** IQ p46/p50 allow at most two personas per post, and Noor with only one other. Needs a written exception from the Axi Iraq brand manager and HQ (IQ p70), or a ruling that "post" means "frame".
3. **Sarmad and Rojin** are the Kurdish-audience faces (IQ p46). Confirm their use in an Arabic-copy ad; a Kurdish-caption version is an option.
4. **The chain under «لأننا في آكسي متداولون مثلك»** shows four persona faces. They are Axi's official brand characters with no results attached; brand to confirm the reading.
5. **Legal:** «نسمي المخاطر بأسمائها». Fallback for the G bar: «منذ 2007» [1.1, V] over the same picture.
6. **Legal:** risk-strip wording, and whether the IQ p50 or p60 line is required.
7. **Audio disclosure (IQ p60)** against the no-voice-over brief: a written exception, or a 3 s spoken risk line over the end card only.
8. **The river bookend.** N2 as delivered is a rocky stretch of the bank, not N1's quay framing, so the hook-to-signature rhyme is "the same river", not the same frame. Option: relight N1 to sunrise (image edit, framing kept) as the start frame for B19 to land a pixel-exact bookend; N2 stays as the fallback.
9. **R2 edit:** the delivered R2 has no notebook and is framed tighter than R1. It needs the notebook added, the phone laid face down, and a scale match (§8).
10. **The 1923 quote on screen?** Recommended: caption only. If the client wants it on picture: the quote takes 45.0–48.75 over R3 (book register, our translation, `Reminiscences of a Stock Operator, 1923` on its own Latin line); «لأننا في آكسي / متداولون مثلك» moves to the chain on G (48.75); «نسمي المخاطر بأسمائها» moves to the fill (50.625) over Saeed; «معك في كل صفقة» moves to the end card above the pill.
11. **Opening lockup** laid over the hook instead of a dedicated 1.5 s open; the official ident sound is not in hand.
12. **Share CTA:** confirm the pill «شاركه مع متداول تعرفه» meets "CTA screen with a red button". «افتح حسابك» for paid cuts.
13. **The red card** exits 2 frames off the grid (57.25) to hold a full second.
14. **Aesha's face** must match across the three plates and the generated MCU.
15. **Proofread:** the passive readings of «كتبت / كسرت / احترمت», and «الجلسة» for the trading session.
16. **Music:** listen to `src/music/ad_music_60.wav` once before the edit locks; it was chosen and verified by measurement only.
