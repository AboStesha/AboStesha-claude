# AboStesha Film Pipeline — shared brief (read first)

Date: 2026-10-30. Owner: AboStesha (AI filmmaker, Arabic speaker).

## Goal (updated 2026-10-30)
Priority #1 is winning the **AI Film Award 2027** at the 1 Billion Followers Summit (Dubai) with one world-class, ultra-realistic, physically plausible AI short. Finish film 1 completely first; film 2 only if time remains. The Oscars are NOT a target for now. After 10 Jan 2027 (end of holdback) the film goes to other competitions/festivals and is pitched as **"Episode 0" of a 7-episode "Second Life" mini-series** to international production companies and platforms (the user owns the IP — Terms cl. 7.1; non-exclusive licence to the Organizer — cl. 8.2/8.3). Budget is open: always choose the highest-quality option, not the cheapest.

Content Standards (Terms cl. 5.3(f), 6.1(g), 9.1–9.3, 13.1(e)): rated G for all ages without parental guidance; no strong/offensive language, nudity or sexual content; violence or threatening/disturbing imagery only if mild; no depiction of drug, alcohol, tobacco or gambling use; nothing hateful/discriminatory (race, religion, nationality…); nothing promoting/glorifying self-harm or suicide; nothing disrespecting Islam, other religions or religious practices, or offending UAE public morality, national identity, rulers, government, institutions or symbols. The Organizer decides compliance at its sole discretion — when in doubt, cut.

## User decisions (locked)
- Chat with the user in **Arabic**; every generation prompt (image, video, music, SFX, TTS direction) in **English**.
- Skills live in the GitHub repo + packaged `.zip` for upload to claude.ai. Old film skills: merge the best parts, then the user deletes them.
- Old skills to replace: cinematic-pipeline, seedance-director, video-prompt-builder, midjourney-prompt-expert, nano-banana, suno-ai-mastery, higgsfield-generate, install-skill. Keep: seedance-2-5-prompts (current), watch (update to 0.3.x), skill-creator, find-skills, video-ad-editor.
- Images: the most accurate models regardless of cost (GPT Image 2.5 **sunburst** at max quality for hero sheets; Nano Banana Pro / 2.1 for edits & consistency) via the Higgsfield MCP; plus Midjourney V8.2 prompts the user runs manually.
- Blender: the user's friend (Blender expert) builds greybox blocking; Claude also drives Blender via MCP (Higgsfield Bridge bl_* tools or Blender MCP). Playblasts are motion/camera references for Seedance only — never in the final film.
- Video: Seedance 2.5 only for final picture. Generate in **draft mode first**, then turn approved drafts into the **1080p final** (the BytePlus "final from draft" generation). Route: BytePlus ModelArk API with the user's ByteDance key, or Higgsfield MCP (cost/quality comparison pending).
- Dialogue: the user generates voices manually with **ElevenLabs v4** from Claude's tagged lines; Seedance shots must lip-sync to those uploaded audio files; Seedance renders SFX only (no music).
- Music: the user buys the top Suno plan and an **ElevenLabs Enterprise** plan (confirmed 2026-10-30, so Eleven Music is cleared for film use under the Enterprise contract — still record the contract/plan in the ledger). The user will buy any credits or subscriptions needed. Claude writes score prompts for both.
- SFX: Claude analyses missing SFX, generates approved ones with code (procedural synthesis); ElevenLabs SFX v2 as fallback.
- Edit: the user cuts the film in Premiere Pro, then Claude does final touches (sound design, levels, cut notes) through the Higgsfield connector's Premiere tools (pr_*), fixing cuts only with permission.
- Step 8: a judge panel (Oscar voter, Hollywood critic, AI-film artist, 1 Billion Summit juror) critiques the final film.

## AI Film Award 2027 — verified rules (official page + Terms, 12 Oct 2026)
- Deadline **20 Nov 2026** (GST). Top 10 + public vote 15 Dec; Top 5 25 Dec; winner 10 Jan 2027 at the Summit (8–10 Jan). Prize USD 1,000,000.
- Partner BytePlus (Dreamina Seedance) + TikTok. **≥70% of the final film generated with Seedance as the primary video tool**; Terms cl. 5.4 say 70% of "visual and audio content" measured as the Organizer specifies (method unpublished — ask in writing). Other AI tools/editing only in support.
- Runtime **5–7 min** excluding opening titles and closing credits (keep total incl. titles/credits ≤ 7:00 to be safe). Mandatory official Summit intro placed before the film.
- One of 5 themes: Society, Community & Humanitarian · Truth, Fake News & Misinformation · Humans & AI · Climate, Nature & Our Changing Planet · Human Relationships. One original, complete story made for this award. Horizontal 16:9, ≥1080p, MP4/MOV, **English subtitles mandatory**, **rated G / suitable for all ages**.
- Scoring /100: AI Integration 30 · Storytelling 30 · Creativity & Aesthetic 20 · Technical Execution 20. Responsible/ethical AI is a pass/fail gate. Top 10 picked by an expert committee, then public vote.
- Disclosure: every AI tool + version + account + share of film; on request within 7 days: prompts, generation history, project files, shot logs (keep 24 months); source & licence of every non-AI element (music, SFX, voice, fonts, stock); each voice/face declared synthetic or real (+consent). Never remove AI watermarks/provenance/C2PA.
- Film must not be previously released or entered in any other competition; holdback — no public release, clips, or shortlist reveal until the winner announcement / non-finalist notice. Organizer gets a perpetual non-exclusive licence incl. festivals & streaming. Celebrity/brand use implying endorsement is prohibited.
- 2026 winner "Lily" (Tunisia): small human story of guilt/confession; jury praised that it used tools to serve a moving narrative, not to show off. All 2026 Top 5 were intimate, small-cast, emotional/moral arcs.

