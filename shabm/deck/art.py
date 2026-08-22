#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SHBM — colourless SVG illustration. Ink, glass and vapour only."""


def cube_exterior():
    """The booth: a leaning, eroded block of ice sweating and melting onto the pavement."""
    return '''
<svg viewBox="0 0 900 620" class="cv scene" role="img"
 aria-label="واجهة كشك شبم: كتلة ثلج مائلة تتصبب ندى وتذوب على الرصيف، يتصاعد منها بخار بارد، وعليها اسم شبم بالعربية.">
 <defs>
  <linearGradient id="fA" x1="0" y1="0" x2=".3" y2="1">
   <stop offset="0%"  stop-color="currentColor" stop-opacity=".030"/>
   <stop offset="45%" stop-color="currentColor" stop-opacity=".085"/>
   <stop offset="100%" stop-color="currentColor" stop-opacity=".175"/>
  </linearGradient>
  <linearGradient id="fB" x1="0" y1="0" x2="1" y2=".2">
   <stop offset="0%" stop-color="currentColor" stop-opacity=".185"/>
   <stop offset="100%" stop-color="currentColor" stop-opacity=".075"/>
  </linearGradient>
  <linearGradient id="fC" x1=".1" y1="0" x2=".9" y2="1">
   <stop offset="0%" stop-color="currentColor" stop-opacity=".055"/>
   <stop offset="100%" stop-color="currentColor" stop-opacity=".13"/>
  </linearGradient>
  <radialGradient id="pud" cx="50%" cy="50%" r="50%">
   <stop offset="0%" stop-color="currentColor" stop-opacity=".16"/>
   <stop offset="70%" stop-color="currentColor" stop-opacity=".05"/>
   <stop offset="100%" stop-color="currentColor" stop-opacity="0"/>
  </radialGradient>
  <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
   <feGaussianBlur stdDeviation="13"/>
  </filter>
  <filter id="soft2" x="-60%" y="-60%" width="220%" height="220%">
   <feGaussianBlur stdDeviation="26"/>
  </filter>
 </defs>

 <g color="currentColor">
  <!-- ground shadow + meltwater spreading, irregular not oval -->
  <ellipse cx="452" cy="530" rx="330" ry="46" fill="url(#pud)"/>
  <path d="M170 528 C250 508 330 500 452 502 C574 504 668 512 742 532
           C700 556 580 566 452 566 C324 566 216 552 170 528 Z"
        fill="currentColor" opacity=".085"/>
  <path d="M214 534 C300 518 372 512 452 513 C540 514 626 520 692 536
           C640 550 552 556 452 556 C348 556 262 548 214 534 Z"
        fill="currentColor" opacity=".07"/>
  <!-- runnels crawling out across the pavement -->
  <g stroke="currentColor" stroke-opacity=".22" stroke-width="1.1" fill="none" stroke-linecap="round">
   <path d="M300 546 C276 556 250 560 222 559"/>
   <path d="M604 548 C634 558 664 561 694 558"/>
   <path d="M452 566 C450 578 456 588 470 594"/>
   <path d="M380 560 C362 572 344 578 322 580" stroke-opacity=".15"/>
  </g>

  <!-- cold vapour spilling off the base and rolling outward -->
  <g filter="url(#soft2)" opacity=".5">
   <ellipse cx="250" cy="516" rx="118" ry="30" fill="currentColor" opacity=".2"/>
   <ellipse cx="640" cy="522" rx="132" ry="28" fill="currentColor" opacity=".18"/>
   <ellipse cx="452" cy="534" rx="200" ry="26" fill="currentColor" opacity=".14"/>
  </g>
  <g filter="url(#soft)" opacity=".38">
   <ellipse cx="196" cy="470" rx="52" ry="20" fill="currentColor" opacity=".22"/>
   <ellipse cx="712" cy="482" rx="60" ry="22" fill="currentColor" opacity=".2"/>
  </g>

  <!-- plinth, tilted with the block -->
  <path d="M196 496 L716 484 L700 512 L212 524 Z" fill="currentColor" opacity=".13"/>

  <!-- ============ THE BLOCK — leaning, eroded, never a clean cube ============ -->
  <!-- right/side face -->
  <path d="M660 126 L742 176 L716 486 L648 500 Z" fill="url(#fB)"/>
  <!-- top face, sagging where it has melted -->
  <path d="M236 148 C300 128 470 112 660 126 L742 176 C560 166 388 176 262 196 Z" fill="url(#fC)"/>
  <!-- front face: edges bowed and rounded by melt, base narrower than the top -->
  <path d="M236 148 C300 128 470 112 660 126
           L648 500 C540 512 372 510 224 498
           C222 380 226 250 236 148 Z" fill="url(#fA)"/>
  <!-- outline, deliberately soft and uneven -->
  <path d="M236 148 C300 128 470 112 660 126 L742 176 L716 486 L648 500
           C540 512 372 510 224 498 C222 380 226 250 236 148 Z"
        fill="none" stroke="currentColor" stroke-opacity=".34" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M660 126 L648 500 M660 126 L742 176" fill="none" stroke="currentColor" stroke-opacity=".2" stroke-width="1"/>

  <!-- internal fissures — irregular, never mirrored -->
  <g stroke="currentColor" stroke-opacity=".2" stroke-width=".9" fill="none" stroke-linecap="round">
   <path d="M292 186 L330 288 L302 352 L346 452"/>
   <path d="M330 288 L406 262 L452 320"/>
   <path d="M568 168 L534 268 L578 330 L548 418 L586 486"/>
   <path d="M534 268 L462 292"/>
   <path d="M262 402 L318 384 L302 352"/>
   <path d="M604 214 L640 196" stroke-opacity=".14"/>
  </g>
  <g fill="currentColor" opacity=".14">
   <ellipse cx="400" cy="212" rx="3.4" ry="6.4"/><ellipse cx="486" cy="366" rx="2.6" ry="5"/>
   <ellipse cx="318" cy="446" rx="3" ry="5.6"/><ellipse cx="592" cy="430" rx="2.4" ry="4.4"/>
   <ellipse cx="546" cy="200" rx="2" ry="3.8"/><ellipse cx="352" cy="322" rx="2.2" ry="4.2"/>
  </g>

  <!-- dew: condensation beaded across the whole face, densest low down -->
  <g fill="currentColor">
   <g opacity=".26">
    <circle cx="268" cy="236" r="2.1"/><circle cx="300" cy="318" r="1.6"/><circle cx="278" cy="392" r="2.4"/>
    <circle cx="256" cy="452" r="1.8"/><circle cx="330" cy="470" r="2.2"/><circle cx="392" cy="486" r="1.7"/>
    <circle cx="452" cy="474" r="2.5"/><circle cx="516" cy="490" r="1.9"/><circle cx="580" cy="478" r="2.2"/>
    <circle cx="618" cy="440" r="1.7"/><circle cx="624" cy="360" r="2"/><circle cx="612" cy="286" r="1.5"/>
    <circle cx="424" cy="404" r="1.9"/><circle cx="360" cy="356" r="1.5"/><circle cx="500" cy="342" r="1.8"/>
   </g>
   <g opacity=".16">
    <circle cx="316" cy="212" r="1.2"/><circle cx="372" cy="272" r="1.1"/><circle cx="440" cy="228" r="1.3"/>
    <circle cx="520" cy="256" r="1.1"/><circle cx="576" cy="352" r="1.2"/><circle cx="288" cy="298" r="1"/>
    <circle cx="468" cy="430" r="1.2"/><circle cx="552" cy="412" r="1"/><circle cx="396" cy="330" r="1.1"/>
    <circle cx="340" cy="414" r="1.3"/><circle cx="604" cy="322" r="1"/><circle cx="252" cy="342" r="1.1"/>
   </g>
  </g>

  <!-- water actually running down the faces, with hanging droplets -->
  <g stroke="currentColor" stroke-opacity=".3" stroke-width="1.2" fill="none" stroke-linecap="round">
   <path d="M262 200 C260 300 258 400 259 496"/>
   <path d="M632 158 C630 260 628 380 630 498" stroke-opacity=".2"/>
   <path d="M340 178 C338 250 337 300 339 340" stroke-opacity=".16"/>
   <path d="M726 186 C724 300 722 400 718 484" stroke-opacity=".18"/>
  </g>
  <g fill="currentColor" opacity=".4">
   <ellipse cx="259" cy="502" rx="2.6" ry="3.6"/><ellipse cx="630" cy="504" rx="2.2" ry="3.2"/>
   <ellipse cx="339" cy="346" rx="1.8" ry="2.6"/><ellipse cx="718" cy="490" rx="2" ry="2.8"/>
  </g>

  <!-- ============ THE FACE ============================================
       Carved wordmark, three openings, and one transparent corner. -->
  <text x="430" y="236" text-anchor="middle" font-family="Cairo, sans-serif" font-weight="300"
        font-size="80" fill="currentColor" fill-opacity=".62" letter-spacing="2">شَبِم</text>
  <text x="430" y="266" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="300"
        font-size="12" fill="currentColor" fill-opacity=".34" letter-spacing="10">SHBM</text>

  <!-- RIGHT — order. Enlarged: a full touchscreen you stand at, not a slot. -->
  <rect x="512" y="298" width="126" height="126" rx="6" fill="currentColor" fill-opacity=".04"
        stroke="currentColor" stroke-opacity=".4" stroke-width="1.3"/>
  <rect x="522" y="308" width="106" height="106" rx="4" fill="currentColor" fill-opacity=".26"/>
  <g stroke="currentColor" stroke-opacity=".5" stroke-width="1.5" fill="none" stroke-linecap="round">
   <path d="M534 330 H584 M534 348 H602 M534 366 H572"/>
  </g>
  <rect x="534" y="384" width="58" height="17" rx="8" fill="currentColor" fill-opacity=".55"/>
  <text x="575" y="446" text-anchor="middle" font-family="Cairo, sans-serif" font-size="13"
        fill="currentColor" fill-opacity=".5">اطلب</text>

  <!-- LEFT — collection. Enlarged to take a full tray, with the number above. -->
  <rect x="228" y="298" width="126" height="126" rx="6" fill="currentColor" fill-opacity=".04"
        stroke="currentColor" stroke-opacity=".4" stroke-width="1.3"/>
  <rect x="238" y="308" width="106" height="106" rx="4" fill="url(#fC)"
        stroke="currentColor" stroke-opacity=".3" stroke-width="1"/>
  <g stroke="currentColor" stroke-opacity=".24" stroke-width="1" fill="none">
   <path d="M248 320 L258 310 M334 320 L324 310"/><path d="M238 356 H344"/>
  </g>
  <rect x="252" y="262" width="78" height="26" rx="3" fill="currentColor" fill-opacity=".28"/>
  <text x="291" y="281" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="15"
        font-weight="500" fill="currentColor" fill-opacity=".9">٤٢</text>
  <text x="291" y="446" text-anchor="middle" font-family="Cairo, sans-serif" font-size="13"
        fill="currentColor" fill-opacity=".5">استلم</text>

  <!-- CENTRE — cup return. Deliberately the small one. -->
  <rect x="398" y="330" width="66" height="66" rx="4" fill="url(#fC)"
        stroke="currentColor" stroke-opacity=".3" stroke-width="1.1"/>
  <g stroke="currentColor" stroke-opacity=".24" stroke-width="1" fill="none">
   <path d="M398 356 H464"/>
  </g>
  <text x="431" y="418" text-anchor="middle" font-family="Cairo, sans-serif" font-size="11"
        fill="currentColor" fill-opacity=".4">أرجِعِ الكوب</text>

  <!-- ============ THE VIEWING CORNER ==================================
       One corner of the shell is swapped for optically clear acrylic and the
       roll pan sits directly behind it. The only thing on show is the scrape. -->
  <path d="M648 210 L742 258 L742 400 L648 372 Z" fill="none"
        stroke="currentColor" stroke-opacity=".5" stroke-width="1.6"/>
  <path d="M648 210 L742 258 L742 400 L648 372 Z" fill="currentColor" fill-opacity=".02"/>
  <g stroke="currentColor" stroke-opacity=".2" stroke-width="1" fill="none">
   <path d="M660 232 L730 268 M660 300 L730 336"/>
  </g>
  <!-- the −30 pan behind the glass, mid-scrape -->
  <ellipse cx="696" cy="326" rx="34" ry="12" fill="currentColor" fill-opacity=".16"
           stroke="currentColor" stroke-opacity=".42" stroke-width="1.3"/>
  <path d="M662 326 V338 C662 345 678 350 696 350 C714 350 730 345 730 338 V326"
        fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".3"/>
  <ellipse cx="696" cy="324" rx="19" ry="6" fill="none" stroke="currentColor" stroke-opacity=".24"/>
  <g stroke="currentColor" stroke-opacity=".45" stroke-width="2" fill="none" stroke-linecap="round">
   <path d="M716 316 L744 296"/>
  </g>
  <g stroke="currentColor" stroke-opacity=".4" stroke-width="1.3" fill="none">
   <path d="M680 316 C678 306 684 300 690 300 C696 300 698 306 694 310"/>
   <path d="M696 314 C694 302 700 296 706 296 C712 296 714 302 710 306"/>
  </g>
  <text x="695" y="500" text-anchor="middle" font-family="Cairo, sans-serif" font-size="11"
        fill="currentColor" fill-opacity=".46">زاويةُ العرض — الصحنُ وحده يُرى</text>

  <!-- ============ FROZEN INTO THE WALL ================================
       Real objects cast into the panels during pouring: fruit, beans, tools.
       They read as suspended in the block, sharp and unmistakable. -->
  <g stroke="currentColor" stroke-opacity=".34" stroke-width="1.2" fill="url(#fC)">
   <circle cx="268" cy="196" r="14"/>
   <path d="M268 182 C264 177 270 173 274 177" fill="none" stroke-opacity=".3"/>
   <ellipse cx="606" cy="196" rx="16" ry="11"/>
   <path d="M595 196 C601 190 613 190 619 196" fill="none" stroke-opacity=".26"/>
   <path d="M380 292 C388 292 393 298 393 305 C393 314 386 320 380 320
            C374 320 367 314 367 305 C367 298 372 292 380 292 Z"/>
   <path d="M380 293 V319" fill="none" stroke-opacity=".26"/>
   <ellipse cx="486" cy="306" rx="8" ry="13" transform="rotate(24 486 306)"/>
   <path d="M482 296 C488 304 488 310 484 316" fill="none" stroke-opacity=".26"/>
   <ellipse cx="322" cy="468" rx="8" ry="13" transform="rotate(-18 322 468)"/>
   <path d="M326 458 C320 466 320 472 324 478" fill="none" stroke-opacity=".26"/>
   <path d="M552 452 C560 452 564 458 564 464 L564 484 L540 484 L540 464 C540 458 544 452 552 452 Z"/>
   <path d="M540 470 H564" fill="none" stroke-opacity=".26"/>
  </g>
  <g fill="currentColor" opacity=".09">
   <ellipse cx="268" cy="196" rx="23" ry="20"/><ellipse cx="606" cy="196" rx="25" ry="18"/>
   <ellipse cx="380" cy="306" rx="22" ry="21"/><ellipse cx="486" cy="306" rx="18" ry="21"/>
   <ellipse cx="322" cy="468" rx="18" ry="21"/><ellipse cx="552" cy="468" rx="22" ry="24"/>
  </g>
  <text x="884" y="164" text-anchor="end" font-family="Cairo, sans-serif" font-size="11"
        fill="currentColor" fill-opacity=".34">مجسّماتٌ حقيقيّة مصبوبةٌ داخل اللوح — كأنّها متجمّدة</text>

  <!-- ============ THE CANOPY =========================================
       Cantilevered off the block over the seating on all three sides, so no
       column stands in the pavement. Nobody sits in July without shade. -->
  <path d="M56 396 L232 372 L232 388 L62 412 Z" fill="url(#fC)" fill-opacity=".55"
        stroke="currentColor" stroke-opacity=".3" stroke-width="1.2"/>
  <path d="M654 372 L850 344 L850 360 L660 388 Z" fill="url(#fC)" fill-opacity=".55"
        stroke="currentColor" stroke-opacity=".3" stroke-width="1.2"/>
  <g stroke="currentColor" stroke-opacity=".22" stroke-width="1" fill="none">
   <path d="M232 380 L246 378 M654 380 L640 380"/>
   <path d="M96 402 L96 470 M154 394 L154 462 M712 366 L712 434 M782 356 L782 424"
         stroke-opacity=".12" stroke-dasharray="3 5"/>
  </g>
  <text x="884" y="186" text-anchor="end" font-family="Cairo, sans-serif" font-size="11"
        fill="currentColor" fill-opacity=".34">مظلّةٌ كابوليّة فوق الجلوس — بلا أعمدة</text>

  <!-- ============ THE BAR ============================================= -->
  <g>
   <path d="M654 452 L838 428 L846 448 L662 474 Z" fill="url(#fC)"
         stroke="currentColor" stroke-opacity=".34" stroke-width="1.1"/>
   <path d="M654 452 L662 474 L658 504 L650 482 Z" fill="currentColor" fill-opacity=".1"/>
   <g stroke="currentColor" stroke-opacity=".26" stroke-width="1.1" fill="none">
    <path d="M696 476 L698 516 M756 468 L758 508 M814 460 L816 500"/>
   </g>
   <g fill="url(#fA)" stroke="currentColor" stroke-opacity=".3" stroke-width="1">
    <ellipse cx="697" cy="474" rx="16" ry="5.5"/><ellipse cx="757" cy="466" rx="16" ry="5.5"/>
    <ellipse cx="815" cy="458" rx="16" ry="5.5"/>
   </g>
   <g fill="url(#fA)" stroke="currentColor" stroke-opacity=".22" stroke-width="1" opacity=".6">
    <ellipse cx="868" cy="432" rx="14" ry="5"/><ellipse cx="896" cy="420" rx="13" ry="4.6"/>
   </g>
   <g stroke="currentColor" stroke-opacity=".18" stroke-width="1" fill="none" opacity=".6">
    <path d="M868 436 L870 472 M896 424 L898 458"/>
   </g>
   <path d="M40 476 L222 452 L228 472 L46 496 Z" fill="url(#fC)"
         stroke="currentColor" stroke-opacity=".34" stroke-width="1.1"/>
   <path d="M222 452 L228 472 L224 502 L218 480 Z" fill="currentColor" fill-opacity=".1"/>
   <g stroke="currentColor" stroke-opacity=".26" stroke-width="1.1" fill="none">
    <path d="M76 496 L74 536 M136 488 L134 528 M192 481 L190 521"/>
   </g>
   <g fill="url(#fA)" stroke="currentColor" stroke-opacity=".3" stroke-width="1">
    <ellipse cx="75" cy="494" rx="16" ry="5.5"/><ellipse cx="135" cy="486" rx="16" ry="5.5"/>
    <ellipse cx="191" cy="479" rx="16" ry="5.5"/>
   </g>
  </g>

  <!-- plan inset -->
  <g transform="translate(742,536)">
   <rect x="0" y="0" width="132" height="86" rx="6" fill="currentColor" fill-opacity=".03"
         stroke="currentColor" stroke-opacity=".16" stroke-width="1"/>
   <rect x="34" y="24" width="64" height="40" rx="3" fill="url(#fA)"
         stroke="currentColor" stroke-opacity=".34" stroke-width="1.1"/>
   <path d="M92 24 L98 24 L98 34 L92 34 Z" fill="none" stroke="currentColor"
         stroke-opacity=".6" stroke-width="1.6"/>
   <path d="M24 66 L24 14 L108 14 L108 66" fill="none" stroke="currentColor"
         stroke-opacity=".5" stroke-width="3.4" stroke-linecap="round"/>
   <g fill="currentColor" opacity=".34">
    <circle cx="18" cy="26" r="3"/><circle cx="18" cy="44" r="3"/>
    <circle cx="40" cy="8" r="3"/><circle cx="66" cy="8" r="3"/><circle cx="92" cy="8" r="3"/>
    <circle cx="114" cy="26" r="3"/><circle cx="114" cy="44" r="3"/>
   </g>
   <path d="M34 70 L98 70" stroke="currentColor" stroke-opacity=".2" stroke-width="1"
         stroke-dasharray="3 4"/>
   <text x="66" y="82" text-anchor="middle" font-family="Cairo, sans-serif" font-size="9"
         fill="currentColor" fill-opacity=".42">الخدمة</text>
  </g>
  <text x="874" y="524" text-anchor="end" font-family="Cairo, sans-serif" font-size="11"
        fill="currentColor" fill-opacity=".34">مسقطٌ أفقي · ١٨ م² · ٥.٥ × ٣.٣</text>

  <!-- the service apron stays empty -->
  <g stroke="currentColor" stroke-opacity=".18" stroke-width="1"
     stroke-dasharray="4 6" fill="none">
   <path d="M240 542 L636 530"/>
  </g>
  <text x="438" y="562" text-anchor="middle" font-family="Cairo, sans-serif" font-size="11"
        fill="currentColor" fill-opacity=".34">واجهةُ الخدمة خالية — لا بار ولا جلوس أمامها</text>
  <text x="884" y="120" text-anchor="end" font-family="Cairo, sans-serif" font-size="11"
        fill="currentColor" fill-opacity=".34">بارٌ ملتصقٌ بالكتلة: جناحان وظهر</text>
  <text x="884" y="142" text-anchor="end" font-family="Cairo, sans-serif" font-size="11"
        fill="currentColor" fill-opacity=".34">ثلاثُ فتحاتٍ وزاويةُ عرضٍ واحدة</text>

  <!-- misting nozzles under the overhang, and their drift -->
  <g filter="url(#soft)" opacity=".34">
   <ellipse cx="150" cy="440" rx="46" ry="16" fill="currentColor" opacity=".24"/>
   <ellipse cx="762" cy="434" rx="48" ry="16" fill="currentColor" opacity=".24"/>
  </g>
 </g>
</svg>'''


