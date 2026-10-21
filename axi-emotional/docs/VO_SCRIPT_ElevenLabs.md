# Axi · «بناها متداولون»: voice-over script for ElevenLabs (five voices)

The words are the locked on-screen script (`docs/SCRIPT_FINAL.md`), unchanged.
- Each line is spoken by the character on screen in that shot, so the five traders hand the story to each other.
- Light diacritics mark only the words a voice can misread.
- «منذ 2007» is written out as «منذُ عام ألفين وسبعة».

## How to generate
- **Best: Eleven v3 → Text to Dialogue.** Add one row per line below in order, and set each row's voice to the character named.
- **Or one voice at a time:** use the per-character blocks at the end, then place each line at its timecode.
- **Tags:** the English words in [brackets] are v3 audio tags and are not spoken.
  - The first tag sets the feeling of the scene.
  - The tag after «...» marks where the feeling turns.
  - Multilingual v2 does not read tags, so delete them there.
- **Settings:** stability Natural (0.5), speed about 0.9. Keep tags subtle (no crying, no shouting); the film is restrained.

## Cast (voice direction for the Voice Library or Voice Design)
| Character | On screen | Voice to look for |
|---|---|---|
| **Rojin** | young woman, light-grey suit, Duhok/Amedi | young female, warm, clear MSA, soft-spoken, a smile in the voice |
| **Noor** | woman, charcoal suit, citadel and ziggurat | female, 30s, low and composed, confident and sincere: the brand voice |
| **Aesha** | young woman in hijab, white suit | young female, bright, quick, energetic but controlled |
| **Saeed** | young man, curly dark hair, black coat, Baghdad | male, about 30, slightly husky, intense, inward |
| **Sarmad** | older man, grey hair, moustache | male, 50s, deep, slow and warm, the experienced trader |

## The relay (in order)
```
ROJIN:  [softly, nostalgic] أوَّلُ صفقةٍ ناجحة... [a small smile] لا تنساها أبدًا.

SARMAD: [quietly satisfied] يرتدُّ السعر... [soft knowing chuckle] من الخطِّ الذي رسمتَه.

ROJIN:  [calm, assured] تلتزمُ بخطَّتِك... [content] فتُؤتي ثمارَها.

AESHA:  [rueful] تشتري متأخِّرًا... [sighs] عند أعلى سعر.

NOOR:   [tense, holding her breath] تدخلُ رغمَ الخوف... [exhales, relieved] وتنجحُ الصفقة.

SARMAD: [tired, low, late at night] صفقةٌ مفتوحة... [weary sigh] ولا تستطيعُ النوم.

SAEED:  [tense, under his breath] تراقبُ الخسارةَ تكبُر... [stubborn] ولا تُغلِقُ الصفقة.

AESHA:  [focused] تضغطُ زرَّ الشراء... [excited, breathless] ويتحرَّكُ السعرُ معك فورًا.

SAEED:  [heavy, deflated] خسارةٌ بعد خسارة... [whispers] وتشكُّ في نفسِك.

ROJIN:  [calm, quiet strength] قرَّرتَ ألّا تدخل... [quietly proud] وكنتَ على حق.

SARMAD: [warm, just woken] تستيقظ... [gentle delight] والصفقةُ وصلت إلى هدفِها.

SAEED:  [sharp, alert] خبرٌ مفاجئ... [grim] يقلبُ السوقَ ضدَّك.

ROJIN:  [awed, rising] تشعرُ أنَّ شموعَك... [quiet wonder] تُحرِّكُ أحداثَ العالم.

NOOR:   [warm, sincere, to the viewer] في آكسي... نحنُ متداولون مثلُك.

ROJIN:  [gentle, empathetic] لذلك نفهمُ ما تمرُّ به... في الأيامِ الصعبةِ والجيِّدة.

ALL:    [confident, proud] بناها متداولون... من أجلِ المتداولين.

NOOR:   [calm, assured signature] آكسي... منذُ عام ألفين وسبعة.
```

**ALL (line 16):**
- Generate the line once with each of the five voices, using the same tags.
- Stack the five takes at 52.65 s: Noor at full level, the other four about 6 dB lower.
- The result is five traders saying the thesis of the film together, landing on the music's arrival at 52.5.

