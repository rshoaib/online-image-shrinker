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
  
  // PDF size pages: compress-pdf-to-{slug}
  const pdfMatches = content.matchAll(/slug:\s*['"]([^'"]+)['"],\s*size/g);
  const pdfPages = [];
  for (const match of pdfMatches) {
    pdfPages.push(`compress-pdf-to-${match[1]}`);
  }

  // Image resize pages: resize-image-to-{slug}
  // Match all entries in imageResizePages array (some have width/height, some only label)
  const resizeSection = content.match(/export const imageResizePages = \[([\s\S]*?)\];/)?.[1] || '';
  const resizeSlugs = resizeSection.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
  const resizePages = [];
  for (const match of resizeSlugs) {
    resizePages.push(`resize-image-to-${match[1]}`);
  }
  
  // Conversion pages: convert-{slug}
  const convMatches = content.matchAll(/slug:\s*['"]([^'"]+)['"],\s*from/g);
  const convPages = [];
  for (const match of convMatches) {
    convPages.push(`convert-${match[1]}`);
  }

  // Social media pages: resize-for-{slug}
  const socialMatches = content.matchAll(/slug:\s*['"]([^'"]+)['"],\s*width:\s*\d+,\s*height:\s*\d+,\s*label:\s*['"][^'"]+['"],\s*toolId:\s*['"]crop['"]/g);
  const socialPages = [];
  for (const match of socialMatches) {
    socialPages.push(`resize-for-${match[1]}`);
  }

  // Print-ready pages: print-{slug}
  const printSection = content.match(/export const printReadyPages = \[([\s\S]*?)\];/)?.[1] || '';
  const printSlugs = printSection.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
  const printPages = [];
  for (const match of printSlugs) {
    printPages.push(`print-${match[1]}`);
  }

  // Passport pages: passport-photo-{slug}
  const passportSection = content.match(/export const passportPages = \[([\s\S]*?)\];/)?.[1] || '';
  const passportSlugs = passportSection.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
  const passportPages = [];
  for (const match of passportSlugs) {
    passportPages.push(`passport-photo-${match[1]}`);
  }

  return [...pdfPages, ...resizePages, ...convPages, ...socialPages, ...printPages, ...passportPages];
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
