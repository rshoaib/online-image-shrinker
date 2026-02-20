import { useState, useRef } from 'react';
import { ArrowLeft, Download, Upload, Image as ImageIcon } from 'lucide-react';

const SvgToPngEditor = ({ onBack }) => {
  const fileInputRef = useRef(null);
  const [svgContent, setSvgContent] = useState(null);
  const [svgUrl, setSvgUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [keepAspect, setKeepAspect] = useState(true);
  const [originalRatio, setOriginalRatio] = useState(1);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparent, setTransparent] = useState(true);
  const [pngUrl, setPngUrl] = useState(null);
  const [scale, setScale] = useState(1);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.svg')) {
      alert('Please upload an SVG file');
      return;
    }
    setFileName(file.name.replace('.svg', ''));
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target.result;
      setSvgContent(content);
      setSvgUrl(URL.createObjectURL(file));

      // Parse SVG to get dimensions
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'image/svg+xml');
      const svg = doc.querySelector('svg');
      if (svg) {
        const vb = svg.getAttribute('viewBox');
        let w = parseFloat(svg.getAttribute('width')) || 300;
        let h = parseFloat(svg.getAttribute('height')) || 300;
        if (vb) {
          const parts = vb.split(/[\s,]+/);
          w = parseFloat(parts[2]) || w;
          h = parseFloat(parts[3]) || h;
        }
        const ratio = w / h;
        setOriginalRatio(ratio);
        setWidth(Math.round(w * scale));
        setHeight(Math.round(h * scale));
      }
      convertToPng(content, width, height);
    };
    reader.readAsText(file);
  };

  const convertToPng = (svgStr, w, h) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    if (!transparent) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);
    }

    const img = new Image();
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      setPngUrl(canvas.toDataURL('image/png'));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      console.error('Failed to render SVG');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleWidthChange = (newW) => {
    setWidth(newW);
    if (keepAspect) {
      setHeight(Math.round(newW / originalRatio));
    }
    if (svgContent) convertToPng(svgContent, newW, keepAspect ? Math.round(newW / originalRatio) : height);
  };

  const handleHeightChange = (newH) => {
    setHeight(newH);
    if (keepAspect) {
      setWidth(Math.round(newH * originalRatio));
    }
    if (svgContent) convertToPng(svgContent, keepAspect ? Math.round(newH * originalRatio) : width, newH);
  };

  const handleScalePreset = (s) => {
    setScale(s);
    const newW = Math.round(width * s / scale);
    const newH = Math.round(height * s / scale);
    setWidth(newW);
    setHeight(newH);
    if (svgContent) convertToPng(svgContent, newW, newH);
  };

  const regenerate = () => {
    if (svgContent) convertToPng(svgContent, width, height);
  };

  const downloadPng = () => {
    if (!pngUrl) return;
    const link = document.createElement('a');
    link.download = `${fileName || 'converted'}-${width}x${height}.png`;
    link.href = pngUrl;
    link.click();
  };

  return (
    <div className="svg-editor">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>SVG to PNG Converter</h2>
        <div className="header-actions">
          {pngUrl && (
            <button className="primary-btn" onClick={downloadPng}>
              <Download size={18} /> Download PNG
            </button>
          )}
        </div>
      </div>

      <div className="workspace">
        <div className="controls-sidebar">
          <div className="control-group">
            <label>Upload SVG</label>
            <div className="file-input-wrapper">
              <input ref={fileInputRef} type="file" accept=".svg" id="svg-upload" onChange={handleUpload} hidden />
              <label htmlFor="svg-upload" className="file-label">
                <Upload size={16} />
                {svgContent ? 'Change SVG' : 'Choose SVG File'}
              </label>
            </div>
          </div>

          {svgContent && (
            <>
              <div className="control-group">
                <label>Output Size</label>
                <div className="size-inputs">
                  <div className="size-field">
                    <span>Width</span>
                    <input type="number" value={width} onChange={(e) => handleWidthChange(Number(e.target.value))} min="1" max="8192" />
                  </div>
                  <span className="size-x">×</span>
                  <div className="size-field">
                    <span>Height</span>
                    <input type="number" value={height} onChange={(e) => handleHeightChange(Number(e.target.value))} min="1" max="8192" />
                  </div>
                </div>
                <label className="checkbox-label">
                  <input type="checkbox" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} />
                  Lock aspect ratio
                </label>
              </div>

              <div className="control-group">
                <label>Quick Sizes</label>
                <div className="preset-row">
                  {[
                    { label: '64', w: 64, h: 64 },
                    { label: '256', w: 256, h: 256 },
                    { label: '512', w: 512, h: 512 },
                    { label: '1024', w: 1024, h: 1024 },
                    { label: '2048', w: 2048, h: 2048 },
                    { label: '4K', w: 4096, h: 4096 },
                  ].map((p) => (
                    <button key={p.label} className="preset-btn" onClick={() => { setWidth(p.w); setHeight(p.h); if (svgContent) convertToPng(svgContent, p.w, p.h); }}>
                      {p.label}
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
            </>
          )}

          <div className="control-group" style={{ marginTop: 'auto' }}>
            <div style={{ padding: 12, background: 'var(--bg-surface)', borderRadius: 8, fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              <strong>About SVG to PNG:</strong><br />
              SVG (Scalable Vector Graphics) are resolution-independent but not supported everywhere. This tool converts SVG to PNG at any resolution — perfect for favicons, app icons, social media, and web assets.
            </div>
          </div>
        </div>

        <div className="canvas-area">
          {!svgContent ? (
            <div className="empty-state">
              <ImageIcon size={48} style={{ opacity: 0.3 }} />
              <p>Upload an SVG file to convert to PNG</p>
              <label htmlFor="svg-upload" className="primary-btn" style={{ cursor: 'pointer' }}>
                <Upload size={18} /> Upload SVG
              </label>
            </div>
          ) : (
            <div className="preview-container">
              <div className="preview-comparison">
                <div className="preview-panel">
                  <h4>SVG (Original)</h4>
                  <div className="preview-box checkerboard">
                    <img src={svgUrl} alt="SVG" style={{ maxWidth: '100%', maxHeight: 300 }} />
                  </div>
                  <span className="preview-info">Vector / Infinite Resolution</span>
                </div>
                <div className="arrow-divider">→</div>
                <div className="preview-panel">
                  <h4>PNG (Converted)</h4>
                  <div className="preview-box checkerboard">
                    {pngUrl && <img src={pngUrl} alt="PNG" style={{ maxWidth: '100%', maxHeight: 300 }} />}
                  </div>
                  <span className="preview-info">{width}×{height}px</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .svg-editor {
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
        .size-inputs {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        .size-field {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .size-field span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .size-field input {
          padding: 8px;
          border: 1px solid var(--border-light);
          border-radius: 6px;
          background: var(--bg-input);
          color: var(--text-main);
          font-size: 0.9rem;
          width: 100%;
        }
        .size-x {
          font-size: 1.2rem;
          color: var(--text-muted);
          padding-bottom: 8px;
        }
        .preset-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
        .preset-btn {
          padding: 8px;
          border: 1px solid var(--border-light);
          border-radius: 6px;
          background: var(--bg-input);
          color: var(--text-main);
          font-size: 0.8rem;
          cursor: pointer;
          transition: 0.15s;
          font-weight: 500;
        }
        .preset-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          cursor: pointer;
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
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: var(--text-muted);
        }
        .preview-container {
          width: 100%;
          max-width: 800px;
        }
        .preview-comparison {
          display: flex;
          gap: 24px;
          align-items: center;
        }
        .preview-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .preview-panel h4 {
          font-size: 0.9rem;
          color: var(--text-main);
          margin: 0;
        }
        .preview-box {
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          width: 100%;
        }
        .checkerboard {
          background: repeating-conic-gradient(#d5d5d5 0% 25%, white 0% 50%) 50% / 16px 16px;
        }
        .preview-info {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .arrow-divider {
          font-size: 2rem;
          color: var(--text-muted);
          flex-shrink: 0;
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
        .primary-btn:hover { filter: brightness(1.1); }
        @media (max-width: 768px) {
          .workspace { flex-direction: column-reverse; }
          .controls-sidebar { width: 100%; flex: none; }
          .canvas-area { padding: 20px; }
          .preview-comparison { flex-direction: column; }
          .arrow-divider { transform: rotate(90deg); }
        }
      `}</style>
    </div>
  );
};

export default SvgToPngEditor;
