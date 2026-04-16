/**
 * Per-conversion long-form content for the /convert-{from}-to-{to} pages.
 *
 * Why this exists: the 13 conversion landing pages were rendering with only the
 * generic "How It Works" + "You May Also Like" sections — no FAQs, no rich
 * H2 sections, no FAQPage JSON-LD. AdSense classifies that pattern as low-value
 * thin content. This module builds unique content per format pair so each page
 * has 4-5 H2s, 5-6 FAQs, FAQPage schema, and a tailored meta description.
 *
 * The generator combines:
 *   - FORMAT_INFO (per-format facts: lossy/lossless, transparency, animation,
 *     compatibility, typical size, common use cases)
 *   - PAIR_NOTES (per-pair specific motivation + nuance — 2-3 lines each)
 *
 * Output shape matches TOOL_CONTENT entries in toolContent.js:
 *   { metaDesc, intro, sections, useCases, faq }
 */

import { conversionPages } from '../data/seoTemplates';

const FORMAT_INFO = {
  JPG: {
    name: 'JPG',
    longName: 'JPEG',
    lossy: true,
    transparency: false,
    animation: false,
    blurb: 'a lossy compressed format that produces small files for photographs',
    compatibility: 'every browser, OS, image editor, email client, and printing service ever made',
    bestFor: 'photographs and complex color images headed to email, social media, or print',
    sizeNote: 'small (typically 100KB–2MB for a phone photo at high quality)',
    transparencyNote: 'JPG cannot store transparency — any transparent pixels become white',
  },
  PNG: {
    name: 'PNG',
    longName: 'Portable Network Graphics',
    lossy: false,
    transparency: true,
    animation: false,
    blurb: 'a lossless format with full alpha transparency support',
    compatibility: 'every modern browser, OS, design tool, and document editor',
    bestFor: 'screenshots, logos, icons, UI mockups, and anything that needs a transparent background',
    sizeNote: 'larger than JPG for photos, very small for flat-color graphics',
    transparencyNote: 'PNG preserves full transparency — perfect for logos, cutouts, and overlays',
  },
  WebP: {
    name: 'WebP',
    longName: 'WebP',
    lossy: 'both',
    transparency: true,
    animation: true,
    blurb: 'a modern Google-developed format that is roughly 25–35% smaller than JPG or PNG at the same visual quality',
    compatibility: 'all current browsers (Chrome, Firefox, Safari 14+, Edge), but limited support in older email clients, Microsoft Office before 2021, and some legacy CMSes',
    bestFor: 'web delivery where page weight matters and the audience uses modern browsers',
    sizeNote: 'about a third smaller than the equivalent JPG or PNG',
    transparencyNote: 'WebP supports transparency, just like PNG',
  },
  HEIC: {
    name: 'HEIC',
    longName: 'High Efficiency Image Container',
    lossy: true,
    transparency: false,
    animation: false,
    blurb: "Apple's iPhone-default photo format, which stores roughly twice the photo in the same file size as JPG",
    compatibility: 'native on iPhone and Mac, but blocked or broken on most Windows, Android, and web upload flows',
    bestFor: 'iPhone storage — but you almost always need to convert it before sharing',
    sizeNote: 'roughly half the size of an equivalent JPG',
    transparencyNote: 'HEIC does not store transparency for normal photos',
  },
  BMP: {
    name: 'BMP',
    longName: 'Windows Bitmap',
    lossy: false,
    transparency: false,
    animation: false,
    blurb: 'an uncompressed Windows format from the early 1990s — every pixel is stored verbatim, which produces gigantic files',
    compatibility: 'opens in any Windows image viewer, but most modern web platforms and CMSes reject it',
    bestFor: "almost nothing modern — it's a legacy format you usually want to convert away from",
    sizeNote: 'enormous — a 1080p BMP is roughly 6MB even though the same image as PNG is 1MB or less',
    transparencyNote: 'standard BMP does not support transparency',
  },
  GIF: {
    name: 'GIF',
    longName: 'Graphics Interchange Format',
    lossy: false,
    transparency: '1-bit',
    animation: true,
    blurb: 'a 256-color palette format from 1989, best known for short looping animations',
    compatibility: 'universal — opens everywhere',
    bestFor: 'short animations and very simple flat-color graphics',
    sizeNote: 'small for low-color graphics, surprisingly large for animations or photos',
    transparencyNote: 'GIF supports only 1-bit (binary) transparency — pixels are either fully visible or fully invisible, with no soft edges',
  },
  TIFF: {
    name: 'TIFF',
    longName: 'Tagged Image File Format',
    lossy: false,
    transparency: true,
    animation: false,
    blurb: 'a flexible lossless format used in print, scanning, and professional photography',
    compatibility: 'native in Photoshop, Lightroom, and scanner software, but no major web browser displays TIFF natively',
    bestFor: 'archival masters, scanned documents, and pre-press workflows',
    sizeNote: 'large — typically 5–50MB per page for a scanned document',
    transparencyNote: 'TIFF supports alpha channels, although most scans do not include one',
  },
};

