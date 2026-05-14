# onlineimageshrinker.com — daily content routine

## Mission

Land **one** meaningful change per run. New site, blog scaffold exists but no posts yet — Lane C dominates early.

## Pre-flight

1. Read `.agents/context/site-context.md` for brand voice + tool URL map.
2. Read `.agents/context/target-keywords.md` for keyword backlog.
3. Posts dir: inspect `app/blog/` to discover where posts are stored. Branch: `main`.

## Priority lanes — pick the FIRST lane with work to do

### Lane A — Refresh stuck content
Once posts exist: heuristic = `date` ≥30 days old. Refresh stats on image format adoption (WebP/AVIF browser support), file size comparisons, browser-feature support tables. Verify with caniuse.com. Bump date.

### Lane B — Internal-link strengthening
Once Lane A is clear: cross-link posts to the homepage tool and to companion guides.

### Lane C — New post (dominant early)
Pick from `.agents/context/target-keywords.md`. Inspect any existing posts first to learn frontmatter shape. Each post should pair with a clear CTA back to the on-site image compressor.

## Hard constraints

- Never more than 1 lane per run. Never more than 1 post created.
- Never fabricate browser support, file format specs, or compression statistics. Verify via caniuse.com / official W3C / WHATWG specs / image format authority pages.
- Never delete content. Never force-push. Never `--no-verify`.
- **Never write to Supabase.** This site is file-based (Next.js — content lives under `app/blog/` in the repo). The only legitimate target for new content is a git commit on the default branch. If you see a Supabase MCP connector attached to this routine, ignore it for content writes — that connector is shared across all routines but only `easyorder-bot` legitimately uses Supabase for content. Writing content to Supabase from this routine will contaminate the orderviachat database (verified incident: 2026-05-14 with online-image-shrinker).

## After the change

1. `npm run lint`. If it fails, do not commit.
2. Commit per repo's convention. Push to `origin/main`.
3. One-paragraph report.

If all lanes clear: one-line skip. Don't manufacture work.
