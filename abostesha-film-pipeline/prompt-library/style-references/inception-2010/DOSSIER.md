# Style reference INC: *Inception* (2010), craft dossier

- **Code:** INC. Use this code everywhere outside this file. The title and the crew names appear only here and in the Look Bible (02 hard rule 2), never in a prompt.
- **Date:** 2026-11-02.
- **Status:** research complete, frames not measured (§11). Machine scene analysis of 20 official clips, trailers and score uploads added 2026-11-03 (§13, label [OBSERVED-MACHINE]).
- **Adversarial check 2026-11-03:** 15 core claims re-checked against [asc], [bafta], [aovfx], [if], [fxg], [vfxv-corb], [afi], [20k], [slash-hz], [sow], [wiki] and [wikiacc]. Corrections: award recipients completed (VFX Oscar and BAFTA, Sound BAFTA); van source material 24 fps per IF; miniature collapse was pyrotechnic per BAFTA; Phantom "six takes" quote is Pfister's, Kodak attribution unverified; ShotOnWhat lists DI finishing.
- **Companion files:**
  - `ADAPTATION.md`: how our own film borrows the method; LOOK-INC v0.2.
  - `SUMMARY-AR.md`: the Arabic summary for the user.
  - The `STYLE REFERENCE: INC` entry in `../../style.md`.

> **How this was built.** Nobody watched, downloaded or ripped the film. Every fact comes from a published source and carries a link: crew interviews, trade press, the BAFTA effects submission, American Cinematographer, reference catalogues and scholarship. The link definitions are at the end (§14). Official clips, trailers and score uploads were read only by a machine scene analyser (§13); nothing was downloaded.
>
> **Evidence labels** follow the 02 source ladder:
> - **VERIFIED**: a crew member's own words, or a tier-1 publication.
> - **REPORTED**: a database, a paraphrase or a single secondary source.
> - **SNIPPET**: the page refused the fetch tool, so the fact is known only from a search-engine summary. Its exact wording is unconfirmed.
> - **[UNVERIFIED]**: contradicted, or from fan or uncited sources.
> - **[DERIVED]**: our own arithmetic on cited numbers.
> - **[OBSERVED-MACHINE]**: what an automated scene-analysis model said about an official upload (§13). Not a crew statement; ranks below SNIPPET; [UNVERIFIED] unless a sourced fact agrees.
>
> **Correction to the brief.** The American Cinematographer cover story (July 2010, by David Heuring) is titled **"Dream Thieves"**, not "Dream Weaver" ([wiki]; [asc]). The same article also lives at [asc2].

---

## 0. Credits and tech sheet

| Role | Person | Source |
|---|---|---|
| Writer, director | Christopher Nolan | [wiki] |
| Director of photography | Wally Pfister ASC (Oscar, Best Cinematography) | [asc], [wikiacc] |
| Production designer | Guy Hendrix Dyas (BAFTA win, Oscar nomination for Art Direction with Larry Dias and Doug Mowat) | [wikidyas] |
| Costume designer | Jeffrey Kurland | [sow], [wikikurland] |
| Editor | Lee Smith ACE (BAFTA and ACE Eddie nominations) | [wikilee] |
| Composer | Hans Zimmer. Ambient music design: Mel Wesson. Guitar: Johnny Marr | [wikisnd], [wesson] |
| VFX supervisor | Paul Franklin (Double Negative). DNEG supervisors Andrew Lockley and Pete Bebb. Franklin, Lockley and Bebb won the Oscar and the BAFTA for visual effects, shared with Chris Corbould | [aovfx], [wikiacc] |
| SFX supervisor | Chris Corbould (Oscar, Best Visual Effects; BAFTA, Special Visual Effects; both shared with Franklin, Lockley, Bebb) | [asc], [wikiacc] |
| Miniatures | New Deal Studios (Ian Hunter) | [fxg] |
| Supervising sound editor / designer | Richard King (Oscar, Sound Editing; BAFTA, Sound, shared with the three mixers) | [mix], [wikiacc] |
| Re-recording mixers | Lora Hirschberg (effects and music), Gary A. Rizzo (dialogue, Foley, backgrounds). Production sound mixer: Ed Novick. All three won the Oscar for Sound Mixing | [mix], [wikiacc] |
| Gaffer / key grip | Cory Geryak / Ray Garcia (UK key grip: Ryan Monro) | [asc], [tmdb] |
| Colour timers | David Orr (photochemical, Technicolor). TMDB also lists Jeff Smithwick, and Andrea Pirisi as digital colorist | [asc], [tmdb] |

**TECH SHEET** (02 §2.2 format; Look Bible only, never in a prompt):

| Field | Value | Label | Source |
|---|---|---|---|
| Camera bodies | Panaflex Millennium XL (35mm anamorphic main unit); Panavision PFX System 65 Studio (65mm 5-perf); PanArri 435ESA and 235; Photo-Sonics 4ER and 4E rotary prism; Beaucam VistaVision; Phantom HD | VERIFIED | [asc] |
| Formats | 35mm anamorphic for most of the film; 65mm 5-perf for key set pieces and wides; 8-perf VistaVision for aerials; the ASC tech box also lists "High-Definition Video" (the Phantom HD). No IMAX capture, no 3D | VERIFIED | [asc], [collider], [dga] |
| Lens families | Panavision Primo, Super High Speed, C-, E- and G-Series anamorphic, System 65 | VERIFIED | [asc] |
| Focal-length habits | No zoom reframes ("we always move the camera physically closer and put a different focal length on"). Only the ski unit's focal lengths are published: G-Series 28 / 35 / 75mm, plus Primo 48–550 and 270–840 zooms used for long-lens reach | VERIFIED | [dga], [asc] |
| Aspect ratio | 2.40:1 (ASC tech box) or 2.39:1 (ShotOnWhat): the same scope ratio | VERIFIED / REPORTED | [asc], [sow] |
| Film stocks | Kodak Vision3 500T 5219 (night and interiors) and 250D 5207 (day); print stock Vision 2383 | VERIFIED | [asc] |
| Lighting approach | "I consider myself a naturalist in terms of lighting … I never want things to look over lit, or lit, for that matter" | VERIFIED | [asc] |
| Grade | Timed photochemically with David Orr, "in just three check prints". The tech box also lists a "Specialized Digital Intermediate" (conflict, §3) | VERIFIED | [asc] |
| Filtration | ND .6 or .9 on day exteriors, pulled as the light fell. No diffusion is documented | VERIFIED | [asc] |
| Movement habits | Extensive handheld, mostly operated by Pfister himself; Ultimate Arm; Technocrane; Towercam; ski and snowmobile rigs; helicopter | VERIFIED | [asc], [dga] |
| Shoot | 92 days in six countries; 19 Jun 2009 (Tokyo) to 22 Nov 2009 (Alberta); budget $160M | VERIFIED / REPORTED | [asc], [wiki] |

---

## 1. Camera, lenses and format

### 1.1 Format architecture

| Layer | Format | Use | Source |
|---|---|---|---|
| Main | 35mm anamorphic (Panavision) | "the predominant bulk of the film". Chosen as "the most controllable": light, efficient cameras and a crew that knew the format | [collider], [asc] |
| Large format | 65mm 5-perf ("5 perf not 15 perf") | "some of our biggest set pieces and some of the more formally constructed scenes"; wide shots; the downtown L.A. action | [collider], [asc], [dga] |
| Aerials | VistaVision 8-perf (Beaucam), flown by Hans Bjerno | Helicopter plates, including the Canadian Rockies | [asc] |
| High speed | Photo-Sonics 4ER (up to 360 fps), 4E rotary prism (up to 1,500 fps), Phantom HD | Speed ramps, café blasts, van and bathtub "kicks" | [asc], [aovfx] |
| Ruled out | IMAX capture; native 3D | IMAX cameras were too big for "a lot of handheld in many very confined locations to get a documentary feel". On 3D, Nolan: "You have to shoot on video, which I'm not a fan of" | [asc], [collider] |

- **Lineage and tests.** *The Dark Knight* mixed anamorphic 35mm with 15-perf 65mm (IMAX). For INC, Nolan and Pfister looked at:
  - a demo cutting 65mm wides with 35mm close shots;
  - Showscan;
  - Super Dimension 70 (48 fps capture and projection). Pfister: "almost hyper-HD quality".

  They added 65mm and VistaVision to the 35mm base instead ([asc]; [wiki]).
- **Mixing formats.** Pfister: "We saw that the 35mm and 65mm footage cut together well." The 65mm "got great detail and resolution on the wide shots, where objects in the frame appear smaller" ([asc]). Nolan in 2012: "We shot 5-perf 65 mm for a few scenes in Inception and I liked the results a lot" ([dga]).
- **Why not IMAX.** Nolan called 65mm "the next best thing", and said IMAX was skipped because "I wanted it to be as realistic as possible" ([in70]; [collider]). He also said: "we were trying to portray the reality of dreams rather than their extraordinary nature" ([dga]).
- **Scenes named as 65mm.** Only these are in the sources:
  - the downtown L.A. action, including the train on an Ultimate Arm ([asc]);
  - the snow-fortress vault, where one 35mm and one 65mm camera rolled together ([asc]);
  - "some city exteriors, wide shots, and other scenes" (Daily Variety via [afi]).

  No complete list exists. Any other 65mm attribution is **[UNVERIFIED]**.

### 1.2 Cameras by source

- **ASC tech box and article:** Millennium XL; PFX System 65 Studio; PanArri 435ESA and 235 (the 235 went to the ski unit with 200 ft magazines); Photo-Sonics 4ER and 4E rotary prism; Beaucam; Phantom HD ([asc]).
- **ShotOnWhat** adds ARRIFLEX 235 / 435 ES, Beaumont VistaVision, Super Panavision-70, Phantom HD Gold, Photo-Sonics 4B/4C and 4ER, and "Celluloid and Digital Cinema" acquisition ([sow]). "Super Panavision-70" is probably System 65 5-perf under a legacy name: **[UNVERIFIED]** as a separate camera.
- **IMDb tech specs** (SNIPPET; the page returned 403) reportedly lists Photo-Sonics 4C and 4ER ([imdbtech]).
- **Phantom HD is disputed:**
  - ASC: two Phantom shots made the cut, both finished as VFX at DNEG ([asc]).
  - Pfister, quoted by Wikipedia: "Out of six times that we shot on the digital format, we only had one usable piece and it didn't end up in the film" ([wiki]). Wikipedia's article text does not name Kodak or Phantom here; the attribution to a Kodak testimonial is **[UNVERIFIED]**.
  - Franklin names both the Photo-Sonics 4ER and "the Phantom digital camera" ([aovfx]).
- **Specialist units** ([asc]; [sow]; [tmdb]):
  - aerial DP Hans Bjerno;
  - ski-camera DP Chris Patterson;
  - underwater DP Pete Romano;
  - VFX DP Mark H. Weingartner. His CV lists VistaVision and 4-perf plates and 2nd unit in Japan and the US (SNIPPET, [weing], **[UNVERIFIED]**).

### 1.3 Lenses

- **Lens families** (all Panavision): Primo, Super High Speed, C-, E- and G-Series anamorphic, System 65 ([asc]). ShotOnWhat adds "Panavision 65mm Prime" and "Primo Anamorphic" ([sow]).
- **Focal lengths.** The only documented ones are the ski unit's: G-Series 28, 35 and 75mm primes, plus Primo 48–550mm and 270–840mm zooms for reach ([asc]). Some web summaries extend 28/35/75 to the whole film; the ASC text does not support that.
- **Grammar.** "I don't use zoom lenses … so I don't reframe using the zoom … we always move the camera physically closer and put a different focal length on" ([dga]). Prime lenses were one reason 3D rigs were rejected (The Playlist via [wiki]).
- **Per dream level:** no published source assigns a lens to a level. Any per-level lens chart is **[UNVERIFIED]**.
- **Tendency (third-party analysis only).** Pfister's later Nolan films are said to favour wider anamorphics (35–50mm) close to the action ([idc], **[UNVERIFIED]**).

---

## 2. Lighting

### 2.1 Philosophy and crew

- **Credo:** "I consider myself a naturalist in terms of lighting … I never want things to look over lit, or lit, for that matter." In the hotel bar, "every source is motivated" ([asc]).
- **Contrast belongs to the set:** "If we want a scene to have more contrast, we accomplish that with lighting, wardrobe and set design" ([asc]).
- **Crew.** Gaffer Cory Geryak; key grip Ray Garcia; first ACs Bob Hall and Dan McFadden. Pfister kept his regular crew for the 92-day shoot ([asc]; [tmdb]). Grip and lighting suppliers were Panalux (UK) and William F. White ([sow]).

### 2.2 Documented setups

All from [asc] unless another source is named.

