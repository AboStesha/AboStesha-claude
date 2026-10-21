# Axi · «بناها متداولون»: voice-over script for ElevenLabs

The words are the locked on-screen script (`docs/SCRIPT_FINAL.md`), unchanged. Light diacritics mark only the words a voice can misread (رسمتَه، قرّرتَ، تُغلِق، أبدًا…). «منذ 2007» is written out as «منذُ عام ألفين وسبعة».

## Settings
- **Model:** Eleven v3. The English words in [brackets] are v3 audio tags and are not spoken.
  - If you use Multilingual v2 instead, delete the [bracket] lines first.
- **Voice:** a calm, low MSA narrator, male or female.
- **Stability:** Natural (0.5).
- **Speed:** about 0.9.
- **v2 only:** similarity 0.75, style 0.1–0.2, speaker boost on.

## Paste-ready text (one take)
```
[calm]
أوَّلُ صفقةٍ ناجحة... لا تنساها أبدًا.

يرتدُّ السعر... من الخطِّ الذي رسمتَه.

تلتزمُ بخطَّتِك... فتُؤتي ثمارَها.

تشتري متأخِّرًا... عند أعلى سعر.

تدخلُ رغمَ الخوف... وتنجحُ الصفقة.

صفقةٌ مفتوحة... ولا تستطيعُ النوم.

تراقبُ الخسارةَ تكبُر... ولا تُغلِقُ الصفقة.

تضغطُ زرَّ الشراء... ويتحرَّكُ السعرُ معك فورًا.

[softly]
خسارةٌ بعد خسارة... وتشكُّ في نفسِك.

[calm]
قرَّرتَ ألّا تدخل... وكنتَ على حق.

تستيقظ... والصفقةُ وصلت إلى هدفِها.

خبرٌ مفاجئ... يقلبُ السوقَ ضدَّك.

تشعرُ أنَّ شموعَك... تُحرِّكُ أحداثَ العالم.

[warm]
في آكسي... نحنُ متداولون مثلُك.

لذلك نفهمُ ما تمرُّ به... في الأيامِ الصعبةِ والجيِّدة.

[confident]
بناها متداولون... من أجلِ المتداولين.

آكسي... منذُ عام ألفين وسبعة.
```

## Where each line goes in the film (start each clip at its "in" time)
| # | in (s) | must end by (s) | line |
|---|---|---|---|
| 1 | 0.15 | 3.6 | أوَّلُ صفقةٍ ناجحة... لا تنساها أبدًا |
| 2 | 3.9 | 6.4 | يرتدُّ السعر... من الخطِّ الذي رسمتَه |
| 3 | 6.7 | 9.2 | تلتزمُ بخطَّتِك... فتُؤتي ثمارَها |
| 4 | 9.5 | 12.0 | تشتري متأخِّرًا... عند أعلى سعر |
| 5 | 12.3 | 14.8 | تدخلُ رغمَ الخوف... وتنجحُ الصفقة |
| 6 | 15.1 | 17.6 | صفقةٌ مفتوحة... ولا تستطيعُ النوم |
| 7 | 17.95 | 21.4 | تراقبُ الخسارةَ تكبُر... ولا تُغلِقُ الصفقة |
| 8 | 21.7 | 25.1 | تضغطُ زرَّ الشراء... ويتحرَّكُ السعرُ معك فورًا |
| 9 | 25.45 | 28.0 | خسارةٌ بعد خسارة... وتشكُّ في نفسِك (then silence: the breath, 28.1–30.0) |
| 10 | 30.15 | 33.5 | قرَّرتَ ألّا تدخل... وكنتَ على حق (the music lifts at 30.0) |
| 11 | 33.9 | 37.3 | تستيقظ... والصفقةُ وصلت إلى هدفِها |
| 12 | 37.65 | 40.1 | خبرٌ مفاجئ... يقلبُ السوقَ ضدَّك |
| 13 | 40.45 | 43.9 | تشعرُ أنَّ شموعَك... تُحرِّكُ أحداثَ العالم |
| 14 | 44.2 | 47.6 | في آكسي... نحنُ متداولون مثلُك |
| 15 | 47.95 | 52.3 | لذلك نفهمُ ما تمرُّ به... في الأيامِ الصعبةِ والجيِّدة |
| 16 | 52.65 | 55.1 | بناها متداولون... من أجلِ المتداولين (the music arrives at 52.5) |
| 17 | 55.6 | 58.4 | آكسي... منذُ عام ألفين وسبعة (over the Noor lockup; the music fades out 58.5–60) |

## Tips
- **Line 8** is the longest read: it has to fit in about 3.4 s. If the take runs long, regenerate that line alone at speed 1.0.
- **Mix:** keep the voice about 3 dB above the music and duck the music under it.
- **Line 17:** if the voice clashes with the logo whoosh at 55.6, start it at 55.8.
