---
id: 7058
slug: "how-to-create-open-graph-images-2026"
title: "How to Create Open Graph Images Online — Free 2026 Guide"
excerpt: "The 1200×630 OG image standard explained — plus how to create, resize, and compress free Open Graph images that look sharp on every platform."
category: "Tutorials"
date: "May 02, 2026"
display_date: "May 02, 2026"
read_time: "9 min read"
image: null
tags: ["Tutorials"]
meta_title: null
meta_description: null
created_at: "2026-05-02T00:00:00+00:00"
updated_at: "2026-05-02T00:00:00+00:00"
---

Share a link without a custom Open Graph image and the preview falls back to whatever the platform scrapes — usually a tiny logo or a random screenshot. Add the right OG image and the same link gets a full-width banner on Facebook, LinkedIn, Slack, Discord, iMessage, and X. The result is a meaningfully bigger click-through rate, often 2–5× compared to bare links.

This guide walks through the **exact 2026 OG image dimensions**, the meta tags you need, and a free, browser-based workflow to make a sharp 1200 × 630 image in under three minutes. No Photoshop, no upload to a third-party server, no account.

## Open Graph in 60 Seconds

Open Graph (OG) is a meta-tag protocol Facebook published back in 2010 to standardize how links render across the social web. Today it powers preview cards on every major platform — even ones that have their own scrapers, like X (which uses Twitter Card tags but falls back to OG when those are missing).

The four tags that carry the link preview are:

```html
<meta property="og:title" content="Your headline here" />
<meta property="og:description" content="One-sentence summary." />
<meta property="og:image" content="https://yourdomain.com/og.jpg" />
<meta property="og:url" content="https://yourdomain.com/this-page" />
```

The image is the part that does the heavy lifting. A great headline gets ignored if the picture next to it is the wrong shape, blurry, or missing.

## OG Image Size Cheat Sheet (2026)

| Platform | Recommended Size | Aspect Ratio | Notes |
|---|---|---|---|
| **Universal default** | **1200 × 630 px** | 1.91:1 | Works everywhere; the de-facto standard |
| Facebook | 1200 × 630 px | 1.91:1 | Minimum 600 × 315 px |
| LinkedIn | 1200 × 627 px | ~1.91:1 | Same as Facebook in practice |
| X / Twitter (Summary Large Image) | 1200 × 628 px | ~2:1 | Crops a thin sliver off 1.91:1 — keep text centered |
| Slack / Discord / iMessage | 1200 × 630 px | 1.91:1 | All read OG tags directly |
| WhatsApp | 300 × 200 px (min) | Any | Square or 1.91:1 both work |
| File format | JPG, PNG, or WebP | — | Keep under **1 MB**; under 300 KB is even better |

**Sources:** Open Graph protocol spec at ogp.me, Facebook's Sharing Debugger documentation, X Cards reference, and 2026 sizing references from OGImage.io, OpenGraph.xyz, and Krumzi (April–May 2026).

If you build only one image for a page, **make it 1200 × 630 px**. That single file satisfies roughly 95% of the social web.

## Anatomy of an OG Image That Converts

Sizing is the floor. What turns the preview into a click is design. Five rules consistently work across niches:

1. **Big, readable headline.** The image renders as small as 300 px wide on mobile feeds. If the text doesn't read on a phone, it doesn't read at all.
2. **High contrast.** Light text on a dark background (or vice versa) survives the scroll. Subtle gradients on subtle photos disappear.
3. **Centered subject.** X razor-crops the top and bottom; LinkedIn occasionally crops sides on smaller cards. Keep important elements at least **60 px in** from every edge as a safe zone.
4. **One job per image.** Either it's a cover for an article, a screenshot of a product, or a logo — not all three. The eye needs to lock in instantly.
5. **Brand cue, small.** A logo in the corner is plenty. A full-width "BRAND NAME" bar across the top crowds out the headline.

Avoid stock photography that competes with your text. A solid color or a softly-blurred photo background almost always outperforms a busy hero image.

## How to Create a 1200 × 630 OG Image — Free Workflow

You don't need a design subscription. Here's the four-step browser workflow:

### Step 1 — Pick or design the source image

Start with whatever you have: a screenshot, a hero photo, a logo on a flat color, even a screenshot of your own blog post heading. The shape can be anything; we'll fix the canvas next.

### Step 2 — Resize the canvas to 1200 × 630 px

Open our free [resize image online](/tool/resize) tool. Drop in the source, set the width to **1200**, the height to **630**, and toggle off "lock aspect ratio" so the canvas is locked to OG dimensions. Export as JPG for photo-heavy designs or PNG if you have flat color blocks and crisp text.

### Step 3 — Crop to the exact 1.91:1 ratio (if needed)

If your source had a different ratio, resizing alone will squish it. Instead, run it through our [crop image online](/tool/crop) tool, pick the **Custom 1200×630** preset, drag to frame the subject, and export. You get a clean ratio with nothing stretched.

### Step 4 — Compress before upload

