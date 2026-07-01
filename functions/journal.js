// Cloudflare Pages Function  ->  serves GET /journal
// Pulls the latest posts from Jo's Substack RSS (server-side, so no CORS problem)
// and returns clean JSON — now including each post's cover image — for the
// Journal section on the homepage.
//
// A Substack RSS feed belongs to a PUBLICATION subdomain, not a profile handle.
// If the journal renders empty after a post is live, open the real Substack, copy
// the subdomain from the address bar (e.g. name.substack.com) and set it below.
const SUBSTACK = "https://johanmartinezkhalilian.substack.com";

const COUNT = 3; // recent posts to show

export async function onRequest() {
  if (!SUBSTACK) return json({ posts: [], publication: null });
  try {
    const feedUrl = SUBSTACK.replace(/\/+$/, "") + "/feed";
    const res = await fetch(feedUrl, { cf: { cacheTtl: 1800, cacheEverything: true } });
    if (!res.ok) throw new Error("feed " + res.status);
    const xml = await res.text();

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .slice(0, COUNT)
      .map((m) => {
        const block = m[1];
        const pick = (tag) => {
          const r = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
          return r ? clean(r[1]) : "";
        };
        const title = pick("title");
        const url = pick("link");
        let excerpt = pick("description").replace(/<[^>]+>/g, "").trim();
        if (excerpt.length > 150) excerpt = excerpt.slice(0, 147).trimEnd() + "…";

        // cover image: Substack items carry an <enclosure url="..." type="image/*">.
        // Fall back to the first <img> inside content:encoded if it's missing.
        let image = "";
        const enc = block.match(/<enclosure[^>]*url="([^"]+)"[^>]*>/i);
        if (enc) image = enc[1];
        if (!image) {
          const content = (block.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/) || [])[1] || "";
          const img = content.match(/<img[^>]*src="([^"]+)"/i);
          if (img) image = img[1];
        }

        return { title, url, date: fmtDate(pick("pubDate")), excerpt, image };
      });

    return json({ posts: items, publication: SUBSTACK });
  } catch (e) {
    return json({ posts: [], publication: SUBSTACK, error: String(e) });
  }
}

function clean(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .trim();
}
function fmtDate(s) {
  const d = new Date(s);
  return isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function json(obj) {
  return new Response(JSON.stringify(obj), {
    headers: { "content-type": "application/json", "cache-control": "max-age=900" },
  });
}
