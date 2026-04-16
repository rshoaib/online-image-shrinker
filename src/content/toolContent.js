import { getConversionContent } from './conversionContent';

/**
 * Per-tool long-form content for SEO landing pages.
 *
 * Purpose: give each tool page ~500-700 words of unique body content so it
 * isn't flagged as "low value" (AdSense policy) or thin/duplicate (GSC).
 *
 * Shape per entry:
 *   intro:     1-2 paragraphs that expand on the hero description
 *   sections:  [{ heading, body }] — 2-3 content blocks (why/when/how)
 *   useCases:  [{ title, body }] — short concrete scenarios
 *   faq:       [{ q, a }] — 4-6 Q&A pairs, also rendered as FAQPage JSON-LD
 *   metaDesc:  optional per-tool meta description override (<155 chars)
 *
 * Tools without an entry here fall back to the hero title + description only.
 * Add entries as content is written — the UI renders nothing for missing keys.
 *
 * Content is keyed by the canonical identifier used by SeoLandingPageClient:
 *   - /tool/<toolId> pages pass the toolId (e.g. 'remove-bg')
 *   - /<slug> pages pass the slug (e.g. 'remove-background')
 * Both forms resolve to the same tool, so we key by toolId and also map slugs.
 */

export const TOOL_CONTENT = {
  'remove-bg': {
    metaDesc:
      'Remove image backgrounds free in your browser. AI-powered, 100% private — your photos never leave your device. Export as transparent PNG.',
    intro:
      'Cut out the background from any photo in seconds — right in your browser. **No uploads, no signup, no watermark.** The AI model runs locally on your device, so your images stay private. Export a clean, transparent PNG ready for product listings, profile pictures, social posts, or design work.',
    sections: [
      {
        heading: 'Why use a browser-based background remover?',
        body:
          "Most background-remover tools upload your photo to their servers, compress it, and send it back with a watermark or a credit limit. That's slow, it leaks your images through someone else's logs, and it often costs money per image. This tool runs the cutout model right on your device. Nothing touches a server. You can process hundreds of images back-to-back without hitting a quota, and the output is a full-resolution transparent PNG every time.",
      },
      {
        heading: 'How the background removal works',
        body:
          "When you drop in a photo, a lightweight AI segmentation model loads in your browser and predicts which pixels belong to the subject (person, product, pet, object) and which belong to the background. The subject is kept; the background becomes transparent. It works best on photos with a clear subject and reasonable contrast, but it handles tricky edges like hair and fur better than a plain color-key. The result downloads instantly as a PNG with an alpha channel — drop it onto any color or image without a halo.",
      },
      {
        heading: 'Tips for the cleanest cutout',
        body:
          "A few quick wins: **shoot against a contrasting background** (light subject on dark, or vice versa), **avoid motion blur**, and **keep the subject in focus**. If your photo has multiple people or objects, the model will try to keep all of them. For complex product photos with reflective surfaces, start with a well-lit original. After exporting the PNG, you can drop it into our [photo editor](/photo-filters-online) to add a new background color or composite it over another image.",
      },
    ],
    useCases: [
      {
        title: 'Product photos for online stores',
        body:
          'Turn messy phone shots into clean product images on a white or transparent background. Works for Shopify, Etsy, eBay, Amazon, and WooCommerce listings.',
      },
      {
        title: 'Profile pictures and headshots',
        body:
          'Strip the background from a headshot to drop it onto a branded color for LinkedIn, Slack, or your team page.',
      },
      {
        title: 'Designs, memes, and thumbnails',
        body:
          'Grab the subject from any photo and paste it into a design, a meme, a YouTube thumbnail, or a presentation slide.',
      },
      {
        title: 'Pet and family photos',
        body:
          'Isolate your dog, cat, or kid from a cluttered room so you can print a clean portrait or make a greeting card.',
      },
    ],
    faq: [
      {
        q: 'Is this background remover really free?',
        a: 'Yes — free, unlimited, no signup, no watermark. The tool runs entirely in your browser, so we have no server costs to pass on to you.',
      },
      {
        q: 'Are my photos uploaded anywhere?',
        a: "No. Everything happens on your device. Your photos never leave your browser, and nothing is saved on our side. If you're offline after the page loads, it still works.",
      },
      {
        q: 'What image formats are supported?',
        a: 'You can drop in JPG, PNG, WebP, and HEIC. The output is always a PNG with a transparent background so it composites cleanly onto any design.',
      },
      {
        q: 'How good is the AI cutout compared to Remove.bg or Photoshop?',
        a: 'For most photos — people, pets, products, objects with clear edges — the result is comparable to paid tools. Very fine detail like wispy hair or transparent glass can still be tricky; for those cases a manual tool like Photoshop will still do better.',
      },
      {
        q: 'Does it work on my phone?',
        a: 'Yes. It runs in mobile Chrome, Safari, and Firefox. Larger photos may take a few more seconds on mobile because the model is doing the work on your phone instead of on a server.',
      },
      {
        q: 'Can I remove backgrounds in bulk?',
        a: 'Drop multiple images in at once and process them one after another — there are no per-image limits. For huge batches, splitting them across a few browser tabs keeps things snappy.',
      },
    ],
  },

  'upscale': {
    metaDesc:
      'AI upscale images free in your browser. Enlarge 2x or 4x with sharper detail. 100% private — your photos stay on your device.',
    intro:
      'Enlarge and sharpen any image with AI — right in your browser. **No uploads, no signup, no watermark.** The upscaler model runs on your device, so your originals stay private. Get crisp 2x or 4x output with recovered edges, cleaner text, and less of the soft mush you normally get from a plain resize.',
    sections: [
      {
        heading: 'Why upscale in your browser?',
        body:
          "Server-based upscalers push your photos to a cloud GPU, queue them behind other users, slap on a watermark, and cap you at a handful of free images a day. This tool runs the model on your own device. Nothing leaves your browser. You can throw a dozen thumbnails at it back-to-back without burning credits, and the output is the full high-res result — no watermark, no resolution cap beyond what your device can handle.",
      },
      {
        heading: 'How AI upscaling beats a plain resize',
        body:
          "A normal resize just stretches pixels. Lines get soft. Text turns mushy. Hair goes to fuzz. The AI upscaler predicts what the missing detail *should* look like — sharper edges on objects, crisper text, plausible texture on skin and fabric. The trade-off is that it can invent detail that wasn't in the original, so for anything where you need pixel-perfect fidelity (forensics, medical, legal), a plain resize is safer. For photos, screenshots, logos, and AI-art output, the AI version looks dramatically better.",
      },
      {
        heading: 'When upscaling works best',
        body:
          "Great inputs: low-res product photos, old scanned family pictures, game screenshots, thumbnail-sized AI-generated images, small logos you need to print bigger. Tougher inputs: images that are already very compressed (heavy JPEG artifacts confuse the model), photos that are motion-blurred (the model can sharpen, but it can't un-blur a missed focus), and scans of printed halftone dots. If your source has heavy banding, run it through the [photo filters](/photo-filters-online) to smooth tone first, then upscale.",
      },
    ],
    useCases: [
      {
        title: 'Rescue low-res product photos',
        body:
          'Take a small supplier image and bump it to a clean 2000px hero shot for your Shopify or Etsy listing without the pixelated look.',
      },
      {
        title: 'Old family scans and print shop prep',
        body:
          'Scan a small photo at 600 DPI and upscale to a printable 8x10 without the soft, blurry result a plain resize gives you.',
      },
      {
        title: 'Social media and YouTube thumbnails',
        body:
          'Starting from a 512x512 AI image? Upscale 4x so it stays sharp at 1920x1080 on a thumbnail or cover image.',
      },
      {
        title: 'Logos and icons for print',
        body:
          'Small raster logo that needs to go on a sign or a t-shirt? Upscale it, then run [SVG to PNG](/svg-to-png) if you need a different format.',
      },
    ],
    faq: [
      {
        q: 'Is this AI upscaler really free?',
        a: 'Yes — free, unlimited, no watermark, no signup. The model runs in your browser, so there are no per-image costs to pass on to you.',
      },
      {
        q: 'Are my images uploaded to your servers?',
        a: "No. Everything runs on your device. Your images never leave your browser, and nothing is stored on our side. Once the page has loaded you can even work offline.",
      },
      {
        q: 'How big can I go — 2x, 4x, 8x?',
        a: '2x and 4x are the standard options and give the best balance of detail and realism. Going beyond 4x is possible by running the tool twice, but diminishing returns kick in — the second pass is upscaling invented detail.',
      },
      {
        q: 'Will it work on my phone?',
        a: 'Yes — on a modern phone, 2x upscaling on typical photos takes a few seconds. Very large inputs at 4x can take 30+ seconds on mobile because the model is doing real work on your device.',
      },
      {
        q: 'Is this better than Topaz Gigapixel or Photoshop Super Resolution?',
        a: 'For most everyday photos the result is close. Topaz is still stronger on very demanding inputs like heavily compressed or noisy source material, but it costs money and uploads your images. For free, private upscaling this tool handles the vast majority of cases.',
      },
      {
        q: 'What formats can I upscale?',
        a: 'JPG, PNG, and WebP. Output is a PNG by default to avoid re-compressing. If you need a smaller file for the web, run the upscale result through our [image compressor](/tool/compress) next.',
      },
    ],
  },

  'compress': {
    metaDesc:
      'Compress JPG, PNG, and WebP images free online. Shrink file size 60-90% without visible quality loss. Private — runs in your browser.',
    intro:
      'Shrink image files without sinking quality. **Runs entirely in your browser** — no uploads, no signup, no size limits. Drop in any JPG, PNG, or WebP and pull out a file that is 60-90% smaller but still looks the same at normal viewing sizes. Pages load faster, emails send quicker, and you stop burning storage on oversized photos.',
    sections: [
      {
        heading: 'Why smaller images matter',
        body:
          "Images are the single biggest thing on most web pages. A page with 10MB of uncompressed photos feels slow even on fast internet, and mobile users often give up before it finishes. Smaller images mean **faster pages**, better Core Web Vitals, lower hosting bills, and happier visitors. For email, a compressed attachment is more likely to actually reach the inbox — many providers reject or delay messages over 10MB. And if you back up photos to cloud storage, compression means you fit more in the same plan.",
      },
      {
        heading: 'How the compressor keeps things looking good',
        body:
          "This tool uses modern browser encoders (MozJPEG, libvips-style resampling, WebP via the browser's built-in encoder). For JPGs and WebPs it adjusts the quality level to drop imperceptible detail — the kind your eye can't tell is missing — while keeping edges and color fidelity intact. For PNGs with a limited palette, it quantizes colors without introducing visible banding. The output is a regular image file any app can open. Nothing proprietary, nothing server-side.",
      },
      {
        heading: 'JPG vs PNG vs WebP — what to pick',
        body:
          "**JPG** is best for photos and anything with smooth gradients. **PNG** is best when you need a transparent background (logos, icons, cutouts from our [background remover](/remove-background)). **WebP** is the modern middle ground — it beats JPG on photos and PNG on graphics, and every modern browser supports it. If your platform accepts WebP (most do now), it's the smallest option. If you need maximum compatibility or the destination is a printer, stick with JPG for photos and PNG for graphics.",
      },
    ],
    useCases: [
      {
        title: 'Website and blog hero images',
        body:
          'Compress before uploading to WordPress, Shopify, Webflow, or Ghost. Instant payoff: faster Lighthouse scores and better SEO.',
      },
      {
        title: 'Email attachments that actually send',
        body:
          'Shrink a 12MB photo down to 1-2MB so it clears Gmail and Outlook limits without the quality hit of forwarding a screenshot.',
      },
      {
        title: 'Social media uploads',
        body:
          'Compress before posting to avoid the heavy re-encode Instagram or Twitter applies, which often leaves photos looking worse than if you pre-compressed.',
      },
      {
        title: 'Storage cleanup',
        body:
          'Run your camera roll through batch compression and reclaim tens of gigabytes without losing photos you want to keep.',
      },
    ],
    faq: [
      {
        q: 'Is there a file size limit?',
        a: "No hard limit. Because everything runs in your browser, the ceiling is just your device's memory. Most phones handle 50MB input files fine; laptops handle 200MB+ without breaking a sweat.",
      },
      {
        q: 'How much can I shrink a file without visible quality loss?',
        a: 'For a typical phone photo (4-8MB JPG), 60-80% savings is normal with no visible difference at screen sizes. Going past 90% usually starts to show blocky artifacts in smooth areas like sky or skin.',
      },
      {
        q: 'Does it work on transparent PNGs?',
        a: 'Yes — transparency is preserved. If your PNG is mostly a single subject on transparent background, try converting to WebP for an even smaller file that keeps the alpha channel.',
      },
      {
        q: 'Can I compress a batch of images at once?',
        a: 'Drop multiple files in and they process one after another. There are no per-image limits and no queue.',
      },
      {
        q: 'Are my images uploaded?',
        a: "No. Compression runs entirely in your browser using built-in encoders. Your files never leave your device.",
      },
      {
        q: "Why does my compressed photo look slightly different?",
        a: "Lossy compression removes detail your eye is unlikely to notice — that's how it achieves those size savings. At very high compression ratios, soft gradients can start to show banding. If you spot artifacts, try a higher quality setting or switch to WebP.",
      },
    ],
  },

  'resize': {
    metaDesc:
      'Resize images free online. Change width, height, or aspect ratio in pixels, inches, or percentage. Private — runs in your browser.',
    intro:
      'Resize any image to the exact size you need — pixels, percentage, or common presets. **No uploads, no signup, no watermark.** Pick the dimensions, keep or break the aspect ratio, and export a clean file ready for your site, social post, or print job. Everything runs in your browser so your photos stay on your device.',
    sections: [
      {
        heading: 'Pixel-perfect resizing in your browser',
        body:
          "Most resizers online upload your photo, re-encode it on their server, and hand you back something slightly worse than what you started with. This tool uses your browser's native image pipeline — the same high-quality resampling your OS uses — so you get a clean downscale every time. Type in the width and height you want, or pick a preset like 1080x1080 for Instagram or 1920x1080 for YouTube, and the result downloads instantly.",
      },
      {
        heading: 'Aspect ratio: lock it or break it',
        body:
          "By default, resizing keeps the original aspect ratio so your image doesn't squish. If you need a specific ratio (1:1 for a profile picture, 16:9 for a thumbnail, 9:16 for a story), you can lock that ratio and the tool will either letterbox or crop to fit. If you need to cut away edges rather than letterbox, switch to the [crop tool](/tool/crop) instead, which gives you a framed preview.",
      },
      {
        heading: 'Upscaling vs downscaling',
        body:
          "Downscaling (going smaller) is always clean — the browser has more pixels than it needs, so it averages them down with no quality loss. Upscaling (going larger) via plain resize gets soft fast because pixels are being stretched. If you need to enlarge, use the [AI upscaler](/ai-image-upscaler) instead — it predicts detail the resampler can't invent. For downscales and same-size aspect-ratio changes, this resizer is the right tool.",
      },
    ],
    useCases: [
      {
        title: 'Fit platform-specific image dimensions',
        body:
          'LinkedIn banners, Facebook covers, Instagram squares, Twitter headers — pick a preset or type the exact pixels and get a ready-to-upload file.',
      },
      {
        title: 'Email attachment prep',
        body:
          'A 4000x3000 phone photo is overkill for email. Resize to 1600px wide and the attachment shrinks by 80% with no visible loss on screen.',
      },
      {
        title: 'Web and blog uploads',
        body:
          'Match the max width of your blog column (usually 1200-1600px) so images look sharp without bloating page weight.',
      },
      {
        title: 'Print and photo prep',
        body:
          'Resize to a specific inch-at-300-DPI size for a print shop — 2400x3000 for an 8x10 at 300 DPI, for example.',
      },
    ],
    faq: [
      {
        q: 'Will my image lose quality?',
        a: 'Going smaller: essentially no loss. Going to the same size or bigger: a plain resize gets soft. For upscaling, use the AI upscaler instead.',
      },
      {
        q: 'Can I resize by percentage instead of pixels?',
        a: "Yes — type a percentage (e.g. 50%) and the tool scales both dimensions proportionally.",
      },
      {
        q: 'Does it keep the file format the same?',
        a: 'Yes by default — a resized JPG stays a JPG, a PNG stays a PNG. You can also change format on export, or use the [image converter](/image-converter-online) if you need a specific output type.',
      },
      {
        q: 'Are there any size limits?',
        a: 'No hard limits. Your device memory is the only ceiling. Even a 50MP phone photo resizes in a second or two on a laptop.',
      },
      {
        q: 'Is there a watermark on the result?',
        a: 'No. The tool is free and watermark-free. Everything runs locally so we have no server costs to offset.',
      },
      {
        q: 'Does it support PNG transparency?',
        a: 'Yes — transparency is preserved through the resize. The alpha channel is treated the same as the color channels.',
      },
    ],
  },

  'crop': {
    metaDesc:
      'Crop images free online. Freeform or fixed-ratio cropping with pixel-accurate preview. Private — runs in your browser, no uploads.',
    intro:
      'Crop any photo to the exact frame you want — freeform or locked to a ratio. **No uploads, no signup, no watermark.** Drag the handles, watch the live preview, and export a clean image ready for the destination you have in mind. The whole thing runs in your browser, so your photos stay on your device.',
    sections: [
      {
        heading: 'Why crop in your browser?',
        body:
          "Server-based croppers re-encode your image on their end, which costs a small amount of quality every time and sends the original off your device. This tool crops using the original pixels in place — you pick the rectangle, the result is a clean cut of the same bit-depth image, and nothing gets uploaded. That matters if you're editing personal photos, internal screenshots, or anything you'd rather not ship to a third party.",
      },
      {
        heading: 'Freeform crop vs fixed ratio',
        body:
          "Freeform lets you drag any rectangle. Fixed-ratio locks the crop to a specific shape — 1:1 for a profile picture, 4:5 for an Instagram portrait, 16:9 for a YouTube thumbnail, 9:16 for a story or reel. Fixed-ratio is the one to use whenever the destination has a known shape, because it guarantees you won't upload a photo that gets re-cropped by the platform in a way you don't like.",
      },
      {
        heading: 'Crop, then resize, then compress',
        body:
          "A clean image-prep workflow is crop → resize → compress. Crop frames the shot. [Resize](/tool/resize) hits the target pixel dimensions. [Compress](/tool/compress) shrinks the file for upload. Doing them in that order gives the smallest file for a given visible quality, because you're never compressing pixels you were about to throw away. All three tools run locally and chain cleanly.",
      },
    ],
    useCases: [
      {
        title: 'Profile pictures',
        body:
          'Lock to 1:1, drag the frame over the face you want, export a clean square for LinkedIn, Slack, or a team page.',
      },
      {
        title: 'YouTube and blog thumbnails',
        body:
          'Lock to 16:9, grab the dramatic part of the photo, export at 1920x1080 ready for upload.',
      },
      {
        title: 'Instagram portrait and story',
        body:
          '4:5 for a portrait in-feed post, 9:16 for a story or reel. The preview shows exactly what Instagram will show.',
      },
      {
        title: 'Remove distracting edges',
        body:
          "Tight crops make almost any phone photo look better — cut out the cluttered background and the subject pops.",
      },
    ],
    faq: [
      {
        q: 'Does cropping reduce quality?',
        a: "No. Cropping just selects a region of the original pixels. There's no re-encoding or scaling, so the cropped area is identical in quality to the original.",
      },
      {
        q: 'Can I crop a PNG with transparency?',
        a: 'Yes — transparency is preserved. The alpha channel is carried through untouched.',
      },
      {
        q: 'Can I lock to a specific pixel size, not just a ratio?',
        a: "Yes — type the target width and height and the tool constrains the crop box to that exact shape. Useful when the destination expects exactly 1200x630 (Open Graph) or 800x800 (shop listing).",
      },
      {
        q: 'What formats are supported?',
        a: 'JPG, PNG, WebP, and HEIC inputs. Output matches the input format by default, or you can export to PNG if you want to preserve the crop without any extra compression.',
      },
      {
        q: 'Are my photos uploaded?',
        a: "No. Everything runs in your browser. Nothing is sent to our servers and nothing is stored.",
      },
      {
        q: 'Is there a max file size?',
        a: 'No hard limit — your device memory is the ceiling. Even 50MP+ phone photos crop in a second on modern hardware.',
      },
    ],
  },

  'pdf': {
    metaDesc:
      'Convert images to PDF free online. JPG, PNG, WebP, HEIC to PDF with multiple pages. Private — runs in your browser, no uploads.',
    intro:
      'Turn images into a PDF without uploading them anywhere. **Drop in one or many photos, reorder, and export a single PDF** in seconds. Runs entirely in your browser so your documents stay on your device — important when you are turning screenshots of contracts, IDs, or personal notes into a PDF.',
    sections: [
      {
        heading: 'Why local image-to-PDF matters',
        body:
          "The most common reason people convert images to PDF is paperwork — insurance forms, loan applications, tax documents, school enrollment. Those photos often contain personally identifying information you should not be uploading to a random free tool. This converter never sends your images anywhere. Assembly happens in your browser using a client-side PDF library, and the resulting PDF file is handed back to you as a direct download. **Nothing is stored on our side.**",
      },
      {
        heading: 'Multi-page PDFs and page order',
        body:
          "Drop in several images and they become pages in the order you arrange them. Drag to reorder, rotate individual pages, and pick a page size (A4, US Letter) if the PDF is headed to a printer. The tool preserves the original image resolution inside the PDF, so text in document photos stays readable when someone zooms in. If you want to make the images searchable first, run them through the [image-to-text OCR tool](/image-to-text) and copy the transcribed text into the filename or a separate doc.",
      },
      {
        heading: 'File-size tips',
        body:
          "A PDF of uncompressed phone photos can balloon past 20MB fast, which is often rejected by email and portal uploads. Two quick fixes: **compress each image first** using the [image compressor](/tool/compress), and **resize photos to print size** (2000px wide is plenty for a full-page scan) using [resize](/tool/resize). Together they typically cut PDF size by 80% with no visible loss when the file is read on screen.",
      },
    ],
    useCases: [
      {
        title: 'Scanned forms and contracts',
        body:
          'Photograph each page on your phone, drop the images in, export a single PDF that can be emailed or uploaded to a portal.',
      },
      {
        title: 'Receipt packs for expenses',
        body:
          'Combine a week of receipt photos into one PDF, named by date range, ready to attach to an expense report.',
      },
      {
        title: 'ID and document submissions',
        body:
          "Combine the front and back of an ID into one two-page PDF in the exact order the portal expects. Stays on your device.",
      },
      {
        title: 'Portfolios and photo books',
        body:
          'Turn a set of finished images into a branded PDF to share with a client or print as a booklet.',
      },
    ],
    faq: [
      {
        q: 'Can I combine different image formats into one PDF?',
        a: 'Yes — mix JPG, PNG, WebP, and HEIC in the same PDF. The converter normalises each into an embedded image the reader can handle.',
      },
      {
        q: 'Does the PDF preserve original resolution?',
        a: "Yes — images are embedded at full resolution by default, so the PDF looks sharp when zoomed. If file size matters more than pixel-perfect scans, downsize the images first.",
      },
      {
        q: 'Can I pick the page size?',
        a: 'Yes — A4, US Letter, Legal, or a size that matches the image. Pick the one that matches where the PDF is going.',
      },
      {
        q: 'Are my images uploaded anywhere?',
        a: "No. The PDF is built in your browser using a client-side library. Nothing touches our servers.",
      },
      {
        q: 'Is the resulting PDF searchable?',
        a: 'By default it contains images, not searchable text. For searchable PDFs, run the images through OCR first with the [image-to-text tool](/image-to-text) and paste the text into a separate document.',
      },
      {
        q: 'Can I password-protect the PDF?',
        a: "Not in this tool. For passworded PDFs we recommend running the PDF through a dedicated desktop tool like Preview (macOS) or Adobe Acrobat, which will lock it without re-uploading.",
      },
    ],
  },

  'photo-filters': {
    metaDesc:
      'Apply photo filters online free. Brightness, contrast, saturation, vintage, B&W, more. 100% private — runs in your browser.',
    intro:
      'Stylise any photo with a single click — or fine-tune brightness, contrast, and saturation by hand. **No uploads, no signup, no watermark.** The filters run in your browser, so your photos stay private, and you can flip between looks instantly without waiting on a server round-trip.',
    sections: [
      {
        heading: 'Presets for instant looks',
        body:
          "Start with a preset — vintage, cool, warm, black and white, high contrast, faded — and the photo updates live. Presets are a great way to get a consistent look across a batch of images for a blog, product listing, or social feed. If the preset is almost right but not quite, tweak the underlying sliders on top of it. The tool remembers your last settings so a full batch looks consistent.",
      },
      {
        heading: 'Manual controls when you need precision',
        body:
          "For fine-tuning, the sliders cover brightness, contrast, saturation, hue, temperature, blur, sharpen, and vignette. Every adjustment is applied non-destructively — the original pixels are still there, and you can reset any slider without re-uploading the image. When you're happy, export at full resolution in JPG, PNG, or WebP.",
      },
      {
        heading: 'Combining filters with other tools',
        body:
          "Filters are often the last step before publishing. A typical flow: [remove the background](/remove-background) → [crop](/tool/crop) to the right aspect ratio → apply a filter → [compress](/tool/compress) for upload. Each tool runs locally and passes the result straight into the next. If you prefer a different edit order, the filters can also be applied first — just note that heavy color shifts on a cutout sometimes reveal a faint halo, so background removal after filtering is a safer bet there.",
      },
    ],
    useCases: [
      {
        title: 'Blog and social consistency',
        body:
          'Pick a preset and apply it to every image in a post so the feed looks coherent instead of a mix of phone cameras.',
      },
      {
        title: 'Product photography polish',
        body:
          "Bump contrast, lift shadows, cool the white balance slightly — stock photo magic in three slider moves.",
      },
      {
        title: 'Vintage and nostalgic edits',
        body:
          'The vintage preset gives scanned-film warmth and a mild grain, perfect for throwback posts or a retro aesthetic.',
      },
      {
        title: 'Black-and-white conversions',
        body:
          'Switch to B&W, boost contrast, and the subject pops — great for portraits and moody product shots.',
      },
    ],
    faq: [
      {
        q: 'Can I combine multiple filters on the same image?',
        a: 'Yes — presets and manual sliders stack. Start with a preset and tune the sliders on top for a custom look.',
      },
      {
        q: 'Do the filters reduce image quality?',
        a: "Filters are applied to full-resolution pixels and the export is a fresh encode at the quality setting you pick. If you keep export quality high, there is no visible quality loss.",
      },
      {
        q: 'Are my photos uploaded?',
        a: "No. Filters run entirely in your browser. Nothing is sent to our servers.",
      },
      {
        q: 'Can I apply the same filter to a batch of photos?',
        a: 'Yes — drop multiple images in and apply the same preset to each. The tool remembers your settings so the batch stays consistent.',
      },
      {
        q: 'What formats does it support?',
        a: 'Import JPG, PNG, WebP, or HEIC. Export to JPG, PNG, or WebP — pick WebP for the smallest file at the same quality.',
      },
      {
        q: 'Does it work on my phone?',
        a: 'Yes. It runs in mobile Chrome, Safari, and Firefox. Large photos take a second or two longer on mobile because the filtering happens on your device.',
      },
    ],
  },

  'image-converter': {
    metaDesc:
      'Convert images free online — JPG, PNG, WebP, HEIC, AVIF, GIF, BMP. Batch supported. Private — runs in your browser, no uploads.',
    intro:
      'Convert between every common image format without uploading your photos. **JPG, PNG, WebP, HEIC, AVIF, GIF, BMP — any to any.** The conversion happens in your browser using the built-in encoders, so nothing touches a server, there is no watermark, and there is no file-count limit. Drop in a batch and pull out a zip of converted files in seconds.',
    sections: [
      {
        heading: 'Why a local image converter beats the uploady kind',
        body:
          "Most online converters upload your file, re-encode it on their server, and hand it back. That round-trip is slow and leaks your images through their logs. It is particularly bad for HEIC files from iPhone, which are often photos of IDs, receipts, or personal documents you do not want in a stranger's database. This converter runs entirely on your device. Nothing is uploaded. **You can convert hundreds of files without hitting a quota or watermark.**",
      },
      {
        heading: 'Which format should I pick?',
        body:
          "Short version: **WebP** for the web (smallest file at the same quality, supported by every modern browser). **JPG** for photos going to email or print (maximum compatibility). **PNG** when you need transparency (logos, cutouts, screenshots of UI). **AVIF** if you need the absolute smallest file for the web and your destination supports it. **HEIC** is Apple's efficient photo format — convert away from it for sharing, convert to it only if you need to match an iPhone camera roll.",
      },
      {
        heading: 'Batch conversion and chaining with other tools',
        body:
          "Drop in a whole folder of photos and convert them in one pass. The output is a zip of the converted files named to match the originals. If you want smaller files on top of converting, chain with the [image compressor](/tool/compress). If you want to also resize to a target pixel size, hit [resize](/tool/resize) before converting. Everything runs locally, so the chain is fast and private.",
      },
    ],
    useCases: [
      {
        title: 'Convert HEIC from iPhone to JPG or PNG',
        body:
          "HEIC does not upload cleanly to many services. Convert your iPhone photos to JPG before sending to a PC user, uploading to an old CMS, or emailing.",
      },
      {
        title: 'PNG screenshots to WebP for the web',
        body:
          'Screenshots are usually PNG, which is huge. Convert to WebP and the same visible quality comes in at a fraction of the file size.',
      },
      {
        title: 'Batch-convert a product photo folder',
        body:
          'Export your Shopify or Etsy product folder as WebP in a single pass so every listing loads fast without individual edits.',
      },
      {
        title: 'GIF to MP4 or WebP for smaller animations',
        body:
          'Animated GIFs are heavy. Convert to WebP or MP4 and the same animation looks identical at a fraction of the size.',
      },
    ],
    faq: [
      {
        q: 'Does converting reduce quality?',
        a: 'Lossless conversions (PNG-to-PNG, WebP-lossless) preserve every pixel. Converting to a lossy format (JPG, WebP-lossy, AVIF) reintroduces compression — pick a high quality level to keep the visible result identical.',
      },
      {
        q: 'Can I convert a batch of images at once?',
        a: 'Yes — drop multiple files and convert in a single pass. Output is a zip of the converted files.',
      },
      {
        q: 'Are my images uploaded?',
        a: "No. Conversion runs in your browser with built-in encoders. Nothing is sent to our servers.",
      },
      {
        q: 'Does it support transparent PNG output?',
        a: "Yes. PNG and WebP preserve transparency. JPG cannot — if you convert a transparent image to JPG, the transparent pixels become white by default.",
      },
      {
        q: 'Can I convert HEIC on Windows or Linux?',
        a: "Yes. The tool decodes HEIC in the browser even on systems that do not natively support the format. This is one of the cleanest ways to open iPhone photos on a PC.",
      },
      {
        q: 'What is the file size limit?',
        a: "No hard limit. Your device memory is the ceiling — most modern laptops handle 100MB+ inputs without issue.",
      },
    ],
  },

  'magic-eraser': {
    metaDesc:
      'Magic eraser online free — remove people, objects, and unwanted stuff from photos. AI inpainting. Private, runs in your browser.',
    intro:
      'Paint over the thing you want gone — a person in the background, a power line across the sky, a trash can in the corner — and the AI fills it back in with a plausible background. **Runs in your browser, no uploads, no signup, no watermark.** The model handles small-to-medium removals cleanly; for larger areas it still gives you a clean starting point to tweak.',
    sections: [
      {
        heading: 'How AI inpainting works',
        body:
          "You mark the area you want erased with a brush. The model looks at the pixels around the mask — textures, colors, patterns, lighting — and generates new pixels that blend with the rest of the image. For small objects against a clean background (a bird in the sky, a cone on grass, a stain on a wall), the fill is usually indistinguishable from a real shot. For large, complex fills, the model gets you close but may leave a subtle repeat pattern you can smooth with a second pass.",
      },
      {
        heading: 'Why local magic erasing matters',
        body:
          "Google Photos and most cloud apps do magic erase, but they upload every photo you touch. This tool runs the model on your device. **Your photos never leave your browser.** That is the difference between a casual edit and being able to clean up sensitive images — photos of kids, home interiors, paperwork on a desk — without sending them to a cloud.",
      },
      {
        heading: 'Tips for the cleanest erase',
        body:
          "Brush slightly larger than the object — include the shadow, not just the subject. Work in multiple passes on complex areas rather than trying to erase everything at once. If the result has a subtle repeat or soft patch, apply a light [photo filter](/photo-filters-online) pass over the whole image to even out the texture. For removing entire backgrounds, the [background remover](/remove-background) is faster and usually cleaner.",
      },
    ],
    useCases: [
      {
        title: 'Remove photobombers and strangers',
        body:
          'Travel shots with tourists in the background become the clean postcard photo you wanted.',
      },
      {
        title: 'Clean up product photography',
        body:
          'Erase stray lint, dust, tags, and price stickers from product shots without a full Photoshop session.',
      },
      {
        title: 'Remove power lines, poles, and signs',
        body:
          'Landscape photos get their horizon back — power lines and street signs disappear into sky and trees.',
      },
      {
        title: 'Clean listings and profile photos',
        body:
          "Erase visible clutter from real-estate listing photos, dating profile pics, or home sale images.",
      },
    ],
    faq: [
      {
        q: 'How is this different from the background remover?',
        a: 'Background remover strips everything except the subject. Magic eraser targets specific things you paint over, leaving the rest of the photo intact.',
      },
      {
        q: 'Is the fill always perfect?',
        a: 'For small objects against a consistent background, essentially yes. For large or complex fills (a person in front of detailed architecture), it gives a strong starting point that sometimes needs a manual touch-up.',
      },
      {
        q: 'Are my photos uploaded?',
        a: "No. The AI model runs in your browser. Nothing is sent to our servers. Everything stays on your device.",
      },
      {
        q: 'Can I undo if the fill does not look right?',
        a: "Yes — every erase is undoable. You can also redo, reset the mask, or repaint just a portion and run the fill again.",
      },
      {
        q: 'What is the max file size?',
        a: 'Device memory is the only limit. For best results on very large images, resize to around 2000-3000px wide first — the model handles that range most cleanly.',
      },
      {
        q: 'Does it work on my phone?',
        a: "Yes, but the model runs slower on mobile. Small edits on a photo are fine. Larger erases on high-res photos are faster on a laptop.",
      },
    ],
  },

  'watermark': {
    metaDesc:
      'Add watermarks to photos free online — text or logo, batch supported. Protect your work. Private, runs in your browser.',
    intro:
      'Stamp your photos with a text or logo watermark before they go online. **Batch-apply the same watermark across dozens of images in one pass** — useful for photographers, artists, and anyone who shares work that keeps getting reposted without credit. Runs entirely in your browser so your originals and your logo stay private.',
    sections: [
      {
        heading: 'When a watermark actually helps',
        body:
          "Watermarks are not a copyright guarantee — a determined reposter can crop or clone them out. But they are the single most effective deterrent against casual theft. **If your photo shows up on Pinterest, a blog, or a meme account with your name or URL still on it**, that is free marketing and attribution in one. The trick is placing the mark where it cannot be cropped out without ruining the photo — across the subject, not just in a corner.",
      },
      {
        heading: 'Text watermarks vs logo watermarks',
        body:
          "Text is the fastest — type your name or URL, pick a font, set opacity, done. Logo watermarks look more professional and are stronger brand signals. Drop in a PNG of your logo (ideally white-on-transparent) and the tool places it with adjustable size, position, and opacity. For subtle watermarks, 20-30% opacity is the sweet spot — visible but not distracting.",
      },
      {
        heading: 'Batch watermarking',
        body:
          "Drop in a folder of images, set the watermark once, and the tool applies it across the batch. Output is a zip of watermarked files. Combine with [image compression](/tool/compress) after watermarking for ready-to-upload web versions. If you want to remove the metadata from those photos before posting (location, camera info), run them through the [EXIF remover](/exif-remover) as a final step.",
      },
    ],
    useCases: [
      {
        title: 'Photographers sharing online previews',
        body:
          'Stamp your URL across proofs and social previews so reposts still link back to you.',
      },
      {
        title: 'Artists posting work-in-progress',
        body:
          "Protect sketches, concepts, and finished art with a subtle brand mark before posting to Instagram or Twitter.",
      },
      {
        title: 'Real estate and product listings',
        body:
          "Brand listing photos with the agency or shop name so shared images still carry attribution.",
      },
      {
        title: 'Stock photo samples',
        body:
          'Visibly watermark preview versions while keeping clean originals for paying customers.',
      },
    ],
    faq: [
      {
        q: 'Can I use a transparent logo PNG?',
        a: 'Yes — transparent PNG logos are the best input. The transparency is respected, so only the logo itself is stamped.',
      },
      {
        q: 'Can I set different opacity for different photos?',
        a: 'Yes — opacity, position, size, and rotation are adjustable. For a batch, the same settings apply to every image; for per-image tuning, watermark them one at a time.',
      },
      {
        q: 'Does the watermark prevent removal?',
        a: 'No watermark is removal-proof. A mark across the subject at moderate opacity is the strongest practical deterrent against casual reposts.',
      },
      {
        q: 'Are my photos uploaded?',
        a: "No. Watermarking runs in your browser. Your photos and logo stay on your device.",
      },
      {
        q: 'What output formats can I pick?',
        a: 'JPG, PNG, and WebP. PNG preserves transparency if your original had it.',
      },
      {
        q: 'Can I watermark in a grid pattern across the whole image?',
        a: "Yes — choose the tile option and the watermark repeats across the full image. This is the hardest pattern to crop out.",
      },
    ],
  },

  'profile-picture': {
    metaDesc:
      'Free profile picture maker — crop square, add background color, round corners. LinkedIn, Slack, GitHub ready. Runs in your browser.',
    intro:
      'Turn any photo into a clean profile picture — square-cropped, centered on your face, with a background color or simple pattern if you want one. **No uploads, no signup, no watermark.** Export a circle-preview PNG sized perfectly for LinkedIn, Slack, GitHub, Twitter, Discord, or anywhere else that asks for an avatar.',
    sections: [
      {
        heading: 'What makes a good profile picture',
        body:
          "Face centered, eye-line in the top third, tight crop so the face fills the frame even at 40-pixel thumbnails. **Most profile pictures are viewed smaller than a postage stamp**, so details get lost fast. The tool does the tight crop and center automatically, previews it as a circle (since most platforms mask avatars to circles), and exports at whatever pixel size you pick.",
      },
      {
        heading: 'Backgrounds: solid color, brand, or cutout',
        body:
          "Solid color backgrounds read the cleanest on feeds — pick your brand color or a neutral gray. To get a clean cutout, run the photo through the [background remover](/remove-background) first and come back here to place it on a color. For a photo-first look, keep the original background and just tighten the crop. Avoid busy backgrounds — at avatar size, clutter becomes noise.",
      },
      {
        heading: 'Sizing for each platform',
        body:
          "Most platforms accept a 400x400 or 1000x1000 square — the platform downscales to its own display sizes (40px, 80px, 200px). Uploading at 1000x1000 gives the best result at every size. LinkedIn currently displays up to 400x400, Slack 512x512, GitHub 460x460 max. Exporting at 1000x1000 covers all of them with headroom, and the file stays small because this is a solid-background portrait.",
      },
    ],
    useCases: [
      {
        title: 'LinkedIn headshots',
        body:
          'Tight square crop of your face on a neutral background — the profile photo that gets the most profile views.',
      },
      {
        title: 'Slack and team chat avatars',
        body:
          "Consistent team avatars — everyone's headshot on the company brand color, ready to upload.",
      },
      {
        title: 'GitHub and dev profiles',
        body:
          'A clean portrait that still reads at 40px in commit history and PR reviews.',
      },
      {
        title: 'Discord and gaming avatars',
        body:
          'Fun branded backgrounds or a clean cutout — the circle preview shows exactly what other users will see.',
      },
    ],
    faq: [
      {
        q: 'What size should I export at?',
        a: 'Export at 1000x1000 to cover every platform with headroom. Any site that wants a smaller size will downscale cleanly.',
      },
      {
        q: 'Can I preview as a circle?',
        a: 'Yes — the preview shows both the square frame and the circular mask that most platforms apply, so you can see exactly what will display.',
      },
      {
        q: 'Can I add a background behind a cutout?',
        a: "Yes — first run your photo through the [background remover](/remove-background), then open the result here and pick a solid color or pattern.",
      },
      {
        q: 'Are my photos uploaded?',
        a: "No. Cropping and compositing runs in your browser. Your photos stay on your device.",
      },
      {
        q: 'Can I batch make profile pictures for a team?',
        a: "Yes — drop several photos in and apply the same crop, background, and size to each. Output is a zip of standardized avatars.",
      },
      {
        q: 'Does it support transparent output?',
        a: 'Yes. If you skip the background color, the result is a transparent PNG ready to composite onto any platform.',
      },
    ],
  },

  'exif': {
    metaDesc:
      'Remove EXIF metadata from photos free online. Strip GPS location, camera info, timestamps. Private — runs in your browser.',
    intro:
      'Strip the hidden metadata out of your photos before you share them. **EXIF data includes GPS location, camera model, date, and editing history** — none of which you probably want attached when you post to a dating app, a classified listing, or a support ticket. Runs in your browser, so the originals and the cleaned versions both stay on your device.',
    sections: [
      {
        heading: 'What EXIF data is actually in your photos',
        body:
          "Every photo your phone takes embeds a block of hidden data: **the GPS coordinates of where it was taken**, the timestamp, the camera make and model, exposure settings, and often the software used to edit it. Facebook, Instagram, and Twitter strip most of this on upload, but plenty of sites do not — including real estate portals, dating apps, classified listings, forum image hosts, and WhatsApp status. Anyone who downloads the photo from one of those can read the original GPS coordinates of your home, work, or kids' school.",
      },
      {
        heading: 'When to remove EXIF',
        body:
          "**Always remove it before posting to sites that do not strip it** — classifieds (Craigslist, Facebook Marketplace *does not strip*, OfferUp), real estate listings from your phone, dating profiles, forum image uploads, support tickets with developers. For personal photos going to family, the metadata is usually fine. For anything going to the public internet, strip it. The tool shows you exactly what was in the file before and after, so you can see what you are removing.",
      },
      {
        heading: 'Beyond EXIF — other privacy steps',
        body:
          "EXIF is one layer. If your photo shows identifiable faces, license plates, or addresses, combine this with the [blur tool](/blur-image-online) to redact those before posting. If the photo contains a screen or document you want to anonymize, the [magic eraser](/magic-eraser) can remove specific text. For photos going to a public resume or portfolio, you probably want cleaner metadata and a consistent watermark — pair this with the [watermark tool](/watermark-photos-online).",
      },
    ],
    useCases: [
      {
        title: 'Classified listings and marketplaces',
        body:
          'Strip GPS before posting to Craigslist, Facebook Marketplace, or eBay so buyers can not pinpoint your home from the photo.',
      },
      {
        title: 'Dating profiles',
        body:
          "Remove location metadata from selfies before uploading so your exact coordinates are not shared with matches.",
      },
      {
        title: 'Real estate and rental listings',
        body:
          "Agents and landlords often snap quick phone photos that embed GPS. Strip before posting to avoid tipping off the exact address.",
      },
      {
        title: 'Support tickets and bug reports',
        body:
          "Screenshots and photos sent to support teams can leak device info and timestamps. EXIF cleanup gives you a clean attachment.",
      },
    ],
    faq: [
      {
        q: 'What exactly gets removed?',
        a: 'All EXIF metadata: GPS coordinates, date and time, camera make and model, exposure settings, lens info, software fingerprints, edit history, and thumbnails.',
      },
      {
        q: 'Does removing EXIF change the photo itself?',
        a: "No — only the hidden metadata is stripped. The pixels are identical to the original.",
      },
      {
        q: 'Do social networks already strip this?',
        a: 'Facebook, Instagram, and Twitter strip most EXIF on upload. WhatsApp, Signal, most forums, classifieds, real estate portals, and direct downloads do not. When in doubt, strip it first.',
      },
      {
        q: 'Are my photos uploaded?',
        a: "No. Metadata is read and stripped in your browser. The photos never leave your device.",
      },
      {
        q: 'Can I keep some fields and remove others?',
        a: 'Yes — advanced mode lets you keep date and camera info while stripping GPS, or vice versa. The default is to remove everything, which is what most people want.',
      },
      {
        q: 'Does this work on HEIC photos from iPhone?',
        a: 'Yes. The tool reads HEIC natively and can strip EXIF from it without first converting to JPG.',
      },
    ],
  },

  'ocr': {
    metaDesc:
      'Image to text OCR free online. Extract text from photos, screenshots, scans. 100+ languages. Private — runs in your browser.',
    intro:
      'Pull the text out of any image — screenshots, phone photos of documents, scans of old letters, handwritten notes. **The OCR engine runs in your browser, so the images and the transcribed text both stay on your device.** Copy out, save, or paste into your note app. No uploads, no signup, no watermark, no size limit beyond your device memory.',
    sections: [
      {
        heading: 'Why local OCR matters',
        body:
          "People photograph a lot of sensitive text — tax documents, contracts, medical forms, school paperwork, receipts with card numbers. Sending those through an online OCR service uploads the full photo and the extracted text to a third party. **This tool does the recognition entirely in your browser**, so nothing touches a server. That is the right default for anything you would not want a stranger to read.",
      },
      {
        heading: 'How accurate is browser OCR?',
        body:
          "Typed text on a clean, flat background — receipts, screenshots, PDFs, slides — comes out at 95-99% accuracy. Handwriting is harder but works on clean printing (block letters, numbers, addresses). Degraded scans, low-light phone photos, and cursive are the toughest. A quick tip: increase contrast and straighten the photo with the [photo filters](/photo-filters-online) before OCR for a noticeable accuracy bump.",
      },
      {
        heading: 'Supported languages and formats',
        body:
          "The engine supports 100+ languages including English, Spanish, French, German, Chinese (simplified and traditional), Japanese, Korean, Arabic, Hindi, and Russian. Pick the language in the dropdown before running — specifying the right language doubles accuracy on non-English text. Accepts JPG, PNG, WebP, HEIC, and PDF inputs. Output is plain text you can copy, or a .txt download.",
      },
    ],
    useCases: [
      {
        title: 'Screenshots of articles and research',
        body:
          'Paste the text into your notes app instead of retyping. Great for paywalled articles you screenshotted, research papers, and textbooks.',
      },
      {
        title: 'Receipts and expense reports',
        body:
          'Photograph the receipt, OCR the text, paste into your expense tool. Stays private while saving the retype.',
      },
      {
        title: 'Business cards and contacts',
        body:
          'Snap a business card, extract name, email, and phone, paste into your CRM or phone contacts.',
      },
      {
        title: 'Handwritten notes and whiteboards',
        body:
          'Digitize meeting whiteboards or handwritten notes. Clean printing works well — cursive less so.',
      },
    ],
    faq: [
      {
        q: 'Is the OCR really free and unlimited?',
        a: 'Yes — free, no signup, no per-image quota. The recognition runs on your device so there is no server cost to pass along.',
      },
      {
        q: 'Are my images uploaded anywhere?',
        a: "No. Both the image and the extracted text stay in your browser. Nothing is sent to our servers.",
      },
      {
        q: 'Which languages work best?',
        a: "English, Spanish, French, German, and most European languages are essentially at parity with cloud OCR services. Non-Latin scripts (Chinese, Arabic, Hindi) work well but benefit most from clean, high-contrast input.",
      },
      {
        q: 'Can I OCR a multi-page PDF?',
        a: 'Yes — drop the PDF in and each page is recognized in turn. Output is a single text file with page separators.',
      },
      {
        q: 'How do I improve accuracy?',
        a: "Straighten the image, crop to just the text area, boost contrast with the photo filters, and pick the exact language before running.",
      },
      {
        q: 'Does it recognize handwriting?',
        a: 'Clean block printing: yes, pretty well. Cursive and messy handwriting: accuracy drops. For cursive, specialized tools beat general OCR.',
      },
    ],
  },

  'collage-maker': {
    metaDesc:
      'Free photo collage maker — grid, freeform, mood board layouts. No watermark. Private — runs entirely in your browser.',
    intro:
      'Arrange photos into a single shareable image with grid layouts, freeform boards, or custom shapes. **No watermark, no signup, no uploads to a server.** Drop in your photos, pick a layout, set borders and spacing, and export a clean final collage ready for Instagram, a gift card, or a printed canvas.',
    sections: [
      {
        heading: 'Grid vs freeform vs mood board',
        body:
          "**Grid collages** are the cleanest format — equal tiles in a consistent ratio. Great for 'before and after' pairs, product lineups, or a clean three-by-three. **Freeform boards** let you drag photos anywhere and overlap them — the right choice for scrapbook-style layouts, travel stories, or mood boards. **Mood boards** are a preset freeform with templates tuned for interior design, product inspiration, or UI references.",
      },
      {
        heading: 'Spacing, borders, and backgrounds',
        body:
          "Tight spacing looks modern and magazine-like. Wider white spacing looks editorial and clean. A colored border around each photo or the whole collage ties a set together visually. For printed gifts, a solid white background with even spacing and a slight border is the classic photo-book look. Pick a background color to match the destination — brand color for social, cream or white for print.",
      },
      {
        heading: 'From photos to ready-to-upload',
        body:
          "A quick workflow: [remove distracting backgrounds](/remove-background) from hero shots, crop each photo to matching ratios with the [crop tool](/tool/crop), drop them into the collage maker, then [compress the final collage](/tool/compress) for upload. For a multi-photo Instagram post you want to look cohesive, this is the trick that turns a feed of phone snaps into a polished grid.",
      },
    ],
    useCases: [
      {
        title: 'Instagram grid posts',
        body:
          'Combine multiple photos into one cohesive post — great for travel stories, before/after transformations, or event recaps.',
      },
      {
        title: 'Photo gifts and cards',
        body:
          'Build a holiday card or anniversary collage ready to print or send digitally. Supports standard card ratios.',
      },
      {
        title: 'Product lineups for stores',
        body:
          "Show variants or color options side-by-side in a single listing image that carries the whole story in one thumbnail.",
      },
      {
        title: 'Design mood boards',
        body:
          'Drop reference photos onto a board for a client presentation or personal design sprint.',
      },
    ],
    faq: [
      {
        q: 'Is there a watermark on the final collage?',
        a: 'No. The tool is free and watermark-free because it runs locally with no server costs.',
      },
      {
        q: 'How many photos can I combine?',
        a: "There is no hard cap. Grids up to 12+ cells and freeform boards with 20+ photos both work smoothly on modern browsers.",
      },
      {
        q: 'What output sizes can I export?',
        a: 'Pick from standard social ratios (1:1, 4:5, 16:9, 9:16), print sizes (4x6, 5x7, 8x10), or type a custom pixel size.',
      },
      {
        q: 'Are my photos uploaded?',
        a: "No. Layout and export run in your browser. Your photos stay on your device.",
      },
      {
        q: 'Can I add text or stickers?',
        a: "Yes — each template supports adding text blocks with custom fonts and colors. For richer styling, export the collage and open it in the [photo filters](/photo-filters-online) for a final pass.",
      },
      {
        q: 'Does it handle transparent PNGs?',
        a: 'Yes — transparent cutouts show the collage background through them, which is useful for mood boards with isolated objects.',
      },
    ],
  },

  'meme-generator': {
    metaDesc:
      'Free meme generator online — classic templates or upload your own. Top/bottom or custom text. No watermark, private.',
    intro:
      'Make memes in seconds — pick a classic template, drop in your own image, or paste a screenshot. **No watermark, no signup, no sign-in.** Type top and bottom text, or drop text anywhere. Export a clean PNG or JPG ready to post. Runs in your browser, which is the only meme generator that actually respects that the meme you are making is hilarious and none of its business.',
    sections: [
      {
        heading: 'Classic templates and custom uploads',
        body:
          "The template library covers the staples — Drake, distracted boyfriend, expanding brain, two buttons, Galaxy Brain, Change My Mind, plus dozens more. For fresher formats, upload your own screenshot and the text tools work identically. **Uploading a custom image to a meme generator is a privacy-sensitive move** on most sites — this one keeps it local.",
      },
      {
        heading: 'Top/bottom text vs freeform',
        body:
          "Top/bottom text is the classic format — bold white with a black outline, centered, instantly readable. Freeform text placement lets you drop labels anywhere, rotate them, and change fonts and colors. For political or meta-format memes (Drake, expanding brain), freeform is what you want because each panel has its own caption.",
      },
      {
        heading: 'Fonts, caps, and the classic meme look',
        body:
          "The canonical meme font is Impact, all caps, white with a black stroke. Most templates default to this for a reason — it reads at thumbnail sizes and feels like a meme. Other fonts are available for more recent formats (Arial, Helvetica, handwriting fonts for notes-app-style posts). Keep captions short — if you can say it in six words, do.",
      },
    ],
    useCases: [
      {
        title: 'Social media reactions',
        body:
          'Quick meme for Twitter, Instagram, or a group chat — template + caption, export, post.',
      },
      {
        title: 'Work Slack humor',
        body:
          "Paste a screenshot of a standup or PR review, turn it into an inside-joke meme, post to #random. Stays local so nothing sensitive leaks.",
      },
      {
        title: 'Marketing content',
        body:
          'Brand-friendly memes for social — pull a product screenshot, caption with your value prop, post.',
      },
      {
        title: 'Greeting cards and internal posters',
        body:
          'Birthday meme for a coworker, retirement card, team victory poster — turn a photo into a captioned moment.',
      },
    ],
    faq: [
      {
        q: 'Is there a watermark?',
        a: 'No watermark. The export is a clean PNG or JPG.',
      },
      {
        q: 'Can I upload my own template?',
        a: 'Yes — drop in any JPG or PNG and use it as a meme base. The text tools work on custom uploads exactly like on the built-in templates.',
      },
      {
        q: 'Are my images uploaded to a server?',
        a: "No. Meme creation is fully client-side. Your screenshots and photos stay on your device.",
      },
      {
        q: 'What output sizes work for social?',
        a: 'Export at 1080x1080 for Instagram, 1200x675 for Twitter, or the template native size for everywhere else. The tool picks sane defaults.',
      },
      {
        q: 'Can I animate the meme or add a GIF?',
        a: "This tool exports static images. For animated meme output, combine with the image-to-GIF workflow in the video tools.",
      },
      {
        q: 'Does the Impact font support non-English characters?',
        a: 'Impact covers Latin, Cyrillic, and Greek. For scripts like Chinese, Japanese, or Arabic, the tool falls back to a system font that supports them.',
      },
    ],
  },

  'grid-splitter': {
    metaDesc:
      'Free Instagram grid maker — split photos into 3x1, 3x3, or custom tiles. Puzzle feed layouts. Private, runs in your browser.',
    intro:
      'Split any photo into a grid of tiles for a **seamless Instagram puzzle feed** — three-across, nine-tile, or a custom split. Upload once, export a zip of numbered tiles in posting order, and your next set of Instagram posts line up into one big image on your profile. Runs in your browser — no uploads, no watermark.',
    sections: [
      {
        heading: 'Why a puzzle feed works on Instagram',
        body:
          "Instagram profiles display posts as a three-column grid. When a new visitor lands on your profile, the whole grid is the first thing they see. **A puzzle feed makes that grid into one coherent image** — a hero shot broken across three or nine tiles. Done well, it looks deliberate and professional. The tool handles the math so each tile exports at the exact aspect ratio Instagram expects and the seams align on upload.",
      },
      {
        heading: 'Layout options',
        body:
          "**3x1** — one row across the top of your feed, easy to maintain as new posts push down. **3x3** — a full nine-tile image that occupies the top of your profile, high-impact but means the next post breaks the pattern. **Custom split** — 2x3, 4x3, or any grid for other platforms or slideshow carousels. Pick a layout and the tool previews where each tile will land.",
      },
      {
        heading: 'Posting order matters',
        body:
          "Instagram posts appear newest-first, which means **you post the tiles in reverse order**. The tool numbers each tile by posting order (tile 1 goes up last, which is the top-left of the grid), so you can drop them into a queue without thinking about the math. For safer timing, use Instagram's drafts or a scheduler to stage the whole set and publish in the right order.",
      },
    ],
    useCases: [
      {
        title: 'Brand launch hero image',
        body:
          'Split a launch poster across nine tiles so your whole profile becomes a teaser when the set goes live.',
      },
      {
        title: 'Portfolio grid for photographers',
        body:
          'Use the 3x1 top row as a rotating portfolio strip while still posting normally below.',
      },
      {
        title: 'Event and conference recaps',
        body:
          "Split a panoramic event shot into three tiles for a clean horizontal banner across the top of your feed.",
      },
      {
        title: 'Restaurant and product stores',
        body:
          "Menu highlight across a 3x1 strip, or the signature dish as a nine-tile hero shot — both drive profile-to-follow conversions.",
      },
    ],
    faq: [
      {
        q: 'Will the tiles align exactly on Instagram?',
        a: 'Yes — the tool exports at the exact ratio Instagram uses (1:1 by default, or 4:5 portrait if you pick that option), so seams line up when the grid is reassembled on your profile.',
      },
      {
        q: 'In what order do I post the tiles?',
        a: 'Reverse order from top-left — the tool numbers each tile by posting order, so post tile 1 first, then tile 2, etc., and the grid assembles correctly on your profile.',
      },
      {
        q: 'Can I use this for other platforms?',
        a: 'Yes — the custom split mode works for any multi-tile layout. Useful for Pinterest boards, slide carousels, or dividing a large image for printing across multiple pages.',
      },
      {
        q: 'Are my photos uploaded?',
        a: "No. Splitting happens entirely in your browser. Your images never leave your device.",
      },
      {
        q: 'What input size should I start with?',
        a: "For a crisp 3x3, start with a 3240x3240 image (1080px per tile). For 3x1, start with 3240x1080. Bigger works too — the tool downsamples cleanly.",
      },
      {
        q: 'Can I add captions to each tile?',
        a: "This tool splits the image itself. For captions per post, draft them in Instagram's scheduler or a notes app in the same posting order as the tile numbers.",
      },
    ],
  },

  'qr-code-generator': {
    metaDesc:
      'Free QR code generator online — URLs, Wi-Fi, vCards, text, more. Custom colors, logo center. No signup, runs in your browser.',
    intro:
      'Generate a QR code for any URL, Wi-Fi password, business card, or plain text — right in your browser. **No signup, no tracking, no expiring codes**, which is the scam a lot of free QR services pull (they generate a redirect URL that eventually stops working unless you pay). Our codes are direct: they encode your data, not a redirect through us.',
    sections: [
      {
        heading: 'Direct QR codes vs trackable QR codes',
        body:
          "Most 'free' QR services generate a code that points to a redirect URL on their domain, not your actual destination. **When their server goes down or their free tier ends, every QR code you printed stops working.** This tool generates direct codes — the data is encoded in the bars themselves. Once you download the PNG, it works forever, offline, without depending on us. Trade-off: no click tracking. If you need analytics, use a proper link shortener and QR-encode the short link.",
      },
      {
        heading: 'What you can encode',
        body:
          "**URLs** — the most common use case, works in every camera app. **Wi-Fi login** — network name and password in a format that phones auto-connect to. **vCard contact** — scan the code and the name, phone, and email add directly to contacts. **Plain text** — notes, messages, short info. **Email** and **phone** — pre-fill a compose window when scanned. Pick the type in the tool and the fields adjust.",
      },
      {
        heading: 'Custom colors, logo, and size',
        body:
          "Change foreground and background colors to match your brand. Add a small logo in the center — the built-in error correction tolerates a 20-30% obstruction. Export at any pixel size, or as an SVG for clean scaling on posters and signs. **High-density codes need high-contrast colors** — dark foreground on light background. Low contrast or busy background images cause scan failures in poor light.",
      },
    ],
    useCases: [
      {
        title: 'Restaurant menus and business signage',
        body:
          'Print the code on a table tent or poster — customers scan to your menu, reservation page, or Wi-Fi.',
      },
      {
        title: 'Business cards and trade shows',
        body:
          'Encode your vCard so scanning saves your contact directly to the scanner phone — no typing.',
      },
      {
        title: 'Event check-ins and flyers',
        body:
          "QR to the event page, a ticket, or a feedback form. No app required — every phone camera reads it.",
      },
      {
        title: 'Wi-Fi sharing for guests',
        body:
          "A taped-up QR with your Wi-Fi credentials saves guests and houseguests typing a 24-character password.",
      },
    ],
    faq: [
      {
        q: 'Do these QR codes expire?',
        a: 'No. Our codes encode the data directly, so they work forever and work offline once downloaded. No redirect through our servers.',
      },
      {
        q: 'Can I add my logo in the center?',
        a: 'Yes — drop a PNG or SVG logo in and it places cleanly in the middle. The error-correction level handles the obstruction without breaking scannability.',
      },
      {
        q: 'What sizes can I export?',
        a: 'Any pixel size for PNG, or SVG for infinite clean scaling on print. For business cards, 300x300 is plenty. For posters, export at 2000x2000 or use the SVG.',
      },
      {
        q: 'Will colored QR codes still scan?',
        a: 'Yes, as long as there is strong contrast between foreground and background. Avoid light-on-light or dark-on-dark — dark on light is most reliable.',
      },
      {
        q: 'Do I get scan analytics?',
        a: "No — these are direct codes, which is why they never expire. For analytics, generate a short link in a tool like Bitly and then QR-encode the short link here.",
      },
      {
        q: 'Can I generate Wi-Fi QR codes?',
        a: 'Yes — pick the Wi-Fi type, enter SSID and password, and phones auto-connect when they scan. Works on iOS and Android.',
      },
    ],
  },

  'signature-maker': {
    metaDesc:
      'Free online signature maker — type, draw, or upload. Transparent PNG for PDFs, contracts, emails. Private, runs in your browser.',
    intro:
      'Create a handwritten-style signature to paste into PDFs, contracts, or email footers. **Type your name in a signature font, draw with your finger or trackpad, or upload a photo of your real signature.** Export a transparent PNG that drops cleanly onto any document. Everything runs in your browser — your signature is never stored on our side.',
    sections: [
      {
        heading: 'Type, draw, or upload — which to pick',
        body:
          "**Typed signatures** are fastest and look good for email footers and semi-formal documents. Pick a signature font and your name appears in a plausible handwriting style. **Drawn signatures** (finger on phone, mouse or trackpad on laptop) are more personal but usually messier — good for contracts where a hand-drawn mark reads more authentic. **Uploaded real signatures** are the strongest for legal documents — sign once on paper, photograph it on a light background, upload, and the tool extracts a clean transparent PNG.",
      },
      {
        heading: 'From paper to transparent PNG',
        body:
          "The upload flow: sign a piece of paper with a dark pen on a clean white surface, photograph or scan it on your phone, upload here. The tool auto-removes the white background, crops to the signature, and outputs a transparent PNG you can drop onto any PDF or document. **Nothing is uploaded to a server** — the background removal runs in your browser. For a cleaner cut, pair with the [background remover](/remove-background) on tricky scans.",
      },
      {
        heading: 'Using the signature in PDFs and emails',
        body:
          "For PDFs, most readers have a signature tool that accepts a PNG. For contracts that need a specific placement, combine images and text with our [image-to-PDF converter](/tool/pdf). For email signatures, most email clients let you paste a PNG into the signature settings. Keep the final PNG at 400-600px wide — bigger than needed is wasted space, smaller starts to look pixelated.",
      },
    ],
    useCases: [
      {
        title: 'PDF contracts and forms',
        body:
          'Sign contracts, NDAs, tax forms, and rental agreements digitally without a DocuSign subscription. Stays private.',
      },
      {
        title: 'Email footers',
        body:
          'A signature PNG in your email signature looks polished and is instantly recognizable as yours.',
      },
      {
        title: 'Digital artwork and certificates',
        body:
          'Sign digital art, certificates of completion, or printable gift certificates.',
      },
      {
        title: 'Proposals and invoices',
        body:
          "Freelancers can add a real signature to invoices and proposals without a formal e-sign service.",
      },
    ],
    faq: [
      {
        q: 'Is an image signature legally binding?',
        a: "In most jurisdictions, a digital signature via image is binding if both parties accept it. For higher-stakes contracts (real estate, legal filings), use a service like DocuSign that adds cryptographic verification. For everyday agreements, a PNG signature on a PDF is widely accepted.",
      },
      {
        q: 'Is my signature stored on your servers?',
        a: "No. Everything runs in your browser. The tool does not save or log your signature in any form.",
      },
      {
        q: 'Can I make the signature transparent for dark backgrounds?',
        a: 'Yes — the export is a transparent PNG, so you can drop it onto any color without a white box around it. The signature itself is dark by default but color is adjustable.',
      },
      {
        q: 'Can I redraw if I do not like the result?',
        a: "Yes — clear and redraw as many times as you want. Each export is a fresh PNG.",
      },
      {
        q: 'What format should I upload for a real signature?',
        a: 'JPG, PNG, or HEIC all work. A clear photo on white paper taken straight-on gives the cleanest cut.',
      },
      {
        q: 'Can I use this on a phone?',
        a: 'Yes — drawing with your finger on a touchscreen often looks more natural than using a mouse on a laptop.',
      },
    ],
  },

  'favicon-generator': {
    metaDesc:
      'Free favicon generator — upload any image, export a full favicon pack for web, iOS, and Android. Private, runs in your browser.',
    intro:
      'Turn any square image into a complete favicon set — **the 16x16, 32x32, and 48x48 browser tabs, the 180x180 Apple touch icon, the 192x192 and 512x512 Android home-screen icons, plus the web manifest**. Drop in a logo or cropped image and export a zip you can drop into your site. Runs in your browser, no uploads.',
    sections: [
      {
        heading: 'Why a proper favicon set matters',
        body:
          "A single 16x16 favicon is the old way. Modern browsers and devices want **multiple sizes for different contexts** — the browser tab is 16x16, the iPhone home-screen icon is 180x180, Android wants 192x192 and 512x512 for the PWA install experience. Without them you get a blurry scaled icon or the default letter placeholder. A proper set takes 10 seconds to generate and makes your site look maintained.",
      },
      {
        heading: 'What the export includes',
        body:
          "The zip contains `favicon.ico` (multi-resolution legacy format), `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `apple-touch-icon.png` (180x180), `android-chrome-192x192.png`, `android-chrome-512x512.png`, and a sample `site.webmanifest` file. Drop everything into the root of your site and add the five `<link>` tags from the included snippet to your HTML head.",
      },
      {
        heading: 'Designing for 16x16',
        body:
          "A favicon is tiny. **Detail disappears fast** — a full logo with text is usually unreadable at 16 pixels. The trick is to design a mark: one letter, one bold symbol, or a simplified version of your logo. Use high contrast and solid shapes. If you start with a full logo, crop to just the icon mark using the [crop tool](/tool/crop) before bringing it here. For a clean transparent mark, [background remover](/remove-background) first, then favicon.",
      },
    ],
    useCases: [
      {
        title: 'New website launch',
        body:
          'Ship a complete favicon pack on day one so browser tabs and home-screen saves look right from the start.',
      },
      {
        title: 'PWA and installable web apps',
        body:
          'The 192 and 512 Android sizes plus the web manifest are what make the "Add to Home Screen" prompt look polished.',
      },
      {
        title: 'Rebrand updates',
        body:
          'New logo? Regenerate the set, drop into your site, users see the new mark on their next visit.',
      },
      {
        title: 'Side projects and demos',
        body:
          "A proper favicon instantly signals that a side project is not just a weekend sketch.",
      },
    ],
    faq: [
      {
        q: 'What input image works best?',
        a: 'A square PNG or SVG, ideally 512x512 or larger. A simple mark (not a full logo with text) reads best at 16x16.',
      },
      {
        q: 'Does the export include a .ico file?',
        a: 'Yes — multi-resolution `favicon.ico` plus individual PNG sizes for each modern context. You get the full pack.',
      },
      {
        q: 'Do I need a web manifest?',
        a: 'For a plain site, no — the `<link>` tags alone are enough. For PWAs and installable apps, yes — a sample `site.webmanifest` is included.',
      },
      {
        q: 'Are my images uploaded?',
        a: "No. Generation runs in your browser. Your logo stays on your device.",
      },
      {
        q: 'Can I use a transparent PNG?',
        a: "Yes — transparency is preserved across all generated sizes, which is best for favicons that should sit on any browser tab color.",
      },
      {
        q: 'How do I install the favicon on my site?',
        a: 'Drop the unzipped files into your site root (or `/public` folder in Next.js or Create React App) and add the five `<link>` tags from the included snippet to your HTML head.',
      },
    ],
  },

  'svg-to-png': {
    metaDesc:
      'Convert SVG to PNG free online — any resolution, transparent background. Batch supported. Private, runs in your browser.',
    intro:
      'Convert any SVG to a PNG at whatever resolution you need — 128, 1024, 4096, it is all the same work for vector graphics. **Transparent background preserved, batch upload supported, no watermark.** The conversion runs in your browser using the built-in rendering pipeline, so your SVGs (often brand logos and design assets you would rather not upload) stay on your device.',
    sections: [
      {
        heading: 'Why go from SVG to PNG',
        body:
          "SVG is great for the web — infinitely scalable, small file size, easy to style with CSS. But **plenty of destinations still want raster**: social media uploads, email clients that do not render SVG, print shops, slide decks, PowerPoint, older Android apps, and some ad networks. Converting SVG to PNG at a specific pixel size gives you a raster fallback without losing the vector original. Keep the SVG as your source of truth and export PNGs on demand.",
      },
      {
        heading: 'Picking the right PNG size',
        body:
          "A vector has no native resolution, so the question is **what size does the destination actually display?** For a logo on a web page at 200px wide, export at 400x400 (2x for Retina). For a social media post at 1080x1080, export at 1080 or 2160 for HiDPI. For print, aim for 300 DPI at the physical size — 8x10 inches at 300 DPI = 2400x3000. Exporting way bigger than needed just bloats file size.",
      },
      {
        heading: 'Transparent background or solid color',
        body:
          "SVGs usually have transparent backgrounds. By default the PNG export preserves that — drop the result onto any color or image and the logo floats cleanly. If your destination needs a solid background (some printer workflows, some email signatures), pick a background color in the export settings. For a full compositing workflow, chain with the [photo filters](/photo-filters-online) to add effects or the [profile picture maker](/profile-picture-maker) to drop the logo onto a branded circle.",
      },
    ],
    useCases: [
      {
        title: 'Logo exports for presentations',
        body:
          'Export your logo SVG at slide-appropriate sizes for Keynote, Google Slides, or PowerPoint.',
      },
      {
        title: 'Social media from a design file',
        body:
          'Figma and Sketch export SVG. Convert to PNG at 1080x1080 for Instagram, 1200x675 for Twitter, 1200x630 for LinkedIn shares.',
      },
      {
        title: 'Email signature and header images',
        body:
          "Most email clients render PNG reliably but struggle with SVG. Convert once and paste into signature settings.",
      },
      {
        title: 'Print shop handoff',
        body:
          "Print shops want raster at 300 DPI. Pick the physical size, the tool does the pixel math, and you hand off a print-ready PNG.",
      },
    ],
    faq: [
      {
        q: 'Does the transparent background carry over?',
        a: 'Yes — transparency is preserved by default. You can also pick a solid background color in the export settings.',
      },
      {
        q: 'What is the maximum output resolution?',
        a: 'Practically limited by your device memory. 10000x10000 works on modern laptops. For most use cases, 2000-4000px is plenty.',
      },
      {
        q: 'Can I batch convert multiple SVGs?',
        a: 'Yes — drop in a folder of SVGs and convert them all at the same pixel size. Output is a zip of the PNGs.',
      },
      {
        q: 'Are my SVGs uploaded?',
        a: "No. The rendering runs in your browser. Your SVG assets stay on your device.",
      },
      {
        q: 'Does it handle SVG with embedded fonts?',
        a: 'Embedded fonts render correctly. Externally-linked fonts (Google Fonts etc.) render using the browser defaults or fall back — best to convert text to outlines in your design tool first for guaranteed fidelity.',
      },
      {
        q: 'Can I also convert PNG back to SVG?',
        a: "Raster-to-vector tracing is a separate tool. This converter is strictly SVG-to-PNG, which is lossless (no detail invented or lost beyond the chosen pixel resolution).",
      },
    ],
  },

  'base64-converter': {
    metaDesc:
      'Convert images to Base64 free online — PNG, JPG, SVG, WebP to data URI. Decode Base64 back to image. Runs in your browser.',
    intro:
      'Encode any image as a Base64 data URI you can paste directly into HTML, CSS, or Markdown — or decode a Base64 string back into a downloadable image. **No uploads, no size limits beyond your device memory.** This is the tool devs actually want: a fast, local Base64 encoder that handles JPG, PNG, SVG, WebP, and small GIFs without wrapping every output in a pitch for a paid tier.',
    sections: [
      {
        heading: 'What Base64 is and when to use it',
        body:
          "Base64 is a way to represent binary data as plain text. For images, the encoding produces a string that starts with `data:image/png;base64,...` and can be **pasted directly into an `<img src>` or CSS `background-image`** without needing a separate file. Useful for emails (where referencing external images can be blocked), for small icons in CSS to save HTTP requests, for quick embedding in JSON APIs, and for sending images through text-only protocols.",
      },
      {
        heading: 'When not to Base64-encode',
        body:
          "Base64 encoding grows the data by about 33% compared to the raw file, and the encoded string does not cache separately from the HTML or CSS it is in. **For anything above ~10KB or reused across pages, a regular image file is smaller and faster**. Base64 shines for tiny icons, logo marks in email signatures, and one-off embeds where a separate HTTP request is overkill. If you are debating inlining a large hero image, do not — ship it as a separate file and [compress](/tool/compress) it.",
      },
      {
        heading: 'Encoding vs decoding',
        body:
          "Encode: upload an image, get the Base64 string. The tool wraps it in a full data URI ready to paste. Decode: paste a Base64 string (with or without the `data:image/...;base64,` prefix) and the tool renders it back to an image you can preview and download. Handy for inspecting Base64 you found in someone else's HTML or CSS, or for saving an image out of a tool that only hands you a data URI.",
      },
    ],
    useCases: [
      {
        title: 'Inline images in HTML email',
        body:
          'Base64-encode a small logo or header image so it renders without a remote fetch that corporate email filters might block.',
      },
      {
        title: 'CSS background icons',
        body:
          'Tiny icons as Base64 in CSS saves an HTTP request and avoids the flash while the file loads. Good for under-10KB icons.',
      },
      {
        title: 'API and JSON payloads',
        body:
          'Encode image uploads into JSON payloads when working with APIs that expect Base64 binary fields.',
      },
      {
        title: 'Decoding from browser dev tools',
        body:
          "Right-clicked an image in DevTools and got a Base64 data URI? Paste it here to render and save as a regular PNG or JPG.",
      },
    ],
    faq: [
      {
        q: 'How much bigger is a Base64 image?',
        a: 'About 33% larger than the raw binary file — every three bytes become four characters. For reference, a 10KB PNG becomes a ~13.3KB Base64 string.',
      },
      {
        q: 'Does the output include the data URI prefix?',
        a: 'Yes by default (`data:image/png;base64,...`), ready to paste into an `<img src>` or CSS `background-image`. You can also copy just the raw Base64 if your destination expects that.',
      },
      {
        q: 'What formats can I encode?',
        a: 'JPG, PNG, SVG, WebP, GIF, and small HEIC files. Encoding works on any binary input — the only thing that matters is whether the destination can render the resulting MIME type.',
      },
      {
        q: 'Are my images uploaded?',
        a: "No. Encoding and decoding run entirely in your browser.",
      },
      {
        q: 'Can I decode a Base64 string that is missing the prefix?',
        a: "Yes — paste just the raw Base64 and the tool tries to detect the image type automatically. If it guesses wrong, you can pick the MIME type manually.",
      },
      {
        q: 'What is the max size?',
        a: "Device memory is the limit. Practically, Base64 makes sense for files under 50KB. Beyond that, use a regular image file with an [image compressor](/tool/compress) run over it.",
      },
    ],
  },

  'social-preview': {
    metaDesc:
      'Social media preview generator — check how your links look on Twitter, Facebook, LinkedIn, Slack, Discord. Fix OG tags fast.',
    intro:
      'See how any URL will render when shared on Twitter, Facebook, LinkedIn, Slack, Discord, and iMessage — in one preview. **Paste a URL, see all the Open Graph previews side by side**, spot missing tags and broken image dimensions before you publish. Updates in real time as you tweak the meta tags, so you can ship a post you know looks right everywhere.',
    sections: [
      {
        heading: 'Why preview tools matter',
        body:
          "Each social platform pulls different Open Graph tags, applies different image ratios (1.91:1 for most, 1:1 for some), and caches aggressively. **Your link often looks perfect on one platform and broken on another**, and the cache means you cannot just 'post and see' — by the time you spot the issue, the first round of shares is already out there with the bad preview. A preview tool shows every platform in one view so you fix it once, before publishing.",
      },
      {
        heading: 'What the generator checks',
        body:
          "For any URL it pulls `<meta property='og:title'>`, `og:description`, `og:image`, `og:url`, and `og:type`, plus the Twitter equivalents (`twitter:card`, `twitter:title`, etc.). It shows what each field will produce, flags missing tags, and warns when image dimensions are wrong for a platform. **If your image is under 1200x630, LinkedIn and Facebook will scale it up and blur**. If it is not 1.91:1, some platforms crop it in ugly places.",
      },
      {
        heading: 'Making a good preview image',
        body:
          "The canonical OG image is **1200x630 pixels**. Include a headline the viewer will read at thumbnail size (big text, 48pt+), a brand color, and a single strong visual. Avoid putting anything important in the last 100px of the right or bottom edge — those get cropped on some platforms. To build one, start with the [crop tool](/tool/crop) locked to 1200x630, add text in the [photo filters](/photo-filters-online) or [meme generator](/meme-generator-online), then [compress](/tool/compress) to keep it fast to load.",
      },
    ],
    useCases: [
      {
        title: 'Blog post and article launches',
        body:
          'Paste the URL of your new post and verify the preview across platforms before promoting it.',
      },
      {
        title: 'Campaign landing pages',
        body:
          "Make sure the campaign hero image is rendering correctly on every channel you are going to share through.",
      },
      {
        title: 'Debugging broken Open Graph tags',
        body:
          "When a link renders without an image, the preview tool tells you which tag is missing or malformed.",
      },
      {
        title: 'E-commerce product shares',
        body:
          'Verify that your product page previews show the right image and price hook before a sale or promo.',
      },
    ],
    faq: [
      {
        q: 'Does it bypass platform caches?',
        a: 'The preview is rebuilt from your current HTML every time, so it shows the latest state of your tags. Platforms themselves still cache — to refresh a cached preview, use the platform\'s own debugger (Facebook Sharing Debugger, LinkedIn Post Inspector, Twitter Card Validator) and re-scrape.',
      },
      {
        q: 'Which platforms does it preview?',
        a: 'Twitter/X, Facebook, LinkedIn, Slack, Discord, and iMessage. Each one renders slightly different parts of your OG and Twitter tags.',
      },
      {
        q: 'What image size should I use for OG?',
        a: '1200x630 pixels. Anything larger is fine (platforms downscale cleanly). Smaller than 600x315 gets rejected by Facebook and LinkedIn.',
      },
      {
        q: 'Why does my link show no image on LinkedIn?',
        a: "Usually one of three things: missing `og:image` tag, image URL is a relative path instead of absolute, or LinkedIn has a stale cache. Run the link through LinkedIn's Post Inspector to force a re-scrape.",
      },
      {
        q: 'Does the preview fetch my live URL?',
        a: 'Yes — it needs to read your current HTML to parse the tags. The URL is fetched and parsed in your browser; nothing is stored.',
      },
      {
        q: 'Can I preview a URL that requires authentication?',
        a: 'No — the tool fetches the public URL the same way a crawler would. For staged or private pages, test the OG tags on a publicly accessible preview branch.',
      },
    ],
  },

  'image-compare': {
    metaDesc:
      'Compare two images side-by-side or with a slider — before and after, design revisions, edited vs original. Private, in your browser.',
    intro:
      'Put two images next to each other with a **draggable slider**, a side-by-side split, or a flicker toggle. **Perfect for before/after edits, design revisions, product comparisons, photography retouches, and spotting the difference between two versions of the same image.** Runs in your browser, so the images you compare (often unreleased designs or edits) stay private.',
    sections: [
      {
        heading: 'Slider, split, or flicker — which to use',
        body:
          "**Draggable slider** is the most compelling for before/after on social — viewers drag and see the transformation happen. Great for photography retouches, background removal, and home-improvement content. **Side-by-side split** is better for design revisions or two-variant comparisons where you need to see both in full at once. **Flicker (A/B toggle)** flashes between the two images — the fastest way to catch subtle differences the human eye misses in static comparison, used a lot in game art QA and medical imaging.",
      },
      {
        heading: 'What makes a good before/after',
        body:
          "**Matching crop, matching exposure, matching perspective.** If the 'after' shot is taken from a slightly different angle or lighting, viewers see the angle change instead of your actual edit. For retouches and AI-enhanced images, keep the source image and edit from the same file rather than re-shooting. For product or home comparisons, lock the camera position (tripod or marked spot) between shots. Then use this tool to drop both into a polished comparison.",
      },
      {
        heading: 'Export options',
        body:
          "The comparison can be exported as a static image (both halves shown) for blog posts or product pages, or as an animated GIF/WebP that scrubs from left to right for social posts. For interactive embeds, the tool can export an HTML snippet you drop into your site — the slider works natively in any browser. If you want a super-polished before-and-after with a frame, take the exported static comparison and run it through the [photo filters](/photo-filters-online) for branding.",
      },
    ],
    useCases: [
      {
        title: 'Photography retouching',
        body:
          'Show before and after for color grading, skin retouching, sky replacement, or background cleanup.',
      },
      {
        title: 'Design revisions',
        body:
          "Compare v1 and v2 of a design for client reviews — slider makes the changes instantly visible.",
      },
      {
        title: 'Home improvement and renovations',
        body:
          'Kitchen before and after, room redesign, before-and-after staging — the slider works beautifully for real estate and DIY content.',
      },
      {
        title: 'Product variants',
        body:
          'Same product in two color options or two finish levels — comparison sliders are a conversion hack on product pages.',
      },
    ],
    faq: [
      {
        q: 'Can I export the comparison as a single image?',
        a: 'Yes — both halves exported as one image, either side-by-side or with the slider caught at the midpoint.',
      },
      {
        q: 'Can I export an animated before/after?',
        a: 'Yes — export as GIF or WebP that auto-scrubs from left to right. Great for Twitter, Instagram, and landing pages.',
      },
      {
        q: 'What if my two images are different sizes?',
        a: "The tool auto-fits both to the same display dimensions for comparison. For best results, crop both to the same size and ratio first.",
      },
      {
        q: 'Are my images uploaded?',
        a: "No. Comparison, alignment, and export all run in your browser. Images stay on your device.",
      },
      {
        q: 'Can I embed the slider on my site?',
        a: 'Yes — the tool can export a self-contained HTML snippet you paste into your site. No JavaScript library needed.',
      },
      {
        q: 'Does it handle transparency?',
        a: 'Yes — transparent PNGs show the background through them. Useful for comparing a cutout against the original photo.',
      },
    ],
  },

  'redact': {
    metaDesc:
      'Blur or redact images free online — faces, license plates, documents. Gaussian blur, pixelate, black box. Private, in your browser.',
    intro:
      'Blur or black-box sensitive parts of any photo — **faces, license plates, addresses, credit cards, screen content, ID numbers** — before you share or post. Runs in your browser, which matters: redaction tools online routinely upload the exact photos people are trying to protect. This one does not. Pick a region, apply Gaussian blur, mosaic, or a solid black box, and export.',
    sections: [
      {
        heading: 'What redaction can and cannot do',
        body:
          "A strong redaction removes information permanently from the exported image. **Gaussian blur and pixelation, at sufficient strength, are unrecoverable** — there is no original data left in the image for anyone to enhance back. A solid black box is the strongest and is the right choice for legal documents, ID numbers, and anything you need to clearly demonstrate is covered. **A light blur that still lets you make out letters is not real redaction** and has been broken many times in news stories. When in doubt, use a black box.",
      },
      {
        heading: 'Faces, plates, screens, and documents',
        body:
          "**Faces** — moderate pixelation (block size 20-30px) or heavy Gaussian blur. For real anonymity, pair with cropping away identifying clothing and context. **License plates** — pixelate or black-box; plates are the single most identifying element in a car photo. **Screens and monitors** — black-box the area showing sensitive content; blur is often too weak against zoom. **Document text** — black-box, always. Also strip the photo's [EXIF metadata](/exif-remover) before sharing, because GPS coordinates in a redacted ID photo still give away where you took it.",
      },
      {
        heading: 'The right redaction workflow',
        body:
          "A good flow: take the photo, **strip EXIF first** so location metadata is gone, redact the visible sensitive areas here, then [compress](/tool/compress) for upload. The EXIF step is the one most people skip — a redacted ID photo with GPS at your home address is barely redacted at all. For photos that include a person you want to fully remove rather than blur, the [magic eraser](/magic-eraser) is the right tool.",
      },
    ],
    useCases: [
      {
        title: 'Sharing bug screenshots with a support team',
        body:
          'Black-box user names, emails, and order numbers before sending a screenshot to a third-party support agent.',
      },
      {
        title: 'Real estate and rental listings',
        body:
          'Blur faces and license plates visible in listing photos to respect privacy and comply with portal rules.',
      },
      {
        title: 'Social media posts with kids or bystanders',
        body:
          'Blur faces of people in the background before posting travel or event photos, especially shots with other people\'s kids.',
      },
      {
        title: 'Journalism and case studies',
        body:
          "Redact identifying info on documents you cite, screenshots you publish, or patient records you share with permission.",
      },
    ],
    faq: [
      {
        q: 'Is blur actually unrecoverable?',
        a: 'Heavy Gaussian blur and aggressive pixelation are effectively unrecoverable — the source information is gone. Light blur that still lets you make out letters is not. When in doubt, use a black box, which is mathematically guaranteed to reveal nothing.',
      },
      {
        q: 'Can I pixelate instead of blur?',
        a: 'Yes — mosaic/pixelation is one of the redaction modes. Visually it is a classic look for anonymized content.',
      },
      {
        q: 'Does the redaction apply permanently to the exported file?',
        a: "Yes. The exported file has the original pixels in the redacted area replaced, not just visually covered. There is no hidden layer underneath.",
      },
      {
        q: 'Are my photos uploaded?',
        a: "No. Redaction runs in your browser. Your images never leave your device.",
      },
      {
        q: 'Should I also remove EXIF metadata?',
        a: "Yes for anything sensitive — a photo of a redacted ID with GPS metadata at your home is not fully anonymous. Run the redacted output through the [EXIF remover](/exif-remover).",
      },
      {
        q: 'Can I redact multiple regions at once?',
        a: 'Yes — add as many rectangular or freeform regions as you need before exporting.',
      },
    ],
  },

  'passport': {
    metaDesc:
      'Free passport photo maker — US, UK, EU, Schengen, India sizes. 2x2 inch, 35x45mm ready. Private, runs in your browser.',
    intro:
      'Make a compliant passport or visa photo from any head-on portrait — **US 2x2 inch, UK and EU 35x45mm, Schengen, India, Canada, Australia, and more**. The tool crops to the exact required dimensions, places the head at the right height in the frame, and outputs a print-ready file. Runs in your browser, which matters because passport photos contain all of the identifying info you would rather not upload to a free service.',
    sections: [
      {
        heading: 'Why official passport sizes matter',
        body:
          "Every country has a strict spec: **photo dimensions, head height, eye-line position, background color, and usually specific requirements for expression and glasses**. A rejected photo means a rejected application, which means weeks of delay. This tool bakes in the official specs for each country — pick US, UK, EU, etc., and the cropper enforces the right dimensions and head-height ratio so the final photo meets the standard.",
      },
      {
        heading: 'Taking the source photo',
        body:
          "**Head-on, eyes open, neutral expression, plain light background, even lighting on the face, no shadows, no glasses unless medically required.** A phone on a tripod or against a stable surface, self-timer, plain white wall behind you, window light from the front. The tool can replace the background if your wall is not clean enough — run the photo through the [background remover](/remove-background) first and drop the cutout onto a plain white or light gray.",
      },
      {
        heading: 'Print at home or at a drugstore',
        body:
          "Most embassies and passport offices accept either a printed 4x6 with two or four passport photos on it, or a digital file uploaded directly. The tool exports **both**: a single passport photo at the exact size, and a 4x6 print-ready file with multiple copies arranged for a standard drugstore print. For the drugstore print, just upload the 4x6 to a photo print service and cut the photos apart at home.",
      },
    ],
    useCases: [
      {
        title: 'Passport renewal or new application',
        body:
          'US passport (2x2 in), UK passport (35x45mm), EU and Schengen visas (35x45mm), Indian passport (51x51mm) — all supported.',
      },
      {
        title: 'Driver\'s license and government ID',
        body:
          'Many state and local ID offices accept self-taken photos in a matching spec.',
      },
      {
        title: 'Work visa applications',
        body:
          'Match the photo spec for any visa country without paying a studio $20 per print.',
      },
      {
        title: 'PR cards and citizenship applications',
        body:
          "Canada, Australia, New Zealand, and others have distinct specs — the tool has the exact requirements baked in.",
      },
    ],
    faq: [
      {
        q: 'Will this be accepted by the passport office?',
        a: 'The tool enforces the official pixel dimensions and head-height ratio for each country. Final acceptance depends also on your photo quality (lighting, expression, background). If the passport office rejects, usually the issue is the photo itself, not the size.',
      },
      {
        q: 'Do I need a white background?',
        a: 'Most countries require plain white or off-white. If your original has a busy background, use the background remover first and drop the cutout onto pure white.',
      },
      {
        q: 'Can I print at home?',
        a: 'Yes — the tool exports a 4x6 print sheet with multiple copies. Print on photo paper at home or at a drugstore and cut to size.',
      },
      {
        q: 'Which countries are supported?',
        a: 'US, UK, EU (Schengen), Canada, Australia, India, China, Japan, plus most other major countries. Pick yours from the dropdown.',
      },
      {
        q: 'Are my photos uploaded?',
        a: "No. Cropping and sizing run in your browser. Your photo stays on your device.",
      },
      {
        q: 'Can I use a selfie?',
        a: "Yes — the tool crops a head-on selfie to passport dimensions. Keep the phone at eye level, not below, so the angle looks straight-on.",
      },
    ],
  },

  'rotate-flip': {
    metaDesc:
      'Rotate or flip images free online — 90, 180, 270, custom angle, horizontal/vertical mirror. Private, runs in your browser.',
    intro:
      'Rotate or flip any image in your browser — **90, 180, 270, or a custom angle, plus horizontal and vertical mirror**. Works on photos you accidentally shot sideways on your phone, scans that came in upside down, designs that need to match a different orientation, and anything that needs a mirror flip. No uploads, no quality loss, no watermark.',
    sections: [
      {
        heading: 'Fast fixes for common orientation problems',
        body:
          "Phone photos sometimes land rotated on a laptop because different programs read the EXIF 'orientation' tag differently. **This tool applies the rotation to the actual pixels** rather than just updating a metadata flag, so the image looks right everywhere — email, web, print, other phones. Use the 90 and 270 buttons for quarter turns, 180 to flip upside-down photos, or the custom angle slider to straighten a crooked horizon by a few degrees.",
      },
      {
        heading: 'Mirror flip vs rotation',
        body:
          "Mirror flip reverses left-and-right (or top-and-bottom) — the subject ends up facing the opposite direction. Great for designs that need to match a specific orientation, for fixing photos that were taken through a front-facing camera and came out mirrored, or for creating a mirrored duplicate in a design composition. Rotation turns the whole image around its center. **The two are different operations** — a mirror is not the same as a 180 turn.",
      },
      {
        heading: 'Arbitrary angles and straightening',
        body:
          "For a crooked horizon or a scanned document that came in slightly tilted, the custom angle input lets you rotate by a precise number of degrees. The tool fills in the exposed corners with transparency (or a color you pick) so you can [crop](/tool/crop) to a clean rectangle after straightening. For many photos, straightening and cropping is the one edit that makes the shot look professional — doors are vertical, horizons are flat, the eye relaxes.",
      },
    ],
    useCases: [
      {
        title: 'Fixing sideways phone photos',
        body:
          'Photo uploaded sideways to a CMS or shared via AirDrop and lost its rotation tag? Rotate once, export, done.',
      },
      {
        title: 'Straightening tilted scans',
        body:
          'A document scan that came in 2 degrees off can be fixed with the custom angle input, then cropped back to rectangular.',
      },
      {
        title: 'Mirror for design compositions',
        body:
          "Flip a cutout or logo horizontally to mirror it into a design — useful for symmetric compositions.",
      },
      {
        title: 'Selfies that came out mirrored',
        body:
          "Many phone cameras save selfies mirrored so the preview matches what you saw. Flip horizontally to get the non-mirrored version — often looks more natural.",
      },
    ],
    faq: [
      {
        q: 'Does rotating reduce image quality?',
        a: '90, 180, and 270 turns: no loss at all — pixels are just reordered. Custom angles involve resampling and lose a tiny amount of sharpness, same as any rotation in Photoshop or Preview.',
      },
      {
        q: 'What happens to the empty corners on a non-90 rotation?',
        a: 'They fill with transparency (if your output format supports it) or a background color you pick. Crop the result to a clean rectangle after rotating.',
      },
      {
        q: 'Is this the same as just setting the EXIF orientation tag?',
        a: "No — this rewrites the actual pixels. Setting only the EXIF tag is faster but unreliable across platforms. Pixel rotation is always interpreted the same way everywhere.",
      },
      {
        q: 'Can I rotate a batch at once?',
        a: 'Yes — drop multiple images in and apply the same rotation or flip to all of them.',
      },
      {
        q: 'Are my photos uploaded?',
        a: "No. Rotation and flipping run in your browser. Your photos stay on your device.",
      },
      {
        q: 'Does it preserve transparent backgrounds?',
        a: 'Yes — transparent PNGs stay transparent through rotation, and the corners exposed by non-90 rotations are also transparent.',
      },
    ],
  },

  'screenshot-beautifier': {
    metaDesc:
      'Beautify screenshots — add device frames, backgrounds, shadows. Perfect for marketing, docs, social. Private, in your browser.',
    intro:
      'Turn any plain screenshot into a **polished marketing image** — device frame around it, branded gradient background, rounded corners, soft shadow. The difference between an ugly screenshot and something you would put on a landing page is usually five seconds in this tool. Runs in your browser, no uploads, no watermark.',
    sections: [
      {
        heading: 'Why screenshot polish matters',
        body:
          "A raw screenshot is a rectangle of pixels on a white background. A beautified one is a rectangle of pixels **inside a rounded device frame, on a gradient or pattern background, with a soft drop shadow**. The same content suddenly looks like a marketing deliverable. This is the visual difference between launch posts that get shared and ones that do not — your product looks better, and the image fits better into other people's visual feeds.",
      },
      {
        heading: 'Device frames and backgrounds',
        body:
          "The tool has preset frames for **MacBook, iPhone, iPad, Android phone, Chrome browser window, and plain rounded corners**. Backgrounds include gradients, solid brand colors, noise textures, and dotted grid patterns. Pick a preset, drop in your screenshot, and the output is a ready-to-post image. For **consistency across a marketing set**, set the same frame and background once and batch-apply.",
      },
      {
        heading: 'Sizing for each destination',
        body:
          "For Twitter posts, 1600x900 is the sweet spot. For product landing pages, 2400x1600 gives enough resolution for retina displays. For Open Graph previews, 1200x630. The tool picks sane defaults but you can override, or [resize](/tool/resize) the output for a specific destination. Pair with the [social preview checker](/social-media-preview-generator) to confirm your beautified screenshot renders right across platforms.",
      },
    ],
    useCases: [
      {
        title: 'Product launches and feature posts',
        body:
          'Framed screenshot on a brand gradient — the default look for launch tweets, Product Hunt submissions, and feature blog posts.',
      },
      {
        title: 'Documentation and tutorials',
        body:
          "Screenshots with device frames in docs look intentional and help visually separate app UI from the surrounding text.",
      },
      {
        title: 'App Store and marketing material',
        body:
          "App Store screenshots often need device frames and background copy — beat the competition with polished visuals.",
      },
      {
        title: 'Social media posts with UI content',
        body:
          "Any tweet or LinkedIn post that shows a piece of software benefits from a framed screenshot over a raw one.",
      },
    ],
    faq: [
      {
        q: 'What device frames are available?',
        a: 'MacBook, iPhone, iPad, Android phone, Chrome browser window, Safari browser window, and generic rounded rectangles. Enough to cover most marketing contexts.',
      },
      {
        q: 'Can I set a custom background color or gradient?',
        a: "Yes — any solid color, any two-color gradient, or a preset pattern. Match your brand colors for a consistent visual language.",
      },
      {
        q: 'Can I batch-process screenshots with the same look?',
        a: "Yes — set frame and background once, drop multiple screenshots in, export a zip of consistently-beautified images.",
      },
      {
        q: 'Are my screenshots uploaded?',
        a: "No. The framing and rendering happens in your browser. Screenshots of internal dashboards, unreleased features, and private data stay private.",
      },
      {
        q: 'Can I add captions or callouts?',
        a: 'Yes — text callouts with arrows are built in. For heavier annotation, export the beautified screenshot and open it in the [photo filters](/photo-filters-online) for a final pass.',
      },
      {
        q: 'What output format is best for the web?',
        a: 'PNG for crisp UI detail, WebP for the smallest file at the same visible quality. PNG is the safer default — use WebP when file size matters more than maximum compatibility.',
      },
    ],
  },

  'palette-generator': {
    metaDesc:
      'Free color palette generator — extract palettes from any image, export hex, RGB, HSL. Private, runs in your browser.',
    intro:
      'Pull a color palette out of any photo — **dominant colors, accent tones, and a harmonious 5-color set ready for a design**. Drop in a reference image (a brand shot, a moodboard pic, a favorite photo) and the tool analyzes it locally and hands back hex, RGB, and HSL codes you can paste into any design tool. Runs in your browser, no uploads, no signup.',
    sections: [
      {
        heading: 'How the palette is picked',
        body:
          "The tool samples the image, clusters similar colors together, and picks representatives from each major cluster. **You get a balanced palette rather than five shades of the same color** — usually 5-8 colors that actually represent the range of the image. For a tightly-colored image (a sunset, a product against a background), you might get fewer distinct colors; for a varied scene (a street photo, a colorful interior), you get more.",
      },
      {
        heading: 'What to do with the palette',
        body:
          "Paste the hex codes into **Figma, Sketch, CSS variables, Tailwind config, Notion, or your design file**. For brand work, pull a palette from the mood that inspired the brand and use it as a starting point. For blog posts, grab 3 colors from the hero image and use them across the post for visual cohesion. For product pages, build the accent and CTA colors from the product photo so everything looks like it belongs.",
      },
      {
        heading: 'Beyond extraction — harmonies and adjustments',
        body:
          "The tool also suggests harmonies on top of the extracted palette — **complementary, analogous, triadic, and shades**. Useful when the extracted colors are beautiful but you need one more CTA color and do not want to guess. For UI work, the 'accessible contrast' mode will filter and pair colors so the text-on-background pairs actually pass WCAG AA. Combine palettes from multiple photos for a richer brand set.",
      },
    ],
    useCases: [
      {
        title: 'Brand and logo color exploration',
        body:
          'Pull palettes from moodboard photos to seed brand color decisions backed by real-world inspiration.',
      },
      {
        title: 'Blog and marketing site design',
        body:
          "Match the hero image to the surrounding design by building the site's accent colors from the image itself.",
      },
      {
        title: 'Presentation and slide themes',
        body:
          "Build a Keynote or Google Slides theme based on a photo theme — great for brand-aligned decks.",
      },
      {
        title: 'Interior design and art references',
        body:
          "Extract a palette from a room photo or a painting as a starting point for fabric, paint, or artwork selection.",
      },
    ],
    faq: [
      {
        q: 'How many colors does it extract?',
        a: 'By default, 5-8 representative colors. You can bump this up to 12 if the image has a wide color range.',
      },
      {
        q: 'What formats can I export the palette in?',
        a: 'Hex, RGB, HSL, and CSS variables. There is also a one-click copy for the whole palette as a CSS custom-properties block.',
      },
      {
        q: 'Can I adjust the extracted colors?',
        a: 'Yes — drag any color to tweak its hue, saturation, or lightness. The tool shows the adjusted hex live.',
      },
      {
        q: 'Does it suggest accessible color pairs?',
        a: 'Yes — accessibility mode flags which foreground/background pairs in your palette pass WCAG AA and AAA contrast.',
      },
      {
        q: 'Are my images uploaded?',
        a: "No. Color extraction runs in your browser. Your reference photos stay private.",
      },
      {
        q: 'Can I save and share palettes?',
        a: 'Yes — every palette has a shareable URL that encodes the colors, plus export as PNG swatch sheet, or copy as CSS variables.',
      },
    ],
  },

  'video-compressor': {
    metaDesc:
      'Compress videos free online — MP4, MOV, WebM. Shrink 50-80% without visible quality loss. Private, runs in your browser.',
    intro:
      'Shrink video files in your browser — MP4, MOV, WebM, and more. **No uploads, no signup, no watermark, no file-count limit.** Typical results: 50-80% smaller at the same visible quality, which means **videos that actually send through WhatsApp, Gmail, and Slack** without hitting size limits. Uses the browser\'s FFmpeg build, so compression runs locally on your device.',
    sections: [
      {
        heading: 'Why local video compression matters',
        body:
          "Most free online video compressors cap you at 100MB, upload the full file, re-encode on their server, and slap a watermark on the output — or lock the good settings behind a paid plan. This tool runs FFmpeg in your browser, which means **no size cap beyond your device memory, no upload time, no watermark, and nothing sent to anyone's server**. The trade-off is that encoding happens on your device, so a 10-minute 4K video takes longer on a laptop than on a cloud GPU. For most phone-sized clips it is fast.",
      },
      {
        heading: 'Quality vs size trade-offs',
        body:
          "The tool exposes a CRF (constant-quality) slider. **CRF 23** is the default — visually indistinguishable from the source for most content, typically 50-70% smaller than a phone\'s native encode. **CRF 28** drops to about 20-30% of original size with mild visible compression in high-motion scenes — good for sharing over WhatsApp or putting behind a paywall preview. Go lower than CRF 18 and you start to preserve every artifact of the original, which is rarely useful.",
      },
      {
        heading: 'Resolution, frame rate, and format',
        body:
          "Beyond quality, the other big lever is **resolution**. A 4K phone video downscaled to 1080p is dramatically smaller and looks identical on social feeds. Frame rate: drop 60fps to 30fps for further savings on anything that is not sports or slow-mo. Format: MP4 (H.264) is safest; WebM (VP9) is smaller but not every player supports it. For sharing, stick with MP4. For the web, WebM saves bandwidth if your audience is on modern browsers.",
      },
    ],
    useCases: [
      {
        title: 'Sending videos over WhatsApp, Telegram, Gmail',
        body:
          "Shrink a 100MB phone clip to 20MB so it clears messaging size limits without the quality hit of forwarding a re-recorded version.",
      },
      {
        title: 'Uploading to social without re-encoding hits',
        body:
          "Social platforms always re-encode. Uploading an already-compressed MP4 lets you control the first pass so the final result looks better.",
      },
      {
        title: 'Web and landing page autoplay videos',
        body:
          "Hero background videos on sites need to be small to load fast. Compress to under 3MB for 10-15 seconds and autoplay feels instant.",
      },
      {
        title: 'Clearing phone storage',
        body:
          "4K videos hog gigabytes. Compress to 1080p at CRF 23 and reclaim ~70% of the space with no visible change on most screens.",
      },
    ],
    faq: [
      {
        q: 'Is there a file size limit?',
        a: "No hard limit. Device memory is the ceiling. Most laptops handle 2-3 GB inputs without issue. Very long 4K videos on mobile may run out of memory — split into segments or reduce resolution first.",
      },
      {
        q: 'How much can I shrink without visible loss?',
        a: "For typical phone content, 50-70% at CRF 23 is usually invisible. Going past 80% savings starts to show compression artifacts in high-motion or detailed scenes.",
      },
      {
        q: 'Are my videos uploaded?',
        a: "No. Compression runs in your browser using FFmpeg. Nothing is sent to our servers. Even very private videos (family, confidential) stay fully local.",
      },
      {
        q: 'What formats are supported?',
        a: 'MP4, MOV, WebM, MKV, AVI on input. Output is MP4 (H.264) or WebM (VP9). MP4 is the safest default for sharing.',
      },
      {
        q: 'Why is encoding slower than a cloud service?',
        a: "Cloud services use dedicated GPU encoders. Your browser runs FFmpeg in WebAssembly on your CPU. For short clips it is fast; for hour-long 4K videos it is slow and you may prefer a desktop tool.",
      },
      {
        q: 'Does it preserve audio?',
        a: "Yes — audio is re-encoded to AAC at a reasonable bitrate. You can also strip audio if you are compressing a silent-background-video for a web hero.",
      },
    ],
  },

  'video-to-gif': {
    metaDesc:
      'Convert videos to GIF free online. Trim, crop, resize, optimize. MP4 to GIF, MOV to GIF. Private, runs in your browser.',
    intro:
      'Turn any short video clip into an animated GIF — **trim to the exact moment, crop the frame, resize for the destination, and control the size-vs-quality trade-off**. Great for Slack reactions, documentation walk-throughs, product demos, and anywhere that embeds GIF but not video. Runs in your browser using FFmpeg, so your videos never touch a server.',
    sections: [
      {
        heading: 'Why GIF when MP4 exists?',
        body:
          "MP4 is smaller and higher quality, but plenty of places still only embed GIFs reliably — **Slack messages, GitHub READMEs, some email clients, older CMS platforms, Jira tickets**. A GIF also auto-plays silently on loop without any 'click to play' overlay, which is why they dominate in docs and support contexts. For anywhere that accepts both, MP4 or WebM is better. For the contexts that don\'t, a well-made GIF is the right answer.",
      },
      {
        heading: 'Controlling size and quality',
        body:
          "GIFs are big compared to MP4 because they use a much older compression. **Three levers matter most**: length (trim tight — 3-5 seconds is the sweet spot), resolution (640x360 or 480x270 for docs, smaller for Slack), and frame rate (12-15 fps is plenty for most content, 24+ is only needed for fast motion). The tool previews the expected file size as you adjust so you can target a specific ceiling like 5MB for a Slack message or 10MB for a GitHub README.",
      },
      {
        heading: 'Workflow from capture to share',
        body:
          "A clean flow: record the screen or video, drop it in here, trim to the 3-5 second moment that matters, crop to just the relevant UI, resize to 600-800px wide, export. For product demo GIFs going into marketing, also [beautify the screenshot](/screenshot-beautifier) frames first if you want device frames in the final animation. For reaction GIFs, you usually just need trim + export.",
      },
    ],
    useCases: [
      {
        title: 'Slack reactions and inside jokes',
        body:
          'Turn a 3-second clip from a meeting or an outside video into a team-specific reaction GIF.',
      },
      {
        title: 'Product demos in documentation',
        body:
          'GIFs in README files and docs show a feature working in a way static screenshots can not.',
      },
      {
        title: 'Bug reports and support tickets',
        body:
          'Record a 5-second repro of a bug as a GIF — every ticketing platform embeds it without plugins.',
      },
      {
        title: 'Marketing and social previews',
        body:
          "Short looping product animations for Twitter, LinkedIn, and newsletter previews.",
      },
    ],
    faq: [
      {
        q: 'Why are GIFs so big?',
        a: "GIF uses 1987-era compression and a 256-color palette per frame. It was never designed for long or high-resolution clips. Keep GIFs short, small, and low-FPS — or use MP4 or WebM if the destination supports it.",
      },
      {
        q: 'What is the max input length?',
        a: "Technically no limit, but practically keep GIFs under 10 seconds. Past that the file size explodes and most destinations reject them.",
      },
      {
        q: 'Can I convert audio too?',
        a: "GIF has no audio, so audio from the source is dropped. For audio + video in one file, export MP4 or WebM instead.",
      },
      {
        q: 'Are my videos uploaded?',
        a: "No. Conversion runs in your browser using FFmpeg. Your video never leaves your device.",
      },
      {
        q: 'What resolution is best?',
        a: "For Slack and chat: 480x270. For docs and bug reports: 640x360 or 800x450. For marketing: 1080x608. Bigger GIFs look better but file size grows fast.",
      },
      {
        q: 'Can I loop or set it to play once?',
        a: "GIFs loop by default and most destinations do not offer a way to override this. If you need once-only playback, embed as MP4 or WebM with the `loop` attribute off.",
      },
    ],
  },

  'video-to-audio': {
    metaDesc:
      'Extract audio from video free online — MP4 to MP3, MOV to M4A, WebM to Opus. Private, runs in your browser, no uploads.',
    intro:
      'Pull the audio track out of any video — **MP4, MOV, WebM, MKV — into MP3, M4A (AAC), WAV, or Opus**. Useful for pulling music out of videos you have rights to, making audio podcasts from interviews, extracting voice memos from recorded calls, or just saving the sound from a clip without keeping the video. Runs in your browser, so your files never touch a server.',
    sections: [
      {
        heading: 'When to extract audio',
        body:
          "**Audio-only versions are much smaller** — a 20-minute video might be 500MB, but just its audio is maybe 20-30MB. Great for listening to interviews, talks, or lectures on the move. Podcast episodes often start as video recordings; extracting the audio is the first step to publishing. Musicians sometimes want the audio from a live recording. Voice memos stuck inside video files can be extracted for transcription.",
      },
      {
        heading: 'Which audio format to pick',
        body:
          "**MP3** — maximum compatibility, every device plays it. **M4A (AAC)** — same size, slightly better quality at the same bitrate, plays on Apple devices and most Android. **Opus** — smallest file at the same quality, ideal for voice content and modern playback platforms. **WAV** — uncompressed, huge files, only useful if you need the audio for further editing without re-compression. Default to MP3 unless you have a reason to change.",
      },
      {
        heading: 'Bitrate and size trade-offs',
        body:
          "For **voice content** (podcast, interview, lecture): 64-96 kbps mono is plenty and cuts file size dramatically. For **music**: 192-256 kbps stereo is the standard — indistinguishable from the source on most playback. Going to 320 kbps is only useful if the source was high quality to begin with; extracting 320k MP3 from a 128k source video gains nothing. The tool previews estimated file size as you choose.",
      },
    ],
    useCases: [
      {
        title: 'Podcast episodes from video interviews',
        body:
          'Record on Zoom or Riverside, extract audio, ship as a podcast episode. One file, clean audio track.',
      },
      {
        title: 'Saving music or soundtracks (where you have rights)',
        body:
          "Extract the audio from your own video recordings — band practice, home recordings, original content.",
      },
      {
        title: 'Transcription prep',
        body:
          'Audio-only is what most transcription services want. Extract, upload the small audio file, get a transcript faster.',
      },
      {
        title: 'Voice memos from screen recordings',
        body:
          "Recorded a video walkthrough with narration? Extract the audio as a standalone voice memo.",
      },
    ],
    faq: [
      {
        q: 'Are my videos uploaded?',
        a: "No. Audio extraction runs in your browser using FFmpeg. Nothing is sent to our servers.",
      },
      {
        q: 'What formats can I export to?',
        a: 'MP3, M4A (AAC), WAV, and Opus. MP3 is the safest default. M4A is a modern alternative with slightly better quality.',
      },
      {
        q: 'Does it preserve the original audio quality?',
        a: "The output quality matches your bitrate setting — pick 192 kbps or higher to preserve music detail. Voice content sounds fine at 96 kbps.",
      },
      {
        q: 'Can I trim the audio?',
        a: "Yes — set a start and end time before extracting to get just the segment you want.",
      },
      {
        q: 'What is the max video size I can process?',
        a: "Device memory is the limit. Most laptops handle 2 GB inputs without issue. For very long recordings on mobile, split the video first and process each segment.",
      },
      {
        q: 'Is it legal to extract audio?',
        a: 'Extracting audio from content you own or have rights to is fine. Extracting audio from copyrighted content you do not own is copyright infringement. The tool itself does not care — you are responsible for what you extract.',
      },
    ],
  },
};

