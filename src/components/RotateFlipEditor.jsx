'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Download, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, RefreshCw } from 'lucide-react';

const RotateFlipEditor = ({ file, onBack }) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [customAngle, setCustomAngle] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  // Load image once
  useEffect(() => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
    };
    img.src = URL.createObjectURL(file);
    return () => URL.revokeObjectURL(img.src);
  }, [file]);

  // Render to canvas whenever transforms change
  const renderCanvas = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const totalAngle = rotation + customAngle;
    const radians = (totalAngle * Math.PI) / 180;
    const absSin = Math.abs(Math.sin(radians));
    const absCos = Math.abs(Math.cos(radians));

    // Calculate bounding box for the rotated image
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const newW = Math.ceil(w * absCos + h * absSin);
    const newH = Math.ceil(w * absSin + h * absCos);

    // Scale to fit the container (max ~600px display)
    const container = canvas.parentElement;
    const maxW = container ? container.clientWidth - 40 : 600;
    const maxH = container ? container.clientHeight - 40 : 500;
    const scale = Math.min(1, maxW / newW, maxH / newH);

    canvas.width = Math.round(newW * scale);
    canvas.height = Math.round(newH * scale);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(radians);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, (-w * scale) / 2, (-h * scale) / 2, w * scale, h * scale);
    ctx.restore();
  }, [rotation, customAngle, flipH, flipV]);

  useEffect(() => {
    if (imageLoaded) renderCanvas();
  }, [imageLoaded, renderCanvas]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => { if (imageLoaded) renderCanvas(); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageLoaded, renderCanvas]);

  const handleRotateLeft = () => setRotation(r => r - 90);
  const handleRotateRight = () => setRotation(r => r + 90);
  const handleRotate180 = () => setRotation(r => r + 180);
  const handleFlipH = () => setFlipH(f => !f);
  const handleFlipV = () => setFlipV(f => !f);
  const handleReset = () => {
    setRotation(0);
    setCustomAngle(0);
    setFlipH(false);
    setFlipV(false);
  };

  const handleDownload = () => {
    const img = imgRef.current;
    if (!img) return;

    const totalAngle = rotation + customAngle;
    const radians = (totalAngle * Math.PI) / 180;
    const absSin = Math.abs(Math.sin(radians));
    const absCos = Math.abs(Math.cos(radians));

    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const newW = Math.ceil(w * absCos + h * absSin);
    const newH = Math.ceil(w * absSin + h * absCos);

    // Render at full resolution
    const offscreen = document.createElement('canvas');
    offscreen.width = newW;
    offscreen.height = newH;
    const ctx = offscreen.getContext('2d');
    ctx.translate(newW / 2, newH / 2);
    ctx.rotate(radians);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);

    const link = document.createElement('a');
    link.download = `rotated-${file.name}`;
    link.href = offscreen.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAngle = ((rotation + customAngle) % 360 + 360) % 360;

  return (
    <div className="rotate-editor">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Rotate &amp; Flip</h2>
        <button className="primary-btn" onClick={handleDownload}>
          <Download size={18} /> Download
        </button>
      </div>

      <div className="rotate-workspace">
        <div className="sidebar-presets">
          <h3>Quick Rotate</h3>
          <button onClick={handleRotateLeft}>
            <RotateCcw size={18} /> Rotate Left 90°
          </button>
          <button onClick={handleRotateRight}>
            <RotateCw size={18} /> Rotate Right 90°
          </button>
          <button onClick={handleRotate180}>
            <RefreshCw size={18} /> Rotate 180°
          </button>

          <div className="angle-control">
            <label>Custom Angle: <strong>{customAngle}°</strong></label>
            <input
              type="range"
              min={-180}
              max={180}
              value={customAngle}
              step={1}
              onChange={e => setCustomAngle(Number(e.target.value))}
            />
          </div>

          <h3>Flip</h3>
          <button onClick={handleFlipH} className={flipH ? 'active' : ''}>
            <FlipHorizontal size={18} /> Flip Horizontal
          </button>
          <button onClick={handleFlipV} className={flipV ? 'active' : ''}>
            <FlipVertical size={18} /> Flip Vertical
          </button>

          <div className="divider" />
          <button onClick={handleReset} className="reset-btn">
            <RefreshCw size={16} /> Reset All
          </button>

          <div className="angle-badge">
            Total: <strong>{totalAngle}°</strong>
            {flipH && ' · H'}
            {flipV && ' · V'}
          </div>
        </div>

        <div className="canvas-area">
          <div className="checkerboard">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>

      <style>{`
        .rotate-editor {
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
          z-index: 10;
          background: var(--bg-surface);
        }

        .editor-header h2 {
          font-size: 1.2rem;
          color: var(--text-main);
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
          color: black;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .primary-btn:hover { opacity: 0.85; }

        .rotate-workspace {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .sidebar-presets {
          width: 260px;
          background: var(--bg-panel);
          border-right: 1px solid var(--border-light);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 10;
          overflow-y: auto;
        }

        .sidebar-presets h3 {
          font-size: 0.85rem;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          margin-top: 10px;
        }

        .sidebar-presets button {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          transition: all 0.2s;
          border: 1px solid transparent;
          background: none;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .sidebar-presets button:hover {
          background: var(--bg-surface);
          color: var(--text-main);
        }

        .sidebar-presets button.active {
          background: rgba(0, 240, 255, 0.1);
          color: var(--primary);
          border-color: var(--primary);
        }

        .reset-btn {
          color: #ff6b6b !important;
        }
        .reset-btn:hover {
          background: rgba(255, 107, 107, 0.1) !important;
          color: #ff4444 !important;
        }

        .angle-control {
          padding: 14px 0 8px;
          border-top: 1px solid var(--border-light);
        }

        .angle-control label {
          font-size: 0.85rem;
          color: var(--text-muted);
          display: block;
          margin-bottom: 8px;
        }

        .angle-control strong {
          color: var(--primary);
        }

        .angle-control input[type="range"] {
          width: 100%;
          accent-color: var(--primary);
        }

        .divider {
          height: 1px;
          background: var(--border-light);
          margin: 6px 0;
        }

        .angle-badge {
          margin-top: auto;
          padding: 10px 12px;
          background: var(--bg-surface);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          color: var(--text-muted);
          text-align: center;
          border: 1px solid var(--border-light);
        }

        .angle-badge strong {
          color: var(--primary);
          font-size: 1.1rem;
        }

        .canvas-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111;
          position: relative;
          overflow: hidden;
        }

        .checkerboard {
          background-image:
            linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
            linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
            linear-gradient(-45deg, transparent 75%, #1a1a1a 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0;
          background-color: #222;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .checkerboard canvas {
          display: block;
          border-radius: 4px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 768px) {
          .rotate-workspace {
            flex-direction: column;
          }
          .sidebar-presets {
            width: 100%;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 8px;
            padding: 12px;
            border-right: none;
            border-bottom: 1px solid var(--border-light);
          }
          .sidebar-presets h3 {
            width: 100%;
            margin: 0;
          }
          .angle-control {
            width: 100%;
          }
          .angle-badge {
            margin-top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RotateFlipEditor;
