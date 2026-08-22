#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Wrap the deck body into one complete, self-contained HTML file.

deck.html carries only the body content, because the Artifact host supplies
the document skeleton at publish time. This writes the same content as a
valid standalone document that opens from a hard disk, an email attachment
or a USB stick, with every image already inlined.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
body = open(os.path.join(HERE, "deck.html"), encoding="utf-8").read()

title = re.search(r"<title>(.*?)</title>", body)
title = title.group(1) if title else "شَبِم · SHBM"

doc = f"""<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<style>*{{margin:0;padding:0;box-sizing:border-box}}</style>
{body}
</body>
</html>
"""
out = os.path.join(HERE, "شبم-عرض-المستثمرين.html")
open(out, "w", encoding="utf-8").write(doc)
print(f"{out}  ({len(doc.encode('utf-8'))/1024/1024:.2f} MB)  title: {title}")
