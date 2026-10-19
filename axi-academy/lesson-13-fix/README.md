# Lesson 13: gold example fix ($100 → $200)

The lesson 13 gold example (2 lots, a $1 move) showed a profit of «100$». The right figure is $200. This folder holds the corrected 6.67 s shot.

- `Lesson13_GoldExample_200usd.mp4`: the corrected shot. It has the same length (160 frames), frame rate (23.976 fps) and audio as the original. Only the «1» was changed to a «2».

## How it was made

- **Frames 65–75 (entrance):** the new glyph group was composited with the same scale animation as the original.
- **Frames 76–154 (hold):** the «1» was removed against a clean background and a «2» was placed in its spot. The «2» was cut from the «200» on the same frame, so the font, colour and anti-aliasing match.
- **Frames 155–160 (exit):** the original moves up, blurs and fades out. For each frame, `tools/pfit.py` and `tools/lfit.py` fit a shift, a Gaussian blur and a gain locally on the «1». The same transform was then applied to the edit (−«1», +«2»), so the new digit exits exactly like the rest of the number.