// Per-pair specific motivation and nuance. One short paragraph each — used in
// the "Why convert X to Y?" section to keep every page distinct.
const PAIR_NOTES = {
  'png-to-jpg':
    "PNG screenshots and exports are often 5–10× larger than they need to be. Converting to JPG at quality 85 typically cuts the file 70–90% with no perceptible quality loss for natural images. The catch: any transparent pixels in your PNG will be replaced with white, so this is best for opaque photos and screenshots — not logos or cutouts.",
  'jpg-to-png':
    "JPG-to-PNG won't recover detail JPG already discarded — JPG is lossy, and that information is gone. The valid reasons to do this conversion: you need to layer the image with transparency added later in a design tool, you're feeding the file into software that requires PNG (some print drivers, certain stock photo platforms), or you want a lossless intermediate before further editing so you don't compound JPG artifacts.",
  'webp-to-png':
    "WebP is great for the web but blocked or unsupported in plenty of places — older versions of Microsoft Word, some print shops, certain ecommerce backends, Adobe products before 2018, and most email clients before 2022. PNG is the safest universally-readable lossless replacement, and the conversion is mathematically lossless when the source WebP is itself lossless.",
  'webp-to-jpg':
    "When the WebP doesn't need transparency and the destination doesn't accept WebP — say you're emailing a photo to a relative on Outlook 2016, or uploading to an old job portal — JPG is the right landing format. Expect file sizes 30–50% larger than the WebP source, but with universal compatibility.",
  'heic-to-png':
    "iPhone photos shot on iOS 11 or later are HEIC by default. Most Windows machines, Android phones, and web upload forms either reject HEIC outright or fall back to thumbnails. Converting to PNG gives you a lossless, universally-supported file — useful when you need to keep maximum quality (printing, archival, design work). For sharing on social or email, JPG is usually the better destination.",
  'bmp-to-jpg':
    "BMP files are uncompressed, which means a typical 4000×3000 BMP is 36MB. The same image as JPG at high quality is under 2MB — a 95% size reduction with no visible quality loss for photos. If you've inherited a folder of BMP files from a Windows app or an old scanner, JPG is the quickest way to make them shareable.",
  'bmp-to-png':
    "BMP-to-PNG is the lossless version of cleanup: PNG keeps every pixel intact (mathematically identical output) but compresses the file dramatically — typically 70–90% smaller than the source BMP. Use this when the source is a screenshot, a UI graphic, or anything where you cannot afford any quality loss but need a modern file size.",
  'gif-to-png':
    "When the GIF is a still image (or you just want one frame from an animation), PNG is the better container. PNG supports millions of colors instead of GIF's 256-color palette, has full alpha transparency instead of 1-bit binary transparency, and usually produces a smaller file too. Animated GIFs are converted to a still PNG of the first frame.",
  'gif-to-jpg':
    "Use this when you need a small still image from a GIF and don't need transparency. The first frame of the GIF is captured and re-encoded as a JPG, which is typically 60–80% smaller than the equivalent PNG. JPG cannot animate, so animated GIFs become a single still frame.",
  'tiff-to-jpg':
    "Scanned receipts, contracts, and document pages from a flatbed scanner usually land as TIFF — often 20–40MB per page. Email and most cloud platforms cap attachments well below that. JPG at quality 85 typically cuts the file to under 1MB per page with no readability loss. The trade-off is loss of multi-page support: each TIFF page becomes a separate JPG.",
  'tiff-to-png':
    "When you need to keep the lossless quality of a TIFF scan but want a much smaller file that opens in any browser or document editor, PNG is the right destination. PNG matches TIFF's pixel-perfect quality but typically compresses 60–80% smaller. Multi-page TIFFs are split — each page becomes one PNG.",
  'png-to-webp':
    "WebP is roughly 25–35% smaller than PNG at the same visual quality — and it preserves transparency, so your logos, icons, and cutouts survive the conversion intact. This is the standard move for shrinking page weight on a modern website. The only caveat: don't ship WebP to audiences on very old email clients or pre-2018 Adobe products without a fallback.",
  'jpg-to-webp':
    "Lossy WebP is roughly 25% smaller than the equivalent lossy JPG at matching visual quality — a meaningful improvement for image-heavy websites where every kilobyte counts toward your Core Web Vitals score. Browser support is universal among current Chrome, Firefox, Safari, and Edge versions. JPG is still safer for email or legacy targets.",
  'heic-to-jpg':
    "iPhone photos default to HEIC since iOS 11. JPG is the universal sharing format — it opens on every Windows machine, every Android phone, every email client, and every web upload form ever made. Expect the converted JPG to be roughly 2× the size of the source HEIC at the same visual quality, which is the cost of universal compatibility.",
};

