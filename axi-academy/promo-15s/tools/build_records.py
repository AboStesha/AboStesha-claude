import json, os, sys, math
S = sys.argv[1]  # 'a' or 'b'
W = os.getcwd()
ref = json.load(open('ref/ref.json'))
an = json.load(open('analysis/analysis.json'))
beats = json.load(open('audio/beats.json'))
energy = json.load(open('analysis/energy.json'))
N = ref.get('nb_frames') or ref.get('frames')
fps_s = ref.get('fps')
num, den = (fps_s.split('/') + ['1'])[:2]
FPS = float(num) / float(den)
D = N / FPS

def cut(cid, f0, f1, content, shot, cam, cadence, effects, tin, tout, layers, texts, route, notes, role):
    return {"id": cid, "f0": f0, "f1": f1, "content": content, "hero_present": False, "hero": None,
            "identity_visible": "none", "medium": "graphic", "shot_size": shot,
            "camera": cam, "cadence": cadence, "effects": effects, "transition_in": tin, "transition_out": tout,
            "layers": layers, "text_events": texts, "route_suggestion": route, "notes": notes, "role": role}

def tr(t, f0, f1, hides=False, note=""):
    return {"type": t, "f0": f0, "f1": f1, "hides_cut": hides, "note": note}

def txt(tid, f_in, f_full, f_os, f_out, text, font_class, weight, size, cx, cy, color, anim, meaning, italic=False, crosses=False, box=None):
    return {"id": tid, "f_in": f_in, "f_full": f_full, "f_out_start": f_os, "f_out": f_out, "text": text,
            "letters": len(text.replace(' ', '')), "font_class": font_class, "weight": weight, "italic": italic,
            "size_pct_h": size, "cx": cx, "cy": cy, "coords": "frame", "box": box or [round(cx - 0.3, 3), round(cy - size / 200, 3), 0.6, round(size / 100, 3)],
            "color": color, "stroke": None, "glow": None, "animation": anim, "layering": "front",
            "source": "ref_pixels", "crosses_cut": crosses, "meaning": meaning}

CODE = lambda why, kf: {"route": "CODE", "why": why, "plate_group": None, "keyframe": kf, "needs_matte": False, "needs_face_track": False}
native = {"unique": None, "of": None, "pattern": "native", "speed": 1, "note": "60 fps native motion graphics; every frame unique except marked holds"}
static_cam = lambda d="": {"move": "static", "digital": True, "detail": d}

