import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
const envFile = fs.readFileSync(envPath, 'utf-8');
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

const articleContent = `Every website needs a favicon. It's the small icon that appears in the browser tab, in bookmark lists, and on a user's mobile home screen. While it seems like a tiny detail, a well-implemented favicon is crucial for brand recognition and a polished, professional user experience. 

However, generating the correct favicon formats historically involved opening complex design software or using outdated, ad-heavy converter tools from the early 2010s to generate a generic \`favicon.ico\` file.

In 2026, web standards are highly refined, and creating a perfect favicon setup should take seconds. This guide will walk you through the modern best practices for favicons and show you the fastest way to generate them.

## The Modern Favicon Standards

If you look at tutorials from a decade ago, you'll see complex setups requiring dozens of image files for every conceivable Android and iOS device. Today, modern browsers and operating systems are much smarter. You only really need a few specific formats to cover 99% of use cases:

1.  **The Classic \`.ico\` Bundle**: This is the traditional fallback file. It's special because a single \`.ico\` file can contain multiple sizes within it. A high-quality \`.ico\` bundle should contain 16x16, 32x32, and 48x48 pixel versions of your logo to ensure it stays crisp on all displays.
2.  **The SVG / High-Res PNG**: Modern browsers (Chrome, Firefox, Edge) heavily prefer a scalable vector graphic (SVG) or a high-resolution PNG (like 512x512) declared in your HTML header.
3.  **The Apple Touch Icon**: For iOS users saving your website to their home screen, Apple devices look specifically for an \`apple-touch-icon.png\` (usually 180x180 pixels).

## How to Quickly Convert an Image to a Favicon

If you have a high-resolution logo (PNG or JPG) and just need to generate the necessary production-ready files, we built a modern, ultra-fast [Free Favicon Generator](/favicon-generator).

Here's how to use it:

1.  **Prepare your source image**: Ensure your logo is perfectly square. It should ideally be at least 512x512 pixels with a transparent background. If it isn't square, you can easily use our [Crop Tool](/crop-image) to fix the aspect ratio first.
2.  **Upload to the Generator**: Go to the [Favicon Generator](/favicon-generator) and drag your logo into the dropzone. 
3.  **Instant Client-Side Conversion**: Unlike older tools, our generator doesn't upload your image to a slow server queue. It uses your browser's internal engine to instantly downscale your logo perfectly without losing sharpness.
4.  **Download Your Bundle**: Click download to instantly receive a \`.zip\` file. This package contains your multi-resolution \`favicon.ico\` bundle, a pristine 512x512 PNG, and the Apple Touch Icon.

## The Optimal HTML Code

Once you've generated your icons and uploaded them to your website's root directory, you just need to add a few lines of code inside the \`<head>\` section of your website.

Here is the exact boilerplate favored by modern frameworks like Next.js and Vite:

\`\`\`html
<!-- Classic Fallback -->
<link rel="icon" href="/favicon.ico" sizes="any">
<!-- SVG / High Res Modern Setup (if applicable) -->
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
\`\`\`

## Final Checks

After deploying your new favicons, clear your browser cache and reload your site to see the immediate brand uplift. A crisp, perfectly sized favicon ensures that whether your user is looking through 50 open tabs on a desktop or saving your web app to their iPhone, your brand stands out flawlessly.

Ready to polish your UI? Generate your icons instantly with our 100% free, developer-friendly [Favicon Generator](/favicon-generator).`;

async function insertArticle() {  
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const getRes = await fetch(`${supabaseUrl}/rest/v1/blog_posts?select=id,slug`, { headers });
  const existingRecords = await getRes.json();
  const targetSlug = 'developer-guide-favicon-ico-generator';
  
  if (existingRecords.some(r => r.slug === targetSlug)) {
      console.log(`❌ An article with the slug '${targetSlug}' already exists.`);
      process.exit(0);
  }

  const currentMaxId = existingRecords.length > 0 ? Math.max(...existingRecords.map(r => r.id)) : 0;
  const safeNextId = currentMaxId + 1;

  const payload = {
    id: safeNextId,
    slug: targetSlug,
    title: 'The Ultimate Developer\'s Guide to Favicons (2026)',
    excerpt: "Learn modern best practices for implementing favicons and discover how to instantly generate multi-resolution .ico bundles and Apple Touch Icons directly in your browser.",
    category: 'Tutorials',
    date: new Date().toISOString(),
    display_date: 'March 20, 2026',
    read_time: '4 min read',
    image: '/guide-images/hero-favicon-generator.png',
    content: articleContent
  };

  const postRes = await fetch(`${supabaseUrl}/rest/v1/blog_posts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!postRes.ok) {
    console.error('❌ Insert Error:', await postRes.text());
    process.exit(1);
  }
  console.log('✅ Successfully published Favicon Guide article!');
}

insertArticle();
