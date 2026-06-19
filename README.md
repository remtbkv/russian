# Русский — practice app

A minimal, single-user Russian practice tool. Client-side only (no backend, no API keys);
progress lives in `localStorage`.

## Run

```bash
npm install
npm run dev      # http://localhost:3010  (or the `rs` shell alias)
npm run build    # type-checks + builds to dist/
npm run preview  # serve the production build
```

## Deploy (Vercel)

Vercel auto-detects Vite. Either `vercel` from this folder, or import the repo in the
dashboard. Build command `vite build`, output `dist/`. `vercel.json` adds SPA rewrites.

## Modules

- **Type** — ЙЦУКЕН keyboard trainer. On-screen keyboard highlights the next key; tracks
  WPM/accuracy. Two input modes: *positional* (reads physical key position via `event.code`,
  works with any OS layout) and *native* (reads the character your OS sends — use once you've
  installed the system Russian keyboard).
- **Read** — paste any Russian text, click a word for its Wiktionary definition, add words to Vocab.
- **Watch** — embed a YouTube link with captions on (Russian preferred). Nothing downloaded.
- **Write** — prompts + autosaved editor; "Export for grading" copies a formatted request to paste
  into Claude.
- **Vocab** — Leitner spaced repetition. Starter deck (common + transition words) + import box.
- **Sounds** — ш vs щ contrast notes + minimal pairs linking native Forvo audio.

## Editing content

All built-in content is in `src/lib/content.ts` (typing lessons, writing prompts, minimal
pairs, starter vocab). Drop the Harvard class vocab/transition words here, or import them at
runtime via Vocab -> Import.

## Future: in-app grading

Currently grading is export-to-paste (keyless). To add instant in-app grading, add a Vercel
serverless function in `/api` that holds an Anthropic API key server-side and call it from Write.
The key must never ship to the browser.
