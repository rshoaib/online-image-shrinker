import { useState, useRef, useEffect } from 'react';
import { Download, ArrowLeft, Undo, Eraser, Info, Sparkles } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

const MagicEraserEditor = ({ file, onBack }) => {
  const [image, setImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [opencvLoaded, setOpencvLoaded] = useState(false);
  const [history, setHistory] = useState([]); // For Undo
  
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const containerRef = useRef(null);

  // Load OpenCV.js dynamically
  useEffect(() => {
    if (window.cv) {
      setOpencvLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.8.0/opencv.js';
    script.async = true;
    script.onload = () => {
      // OpenCV takes a moment to initialize even after script load
      // We can use cv.onRuntimeInitialized or just wait
      if (window.cv.getBuildInformation) {
          setOpencvLoaded(true);
      } else {
        window.cv['onRuntimeInitialized'] = () => {
            setOpencvLoaded(true);
        };
      }
    };
    document.body.appendChild(script);

    return () => {
        // Cleanup if needed (rare for global script)
    };
  }, []);

  useEffect(() => {
    if (file) {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = () => {
        setImage(img);
        setResultImage(null); // Reset result on new file
      };
    }
  }, [file]);

  // Initial Draw & Resize
  useEffect(() => {
    if (image && canvasRef.current && maskCanvasRef.current) {
      // 1. Setup Result Canvas (Visual)
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // 2. Setup Mask Canvas (Hidden/Overlay)
      const maskCanvas = maskCanvasRef.current;
      const maskCtx = maskCtxRef.current = maskCanvas.getContext('2d', { willReadFrequently: true });

      // Match dimensions
      canvas.width = image.width;
      canvas.height = image.height;
      
      maskCanvas.width = image.width;
      maskCanvas.height = image.height;

      // Draw initial image
      if (resultImage) {
         ctx.drawImage(resultImage, 0, 0);
      } else {
         ctx.drawImage(image, 0, 0);
      }
      
      // Clear Mask
      // maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      // Actually we need to keep mask clear until user draws.
      // If we re-render due to undo, we might need to redraw mask history?
      // For now simple approach: Inpainting consumes the mask, so we clear it after erase.
    }
  }, [image, resultImage]);

  const maskCtxRef = useRef(null);

  // Drawing Logic
  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    if (isProcessing) return;
    setIsDrawing(true);
    const pos = getMousePos(e);
    
    const ctx = canvasRef.current.getContext('2d');
    const maskCtx = maskCanvasRef.current.getContext('2d');
    
    [ctx, maskCtx].forEach(c => {
        c.beginPath();
        c.moveTo(pos.x, pos.y);
        c.lineCap = 'round';
        c.lineJoin = 'round';
        c.lineWidth = brushSize;
    });
    
    // Visual feedback on main canvas (Red overlay)
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    
    // Actual mask logic (White on Black)
    // OpenCV inpainting mask: non-zero pixels indicate area to inpaint.
    maskCtx.strokeStyle = 'rgba(255, 255, 255, 1)'; 
  };

  const draw = (e) => {
    if (!isDrawing || isProcessing) return;
    const pos = getMousePos(e);
    
    const ctx = canvasRef.current.getContext('2d');
    const maskCtx = maskCanvasRef.current.getContext('2d');

    // Visual
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    // Mask
    maskCtx.lineTo(pos.x, pos.y);
    maskCtx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const ctx = canvasRef.current.getContext('2d');
    const maskCtx = maskCanvasRef.current.getContext('2d');
    
    ctx.closePath();
    maskCtx.closePath();
  };

  // Erase / Inpaint Logic
  const handleErase = () => {
    if (!window.cv || !opencvLoaded) {
        alert("OpenCV is still loading...");
        return;
    }
    
    setIsProcessing(true);

    // Save history before change
    const currentUrl = canvasRef.current.toDataURL();
    setHistory([...history, currentUrl]);

    // Small timeout to allow UI to update (show loading state)
    setTimeout(() => {
        try {
            const cv = window.cv;
            
            // 1. Read Image
            // We read from the current state of canvas (which has the red lines drawn on it... wait!)
            // PROBLEM: The main canvas currently has red lines drawn on it by the user. 
            // We need to run inpaint on the *clean* image vs the *mask*.
            // So we should maintain the "Current Clean State" separately? 
            // OR: We can re-draw the clean image (image or resultImage) onto a temp canvas to read src.
            
            // Let's create temp mats
            const srcMat = cv.imread(resultImage ? resultImage : image); // Helper 'imread' usually takes an ID. 
            // cv.imread works on HTMLImageElement or Canvas ID.
            
            // Create a temp canvas to hold the CLEAN source (without red lines)
            const tempSrcCanvas = document.createElement('canvas');
            tempSrcCanvas.width = canvasRef.current.width;
            tempSrcCanvas.height = canvasRef.current.height;
            const tempCtx = tempSrcCanvas.getContext('2d');
            if (resultImage) {
                tempCtx.drawImage(resultImage, 0, 0);
            } else {
                tempCtx.drawImage(image, 0, 0);
            }
            
            // src
            const src = cv.imread(tempSrcCanvas);
            
            // mask
            // The maskCanvasRef has white lines on transparent bg. We need white on black.
            // Let's fill black first? No, we needed to do that before drawing. 
            // Fix: Composite "Source-Over" white lines on black bg.
            const finalMaskCanvas = document.createElement('canvas');
            finalMaskCanvas.width = maskCanvasRef.current.width;
            finalMaskCanvas.height = maskCanvasRef.current.height;
            const fCtx = finalMaskCanvas.getContext('2d');
            fCtx.fillStyle = 'black';
            fCtx.fillRect(0,0, finalMaskCanvas.width, finalMaskCanvas.height);
            fCtx.drawImage(maskCanvasRef.current, 0, 0);
            
            const mask = cv.imread(finalMaskCanvas);
            
            // Convert to proper formats
            // src needs 3 channels usually?
            // mask needs 1 channel 8-bit
            cv.cvtColor(mask, mask, cv.COLOR_RGBA2GRAY, 0);
            // cv.threshold(mask, mask, 10, 255, cv.THRESH_BINARY); // Ensure strict binary
            
            const dst = new cv.Mat();
            
            // INPAINT
            // 3.0 is the radius
            // cv.INPAINT_TELEA or cv.INPAINT_NS
            cv.inpaint(src, mask, dst, 3, cv.INPAINT_TELEA);
            
            // Show result
            cv.imshow(canvasRef.current, dst);
            
            // Save result to state so we can continue editing
            const newUrl = canvasRef.current.toDataURL();
            const newImg = new Image();
            newImg.src = newUrl;
            newImg.onload = () => {
                setResultImage(newImg);
                
                // Clear the mask for next time
                const maskCtx = maskCanvasRef.current.getContext('2d');
                maskCtx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
                
                // Cleanup Mats
                src.delete();
                mask.delete();
                dst.delete();
                setIsProcessing(false);
                triggerConfetti();
            };

        } catch (e) {
            console.error(e);
            alert("Error running inpaint. See console.");
            setIsProcessing(false);
        }
    }, 100);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prevUrl = history[history.length - 1];
    setHistory(history.slice(0, -1));
    
    const img = new Image();
    img.src = prevUrl;
    img.onload = () => {
        setResultImage(img);
        // Also clear any current drawing on mask
        const maskCtx = maskCanvasRef.current.getContext('2d');
        maskCtx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
    };
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'magic-erased-image.jpg';
    link.href = canvasRef.current.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="title-wrapper">
             <h3>Magic Eraser</h3>
             {!opencvLoaded && <span className="tag">Loading Engine...</span>}
        </div>
        
        <div className="header-actions">
           <button className="icon-btn" onClick={handleUndo} disabled={history.length === 0 || isProcessing} title="Undo">
              <Undo size={18} />
           </button>
           <button className="download-btn" onClick={handleDownload} disabled={isProcessing}>
              <Download size={18} /> Download
           </button>
        </div>
      </div>

      <div className="editor-workspace" ref={containerRef}>
         <div className="canvas-wrapper">
             {/* Main Display Canvas */}
             <canvas 
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{ 
                    cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${brushSize}" height="${brushSize}" viewBox="0 0 ${brushSize} ${brushSize}"><circle cx="${brushSize/2}" cy="${brushSize/2}" r="${brushSize/2}" fill="none" stroke="red" stroke-width="1"/></svg>') ${brushSize/2} ${brushSize/2}, crosshair`,
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)' 
                }}
             />
             
             {/* Hidden Mask Canvas - stays offscreen or hidden */}
             <canvas ref={maskCanvasRef} style={{ display: 'none' }} />
             
             {isProcessing && (
                 <div className="processing-overlay">
                    <div className="spinner"></div>
                    <p>Erasing Object...</p>
                 </div>
             )}
         </div>
      </div>
      
      <div className="toolbar-bottom">
          <div className="tool-control">
              <label>Brush Size</label>
              <input 
                type="range" 
                min="5" max="100" 
                value={brushSize} 
                onChange={(e) => setBrushSize(parseInt(e.target.value))} 
              />
          </div>
          <button 
            className="magic-btn" 
            onClick={handleErase}
            disabled={!opencvLoaded || isProcessing}
          >
             <Sparkles size={20} /> Erase Selected
          </button>
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
        .icon-btn:disabled { opacity: 0.5; }
        
        .title-wrapper { display: flex; align-items: center; gap: 12px; }
        .tag { background: #ff9900; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; }
        
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

        .processing-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            z-index: 10;
        }
        .spinner {
           width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%;
           animation: spin 1s infinite linear; margin-bottom: 10px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .toolbar-bottom {
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 40px;
        }
        
        .tool-control {
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--text-main);
            font-weight: 500;
        }
        
        .magic-btn {
           background: linear-gradient(135deg, #FF0080 0%, #7928CA 100%);
           color: white;
           border: none;
           padding: 12px 32px;
           border-radius: 50px;
           font-size: 1.1rem;
           font-weight: bold;
           display: flex;
           align-items: center;
           gap: 8px;
           box-shadow: 0 4px 15px rgba(121, 40, 202, 0.4);
           transition: transform 0.2s, box-shadow 0.2s;
        }
        .magic-btn:hover:not(:disabled) {
           transform: translateY(-2px);
           box-shadow: 0 8px 25px rgba(121, 40, 202, 0.5);
        }
        .magic-btn:disabled {
           opacity: 0.6;
           cursor: not-allowed;
           transform: none;
        }
      `}</style>
    </div>
  );
};

export default MagicEraserEditor;
