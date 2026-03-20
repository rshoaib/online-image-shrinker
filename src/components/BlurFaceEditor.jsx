'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Download, Eraser, Circle, Square, RefreshCw, ShieldCheck } from 'lucide-react';

const BlurFaceEditor = ({ file, onBack }) => {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const imgRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [brushSize, setBrushSize] = useState(40);
  const [blurMode, setBlurMode] = useState('blur'); // 'blur' | 'pixelate'
  const [intensity, setIntensity] = useState(18);
  const isDrawing = useRef(false);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Load image
  useEffect(() => {
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Draw base image on main canvas and set scale
  const drawBase = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const container = canvas.parentElement;
    const maxW = (container?.clientWidth || 800) - 40;
    const maxH = (container?.clientHeight || 600) - 40;
    const scale = Math.min(1, maxW / img.naturalWidth, maxH / img.naturalHeight);
    scaleRef.current = scale;

    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Sync overlay
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.width = canvas.width;
      overlay.height = canvas.height;
    }

    // Calculate canvas position offset relative to viewport for pointer math
    const rect = canvas.getBoundingClientRect();
    offsetRef.current = { x: rect.left, y: rect.top };
  }, []);

  useEffect(() => {
    if (imageLoaded) drawBase();
  }, [imageLoaded, drawBase]);

  useEffect(() => {
    const handleResize = () => { if (imageLoaded) drawBase(); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageLoaded, drawBase]);

  const applyBlurAt = useCallback((x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const r = brushSize / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();

    if (blurMode === 'blur') {
      ctx.filter = `blur(${intensity}px)`;
      // Draw the image multiple times to build up blur effect on already-painted spots
      for (let i = 0; i < 4; i++) {
        ctx.drawImage(canvas, 0, 0);
      }
      ctx.filter = 'none';
    } else {
      // Pixelate: sample from a downscaled version
      const px = Math.max(4, intensity);
      const sx = Math.max(0, x - r);
      const sy = Math.max(0, y - r);
      const sw = Math.min(canvas.width - sx, brushSize);
      const sh = Math.min(canvas.height - sy, brushSize);

      const small = document.createElement('canvas');
      small.width = Math.max(1, Math.round(sw / px));
      small.height = Math.max(1, Math.round(sh / px));
      small.getContext('2d').drawImage(canvas, sx, sy, sw, sh, 0, 0, small.width, small.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, small.width, small.height, sx, sy, sw, sh);
      ctx.imageSmoothingEnabled = true;
    }

    ctx.restore();
  }, [brushSize, blurMode, intensity]);

  const getCanvasPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handlePointerDown = (e) => {
    isDrawing.current = true;
    const pos = getCanvasPos(e);
    applyBlurAt(pos.x, pos.y);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    applyBlurAt(pos.x, pos.y);
  };

  const handlePointerUp = () => { isDrawing.current = false; };

  const handleReset = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    // Render at full resolution
    const offscreen = document.createElement('canvas');
    offscreen.width = img.naturalWidth;
    offscreen.height = img.naturalHeight;
    const ctx = offscreen.getContext('2d');

    // First draw the current canvas at full resolution using the edited (scaled) canvas
    ctx.drawImage(canvas, 0, 0, img.naturalWidth, img.naturalHeight);

    // Strip EXIF: canvas.toDataURL always strips EXIF — this is by design.
    const link = document.createElement('a');
    const baseName = file.name.replace(/\.[^.]+$/, '');
    link.download = `${baseName}-blurred.png`;
    link.href = offscreen.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="blur-editor">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Privacy Blur</h2>
        <div className="header-right">
          <span className="privacy-badge"><ShieldCheck size={14} /> 100% Private</span>
          <button className="primary-btn" onClick={handleDownload} disabled={!imageLoaded}>
            <Download size={18} /> Download
          </button>
        </div>
      </div>

      <div className="blur-workspace">
        <div className="sidebar-controls">
          <div className="control-section">
            <label className="section-label">Blur Mode</label>
            <div className="mode-toggle">
              <button
                className={blurMode === 'blur' ? 'active' : ''}
                onClick={() => setBlurMode('blur')}
              >
                <Circle size={16} /> Blur
              </button>
              <button
                className={blurMode === 'pixelate' ? 'active' : ''}
                onClick={() => setBlurMode('pixelate')}
              >
                <Square size={16} /> Pixelate
              </button>
            </div>
          </div>

          <div className="control-section">
            <label className="section-label">Brush Size: <strong>{brushSize}px</strong></label>
            <input
              type="range" min="10" max="150" value={brushSize}
              onChange={e => setBrushSize(Number(e.target.value))}
            />
            <div className="slider-labels"><span>Small</span><span>Large</span></div>
          </div>

          <div className="control-section">
            <label className="section-label">Intensity: <strong>{intensity}</strong></label>
            <input
              type="range" min="4" max="40" value={intensity}
              onChange={e => setIntensity(Number(e.target.value))}
            />
            <div className="slider-labels"><span>Subtle</span><span>Heavy</span></div>
          </div>

          <div className="control-section">
            <button className="reset-btn" onClick={handleReset}>
              <RefreshCw size={16} /> Reset Image
            </button>
          </div>

          <div className="privacy-note">
            <ShieldCheck size={16} />
            <div>
              <strong>Zero Uploads</strong>
              <p>Your image never leaves your device. EXIF metadata is automatically stripped on download.</p>
            </div>
          </div>

          <div className="usage-tip">
            <Eraser size={14} />
            <span>Paint over faces, license plates, or any sensitive information.</span>
          </div>
        </div>

        <div className="canvas-area">
          {!imageLoaded ? (
            <div className="empty-state">Loading image…</div>
          ) : (
            <div className="canvas-wrapper">
              <canvas
                ref={canvasRef}
                style={{ cursor: 'crosshair', touchAction: 'none', display: 'block', borderRadius: 6 }}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .blur-editor {
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
          z-index: 10;
          gap: 12px;
        }

        .editor-header h2 {
          font-size: 1.2rem;
          color: var(--text-main);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .privacy-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          color: #22c55e;
          font-weight: 600;
          background: rgba(34, 197, 94, 0.1);
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .back-btn:hover { color: var(--text-main); }

        .primary-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary);
          color: white;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .primary-btn:hover { opacity: 0.85; }
        .primary-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .blur-workspace {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .sidebar-controls {
          width: 260px;
          background: var(--bg-panel);
          border-right: 1px solid var(--border-light);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
        }

        .section-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          display: block;
          margin-bottom: 8px;
        }

        .section-label strong {
          color: var(--primary);
        }

        .control-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mode-toggle {
          display: flex;
          gap: 8px;
        }

        .mode-toggle button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 6px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
          background: var(--bg-surface);
          color: var(--text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .mode-toggle button.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .control-section input[type="range"] {
          width: 100%;
          accent-color: var(--primary);
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: var(--text-dim);
          margin-top: 2px;
        }

        .reset-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
          background: none;
          color: #ff6b6b;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .reset-btn:hover {
          background: rgba(255, 107, 107, 0.1);
          border-color: #ff6b6b;
        }

        .privacy-note {
          display: flex;
          gap: 10px;
          padding: 12px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 8px;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: auto;
        }
        .privacy-note svg { color: #22c55e; flex-shrink: 0; margin-top: 2px; }
        .privacy-note strong { display: block; color: #22c55e; margin-bottom: 2px; }
        .privacy-note p { margin: 0; line-height: 1.5; }

        .usage-tip {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--text-dim);
          line-height: 1.5;
        }
        .usage-tip svg { flex-shrink: 0; margin-top: 2px; }

        .canvas-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111;
          overflow: hidden;
          position: relative;
        }

        .canvas-wrapper {
          box-shadow: 0 4px 40px rgba(0, 0, 0, 0.6);
          border-radius: 8px;
          overflow: hidden;
          user-select: none;
        }

        .empty-state {
          color: var(--text-dim);
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .blur-workspace { flex-direction: column; }
          .sidebar-controls { width: 100%; flex-direction: row; flex-wrap: wrap; gap: 12px; border-right: none; border-bottom: 1px solid var(--border-light); }
          .control-section { min-width: 180px; flex: 1; }
          .privacy-note, .usage-tip { width: 100%; }
          .canvas-area { min-height: 300px; }
        }
      `}</style>
    </div>
  );
};

export default BlurFaceEditor;
