import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Smile, Move } from 'lucide-react';

const MemeEditor = ({ file, onBack }) => {
  const [topText, setTopText] = useState('TOP TEXT');
  const [bottomText, setBottomText] = useState('BOTTOM TEXT');
  const [fontSize, setFontSize] = useState(40);
  const [imgSrc, setImgSrc] = useState(null);
  
  // Positions (0-1 relative coordinates)
  const [topPos, setTopPos] = useState({ x: 0.5, y: 0.1 });
  const [bottomPos, setBottomPos] = useState({ x: 0.5, y: 0.9 });
  
  const [isDragging, setIsDragging] = useState(null); // 'top' | 'bottom' | null
  const canvasRef = useRef(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setImgSrc(img);
      };
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  useEffect(() => {
    if (imgSrc) {
      renderMeme();
    }
  }, [topText, bottomText, fontSize, imgSrc, topPos, bottomPos]);

  const renderMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgSrc) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match image
    canvas.width = imgSrc.width;
    canvas.height = imgSrc.height;

    // Draw image
    ctx.drawImage(imgSrc, 0, 0);

    // Common Text Config
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = fontSize / 8;
    ctx.textAlign = 'center';
    ctx.font = `900 ${fontSize}px Impact, sans-serif`;
    ctx.textBaseline = 'middle';

    // Draw Top Text
    if (topText) {
        const x = topPos.x * canvas.width;
        const y = topPos.y * canvas.height;
        ctx.strokeText(topText.toUpperCase(), x, y);
        ctx.fillText(topText.toUpperCase(), x, y);
    }

    // Draw Bottom Text
    if (bottomText) {
        const x = bottomPos.x * canvas.width;
        const y = bottomPos.y * canvas.height;
        ctx.strokeText(bottomText.toUpperCase(), x, y);
        ctx.fillText(bottomText.toUpperCase(), x, y);
    }
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Support both mouse and touch
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // Improved hit detection
  const isHit = (target, x, y) => {
     if (target === 'top') {
        const tx = topPos.x * canvasRef.current.width;
        const ty = topPos.y * canvasRef.current.height;
        // Simple distance check (radius based on font size)
        return Math.abs(x - tx) < (topText.length * fontSize * 0.4) && Math.abs(y - ty) < fontSize;
     } else {
        const bx = bottomPos.x * canvasRef.current.width;
        const by = bottomPos.y * canvasRef.current.height;
        return Math.abs(x - bx) < (bottomText.length * fontSize * 0.4) && Math.abs(y - by) < fontSize;
     }
  };

  const handlePointerDown = (e) => {
    const { x, y } = getCanvasCoordinates(e);
    
    // Check if clicked near text
    if (isHit('top', x, y)) {
       setIsDragging('top');
    } else if (isHit('bottom', x, y)) {
       setIsDragging('bottom');
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent scrolling on touch

    const { x, y } = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    
    const relX = x / canvas.width;
    const relY = y / canvas.height;

    if (isDragging === 'top') {
       setTopPos({ x: relX, y: relY });
    } else {
       setBottomPos({ x: relX, y: relY });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(null);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `meme-${file.name}`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };

  return (
    <div className="meme-editor">
      <div className="editor-header">
         <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Meme Generator</h2>
        <button className="primary-btn" onClick={handleDownload}>
           <Download size={18} /> Download Meme
        </button>
      </div>

      <div className="meme-workspace">
        <div className="preview-area">
           <div className="canvas-wrapper">
             <canvas 
                ref={canvasRef} 
                className="meme-canvas"
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
             />
             <div className="canvas-overlay-hint">
               <Move size={16} /> Drag text to move
             </div>
           </div>
           {!imgSrc && <p>Loading image...</p>}
        </div>

        <div className="controls-area">
           <div className="control-panel">
              <h3><Smile size={20} /> Customize Meme</h3>
              
              <div className="form-group">
                <label>Top Text</label>
                <input 
                    type="text" 
                    value={topText} 
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="TOP TEXT"
                    className="text-input"
                />
              </div>

              <div className="form-group">
                <label>Bottom Text</label>
                <input 
                    type="text" 
                    value={bottomText} 
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="BOTTOM TEXT"
                    className="text-input"
                />
              </div>

              <div className="form-group">
                <label>Font Size: {fontSize}px</label>
                <input 
                    type="range" 
                    min="20" 
                    max="150" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(Number(e.target.value))}
                />
              </div>

              <div className="tips">
                 <p><strong>💡 Pro Tip:</strong> You can drag the text directly on the image to position it exactly where you want!</p>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .meme-editor {
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
           background: var(--bg-surface);
        }

        .meme-workspace {
           display: flex;
           flex: 1;
           overflow: hidden;
           background: #111;
        }

        .preview-area {
           flex: 1;
           display: flex;
           align-items: center;
           justify-content: center;
           padding: 20px;
           overflow: auto;
           position: relative;
        }

        .canvas-wrapper {
           position: relative;
           box-shadow: 0 10px 30px rgba(0,0,0,0.5);
           max-width: 100%;
           max-height: 80vh;
        }

        .meme-canvas {
           max-width: 100%;
           max-height: 80vh;
           display: block;
           cursor: move;
        }

        .canvas-overlay-hint {
           position: absolute;
           top: 10px;
           left: 50%;
           transform: translateX(-50%);
           background: rgba(0,0,0,0.6);
           color: white;
           padding: 4px 12px;
           border-radius: 20px;
           font-size: 0.8rem;
           display: flex;
           align-items: center;
           gap: 6px;
           pointer-events: none;
           opacity: 0.8;
           transition: opacity 0.3s;
        }

        .canvas-wrapper:hover .canvas-overlay-hint {
           opacity: 0;
        }

        .controls-area {
           width: 320px;
           background: var(--bg-panel);
           border-left: 1px solid var(--border-light);
           display: flex;
           flex-direction: column;
           overflow-y: auto;
        }

        .control-panel {
           padding: 24px;
           display: flex;
           flex-direction: column;
           gap: 24px;
        }

        .control-panel h3 {
           display: flex;
           align-items: center;
           gap: 10px;
           font-size: 1.2rem;
           margin-bottom: 8px;
        }

        .form-group label {
           display: block;
           margin-bottom: 8px;
           font-weight: 500;
           font-size: 0.9rem;
           color: var(--text-muted);
        }

        .text-input {
           width: 100%;
           padding: 12px;
           background: var(--bg-surface);
           border: 1px solid var(--border-active);
           color: var(--text-main);
           border-radius: 8px;
           font-size: 1rem;
           font-family: sans-serif;
        }

        .text-input:focus {
           border-color: var(--primary);
           outline: none;
        }

        input[type="range"] {
           width: 100%;
           accent-color: var(--primary);
        }

        .primary-btn {
           display: flex;
           align-items: center;
           gap: 8px;
           background: var(--primary);
           color: black;
           padding: 10px 20px;
           border-radius: var(--radius-sm);
           font-weight: 700;
           transition: 0.2s;
        }
        
        .primary-btn:hover {
           filter: brightness(1.1);
        }

        .tips {
           background: rgba(255, 255, 255, 0.05);
           padding: 12px;
           border-radius: 8px;
           font-size: 0.9rem;
           color: var(--text-muted);
           line-height: 1.4;
        }

        @media (max-width: 768px) {
           .meme-editor { height: auto; }
           .meme-workspace { flex-direction: column; }
           .controls-area { width: 100%; border-left: none; border-top: 1px solid var(--border-light); }
           .meme-canvas { max-height: 50vh; }
        }
      `}</style>
    </div>
  );
};

export default MemeEditor;