def cube_interior():
    """Inside the booth at true scale: 25 m², cold-room cold, two hatches, no counter service."""
    return '''
<svg viewBox="0 0 900 560" class="cv scene" role="img"
 aria-label="مقطع داخلي لكشك شبم: بار خدمة، باريستا بملابس شتوية، شاشات داخل الثلج، ومنيو محفور.">
 <defs>
  <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0%" stop-color="currentColor" stop-opacity=".14"/>
   <stop offset="100%" stop-color="currentColor" stop-opacity=".045"/>
  </linearGradient>
  <filter id="isoft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="10"/></filter>
 </defs>
 <g color="currentColor">
  <!-- the enclosing shell -->
  <path d="M60 40 L840 40 L840 470 L60 470 Z" fill="url(#wallG)" stroke="currentColor" stroke-opacity=".26" stroke-width="1.2"/>
  <path d="M60 40 L840 40" stroke="currentColor" stroke-opacity=".3" stroke-width="1.4"/>

  <!-- Back wall: bare. No customer ever sees this room, so it carries no
       engraved menu, no branding and no designed finish — just cold-room
       panel, a shelf, and one production screen on an arm. -->
  <g opacity=".5">
   <text x="812" y="96" text-anchor="end" font-family="Cairo, sans-serif" font-size="17"
         font-weight="500" fill="currentColor">جدارٌ عارٍ — لا أحدَ يراه</text>
  </g>
  <g stroke="currentColor" stroke-opacity=".14" stroke-width="1" fill="none">
   <path d="M110 128 L286 128 M110 176 L286 176 M110 224 L286 224"/>
   <path d="M154 128 L154 224 M198 128 L198 224 M242 128 L242 224"/>
  </g>
  <text x="198" y="248" text-anchor="middle" font-family="Cairo, sans-serif" font-size="12"
        fill="currentColor" fill-opacity=".4">رفوفُ تخزينٍ على ألواحِ الغرفة الباردة</text>

  <!-- one production screen, on an arm, not sunk into any wall -->
  <g>
   <rect x="330" y="120" width="126" height="74" rx="5" fill="currentColor" fill-opacity=".24"
         stroke="currentColor" stroke-opacity=".4"/>
   <path d="M393 194 L393 214 M366 214 L420 214" stroke="currentColor" stroke-opacity=".3"
         stroke-width="1.4" fill="none"/>
  </g>
  <text x="393" y="238" text-anchor="middle" font-family="Cairo, sans-serif" font-size="12"
        fill="currentColor" fill-opacity=".42">شاشةُ إنتاجٍ واحدة على ذراع</text>

  <g stroke="currentColor" stroke-opacity=".2" stroke-width="1" fill="none" stroke-dasharray="3 5">
   <path d="M756 128 L816 128 L816 214 L756 214 Z"/>
  </g>
  <text x="786" y="234" text-anchor="middle" font-family="Cairo, sans-serif" font-size="11"
        fill="currentColor" fill-opacity=".34">لوحةُ الكهرباء</text>

  <!-- the production bar -->
  <path d="M110 300 L790 300 L790 318 L110 318 Z" fill="currentColor" opacity=".22"/>
  <path d="M124 318 L776 318 L776 428 L124 428 Z" fill="currentColor" opacity=".07" stroke="currentColor" stroke-opacity=".2"/>
  <g stroke="currentColor" stroke-opacity=".16" stroke-width="1" fill="none">
   <path d="M258 318 L258 428 M420 318 L420 428 M582 318 L582 428"/>
  </g>

  <!-- equipment on the bar: espresso, ULT freezer with vapour, two roll pans -->
  <g fill="currentColor" opacity=".3">
   <rect x="150" y="252" width="70" height="48" rx="4"/>
   <rect x="238" y="266" width="26" height="34" rx="3"/>
  </g>
  <g>
   <rect x="322" y="238" width="96" height="62" rx="5" fill="currentColor" fill-opacity=".26"/>
   <rect x="336" y="252" width="68" height="12" rx="2" fill="currentColor" fill-opacity=".45"/>
   <g filter="url(#isoft)" opacity=".55">
    <ellipse cx="370" cy="240" rx="62" ry="18" fill="currentColor" opacity=".3"/>
    <ellipse cx="330" cy="300" rx="54" ry="14" fill="currentColor" opacity=".22"/>
   </g>
   <text x="370" y="326" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="11" fill="currentColor" fill-opacity=".55">−80°C</text>
  </g>
  <g fill="none" stroke="currentColor" stroke-opacity=".34" stroke-width="1.2">
   <ellipse cx="500" cy="286" rx="42" ry="13"/><ellipse cx="596" cy="286" rx="42" ry="13"/>
  </g>
  <text x="548" y="326" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="11" fill="currentColor" fill-opacity=".55">−30°C ×2</text>

  <!-- the barista, in winter clothing, in August -->
  <g stroke="currentColor" stroke-opacity=".55" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <circle cx="700" cy="222" r="16"/>
   <path d="M684 236 C670 244 662 260 660 282 L660 300"/>
   <path d="M716 236 C730 244 738 260 740 282 L740 300"/>
   <path d="M672 244 L672 300 M728 244 L728 300"/>
   <path d="M660 258 L648 286 M740 258 L754 284"/>
   <path d="M686 208 C690 200 710 200 714 208" stroke-opacity=".7"/>
   <path d="M682 240 C690 248 710 248 718 240" stroke-opacity=".4"/>
  </g>
  <text x="700" y="200" text-anchor="middle" font-family="Cairo, sans-serif" font-size="11" fill="currentColor" fill-opacity=".45">معطف شتوي · في آب</text>

  <!-- the two hatches through the wall -->
  <g>
   <rect x="60" y="330" width="30" height="60" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-opacity=".42"/>
   <path d="M60 330 L36 322 L36 398 L60 390" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-opacity=".3"/>
   <text x="46" y="418" text-anchor="middle" font-family="Cairo, sans-serif" font-size="11" fill="currentColor" fill-opacity=".5">استلام</text>
   <rect x="810" y="330" width="30" height="60" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-opacity=".42"/>
   <path d="M840 330 L864 322 L864 398 L840 390" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-opacity=".3"/>
   <text x="854" y="418" text-anchor="middle" font-family="Cairo, sans-serif" font-size="11" fill="currentColor" fill-opacity=".5">طلب</text>
  </g>

  <!-- cold air falling from the ceiling diffusers -->
  <g stroke="currentColor" stroke-opacity=".14" stroke-width="1" fill="none">
   <path d="M200 44 L200 96 M240 44 L240 88 M280 44 L280 96"/>
   <path d="M620 44 L620 92 M660 44 L660 84 M700 44 L700 92"/>
  </g>
  <g filter="url(#isoft)" opacity=".3">
   <ellipse cx="240" cy="86" rx="72" ry="18" fill="currentColor" opacity=".22"/>
   <ellipse cx="660" cy="82" rx="72" ry="18" fill="currentColor" opacity=".22"/>
  </g>

  <!-- floor, with the cold pooling at ankle height -->
  <path d="M60 452 L840 452" stroke="currentColor" stroke-opacity=".2" stroke-width="1"/>
  <g filter="url(#isoft)" opacity=".3">
   <ellipse cx="450" cy="452" rx="330" ry="16" fill="currentColor" opacity=".2"/>
  </g>

  <!-- the dimension the whole thing has to live inside -->
  <g stroke="currentColor" stroke-opacity=".3" stroke-width="1" fill="none">
   <path d="M60 500 L840 500 M60 493 L60 507 M840 493 L840 507"/>
  </g>
  <text x="450" y="524" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="12"
        fill="currentColor" fill-opacity=".5" letter-spacing="1">25 m² · ≈ 6.2 × 4.0 m</text>
 </g>
</svg>'''


