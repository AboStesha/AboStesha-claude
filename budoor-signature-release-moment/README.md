# Budoor Signature — The Release Moment

Creative proposal for the main-stage LED wall at the Budoor Signature launch (28 Aug 2026):
three stage-and-screen illusion concepts (The Golden Stroke, Let It Grow, Symphony of a Raw Space),
a sync playbook, comparison, recommendation and production plan.

- Final PDF v3 (17 pages, 1920×1080): https://d2ol7oe51mr4n9.cloudfront.net/user_31whQkWWK9m41YEVOr0IugdLlfs/bef6afb5-3712-4dee-8f47-33045c8bb328.pdf
- Arabic edition (same 17 pages, RTL, built from `index_ar.html`): https://d2ol7oe51mr4n9.cloudfront.net/user_31whQkWWK9m41YEVOr0IugdLlfs/04e23a23-5d90-4dc6-8069-f3fafee983f0.pdf
- Single-show storyboard deck v2, Arabic (21 pages, wall content matched to the project renders in img/aerial.jpg, villa.jpg, entrance.jpg, one 3:45 show combining the three ideas, magician script AR/EN, cue sheet; built from `index_show_ar.html` via `assemble_show.py`, images `img/show_0..17.jpg`): https://d2ol7oe51mr4n9.cloudfront.net/user_31whQkWWK9m41YEVOr0IugdLlfs/125008a9-3b9a-4611-b2a9-73ac1d7d338e.pdf
- Source: `index.html` (self-contained deck, Google Fonts: Inter / Cormorant Garamond / Michroma)
- Concept frames were generated with Higgsfield (GPT Image 2.5) using the event-kit stage render as reference;
  they are expected at `img/gen_0.jpg … gen_30.jpg` (not committed; indices 4–5, 7–9 and 14–20 are unused).

## Rebuild

```bash
# place gen_0..gen_14.jpg in img/, then:
NODE_PATH=$(npm root -g) node build.js index.html Budoor_Signature_Release_Moment.pdf shots
# or with Python Playwright:
python3 build.py index.html Budoor_Signature_Release_Moment.pdf
```