// Ten generic "About the formats" sentence templates — picked deterministically
// based on the pair so each page gets unique-ish padding without being identical.
function describeFormats(from, to) {
  const f = FORMAT_INFO[from];
  const t = FORMAT_INFO[to];
  return (
    `**${from}** is ${f.blurb}. It works in ${f.compatibility}, and is best suited for ${f.bestFor}. ` +
    `**${to}** is ${t.blurb}. It works in ${t.compatibility}, and is best suited for ${t.bestFor}.`
  );
}

function transparencySection(from, to) {
  const f = FORMAT_INFO[from];
  const t = FORMAT_INFO[to];
  const fromHasTransparency = !!f.transparency;
  const toHasTransparency = !!t.transparency;

  if (fromHasTransparency && !toHasTransparency) {
    return (
      `${f.name} can store transparent backgrounds, but ${t.name} cannot. ` +
      `When you convert, every transparent pixel is filled with **white** by default. ` +
      `If your source has a transparent background you need to keep, convert to PNG or WebP instead. ` +
      `If transparency was incidental (a logo against an already-light background, for example), the white fill is usually invisible.`
    );
  }
  if (!fromHasTransparency && toHasTransparency) {
    return (
      `${t.name} supports transparent backgrounds, but ${f.name} doesn't store any transparency information to begin with. ` +
      `The conversion produces a fully opaque ${t.name} — no pixels become transparent automatically. ` +
      `If you need a transparent cutout, run the result through the [free background remover](/remove-background) afterward.`
    );
  }
  if (fromHasTransparency && toHasTransparency) {
    return (
      `Both ${f.name} and ${t.name} support transparency, so any transparent pixels in your source are preserved exactly in the output. ` +
      `Logos, icons, cutouts, and screenshots with rounded corners all convert cleanly — the alpha channel survives the transfer intact.`
    );
  }
  return (
    `Neither ${f.name} nor ${t.name} stores transparency for standard photos, so this is a straightforward photo-format conversion — no transparency-related surprises.`
  );
}

