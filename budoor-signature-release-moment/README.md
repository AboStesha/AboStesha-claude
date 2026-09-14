# Budoor Signature — The Release Moment

Creative proposal for the main-stage LED wall at the Budoor Signature launch (28 Aug 2026):
three stage-and-screen illusion concepts (The Golden Stroke, Let It Grow, Symphony of a Raw Space),
a sync playbook, comparison, recommendation and production plan.

- Final PDF (17 pages, 1920×1080): https://d2ol7oe51mr4n9.cloudfront.net/user_31whQkWWK9m41YEVOr0IugdLlfs/aff0b6e3-021c-477f-9239-cf8c5a1c0c88.pdf
- Source: `index.html` (self-contained deck, Google Fonts: Inter / Cormorant Garamond / Michroma)
- Concept frames were generated with Higgsfield (GPT Image 2.5) using the event-kit stage render as reference;
  they are expected at `img/gen_0.jpg … gen_14.jpg` (not committed).

## Rebuild

```bash
# place gen_0..gen_14.jpg in img/, then:
NODE_PATH=$(npm root -g) node build.js index.html Budoor_Signature_Release_Moment.pdf shots
# or with Python Playwright:
python3 build.py index.html Budoor_Signature_Release_Moment.pdf
```