if S == 'a':
    trick = ("The trick of this ref is one continuously transforming mark (dot, starburst, letters, bullets, shapes, maze, wireframe, words, period, asterisk) "
             "on a 128 BPM grid that ends in a half-beat word montage whose words move the way they read (EASE IN. EASE OUT. NEVER LINEAR.) "
             "so that the viewer feels a single virtuosic line of motion that demonstrates its own principle and lands on the name.")
    trick_frames = [[8, 112, "red dot grows into a starburst and back to a dot"], [200, 211, "letters collapse into dots that become list bullets"],
                    [253, 327, "dots race with different easings"], [338, 431, "shape morph circle-triangle-star-square with orbiting dot ring"],
                    [675, 786, "EASE / IN. / EASE / OUT. / NEVER / NEVER / LINEAR. one word per half beat, each moving as it reads"],
                    [777, 799, "the final period swells into the frame and sprouts the asterisk logo"]]
    cuts = [
        cut("c01", 0, 114, "Dark open: a tiny red dot in a faint ring sprouts rays one by one into a 12-ray starburst, strokes thicken, it rotates, shrinks back to a dot and vanishes; a cream disc pops at F113", "graphic",
            static_cam(), native, [{"type": "zoom_punch", "f0": 104, "f1": 112, "params": {"note": "starburst scales down to a point"}}],
            tr("cut", 0, 0, note="opens on black"), tr("wipe", 113, 121, True, "circle iris: cream disc then orange iris"),
            [{"id": "l_burst", "type": "shape", "f0": 8, "f1": 112, "z": "over_all", "track": "static", "desc": "red-orange starburst from a dot", "color": "#FF5A36", "size": "0.05-0.35 h", "count": 1, "meaning": "the spark: everything grows from one point"}],
            [], CODE("flat vector shapes on solid colour", 57), "starburst ray timing: one ray per ~1 frame F29-39", "hook/origin"),
        cut("c02", 115, 208, "Orange page: CLAUDE in black extended grotesk rises from a baseline mask, squeezes to condensed width and back, italic serif subtitle types in; letters then collapse left to right into black dots", "graphic",
            static_cam(), native, [], tr("wipe", 113, 121, True, "iris from the dot"), tr("wipe", 207, 211, True, "diagonal cream wipe from bottom-right"),
            [{"id": "l_rules", "type": "ui", "f0": 128, "f1": 208, "z": "over_all", "track": "static", "desc": "thin header rules and tiny labels", "color": "#111111", "size": "small", "count": 4, "meaning": "showreel frame UI"}],
            [txt("t_claude", 115, 128, 200, 208, "CLAUDE", "extended grotesk, variable width", 800, 22, 0.5, 0.47, "#111111", "rise from baseline mask; width morph extended->condensed->extended; letters collapse to dots", "the name as hero; width morph shows type control"),
             txt("t_md", 168, 176, 200, 208, "motion designer", "italic serif", 400, 3, 0.5, 0.6, "#111111", "types in", "role subtitle", italic=True)],
            CODE("type on flat colour", 161), "", "identity"),
        cut("c03", 209, 337, "Cream page: the dots tumble into a column of bullets for the serif list Six ways to get from A to B., each dot races right with a different easing, then the column flings off and one blue dot remains", "graphic",
            static_cam(), native, [{"type": "blur_pulse", "f0": 253, "f1": 327, "params": {"note": "directional motion blur on fast dots"}}],
            tr("wipe", 207, 211, True, "diagonal wipe"), tr("match_cut", 337, 338, False, "blue dot on cream -> cream dot on blue (colour swap)"),
            [{"id": "l_dots", "type": "shape", "f0": 209, "f1": 337, "z": "over_all", "track": "static", "desc": "six coloured dots black/blue/red", "color": "mixed", "size": "0.02 h", "count": 6, "meaning": "easing demonstration"}],
            [txt("t_list", 221, 231, 317, 327, "Six ways to get from A to B.", "italic serif + small labels", 400, 3, 0.25, 0.12, "#111111", "fades/types in, list labels with curve icons", "explains easing", italic=True)],
            CODE("diagram of easing", 274), "", "accent/explanation"),
        cut("c04", 338, 584, "Blue page: a cream disc with an orbiting dot ring morphs circle -> triangle -> star -> square; background flips to black; the square splits into a grid, shatters into crosses and becomes a white truchet maze; a red wave of rotating tiles sweeps across and contracts; the maze collapses into a dark centre", "graphic",
            static_cam("slow push implied by scale"), native, [{"type": "flash_color", "f0": 450, "f1": 450, "params": {"note": "background flips blue->black under the held square"}}],
            tr("match_cut", 337, 338, False, "colour swap"), tr("wipe", 576, 584, True, "dark hole expands from the centre"),
            [{"id": "l_ring", "type": "shape", "f0": 339, "f1": 441, "z": "over_all", "track": "static", "desc": "ring of 16 small dots orbiting", "color": "#F2EEE6", "size": "0.2 h ring", "count": 16, "meaning": "orbit/continuity"},
             {"id": "l_maze", "type": "pattern", "f0": 464, "f1": 584, "z": "under_subject", "track": "static", "desc": "truchet curve maze with red rotation wave", "color": "#FFFFFF/#C0392B", "size": "full", "count": 1, "meaning": "texture showpiece"}],
            [], CODE("procedural shapes/pattern", 461), "maze tile rotation wave measured F485-571", "development"),
        cut("c05", 585, 674, "Black: a faint dotted wireframe 3D form sweeps in, rotates, squashes into a torus that turns toward camera; the camera flies through the ring into darkness", "graphic",
            {"move": "push_in", "digital": True, "detail": "virtual camera flies through the torus F656-665"}, native, [],
            tr("wipe", 576, 584, True, "maze collapse"), tr("black_frames", 666, 674, True, "black hold before the montage"),
            [{"id": "l_wire", "type": "shape", "f0": 595, "f1": 665, "z": "over_all", "track": "camera", "desc": "dotted wireframe sphere -> torus", "color": "#9A9A9A", "size": "0.3-1.2 h", "count": 1, "meaning": "3D chops; breath before the montage"}],
            [], CODE("dotted 3D points projected in code", 629), "very low luma; breath", "breath"),
        cut("c06", 675, 688, "Orange page: black extended EASE slams in with horizontal smear and settles", "graphic", static_cam(), native,
            [{"type": "blur_pulse", "f0": 675, "f1": 678, "params": {"dir": "horizontal"}}], tr("cut", 675, 675), tr("cut", 688, 689),
            [], [txt("t_ease1", 675, 678, 688, 688, "EASE", "extended grotesk", 900, 20, 0.5, 0.5, "#111111", "slam with horizontal smear", "word 1 of the principle")], CODE("type", 681), "half-beat (14 f)", "escalation"),
        cut("c07", 689, 702, "Black page: white IN slides in from the right blurred and lands with an orange period", "graphic", static_cam(), native,
            [{"type": "blur_pulse", "f0": 689, "f1": 694, "params": {"dir": "horizontal"}}], tr("cut", 689, 689), tr("cut", 702, 703),
            [], [txt("t_in", 689, 695, 702, 702, "IN.", "extended grotesk", 900, 20, 0.55, 0.5, "#F2EEE6", "slides in from right, period pops", "moves IN as it reads")], CODE("type", 695), "", "escalation"),
        cut("c08", 703, 716, "Cream page: tall condensed blue EASE letters rise from below with stagger and blur", "graphic", static_cam(), native,
            [{"type": "blur_pulse", "f0": 704, "f1": 709, "params": {"dir": "vertical"}}], tr("white_frames", 703, 703, True, "white flash frame"), tr("cut", 716, 717),
            [], [txt("t_ease2", 703, 709, 716, 716, "EASE", "condensed grotesk", 900, 30, 0.5, 0.5, "#2B3BFF", "letters rise staggered", "word 3")], CODE("type", 709), "", "escalation"),
        cut("c09", 717, 730, "Blue page: white OUT slides in from the left with smear and lands with an orange period", "graphic", static_cam(), native,
            [{"type": "blur_pulse", "f0": 717, "f1": 722, "params": {"dir": "horizontal"}}], tr("color_flash", 717, 717, True, "solid frame"), tr("cut", 730, 731),
            [], [txt("t_out", 717, 723, 730, 730, "OUT.", "extended grotesk", 900, 20, 0.5, 0.5, "#F2EEE6", "slides in from left", "word 4")], CODE("type", 723), "", "escalation"),
        cut("c10", 731, 744, "Lime page: black NEVER letters drop from the top one by one with bounce", "graphic", static_cam(), native,
            [], tr("white_frames", 731, 731, True, "flash"), tr("cut", 744, 745),
            [], [txt("t_never1", 731, 738, 744, 744, "NEVER", "extended grotesk", 900, 18, 0.5, 0.5, "#111111", "letters drop staggered with bounce", "word 5")], CODE("type", 737), "", "escalation"),
        cut("c11", 745, 758, "Lime page: rows of repeated NEVER scroll sideways, solid middle row between outlined ghost rows", "graphic", static_cam(), native,
            [], tr("cut", 745, 745), tr("cut", 758, 759),
            [{"id": "l_rows", "type": "text_pattern", "f0": 745, "f1": 758, "z": "under_subject", "track": "static", "desc": "outlined NEVER rows", "color": "#111111", "size": "full", "count": 9, "meaning": "repetition = never"}],
            [txt("t_never2", 745, 745, 758, 758, "NEVER NEVER NEVER", "extended grotesk", 900, 9, 0.5, 0.5, "#111111", "rows scroll in alternating directions", "emphasis by repetition")], CODE("type pattern", 751), "", "escalation"),
        cut("c12", 759, 786, "Black page: white LINEAR. with orange period drifts at constant speed, then accelerates into camera while the period swells into an orange disc that fills the frame", "graphic",
            {"move": "push_in", "digital": True, "detail": "scale-up + slide F777-786"}, native, [{"type": "blur_pulse", "f0": 777, "f1": 786, "params": {"dir": "horizontal"}}],
            tr("cut", 759, 759), tr("zoom_punch", 777, 786, True, "period expands into the end card"),
            [], [txt("t_linear", 759, 760, 777, 786, "LINEAR.", "extended grotesk", 900, 12, 0.55, 0.5, "#F2EEE6", "constant-speed drift then accelerate into camera", "moves linearly as it reads")], CODE("type", 771), "", "climax"),
        cut("c13", 787, 899, "Orange end card: a cream ring expands, a black asterisk sprouts ray by ray from a dot, slides left as CLAUDE reveals right to left with tightening tracking; italic subtitle; hold to the end", "graphic",
            static_cam(), native, [], tr("zoom_punch", 777, 787, True, "period expands"), tr("cut", 899, 899, note="ends on hold"),
            [{"id": "l_ring2", "type": "shape", "f0": 788, "f1": 799, "z": "under_subject", "track": "static", "desc": "thin cream ring expanding", "color": "#F2EEE6", "size": "0.3-1.0 h", "count": 1, "meaning": "impact ring"}],
            [txt("t_claude2", 816, 839, 899, 899, "CLAUDE", "extended grotesk", 900, 9, 0.55, 0.47, "#111111", "letters reveal right-to-left, tracking tightens", "logo lockup"),
             txt("t_md2", 816, 830, 899, 899, "motion designer", "italic serif", 400, 2.5, 0.55, 0.55, "#111111", "fades in", "role", italic=True)], CODE("end card", 843), "", "payoff/closure"),
    ]
    palette = [{"hex": "#FF5A36", "role": "background", "where": "c02 c06 c13 + dot accents"}, {"hex": "#F2EEE6", "role": "background", "where": "c03 c08 + text on dark"},
               {"hex": "#2B3BFF", "role": "background", "where": "c04 c09"}, {"hex": "#DDF247", "role": "background", "where": "c10 c11"},
               {"hex": "#0E0E10", "role": "background", "where": "c01 c05 c07 c12"}, {"hex": "#111111", "role": "text", "where": "type on light"}]
    fonts = [{"class": "extended grotesk (Druk Wide/Monument Extended-like)", "weight": 800, "italic": False, "case": "upper", "nearest": "Readex Pro HEXP+wght for Arabic", "file": None, "used_by": ["t_claude", "t_ease1", "t_in", "t_out", "t_never1", "t_never2", "t_linear", "t_claude2"]},
             {"class": "condensed grotesk", "weight": 900, "italic": False, "case": "upper", "nearest": "Readex Pro low HEXP", "file": None, "used_by": ["t_ease2"]},
             {"class": "italic transitional serif", "weight": 400, "italic": True, "case": "lower", "nearest": "Cormorant italic (bundled)", "file": None, "used_by": ["t_md", "t_list", "t_md2"]}]
    look = {"class": "clean", "bw": False, "desc": "flat vector colour fields, crisp type, motion blur on fast moves, no grain", "grain": {"present": False, "size_px": 0, "boil_every": 0},
            "halation": False, "vignette": False, "softness": "none", "cast": "none", "threshold": False}
    meaning = [{"what": "t_claude", "means": "the hero name", "maps_to": "أكاديمية آكسي"},
               {"what": "t_ease1..t_linear", "means": "a principle spoken as a rhythm, each word moving as it reads", "maps_to": "the academy line تعلّم · تعلّم · تدرّب · تداول, each word moving as it means"},
               {"what": "l_burst/period", "means": "a single dot is the origin and the punctuation", "maps_to": "the red dot = zero (من الصفر) and later = your reserved seat"}]
