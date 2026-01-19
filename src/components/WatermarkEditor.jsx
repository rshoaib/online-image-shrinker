import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Type, Download } from 'lucide-react';

const WatermarkEditor = ({ file, onBack }) => {
  const [text, setText] = useState('© My Watermark');
  const [opacity, setOpacity] = useState(0.5);
  const [color, setColor] = useState('#ffffff');
  const [size, setSize] = useState(48);
  const [position, setPosition] = useState('center'); // center, tl, tr, bl, br
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const canvasRef = useRef(null);

  useEffect(() => {
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      drawPreview();
    }
  }, [file, text, opacity, color, size, position]);

  const drawPreview = () => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
         const canvas = canvasRef.current;
         if (!canvas) return;
         
         canvas.width = img.width;
         canvas.height = img.height;
         const ctx = canvas.getContext('2d');
         
         // Draw Image
         ctx.drawImage(img, 0, 0);

         // Configure Text based on image size (scale relative to 1000px base)
         const scale = Math.max(img.width, img.height) / 1000;
         const fontSize = size * scale;

         ctx.font = `bold ${fontSize}px sans-serif`;
         ctx.fillStyle = color;
         ctx.globalAlpha = opacity;
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';

         // Calculate Position
         let x = img.width / 2;
         let y = img.height / 2;
         const padding = 50 * scale;

         if (position === 'tl') { x = padding; y = padding; ctx.textAlign = 'left'; ctx.textBaseline='top'; }
         if (position === 'tr') { x = img.width - padding; y = padding; ctx.textAlign = 'right'; ctx.textBaseline='top'; }
         if (position === 'bl') { x = padding; y = img.height - padding; ctx.textAlign = 'left'; ctx.textBaseline='bottom'; }
         if (position === 'br') { x = img.width - padding; y = img.height - padding; ctx.textAlign = 'right'; ctx.textBaseline='bottom'; }

         ctx.fillText(text, x, y);
      };
  };

  const handleDownload = () => {
     if (canvasRef.current) {
        canvasRef.current.toBlob(blob => {
           const url = URL.createObjectURL(blob);
           const link = document.createElement('a');
           link.href = url;
           link.download = `watermarked-${file.name}`;
           link.click();
        });
     }
  };

  return (
    <div className="watermark-editor">
      <div className="editor-header">
         <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Watermark Studio</h2>
        <button className="primary-btn" onClick={handleDownload}>
           <Download size={18} /> Download
        </button>
      </div>

      <div className="workspace">
         <div className="preview-area">
             <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
         </div>

         <div className="sidebar">
            <div className="controls-panel">
               <h3>Settings</h3>
               
               <div className="control-group">
                 <label>Watermark Text</label>
                 <input 
                   type="text" 
                   value={text} 
                   onChange={(e) => setText(e.target.value)}
                   className="text-input"
                 />
               </div>

               <div className="control-group">
                 <label>Position</label>
                 <div className="grid-pos">
                    {['tl', 'tr', 'center', 'bl', 'br'].map(pos => (
                       <button 
                         key={pos}
                         className={`pos-btn ${position === pos ? 'active' : ''}`}
                         onClick={() => setPosition(pos)}
                       >
                         {pos.toUpperCase()}
                       </button>
                    ))}
                 </div>
               </div>

               <div className="control-group">
                 <label>Opacity ({Math.round(opacity * 100)}%)</label>
                 <input 
                   type="range" min="0.1" max="1" step="0.1"
                   value={opacity}
                   onChange={e => setOpacity(parseFloat(e.target.value))}
                 />
               </div>

               <div className="control-group">
                  <label>Color</label>
                  <div className="color-picker">
                     {['#ffffff', '#000000', '#ff0000', '#FFFF00', '#00F0FF'].map(c => (
                        <button 
                          key={c}
                          style={{ background: c }}
                          className={`color-btn ${color === c ? 'active' : ''}`}
                          onClick={() => setColor(c)}
                        />
                     ))}
                  </div>
               </div>

               <div className="control-group">
                  <label>Size</label>
                  <input 
                    type="range" min="10" max="200" 
                    value={size}
                    onChange={e => setSize(parseInt(e.target.value))}
                  />
               </div>
            </div>
         </div>
      </div>

      <style>{`
        .watermark-editor {
           display: flex;
           flex-direction: column;
           height: calc(100vh - 160px);
        }
        
        /* Reuse styles from other editors where possible, or define specific ones */
        .workspace {
           display: flex;
           flex: 1;
           overflow: hidden;
        }

        .preview-area {
           flex: 1;
           background: #111;
           display: flex;
           align-items: center;
           justify-content: center;
           padding: 20px;
        }

        .Sidebar {
           width: 300px;
           background: var(--bg-panel);
           border-left: 1px solid var(--border-light);
        }

        .controls-panel {
           padding: 20px;
           display: flex;
           flex-direction: column;
           gap: 20px;
        }

        .text-input {
           width: 100%;
           padding: 10px;
           border-radius: var(--radius-sm);
           border: 1px solid var(--border-active);
           background: var(--bg-app);
           color: var(--text-main);
        }

        .grid-pos {
           display: grid;
           grid-template-columns: repeat(3, 1fr);
           gap: 8px;
        }

        .pos-btn {
           padding: 8px;
           background: var(--bg-surface);
           border: 1px solid var(--border-active);
           color: var(--text-dim);
           border-radius: 4px;
        }
        .pos-btn.active {
           background: var(--primary);
           color: black;
        }

        .color-picker {
           display: flex;
           gap: 10px;
        }
        .color-btn {
           width: 32px;
           height: 32px;
           border-radius: 50%;
           border: 2px solid transparent;
        }
        .color-btn.active {
           border-color: white;
           transform: scale(1.2);
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
           display: flex; 
           gap: 8px; 
           align-items: center;
        }
      `}</style>
    </div>
  );
};

export default WatermarkEditor;
