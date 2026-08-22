#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SHBM — product and collateral illustration.

Every drawing here is inline SVG with no external reference, because the
published page runs under a CSP that blocks every remote host. Material is
built from three things only: a frost gradient, a glass gradient and a soft
blur for vapour. No hue anywhere.
"""

DEFS = '''
 <defs>
  <linearGradient id="gl" x1="0" y1="0" x2=".25" y2="1">
   <stop offset="0%"   stop-color="currentColor" stop-opacity=".05"/>
   <stop offset="42%"  stop-color="currentColor" stop-opacity=".11"/>
   <stop offset="100%" stop-color="currentColor" stop-opacity=".21"/>
  </linearGradient>
  <linearGradient id="fr" x1="0" y1="0" x2="1" y2=".3">
   <stop offset="0%"   stop-color="currentColor" stop-opacity=".22"/>
   <stop offset="50%"  stop-color="currentColor" stop-opacity=".10"/>
   <stop offset="100%" stop-color="currentColor" stop-opacity=".26"/>
  </linearGradient>
  <linearGradient id="dk" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0%"   stop-color="currentColor" stop-opacity=".82"/>
   <stop offset="100%" stop-color="currentColor" stop-opacity=".55"/>
  </linearGradient>
  <linearGradient id="mid" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0%"   stop-color="currentColor" stop-opacity=".40"/>
   <stop offset="100%" stop-color="currentColor" stop-opacity=".24"/>
  </linearGradient>
  <radialGradient id="gnd" cx="50%" cy="50%" r="50%">
   <stop offset="0%"   stop-color="currentColor" stop-opacity=".14"/>
   <stop offset="100%" stop-color="currentColor" stop-opacity="0"/>
  </radialGradient>
  <filter id="vap" x="-60%" y="-60%" width="220%" height="220%">
   <feGaussianBlur stdDeviation="9"/>
  </filter>
  <filter id="vap2" x="-60%" y="-60%" width="220%" height="220%">
   <feGaussianBlur stdDeviation="18"/>
  </filter>
 </defs>
'''


def _svg(vb, label, body, cls="cv il"):
    return (f'<svg viewBox="{vb}" class="{cls}" role="img" aria-label="{label}" '
            f'preserveAspectRatio="xMidYMid meet">{DEFS}<g color="currentColor">{body}</g></svg>')


def _dew(pts, o=".3"):
    """Condensation beads. Given as (x, y, r) triples."""
    return (f'<g fill="currentColor" opacity="{o}">'
            + "".join(f'<circle cx="{x}" cy="{y}" r="{r}"/>' for x, y, r in pts) + "</g>")


def _ground(cx, cy, rx=150, ry=16):
    return (f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#gnd)"/>'
            f'<ellipse cx="{cx}" cy="{cy-2}" rx="{rx*0.42:.0f}" ry="{ry*0.35:.0f}" '
            f'fill="currentColor" opacity=".07"/>')


# ── ١ · صَقيع ٨٠− ─────────────────────────────────────────────────────────
def p_saqee80():
    """A tumbler out of an −86 °C freezer: rime outside, milk-frost wall inside,
    espresso cutting a dark channel down the middle."""
    body = f'''
  {_ground(300, 300)}
  <!-- vapour falling off the glass, heavier than air -->
  <g filter="url(#vap)" opacity=".5">
   <ellipse cx="300" cy="292" rx="120" ry="22" fill="currentColor" opacity=".2"/>
   <ellipse cx="196" cy="300" rx="54" ry="13" fill="currentColor" opacity=".16"/>
   <ellipse cx="404" cy="298" rx="48" ry="12" fill="currentColor" opacity=".14"/>
  </g>
  <!-- the tumbler: heavy walled, slightly tapered -->
  <path d="M236 92 L364 92 L354 282 L246 282 Z" fill="url(#gl)"
        stroke="currentColor" stroke-opacity=".4" stroke-width="1.6"/>
  <!-- rime on the outside: the glass is opaque with frost -->
  <g fill="currentColor" opacity=".16">
   <path d="M240 118 L360 118 L358 152 L242 152 Z"/>
   <path d="M243 176 L357 176 L355 214 L245 214 Z"/>
   <path d="M246 238 L354 238 L352 268 L248 268 Z"/>
  </g>
  <g stroke="currentColor" stroke-opacity=".3" stroke-width="1" fill="none">
   <path d="M252 108 L252 274 M276 100 L272 278 M324 100 L328 278 M348 108 L348 274"/>
  </g>
  <!-- milk frost flash-frozen against the inner wall -->
  <path d="M250 122 L350 122 L343 268 L257 268 Z" fill="currentColor" opacity=".1"/>
  <path d="M252 128 L268 128 L262 264 L256 264 Z" fill="currentColor" opacity=".2"/>
  <path d="M332 128 L348 128 L344 264 L338 264 Z" fill="currentColor" opacity=".2"/>
  <!-- the espresso channel, poured through the middle -->
  <path d="M282 124 C276 168 280 214 286 264 L314 264 C320 214 324 168 318 124
           C310 118 290 118 282 124 Z" fill="url(#dk)"/>
  <path d="M282 124 C292 132 308 132 318 124 C310 118 290 118 282 124 Z"
        fill="currentColor" opacity=".9"/>
  <!-- bleed into the frozen rim -->
  <g fill="currentColor" opacity=".34">
   <path d="M276 130 C270 150 272 168 276 184 L282 182 C278 166 277 148 282 132 Z"/>
   <path d="M324 130 C330 150 328 168 324 184 L318 182 C322 166 323 148 318 132 Z"/>
  </g>
  <!-- rim highlight -->
  <ellipse cx="300" cy="92" rx="64" ry="11" fill="none"
           stroke="currentColor" stroke-opacity=".5" stroke-width="1.6"/>
  <ellipse cx="300" cy="92" rx="52" ry="8" fill="currentColor" opacity=".07"/>
  {_dew([(232,150,2.2),(230,196,1.8),(234,238,2.4),(368,160,2),(370,214,2.3),(366,254,1.7),
         (238,270,1.6),(362,276,2)], ".34")}
  <!-- steel tongs resting alongside -->
  <g stroke="currentColor" stroke-opacity=".42" stroke-width="2.6" fill="none"
     stroke-linecap="round">
   <path d="M432 286 C470 262 500 222 508 176"/>
   <path d="M444 288 C482 266 512 226 520 180"/>
   <path d="M508 176 C506 166 512 158 520 180" stroke-width="2"/>
  </g>
  <!-- the 40-second life of the drink, stated as a mark not a caption -->
  <g stroke="currentColor" stroke-opacity=".24" stroke-width="1.4" fill="none">
   <circle cx="118" cy="132" r="30"/>
   <path d="M118 112 L118 132 L132 140"/>
  </g>
  <text x="118" y="184" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="13" fill="currentColor" fill-opacity=".42">٤٠ ثانية</text>
'''
    return _svg("0 0 600 340", "كأس صقيع ٨٠−: زجاجٌ مكسوٌّ بالصقيع، جدارُ حليبٍ متجمّد، وإسبريسو يشقّ البياض", body)


# ── ٢ · القالَب ───────────────────────────────────────────────────────────
def p_qalab():
    """A hand-carved block of optically clear ice, hollowed, filled with coffee."""
    body = f'''
  {_ground(300, 300, 160)}
  <!-- caustic light thrown through the block -->
  <g filter="url(#vap)" opacity=".4">
   <ellipse cx="300" cy="296" rx="118" ry="16" fill="currentColor" opacity=".2"/>
   <ellipse cx="384" cy="292" rx="46" ry="10" fill="currentColor" opacity=".12"/>
  </g>
  <!-- the block: 15 cm cube, chiselled edges -->
  <path d="M196 96 L392 78 L436 118 L436 268 L392 292 L196 292 L196 130 Z"
        fill="url(#gl)" stroke="currentColor" stroke-opacity=".42" stroke-width="1.6"/>
  <path d="M196 96 L392 78 L436 118 L240 136 Z" fill="currentColor" opacity=".07"
        stroke="currentColor" stroke-opacity=".3" stroke-width="1.2"/>
  <path d="M240 136 L436 118 L436 268 L392 292 L240 292 Z" fill="none"
        stroke="currentColor" stroke-opacity=".18" stroke-width="1"/>
  <!-- internal clarity: a couple of long chisel planes, no cloud -->
  <g stroke="currentColor" stroke-opacity=".14" stroke-width="1" fill="none">
   <path d="M268 150 L268 286 M330 144 L330 288 M396 138 L396 286"/>
   <path d="M240 190 L436 174 M240 236 L436 220"/>
  </g>
  <!-- the cavity, cut from the top -->
  <ellipse cx="316" cy="140" rx="52" ry="17" fill="currentColor" opacity=".14"
           stroke="currentColor" stroke-opacity=".4" stroke-width="1.4"/>
  <path d="M264 140 L264 246 C264 258 288 266 316 266 C344 266 368 258 368 246 L368 140"
        fill="url(#dk)" opacity=".9"/>
  <ellipse cx="316" cy="140" rx="52" ry="17" fill="currentColor" opacity=".72"/>
  <!-- the inner wall turning to coffee sherbet -->
  <g fill="currentColor" opacity=".3">
   <path d="M266 152 L272 152 L272 244 L266 240 Z"/>
   <path d="M360 152 L366 152 L366 240 L360 244 Z"/>
  </g>
  <!-- straw and spoon standing in the cavity -->
  <g stroke="currentColor" stroke-opacity=".5" stroke-width="3" fill="none"
     stroke-linecap="round">
   <path d="M300 60 L308 148"/>
  </g>
  <g stroke="currentColor" stroke-opacity=".44" stroke-width="2.4" fill="none"
     stroke-linecap="round">
   <path d="M348 74 L336 146"/>
  </g>
  <ellipse cx="350" cy="70" rx="10" ry="6" fill="currentColor" opacity=".34"
           transform="rotate(-12 350 70)"/>
  {_dew([(206,168,2),(204,214,1.6),(210,256,2.2),(424,150,1.8),(428,206,2.2),(422,252,1.7)], ".3")}
  <!-- meltwater film under the block -->
  <path d="M186 292 C240 286 360 286 446 292 C400 300 240 300 186 292 Z"
        fill="currentColor" opacity=".1"/>
  <!-- 72-hour freeze cycle -->
  <g stroke="currentColor" stroke-opacity=".24" stroke-width="1.4" fill="none">
   <circle cx="118" cy="132" r="30"/>
   <path d="M118 112 L118 132 L104 140"/>
  </g>
  <text x="118" y="184" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="13" fill="currentColor" fill-opacity=".42">٧٢ ساعة</text>
'''
    return _svg("0 0 600 340", "القالَب: كتلة ثلج شفافة مثقوبة من أعلاها ومملوءة بالقهوة، معها ملعقة وقصبة", body)


# ── ٣ · لُؤلُؤ ────────────────────────────────────────────────────────────
def p_boba():
    """A frozen cup with brown-sugar tiger stripes set against the wall and a
    bed of tapioca at the bottom."""
    body = f'''
  {_ground(300, 302)}
  <g filter="url(#vap)" opacity=".42">
   <ellipse cx="300" cy="294" rx="104" ry="16" fill="currentColor" opacity=".18"/>
  </g>
  <!-- tall cup, tapered -->
  <path d="M242 74 L358 74 L340 286 L260 286 Z" fill="url(#gl)"
        stroke="currentColor" stroke-opacity=".4" stroke-width="1.6"/>
  <!-- frost sheath on the outside -->
  <g fill="currentColor" opacity=".12">
   <path d="M246 100 L354 100 L351 134 L249 134 Z"/>
   <path d="M250 160 L350 160 L347 194 L253 194 Z"/>
  </g>
  <!-- tiger stripes: syrup painted down the inside wall, frozen in place -->
  <g fill="url(#dk)" opacity=".85">
   <path d="M250 96 C256 130 254 168 248 200 L258 202 C264 168 266 130 260 96 Z"/>
   <path d="M282 90 C288 132 286 176 280 214 L290 216 C296 176 298 132 292 90 Z"/>
   <path d="M316 90 C310 132 312 176 318 214 L308 216 C302 176 300 132 306 90 Z"/>
   <path d="M348 96 C342 130 344 168 350 200 L340 202 C334 168 332 130 338 96 Z"/>
  </g>
  <g fill="currentColor" opacity=".4">
   <path d="M266 104 C270 140 268 172 264 198 L268 199 C272 172 274 140 270 104 Z"/>
   <path d="M330 104 C326 140 328 172 332 198 L328 199 C324 172 322 140 326 104 Z"/>
  </g>
  <!-- cold milk body -->
  <path d="M248 112 L352 112 L338 246 L262 246 Z" fill="currentColor" opacity=".07"/>
  <!-- tapioca pearls, dense at the base -->
  <g fill="url(#dk)">
   <circle cx="276" cy="266" r="11"/><circle cx="300" cy="270" r="11.5"/>
   <circle cx="324" cy="266" r="11"/><circle cx="288" cy="248" r="10.5"/>
   <circle cx="312" cy="248" r="10.5"/><circle cx="266" cy="248" r="9"/>
   <circle cx="334" cy="248" r="9"/><circle cx="300" cy="232" r="9.5"/>
  </g>
  <g fill="currentColor" opacity=".22">
   <circle cx="272" cy="262" r="3"/><circle cx="296" cy="266" r="3.2"/>
   <circle cx="320" cy="262" r="3"/><circle cx="284" cy="244" r="2.8"/>
  </g>
  <!-- wide steel straw -->
  <path d="M318 34 L336 34 L322 292 L306 292 Z" fill="currentColor" opacity=".2"
        stroke="currentColor" stroke-opacity=".34" stroke-width="1.2"/>
  <ellipse cx="327" cy="34" rx="9" ry="3.4" fill="currentColor" opacity=".4"/>
  <!-- rim -->
  <ellipse cx="300" cy="74" rx="58" ry="10" fill="none"
           stroke="currentColor" stroke-opacity=".5" stroke-width="1.6"/>
  {_dew([(238,132,2.2),(236,182,1.8),(242,236,2.3),(362,124,2),(364,190,2.2),(356,244,1.8)], ".32")}
  <!-- four-hour pearl life -->
  <g stroke="currentColor" stroke-opacity=".24" stroke-width="1.4" fill="none">
   <circle cx="118" cy="132" r="30"/>
   <path d="M118 112 L118 132 L138 132"/>
  </g>
  <text x="118" y="184" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="13" fill="currentColor" fill-opacity=".42">٤ ساعات</text>
'''
    return _svg("0 0 600 340", "لؤلؤ: كأس مثلّجة فيها خطوط سكر بني متجمّدة على الجدار ولآلئ تابيوكا في القاع", body)


# ── ٤ · لَفائِف ───────────────────────────────────────────────────────────
def p_lafaif():
    """The −30 °C plate, the sheet being scraped, and the finished spirals."""
    body = f'''
  {_ground(300, 306, 170)}
  <!-- the cold plate seen at a low angle -->
  <ellipse cx="240" cy="250" rx="164" ry="46" fill="url(#fr)"
           stroke="currentColor" stroke-opacity=".38" stroke-width="1.6"/>
  <ellipse cx="240" cy="244" rx="164" ry="46" fill="currentColor" opacity=".05"/>
  <path d="M76 250 L76 268 C76 292 150 306 240 306 C330 306 404 292 404 268 L404 250"
        fill="currentColor" opacity=".12" stroke="currentColor" stroke-opacity=".28"
        stroke-width="1.2"/>
  <!-- frost radiating on the plate -->
  <g stroke="currentColor" stroke-opacity=".2" stroke-width="1" fill="none">
   <ellipse cx="240" cy="248" rx="128" ry="36"/><ellipse cx="240" cy="248" rx="86" ry="24"/>
   <ellipse cx="240" cy="248" rx="44" ry="12"/>
  </g>
  <!-- vapour rolling off the plate -->
  <g filter="url(#vap)" opacity=".5">
   <ellipse cx="150" cy="262" rx="62" ry="16" fill="currentColor" opacity=".2"/>
   <ellipse cx="336" cy="266" rx="58" ry="15" fill="currentColor" opacity=".18"/>
  </g>
  <!-- the sheet, spread thin, being scraped up -->
  <path d="M148 234 C200 220 300 218 346 232 C310 244 190 246 148 234 Z"
        fill="currentColor" opacity=".16"/>
  <!-- the scraper mid-scrape -->
  <g stroke="currentColor" stroke-opacity=".46" stroke-width="2.6" fill="none"
     stroke-linecap="round">
   <path d="M330 226 L410 168"/><path d="M404 156 L440 132" stroke-width="6"/>
  </g>
  <path d="M300 224 L336 220 L332 236 L298 238 Z" fill="currentColor" opacity=".28"/>
  <!-- the finished spirals, standing in a frosted cup -->
  <path d="M418 176 L520 176 L508 300 L430 300 Z" fill="url(#gl)"
        stroke="currentColor" stroke-opacity=".4" stroke-width="1.6"/>
  <g fill="currentColor" opacity=".1">
   <path d="M422 198 L516 198 L514 226 L424 226 Z"/>
  </g>
  <g stroke="currentColor" stroke-opacity=".44" stroke-width="1.5" fill="none">
   <path d="M436 176 C432 156 442 140 452 140 C462 140 468 152 460 160 C454 166 444 162 446 154"/>
   <path d="M460 174 C456 150 466 132 476 132 C486 132 492 146 484 154 C478 160 468 156 470 148"/>
   <path d="M484 176 C480 154 490 138 500 138 C510 138 516 150 508 158 C502 164 492 160 494 152"/>
   <path d="M448 178 C444 162 452 150 460 150" stroke-opacity=".28"/>
   <path d="M472 178 C468 160 476 146 484 146" stroke-opacity=".28"/>
  </g>
  <ellipse cx="469" cy="176" rx="51" ry="9" fill="none"
           stroke="currentColor" stroke-opacity=".46" stroke-width="1.5"/>
  {_dew([(414,208,2),(412,254,1.7),(524,214,1.9),(520,262,2.1)], ".3")}
  <!-- plate temperature -->
  <text x="240" y="120" text-anchor="middle" font-family="Space Grotesk, sans-serif"
        font-size="34" font-weight="300" fill="currentColor" fill-opacity=".3"
        style="direction:ltr">−30°C</text>
  <text x="240" y="146" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="12" fill="currentColor" fill-opacity=".38">١٥.٧ حصّة في الساعة لكلّ صحن</text>
'''
    return _svg("0 0 600 340", "لفائف: صحن بارد عند ثلاثين تحت الصفر، والسائل يُكشط لفائف تُنصب في الكأس", body)


# ── ٥ · جَنى ──────────────────────────────────────────────────────────────
def p_jana():
    """Fruit-shaped sorbets on crushed ice, one cracked open."""
    def crushed(cx, cy, w):
        import math
        out = []
        for i in range(26):
            a = (i * 137.5) % 360
            r = w * (0.18 + 0.82 * ((i * 7) % 11) / 11.0)
            x = cx + r * math.cos(math.radians(a)) * 1.0
            y = cy + r * math.sin(math.radians(a)) * 0.26
            s = 3 + (i % 4)
            out.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{s}" height="{s*0.8:.0f}" '
                       f'rx="1" transform="rotate({(i*53)%90} {x:.0f} {y:.0f})"/>')
        return '<g fill="currentColor" opacity=".16">' + "".join(out) + "</g>"

    body = f'''
  {_ground(300, 296, 190)}
  <!-- shallow frosted tray -->
  <path d="M92 232 L508 232 L488 292 L112 292 Z" fill="url(#gl)"
        stroke="currentColor" stroke-opacity=".36" stroke-width="1.5"/>
  {crushed(300, 250, 190)}
  <!-- strawberry -->
  <g stroke="currentColor" stroke-opacity=".46" stroke-width="1.6" fill="url(#fr)">
   <path d="M148 186 C170 186 182 202 182 218 C182 238 166 254 148 254
            C130 254 114 238 114 218 C114 202 126 186 148 186 Z"/>
  </g>
  <path d="M134 186 L148 176 L162 186 C156 182 140 182 134 186 Z" fill="currentColor" opacity=".4"/>
  <g fill="currentColor" opacity=".26">
   <circle cx="136" cy="204" r="2"/><circle cx="152" cy="200" r="2"/><circle cx="166" cy="210" r="2"/>
   <circle cx="130" cy="222" r="2"/><circle cx="148" cy="220" r="2"/><circle cx="166" cy="230" r="2"/>
   <circle cx="140" cy="240" r="2"/><circle cx="158" cy="244" r="2"/>
  </g>
  <!-- apricot, with the seam -->
  <circle cx="230" cy="216" r="36" fill="url(#fr)" stroke="currentColor"
          stroke-opacity=".46" stroke-width="1.6"/>
  <path d="M230 182 C222 200 222 232 230 250" fill="none" stroke="currentColor"
        stroke-opacity=".3" stroke-width="1.4"/>
  <path d="M228 180 C232 172 240 170 244 174" fill="none" stroke="currentColor"
        stroke-opacity=".36" stroke-width="1.6"/>
  <!-- fig, cracked open to show the sorbet core -->
  <path d="M318 178 C338 178 352 198 352 218 C352 240 336 254 318 254
           C300 254 284 240 284 218 C284 198 298 178 318 178 Z"
        fill="url(#fr)" stroke="currentColor" stroke-opacity=".46" stroke-width="1.6"/>
  <path d="M318 178 L318 168" stroke="currentColor" stroke-opacity=".4" stroke-width="2"/>
  <path d="M318 190 C332 194 340 208 340 220 C340 236 330 246 318 248
           C306 246 296 236 296 220 C296 208 304 194 318 190 Z"
        fill="currentColor" opacity=".2"/>
  <g stroke="currentColor" stroke-opacity=".26" stroke-width="1" fill="none">
   <path d="M318 194 L318 244 M306 206 L330 234 M330 206 L306 234"/>
  </g>
  <!-- lemon -->
  <ellipse cx="404" cy="214" rx="40" ry="30" fill="url(#fr)"
           stroke="currentColor" stroke-opacity=".46" stroke-width="1.6"/>
  <path d="M444 214 C450 210 452 216 444 218" fill="currentColor" opacity=".34"/>
  <path d="M364 214 C358 210 356 216 364 218" fill="currentColor" opacity=".34"/>
  <g fill="currentColor" opacity=".14">
   <circle cx="392" cy="204" r="1.6"/><circle cx="410" cy="200" r="1.6"/>
   <circle cx="400" cy="222" r="1.6"/><circle cx="418" cy="216" r="1.6"/>
  </g>
  <!-- blackberry, built from drupelets -->
  <g fill="url(#mid)" stroke="currentColor" stroke-opacity=".3" stroke-width="1">
   <circle cx="470" cy="200" r="9"/><circle cx="486" cy="198" r="9"/>
   <circle cx="478" cy="214" r="9"/><circle cx="494" cy="212" r="9"/>
   <circle cx="466" cy="216" r="9"/><circle cx="486" cy="228" r="9"/>
   <circle cx="470" cy="232" r="8"/>
  </g>
  <!-- the box, with the wordmark -->
  <path d="M92 268 L188 268 L182 300 L98 300 Z" fill="currentColor" opacity=".08"
        stroke="currentColor" stroke-opacity=".26" stroke-width="1.2"/>
  <text x="140" y="292" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="17" font-weight="300" fill="currentColor" fill-opacity=".5">شَبِم</text>
  <g filter="url(#vap)" opacity=".4">
   <ellipse cx="300" cy="270" rx="150" ry="14" fill="currentColor" opacity=".16"/>
  </g>
'''
    return _svg("0 0 600 340", "جنى: خمس قطع سوربيه على هيئة فاكهة حقيقية على ثلج مجروش، إحداها مكسورة", body)


# ── ٦ · بَرَد ─────────────────────────────────────────────────────────────
def p_radhadh():
    """Three slush cups, coarse crystals, cut fruit beside them."""
    def cup(x, fill, label):
        return f'''
  <path d="M{x-42} 96 L{x+42} 96 L{x+30} 288 L{x-30} 288 Z" fill="url(#gl)"
        stroke="currentColor" stroke-opacity=".4" stroke-width="1.6"/>
  <path d="M{x-38} 128 L{x+38} 128 L{x+29} 278 L{x-29} 278 Z" fill="currentColor" opacity="{fill}"/>
  <g fill="currentColor" opacity=".2">
   <rect x="{x-26}" y="142" width="7" height="6" rx="1" transform="rotate(18 {x-26} 142)"/>
   <rect x="{x-4}" y="156" width="8" height="6" rx="1" transform="rotate(-24 {x-4} 156)"/>
   <rect x="{x+16}" y="146" width="6" height="6" rx="1" transform="rotate(40 {x+16} 146)"/>
   <rect x="{x-18}" y="188" width="8" height="7" rx="1" transform="rotate(-12 {x-18} 188)"/>
   <rect x="{x+10}" y="200" width="7" height="6" rx="1" transform="rotate(32 {x+10} 200)"/>
   <rect x="{x-8}" y="232" width="7" height="6" rx="1" transform="rotate(-38 {x-8} 232)"/>
   <rect x="{x+18}" y="242" width="6" height="6" rx="1" transform="rotate(14 {x+18} 242)"/>
  </g>
  <path d="M{x+14} 58 L{x+28} 58 L{x+18} 292 L{x+6} 292 Z" fill="currentColor" opacity=".18"
        stroke="currentColor" stroke-opacity=".3" stroke-width="1"/>
  <ellipse cx="{x}" cy="96" rx="42" ry="8" fill="none"
           stroke="currentColor" stroke-opacity=".48" stroke-width="1.5"/>
  <text x="{x}" y="316" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="12" fill="currentColor" fill-opacity=".42">{label}</text>
  {_dew([(x-46,150,2),(x-44,206,1.7),(x+46,164,1.9),(x+42,224,2.1)], ".3")}
'''
    body = f'''
  {_ground(300, 296, 190)}
  {cup(150, ".30", "رمّان")}
  {cup(300, ".20", "برتقال")}
  {cup(450, ".11", "ليمون بالنعناع")}
  <!-- halved fruit on crushed ice -->
  <g opacity=".9">
   <circle cx="524" cy="266" r="26" fill="url(#fr)" stroke="currentColor"
           stroke-opacity=".4" stroke-width="1.4"/>
   <g stroke="currentColor" stroke-opacity=".26" stroke-width="1" fill="none">
    <path d="M524 240 L524 292 M498 266 L550 266 M506 248 L542 284 M542 248 L506 284"/>
   </g>
   <circle cx="524" cy="266" r="7" fill="currentColor" opacity=".14"/>
  </g>
  <g opacity=".9">
   <circle cx="72" cy="268" r="24" fill="url(#mid)" stroke="currentColor"
           stroke-opacity=".34" stroke-width="1.4"/>
   <g fill="currentColor" opacity=".3">
    <circle cx="64" cy="260" r="2.6"/><circle cx="76" cy="258" r="2.6"/>
    <circle cx="70" cy="270" r="2.6"/><circle cx="82" cy="268" r="2.6"/>
    <circle cx="62" cy="276" r="2.6"/><circle cx="76" cy="280" r="2.6"/>
   </g>
  </g>
'''
    return _svg("0 0 600 340", "بَرَد: ثلاث كؤوس سلاش من فاكهة حقيقية، بلّورات خشنة، وفاكهة مقطوعة بجانبها", body)


PRODUCT_ART = {"saqee80": p_saqee80, "qalab": p_qalab, "boba": p_boba,
               "lafaif": p_lafaif, "jana": p_jana, "radhadh": p_radhadh}


# ── العبوات ───────────────────────────────────────────────────────────────
def packaging():
    """The container family, every piece read as cut from ice."""
    body = '''
  <!-- tall double-wall cup -->
  <path d="M62 86 L146 86 L134 258 L74 258 Z" fill="url(#gl)"
        stroke="currentColor" stroke-opacity=".4" stroke-width="1.5"/>
  <path d="M68 128 L140 128 L138 158 L70 158 Z" fill="currentColor" opacity=".07"/>
  <ellipse cx="104" cy="86" rx="42" ry="8" fill="none" stroke="currentColor"
           stroke-opacity=".46" stroke-width="1.4"/>
  <text x="104" y="200" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="21" font-weight="300" fill="currentColor" fill-opacity=".46">شَبِم</text>
  <text x="104" y="278" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="11" fill="currentColor" fill-opacity=".36">كوبٌ مزدوجُ الجدار</text>

  <!-- heavy tumbler -->
  <path d="M186 150 L262 150 L254 258 L194 258 Z" fill="url(#gl)"
        stroke="currentColor" stroke-opacity=".4" stroke-width="1.5"/>
  <ellipse cx="224" cy="150" rx="38" ry="7" fill="none" stroke="currentColor"
           stroke-opacity=".46" stroke-width="1.4"/>
  <g fill="currentColor" opacity=".14"><path d="M190 176 L258 176 L256 200 L192 200 Z"/></g>
  <text x="224" y="230" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="15" font-weight="300" fill="currentColor" fill-opacity=".42">شَبِم</text>
  <text x="224" y="278" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="11" fill="currentColor" fill-opacity=".36">قدحٌ ثقيل</text>

  <!-- faceted sorbet box -->
  <path d="M300 128 L404 128 L420 152 L420 250 L404 268 L300 268 L284 250 L284 152 Z"
        fill="url(#gl)" stroke="currentColor" stroke-opacity=".4" stroke-width="1.5"/>
  <path d="M284 152 L300 128 L404 128 L420 152 Z" fill="currentColor" opacity=".07"
        stroke="currentColor" stroke-opacity=".24" stroke-width="1"/>
  <g stroke="currentColor" stroke-opacity=".16" stroke-width="1" fill="none">
   <path d="M318 152 L318 268 M352 152 L352 268 L352 268 M386 152 L386 268"/>
   <path d="M284 196 L420 196"/>
  </g>
  <text x="352" y="230" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="19" font-weight="300" fill="currentColor" fill-opacity=".46">شَبِم</text>
  <text x="352" y="290" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="11" fill="currentColor" fill-opacity=".36">علبةُ السوربيه — تسعُ قطع</text>

  <!-- sleeve with a verse -->
  <path d="M456 140 L578 140 L570 246 L464 246 Z" fill="currentColor" opacity=".05"
        stroke="currentColor" stroke-opacity=".3" stroke-width="1.3"/>
  <text x="517" y="176" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="16" font-weight="300" fill="currentColor" fill-opacity=".46">شَبِم</text>
  <g stroke="currentColor" stroke-opacity=".2" stroke-width="1" fill="none">
   <path d="M472 196 L562 196 M472 210 L548 210 M472 224 L556 224"/>
  </g>
  <text x="517" y="278" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="11" fill="currentColor" fill-opacity=".36">كُمٌّ يحمل البيت</text>

  <!-- carrier tray -->
  <path d="M616 186 L790 186 L774 258 L632 258 Z" fill="currentColor" opacity=".05"
        stroke="currentColor" stroke-opacity=".3" stroke-width="1.3"/>
  <g fill="none" stroke="currentColor" stroke-opacity=".26" stroke-width="1.2">
   <ellipse cx="664" cy="206" rx="22" ry="8"/><ellipse cx="742" cy="206" rx="22" ry="8"/>
   <ellipse cx="664" cy="238" rx="22" ry="8"/><ellipse cx="742" cy="238" rx="22" ry="8"/>
  </g>
  <text x="703" y="278" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="11" fill="currentColor" fill-opacity=".36">حاملةُ أربعة</text>

  <!-- lid, seen from above, name debossed -->
  <circle cx="703" cy="112" r="44" fill="url(#gl)" stroke="currentColor"
          stroke-opacity=".38" stroke-width="1.4"/>
  <circle cx="703" cy="112" r="33" fill="none" stroke="currentColor"
          stroke-opacity=".2" stroke-width="1"/>
  <text x="703" y="120" text-anchor="middle" font-family="Space Grotesk, sans-serif"
        font-size="13" font-weight="400" letter-spacing="4"
        fill="currentColor" fill-opacity=".42" style="direction:ltr">SHBM</text>

  <text x="60" y="48" font-family="Cairo, sans-serif" font-size="13"
        fill="currentColor" fill-opacity=".4">كلُّ قطعةٍ من مادّةٍ واحدة: شفّافةٌ أو مُثلَجة، والاسمُ غائرٌ لا مطبوع</text>
'''
    return _svg("0 0 850 310", "عائلة عبوات شبم: كوب مزدوج، قدح، علبة سوربيه، كُمّ، حاملة، وغطاء", body)


# ── الزيّ ─────────────────────────────────────────────────────────────────
def uniform():
    """A quilted winter coat for a refrigerated room in August."""
    body = '''
  <!-- the coat, laid flat -->
  <path d="M150 96 L206 74 L262 96 L286 132 L268 150 L252 138 L252 292 L160 292
           L160 138 L144 150 L126 132 Z"
        fill="url(#gl)" stroke="currentColor" stroke-opacity=".42" stroke-width="1.6"/>
  <path d="M190 76 C198 92 214 92 222 76" fill="none" stroke="currentColor"
        stroke-opacity=".4" stroke-width="1.4"/>
  <path d="M206 94 L206 292" stroke="currentColor" stroke-opacity=".26" stroke-width="1.2"/>
  <!-- quilting -->
  <g stroke="currentColor" stroke-opacity=".16" stroke-width="1" fill="none">
   <path d="M160 132 L252 132 M160 166 L252 166 M160 200 L252 200 M160 234 L252 234
            M160 268 L252 268"/>
   <path d="M183 116 L183 292 M229 116 L229 292"/>
  </g>
  <!-- stand collar -->
  <path d="M186 74 L226 74 L222 90 L190 90 Z" fill="currentColor" opacity=".14"
        stroke="currentColor" stroke-opacity=".34" stroke-width="1.2"/>
  <!-- embroidered wordmark on the left chest -->
  <text x="232" y="128" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="16" font-weight="300" fill="currentColor" fill-opacity=".55">شَبِم</text>
  <text x="232" y="142" text-anchor="middle" font-family="Space Grotesk, sans-serif"
        font-size="7" letter-spacing="3" fill="currentColor" fill-opacity=".34"
        style="direction:ltr">SHBM</text>
  <text x="206" y="316" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="12" fill="currentColor" fill-opacity=".4">معطفٌ مبطَّن — والحرارةُ بالخارج ٤٥</text>

  <!-- gloves -->
  <path d="M344 158 C334 158 330 168 334 176 L334 216 C334 228 344 236 356 236
           C368 236 378 228 378 216 L378 176 C382 168 378 158 368 158
           C362 158 358 162 356 168 C354 162 350 158 344 158 Z"
        fill="url(#gl)" stroke="currentColor" stroke-opacity=".4" stroke-width="1.5"/>
  <g stroke="currentColor" stroke-opacity=".16" stroke-width="1" fill="none">
   <path d="M334 190 L378 190"/><path d="M356 168 L356 190"/>
  </g>
  <path d="M328 216 L384 216 L384 232 L328 232 Z" fill="currentColor" opacity=".1"/>
  <text x="356" y="258" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="11" fill="currentColor" fill-opacity=".38">قفّازٌ عازل</text>

  <!-- cap -->
  <path d="M432 132 C432 110 452 96 476 96 C500 96 520 110 520 132 L520 142 L432 142 Z"
        fill="url(#gl)" stroke="currentColor" stroke-opacity=".4" stroke-width="1.5"/>
  <path d="M432 142 L520 142 L524 152 L428 152 Z" fill="currentColor" opacity=".12"/>
  <text x="476" y="128" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="13" font-weight="300" fill="currentColor" fill-opacity=".5">شَبِم</text>
  <text x="476" y="176" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="11" fill="currentColor" fill-opacity=".38">قبّعةٌ ليّنة</text>

  <!-- apron / long sleeve tee -->
  <path d="M436 208 L516 208 L508 300 L444 300 Z" fill="currentColor" opacity=".05"
        stroke="currentColor" stroke-opacity=".3" stroke-width="1.3"/>
  <path d="M436 208 C452 200 500 200 516 208" fill="none" stroke="currentColor"
        stroke-opacity=".3" stroke-width="1.2"/>
  <text x="476" y="322" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="11" fill="currentColor" fill-opacity=".38">قميصٌ رماديّ تحته</text>
'''
    return _svg("0 0 600 350", "زيّ العاملين: معطف شتوي مبطّن عليه شبم، قفّاز عازل، قبّعة، وقميص", body)


# ── البطاقة ───────────────────────────────────────────────────────────────
def card():
    """A business card cut from frosted translucent stock, name debossed."""
    body = '''
  <!-- face-up card -->
  <rect x="60" y="70" width="290" height="168" rx="10" fill="url(#gl)"
        stroke="currentColor" stroke-opacity=".38" stroke-width="1.5"/>
  <rect x="60" y="70" width="290" height="168" rx="10" fill="none"
        stroke="currentColor" stroke-opacity=".1" stroke-width="4"/>
  <text x="205" y="162" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="46" font-weight="300" fill="currentColor" fill-opacity=".34"
        letter-spacing="2">شَبِم</text>
  <text x="205" y="150" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="46" font-weight="300" fill="currentColor" fill-opacity=".12"
        letter-spacing="2">شَبِم</text>
  <text x="205" y="196" text-anchor="middle" font-family="Space Grotesk, sans-serif"
        font-size="10" letter-spacing="9" fill="currentColor" fill-opacity=".3"
        style="direction:ltr">SHBM</text>

  <!-- reverse, lying beneath -->
  <rect x="300" y="150" width="290" height="168" rx="10" fill="currentColor"
        fill-opacity=".05" stroke="currentColor" stroke-opacity=".3" stroke-width="1.4"/>
  <g stroke="currentColor" stroke-opacity=".26" stroke-width="1.4" fill="none">
   <path d="M556 200 L444 200"/><path d="M556 226 L476 226"/><path d="M556 252 L494 252"/>
  </g>
  <text x="556" y="288" text-anchor="end" font-family="Space Grotesk, sans-serif"
        font-size="11" fill="currentColor" fill-opacity=".3"
        style="direction:ltr">+964 ·· ··· ····</text>

  <!-- one standing on edge, to show thickness and translucency -->
  <path d="M624 116 L700 92 L706 100 L630 124 Z" fill="url(#fr)"
        stroke="currentColor" stroke-opacity=".36" stroke-width="1.3"/>
  <path d="M624 116 L630 124 L630 268 L624 260 Z" fill="currentColor" opacity=".16"/>
  <path d="M630 124 L706 100 L706 244 L630 268 Z" fill="url(#gl)"
        stroke="currentColor" stroke-opacity=".3" stroke-width="1.2"/>
  <text x="668" y="300" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="11" fill="currentColor" fill-opacity=".38">١.٢ ملم، شفّافٌ مُثلَج</text>

  <text x="60" y="46" font-family="Cairo, sans-serif" font-size="13"
        fill="currentColor" fill-opacity=".4">الاسمُ غائرٌ بلا حبر — يُقرأ بالظلّ الذي يقع في الحفر</text>
'''
    return _svg("0 0 760 330", "بطاقة عمل شبم: لوح شفاف مثلّج والاسم غائر فيه بلا حبر", body)


# ── القائمة ───────────────────────────────────────────────────────────────
def menu_slab(items):
    """The menu, engraved into a slab and edge-lit. items: [(name, price)]"""
    rows = ""
    y = 128
    for name, price in items:
        rows += (f'<text x="452" y="{y}" text-anchor="start" font-family="Cairo, sans-serif" '
                 f'font-size="19" font-weight="300" fill="currentColor" fill-opacity=".52">{name}</text>'
                 f'<text x="452" y="{y+3}" text-anchor="start" font-family="Cairo, sans-serif" '
                 f'font-size="19" font-weight="300" fill="currentColor" fill-opacity=".14">{name}</text>'
                 f'<text x="118" y="{y}" text-anchor="start" font-family="Space Grotesk, sans-serif" '
                 f'font-size="16" fill="currentColor" fill-opacity=".4" '
                 f'style="direction:ltr;unicode-bidi:isolate">{price}</text>'
                 f'<path d="M118 {y+10} L452 {y+10}" stroke="currentColor" '
                 f'stroke-opacity=".1" stroke-width="1"/>')
        y += 48
    body = f'''
  <rect x="70" y="40" width="420" height="{y+30}" rx="8" fill="url(#gl)"
        stroke="currentColor" stroke-opacity=".36" stroke-width="1.6"/>
  <rect x="70" y="40" width="420" height="{y+30}" rx="8" fill="none"
        stroke="currentColor" stroke-opacity=".08" stroke-width="5"/>
  <text x="452" y="88" text-anchor="start" font-family="Cairo, sans-serif"
        font-size="30" font-weight="300" fill="currentColor" fill-opacity=".6">شَبِم</text>
  <path d="M118 100 L452 100" stroke="currentColor" stroke-opacity=".2" stroke-width="1.2"/>
  {rows}
  <text x="452" y="{y+12}" text-anchor="start" font-family="Space Grotesk, sans-serif"
        font-size="9" letter-spacing="6" fill="currentColor" fill-opacity=".26"
        style="direction:ltr">SHBM</text>
  {_dew([(92,140,2.2),(90,220,1.8),(96,300,2.4),(470,170,2),(474,262,2.2),(466,330,1.8)], ".26")}
  <path d="M104 120 C102 200 106 280 104 {y+20}" fill="none" stroke="currentColor"
        stroke-opacity=".2" stroke-width="1.2"/>
  <ellipse cx="104" cy="{y+26}" rx="2.6" ry="3.6" fill="currentColor" opacity=".34"/>
'''
    return _svg(f"0 0 560 {y+90}", "قائمة شبم محفورة في لوح مثلّج ومضاءة من الحافة", body)


# ── الشعار ────────────────────────────────────────────────────────────────
def brand_sheet():
    """The wordmark in the four treatments the brand actually uses."""
    def panel(x, cap, inner):
        return f'''
  <rect x="{x}" y="60" width="176" height="176" rx="10" fill="currentColor"
        fill-opacity=".03" stroke="currentColor" stroke-opacity=".16" stroke-width="1"/>
  {inner}
  <text x="{x+88}" y="264" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="11" fill="currentColor" fill-opacity=".4">{cap}</text>
'''
    debossed = ('<text x="148" y="168" text-anchor="middle" font-family="Cairo, sans-serif" '
                'font-size="52" font-weight="300" fill="currentColor" fill-opacity=".3">شَبِم</text>'
                '<text x="148" y="164" text-anchor="middle" font-family="Cairo, sans-serif" '
                'font-size="52" font-weight="300" fill="currentColor" fill-opacity=".1">شَبِم</text>')
    etched = ('<rect x="266" y="60" width="176" height="176" rx="10" fill="url(#gl)"/>'
              '<text x="354" y="166" text-anchor="middle" font-family="Cairo, sans-serif" '
              'font-size="52" font-weight="300" fill="currentColor" fill-opacity=".72">شَبِم</text>')
    printed = ('<rect x="472" y="60" width="176" height="176" rx="10" fill="currentColor" fill-opacity=".14"/>'
               '<text x="560" y="166" text-anchor="middle" font-family="Cairo, sans-serif" '
               'font-size="52" font-weight="300" fill="currentColor" fill-opacity=".95">شَبِم</text>')
    cut = ('<rect x="678" y="60" width="176" height="176" rx="10" fill="currentColor" fill-opacity=".1"/>'
           '<text x="766" y="166" text-anchor="middle" font-family="Cairo, sans-serif" '
           'font-size="52" font-weight="300" fill="var(--ground)" stroke="currentColor" '
           'stroke-opacity=".3" stroke-width="1">شَبِم</text>')
    body = f'''
  {panel(60, "غائرٌ في لوحٍ مُثلَج", debossed)}
  {panel(266, "محفورٌ ومُضاءٌ من الحافة", etched)}
  {panel(472, "مطبوعٌ أبيضَ مسطَّحاً", printed)}
  {panel(678, "مقطوعٌ استنسلاً", cut)}
  <text x="60" y="40" font-family="Cairo, sans-serif" font-size="13"
        fill="currentColor" fill-opacity=".4">أربعُ معالجاتٍ لشكلٍ واحد — والكسرةُ تحت الباء في كلّها</text>
  <text x="854" y="300" text-anchor="end" font-family="Space Grotesk, sans-serif"
        font-size="11" letter-spacing="9" fill="currentColor" fill-opacity=".32"
        style="direction:ltr">SHBM</text>
  <text x="60" y="300" font-family="Cairo, sans-serif" font-size="11"
        fill="currentColor" fill-opacity=".36">اللاتينيّ مونوغرامٌ بصريّ فقط، ولا يُنطَق</text>
'''
    return _svg("0 0 910 320", "شعار شبم بأربع معالجات: غائر، محفور مضاء، مطبوع، ومقطوع استنسلاً", body)


# ── معدّات المطبخ ─────────────────────────────────────────────────────────
# One drawing per machine on the schedule, at a common 120×96 frame so the
# strip reads as a set. Line weight is constant; only the silhouette differs.
_EQ_FRAME = 'viewBox="0 0 120 96" class="cv eq" role="img"'
_S = 'fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"'
_F = 'fill="currentColor" fill-opacity=".13"'


def _eq(label, body):
    return f'<svg {_EQ_FRAME} aria-label="{label}"><g {_S}>{body}</g></svg>'


EQUIP_ART = {

 "espresso": _eq("مكنة إسبريسو بمجموعتين ومطحنتان", f'''
  <path d="M20 74 H100 V80 H20 Z" {_F}/>
  <path d="M24 30 H96 V74 H24 Z"/>
  <path d="M24 30 H96 V44 H24 Z" {_F}/>
  <path d="M38 44 V56 M38 56 H48 M43 56 V64" />
  <path d="M76 44 V56 M76 56 H66 M71 56 V64"/>
  <circle cx="60" cy="52" r="7"/>
  <path d="M32 22 H44 V30 H32 Z"/><path d="M76 22 H88 V30 H76 Z"/>
  <path d="M43 64 h8 M69 64 h8"/>'''),

 "ult": _eq("مجمّدة ثمانين تحت الصفر", f'''
  <path d="M18 34 H102 V80 H18 Z"/>
  <path d="M18 34 H102 V44 H18 Z" {_F}/>
  <path d="M18 26 L28 18 H92 L102 26 Z"/>
  <path d="M52 44 H68"/>
  <path d="M28 56 H44 M28 66 H44 M76 56 H92 M76 66 H92"/>
  <path d="M22 80 V88 M98 80 V88"/>
  <text x="60" y="66" text-anchor="middle" font-family="Space Grotesk, sans-serif"
        font-size="13" stroke="none" fill="currentColor" fill-opacity=".55"
        style="direction:ltr">−86</text>'''),

 "clinebell": _eq("مصنع الثلج الاتّجاهي", f'''
  <path d="M14 40 H106 V78 H14 Z"/>
  <path d="M14 40 H106 V48 H14 Z" {_F}/>
  <path d="M26 48 H58 V72 H26 Z" {_F}/>
  <path d="M26 48 H58 V72 H26 Z"/>
  <path d="M68 54 h30 M68 62 h30 M68 70 h20"/>
  <path d="M32 40 V30 C32 24 40 24 40 30 V40"/>
  <path d="M18 78 V86 M102 78 V86"/>'''),

 "ice_store": _eq("مجمّدة تخزين ومنشار شريطي", f'''
  <path d="M14 30 H58 V82 H14 Z"/><path d="M14 30 H58 V40 H14 Z" {_F}/>
  <path d="M20 48 H52 M20 60 H52 M20 72 H52"/>
  <path d="M70 82 H106 V76 H70 Z" {_F}/>
  <path d="M70 76 V34 M100 76 V34"/><path d="M70 34 H100"/>
  <path d="M85 34 V76" stroke-dasharray="3 3"/>
  <path d="M74 62 H98"/>'''),

 "pans": _eq("صحنا اللفائف", f'''
  <ellipse cx="42" cy="42" rx="30" ry="11"/>
  <path d="M12 42 V54 C12 60 26 65 42 65 C58 65 72 60 72 54 V42"/>
  <ellipse cx="42" cy="42" rx="18" ry="6" stroke-opacity=".3"/>
  <ellipse cx="86" cy="60" rx="24" ry="9"/>
  <path d="M62 60 V70 C62 75 73 79 86 79 C99 79 110 75 110 70 V60"/>
  <path d="M28 30 L38 20 M50 22 L58 30" stroke-opacity=".3"/>'''),

 "batch": _eq("مجمّدة دفعات للسوربيه", f'''
  <path d="M28 20 H92 V78 H28 Z"/><path d="M28 20 H92 V32 H28 Z" {_F}/>
  <circle cx="60" cy="46" r="12"/><path d="M60 34 V58 M48 46 H72" stroke-opacity=".3"/>
  <path d="M50 66 H70 V72 H50 Z" {_F}/><path d="M56 72 V80 H64 V72"/>
  <path d="M32 78 V86 M88 78 V86"/>'''),

 "blast": _eq("مجمّدة صدمة", f'''
  <path d="M22 22 H98 V80 H22 Z"/><path d="M22 22 H98 V34 H22 Z" {_F}/>
  <path d="M34 44 H86 M34 54 H86 M34 64 H86"/>
  <path d="M92 44 V64"/>
  <path d="M60 8 V18 M52 12 L60 18 L68 12" stroke-opacity=".4"/>'''),

 "moulds": _eq("قوالب سيليكون على هيئة الفاكهة", f'''
  <path d="M12 30 H108 V72 H12 Z"/>
  <circle cx="34" cy="45" r="9"/><circle cx="60" cy="45" r="9"/><circle cx="86" cy="45" r="9"/>
  <circle cx="34" cy="45" r="4" stroke-opacity=".3"/>
  <circle cx="60" cy="45" r="4" stroke-opacity=".3"/>
  <circle cx="86" cy="45" r="4" stroke-opacity=".3"/>
  <path d="M22 62 H98" stroke-opacity=".3"/>'''),

 "juice": _eq("محطّة العصير والسلاش", f'''
  <path d="M16 34 C16 26 24 22 30 22 C36 22 44 26 44 34 V62 H16 Z"/>
  <path d="M16 34 C16 26 24 22 30 22 C36 22 44 26 44 34 Z" {_F}/>
  <path d="M16 62 H44 V72 H16 Z"/><path d="M26 72 V80 H34 V72"/>
  <path d="M52 34 C52 26 60 22 66 22 C72 22 80 26 80 34 V62 H52 Z"/>
  <path d="M52 62 H80 V72 H52 Z"/><path d="M62 72 V80 H70 V72"/>
  <path d="M92 26 H108 V56 H92 Z"/><path d="M96 56 V70 H104 V56"/>
  <path d="M100 70 V80"/>'''),

 "fridges": _eq("ثلّاجات التحضير والتخزين", f'''
  <path d="M18 18 H60 V82 H18 Z"/><path d="M62 18 H104 V82 H62 Z"/>
  <path d="M18 46 H60" stroke-opacity=".35"/>
  <path d="M52 34 V40 M52 58 V64 M70 34 V40 M70 58 V64"/>
  <path d="M18 18 H60 V28 H18 Z" {_F}/><path d="M62 18 H104 V28 H62 Z" {_F}/>'''),

 "boba_st": _eq("غلّاية اللؤلؤ ومحطّة الشاي", f'''
  <path d="M22 40 H62 V74 C62 78 58 80 52 80 H32 C26 80 22 78 22 74 Z"/>
  <path d="M22 40 H62 V48 H22 Z" {_F}/>
  <path d="M18 40 H66"/><path d="M42 30 V40"/><path d="M34 26 C38 20 46 20 50 26" stroke-opacity=".35"/>
  <path d="M78 44 H104 V74 H78 Z"/><path d="M78 44 H104 V52 H78 Z" {_F}/>
  <path d="M84 60 H98"/><path d="M91 74 V80"/>'''),

 "genset": _eq("مولّدة ديزل صامتة", f'''
  <path d="M12 34 H108 V74 H12 Z"/><path d="M12 34 H108 V42 H12 Z" {_F}/>
  <path d="M22 50 H38 M22 58 H38 M22 66 H38"/>
  <path d="M48 50 H98 V66 H48 Z" stroke-opacity=".35"/>
  <path d="M88 34 V24 H96 V34"/>
  <path d="M20 74 V82 M100 74 V82"/>'''),

 "chiller": _eq("وحدة تبريد الغرفة الباردة", f'''
  <path d="M16 26 H104 V70 H16 Z"/>
  <circle cx="44" cy="48" r="15"/><circle cx="44" cy="48" r="3" stroke-opacity=".4"/>
  <path d="M44 33 C52 40 52 56 44 63 M44 33 C36 40 36 56 44 63" stroke-opacity=".3"/>
  <path d="M70 38 H94 M70 48 H94 M70 58 H94"/>
  <path d="M28 70 V80 M92 70 V80"/>'''),

 "kiosks": _eq("شاشة الطلب الذاتي", f'''
  <path d="M34 14 H86 V66 H34 Z"/><path d="M40 22 H80 V54 H40 Z" {_F}/>
  <path d="M46 30 H70 M46 38 H74 M46 46 H62"/>
  <path d="M56 66 V78 M40 78 H80"/>'''),

 "bar": _eq("بار الثلج ومقاعده", f'''
  <path d="M10 40 H110 V50 H10 Z" {_F}/><path d="M10 40 H110 V50 H10 Z"/>
  <path d="M30 50 V80 M60 50 V80 M90 50 V80"/>
  <ellipse cx="30" cy="50" rx="11" ry="4"/><ellipse cx="60" cy="50" rx="11" ry="4"/>
  <ellipse cx="90" cy="50" rx="11" ry="4"/>
  <path d="M10 40 V30" stroke-opacity=".3"/>'''),

 "skin_out": _eq("القشرة الخارجية — أكريليك مصبوب", f'''
  <path d="M24 18 H96 V78 H24 Z"/>
  <path d="M32 18 V78 M48 18 V78 M64 18 V78 M80 18 V78" stroke-opacity=".22"/>
  <path d="M24 18 H96 V30 H24 Z" {_F}/>
  <path d="M16 30 L24 22 M16 66 L24 58" stroke-opacity=".35"/>
  <path d="M104 30 L96 22 M104 66 L96 58" stroke-opacity=".35"/>'''),

 "frame": _eq("الهيكل الفولاذي والأساس", f'''
  <path d="M16 76 H104"/><path d="M16 76 V34 M104 76 V34"/><path d="M16 34 H104"/>
  <path d="M16 34 L104 76 M104 34 L16 76" stroke-opacity=".25"/>
  <path d="M10 82 H110 V88 H10 Z" {_F}/><path d="M10 82 H110 V88 H10 Z"/>'''),

 "fitout_in": _eq("التجهيز الداخلي", f'''
  <path d="M14 22 H106 V78 H14 Z"/>
  <path d="M14 60 H106" stroke-opacity=".35"/>
  <path d="M40 22 V60 M70 22 V60" stroke-opacity=".22"/>
  <path d="M24 68 H96" stroke-opacity=".3"/>
  <circle cx="60" cy="69" r="3" stroke-opacity=".4"/>'''),

 "light": _eq("الإضاءة والحفر المُضاء", f'''
  <path d="M28 20 H92 V32 H28 Z" {_F}/><path d="M28 20 H92 V32 H28 Z"/>
  <path d="M38 32 L30 78 M60 32 V78 M82 32 L90 78" stroke-opacity=".28"/>
  <path d="M26 82 H94" stroke-opacity=".35"/>'''),

 "mist_vent": _eq("منظومة الرذاذ والتهوية", f'''
  <path d="M20 30 H100"/><path d="M34 30 V40 M60 30 V40 M86 30 V40"/>
  <g stroke-opacity=".3">
   <path d="M34 46 C30 54 30 62 34 70"/><path d="M34 46 C38 54 38 62 34 70"/>
   <path d="M60 46 C56 54 56 64 60 74"/><path d="M60 46 C64 54 64 64 60 74"/>
   <path d="M86 46 C82 54 82 62 86 70"/><path d="M86 46 C90 54 90 62 86 70"/>
  </g>'''),
}


EQUIP_ART.update({

 "inclusions": _eq("ألواح الجدار ذات المجسّمات المصبوبة", f'''
  <path d="M20 20 H100 V78 H20 Z"/><path d="M20 20 H100 V78 H20 Z" {_F}/>
  <circle cx="44" cy="40" r="9"/><path d="M44 31 C41 28 46 25 48 28" stroke-opacity=".4"/>
  <ellipse cx="76" cy="52" rx="10" ry="7"/>
  <ellipse cx="48" cy="64" rx="5" ry="8" transform="rotate(-20 48 64)"/>
  <path d="M74 28 h8 v10 h-8 Z" stroke-opacity=".4"/>'''),

 "skin_in": _eq("القشرة الداخلية — بولي كربونات", f'''
  <path d="M24 20 H96 V78 H24 Z"/>
  <path d="M24 20 H96 V78 H24 Z" {_F}/>
  <path d="M36 20 V78 M48 20 V78 M60 20 V78 M72 20 V78 M84 20 V78" stroke-opacity=".3"/>
  <path d="M18 34 L24 28 M102 34 L96 28" stroke-opacity=".3"/>'''),

 "skin_frame": _eq("إطار الألمنيوم والتجويف المُهوّى", f'''
  <path d="M18 20 H50 V78 H18 Z"/><path d="M70 20 H102 V78 H70 Z"/>
  <path d="M50 34 H70 M50 64 H70" stroke-opacity=".4"/>
  <g stroke-opacity=".32">
   <path d="M60 74 V60 M56 66 L60 60 L64 66"/>
   <path d="M60 44 V30 M56 36 L60 30 L64 36"/>
  </g>'''),

 "freight": _eq("الشحن البحري والجمارك", f'''
  <path d="M14 40 H92 V74 H14 Z"/><path d="M14 40 H92 V50 H14 Z" {_F}/>
  <path d="M26 50 V74 M40 50 V74 M54 50 V74 M68 50 V74 M82 50 V74" stroke-opacity=".28"/>
  <path d="M92 56 H106 V74 H92" stroke-opacity=".4"/>
  <path d="M20 74 V82 M86 74 V82"/>'''),

 "erect": _eq("التركيب في الموقع", f'''
  <path d="M20 82 H100"/><path d="M28 82 V34 H84"/>
  <path d="M28 34 L60 60" stroke-opacity=".3"/>
  <path d="M84 34 V50"/><path d="M74 50 H94 V66 H74 Z" {_F}/><path d="M74 50 H94 V66 H74 Z"/>
  <path d="M22 82 L34 62 L46 82" stroke-opacity=".3"/>'''),

 "elec": _eq("اللوحات الكهربائية والتمديدات", f'''
  <path d="M32 16 H88 V80 H32 Z"/><path d="M32 16 H88 V26 H32 Z" {_F}/>
  <path d="M40 36 H80 M40 48 H80 M40 60 H80" stroke-opacity=".35"/>
  <path d="M64 30 L56 48 H66 L58 68" stroke-opacity=".65"/>
  <path d="M24 40 H32 M24 56 H32 M88 40 H96 M88 56 H96" stroke-opacity=".3"/>'''),

 "plumb": _eq("السباكة والتصريف ومعالجة المياه", f'''
  <path d="M22 30 H50 V74 C50 78 46 80 42 80 H30 C26 80 22 78 22 74 Z"/>
  <path d="M22 30 H50 V40 H22 Z" {_F}/>
  <path d="M70 20 V40 C70 46 62 46 62 52 V62"/>
  <path d="M56 62 H100 V74 H56 Z"/><path d="M62 74 V80 M94 74 V80"/>
  <circle cx="78" cy="68" r="3" stroke-opacity=".4"/>'''),

 "small": _eq("الأدوات الصغيرة والأواني", f'''
  <ellipse cx="34" cy="34" rx="14" ry="6"/><path d="M20 34 V44 C20 50 27 54 34 54 C41 54 48 50 48 44 V34"/>
  <path d="M34 54 V78" stroke-opacity=".4"/>
  <path d="M64 22 V54 M58 22 V38 M70 22 V38" stroke-opacity=".5"/>
  <path d="M64 54 V78"/>
  <path d="M88 22 C94 26 96 36 92 44 L88 46 V78" stroke-opacity=".5"/>'''),

 "canopy": _eq("مظلّة فوق البار", f'''
  <path d="M12 40 C36 26 84 26 108 40" stroke-width="2.2"/>
  <path d="M12 40 C36 26 84 26 108 40 L108 46 C84 32 36 32 12 46 Z" {_F}/>
  <path d="M108 40 V78" stroke-opacity=".4"/>
  <path d="M20 50 V56 M44 44 V50 M68 44 V50 M92 48 V54" stroke-opacity=".28"/>
  <path d="M14 74 H96" stroke-opacity=".35"/>
  <ellipse cx="34" cy="74" rx="9" ry="3" stroke-opacity=".3"/>
  <ellipse cx="70" cy="74" rx="9" ry="3" stroke-opacity=".3"/>'''),

 "window": _eq("زاوية العرض الشفافة", f'''
  <path d="M18 20 H54 V80 H18 Z" {_F}/><path d="M18 20 H54 V80 H18 Z"/>
  <path d="M58 20 H102 V80 H58 Z" stroke-width="2.2"/>
  <ellipse cx="80" cy="56" rx="16" ry="6"/>
  <path d="M64 56 V64 C64 69 71 73 80 73 C89 73 96 69 96 64 V56"/>
  <path d="M74 44 C72 38 78 34 82 38" stroke-opacity=".4"/>
  <path d="M96 48 L106 40" stroke-opacity=".4"/>'''),

 "brand": _eq("الهوية والتصميم المعماري", f'''
  <path d="M20 22 H100 V78 H20 Z"/>
  <text x="60" y="58" text-anchor="middle" font-family="Cairo, sans-serif"
        font-size="24" stroke="none" fill="currentColor" fill-opacity=".5">شَبِم</text>
  <path d="M34 68 H86" stroke-opacity=".3"/>'''),
})
