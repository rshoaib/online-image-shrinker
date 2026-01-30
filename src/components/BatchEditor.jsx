import { useState } from 'react';
import { FileOutput, Download, Trash2, ArrowLeft } from 'lucide-react';
import useImageProcessor from '../hooks/useImageProcessor';

const BatchEditor = ({ files, onBack, onRemove, mode }) => {
  const [processedFiles, setProcessedFiles] = useState({});
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const { processImage } = useImageProcessor();

  // Presets Configuration
  const PRESETS = {
    'custom': { label: 'Custom', settings: {} },
    'shopify': { label: 'Shopify (2048px JPG)', settings: { width: 2048, quality: 85, format: 'jpeg' } },
    'insta_portrait': { label: 'IG Portrait (1080x1350)', settings: { width: 1080, height: 1350, quality: 100, format: 'png' } }, // Height needs logic support
    'insta_square': { label: 'IG Square (1080px)', settings: { width: 1080, height: 1080, quality: 100, format: 'jpg' } },
    'email': { label: 'Email (800px Low)', settings: { width: 800, quality: 60, format: 'jpeg' } }
  };

  // Basic global settings for now
  const [settings, setSettings] = useState({
    width: 0, // 0 = original
    height: 0,
    quality: 80,
    format: 'jpeg',
    watermark: {
      text: '',
      color: '#ffffff',
      opacity: 0.5,
      size: 48,
      position: 'br'
    }
  });

  const applyPreset = (key) => {
    if (key === 'custom') return;
    const p = PRESETS[key].settings;
    setSettings(prev => ({
      ...prev,
      width: p.width || 0,
      height: p.height || 0,
      quality: p.quality || 80,
      format: p.format || 'jpeg'
    }));
  };

  const handleProcessAll = async () => {
    setIsProcessingAll(true);
    const results = {};
    
    // For Resize mode, we want best quality possible to avoid artifacts
    // For Compress mode, we respect the slider
    const effectiveQuality = mode === 'resize' ? 100 : settings.quality;

    for (const file of files) {
      if (!processedFiles[file.name]) {
        try {
           // Get dims first if needed, but for batch we might just skip resizing if width=0
           // For MVP simpler logic: use original width if 0
           const dims = await getImageDimensions(file);
           
           let targetWidth = settings.width;
           let targetHeight = settings.height;
           const ratio = dims.width / dims.height;

           // Auto-calculate missing dimension
           if (targetWidth > 0 && targetHeight === 0) {
              targetHeight = Math.round(targetWidth / ratio);
           } else if (targetHeight > 0 && targetWidth === 0) {
              targetWidth = Math.round(targetHeight * ratio);
           } else if (targetWidth === 0 && targetHeight === 0) {
              targetWidth = dims.width;
              targetHeight = dims.height;
           }

           const currentSettings = {
             ...settings,
             quality: effectiveQuality,
             width: targetWidth,
             height: targetHeight
           };
           // Note: useImageProcessor logic for ratio handles 0/0 well? 
           // We might need to check useImageProcessor compatibility.
           
           const result = await processImage(file, currentSettings);
           results[file.name] = result;
        } catch (e) {
           console.error(`Failed to process ${file.name}`, e);
        }
      }
    }
    
    setProcessedFiles(prev => ({...prev, ...results}));
    setIsProcessingAll(false);
  };

  // Helper to get dimensions for the loop
  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => resolve({ width: img.width, height: img.height });
    });
  };

  const handleDownload = (fileName) => {
    const result = processedFiles[fileName];
    if (result) {
      const link = document.createElement('a');
      link.href = result.url;
      link.download = `processed-${fileName.split('.')[0]}.${settings.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="batch-container">
      <div className="batch-header">
         <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Batch Processing ({files.length} files)</h2>
        <div className="batch-actions">
           {mode === 'resize' && (
             <>
               <div className="input-group">
                  <label>Preset</label>
                  <select onChange={(e) => applyPreset(e.target.value)} className="format-select">
                    <option value="custom">Custom</option>
                    <option value="shopify">Shopify</option>
                    <option value="insta_portrait">IG Portrait</option>
                    <option value="insta_square">IG Square</option>
                    <option value="email">Email Optimized</option>
                  </select>
               </div>
               <div className="input-group">
                 <label>Width</label>
                 <input 
                   type="number" 
                   value={settings.width} 
                   onChange={(e) => setSettings({...settings, width: parseInt(e.target.value) || 0})}
                   className="batch-input"
                   placeholder="Auto"
                 />
               </div>
               <div className="input-group">
                 <label>Height</label>
                 <input 
                   type="number" 
                   value={settings.height} 
                   onChange={(e) => setSettings({...settings, height: parseInt(e.target.value) || 0})}
                   className="batch-input"
                   placeholder="Auto"
                 />
               </div>
             </>
           )}

           {mode === 'compress' && (
             <div className="input-group">
                <label>Quality {settings.quality}%</label>
                <input 
                  type="range" 
                  min="1" max="100" 
                  value={settings.quality}
                  onChange={(e) => setSettings({...settings, quality: parseInt(e.target.value)})}
                  className="batch-range"
                />
             </div>
           )}

           {mode === 'watermark' && (
             <>
               <div className="input-group">
                 <label>Text</label>
                 <input 
                   type="text" 
                   value={settings.watermark.text} 
                   placeholder="© My Name"
                   onChange={(e) => setSettings({
                      ...settings, 
                      watermark: { ...settings.watermark, text: e.target.value }
                   })}
                   className="batch-input text"
                 />
               </div>
               
               <div className="input-group">
                  <label>Position</label>
                  <select
                    value={settings.watermark.position}
                    onChange={(e) => setSettings({
                      ...settings, 
                      watermark: { ...settings.watermark, position: e.target.value }
                   })}
                   className="format-select"
                  >
                    <option value="br">Bottom Right</option>
                    <option value="bl">Bottom Left</option>
                    <option value="tr">Top Right</option>
                    <option value="tl">Top Left</option>
                    <option value="center">Center</option>
                  </select>
               </div>
             </>
           )}

           <select 
             value={settings.format}
             onChange={(e) => setSettings({...settings, format: e.target.value})}
             className="format-select"
           >
             <option value="jpeg">JPEG</option>
             <option value="png">PNG</option>
             <option value="webp">WEBP</option>
           </select>
           
           <button 
             className="process-all-btn" 
             onClick={handleProcessAll}
             disabled={isProcessingAll}
           >
             {isProcessingAll ? 'Processing...' : 'Process All'}
           </button>
        </div>
      </div>

      <div className="file-list">
        {files.map((file, index) => {
          const result = processedFiles[file.name];
          return (
            <div key={index} className="file-item">
               <div className="file-meta">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatSize(file.size)}</span>
               </div>
               
               <div className="file-status">
                  {result ? (
                    <>
                      <span className="success-badge">
                        {formatSize(result.size)} 
                        <span className="saving">(-{Math.round((1 - result.size/file.size)*100)}%)</span>
                      </span>
                      <button onClick={() => handleDownload(file.name)} className="icon-btn">
                        <Download size={18} />
                      </button>
                    </>
                  ) : (
                    <span className="pending-badge">Pending</span>
                  )}
                  <button onClick={() => onRemove(index)} className="icon-btn delete">
                    <Trash2 size={18} />
                  </button>
               </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .batch-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          width: 100%;
        }

        .batch-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
        }

        .batch-actions {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          flex-wrap: wrap;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .input-group label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .batch-input {
          background: var(--bg-surface);
          border: 1px solid var(--border-active);
          color: var(--text-main);
          padding: 8px;
          border-radius: var(--radius-sm);
          width: 100px;
        }
        
        .batch-input.text {
          width: 180px;
        }

        .batch-range {
           width: 120px;
           accent-color: var(--primary);
        }

        .format-select {
          background: var(--bg-surface);
          color: var(--text-main);
          border: 1px solid var(--border-active);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
        }

        .process-all-btn {
          background: var(--primary);
          color: black;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-weight: 600;
        }

        .file-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .file-item {
          background: var(--bg-panel);
          padding: 16px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid var(--border-light);
        }

        .file-meta {
          display: flex;
          flex-direction: column;
        }

        .file-name {
          color: var(--text-main);
          font-weight: 500;
        }

        .file-size {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .file-status {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .success-badge {
          color: var(--success);
          font-size: 0.9rem;
        }

        .saving {
          margin-left: 8px;
          opacity: 0.8;
          font-size: 0.8rem;
        }

        .pending-badge {
          color: var(--text-dim);
          font-size: 0.9rem;
          font-style: italic;
        }

        .icon-btn {
          color: var(--text-muted);
          padding: 8px;
          border-radius: 4px;
          transition: 0.2s;
        }

        .icon-btn:hover {
          background: var(--bg-surface);
          color: var(--primary);
        }

        .icon-btn.delete:hover {
          color: var(--error);
        }
      `}</style>
    </div>
  );
};

export default BatchEditor;
