import json, sys, os
S = sys.argv[1]
FPS = 60
def fr(t): return int(round(t * FPS))
common_target = {"width": 1080, "height": 1920, "aspect": "9:16", "fps": "60/1", "frames": 900, "duration_s": 15.0,
                 "audio": {"interval_s": [0, 15.0], "codec": "aac 48 kHz stereo", "loudness": "-14 LUFS integrated, -1 dBTP"},
                 "color": "sRGB / BT.709 tagged, yuv420p", "renderer": "$RR/comp/page_render.py (motion/index.html, canvas 2D)",
                 "locks": ["9:16 1080x1920", "15 s", "no voice-over", "music + SFX", "message wording", "Axi brand rules"]}
brand = {"logo_open": "0.00-1.40 s white stacked logo on the primary vertical gradient with an ident hit (brand: logo opens, 1.5 s)",
         "x_sting": "centred X mark drop-and-settle ~1 s before the CTA (brand: X closes)",
         "watermark": "white X 60% opacity, 4% of width, bottom-left, whole video",
         "risk_strip": "12.00-15.00 s standard Arabic risk text above the platform UI zone",
         "safe_zone": "key text inside y 240-1500 px, x 90-990 px (10% top / 15% bottom free, Reels/TikTok right rail clear)",
         "red_budget": "Axi red only for the dot motif, caret, seat, CTA pill (<=10% of any frame)",
         "fonts": "Readex Pro variable (wght 160-700, HEXP 0-100, OFL, Google Fonts) for Arabic; Inter variable (bundled, OFL) for digits/tokens"}
