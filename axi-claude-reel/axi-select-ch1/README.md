# Axi Select explainer series, chapter 1: "(1) كيف تبدأ مع Axi Select", with Rabee (16:9)

1920×1080 · 25 fps · 120.0 s (3000 frames) · H.264 + AAC 48 kHz · −14.2 LUFS, −1.4 dBTP

## Files

| File | Use |
|---|---|
| `AxiSelect_Ch1_Rabee_16x9.mp4` | Chapter 1, with Arabic subtitles burned in (for social feeds, where most people watch muted) |
| `AxiSelect_Ch1_Rabee_16x9_clean.mp4` | The same cut without subtitles (for YouTube with an SRT, or to add your own captions) |
| `AxiSelect_Ch1_Rabee_cover.jpg` | Cover / thumbnail |
| `AxiSelect_Ch1_subtitles_ar.srt` | The subtitles as a separate file |

## Voice

- **Source:** your file `rabee_1st_chapter.wav` (112.5 s).
- **Cleaning:** I separated Rabee's voice from the music and SFX with Demucs (htdemucs_ft, plus htdemucs for one 0.25 s sibilant). ElevenLabs Voice Isolator could not run because the account has 3 credits left.
- **Unchanged:** his words, timing, pitch and tone are not edited. The only processing is:
  - a 55 Hz high-pass;
  - a gentle gate in the pauses;
  - one 0.9 s high-band cut that removes a leftover swish at 19.6 s;
  - a light 2:1 level compressor in the mix.
- **Key numbers checked:** a second transcription (Whisper large-v3) of the cleaned voice confirms «500 دولار», «ستّ مراحل», «Pro M» and «10%».
  - «5,000 دولار» sits under a loud cash swish in the original. The duration and the official Seed figure ($500 × 10) point to 5,000.

## Lip sync and angles

- **HeyGen Avatar V:** all five Rabee looks were driven by the clean voice, full length, at 1080p.
  - I tested Avatar IV and Avatar V on the same 15 s clip. Avatar V looks clearly more real: natural expressions and varied hand gestures, without Avatar IV's constant grin.
- **Multicam:** the edit cuts between five angles, all from the same lip-synced take:
  - frontal wide on the stool;
  - frontal medium;
  - three-quarter;
  - close-up;
  - profile.

## Style taken from the references

- **Black studio:** a black void with a spotlit grey floor, Rabee on a bar stool, and the graphics living in the empty space around him. They never cover him.
- **Virtual camera:** like the MBC references, the main camera is one continuous 2.5D camera.
  - Its framings are HOME, WIDE (Rabee about 24% of the frame) and EXTREME WIDE (about 17%).
  - Pull-outs take 0.6 s, with a fast attack, an expo ease-out and real motion blur. Push-ins use an S-curve.
  - The wide shots extend L4's own floor into a larger studio, so Rabee can be shown small in a pool of light.
- **Cuts:** hard cuts on breaths go to the medium, three-quarter, close-up and profile angles for lists and punch lines («مبروك!», «ملاحظة مهمة», «معامل الضرب»).
- **Graphics:**
  - smoked-glass tiles with red number badges, like the social-media tiles in reference 3;
  - floor tiles that light up mint, and red for the drawdown limit, like reference 4;
  - roll-up counters and a chapter card with a dry-brush stroke at −15°.
- **Brand:** Axi mint #76DFC3 (measured from the official ident), Axi red #E4002E, white, and the axi logo.
  - Alexandria stands in for Rabar; Inter is used for numbers and Latin text.

## Film

| Time (s) | What you see |
|---|---|
| 0–3 | Chapter card «(1) كيف تبدأ / مع Axi Select» |
| 3–7 | HOME, then a pull-out to the wide on «Axi Select»; the lockup appears in the void |
| 7–18 | The topics («الاشتراك», «التقدّم في المراحل»); the Axi Select trading account card with a live chart |
| 18–25 | **Music drop** on «وبمجرد»; the floor ripples; the Edge Score gauge sweeps to 50; then the two conditions (Edge Score 50+, $500) |
| 25–35 | Axi opens the allocation account (حساب التخصيص), and a link joins the two accounts |
| 35–47 | «مبروك!»; the Seed tile lights on the floor; **$5,000** |
| 47–63 | Six stages: the tile row builds right to left, and each stage lights as he names it (Seed → Pro M) |
| 63–71 | Funding from Axi; your share of the profits (up to 80%) |
| 71–81 | «يعني لنبسّطها أكثر»: your trading account + the funded allocation account |
| 81–88 | «ملاحظة مهمة»: the allocation account is locked for direct trading and linked automatically |
| 88–94 | **Second drop** on «بحساب التداول»: trades are copied along the arc, 0.01 → 0.1 lot, ×10 |
| 94–99 | «احفظ كلمة معامل الضرب» |
| 99–108 | The rules of every stage; at «وأهمها» the floor turns red and **10%** appears |
| 108–114 | Push back HOME; upcoming chapters (1 of 5, next: chapter 2) |
| 114–120 | Axi slash wipe, then the Axi Select end card «انضم إلى آكسي سيليكت», then a fade to black |

