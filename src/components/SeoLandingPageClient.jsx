'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DropZone from './DropZone';
import ToolLayout from './ToolLayout';
import HowItWorks from './HowItWorks';
import RelatedTools from './RelatedTools';
import ToolContent from './ToolContent';
import AdSlot from './AdSlot';
import { useFiles } from '../contexts/FilesContext';
import { getToolDataFromSlug } from '../utils/routeHelper';
import NotFound from './NotFound';

// Unified client component for all tool rendering
const SeoLandingPageClient = ({ slug, isToolRoute = false }) => {
  const { files, setFiles, handleBack } = useFiles();
  const { t } = useTranslation();

  // If it is a /tool/[toolId] route, we mimic ToolPage
  if (isToolRoute) {
    const toolId = slug; // isToolRoute means slug is toolId
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
      'favicon-generator': 'favicon', 'svg-to-png': 'svg_to_png',
      'base64-converter': 'base64',
      'rotate-flip': 'rotate_flip',
      'blur-face': 'blur_face',
      'change-bg-color': 'change_bg_color',
    };

    const getToolInfo = () => {
      const key = toolI18nMap[toolId];
      if (key) {
        return { title: t(`home.tools.${key}.title`), desc: t(`home.tools.${key}.desc`) };
      }
      return { title: 'Optimize Images', desc: 'Privacy-first image tools.' };
    };

    const info = getToolInfo();

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: info.title,
      description: info.desc,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'All'
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {files.length === 0 ? (
          <>
            <div className="hero-section">
                <div className="hero-text">
                  <button onClick={handleBack} className="back-link">← Back to Tools</button>
                  <h1>{info.title}</h1>
                  <p>{info.desc}</p>
                </div>
                <DropZone onFileSelect={setFiles} />
            </div>
            <ToolContent toolKey={toolId} />
            <HowItWorks toolType={toolId} />
            <RelatedTools currentTool={toolId} />
          </>
        ) : (
          <ToolLayout
            toolId={toolId}
            files={files}
            setFiles={setFiles}
            onBack={handleBack}
          />
        )}
      </>
    );
  }

  // Otherwise, it is a /[slug] route
  const data = getToolDataFromSlug(slug);
  
  if (!data) {
    return <NotFound />;
  }

  const { title, desc, toolId } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description: desc,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All'
  };

  return (
    <>
       <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
       />
       <div className="seo-landing">
          {files.length === 0 ? (
            <div className="hero-section">
                <div className="hero-text">
                  <button onClick={handleBack} className="back-link">← {title ? 'Back' : 'View All Tools'}</button>
                  <h1>{title ? title.split(' - ')[0] : 'Online Image Shrinker'}</h1>
                  <p>{desc}</p>
                </div>
                <DropZone onFileSelect={setFiles} />
            </div>
          ) : (
            <ToolLayout
              toolId={toolId}
              files={files}
              setFiles={setFiles}
              onBack={handleBack}
            />
          )}

          {files.length === 0 && <ToolContent toolKey={slug} />}

          <div style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <AdSlot format="banner" className="seo-banner-ad" />
          </div>

          <div style={{ marginTop: '40px' }}>
             <HowItWorks toolType={toolId} />
             <RelatedTools currentTool={toolId} />
          </div>
       </div>
    </>
  );
};

export default SeoLandingPageClient;
