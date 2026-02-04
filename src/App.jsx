import { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout';
import DropZone from './components/DropZone';
import ToolSelector from './components/ToolSelector';
import FeaturesSection from './components/FeaturesSection';
import FAQSection from './components/FAQSection';
import SeoWrapper from './components/SeoWrapper';
import AnalyticsWrapper from './components/AnalyticsWrapper';
import ToolLayout from './components/ToolLayout';

// Lazy Load Heavy Components
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const BlogList = lazy(() => import('./components/BlogList'));
const BlogPost = lazy(() => import('./components/BlogPost'));
const ExifEditor = lazy(() => import('./components/ExifEditor'));
const MagicEraserEditor = lazy(() => import('./components/MagicEraserEditor'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const Contact = lazy(() => import('./components/Contact'));

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
    } else if (['resize-passport-photo', 'resize-for-youtube', 'jpg-to-pdf', 'compress-png', 'resize-for-instagram', 'compress-webp', 'watermark-photos-online', 'image-to-text'].includes(dest)) {
      navigate(`/${dest}`);
    } else if (dest === 'terms') {
      navigate('/terms');
    } else if (dest === 'contact') {
      navigate('/contact');
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

          <Route path="/convert-heic-to-jpg" element={
             <SeoLandingPage 
               toolId="compress" 
               title={t('seo.heic_to_jpg.title')}
               description={t('seo.heic_to_jpg.description')}
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

          <Route path="/convert-heic-to-jpg" element={
             <SeoLandingPage 
               toolId="image-converter" 
               title="HEIC to JPG Converter - Free Online"
               description="Convert iPhone photos (HEIC) to JPG or PNG instantly. Works locally in your browser, no upload needed."
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

          {/* BLOG ROUTES */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

        </Routes>
      </Suspense>
    </Layout>
  );
};

// Component to handle Tool Logic (replaces old activeTool switch)
const ToolPage = ({ files, setFiles, onBack }) => {
  const { toolId } = useParams();
  
  // Map toolId to display text
  const getToolInfo = () => {
    switch(toolId) {
      case 'compress': return { title: 'Compress Images', desc: 'Reduce file size while maintaining quality.' };
      case 'resize': return { title: 'Resize Images', desc: 'Change dimensions and scale images.' };
      case 'crop': return { title: 'Social Media Cropper', desc: 'Crop your images for Instagram, YouTube, and more.' };
      case 'watermark': return { title: 'Watermark Studio', desc: 'Add text overlays to protect your content.' };
      case 'pdf': return { title: 'Images to PDF', desc: 'Convert multiple images into a single PDF document.' };
      case 'remove-bg': return { title: 'AI Background Remover', desc: 'Instantly remove backgrounds from your photos.' };
      case 'upscale': return { title: 'AI Image Upscaler', desc: 'Enhance and upscale images up to 4x with AI.' };
      case 'grid-splitter': return { title: 'Instagram Grid Maker', desc: 'Split your photos into grids (3x1, 3x3) for Instagram.' };
      case 'redact': return { title: 'Privacy Redactor', desc: 'Blur or pixelate sensitive parts of your image.' };
      case 'profile-picture': return { title: 'Profile Picture Maker', desc: 'Create perfect profile photos with custom backgrounds.' };
      case 'screenshot-beautifier': return { title: 'Screenshot Beautifier', desc: 'Add professional window frames and backgrounds to your screenshots.' };
      case 'exif': return { title: 'EXIF Data Viewer & Remover', desc: 'View and remove hidden metadata (GPS, Camera) from photos.' };
      case 'image-converter': return { title: 'Image Converter', desc: 'Convert images to JPG, PNG, and WebP formats.' };
      case 'meme-generator': return { title: 'Meme Generator', desc: 'Create viral memes with custom text instantly.' };
      case 'palette-generator': return { title: 'Color Palette Generator', desc: 'Extract beautiful color palettes from images.' };
      case 'magic-eraser': return { title: 'Magic Eraser', desc: 'Remove unwanted objects and blemishes with AI.' };
      case 'ocr': return { title: 'Image to Text', desc: 'Extract text from images instantly (OCR).' };
      default: return { title: 'Optimize Images', desc: 'Privacy-first image tools.' };
    }
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
      </AnalyticsWrapper>
    </BrowserRouter>
  );
}

export default App;
