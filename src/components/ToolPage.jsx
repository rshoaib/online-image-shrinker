import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SeoWrapper from './SeoWrapper';
import DropZone from './DropZone';
import ToolLayout from './ToolLayout';
import PrivacyIndicator from './PrivacyIndicator';
import '../styles/hero.css';

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
    'favicon-generator': 'favicon', 'svg-to-png': 'svg_to_png',
    'base64-converter': 'base64',
    'rotate-flip': 'rotate_flip',
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
        <div className="tool-workspace">
          <div className="workspace-header">
             <PrivacyIndicator />
          </div>
          <ToolLayout 
            toolId={toolId} 
            files={files} 
            setFiles={setFiles} 
            onBack={onBack} 
          />
        </div>
      )}
    </SeoWrapper>
  );
};

export default ToolPage;
