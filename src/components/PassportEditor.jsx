import { useState, useCallback } from 'react';
import { ArrowLeft, Download, User, Check, Globe } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropUtils'; 

const PassportEditor = ({ file, onBack }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(35 / 45); // Default EU
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [preset, setPreset] = useState('uk'); // 'us' | 'uk' | 'visa'
  const [showOverlay, setShowOverlay] = useState(true);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const imgSrc = file ? URL.createObjectURL(file) : null;

  const handleDownload = async () => {
    try {
      const croppedImage = await getCroppedImg(imgSrc, croppedAreaPixels);
      const link = document.createElement('a');
      link.href = croppedImage;
      link.download = `passport-photo-${preset}-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  const applyPreset = (id) => {
    setPreset(id);
    if (id === 'us') {
      setAspect(1); // 2x2 inch is square
    } else if (id === 'uk' || id === 'eu') {
      setAspect(35 / 45); // 35mm x 45mm
    } else if (id === 'visa') {
      setAspect(50 / 50); // Usually square
    }
  };

  return (
    <div className="passport-editor">
      <div className="editor-header">
         <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Passport Photo Maker</h2>
        <button className="primary-btn" onClick={handleDownload}>
           <Download size={18} /> Download Photo
        </button>
      </div>

      <div className="workspace">
         <div className="sidebar">
            <div className="panel-section">
                <h3><Globe size={18} /> Country / Standard</h3>
                <div className="preset-list">
                    <button 
                        className={`preset-btn ${preset === 'us' ? 'active' : ''}`}
                        onClick={() => applyPreset('us')}
                    >
                        <div className="flag">🇺🇸</div>
                        <div className="info">
                            <strong>USA / India</strong>
                            <span>2x2 inches (51x51mm)</span>
                        </div>
                        {preset === 'us' && <Check size={16} />}
                    </button>

                    <button 
                        className={`preset-btn ${preset === 'uk' ? 'active' : ''}`}
                        onClick={() => applyPreset('uk')}
                    >
                        <div className="flag">🇪🇺</div>
                        <div className="info">
                            <strong>UK / Europe</strong>
                            <span>35x45 mm</span>
                        </div>
                         {preset === 'uk' && <Check size={16} />}
                    </button>

                     <button 
                        className={`preset-btn ${preset === 'visa' ? 'active' : ''}`}
                        onClick={() => applyPreset('visa')}
                    >
                        <div className="flag">🌏</div>
                        <div className="info">
                            <strong>Common Visa</strong>
                            <span>50x50 mm</span>
                        </div>
                         {preset === 'visa' && <Check size={16} />}
                    </button>
                </div>
            </div>

            <div className="panel-section">
                <h3><User size={18} /> Biometric Guide</h3>
                <label className="toggle-row">
                    <span>Show Face Overlay</span>
                    <input 
                        type="checkbox" 
                        checked={showOverlay} 
                        onChange={(e) => setShowOverlay(e.target.checked)} 
                    />
                </label>
                <div className="tips">
                    <p>💡 <strong>Tip:</strong> Align eyes with the dashed line. Keep head straight and background white.</p>
                </div>
            </div>

            <div className="panel-section">
                <h3>Zoom</h3>
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(e.target.value)}
                />
            </div>
         </div>

         <div className="canvas-area">
            <div className="cropper-wrapper">
              <Cropper
                image={imgSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={false}
                classes={{ 
                    containerClassName: 'cropper-container',
                    mediaClassName: 'cropper-media',
                    cropAreaClassName: 'cropper-area'
                }}
              />
              
              {showOverlay && (
                  <div className={`face-overlay ${preset === 'us' ? 'square' : 'oval'}`}>
                      <div className="head-outline"></div>
                      <div className="eye-line"></div>
                      <div className="center-line"></div>
                  </div>
              )}
            </div>
         </div>
      </div>

      <style>{`
        .passport-editor {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 80px);
          background: #111;
        }

        .editor-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 0 20px;
           height: 60px;
           border-bottom: 1px solid #333;
           background: var(--bg-surface);
        }

        .workspace {
           display: flex;
           flex: 1;
           overflow: hidden;
        }

        .sidebar {
           width: 300px;
           background: var(--bg-surface);
           border-right: 1px solid var(--border);
           overflow-y: auto;
           padding: 20px;
           display: flex;
           flex-direction: column;
           gap: 30px;
        }

        .panel-section h3 {
            font-size: 1rem;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-main);
        }

        .preset-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .preset-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: var(--bg-app);
            border: 1px solid var(--border-light);
            border-radius: 8px;
            cursor: pointer;
            text-align: left;
            transition: 0.2s;
        }

        .preset-btn:hover { border-color: var(--primary); }
        .preset-btn.active { 
            border-color: var(--primary); 
            background: rgba(0, 102, 255, 0.05);
        }

        .flag { font-size: 1.5rem; }
        .info { flex: 1; }
        .info strong { display: block; font-size: 0.9rem; color: var(--text-main); }
        .info span { font-size: 0.8rem; color: var(--text-muted); }

        .toggle-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: var(--bg-app);
            border-radius: 8px;
            cursor: pointer;
        }

        .tips {
            margin-top: 10px;
            font-size: 0.85rem;
            color: var(--text-muted);
            background: rgba(255,255,0,0.1);
            padding: 10px;
            border-radius: 6px;
            line-height: 1.4;
        }

        .canvas-area {
           flex: 1;
           position: relative;
           background: #000;
           display: flex;
           align-items: center;
           justify-content: center;
        }

        .cropper-wrapper {
           position: relative;
           width: 100%;
           height: 100%;
        }

        /* OVERLAYS */
        .face-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 10;
            width: 300px; /* Base size, effectively relative to viewport via easy-crop? No, this is tricky over responsive cropper */
            /* Actually, react-easy-crop manages the image size. We need the overlay to sit nicely inside the CROP AREA */
            /* Since we don't know the exact pixel size of the crop area easily in CSS without passing refs, 
               we will center it on screen, as the cropper usually centers the crop box. 
               BUT react-easy-crop keeps the crop box centered if possible. */
            
            /* Better approach: Stick to the center of the container */
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .head-outline {
            width: 200px;
            height: 260px;
            border: 2px dashed rgba(255, 255, 255, 0.5);
            border-radius: 50% 50% 45% 45%;
            position: absolute;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.3); /* Dim outside */
        }
        
        .face-overlay.square .head-outline {
            width: 220px;
            height: 280px;
             border-radius: 50% 50% 45% 45%;
        }

        .eye-line {
            position: absolute;
            width: 140px;
            height: 1px;
            background: rgba(255, 255, 0, 0.6);
            top: 45%; 
        }

        .center-line {
            position: absolute;
            height: 40px;
            width: 1px;
            background: rgba(255, 255, 0, 0.6);
            top: 45%;
        }

        .primary-btn {
            background: var(--primary);
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            gap: 8px;
            align-items: center;
        }
        
        /* Mobile */
        @media (max-width: 768px) {
            .passport-editor { height: auto; flex-direction: column; }
            .workspace { flex-direction: column-reverse; }
            .sidebar { width: 100%; height: auto; }
            .canvas-area { height: 50vh; }
        }
      `}</style>
    </div>
  );
};

export default PassportEditor;
