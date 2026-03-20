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
const headers = {
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// Fixed blur article content with correct internal links
const blurContent = `In an era where digital privacy is more important than ever, sharing photos online carries hidden risks. Whether you're posting a picture that includes bystanders, sharing a document with sensitive information, or protecting a child's identity, knowing how to securely obscure details is an essential digital skill.

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

To solve this, we built a [Blur Face Tool](/blur-faces-online) engineered specifically for maximum privacy using a technology called **client-side processing** (via WebAssembly and HTML5 Canvas).

Here is how it is different:
*   **Zero Uploads**: When you open the tool, the "software" downloads into your browser. Your photo is never transmitted over the internet.
*   **Local Processing**: The blurring happens using your device's own processing power (CPU/GPU).
*   **Automatic Sanitization**: When you save the blurred image, our tool automatically strips all of the hidden EXIF GPS and camera metadata, ensuring the final file is completely untraceable.

## Step-by-Step: How to Blur a Face Privately

1.  **Open the Secure Editor**: Go to our free [Blur Face Tool](/blur-faces-online). The entire application runs directly in your web browser without installing anything.
2.  **Select Your Image**: Drag and drop your photo into the work area. Notice how fast it loads? That's because it's not uploading anywhere.
3.  **Apply the Blur**: 
    *   Select the **Blur** or **Pixelate** option.
    *   Drag your mouse or finger over the faces, license plates, or sensitive documents you want to hide.
    *   Adjust the intensity slider until the subject is completely unrecognizable.
4.  **Save the Anonymized Image**: Click the download button. The resulting image is a clean PNG or JPG, completely stripped of any location data or tracking metadata.

## Best Practices for Digital Anonymity

Blurring the face is just step one. If you want to remain truly anonymous online, keep these tips in mind:
*   **Watch for Reflections**: Sunglasses, windows, and mirrors can inadvertently reveal faces or locations.
*   **Crop Out Context**: Sometimes, a unique background (like a specific building or room layout) can identify a location just as easily as a face or GPS tag. Use our [Crop Tool](/tool/crop) to tighten the frame around your subject.
*   **Remove Metadata**: Even if you don't need to blur a face, you should always strip location data before posting photos to public forums like Reddit or X. You can use our dedicated [EXIF Remover Tool](/exif-remover) for this exact purpose.

Take control of your digital footprint. Start anonymizing your photos securely with our no-upload, browser-based [Privacy Blur Tool](/blur-faces-online) today.`;

// Fixed favicon article content with correct internal links
const faviconContent = `Every website needs a favicon. It's the small icon that appears in the browser tab, in bookmark lists, and on a user's mobile home screen. While it seems like a tiny detail, a well-implemented favicon is crucial for brand recognition and a polished, professional user experience. 

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

1.  **Prepare your source image**: Ensure your logo is perfectly square. It should ideally be at least 512x512 pixels with a transparent background. If it isn't square, you can easily use our [Crop Tool](/tool/crop) to fix the aspect ratio first.
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

Pro tip: After uploading your new favicons, you can also use our free [Image Compressor](/tool/compress) to squeeze the PNG files even smaller before deploying — every kilobyte counts for page speed!

Ready to polish your UI? Generate your icons instantly with our 100% free, developer-friendly [Favicon Generator](/favicon-generator).`;

async function updateArticle(slug, content) {
  const res = await fetch(`${supabaseUrl}/rest/v1/blog_posts?slug=eq.${slug}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ content })
  });
  if (!res.ok) {
    console.error(`❌ Failed to update ${slug}:`, await res.text());
  } else {
    console.log(`✅ Updated ${slug}`);
  }
}

await updateArticle('how-to-blur-faces-photos-online-private', blurContent);
await updateArticle('developer-guide-favicon-ico-generator', faviconContent);
