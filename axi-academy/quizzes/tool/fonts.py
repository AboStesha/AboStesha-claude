# Make static font files from the variable Readex Pro and Inter, so the PDF embeds real TrueType fonts
# (Chromium turns variable fonts into heavy Type 3 fonts in a PDF).
# python3 tool/fonts.py <dir with ReadexPro.ttf and Inter.ttf>     (needs fontTools)
import os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

d = sys.argv[1]
for name, pins, weights in [('ReadexPro', {'HEXP': 0}, (400, 500, 600, 700)), ('Inter', {'opsz': 14}, (200, 300, 400, 500, 600, 700))]:
    for w in weights:
        out = os.path.join(d, f'{name}-{w}.ttf')
        font = instantiateVariableFont(TTFont(os.path.join(d, f'{name}.ttf')), {**pins, 'wght': w}, updateFontNames=True)
        font.save(out)
        print('wrote', out)
