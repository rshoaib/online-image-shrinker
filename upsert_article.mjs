import { createClient } from '@supabase/supabase-js';
import { removeBgArticle } from './article_content.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://myszwtogimruryosrqvy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUyNDU0MiwiZXhwIjoyMDg3MTAwNTQyfQ.Ub-MYQxXTapsZduSVH1-3e6qFGpYhC3DFmc08v7yk9w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertArticle() {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([
      {
        id: 64,
        slug: 'how-to-remove-image-background-free-2026',
        title: 'How to Remove Image Backgrounds for Free (2026 Guide)',
        excerpt: "Stop paying for background removal. Here is how to create transparent images automatically, locally, and without creating an account in 2026.",
        category: 'Guides',
        date: new Date().toISOString(),
        display_date: 'March 12, 2026',
        read_time: '3 min read',
        image: '/guide-images/remove-bg-hero.png',
        content: removeBgArticle
      }
    ]);

  if (error) {
    console.error('Error inserting article:', error);
    process.exit(1);
  }

  console.log('Successfully inserted article!');
}

insertArticle();