else:
    trick = ("The trick of this ref is turning the product's own interface (a typed URL, a pill, a click, a counter, dashboards, a partner network) into kinetic graphics, "
             "then accelerating into a one-word-per-screen feature montage of grey-flash cuts every quarter second on a 120 BPM grid, "
             "so that the viewer feels the product's speed and scale before it resolves into a calm light end card with a CTA.")
    trick_frames = [[16, 95, "URL types, squashes to a streak, bloom flash"], [96, 141, "pill, click, ripple rings"], [142, 266, "counter rolls over a dotted globe"],
                    [267, 449, "tilted dashboard with three counters and toasts"], [450, 629, "partner constellation"], [630, 749, "one word per screen with grey flashes"],
                    [750, 903, "white sphere into the light end card"]]
    W_ = lambda cid, f0, f1, word, bg, fg, kf, flash=True: cut(cid, f0, f1, f"One-word page: {word} on {bg}", "graphic", static_cam(), native,
        [{"type": "flash_color", "f0": f0, "f1": f0 + 1, "params": {"color": "#808080", "note": "grey flash opens the page"}}] if flash else [],
        tr("color_flash", f0, f0 + 1, True, "grey flash"), tr("color_flash", f1, f1, True, "next flash"), [],
        [txt("t_" + cid, f0, f0 + 3, f1, f1, word, "geometric sans", 600, 7, 0.5, 0.5, fg, "fade/slide in through the flash, hold", "one feature per beat")], CODE("type page", kf), "quarter-second page (15 f)", "accent")
    cuts = [
        cut("c01", 0, 95, "Black: a long monospace UTM URL types out and scrolls with the caret, then squashes into a glowing orange streak and a grey bloom flash", "graphic",
            {"move": "track", "digital": True, "detail": "line scrolls left following the caret"}, native, [{"type": "exposure_flash", "f0": 91, "f1": 95, "params": {"note": "grey radial bloom"}}],
            tr("cut", 0, 0, note="opens on black"), tr("flashlight", 91, 95, True, "bloom hides the change to the pill"),
            [{"id": "l_streak", "type": "shape", "f0": 83, "f1": 92, "z": "over_all", "track": "static", "desc": "orange streak from squashed text", "color": "#FF6A2B", "size": "thin line", "count": 1, "meaning": "complexity compressed"}],
            [txt("t_url", 16, 47, 82, 90, "https://www.acme.com/collections/summer-2026/launch-edition?utm_source=...", "monospace", 400, 1.5, 0.5, 0.5, "#9A9A9A", "types char by char, scrolls", "the messy long link (problem)", crosses=False)],
            CODE("typed text", 47), "", "hook/origin"),
        cut("c02", 96, 266, "Black: pill dub.sh/launch scales up, a cursor clicks it (orange glow, ripple rings), an orange dotted globe rises and a big counter rolls 219,336 -> 1,284,08x with arcs shooting to the globe", "graphic",
            {"move": "tilt", "digital": True, "detail": "pill slides up as the counter takes centre F141-144"}, native,
            [{"type": "flash_color", "f0": 120, "f1": 121, "params": {"note": "click glow"}}], tr("flashlight", 91, 95, True), tr("dissolve", 266, 271, True, "zoom-blur dissolve to the dashboard"),
            [{"id": "l_globe", "type": "shape", "f0": 124, "f1": 266, "z": "under_subject", "track": "static", "desc": "orange dotted globe horizon", "color": "#FF6A2B", "size": "1.2 w", "count": 1, "meaning": "global scale"},
             {"id": "l_rings", "type": "shape", "f0": 121, "f1": 150, "z": "over_all", "track": "static", "desc": "white/orange ripple rings", "color": "#FFFFFF", "size": "0.2-1.0 h", "count": 3, "meaning": "click impact"}],
            [txt("t_pill", 96, 104, 266, 266, "dub.sh/launch", "geometric sans", 600, 2.5, 0.5, 0.45, "#FFFFFF", "scale-up, slug types", "the short link"),
             txt("t_count", 142, 150, 240, 266, "1,284,093", "geometric sans tabular", 500, 6, 0.5, 0.45, "#FFFFFF", "odometer roll ease-out", "clicks counted")],
            CODE("UI + counter", 204), "", "action/escalation"),
        cut("c03", 267, 449, "Tilted dark analytics card: three metrics count up in turn (clicks, leads, sales), the area chart grows and re-tints blue->purple->teal, toasts stack, a tooltip scrubs, then the card flies away", "graphic",
            {"move": "orbit", "digital": True, "detail": "3D tilt drift; card swings out F441-449"}, native, [], tr("dissolve", 266, 271, True), tr("black_frames", 448, 452, True, "card leaves into darkness"),
            [{"id": "l_card", "type": "ui", "f0": 267, "f1": 449, "z": "over_all", "track": "camera", "desc": "dark dashboard card with chart and toasts", "color": "#14161A", "size": "0.8 w", "count": 1, "meaning": "proof in the product"}],
            [txt("t_metrics", 272, 290, 440, 449, "1,284,093  48,210  $392,840", "geometric sans tabular", 600, 2.5, 0.4, 0.3, "#FFFFFF", "counters roll one after another", "growth")],
            CODE("UI card", 325), "", "escalation"),
        cut("c04", 450, 629, "Black: a glowing logo dot grows, the headline Grow with partners. types in white plus gradient word, dozens of avatar bubbles fly in on elliptical orbits, green earnings pills pop, a dollar counter climbs", "graphic",
            {"move": "push_in", "digital": True, "detail": "slow push"}, native, [], tr("black_frames", 448, 452, True), tr("slide", 630, 633, True, "white page slides in from the right"),
            [{"id": "l_net", "type": "particles", "f0": 462, "f1": 629, "z": "over_all", "track": "static", "desc": "avatar constellation on orbits", "color": "mixed", "size": "0.03 h each", "count": 40, "meaning": "community/network"}],
            [txt("t_grow", 458, 479, 624, 629, "Grow with partners.", "geometric sans", 600, 3.5, 0.5, 0.12, "#FFFFFF", "types in, gradient keyword", "the network promise")],
            CODE("network", 543), "", "development"),
        cut("c05", 630, 644, "White page: Short links. slides in from the right with blur and sharpens", "graphic", static_cam(), native, [], tr("slide", 630, 633, True), tr("color_flash", 645, 645, True), [],
            [txt("t_c05", 630, 639, 644, 644, "Short links.", "geometric sans", 600, 7, 0.5, 0.5, "#111111", "slide-in with blur", "feature 1")], CODE("type page", 639), "", "accent"),
        W_("c06", 645, 659, "QR codes.", "dark red pixel mosaic", "#FFFFFF", 652),
        W_("c07", 660, 674, "Custom domains.", "orange", "#111111", 668),
        W_("c08", 675, 689, "Deep links.", "black (embossed text)", "#2A2A2A", 682),
        W_("c09", 690, 704, "Conversions.", "rainbow conic gradient", "#111111", 697),
        W_("c10", 705, 719, "Affiliates.", "white", "#8E7CF0", 712),
        W_("c11", 720, 734, "Payouts.", "black with falling green particles", "#2FD07A", 727),
        W_("c12", 735, 749, "One platform.", "black", "#FFFFFF", 742),
        cut("c13", 750, 903, "White flash, a white sphere grows into the white end page carrying the logo glyph; the wordmark slides out, the tagline Turn clicks into revenue. types with an orange underlined keyword, two CTA pills fade in; pastel blob bottom-left; hold", "graphic",
            static_cam(), native, [{"type": "exposure_flash", "f0": 750, "f1": 751, "params": {"note": "white flash"}}], tr("white_frames", 750, 751, True), tr("cut", 903, 903, note="ends on hold"),
            [{"id": "l_blob", "type": "gradient", "f0": 771, "f1": 903, "z": "under_subject", "track": "static", "desc": "soft pastel gradient blob", "color": "peach/pink/mint", "size": "0.6 w", "count": 1, "meaning": "warm resolution"}],
            [txt("t_tag", 809, 832, 903, 903, "Turn clicks into revenue.", "geometric sans", 500, 3, 0.5, 0.55, "#111111", "types word by word, keyword orange underlined", "brand promise"),
             txt("t_cta", 848, 856, 903, 903, "Start for free", "geometric sans", 600, 1.5, 0.5, 0.65, "#FFFFFF", "pills fade up", "CTA")], CODE("end card", 828), "", "payoff/closure"),
    ]
    palette = [{"hex": "#0B0B0D", "role": "background", "where": "c01-c04 c11 c12"}, {"hex": "#FF6A2B", "role": "accent", "where": "pill slug, globe, keyword"},
               {"hex": "#FFFFFF", "role": "background", "where": "c05 c10 c13"}, {"hex": "#3B82F6", "role": "accent", "where": "chart blue"},
               {"hex": "#8E7CF0", "role": "accent", "where": "purple chart/Affiliates"}, {"hex": "#2FD07A", "role": "accent", "where": "earnings/Payouts"}]
    fonts = [{"class": "geometric grotesk (Inter/Satoshi-like)", "weight": 600, "italic": False, "case": "sentence", "nearest": "Readex Pro (Arabic) + Inter (digits)", "file": None, "used_by": ["t_pill", "t_count", "t_grow", "t_c05", "t_tag", "t_cta"]},
             {"class": "monospace", "weight": 400, "italic": False, "case": "lower", "nearest": "DejaVu Sans Mono / Inter tabular", "file": None, "used_by": ["t_url"]}]
    look = {"class": "clean", "bw": False, "desc": "dark premium SaaS UI, soft glows, glass cards, crisp tabular numerals; light pastel end card", "grain": {"present": False, "size_px": 0, "boil_every": 0},
            "halation": False, "vignette": True, "softness": "glow on accents", "cast": "neutral", "threshold": False}
    meaning = [{"what": "t_url -> t_pill", "means": "a messy long thing becomes one clean pill (the product's value)", "maps_to": "a beginner's question becomes one clean answer: أكاديمية آكسي"},
               {"what": "t_count / l_globe", "means": "scale", "maps_to": "1000 free seats (the only number allowed)"},
               {"what": "c05-c12 words", "means": "feature list at speed", "maps_to": "the academy line تعلّم · تعلّم · تدرّب · تداول as UI steps"},
               {"what": "c13", "means": "calm light CTA end card", "maps_to": "Axi light CTA card with red pill + risk strip"}]

