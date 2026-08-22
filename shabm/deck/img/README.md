# Deck images

Drop the chosen renders in here and rebuild — `build_ar.py` finds them by
filename, base64-embeds them into `deck.html`, and swaps them in wherever the
deck currently shows a line drawing. Anything missing simply falls back to the
drawing, so a partial set is fine.

`.jpg`, `.png` or `.webp`. Keep each file under ~700 KB; the whole published
page has to stay under 16 MB. Resize to about 1800 px on the long edge first:

    cd shabm/deck/img && python3 -c "
    from PIL import Image; import glob, os
    for f in glob.glob('*.png') + glob.glob('*.jpg'):
        im = Image.open(f).convert('RGB'); im.thumbnail((1800, 1800))
        im.save(os.path.splitext(f)[0] + '.webp', quality=76, method=6)"

## Filenames the deck looks for

| Filename | Where it appears |
|---|---|
| `cube_day` | 05 · the Cube outside — hero |
| `cube_night` | 05 · the Cube outside — night |
| `cube_dawn` | 05 · meltwater at dawn |
| `cube_rear` | 05 · the bar wrapping the flanks |
| `face_detail` | 05 · the three openings, close |
| `order_screen` | 06 · ordering at the touchscreen |
| `hatch_collect` | 06 · collecting, unattended |
| `hatch_return` | 06 · returning a cup |
| `bar_seats` | 06 · the ice bar and stools |
| `interior` | 06 · inside the booth |
| `interior_menu` | 06 · the menu engraved in the wall |
| `barista` | 06 · the barista, in a winter coat, in August |
| `line` | 11 · the production line |
| `ice_room` | 11 · clear-ice production |
| `p_saqee80` `p_qalab` `p_boba` `p_lafaif` `p_jana` `p_radhadh` | 04 · one per product |
| `spread` | 04 · the whole menu, flat-lay |
| `brand_sheet` | 07 · the wordmark, four ways |
| `packaging` | 07 · the packaging family |
| `uniform` | 07 · uniform and collateral |
| `card` | 07 · business cards |
| `menu_card` | 07 · the menu slab |

Then: `python3 build_ar.py && python3 mkpreview.py`
