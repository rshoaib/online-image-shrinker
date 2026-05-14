# onlineimageshrinker.com — daily content routine

## Mission

Land **one** meaningful change per run on the production branch. The site has ~80 published posts and is actively maintained — Lane A and Lane B will dominate; Lane C only when neither has work.

## Pre-flight

1. Read `.agents/context/site-context.md` for brand voice + tool URL map.
2. Read `.agents/context/target-keywords.md` for keyword backlog.
3. **Branch: `master`. Posts live at `src/content/blog/*.md`** — plain markdown with YAML frontmatter. **NOT** `app/blog/` (that contains only the Next.js dynamic route handler `[slug]/page.jsx` — it imports from `../../../src/lib/supabaseServer` which is dead legacy code; production reads markdown files directly).
4. Before any write, inspect 2–3 existing files under `src/content/blog/` to learn frontmatter shape exactly. Today's frontmatter contract:
   - `id`: integer, monotonic, next is **7057** (max observed is 7056 from 2026-05-14)
   - `slug`: kebab-case, must match the filename without `.md` extension
   - `title`, `excerpt`, `category`, `date` (YYYY-MM-DD), `display_date` (e.g. "May 14, 2026"), `read_time` (e.g. "9 min read")
   - `image`: external URL — use Unsplash (`https://images.unsplash.com/...`), NOT a local PNG path
   - `tags`: array of strings
   - `meta_title`, `meta_description`: for SEO
   - `created_at`, `updated_at`: ISO 8601 with timezone

## Priority lanes — pick the FIRST lane with work to do

### Lane A — Refresh stuck content
Heuristic: posts with `date` ≥60 days old. Refresh stats on image format adoption (WebP/AVIF browser support — verify via [caniuse.com](https://caniuse.com)), file size comparisons, browser-feature support tables, and tool support claims. Bump `date`, `display_date`, and `updated_at`. Keep `created_at` unchanged.

### Lane B — Internal-link strengthening
Once Lane A is clear: cross-link posts to the homepage tool (`/`), the image converter (`/image-converter-online`), and topically-adjacent guides. Use relative paths starting with `/` (e.g. `/blog/convert-images-to-webp-free-2026`).

### Lane C — New post (lowest priority — site already has ~80 posts)
Only if Lanes A and B are clear. Pick from `.agents/context/target-keywords.md`. Inspect 2–3 existing posts first to match exact frontmatter shape, body structure (Key Takeaways callout, H2 sections), and link conventions. Each post should pair with a clear CTA back to an on-site tool.

## Hard constraints

- Never more than 1 lane per run. Never more than 1 post created.
- Never fabricate browser support data, file format specs, or compression statistics. Verify via [caniuse.com](https://caniuse.com), official W3C / WHATWG specs, image format authority pages (Google WebP study, Alliance for Open Media for AVIF), or Netflix engineering blog. Cite source URLs in the post.
- Never delete content. Never force-push. Never `--no-verify`.
- **Never write to Supabase.** The site reads from markdown files in `src/content/blog/`, not from a database. The `src/lib/supabaseServer.js` and `src/lib/supabase.js` files exist but are not the production data source. If you see a Supabase MCP connector attached to this routine, ignore it for content writes — that connector is shared across all 9 routines but only `easyorder-bot` (orderviachat) legitimately uses Supabase for content. Writing content to Supabase from this routine will contaminate the orderviachat database (verified incident: 2026-05-14, where this exact routine inserted a "WebP vs AVIF" post into orderviachat's `blog_posts` table and published it on the wrong domain).
- Never write to the `main` branch. `main` contains the legacy Supabase code path; production deploys from `master`.

## After the change

1. `npm run lint`. If it fails, do not commit.
2. Commit per repo's convention. Push to `origin/master` (NOT `origin/main`).
3. One-paragraph report including: lane chosen, file path touched, slug + id of any new post, and the next-available id value for future runs.

If all lanes clear: one-line skip. Don't manufacture work.
