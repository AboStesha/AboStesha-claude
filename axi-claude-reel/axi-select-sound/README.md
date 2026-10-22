# Axi Select: sound for videos 1 and 2

This folder holds the code for the series' score, sound effects and final mix. The music is original, written in code,
using no AI music service.

| Folder | What it does |
|---|---|
| `music/` | `compose.py` (run `python3 -I compose.py ep2` or `ep1`) writes the score stems. The music's own drop and hit points are in `markers_ep*.json`, and `LICENSES.txt` lists the sources: VSCO-2 CE samples, CC0. |
| `sfx/` | `gen_palette.py` synthesises the 50 effect sounds. `cues_ep2.py` and `cues_ep1.py` build the cue sheets (`cues_ep*.json`), and `render_bed.py` renders them. |
| `voice/` | Video 2's voice: cleaning your enhanced recording (`final/`) and moving it back onto the lips (`sync/`). `make_dry.py` is the echo canceller. |
| `mix/` | `mix.py ep2` or `mix.py ep1` builds the final mix: voice, music at one gain with a light dip under speech, the SFX, then −14 LUFS with a true-peak limit. It then muxes the mix into the subtitled render. `report_ep*.json` holds the measurements. |
