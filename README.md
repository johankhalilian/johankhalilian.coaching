# johankhalilian.com — build notes

Static site, same stack as ivanlizarde.com: deploy to Cloudflare Pages via GitHub.

## Structure
```
index.html          — the homepage
functions/journal.js — Cloudflare Pages Function, serves GET /journal (live Substack feed)
assets/johan-portrait.jpg — Jo's real headshot (used on homepage + all three landing pages)
robots.txt           — disallows /executive, /athlete, /founder from crawlers
_headers             — sends a real X-Robots-Tag: noindex header for those same three routes
executive/index.html — private landing page / one-sheet for executives
athlete/index.html   — private landing page / one-sheet for athletes
founder/index.html   — private landing page / one-sheet for founders
```

## The three private landing pages
Live at `johankhalilian.com/executive`, `/athlete`, `/founder`. These are the
reusable "one-sheets" — send the link instead of a PDF. Each page:
- Has its own tailored hero, intro, and three sell-focused sections, in language
  built for that audience (boardroom for executives, sports for athletes,
  startup/operator language for founders).
- Is intentionally **not** in the site nav or footer, and nothing on the public
  site links to them — the only way in is the direct URL.
- Sends `noindex, nofollow, noarchive` two ways: an HTML meta tag on the page
  itself, and a real HTTP header via `_headers` (works even for non-HTML
  crawlers, and is more reliable than the meta tag alone). `robots.txt` also
  disallows the three paths as a third layer.
- Submits inquiries to the same Formspree endpoint as the homepage, with a
  hidden `source` field so you can tell in your inbox which one-sheet a lead
  came from ("Executive Landing Page", etc.).

**Worth knowing:** none of this makes the URL secret from a person who has it —
noindex keeps it out of Google, but anyone with the link can open it. If you
ever want real access control (only specific people can open it), that's a
Cloudflare Access rule (email-gated), which is a five-minute follow-up if you
want it — just say the word.

To reuse this system for a new client type down the road, duplicate one of the
three folders, swap the copy, and it's live at whatever new slug you name it.

## Before launch
1. **Formspree** — done. Both the homepage and all three landing pages post to
   `https://formspree.io/f/maqgpvjn`.
2. **Jo's headshot** — done. Live in `/assets/johan-portrait.jpg`, used on the
   homepage About section and in the intro of all three landing pages.
3. **Remaining images** — every other duotone tile is still a placeholder
   marked `SWAP → filename.jpg`: hero, work-01…05 on the homepage, and the
   hero frame on each landing page (currently tinted per-audience: ink for
   executive, red for athlete, sky for founder).
4. **Substack subdomain** — `functions/journal.js` is set to
   `https://johanmartinezkhalilian.substack.com`. Confirm that still matches
   if anything changes.

## The live journal
`/journal` fetches Jo's Substack RSS server-side (no CORS issue) and returns the
three latest posts with title, date, link, and cover image. **This only runs on
Cloudflare** — opening `index.html` locally shows the fallback skeleton cards,
which is expected, not a bug.

## Palette
off-white `#F4EEE2` / off-black `#141310` / celeste `#5EC5EA` / red `#C33427`
(Puerto Rican freedom-flag palette; celeste used only as an accent, never a
load-bearing background, since it can't hold light text at contrast).
Type: Archivo (structure), Fraunces italic (accent), Space Mono (labels).
