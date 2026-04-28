import { getAllSlugs as getAllBlogSlugs } from '../src/lib/blogPosts';
import { getAllSlugs } from '../src/utils/routeHelper';
import { shouldIncludeToolUrlInSitemap } from '../src/utils/canonicalUrls';

const BASE_URL = 'https://onlineimageshrinker.com';

// Candidate /tool/<toolId> URLs. Any tool that has a canonical flat slug
// (see src/utils/canonicalUrls.js) is filtered out so we don't list both
// the /tool/<id> and /<slug> forms for the same content.
const TOOL_URLS_RAW = [
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
];

const TOOL_URLS = TOOL_URLS_RAW.filter(url => {
  const toolId = url.replace(/^\/tool\//, '');
  return shouldIncludeToolUrlInSitemap(toolId);
});

const SOLUTION_URLS = [
  '/solutions/for-realtors',
  '/solutions/for-ecommerce',
];

const INFO_URLS = [
  '/blog',
  '/about',
  '/contact',
];

const LEGAL_URLS = [
  '/privacy',
  '/terms',
];

function getStaticPriority(url) {
  if (url === '/') return 1.0;
  if (TOOL_URLS.includes(url)) return 0.9;
  if (SOLUTION_URLS.includes(url)) return 0.9;
  if (url === '/blog') return 0.8;
  if (['/about', '/contact'].includes(url)) return 0.5;
  return 0.3; // privacy, terms
}

export default async function sitemap() {
  // Blog post slugs come from the hardcoded .md files in src/content/blog.
  const blogSlugs = getAllBlogSlugs();

  const date = new Date().toISOString().split('T')[0];
  const ALL_STATIC = ['/', ...TOOL_URLS, ...SOLUTION_URLS, ...INFO_URLS, ...LEGAL_URLS];

  const staticEntries = ALL_STATIC.map(url => ({
    url: `${BASE_URL}${url}`,
    lastModified: date,
    changeFrequency: LEGAL_URLS.includes(url) ? 'yearly' : 'weekly',
    priority: getStaticPriority(url),
  }));

  const blogEntries = blogSlugs.map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: date,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const programmaticSlugs = getAllSlugs();
  const programmaticEntries = programmaticSlugs.map(slug => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: date,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticEntries, ...blogEntries, ...programmaticEntries];
}
