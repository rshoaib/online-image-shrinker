import React, { lazy } from 'react';
import CropEditor from './CropEditor';
import WatermarkEditor from './WatermarkEditor';
import PdfEditor from './PdfEditor';
import BackgroundRemovalEditor from './BackgroundRemovalEditor';
import UpscaleEditor from './UpscaleEditor';
// ImageEditor and BatchEditor are lazy loaded in App.jsx, but we might want to move that here 
// or keep them passed as props if we want to maintain the suspense boundary at the top level.
// However, to make this truly self-contained, let's import them here. 
// Note: In the key logic of App.jsx, they were lazy loaded. 
// If we import them directly here, we lose the code splitting for this component strictly speaking, 
// unless we also use lazy here or rely on the parent Suspense.
// Let's keep the imports consistent with the original file for now, 
// but since this is a new file, we'll re-implement the lazy loading here to keep it clean.

const ImageEditor = lazy(() => import('./ImageEditor'));
const BatchEditor = lazy(() => import('./BatchEditor'));

const ToolLayout = ({ toolId, files, setFiles, onBack }) => {
  if (files.length === 0) {
    return null; // The parent handles the "Hero" or "Empty" state usually, or we can handle it here if we pass more props.
    // In App.jsx, the "Empty" state (Hero section) is handled inside the ToolPage/SeoLandingPage 
    // BEFORE calling the editor logic.
    // So this component specifically handles the "Editor" state when files exist.
  }

  const handleRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  switch (toolId) {
    case 'crop':
      return <CropEditor file={files[0]} onBack={onBack} />;
    case 'watermark':
      return <WatermarkEditor file={files[0]} onBack={onBack} />;
    case 'pdf':
      return <PdfEditor files={files} onBack={onBack} onRemove={handleRemove} />;
    case 'remove-bg':
      return <BackgroundRemovalEditor file={files[0]} onBack={onBack} />;
    case 'upscale':
      return <UpscaleEditor file={files[0]} onBack={onBack} />;
    default:
      if (files.length === 1) {
        return <ImageEditor file={files[0]} onBack={onBack} mode={toolId} />;
      } else {
        return (
          <BatchEditor 
            files={files} 
            onBack={onBack} 
            onRemove={handleRemove} 
            mode={toolId} 
          />
        );
      }
  }
};

export default ToolLayout;