| Set | Rig | What it achieves |
|---|---|---|
| Hotel bar (Cardington; tilts to 30°) | Molebeams gelled CTS give the sunset feel (the gel density is garbled in the source, **[UNVERIFIED]**). On a dimmer cue, 60-ft softboxes of Maxi-Brutes under Grid Cloth rise to overcast. Windows face greenscreen | Light changes inside the shot: "What's very unusual is the way it changes. Combined with the set tilting, it creates a very unsettling sensation" |
| Rotating hallway | Lit only by practicals built into the set. Fixtures hold six 150 W Photofloods each; nook lights are 1,000 W globes behind milk glass. Power runs through a slip ring with the dimmer pack on the rig. Stop usually about T2.8½ (the source text reads "T2.8V2") | Every light rotates with the room, so it stays continuous; the fixtures are built into the frame, not hung from a grid (LA Times via [afi]) |
| Fortress vault (Universal Stage 12) | 100+ space lights over Full Grid plus muslin; black walls with thin white grid lines | "neutral, sterile and shadowless" |
| Fortress interior | About a dozen 20-ft softboxes on hoists, reshaped to the irregular triangular windows; space lights outside give stronger skylight when the floor falls | Daylight that tracks the architecture |
| Van rotation | A truss "tunnel" of six rows of five 18K Fresnels, with no ground lights | "basically a wraparound blanket of daylight". Geryak: "the intermittent darkness communicates that they are spinning and flipping over" |
| Bathtub kick (high-speed ramp to about 1,000 fps) | Two Condors, each with two Arrimax 18K PARs, under 15 ft from the actor; two 12K PARs bounced off the ceiling for fill. The edge light metered about f/90 at 24 fps to survive the 7-stop loss; the lens bottomed out at f/4.5 | "You can see individual beads of water, which gives the scene an otherworldly feeling" |
| Downtown L.A. "rain" exteriors | Sun blocked with Condors and huge flags; rain towers on rooftops along four blocks (SNIPPET, [filmla]). DNEG added façade shadows in post to deepen the overcast ([aovfx]) | Overcast rain on a sunny city. When the sun crept in, Nolan said: "Well, it is a dream" |
| Paris café | No real explosives allowed. Corbould's high-pressure nitrogen / air mortars fired light debris; six cameras ([wiki]; [aovfx]) | The actors could sit inside the blasts |

**Exposure facts.** Day exteriors used ND .6 or .9. Pfister on the negative: "I can underexpose it by 3 stops and overexpose it by 5 stops within the same frame … That's simply not possible in any digital format I've seen." And: "I put a lot of care into the color balance and exposure during filming" ([asc]).

---

## 3. Colour and finishing

### 3.1 Stocks and processing

- **Two stocks only:** Vision3 500T 5219 (night and interiors) and 250D 5207 (day), printed on Vision 2383 ([asc]).
  - ShotOnWhat also lists Vision2 50D 5201/7201 ([sow]). British Cinematographer reportedly mentions 50D for day exteriors (SNIPPET, [bc]). This conflicts with the ASC's "two stocks": 50D is **[UNVERIFIED]**, possibly 65mm only.
- **Looks come from light, not from stock:** "I don't change stocks to create different looks … I prefer to change the lighting or exposure" ([asc]).
- **No lab tricks.** Nolan: "Wally and I were loath to do any artificial processing to the image" ([asc]). No bleach bypass and no push is documented.
- **Grain.** No grain target is published. Grain is what 5219/5207 give at normal processing, with finer grain on the 65mm wides ([asc]). That Pfister rates 500T at EI 400 is third-party only ([idc], **[UNVERIFIED]**).

### 3.2 Timing and finishing (contested)

- **Photochemical.** Pfister timed the whole film at Technicolor with David Orr: "We were able to time this entire film in just three check prints" ([asc]). Nolan: "We cut the negative and timed it photo-chemically … Most films seem to do a DI now, but I think it's just a waste of time for most" ([postnolan]). In 2012: "I've never done a digital intermediate" ([dga]).
- **Digital stages that coexisted** ([asc]):
  - DKP 70mm scanned the 65mm negative at 6K.
  - Technicolor made 4K 35mm filmouts to intercut.
  - Iwerks made 35mm anamorphic reduction dailies from the 65mm.
  - The tech box says "Finishing: Specialized Digital Intermediate". ShotOnWhat also lists "Digital Intermediate Finishing Process" plus IMAX DMR ([sow]).
- **Working reconciliation (our interpretation).** The 35mm release prints were timed photochemically. The 65mm and VFX shots went through scans and filmouts. Digital deliverables (DCP, IMAX DMR) were derived separately ([sow]).
- **IMAX release prints:**
  - ASC: DKP made them by scanning the 35mm colour-timed interpositives ([asc]).
  - Nolan, before release: they would use "our original negative 65mm photography" ([slash]).
  - The two accounts conflict.

### 3.3 Palette per world

The brief from director to DP: "Because Nolan intended to intercut a lot of material in the edit, he asked Pfister to give each location and dream level a distinctive feel." Pfister: "We wanted to have the color palette change quite a bit when we go from one location to another." And: "Calgary has a sterile, cool look; the hallways have warm hues; and the van scenes are neutral. You immediately know where you are, even if we cut to a tighter shot or to something that is slightly out of context" ([asc]).

**Caveat.** A 2010 press paraphrase has Pfister saying there was "never any scheme to use lighting to delineate between the dream levels", and Nolan wanting "no strange color palettes to indicate when someone's in a dream" ([pcn]). Read the two sources together:
- There is **no dream code**: no tint or filter means "dream".
- Each place still has **its own natural palette**, made by location, weather, light, set and wardrobe.

| World | Documented look | Source |
|---|---|---|
| Reality ("Mombasa", Tangier) | No primary source on the palette **[UNVERIFIED]**. Handheld plus Steadicam in the medina chase | [wiki] |
| Paris training dream | Real daylight Paris; café blasts done in camera | [asc], [wiki] |
| Level 1, rain city / van | Pfister: "neutral". Daily Variety: "bluish tint" ([afi]). Fast Company: "gun-metal gray/blue" (SNIPPET, [fastco]) | [asc], [afi], [fastco] |
| Level 2, hotel | "warm hues" from tungsten Photoflood practicals; the bar runs sunset → overcast on cue | [asc] |
| Level 3, snow fortress | "sterile, cool"; "white" (Daily Variety via [afi]); a monochrome scheme said to be inspired by a Bond film (SNIPPET, [fastco]) | [asc], [afi] |
| Limbo | Glacial modernism breaking into the sea. Compositors spent "a lot of time … getting the depth of field and exposure right". Palette **[UNVERIFIED]** | [wiki], [aovfx] |

---

## 4. Camera movement and coverage

- **Handheld is the backbone.** "Extensive handheld camerawork would be a cornerstone" ([asc]). Nolan: "we used a handheld camera and shot it in a more spontaneous way" ([dga]).
- **Pfister operates.** "I always want to operate myself because I can change my mind and react at any given moment … my training as a news and documentary cameraman" ([asc]). Other credited operators: Greg Baldi, Kevin McGill and Roger McDonald; B-camera Brooks Robinson and Graham Hall ([tmdb]).
- **Steadicam** in the Tangier chase, mixed with handheld (production notes via [wiki]). The ASC text never mentions Steadicam.
- **Rotating hallway rigs** ([asc]; [wiki]; [pcn]):
  - **(a) Rotisserie set.** It turns 360°. The camera is either fixed to the set (Dyas: "a camera mounted to one wall") or rides a gyro-stabilised platform on a rail hidden in a floor groove, disguised in the carpet pattern. Either way the room looks still and gravity appears to swing.
  - **(b) Technocrane.** It moves independently of the set and reveals the rotation.
  - **(c) Vertical set.** About 80 ft high (LA Times via [afi]). A telescopic Towercam looks straight up while actors are raised and lowered on wires.
  - **(d) Trolley rig**, removed in post.
- **Hiding the trick.** The rig changes from shot to shot, which "really stops the audience seeing the trick" (Nolan in a featurette, via [syfy-fx]).
- **Ultimate Arm.** 65mm for the downtown chase and the train ([asc]); operator credit Sky Rockit ([tmdb]). For the impact shake, Pfister tried rigs, then took the camera handheld and shook it: "The simple solution is often the right one" ([asc]).
- **Ski unit.** A PanArri 235 on a Red Rock Micro rig with Preston wireless FIZ, handheld on skis by Chris Patterson; first AC Scott DaHarb pulled focus while skiing behind him. A Scorpio gyro head rode a snowmobile with Pfister operating. Nolan: "Fundamentally, I wanted every shot to be moving", with a "tumbling forward" quality ([asc]).
- **Speed ramps** were used "for narrative effect as opposed to aesthetic effect" (Nolan, [asc]). DNEG retimed so "all explosive events started in real-time" and then slowed ([aovfx]).
- **Single camera for drama, several for stunts.** "I use multi-camera for stunts; for all the dramatic action, I use single-camera … I've already seen every frame as it's gone through the gate." Nolan watches dailies every night as "an important process for memorizing the material" ([dga]). Documented multi-camera setups: the café (six cameras) and the vault (35mm + 65mm) ([wiki]; [asc]).
- **Point of view first.** "An absolute concern with point of view … I can't cut a scene if I haven't already figured out whose point of view I'm looking at." He favours the shot "that takes me inside the way that the character enters" ([dga]).
- **No second-unit mindset.** "If I don't need to be directing the shots that go in the movie, why do I need to be there at all?" ([dga]). Specialist units (aerial, ski, underwater, VFX plates) still existed ([asc]; [sow]).
- **Previz.** Nolan: "We don't use any pre-viz" ([collider]). The exception was the Paris fold, where animatics cued the cast and camera ([bafta]; [dneg]).
- **Locked-off or static shooting** is not documented as a stated approach **[UNVERIFIED]**.

---

## 5. Production design, world by world

### 5.1 Doctrine (crew words)

- **Real first.** Nolan: "We didn't want to have dream sequences with any superfluous surrealism … we took the approach of trying to make them feel real" ([asc]).
- **The strangeness is in the environment.** Pfister: "the surrealism in the movie comes from the environment rather than the camerawork or photography. By maintaining a realistic feel, we believed we could introduce a bizarre or unsettling feel very subtly" ([asc]).
- **Dream focus by subtraction.** Dyas: in a dream "you're only really focused on one thing" ([arch]). He removed background detail, left some walls plain, and stripped advertising and street furniture from downtown L.A., "which created an eerie effect" ([thewrap-pd]).
- **Build, don't generate.** Dyas: "avoid CG wherever possible" ([thewrap-pd]). "Only about 5 percent of the scenes in this film actually use green screen" is a *Vanity Fair* quote we could not fetch; it is known second-hand via [fullwood1] and [scotch] (REPORTED). Set decorator Larry Dias: "over 95% of Inception was actually shot in camera" ([mande]).
- **Every level a different place.** Dyas: it was "extremely important that we made all the different dream levels read as very different places" ([thewrap-pd]). Nolan: "One of the dream levels is in the rain, one of them is a night interior, one is outdoors in the snow" ([mf]).
- **A language from the characters' profession.** The characters are architects, so "they would've geeked out over great architects" ([arch]). Brad Ricker mapped the team onto an art department: Cobb is the production designer, Arthur the art director, Ariadne the set designer ([liftoff]).
- **Lineage.** Dyas names Japanese architecture, then Frank Lloyd Wright, Mies van der Rohe, Le Corbusier and I.M. Pei; the modernist element "works well for a film about dreams and repetition" ([arch]). Escher and Penrose are named in the script itself ([fullwood2]). The fortress is military architecture plus a panopticon: "we never really know who is the observer and who is being observed" ([fullwood2]).
- **Analog gravity references.** Kubrick's *2001* and Fred Astaire dancing on the ceiling ([asc]; [pcs]).

### 5.2 Per world: look, and what was found vs. built

| World (dreamer) | Design cue | Palette | Built or found | Sources |
|---|---|---|---|---|
| Saito's castle (Arthur's dream, per Kurland) | Japanese castle in place of the script's implied European one; Nijō-Castle-style dining hall; "hundreds of lanterns" for "warmth without clutter"; gold-leaf murals; minimal furniture | warm amber and gold | Interior on a WB stage, with real ceramics and armour smashed on camera and a real flood ("it was real and built onstage at Warner Bros."); exterior at Abalone Cove, Palos Verdes, with the castle silhouette added digitally | [thewrap-pd], [wiki], [fullwood2], [mande], [asc], [movloc], [cof21] |
| Level 1, the rain city (Yusuf) | Downtown L.A. with signage and clutter stripped | rainy, stark, neutral grey | Real streets (Wilshire at Hope, 7th at Broadway, Spring at 7th); rain towers and rooftop water cannons; a 60-ft fibreglass locomotive on an 18-wheeler chassis | [asc], [liftoff], [wiki], [movloc], [afi] |
| Level 2, the hotel (Arthur) | Upscale modern hotel: lobby, bar, corridor, room, elevator shaft | warm (tungsten practicals) | Cardington airship hangar: a 30° tilting bar; the 100-ft rotating corridor (built twice); a 60×40 ft revolving room; the elevator shaft laid **horizontally**. Lobby and bar location: the CAA building, Century City | [asc], [bafta], [movloc] |
| Level 3, the snow fortress (Eames) | Concrete military panopticon on a mountain; started as a crude clay model by Dyas and Nolan | sterile, cool, white | Full exterior about 300 × 200 ft with an 80-ft tower, at about 7,000 ft on Fortress Mountain, Alberta; three months' build, then a wait for a snowstorm; foundations of wood posts frozen into water; interior on Universal Stage 12; a 1/6 miniature | [thewrap-pd], [wiki], [fullwood2], [asc], [fxg] |
| Limbo (Cobb and Mal) | "Something glacial, with clear modernist architecture, but with chunks of it breaking off into the sea like icebergs". Dyas: "heavily inspired by Chernobyl". Personal houses embedded in the city | grey sea and sky | Procedural CG on real plates: a Moroccan housing development, a Morocco helicopter plate, a Pasadena Craftsman house, a greenscreen box in the surf | [wiki], [pcs], [aovfx], [bafta] |
| Paris training dream (Ariadne) | Real Haussmann blocks that fold; a mirror bridge | daylight naturalism | Real streets; the bistro built at Rue César Franck / Rue Bouchut; Lidar plus CG; a real hinged mirror | [wiki], [aovfx], [movloc] |

