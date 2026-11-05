#!/bin/sh
# Rebuild the claude.ai skill zip. Copies the prompt-library templates and style references
# into the skill (references/library/) so the skill works without the repo, then zips it.
set -e
cd "$(dirname "$0")/.."
LIB=skill/abostesha-film-pipeline/references/library
rm -rf "$LIB" && mkdir -p "$LIB/style-references"
cp prompt-library/*.md "$LIB/"
for d in prompt-library/style-references/*/; do
  n=$(basename "$d"); mkdir -p "$LIB/style-references/$n"
  cp "$d"ADAPTATION.md "$LIB/style-references/$n/" 2>/dev/null || true
  cp "$d"SUMMARY-AR.md "$LIB/style-references/$n/" 2>/dev/null || true
done
find skill -name __pycache__ -prune -exec rm -rf {} +
rm -f dist/abostesha-film-pipeline.zip
(cd skill && zip -qr ../dist/abostesha-film-pipeline.zip abostesha-film-pipeline -x '*/__pycache__/*' '*.pyc' '*.DS_Store')
H=$(sha256sum dist/abostesha-film-pipeline.zip | cut -d' ' -f1); S=$(stat -c %s dist/abostesha-film-pipeline.zip)
python3 - "$H" "$S" <<'PY'
import sys,re
h,s=sys.argv[1],int(sys.argv[2]);p='dist/MANIFEST.md';t=open(p).read()
t=re.sub(r'(\| `abostesha-film-pipeline.zip` \|[^\n]*?\| )[\d,]+ B \| `[0-9a-f]{64}`',lambda m:m.group(1)+'{:,} B | `{}`'.format(s,h),t)
open(p,'w').write(t)
PY
echo "built dist/abostesha-film-pipeline.zip ($S bytes, sha256 $H)"
