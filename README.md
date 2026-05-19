# MCAT Study

A small browser app for active MCAT studying: ingest chapter PDFs, generate quiz questions with Gemini, track performance over time.

## How it works
- **Library tab** — drag chapter PDFs in. The app uploads each to the Gemini Files API, extracts summary sentences / examples / key terms, and pre-generates a question bank (multiple choice + short answer). Everything is cached in `localStorage` so PDFs don't re-upload.
- **Study tab** — quiz from the cached bank in three modes: MC, short answer, matching (term ↔ definition). Tracks correct/incorrect per question and supports "Drill my misses".

## Two ways to use it

### 1. With your own Gemini API key (full features)
1. Get a free key at <https://aistudio.google.com/apikey>.
2. Open the site, paste the key (stays in your browser's `localStorage`).
3. Drop PDFs in the Library tab → click **Process**.

### 2. Read-only via a shared bank (no key needed)
If a `data.json` is present next to `index.html`, the key gate offers a **"Use shared bank"** button. The app loads the pre-generated questions and runs entirely offline — no API calls, no key. Useful for phones / friends.

To produce `data.json`: in mode (1), click **Export bank** in the Library tab, then commit the file next to `index.html`.

## Running locally
```bash
node serve.js
# open http://localhost:8765/
```
The local server is needed because browsers block loading sibling `.js` files from `file://` origins.

## Stack
- Single-file React via CDN (no build step)
- Tailwind CDN
- Babel standalone for in-browser JSX
- Gemini API called directly from the browser

## Files
- `index.html` — entry point
- `app.js` — the entire app
- `serve.js` — tiny static server for local dev
- `data.json` *(optional)* — exported question bank for read-only public hosting