**Who dreams what.** Kurland: "the dreamer's architecture and style shape the dream … Arthur designed the Japanese castle dream, not Saito" ([cof21]).

**Palette rationale.** Dyas gives the hotel "for seduction" and the rainy, stark L.A. street "for threat" ([thewrap-pd]). The colour words come from Pfister ([asc]).

### 5.3 Signature build details worth knowing (method only)

- **Corridor materials.** Walls were "fabric over a rubber skin" ([pcs]). Items that looked like metal were cast in rubber, including a live light fitting ([thewrap-pd]).
- **Corridor size.** 100 ft per BAFTA ([bafta]), "over 80 feet" ([pcs]), "200-foot" ([thewrap-pd]). **Use 100 ft.**
- **Penrose steps.** False steps were added to the real atrium staircase of Samsung House, Surrey, in matching wood ([movloc]; [syfy-fx]). Dyas: a working one is "almost impossible". Pfister: it "had to be done mathematically perfect", with a particular lens at a particular height and distance ([syfy-fx]). "12 cardboard models" is **[UNVERIFIED]**.
- **Neutral transition zones.** Elevators, bathrooms and workshops had to stay distinguishable across levels; the team even debated how many elevator buttons to show ([liftoff]).
- **Scale and process.**
  - Two art departments. L.A. handled the train, plane, Penrose, castle, fortress and corridors; London handled the European and early SFX sets. They held daily cross-time-zone reviews ([liftoff]).
  - Dyas spent about a month in Nolan's garage before prep ([pcs]; [thewrap-pd]).
  - Research came from books and libraries ([liftoff]).
- **Props (totems).**
  - Cobb's spinning top (Mal's), Arthur's loaded red die, Ariadne's hollowed chess bishop, Eames's poker chip ([screenrant]).
  - Prop master: Scott Maginnis ([sow]).
  - The top was "shot for real, there was no CG for it" ([aovfx]).
  - A rug of the wrong material exposes a dream inside the story ([screenrant]).

---

## 6. Costume (Jeffrey Kurland)

- **Brief.** "Definitely forward thinking, without being futuristic": an upscale world of business and intrigue, stylised enough to work in both reality and dream ([cof13]). "His clothes don't date that much" ([ftwl]).
- **Everything made to measure.** Kurland did "not want to be limited to what was available in the marketplace". Tailor Dennis Kim; dressmaker Mary Ellen Fields (Hargate Costumes); shirts by Anto of Beverly Hills. Collar stands were varied to suit each tie knot and jacket weight ([cof13b]). The production made "over 86 suits", including for stunt doubles ([cof21]).
- **One silhouette per character** ([cof21]; [cof13]; [ftwl]):
  - **Cobb:** structured separates, not suits: leather jacket, corduroy jacket, linen shirt.
  - **Arthur:** three-piece suits, "more buttoned up", with a green raincoat.
  - **Eames:** a loose expat, "Graham Greene type of way", with an antique watch.
  - **Saito:** single- and double-breasted suits.
  - **Fischer:** almost all double-breasted.
  - **Yusuf:** a suit jacket over a kurta.
  - **Mal:** a beaded blue corseted dress, ghost-like.
  - **Ariadne:** her wardrobe changes in each dream.
- **Costume as a level marker.**
  - The snow suits were "cohesive enough to feel part of the same dream but different enough that you could tell [the sides] apart" ([cof21]).
  - Tom Hardy: "If in doubt, I could just look at my shoes and say, 'Oh! I know which dream I'm in'" ([mf]).
  - Kurland avoided an obvious dream code: "look again" at the children's clothes in the last scene ([gizmodo]).
- **Physics.** In the corridor fight, the suit must not let "the gravity of reality … give away" the trick (Kurland via [flick-tenet]). DNEG built CG fabric matching the pinstripe for wire paint-outs ([inverse]).
- **On film.** Fabrics "soften and gain depth"; Zimmer said the costumes helped him tell the time periods apart in the score ([cof21]).

---

## 7. VFX and SFX doctrine

### 7.1 The governing rule

- **BAFTA submission.** Surreal images were to be shown "with the clarity of total photorealism". As much as possible was done in camera, and "All digital VFX work proceeded from the photography, grounding it in reality" ([bafta]).
- **Nolan on in-camera work.** "My philosophy is to try and shoot something in-camera that they can then work with … visual effects work best when they enhance a shot" ([postnolan]). And: "If it's been created from no physical elements … it's going to feel like animation" ([dga]).
- **Franklin's standard.**
  - The audience "has to believe it's a filmed image, not synthetic" ([cgw]).
  - Effects "support and enhance the narrative without ever upstaging the drama" ([if]).
  - Nolan wanted designs that are "elegant [and], whilst simple in concept, would defy easy analysis by the viewer" ([aovfx]).
- **Rules, not chaos.** Nolan wanted the dream world "to have a rule set, a set of reasons that you could graph for why it's not chaos and anarchy" ([syfy-rules]).
- **Lee Smith, the editor:** "If you can capture reality and then augment it, it always looks better than a hundred percent creation" ([flickering-lee]).

### 7.2 Scale

| Metric | Figure | Source |
|---|---|---|
| VFX shots worked / in the film | 560 / about 500 | [aovfx], [if] |
| Screen time with VFX | about 30 min (IF); 34–40 min (CGW) | [if], [cgw] |
| Comparison | *Batman Begins* about 620 VFX shots; effects-heavy films of the period "as many as 2,000" | [wiki] |
| DNEG crew | about 230 (Art of VFX) or about 220 (IF) | [aovfx], [if] |
| VFX schedule | script read Feb 2009 → full work from Apr 2009 → delivery end of May 2010 | [aovfx] |
| DNEG toolset | Maya with Dynamite / DNShatter; Houdini; the Squirt fluid solver (partly ported to CUDA GPUs); RenderMan with Ptex; in-house Shake for compositing and retiming | [aovfx], [cgw], [if], [postfx] |

[DERIVED] Roughly four-fifths of the running time carries no digital effect.

### 7.3 Each famous effect: how it was done → the transferable principle

**Paris café bursts.**
- *Done.*
  - Paris banned pyrotechnics. Corbould fired compressed gas: nitrogen cannons ([bafta]), air mortars ([if]) or air canisters ([cgw]). They were hidden in the shops and fired paper and light debris in sequence ([globe]).
  - The actors sat in "their own little safety area, where even the paper cup on the table didn't move" ([syfy-fx]).
  - Six high-speed cameras rolled ([wiki]), at up to 1,000 fps ([aovfx]); CGW says 700 fps ([cgw]).
  - The ramps start in real time and slow to about 1,000 fps ([cgw]); BAFTA describes "a heavy underwater resistance" ([bafta]).
  - DNEG extended the destruction "to encompass the whole street" with Dynamite and Houdini ([aovfx]; [if]). Every object was simulated at 1,000 fps even when it plays at 24 ([inverse]), and each burst ran in three stages ([inverse]).
  - Visual reference: the finale of *Zabriskie Point* ([cgw]). About six months to finish ([cgw]). Wires and their shadows were painted out ([dneg]).
- *Reads real because* Nolan wanted "the disappointment of reality": debris flying in unexpected directions ([inverse]).
- *Transfer.* Every burst begins as a light, real-world material burst (paper, dust, fruit) on a real set. CG or the model only multiplies it. Give debris stages (burst → hang → settle) and uneven, unchoreographed paths. This is also the natural G-rated form: no fire, no injury.

**Folding Paris.**
- *Done.*
  - Lidar scans and about 250,000 photos built a model of four city blocks ([bafta]; [inverse]). Rooftops were filled in from photographs because low helicopter flights were refused ([cgw]; [aovfx]).
  - The design idea came from Chicago's bascule bridges: "pivot, not bend" ([cgw]; [vfxv-ret]).
  - Previs animatics cued the cast and the camera ([bafta]; [dneg]).
  - DNEG "effectively created four suns" so the actors would not fall into shadow ([inverse]); CGW calls them "mystery light sources added artfully" ([cgw]).
  - The folded streets got fully animated cars and people ([aovfx]).
  - It won the VES award for Created Environment ("Paris Dreamscape"; Bruno Baron, Dan Neal, Graham Page, Per Mork-Jensen) ([wikiacc]).
- *Transfer.* Impossible geometry moves like engineering (hinge, pivot, slide), never like rubber. The impossible light it would need is quietly supplied, and the actors stay lit. The world behind keeps its traffic and its people.

**Mirror bridge (Bir-Hakeim).**
- *Done.*
  - A real hinged mirror door, 8×16 ft and about 800 lb ([aovfx]; [if]; [cgw]); Bebb later remembered about 15 ft and 2.5 tons ([inverse]).
  - Shot handheld ([bafta]).
  - In post: the real reflections were matchmoved; weeks of roto; a CG environment replaced the crew's reflections; infinite secondary reflections were added with digital doubles ([bafta]; [if]).
  - Franklin: "most of what you're looking at is digital with only the actors being real" ([if]).
- *Transfer.* Let a real object's imperfections (the mirror's wobble) drive the synthetic part.

**Penrose stairs.**
- *Done.* A practical illusion. Computer models set the step dimensions and the one camera position from which it works ([syfy-fx]).
- *Transfer.* The impossible holds from exactly one viewpoint. Moving the camera off that point is the reveal.

**Train in the street.**
- *Done.*
  - A 60-ft replica on an 18-wheeler chassis ([afi]), made from fibreglass moulds of real parts ([wiki]).
  - Shot 65mm on an Ultimate Arm, with the camera shaken by hand at impact ([asc]).
  - Franklin: "we really had a full size train on the street crashing through the cars." DNEG swapped the truck wheels for steel train wheels, fractured the road and added façade shadows ([aovfx]).
  - In sound, King layered freight-train recordings to make a "heavy, huge-sounding machine running free of its usual physics" ([geek]).
- *Transfer.* The impossible object is real size and real mass in a real street. Weight comes from sound as much as from picture.

**Van chase, bridge drop and the long fall.**
- *Done.*
  - Three weeks of rain on downtown blocks ([asc]); giant rain sprayers on Wilshire ([cgw]).
  - A driverless van was launched by nitrogen cannon off a raised bridge section and filmed high speed from several angles ([bafta]). IF names the bridge as the Schuyler Heim Bridge ([if]).
  - Retiming to "an effective 720 fps" ([if]) or 700 ([cgw]). Franklin to IF: "The original material had been shot at 24 fps", which conflicts with BAFTA's "filmed with high speed cameras from multiple angles" for the bridge launch; probably different shots, **[UNVERIFIED]** which is which. Optical flow failed on the motion-blurred rain, so DNEG rebuilt the van on animated planes in Shake and added CG rain and spray ([if]; [cgw]).
  - "we created all of the falling rain as VFX animation" ([aovfx]).
  - The interior spin was lit in the 30 × 18K "tunnel of expense" with no ground lights ([asc]). The freefall interior was a van set on a gimbal ([if]). The actors used scuba underwater ([afi]).
- *Transfer.*
  - Slow motion of particles (rain, spray, dust) is the hardest thing to fake by retiming, so make it natively slow.
  - Let intermittent light sell rotation.
  - The slowest world gives the film its longest single fall: the spine of the cross-cut.

**Hotel bar tilt.**
- *Done.* Built on hydraulics to 30°, with the light changing on camera from sunset to overcast ([asc]).
- *Transfer.* A tilt plus a slow light change in the same shot reads as instability without any visible effect.

**Rotating corridor and revolving room.**
- *Done.*
  - "SFX built a 100ft long revolving hotel corridor set complete with a camera track built into the floor. Along with a 60x40ft revolving hotel room" ([bafta]).
  - Corbould remembers a corridor "10-foot wide … 30 feet in length" turning at about 6 rpm through slip rings ([vfxv-corb]); see §12.
  - The fight was "achieved entirely in-camera without any digital work" ([bafta]); Franklin says one background rig was removed ([aovfx]).
  - Nolan: the rigs were "very specifically inspired by *2001*", and the result is "surreal and quirky, but it's got a pounding action rhythm" ([asc]).
  - The cost to the actors: "very painful … they had to bounce off the walls" ([asc]); "a giant hamster wheel" (Gordon-Levitt, [wiki]).
  - "Eight-metre rings, two motors" comes from one uncited blog ([nexttake], **[UNVERIFIED]**).
- *Transfer.*
  - With the camera bolted to the room, the room stays still and bodies fall across it.
  - An independent camera reveals the turn.
  - Change the rig every shot so the method can't be decoded.

**Zero gravity.**
- *Done.*
  - The vertical corridor with Towercam and wires, and a trolley rig ([asc]).
  - DNEG removed the rigs, added floating objects, and put two stunt performers under digital head replacements ([bafta]; [aovfx]).
  - One tracking shot took about five weeks of wire removal. The roped-together sleepers were nicknamed "the world's longest ethernet cable" ([inverse]).
  - The elevator shaft was laid horizontally and the car fired "at 100mph along rails" by nitrogen cannon ([bafta]; [asc]).
- *Transfer.* Weightlessness is played by real bodies on real rigs. Hair and fabric keep their own slow inertia, and objects drift, collide and rotate.

