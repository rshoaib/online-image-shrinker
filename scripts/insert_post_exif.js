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

const articleContent = `Every time you take a photo with your smartphone or digital camera, the device records more than just the image itself. Hidden inside the image file is a payload of hidden information known as EXIF data.

If you have ever wondered how your phone knows exactly where a photo was taken, or what time it was shot down to the exact second, the answer is EXIF data. While this information is incredibly useful for organizing your photo library, it can become a serious privacy risk when you share that photo online.

In this guide, we'll explain exactly what EXIF data is, why it matters, and how you can view and remove it for free.

## What is EXIF Data?

EXIF stands for **Exchangeable Image File Format**. It is a standard format for storing metadata (data about data) within image files, most commonly in JPEG, TIFF, and WebP formats.

Think of EXIF data as a digital footprint attached to the back of a physical photograph. When the camera shutter clicks, the device instantly writes a vast amount of technical and situational data into the image file itself.

### What Kind of Information is Stored in EXIF Data?

The amount of data recorded depends on the device, but a standard smartphone photo will typically include:

*   **Date and Time:** the exact moment the photo was taken or modified.
*   **Device Information:** the make and model of the camera or smartphone used (e.g., "Apple iPhone 15 Pro").
*   **Camera Settings:** technical details like aperture, shutter speed, ISO, focal length, and whether the flash fired.
*   **GPS Coordinates:** the exact latitude and longitude of where the photo was taken (if location services were enabled).
*   **Software Information:** the operating system version or the software used to edit the image (e.g., Photoshop).

## Why EXIF Data Can Be a Privacy Risk

For professional photographers or hobbyists, EXIF data is a fantastic learning tool. By reviewing the metadata of a great shot, you can see exactly which camera settings were used to capture it.

However, for the average user sharing photos on social media, dating apps, or forums, EXIF data—specifically the GPS coordinates—presents a hidden danger. 

If you take a photo of your new dog in your living room and upload the raw file to a public forum, anyone who downloads that image can extract the EXIF data. Within seconds, they can plug the hidden GPS coordinates into Google Maps and find your exact home address.

*Note: Major social media platforms like Instagram and Facebook automatically strip EXIF data when you upload photos, but smaller forums, personal blogs, email attachments, and direct messaging apps often do not.*

## How to View and Remove EXIF Data for Free

Before you share a sensitive photo online, it is best practice to scrub the EXIF data. 

Because we believe in digital privacy, we built a **[Free EXIF Data Viewer and Remover](/exif)** that works entirely in your web browser. 

### Why Use a Client-Side Tool?

If you search for "EXIF data remover online," many websites require you to upload your photo to their servers to strip the metadata. This defeats the purpose of privacy! You are handing over your photo and its location data to a stranger's server.

Our [EXIF tool](/exif) uses client-side processing. Your image never leaves your device. The code runs entirely within your browser to analyze the file, display the hidden data, and strip it away completely locally.

### Step-by-Step Guide:

1.  **Open the Tool:** Go to our [EXIF Viewer and Remover](/exif).
2.  **Select Your Image:** Drag and drop your photo into the browser.
3.  **View the Data:** Instantly see exactly what hidden information is stored in the file, including a map pinpointing the GPS location (if available).
4.  **Remove it:** Click the "Remove EXIF Data" button. The tool will instantly generate a new, clean version of your image with all metadata stripped out.
5.  **Download:** Save the scrubbed image safely to your device.

Take control of your digital footprint today. Start regularly scrubbing your photos of hidden location data before sharing them online to protect your privacy and your identity.`;

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
  const targetSlug = 'what-is-exif-data-in-photos';
  
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
    title: 'What is EXIF Data in Photos? (And Why You Should Delete It)',
    excerpt: "Every photo you take contains hidden metadata, including the exact GPS location of where you were. Learn what EXIF data is, why it is a privacy risk, and how to instantly remove it for free in your browser.",
    category: 'Privacy',
    date: new Date().toISOString(),
    display_date: 'March 29, 2026',
    read_time: '4 min read',
    image: '/images/blog/exif-guide-hero.png',
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
