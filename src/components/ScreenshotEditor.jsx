import { useState, useEffect, useRef } from 'react';
import { Download, ArrowLeft, Image as ImageIcon, Monitor, Layers, Maximize } from 'lucide-react';

const ScreenshotEditor = ({ file, onBack }) => {
  const [originalImage, setOriginalImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Design State
  const [bgColor, setBgColor] = useState('#e0e0e0'); 
  const [bgType, setBgType] = useState('gradient');
  const [padding, setPadding] = useState(60); // Padding around image
  const [borderRadius, setBorderRadius] = useState(12); // Image corners
  const [shadowIntensity, setShadowIntensity] = useState(30);
  const [showWindowControls, setShowWindowControls] = useState(true);
  const [aspectOne, setAspectOne] = useState(false); // Force 1:1 if needed, usually no for screenshots

  const canvasRef = useRef(null);

  // Reusing gradients (could extract to shared constant)
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
    'linear-gradient(135deg, #232526 0%, #414345 100%)', // Dark mode
  ];

  const solidColors = [
    '#ffffff', '#000000', '#f3f4f6', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'
  ];

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setOriginalImage(img);
        setBgColor(gradients[0]); // Default to first gradient
      };
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Canvas Composition
  useEffect(() => {
    if (!canvasRef.current || !originalImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // We want a high-res output.
    // Calculate canvas size based on image size + padding
    // But we might want to cap the width if it's huge, or just scale.
    // Let's keep it relative to the original image for max quality.
    
    // Logic: 
    // Image Width = W
    // Padding = P relative to some base? Let's treat P as pixel padding if image is reasonably sized.
    // If image is 4000px wide, P=60 is tiny.
    // So let's normalize padding relative to image width. 100 padding = 10% of width?
    // Let's try simple pixel padding first but scaled.
    
    // Target base width for calculation: 1200px (like a tweet)
    // Scale factor = originalImage.width / 1200
    const scaleFactor = Math.max(1, originalImage.width / 1200); 
    
    const effectivePadding = padding * scaleFactor * 1.5;
    
    const canvasW = originalImage.width + (effectivePadding * 2);
    const canvasH = originalImage.height + (effectivePadding * 2) + (showWindowControls ? 40 * scaleFactor : 0);

    canvas.width = canvasW;
    canvas.height = canvasH;

    // 1. Draw Background
     if (bgType === 'solid') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasW, canvasH);
    } else {
      const grad = ctx.createLinearGradient(0, 0, canvasW, canvasH);
      
      if (bgColor.includes('#667eea')) { grad.addColorStop(0, '#667eea'); grad.addColorStop(1, '#764ba2'); }
      else if (bgColor.includes('#ff9a9e')) { grad.addColorStop(0, '#ff9a9e'); grad.addColorStop(1, '#fecfef'); }
      else if (bgColor.includes('#f093fb')) { grad.addColorStop(0, '#f093fb'); grad.addColorStop(1, '#f5576c'); }
      else if (bgColor.includes('#4facfe')) { grad.addColorStop(0, '#4facfe'); grad.addColorStop(1, '#00f2fe'); }
      else if (bgColor.includes('#30cfd0')) { grad.addColorStop(0, '#30cfd0'); grad.addColorStop(1, '#330867'); }
      else if (bgColor.includes('#fdfbfb')) { grad.addColorStop(0, '#fdfbfb'); grad.addColorStop(1, '#ebedee'); }
      else if (bgColor.includes('#232526')) { grad.addColorStop(0, '#232526'); grad.addColorStop(1, '#414345'); }
      else {
         grad.addColorStop(0, '#ddd'); grad.addColorStop(1, '#999');
      }
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvasW, canvasH);
    }

    // 2. Draw Shadow
    const imgX = effectivePadding;
    const imgY = effectivePadding + (showWindowControls ? 30 * scaleFactor : 0);
    const imgW = originalImage.width;
    const imgH = originalImage.height;

    // Shadow context settings
    ctx.shadowColor = `rgba(0,0,0,${shadowIntensity / 100})`;
    ctx.shadowBlur = (shadowIntensity * 1.5) * scaleFactor;
    ctx.shadowOffsetY = (shadowIntensity * 0.8) * scaleFactor;

    // To draw shadow we draw a rect behind the image first? 
    // Or just draw the image if it's rectangular?
    // If we have border radius, we need to path it.
    
    // Draw rounded rect path
    const r = borderRadius * scaleFactor;
    
    // Window header height
    const headerH = showWindowControls ? 40 * scaleFactor : 0;
    
    // Total Container Height (Header + Image)
    const containerH = imgH + headerH;
    
    // Draw the "Container" (Window + Image) path
    roundedRect(ctx, imgX, imgY - headerH, imgW, containerH, r);
    ctx.fillStyle = showWindowControls ? '#ffffff' : 'transparent'; // Header bg
    // Note: If header is white, it might look odd if image is also white. 
    // Usually header is same color as image bg or slightly darker/light gray.
    // Let's assume a generic "Dark Mode" window or "Light Mode" window based on preference?
    // For now simple white background for the container behind the image.
    ctx.fillStyle = '#fff';
    ctx.fill();
    
    // Reset shadow for inner drawing
    ctx.shadowColor = 'transparent'; 
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // 3. Draw Window Controls (if enabled)
    if (showWindowControls) {
       // Re-draw header background?
       // Usually the "Window" is one big rounded rect.
       // The header part is the top H pixels.
       // Dots: Red, Yellow, Green
       const dotSize = 12 * scaleFactor;
       const dotSpacing = 8 * scaleFactor;
       const leftMargin = 20 * scaleFactor;
       const dotY = (imgY - headerH) + (headerH / 2);
       
       // Red
       ctx.fillStyle = '#FF5F56';
       ctx.beginPath();
       ctx.arc(leftMargin, dotY, dotSize/2, 0, Math.PI * 2);
       ctx.fill();

       // Yellow
       ctx.fillStyle = '#FFBD2E';
       ctx.beginPath();
       ctx.arc(leftMargin + dotSize + dotSpacing, dotY, dotSize/2, 0, Math.PI * 2);
       ctx.fill();

       // Green
       ctx.fillStyle = '#27C93F';
       ctx.beginPath();
       ctx.arc(leftMargin + (dotSize + dotSpacing)*2, dotY, dotSize/2, 0, Math.PI * 2);
       ctx.fill();
    }

    // 4. Draw The Image (Clipped to rounded corners at bottom)
    ctx.save();
    // Clip the bottom part of the rounded rect
    // Simple way: Clip the same rounded rect we drew for the container
    roundedRect(ctx, imgX, imgY - headerH, imgW, containerH, r);
    ctx.clip();
    
    // Draw image shifted down by headerH
    // But wait, if we clip the whole container, fine.
    // If showWindowControls, we offset drawImage Y by headerH (already done in imgY var calculation? No)
    // imgY is where image STARTS.
    // (imgY - headerH) is where WINDOW starts.
    ctx.drawImage(originalImage, imgX, imgY, imgW, imgH);
    ctx.restore();

  }, [originalImage, bgColor, bgType, padding, borderRadius, shadowIntensity, showWindowControls]);

  // Helper for rounded rect
  const roundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = `beautified-screenshot-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="editor-layout">
      <div className="toolbar">
         <div className="toolbar-header">
           <button onClick={onBack} className="back-btn"><ArrowLeft size={18} /> Back</button>
           <h3>Screenshot Studio</h3>
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
               <input type="color" onChange={(e) => { setBgColor(e.target.value); setBgType('solid');}} className="picker-mini"/>
            </div>
            <div className="color-grid" style={{marginTop: 8}}>
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
            <label>Window Style</label>
             <div className="checkbox-row" onClick={() => setShowWindowControls(!showWindowControls)}>
                <input type="checkbox" checked={showWindowControls} readOnly />
                <span>Show Window Frame (Mac)</span>
             </div>
             
             <div className="slider-row" style={{marginTop: 12}}>
              <span>Padding</span>
              <input 
                type="range" min="0" max="200" step="10"
                value={padding} onChange={(e) => setPadding(parseInt(e.target.value))} 
              />
            </div>
            
             <div className="slider-row">
              <span>Roundness</span>
              <input 
                type="range" min="0" max="40" 
                value={borderRadius} onChange={(e) => setBorderRadius(parseInt(e.target.value))} 
              />
            </div>

            <div className="slider-row">
              <span>Shadow</span>
              <input 
                type="range" min="0" max="100" 
                value={shadowIntensity} onChange={(e) => setShadowIntensity(parseInt(e.target.value))} 
              />
            </div>
         </div>

         <button className="download-btn-primary" onClick={handleDownload} disabled={isProcessing}>
            <Download size={18} /> Download Image
         </button>
      </div>

      <div className="preview-area">
          {originalImage ? (
            <div className="canvas-wrapper-scroll">
               <canvas ref={canvasRef} className="main-canvas" />
            </div>
         ) : (
            <div className="error-state">
              <p>Loading image...</p>
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
          width: 320px;
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
        
        .picker-mini {
           width: 32px; height: 32px; padding: 0; border: none; background: none; cursor: pointer;
        }

        .slider-row {
           display: flex;
           align-items: center;
           justify-content: space-between;
           font-size: 0.85rem;
           color: var(--text-main);
        }
        .slider-row input { width: 55%; accent-color: var(--primary); }
        
        .checkbox-row {
           display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer;
        }
        .checkbox-row input { accent-color: var(--primary); width: 18px; height: 18px; }

        .download-btn-primary {
           margin-top: auto;
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

        .canvas-wrapper-scroll {
           width: 100%;
           height: 100%;
           overflow: auto;
           display: flex;
           align-items: center;
           justify-content: center;
           padding: 40px;
        }

        .main-canvas {
           max-width: 100%;
           max-height: 100%;
           box-shadow: 0 10px 30px rgba(0,0,0,0.1);
           /* object-fit: contain; handled by max-w/h */
        }
        
        @media (max-width: 900px) {
           .editor-layout { flex-direction: column-reverse; height: auto; }
           .toolbar { width: 100%; height: auto; max-height: none; overflow: visible; }
           .preview-area { min-height: 400px; padding: 20px; }
        }
      `}</style>
    </div>
  );
};

export default ScreenshotEditor;