**Snow fortress, avalanche, miniature.**
- *Done.*
  - A real mountain set ([wiki]). A real avalanche triggered with dynamite alongside the mountain patrol ([aovfx]).
  - A digital fortress built from lidar for wide shots and set extensions; blizzards extended with particle simulations ([bafta]; [cgw]).
  - The stage floor collapsed on cue, reset by hydraulic pistons ([asc]).
  - A 1/6-scale miniature by New Deal ([bafta]; [fxg]), "rigged for a hydraulically-driven pyrotechnic collapse" ([bafta]):
    - plaster over urethane foam, about 2,200 lb of salt and flocking for snow;
    - angled 22° to match the Calgary sun;
    - more than 200 events in about 5.5 s;
    - 72 fps from up to eight cameras;
    - Nolan wanted it "falling from the bottom up".
  - It won the VES award for Models & Miniatures (Ian Hunter, Scott Beverly, Forest Fischer, Robert Spurlock; "Hospital Fortress Destruction") ([wikiacc]). The tower stood "about 40 feet up in the air" ([fxg]).
- *Transfer.*
  - The real landscape and weather stay real.
  - Collapse has a timed internal order (bottom-up, 200+ events).
  - Big things read big when photographed slightly slower than real time.

**Limbo city.**
- *Done.*
  - Concept art was "just a little bit too literal", so DNEG built a procedural system ([cgw]; [aovfx]):
    - Maya filled a glacier model with architectural blocks, with heights following the ice ("like building a glacier with giant Legos");
    - Houdini handled the collapse;
    - motion was referenced "from natural history footage of glaciers rather than from building demolitions";
    - Squirt made the splashes.
  - IF cites Constructivist and Bauhaus references ([if]).
  - Plates: Morocco aerial; a greenscreen box in the surf; Pasadena interiors ([aovfx]; [bafta]).
  - About nine months of CG on Limbo ([mf]).
  - Dyas: the sea eating the buildings was "another visual method of showing that he was losing his mind" (*Vanity Fair* via [artsill]).
- *Transfer.*
  - Generate a dream city from a **rule**, not a moodboard.
  - Model its decay on a natural process.
  - Embed personal memory buildings inside it.

**Small in-camera moments.** The spinning top is real ([aovfx]). The castle flood is real, built onstage ([mande]).

### 7.4 Time dilation and the "kick"

- **The rule.** Time passes faster the deeper the level: hours above become days, months and years below (dialogue below). So when the film cross-cuts, the **outer** level is the slow one. The van in level 1 falls in extreme slow motion while the hotel and fortress levels play at normal speed ([wiki]; [if]). Nolan: "There are very few high-speed shots in anything I've done because I feel it is inherently unreal, but it's an essential component of *Inception* because there is a very specific temporal relationship between the dream world and the waking world" ([asc]).
- **The numbers in the dialogue.** "Brain function in the dream will be about 20 times normal … It's three dreams, that's 10 hours times 20" ([clipcafe1]). Then "six months the second level down, and the third level, that's 10 years" ([clipcafe2]).
  - [DERIVED] 10 h × 20 = 200 h, about 8 days. × 20 again is about 5.5 months. × 20 again is about 9 years: the numbers hold together.
  - CGW reported 10× per level ([cgw]).
- **The kick.** Dreamers time their kicks to a piece of music so the levels wake together ([wiki]).
- **How motion passes down a level** ([asc]; [bafta]; [studiobinder]):

  | Van, level 1 | Hotel, level 2 | Rig |
  |---|---|---|
  | swerve | the bar tilts | tilting set |
  | roll | the corridor turns | rotating sets |
  | free fall | zero-g | vertical set, wires, trolleys |

- That zero-g does not reach the fortress level is fan analysis only **[UNVERIFIED]**.

### 7.5 DNEG's seven-step method (from the sources above)

1. Survey everything real: lidar, photo sets, location surveys.
2. Shoot a plate even for "CG" shots.
3. Use previs to cue the real camera.
4. Practical first, CG to multiply.
5. Remove rather than replace: wires, rigs and shadows; faces only where needed.
6. Match the photography, depth of field and exposure.
7. Simulate at high frame rate, then retime.

Sources: [bafta], [aovfx], [inverse], [cgw], [dneg].

---

## 8. Score (Hans Zimmer)

- **Process.**
  - Written in parallel with the shoot, with no temp score, in broad categories rather than to scenes ([wikisnd]).
  - Zimmer "wrote the whole score without seeing the movie"; Nolan wanted "a parallel dream of music to the film" ([popm]).
  - Nolan gets early score, so no borrowed temp is ever used. King: "I can hear the evolution of the score and Hans can hear the evolution of the sound effects" ([mix]).
- **Emotional thesis.**
  - Mal is "absolutely the cornerstone for all my writing", in "a doomed love story", with "something small and fragile in the middle of it" ([wrap-hz]).
  - Romance that "isn't of some old-school Romanticism" ([popm]).
  - Named influences: Bowie's *Low*, Fripp & Eno, Roeg's *Insignificance* ([popm]); John Barry's Bond scores ([wrap-hz]); *Gödel, Escher, Bach* ([wikisnd]).
  - His own rule: "don't use anything from *Dark Knight* or *Batman Begins*" ([popm]).
- **Nolan on Zimmer.** "a minimalist composer with a sort of maximalist production sense … we just let the music take over everything" (Blu-ray extra, quoted in [lehman], p. 27).
- **The time engine.** "All the music in the score is subdivisions and multiplications of the tempo of the Édith Piaf track … I could slip into half-time; I could slip into a third of a time … At any moment I could drop into a different level of time" (NYT ArtsBeat via [slash-hz] and [filmdetail]).
  - The Piaf song (Dumont/Vaucaire, 1956/1960, 2:32) is the in-story kick cue ([wikisong]).
  - The score keeps Piaf material out because "the Piaf is supposed to be like an alarm bell going off", except in "reel seven, where her voice becomes a counterpoint" ([wrap-hz]).
  - For the stacked climax: "two different pieces of music in two different tempos with two different feels" plus the Piaf, building into "this sort of ginormous fugue"; also "3/4 against 4/4" ([wrap-hz]).
  - "The last note you hear in the movie is the first note in the movie" (LA Times via [slash-hz]).
- **What was taken from Piaf (accounts conflict):**
  - the two brass notes of the intro, slowed ([wrap-hz]);
  - "I only used one note", isolated from the archival master ([filmdetail]);
  - the cribbed "da-da" notes ([npr]);
  - the instruments *approximated* a slowed Piaf ([longreads]);
  - Hirschberg: a piece "slowed down 100 times", lasting "three or four seconds" ([buckeye]).
  - The claim that the runtime equals the song length is **contradicted** (148 min vs 2:32; [wiki], [wikisong]).
- **The low brass hit.**
  - It is scripted: "strange MASSIVE low-end MUSICAL start, sounding like DISTANT HORNS" ([20k]).
  - It was recorded by brass playing into a piano in AIR's church space with the sustain pedal held down, plus "a bit of electronic nonsense" ([20k]; [braam]).
  - Zimmer: "like huge foghorns over a city" ([filmdetail]). Its use is to tell story, not to bridge transitions ([braam]).
  - The trailer horn (Zarin and others) and "Mind Heist" are trailer audio, not the score ([braam]; [ilpost]).
- **Instrumentation and recording.**
  - "It's a very electronic score" ([ua]); Variety reports about 60% electronic (SNIPPET, [variety-score]).
  - The orchestra imitated electronics, and electronics were played through speakers in AIR's stairwells and re-miked (SNIPPET, [variety-score]).
  - Brass forces: 22 brass ("twelve trombones, six French horns, four tubas, and nothing written"), then 32 strings and 20 more brass (SNIPPET, [variety-score]). Twenty Thousand Hertz says 10 brass ([20k]); Lehman hears 22 low brass at the climax of "Time" ([lehman], p. 29).
  - Johnny Marr: a 12-string, four 12-hour days, parts "really strictly written", Morricone-like ([wikisnd]; [popm]); "he doesn't dominate the proceedings" ([popm]).
  - Zimmer's rig: Cubase → UAD → Euphonix System 5, with FATSO on the electronic drums ([ua]).
- **Rules broken once.** "Mombasa" is where Zimmer chose to "break all our rules" ([popm]).
- **Form of "Time"** ([lehman], pp. 27–30):
  - a 4-bar diatonic loop, A minor – E minor – G major – D major, in which every chord "can credibly lay claim to the mantle of tonic";
  - 13 passes; it starts on piano and pad, peaks at passes 9–10 with about 22 low brass, then drops to exposed piano for the last three passes at the reunion, ending on D "with a marked lack of culmination";
  - the "cathartic ostinato".
  - Hewer reads it as G major I–vi–V–ii with a Cmaj7 substitution in the second half ([hewer]). About 63 BPM per a database ([songbpm], **[UNVERIFIED]**).
- **Album.** Reprise, 49:13, 12 tracks ([wikisnd]). The Blu-ray adds about 39 min of isolated score ([bpbs]).
- **Recognition.** Oscar nomination (lost to *The Social Network*); Golden Globe and Grammy nominations; MPSE music editing win (Alex Gibson, Ryan Rubin); Saturn and World Soundtrack wins ([wikiacc]; [wiki]).

---

## 9. Sound design and mix

### 9.1 Design (Richard King)

- **Philosophy.**
  - "You don't question the reality of a dream while you're in it." The track runs "from the nearly normal to the extremely surreal" ([mix]).
  - "Reverb is sort of the magic ingredient that can make the most surreal sound feel real" ([mix]).
  - "Starting with real acoustics gets audiences to believe" (Wired via [geek]).
  - New recordings for every film ([ds1]; [ds2]).
- **Recording programme.** "More recording for Inception than any movie I've ever worked on." Recordists spent 4–5 days each in Paris, East Africa and Sydney; vehicles and props were recorded on set ([mix]; [ds1]).
- **Low-frequency transition cue** ([mix]):
  - two oscillators into two big subwoofers, swept from 10–12 Hz up into audibility; at 18–25 Hz a "massive" wave shakes the space;
  - 21 Hz against 22 Hz for flanging-like beating ([DERIVED] a 1 Hz beat);
  - recorded 50–100 ft away on a Sound Devices 744, on the WB backlot, a soundstage and a canyon;
  - chords built afterwards in Melodyne.
- **Level changes.**
  - Additive: a sound is added to flag the change ([ds1]).
  - "we altered the pitch of all the real-world sounds when we transition from level to level"; the jet's interior roar becomes street traffic ([ds1]).
  - Nolan's echo chain: a gunshot in reality becomes thunder one level down and an earthquake below that (NYT via [ds2]).
- **Worldizing.**
  - An old mono recording "that Hans Zimmer deconstructed" was pitched, stretched and re-recorded on a street, in a building, on a stage and in a canyon ([mix]). That it was Piaf is **[UNVERIFIED]**.
  - Exterior impulse responses were made with a starter pistol in the mountains and on a city street for Altiverb ([mix]).
- **Specific sounds.**
  - Paris fold: "like massive machinery, like a huge watch mechanism" ([mix]).
  - Café debris: pebbles, metal and glass fired past a mic with a slingshot or crossbow, "as lethal as possible", as a sonic analogy for panic ([pbs]).
  - Weapons were tuned for effect, not accuracy, to cut through "lots of competition" ([mix]).
  - Slow motion has no fixed rule: either ignore the speed change or use unrelated sound ([ds1]).
- **Taste.** Nolan is "totally into the visceral"; "We amp it up a notch for Chris" ([mix]). King sends him mixdowns of key sequences instead of holding spotting sessions ([ds1]).

### 9.2 Mix and engineering

All from [mix] unless noted.
- **Schedule and stage.** An 8-day temp mix, two temp updates, then a 7-week final on WB Stage 9.
- **Consoles.** AMS Neve DFC plus two Avid ICONs; ProControl for design fly-ins.
- **Playback.** Seven Pro Tools rigs for effects and backgrounds, plus dialogue, Foley and Altiverb machines; 28 5.0 effects predubs at about 1,000 tracks per reel; five reverb sends and one LFE send per machine.
- **In-the-box workflow.** Mixes stayed virtual and were conformed continuously, so "the first day of mixing will be like the next day of the temp". King calls it the first film of this scale predubbed in the box ([ds1]).
- **Division of labour.** Hirschberg: effects and music; Rizzo: dialogue, Foley, backgrounds. "A pretty dense soundtrack" ([buckeye]).
- **Speed.** Nolan slowed "the speed of the image down and … the speed of the sound down" to mark levels ([buckeye]).
- **Dialogue.** Nolan resists ADR (NYT via [ds2]).
- **Loudness.** No published LUFS or dB figures **[UNVERIFIED]**. Home release: DTS-HD MA 5.1 ([bpbs]).
- **Hirschberg** was the first woman to win the sound-mixing Oscar, per EP ([ep]).

---

## 10. Directing and editing

### 10.1 Directing

- **Realism premise.** "The underlying idea is that dreams feel real while we're in them … We didn't want them to have any less validity than what is specified as being the real world" ([asc]).
- **Rules taken from common dream experience,** such as the jolt of falling and waking when you die in a dream: "There are certain things that we take to be common enough that people will be able to relate" ([syfy-rules]). "The only outlandish idea that the film presents, really, is the existence of a technology" ([movieweb]).
- **Heist as the delivery system.** "That genre embraces exposition and so it's good for teaching a new set of rules to an audience" ([gits]). Also: "the type of exposition that in most films is problematic … in a heist movie becomes the meat of it" ([bordwell]).
- **Exposition through action.** "You never want to find yourself in a scene where characters are passively receiving information … because you don't want the audience passively receiving information. You want them engaged with that dramatization" ([bordwell]).
  - Kristin Thompson calls the heist explanation "nearly continuous" ([bordwell]).
  - Summarising Thompson, Wikipedia says about three quarters of the film, up to the van's fall, explains the plot ([wiki]).