ICON = {}


def _ic(body):
    return ('<svg viewBox="0 0 96 96" fill="none" stroke="currentColor" stroke-width="1.3" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>')


ICON['saqee80'] = _ic('''
 <path d="M30 30h36l-4.4 44a6 6 0 0 1-6 5.4H40.4a6 6 0 0 1-6-5.4z"/>
 <path d="M33 48h30" stroke-opacity=".38"/>
 <path d="M25 24c3.6-3.4 7.8-1.8 10.4.6M59 22c3.4-3.6 8.4-2.8 11.2.4M42 19c2.8-2.8 7.6-2.6 10 .6" stroke-opacity=".6"/>
 <path d="M39 62c2.4-4.8 6.4-7 12-6.6" stroke-opacity=".4"/>
 <path d="M18 40h6M72 40h6" stroke-opacity=".3"/>''')

ICON['qalab'] = _ic('''
 <path d="M18 34h48v46H18z"/><path d="M66 34l14-11v46l-14 11z"/><path d="M18 34l14-11h48l-14 11z"/>
 <ellipse cx="42" cy="41" rx="13" ry="4.8"/>
 <path d="M29 41v20c0 2.6 5.8 4.8 13 4.8s13-2.2 13-4.8V41"/>
 <path d="M29 51c0 2.6 5.8 4.8 13 4.8S55 53.6 55 51" stroke-opacity=".4"/>
 <path d="M62 84c-3 3-9 3-12 0" stroke-opacity=".35"/>''')

