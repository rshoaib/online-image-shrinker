import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Check, RotateCcw, Image as ImageIcon } from 'lucide-react';

const CropEditor = ({ file, onBack }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const canvasRef = useRef(null);
  const [preset, setPreset] = useState('free'); // free, 1:1, 16:9, 4:5, 9:16

  // Load image
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setImgSrc(url);
        setImageSize({ w: img.width, h: img.height });
        // Initial crop: center 50%
        setCrop({ 
           x: img.width * 0.25, 
           y: img.height * 0.25, 
           width: img.width * 0.5, 
           height: img.height * 0.5 
        });
      };
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Apply Presets
  const applyPreset = (ratio) => { // ratio = w/h
    setPreset(ratio === 1 ? '1:1' : ratio === 16/9 ? '16:9' : ratio === 9/16 ? '9:16' : ratio === 4/5 ? '4:5' : ratio === 35/45 ? '35:45' : 'free');
    if (!ratio) return;

    let w = imageSize.w;
    let h = imageSize.w / ratio;

    if (h > imageSize.h) {
      h = imageSize.h;
      w = imageSize.h * ratio;
    }

    setCrop({
      x: (imageSize.w - w) / 2,
      y: (imageSize.h - h) / 2,
      width: w,
      height: h
    });
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cropped-${file.name}`;
        link.click();
      });
    };
  };

  return (
    <div className="crop-editor">
      <div className="editor-header">
         <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Social Media Cropper</h2>
        <button className="primary-btn" onClick={handleDownload}>
           Download Cropped
        </button>
      </div>

      <div className="crop-workspace">
         <div className="sidebar-presets">
            <h3>Presets</h3>
            <button className={preset === 'free' ? 'active' : ''} onClick={() => applyPreset(0)}>Free Form</button>
            <button className={preset === '1:1' ? 'active' : ''} onClick={() => applyPreset(1)}>Instagram Post (1:1)</button>
            <button className={preset === '4:5' ? 'active' : ''} onClick={() => applyPreset(4/5)}>IG Portrait (4:5)</button>
            <button className={preset === '16:9' ? 'active' : ''} onClick={() => applyPreset(16/9)}>YouTube (16:9)</button>
            <button className={preset === '9:16' ? 'active' : ''} onClick={() => applyPreset(9/16)}>Story (9:16)</button>
            <button className={preset === '35:45' ? 'active' : ''} onClick={() => applyPreset(35/45)}>Passport (3.5x4.5)</button>
         </div>

         <div className="canvas-area">
            {imgSrc ? (
               <div className="img-container" style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={imgSrc} style={{ maxWidth: '100%', maxHeight: '70vh', display: 'block' }} alt="To Crop" />
                  
                  {/* Simplified "Crop Box" Visualization - For MVP just CSS overlay */}
                  <div className="crop-overlay" style={{
                      position: 'absolute',
                      border: '2px solid var(--primary)',
                      boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
                      left: `${(crop.x / imageSize.w) * 100}%`,
                      top: `${(crop.y / imageSize.h) * 100}%`,
                      width: `${(crop.width / imageSize.w) * 100}%`,
                      height: `${(crop.height / imageSize.h) * 100}%`,
                      pointerEvents: 'none' // For MVP, no drag, just presets
                  }}></div>
                  <div className="note-overlay">
                    (Drag support coming in v2, please use Presets for now)
                  </div>
               </div>
            ) : (
              <div>Loading...</div>
            )}
         </div>
      </div>

      <style>{`
        .crop-editor {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 160px);
        }

        .editor-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 0 20px;
           height: 60px;
           border-bottom: 1px solid var(--border-light);
        }

        .primary-btn {
           background: var(--primary);
           color: black;
           padding: 8px 16px;
           border-radius: var(--radius-sm);
           font-weight: 600;
        }

        .crop-workspace {
           display: flex;
           flex: 1;
           overflow: hidden;
        }

        .sidebar-presets {
           width: 240px;
           background: var(--bg-panel);
           border-right: 1px solid var(--border-light);
           padding: 20px;
           display: flex;
           flex-direction: column;
           gap: 12px;
        }

        .sidebar-presets button {
           text-align: left;
           padding: 10px;
           border-radius: var(--radius-sm);
           color: var(--text-muted);
           transition: 0.2s;
        }
        
        .sidebar-presets button:hover {
           background: var(--bg-surface);
           color: var(--text-main);
        }

        .sidebar-presets button.active {
           background: rgba(0, 240, 255, 0.1);
           color: var(--primary);
           border: 1px solid var(--primary);
        }

        .canvas-area {
           flex: 1;
           display: flex;
           align-items: center;
           justify-content: center;
           background: #111;
           padding: 40px;
           overflow: auto;
        }

        .note-overlay {
           position: absolute;
           bottom: -30px;
           width: 100%;
           text-align: center;
           color: var(--text-dim);
           font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default CropEditor;