- **Emotional engine.** "There has to be emotional stakes"; the breakthrough was Cobb's "journey home to his children and his love for his wife" ([gits]). "It's the emotionalism that best connects the audience with the material" ([movieweb]).
- **Clarity.** "a lot of cutting for time is, for me, cutting for clarity." "Every film should have its own world, a logic and feel to it." "If you tell the audience something three times they won't understand it, but if you tell them only once, they will" ([dga]).
- **Parallel action is the house structure.** His scripts are "based on some form of parallel action or shifting points of view, even when the story is linear"; the last reels of the Batman films are "all crosscut parallel action" ([dga]).

### 10.2 Editing (Lee Smith)

- **The climax.** It "intercuts four embedded timelines, all of them framed by a fifth, the plane trip in the present" ([bordwell]).
  - Variety reports that the hardest part of the edit was the finale, three dream worlds running at once with the van's long slow fall (SNIPPET, [variety-lee]).
  - A PopMatters review notes that the levels are cross-cut and triggered by music and movement cues (SNIPPET, [popm-review]).
- **Smith on the job.** "Chris does make very complicated films … my job in the whole process is to try to keep it as understandable as you can … there's nothing worse than a film where the audience gets lost to the point of being disappointed." The aim is "never getting into a point where you'd be sitting there as an audience member feeling that you've been left out" ([wtop]).
  - Smith joined "a few months into the shoot" ([flickering-lee]).
  - On music: "the longer you can resist putting music on a movie, the more you analyze and the more brutal you are on the images" (general, not specific to INC; [flickering-lee]).
- **Nolan on Smith and the cutting room.** "the fastest editor working today … blindingly fast". "I love editing so I'm there every day". Daily CineSync sessions with VFX ([postnolan]). "Just hammering it with my editor every day" ([dga]).
- **Rig.** Seven Avid Media Composer systems at DNxHD 36, plus a Steenbeck to screen cuts on 35mm ([postnolan]; [elwyn]). Laptops held "just a half-dozen shots" for security ([elwyn]).
- **Orientation devices** (documented above, here as editing tools):
  - one palette and weather per level ([asc]);
  - pitch and time shifts in sound per level ([ds1]; [buckeye]);
  - the kick music cue as the shared clock ([wiki]);
  - the slowest level (the van) as the long spine ([variety-lee]).
- **Average shot length:** no published figure was found. **Do not quote one.**

---

## 11. Measured frame data

**MEASURED: none.** No frame of the film was measured. Under 02 hard rule 1 and §2.3, frames may come only from the user's own legally obtained copy, may be used only for analysis, and are never uploaded to any generator. No such frames had been supplied by 2026-11-02. Trailers and featurettes were not downloaded.

**Machine scene descriptions: see §13.** On 2026-11-03 an automated analyser described 12 official clips, 3 trailers and 5 score uploads: shot-size labels, light and colour words, audio classes and segment timestamps, all [OBSERVED-MACHINE]. They are words, not measurements, and they do not fill the table below. Frame-level colour measurement of those uploads was not possible, because YouTube refuses downloads from the cloud server (HTTP 403); no frame was obtained. The colour words that the machine and the crew agree on are in §13.3.

**Published numeric anchors** (production facts, not frame measurements):

| Anchor | Value | Source |
|---|---|---|
| Aspect ratio | 2.39–2.40:1 scope | [asc], [sow] |
| Hallway stop | about T2.8½ | [asc] |
| Bathtub high-speed | lens at f/4.5; edge light about f/90 at 24 fps; 7-stop loss at about 1,000 fps | [asc] |
| Day-exterior ND | .6 or .9 | [asc] |
| Negative latitude Pfister relies on | −3 / +5 stops in one frame | [asc] |
| Bar tilt | 30° | [asc] |
| Corridor rotation | 360°; up to about 6 rpm (Corbould) | [asc], [vfxv-corb] |
| Café / van ramps | real time → about 1,000 fps (café); effective 700–720 fps (van) | [cgw], [if], [aovfx] |
| Miniature | 1/6 scale, 72 fps, 200+ events in about 5.5 s, 22° sun angle | [fxg] |
| Palette words | rain city "neutral"; hotel "warm hues"; fortress "sterile, cool" | [asc] |

**How to fill this section** once the user supplies stills:
1. Gather 6–12 stills per world: the rain city, hotel, fortress, Limbo and reality. Include a wide, a close-up with skin, and a practical-lit shot each.
2. Put them in `films/<id>/02-style/reference-frames/`, which is git-ignored.
3. Run `python3 -I skill/abostesha-film-pipeline/scripts/measure_frames.py <frames> --csv`.
4. Record per world: luma p1/p50/p99, % clipped and crushed, mean saturation, shadow and highlight tint, and six clusters.
5. Label adequacy (1 still = provisional, 2–5 = tentative, 6+ = series-level). Give every colour cluster an owner (set, wardrobe or grade).
6. Then replace the PROPOSED hex values and Kelvin values in LOOK-INC (ADAPTATION §a) with values derived from the measurements, and bump to v0.3 (v0.2, 2026-11-03, changed structure from machine observations only; its hex and Kelvin values are still the v0.1 proposals).

| World | Frames | p1 | p50 | p99 | Crush % | Clip % | Sat | Shadow tint | Highlight tint | Adequacy |
|---|---|---|---|---|---|---|---|---|---|---|
| Reality | — | — | — | — | — | — | — | — | — | not measured |
| Rain city | — | — | — | — | — | — | — | — | — | not measured |
| Hotel | — | — | — | — | — | — | — | — | — | not measured |
| Snow fortress | — | — | — | — | — | — | — | — | — | not measured |
| Limbo | — | — | — | — | — | — | — | — | — | not measured |

---

## 12. Open conflicts (consolidated)