bd = {"schema": "rr.breakdown/1",
      "ref": {"path": "ref/ref.mp4", "width": ref.get('width'), "height": ref.get('height'), "fps": fps_s, "nb_frames": N,
              "video_duration": ref.get('video_duration'), "audio_duration": ref.get('audio_duration'), "rotation": ref.get('rotation', 0), "has_audio": True},
      "trick": trick, "trick_frames": trick_frames, "family": "F6",
      "format_lock": {"width": ref.get('width'), "height": ref.get('height'), "fps": fps_s, "frames": N, "aspect": "16:9", "canvas": "full", "window": None, "letterbox": None, "source": "ref",
                      "note": "measured source only; output target is 1080x1920 9:16 15 s in plan/creative-plan.json"},
      "look": look, "palette": palette, "fonts": fonts,
      "audio": {"bpm": beats['bpm'], "bpm_check": beats.get('confidence'), "period_s": beats.get('period'), "beat_phase_s": beats.get('phase'), "downbeat_s": beats.get('phase'),
                "sections": [{"name": s.get('label'), "t0": s.get('t0'), "t1": s.get('t1')} for s in (beats.get('sections') or [])],
                "cut_on_onset_share": None, "cut_lead_frames": None, "hidden_edits": [], "sfx_layer": [{"t": None, "type": "whoosh/hit", "note": "whooshes on slams and transitions audible in the mix (measured energy only)"}],
                "speech": "none", "words_file": None, "lufs_i": -13.1 if S == 'a' else -13.6, "true_peak_db": -1.2 if S == 'a' else -0.3,
                "plan": "stock_track", "plan_note": "reference audio is a third-party showreel score; not reused for a brand ad. Output uses a separately selected authorized recording plus bundled CC0 SFX (see plan/creative-plan.json)."},
      "meaning": meaning, "heroes": [], "others": [], "global_layers": [{"id": "g_ui", "type": "ui", "f0": 0, "f1": N - 1, "z": "over_all", "track": "static", "desc": "tiny header/footer labels in corners", "color": "#888", "size": "small", "count": 4, "meaning": "showreel frame"}],
      "cuts": cuts, "reference_manifest": "analysis/references.json", "motion_reviews": "analysis/motion-reviews.json", "questions": []}
