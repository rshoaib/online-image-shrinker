import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, FileOutput, ScanEye, Eye } from 'lucide-react';
import Controls from './Controls';
import CompareSlider from './CompareSlider';
import useImageProcessor from '../hooks/useImageProcessor';
import ShareCard from './ShareCard';

const ImageEditor = ({ file, onBack, mode }) => {
  const [settings, setSettings] = useState({
    width: 0,
    height: 0,
    quality: 80,
    format: 'jpeg',
    maintainAspectRatio: true
  });
  
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [processedImage, setProcessedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'compare'
  
  const { processImage, isProcessing, progress, getImageDimensions } = useImageProcessor();
  const timerRef = useRef(null);

  // Initialize
  useEffect(() => {
    if (file) {
      getImageDimensions(file).then(dims => {
        setOriginalDimensions(dims);
        setSettings(prev => ({ 
          ...prev, 
          width: dims.width, 
          height: dims.height,
          // Reset format to file type if supported, else jpeg
          format: file.type === 'image/png' ? 'png' : 'jpeg' 
        }));
      });
      // Initial preview
      setTimeout(() => setPreviewUrl(URL.createObjectURL(file)), 0);
    }
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [file, getImageDimensions]);

  // Debounced Processing
  useEffect(() => {
    if (!originalDimensions.width) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        // Force quality 100 for resize mode
        const effectiveQuality = mode === 'resize' ? 100 : settings.quality;
        const currentSettings = { ...settings, quality: effectiveQuality };

        const result = await processImage(file, currentSettings);
        setProcessedImage(result);
      } catch (error) {
        console.error("Processing failed", error);
      }
    }, 500); // 500ms debounce

  }, [settings, file, originalDimensions, mode, processImage]);

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage.url;
    link.download = `processed-image.${settings.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => setViewMode('preview')}
          >
            <Eye size={16} /> Preview
          </button>
          <button 
            className={`view-btn ${viewMode === 'compare' ? 'active' : ''}`}
            onClick={() => setViewMode('compare')}
            disabled={!processedImage}
          >
            <ScanEye size={16} /> Compare
          </button>
        </div>

        <div className="file-info">
          <ImageIcon size={16} />
          <span>{file.name}</span>
          <span className="badge">{formatSize(file.size)}</span>
        </div>
      </div>

      <div className="workspace">
        <div className="preview-area">
            {viewMode === 'compare' && processedImage ? (
              <CompareSlider 
                originalUrl={previewUrl} 
                processedUrl={processedImage.url} 
                width={settings.width}
                height={settings.height}
              />
            ) : processedImage ? (
              <div className="image-wrapper">
                <img src={processedImage.url} alt="Preview" className="preview-img" />
                <div className="stats-overlay">
                  <div className="stat-item">
                    <FileOutput size={14} />
                    <span>{formatSize(processedImage.size)}</span>
                  </div>
                  <div className="stat-item">
                    <span>{settings.width} x {settings.height}</span>
                  </div>
                  <div className="stat-item">
                    <span className={processedImage.size < file.size ? 'optimization-good' : 'optimization-bad'}>
                      {Math.round(((processedImage.size - file.size) / file.size) * 100)}%
                    </span>
                    {processedImage.size > file.size && (
                      <span className="warning-text" title="Output is larger. Try reducing quality or changing format.">
                        (Larger)
                      </span>
                    )}
                  </div>
                  {isProcessing && (
             <div className="processing-overlay">
               <div className="spinner"></div>
               <span>Processing {progress}%</span>
             </div>
          )}
        </div>
              </div>
            ) : (
              <div className="loading-state">Loading Preview...</div>
            )}
        </div>

        <div className="sidebar">
          <div className="controls-wrapper">
            <Controls 
              settings={settings} 
              updateSettings={setSettings} 
              onDownload={handleDownload}
              originalDimensions={originalDimensions}
              isProcessing={isProcessing}
              mode={mode}
            />
          </div>
          {processedImage && processedImage.size < file.size && (
             <ShareCard 
               savedBytes={file.size - processedImage.size}
               percentage={Math.round(((file.size - processedImage.size) / file.size) * 100)}
             />
          )}
        </div>
      </div>

      <style>{`
        .editor-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 160px); /* Adjust based on header/footer */
          background: var(--bg-app);
        }

        .editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--spacing-md);
          height: 60px;
          border-bottom: 1px solid var(--border-light);
          flex-shrink: 0;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-weight: 500;
          transition: 0.2s;
        }

        .back-btn:hover {
          color: var(--text-main);
        }

        .view-controls {
          display: flex;
          background: var(--bg-surface);
          padding: 4px;
          border-radius: var(--radius-md);
          gap: 4px;
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          color: var(--text-muted);
          transition: all 0.2s;
        }

        .view-btn.active {
          background: var(--bg-panel);
          color: var(--text-main);
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .view-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-main);
          font-size: 0.9rem;
        }

        .badge {
          background: var(--bg-surface);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: var(--text-dim);
          border: 1px solid var(--border-light);
        }

        .workspace {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .preview-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f0f10; /* Darker than app bg */
          background-image: radial-gradient(var(--border-light) 1px, transparent 1px);
          background-size: 20px 20px;
          padding: var(--spacing-xl);
          overflow: hidden;
          position: relative;
        }

        .image-wrapper {
          position: relative;
          max-width: 100%;
          max-height: 100%;
          border-radius: var(--radius-sm);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          overflow: hidden;
        }

        .preview-img {
          display: block;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .stats-overlay {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          display: flex;
          gap: 16px;
          color: white;
          font-size: 0.8rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .optimization-good {
          color: var(--success);
        }
        .optimization-bad {
          color: var(--error);
        }

        .sidebar {
          width: 320px;
          flex-shrink: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          height: 100%;
          border-left: 1px solid var(--border-light);
          background: var(--bg-panel);
        }
        
        .controls-wrapper {
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }
        
        .warning-text {
          color: var(--text-dim);
          font-size: 0.7rem;
          margin-left: 4px;
        }

        @media (max-width: 768px) {
          .workspace {
            flex-direction: column;
            overflow-y: auto;
          }
          .sidebar {
             width: 100%;
             height: auto;
          }
          .preview-area {
             min-height: 300px;
          }
          .editor-container {
             height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageEditor;