function qualitySection(from, to) {
  const f = FORMAT_INFO[from];
  const t = FORMAT_INFO[to];
  const fromLossy = f.lossy === true;
  const toLossy = t.lossy === true;

  if (!fromLossy && !toLossy) {
    return (
      `Both ${f.name} and ${t.name} are lossless formats, so the conversion is mathematically exact — every pixel value is preserved. ` +
      `What changes is how those pixels are stored: ${t.sizeNote}, while ${f.name} files are ${f.sizeNote}. ` +
      `You get the same visual image in a different (usually smaller) container.`
    );
  }
  if (fromLossy && !toLossy) {
    return (
      `${f.name} is lossy, which means the source already has compression artifacts baked in. ` +
      `Converting to lossless ${t.name} preserves the source exactly — including those artifacts — but **does not improve quality**, because the discarded detail is gone for good. ` +
      `What you get is a future-proof intermediate file you can edit further without compounding compression damage.`
    );
  }
  if (!fromLossy && toLossy) {
    return (
      `${f.name} stores every pixel losslessly. Converting to ${t.name} introduces lossy compression, which is what makes the output dramatically smaller. ` +
      `At a quality setting around 85, the visual result is virtually indistinguishable from the source for natural photographs. ` +
      `For text, line art, or sharp edges, expect some softening — that's the trade-off for the size reduction.`
    );
  }
  // both lossy
  return (
    `Both ${f.name} and ${t.name} use lossy compression, so the conversion involves decoding the source and re-encoding into the target format. ` +
    `Some quality is lost in re-encoding — usually negligible at high quality settings, but it's a one-way street. ` +
    `Keep the original ${f.name} if you might need to convert again later.`
  );
}

function privacySection(from, to) {
  return (
    `The conversion runs entirely in your browser using the built-in canvas encoders. ` +
    `Your ${from} files are never uploaded to any server, never stored, and never logged. ` +
    `That matters when you're converting passports, IDs, medical scans, financial documents, or anything else you wouldn't paste into a stranger's web form. ` +
    `Drop in dozens of files at once — there's no per-file count, no quota, and no watermark on the output.`
  );
}

