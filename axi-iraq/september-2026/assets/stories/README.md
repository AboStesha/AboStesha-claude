# «نبض السوق» — daily market pulse story (data-driven template)

**Format:** 1080×1920 (9:16), dark MARKET family (file 09 §4 template 1). The rendered PNG here is a **DEMO with sample numbers** (watermarked «عينة تصميم، لا تُنشر»). Production renders pass `demo=0`.

## Daily 10-minute protocol (file 08 §B is the law)
1. Verify the instrument's CURRENT price + previous close from two reputable sources. Compute change and % yourself. Never from memory. Unverifiable = don't publish the pulse frame.
2. Fill the URL parameters and render:
```
chromium --headless --no-sandbox --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1080,2007 --virtual-time-budget=4000 \
  --screenshot=pulse-YYYY-MM-DD.png \
  "file://<path>/pulse-template.html?demo=0&sym=XAUUSD&name=الذهب مقابل الدولار&price=X,XXX.XX&unit=USD&dir=up&pct=%2BX.XX%25&chg=%2BXX.XX&prev=X,XXX.XX&time=16:30&date=الاثنين · 1 أيلول 2026&src=[المصدر]&open=1&spark=20,35,28,48,42,60,55,72,66,80"
```
   Crop to 2160×3840 (87px chrome band ×2, same as carousels).
3. Params: `dir=up|down` flips the badge color/arrow · `open=0` shows السوق: مغلق (weekend frames use Friday close, labeled via `lbl=` e.g. `lbl=إغلاق الجمعة`) · `spark=` is a decorative 0–100 series, NOT real chart data (by design, no readable price axes).
4. The empty band between the sparkline and the data strip is the **sticker zone**: place the day's poll/quiz/emoji slider there in the IG composer (education frames only, never prediction prompts on data frames).
5. Kurdish account: duplicate template with translated static labels once, then same daily params with independently re-verified numbers.

**Rotation (file 08):** Mon XAUUSD · Tue EURUSD · Wed USD index or oil · Thu major-of-the-week · Fri weekly close frame.
**Blocked for production** until the approved Arabic risk text replaces `[RISK-AR]` in the disclaimer strip.