## Sound

- **Music:**
  - "Corporate tutorial" instrumental from HeyGen's music library (110 BPM), re-cut on its beat grid:
    - the drop lands on «وبمجرد»;
    - the second section starts exactly on «بحساب التداول»;
    - a break sits under «يجب القيام بها», and the re-drop comes on «وأهمها»;
    - the final hit lands on the end card.
  - It is ducked under the voice.
- **SFX:** 90 recorded CC0 sounds (licences in the project state): UI blips, glass swishes, whooshes on the camera moves, sub hits on the drops.

## Please check before publishing

1. **Drawdown 10%:** Rabee says the allocation-account drawdown must not reach 10%.
   - Axi's current help centre says the max loss is **7% for Seed through Pro 500, and 10% only for Pro M**.
   - I kept his words and added a small on-screen note: «* قد تختلف النسبة حسب المرحلة وفق شروط البرنامج».
   - If you can, re-record that line.
2. **Stage amounts and the 80% profit share:**
   - The funding cap on each stage tile ($5,000 → $1,000,000) and "up to 80%" come from axi.com/int/funded-trader-program.
   - Rabee does not say these numbers.
3. **Example values:** the "×10, 0.01 → 0.1 lot" example is Axi's own Seed example.
4. **Risk warning:** none on screen, as in the earlier Axi ads. The end card carries the T&C line «تخضع عمليات تخصيص رأس المال في Axi Select لشروط وأحكام البرنامج». Confirm with compliance before paid use.

## Chapters 2–5: what I need

- **Chapter 2 (Rabee):** send the chapter 2 voice-over WAV. Everything else is ready to repeat in about an hour:
  - voice clean-up;
  - HeyGen Avatar V on the same five looks;
  - the virtual camera, graphics kit, music and SFX.
- **Chapters 3–5 (Diva):**
  - send her three voice-over files;
  - add a "Diva" avatar to the HeyGen account. The account has no Diva yet: a photo avatar like Rabee's 5 looks, in the same black studio on a stool.

Suggested topics that continue chapter 1, which promises "معامل الضرب" and "تفاصيل وقواعد كل مرحلة":

| Ch | Presenter | Topic |
|---|---|---|
| 2 | Rabee | معامل الضرب: how the allocation is calculated ($500 × 10 = $5,000; 0.01 → 0.1 lot), the cap of each stage |
| 3 | Diva | درجة Edge: skill, risk, consistency and experience; at least 20 unique trades; the score each stage needs (50 / 60 / 70 / 90) |
| 4 | Diva | الانتقال بين المراحل: the 7% profit target, the minimum days and trades, closing all positions, "Next Stage" |
| 5 | Diva | الأرباح والحدود: profit share by stage (0% → 80%), payouts on the 1st of each month, max loss, quarantine, how withdrawals affect the allocation |

## How it was made

- **Voice:** Demucs separation in the Higgsfield sandbox.
- **Lip sync:** HeyGen Avatar V (5 looks, the user's Rabee avatar group).
- **Compositing:** the Higgsfield Katana canvas compositor with a project `fx.js`, which holds:
  - the virtual camera;
  - the floor light, multiplied by the plate so his legs and the stool keep their shadows;
  - the glass UI, counters, the six-stage row, subtitles and the end card.
- **Edit and sound:** a Python EDL and an audio builder.
- **Credits:**
  - HeyGen spent 473 premium credits: 2 tests and 5 full-length videos. 2,466 are left.
  - Higgsfield credits used: 0. ElevenLabs credits used: 0 (the account has 3 left).

## Project files

`project/` holds the code that builds this chapter, so chapters 2–5 can reuse it:

- `fx.js`: the virtual camera and all the graphics;
- `edl_build.py`: shot list, camera moves and subtitles;
- `audio_build.py`: music re-cut, SFX cues and mix.

The full working state (clean voice, mix, EDL, assets) is saved in Higgsfield as `axi-select-ch1_v1_state.tar.gz`.