1. **Photochemical timing vs "Specialized DI":** both appear in the same ASC article (§3.2).
2. **IMAX source:** 35mm interpositive scans (ASC) vs original 65mm negative (Nolan, [slash]).
3. **Phantom HD:** two shots in the film (ASC) vs none (Pfister quoted by Wikipedia).
4. **50D stock:** listed by ShotOnWhat; the ASC says two stocks.
5. **Photo-Sonics model names:** 4B / 4C / 4E / 4ER vary by source.
6. **Steadicam:** in the production notes; absent from the ASC text.
7. **Corridor length:** 100 ft (BAFTA), 80 ft (CGW, Dyas 2016), 200 ft (TheWrap), "30 feet" (Corbould, VFX Voice). Speed: 6 rpm (VFX Voice); 8 rpm is fan-blog only.
8. **Digital work in the corridor fight:** none (BAFTA) vs one rig removal (Art of VFX).
9. **Mirror:** 8×16 ft, about 800 lb vs about 15 ft, 2.5 tons.
10. **Café frame rate:** 1,000 vs 700 fps. **Van retime:** 720 vs 700; source material 24 fps (IF) vs "high speed cameras" (BAFTA).
11. **Paris survey:** 1 week (Art of VFX), 2 weeks (BAFTA), 3 weeks of lidar (CGW).
12. **Fortress altitude:** about 7,000 ft (TheWrap) vs 8,000 ft (CGW); "20,000 feet" (student blog) is implausible. **Miniature tower:** about 40 ft vs 45 ft.
13. **Castle exterior:** Palos Verdes (ASC, movie-locations) vs Malibu (Wikipedia).
14. **Tilt angle:** 30° (ASC) vs 25° (DiCaprio's memory, [mf]).
15. **Shoot start:** 19 Jun 2009 (Wikipedia) vs mid-July (AFI).
16. **Score brass count:** 22 (Variety, Lehman) vs 10 (Twenty Thousand Hertz). **What was sampled from Piaf:** five accounts (§8).
17. **Time dilation per level:** 20× (dialogue arithmetic) vs 10× (CGW).
18. **Awards:** Dyas, Dias and Mowat were Oscar-*nominated* and BAFTA *winners*; some pages wrongly say they shared the Oscar ([wikidyas]). Verified 2026-11-03 against [wikiacc]: four Oscars (Cinematography: Pfister; Sound Editing: King; Sound Mixing: Hirschberg, Rizzo, Novick; Visual Effects: Franklin, Corbould, Lockley, Bebb) and three BAFTAs (Production Design; Sound; Special Visual Effects).
19. **Machine readings against sourced facts:** every case where the machine scene analysis contradicts a fact above is listed in §13.4. In each case the sourced fact stands.

---

## 13. Observed in official clips and trailers (machine scene analysis, 2026-11-03)

- **What was read.** Twenty official uploads on YouTube: 12 studio clips, 3 trailers and 5 score tracks. Each was described by Higgsfield `video_analysis`, an automated scene-description model. It returns segments, each with a shot-size label, a visual description, an audio description and timestamps. Its `label` field (marketing words such as "Opening Hook") was ignored.
- **Label [OBSERVED-MACHINE].** What the model said about an official upload. It is not a crew statement and ranks below SNIPPET. It stays [UNVERIFIED] unless a sourced fact in §1–10 agrees. Each observation below names the clip and timestamp and ends with **agrees §x**, **contradicts §x** (the sourced fact wins) or *not in this dossier*.
- **What was not done.** Nobody downloaded, ripped or watched the uploads, and we saw no frame. Frame-level colour measurement was not possible: YouTube refuses downloads from the cloud server (HTTP 403), so §11 still holds no measurement.
- **Scripts** (session scratchpad, not committed), all run with `python3 -I`: `stats.py` (dialogue clips), `vfx_stats.py` (effect clips), `inc_trailer_stats.py` and `inc_trailer_extra.py` (trailers), `music_stats.py` (score uploads). **[DERIVED]** in this section means our arithmetic on machine timestamps.

| Code | Upload (official title, shortened) | YouTube ID | Used as |
|---|---|---|---|
| clip01 | "Most Skilled Extractor" | fpXngRB-VTw | dialogue set |
| clip02 | "Dream Collapses" (1 of 10) | i9zjvUywVG8 | **failed**: described an invented pill advert; excluded |
| clip03 | "You're in a Dream" (2 of 10) | i3-jlhJgU9U | dialogue set |
| clip04 | "Dream Training" (3 of 10) | 0b-H8oQUs1A | effect set |
| clip05 | "Dream a Little Bigger" | yycyKndEWcA | dialogue set |
| clip06 | "Basement of the Mind" (4 of 10) | nDaQia9WXtA | dialogue set |
| clip07 | "Runaway Train" (5 of 10) | wdfoifeXHeY | effect set |
| clip08 | "Hallway Fight" (6 of 10) | X-KDt-G1pJ0 | effect set (fixed 3-s grid) |
| clip09 | "Mountaintop Assault" (7 of 10) | z07dRKuSaYE | effect set (nearest to shot level) |
| clip10 | "Inception on My Wife" (8 of 10) | UJd4s9ntbS0 | dialogue set |
| clip11 | "Final Kick" (9 of 10) | IA5YlOXJ_PQ | effect set |
| clip12 | "Ending" (10 of 10) | pQd1-4tqymo | dialogue set |
| IMAX UK | 10-year re-release trailer, 1:47 | 5EiV_HXIIGs | trailer, shot level |
| Digital WB | original campaign trailer, 2:18 | Qwe6qXFTdgc | trailer, shot level |
| Flashback UK | same base cut as Digital WB, 2:28 | LifqWf0BAOA | beat order only (10 segments) |
| Time | score track | hMQ7VhcCpuY | 71 % coverage |
| Dream Is Collapsing | score track | jvT9Sq97mhg | 98 % coverage |
| Half Remembered Dream | score track | BC1LcJ7DIS0 | full coverage |
| Mombasa | score track | kn_wEjhla-4 | **rejected**: 6 % coverage, invented props |
| Dream Within a Dream | score track | kFc0T_D36W8 | **rejected**: 7 % coverage, zooms on a still image |

### 13.1 Read this first: what the analyser can and cannot do

1. **A segment is not a shot.** Segment length depends on the analysis run, not on the cut. clip08 came back on a fixed 3-s grid (43 × 3 s). The score uploads came back in 15-s or 3-s windows. The same trailer cut came back once as 76 scenes (Digital WB) and once as 10 (Flashback UK). Five dialogue segments say outright that they hold "a series of quick shots". **No number in this section is the film's average shot length**, and none may be quoted as one (§10.2 stands). Use them for ratios and order only.
2. **It can fabricate a whole clip.** clip02 came back as a consumer pill advert: a glowing capsule, testimonials, a to-camera tagline, one 77-s segment. The two lowest-coverage score analyses (Mombasa 6 %, Dream Within a Dream 7 %) describe live action, zooms and a pan on uploads that their sibling analyses describe as one still image. All three are excluded. Rule adopted: an analysis under 10 % coverage is unusable.
3. **Its camera words are unreliable.** It wrote "zoom" in four film clips (clip04 0:08, clip06 0:14, clip08 0:33, clip11 0:36) and on still images in two score uploads, against a production that made no zoom reframes (§1.3). It calls handheld "static" (47 of 137 dialogue segments; 5 snow segments in clip09). It wrote "zoom" zero times in 141 trailer descriptions.
4. **Its ear is coarse.** It misses music under speech or loud effects: two end cards report orchestral music "fading out" after scene bodies that never mention music (clip03 1:52, clip10 2:33). It files low brass under "bass", never names piano or guitar, calls the hybrid score "orchestral", cannot tell score from trailer audio, and has no word for a sub-second silence. Transcripts are lossy: "injections closing in" for *projections* (clip05); repeated lines from alignment errors (clip10 1:40, 2:22).
5. **It is fooled exactly where the crew cheated.** The four added suns read as natural shadows (clip04 0:23). The flat-laid shaft reads as a fall "down the center of the shaft" (clip11 0:30; at 0:00 the same rig is described as sliding "down a track", which is the method). The hinged mirror door reads as a mirror "pulled from thin air" (clip04 1:38). The horizontally built shaft reads as "tilted" (IMAX 0:56). That makes it a fair *viewer-perception* test and a poor source of method.

### 13.2 Measured numbers [DERIVED from machine timestamps]

#### 13.2.1 Dialogue and drama clips (clip01, 03, 05, 06, 10, 12)

Set B is film content only: clip02 out, end cards out (clip03 1:52–2:04, clip10 2:33–2:44). Audio classes: dialogue (a transcript or named speech), music (music, melody, beat, orchestral, swell, drone), effects (any other named sound), silence ("silence", "minimal sound"). The primary class is dialogue if any speech is present, otherwise the first class named. The two "drone" segments in clip12 count as music; that call is ambiguous.

| Measure, set B | Value |
|---|---|
| Segments / running time | 137 / 673 s (11.2 min) |
| Mean / median segment | 4.91 s / 3.0 s (range 1–26 s, SD 3.97) |
| Segments ≤ 2 s / ≥ 10 s | 39 / 14 |
| ECU · CU · MCU · MS · WS, by count | 9.5 · 40.9 · 5.1 · 32.1 · 12.4 % |
| ECU · CU · MCU · MS · WS, by time | 6.4 · 34.0 · 5.2 · 34.6 · 19.8 % |
| Primary audio D · M · E · S, by count | 67.9 · 2.2 · 27.0 · 2.9 % |
| Primary audio D · M · E · S, by time | 63.3 · 2.4 · 32.7 · 1.6 % |
| Camera words | "static" 47, "follows / pans" 14, "zoom" 1, none 75 |

All seven clips raw (set A, with clip02 and the end cards): 146 segments, 851 s, mean 5.83 s, median 3.5 s, maximum 77 s (the failed clip02).

| Clip (world as staged) | Segs | Total | Mean / median | ECU-CU-MCU-MS-WS | Primary D/M/E/S |
|---|---|---|---|---|---|
| clip01: business dinner in a dream castle | 9 | 54 s | 6.0 / 5.0 s | 0-2-0-6-1 | 9/0/0/0 |
| clip03: daylight teaching dream | 15 | 112 s | 7.5 / 4.0 s | 2-1-7-3-2 | 13/0/2/0 |
| clip05: first-level warehouse fight | 10 | 70 s | 7.0 / 6.5 s | 0-1-0-6-3 | 5/1/4/0 |
| clip06: descent into the lead's memory floors | 41 | 127 s | 3.1 / 2.0 s | 2-22-0-14-3 | 21/0/17/3 |
| clip10: confession and memory montage | 45 | 153 s | 3.4 / 3.0 s | 9-24-0-10-2 | 41/0/4/0 |
| clip12: return to reality | 17 | 157 s | 9.2 / 8.0 s | 0-6-0-5-6 | 4/2/10/1 |

| Coverage split, set B | n | Tight (ECU+CU+MCU) | MS | WS by count / by time |
|---|---|---|---|---|
| Dialogue-primary segments | 93 | 58.1 % | 36.6 % | 5.4 % / 7.7 % |
| Non-dialogue segments | 44 | 50.0 % | 22.7 % | 27.3 % / 40.5 % |

[DERIVED] Wides are about 5× more frequent outside dialogue (5.06× by count, 5.26× by time). The return (clip12) runs 2.7–3.0× the segment length of the confrontations (clip06, clip10).

#### 13.2.2 Effect clips (clip04, 07, 08, 09, 11)

| Clip | Effect content | Length | Segments | Mean / median | Segmentation |
|---|---|---|---|---|---|
| clip04 | street fold, mirror bridge | 154 s | 23 | 6.70 / 5 s | semantic; dialogue and mirror passages merged (21 s, 26 s) |
| clip07 | train in the street, rain chase | 105 s | 9 | 11.67 / 10 s | coarse; "a series of quick cuts" inside 10–29-s segments |
| clip08 | van roll intercut with the rotating hotel | 129 s | 43 | 3.00 / 3 s | fixed 3-s windows (artefact) |
| clip09 | snow action → three-world cross-cut → avalanche | 151 s | 71 | 2.13 / 2 s | nearest to shot level; whole seconds |
| clip11 | lift, vault beat, fortress collapse, kick cascade | 168 s | 20 | 8.40 / 8 s | coarse in the cascade |

| Shot size | CU | MCU | MS | WS | POV |
|---|---|---|---|---|---|
| Effect segments (n = 95) | 8 % | 0 | 47 % | 43 % | 1 % |
| Other segments (n = 71) | 37 % | 7 % | 46 % | 10 % | 0 |

| Audio, one class per segment | Music + effects | Effects only | Music only | Dialogue-led | Silence |
|---|---|---|---|---|---|
| Effect segments | 45 % | 43 % | 8 % | 3 % | 0 |
| Other segments | 39 % | 21 % | 13 % | 27 % | 0 |

"Silence" is named once in 166 segments, and that segment also carries wind and a spoken line.

| Cross-cut passage (a world run = consecutive segments in one world) | Switches | Shape |
|---|---|---|
| clip08, hotel / van | 18 in 129 s (7.2 s per switch) | hotel share of time by thirds 43 % → 80 % → 64 %; rotation segments 4 → 11 → 1 |
| clip09 1:07–1:46, van / hotel / snow | 7 in 39 s | world runs 4, 17, 6, 2, 3, 2, 3, 2 s: 1 switch in the first 21 s, 6 in the last 18 s |
| clip09, three blocks | — | mean segment 1.63 s (snow action) → 2.17 s (cross-cut) → 3.75 s (avalanche and aftermath) |
| clip11 | 13 in 168 s | segments merged; not measurable |

#### 13.2.3 Trailers

| Metric | IMAX UK | Digital WB |
|---|---|---|
| Runtime / scenes | 107 s / 55 | 138 s / 76 |
| Text cards and logos | 11, 26 % of runtime | 7, 17 % |
| Picture shots: n, mean / median | 44, 1.80 / 1.5 s | 69, 1.65 / 1 s |
| Picture shots ≤ 1 s / ≤ 2 s (both cuts pooled, n = 113) | 54 % / 88 % | (pooled) |
| Mean scene length by thirds | 1.80 → 1.64 → 2.69 s | 1.70 → 1.59 → 2.30 s |
| Shot sizes, picture only | WS 43 · CU 25 · MCU 18 · MS 11 · ECU 2 % | WS 43 · MCU 20 · CU 17 · MS 17 · POV 1 % |
| Impossible-event shots | 14, 32 % of picture time, mean 1.8 s | 18, 25 %, mean 1.6 s |
| Primary audio, % of seconds | D 41 · M 26 · HIT 21 · FX 12 | FX 40 · D 38 · HIT 14 · M 7 |
| Hits: count / on cards | 13 / 10 | 5 / 5 |
| Scenes with speech | 36 % | 36 % |
| Longest picture holds | fold 7 s (0:37); post-title object 6 s (1:30) | sea-edge city 6 s (1:53); realisation close-up 5 s (0:59) |
| "Zoom" in any description | 0 | 0 |

Timestamps are whole seconds, so every length is ±1 s. Flashback UK (148 s, 10 segments, mean 14.8 s) is the same base cut as Digital WB: the dialogue order is identical and the beats start within 0–2 s of each other. It is used for beat order only. **Trailer pace is never film pace.**

#### 13.2.4 Score uploads

| Track | Album length [wikisnd] | Analysed to | Coverage | Windows | Window length | Verdict |
|---|---|---|---|---|---|---|
| Time | 4:35 | 3:15 | 71 % | 13 | 15 s each (SD 0) | usable, partial |
| Dream Is Collapsing | 2:28 | 2:25 | 98 % | 9 | 15 s (one of 25 s) | usable, low resolution |
| Half Remembered Dream | 1:12 | 1:12 | 100 % | 5 | 11–21 s | usable |
| Mombasa | 4:54 | 0:18 | 6 % | 5 | 3–5 s | rejected |
| Dream Within a Dream | 5:04 | 0:21 | 7 % | 7 | 3 s | rejected |

- Music is the primary class in 38 of 39 windows (99.3 % of the time). There is no dialogue, and silence appears only at a track end (Dream Is Collapsing 2:00–2:25).
- Instrument words, as windows that use them (of 39): "orchestral" 20, bass or low end 17, percussion or hits 15, strings 11, drone or pad 9, synth or electronic 7, brass 3, tick or heartbeat 1; **piano 0, guitar 0, voice 0**.
- The windows run on the analyser's clock (15 s, 3 s), not on cuts or bars. The pooled 11.46-s mean is not an edit figure.

### 13.3 Strongest observations, by department

Every observation carries [OBSERVED-MACHINE]; [DERIVED] marks our arithmetic on machine timestamps.

**Palette and light (§2–3)**
- [OBSERVED-MACHINE] **The palettes read at 1–2-s cuts.** In the two shot-level trailers, 23 of 35 world shots (66 %) got their documented palette family and **none** got the opposite family: rain city and van 7 of 9 "cool / blue / grey"; hotel 7 of 12 "warm"; snow 6 of 10 "cold / white / grey"; castle 3 of 4 "warm / golden / lantern". In clip08 the model calls the hotel "warm" in 20 of 27 segments and never calls a van segment warm (0 of 12; cool, grey or desaturated in 11 of 12), through 3-s cross-cuts. **Agrees §3.3** ("you immediately know where you are"). This is the strongest machine support for the tight-shot test.
- [OBSERVED-MACHINE] **Colour temperature follows what a space is for, not the dream level.**
  - Warm in practical-lit rooms of intimacy and memory: the castle hall (clip01 0:00–0:24), the lamp-lit memory room (clip06 0:23), memory interiors (clip10 0:20, 0:43), the home, "warm wood, soft light" (clip12 1:34).
  - Cool in transit and threat: the lift cage (clip06 0:00–0:21), the warehouse interior (clip05 0:13), the plane cabin, "cool, artificial light from above" (clip12 0:00), the confession close-up, "low, cool" (clip10 0:00).
  - Bright daylight for teaching and return: the café street (clip03), the terminal, "bright, even, overhead" (clip12 0:12), the sunny garden (clip12 1:34).
  - Compatible with the one-palette-per-location brief (§3.3). Not a sourced rule.
- [OBSERVED-MACHINE] **Service spaces drift inside a world.** The hotel stairwell reads "cool and artificial" against the warm corridor (clip08 2:00–2:06); in clip09 the same stairwell is "harsh and artificial", lit by fluorescent fittings, with dull grey walls (1:12–1:28). *Not in this dossier.*
- [OBSERVED-MACHINE] **First dream level, inside looking out.** A dark, cool interior (a shooter at a gridded window) is cross-cut with a bright, overexposed exterior (clip05 0:13–0:55).
  - "Cool, blue-toned" **agrees** with the press descriptors in §3.3 ("bluish", "gun-metal") more than with the DP's "neutral". Unsettled until frames are measured.
  - A "clear, bright sky" **contradicts §5.2** (rain, sun blocked), unless this is one of the shots where the sun crept in (§2.2). More likely blown-out overcast seen from inside, which fits the −3 / +5 latitude (§2.2, §11).
  - Yellow taxis: one saturated plot object in a desaturated world (clip05 0:00–0:13). *Not in this dossier.*
- [OBSERVED-MACHINE] **The snow level keeps contrast low while brightness changes:** "dim", "flat grey" and "washed out" in different segments (clip09). **Agrees §3.3** ("sterile, cool").
- [OBSERVED-MACHINE] **Memory light** (clip10): exteriors "bright, natural, cool" (0:12, 1:05), interiors "warm, natural" (0:20, 0:43), a sunlit room (1:47). The deepest world's palette stays [UNVERIFIED] (§3.3). The sea-edge city's "bright and clear" sky (IMAX 1:21; IMAX 0:52 reads "bright and natural with a hazy, warm quality") **contradicts** "grey sea and sky" (§5.2) on one or two machine shots and settles nothing.
- [OBSERVED-MACHINE] **No dream code.** The castle, the café and the warehouse are each staged as a real place in natural light (clip01, clip03, clip05); only the event breaks physics. No dissolve, tint or flash appears in any of the 20 analyses; the only optical words are two fades to black at the end of an upload (clip08 2:06, clip12 2:20), neither at a world change. **Agrees §3.3 and §5.1.**

**Coverage and camera (§4)**
- [OBSERVED-MACHINE] **Dialogue is covered tight, and wides are spent.** WS is 5.4 % of dialogue segments against 27.3 % of the rest (§13.2.1). Each wide does a job:
  - a blocking change: clip01's only WS lands as the speaker stands, and it reveals the room (0:20–0:24);
  - a world entry: the terminal (clip12 0:12);
  - the event: clip03's first WS arrives with the first burst (1:15).
- [OBSERVED-MACHINE] **Two dialogue modes.**
  - Partnership or teaching gets matched MCU singles with a soft foreground shoulder (clip03 0:08–0:14).
  - Threat gets asymmetric sizes (clip06; counts over the whole clip, 0:00–2:07): the newcomer is CU in 14 of her 15 segments; the memory-figure is MS in 11 of 15, and the camera "follows" her. **Agrees §4** (point of view first).
- [OBSERVED-MACHINE] **The effect is wide; the face is close.** WS is 43 % of effect segments against 10 % of the rest; CU + MCU is 8 % against 44 % (§13.2.2). The trailers do the same: events wide, reactions close, mediums least used (IMAX 0:32–0:37: two wides of the burst, then one MCU reaction).
- [OBSERVED-MACHINE] **Both rotating-set rigs show:** "rotates in sync with the set", "keeps them centred" (clip08 0:27, 1:15), and an independent camera "circling the combatants" (clip08 0:51). **Agrees §4** (a) and (b).
- [OBSERVED-MACHINE] **Snow unit:** a ski POV and tracking from beside and behind (clip09 0:05–1:07). **Agrees §4** ("every shot moving"). The model's "static" readings there **contradict** it and are discarded.
- [OBSERVED-MACHINE] **Trouble is cued off-screen first:** a look up at something unseen (clip01 0:50), glass crunching underfoot before the figure appears (clip06 0:35), a question before the burst (clip03 1:15). The threat's first look sits inside designed silence ("Silence" at clip06 0:40 and 0:47).
- [OBSERVED-MACHINE] **Exposition inside action.**
  - Close-up / reverse blocks of 2–3 s per line, over wind (0:11) or dialogue alone (0:39–0:51), set between two action runs (clip09 0:11–0:16, 0:39–0:51).
  - Overhead ECU inserts of a hand drawing the rule on a tablecloth (clip03 0:22, 0:29).
  - **Agrees §10.1** (exposition through action).
- [OBSERVED-MACHINE] **Camera words** ("zoom", "static"): see §13.1 item 3. They **contradict §1.3 and §4** and are discarded.

**Design and costume (§5–6)**
- [OBSERVED-MACHINE] **The lift as a transition vehicle:** a dim, cool cage with metallic screech, low rumble and wind; the button panel seen through a grid (clip06 0:00–0:21). **Agrees §5.3** (elevators as neutral transition zones; the button debate).
- [OBSERVED-MACHINE] **Aftermath dressing tells the story before the figure appears:** overturned chairs, an unmade bed, a pram, broken glass (clip06 0:23–0:35). *Not in this dossier.*
- [OBSERVED-MACHINE] **The castle hall** reads "warm, dim" and gold (clip01): **agrees §5.2**. "Ornate chandeliers" and a "glass table" **contradict §5.2** ("hundreds of lanterns", "minimal furniture"); probably the lanterns misread.
- [OBSERVED-MACHINE] **Suits on the lead:** "black suit, black tie" (clip01) and "a dark pinstripe suit" on the returning man (clip12 0:12) **contradict §6** ("structured separates, not suits"). Possibly a formal and a travel exception, possibly a misread. Open; check stills.
- [OBSERVED-MACHINE] **The newcomer keeps one hue family** (a burnt-orange jacket in clip03, an orange top in clip06) while the garments change. Consistent with §6 ("her wardrobe changes in each dream").

**VFX and physics (§7)**
- [OBSERVED-MACHINE] **Cause leads, effect lags** (clip08): the swerve (0:09) → the hotel starts to tilt (0:18) → the van rolls (0:21, 0:36) → the rotation peaks in two 18-s hotel runs (0:48–1:27) → the van comes to rest (1:36) → the hotel is level again (1:51). The inner world settles after the outer one. **Agrees §7.4.**
- [OBSERVED-MACHINE] **Gravity tracers:** a pistol slides across the floor (clip08 0:33); papers and small objects fly with the turn (1:21). "Suspended in the air" (0:51) is airtime in a turning room, which the model reads like weightlessness; in §7.4 zero-g needs the outer world in free fall, which has not happened yet.
- [OBSERVED-MACHINE] **The fold** (clip04 0:01–0:50): wide event segments of 5–7 s alternate with reactions of 2–3 s (0:06–0:08, 0:20–0:23); cars drive up the vertical surface while pedestrians carry on below (0:35–0:50). **Agrees §7.3.** "The pavement begins to curve upward" (0:38–0:43) **contradicts** "pivot, not bend" (§7.3).
- [OBSERVED-MACHINE] **Train in the street** (clip07 0:20–0:29): one wide, effects only (rhythmic clanging, grinding, crashes, horns), no music. The cab scenes on each side keep a passenger "calm despite the situation" (0:00–0:11, 0:30–0:35). **Agrees §7.3 and §9.1.**
- [OBSERVED-MACHINE] **Big natural events are held longer.** Four of the five avalanche wides hold 4–8 s (one holds 2 s); the avalanche block's segment mean is 3.75 s against 1.6 s for the action around them (×2.3), under a roar and an orchestral crescendo (clip09 1:46–2:15). **Agrees §7.3** (a real avalanche). The fortress collapse is one 8-s effects-only segment (clip11 1:05–1:13); "the mountain base completely crumbles" (2:08–2:26) **agrees §7.3** (bottom-up miniature).
- [OBSERVED-MACHINE] **Slow motion mostly on narrative speed events.** The IMAX trailer tags slow motion on the water kick (0:20), the café burst (0:32–0:36) and the van fall (1:13); clip11 on the van hitting the water (2:08–2:26). **Agrees §2.2, §7.3 and §7.4.** Not all ten tags fit: a crashing wave (WB 0:02), a city building crumbling (clip11 1:23) and a falling woman (clip11 1:58) are also tagged, and inner-level slow motion (clip09 0:35, "tumbling in slow motion") **contradicts §7.4**. Those four readings are unexplained or discarded; the café's "slow-motion, stylized" is in §13.4.
- [OBSERVED-MACHINE] **One long look per trailer.** Exactly one impossible environment gets a long hold: the fold, 7 s (IMAX 0:37); the sea-edge city, 6 s (WB 1:53). All other event shots average 1.6–1.8 s.
- [OBSERVED-MACHINE] **The café burst described as an explosion.** "Explodes", "explosion sound" and "slow-motion, stylized" (clip03 1:15–1:52; IMAX 0:32; WB 1:49) **contradict §7.3** on method (compressed gas, light debris, no pyrotechnics) and on intent (the ramp starts in real time; debris flies on uneven paths). Right content, wrong words. A liquid ripple in a cup (clip03 1:15–1:30) sits against "even the paper cup … didn't move" (§7.3); possibly a separate insert set-up. Open.

**Score (§8)**
- [OBSERVED-MACHINE] **Additive builds with open endings.**
  - Time: a drone, then high strings (0:00–0:30); "a repeating four-note melody" (0:30); slow heavy hits (0:45); brass (1:00); a fading string note, "unresolved" (3:00–3:15).
  - Half Remembered Dream: an ambient bed, then a sharp electronic pulse (0:13), a "brass-heavy" peak at 36–53 % of the track (0:26–0:38), then strings and the opening bed return (0:39–1:12).
  - **Agrees §8** (13 additive passes; "a marked lack of culmination"). The "four-note melody" is, in our reading, the four-chord loop heard as a line.
- [OBSERVED-MACHINE] **Time has two arches** in the machine's verbs (peaks at 1:30 and 2:45–3:00) against the sourced single arch peaking at passes 9–10 (§8, [lehman]). Inconclusive: coverage is 71 %, and the album track is longer than the film cue.
- [OBSERVED-MACHINE] **No piano** in 39 windows, though Time opens on piano and pad and ends on exposed piano (§8). **Contradicts §8**: missed.
- [OBSERVED-MACHINE] **"Orchestral" in 20 of 39 windows, synth or electronic in 7.** **Contradicts §8** ("a very electronic score"; about 60 %).
- [OBSERVED-MACHINE] **Dream Is Collapsing:** low hits at regular intervals with long resonance (0:00–0:45), then one final hit decaying to silence over about 25 s (2:00–2:25). **Agrees** with the brass-into-sustained-piano method (§8). The same words would fit the trailer horn, which §8 keeps separate: the model cannot tell score from trailer audio.
- [OBSERVED-MACHINE] **A tick-like pulse** opens Half Remembered Dream, "like a heartbeat or a ticking clock" (0:00–0:12). *Not in this dossier*; no source mentions a tick in the score.
- [OBSERVED-MACHINE] **Trailer hits sit on text.** 15 of 18 hits across the two shot-level trailers land on cards: IMAX puts a low brass hit on 10 of its 11 cards (the first three exactly 6 s apart, 0:12–0:24); WB puts all 5 of its hits on cards. In IMAX, build words (build, swell, crescendo, intensity, tension, urgency) fall in the 1–4 s before a hit in 9 of its 13 hits. This **contradicts** how the film uses the low brass, which tells story and does not bridge transitions (§8, [braam]): it is trailer grammar. The trailers also call their music "orchestral" throughout; trailer audio is not score (§8).

**Sound (§9)**
- [OBSERVED-MACHINE] **Onsets and impacts are dry.** 8 of the 11 onset or impact segments name no music: the fold onset twice (clip04 0:01, 0:08), the mirror appearance and shatter (clip04 1:38, 2:22), the train (clip07 0:20), the lift twice (clip11 0:00, 0:30), the fortress (clip11 1:05). The other three sit inside an already scored passage. The score arrives on the reveal (clip04 0:15) or after the impact (clip09 1:37: the crash, then a low swell). **Agrees §9.1** (the fold "like a huge watch mechanism": grinding, metallic creaks). **Weak evidence:** the model misses music under loud effects (§13.1 item 4), and music is named on both sides of the fold onset ("a low, atmospheric musical hum" at clip04 0:00, "deep musical drones" at 0:06). Read it as "effects lead the onset", not as proof that no music plays.
- [OBSERVED-MACHINE] **Signature before score.** The snow world plays 16 s of effects only (wind, skis, snowmobile, gunfire) before the score joins at 0:16 (clip09). In clip07 the score enters only at 0:36, after the train.
- [OBSERVED-MACHINE] **Dialogue leaves the track under effects:** 3 % of effect segments are dialogue-led against 27 % of the rest (§13.2.2).
- [OBSERVED-MACHINE] **The rotating set has its own voice:** "a deep, resonating sound that matches the movement of the set" (clip08 0:18, 1:00, 1:18). **Rest after motion:** when the van stops (1:36), the score drops to one sustained low tone, then low pulses carry the exit (1:51–2:09).
- [OBSERVED-MACHINE] **A quiet beat before the cascade.** The vault scene holds longest (segments of 8, 7, 8 and 16 s) under soft score, with keypad beeps and a mechanical whirr as its effects (clip11 0:15–1:05). The intercut thins but does not stop: one 4-s excursion cuts away to the lift fall and the van in the water (0:30–0:34). **Agrees §7.1 and §8.**
- [OBSERVED-MACHINE] **Silence at thresholds:** the threat's first look (clip06 0:40, 0:47) and the border check, "minimal sound", with the officer in the foreground (clip12 0:25–0:31).
- [OBSERVED-MACHINE] **The wake is bridged.** One continuous drone runs across two wake close-ups on the plane (clip12 0:00–0:12). The return is then logged as ambience, "background music" and finally the object's sound alone (clip12 0:12–2:37). That **contradicts §8**, where Lehman places the last bare-piano passes on the reunion: a scored sequence under-reported as effects.
- [OBSERVED-MACHINE] **Each action shot owns a sound** in the campaign trailer: a train horn (WB 0:29), tyres (0:30), glass (0:31), the avalanche (1:04), a blast (1:13).
- [OBSERVED-MACHINE] **A possible pre-echo:** "a train passing" under the lift descent (clip06 0:14–0:21), about a minute before trains come up in the dialogue (1:13–1:24). It may only be lift machinery. *Not in this dossier*; weak.

**Editing and transitions (§10)**
- [OBSERVED-MACHINE] **World changes are physical or sonic, never optical.** Four devices appear:
  - a transit vehicle with its own sound (clip06 0:00–0:21);
  - a voice-over bridge into memory images (clip10 0:12–1:05);
  - a sustained cue across a wake cut (clip12 0:00–0:12);
  - a retroactive reveal by a question nobody can answer (clip03 1:15).

  **Agrees §3.3** (no dream code) and §10.2 (orientation devices).
- [OBSERVED-MACHINE] **Rhythm by function** (segment means, not ASL):
  - memory and confrontation 3.1–3.4 s (clip06, clip10);
  - pitch and teaching 6–7.5 s, inflated by merged segments (clip01, clip03, clip05);
  - the return 9.2 s, ending on a 17-s object hold, 1.84× the clip mean [DERIVED] (clip12 2:20–2:37).
- [OBSERVED-MACHINE] **World runs shrink toward an outer-world event:** 17 → 6 → 2–3 s (clip09 1:07–1:46). During the inner world's gravity event, that world takes the long runs (the hotel holds 80 % of clip08's middle third), and the cut returns to the outer world at each change of cause. **Agrees §7.4 and §10.2** (cross-cut parallel action; the slowest level as the spine).
- [OBSERVED-MACHINE] **Motif inserts mark obsession:** a safe dial (clip10 0:22, 1:03) and a spinning object (0:27, 0:29, 0:49, 0:57). That is six ECU inserts, 13 % of the clip's 45 segments; with its three other ECUs, clip10 has 9 ECUs (20 %), the highest ECU share in the batch; the cut returns to a motif six times in the first 65 s.
- [OBSERVED-MACHINE] **Trailer shape:** the middle third is the fastest (mean 1.64 s IMAX, 1.59 s WB); the last third slows into the title; 2 of the 3 cuts add a 5–6-s post-title tag. The IMAX cut is bookended on the spinning object (0:00, 1:30), and its only "quiet" audio is the second bookend.