ICON['boba'] = _ic('''
 <path d="M31 28h34l-3.6 48a6 6 0 0 1-6 5.4H40.6a6 6 0 0 1-6-5.4z"/>
 <path d="M27 22h42v6H27z"/>
 <path d="M52 22V9l12-4" stroke-opacity=".6"/>
 <path d="M35 44c5 4 10 1 14 4s9 2 13-2" stroke-opacity=".45"/>
 <path d="M34.5 56c5 4 11 1 15 4s9 2 12-2" stroke-opacity=".35"/>
 <circle cx="41" cy="70" r="3.2"/><circle cx="50" cy="73" r="3.2"/><circle cx="58" cy="69" r="3.2"/>
 <circle cx="46" cy="63" r="2.8" stroke-opacity=".5"/>''')

ICON['lafaif'] = _ic('''
 <ellipse cx="48" cy="56" rx="33" ry="15"/>
 <path d="M15 56v6c0 8.3 14.8 15 33 15s33-6.7 33-15v-6"/>
 <ellipse cx="36" cy="52" rx="5.4" ry="9" transform="rotate(-14 36 52)"/>
 <ellipse cx="48" cy="50" rx="5.4" ry="9" transform="rotate(-3 48 50)"/>
 <ellipse cx="60" cy="52" rx="5.4" ry="9" transform="rotate(9 60 52)"/>
 <path d="M26 30c3.6-3.2 7.4-1.4 9.8.6M57 27c3.2-3.6 8.4-2.6 11 .4" stroke-opacity=".5"/>''')

