import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to handle ES modules in Node scripts
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import data - we need to read the file content manually because 
// importing a module with JSX/React dependencies in Node might ensure errors
// or we can just import it if it's pure JS data.
// However, our articles.js has `content: ...` which is fine, 
// but if it has imports like 'lucide-react', Node will fail.
// So we will employ a regex strategy to extract slugs to be safe/lazy 
// without setting up a babel transpiler for this script.

const articlesPath = path.join(__dirname, '../src/data/articles.js');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
const BASE_URL = 'https://onlineimageshrinker.com';

const STATIC_URLS = [
  '/',
  '/tool/compress',
  '/tool/resize',
  '/tool/crop',
  '/watermark-photos-online',
  '/tool/pdf',
  '/tool/remove-bg',
  '/tool/upscale',
  '/compress-jpeg',
  '/resize-for-instagram',
  '/convert-heic-to-jpg',
  '/jpg-to-pdf',
  '/resize-passport-photo',
  '/resize-for-youtube',
  '/compress-png',
  '/compress-webp',
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
  '/blog'
];

function getArticles() {
  const content = fs.readFileSync(articlesPath, 'utf8');
  // Regex to match slug: 'some-slug'
  const matches = content.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
  const slugs = [];
  for (const match of matches) {
    slugs.push(match[1]);
  }
  return slugs;
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

  xml += `</urlset>`;

  fs.writeFileSync(sitemapPath, xml);
  console.log(`✅ Sitemap generated with ${STATIC_URLS.length + slugs.length} URLs`);
}

generateSitemap();
