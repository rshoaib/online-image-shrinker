/**
 * Canonical URL strategy for onlineimageshrinker.com.
 *
 * Some tools have both a /tool/<toolId> route and a flat /<slug> (pSEO) route that
 * render identical content. Google was flagging these as "Duplicate without user-selected
 * canonical". This module defines which form is the canonical for each tool.
 *
 * Strategy (matches .agents/context/internal-links.md):
 *  - Core tools with no SEO-focused alias: /tool/<toolId> is canonical.
 *  - Tools with a keyword-friendly flat slug: /<slug> is canonical.
 *
 * Update this map if new tools are added or the canonical decision changes.
 */

// Maps toolId -> canonical flat slug (if the flat slug form is canonical).
// If a toolId is NOT in this map, /tool/<toolId> is canonical.
export const CANONICAL_SLUG_BY_TOOL_ID = {
  'remove-bg': 'remove-background',
  'upscale': 'ai-image-upscaler',
  'image-converter': 'image-converter-online',
  'watermark': 'watermark-photos-online',
  'exif': 'exif-remover',
  'magic-eraser': 'magic-eraser',
  'ocr': 'image-to-text',
  'grid-splitter': 'instagram-grid-maker',
  'profile-picture': 'profile-picture-maker',
  'screenshot-beautifier': 'screenshot-beautifier',
  'photo-filters': 'photo-filters-online',
  'meme-generator': 'meme-generator-online',
  'palette-generator': 'color-palette-generator',
  'qr-code-generator': 'qr-code-generator',
  'signature-maker': 'signature-maker',
  'favicon-generator': 'favicon-generator',
  'svg-to-png': 'svg-to-png',
  'base64-converter': 'base64-converter',
  'collage-maker': 'collage-maker',
  'social-preview': 'social-media-preview-generator',
  'image-compare': 'compare-images-online',
  'redact': 'blur-image-online',
  'passport': 'resize-passport-photo',
  'rotate-flip': 'rotate-image-online',
};

// Returns the canonical path for a given toolId.
export function canonicalPathForToolId(toolId) {
  const slug = CANONICAL_SLUG_BY_TOOL_ID[toolId];
  return slug ? `/${slug}` : `/tool/${toolId}`;
}

// Returns the canonical path for a flat slug. For pSEO slugs the canonical is always
// the slug itself (each pSEO page targets its own keyword).
export function canonicalPathForSlug(slug) {
  return `/${slug}`;
}

// Used by the sitemap to pick only the canonical URL per tool and avoid
// listing both /tool/<toolId> and /<slug> for the same content.
export function shouldIncludeToolUrlInSitemap(toolId) {
  return !CANONICAL_SLUG_BY_TOOL_ID[toolId];
}
