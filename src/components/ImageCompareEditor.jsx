import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeftRight, Download, Columns, Layers, SlidersHorizontal, ZoomIn, Upload, RotateCcw } from 'lucide-react';

const ImageCompareEditor = ({ file, onBack }) => {
  const [imageA, setImageA] = useState(null);
  const [imageB, setImageB] = useState(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState('slider'); // slider | side | overlay
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [zoom, setZoom] = useState(100);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Load first image from prop
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageA(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleSecondImage = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setImageB(url);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f);
      setImageB(url);
    }
  };

  const handleSwap = () => {
    setImageA(prev => {
      const oldA = prev;
      setImageB(oldB => {
        setImageA(oldB);
        return oldA;
      });
      return prev; // will be overridden by inner setImageA
    });
    // Simpler approach:
  };

  // Proper swap
  const doSwap = useCallback(() => {
    setImageA(a => {
      setImageB(b => {
        // Schedule in next tick to avoid race
        setTimeout(() => { setImageA(b); setImageB(a); }, 0);
        return b;
      });
      return a;
    });
  }, []);

  const swapImages = () => {
    const tmpA = imageA;
    const tmpB = imageB;
    setImageA(tmpB);
    setImageB(tmpA);
  };

  // Slider drag
  const startDrag = () => setIsDragging(true);
  const stopDrag = () => setIsDragging(false);

  const onMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(100, Math.max(0, pos)));
  }, [isDragging]);

  useEffect(() => {
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', stopDrag);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', stopDrag);
    };
  }, [onMove]);

  // Download side-by-side
  const handleDownload = useCallback(() => {
    if (!imageA || !imageB) return;
    const imgA = new Image();
    const imgB = new Image();
    let loaded = 0;

    const draw = () => {
      loaded++;
      if (loaded < 2) return;
      const canvas = document.createElement('canvas');
      const maxH = Math.max(imgA.height, imgB.height);
      canvas.width = imgA.width + imgB.width + 20;
      canvas.height = maxH;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgA, 0, (maxH - imgA.height) / 2);
      ctx.drawImage(imgB, imgA.width + 20, (maxH - imgB.height) / 2);
      const link = document.createElement('a');
      link.download = 'comparison.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    imgA.onload = draw;
    imgB.onload = draw;
    imgA.src = imageA;
    imgB.src = imageB;
  }, [imageA, imageB]);

  const bothLoaded = imageA && imageB;

  // Second image upload prompt
  if (!imageB) {
    return (
      <div className="compare-editor">
        <div className="compare-toolbar">
          <button onClick={onBack} className="toolbar-btn back">← Back</button>
          <h3>Image Comparison</h3>
          <div />
        </div>

        <div className="compare-upload-layout">
          <div className="preview-card loaded">
            <span className="card-label">Image A</span>
            {imageA && <img src={imageA} alt="Image A" loading="lazy" />}
          </div>

          <div className="arrow-divider">
            <ArrowLeftRight size={28} />
          </div>

          <div
            className="preview-card upload-target"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload size={40} />
            <p>Drop or click to add <strong>Image B</strong></p>
            <input
              type="file"
              accept="image/*"
              onChange={handleSecondImage}
              className="file-input-hidden"
            />
          </div>
        </div>

        <style>{compareStyles}</style>
      </div>
    );
  }

  // Comparison view
  return (
    <div className="compare-editor">
      <div className="compare-toolbar">
        <button onClick={onBack} className="toolbar-btn back">← Back</button>

        <div className="mode-switcher">
          <button
            className={`mode-btn ${viewMode === 'slider' ? 'active' : ''}`}
            onClick={() => setViewMode('slider')}
            title="Slider"
          >
            <SlidersHorizontal size={16} />
            <span>Slider</span>
          </button>
          <button
            className={`mode-btn ${viewMode === 'side' ? 'active' : ''}`}
            onClick={() => setViewMode('side')}
            title="Side by Side"
          >
            <Columns size={16} />
            <span>Side</span>
          </button>
          <button
            className={`mode-btn ${viewMode === 'overlay' ? 'active' : ''}`}
            onClick={() => setViewMode('overlay')}
            title="Overlay"
          >
            <Layers size={16} />
            <span>Overlay</span>
          </button>
        </div>

        <div className="toolbar-actions">
          <button onClick={swapImages} className="toolbar-btn" title="Swap Images">
            <RotateCcw size={16} /> Swap
          </button>
          <button onClick={handleDownload} className="toolbar-btn primary" title="Download Comparison">
            <Download size={16} /> Download
          </button>
        </div>
      </div>

      {/* Zoom control */}
      <div className="zoom-bar">
        <ZoomIn size={14} />
        <input
          type="range"
          min={50}
          max={200}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
        <span>{zoom}%</span>
      </div>

      {/* Overlay opacity control */}
      {viewMode === 'overlay' && (
        <div className="zoom-bar">
          <Layers size={14} />
          <input
            type="range"
            min={0}
            max={100}
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(Number(e.target.value))}
          />
          <span>Opacity {overlayOpacity}%</span>
        </div>
      )}

      {/* === SLIDER VIEW === */}
      {viewMode === 'slider' && (
        <div
          className="compare-viewport"
          ref={containerRef}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
        >
          <img src={imageB} alt="Image B" className="compare-img base" loading="lazy" />
          <div
            className="compare-overlay"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <img src={imageA} alt="Image A" className="compare-img" loading="lazy" />
          </div>

          <span className="img-label left">A</span>
          <span className="img-label right">B</span>

          <div className="slider-line" style={{ left: `${sliderPos}%` }}>
            <div className="slider-track" />
            <div className="slider-knob">
              <ArrowLeftRight size={14} />
            </div>
          </div>
        </div>
      )}

      {/* === SIDE VIEW === */}
      {viewMode === 'side' && (
        <div className="side-view" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}>
          <div className="side-panel">
            <span className="img-label-static">A</span>
            <img src={imageA} alt="Image A" loading="lazy" />
          </div>
          <div className="side-panel">
            <span className="img-label-static">B</span>
            <img src={imageB} alt="Image B" loading="lazy" />
          </div>
        </div>
      )}

      {/* === OVERLAY VIEW === */}
      {viewMode === 'overlay' && (
        <div className="overlay-view" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}>
          <img src={imageA} alt="Image A" className="compare-img" loading="lazy" />
          <img
            src={imageB}
            alt="Image B"
            className="compare-img overlay-img"
            style={{ opacity: overlayOpacity / 100 }}
          />
          <span className="img-label left">A (Base)</span>
          <span className="img-label right">B ({overlayOpacity}%)</span>
        </div>
      )}

      <style>{compareStyles}</style>
    </div>
  );
};

