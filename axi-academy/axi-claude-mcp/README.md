# Axi Iraq × Claude — launch ad (15 s) and how-to explainer (60 s)

Two vertical videos for the Axi update that connects Claude to an Axi MT5 account through MCP: 1080×1920 at 60 fps, in Arabic (simplified MSA; Claude, MT5, MCP and the button names stay in Latin, as on screen).

- **Sound:** music and sound effects only. The client records the voice-over from `VO_SCRIPT.md`; the music already dips in those voice windows.
- **Logo:** the official Axi Iraq logo (axi / العراق), never the X on its own.

| File | Length | What it does |
|---|---|---|
| `AxiIraq_Claude_Launch_15s.mp4` | 15 s · 900 frames | **The announcement.** «اسأل… وحسابك يجيب.»: a chat asks «كم رصيد حسابي؟» and the balance counts up. «جديد من آكسي»: the Axi Iraq logo builds and links to Claude through MCP. Three quick asks: live prices, open positions, and a stop-loss change marked «بانتظار موافقتك» (awaiting your approval). «لا تُنفَّذ أي صفقة بدون موافقتك»: the approval prompt and the tap on «Allow once». CTA: logo, «اربط حسابك الآن», `mcp.axi.com`, «لحسابات MT5 · إصدار تجريبي (Alpha)» and the risk strip. |
| `AxiIraq_Claude_HowTo_60s.mp4` | 60 s · 3600 frames | **The how-to**, following Axi's own six steps on stylised screens. Hook («حسابك في آكسي الآن داخل Claude»), title («6 خطوات · أقل من دقيقة»), what MCP links and what Claude can do, what you need. Then 01 open `claude.ai/customize/connectors` · 02 Add → Add custom connector · 03 Name: Axi · 04 URL: `https://mcp.axi.com/mcp` · 05 Add, then Connect with the default options · 06 log in to Axi and approve → «تم الربط بنجاح». A live try (balance, then a stop-loss change that runs only after «Allow once»), «أنت المتحكم دائمًا», and the CTA with the risk strip. |

`stills/preview.jpg` shows key frames from both.

## Facts used, and where they come from