// Slug -> toolId aliases. Keep in sync with CANONICAL_SLUG_BY_TOOL_ID.
const SLUG_TO_TOOL_ID = {
  'remove-background': 'remove-bg',
  'ai-image-upscaler': 'upscale',
  'image-converter-online': 'image-converter',
  'watermark-photos-online': 'watermark',
  'exif-remover': 'exif',
  'image-to-text': 'ocr',
  'instagram-grid-maker': 'grid-splitter',
  'profile-picture-maker': 'profile-picture',
  'photo-filters-online': 'photo-filters',
  'meme-generator-online': 'meme-generator',
  'color-palette-generator': 'palette-generator',
  'social-media-preview-generator': 'social-preview',
  'compare-images-online': 'image-compare',
  'blur-image-online': 'redact',
  'resize-passport-photo': 'passport',
  'rotate-image-online': 'rotate-flip',
};

/**
 * Returns the content entry for a given toolId or slug, or null if none exists.
 */
export function getToolContent(key) {
  if (!key) return null;
  // Conversion landing pages (/convert-{from}-to-{to}) get programmatically
  // generated content tailored to the format pair — see conversionContent.js.
  const convContent = getConversionContent(key);
  if (convContent) return convContent;
  const toolId = SLUG_TO_TOOL_ID[key] || key;
  return TOOL_CONTENT[toolId] || null;
}