function buildFAQ(from, to) {
  const f = FORMAT_INFO[from];
  const t = FORMAT_INFO[to];
  const faqs = [];

  faqs.push({
    q: `How do I convert ${from} to ${to}?`,
    a: `Drop your ${from} file (or a batch of them) into the upload area above. The converter re-encodes each file as ${to} directly in your browser and gives you a download link. No signup, no upload to a server, no watermark.`,
  });

  faqs.push({
    q: `Will I lose quality converting ${from} to ${to}?`,
    a:
      f.lossy === true && t.lossy !== true
        ? `No additional quality is lost — ${t.name} is lossless, so the converter preserves the source ${from} pixel-for-pixel (artifacts and all). Note that ${from} compression artifacts that already exist in the source cannot be removed.`
        : f.lossy !== true && t.lossy === true
        ? `Some quality is lost because ${t.name} is a lossy format. At the default quality (around 85), the visual difference is invisible for typical photographs. For text or sharp graphics, you may want to use a higher quality setting.`
        : f.lossy !== true && t.lossy !== true
        ? `No. Both formats are lossless, so the output is mathematically identical to the source — same pixels, different container.`
        : `Yes — both formats are lossy, so re-encoding loses a tiny amount of quality. At high quality settings, this is invisible to the eye. Keep your original if you may need to re-convert later.`,
  });

  // Transparency FAQ — always include, even if both formats support transparency
  if (FORMAT_INFO[from].transparency && !FORMAT_INFO[to].transparency) {
    faqs.push({
      q: `What happens to transparent backgrounds when I convert ${from} to ${to}?`,
      a: `${t.name} doesn't support transparency, so any transparent pixels in your ${from} are filled with white in the output. If you need to keep transparency, convert to PNG or WebP instead.`,
    });
  } else if (!FORMAT_INFO[from].transparency && FORMAT_INFO[to].transparency) {
    faqs.push({
      q: `Will the converted ${to} have a transparent background?`,
      a: `No — your ${from} source doesn't contain transparency information, so the output is a fully opaque ${t.name}. To create a transparent cutout, run the result through our background remover after converting.`,
    });
  } else if (FORMAT_INFO[from].transparency && FORMAT_INFO[to].transparency) {
    faqs.push({
      q: `Does the conversion preserve transparency?`,
      a: `Yes. Both ${f.name} and ${t.name} support an alpha channel, so any transparent pixels in your source are preserved exactly in the output.`,
    });
  } else {
    faqs.push({
      q: `Is there any quality difference compared to converting in Photoshop?`,
      a: `No visible difference for standard photos. The browser uses the same underlying image codecs that desktop apps use. The convenience is that you don't need to install or open anything.`,
    });
  }

  faqs.push({
    q: `Can I convert multiple ${from} files to ${to} at once?`,
    a: `Yes — drop a whole folder or select multiple files at once. Each file is converted in your browser and you can download them individually or as a single zip.`,
  });

  faqs.push({
    q: `Are my ${from} files uploaded to your server?`,
    a: `No. The conversion runs entirely in your browser using built-in image encoders. Your files never leave your device, are never logged, and are never stored on any server. There is no signup or account required.`,
  });

  faqs.push({
    q: `What's the maximum file size I can convert?`,
    a: `There's no hard limit — your device's available memory is the ceiling. Most modern laptops and phones handle ${from} files up to 50–100MB without issue. For very large files, close other browser tabs first.`,
  });

  // Format-specific bonus FAQ to keep each pair distinctive
  if (from === 'HEIC') {
    faqs.push({
      q: `Can I convert HEIC files on Windows or Android?`,
      a: `Yes. The converter decodes HEIC directly in your browser, so it works on systems that don't natively support HEIC — including Windows 10 without the HEIF Image Extensions, ChromeOS, and Android.`,
    });
  } else if (from === 'BMP') {
    faqs.push({
      q: `Why are my BMP files so much larger than the converted ${to} versions?`,
      a: `BMP stores every pixel uncompressed — there's literally no compression applied. ${to} uses modern compression that typically reduces the file size by 70–95% with ${t.lossy === true ? 'imperceptible' : 'zero'} quality loss for ${t.lossy === true ? 'photos' : 'any image'}.`,
    });
  } else if (to === 'WebP') {
    faqs.push({
      q: `Will the converted WebP work in every browser?`,
      a: `WebP works in every current version of Chrome, Firefox, Safari (14+), and Edge — covering well over 95% of web users. Older browsers and some legacy email clients (Outlook 2019 and earlier) don't support WebP, so for email or legacy targets, use ${from === 'PNG' ? 'PNG or' : ''} JPG instead.`,
    });
  } else if (from === 'GIF') {
    faqs.push({
      q: `What happens to animated GIFs when I convert them to ${to}?`,
      a: `${t.name} is a still-image format, so the converter takes the **first frame** of the animation and encodes it as ${to}. The animation itself is discarded. To convert animated GIFs to a different animation format, use a video converter instead.`,
    });
  } else if (from === 'TIFF') {
    faqs.push({
      q: `What happens to multi-page TIFF files?`,
      a: `Each page in the source TIFF becomes a separate ${to} file in the output. Page order is preserved and the files are numbered sequentially.`,
    });
  }

  return faqs;
}

