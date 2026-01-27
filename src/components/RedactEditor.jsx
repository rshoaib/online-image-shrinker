import { useState, useRef, useEffect } from 'react';
import { Download, ArrowLeft, Eraser, Undo, Eye } from 'lucide-react';

const RedactEditor = ({ file, onBack }) => {
  const [image, setImage] = useState(null);
  const [blurRegions, setBlurRegions] = useState([]); // Array of {x, y, w, h}
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState(null);

  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (file) {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = () => {
        setImage(img);
      };
    }
  }, [file]);

  useEffect(() => {
    if (image && canvasRef.current) {
      drawCanvas();
    }
  }, [image, blurRegions, currentRect]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    // Calculate scale ratio between canvas internal size and displayed size
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    setStartPos(pos);
    setCurrentRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    const w = pos.x - startPos.x;
    const h = pos.y - startPos.y;
    setCurrentRect({ x: startPos.x, y: startPos.y, w, h });
  };

  const endDrawing = () => {
    if (currentRect && Math.abs(currentRect.w) > 5 && Math.abs(currentRect.h) > 5) {
      // Normalize rect (handle negative width/height)
      const normalized = {
          x: currentRect.w < 0 ? currentRect.x + currentRect.w : currentRect.x,
          y: currentRect.h < 0 ? currentRect.y + currentRect.h : currentRect.y,
          w: Math.abs(currentRect.w),
          h: Math.abs(currentRect.h)
      };
      setBlurRegions([...blurRegions, normalized]);
    }
    setIsDrawing(false);
    setCurrentRect(null);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match image
    if (canvas.width !== image.width) canvas.width = image.width;
    if (canvas.height !== image.height) canvas.height = image.height;

    // 1. Draw original image
    ctx.drawImage(image, 0, 0);

    // 2. Apply blurs
    // We can use the CSS filter shorthand on context for performance if supported?
    // Or pixelate manually. Let's try simple heavy blur by drawing small and scaling up.
    
    [...blurRegions, currentRect].filter(Boolean).forEach(rect => {
        if (rect.w === 0 || rect.h === 0) return;

        // Save context
        ctx.save();
        
        // Clip to the rect
        ctx.beginPath();
        // Handle negative drawing for currentRect
        let x = rect.w < 0 ? rect.x + rect.w : rect.x;
        let y = rect.h < 0 ? rect.y + rect.h : rect.y;
        let w = Math.abs(rect.w);
        let h = Math.abs(rect.h);
        
        ctx.rect(x, y, w, h);
        ctx.clip();

        // Apply Blur effect 
        // Method: Draw the image section again but blurred
        ctx.filter = 'blur(10px) contrast(150%)'; // CSS filter string
        ctx.drawImage(image, 0, 0);
        
        // Optional: darken slightly to look like redaction?
        // ctx.fillStyle = 'rgba(0,0,0,0.1)';
        // ctx.fillRect(x,y,w,h);

        ctx.restore();
        
        // Draw selection border for active drawing
        if (rect === currentRect) {
            ctx.strokeStyle = '#00F0FF';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);
        }
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'redacted-image.jpg';
    link.href = canvasRef.current.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  const handleUndo = () => {
    setBlurRegions(prev => prev.slice(0, -1));
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} />
          Back
        </button>
        <h3>Privacy Redactor</h3>
        <div className="header-actions">
           <button className="icon-btn" onClick={handleUndo} title="Undo last blur">
              <Undo size={18} /> Undo
           </button>
           <button className="download-btn" onClick={handleDownload}>
              Download <Download size={18} />
           </button>
        </div>
      </div>

      <div className="editor-workspace" ref={containerRef}>
         <div className="canvas-wrapper">
             <canvas 
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                style={{ 
                    cursor: 'crosshair',
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)' 
                }}
             />
             <p className="instruction-overlay">Click and drag to blur sensitive info</p>
         </div>
      </div>

      <style>{`
        .editor-container {
          background: var(--bg-panel);
          border-radius: var(--radius-lg);
          padding: 20px;
          min-height: 600px;
          display: flex;
          flex-direction: column;
        }
        .editor-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 20px;
           border-bottom: 1px solid var(--border-light);
           padding-bottom: 15px;
        }
        .back-btn {
           display: flex;
           align-items: center;
           gap: 8px;
           color: var(--text-muted);
           transition: 0.2s;
        }
        .back-btn:hover { color: var(--primary); }
        .download-btn {
           background: var(--primary);
           color: white;
           padding: 8px 16px;
           border-radius: var(--radius-md);
           font-weight: 600;
           display: flex;
           align-items: center;
           gap: 8px;
        }
        .icon-btn {
            background: var(--bg-surface);
            border: 1px solid var(--border-light);
            color: var(--text-main);
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-md);
            margin-right: 10px;
            cursor: pointer;
        }
        .icon-btn:hover {
            border-color: var(--primary);
            color: var(--primary);
        }
        
        .editor-workspace {
            flex: 1;
            background: var(--bg-surface);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow: hidden;
            position: relative;
        }
        
        .instruction-overlay {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            pointer-events: none;
            opacity: 0.8;
        }

        .header-actions {
            display: flex;
        }
      `}</style>
    </div>
  );
};

export default RedactEditor;
