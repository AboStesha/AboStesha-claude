# Wraps the artifact body in the <!doctype>/<head> skeleton the Artifact host
# supplies at publish time, so the same file can be screenshotted locally.
import os
HERE = os.path.dirname(os.path.abspath(__file__))
body = open(os.path.join(HERE, "deck.html"), encoding="utf-8").read()
head, sep, rest = body.partition("</head>") if "</head>" in body else ("", "", body)
open(os.path.join(HERE, "preview.html"), "w", encoding="utf-8").write(
    '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">'
    '<style>*{margin:0;padding:0;box-sizing:border-box}</style>\n' + body +
    "\n</body></html>")
print("preview.html rebuilt")
