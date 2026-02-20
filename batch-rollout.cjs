/**
 * Batch Rollout for OnlineImageShrinker — trims sitemap to Batch 1.
 * 
 * Batch 1 (~15 pages): Highest-value new additions
 * Batch 2: All remaining new pages
 * 
 * Usage: node batch-rollout.cjs 1
 */
const fs = require('fs');

const batch = process.argv[2] || '1';

// New URLs we added (not the original ones that were already deployed)
// Batch 1: highest search volume new pages (~15)
const batch1NewUrls = [
  // Most searched resize formats
  'resize-image-to-800x600', 'resize-image-to-500x500', 'resize-image-to-3840x2160',
  'resize-image-to-1200x628', 'resize-image-to-300x300',
  // Most searched conversions  
  'convert-bmp-to-jpg', 'convert-png-to-webp', 'convert-jpg-to-webp', 'convert-gif-to-png',
  // Hot social media
  'resize-for-tiktok-video', 'resize-for-pinterest-pin', 'resize-for-whatsapp-dp',
  // Compress by size (top 3)
  'compress-image-to-100kb', 'compress-image-to-200kb', 'compress-image-to-50kb',
];

// Batch 2: everything else we added
const batch2NewUrls = [
  'resize-image-to-2560x1440', 'resize-image-to-640x480', 'resize-image-to-600x400',
  'resize-image-to-2048x1152', 'resize-image-to-8x10-inch',
  'convert-bmp-to-png', 'convert-gif-to-jpg', 'convert-tiff-to-jpg', 'convert-tiff-to-png',
  'resize-for-twitch-banner', 'resize-for-twitter-post', 'resize-for-discord-server-icon',
  'passport-photo-canada-passport', 'passport-photo-australia-passport',
  'passport-photo-china-passport', 'passport-photo-japan-passport',
  'passport-photo-schengen-visa', 'passport-photo-saudi-arabia-passport',
  'compress-image-to-20kb', 'compress-image-to-500kb',
  'compress-image-to-1mb', 'compress-image-to-2mb', 'compress-image-to-5mb',
];

let activeUrls;
if (batch === '1') {
  activeUrls = batch1NewUrls;
  console.log(`\n📦 Batch 1: ${batch1NewUrls.length} new pages\n`);
} else if (batch === '2') {
  activeUrls = [...batch1NewUrls, ...batch2NewUrls];
  console.log(`\n📦 Batch 1+2: ${batch1NewUrls.length + batch2NewUrls.length} new pages\n`);
} else {
  activeUrls = [...batch1NewUrls, ...batch2NewUrls];
  console.log(`\n📦 ALL new pages: ${batch1NewUrls.length + batch2NewUrls.length}\n`);
}

// Remove all NEW URLs from sitemap (keep original ones intact)
const allNewUrls = [...batch1NewUrls, ...batch2NewUrls];
let sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');

allNewUrls.forEach(url => {
  const regex = new RegExp(`  <url>\\n    <loc>https://onlineimageshrinker\\.com/${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>\\n    <lastmod>[^<]+</lastmod>\\n    <changefreq>[^<]+</changefreq>\\n    <priority>[^<]+</priority>\\n  </url>\\n`, 'g');
  sitemap = sitemap.replace(regex, '');
});

// Add back only active URLs
let entries = '';
activeUrls.forEach(url => {
  entries += `  <url>\n    <loc>https://onlineimageshrinker.com/${url}</loc>\n    <lastmod>2026-02-20</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
});
sitemap = sitemap.replace('</urlset>', entries + '</urlset>');

fs.writeFileSync('public/sitemap.xml', sitemap, 'utf8');
console.log(`✅ Sitemap: ${activeUrls.length} new URLs added (originals untouched)`);
console.log('\n🎯 Done! Ready to deploy.\n');
