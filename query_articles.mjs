import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://myszwtogimruryosrqvy.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15c3p3dG9naW1ydXJ5b3NycXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjQ1NDIsImV4cCI6MjA4NzEwMDU0Mn0.UPLyuxkoFDLn20CIN9n-ob1t9AIO1NwejDl6M0YNl20';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkFrequency() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('date')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    process.exit(1);
  }

  const articles = data || [];
  const total = articles.length;
  const lastPublished = total > 0 ? articles[0].date : 'N/A';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get start of current week (Monday)
  const currentDay = today.getDay();
  const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
  const startOfWeek = new Date(today.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  let publishedToday = 0;
  let publishedThisWeek = 0;

  articles.forEach(article => {
    if (!article.date) return;
    const articleDate = new Date(article.date);
    
    // Check if today
    const isToday = articleDate.getDate() === new Date().getDate() &&
                    articleDate.getMonth() === new Date().getMonth() &&
                    articleDate.getFullYear() === new Date().getFullYear();
    
    if (isToday) publishedToday++;
    if (articleDate >= startOfWeek) publishedThisWeek++;
  });

  console.log('--- Publishing Stats ---');
  console.log(`Total articles:      ${total}`);
  console.log(`Last published:      ${lastPublished}`);
  console.log(`Published today:     ${publishedToday}`);
  console.log(`Published this week: ${publishedThisWeek}`);
}

checkFrequency();
