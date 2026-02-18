---
description: Run a full SEO audit and optimization sprint (79 checkpoints across 12 categories)
---

# Full SEO Audit & Optimization Sprint

Run this workflow on any web project to audit and fix SEO issues across all categories. This is a comprehensive audit covering on-page, technical, structured data, performance, and more.

## How to Use
Say: `/seo-audit` followed by the live URL of the site to audit.
Example: `/seo-audit https://example.com`

---

## Phase 1: Discovery & Baseline (PLANNING)

### 1.1 Project Analysis
- Identify the tech stack (React, Next.js, static HTML, etc.)
- List all public routes/pages
- Check if sitemap.xml exists and is complete
- Check robots.txt

### 1.2 Baseline Scores
- Run PageSpeed Insights (mobile + desktop) and record scores
- Check Google Search Console (if access available): indexed pages, impressions, clicks
- Run Rich Results Test on the homepage

---

## Phase 2: Audit Checklist (79 Checkpoints)

### Category 1: On-Page SEO (9 checkpoints)
- [ ] 1. Unique `<title>` per page (<60 chars)
- [ ] 2. Meta description per page (<155 chars)
- [ ] 3. Single `<h1>` per page
- [ ] 4. H1 → H2 → H3 heading hierarchy
- [ ] 5. Internal linking between related pages
- [ ] 6. Image alt text on all `<img>` elements
- [ ] 7. Clean URL slugs (no query params for content pages)
- [ ] 8. Keyword-rich titles matching search intent
- [ ] 9. Content length (1500+ words for pillar pages)

### Category 2: Technical SEO (11 checkpoints)
- [ ] 10. `sitemap.xml` complete with all public URLs
- [ ] 11. `robots.txt` valid and not blocking important pages
- [ ] 12. Canonical tags on every page
- [ ] 13. HTTPS everywhere (no mixed content)
- [ ] 14. Mobile responsive design
- [ ] 15. Core Web Vitals — LCP (<2.5s)
- [ ] 16. Core Web Vitals — CLS (<0.1)
- [ ] 17. Core Web Vitals — INP (<200ms)
- [ ] 18. JS code splitting / lazy loading for non-critical code
- [ ] 19. 404 error page handling
- [ ] 20. PWA / Service Worker (if applicable)

### Category 3: Structured Data / JSON-LD (7 checkpoints)
- [ ] 21. `WebApplication` or `WebSite` schema on homepage
- [ ] 22. `BlogPosting` / `Article` schema on blog posts
- [ ] 23. `Organization` schema with name, logo, url
- [ ] 24. `FAQPage` schema on pages with FAQ content
- [ ] 25. `HowTo` schema on tutorial/how-to pages
- [ ] 26. `BreadcrumbList` schema for navigation
- [ ] 27. `Person` schema for authors

### Category 4: GEO — Generative Engine Optimization (6 checkpoints)
- [ ] 28. `llms.txt` at site root describing the site for AI crawlers
- [ ] 29. `robots.txt` Llms-txt directive
- [ ] 30. Definition-first paragraphs (answer the question in the first sentence)
- [ ] 31. Factual, extractable content (tables, specs, numbers)
- [ ] 32. FAQ sections on key pages
- [ ] 33. `llms-full.txt` extended version (optional)

### Category 5: AEO — Answer Engine Optimization (5 checkpoints)
- [ ] 34. Featured Snippet-optimized content (tables, lists, bold terms)
- [ ] 35. FAQPage JSON-LD on relevant pages
- [ ] 36. "People Also Ask" targeting in content
- [ ] 37. Concise answer-first writing style
- [ ] 38. HowTo schema for tutorials

### Category 6: E-E-A-T — Experience, Expertise, Authority, Trust (8 checkpoints)
- [ ] 39. Author names on blog posts
- [ ] 40. `Person` schema for authors
- [ ] 41. Organization/Publisher schema on all pages
- [ ] 42. Trust signals (privacy messaging, security badges)
- [ ] 43. About page with founder/team bios
- [ ] 44. Author bio pages (individual profiles)
- [ ] 45. External backlinks strategy
- [ ] 46. Consistent publishing schedule

