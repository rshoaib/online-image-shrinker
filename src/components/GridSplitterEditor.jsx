import { useState, useRef, useEffect } from 'react';
import { Download, Grid, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import JSZip from 'jszip';

const GridSplitterEditor = ({ file, onBack }) => {
  const [gridFormat, setGridFormat] = useState('3x3'); // 3x1, 3x2, 3x3, 3x4
  const [image, setImage] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);
  const [splitPreviews, setSplitPreviews] = useState([]);

  useEffect(() => {
    if (file) {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = () => {
        setImage(img);
        setImage(img);
        generatePreviews(img, gridFormat);
      };
    }
  }, [file]);

  useEffect(() => {
    if (image) {
      generatePreviews(image, gridFormat);
    }
  }, [gridFormat, image]);

  const generatePreviews = (img, format) => {
    // Determine rows based on format (always 3 cols)
    const rows = parseInt(format.split('x')[1]);
    const cols = 3;

    // Calculate dimensions
    // We want to Crop the image to ensure perfectly equal squares
    // The width of the image is the constraint.
    // Each square width = img.width / 3
    const squareSize = img.width / cols;
    const totalHeight = squareSize * rows;

    // Center the crop vertically if image is taller than needed
    // Or scale if needed.
    // Simplifying assumption: We fit the width, and crop the height from the center.
    
    // Actually, for Instagram grids, usually people want to choose the crop area.
    // For this MVP, we will crop from the center vertically.
    
    // Let's create small data URLs for preview
    const parts = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = squareSize;
    canvas.height = squareSize;

    // Start Y offset (centering)
    const startY = (img.height - totalHeight) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Draw the specific part
        // source x, source y, source w, source h, dest x, dest y, dest w, dest h
        ctx.clearRect(0, 0, squareSize, squareSize);
        ctx.drawImage(
          img, 
          c * squareSize, startY + (r * squareSize), squareSize, squareSize, 
          0, 0, squareSize, squareSize
        );
        parts.push(canvas.toDataURL('image/jpeg'));
      }
    }
    // Reverse parts because Instagram uploads happen bottom-right to top-left usually? 
    // Actually standard grid splitters give options. 
    // But usually you post number 9, then 8, ..., then 1.
    // Let's store them in reading order (1,2,3) for preview, but help user understand order.
    setSplitPreviews(parts);
  };

  const handleDownload = async () => {
    setIsProcessing(true);
    const zip = new JSZip();
    const rows = parseInt(gridFormat.split('x')[1]);
    const cols = 3;
    const squareSize = image.width / cols;
    const totalHeight = squareSize * rows;
    const startY = (image.height - totalHeight) / 2;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = squareSize;
    canvas.height = squareSize;

    // Generate high res blobs
    let index = 1;
    // We generate in reverse order (bottom-right to top-left) for posting convenience?
    // Or standard 1-9.
    // Let's stick to standard 1 to N, but maybe name them to help sorting.
    // Most tools name them by posting order (last to first).
    // Posting order: Bottom Right -> ... -> Top Left.
    // Grid:
    // 1 2 3
    // 4 5 6
    // 7 8 9
    // Post Order: 9, 8, 7, 6, 5, 4, 3, 2, 1.

    for (let r = rows - 1; r >= 0; r--) {
        for (let c = cols - 1; c >= 0; c--) {
            ctx.clearRect(0, 0, squareSize, squareSize);
            ctx.drawImage(
                image, 
                c * squareSize, startY + (r * squareSize), squareSize, squareSize, 
                0, 0, squareSize, squareSize
            );
            
            await new Promise(resolve => {
                canvas.toBlob(blob => {
                    zip.file(`split-${String(index).padStart(2, '0')}.jpg`, blob);
                    resolve();
                }, 'image/jpeg', 0.95);
            });
            index++;
        }
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
        const url = window.URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `instagram-grid-${gridFormat}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
        setIsProcessing(false);
    });
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} />
          Back
        </button>
        <h3>Instagram Grid Maker</h3>
        <div className="header-actions">
           <button 
              className="download-btn" 
              onClick={handleDownload} 
              disabled={isProcessing}
           >
              {isProcessing ? 'Zipping...' : 'Download ZIP'} <Download size={18} />
           </button>
        </div>
      </div>

      <div className="grid-workspace">
         <div className="controls-sidebar">
             <div className="control-group">
                 <label>Grid Format</label>
                 <div className="format-options">
                     {['3x1', '3x2', '3x3', '3x4'].map(fmt => (
                         <button 
                           key={fmt} 
                           className={`format-btn ${gridFormat === fmt ? 'active' : ''}`}
                           onClick={() => setGridFormat(fmt)}
                         >
                            <Grid size={16} /> {fmt}
                         </button>
                     ))}
                 </div>
                 <p className="help-text">
                     Files in the ZIP will be numbered in the correct posting order (last to first).
                 </p>
             </div>
         </div>

         <div className="preview-area">
             {image && (
                 <div className="split-preview-grid" style={{
                     display: 'grid',
                     gridTemplateColumns: 'repeat(3, 1fr)',
                     gap: '2px', // tiny gap to show splits
                     maxWidth: '500px',
                     margin: '0 auto',
                     border: '1px solid #ccc'
                 }}>
                    {splitPreviews.map((src, i) => (
                        <div key={i} className="grid-cell">
                            <img src={src} alt="grid part" style={{ width: '100%', display: 'block' }} />
                            <span className="cell-number">{(splitPreviews.length - i)}</span>
                        </div>
                    ))}
                 </div>
             )}
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
           margin-bottom: 30px;
           border-bottom: 1px solid var(--border-light);
           padding-bottom: 20px;
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
           padding: 10px 20px;
           border-radius: var(--radius-md);
           font-weight: 600;
           display: flex;
           align-items: center;
           gap: 8px;
        }
        .download-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .grid-workspace {
            display: flex;
            gap: 40px;
            flex: 1;
        }
        .controls-sidebar {
            width: 250px;
            flex-shrink: 0;
        }
        .preview-area {
            flex: 1;
            background: var(--bg-surface);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
        }
        .format-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 10px;
        }
        .format-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            border: 1px solid var(--border-light);
            border-radius: var(--radius-sm);
            text-align: left;
            transition: 0.2s;
        }
        .format-btn:hover { border-color: var(--primary); background: var(--bg-surface); }
        .format-btn.active { 
            background: var(--primary-glow); 
            border-color: var(--primary); 
            color: var(--primary);
            font-weight: 600;
        }
        .help-text {
            font-size: 0.85rem;
            color: var(--text-muted);
            margin-top: 20px;
            line-height: 1.5;
        }
        .grid-cell { position: relative; }
        .cell-number {
             position: absolute;
             top: 50%;
             left: 50%;
             transform: translate(-50%, -50%);
             background: rgba(0,0,0,0.5);
             color: white;
             width: 24px;
             height: 24px;
             border-radius: 50%;
             display: flex;
             align-items: center;
             justify-content: center;
             font-size: 12px;
             font-weight: bold;
        }

        @media (max-width: 800px) {
            .grid-workspace { flex-direction: column-reverse; }
            .controls-sidebar { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default GridSplitterEditor;
