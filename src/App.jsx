import { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout';
import ToolSelector from './components/ToolSelector';
import FAQSection from './components/FAQSection';
import HowItWorks from './components/HowItWorks';
import SeoWrapper from './components/SeoWrapper';

// Lazy-load everything not needed on the homepage
const DropZone = lazy(() => import('./components/DropZone'));
const ToolLayout = lazy(() => import('./components/ToolLayout'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));
const FeaturesSection = lazy(() => import('./components/FeaturesSection'));
const AnalyticsWrapper = lazy(() => import('./components/AnalyticsWrapper'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const BlogList = lazy(() => import('./components/BlogList'));
const BlogPost = lazy(() => import('./components/BlogPost'));
const ExifEditor = lazy(() => import('./components/ExifEditor'));
const MagicEraserEditor = lazy(() => import('./components/MagicEraserEditor'));
const VideoEditor = lazy(() => import('./components/VideoEditor'));
const VideoToGif = lazy(() => import('./components/VideoToGif'));
const VideoToAudio = lazy(() => import('./components/VideoToAudio'));
const RealtorHub = lazy(() => import('./components/RealtorHub'));
const EcommerceHub = lazy(() => import('./components/EcommerceHub'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const Contact = lazy(() => import('./components/Contact'));
const About = lazy(() => import('./components/About'));
const NotFound = lazy(() => import('./components/NotFound'));
import { 
  pdfSizePages, imageResizePages, conversionPages, videoToAudioPages, videoToGifPages,
  socialMediaPages, printReadyPages, passportPages 
} from './data/seoTemplates';

const PageLoader = () => (
  <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
     <div className="loader"></div>
     <style>{`
       .loader {
         border: 4px solid var(--bg-surface);
         border-top: 4px solid var(--primary);
         border-radius: 50%;
         width: 40px;
         height: 40px;
         animation: spin 1s linear infinite;
       }
       @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
     `}</style>
  </div>
);

// Inner component to use router hooks
const AppContent = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Custom navigation handler passed to Layout
  const handleNavigate = (dest) => {
    if (dest === 'home') {
      setFiles([]);
      navigate('/');
    } else if (dest === 'privacy') {
      navigate('/privacy');
    } else if (dest === 'blog') {
      navigate('/blog');
    } else if (['resize-passport-photo', 'resize-for-youtube', 'jpg-to-pdf', 'compress-png', 'resize-for-instagram', 'compress-webp', 'watermark-photos-online', 'image-to-text', 'signature-maker', 'qr-code-generator', 'photo-filters-online'].includes(dest)) {
      navigate(`/${dest}`);
    } else if (dest === 'terms') {
      navigate('/terms');
    } else if (dest === 'contact') {
      navigate('/contact');
    } else if (dest === 'about') {
      navigate('/about');
    } else {
      navigate(`/tool/${dest}`);
    }
  };

  const handleBack = () => {
    setFiles([]);
    navigate('/');
  };

  return (
    <Layout onNavigate={handleNavigate}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* HOME ROUTE */}
          <Route path="/" element={
             <SeoWrapper>
               <ToolSelector onSelectTool={handleNavigate} />
               <FeaturesSection />
               <FAQSection />
             </SeoWrapper>
          } />

          {/* PRIVACY ROUTE */}
          <Route path="/privacy" element={
            <SeoWrapper title={t('seo.privacy.title')} description={t('seo.privacy.description')}>
               <PrivacyPolicy onBack={() => navigate('/')} />
            </SeoWrapper>
          } />

          {/* TERMS & CONTACT ROUTES */}
          <Route path="/terms" element={
            <SeoWrapper title="Terms of Service - Online Image Shrinker" description="Terms and conditions for using Online Image Shrinker.">
               <TermsOfService />
            </SeoWrapper>
          } />
           <Route path="/contact" element={
            <SeoWrapper title="Contact Us - Online Image Shrinker" description="Get in touch with the Online Image Shrinker team.">
               <Contact />
            </SeoWrapper>
          } />
           <Route path="/about" element={
            <SeoWrapper title="About Us - Online Image Shrinker" description="Learn more about our privacy-first mission and the team behind Image Shrinker.">
               <About />
            </SeoWrapper>
          } />

           <Route path="/tool/video-compressor" element={
            <SeoWrapper title="Free Video Compressor - Reduce MP4 Size Online" description="Compress video files locally in your browser. No upload, no limit, privacy-first.">
              <ToolLayout toolId="video-compressor">
                 <VideoEditor />
              </ToolLayout>
            </SeoWrapper>
          } />

          <Route path="/tool/video-to-gif" element={
            <SeoWrapper title="Free Video to GIF Converter - High Quality" description="Convert MP4 to GIF online with high quality palette generation. 100% Client-Side.">
              <ToolLayout toolId="video-to-gif">
                 <VideoToGif />
              </ToolLayout>
            </SeoWrapper>
          } />

           <Route path="/tool/video-to-audio" element={
            <SeoWrapper title="Free Video to MP3 Converter - Extract Audio" description="Extract MP3 audio from video files locally. Safe, private, and fast.">
              <ToolLayout toolId="video-to-audio">
                 <VideoToAudio />
              </ToolLayout>
            </SeoWrapper>
          } />

          {/* SOLUTIONS HUBS */}
          <Route path="/solutions/for-realtors" element={
            <SeoWrapper title="Real Estate Photo Editor & Resizer" description="Optimize property photos for MLS & Zillow. Resize, brighten, and watermark images instantly.">
              <RealtorHub />
            </SeoWrapper>
          } />

          <Route path="/solutions/for-ecommerce" element={
            <SeoWrapper title="E-commerce Product Photo Optimizer" description="Prepare product photos for Shopify, Etsy & Amazon. Remove backgrounds and crop for sales.">
              <EcommerceHub />
            </SeoWrapper>
          } />

          {/* TOOL ROUTES (Compress, Resize, etc) */}
          <Route path="/tool/:toolId" element={
            <ToolPage 
              files={files} 
              setFiles={setFiles} 
              onBack={handleBack} 
            />
          } />

          {/* SEO LANDING PAGES */}
          <Route path="/compress-jpeg" element={
            <SeoLandingPage 
               toolId="compress" 
               title={t('seo.compress_jpeg.title')}
               description={t('seo.compress_jpeg.description')}
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />
          
          <Route path="/resize-for-instagram" element={
            <SeoLandingPage 
               toolId="resize" 
               title={t('seo.resize_instagram.title')}
               description={t('seo.resize_instagram.description')}
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/jpg-to-pdf" element={
             <SeoLandingPage 
               toolId="pdf" 
               title={t('seo.jpg_to_pdf.title')}
               description={t('seo.jpg_to_pdf.description')}
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

        <Route path="/compress-png" element={
           <SeoLandingPage 
             toolId="compress" 
             title={t('seo.compress_png.title')}
             description={t('seo.compress_png.description')}
             files={files} setFiles={setFiles} onBack={handleBack}
          />
        } />

        <Route path="/compress-webp" element={
           <SeoLandingPage 
             toolId="compress" 
             title={t('seo.compress_webp.title')}
             description={t('seo.compress_webp.description')}
             files={files} setFiles={setFiles} onBack={handleBack}
          />
        } />

        <Route path="/resize-passport-photo" element={
           <SeoLandingPage 
             toolId="passport" 
             title={t('seo.resize_passport.title')}
             description={t('seo.resize_passport.description')}
             files={files} setFiles={setFiles} onBack={handleBack}
          />
        } />

        <Route path="/resize-for-youtube" element={
           <SeoLandingPage 
             toolId="crop" 
             title="Resize for YouTube Thumbnails (1280x720) - 16:9"
             description="Create perfect YouTube thumbnails. Crop to 16:9 aspect ratio and resize validation."
             files={files} setFiles={setFiles} onBack={handleBack}
          />
        } />

          <Route path="/remove-background" element={
             <SeoLandingPage 
               toolId="remove-bg" 
               title="Free AI Background Remover - Instant & Private"
               description="Remove image backgrounds automatically with AI. 100% free and works locally in your browser."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/ai-image-upscaler" element={
             <SeoLandingPage 
               toolId="upscale" 
               title="AI Image Upscaler - Enhance Resolution Free"
               description="Upscale images up to 4x using AI. Enhance details and quality without uploading files."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/instagram-grid-maker" element={
             <SeoLandingPage 
               toolId="grid-splitter" 
               title="Instagram Grid Maker - Split Images Online"
               description="Split your photos into a 3x3 grid for your Instagram profile. Free, watermark-free, and works locally."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/blur-image-online" element={
             <SeoLandingPage 
               toolId="redact" 
               title="Blur Image Online - Privacy Redactor"
               description="Blur faces, text, or sensitive information on your images securely. Edits happen in your browser."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/profile-picture-maker" element={
             <SeoLandingPage 
               toolId="profile-picture" 
               title="Free Profile Picture Maker - Custom & Private"
               description="Create professional profile pictures for LinkedIn, Instagram, and more. Remove background and add custom colors instantly."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/screenshot-beautifier" element={
             <SeoLandingPage 
               toolId="screenshot-beautifier" 
               title="Screenshot Beautifier - Add Backgrounds & Window Frames"
               description="Turn boring screenshots into beautiful mockups. Add window frames, shadows, and gradients instantly."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/exif-remover" element={
             <SeoLandingPage 
               toolId="exif" 
               title="Free EXIF Data Viewer & Remover - View Metadata"
               description="View hidden image metadata (GPS, Date, Camera) and remove it instantly. Protect your privacy before sharing photos."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/image-converter-online" element={
             <SeoLandingPage 
               toolId="image-converter" 
               title="Free Image Converter - JPG, PNG, WebP"
               description="Convert images between JPG, PNG, and WebP formats online. Secure, fast, and works locally in your browser."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/meme-generator-online" element={
             <SeoLandingPage 
               toolId="meme-generator" 
               title="Free Meme Generator - Create Viral Memes"
               description="Make memes online with custom Top and Bottom text. uses the classic Impact font. fast, free, and watermark-free."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/color-palette-generator" element={
             <SeoLandingPage 
               toolId="palette-generator" 
               title="Free Color Palette Generator - Extract Hex & RGB"
               description="Extract beautiful color palettes from any image automatically. Get Hex, RGB, and color codes instantly."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/watermark-photos-online" element={
             <SeoLandingPage 
               toolId="watermark" 
               title="Watermark Photos Online - Free & Private"
               description="Add text and logo watermarks to your photos securely. Customizable fonts, colors, and opacity. Works locally in your browser."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/collage-maker" element={
             <SeoLandingPage 
               toolId="collage-maker" 
               title="Free Photo Collage Maker - Join Photos Online"
               description="Create beautiful photo collages online. Combine images side-by-side or in grids. No watermark, free and private."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          
          {/* PROGRAMMATIC SEO ROUTES */}
          {/* PDF Compression by Size */}
          {pdfSizePages.map(page => (
            <Route 
              key={page.slug}
              path={`/compress-pdf-to-${page.slug}`} 
              element={
                <SeoLandingPage 
                  toolId="pdf" 
                  title={`Compress PDF to ${page.size} Online (Free)`}
                  description={`Instantly reduce PDF file size to ${page.size} or less. Works locally in your browser for maximum privacy.`}
                  files={files} setFiles={setFiles} onBack={handleBack}
                />
              } 
            />
          ))}

          {/* Image Resizing */}
          {imageResizePages.map(page => (
            <Route 
              key={page.slug}
              path={`/resize-image-to-${page.slug}`} 
              element={
                <SeoLandingPage 
                  toolId="resize" 
                  title={`Resize Image to ${page.label || page.width + 'x' + page.height} (Free)`}
                  description={`Resize JPG, PNG, or WebP images to ${page.label || page.width + 'x' + page.height} pixels instantly. No upload required.`}
                  files={files} setFiles={setFiles} onBack={handleBack}
                />
              } 
            />
          ))}

          {/* Conversions */}
          {conversionPages.map(page => (
            <Route 
              key={page.slug}
              path={`/convert-${page.slug}`} 
              element={
                <SeoLandingPage 
                  toolId="image-converter" 
                  title={`Convert ${page.from} to ${page.to} Online (Free)`}
                  description={`Fastest way to convert ${page.from} images to ${page.to} format. Batch processing supported, 100% private.`}
                  files={files} setFiles={setFiles} onBack={handleBack}
                />
              } 
            />
          ))}

          {/* Video to GIF */}
          {videoToGifPages.map(page => (
            <Route 
              key={page.slug}
              path={`/convert-${page.slug}`} 
              element={
                <SeoLandingPage 
                  toolId="video-to-gif" 
                  title={`Convert ${page.from} to ${page.to} Online (Free)`}
                  description={`Make high quality GIFs from ${page.from} videos without uploading. Control FPS and size.`}
                  files={files} setFiles={setFiles} onBack={handleBack}
                />
              } 
            />
          ))}

          
          {/* Social Media Pages */}
          {socialMediaPages.map(page => (
            <Route 
              key={page.slug}
              path={`/resize-for-${page.slug}`} 
              element={
                <SeoLandingPage 
                  toolId={page.toolId} 
                  title={`${page.label} Resizer - Free Online Tool`}
                  description={`Resize images for ${page.label} (${page.width}x${page.height}) instantly. No watermark, privacy-first.`}
                  files={files} setFiles={setFiles} onBack={handleBack}
                />
              } 
            />
          ))}

          {/* Print Ready Pages */}
          {printReadyPages.map(page => (
            <Route 
              key={page.slug}
              path={`/print-${page.slug}`} 
              element={
                <SeoLandingPage 
                  toolId={page.toolId} 
                  title={`${page.label} Maker - Free Online`}
                  description={`Create ${page.label} formatted images instantly. 300 DPI ready for printing. Private & Free.`}
                  files={files} setFiles={setFiles} onBack={handleBack}
                />
              } 
            />
          ))}

          {/* Passport Pages */}
          {passportPages.map(page => (
            <Route 
              key={page.slug}
              path={`/passport-photo-${page.slug}`} 
              element={
                <SeoLandingPage 
                  toolId={page.toolId} 
                  title={`Free ${page.label} Maker - Biometric Standard`}
                  description={`Create valid ${page.label}s online. AI background removal and correct sizing. 100% Client-side privacy.`}
                  files={files} setFiles={setFiles} onBack={handleBack}
                />
              } 
            />
          ))}

          {/* Video to Audio */}
          {videoToAudioPages.map(page => (
            <Route 
              key={page.slug}
              path={`/convert-${page.slug}`} 
              element={
                <SeoLandingPage 
                  toolId="video-to-audio" 
                  title={`Convert ${page.from} to ${page.to} Online (Free)`}
                  description={`Extract high quality MP3 audio from ${page.from} video files. Fast, free, and private.`}
                  files={files} setFiles={setFiles} onBack={handleBack}
                />
              } 
            />
          ))}
          
          <Route path="/convert-heic-to-jpg" element={
             <SeoLandingPage 
               toolId="image-converter" 
               title="HEIC to JPG Converter - Free Online"
               description="Convert HEIC/HEIF photos from iPhone to JPG format. Batch conversion supported."
               files={files} setFiles={setFiles} onBack={handleBack}
             />
          } />

          <Route path="/magic-eraser" element={
             <SeoLandingPage 
               toolId="magic-eraser" 
               title="Magic Eraser Online - Remove Unwanted Objects Free"
               description="Erase unwanted objects, people, or text from photos instantly using AI Inpainting. Free and Private."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/image-to-text" element={
             <SeoLandingPage 
               toolId="ocr" 
               title="Image to Text Converter - Free OCR Online"
               description="Extract text from images, scanned documents, or screenshots instantly. 100% free and private OCR using your browser."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/signature-maker" element={
              <SeoWrapper title="Free Online Signature Maker - Create Digital Signatures">
                <ToolLayout toolId="signature-maker" files={files} setFiles={setFiles} onBack={handleBack} />
              </SeoWrapper>
          } />

          <Route path="/qr-code-generator" element={
               <SeoWrapper title="Free QR Code Generator - Custom Colors & Logos" description="Create custom QR codes with logos, colors, and frames. High resolution PNG downloads. Free and private.">
                 <ToolLayout toolId="qr-code-generator" files={files} setFiles={setFiles} onBack={handleBack} />
               </SeoWrapper>
          } />

          
           <Route path="/photo-filters-online" element={
              <SeoLandingPage 
                toolId="photo-filters" 
                title="Free Photo Filters - Online Editor"
                description="Adjust brightness, contrast, saturation, temperature, and apply beautiful preset filters. 100% free and private."
                files={files} setFiles={setFiles} onBack={handleBack}
             />
           } />

           <Route path="/compare-images-online" element={
              <SeoLandingPage 
                toolId="image-compare" 
                title="Compare Images Online - Free Side-by-Side Tool"
                description="Upload two images and compare them side by side with slider, overlay, or split view. 100% private, works locally in your browser."
                files={files} setFiles={setFiles} onBack={handleBack}
             />
           } />

           <Route path="/social-media-preview-generator" element={
              <SeoLandingPage 
                toolId="social-preview" 
                title="Free Social Media Preview Generator - Create Platform-Ready Images"
                description="Create stunning social media preview images for Twitter, Facebook, LinkedIn, Instagram, and YouTube. Add text overlays, gradients, and download instantly. Free and private."
                files={files} setFiles={setFiles} onBack={handleBack}
             />
           } />

           {/* BLOG ROUTES */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* 404 CATCH-ALL */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense>
    </Layout>
  );
};

// Component to handle Tool Logic (replaces old activeTool switch)
const ToolPage = ({ files, setFiles, onBack }) => {
  const { toolId } = useParams();
  const { t } = useTranslation();
  
  // Map toolId to i18n key
  const toolI18nMap = {
    'compress': 'compress', 'resize': 'resize', 'crop': 'crop',
    'watermark': 'watermark', 'pdf': 'pdf', 'remove-bg': 'remove_bg',
    'upscale': 'upscale', 'grid-splitter': 'grid', 'redact': 'redact',
    'profile-picture': 'profile', 'screenshot-beautifier': 'screenshot',
    'exif': 'exif', 'image-converter': 'converter', 'meme-generator': 'meme',
    'palette-generator': 'palette', 'magic-eraser': 'magic_eraser',
    'ocr': 'ocr', 'qr-code-generator': 'qr_code', 'photo-filters': 'photo_filters',
    'image-compare': 'image_compare', 'social-preview': 'social_preview',
    'video-compressor': 'video_compressor', 'video-to-gif': 'video_to_gif',
    'video-to-audio': 'video_to_audio', 'collage-maker': 'collage',
    'signature-maker': 'signature',
  };

  // Map toolId to display text
  const getToolInfo = () => {
    const key = toolI18nMap[toolId];
    if (key) {
      return { title: t(`home.tools.${key}.title`), desc: t(`home.tools.${key}.desc`) };
    }
    return { title: 'Optimize Images', desc: 'Privacy-first image tools.' };
  };

  const info = getToolInfo();

  // SEO Wrapper for tools
  return (
    <SeoWrapper title={`${info.title} - Online Image Shrinker`}>
      {files.length === 0 ? (
        <div className="hero-section">
            <div className="hero-text">
              <button onClick={onBack} className="back-link">← Back to Tools</button>
              <h2>{info.title}</h2>
              <p>{info.desc}</p>
            </div>
            <DropZone onFileSelect={setFiles} />
        </div>
      ) : (
        <ToolLayout 
          toolId={toolId} 
          files={files} 
          setFiles={setFiles} 
          onBack={onBack} 
        />
      )}
      <style>{`
        .back-link {
          background: none;
          border: none;
          color: var(--primary);
          cursor: pointer;
          font-size: 0.9rem;
          margin-bottom: 20px;
          opacity: 0.8;
          transition: 0.2s;
        }
        .back-link:hover {
          opacity: 1;
          text-decoration: underline;
        }
        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          gap: 40px;
          padding: 40px 0;
          animation: fadeIn 0.5s ease-out;
        }
        .hero-text { text-align: center; }
        .hero-text h2 {
           font-size: 2.5rem;
           margin-bottom: 16px;
           background: linear-gradient(to right, #111, #666);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
        }
        .hero-text p { color: var(--text-muted); font-size: 1.1rem; }
        @keyframes fadeIn {
           from { opacity: 0; transform: translateY(20px); }
           to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </SeoWrapper>
  );
};

// Reusable SEO Landing Page Component
// Reusable SEO Landing Page Component
const SeoLandingPage = ({ toolId, title, description, files, setFiles, onBack }) => {
  // If no specific title/desc passed, SeoWrapper will fallback to home page defaults.
  // But for specific routes, we want to pass the translated strings.
  
  return (
    <SeoWrapper title={title} description={description}>
       <div className="seo-landing">
          {files.length === 0 ? (
            <div className="hero-section">
                <div className="hero-text">
                  <button onClick={onBack} className="back-link">← {title ? 'Back' : 'View All Tools'}</button>
                  <h1>{title ? title.split(' - ')[0] : 'Online Image Shrinker'}</h1>
                  <p>{description}</p>
                </div>
                <DropZone onFileSelect={setFiles} />
            </div>
          ) : (
            <ToolLayout 
              toolId={toolId} 
              files={files} 
              setFiles={setFiles} 
              onBack={onBack} 
            />
          )}
          {/* Add Content Sections Below Tool */}
          <div style={{ marginTop: '60px' }}>
             <HowItWorks toolType={toolId} />
             <FAQSection toolType={toolId} />
          </div>

          {/* Reuse styles */}
          <style>{`
            .back-link {
              background: none;
              border: none;
              color: var(--primary);
              cursor: pointer;
              font-size: 0.9rem;
              margin-bottom: 20px;
              opacity: 0.8;
              transition: 0.2s;
            }
            .back-link:hover {
              opacity: 1;
              text-decoration: underline;
            }
            .hero-section {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              flex: 1;
              gap: 40px;
              padding: 40px 0;
              animation: fadeIn 0.5s ease-out;
            }
            .hero-text { text-align: center; }
            .hero-text h1 {
              font-size: 2.5rem;
              margin-bottom: 16px;
              background: linear-gradient(to right, #111, #666);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .hero-text p { color: var(--text-muted); font-size: 1.1rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }
            @keyframes fadeIn {
               from { opacity: 0; transform: translateY(20px); }
               to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
       </div>
    </SeoWrapper>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AnalyticsWrapper>
        <AppContent />
        <CookieConsent />
      </AnalyticsWrapper>
    </BrowserRouter>
  );
}

export default App;