function buildUseCases(from, to) {
  // Two-three concrete scenarios per pair, tailored to the formats involved.
  const cases = [];

  if (to === 'JPG') {
    cases.push({
      title: `Email a photo without hitting the attachment limit`,
      body: `Convert your ${from} file to JPG and a 10MB attachment becomes a 1MB attachment that any email client will accept.`,
    });
  }
  if (to === 'PNG') {
    cases.push({
      title: `Keep lossless quality for further editing`,
      body: `Convert ${from} to PNG when you'll be editing the result in a design tool — PNG won't add compression artifacts each time you save.`,
    });
  }
  if (to === 'WebP') {
    cases.push({
      title: `Shrink page weight on a modern website`,
      body: `Replace ${from} assets with WebP for a 25–35% reduction in image bytes — measurable improvement to Core Web Vitals scores.`,
    });
  }
  if (from === 'BMP') {
    cases.push({
      title: `Clean up an old folder of BMP files`,
      body: `Drag in a folder of legacy BMP files and pull out a zip of small modern ${to} files in one pass.`,
    });
  }
  if (from === 'HEIC') {
    cases.push({
      title: `Share iPhone photos with non-Apple users`,
      body: `Convert HEIC photos from your iPhone camera roll to ${to} so they open without a fight on Windows, Android, and old email clients.`,
    });
  }
  if (from === 'TIFF') {
    cases.push({
      title: `Make a scanned document email-friendly`,
      body: `Turn 30MB scanner output into a ${to === 'JPG' ? 'sub-1MB' : 'compact'} ${to} that fits in any email or upload form.`,
    });
  }
  if (from === 'GIF') {
    cases.push({
      title: `Grab a single frame from an animation`,
      body: `Capture the first frame of a GIF as a still ${to} for use as a thumbnail, profile picture, or reference image.`,
    });
  }
  if (from === 'WebP' && (to === 'JPG' || to === 'PNG')) {
    cases.push({
      title: `Send a WebP to someone whose software won't open it`,
      body: `Convert WebP to ${to} when the recipient is on older Microsoft Office, an old Adobe product, or an email client that doesn't render WebP.`,
    });
  }
  if (from === 'PNG' && to === 'JPG') {
    cases.push({
      title: `Shrink a screenshot without uploading anywhere`,
      body: `PNG screenshots are often 5–10× larger than they need to be. Drop one in, get a JPG that's a fraction of the size.`,
    });
  }
  if (from === 'JPG' && to === 'PNG') {
    cases.push({
      title: `Prepare a JPG for a print workflow that requires PNG`,
      body: `Some print drivers and stock-photo platforms require PNG. Convert a JPG to PNG without re-uploading to anyone's server.`,
    });
  }

  // Generic fallback case so every pair has at least 3 cards
  cases.push({
    title: `Batch-convert a folder in one pass`,
    body: `Select multiple ${from} files and pull out a zip of ${to} files. No per-file quota, no signup, no watermark.`,
  });

  return cases.slice(0, 4);
}

export function buildConversionContent({ from, to }) {
  const fInfo = FORMAT_INFO[from];
  const tInfo = FORMAT_INFO[to];
  if (!fInfo || !tInfo) return null;

  const pairKey = `${from.toLowerCase()}-to-${to.toLowerCase()}`;
  const pairNote = PAIR_NOTES[pairKey];

  const intro =
    `Convert ${from} images to ${to} format directly in your browser — no upload, no signup, no watermark. ` +
    `${pairNote || `${from} and ${to} are both standard image formats, and the conversion is fast and reliable.`} ` +
    `Drop one file or a whole folder, and the converter produces ${to} files you can download immediately.`;

  return {
    metaDesc:
      `Convert ${from} to ${to} online for free. Batch supported, no upload, runs in your browser. ` +
      `Privacy-first ${from}-to-${to} converter — your files never leave your device.`.slice(0, 160),
    intro,
    sections: [
      { heading: `Why convert ${from} to ${to}?`, body: pairNote || `${from} and ${to} both have their place — converting between them is usually about matching the destination's requirements.` },
      { heading: `About ${from} and ${to}`, body: describeFormats(from, to) },
      { heading: `Quality and file size`, body: qualitySection(from, to) },
      { heading: `Transparency and backgrounds`, body: transparencySection(from, to) },
      { heading: `Privacy: where the conversion happens`, body: privacySection(from, to) },
    ],
    useCases: buildUseCases(from, to),
    faq: buildFAQ(from, to),
  };
}

// Build a slug → {from, to} lookup once at module load.
// `conversionPages` covers the 13 templated pairs; we also include any extra
// conversion slugs registered in routeHelper.js's exactTools dict that follow
// the convert-{from}-to-{to} URL pattern.
const EXTRA_PAIRS = [
  { slug: 'convert-heic-to-jpg', from: 'HEIC', to: 'JPG' },
];

const CONVERSION_PAIRS = Object.fromEntries([
  ...conversionPages.map((p) => [`convert-${p.slug}`, { from: p.from, to: p.to }]),
  ...EXTRA_PAIRS.map((p) => [p.slug, { from: p.from, to: p.to }]),
]);

export function getConversionContent(slug) {
  const pair = CONVERSION_PAIRS[slug];
  if (!pair) return null;
  return buildConversionContent(pair);
}
