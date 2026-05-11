# onlineimageshrinker.com — Site Context

> **URL**: https://onlineimageshrinker.com
> **Stack**: Next.js
> **Niche**: Free in-browser image compression / resize / format conversion
> **Audience**: Designers, web devs, bloggers, e-commerce sellers compressing images for web use
> **Differentiator**: 100% client-side — files never leave the browser

## 🎤 Brand Voice

- **Tone**: Practical, web-perf-aware, design-friendly. Like a senior dev who cares about page speed.
- **Style**: Lead with the use case (e.g., "compress a hero image for Shopify"). Show before/after sizes. Compare formats with real numbers.
- **Address**: Second person. Audience is web pros and content creators.
- **Values**: Privacy-first (everything runs in the browser, no upload).

## 🎯 Content Pillars

| Pillar | Topics |
|---|---|
| Image Formats | WebP vs AVIF vs PNG vs JPEG, when to use what |
| Compression | lossy vs lossless, quality settings, target sizes |
| Use Cases | hero images, OG cards, product photos, blog post heroes |
| Web Performance | LCP impact, lazy loading, responsive images, `srcset`, `<picture>` |
| Tools / Comparison | Photoshop vs Figma vs free tools, batch vs one-off |

## 🔗 Internal Link Patterns

Every post should link back to the homepage tool with a clear CTA ("compress your image here for free, no upload"). Cross-link related guides.

## 📝 Frontmatter Convention

Inspect `app/blog/` once posts exist. Common Next.js MDX shape:

```yaml
---
title: "..."
slug: "kebab-case"
date: "YYYY-MM-DD"
excerpt: "..."
category: "Formats | Compression | Performance | Tools"
---
```

Match whatever shape the first post uses.
