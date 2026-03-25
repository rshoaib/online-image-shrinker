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

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const articleContent = `Nothing ruins a great graphic faster than bad cropping. If you've ever uploaded a perfectly designed banner only to have the platform chop off your logo or stretch your image until it's pixelated, you know the struggle.

Every social network has its own strict dimensions. But memorizing them is impossible, especially since the platforms tweak their UI every year. 

That is why we created this definitive, up-to-date cheat sheet for **Social Media Image Sizes in 2026**.

Before you dig in, bookmark our **[Free Online Image Resizer](/resize)**. If your image is the wrong dimension, you can fix it right in your browser in under 5 seconds. No account required, no paywalls, and 100% private.

Let's dive into the exact pixels you need for every major platform.

## Instagram Image Sizes (2026)

Instagram is a visual-first platform. Blurry or poorly cropped images will actively hurt your engagement. While square photos used to be the absolute rule, vertical photos now dominate the feed.

*   **Profile Picture:** \`320 x 320 px\` (Upload as a square, it will be cropped to a circle)
*   **Square Post (1:1):** \`1080 x 1080 px\`
*   **Vertical Post (4:5) [Recommended]:** \`1080 x 1350 px\` 
*   **Landscape Post (1.91:1):** \`1080 x 566 px\`
*   **Stories & Reels (9:16):** \`1080 x 1920 px\`

**Pro Tip:** If your photo is too wide, don't rely on Instagram's built-in crop tool, which gives you little control. Use our **[Free Crop Tool](/crop)** beforehand to precisely frame the shot.

## Facebook Image Sizes (2026)

Facebook covers a massive amount of visual real estate, from Business Pages to Event Covers and standard feed posts. 

*   **Profile Picture:** \`320 x 320 px\` (Upload square, displays as a circle)
*   **Cover Photo:** \`851 x 315 px\` (Keep text within the center "safe zone" of 640 x 312 px for mobile viewing)
*   **Standard Feed Post (Square):** \`1080 x 1080 px\`
*   **Vertical Feed Post:** \`1080 x 1350 px\`
*   **Link Preview Image:** \`1200 x 630 px\`
*   **Event Cover Photo:** \`1920 x 1005 px\`

**Pro Tip:** Having trouble getting your Cover Photo under the file size limit without losing quality? Run it through our **[Free Image Compressor](/compress)** first.

## X (Formerly Twitter) Image Sizes (2026)

Fast-moving feeds mean you have half a second to catch someone's eye. On X, images that get awkwardly cropped by the algorithm lose clicks instantly.

*   **Profile Picture:** \`400 x 400 px\`
*   **Header Photo:** \`1500 x 500 px\`
*   **In-Stream Photo (Landscape):** \`1600 x 900 px\`
*   **In-Stream Photo (Square):** \`1080 x 1080 px\`
*   **Website Card / Link Preview:** \`1200 x 628 px\`

## LinkedIn Image Sizes (2026)

Professional polish matters here more than anywhere else. Pixelated logos on your Company Page scream "amateur." Ensure your branding is crisp.

*   **Personal Profile Picture:** \`400 x 400 px\`
*   **Personal Background Cover:** \`1584 x 396 px\`
*   **Company Logo:** \`300 x 300 px\`
*   **Company Page Cover:** \`1128 x 191 px\`
*   **Standard Feed Post:** \`1200 x 627 px\` or \`1080 x 1080 px\` for square.

## YouTube Image Sizes (2026)

YouTube thumbnails are perhaps the most important images you will ever create. A great thumbnail dictates your click-through rate (CTR).

*   **Profile Picture / Channel Icon:** \`800 x 800 px\`
*   **Channel Banner / Art:** \`2560 x 1440 px\` (The "safe area" for text and logos visible across all devices is \`1546 x 423 px\` in the direct center).
*   **Video Thumbnail:** \`1280 x 720 px\` (Maximum file size: 2MB)

If your massive, high-res thumbnail is over YouTube's 2MB limit, use our **[Image Compressor](/compress)** to shrink it down without losing the crisp quality.

## How to Quickly Resize Images to Fit

Now that you know the sizes, how do you actually get your images to match without buying expensive software like Photoshop?

You can do it for free in your browser using **OnlineImageShrinker**.

1. Go to the **[Free Image Resizer](/resize)**.
2. Drop your image onto the page.
3. Enter the exact pixel width or height you need (e.g., 1080px).
4. Click download.

That's it. It takes three seconds, requires no login, and your files are processed securely on your own device—we never see your images.

Stop letting bad crop jobs ruin your social media presence. Use the right dimensions, resize if necessary, and post with confidence.`;

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
  const targetSlug = 'social-media-image-sizes-2026';
  
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
    title: 'The Ultimate Guide to Social Media Image Sizes (2026)',
    excerpt: "The complete 2026 cheat sheet for social media image sizes. Find exact dimensions for Facebook, Instagram, X, and LinkedIn. Resize images instantly for free.",
    category: 'Guides',
    date: new Date().toISOString(),
    display_date: 'March 26, 2026',
    read_time: '5 min read',
    image: '/images/blog/social_media_sizes_hero.png',
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