/* ─── Styles ─── */
const compareStyles = `
  .compare-editor {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    animation: editorFadeIn 0.4s ease-out;
  }

  @keyframes editorFadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Toolbar */
  .compare-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: var(--radius-lg, 16px);
    flex-wrap: wrap;
  }

  .compare-toolbar h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
  }

  .toolbar-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: var(--radius-md, 10px);
    background: rgba(255,255,255,0.8);
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.2s;
  }
  .toolbar-btn:hover {
    background: rgba(0,0,0,0.04);
    transform: translateY(-1px);
  }
  .toolbar-btn.primary {
    background: var(--primary, #0066ff);
    color: white;
    border-color: transparent;
  }
  .toolbar-btn.primary:hover {
    filter: brightness(1.1);
    background: var(--primary, #0066ff);
  }
  .toolbar-btn.back {
    background: none;
    border: none;
    color: var(--primary, #0066ff);
    font-weight: 600;
  }

  .toolbar-actions {
    display: flex;
    gap: 8px;
  }

  /* Mode Switcher */
  .mode-switcher {
    display: flex;
    gap: 2px;
    background: rgba(0,0,0,0.04);
    border-radius: var(--radius-md, 10px);
    padding: 3px;
  }

  .mode-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border: none;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted, #888);
    transition: all 0.25s;
  }
  .mode-btn.active {
    background: white;
    color: var(--primary, #0066ff);
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .mode-btn:hover:not(.active) {
    color: var(--text-main, #222);
  }

  /* Zoom bar */
  .zoom-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 16px;
    font-size: 0.8rem;
    color: var(--text-muted, #888);
  }
  .zoom-bar input[type="range"] {
    width: 120px;
    accent-color: var(--primary, #0066ff);
  }

  /* Upload layout (step 1) */
  .compare-upload-layout {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 60px 20px;
    flex-wrap: wrap;
  }

  .preview-card {
    width: 320px;
    height: 280px;
    border-radius: var(--radius-lg, 16px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
  }

  .preview-card.loaded {
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  }
  .preview-card.loaded img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }

  .preview-card.upload-target {
    background: rgba(0,102,255,0.03);
    border: 2px dashed rgba(0,102,255,0.25);
    cursor: pointer;
    color: var(--primary, #0066ff);
  }
  .preview-card.upload-target:hover {
    background: rgba(0,102,255,0.07);
    border-color: var(--primary, #0066ff);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,102,255,0.12);
  }
  .preview-card.upload-target p {
    font-size: 0.9rem;
    color: var(--text-muted, #888);
  }

  .file-input-hidden {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .card-label {
    position: absolute;
    top: 10px;
    left: 12px;
    background: rgba(0,0,0,0.5);
    color: white;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    backdrop-filter: blur(4px);
    z-index: 2;
  }

  .arrow-divider {
    color: var(--text-muted, #aaa);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.15); }
  }

  /* === SLIDER VIEWPORT === */
  .compare-viewport {
    position: relative;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: var(--radius-lg, 16px);
    cursor: col-resize;
    user-select: none;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    background: #f8f8f8;
    transition: transform 0.2s;
  }

  .compare-img {
    width: 100%;
    height: auto;
    display: block;
    pointer-events: none;
  }
  .compare-img.base {
    position: relative;
  }

  .compare-overlay {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
  }

  .img-label {
    position: absolute;
    top: 14px;
    padding: 4px 12px;
    border-radius: 6px;
    background: rgba(0,0,0,0.55);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    pointer-events: none;
    z-index: 5;
    backdrop-filter: blur(4px);
    letter-spacing: 0.5px;
  }
  .img-label.left { left: 14px; }
  .img-label.right { right: 14px; }

  .slider-line {
    position: absolute;
    top: 0; bottom: 0;
    width: 3px;
    transform: translateX(-50%);
    z-index: 10;
    pointer-events: none;
  }

  .slider-track {
    width: 3px;
    height: 100%;
    background: white;
    box-shadow: 0 0 10px rgba(0,0,0,0.4);
  }

  .slider-knob {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 34px;
    height: 34px;
    background: var(--primary, #0066ff);
    border: 3px solid white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
    pointer-events: none;
  }

  /* === SIDE VIEW === */
  .side-view {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    transition: transform 0.2s;
  }
  .side-panel {
    position: relative;
    flex: 1;
    min-width: 280px;
    max-width: 440px;
    border-radius: var(--radius-lg, 16px);
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
    background: #f8f8f8;
  }
  .side-panel img {
    width: 100%;
    height: auto;
    display: block;
  }
  .img-label-static {
    position: absolute;
    top: 10px;
    left: 12px;
    background: rgba(0,0,0,0.55);
    color: white;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    z-index: 2;
    backdrop-filter: blur(4px);
  }

  /* === OVERLAY VIEW === */
  .overlay-view {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
    border-radius: var(--radius-lg, 16px);
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    background: #f8f8f8;
    transition: transform 0.2s;
  }
  .overlay-view .compare-img {
    width: 100%;
    display: block;
  }
  .overlay-img {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    transition: opacity 0.15s;
  }

  /* Responsive */
  @media (max-width: 700px) {
    .compare-toolbar {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
    }
    .mode-switcher { justify-content: center; }
    .toolbar-actions { justify-content: center; }
    .compare-upload-layout { flex-direction: column; gap: 20px; }
    .preview-card { width: 100%; max-width: 320px; }
  }
`;

export default ImageCompareEditor;
