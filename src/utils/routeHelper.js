import { 
  pdfSizePages, imageResizePages, conversionPages, videoToAudioPages, videoToGifPages,
  socialMediaPages, printReadyPages, passportPages, imageCompressSizePages, ecommercePages, imageOrientationPages 
} from '../data/seoTemplates';

export function getToolDataFromSlug(slug) {
  // Check exact tools first
  const exactTools = {
    'compress-jpeg': { toolId: 'compress', title: 'Compress JPEG Images Online (Free)', desc: 'Reduce JPEG file size by up to 80% without losing quality. Works locally.' },
    'resize-for-instagram': { toolId: 'resize', title: 'Resize Image for Instagram', desc: 'Crop and resize photos to the perfect Instagram dimensions.' },
    'jpg-to-pdf': { toolId: 'pdf', title: 'JPG to PDF Converter Online (Free)', desc: 'Convert JPG, PNG, and WebP images to a single PDF document.' },
    'compress-png': { toolId: 'compress', title: 'Compress PNG Images Online (Free)', desc: 'Reduce PNG file size massively while preserving transparency.' },
    'compress-webp': { toolId: 'compress', title: 'Compress WebP Images Online', desc: 'Optimize WebP images for the web.' },
    'resize-passport-photo': { toolId: 'passport', title: 'Free Passport Photo Maker', desc: 'Create perfect 2x2 or biometric passport photos.' },
    'resize-for-youtube': { toolId: 'crop', title: 'Resize for YouTube Thumbnails (1280x720) - 16:9', desc: 'Create perfect YouTube thumbnails. Crop to 16:9 aspect ratio and resize validation.' },
    'remove-background': { toolId: 'remove-bg', title: 'Free AI Background Remover - Instant & Private', desc: 'Remove image backgrounds automatically with AI. 100% free and works locally in your browser.' },
    'ai-image-upscaler': { toolId: 'upscale', title: 'AI Image Upscaler - Enhance Resolution Free', desc: 'Upscale images up to 4x using AI. Enhance details and quality without uploading files.' },
    'instagram-grid-maker': { toolId: 'grid-splitter', title: 'Instagram Grid Maker - Split Images Online', desc: 'Split your photos into a 3x3 grid for your Instagram profile. Free, watermark-free, and works locally.' },
    'blur-image-online': { toolId: 'redact', title: 'Blur Image Online - Privacy Redactor', desc: 'Blur faces, text, or sensitive information on your images securely. Edits happen in your browser.' },
    'profile-picture-maker': { toolId: 'profile-picture', title: 'Free Profile Picture Maker - Custom & Private', desc: 'Create professional profile pictures for LinkedIn, Instagram, and more. Remove background and add custom colors instantly.' },
    'screenshot-beautifier': { toolId: 'screenshot-beautifier', title: 'Screenshot Beautifier — Add Mockup Frames & Gradient Backgrounds (Free)', desc: 'Turn plain screenshots into polished mockups in seconds. Add Mac-style window frames, gradient backgrounds, shadows & rounded corners. 100% free, no sign-up required.' },
    'exif-remover': { toolId: 'exif', title: 'Free EXIF Data Viewer & Remover - View Metadata', desc: 'View hidden image metadata (GPS, Date, Camera) and remove it instantly. Protect your privacy before sharing photos.' },
    'image-converter-online': { toolId: 'image-converter', title: 'Free Image Converter - JPG, PNG, WebP', desc: 'Convert images between JPG, PNG, and WebP formats online. Secure, fast, and works locally in your browser.' },
    'meme-generator-online': { toolId: 'meme-generator', title: 'Free Meme Generator - Create Viral Memes', desc: 'Make memes online with custom Top and Bottom text. uses the classic Impact font. fast, free, and watermark-free.' },
    'color-palette-generator': { toolId: 'palette-generator', title: 'Free Color Palette Generator - Extract Hex & RGB', desc: 'Extract beautiful color palettes from any image automatically. Get Hex, RGB, and color codes instantly.' },
    'watermark-photos-online': { toolId: 'watermark', title: 'Watermark Photos Online - Free & Private', desc: 'Add text and logo watermarks to your photos securely. Customizable fonts, colors, and opacity. Works locally in your browser.' },
    'collage-maker': { toolId: 'collage-maker', title: 'Free Photo Collage Maker - Join Photos Online', desc: 'Create beautiful photo collages online. Combine images side-by-side or in grids. No watermark, free and private.' },
    'convert-heic-to-jpg': { toolId: 'image-converter', title: 'HEIC to JPG Converter - Free Online', desc: 'Convert HEIC/HEIF photos from iPhone to JPG format. Batch conversion supported.' },
    'magic-eraser': { toolId: 'magic-eraser', title: 'Magic Eraser Online - Remove Unwanted Objects Free', desc: 'Erase unwanted objects, people, or text from photos instantly using AI Inpainting. Free and Private.' },
    'image-to-text': { toolId: 'ocr', title: 'Image to Text Converter - Free OCR Online', desc: 'Extract text from images, scanned documents, or screenshots instantly. 100% free and private OCR using your browser.' },
    'signature-maker': { toolId: 'signature-maker', title: 'Free Online Signature Maker - Create Digital Signatures', desc: 'Draw, type, or upload your signature.' },
    'qr-code-generator': { toolId: 'qr-code-generator', title: 'Free QR Code Generator - Custom Colors & Logos', desc: 'Create custom QR codes with logos, colors, and frames. High resolution PNG downloads. Free and private.' },
    'favicon-generator': { toolId: 'favicon-generator', title: 'Free Favicon Generator - Create Multi-Size Favicons', desc: 'Generate favicons in multiple sizes (16x16 to 512x512) from any image. Free, private, no upload to server.' },
    'svg-to-png': { toolId: 'svg-to-png', title: 'Free SVG to PNG Converter - Any Resolution', desc: 'Convert SVG files to PNG images at any resolution. Choose custom dimensions, transparent backgrounds, and download instantly.' },
    'base64-converter': { toolId: 'base64-converter', title: 'Free Image to Base64 Converter - Encode & Decode', desc: 'Convert images to Base64 strings for HTML, CSS, and JSON embedding. Decode Base64 back to images. 100% private, works in your browser.' },
    'photo-filters-online': { toolId: 'photo-filters', title: 'Free Photo Filters - Online Editor', desc: 'Adjust brightness, contrast, saturation, temperature, and apply beautiful preset filters. 100% free and private.' },
    'compare-images-online': { toolId: 'image-compare', title: 'Compare Images Online - Free Side-by-Side Tool', desc: 'Upload two images and compare them side by side with slider, overlay, or split view. 100% private, works locally in your browser.' },
    'social-media-preview-generator': { toolId: 'social-preview', title: 'Free Social Media Preview Generator - Create Platform-Ready Images', desc: 'Create stunning social media preview images for Twitter, Facebook, LinkedIn, Instagram, and YouTube. Add text overlays, gradients, and download instantly. Free and private.' },
    'blur-faces-online': { toolId: 'blur-face', title: 'Blur Face in Photo Online - Free & Private', desc: 'Blur or pixelate faces, license plates, and sensitive info. 100% client-side, no uploads required.' },
    'rotate-image-online': { toolId: 'rotate-flip', title: 'Rotate & Flip Image Online - Free Tool', desc: 'Rotate images 90°, 180°, custom angles or flip horizontally and vertically. 100% free, private, and works locally in your browser.' },
  };

  if (exactTools[slug]) return exactTools[slug];

  // Dynamic checks based on seoTemplates arrays
  const pdfMatch = pdfSizePages.find(p => `compress-pdf-to-${p.slug}` === slug);
  if (pdfMatch) return { toolId: 'pdf', title: `Compress PDF to ${pdfMatch.size} Online (Free)`, desc: `Instantly reduce PDF file size to ${pdfMatch.size} or less. Works locally in your browser for maximum privacy.` };

  const resizeMatch = imageResizePages.find(p => `resize-image-to-${p.slug}` === slug);
  if (resizeMatch) return { toolId: 'resize', title: `Resize Image to ${resizeMatch.label || resizeMatch.width + 'x' + resizeMatch.height} (Free)`, desc: `Resize JPG, PNG, or WebP images to ${resizeMatch.label || resizeMatch.width + 'x' + resizeMatch.height} pixels instantly. No upload required.` };

  const convMatch = conversionPages.find(p => `convert-${p.slug}` === slug);
  if (convMatch) return { toolId: 'image-converter', title: `Convert ${convMatch.from} to ${convMatch.to} Online (Free)`, desc: `Fastest way to convert ${convMatch.from} images to ${convMatch.to} format. Batch processing supported, 100% private.` };

  const gifMatch = videoToGifPages.find(p => `convert-${p.slug}` === slug);
  if (gifMatch) return { toolId: 'video-to-gif', title: `Convert ${gifMatch.from} to ${gifMatch.to} Online (Free)`, desc: `Make high quality GIFs from ${gifMatch.from} videos without uploading. Control FPS and size.` };

  const audioMatch = videoToAudioPages.find(p => `convert-${p.slug}` === slug);
  if (audioMatch) return { toolId: 'video-to-audio', title: `Convert ${audioMatch.from} to ${audioMatch.to} Online (Free)`, desc: `Extract high quality MP3 audio from ${audioMatch.from} video files. Fast, free, and private.` };

  const socialMatch = socialMediaPages.find(p => `resize-for-${p.slug}` === slug);
  if (socialMatch) return { toolId: socialMatch.toolId, title: `${socialMatch.label} Resizer - Free Online Tool`, desc: `Resize images for ${socialMatch.label} (${socialMatch.width}x${socialMatch.height}) instantly. No watermark, privacy-first.` };
  
  const printMatch = printReadyPages.find(p => `print-${p.slug}` === slug);
  if (printMatch) return { toolId: printMatch.toolId, title: `${printMatch.label} Maker - Free Online`, desc: `Create ${printMatch.label} formatted images instantly. 300 DPI ready for printing. Private & Free.` };

  const passportMatch = passportPages.find(p => `passport-photo-${p.slug}` === slug);
  if (passportMatch) return { toolId: passportMatch.toolId, title: `Free ${passportMatch.label} Maker - Biometric Standard`, desc: `Create valid ${passportMatch.label}s online. AI background removal and correct sizing. 100% Client-side privacy.` };

  const ecoMatch = ecommercePages.find(p => `${p.slug}-image-requirements-checker` === slug);
  if (ecoMatch) return { toolId: ecoMatch.toolId, title: `${ecoMatch.label} Requirements Checker & Creator (Free)`, desc: `Crop and resize your product photos to meet exact ${ecoMatch.label} requirements (${ecoMatch.width}x${ecoMatch.height}). Ready for upload instantly.` };

  const orMatch = imageOrientationPages.find(p => p.slug === slug);
  if (orMatch) return { toolId: orMatch.toolId, title: `${orMatch.label} - Free Online Tool`, desc: `${orMatch.desc} 100% free, private, and works locally in your browser.` };

  const compMatch = imageCompressSizePages.find(p => `compress-image-to-${p.slug}` === slug);
  if (compMatch) return { toolId: 'compress', title: `Compress Image to ${compMatch.size} Online (Free)`, desc: `Reduce image file size to under ${compMatch.size}. Works with JPG, PNG, and WebP. 100% private — no uploads.` };

  return null;
}

