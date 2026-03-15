import { supabase } from '../src/lib/supabase';
import { getAllSlugs } from '../src/utils/routeHelper';

const BASE_URL = 'https://onlineimageshrinker.com';

const STATIC_URLS = [
  '/',
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
  '/solutions/for-realtors',
  '/solutions/for-ecommerce',
  '/blog',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

export default async function sitemap() {
  // Fetch blog posts
  let blogSlugs = [];
  if (supabase) {
    try {
      const { data, error } = await supabase.from('blog_posts').select('slug');
      if (!error && data) {
        blogSlugs = data.map(a => a.slug);
      } else if (error) {
        console.error('Error fetching articles from Supabase for sitemap:', error);
      }
    } catch (error) {
      console.error('Exception fetching articles for sitemap:', error);
    }
  }

  const date = new Date().toISOString().split('T')[0];

  const staticEntries = STATIC_URLS.map(url => ({
    url: `${BASE_URL}${url}`,
    lastModified: date,
    changeFrequency: 'weekly',
    priority: url === '/' ? 1.0 : 0.9,
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