### Category 7: International SEO (5 checkpoints)
- [ ] 47. `hreflang` tags for all supported languages + x-default
- [ ] 48. `<html lang>` attribute set dynamically
- [ ] 49. Localized tool names/descriptions
- [ ] 50. Localized meta descriptions
- [ ] 51. Language-specific sitemaps

### Category 8: Social / OG Tags (7 checkpoints)
- [ ] 52. `og:title`, `og:description` (dynamic per page)
- [ ] 53. `og:image` (dynamic for blog posts with cover images)
- [ ] 54. `og:type` (`article` for blog, `website` for others)
- [ ] 55. `og:site_name`
- [ ] 56. Twitter Card (`summary_large_image`)
- [ ] 57. Static OG fallback in `index.html`
- [ ] 58. Per-page unique OG images

### Category 9: Content Quality / Topical Authority (7 checkpoints)
- [ ] 59. Topic clusters (hub & spoke model)
- [ ] 60. Internal cross-linking between related content
- [ ] 61. Content depth (pillar content for main topics)
- [ ] 62. Updated yearly references (current year)
- [ ] 63. Unique insights/data not found elsewhere
- [ ] 64. No thin/duplicate content
- [ ] 65. CTA on every page

### Category 10: Performance / Speed (6 checkpoints)
- [ ] 66. JS chunking (vendor code split from app code)
- [ ] 67. Lazy loading for heavy/below-fold components
- [ ] 68. Font loading optimized (non-blocking, minimal weights)
- [ ] 69. Image lazy loading (`loading="lazy"`)
- [ ] 70. Preconnect to external domains (fonts, APIs)
- [ ] 71. PageSpeed score 85+ (mobile + desktop)

### Category 11: Security / Privacy (4 checkpoints)
- [ ] 72. HTTPS enforced
- [ ] 73. No unnecessary server-side data processing
- [ ] 74. No tracking cookies for core functionality
- [ ] 75. GDPR/privacy compliance messaging

### Category 12: AdSense Readiness (4 checkpoints)
- [ ] 76. Standard ad unit spaces in layout (728×90, 300×250)
- [ ] 77. Ads not too close to interactive elements
- [ ] 78. Sufficient content pages (10+ unique pages)
- [ ] 79. AdSense snippet integration ready

---

## Phase 3: Fix & Implement (EXECUTION)

Work through each category, fixing issues found during the audit:
1. Start with **Technical SEO** (sitemap, robots.txt, canonical tags)
2. Then **On-Page SEO** (titles, descriptions, headings)
3. Then **Structured Data** (JSON-LD schemas)
4. Then **Performance** (lazy loading, font optimization, code splitting)
5. Then **Content** (E-E-A-T, GEO, AEO)
6. Finally **Social/OG** and **International**

---

## Phase 4: Verify (VERIFICATION)

// turbo
1. Run `npm run build` to verify no build errors
2. Run PageSpeed Insights on the live URL (mobile + desktop)
3. Run Google Rich Results Test
4. Check Google Search Console for indexing status
5. Submit/resubmit sitemap if needed

---

## Phase 5: Scorecard

After completing the audit, produce a final scorecard:

| Category | Score (/10) | What's Left |
|----------|-------------|-------------|
| On-Page SEO | ?/10 | |
| Technical SEO | ?/10 | |
| Structured Data | ?/10 | |
| GEO (LLM) | ?/10 | |
| AEO | ?/10 | |
| E-E-A-T | ?/10 | |
| International | ?/10 | |
| Social/OG | ?/10 | |
| Content | ?/10 | |
| Performance | ?/10 | |
| Security | ?/10 | |
| AdSense | ?/10 | |
