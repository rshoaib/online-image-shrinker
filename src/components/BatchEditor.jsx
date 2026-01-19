import { useState } from 'react';
import { FileOutput, Download, Trash2, ArrowLeft } from 'lucide-react';
import useImageProcessor from '../hooks/useImageProcessor';

const BatchEditor = ({ files, onBack, onRemove, mode }) => {
  const [processedFiles, setProcessedFiles] = useState({});
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const { processImage } = useImageProcessor();

  // Basic global settings for now
  const [settings, setSettings] = useState({
    width: 0, // 0 = original
    quality: 80,
    format: 'jpeg',
  });

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
           const currentSettings = {
             ...settings,
             quality: effectiveQuality,
             width: settings.width || dims.width,
             height: settings.width ? 0 : dims.height // let simple logic handle ratio
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
             <div className="input-group">
               <label>Width (0=Original)</label>
               <input 
                 type="number" 
                 value={settings.width} 
                 onChange={(e) => setSettings({...settings, width: parseInt(e.target.value) || 0})}
                 className="batch-input"
               />
             </div>
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