export function getAllSlugs() {
  const exactTools = [
    'compress-jpeg', 'resize-for-instagram', 'jpg-to-pdf', 'compress-png', 'compress-webp',
    'resize-passport-photo', 'resize-for-youtube', 'remove-background', 'ai-image-upscaler',
    'instagram-grid-maker', 'blur-image-online', 'profile-picture-maker', 'screenshot-beautifier',
    'exif-remover', 'image-converter-online', 'meme-generator-online', 'color-palette-generator',
    'watermark-photos-online', 'collage-maker', 'convert-heic-to-jpg', 'magic-eraser',
    'image-to-text', 'signature-maker', 'qr-code-generator', 'favicon-generator', 'svg-to-png',
    'base64-converter', 'photo-filters-online', 'compare-images-online', 'social-media-preview-generator',
    'rotate-image-online'
  ];

  const slugs = [
    ...exactTools,
    ...pdfSizePages.map(p => `compress-pdf-to-${p.slug}`),
    ...imageResizePages.map(p => `resize-image-to-${p.slug}`),
    ...conversionPages.map(p => `convert-${p.slug}`),
    ...videoToGifPages.map(p => `convert-${p.slug}`),
    ...videoToAudioPages.map(p => `convert-${p.slug}`),
    ...socialMediaPages.map(p => `resize-for-${p.slug}`),
    ...printReadyPages.map(p => `print-${p.slug}`),
    ...passportPages.map(p => `passport-photo-${p.slug}`),
    ...ecommercePages.map(p => `${p.slug}-image-requirements-checker`),
    ...imageOrientationPages.map(p => p.slug),
    ...imageCompressSizePages.map(p => `compress-image-to-${p.slug}`),
  ];

  return Array.from(new Set(slugs));
}
