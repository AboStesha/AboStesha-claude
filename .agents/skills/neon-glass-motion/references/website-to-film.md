# Website to film

When the user gives a URL ("Turn meridian.app into a 30 second launch film, 16:9"), the website is
the script. Read it, pull out what can be animated, then continue the normal workflow (beat sheet,
film.json, build, stills, render).

## Contents

1. Fetch the site
2. What to extract
3. Brand colours from the site
4. The logo
5. From extraction to beats
6. Worked example
7. When the site cannot be read
8. Rules

---

## 1. Fetch the site

Try in this order and stop when you have the text:
1. Your web-fetch tool, if you have one, on the URL (add `https://` if missing).
2. From the shell (keeps the raw HTML, which you need for colours and the logo):
   ```
   curl -sL -A "Mozilla/5.0" --max-time 20 https://meridian.app -o {work}/site.html
   ```
   or Python: `urllib.request.urlopen(Request(url, headers={"User-Agent": "Mozilla/5.0"}))`.
3. If the home page is thin, also read one or two of `/pricing`, `/features`, `/product`,
   `/integrations`, `/about` (only pages linked from the home page).

Read the visible text (headings, hero, feature blocks, pricing, testimonials with numbers) and the
`<head>` (title, meta description, `og:` tags, `theme-color`, icons, stylesheets).

## 2. What to extract

Write these down (for yourself) before designing:

| Item | Where it usually is | Becomes |
|---|---|---|
| Brand name, exact casing | logo alt, `<title>`, `og:site_name` | `brand.name` |
| Domain | the URL | `brand.url` (no `https://`, no `www.`) |
| The one-line promise | hero `<h1>`, `og:description` | opener (`title` or `type`) |
| What it does / how | hero subline, "How it works" | `device`, `rings`, `stack` |
| Concrete numbers | stats strips, case studies, pricing | `number` beats (copy exactly) |
| Integrations / platforms | logo walls, "Works with" | `orbit` items |
| Feature set | feature grid | `tiles` (icons + 1–2 word labels) or `stack` |
| Offer / CTA | hero button, pricing ("Free for...") | endcard `cta` |
| Audience | "for teams / for developers" | shapes wording and shot choice |
| Language | `<html lang>`, the copy | on-screen language (Arabic sites -> Arabic film) |

Marketing copy is adjective-heavy: apply `script-craft.md` (find the verbs, keep the numbers, cut
to five words).

## 3. Brand colours from the site

Look, in order of reliability:
1. `<meta name="theme-color" content="#...">`.
2. CSS custom properties in inline `<style>` or the main stylesheet: `--primary`, `--brand`,
   `--accent`, `--color-primary`, Tailwind config colours.
3. The primary button / CTA background colour and link colour.
4. Fills in the logo SVG.

Take the most saturated, recurring non-neutral colour as `brand.color`; a clearly distinct second
one as `brand.accent`. Convert `rgb()`/`hsl()` to hex. Ignore greys, near-black and white (they
cannot glow; the palette ignores them). If the brand is monochrome, leave `brand.color` out and
say the film uses the neon spectrum with their wordmark. Always name the hex you used in the
beat-sheet reply so the user can correct it.

Quick extraction from the saved HTML:
```
grep -oiE '(theme-color"[^>]*content="#[0-9a-f]{3,6}|--(primary|brand|accent)[a-z-]*:\s*#[0-9a-f]{3,6}|#[0-9a-f]{6}\b)' {work}/site.html | sort | uniq -c | sort -rn | head -20
```
Colours that live only in external stylesheets need those files fetched too (follow the first
`<link rel="stylesheet">`).

## 4. The logo

Candidates, best first: an inline `<svg>` in the header; `<img>` in the header whose src/alt
contains "logo"; `<link rel="icon" type="image/svg+xml">`; `apple-touch-icon` (PNG, often on a solid
background: acceptable only if it looks right on black); `og:image` (usually a banner: do not use).

- Save it into `{work}` (e.g. `{work}/logo.svg`) and set `brand.logo: "logo.svg"`.
- It is drawn as-is on pure black. A dark logo (black/navy wordmark) will vanish: use a light
  variant if the site has one (often in the footer or a dark-mode `<picture>` source), or copy the
  SVG and set its fills to `#FFFFFF`, or skip the logo and let the wordmark carry the endcard.
- Check it in the endcard still. If it looks wrong, drop it rather than ship a bad lockup.
- Only use the logo of the brand the user asked about, for the user's own promo.

## 5. From extraction to beats

Pick 4–7 beats (see `script-craft.md`): the promise first, how it works, the proof (numbers), where
it works, the offer last. A typical site maps like this:

| Site section | Beat |
|---|---|
| Hero headline | 1 · `title` (or `type` bar if the product is search/AI/chat) |
| "How it works" step 1–2 | 2 · `device` with the matching `ui` |
| Key mechanism / the magic moment | 3 · `rings` |
| Stats strip | 4 · `number` (hero, flash) |
| Integrations logo wall | 5 · `orbit` |
| Pricing headline / hero CTA | 6 · `endcard` |

## 6. Worked example

"Turn meridian.app into a 30 second launch film, 16:9." Suppose the site says: hero "Meeting times
nobody hates"; subline "Meridian reads every calendar on your team and picks the slot that costs the
least"; stats "Teams cut 40% of their meetings"; logo wall Google Calendar, Outlook; pricing "Free
for teams under ten"; theme-color `#6633EE`.

| # | Time | Shot | On screen |
|---|---|---|---|
| 1 | 0.0–4.2 s | title | Meeting times nobody hates. / Meet Meridian |
| 2 | 4.2–8.2 s | type (glass bar) | When is everyone free? |
| 3 | 8.2–12.8 s | device · window · calendar | Reads every team calendar |
| 4 | 12.8–16.8 s | rings · clock | Picks the cheapest slot |
| 5 | 16.8–20.6 s | number (hero, flash) | 40% — fewer meetings |
| 6 | 20.6–25.0 s | orbit | Google · Outlook — Works with your calendars |
| 7 | 25.0–30.0 s | endcard | Meridian — Free under ten people — meridian.app |

Palette line for the reply: "Cyan to magenta, with Meridian purple #6633EE (from your site) on the
40% beat and the end card." This is `examples/meridian-16x9.film.json`.

## 7. When the site cannot be read

- JavaScript-only page (fetch returns an empty shell): try the `og:`/meta tags, `/pricing`, or a
  `sitemap.xml` page with server-rendered text; if still empty, ask the user to paste the hero text
  and 3–4 key points (or a screenshot of the page).
- Blocked, offline sandbox, login wall, 403: tell the user you could not read it and ask them to
  paste the copy. Do not design from the domain name alone.
- The URL is an app store listing or social profile: the description text works as the script;
  there are usually no brand colours, so ask for hex codes or use the spectrum.

## 8. Rules

- Every claim and number on screen must come from the site (or the user). Never invent stats,
  customer names, awards or prices.
- Integration and partner names only if the site lists them.
- Keep the brand name exactly as written on the site.
- Quote nothing longer than five words from the site; you are cutting, not copying pages.
- If the site offers several products, ask which one (or choose the flagship and say so).
