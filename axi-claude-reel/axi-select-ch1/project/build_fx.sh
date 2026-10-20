#!/bin/sh
# build comp/fx.js from comp/src/*.js in name order (production: skips the 39_kitdemo test group)
cd "$(dirname "$0")/.." || exit 1
cat $(ls comp/src/[0-9]*.js | grep -v 39_kitdemo) > comp/fx.js && node --check comp/fx.js && echo "built comp/fx.js ($(wc -c < comp/fx.js) bytes)"
