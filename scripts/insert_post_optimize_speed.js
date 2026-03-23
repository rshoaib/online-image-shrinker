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

const articleContent = `Have you ever abandoned a website because it took too long to load? You aren't alone. In 2026, Google's Core Web Vitals strictly penalize slow sites, and studies show that 53% of mobile users will bounce if a page takes longer than 3 seconds to render.

The number one culprit for slow page speeds? **Unoptimized images.**

Uncompressed PNGs and massive JPEGs can easily bloat a single webpage to 5MB or more. If you want to rank higher on Google, pass your Lighthouse audits, and keep your users happy, you **must** optimize your images before uploading them to your CMS.

In this guide, we'll show you exactly how to aggressively compress images without losing visual quality, and how to do it instantly, securely, and for free.

---

## 1. Choose the Right Format

Before you even compress an image, you must choose the correct file format. The format you pick dictates both the file size and the visual quality.

*   **JPEG / JPG:** Best for photographs and images with thousands of colors. JPEGs use "lossy" compression, meaning they discard data to shrink the file size.
*   **PNG:** Best for graphics, screenshots containing text, and images requiring transparency. PNGs use "lossless" compression, meaning the quality is perfect, but the file size is significantly larger.
*   **WebP:** The MODERN standard. Developed by Google, WebP provides superior lossless and lossy compression. You can often drop a 1MB PNG down to a 150KB WebP with zero noticeable loss in quality.
*   **SVG:** Use exclusively for vectors (logos, icons). SVGs are infinitely scalable math equations, meaning they look perfectly crisp on any screen while taking up practically zero bandwidth.

**Pro Tip:** If your site uses a lot of PNG assets, run them through our [PNG to WebP Converter](/png-to-webp) to instantly slice your bandwidth usage in half.

---

## 2. Resize to Exact Dimensions

The biggest mistake web developers make is uploading a 4000x3000 pixel image direct from a smartphone and then relying on CSS (\`max-width: 100%\`) to scale it down to fit a 400px column.

The browser still has to download the massive original file, completely ruining your page load speed.

Before compressing, you need to physically resize the image to the exact dimensions it will be displayed at. If your blog's content width is 800px, **do not upload an image wider than 800px** (or 1600px for Retina display compatibility). 

Use our free [Image Resizer Tool](/resize) to quickly lock your aspect ratio and scale your photos down to the exact pixel width you need.

---

## 3. Aggressively Compress Online (For Free)

Once your image is properly formatted and resized, it's time to compress it. Compression strips out invisible metadata, optimizes the color palette, and smoothly scales down the bitrate.

You don't need expensive software like Adobe Photoshop to do this. You can do it directly in your browser using our [Free Online Image Compressor](/compress).

### Why Our Compressor is Different
Most free compression sites (like TinyPNG) require you to upload your files to their servers. This takes time, eats your personal bandwidth, and limits how many files you can compress for free before they hit you with a paywall. 

We built our compressor differently:
*   **100% Client-Side:** Using advanced WebAssembly (Wasm), the compression algorithms run directly on your device's CPU.
*   **Zero Uploads:** Your images never touch our servers, meaning maximum privacy and lightning-fast speeds.
*   **No File Limits:** Compress 1 file or 1,000 files. We have no backend costs, so we don't need to charge you.

### How to Compress
1. Open up the [Image Compressor](/compress).
2. Drag and drop your images onto the page.
3. Use the slider to balance **Quality** vs **File Size**. For JPEGs, a quality setting around 75-80% usually reduces the file size by 60% with almost no visible degradation.
4. Download your newly optimized images instantly.

---

## 4. Implement Lazy Loading

Now that your images are heavily optimized down to tens of kilobytes, there is one final step when coding your website: **Lazy Loading**.

By default, a browser tries to download every single image on a page as soon as it loads. If you have 20 images below the fold (where the user can't see them yet), the browser wastes precious seconds downloading them instead of rendering the text.

Modern HTML5 makes lazy loading incredibly simple. Just add the \`loading="lazy"\` attribute to your image tags:

\`\`\`html
<img src="optimized-hero.webp" alt="Fast loading hero image" loading="lazy" width="800" height="400" />
\`\`\`

*(Always include \`width\` and \`height\` attributes to prevent layout shift!)*

## Conclusion

Optimizing images for the web isn't an optional step—it is a mandatory requirement for SEO and User Experience in 2026. 

By resizing your assets, switching to WebP, compressing your files locally, and utilizing lazy loading, you can easily shave seconds off your page load time. Start optimizing today using our suite of **[free, privacy-first image tools](/)**.`;

async function insertArticle() {  
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const getRes = await fetch(`${supabaseUrl}/rest/v1/blog_posts?select=id,slug`, { headers });
  const existingRecords = await getRes.json();
  const targetSlug = 'how-to-optimize-images-for-website-speed';
  
  if (existingRecords.some(r => r.slug === targetSlug)) {
      console.log(`❌ An article with the slug '${targetSlug}' already exists.`);
      process.exit(0);
  }

  const currentMaxId = existingRecords.length > 0 ? Math.max(...existingRecords.map(r => r.id)) : 0;
  const safeNextId = currentMaxId + 1;

  const payload = {
    id: safeNextId,
    slug: targetSlug,
    title: 'How to Optimize Images for Website Speed (2026 Guide)',
    excerpt: 'Slow websites destroy SEO and conversions. Learn the exact 4-step process to perfectly resize, format, and heavily compress your images for the web using free, zero-upload tools.',
    category: 'Optimization',
    date: '2026-03-24T00:00:00.000Z',
    display_date: 'March 24, 2026',
    read_time: '6 min read',
    image: '/guide-images/image-optimization-speed-hero.png',
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
  console.log('✅ Successfully published Image Optimization article!');
}

insertArticle();
