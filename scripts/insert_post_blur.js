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

const articleContent = `In an era where digital privacy is more important than ever, sharing photos online carries hidden risks. Whether you're posting a picture that includes bystanders, sharing a document with sensitive information, or protecting a child's identity, knowing how to securely obscure details is an essential digital skill.

Many people turn to a "free online blur tool" to pixelate or blur faces. However, what most users don't realize is that **the vast majority of these free tools require you to upload your sensitive photo to their cloud servers.** This completely defeats the purpose of privacy!

In this guide, we'll explain why cloud-based editing is a privacy risk and show you how to blur faces in photos online for free, ensuring your image *never leaves your device*.

## The Hidden Danger of Cloud Photo Editors

When you use a typical online image editor, the process looks like this:
1. You select a photo from your phone or computer.
2. The image is uploaded over the internet to a third-party server.
3. The server processes the blur effect.
4. You download the edited image back to your device.

The problem lies in step 2. The moment you upload that photo—especially one you are trying to anonymize—you lose control of it. You have to trust that the company will delete it, won't use it to train AI models, and won't suffer a data breach. Furthermore, most original photos contain hidden **EXIF metadata**, which reveals the exact GPS location where the photo was taken, the time, and your device model.

## The Solution: 100% Client-Side Processing

To solve this, we built a [Blur Face Tool](/blur-face) engineered specifically for maximum privacy using a technology called **client-side processing** (via WebAssembly and HTML5 Canvas).

Here is how it is different:
*   **Zero Uploads**: When you open the tool, the "software" downloads into your browser. Your photo is never transmitted over the internet.
*   **Local Processing**: The blurring happens using your device's own processing power (CPU/GPU).
*   **Automatic Sanitization**: When you save the blurred image, our tool automatically strips all of the hidden EXIF GPS and camera metadata, ensuring the final file is completely untraceable.

## Step-by-Step: How to Blur a Face Privately

1.  **Open the Secure Editor**: Go to our free [Blur Face Tool](/blur-face). The entire application runs directly in your web browser without installing anything.
2.  **Select Your Image**: Drag and drop your photo into the work area. Notice how fast it loads? That's because it's not uploading anywhere.
3.  **Apply the Blur**: 
    *   Select the **Blur** or **Pixelate** option.
    *   Drag your mouse or finger over the faces, license plates, or sensitive documents you want to hide.
    *   Adjust the intensity slider until the subject is completely unrecognizable.
4.  **Save the Anonymized Image**: Click the download button. The resulting image is a clean PNG or JPG, completely stripped of any location data or tracking metadata.

## Best Practices for Digital Anonymity

Blurring the face is just step one. If you want to remain truly anonymous online, keep these tips in mind:
*   **Watch for Reflections**: Sunglasses, windows, and mirrors can inadvertently reveal faces or locations.
*   **Crop Out Context**: Sometimes, a unique background (like a specific building or room layout) can identify a location just as easily as a face or GPS tag. Use our [Crop Tool](/crop-image) to tighten the frame around your subject.
*   **Remove Metadata**: Even if you don't need to blur a face, you should always strip location data before posting photos to public forums like Reddit or X. You can use our dedicated [Remove EXIF Data Tool](/remove-exif) for this exact purpose.

Take control of your digital footprint. Start anonymizing your photos securely with our no-upload, browser-based [Privacy Blur Tool](/blur-face) today.`;

async function insertArticle() {  
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const getRes = await fetch(`${supabaseUrl}/rest/v1/blog_posts?select=id,slug`, { headers });
  const existingRecords = await getRes.json();
  const targetSlug = 'how-to-blur-faces-photos-online-private';
  
  if (existingRecords.some(r => r.slug === targetSlug)) {
      console.log(`❌ An article with the slug '${targetSlug}' already exists.`);
      process.exit(0);
  }

  const currentMaxId = existingRecords.length > 0 ? Math.max(...existingRecords.map(r => r.id)) : 0;
  const safeNextId = currentMaxId + 1;

  const payload = {
    id: safeNextId,
    slug: targetSlug,
    title: 'How to Blur Faces in Photos Online (100% Private & Free)',
    excerpt: "Learn how to blur or pixelate faces and hide sensitive information in your photos without uploading them to a server. Our client-side method ensures maximum data privacy.",
    category: 'Privacy',
    date: new Date().toISOString(),
    display_date: 'March 20, 2026',
    read_time: '5 min read',
    image: '/guide-images/hero-privacy-blur.png',
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
  console.log('✅ Successfully published Privacy Blur article!');
}

insertArticle();
