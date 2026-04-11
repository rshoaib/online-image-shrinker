import fs from 'fs';
import path from 'path';

// Load Environment Variables from .env.local
const envPath = path.resolve('.env.local');
const envFile = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length > 0) {
    envVars[key.trim()] = value.join('=').replace(/"/g, '').trim();
  }
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'] || envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const articleContent = `They say you shouldn't judge a book by its cover, but on YouTube, your thumbnail *is* the cover—and viewers absolutely judge it. A high-quality, perfectly sized thumbnail is the single most important factor for improving your Click-Through Rate (CTR) and getting more views.

If your thumbnail is blurry, poorly cropped, or the wrong resolution, YouTube's algorithm will stop recommending your video.

In this guide, we will cover the exact YouTube thumbnail size for 2026, the best practices for designing one, and how you can use our free tools to perfectly resize and crop your images.

## The Perfect YouTube Thumbnail Size (2026 Guidelines)

If you want your video to look crisp on both massive 4K smart TVs and tiny smartphone screens, you must follow Google's official size requirements.

Here are the exact specs you need:

*   **Ideal Resolution:** 1280 x 720 pixels (with a minimum width of 640 pixels).
*   **Aspect Ratio:** 16:9. This is the standard widescreen format. If you use a different ratio, YouTube will add ugly black bars to the sides of your image.
*   **Maximum File Size:** 2 Megabytes (2MB). If your file is larger, YouTube will reject the upload.
*   **Approved File Formats:** JPG, PNG, or GIF (though animated GIFs will not play in the thumbnail preview).

### Why 1280 x 720?
You might wonder why YouTube doesn't recommend 1920 x 1080 (Full HD) for thumbnails. While you *can* upload a 1080p image, it is completely unnecessary. Thumbnails are rarely displayed larger than 720p dimensions, even on desktop browsers. More importantly, keeping the resolution at 720p ensures you stay under that strict 2MB file size limit.

## Common Thumbnail Mistakes (And How to Fix Them)

### 1. The File is Too Large
If you design a beautiful thumbnail in Photoshop with dozens of layers and export it as an uncompressed PNG, the file size will likely exceed 2MB. 
*   **The Fix:** Instead of lowering the quality of your design, just run your finished file through our **[Free Image Compressor](/compress)**. We can easily shrink a 4MB PNG down to 500KB without any visible loss in quality.

### 2. The Aspect Ratio is Wrong
If you take a photo with your iPhone in portrait mode, the vertical aspect ratio will not fit YouTube's widescreen player. 
*   **The Fix:** You need to crop it. You can instantly lock a 16:9 aspect ratio and frame your shot perfectly using our **[Free Crop Tool](/crop)**.

### 3. Subject is Lost in the Background
A thumbnail that looks great on your desktop monitor might look like a cluttered mess when scaled down to a tiny 2-inch box on a mobile phone.
*   **The Fix:** Remove the background! Use our AI-powered **[Background Remover](/remove-bg)** to isolate your face or your main subject. Then, place that subject over a bright, clean, high-contrast background to make it pop.

## Best Practices for Clickable Thumbnails

Having the right size is just the technical foundation. To actually get clicks, keep these design principles in mind:

1.  **Use High Contrast:** The YouTube interface is mostly white (or dark gray in dark mode). Bright, high-contrast colors like neon green, bright yellow, or cyber blue will physically draw the eye.
2.  **Keep Text Minimal:** Only use 3 to 4 words maximum. Make the text massive. If they can't read it natively on their phone screen without squinting, it's too small.
3.  **The Rule of Thirds:** Place your main subject on the left or center of the image. The bottom right corner of your thumbnail will always be covered by YouTube's black timestamp box. *Never put important text in the bottom right corner.*
4.  **Show Emotion:** Humans are biologically hardwired to look at faces. An expressive face (surprise, joy, frustration) performs significantly better than a flat, emotionless expression.

## Start Creating Now

You don't need expensive software subscriptions to make killer YouTube thumbnails. Once you have a concept, you can use our suite of free, browser-based tools:

*   Got a raw photo? Use the **[Cropper](/crop)** to hit that perfect 16:9 ratio.
*   Need to scale it down? Use the **[Resizer](/resize)** to hit 1280x720.
*   File too big for YouTube? Use the **[Compressor](/compress)** to get under 2MB.

All our tools run entirely in your browser—no signups, no watermarks, and 100% privacy.`;

async function insertArticle() {
  console.log('Fetching existing articles via REST...');
  
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const getRes = await fetch(`${supabaseUrl}/rest/v1/blog_posts?select=id,slug`, { headers });
  
  if (!getRes.ok) {
    console.error('Failed to fetch existing:', await getRes.text());
    process.exit(1);
  }

  const existingRecords = await getRes.json();
  const targetSlug = 'youtube-thumbnail-size-and-maker-guide';
  
  if (existingRecords.some(r => r.slug === targetSlug)) {
      console.log(`❌ An article with the slug '${targetSlug}' already exists.`);
      process.exit(0);
  }

  const currentMaxId = existingRecords.length > 0 ? Math.max(...existingRecords.map(r => r.id)) : 0;
  const safeNextId = currentMaxId + 1;
  
  console.log(`Determined safe next ID: ${safeNextId}. Inserting...`);

  const payload = {
    id: safeNextId,
    slug: targetSlug,
    title: 'YouTube Thumbnail Size (2026): Exact Specs and Best Practices',
    excerpt: "Learn the exact dimensions, aspect ratio, and file size limits for YouTube thumbnails in 2026. Discover how to instantly resize, crop, and compress your thumbnails for free.",
    category: 'Social Media',
    date: new Date().toISOString(),
    display_date: 'April 2, 2026',
    read_time: '4 min read',
    image: '/images/blog/youtube-thumbnail-hero.png',
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

  console.log('✅ Successfully published article via native fetch REST call!');
}

insertArticle();
