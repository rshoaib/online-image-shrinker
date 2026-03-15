import { createClient } from '@supabase/supabase-js';
import { watermarkArticle } from './article_watermark.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://myszwtogimruryosrqvy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15c3p3dG9naW1ydXJ5b3NycXZ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUyNDU0MiwiZXhwIjoyMDg3MTAwNTQyfQ.Ub-MYQxXTapsZduSVH1-3e6qFGpYhC3DFmc08v7yk9w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertArticle() {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([
      {
        id: Math.floor(Math.random() * 10000) + 1000,
        slug: 'how-to-add-watermark-to-photos-online-free',
        title: 'How to Add a Watermark to Photos Online for Free (2026)',
        excerpt: "Protect your photos from theft. Learn how to add text or logo watermarks to your images directly in your browser without uploading to any servers.",
        category: 'Guides',
        date: new Date().toISOString(),
        display_date: 'March 15, 2026',
        read_time: '3 min read',
        image: '/guide-images/watermark-hero.png',
        content: watermarkArticle
      }
    ]);

  if (error) {
    console.error('Error inserting article:', error);
    process.exit(1);
  }

  console.log('Successfully inserted article!', data);
}

insertArticle();
