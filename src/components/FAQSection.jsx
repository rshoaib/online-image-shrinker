import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQSection = ({ toolType = 'general' }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const getFaqs = () => {
    const commonFaqs = [
      {
        question: "Is my data private? Do you upload my photos?",
        answer: "Yes, your data is 100% private. All processing happens locally in your browser. Your photos are never uploaded to our servers."
      },
      {
        question: "Is this tool really free?",
        answer: "Yes, our base tools are completely free to use without limits. We believe in providing accessible, high-quality tools for everyone."
      }
    ];

    const specifics = {
      'pdf': [
        { question: "Does this reduce PDF quality?", answer: "We optimize the PDF structure and images to reduce size while maintaining readability. You can choose different compression levels." },
        { question: "Can I merge PDF files?", answer: "Currently we focus on compression, but merging features are coming soon!" }
      ],
      'resize': [
        { question: "Will my image lose quality?", answer: "Resizing down (shrinking) usually maintains quality. Upscaling may cause pixelation unless you use our AI Upscaler." },
        { question: "What dimensions should I use for Instagram?", answer: "For posts use 1080x1080, for stories use 1080x1920." }
      ],
      'crop': [
        { question: "Do you have presets for Social Media?", answer: "Yes! We have built-in presets for Instagram, Facebook, Twitter, YouTube, and LinkedIn." },
        { question: "Can I crop specifically for passport photos?", answer: "Yes, check our Passport Photo tool for specific country requirements." }
      ],
      'passport': [
        { question: "Is this guaranteed to be accepted?", answer: "We provide the correct aspect ratio and dimensions, but please ensure your lighting and background meet official requirements." },
        { question: "How do I print this?", answer: "Download the image and print it on 4x6 inch photo paper at a local kiosk or pharmacy." }
      ],
      'compress': [
        { question: "How much can I reduce the file size?", answer: "Typically we can reduce file size by 50-80% without noticeable quality loss using advanced compression algorithms." },
        { question: "Does it work with WebP?", answer: "Yes, we support JPG, PNG, and WebP compression." }
      ],
      'remove-bg': [
        { question: "How does AI background removal work?", answer: "Our tool uses a machine-learning model that runs entirely in your browser to detect the subject and separate it from the background. No photo is ever uploaded." },
        { question: "What image formats are supported?", answer: "You can upload JPG, PNG, or WebP images. The result is always a transparent PNG so you can place your subject on any new background." }
      ],
      'upscale': [
        { question: "How much can I upscale an image?", answer: "You can upscale images up to 4× their original resolution. The AI model adds realistic detail so the result stays sharp." },
        { question: "Will AI upscaling look natural?", answer: "Yes, our model is trained to reconstruct textures and edges realistically. Results look best on photos; illustrations or very low-res images may vary." }
      ],
      'watermark': [
        { question: "Can I watermark multiple photos at once?", answer: "Yes! Upload a batch of images and the same watermark (text or logo) is applied to all of them in one click." },
        { question: "Can I add a logo as a watermark?", answer: "Absolutely. Upload any PNG logo and adjust its size, position, and opacity to match your brand." }
      ],
      'image-converter': [
        { question: "Which formats can I convert between?", answer: "We support JPG, PNG, WebP, BMP, GIF, TIFF, and HEIC conversions. All processing happens locally in your browser." },
        { question: "Does converting formats reduce quality?", answer: "Converting between lossless formats (PNG, BMP) preserves full quality. Converting to lossy formats (JPG, WebP) lets you choose the quality level." }
      ],
      'meme-generator': [
        { question: "Can I use custom fonts on my meme?", answer: "We use the classic Impact font for authentic memes. You can customize the text size, color, and outline to get the perfect look." },
        { question: "Are there any watermarks on my meme?", answer: "No! Your memes are completely watermark-free. Download and share them anywhere." }
      ],
      'photo-filters': [
        { question: "What kind of filters are available?", answer: "We offer preset filters like Vintage, B&W, Warm, Cool, and Vivid, plus manual controls for brightness, contrast, saturation, and temperature." },
        { question: "Can I apply filters to multiple photos?", answer: "Currently filters are applied one photo at a time for precise control. Batch support is on our roadmap." }
      ],
      'exif': [
        { question: "What metadata does EXIF contain?", answer: "EXIF data can include GPS coordinates, camera model, date taken, shutter speed, ISO, and more. Removing it protects your privacy before sharing online." },
        { question: "Is GPS location data really in my photos?", answer: "Yes, most smartphones embed GPS coordinates by default. Our EXIF remover strips all location data so your photos are safe to share." }
      ],
      'ocr': [
        { question: "What languages does OCR support?", answer: "Our OCR engine supports English and most Latin-script languages. Accuracy is highest with clear, well-lit text on a plain background." },
        { question: "Can I extract text from a screenshot?", answer: "Yes! Screenshots, scanned documents, and photos of printed text all work. For best results, ensure the text is sharp and not rotated." }
      ],
      'profile-picture': [
        { question: "What sizes does the profile picture maker support?", answer: "We provide presets for LinkedIn (400×400), Instagram (320×320), Twitter/X (400×400), Facebook (170×170), and custom sizes." },
        { question: "Can I change the background color?", answer: "Yes! Remove the existing background with AI and replace it with any solid color or gradient for a professional look." }
      ],
      'screenshot-beautifier': [
        { question: "What frame styles are available?", answer: "Choose from macOS window frames, browser mockups, or minimalist shadows. Customize background gradients and padding." },
        { question: "What resolution is the exported image?", answer: "Images are exported at the original resolution with the added frame. Great for blog posts, presentations, and social media." }
      ],
      'grid-splitter': [
        { question: "What grid sizes are supported?", answer: "You can split images into 3×1, 3×3, 3×4, or custom grid layouts. The 3×3 grid is the most popular for Instagram profiles." },
        { question: "Will the grid tiles upload to Instagram in order?", answer: "We number each tile so you can upload them in the correct sequence. Start with the bottom-right tile and work backwards." }
      ],
      'redact': [
        { question: "What's the difference between blur and pixelate?", answer: "Blur creates a smooth Gaussian effect, while pixelate creates a mosaic of colored blocks. Both permanently hide the underlying content." },
        { question: "Can the redaction be reversed?", answer: "No. Once you download the redacted image, the original content behind the blur or pixelation is permanently removed for your privacy." }
      ],
      'palette-generator': [
        { question: "How many colors are extracted?", answer: "We extract 5–8 dominant colors from your image using a color quantization algorithm. Each color shows its Hex and RGB values." },
        { question: "Can I export the palette?", answer: "Yes! Copy individual Hex codes with one click or download the full palette as a PNG swatch image." }
      ],
      'collage-maker': [
        { question: "How many images can I add to a collage?", answer: "You can combine up to 9 images in a single collage. Choose from horizontal, vertical, and grid layouts." },
        { question: "Can I adjust spacing between images?", answer: "Yes! Customize the gap size, border style, and background color to match your aesthetic." }
      ],
      'qr-code-generator': [
        { question: "Can I add a logo to my QR code?", answer: "Yes! Upload any logo and it will be placed in the center of the QR code. The error correction level adjusts automatically to keep it scannable." },
        { question: "What can I encode in a QR code?", answer: "URLs, plain text, Wi-Fi credentials, email addresses, phone numbers, and more. The QR code is generated instantly in your browser." }
      ],
      'magic-eraser': [
        { question: "How does the magic eraser work?", answer: "Paint over the unwanted object and our AI inpainting model fills in the area with realistic background content. It works entirely in your browser." },
        { question: "Can I erase text from a photo?", answer: "Yes! The magic eraser works on text, objects, people, and any other unwanted element. For best results, paint slightly beyond the edges of the object." }
      ],
      'social-preview': [
        { question: "Which social platforms are supported?", answer: "Generate preview images optimized for Twitter/X, Facebook, LinkedIn, Instagram, and YouTube with the correct dimensions for each." },
        { question: "Can I add text overlays?", answer: "Yes! Add custom headlines, descriptions, and branding text with adjustable fonts, colors, and positioning." }
      ],
      'image-compare': [
        { question: "How does image comparison work?", answer: "Upload two images and compare them using a side-by-side slider, overlay mode, or split view. Perfect for before/after comparisons." },
        { question: "Do both images need to be the same size?", answer: "No, but results are best when both images have similar dimensions. The tool will scale them to fit the comparison view." }
      ],
      'video-compressor': [
        { question: "What video formats are supported?", answer: "We support MP4, WebM, and MOV files. The compressed output is an optimized MP4 file." },
        { question: "How much can video size be reduced?", answer: "Typically 40–70% reduction depending on the original encoding. You can adjust quality settings for the best balance." }
      ],
      'video-to-gif': [
        { question: "What is the maximum GIF length?", answer: "You can create GIFs up to 30 seconds long. Adjust FPS and resolution to control the final file size." },
        { question: "Can I choose which part of the video to convert?", answer: "Yes! Set custom start and end times to convert just the clip you want into a high-quality GIF." }
      ],
      'video-to-audio': [
        { question: "What audio format is extracted?", answer: "Audio is extracted as high-quality MP3. The entire process happens locally in your browser with no upload." },
        { question: "Can I extract audio from any video?", answer: "Yes, we support MP4, WebM, and MOV video files. Simply upload and download the extracted audio track." }
      ],
      'favicon-generator': [
        { question: "What sizes are generated?", answer: "We generate favicons in 16×16, 32×32, 48×48, 180×180, and 512×512 pixels — covering all browsers and devices." },
        { question: "What file format should my source image be?", answer: "Any image format works (JPG, PNG, SVG). For best results, use a square image with a simple design that's clear at small sizes." }
      ],
      'svg-to-png': [
        { question: "Can I choose the output resolution?", answer: "Yes! Set any custom width and height for the PNG output. Perfect for creating high-resolution assets from SVG vector files." },
        { question: "Is transparency preserved?", answer: "Yes, transparent areas in your SVG are preserved in the PNG output, giving you a clean image with no background." }
      ],
      'signature-maker': [
        { question: "Can I draw my signature or type it?", answer: "Both! Draw freehand with a mouse or stylus, or type your name and choose from elegant signature fonts." },
        { question: "Is the signature background transparent?", answer: "Yes, signatures are exported as transparent PNGs so you can place them on documents, emails, or any background." }
      ]
    };

    return [...(specifics[toolType] || []), ...commonFaqs];
  };

  const faqs = getFaqs();

  // Inject FAQPage JSON-LD structured data for AEO
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    let script = document.getElementById('faq-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'faq-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(faqSchema);

    return () => {
      const el = document.getElementById('faq-jsonld');
      if (el) el.remove();
    };
  }, [faqs]);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h2><HelpCircle size={24} /> Frequently Asked Questions</h2>
        <p>Everything you need to know about our tools.</p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`} onClick={() => toggle(index)}>
            <div className="faq-question">
              <h3>{faq.question}</h3>
              {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .faq-container {
          max-width: 800px;
          margin: 60px auto;
          padding: 0 20px;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .faq-header h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 2rem;
          color: var(--text-main);
          margin-bottom: 10px;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-item {
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .faq-item:hover {
          border-color: var(--primary);
        }

        .faq-question {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--text-main);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
          background: rgba(0,0,0,0.02);
        }

        .faq-item.open .faq-answer {
          max-height: 200px;
          padding: 20px;
          border-top: 1px solid var(--border-light);
        }

        .faq-answer p {
          color: var(--text-muted);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default FAQSection;