json.dump(bd, open('analysis/breakdown.json', 'w'), ensure_ascii=False, indent=1)

# coverage.json
pages = an['sheets']['every_frame']
vp = json.load(open('analysis/viewproof.json')) if os.path.exists('analysis/viewproof.json') else {}
cov = {"schema": "rr.coverage/1", "source": {"path": "ref/ref.mp4", "fps": fps_s, "nb_frames": N, "duration_s": round(D, 6), "cfr": True, "pts_map": "analysis/frames.json (CFR: t = f/fps)"},
       "inspected": [{"range": [p['f0'], p['f1'] + 1], "path": p['path'], "t": [round(p['f0'] / FPS, 4), round((p['f1'] + 1) / FPS, 4)], "reviewer": "claude (viewproof logged)", "detail_crops": []} for p in pages],
       "overview": ["sheets/overview_p01.jpg", "sheets/timeline.png", "sheets/keyframes.jpg"], "unresolved": []}
iv = sorted([c['range'] for c in cov['inspected']]); m = []
for a, b in iv:
    if m and a <= m[-1][1]: m[-1][1] = max(m[-1][1], b)
    else: m.append([a, b])
cov['union'] = m; cov['union_ok'] = (m == [[0, N]]); cov['status'] = 'PASS' if cov['union_ok'] else 'FAIL'
json.dump(cov, open('analysis/coverage.json', 'w'), indent=1)

