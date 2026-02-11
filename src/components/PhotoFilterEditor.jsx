import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Download, RotateCcw, Sparkles, SlidersHorizontal } from 'lucide-react';

const PRESETS = [
  { name: 'Original', icon: '○', adjustments: { brightness: 0, contrast: 0, saturation: 0, temperature: 0, sharpness: 0, vignette: 0 } },
  { name: 'Vivid', icon: '🌈', adjustments: { brightness: 5, contrast: 15, saturation: 40, temperature: 5, sharpness: 10, vignette: 0 } },
  { name: 'Warm', icon: '☀️', adjustments: { brightness: 8, contrast: 5, saturation: 10, temperature: 35, sharpness: 0, vignette: 10 } },
  { name: 'Cool', icon: '❄️', adjustments: { brightness: 5, contrast: 10, saturation: -5, temperature: -30, sharpness: 0, vignette: 10 } },
  { name: 'B&W', icon: '◑', adjustments: { brightness: 5, contrast: 20, saturation: -100, temperature: 0, sharpness: 10, vignette: 15 } },
  { name: 'Vintage', icon: '📷', adjustments: { brightness: -5, contrast: -10, saturation: -25, temperature: 15, sharpness: 0, vignette: 30 } },
  { name: 'Dramatic', icon: '🎭', adjustments: { brightness: -10, contrast: 40, saturation: -15, temperature: 0, sharpness: 20, vignette: 35 } },
  { name: 'Fade', icon: '🌫️', adjustments: { brightness: 15, contrast: -20, saturation: -20, temperature: 5, sharpness: 0, vignette: 0 } },
  { name: 'Cinematic', icon: '🎬', adjustments: { brightness: -5, contrast: 25, saturation: -10, temperature: -10, sharpness: 5, vignette: 40 } },
  { name: 'Sepia', icon: '🟤', adjustments: { brightness: 0, contrast: 5, saturation: -60, temperature: 40, sharpness: 0, vignette: 20 } },
];

const DEFAULT_ADJUSTMENTS = { brightness: 0, contrast: 0, saturation: 0, temperature: 0, sharpness: 0, vignette: 0 };