OG images load on every share. A 4 MB hero image punishes mobile users and gets aggressively reformatted by Facebook and LinkedIn. Drop the export into our [image compressor](/tool/compress) and shrink it to roughly **150–400 KB**. The visual quality is identical at typical preview sizes; the load is dramatically lighter.

If your source is HEIC, WebP, or AVIF and your CMS won't accept it, our [image converter](/image-converter-online) handles the conversion in the same browser tab — your file never leaves your device.

For pages where you need different OG images per post (a blog, a product catalog), our **[social media preview generator](/social-media-preview-generator)** lets you slot in a title, subtitle, and brand color over a template, then export at exactly 1200 × 630. It's the fastest path from "I need an OG image" to "the file is on my disk."

## Implementing OG Tags Correctly

Once the image is built and uploaded to your site (or a CDN), wire up the meta tags in your page `<head>`:

```html
<meta property="og:title" content="How to Create Open Graph Images" />
<meta property="og:description" content="Free 2026 guide to OG image dimensions, design, and meta tags." />
<meta property="og:image" content="https://example.com/og/og-images-guide.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Banner reading 'How to Create OG Images'" />
<meta property="og:url" content="https://example.com/blog/og-images" />
<meta property="og:type" content="article" />
```

Three things people miss:

- **Use absolute URLs.** Relative paths like `/og.jpg` won't be resolved by Facebook's scraper. Always include the full `https://...` URL.
- **Hardcode width and height.** Without them, Facebook re-fetches the image asynchronously, which means the *first* time your link is shared the preview can be blank.
- **Add `og:image:alt`.** It's an accessibility win and a small SEO nudge.

## Testing Before You Share

Never post a link blind. Three free debuggers cover the entire ecosystem:

1. **Facebook Sharing Debugger** at `developers.facebook.com/tools/debug` — also covers Instagram and Threads.
2. **LinkedIn Post Inspector** at `linkedin.com/post-inspector` — reads the same OG tags.
3. **X Card Validator** is in the X developer portal — tests Summary Large Image cards.

If a debugger shows a stale preview (the image you replaced still appears), use the "Scrape Again" button. Facebook caches OG previews for roughly 30 days; the rescrape forces a fresh read.

## Common Pitfalls

- **Wrong shape (1:1 or vertical).** A square image renders cropped on most platforms and gets the dreaded grey box on the rest. Stick to 1.91:1.
- **Heavy file (>2 MB).** Facebook reformats heavy images, often badly. Compress before upload.
- **Text right at the edge.** X crops about 1.5% off the top and bottom of 1.91:1 — anything closer than 30 px to a corner risks getting clipped.
- **Linking to a CDN that blocks scrapers.** Some CDNs gate by user-agent. Confirm the OG image returns a 200 OK to a curl request from a non-browser user agent.
- **No fallback.** If your CMS only sets OG tags on certain page types, the rest of your site shares with no preview. Add a site-wide default OG image as a safety net.

For dimensions on every other social platform — Instagram, Pinterest, TikTok, YouTube — see our [complete social media image sizes guide for 2026](/blog/social-media-image-sizes-2026). It pairs naturally with this post if you're building a brand kit.

## FAQ

### What is the best Open Graph image size in 2026?

**1200 × 630 pixels at a 1.91:1 aspect ratio.** This single dimension works on Facebook, LinkedIn, Slack, Discord, iMessage, WhatsApp, and X. Keep the file under 1 MB and use JPG or WebP for the smallest file size.

### Does X/Twitter need a different image from Facebook?

In most cases, no. X reads OG tags as a fallback and renders Summary Large Image cards from a 1200 × 630 image fine, with a tiny crop. If you want pixel-perfect on X specifically, export a second image at 1200 × 628 px and reference it with `twitter:image`.

### What file format should an OG image be?

**JPG for photo-heavy designs, PNG for flat colors and crisp text, WebP if your CMS supports it.** All three are accepted by every major scraper. Avoid GIFs — they're rendered as static thumbnails on most platforms.

### Why is my OG image not showing when I share the link?

Three usual suspects: (1) the URL is relative instead of absolute, (2) `og:image:width` and `og:image:height` are missing so Facebook hasn't finished its async scrape, or (3) the image file is over 8 MB and got rejected. Run the link through Facebook's Sharing Debugger and click "Scrape Again."

### Do I need a unique OG image for every page?

For a blog or product catalog, yes — a per-page image dramatically lifts click-through rate. For a landing page or marketing site, one well-designed default OG image is fine. The worst option is no image at all.

### Can I use a transparent PNG for an Open Graph image?

You can, but social platforms render the image on a white or platform-background panel — so transparent areas show up as solid white or grey. For predictable results, **flatten the design onto a solid background** before exporting.

## Build Your Next OG Image in Under Three Minutes

You don't need a design tool with a monthly fee to ship a great link preview. Drop your source into our free, no-upload **[social media preview generator](/social-media-preview-generator)**, pick the 1200 × 630 OG preset, drag in your headline, and export. The file lands on your disk — never on a third-party server — and your next share gets the full-width banner it deserves.