# seconds.json from per-cut content
secs = []
k = 0
while k < D - 1e-9:
    t0, t1 = k, min(k + 1, D)
    f0, f1 = int(math.ceil(t0 * FPS - 1e-9)), int(math.ceil(t1 * FPS - 1e-9)) - 1
    f1 = min(f1, N - 1)
    inc = [c for c in cuts if not (c['f1'] < f0 or c['f0'] > f1)]
    starts = [c['f0'] for c in cuts if f0 <= c['f0'] <= f1 and c['f0'] > 0]
    pg = [p['path'] for p in pages if not (p['f1'] < f0 or p['f0'] > f1)]
    secs.append({"interval": [t0, round(t1, 6)], "frames": [f0, f1], "sheets": pg, "cuts_starting": starts,
                 "cuts": [c['id'] for c in inc], "changes": " | ".join(c['content'][:160] for c in inc),
                 "texts": [t['text'] for c in inc for t in c['text_events'] if not (t['f_out'] < f0 or t['f_in'] > f1)]})
    k += 1
json.dump({"schema": "rr.seconds/1", "duration_s": round(D, 6), "seconds": secs}, open('analysis/seconds.json', 'w'), ensure_ascii=False, indent=1)
print("records ok", S, "cuts", len(cuts), "seconds", len(secs), "coverage", cov['status'])
