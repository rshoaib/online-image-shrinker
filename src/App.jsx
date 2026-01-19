import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import DropZone from './components/DropZone';
import ToolSelector from './components/ToolSelector';
import FeaturesSection from './components/FeaturesSection';
import FAQSection from './components/FAQSection';
import SeoWrapper from './components/SeoWrapper';

// Lazy Load Heavy Components
const ImageEditor = lazy(() => import('./components/ImageEditor'));
const BatchEditor = lazy(() => import('./components/BatchEditor'));
const CropEditor = lazy(() => import('./components/CropEditor'));
const WatermarkEditor = lazy(() => import('./components/WatermarkEditor'));
const PdfEditor = lazy(() => import('./components/PdfEditor'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const BackgroundRemovalEditor = lazy(() => import('./components/BackgroundRemovalEditor'));
const UpscaleEditor = lazy(() => import('./components/UpscaleEditor'));
const BlogList = lazy(() => import('./components/BlogList'));
const InstagramGuide = lazy(() => import('./components/articles/InstagramGuide'));
const HeicGuide = lazy(() => import('./components/articles/HeicGuide'));
const PassportGuide = lazy(() => import('./components/articles/PassportGuide'));
const WebPGuide = lazy(() => import('./components/articles/WebPGuide'));
const RemoveBackgroundGuide = lazy(() => import('./components/articles/RemoveBackgroundGuide'));
const UpscaleGuide = lazy(() => import('./components/articles/UpscaleGuide'));

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
  
  // Custom navigation handler passed to Layout
  const handleNavigate = (dest) => {
    if (dest === 'home') {
      setFiles([]);
      navigate('/');
    } else if (dest === 'privacy') {
      navigate('/privacy');
    } else if (dest === 'blog') {
      navigate('/blog');
    } else if (['resize-passport-photo', 'resize-for-youtube', 'jpg-to-pdf', 'compress-png', 'resize-for-instagram', 'compress-webp'].includes(dest)) {
      navigate(`/${dest}`);
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
               <ToolSelector onSelectTool={(tool) => navigate(`/tool/${tool}`)} />
               <FeaturesSection />
               <FAQSection />
             </SeoWrapper>
          } />

          {/* PRIVACY ROUTE */}
          <Route path="/privacy" element={
            <SeoWrapper title="Privacy Policy - Online Image Shrinker">
               <PrivacyPolicy onBack={() => navigate('/')} />
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
               title="Compress JPEG Images Online - Free & Private"
               description="Reduce JPEG file size by up to 90% without losing quality. Optimize your photos for web and passports instantly."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />
          
          <Route path="/resize-for-instagram" element={
             <SeoLandingPage 
               toolId="crop" 
               title="Resize Images for Instagram (Square & Story)"
               description="Crop and resize images to fit Instagram posts and stories perfectly. No watermark, free online tool."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/convert-heic-to-jpg" element={
             <SeoLandingPage 
               toolId="compress" 
               title="Convert HEIC to JPG Online - Instant & Secure"
               description="Convert iPhone photos (HEIC) to standard JPG format. Works locally in your browser for maximum privacy."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

          <Route path="/jpg-to-pdf" element={
             <SeoLandingPage 
               toolId="pdf" 
               title="Convert JPG to PDF Online - Merge Images Free"
               description="Turn your images into a PDF document in seconds. No upload needed, 100% private and secure."
               files={files} setFiles={setFiles} onBack={handleBack}
            />
          } />

        <Route path="/compress-png" element={
           <SeoLandingPage 
             toolId="compress" 
             title="Compress PNG Images Online - Transparent & Clear"
             description="Reduce PNG file size while keeping transparency perfect. Best for logos, icons, and graphics."
             files={files} setFiles={setFiles} onBack={handleBack}
          />
        } />

        <Route path="/compress-webp" element={
           <SeoLandingPage 
             toolId="compress" 
             title="Compress WebP Images - Fast & Efficient"
             description="Optimize next-gen WebP images for your website. Maximum speed, minimum file size."
             files={files} setFiles={setFiles} onBack={handleBack}
          />
        } />

        <Route path="/resize-passport-photo" element={
           <SeoLandingPage 
             toolId="crop" 
             title="Resize Photo for Passport (3.5x4.5cm) - Free Online"
             description="Crop your photo to the standard 3.5x4.5cm passport size instantly. Private, secure, and no watermark."
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

          {/* BLOG ROUTES */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/resize-instagram" element={<InstagramGuide />} />
          <Route path="/blog/heic-to-jpg" element={<HeicGuide />} />
          <Route path="/blog/passport-photo-guide" element={<PassportGuide />} />
          <Route path="/blog/speed-up-website-webp" element={<WebPGuide />} />
          <Route path="/blog/how-to-remove-background" element={<RemoveBackgroundGuide />} />
          <Route path="/blog/ai-image-upscaler-guide" element={<UpscaleGuide />} />

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
      ) : toolId === 'crop' ? (
         <CropEditor file={files[0]} onBack={onBack} />
      ) : toolId === 'watermark' ? (
         <WatermarkEditor file={files[0]} onBack={onBack} />
      ) : toolId === 'pdf' ? (
         <PdfEditor 
            files={files} 
            onBack={onBack} 
            onRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
         />
      ) : toolId === 'remove-bg' ? (
        <BackgroundRemovalEditor file={files[0]} onBack={onBack} />
      ) : toolId === 'upscale' ? (
        <UpscaleEditor file={files[0]} onBack={onBack} />
      ) : files.length === 1 ? (
        <ImageEditor file={files[0]} onBack={onBack} mode={toolId} />
      ) : (
        <BatchEditor 
          files={files} 
          onBack={onBack} 
          onRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
          mode={toolId}
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
const SeoLandingPage = ({ toolId, title, description, files, setFiles, onBack }) => {
  return (
    <SeoWrapper title={title} description={description}>
       {/* Re-use ToolPage UI logic manually or just wrap the ToolPage logic. 
           For simplicity, we replicate the ToolPage structure but force the mode. 
           Ideally we just render ToolPage with a prop override, but ToolPage reads useParams.
           So we render the inner content directly here.
       */}
       <div className="seo-landing">
          {files.length === 0 ? (
            <div className="hero-section">
                <div className="hero-text">
                  <button onClick={onBack} className="back-link">← View All Tools</button>
                  <h1>{title.split(' - ')[0]}</h1>
                  <p>{description}</p>
                </div>
                <DropZone onFileSelect={setFiles} />
            </div>
          ) : toolId === 'crop' ? (
             <CropEditor file={files[0]} onBack={onBack} />
          ) : toolId === 'watermark' ? (
             <WatermarkEditor file={files[0]} onBack={onBack} />
          ) : toolId === 'pdf' ? (
             <PdfEditor 
                files={files} 
                onBack={onBack} 
                onRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
             />
          ) : toolId === 'remove-bg' ? (
            <BackgroundRemovalEditor file={files[0]} onBack={onBack} />
          ) : toolId === 'upscale' ? (
            <UpscaleEditor file={files[0]} onBack={onBack} />
          ) : files.length === 1 ? (
            <ImageEditor file={files[0]} onBack={onBack} mode={toolId} />
          ) : (
            <BatchEditor 
              files={files} 
              onBack={onBack} 
              onRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
              mode={toolId}
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
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
