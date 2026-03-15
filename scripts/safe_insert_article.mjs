import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { removeBgArticle } from '../article_content.js';

// 1. Load Environment Variables from .env.local
const envFile = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length > 0) {
    envVars[key.trim()] = value.join('=').replace(/"/g, '').trim();
  }
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function safeInsertArticle() {
  console.log('Fetching existing articles to determine safe ID...');
  
  // 2. Fetch all existing IDs to bypass the broken Postgres auto-increment sequence
  const { data: existingRecords, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, slug');

  if (fetchError) {
    console.error('Error fetching existing records:', fetchError);
    process.exit(1);
  }

  const targetSlug = 'how-to-remove-image-background-free-2026';
  
  // Prevent duplicate slugs
  if (existingRecords.some(r => r.slug === targetSlug)) {
      console.log(`❌ An article with the slug '${targetSlug}' already exists.`);
      process.exit(1);
  }

  const currentMaxId = existingRecords.length > 0 ? Math.max(...existingRecords.map(r => r.id)) : 0;
  const safeNextId = currentMaxId + 1;
  
  console.log(`Determined safe next ID: ${safeNextId}. Inserting...`);

  // 3. Insert the new article with the explicit safe ID
  const { error: insertError } = await supabase
    .from('blog_posts')
    .insert([
      {
        id: safeNextId,
        slug: targetSlug,
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

  if (insertError) {
    console.error('❌ Insert Error:', insertError.message, insertError.details || '');
    process.exit(1);
  }

  console.log('✅ Successfully published article to Supabase!');
}

safeInsertArticle();
