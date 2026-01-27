import { useState, useEffect, useRef } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { Download, ArrowLeft, RefreshCw, AlertCircle, Palette, Monitor, Copy, Check } from 'lucide-react';
import { copyCanvasToClipboard } from '../utils/clipboard';

const ProfilePictureEditor = ({ file, onBack }) => {
  const [originalUrl, setOriginalUrl] = useState(null);
  // processedBitmap is the ImageBitmap/HTMLImageElement of the person with transp background
  const [processedImage, setProcessedImage] = useState(null); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('Initializing AI...');
  const [isCopied, setIsCopied] = useState(false);

  // Design State
  const [bgColor, setBgColor] = useState('#e0e0e0'); // Default light gray
  const [bgType, setBgType] = useState('solid'); // solid, gradient
  const [scale, setScale] = useState(1); // Scale of the person
  const [offsetY, setOffsetY] = useState(0); // Vertical offset
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#ffffff');

  const canvasRef = useRef(null);

  // Gradient Presets
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', // soft white
  ];

  // Solid Colors
  const solidColors = [
    '#ffffff', '#000000', '#f3f4f6', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'
  ];

  const processImage = async (imageUrl) => {
    setIsProcessing(true);
    setError(null);
    setProcessedImage(null);
    
    try {
      const blob = await removeBackground(imageUrl, {
        progress: (key, current, total) => {
           setProgress(`AI Processing: ${Math.round((current/total)*100)}%`);
        }
      });
      
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        setProcessedImage(img);
        setIsProcessing(false);
      };
    } catch (err) {
      console.error(err);
      setError("Could not remove background. Try another image.");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      processImage(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Canvas Composition
  useEffect(() => {
    if (!canvasRef.current || !processedImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 1024; // High res square output
    
    canvas.width = size;
    canvas.height = size;

    // 1. Draw Background
    if (bgType === 'solid') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
    } else {
      // Create gradient from string css-like syntax is hard in canvas, 
      // so we use approximations or just a few hardcoded styles for now if custom.
      // Or better: draw the gradient on a temp hidden canvas or use helper.
      // Simpler approach for MVP: Parse the linear-gradient string roughly or use preset mapping.
      
      // Let's implement a simple parser for the presets we defined
      const grad = ctx.createLinearGradient(0, 0, size, size);
      
      // Hacky parser for the specific presets above to map them to canvas gradients
      if (bgColor.includes('#667eea')) { grad.addColorStop(0, '#667eea'); grad.addColorStop(1, '#764ba2'); }
      else if (bgColor.includes('#ff9a9e')) { grad.addColorStop(0, '#ff9a9e'); grad.addColorStop(1, '#fecfef'); }
      else if (bgColor.includes('#f093fb')) { grad.addColorStop(0, '#f093fb'); grad.addColorStop(1, '#f5576c'); }
      else if (bgColor.includes('#4facfe')) { grad.addColorStop(0, '#4facfe'); grad.addColorStop(1, '#00f2fe'); }
      else if (bgColor.includes('#30cfd0')) { grad.addColorStop(0, '#30cfd0'); grad.addColorStop(1, '#330867'); }
      else if (bgColor.includes('#fdfbfb')) { grad.addColorStop(0, '#fdfbfb'); grad.addColorStop(1, '#ebedee'); }
      else {
         // Fallback default
         grad.addColorStop(0, '#ddd'); grad.addColorStop(1, '#999');
      }
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
    }

    // 2. Draw Image (Person)
    // Center it at the bottom? Or true center? 
    // Usually PFP makers anchor the person at the bottom if it's a bust, or center if it's a face.
    // Let's default to bottom-anchored but with some padding.
    
    const aspect = processedImage.width / processedImage.height;
    
    // Draw height: let's say 85% of canvas by default, scalable
    const drawH = size * 0.85 * scale;
    const drawW = drawH * aspect;
    
    const drawX = (size - drawW) / 2;
    const drawY = (size - drawH) + (offsetY * size / 100); // Offset is percentage of canvas

    ctx.save();
    // Optional: Add a shadow to the person?
    // ctx.shadowColor = "rgba(0,0,0,0.2)";
    // ctx.shadowBlur = 20;
    
    ctx.drawImage(processedImage, drawX, drawY, drawW, drawH);
    ctx.restore();

    // 3. Draw Circle Border (Overlay)
    if (borderWidth > 0) {
       ctx.strokeStyle = borderColor;
       ctx.lineWidth = borderWidth * 2; // *2 because half is clipped if we stroke inside? No, let's just draw on top.
       // But wait, usually the border is *around* the circle crop which happens on the platform.
       // However, some users WANT the colored ring IN the photo itself (like the LinkedIn #OpenToWork ring).
       
       ctx.beginPath();
       ctx.arc(size/2, size/2, (size/2) - (borderWidth), 0, 2 * Math.PI);
       ctx.stroke();
    }
    
  }, [processedImage, bgColor, bgType, scale, offsetY, borderWidth, borderColor]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = `profile-pic-${Date.now()}.png`;
    link.click();
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    const success = await copyCanvasToClipboard(canvasRef.current);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="editor-layout">
      <div className="toolbar">
         <div className="toolbar-header">
           <button onClick={onBack} className="back-btn"><ArrowLeft size={18} /> Back</button>
           <h3>Profile Maker</h3>
         </div>

         <div className="control-group">
            <label>Background</label>
            <div className="color-grid">
               {solidColors.map(c => (
                 <button 
                   key={c} 
                   className={`color-dot ${bgType === 'solid' && bgColor === c ? 'active' : ''}`}
                   style={{ backgroundColor: c, border: c === '#ffffff' ? '1px solid #ddd' : 'none' }}
                   onClick={() => { setBgColor(c); setBgType('solid'); }}
                 />
               ))}
               <label className="input-color-label">
                  <Palette size={16} />
                  <input type="color" onChange={(e) => { setBgColor(e.target.value); setBgType('solid');}} />
               </label>
            </div>
            
            <label style={{marginTop: 12}}>Gradients</label>
            <div className="color-grid">
               {gradients.map(g => (
                 <button 
                   key={g} 
                   className={`color-dot gradient ${bgType === 'gradient' && bgColor === g ? 'active' : ''}`}
                   style={{ background: g }}
                   onClick={() => { setBgColor(g); setBgType('gradient'); }}
                 />
               ))}
            </div>
         </div>

         <div className="control-group">
            <label>Scaling & Position</label>
            <div className="slider-row">
              <span>Zoom</span>
              <input 
                type="range" min="0.5" max="1.5" step="0.05" 
                value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} 
              />
            </div>
            <div className="slider-row">
              <span>Vertical</span>
              <input 
                 type="range" min="-50" max="50" 
                 value={offsetY} onChange={(e) => setOffsetY(parseInt(e.target.value))} 
              />
            </div>
         </div>

         <div className="control-group">
            <label>Border Ring</label>
             <div className="slider-row">
              <span>Width</span>
              <input 
                 type="range" min="0" max="50" 
                 value={borderWidth} onChange={(e) => setBorderWidth(parseInt(e.target.value))} 
              />
            </div>
            {borderWidth > 0 && (
               <div className="color-grid" style={{marginTop: 8}}>
                  {['#ffffff', '#0070f3', '#e1306c', '#10b981', '#f59e0b', '#000000'].map(c => (
                     <button 
                        key={c}
                        className={`color-dot small ${borderColor === c ? 'active' : ''}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setBorderColor(c)}
                     />
                  ))}
                   <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="tiny-picker"/>
               </div>
            )}
         </div>

         <div className="action-buttons">
            <button className="download-btn-secondary" onClick={handleCopy}>
                {isCopied ? <Check size={18} /> : <Copy size={18} />} {isCopied ? 'Copied!' : 'Copy'}
            </button>
            <button className="download-btn-primary" onClick={handleDownload} disabled={isProcessing}>
                <Download size={18} /> Download
            </button>
         </div>
      </div>

      <div className="preview-area">
         {isProcessing ? (
            <div className="processing-state">
               <div className="spinner"></div>
               <p>{progress}</p>
            </div>
         ) : processedImage ? (
            <div className="canvas-wrapper">
               <canvas ref={canvasRef} className="main-canvas" />
               <div className="circle-overlay-guide" title="Preview of circular crop"></div>
            </div>
         ) : (
            <div className="error-state">
              <p>{error || "Prepare your image..."}</p>
            </div>
         )}
      </div>

      <style>{`
        .editor-layout {
          display: flex;
          height: calc(100vh - 100px);
          min-height: 600px;
          gap: 20px;
        }

        .toolbar {
          width: 300px;
          background: var(--bg-panel);
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          padding: 20px;
          gap: 24px;
          overflow-y: auto;
        }

        .toolbar-header {
           display: flex;
           align-items: center;
           gap: 12px;
           margin-bottom: 8px;
        }
        
        .back-btn {
           background: none; border: none; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; gap: 4px;
        }

        .control-group {
           display: flex;
           flex-direction: column;
           gap: 12px;
        }

        .control-group label {
           font-size: 0.85rem;
           font-weight: 600;
           color: var(--text-muted);
        }

        .color-grid {
           display: flex;
           flex-wrap: wrap;
           gap: 8px;
        }

        .color-dot {
           width: 32px;
           height: 32px;
           border-radius: 50%;
           border: none;
           cursor: pointer;
           transition: transform 0.2s, box-shadow 0.2s;
        }
        .color-dot:hover { transform: scale(1.1); }
        .color-dot.active { box-shadow: 0 0 0 2px var(--bg-panel), 0 0 0 4px var(--primary); }
        .color-dot.gradient { width: 32px; height: 32px; }
        .color-dot.small { width: 24px; height: 24px; }
        
        .input-color-label {
           width: 32px; height: 32px; border-radius: 50%; background: var(--bg-surface); border: 1px solid var(--border-active);
           display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; overflow: hidden;
        }
        .input-color-label input { position: absolute; opacity: 0; width: 200%; height: 200%; cursor: pointer; }

        .slider-row {
           display: flex;
           align-items: center;
           justify-content: space-between;
           font-size: 0.85rem;
           color: var(--text-main);
        }
        .slider-row input { width: 60%; }

        .download-btn-primary {
           flex: 1;
           background: var(--primary);
           color: white;
           border: none;
           padding: 14px;
           border-radius: var(--radius-md);
           font-weight: 600;
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 8px;
           font-size: 1rem;
        }
        .download-btn-primary:hover { filter: brightness(1.1); }
        .download-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .action-buttons {
           margin-top: auto;
           display: flex;
           gap: 12px;
        }

        .download-btn-secondary {
           flex: 1;
           background: var(--bg-surface);
           border: 1px solid var(--border-active);
           color: var(--text-main);
           padding: 14px;
           border-radius: var(--radius-md);
           font-weight: 600;
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 8px;
           font-size: 1rem;
        }
        .download-btn-secondary:hover { background: var(--bg-panel); }

        .preview-area {
           flex: 1;
           background: var(--bg-surface);
           border-radius: var(--radius-lg);
           display: flex;
           align-items: center;
           justify-content: center;
           position: relative;
           overflow: hidden;
           border: 1px solid var(--border-light);
        }

        .canvas-wrapper {
           position: relative;
           box-shadow: 0 20px 40px rgba(0,0,0,0.1);
           border-radius: 4px; /* Canvas itself is square usually */
           width: 500px;
           height: 500px;
           background: #fff; /* Checkboard? */
        }

        .main-canvas {
           width: 100%;
           height: 100%;
           border-radius: 4px; /* Visual only */
        }
        
        /* Guide overlay */
        .circle-overlay-guide {
           position: absolute;
           inset: 0;
           border-radius: 50%;
           border: 1px dashed rgba(255,255,255,0.8);
           box-shadow: 0 0 0 999px rgba(0,0,0,0.5); /* Dim outside */
           pointer-events: none;
        }

        .processing-state {
           text-align: center;
           color: var(--text-muted);
        }
        .spinner {
           width: 40px; height: 40px; border: 4px solid var(--border-light); 
           border-top-color: var(--primary); border-radius: 50%; animation: spin 1s infinite linear; margin: 0 auto 16px;
        }
        
        @media (max-width: 900px) {
           .editor-layout { flex-direction: column-reverse; height: auto; }
           .toolbar { width: 100%; height: auto; max-height: none; overflow: visible; }
           .preview-area { min-height: 400px; padding: 20px; }
           .canvas-wrapper { width: 100%; height: auto; aspect-ratio: 1; max-width: 400px; }
        }
      `}</style>
    </div>
  );
};

export default ProfilePictureEditor;