## Timecodes (place each line at its "in" time)
| # | in (s) | end by (s) | voice | feeling | line |
|---|---|---|---|---|---|
| 1 | 0.15 | 3.6 | Rojin | nostalgic warmth | أوَّلُ صفقةٍ ناجحة... لا تنساها أبدًا |
| 2 | 3.9 | 6.4 | Sarmad | quiet vindication | يرتدُّ السعر... من الخطِّ الذي رسمتَه |
| 3 | 6.7 | 9.2 | Rojin | calm discipline paying off | تلتزمُ بخطَّتِك... فتُؤتي ثمارَها |
| 4 | 9.5 | 12.0 | Aesha | regret, a wince | تشتري متأخِّرًا... عند أعلى سعر |
| 5 | 12.3 | 14.8 | Noor | fear → relief | تدخلُ رغمَ الخوف... وتنجحُ الصفقة |
| 6 | 15.1 | 17.6 | Sarmad | sleepless fatigue | صفقةٌ مفتوحة... ولا تستطيعُ النوم |
| 7 | 17.95 | 21.4 | Saeed | tension, denial | تراقبُ الخسارةَ تكبُر... ولا تُغلِقُ الصفقة |
| 8 | 21.7 | 25.1 | Aesha | focus → rush | تضغطُ زرَّ الشراء... ويتحرَّكُ السعرُ معك فورًا |
| 9 | 25.45 | 28.0 | Saeed | defeat, self-doubt | خسارةٌ بعد خسارة... وتشكُّ في نفسِك (then silence: the breath, 28.1–30.0) |
| 10 | 30.15 | 33.5 | Rojin | quiet strength (the lift) | قرَّرتَ ألّا تدخل... وكنتَ على حق |
| 11 | 33.9 | 37.3 | Sarmad | morning joy | تستيقظ... والصفقةُ وصلت إلى هدفِها |
| 12 | 37.65 | 40.1 | Saeed | alarm, gravity | خبرٌ مفاجئ... يقلبُ السوقَ ضدَّك |
| 13 | 40.45 | 43.9 | Rojin | awe, pride | تشعرُ أنَّ شموعَك... تُحرِّكُ أحداثَ العالم |
| 14 | 44.2 | 47.6 | Noor | sincere warmth | في آكسي... نحنُ متداولون مثلُك |
| 15 | 47.95 | 52.3 | Rojin | empathy | لذلك نفهمُ ما تمرُّ به... في الأيامِ الصعبةِ والجيِّدة |
| 16 | 52.65 | 55.1 | ALL (Noor leads) | unified pride | بناها متداولون... من أجلِ المتداولين |
| 17 | 55.8 | 58.4 | Noor | calm signature | آكسي... منذُ عام ألفين وسبعة |

## Per-character blocks (for one voice at a time; lines in film order)
**Rojin**: lines 1, 3, 10, 13, 15 (+16)
```
[softly, nostalgic] أوَّلُ صفقةٍ ناجحة... [a small smile] لا تنساها أبدًا.

[calm, assured] تلتزمُ بخطَّتِك... [content] فتُؤتي ثمارَها.

[calm, quiet strength] قرَّرتَ ألّا تدخل... [quietly proud] وكنتَ على حق.

[awed, rising] تشعرُ أنَّ شموعَك... [quiet wonder] تُحرِّكُ أحداثَ العالم.

[gentle, empathetic] لذلك نفهمُ ما تمرُّ به... في الأيامِ الصعبةِ والجيِّدة.

[confident, proud] بناها متداولون... من أجلِ المتداولين.
```
**Noor**: lines 5, 14, 16, 17
```
[tense, holding her breath] تدخلُ رغمَ الخوف... [exhales, relieved] وتنجحُ الصفقة.

[warm, sincere, to the viewer] في آكسي... نحنُ متداولون مثلُك.

[confident, proud] بناها متداولون... من أجلِ المتداولين.

[calm, assured signature] آكسي... منذُ عام ألفين وسبعة.
```
**Aesha**: lines 4, 8 (+16)
```
[rueful] تشتري متأخِّرًا... [sighs] عند أعلى سعر.

[focused] تضغطُ زرَّ الشراء... [excited, breathless] ويتحرَّكُ السعرُ معك فورًا.

[confident, proud] بناها متداولون... من أجلِ المتداولين.
```
**Saeed**: lines 7, 9, 12 (+16)
```
[tense, under his breath] تراقبُ الخسارةَ تكبُر... [stubborn] ولا تُغلِقُ الصفقة.

[heavy, deflated] خسارةٌ بعد خسارة... [whispers] وتشكُّ في نفسِك.

[sharp, alert] خبرٌ مفاجئ... [grim] يقلبُ السوقَ ضدَّك.

[confident, proud] بناها متداولون... من أجلِ المتداولين.
```
**Sarmad**: lines 2, 6, 11 (+16)
```
[quietly satisfied] يرتدُّ السعر... [soft knowing chuckle] من الخطِّ الذي رسمتَه.

[tired, low, late at night] صفقةٌ مفتوحة... [weary sigh] ولا تستطيعُ النوم.

[warm, just woken] تستيقظ... [gentle delight] والصفقةُ وصلت إلى هدفِها.

[confident, proud] بناها متداولون... من أجلِ المتداولين.
```

## Tips
- **Line 8** is the fastest read (about 3.4 s). If it runs long, regenerate it alone at speed 1.0.
- **Mix:** keep the voices about 3 dB above the music and duck the music under them. Leave 28.1–30.0 silent so the breath and the lift still hit.
- **Weak tags:** if a tag comes out too strong or theatrical, regenerate with only the first tag of the line.