## Oscar facts (background only — not a current target)
- 99th closed. Target 100th (2028). Live Action needs practical photography → ineligible. Animated Short (≥75% animation, "human means", Animation Branch decides) is the only path and untested for photoreal AI → document human authorship at every step. Summit award is not Oscar-qualifying; route = win a qualifying festival award in 2027 (list: Clermont-Ferrand, Annecy, Palm Springs, Tampere, Cairo IFF, Beirut Shorts…; no UAE/Saudi festival). The Summit cut must be the final cut (re-edited versions of publicly shown shorts are excluded). Theatrical DCP needed later.

## Tool facts (Oct 2026)
- Seedance 2.5 = `dreamina-seedance-2-5-260628` on BytePlus ModelArk, up to 1080p (4K enterprise-only). Draft mode = `draft` flag; the final is a new 1080p generation from the draft task (detail may differ; billed separately). Draft task IDs expire after 14 days, output URLs after 24 h → download immediately. No seed. Real human faces in reference images are rejected unless they are same-account Seedance outputs or authorised assets → test on day 1. Third-party note (Magnific): Seedance audio references guide rhythm/mood/voice; the model composes its own soundtrack and does not paste or clone the audio — exact lip-sync to supplied ElevenLabs audio must be verified.
- GPT Image 2.5: `gpt-image-2.5-flare` (fast) / `gpt-image-2.5-sunburst` (highest precision). Nano Banana 2.1 = `gemini-nano-banana-2.1` (GA); Nano Banana Pro = `gemini-3-pro-image`; Nano Banana 2 deprecated. Midjourney V8.2 default (+ V8.2 Edit Model; Omni Reference is V7-only).
- ElevenLabs: TTS `eleven_v4`; Music v2.5 (`music_v2_5`, MCP `eleven_music_v2_5`); SFX v2; hosted MCP. Suno v6 family (v6 precise / v6-wild / v6-mini), Studio 2.0; v5/v5.5 being retired.
- Blender: official Blender Lab MCP (Blender 5.1+), community ahujasid MCP v2.1, Higgsfield Bridge (bl_* tools + bl_get_skill 'blender-scene'). Premiere: no official Adobe MCP; Higgsfield Bridge exposes pr_* when the Premiere panel is connected.
- In this Claude session the Higgsfield claude.ai connector currently exposes only game-publishing tools (no generate_*); the user must reconnect it. ElevenLabs connector also offers gpt-image-2.5-sunburst, gemini-nano-banana-2.1, gemini-3-pro-image and bytedance-seedance-v2.5.

## Research data
- Full raw research JSON: /tmp/claude-0/-home-user-AboStesha-claude/9f2b96f8-7817-5b10-b249-0720bc5d0d3c/scratchpad/research/raw-research.json (`result.categories[].research.key_craft_knowledge`, candidates, verify; `result.rules.verified`; `result.landscape.tools`; `result.audit.skills`; `result.critic.gaps`).
- Human summary: /home/user/AboStesha-claude/abostesha-film-pipeline/RESEARCH-2026-10-30.md
- Old skills (read-only): /root/.claude/skills/synced/1eacde9f-45d1-4992-a692-9137ffc3c4e1_1f1246b1-c8ef-43cf-b367-7bb14e03c7c7/<name>/

## Update 2026-11-01
- The Summit entry will be a **new idea and new script** (still for the AI Film Award 2027). "2nd Life: Ascent" (films/01-second-life-ascent/) is parked for the "Second Life" series; its script review stays as reference. The new film gets its own folder and PROJECT.md when the idea arrives.
- The user will share several complete Higgsfield projects (films with all prompts and assets) plus YouTube tutorials and their own character-sheet prompts. Study them (watch the films, read every prompt via the Higgsfield MCP project tools), extract the patterns, and propose edits to the pipeline (mainly 03 assets, 02 style, 05 Seedance) for approval before applying.
- Seedance 2.5 through Higgsfield (MCP or web, same account and project) is an accepted full route for the 70% (cl. 5.4); keep one route per character.

## Update 2026-11-01 (b) — locked
- **All generation runs in Higgsfield** (Seedance 2.5 via the Higgsfield MCP: draft 480p → same take finalized at 1080p; images GPT Image 2.5 Sunburst / Nano Banana Pro / 2.1 via Higgsfield). No BytePlus API, no Dreamina, no ElevenLabs-connector generation for picture.
- Storage: Higgsfield project (generation) → Google Drive master archive, mirrored to the user's PC with Google Drive for desktop in Mirror mode → GitHub (private) for text only. Claude organizes the folder tree (ledger L.0b).
- GitHub keeps `prompt-library/`: every approved prompt, instructive failure and external study, distilled into skill updates after approval (SKILL §7b).