### 13.4 Where the machine contradicts sourced facts (the sourced fact stands)

| Machine claim (where) | Sourced fact | Verdict |
|---|---|---|
| "zoom" (clip04 0:08, clip06 0:14, clip08 0:33, clip11 0:36) | no zoom reframes (§1.3, [dga]) | invented; read as camera travel or the set moving |
| "static" on handheld (47 dialogue segments; clip09 snow) | handheld backbone; "every shot moving" (§4) | vocabulary blind spot |
| the street "curves upward" (clip04 0:38) | "pivot, not bend" (§7.3) | misread |
| a mirror "pulled from thin air" (clip04 1:38) | a real hinged mirror door, shot handheld (§7.3) | the hinge's swing reads as an appearance |
| shadows "fall naturally" (clip04 0:23) | four added suns (§7.3) | right as perception, wrong as method |
| a car "falls rapidly down the center of the shaft" (clip11 0:30); the shaft "tilted" (IMAX 0:56) | shaft built horizontal; car fired along rails (§5.2, §7.3) | the intended illusion |
| café "explodes" (clip03 1:15; IMAX 0:32; WB 1:49) | compressed gas, light debris, no pyrotechnics (§7.3) | right content, wrong word |
| café "slow-motion, stylized" (clip03 1:30) | ramp starts in real time; uneven, unchoreographed paths (§7.3) | wrong intent |
| an inner level "in slow motion" (clip09 0:35) | inner levels play at real time (§7.4) | discarded |
| castle "chandeliers", "glass table" (clip01) | lanterns, minimal furniture (§5.2) | misread |
| the lead in suits (clip01; clip12 0:12) | separates, not suits (§6) | open; check stills |
| level 1 under a "clear, bright sky" (clip05) | rain, sun blocked (§5.2); the sun sometimes crept in (§2.2) | probably blown-out overcast |
| sea-edge city "futuristic" (IMAX 0:52, 1:21), sky "bright and clear" (IMAX 1:21) | glacial modernism; grey sea and sky, palette [UNVERIFIED] (§3.3, §5.2) | open until frames are measured |
| vault lit "low and dramatic" (IMAX 0:57) | space-lit, "neutral, sterile and shadowless", black walls (§2.2); WB 0:40 "cool and clinical" agrees | IMAX wrong: the darkness is the set (§2.1) |
| the frame story on a "train seat" (WB 1:46, 1:59) | a plane trip (§10.2); IMAX 1:20 says "airplane cabin" | WB wrong |
| the castle hall a "library or study" (WB 1:52) | the lantern hall (§5.2) | misread |
| an "oil rig or factory" blast (IMAX 0:50); a crash into an "office" (IMAX 1:17) | no such location (§5.2) | unidentified; do not build on either |
| an "orchestral" score with no piano (score uploads) | very electronic; piano opens and closes "Time" (§8) | coarse ear |
| a "faster tempo" (Dream Is Collapsing 1:15) | subdivisions of one tempo (§8) | cannot detect it |
| the reunion as ambience (clip12 1:34–2:37) | bare-piano passes on the reunion (§8) | music-blind |
| "injections closing in" (clip05) | *projections* | lossy transcript |