const SLIDERS = [
  { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
  { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
  { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
  { key: 'temperature', label: 'Temperature', min: -100, max: 100 },
  { key: 'sharpness', label: 'Sharpness', min: 0, max: 100 },
  { key: 'vignette', label: 'Vignette', min: 0, max: 100 },
];

const PhotoFilterEditor = ({ file, onBack }) => {
  const [adjustments, setAdjustments] = useState({ ...DEFAULT_ADJUSTMENTS });
  const [activePreset, setActivePreset] = useState('Original');
  const [originalImage, setOriginalImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [thumbnails, setThumbnails] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  // Load original image
  useEffect(() => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      setOriginalImage(img);
      setPreviewUrl(URL.createObjectURL(file));
    };
    img.src = URL.createObjectURL(file);
    return () => { if (img.src) URL.revokeObjectURL(img.src); };
  }, [file]);

  // Generate preset thumbnails
  useEffect(() => {
    if (!originalImage) return;
    const thumbSize = 60;
    const aspect = originalImage.width / originalImage.height;
    const tw = aspect >= 1 ? thumbSize : Math.round(thumbSize * aspect);
    const th = aspect >= 1 ? Math.round(thumbSize / aspect) : thumbSize;

    const newThumbs = {};
    PRESETS.forEach(preset => {
      const tc = document.createElement('canvas');
      tc.width = tw;
      tc.height = th;
      const tctx = tc.getContext('2d');
      tctx.drawImage(originalImage, 0, 0, tw, th);
      applyFilters(tctx, tw, th, preset.adjustments);
      newThumbs[preset.name] = tc.toDataURL('image/jpeg', 0.6);
    });
    setThumbnails(newThumbs);
  }, [originalImage]);

  // Debounced filter application
  useEffect(() => {
    if (!originalImage || !canvasRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    setIsProcessing(true);

    timerRef.current = setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Limit preview to max 1200px for performance
      const maxDim = 1200;
      let w = originalImage.width;
      let h = originalImage.height;
      if (w > maxDim || h > maxDim) {
        const scale = maxDim / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(originalImage, 0, 0, w, h);
      applyFilters(ctx, w, h, adjustments);
      setIsProcessing(false);
    }, 150);

  }, [adjustments, originalImage]);

  const handleSliderChange = (key, value) => {
    setAdjustments(prev => ({ ...prev, [key]: Number(value) }));
    setActivePreset('');
  };

  const handlePreset = (preset) => {
    setAdjustments({ ...preset.adjustments });
    setActivePreset(preset.name);
  };

  const handleReset = () => {
    setAdjustments({ ...DEFAULT_ADJUSTMENTS });
    setActivePreset('Original');
  };

  const handleDownload = useCallback(() => {
    if (!originalImage) return;
    // Render at full resolution for download
    const canvas = document.createElement('canvas');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0);
    applyFilters(ctx, originalImage.width, originalImage.height, adjustments);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const ext = file.name.split('.').pop() || 'jpg';
      link.download = `filtered-${file.name.replace(`.${ext}`, '')}.${ext === 'png' ? 'png' : 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.95);
  }, [originalImage, adjustments, file]);

  return (
    <div className="pfe-container">
      <div className="pfe-header">
        <button onClick={onBack} className="pfe-back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="pfe-file-info">
          <Sparkles size={16} />
          <span>{file?.name}</span>
        </div>
        <div className="pfe-header-actions">
          <button onClick={handleReset} className="pfe-reset-btn" title="Reset all filters">
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={handleDownload} className="pfe-download-btn" disabled={!originalImage}>
            <Download size={16} /> Download
          </button>
        </div>
      </div>

      <div className="pfe-workspace">
        {/* Preview Area */}
        <div className="pfe-preview-area">
          {originalImage ? (
            <div className="pfe-canvas-wrapper">
              <canvas ref={canvasRef} className="pfe-canvas" />
              {isProcessing && (
                <div className="pfe-processing">
                  <div className="pfe-spinner" />
                </div>
              )}
            </div>
          ) : (
            <div className="pfe-loading">Loading image...</div>
          )}
        </div>

        {/* Sidebar */}
        <div className="pfe-sidebar">
          {/* Presets */}
          <div className="pfe-section">
            <h3 className="pfe-section-title">
              <Sparkles size={14} /> Presets
            </h3>
            <div className="pfe-presets-grid">
              {PRESETS.map(preset => (
                <button
                  key={preset.name}
                  className={`pfe-preset-btn ${activePreset === preset.name ? 'active' : ''}`}
                  onClick={() => handlePreset(preset)}
                >
                  <div className="pfe-preset-thumb">
                    {thumbnails[preset.name] ? (
                      <img src={thumbnails[preset.name]} alt={preset.name} />
                    ) : (
                      <span className="pfe-preset-icon">{preset.icon}</span>
                    )}
                  </div>
                  <span className="pfe-preset-label">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="pfe-section">
            <h3 className="pfe-section-title">
              <SlidersHorizontal size={14} /> Adjustments
            </h3>
            <div className="pfe-sliders">
              {SLIDERS.map(slider => (
                <div key={slider.key} className="pfe-slider-row">
                  <div className="pfe-slider-header">
                    <label>{slider.label}</label>
                    <span className="pfe-slider-value">{adjustments[slider.key]}</span>
                  </div>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    value={adjustments[slider.key]}
                    onChange={(e) => handleSliderChange(slider.key, e.target.value)}
                    className="pfe-range"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .pfe-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 160px);
          background: var(--bg-app);
        }

        .pfe-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--spacing-md);
          height: 60px;
          border-bottom: 1px solid var(--border-light);
          flex-shrink: 0;
        }

        .pfe-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-weight: 500;
          transition: 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .pfe-back-btn:hover { color: var(--text-main); }

        .pfe-file-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-main);
          font-size: 0.9rem;
        }

        .pfe-header-actions {
          display: flex;
          gap: 10px;
        }

        .pfe-reset-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          background: var(--bg-surface);
          color: var(--text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pfe-reset-btn:hover {
          color: var(--text-main);
          border-color: var(--text-muted);
        }

        .pfe-download-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 20px;
          border-radius: var(--radius-md);
          border: none;
          background: linear-gradient(135deg, #0066ff, #0044cc);
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 2px 10px rgba(0, 102, 255, 0.3);
        }
        .pfe-download-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0, 102, 255, 0.4);
        }
        .pfe-download-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .pfe-workspace {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .pfe-preview-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f0f10;
          background-image: radial-gradient(var(--border-light) 1px, transparent 1px);
          background-size: 20px 20px;
          padding: var(--spacing-xl);
          overflow: hidden;
          position: relative;
        }

        .pfe-canvas-wrapper {
          position: relative;
          max-width: 100%;
          max-height: 100%;
          border-radius: var(--radius-sm);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          overflow: hidden;
        }

        .pfe-canvas {
          display: block;
          max-width: 100%;
          max-height: calc(100vh - 240px);
          object-fit: contain;
        }

        .pfe-processing {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pfe-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: pfeSpin 0.6s linear infinite;
        }
        @keyframes pfeSpin {
          to { transform: rotate(360deg); }
        }

        .pfe-loading {
          color: var(--text-dim);
          font-size: 1rem;
        }

        .pfe-sidebar {
          width: 320px;
          flex-shrink: 0;
          border-left: 1px solid var(--border-light);
          background: var(--bg-panel);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .pfe-section {
          padding: 20px;
          border-bottom: 1px solid var(--border-light);
        }

        .pfe-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
          margin-bottom: 16px;
          font-weight: 600;
        }

        .pfe-presets-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .pfe-preset-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 4px;
          border: 2px solid transparent;
          border-radius: var(--radius-md);
          background: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pfe-preset-btn:hover {
          background: var(--bg-surface);
        }

        .pfe-preset-btn.active {
          border-color: var(--primary);
          background: rgba(0, 102, 255, 0.08);
        }

        .pfe-preset-thumb {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: var(--bg-surface);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pfe-preset-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pfe-preset-icon {
          font-size: 1.2rem;
        }

        .pfe-preset-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 50px;
        }

        .pfe-preset-btn.active .pfe-preset-label {
          color: var(--primary);
          font-weight: 600;
        }

        .pfe-sliders {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pfe-slider-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pfe-slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pfe-slider-header label {
          font-size: 0.85rem;
          color: var(--text-main);
          font-weight: 500;
        }

        .pfe-slider-value {
          font-size: 0.8rem;
          color: var(--text-muted);
          background: var(--bg-surface);
          padding: 1px 8px;
          border-radius: var(--radius-sm);
          min-width: 36px;
          text-align: center;
          font-variant-numeric: tabular-nums;
        }

        .pfe-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          background: var(--bg-surface);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }

        .pfe-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          transition: transform 0.15s;
        }

        .pfe-range::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .pfe-range::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }

        @media (max-width: 768px) {
          .pfe-workspace {
            flex-direction: column;
            overflow-y: auto;
          }
          .pfe-sidebar {
            width: 100%;
            height: auto;
          }
          .pfe-preview-area {
            min-height: 300px;
          }
          .pfe-container {
            height: auto;
          }
          .pfe-presets-grid {
            grid-template-columns: repeat(5, 1fr);
          }
          .pfe-header {
            flex-wrap: wrap;
            height: auto;
            padding: 10px;
            gap: 10px;
          }
          .pfe-file-info {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

// ── Pure Canvas filter pipeline ──────────────────────────
function applyFilters(ctx, w, h, adj) {
  // Step 1: CSS Filters (brightness, contrast, saturate)
  // We need to re-draw with CSS filters, so save current image first
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(ctx.canvas, 0, 0);

  // Build CSS filter string
  const brightness = 1 + adj.brightness / 100;
  const contrast = 1 + adj.contrast / 100;
  const saturate = 1 + adj.saturation / 100;

  ctx.clearRect(0, 0, w, h);
  ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturate})`;
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.filter = 'none';

  // Step 2: Pixel-level manipulation for temperature, sharpness, vignette
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Temperature (shift red/blue channels)
  if (adj.temperature !== 0) {
    const tempShift = adj.temperature * 0.8;
    for (let i = 0; i < data.length; i += 4) {
      data[i]     = clamp(data[i] + tempShift);       // R
      data[i + 2] = clamp(data[i + 2] - tempShift);   // B
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Step 3: Sharpness (unsharp mask approximation)
  if (adj.sharpness > 0) {
    applySharpen(ctx, w, h, adj.sharpness / 100);
  }

  // Step 4: Vignette
  if (adj.vignette > 0) {
    applyVignette(ctx, w, h, adj.vignette / 100);
  }
}

function clamp(val) {
  return Math.max(0, Math.min(255, Math.round(val)));
}

function applySharpen(ctx, w, h, amount) {
  const strength = amount * 0.6;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const copy = new Uint8ClampedArray(data);

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const center = copy[idx + c] * (1 + 4 * strength);
        const neighbors = (
          copy[((y - 1) * w + x) * 4 + c] +
          copy[((y + 1) * w + x) * 4 + c] +
          copy[(y * w + x - 1) * 4 + c] +
          copy[(y * w + x + 1) * 4 + c]
        ) * strength;
        data[idx + c] = clamp(center - neighbors);
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyVignette(ctx, w, h, amount) {
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);
  const gradient = ctx.createRadialGradient(cx, cy, maxR * (0.5 - amount * 0.2), cx, cy, maxR);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, `rgba(0,0,0,${0.3 + amount * 0.5})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

export default PhotoFilterEditor;