if S == 'a':
    beat0, spb = 1.40, 60 / 134.0
    B = lambda k: round(beat0 + k * spb, 3)
    plan = {
      "schema": "rr.creative-plan/1", "version": "A - kinetic typography", "output_target": common_target,
      "concept": "«من الصفر» — a single red dot is the zero every beginner starts from. It punctuates every word of the journey, and in the end it becomes your seat, the one red seat among a thousand free ones.",
      "logline": "One red dot grows from zero into a professional line of type, then becomes your reserved seat at Axi Academy.",
      "motif": {"element": "red dot (Axi red #E4002E)",
                "setup": "logo open: the dot pops first and the logo collapses back into it (0.0-1.4 s)",
                "development": ["the dot is the zero next to «الصفر» (3.2 s)", "the dot is the full stop of the academy line «ثم تداول.» (6.3 s)", "the dot blinks as the 'coming soon' indicator by «قريباً» (7.7 s)"],
                "payoff": "in a grid of 1000 light seats one dot turns red and pulses: «مقعدك» (10.4 s), the camera dives into it for the X sting"},
      "typographic_device": "weight is meaning: the type grows from hairline (wght 160) at «من الصفر» to black (wght 700) at «إلى الاحتراف»; HEXP width stretch only as an impact squash-and-stretch on slams, never as a resting state (brand: no kashida)",
      "music": {"plan": "stock_track", "asset": "Mixkit item 726 'Uplifting Bass' (Mixkit Stock Music Free License: social media posts and online marketing ads allowed)",
                "segment_s": [12.88, 27.88], "bpm": 134.0, "drop_at_output_s": 1.40, "edit": "segment starts on the riser so the drop lands on the first content beat; 0.6 s fade-out at the end",
                "evidence": "measured only (no listening tool): drop at 14.28 s (low band x3.8, RMS 0.115->0.319), beat confidence 0.97"},
      "beats": {"bpm": 134.0, "first_drop": beat0, "spb": round(spb, 5)},
      "shots": [
        {"id": "o01", "t": [0.0, 1.40], "role": "brand open / hook", "beats": "pre-drop riser",
         "action": "black; red dot pops at centre (0.06) with a ring burst; dot expands as an iris revealing the primary vertical gradient (0.06-0.50); white stacked logo builds axi then العراق (0.45-0.95); logo shrinks back into the red dot (0.95-1.30); dot holds alone (anticipation)",
         "camera": "slight push-in 1.00->1.04", "text": "logo (official paths)", "sound": "ident hit + riser tail from the track", "source_evidence": "A c01 dot->starburst->dot, A c02 iris"},
        {"id": "o02", "t": [1.40, B(4)], "role": "promise part 1", "action": "on the drop the dot bursts: «تعلّم» slams in with horizontal smear and squash-stretch (B0), «التداول» slams under it (B1), both breathe on the beat; at B3.5 the line squeezes into a bar and wipes off upward",
         "camera": "impact shake 6 px on each slam", "text": ["تعلّم", "التداول"], "sound": "drop + 2 slam hits", "source_evidence": "A c06 EASE slam, A c02 CLAUDE width morph"},
        {"id": "o03", "t": [B(4), B(8)], "role": "promise part 2 (the device)", "action": "«من الصفر» types in at hairline weight with the red dot as the zero beside it; on B6 «إلى الاحتراف» arrives and the weight ramps 160->700 word by word while the line scales up; the dot shoots right as a full stop",
         "camera": "slow push-in", "text": ["من الصفر", "إلى الاحتراف"], "sound": "riser-whoosh into a hit on B6", "source_evidence": "A c02 variable-width morph, A c12 period"},
        {"id": "o04", "t": [B(8), B(12)], "role": "academy line montage (one word per beat)",
         "action": "«تعلّم» draws itself on white; «ثم تعلّم» repeats as scrolling rows on slate gradient; «ثم تدرّب» stutters in three rhythmic reps on black; «ثم تداول.» rides a constant-speed slide and the red dot lands as its full stop",
         "camera": "hard cuts on each beat with 2-frame flash", "text": ["تعلّم", "ثم تعلّم", "ثم تدرّب", "ثم تداول."], "sound": "hit per word, whoosh on slides", "source_evidence": "A c06-c12 EASE/IN/EASE/OUT/NEVER/LINEAR montage: each word moves as it reads"},
        {"id": "o05", "t": [B(12), B(16)], "role": "name reveal + teaser", "action": "the full stop expands into a white iris; «أكاديمية آكسي» builds with a mask rise; «قريباً» appears under it with the red dot blinking like a live indicator and a thin loading line",
         "camera": "push-in", "text": ["أكاديمية آكسي", "قريباً"], "sound": "whoosh + soft hit", "source_evidence": "A c02 rise-from-baseline mask, A c13 lockup"},
        {"id": "o06", "t": [B(16), B(20)], "role": "offer", "action": "«مجانية» slams black on white (B16); a grid of 1000 seat dots fills the screen in a diagonal wave while digit wheels roll 0->1000 (B17-B19) with «لأول 1000 طالب» ; «فقط» stamps on B19",
         "camera": "pull-back to reveal the grid", "text": ["مجانية", "لأول 1000 طالب", "فقط"], "sound": "slam, data-swish on the wave, counter ticks, stamp hit", "source_evidence": "A c04 shape-to-grid-to-pattern, B c02 counter"},
        {"id": "o07", "t": [B(20), 11.25], "role": "payoff of the motif", "action": "one seat in the grid turns red and pulses with rings: «احجز مقعدك الآن» types beside it",
         "camera": "push toward the red seat", "text": ["احجز مقعدك الآن"], "sound": "ui blip + ring", "source_evidence": "A c12-c13 period swells into the end card"},
        {"id": "o08", "t": [11.25, 12.15], "role": "X sting (brand close)", "action": "camera dives into the red seat, white flash, X mark drops and settles centre", "camera": "dive + settle", "text": [], "sound": "boom + whoosh", "source_evidence": "A c12->c13 dot-to-end-card"},
        {"id": "o09", "t": [12.15, 15.0], "role": "CTA end card", "action": "light end card: logo top-right; «أكاديمية آكسي» + «قريباً»; «مجانية لأول 1000 طالب فقط»; red pill «احجز مقعدك الآن»; axi.com/ar; risk strip from 12.00",
         "camera": "static with micro drift", "text": ["أكاديمية آكسي", "قريباً", "مجانية لأول 1000 طالب فقط", "احجز مقعدك الآن", "axi.com/ar", "risk strip"], "sound": "music continues, fade 14.4-15.0", "source_evidence": "A c13 end card"}],
      "energy": {"reference_rates": {"cuts_ps": 1.73, "flashes_ps": 0.8, "shake_ps": 2.53},
                 "plan": "about 1.9 scene changes/s overall (hard cuts on beats in o02-o06), white/black 1-2 frame flashes on 10 cuts (~0.7/s), impact shakes on every slam and stamp (~2/s through 1.4-11 s), camera push/pull in o01, o03, o05, o06, o07, o08",
                 "placements_s": [1.40, B(1), B(3.5), B(4), B(6), B(8), B(9), B(10), B(11), B(12), B(14), B(16), B(17), B(19), B(20), 11.25, 12.15]},
      "palette": {"light": ["#F9F9F9", "#EEF0F1", "#C4C8CC"], "dark": ["#090A0D", "#242528", "#393B40"], "gradient": "primary vertical #EEF0F1->#607880", "accent": "#E4002E (dot, seat, pill only)"},
      "routes": "all shots CODE (F6 page renderer); no generated video; no paid jobs",
      "brand": brand,
      "source_evidence": {"primary": "A: The showreel prompt that started it (ref/ref.mp4)", "used": ["dot as origin/punctuation", "half-beat word montage where words move as they read", "variable-width/weight type morph", "iris/period-expand transitions", "flat colour pages with crisp type and motion blur"],
                          "departures": ["palette replaced by Axi light neutrals + slate gradient + red accent (brand 70/20/10)", "9:16 vertical, 15 s, new music", "Arabic RTL type: per-word kinetics, ZWJ letter shaping where letters move separately"]}}
