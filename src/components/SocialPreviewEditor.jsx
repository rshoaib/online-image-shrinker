import { useState, useEffect, useRef, useCallback } from 'react';
import { Download, ArrowLeft, Copy, Check, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { copyCanvasToClipboard } from '../utils/clipboard';

const PLATFORMS = [
  { id: 'twitter',    label: 'Twitter / X Post',  w: 1200, h: 675  },
  { id: 'facebook',   label: 'Facebook Post',      w: 1200, h: 630  },
  { id: 'linkedin',   label: 'LinkedIn Post',      w: 1200, h: 627  },
  { id: 'instagram',  label: 'Instagram Post',     w: 1080, h: 1080 },
  { id: 'ig-story',   label: 'Instagram Story',    w: 1080, h: 1920 },
  { id: 'youtube',    label: 'YouTube Thumbnail',  w: 1280, h: 720  },
  { id: 'pinterest',  label: 'Pinterest Pin',      w: 1000, h: 1500 },
];

const gradients = [
  ['#667eea', '#764ba2'],
  ['#ff9a9e', '#fecfef'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#30cfd0', '#330867'],
  ['#0f2027', '#2c5364'],
  ['#232526', '#414345'],
  ['#11998e', '#38ef7d'],
];

const solidColors = [
  '#000000', '#1a1a2e', '#16213e', '#0f3460',
  '#ffffff', '#f3f4f6', '#3b82f6', '#8b5cf6',
];

const textColors = ['#ffffff', '#000000', '#f3f4f6', '#fbbf24', '#34d399', '#f87171', '#60a5fa', '#c084fc'];

const SocialPreviewEditor = ({ file, onBack }) => {
  const [originalImage, setOriginalImage] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Platform
  const [platform, setPlatform] = useState(PLATFORMS[0]);

  // Background
  const [bgMode, setBgMode] = useState('gradient'); // 'gradient' | 'solid' | 'image'
  const [bgGradient, setBgGradient] = useState(gradients[0]);
  const [bgSolid, setBgSolid] = useState('#1a1a2e');

  // Image overlay
  const [overlayOpacity, setOverlayOpacity] = useState(40);
  const [imageScale, setImageScale] = useState(100);

  // Text
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [headingSize, setHeadingSize] = useState(56);
  const [subheadingSize, setSubheadingSize] = useState(28);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textAlign, setTextAlign] = useState('center');

  const canvasRef = useRef(null);

  // Load image
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setOriginalImage(img);
        setBgMode('image'); // default to image background when file is uploaded
      };
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Canvas rendering
  const renderCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const W = platform.w;
    const H = platform.h;
    canvas.width = W;
    canvas.height = H;

    // 1. Background
    if (bgMode === 'solid') {
      ctx.fillStyle = bgSolid;
      ctx.fillRect(0, 0, W, H);
    } else {
      // Gradient (used for both 'gradient' and as base for 'image')
      const colors = bgMode === 'image' ? gradients[0] : bgGradient;
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(1, colors[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Image (scale-to-fill, centered)
    if (originalImage && (bgMode === 'image' || bgMode === 'gradient')) {
      const scale = (imageScale / 100);
      const imgRatio = originalImage.width / originalImage.height;
      const canvasRatio = W / H;

      let drawW, drawH;
      if (imgRatio > canvasRatio) {
        drawH = H * scale;
        drawW = drawH * imgRatio;
      } else {
        drawW = W * scale;
        drawH = drawW / imgRatio;
      }

      // If bgMode is gradient, don't draw the image at all (pure gradient bg)
      if (bgMode === 'image') {
        const drawX = (W - drawW) / 2;
        const drawY = (H - drawH) / 2;
        ctx.drawImage(originalImage, drawX, drawY, drawW, drawH);
      }
    }

    // 3. Dark overlay
    if (bgMode === 'image' && overlayOpacity > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity / 100})`;
      ctx.fillRect(0, 0, W, H);
    }

    // 4. Text
    const hasHeading = heading.trim().length > 0;
    const hasSub = subheading.trim().length > 0;

    if (hasHeading || hasSub) {
      ctx.textAlign = textAlign;
      ctx.fillStyle = textColor;

      // Compute x position based on alignment
      let textX;
      const margin = 60;
      if (textAlign === 'left') textX = margin;
      else if (textAlign === 'right') textX = W - margin;
      else textX = W / 2;

      const maxTextWidth = W - margin * 2;

      // Vertical centering
      const lineGap = 16;
      const totalTextHeight =
        (hasHeading ? headingSize : 0) +
        (hasSub ? subheadingSize : 0) +
        (hasHeading && hasSub ? lineGap : 0);
      let textY = (H - totalTextHeight) / 2;

      // Helper: word-wrap text
      const wrapText = (text, fontSize, fontWeight) => {
        ctx.font = `${fontWeight} ${fontSize}px 'Inter', 'Segoe UI', sans-serif`;
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxTextWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
      };

      // Draw heading
      if (hasHeading) {
        const headingLines = wrapText(heading, headingSize, 800);
        // Adjust textY for multi-line
        const headingBlockH = headingLines.length * (headingSize * 1.2);

        // Recalculate total height with wrapped lines
        const subLines = hasSub ? wrapText(subheading, subheadingSize, 400) : [];
        const subBlockH = subLines.length * (subheadingSize * 1.3);
        const recalcTotal = headingBlockH + (hasSub ? lineGap + subBlockH : 0);
        textY = (H - recalcTotal) / 2 + headingSize;

        // Text shadow for readability
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        ctx.font = `800 ${headingSize}px 'Inter', 'Segoe UI', sans-serif`;
        headingLines.forEach((line, i) => {
          ctx.fillText(line, textX, textY + i * (headingSize * 1.2));
        });
        textY += (headingLines.length - 1) * (headingSize * 1.2) + lineGap + subheadingSize;
      }

      // Draw subheading
      if (hasSub) {
        if (!hasHeading) {
          textY = (H + subheadingSize) / 2;
        }

        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;

        ctx.font = `400 ${subheadingSize}px 'Inter', 'Segoe UI', sans-serif`;
        const subLines = wrapText(subheading, subheadingSize, 400);
        subLines.forEach((line, i) => {
          ctx.fillText(line, textX, textY + i * (subheadingSize * 1.3));
        });
      }

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // 5. Subtle branding watermark
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = textColor;
    ctx.font = `500 ${Math.round(W * 0.012)}px 'Inter', sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText('onlineimageshrinker.com', W - 20, H - 16);
    ctx.globalAlpha = 1;

  }, [platform, bgMode, bgGradient, bgSolid, originalImage, overlayOpacity, imageScale, heading, subheading, headingSize, subheadingSize, textColor, textAlign]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = `social-preview-${platform.id}-${Date.now()}.png`;
    link.click();
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    const success = await copyCanvasToClipboard(canvasRef.current);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="editor-layout">
      <div className="toolbar">
        <div className="toolbar-header">
          <button onClick={onBack} className="back-btn"><ArrowLeft size={18} /> Back</button>
          <h3>Social Preview</h3>
        </div>

        {/* Platform Selector */}
        <div className="control-group">
          <label>Platform</label>
          <select
            id="platform-select"
            className="platform-select"
            value={platform.id}
            onChange={(e) => setPlatform(PLATFORMS.find(p => p.id === e.target.value))}
          >
            {PLATFORMS.map(p => (
              <option key={p.id} value={p.id}>
                {p.label} ({p.w}×{p.h})
              </option>
            ))}
          </select>
          <span className="dim-badge">{platform.w} × {platform.h}px</span>
        </div>

        {/* Background */}
        <div className="control-group">
          <label>Background</label>
          <div className="bg-mode-tabs">
            {originalImage && (
              <button
                className={`tab-btn ${bgMode === 'image' ? 'active' : ''}`}
                onClick={() => setBgMode('image')}
              >
                Photo
              </button>
            )}
            <button
              className={`tab-btn ${bgMode === 'gradient' ? 'active' : ''}`}
              onClick={() => setBgMode('gradient')}
            >
              Gradient
            </button>
            <button
              className={`tab-btn ${bgMode === 'solid' ? 'active' : ''}`}
              onClick={() => setBgMode('solid')}
            >
              Solid
            </button>
          </div>

          {bgMode === 'gradient' && (
            <div className="color-grid">
              {gradients.map((g, i) => (
                <button
                  key={i}
                  className={`color-dot gradient ${bgGradient === g ? 'active' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${g[0]}, ${g[1]})` }}
                  onClick={() => setBgGradient(g)}
                />
              ))}
            </div>
          )}

          {bgMode === 'solid' && (
            <div className="color-grid">
              {solidColors.map(c => (
                <button
                  key={c}
                  className={`color-dot ${bgSolid === c ? 'active' : ''}`}
                  style={{ backgroundColor: c, border: c === '#ffffff' ? '1px solid #ddd' : 'none' }}
                  onClick={() => setBgSolid(c)}
                />
              ))}
              <input type="color" value={bgSolid} onChange={(e) => setBgSolid(e.target.value)} className="picker-mini" />
            </div>
          )}

          {bgMode === 'image' && (
            <>
              <div className="slider-row">
                <span>Overlay</span>
                <input
                  type="range" min="0" max="80" step="5"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
                />
              </div>
              <div className="slider-row">
                <span>Zoom</span>
                <input
                  type="range" min="100" max="200" step="5"
                  value={imageScale}
                  onChange={(e) => setImageScale(parseInt(e.target.value))}
                />
              </div>
            </>
          )}
        </div>

        {/* Text */}
        <div className="control-group">
          <label><Type size={14} style={{marginRight: 4, verticalAlign: 'middle'}} /> Text Overlay</label>

          <input
            id="heading-input"
            type="text"
            className="text-input"
            placeholder="Heading text..."
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
          />
          <div className="slider-row">
            <span>Size</span>
            <input
              type="range" min="24" max="96" step="2"
              value={headingSize}
              onChange={(e) => setHeadingSize(parseInt(e.target.value))}
            />
          </div>

          <input
            id="subheading-input"
            type="text"
            className="text-input sub"
            placeholder="Subheading text..."
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
          />
          <div className="slider-row">
            <span>Size</span>
            <input
              type="range" min="14" max="48" step="2"
              value={subheadingSize}
              onChange={(e) => setSubheadingSize(parseInt(e.target.value))}
            />
          </div>

          {/* Text Color */}
          <div className="color-grid" style={{ marginTop: 8 }}>
            {textColors.map(c => (
              <button
                key={c}
                className={`color-dot small ${textColor === c ? 'active' : ''}`}
                style={{ backgroundColor: c, border: ['#ffffff', '#f3f4f6'].includes(c) ? '1px solid #ccc' : 'none' }}
                onClick={() => setTextColor(c)}
              />
            ))}
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="picker-mini small" />
          </div>

          {/* Text Alignment */}
          <div className="align-row">
            <button
              className={`align-btn ${textAlign === 'left' ? 'active' : ''}`}
              onClick={() => setTextAlign('left')}
            >
              <AlignLeft size={16} />
            </button>
            <button
              className={`align-btn ${textAlign === 'center' ? 'active' : ''}`}
              onClick={() => setTextAlign('center')}
            >
              <AlignCenter size={16} />
            </button>
            <button
              className={`align-btn ${textAlign === 'right' ? 'active' : ''}`}
              onClick={() => setTextAlign('right')}
            >
              <AlignRight size={16} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="action-buttons">
          <button className="download-btn-secondary" onClick={handleCopy}>
            {isCopied ? <Check size={18} /> : <Copy size={18} />} {isCopied ? 'Copied!' : 'Copy'}
          </button>
          <button id="download-btn" className="download-btn-primary" onClick={handleDownload}>
            <Download size={18} /> Download
          </button>
        </div>
      </div>

      <div className="preview-area">
        <div className="canvas-wrapper-scroll">
          <canvas ref={canvasRef} className="main-canvas" />
        </div>
      </div>

      <style>{`
        .editor-layout {
          display: flex;
          height: calc(100vh - 100px);
          min-height: 600px;
          gap: 20px;
        }

        .toolbar {
          width: 340px;
          background: var(--bg-panel);
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          padding: 20px;
          gap: 20px;
          overflow-y: auto;
        }

        .toolbar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }

        .toolbar-header h3 {
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 1.15rem;
        }

        .back-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.9rem;
        }
        .back-btn:hover { color: var(--text-main); }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .control-group label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .platform-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          color: var(--text-main);
          font-size: 0.95rem;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .platform-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
        }

        .dim-badge {
          font-size: 0.75rem;
          color: var(--text-muted);
          background: var(--bg-surface);
          padding: 3px 8px;
          border-radius: 6px;
          display: inline-block;
          width: fit-content;
        }

        .bg-mode-tabs {
          display: flex;
          gap: 4px;
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          padding: 4px;
        }

        .tab-btn {
          flex: 1;
          padding: 6px 0;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-btn.active {
          background: var(--primary);
          color: #fff;
          box-shadow: 0 2px 8px rgba(0, 102, 255, 0.25);
        }
        .tab-btn:hover:not(.active) { color: var(--text-main); }

        .color-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .color-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .color-dot.small { width: 26px; height: 26px; }
        .color-dot:hover { transform: scale(1.15); }
        .color-dot.active {
          box-shadow: 0 0 0 2px var(--bg-panel), 0 0 0 4px var(--primary);
          transform: scale(1.1);
        }
        .color-dot.gradient { border-radius: 50%; }

        .picker-mini {
          width: 32px;
          height: 32px;
          padding: 0;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 50%;
        }
        .picker-mini.small { width: 26px; height: 26px; }

        .slider-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-main);
        }
        .slider-row span { min-width: 50px; }
        .slider-row input[type="range"] { width: 60%; accent-color: var(--primary); }

        .text-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          color: var(--text-main);
          font-size: 1rem;
          font-weight: 700;
          transition: border-color 0.2s;
        }
        .text-input.sub { font-weight: 400; font-size: 0.9rem; }
        .text-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
        }
        .text-input::placeholder { color: var(--text-muted); opacity: 0.6; }

        .align-row {
          display: flex;
          gap: 4px;
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          padding: 4px;
          width: fit-content;
        }

        .align-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }
        .align-btn.active {
          background: var(--primary);
          color: #fff;
        }
        .align-btn:hover:not(.active) { color: var(--text-main); }

        .action-buttons {
          margin-top: auto;
          display: flex;
          gap: 12px;
        }

        .download-btn-primary {
          flex: 1;
          background: linear-gradient(135deg, #667eea, #764ba2);
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
          transition: all 0.3s;
        }
        .download-btn-primary:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .download-btn-secondary {
          flex: 1;
          background: var(--bg-surface);
          border: 1px solid var(--border-active);
          color: var(--text-main);
          padding: 14px;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .download-btn-secondary:hover { background: var(--bg-panel); }

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
          /* Checkered transparency pattern */
          background-image:
            linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
            linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
            linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
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
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          border-radius: 8px;
        }

        @media (max-width: 900px) {
          .editor-layout { flex-direction: column-reverse; height: auto; }
          .toolbar { width: 100%; height: auto; max-height: none; overflow: visible; }
          .preview-area { min-height: 350px; padding: 20px; }
        }
      `}</style>
    </div>
  );
};

export default SocialPreviewEditor;
