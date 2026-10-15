# Axi Academy — 15-second promo, two versions

This folder holds two vertical promos for «أكاديمية آكسي». Both use motion graphics with music and sound effects, and there is no voice-over.

They were built with Higgsfield Katana, which handled the reference analysis, the page renderer and the QA gate. Every frame is drawn by code, so no credits were spent.

Both promos share these specs:
- 1080×1920, 9:16.
- 60 fps, 900 frames, 15 s.

| Version | Style | Video (Higgsfield) | Project state (for revisions) |
|---|---|---|---|
| **A** (v4) | Kinetic typography «من الصفر»: the red dot is the zero every beginner starts from. It becomes the full stop of each line and, in the end, *your* red seat among 1000. | https://d2ol7oe51mr4n9.cloudfront.net/user_31whQkWWK9m41YEVOr0IugdLlfs/a96278a8-68b0-409f-b27f-ecd4b89fdec0.mp4 | https://d2ol7oe51mr4n9.cloudfront.net/user_31whQkWWK9m41YEVOr0IugdLlfs/a92c3b03-40d9-4e9f-819f-fcea3769943c.gz |
| **B** (v2) | SaaS UI «مقعدك محجوز»: the beginner's question is typed, then becomes one answer. A click opens 1000 free seats, a learning path runs from zero to pro, and one seat gets booked. | https://d2ol7oe51mr4n9.cloudfront.net/user_31whQkWWK9m41YEVOr0IugdLlfs/0be3964f-0055-49f7-9531-dd39ebbfa1f1.mp4 | https://d2ol7oe51mr4n9.cloudfront.net/user_31whQkWWK9m41YEVOr0IugdLlfs/485250d4-fa13-45a0-a347-5658725d76ee.gz |

## On screen

- Lines: «تعلّم التداول من الصفر إلى الاحتراف» · «أكاديمية آكسي» · «قريباً» · «مجانية لأول 1000 طالب فقط» · «احجز مقعدك الآن».
- The call to action is axi.com/ar.
- Branding follows `../BRAND.md`:
  - The film opens with the logo on the primary gradient and closes with the X sting.
  - Axi red is used for less than 10 % of the frame.
  - Western digits are set in Inter.
  - The X watermark sits bottom-left.
  - The risk strip shows for the last 3 s.
  - The 10 % top and 15 % bottom safe zones are respected.
- The only number on screen is the 1000 seats.

## Audio

- **Music** is licensed under the Mixkit Stock Music Free License:
  - A uses #726 "Uplifting Bass".
  - B uses #201 "Swish Swed".
  - The license covers social posts and online ads. It does not cover TV or radio broadcast.
- **SFX** are CC0. The licenses are listed in the project state under `audio/sfx_licenses.txt`.
- **Mix:** −14 LUFS, with a true peak of −3.4 dBTP for A and −2.5 dBTP for B. These levels were measured; the mix was not listened to.

## QA

Each delivered file passed the Katana gate:
- 900 frames at constant 60 fps, BT.709.
- Every frame inspected on per-second sheets, plus native crops of all text.
- No open blocking items.
- Energy against the reference at or above 0.6× on every measure:
  - A: cuts 1.39×, shake 0.71×, motion 0.65×.
  - B: cuts 0.97×, shake 1.00×, motion 0.67×.

The visual reviews are in `qa/`. The full gate files are `qa/gate_vN.md` inside each project state.

## Files

| Path | Contents |
|---|---|
| `src/index.html` | The page. `hfPage` renders f(t) with up to 16 motion-blur sub-samples. |
| `src/lib.js` | The shared kit: easing, Arabic letter units, logo and X marks, ripple, odometer, risk strip, marquee, shimmer. |
| `src/film_a.js` and `src/film_b.js` | The two films. Each has one function per scene, and `T` holds the scene times on the beat grid. |
| `src/assets/brand_paths.js` | The official marks as vector paths. |
| `patches/` | The repair passes applied after each QA round. |
| `tools/` | Builders for the analysis and plan records, the QA finaliser and the handoff writer. |

The fonts are not in this folder. Both are OFL-licensed variable fonts, kept in the project state under `motion/fonts`:
- Readex Pro, which has the HEXP axis.
- Inter.

## Revising

1. In the Higgsfield sandbox, run `source "$HF_WORKFLOWS/katana/scripts/rr.sh"`.
2. Run `rr_restore axipromo-a-1015 '<state url>'`. For B, use `axipromo-b-1015`.
3. Edit `motion/film.js`.
4. Render with `$RR/comp/page_render.py`.

`HANDOFF.md` inside each project state has the exact commands.