else:
    beat0, spb = 1.40, 0.5
    B = lambda k: round(beat0 + k * spb, 3)
    plan = {
      "schema": "rr.creative-plan/1", "version": "B - SaaS UI", "output_target": common_target,
      "concept": "«مقعدك محجوز» — the academy as a sleek app: a beginner's question becomes one clean answer, a click opens 1000 free seats, a learning path runs from zero to pro, and one seat is reserved for you.",
      "logline": "A typed question turns into Axi Academy, and the interface reserves your free seat.",
      "motif": {"element": "the red caret / cursor (Axi red)",
                "setup": "the logo collapses into a blinking red caret (1.2 s)",
                "development": ["the caret types the beginner's question (1.4-2.9 s)", "the long line squashes into a red streak and a bloom (2.9-3.4 s)", "the cursor clicks the academy pill (3.9 s)", "the cursor presses «احجز مقعدك الآن» (10.6 s)"],
                "payoff": "toast «تم حجز مقعدك» and the X sting"},
      "music": {"plan": "stock_track", "asset": "Mixkit item 201 'Swish Swed' (Mixkit Stock Music Free License: social media posts and online marketing ads allowed)",
                "segment_s": [38.56, 53.56], "bpm": 120.0, "drop_at_output_s": 1.40, "edit": "segment starts in the breakdown riser so the drop lands on the first typed key; 0.6 s fade-out",
                "evidence": "measured only: drop at 39.96 s (low band from silence to full, RMS 0.096->0.261), 120 BPM"},
      "beats": {"bpm": 120.0, "first_drop": beat0, "spb": spb},
      "shots": [
        {"id": "o01", "t": [0.0, 1.40], "role": "brand open", "action": "white stacked logo on the primary vertical gradient (0.1-1.1), night falls and the logo shrinks into a blinking red caret (1.1-1.4)", "camera": "static", "text": "logo", "sound": "ident hit over the track's riser", "source_evidence": "B c01 black open; lesson-18 brand open"},
        {"id": "o02", "t": [1.40, B(4)], "role": "hook: the question", "action": "a glass command bar; the caret types «كيف أتعلّم التداول من الصفر؟» on the beat; Enter at B3: the line squashes into a red streak, bloom flash at B4", "camera": "slight track following the caret", "text": ["كيف أتعلّم التداول من الصفر؟"], "sound": "key clicks on 16ths, whoosh into flash", "source_evidence": "B c01 URL typing -> streak -> bloom"},
        {"id": "o03", "t": [B(4), B(6)], "role": "the answer", "action": "pill «أكاديمية آكسي · قريباً» with the axi glyph scales out of the bloom; the cursor glides in and clicks on B5: glow, ripple rings, sparks; a dotted globe rises at the bottom", "camera": "tilt up as the pill rises", "text": ["أكاديمية آكسي · قريباً"], "sound": "click + ring", "source_evidence": "B c02 pill, click, rings, globe"},
        {"id": "o04", "t": [B(6), B(10)], "role": "the offer as data", "action": "digit wheels roll 0->1000 over the globe with pings; label «مقعد مجاني»; under it «لأول 1000 طالب فقط»", "camera": "slow push", "text": ["1000", "مقعد مجاني", "لأول 1000 طالب فقط"], "sound": "data swish + ticks", "source_evidence": "B c02 counter over globe"},
        {"id": "o05", "t": [B(10), B(14)], "role": "the method", "action": "a 3D-tilted dashboard card «مسار التعلّم»: a four-step stepper تعلّم -> تعلّم -> تدرّب -> تداول ticks on each beat while a progress bar runs from «من الصفر» to «إلى الاحتراف»; card swings away", "camera": "orbit drift, card flies out", "text": ["مسار التعلّم", "تعلّم", "تعلّم", "تدرّب", "تداول", "من الصفر", "إلى الاحتراف"], "sound": "ui blips per tick, whoosh out", "source_evidence": "B c03 tilted dashboard with counters and toasts"},
        {"id": "o06", "t": [B(14), B(18)], "role": "one word per beat", "action": "grey-flash cuts every beat: «قريباً.» on white, «مجانية.» on black, «لأول 1000 طالب.» on the slate gradient, «فقط.» on black with a red full stop", "camera": "static pages, slide-in type", "text": ["قريباً.", "مجانية.", "لأول 1000 طالب.", "فقط."], "sound": "flash tick + hit per page", "source_evidence": "B c05-c12 feature montage with grey flashes"},
        {"id": "o07", "t": [B(18), 11.0], "role": "action", "action": "seat map (1000 dots) - one seat glows red; the cursor presses the red button «احجز مقعدك الآن»; toast «تم حجز مقعدك ✓»", "camera": "push to the button", "text": ["احجز مقعدك الآن", "تم حجز مقعدك"], "sound": "click + success blip", "source_evidence": "B c02 click, B c03 toasts"},
        {"id": "o08", "t": [11.0, 12.0], "role": "X sting", "action": "white flash, the X mark drops and settles at centre on the light page", "camera": "settle", "text": [], "sound": "boom", "source_evidence": "B c13 white sphere flash"},
        {"id": "o09", "t": [12.0, 15.0], "role": "CTA end card (light)", "action": "logo top-right; «أكاديمية آكسي»; «تعلّم التداول من الصفر إلى الاحتراف» types; «مجانية لأول 1000 طالب فقط»; red pill «احجز مقعدك الآن» + outlined pill «axi.com/ar»; risk strip", "camera": "static", "text": ["أكاديمية آكسي", "تعلّم التداول من الصفر إلى الاحتراف", "مجانية لأول 1000 طالب فقط", "احجز مقعدك الآن", "axi.com/ar", "risk strip"], "sound": "music continues, fade 14.4-15.0", "source_evidence": "B c13 light end card with two pills"}],
      "energy": {"reference_rates": {"cuts_ps": 1.86, "flashes_ps": 0.86, "shake_ps": 1.13},
                 "plan": "scene changes on beats (o02-o07 ~1.3/s, montage 2/s), grey/white flashes at 3.4, 8.4, 8.9, 9.4, 9.9, 11.0 s (~0.6/s overall), light shake only on click and stamp; 3D card orbit; tracking on typing",
                 "placements_s": [1.40, B(3), B(4), B(5), B(6), B(10), B(14), B(15), B(16), B(17), B(18), 10.6, 11.0, 12.0]},
      "palette": {"dark": ["#090A0D", "#101114", "#242528"], "ui_accent": "#B5C8CD (light slate)", "light_end": ["#F9F9F9", "#EEF0F1"], "accent": "#E4002E (caret, streak, seat, pill only)"},
      "routes": "all shots CODE (F6 page renderer); no generated video; no paid jobs",
      "brand": brand,
      "source_evidence": {"primary": "B: Link analytics launch (ref/ref.mp4)", "used": ["typed input -> streak -> bloom -> pill", "click with ripple rings over a dotted globe", "rolling counter", "3D tilted dashboard card", "one-word pages with grey flashes", "light end card with two pills"],
                          "departures": ["Axi night palette with light-slate UI accent and red only for caret/seat/CTA", "9:16, 15 s, new music", "Arabic RTL UI copy; the only number is the 1000 seats"]}}
for s in plan['shots']:
    s['frames'] = [fr(s['t'][0]), fr(s['t'][1]) - 1]
    s['route'] = 'CODE'
os.makedirs('plan', exist_ok=True)
json.dump(plan, open('plan/creative-plan.json', 'w'), ensure_ascii=False, indent=1)
print('plan ok', S, len(plan['shots']), [s['frames'] for s in plan['shots']][-1])
