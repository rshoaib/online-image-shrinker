import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Copy, Check, Palette, RefreshCw } from 'lucide-react';
import ColorThief from 'colorthief';
import { copyToClipboard } from '../utils/clipboard';

const ColorPaletteEditor = ({ file, onBack }) => {
  const [palette, setPalette] = useState([]);
  const [dominantColor, setDominantColor] = useState(null);
  const [isExtracting, setIsExtracting] = useState(true);
  const [copiedColor, setCopiedColor] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (file) {
      setIsExtracting(true);
      // We rely on the image onLoad event to trigger extraction
    }
  }, [file]);

  const extractColors = () => {
    const colorThief = new ColorThief();
    const img = imgRef.current;

    if (img.complete) {
      try {
        const dominant = colorThief.getColor(img);
        const paletteRaw = colorThief.getPalette(img, 10);
        
        setDominantColor(rgbToHex(dominant));
        setPalette(paletteRaw.map(rgb => rgbToHex(rgb)));
      } catch (e) {
        console.error("Error extracting colors", e);
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const rgbToHex = (rgb) => {
    return "#" + rgb.map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join('');
  };

  const handleCopy = async (color) => {
    const success = await copyToClipboard(color);
    if (success) {
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    }
  };

  return (
    <div className="palette-editor">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Color Palette Generator</h2>
      </div>

      <div className="workspace">
        <div className="image-section">
          <div className="image-card">
             <img 
               ref={imgRef}
               src={URL.createObjectURL(file)} 
               alt="Source" 
               className="source-image"
               onLoad={extractColors}
               crossOrigin="anonymous"
             />
          </div>
        </div>

        <div className="palette-section">
          {isExtracting ? (
            <div className="loading-state">
              <RefreshCw className="spin" size={32} />
              <p>Extracting colors...</p>
            </div>
          ) : (
             <div className="palette-content">
                <div className="dominant-card">
                  <h3>Dominant Color</h3>
                  <div 
                    className="swatch-large" 
                    style={{ backgroundColor: dominantColor }}
                    onClick={() => handleCopy(dominantColor)}
                  >
                     <span className="color-code">{dominantColor}</span>
                     {copiedColor === dominantColor && <div className="copied-overlay"><Check size={24} /></div>}
                  </div>
                </div>

                <h3>Palette</h3>
                <div className="palette-grid">
                  {palette.map((color, index) => (
                    <div 
                      key={index} 
                      className="swatch-card"
                      style={{ backgroundColor: color }}
                      onClick={() => handleCopy(color)}
                    >
                      <div className="swatch-info">
                        <span className="color-code-mini">{color}</span>
                        {copiedColor === color ? <Check size={16} /> : <Copy size={16} className="copy-icon"/>}
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>
      </div>

      <style>{`
        .palette-editor {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 100px);
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .editor-header {
           display: flex;
           align-items: center;
           gap: 20px;
           margin-bottom: 30px;
        }

        .back-btn {
          background: none; border: none; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; gap: 8px; font-size: 1rem;
        }

        .workspace {
           display: flex;
           gap: 40px;
           flex: 1;
           min-height: 0; 
        }

        .image-section {
           flex: 1;
           display: flex;
           flex-direction: column;
           justify-content: center;
        }

        .image-card {
           background: var(--bg-surface);
           padding: 10px;
           border-radius: var(--radius-lg);
           border: 1px solid var(--border-light);
           box-shadow: 0 10px 30px rgba(0,0,0,0.1);
           display: flex;
           justify-content: center;
           align-items: center;
           max-height: 80vh;
        }

        .source-image {
           max-width: 100%;
           max-height: 75vh;
           border-radius: var(--radius-md);
           object-fit: contain;
        }

        .palette-section {
           flex: 1;
           background: var(--bg-panel);
           border-radius: var(--radius-lg);
           border: 1px solid var(--border-light);
           padding: 30px;
           overflow-y: auto;
           display: flex;
           flex-direction: column;
        }

        .loading-state {
           flex: 1;
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: center;
           color: var(--text-muted);
           gap: 16px;
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .palette-content {
           display: flex;
           flex-direction: column;
           gap: 24px;
        }

        .dominant-card h3, .palette-content h3 {
           margin-bottom: 12px;
           font-size: 1.1rem;
           color: var(--text-muted);
        }

        .swatch-large {
           height: 120px;
           border-radius: var(--radius-md);
           display: flex;
           align-items: center;
           justify-content: center;
           cursor: pointer;
           transition: transform 0.2s;
           position: relative;
           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .swatch-large:hover { transform: scale(1.02); }

        .swatch-large .color-code {
           background: rgba(0,0,0,0.5);
           color: white;
           padding: 6px 16px;
           border-radius: 20px;
           font-family: monospace;
           font-size: 1.2rem;
           backdrop-filter: blur(4px);
        }

        .palette-grid {
           display: grid;
           grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
           gap: 16px;
        }

        .swatch-card {
           height: 100px;
           border-radius: var(--radius-md);
           cursor: pointer;
           position: relative;
           transition: transform 0.2s;
           display: flex;
           align-items: flex-end;
           justify-content: center;
           padding-bottom: 12px;
           box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .swatch-card:hover { transform: translateY(-4px); }

        .swatch-info {
           background: rgba(255,255,255,0.9);
           padding: 4px 12px;
           border-radius: 12px;
           display: flex;
           align-items: center;
           gap: 8px;
           font-size: 0.9rem;
           opacity: 0;
           transform: translateY(10px);
           transition: all 0.2s;
        }
        
        .swatch-card:hover .swatch-info {
           opacity: 1;
           transform: translateY(0);
        }

        .color-code-mini {
           font-family: monospace;
           font-weight: 600;
           color: #333;
        }
        
        .copy-icon { color: var(--text-muted); }

        .copied-overlay {
           position: absolute;
           inset: 0;
           display: flex;
           align-items: center;
           justify-content: center;
           background: rgba(0,0,0,0.3);
           color: white;
           border-radius: var(--radius-md);
        }

        @media (max-width: 900px) {
           .workspace { flex-direction: column; }
           .image-card { max-height: 400px; }
        }
      `}</style>
    </div>
  );
};

export default ColorPaletteEditor;
