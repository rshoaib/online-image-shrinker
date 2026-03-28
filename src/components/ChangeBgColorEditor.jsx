'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { Download, ArrowLeft, AlertCircle, Check, Upload, Image as ImageIcon } from 'lucide-react';

const SOLID_COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#E53E3E' },
  { name: 'Blue', value: '#3182CE' },
  { name: 'Green', value: '#38A169' },
  { name: 'Yellow', value: '#ECC94B' },
  { name: 'Pink', value: '#ED64A6' },
  { name: 'Purple', value: '#805AD5' },
  { name: 'Orange', value: '#DD6B20' },
  { name: 'Teal', value: '#319795' },
  { name: 'Gray', value: '#A0AEC0' },
  { name: 'Navy', value: '#1A365D' },
];

const GRADIENT_PRESETS = [
  { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Pastel', value: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
  { name: 'Warm', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: 'Berry', value: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)' },
  { name: 'Night', value: 'linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)' },
  { name: 'Rose', value: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
];

const ChangeBgColorEditor = ({ file, onBack }) => {
  const [originalUrl, setOriginalUrl] = useState(null);
  const [foregroundBlob, setForegroundBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('Initializing AI Model...');
  const [error, setError] = useState(null);

  const [bgMode, setBgMode] = useState('solid'); // solid | gradient | image
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [customColor, setCustomColor] = useState('#4A90D9');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0].value);
  const [bgImageUrl, setBgImageUrl] = useState(null);
  const [bgImageFile, setBgImageFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('png');

  const canvasRef = useRef(null);
  const fgImageRef = useRef(null);
  const bgImageObjRef = useRef(null);

  // Step 1: Process image — remove background
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      processImage(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const processImage = async (imageUrl) => {
    setIsProcessing(true);
    setError(null);
    setForegroundBlob(null);

    try {
      const blob = await removeBackground(imageUrl, {
        progress: (key, current, total) => {
          const pct = Math.round((current / total) * 100);
          if (key === 'compute:inference') {
            setProgress(`Removing background: ${pct}%`);
          } else {
            setProgress(`Downloading AI Model: ${pct}%`);
          }
        }
      });

      setForegroundBlob(blob);

      // Load the foreground image for canvas compositing
      const fgUrl = URL.createObjectURL(blob);
      const img = new window.Image();
      img.onload = () => {
        fgImageRef.current = img;
        renderComposite();
      };
      img.src = fgUrl;
    } catch (err) {
      console.error(err);
      setError('Failed to remove background. Please try a different image.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Load background image when user uploads one
  useEffect(() => {
    if (bgImageFile) {
      const url = URL.createObjectURL(bgImageFile);
      setBgImageUrl(url);
      const img = new window.Image();
      img.onload = () => {
        bgImageObjRef.current = img;
        renderComposite();
      };
      img.src = url;
      return () => URL.revokeObjectURL(url);
    }
  }, [bgImageFile]);

  // Re-render composite whenever settings change
  useEffect(() => {
    renderComposite();
  }, [bgMode, selectedColor, customColor, selectedGradient, bgImageUrl]);

  const parseGradient = (gradientStr) => {
    const match = gradientStr.match(/linear-gradient\((\d+)deg,\s*(#\w+)\s+\d+%,\s*(#\w+)\s+\d+%\)/);
    if (match) {
      return { angle: parseInt(match[1]), color1: match[2], color2: match[3] };
    }
    return { angle: 135, color1: '#667eea', color2: '#764ba2' };
  };

  const renderComposite = useCallback(() => {
    const canvas = canvasRef.current;
    const fg = fgImageRef.current;
    if (!canvas || !fg) return;

    const w = fg.naturalWidth;
    const h = fg.naturalHeight;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');

    // Draw background
    if (bgMode === 'solid') {
      const color = selectedColor === 'custom' ? customColor : selectedColor;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, w, h);
    } else if (bgMode === 'gradient') {
      const { angle, color1, color2 } = parseGradient(selectedGradient);
      const rad = (angle * Math.PI) / 180;
      const x1 = w / 2 - (Math.cos(rad) * w) / 2;
      const y1 = h / 2 - (Math.sin(rad) * h) / 2;
      const x2 = w / 2 + (Math.cos(rad) * w) / 2;
      const y2 = h / 2 + (Math.sin(rad) * h) / 2;
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    } else if (bgMode === 'image' && bgImageObjRef.current) {
      // Cover fill — scale background image to cover the canvas
      const bgImg = bgImageObjRef.current;
      const scale = Math.max(w / bgImg.naturalWidth, h / bgImg.naturalHeight);
      const sw = bgImg.naturalWidth * scale;
      const sh = bgImg.naturalHeight * scale;
      ctx.drawImage(bgImg, (w - sw) / 2, (h - sh) / 2, sw, sh);
    } else {
      // Fallback — white
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
    }

    // Draw foreground (subject)
    ctx.drawImage(fg, 0, 0, w, h);
  }, [bgMode, selectedColor, customColor, selectedGradient, bgImageUrl]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mimeType = outputFormat === 'jpg' ? 'image/jpeg' : 'image/png';
    const ext = outputFormat === 'jpg' ? 'jpg' : 'png';

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `changed-bg-${file.name.split('.')[0]}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, mimeType, 0.92);
  };

  const handleBgImageUpload = (e) => {
    const f = e.target.files[0];
    if (f && f.type.startsWith('image/')) {
      setBgImageFile(f);
      setBgMode('image');
    }
  };

  const activeBgColor = selectedColor === 'custom' ? customColor : selectedColor;

  return (
    <div className="cbg-editor">
      <div className="cbg-header">
        <button onClick={onBack} className="cbg-back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Change Background</h2>
        <div className="cbg-format-toggle">
          <button
            className={`fmt-btn ${outputFormat === 'png' ? 'active' : ''}`}
            onClick={() => setOutputFormat('png')}
          >PNG</button>
          <button
            className={`fmt-btn ${outputFormat === 'jpg' ? 'active' : ''}`}
            onClick={() => setOutputFormat('jpg')}
          >JPG</button>
        </div>
      </div>

      <div className="cbg-body">
        {/* Sidebar */}
        <div className="cbg-sidebar">
          {/* Mode Tabs */}
          <div className="cbg-mode-tabs">
            <button
              className={`mode-tab ${bgMode === 'solid' ? 'active' : ''}`}
              onClick={() => setBgMode('solid')}
            >Solid</button>
            <button
              className={`mode-tab ${bgMode === 'gradient' ? 'active' : ''}`}
              onClick={() => setBgMode('gradient')}
            >Gradient</button>
            <button
              className={`mode-tab ${bgMode === 'image' ? 'active' : ''}`}
              onClick={() => setBgMode('image')}
            >Image</button>
          </div>

          {/* Solid Color Picker */}
          {bgMode === 'solid' && (
            <div className="cbg-colors-section">
              <p className="cbg-section-label">Pick a color</p>
              <div className="cbg-color-grid">
                {SOLID_COLORS.map((c) => (
                  <button
                    key={c.value}
                    className={`cbg-color-swatch ${selectedColor === c.value ? 'selected' : ''}`}
                    style={{ background: c.value, border: c.value === '#FFFFFF' ? '1px solid var(--border-light)' : 'none' }}
                    onClick={() => setSelectedColor(c.value)}
                    title={c.name}
                  >
                    {selectedColor === c.value && <Check size={14} color={c.value === '#FFFFFF' || c.value === '#ECC94B' ? '#333' : '#fff'} />}
                  </button>
                ))}
              </div>
              <div className="cbg-custom-color">
                <label>Custom Color</label>
                <div className="cbg-custom-row">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setSelectedColor('custom');
                    }}
                    className="cbg-color-input"
                  />
                  <input
                    type="text"
                    value={selectedColor === 'custom' ? customColor : selectedColor}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) {
                        setCustomColor(v);
                        setSelectedColor('custom');
                      }
                    }}
                    className="cbg-hex-input"
                    placeholder="#4A90D9"
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Gradient Presets */}
          {bgMode === 'gradient' && (
            <div className="cbg-colors-section">
              <p className="cbg-section-label">Choose a gradient</p>
              <div className="cbg-gradient-grid">
                {GRADIENT_PRESETS.map((g) => (
                  <button
                    key={g.name}
                    className={`cbg-gradient-swatch ${selectedGradient === g.value ? 'selected' : ''}`}
                    style={{ background: g.value }}
                    onClick={() => setSelectedGradient(g.value)}
                    title={g.name}
                  >
                    {selectedGradient === g.value && <Check size={14} color="#fff" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          {bgMode === 'image' && (
            <div className="cbg-colors-section">
              <p className="cbg-section-label">Upload background image</p>
              <label className="cbg-upload-btn">
                <Upload size={18} />
                <span>{bgImageFile ? 'Change Image' : 'Choose Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBgImageUpload}
                  hidden
                />
              </label>
              {bgImageUrl && (
                <div className="cbg-bg-preview">
                  <img src={bgImageUrl} alt="Background preview" />
                </div>
              )}
            </div>
          )}

          {/* Download button (sidebar — mobile-friendly duplicate) */}
          <button
            className="cbg-download-btn"
            disabled={!foregroundBlob || isProcessing}
            onClick={handleDownload}
          >
            <Download size={18} />
            Download {outputFormat.toUpperCase()}
          </button>
        </div>

        {/* Workspace / Canvas Preview */}
        <div className="cbg-workspace">
          {error ? (
            <div className="cbg-error">
              <AlertCircle size={48} color="var(--error)" />
              <p>{error}</p>
              <button onClick={() => processImage(originalUrl)} className="cbg-retry-btn">Try Again</button>
            </div>
          ) : isProcessing ? (
            <div className="cbg-processing">
              <div className="cbg-spinner" />
              <p>{progress}</p>
              <p className="cbg-processing-sub">This may take a moment on first use</p>
            </div>
          ) : foregroundBlob ? (
            <div className="cbg-canvas-wrapper">
              <canvas ref={canvasRef} className="cbg-canvas" />
            </div>
          ) : (
            <div className="cbg-processing">
              <ImageIcon size={48} color="var(--text-dim)" />
              <p>Preparing your image...</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cbg-editor {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 16px;
          animation: fadeIn 0.3s ease-out;
        }

        .cbg-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cbg-header h2 {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .cbg-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.95rem;
          padding: 6px 0;
        }
        .cbg-back-btn:hover { color: var(--text-main); }

        .cbg-format-toggle {
          margin-left: auto;
          display: flex;
          background: var(--bg-surface);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
          overflow: hidden;
        }

        .fmt-btn {
          padding: 6px 14px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .fmt-btn.active {
          background: var(--primary);
          color: white;
        }

        .cbg-body {
          display: flex;
          gap: 16px;
          flex: 1;
          min-height: 0;
        }

        /* Sidebar */
        .cbg-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: var(--bg-panel);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
        }

        .cbg-mode-tabs {
          display: flex;
          background: var(--bg-surface);
          border-radius: var(--radius-sm);
          padding: 3px;
          gap: 2px;
        }

        .mode-tab {
          flex: 1;
          padding: 7px 0;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: calc(var(--radius-sm) - 2px);
          cursor: pointer;
          transition: all 0.15s;
        }
        .mode-tab.active {
          background: var(--bg-panel);
          color: var(--text-main);
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        .cbg-section-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-bottom: 4px;
        }

        .cbg-color-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .cbg-color-swatch {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          position: relative;
        }
        .cbg-color-swatch:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .cbg-color-swatch.selected {
          outline: 2.5px solid var(--primary);
          outline-offset: 2px;
        }

        .cbg-custom-color {
          margin-top: 8px;
        }
        .cbg-custom-color label {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 500;
          display: block;
          margin-bottom: 6px;
        }
        .cbg-custom-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .cbg-color-input {
          width: 40px;
          height: 36px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          cursor: pointer;
          padding: 2px;
          background: var(--bg-surface);
        }
        .cbg-hex-input {
          flex: 1;
          padding: 8px 10px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          background: var(--bg-surface);
          color: var(--text-main);
          font-family: monospace;
          font-size: 0.85rem;
        }
        .cbg-hex-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        /* Gradient Grid */
        .cbg-gradient-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .cbg-gradient-swatch {
          width: 100%;
          height: 56px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .cbg-gradient-swatch:hover {
          transform: scale(1.04);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .cbg-gradient-swatch.selected {
          outline: 2.5px solid var(--primary);
          outline-offset: 2px;
        }

        /* Image Upload */
        .cbg-upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          width: 100%;
          border: 2px dashed var(--border-light);
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .cbg-upload-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(0, 102, 255, 0.04);
        }

        .cbg-bg-preview {
          margin-top: 8px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--border-light);
        }
        .cbg-bg-preview img {
          width: 100%;
          height: 80px;
          object-fit: cover;
          display: block;
        }

        /* Download */
        .cbg-download-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: auto;
        }
        .cbg-download-btn:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        .cbg-download-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Workspace */
        .cbg-workspace {
          flex: 1;
          background: var(--bg-panel);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          overflow: hidden;
          position: relative;
        }

        .cbg-canvas-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .cbg-canvas {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
        }

        /* Processing State */
        .cbg-processing {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: var(--text-muted);
        }

        .cbg-processing-sub {
          font-size: 0.78rem;
          color: var(--text-dim);
        }

        .cbg-spinner {
          width: 44px;
          height: 44px;
          border: 4px solid var(--border-light);
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .cbg-error {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .cbg-retry-btn {
          padding: 8px 20px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .cbg-body {
            flex-direction: column-reverse;
          }
          .cbg-sidebar {
            width: 100%;
            max-height: 300px;
          }
          .cbg-workspace {
            min-height: 280px;
          }
          .cbg-color-grid {
            grid-template-columns: repeat(6, 1fr);
          }
          .cbg-gradient-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default ChangeBgColorEditor;
