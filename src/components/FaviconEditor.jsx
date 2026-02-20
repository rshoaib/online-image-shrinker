import { useState, useRef } from 'react';
import { ArrowLeft, Download, Upload, Image as ImageIcon } from 'lucide-react';

const SIZES = [16, 32, 48, 64, 96, 128, 192, 512];

const FaviconEditor = ({ onBack }) => {
  const canvasRef = useRef(null);
  const [sourceImage, setSourceImage] = useState(null);
  const [sourceUrl, setSourceUrl] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([16, 32, 48, 192, 512]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparent, setTransparent] = useState(true);
  const [borderRadius, setBorderRadius] = useState(0);
  const [previews, setPreviews] = useState([]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setSourceImage(img);
        setSourceUrl(ev.target.result);
        generatePreviews(img);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const generatePreviews = (img) => {
    const results = selectedSizes.map((size) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (borderRadius > 0) {
        ctx.beginPath();
        const r = (borderRadius / 100) * (size / 2);
        ctx.roundRect(0, 0, size, size, r);
        ctx.clip();
      }

      if (!transparent) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
      }

      // Center-crop to square
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

      return { size, dataUrl: canvas.toDataURL('image/png') };
    });
    setPreviews(results);
  };

  // Re-generate when settings change
  const regenerate = () => {
    if (sourceImage) generatePreviews(sourceImage);
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) => {
      const next = prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b);
      return next;
    });
  };

  const downloadSingle = (preview) => {
    const link = document.createElement('a');
    link.download = `favicon-${preview.size}x${preview.size}.png`;
    link.href = preview.dataUrl;
    link.click();
  };

  const downloadAll = () => {
    previews.forEach((p, i) => {
      setTimeout(() => downloadSingle(p), i * 200);
    });
  };

  const downloadICO = () => {
    // Generate a simple ICO with 16x16 and 32x32
    const p16 = previews.find(p => p.size === 16);
    const p32 = previews.find(p => p.size === 32);
    if (p16) downloadSingle(p16);
    if (p32) downloadSingle(p32);
  };

  return (
    <div className="favicon-editor">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Favicon Generator</h2>
        <div className="header-actions">
          {previews.length > 0 && (
            <button className="primary-btn" onClick={downloadAll}>
              <Download size={18} /> Download All
            </button>
          )}
        </div>
      </div>

      <div className="workspace">
        <div className="controls-sidebar">
          <div className="control-group">
            <label>Upload Image</label>
            <div className="file-input-wrapper">
              <input type="file" accept="image/*" id="favicon-upload" onChange={handleUpload} hidden />
              <label htmlFor="favicon-upload" className="file-label">
                <Upload size={16} />
                {sourceUrl ? 'Change Image' : 'Choose Image'}
              </label>
            </div>
            {sourceUrl && (
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <img src={sourceUrl} alt="Source" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '1px solid var(--border-light)' }} />
              </div>
            )}
          </div>

          <div className="control-group">
            <label>Sizes to Generate</label>
            <div className="size-grid">
              {SIZES.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSizes.includes(size) ? 'active' : ''}`}
                  onClick={() => { handleSizeToggle(size); setTimeout(regenerate, 50); }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>
              <input type="checkbox" checked={transparent} onChange={(e) => { setTransparent(e.target.checked); setTimeout(regenerate, 50); }} />
              {' '}Transparent Background
            </label>
            {!transparent && (
              <div className="color-field">
                <span>Background Color</span>
                <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setTimeout(regenerate, 50); }} />
              </div>
            )}
          </div>

          <div className="control-group">
            <label>Border Radius: {borderRadius}%</label>
            <input type="range" min="0" max="50" value={borderRadius} onChange={(e) => { setBorderRadius(Number(e.target.value)); setTimeout(regenerate, 50); }} />
            <div className="slider-labels"><span>Square</span><span>Rounded</span></div>
          </div>

          <div className="control-group" style={{ marginTop: 'auto' }}>
            <div style={{ padding: 12, background: 'var(--bg-surface)', borderRadius: 8, fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              <strong>How to use:</strong><br />
              1. Upload your logo or icon<br />
              2. Select sizes (16×16 and 32×32 for browsers, 192×192 and 512×512 for PWA)<br />
              3. Download and place in your website root
            </div>
          </div>
        </div>

        <div className="canvas-area">
          {!sourceUrl ? (
            <div className="empty-state">
              <ImageIcon size={48} style={{ opacity: 0.3 }} />
              <p>Upload an image to generate favicons</p>
              <label htmlFor="favicon-upload" className="primary-btn" style={{ cursor: 'pointer' }}>
                <Upload size={18} /> Upload Image
              </label>
            </div>
          ) : (
            <div className="previews-grid">
              {previews.map((p) => (
                <div key={p.size} className="preview-card" onClick={() => downloadSingle(p)}>
                  <div className="preview-img-wrapper">
                    <img src={p.dataUrl} alt={`${p.size}x${p.size}`} style={{ width: Math.min(p.size, 128), height: Math.min(p.size, 128), imageRendering: p.size < 64 ? 'pixelated' : 'auto' }} />
                  </div>
                  <div className="preview-label">{p.size}×{p.size}</div>
                  <button className="download-icon"><Download size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .favicon-editor {
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
        }
        .controls-sidebar {
          width: 320px;
          background: var(--bg-surface);
          border-right: 1px solid var(--border-light);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
        }
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .control-group > label {
          font-weight: 600;
          color: var(--text-main);
          font-size: 0.9rem;
        }
        .size-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }
        .size-btn {
          padding: 8px 4px;
          border: 1px solid var(--border-light);
          border-radius: 6px;
          background: var(--bg-input);
          color: var(--text-muted);
          font-size: 0.8rem;
          cursor: pointer;
          transition: 0.15s;
        }
        .size-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .color-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .color-field input[type="color"] {
          width: 100%;
          height: 36px;
          border: 1px solid var(--border-light);
          border-radius: 6px;
          cursor: pointer;
          padding: 2px;
        }
        .color-field span {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .file-input-wrapper {
          display: flex;
          gap: 8px;
        }
        .file-label {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: 1px dashed var(--border-light);
          border-radius: 6px;
          cursor: pointer;
          color: var(--text-muted);
          font-size: 0.9rem;
          transition: 0.2s;
        }
        .file-label:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(0, 102, 255, 0.05);
        }
        .canvas-area {
          flex: 1;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          overflow-y: auto;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: var(--text-muted);
        }
        .previews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 20px;
          width: 100%;
          max-width: 800px;
        }
        .preview-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: 0.2s;
          position: relative;
        }
        .preview-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }
        .preview-img-wrapper {
          width: 128px;
          height: 128px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: repeating-conic-gradient(#d5d5d5 0% 25%, transparent 0% 50%) 50% / 16px 16px;
          border-radius: 8px;
        }
        .preview-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .download-icon {
          position: absolute;
          top: 8px;
          right: 8px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: 0.2s;
        }
        .preview-card:hover .download-icon { opacity: 1; }
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
        .primary-btn:hover { filter: brightness(1.1); }
        @media (max-width: 768px) {
          .workspace { flex-direction: column-reverse; }
          .controls-sidebar { width: 100%; flex: none; }
          .canvas-area { padding: 20px; }
          .previews-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default FaviconEditor;
