import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesPath = path.join(__dirname, '../src/data/articles.js');
const seoTemplatesPath = path.join(__dirname, '../src/data/seoTemplates.js');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
const BASE_URL = 'https://onlineimageshrinker.com';

const STATIC_URLS = [
  // Homepage
  '/',

  // Core Tool Pages
  '/tool/compress',
  '/tool/resize',
  '/tool/crop',
  '/tool/pdf',
  '/tool/remove-bg',
  '/tool/upscale',
  '/tool/photo-filters',
  '/tool/video-compressor',
  '/tool/video-to-gif',
  '/tool/video-to-audio',

  // SEO Landing Pages (tools)
  '/compress-jpeg',
  '/compress-png',
  '/compress-webp',
  '/resize-for-instagram',
  '/resize-for-youtube',
  '/resize-passport-photo',
  '/convert-heic-to-jpg',
  '/jpg-to-pdf',
  '/watermark-photos-online',
  '/remove-background',
  '/ai-image-upscaler',
  '/instagram-grid-maker',
  '/blur-image-online',
  '/profile-picture-maker',
  '/screenshot-beautifier',
  '/exif-remover',
  '/image-converter-online',
  '/meme-generator-online',
  '/color-palette-generator',
  '/collage-maker',
  '/image-to-text',
  '/signature-maker',
  '/qr-code-generator',
  '/photo-filters-online',
  '/magic-eraser',
  '/social-media-preview-generator',
  '/compare-images-online',

  // Solutions / Growth Hubs
  '/solutions/for-realtors',
  '/solutions/for-ecommerce',

  // Info Pages
  '/blog',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

function getArticles() {
  const content = fs.readFileSync(articlesPath, 'utf8');
  const matches = content.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
  const slugs = [];
  for (const match of matches) {
    slugs.push(match[1]);
  }
  return slugs;
}

function getProgrammaticPages() {
  const content = fs.readFileSync(seoTemplatesPath, 'utf8');
  
  // Helper: extract slugs from a specific exported array section
  const extractSlugs = (arrayName) => {
    const section = content.match(new RegExp(`export const ${arrayName} = \\[([\\s\\S]*?)\\];`))?.[1] || '';
    const matches = section.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
    const slugs = [];
    for (const match of matches) slugs.push(match[1]);
    return slugs;
  };

  // PDF size pages: compress-pdf-to-{slug}
  const pdfPages = extractSlugs('pdfSizePages').map(s => `compress-pdf-to-${s}`);

  // Image resize pages: resize-image-to-{slug}
  const resizePages = extractSlugs('imageResizePages').map(s => `resize-image-to-${s}`);
  
  // Conversion pages: convert-{slug}
  const convPages = extractSlugs('conversionPages').map(s => `convert-${s}`);

  // Video to GIF pages: convert-{slug}
  const videoGifPages = extractSlugs('videoToGifPages').map(s => `convert-${s}`);

  // Video to Audio pages: convert-{slug}
  const videoAudioPages = extractSlugs('videoToAudioPages').map(s => `convert-${s}`);

  // Social media pages: resize-for-{slug}
  const socialPages = extractSlugs('socialMediaPages').map(s => `resize-for-${s}`);

  // Print-ready pages: print-{slug}
  const printPages = extractSlugs('printReadyPages').map(s => `print-${s}`);

  // Passport pages: passport-photo-{slug}
  const passportPages = extractSlugs('passportPages').map(s => `passport-photo-${s}`);

  // Image compress by file size pages: compress-image-to-{slug}
  const imgCompressPages = extractSlugs('imageCompressSizePages').map(s => `compress-image-to-${s}`);

  return [...pdfPages, ...resizePages, ...convPages, ...videoGifPages, ...videoAudioPages, ...socialPages, ...printPages, ...passportPages, ...imgCompressPages];
}

function generateSitemap() {
  const slugs = getArticles();
  const date = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add Static URLs
  STATIC_URLS.forEach(url => {
    xml += `  <url>
    <loc>${BASE_URL}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.9'}</priority>
    <lastmod>${date}</lastmod>
  </url>
`;
  });

  // Add Blog URLs
  slugs.forEach(slug => {
    xml += `  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <lastmod>${date}</lastmod>
  </url>
`;
  });

  // Add Programmatic SEO Pages
  const programmaticPages = getProgrammaticPages();
  programmaticPages.forEach(slug => {
    xml += `  <url>
    <loc>${BASE_URL}/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <lastmod>${date}</lastmod>
  </url>
`;
  });

  xml += `</urlset>`;

  fs.writeFileSync(sitemapPath, xml);
  console.log(`✅ Sitemap generated with ${STATIC_URLS.length + slugs.length + programmaticPages.length} URLs`);
}

generateSitemap();
