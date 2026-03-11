import React from 'react';
import SeoWrapper from './SeoWrapper';
import DropZone from './DropZone';
import ToolLayout from './ToolLayout';
import AdSlot from './AdSlot';
import HowItWorks from './HowItWorks';
import RelatedTools from './RelatedTools';
import '../styles/hero.css';

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

          <div style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <AdSlot format="banner" className="seo-banner-ad" />
          </div>

          {/* Add Content Sections Below Tool */}
          <div style={{ marginTop: '40px' }}>
             <HowItWorks toolType={toolId} />
             
              <RelatedTools currentTool={toolId} />
          </div>

       </div>
    </SeoWrapper>
  );
};

export default SeoLandingPage;
