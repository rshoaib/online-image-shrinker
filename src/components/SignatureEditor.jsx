import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const SignatureEditor = ({ onBack }) => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  // Removed ctx state to avoid immutability lint errors
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(3);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Handle high DPI displays
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const context = canvas.getContext('2d');
      context.scale(dpr, dpr);
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.strokeStyle = penColor;
      context.lineWidth = penWidth;
    }
  }, [penColor, penWidth]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    setLastPos(pos);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    e.preventDefault();
    
    const pos = getPos(e);
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    // Quadratic curve for smoother lines
    const midPoint = {
      x: lastPos.x + (pos.x - lastPos.x) / 2,
      y: lastPos.y + (pos.y - lastPos.y) / 2
    };
    ctx.quadraticCurveTo(lastPos.x, lastPos.y, midPoint.x, midPoint.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    setLastPos(pos);
    if (!hasContent) setHasContent(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        // Use standard clearRect but we need to account for the transform if we scaled it? 
        // Actually getBoundingClientRect driven width/height logic resets logic, 
        // to be safe we just wipe the whole buffer
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.restore();
        setHasContent(false);
    }
  };

  const downloadSignature = () => {
     if (!canvasRef.current) return;
     const url = canvasRef.current.toDataURL('image/png');
     const link = document.createElement('a');
     link.download = `signature-${Date.now()}.png`;
     link.href = url;
     link.click();
  };

  return (
    <div className="signature-editor">
      <div className="editor-header">
         <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> {t('common.back')}
        </button>
        <h2>{t('signature.title')}</h2>
        <button className="primary-btn" onClick={downloadSignature} disabled={!hasContent}>
           <Download size={18} /> {t('signature.download')}
        </button>
      </div>

      <div className="workspace">
         <div className="controls-sidebar">
            <div className="control-group">
                <label>{t('signature.penColor')}</label>
                <div className="color-options">
                    {['#000000', '#0000FF', '#FF0000', '#008000'].map(color => (
                        <button 
                            key={color}
                            className={`color-btn ${penColor === color ? 'active' : ''}`}
                            style={{backgroundColor: color}}
                            onClick={() => setPenColor(color)}
                            aria-label={color}
                        />
                    ))}
                </div>
            </div>

            <div className="control-group">
                <label>{t('signature.thickness')}: {penWidth}px</label>
                <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={penWidth} 
                    onChange={(e) => setPenWidth(parseInt(e.target.value))} 
                />
            </div>

            <button className="clear-btn" onClick={clearCanvas}>
                <Trash2 size={16} /> {t('signature.clear')}
            </button>
            
            <div className="tip-box">
                <p><strong>{t('common.tip')}:</strong> {t('signature.tip')}</p>
            </div>
         </div>

         <div className="canvas-area">
             <div className="canvas-wrapper">
                 <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    style={{width: '100%', height: '100%'}}
                 />
                 {!hasContent && <div className="placeholder-text">{t('signature.placeholder')}</div>}
             </div>
         </div>
      </div>

      <style>{`
        .signature-editor {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 80px);
          background: var(--bg-app);
        }

        .editor-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 0 20px;
           height: 60px;
           border-bottom: 1px solid var(--border-light);
           background: var(--bg-panel);
        }

        .workspace {
           display: flex;
           flex: 1;
           overflow: hidden;
           flex-direction: row;
        }

        .controls-sidebar {
           width: 300px;
           background: var(--bg-surface);
           border-right: 1px solid var(--border-light);
           padding: 24px;
           display: flex;
           flex-direction: column;
           gap: 24px;
        }

        .control-group label {
            display: block;
            margin-bottom: 12px;
            font-weight: 500;
            color: var(--text-main);
        }

        .color-options {
            display: flex;
            gap: 12px;
        }

        .color-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 2px solid var(--border-light);
            cursor: pointer;
            transition: transform 0.2s;
        }
        .color-btn.active {
            transform: scale(1.1);
            border-color: var(--text-main);
            box-shadow: 0 0 0 2px var(--bg-surface), 0 0 0 4px var(--primary);
        }

        .clear-btn {
            margin-top: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px;
            background: var(--bg-app);
            border: 1px solid var(--border-light);
            border-radius: 8px;
            color: var(--text-muted);
            cursor: pointer;
            font-weight: 500;
            transition: 0.2s;
        }
        .clear-btn:hover {
            color: #ef4444;
            border-color: #ef4444;
            background: rgba(239, 68, 68, 0.05);
        }

        .canvas-area {
            flex: 1;
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0; /* Contrast for transparent canvas */
            background-image: 
              linear-gradient(45deg, #ddd 25%, transparent 25%), 
              linear-gradient(-45deg, #ddd 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #ddd 75%), 
              linear-gradient(-45deg, transparent 75%, #ddd 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }

        .canvas-wrapper {
            width: 100%;
            max-width: 800px;
            height: 400px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            position: relative;
            cursor: crosshair;
            overflow: hidden;
        }

        .placeholder-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #eee;
            font-size: 4rem;
            font-weight: 700;
            pointer-events: none;
            user-select: none;
        }

        .primary-btn {
            background: var(--primary);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            gap: 8px;
            align-items: center;
            transition: 0.2s;
        }
        .primary-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .tip-box {
            margin-top: 24px;
            padding: 16px;
            background: rgba(0, 102, 255, 0.05);
            border-radius: 8px;
            font-size: 0.9rem;
            color: var(--text-muted);
            line-height: 1.5;
        }

        @media (max-width: 768px) {
            .workspace { flex-direction: column-reverse; }
            .controls-sidebar { width: 100%; flex: none; gap: 16px; padding: 16px; }
            .canvas-area { padding: 16px; }
            .canvas-wrapper { height: 300px; }
        }
      `}</style>
    </div>
  );
};

export default SignatureEditor;