### 13.5 Open checks

- With the user's yes: re-run clip02, Mombasa and Dream Within a Dream, and extend Time past 3:15. For the form of the score, [lehman] pp. 27–30 stays a better source than any machine pass.
- Not covered by this batch: collapse staging (clip02 failed); it rests on §1–10 alone.
- Covered, but missed in the first pass: the projections' stare. [OBSERVED-MACHINE] Pedestrians turn their heads together to stare at the newcomer while the rest of the street walks on (clip04 0:57–1:38); after the mirrors shatter they "no longer" stare (2:26). *Not in this dossier's §1–10.*
- A line here is promoted to VERIFIED only when a sourced fact or a measured still from the user's own copy agrees (§11; 02 hard rule 1).

---

## 14. Sources

Access notes:
- These pages refused the fetch tool and are cited from search snippets only: IMDb, British Cinematographer, Fast Company, MTV, FilmL.A., the Weingartner CV, FirstShowing, Far Out, Variety (score and editor pieces) and the PopMatters review.
- `old.filmla.com` is outside this session's allowed network.
- The Kodak testimonial and the WB production notes on web.archive.org could not be fetched; their facts reach us only through Wikipedia's citations.
- The *Vanity Fair* 2011 Dyas piece is known only second-hand.

[asc]: https://theasc.com/article/inception-cinematography-pfister-nolan/
[asc2]: https://theasc.com/article/dream-thieves-wally-pfister-asc-and-christopher-nolan-on-inception/
[sow]: https://shotonwhat.com/inception-2010
[dga]: https://www.dga.org/craft/dgaq/issues/1202-spring-2012/dga-interview-christopher-nolan
[collider]: https://collider.com/director-christopher-nolan-and-producer-emma-thomas-interview-inception-they-talk-3d-what-kind-of-cameras-they-used-pre-viz-wb-and-a-lot-more/
[in70]: https://www.in70mm.com/presents/1963_blow_up/titel/i/inception/65mm/index.htm
[slash]: https://www.slashfilm.com/508296/christopher-nolan-filmed-some-of-inception-using-65mm-calls-3d-an-interesting-development/
[wiki]: https://en.wikipedia.org/wiki/Inception
[wikiacc]: https://en.wikipedia.org/wiki/List_of_accolades_received_by_Inception
[wikisnd]: https://en.wikipedia.org/wiki/Inception_(soundtrack)
[wikisong]: https://en.wikipedia.org/wiki/Non,_je_ne_regrette_rien
[wikidyas]: https://en.wikipedia.org/wiki/Guy_Hendrix_Dyas
[wikikurland]: https://en.wikipedia.org/wiki/Jeffrey_Kurland
[wikilee]: https://en.wikipedia.org/wiki/Lee_Smith_(film_editor)
[braam]: https://en.wikipedia.org/wiki/BRAAAM
[wesson]: https://en.wikipedia.org/wiki/Mel_Wesson
[afi]: https://catalog.afi.com/Catalog/moviedetails/66167/
[aovfx]: https://www.artofvfx.com/inception-paul-franklin-superviseur-vfx-double-negative/
[tmdb]: https://www.themoviedb.org/movie/27205-inception/cast
[pcn]: https://popculturenerd.com/2010/07/15/inceptions-inception-review-and-conversation-with-christopher-nolan-creative-team
[fastco]: https://www.fastcompany.com/1662823/exclusive-wally-pfister-inceptions-cinematographer-on-designing-dreamworlds
[filmla]: https://old.filmla.com/?p=4187
[weing]: https://www.findfilmwork.com/resumes/pdf_uploads/10268/1109Weingartner_agent.pdf
[imdbtech]: https://www.imdb.com/title/tt1375666/technical/
[idc]: https://www.indepthcine.com/videos/wally-pfister
[bc]: https://britishcinematographer.co.uk/wally-pfister-asc-inception/
[bafta]: https://static.bafta.org/files/svfx-statement-inception-767.pdf
[if]: https://if.com.au/inception-behind-the-oscar-short-listed-vfx/
[cgw]: https://www.cgw.com/Publications/CGW/2010/Volume-33-Issue-8-Aug-Sep-2010-/In-Your-Dreams.aspx
[fxg]: https://www.fxguide.com/fxfeatured/inception/
[inverse]: https://www.inverse.com/entertainment/behind-the-scenes-visual-effects-in-inception
[dneg]: https://www.dneg.com/news/celebrating-20-years-of-dneg-and-christopher-nolan
[vfxv-corb]: https://vfxvoice.com/engineering-movie-magic-with-chris-corbould/
[vfxv-ret]: https://vfxvoice.com/raising-the-bar-revisiting-terminator-2-judgment-day-inception-and-life-of-pi/
[syfy-fx]: https://www.syfy.com/syfy-wire/how-they-created-those-amazing-inception-special-effects
[syfy-rules]: https://www.syfy.com/index%2ephp/syfy-wire/christopher-nolan-explains-why-inception-dreams-are-not-fully-surreal
[globe]: https://www.theglobeandmail.com/arts/inceptions-brilliantly-played-mind-games/article4082538/
[postfx]: https://www.postmagazine.com/Press-Center/Daily-News/2011/Inception-VFX-created-by-Double-Negative.aspx
[studiobinder]: https://www.studiobinder.com/blog/inception-hallway-scene-making-of/
[nexttake]: https://www.thenexttake.com/2026/04/the-masterpiece-of-rotating-hallway-Inception.html
[thewrap-pd]: https://www.thewrap.com/art-inception-dreaming-big-24712/
[mande]: https://mande.net/btl/awards/contender-portfolios/contenders-art-direction-guy-hendrix-dyas-larry-dias-and-doug-mowat-inception
[fullwood1]: https://amandafullwoodma.wordpress.com/2014/06/28/case-study-2-production-design-post-production-and-vfx-in-inception-part-1/
[fullwood2]: https://amandafullwoodma.wordpress.com/2014/07/19/case-study-2-discussions-with-production-designer-guy-hendrix-dyas-2/
[scotch]: https://library.scotch.wa.edu.au/mediaproductionandanalysis/year12/inception/filmelements
[pcs]: https://thepopculturestudio.com/2016/07/31/five-minutes-with-guy-hendrix-dyas-part-2/
[arch]: https://architexturez.net/node/196060
[liftoff]: https://liftoff.network/brad-ricker-supervising-art-director-for-inception-spider-man-homecoming-and-more/
[movloc]: https://www.movie-locations.com/movies/i/Inception.php
[mf]: https://www.mentalfloss.com/entertainment/movies/22-things-you-might-not-know-about-inception
[artsill]: https://artsillustrated.in/cinema/in-built-dreams/
[screenrant]: https://screenrant.com/inception-movie-totems-meaning-explained/
[cof21]: https://clothesonfilm.net/2021/07/19/inception-revisited-with-costume-designer-jeffrey-kurland-clothes-on-film/
[cof13]: https://clothesonfilm.net/2013/05/11/inception-jeffrey-kurland-costume-qa/
[cof13b]: https://clothesonfilm.net/2013/05/11/inception-jeffrey-kurland-follow-up-costume-qa/
[gizmodo]: https://gizmodo.com/did-inceptions-costume-designer-just-give-away-the-secr-5602799
[ftwl]: https://fromtailorswithlove.co.uk/inception-even-your-subconscious-should-be-well-dressed-75
[flick-tenet]: https://www.flickeringmyth.com/2020/09/tenet-costume-designer-on-the-challenges-of-time-inversion-tailoring
[mix]: https://www.mixonline.com/sfp/christopher-nolans-inception-369267
[ds1]: https://designingsound.org/2010/08/18/inception-exclusive-interview-with-richard-king/
[ds2]: https://designingsound.org/2011/02/18/the-new-york-times-the-sound-of-inception/
[geek]: https://thegeektwins.com/2010/07/inception-sound-designer-richard-king.html
[pbs]: https://www.pbs.org/newshour/arts/the-sound-of-cinema
[buckeye]: https://thebuckeyeflame.com/2020/10/06/out-of-ohio-lora-hirschberg-oscar-winning-sound-mixer/
[ep]: https://www.ep.com/blog/meet-the-sound-mixer-lora-hirschberg/
[variety-score]: https://variety.com/2010/film/awards/zimmer-s-aural-dreamscape-for-inception-1118027209/
[20k]: https://www.20k.org/episodes/hans-zimmers-remote-control
[wrap-hz]: https://www.thewrap.com/hans-zimmer-grilled-inception-tragedy-and-batman-24829/
[popm]: https://www.popmatters.com/hans-zimmer-inception-interview
[ua]: https://www.uaudio.com/blogs/ua/hans-zimmer-ua-interview
[slash-hz]: https://www.slashfilm.com/510386/hans-zimmer-explains-the-intersection-between-edith-piaf-and-the-inception-score/
[filmdetail]: https://filmdetail.com/2010/09/11/the-sounds-of-inception/
[npr]: https://www.npr.org/sections/allsongs/2010/08/02/128932586/the-music-of-inception-exposed
[longreads]: https://longreads.com/2016/12/08/braaam-inception-hollywood-soundtracks/
[ilpost]: https://www.ilpost.it/2014/02/01/braaam-colonna-sonora-inception-hans-zimmer/
[lehman]: https://franklehman.com/wp-content/uploads/2021/01/2016-Manufacturing-the-Epic-Score-Music-Epic-Film-Routledge-1.pdf
[hewer]: https://tjhewer.substack.com/p/the-spellbinding-chord-progressions
[songbpm]: https://songbpm.com/@hans-zimmer/time-from-inception
[bpbs]: https://www.bigpicturebigsound.com/Inception-Blu-ray.shtml
[postnolan]: https://postmagazine.com/Publications/Post-Magazine/2010/August-1-2010/DIRECTORS-CHAIR-CHRISTOPHER-NOLAN-INCEPTION.aspx
[elwyn]: https://jonnyelwyn.co.uk/film-and-video-editing/editing-inception/
[gits]: https://gointothestory.blcklst.com/written-interview-christopher-nolan-b2b364b60f/
[movieweb]: https://movieweb.com/christopher-nolan-reveals-more-about-inception/
[bordwell]: https://www.davidbordwell.net/blog/2010/08/12/revisiting-inception/
[clipcafe1]: https://clip.cafe/inception-2010/and-when-you-enter-a-dream-within-that-dream-the-effect-is-compounded/
[clipcafe2]: https://clip.cafe/inception-2010/six-months-the-second-level-down-and-the-third-level-thats-10-years/
[wtop]: https://wtop.com/entertainment/2020/03/making-the-cut-with-the-editor-of-the-dark-knight-inception-dunkirk-and-1917/
[flickering-lee]: https://www.flickeringmyth.com/2011/01/cutting-edge-conversation-with-film-2/
[variety-lee]: https://variety.com/2010/film/news/inception-editor-nabs-dream-job-1118022323/
[popm-review]: https://www.popmatters.com/134539-inception-2496101738.html
