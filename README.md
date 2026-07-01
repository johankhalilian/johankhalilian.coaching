# johankhalilian.com — build notes

Static site, same stack as ivanlizarde.com: deploy to Cloudflare Pages via GitHub.

## Structure
- `index.html` — the homepage
- `functions/journal.js` — Cloudflare Pages Function, serves `GET /journal`

## Before launch — three swaps
1. **Formspree.** In `index.html`, replace `YOUR_FORM_ID` in the form `action`
   with your real endpoint: `https://formspree.io/f/XXXXXXXX`.
2. **Images.** Every duotone tile is a placeholder marked `SWAP → filename.jpg`.
   Drop real frames into `/assets/` and swap the tile markup for `<img>`.
   Slots: hero, portrait, work-01…05.
3. **Substack subdomain.** `functions/journal.js` is set to
   `https://johanmartinezkhalilian.substack.com`. If the journal loads empty
   after a post is live, confirm that subdomain in the Substack address bar.

## The live journal
`/journal` fetches Jo's Substack RSS server-side (no CORS issue) and returns the
three latest posts with title, date, link, and cover image. The homepage renders
them on load. **This only runs on Cloudflare** — opening `index.html` locally shows
the fallback skeleton cards, which is expected, not a bug.

## Palette
off-white `#F3EDDF` / off-black `#161511` / blue `#1E3FD6` / red `#D62E1C`.
Type: Archivo (structure), Fraunces italic (accent), Space Mono (labels).
