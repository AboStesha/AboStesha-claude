# Prompt library — AboStesha Film Pipeline

Text only (private repo). Every approved generation, every instructive failure and every external study lands here, so each film starts from what already worked.

## Files
- `characters.md` · `locations.md` · `props.md` · `style.md`
- `seedance-dialogue.md` · `seedance-action.md` · `seedance-establishing.md` · `seedance-dream.md` (add a new `seedance-<type>.md` when a new shot type appears)
- `music.md` · `sfx.md`
- `studies/<YYYY-MM-DD>_<source>.md` — analyses of Higgsfield projects, AI films and tutorials the user shares
- `LESSONS.md` — rules proposed from the entries; applied to the skill only after approval

## Entry template
```markdown
### <film code> · <asset or shot ID> · <date>
- Model / route: <e.g. seedance_2_5 via Higgsfield MCP, draft → 1080p, bitrate high> · job: <Higgsfield job ID>
- Settings: <duration, aspect ratio, resolution, mode, generate_audio …>
- References: <@Image1 = CHR_X approved v03 (identity) · @Video1 = PB playblast (motion) · @Audio1 = DX take (voice/lip-sync) …>
- Prompt:
  ```text
  <exact prompt, unedited>
  ```
- Verdict: approved | rejected — "<the user's words>"
- Why it worked / failed: <specific: camera language, physics phrasing, reference roles, length, what was removed>
- Tried before this: <v/t numbers and the one change each time>
```

## Study template
```markdown
# Study: <title> (<link>) — <date>
- Source type: Higgsfield project | finished film | tutorial
- What it achieves: <realism, consistency, camera, acting …>
- Method step by step: <…>
- Prompt structure: <order of blocks, length, wording patterns, reference roles>
- Asset method (characters / locations / props sheets): <…>
- Adopt: <concrete rules for our modules>
- Do not copy: <characters, designs, text — method only>
- Proposed skill changes: <module + change> → copy to LESSONS.md as "proposed"
```
