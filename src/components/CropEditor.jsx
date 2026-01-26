import { useState, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Download } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropUtils'; 

const CropEditor = ({ file, onBack }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(null); // null = Free
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [preset, setPreset] = useState('free');

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const imgSrc = file ? URL.createObjectURL(file) : null;

  const handleDownload = async () => {
    try {
      const croppedImage = await getCroppedImg(imgSrc, croppedAreaPixels);
      const link = document.createElement('a');
      link.href = croppedImage;
      link.download = `cropped-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  const applyPreset = (ratio, name) => {
    setAspect(ratio);
    setPreset(name);
  };

  return (
    <div className="crop-editor">
      <div className="editor-header">
         <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Social Media Cropper</h2>
        <button className="primary-btn" onClick={handleDownload}>
           <Download size={18} /> Download
        </button>
      </div>

      <div className="crop-workspace">
         <div className="sidebar-presets">
            <h3>Presets</h3>
            <button className={preset === 'free' ? 'active' : ''} onClick={() => applyPreset(null, 'free')}>Free Form</button>
            <button className={preset === '1:1' ? 'active' : ''} onClick={() => applyPreset(1, '1:1')}>Instagram Post (1:1)</button>
            <button className={preset === '4:5' ? 'active' : ''} onClick={() => applyPreset(4/5, '4:5')}>IG Portrait (4:5)</button>
            <button className={preset === '16:9' ? 'active' : ''} onClick={() => applyPreset(16/9, '16:9')}>YouTube (16:9)</button>
            <button className={preset === '9:16' ? 'active' : ''} onClick={() => applyPreset(9/16, '9:16')}>Story (9:16)</button>
            <button className={preset === 'pass' ? 'active' : ''} onClick={() => applyPreset(35/45, 'pass')}>Passport (3.5x4.5)</button>
            
            <div className="zoom-control">
              <label>Zoom</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(e.target.value)}
              />
            </div>
         </div>

         <div className="canvas-area">
            <div className="cropper-container">
              <Cropper
                image={imgSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                classes={{ 
                    containerClassName: 'cropper-container',
                    mediaClassName: 'cropper-media',
                    cropAreaClassName: 'cropper-area'
                }}
              />
            </div>
            <p className="hint-overlay">Drag to move, scroll to zoom</p>
         </div>
      </div>

      <style>{`
        .crop-editor {
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
           z-index: 10;
           background: var(--bg-surface);
        }

        .primary-btn {
           display: flex;
           align-items: center;
           gap: 8px;
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
           position: relative;
        }

        .sidebar-presets {
           width: 260px;
           background: var(--bg-panel);
           border-right: 1px solid var(--border-light);
           padding: 20px;
           display: flex;
           flex-direction: column;
           gap: 12px;
           z-index: 10;
           overflow-y: auto;
        }

        .sidebar-presets button {
           text-align: left;
           padding: 10px;
           border-radius: var(--radius-sm);
           color: var(--text-muted);
           transition: 0.2s;
           border: 1px solid transparent;
        }
        
        .sidebar-presets button:hover {
           background: var(--bg-surface);
           color: var(--text-main);
        }

        .sidebar-presets button.active {
           background: rgba(0, 240, 255, 0.1);
           color: var(--primary);
           border-color: var(--primary);
        }

        .zoom-control {
           margin-top: 20px;
           padding-top: 20px;
           border-top: 1px solid var(--border-light);
        }
        
        .zoom-control input {
           width: 100%;
           accent-color: var(--primary);
           margin-top: 10px;
        }

        .canvas-area {
           flex: 1;
           position: relative;
           background: #111;
        }

        .cropper-container {
           position: absolute;
           top: 0;
           left: 0;
           right: 0;
           bottom: 0;
        }

        .hint-overlay {
           position: absolute;
           bottom: 20px;
           left: 50%;
           transform: translateX(-50%);
           background: rgba(0,0,0,0.6);
           color: white;
           padding: 4px 12px;
           border-radius: 20px;
           font-size: 0.8rem;
           pointer-events: none;
           z-index: 20;
        }
      `}</style>
    </div>
  );
};

export default CropEditor;
