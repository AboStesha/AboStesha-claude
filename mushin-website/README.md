# Mushin website

One-page marketing site for Mushin (reputation management & social intelligence), built from the company profile. Next.js 16 + Tailwind CSS 4.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Where things live

- `src/lib/content.ts` — all copy, client lists, offices and image URLs
- `src/app/page.tsx` — the page sections
- `src/components/` — header, logo, contact form, reveal animation

## Images

Photos are AI-generated and currently loaded from the Higgsfield CDN (allowed in `next.config.ts`). To self-host them, download each URL in `content.ts` into `public/images/` and change the paths to `/images/<name>.png`.

## Contact form

There's no backend yet: the form opens the visitor's email app with a prefilled message to hello@mushin.agency. Swap in a form service or API route when ready.