ICON['jana'] = _ic('''
 <rect x="15" y="24" width="66" height="50" rx="4"/>
 <path d="M15 49h66M37 24v50M59 24v50" stroke-opacity=".33"/>
 <circle cx="26" cy="36.5" r="7.4"/>
 <path d="M48 29c4.4 0 7.4 3.2 7.4 7.4S52 44.2 48 44.2s-7.4-3.4-7.4-7.8S43.6 29 48 29z"/>
 <circle cx="70" cy="36.5" r="7.4"/>
 <circle cx="26" cy="61.5" r="7.4"/><circle cx="48" cy="61.5" r="7.4"/><circle cx="70" cy="61.5" r="7.4"/>
 <path d="M26 27v-4M48 27.4v-4.4M70 27v-4" stroke-opacity=".55"/>''')

ICON['radhadh'] = _ic('''
 <path d="M32 26h32l-3.8 50a6 6 0 0 1-6 5.4H41.8a6 6 0 0 1-6-5.4z"/>
 <path d="M37 40l5-5 5.4 5 5.4-5 5.2 5M36.4 52l5.4-5 5.4 5 5.4-5 5 5" stroke-opacity=".5"/>
 <path d="M48 26V12M48 12l7.4-4.4M48 12l-7.4-4.4" stroke-opacity=".6"/>
 <path d="M22 62h4M70 62h4" stroke-opacity=".3"/>''')