| On screen | Source |
|---|---|
| Six steps, connector URL `https://mcp.axi.com/mcp`, MT5 accounts only | Axi's setup guide at [mcp.axi.com](https://mcp.axi.com/) |
| What Claude can do: prices and market data, account details, positions, orders, stop loss / take profit, trade history | [Axi MCP page](https://www.axi.group/en-my/trading-platforms/mcp), [press release](https://www.globenewswire.com/news-release/2026/10/15/3381607/0/en/axi-launches-mcp-integration-connecting-mt5-accounts-to-claude.html) |
| By default every trade action asks for the client's approval in the chat; the Axi login is not shared with Claude; the link can be disconnected | [Axi help: What is the Axi MCP connection?](https://help.axi.com/en-US/axiv2--axicorp-prod/article/wMk5JUua-what-is-the-axi-mcp-connection), [Axi help: permissions and disconnecting](https://help.axi.com/en-US/axiv2--axicorp-prod/article/o_nIgjPF-how-do-i-manage-permissions-disconnect-reconnect-or-fix-axi-mcp-connection) |
| Alpha release; MT4-only and Axi-platform accounts excluded | [Finance Magnates](https://www.financemagnates.com/forex/brokers/axi-clients-can-now-ask-claude-to-place-trades-in-their-metatrader-accounts/), press release |
| «Add custom connector» in Claude | [Claude help: custom connectors](https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp) |

These pages were read through search results; the build environment could not open `mcp.axi.com` or the YouTube video directly. Sources disagree on which Claude plans include custom connectors, so the videos name no plan.

## Content and compliance

- **Screens are stylised.** The Claude and Axi screens are generic mock-ups, not copies of either product. Their labels follow the steps (Connectors, Add, Add custom connector, Name, Remote MCP server URL, Connect, Log in, Approve, Allow once / Deny), plus generic words such as Cancel, Email and Password.
- **Claude is named as text only.** Claude is Anthropic's product; no Anthropic or Claude logo is used.
- **Approval.** Claude asks before every trade or order action by default. A client can choose «Always allow» for an action, which is still their own approval, so «لا تُنفَّذ أي صفقة بدون موافقتك» holds.
- **Numbers are illustrative.** Balances, prices and positions are examples; the 15 s ad says «أرقام توضيحية» on screen. No profit claims.
- **Brand rules** from `../BRAND.md`:
  - Red is limited to one headline word per scene, the accent bars, losses, the button on the Axi sign-in mock-up and the CTA pill.
  - Mint appears only on gains: the rising price and the positive P/L. Connection lines, checks and the MCP badge are white.
  - Gradients are vertical only: dark for the story, the primary gradient for the CTA.
  - Numbers and Latin use Inter; Arabic uses Readex Pro.
  - The white Axi Iraq watermark sits bottom-left at 60%.
  - Text stays out of the top 10% and bottom 15%.
  - The risk strip shows for the last 3 seconds.

## Audio

Synthesised in `audio/score.py` on a 128 BPM grid (no third-party licences). Every on-screen action has its sound: typing, clicks, the paste, the dialog, the connection chime and the approval.

| Video | Soundtrack |
|---|---|
| 15 s | A quiet arp under the hook, an impact as Axi and Claude connect, a bright groove through the asks, a held breath, then a click and chime on the approval and a big chord on the CTA. |
| 60 s | The same palette, calmer. The groove builds through the six steps, lands on a chime and sub hit when the account connects, and resolves on the CTA. |

In the voice windows the music is lowered by 5 dB and dipped between 1 and 3 kHz. Each bed is band-limited to 17 kHz and mastered to −17 LUFS with a true peak at or below −1.3 dBTP. The beds are also delivered as `audio/bed_ad15.wav` and `audio/bed_exp60.wav`.

## QA

Both files are 1080×1920 at 60 fps, CFR. Video is H.264 High, yuv420p, BT.709, CRF 16. Audio is AAC, 48 kHz stereo, 320 kb/s.

| File | Size | Frames | Loudness | True peak |
|---|---|---|---|---|
| `AxiIraq_Claude_Launch_15s.mp4` | 10.2 MB | 900 | −17.2 LUFS | −1.6 dBTP |
| `AxiIraq_Claude_HowTo_60s.mp4` | 30.6 MB | 3600 | −17.1 LUFS | −1.6 dBTP |

- **Every frame** is on per-second sheets in `qa/` (`*_s0.jpg` …), with `*_qa.json` and the last frames.
- **First renders, viewed in full.** Every frame of the first 15 s render and every other frame of the first 60 s render were viewed. Fixes from that pass:
  - The order card showed "done" before approval; it now shows «بانتظار موافقتك».
  - Mint was used outside gains; it is now white.
  - Two screen switches were hard cuts; they now fade.
  - The cursor drifted slowly between targets; it now rests, then moves.
  - The «ستحتاج إلى» and «أنت المتحكم» scenes were centred.
- **Final renders, checked by diff.** They were compared frame by frame with the earlier renders, and the seconds that changed were viewed again. In the second 60 s render, the URL pill vanished in one frame at 34.4 s; it now fades.
- **Pops.** A one-frame jump detector finds only the intended URL paste at 30.5 s.
- **Mix.** The mix is band-limited below the AAC encoder's cutoff, so the encode stays under −1 dBTP.
- **Not listened to.** The audio was measured only.

## Files

| Path | Contents |
|---|---|
| `src/kit.js` | Type (Readex Pro for Arabic, Inter for Latin and numbers), mixed RTL/Latin lines, the Axi Iraq logo as vectors with a letter-by-letter reveal, watermark, CTA pill, risk strip, backgrounds and grain. |
| `src/ui.js` | The stylised screens: windows, fields, buttons, cursor, chat bubbles, cards, the approval prompt, and the Connectors page, Add dialog and Axi login. |
| `src/ad15.js`, `src/exp60.js` | The two films, `draw(ctx, t)`, timed on the beat grid. |
| `src/index.html` | Renders a film. Use `?film=ad15&play` to preview, or `?t=` for a single frame. |
| `assets/logo.js`, `assets/fonts/` | The traced Axi Iraq logo (from `../axi-iraq-ident/`) and the fonts. |
| `tools/render.mjs` | Renders the frames and encodes them: `node tools/render.mjs --film exp60 --frames 3600 --audio audio/bed_exp60.wav --out out.mp4 --crf 16` |
| `tools/still.mjs`, `tools/sheet.py`, `tools/qa.py` | Stills, contact sheets, and QA (streams, loudness, every frame on per-second sheets in `qa/`). |
| `audio/score.py`, `audio/synthkit.py` | Music and sound design, with the voice windows: `python score.py ad15|exp60 out.wav` |
| `VO_SCRIPT.md` | The voice-over for both videos, with timecodes, pronunciation and what is on screen at each moment. |
