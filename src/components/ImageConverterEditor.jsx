import { useState, useEffect } from 'react';
import { ArrowLeft, Download, RefreshCw, AlertCircle } from 'lucide-react';
import heic2any from 'heic2any';

const ImageConverterEditor = ({ file, onBack }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [targetFormat, setTargetFormat] = useState('image/jpeg'); // 'image/jpeg', 'image/png', 'image/webp'
  const [quality, setQuality] = useState(0.9); // 0 to 1
  const [isConverting, setIsConverting] = useState(false);
  const [convertedSize, setConvertedSize] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);

  useEffect(() => {
    if (file) {
      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
         // Convert HEIC to blob for preview 
         heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 })
            .then((conversionResult) => {
                // conversionResult can be an array if multi-image HEIC, take first
                const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
                const url = URL.createObjectURL(blob);
                setImgSrc(url);
                setOriginalSize(file.size);
            })
            .catch(e => {
                console.error("HEIC Error", e);
                alert("Could not decode HEIC file.");
            });
         
         setTimeout(() => setTargetFormat('image/jpeg'), 0); // Default target for HEIC
      } else {
          // Standard images
          const url = URL.createObjectURL(file);
          setTimeout(() => setImgSrc(url), 0);
          setTimeout(() => setOriginalSize(file.size), 0);
          
          // Default target based on source
          setTimeout(() => {
              if (file.type === 'image/png') setTargetFormat('image/jpeg');
              else if (file.type === 'image/jpeg') setTargetFormat('image/png');
              else setTargetFormat('image/jpeg');
          }, 0);
    
          return () => URL.revokeObjectURL(url);
      }
    }
  }, [file]);

  const handleConvert = () => {
    if (!imgSrc) return;
    setIsConverting(true);

    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // Fill white background for JPEGs (transparency fix)
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        setIsConverting(false);
        if (!blob) return;

        setConvertedSize(blob.size);
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Determine extension
        let ext = 'jpg';
        if (targetFormat === 'image/png') ext = 'png';
        if (targetFormat === 'image/webp') ext = 'webp';
        
        const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        link.download = `${originalName}-converted.${ext}`;
        link.click();
        
        // Cleanup after short delay
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }, targetFormat, quality);
    };
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };



  return (
    <div className="converter-editor">
      <div className="editor-header">
         <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Image Converter</h2>
        <div style={{ width: 80 }}></div> {/* Spacer */}
      </div>

      <div className="converter-workspace">
        <div className="preview-area">
           {imgSrc && (
             <div className="image-card">
               <img src={imgSrc} alt="Preview" loading="lazy" />
               <div className="file-info">
                 <p className="filename">{file.name}</p>
                 <p className="filesize">{formatSize(originalSize)}</p>
               </div>
             </div>
           )}
        </div>

        <div className="controls-area">
           <div className="control-panel">
              <h3>Convert Settings</h3>
              
              <div className="form-group">
                <label>Target Format</label>
                <div className="format-grid">
                  <button 
                    className={targetFormat === 'image/jpeg' ? 'active' : ''} 
                    onClick={() => setTargetFormat('image/jpeg')}
                  >
                    JPG
                  </button>
                  <button 
                    className={targetFormat === 'image/png' ? 'active' : ''} 
                    onClick={() => setTargetFormat('image/png')}
                  >
                    PNG
                  </button>
                  <button 
                    className={targetFormat === 'image/webp' ? 'active' : ''} 
                    onClick={() => setTargetFormat('image/webp')}
                  >
                    WebP
                  </button>
                </div>
              </div>

              {(targetFormat === 'image/jpeg' || targetFormat === 'image/webp') && (
                <div className="form-group">
                  <label>Quality: {Math.round(quality * 100)}%</label>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1" 
                    step="0.05" 
                    value={quality} 
                    onChange={(e) => setQuality(parseFloat(e.target.value))} 
                  />
                  <p className="hint">Lower quality = smaller file size</p>
                </div>
              )}

              {targetFormat === 'image/jpeg' && file.type === 'image/png' && (
                <div className="info-box">
                  <AlertCircle size={16} />
                  <span>Transparency will be replaced with white background.</span>
                </div>
              )}

              <div className="action-area">
                <button 
                  className={`primary-btn ${isConverting ? 'loading' : ''}`} 
                  onClick={handleConvert}
                  disabled={isConverting}
                >
                  {isConverting ? (
                    'Converting...'
                  ) : (
                    <>
                      <RefreshCw size={18} /> Convert & Download
                    </>
                  )}
                </button>
                {convertedSize && (
                  <p className="success-msg">
                    Last conversion: <strong>{formatSize(convertedSize)}</strong>
                  </p>
                )}
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .converter-editor {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 160px);
          min-height: 600px;
        }

        .editor-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 0 20px;
           height: 60px;
           border-bottom: 1px solid var(--border-light);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          font-weight: 500;
          cursor: pointer;
          color: var(--text-muted);
        }
        .back-btn:hover { color: var(--primary); }

        .converter-workspace {
           display: flex;
           flex: 1;
           overflow: hidden;
           background: var(--bg-surface);
        }

        .preview-area {
           flex: 1;
           display: flex;
           align-items: center;
           justify-content: center;
           padding: 40px;
           background: #111; /* Dark bg for contrast */
           overflow: auto;
        }

        .image-card {
           background: #fff;
           padding: 10px;
           border-radius: 8px;
           box-shadow: 0 10px 30px rgba(0,0,0,0.3);
           max-width: 100%;
        }

        .image-card img {
           max-width: 100%;
           max-height: 60vh;
           display: block;
           border-radius: 4px;
        }

        .file-info {
           margin-top: 10px;
           text-align: center;
        }
        .filename { font-weight: 600; color: #333; margin-bottom: 2px; }
        .filesize { font-size: 0.85rem; color: #666; }

        .controls-area {
           width: 350px;
           background: var(--bg-panel);
           border-left: 1px solid var(--border-light);
           display: flex;
           flex-direction: column;
        }

        .control-panel {
           padding: 24px;
           display: flex;
           flex-direction: column;
           gap: 24px;
        }

        .control-panel h3 {
           font-size: 1.2rem;
           margin-bottom: 8px;
        }

        .form-group label {
           display: block;
           margin-bottom: 10px;
           font-weight: 500;
           font-size: 0.95rem;
        }

        .format-grid {
           display: grid;
           grid-template-columns: 1fr 1fr 1fr;
           gap: 8px;
        }

        .format-grid button {
           padding: 10px 0;
           border: 1px solid var(--border-light);
           background: var(--bg-surface);
           border-radius: 6px;
           font-weight: 500;
           transition: all 0.2s;
        }

        .format-grid button:hover {
           border-color: var(--primary);
           color: var(--primary);
        }

        .format-grid button.active {
           background: var(--primary);
           color: white;
           border-color: var(--primary);
        }

        input[type="range"] {
          width: 100%;
          accent-color: var(--primary);
        }

        .hint {
           font-size: 0.8rem;
           color: var(--text-muted);
           margin-top: 6px;
        }

        .info-box {
           display: flex;
           align-items: flex-start;
           gap: 10px;
           background: rgba(255, 193, 7, 0.1);
           color: #d97706; /* Amber-600 */
           padding: 12px;
           border-radius: 6px;
           font-size: 0.85rem;
           line-height: 1.4;
        }

        .primary-btn {
           width: 100%;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 10px;
           background: var(--primary);
           color: white;
           padding: 14px;
           border-radius: 8px;
           font-weight: 600;
           font-size: 1rem;
           transition: 0.2s;
           margin-top: 12px;
        }

        .primary-btn:hover {
           filter: brightness(1.1);
           transform: translateY(-1px);
        }
        
        .primary-btn:disabled {
           opacity: 0.7;
           cursor: not-allowed;
           transform: none;
        }

        .success-msg {
           text-align: center;
           margin-top: 12px;
           font-size: 0.9rem;
           color: var(--text-success);
        }

        @media (max-width: 768px) {
           .converter-editor {
              flex-direction: column;
              height: auto;
           }
           .converter-workspace {
              flex-direction: column;
           }
           .controls-area {
              width: 100%;
              border-left: none;
              border-top: 1px solid var(--border-light);
           }
        }
      `}</style>
    </div>
  );
};

export default ImageConverterEditor;
