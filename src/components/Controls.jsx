import { 
  Sliders, 
  Download, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Check 
} from 'lucide-react';

const Controls = ({ 
  settings, 
  updateSettings, 
  onDownload, 
  originalDimensions, 
  isProcessing,
  mode = 'compress' // 'compress' | 'resize'
}) => {
  
  const handleChange = (key, value) => {
    updateSettings({ ...settings, [key]: value });
  };

  const handleDimensionChange = (key, value) => {
    const newVal = parseInt(value) || 0;
    let newSettings = { ...settings, [key]: newVal };

    if (settings.maintainAspectRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      if (key === 'width') {
        newSettings.height = Math.round(newVal * ratio);
      } else {
        newSettings.width = Math.round(newVal / ratio);
      }
    }
    updateSettings(newSettings);
  };

  return (
    <div className="controls-panel">
      <div className="panel-header">
        <Sliders size={18} color="var(--primary)" />
        <h2>{mode === 'compress' ? 'Compression' : 'Resize'} Settings</h2>
      </div>

      {mode === 'resize' && (
        <div className="control-group">
          <label>Dimensions</label>
          <div className="dimensions-grid">
            <div className="input-wrapper">
              <span className="label-sm">W</span>
              <input 
                type="number" 
                value={settings.width} 
                onChange={(e) => handleDimensionChange('width', e.target.value)}
              />
            </div>
            <div className="link-icon" onClick={() => handleChange('maintainAspectRatio', !settings.maintainAspectRatio)}>
              {settings.maintainAspectRatio ? <Lock size={14} /> : <Unlock size={14} />}
            </div>
            <div className="input-wrapper">
              <span className="label-sm">H</span>
              <input 
                type="number" 
                value={settings.height} 
                onChange={(e) => handleDimensionChange('height', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {mode === 'compress' && (
        <div className="control-group">
          <div className="label-row">
            <label>Quality</label>
            <span className="value-display">{settings.quality}%</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={settings.quality}
            onChange={(e) => handleChange('quality', parseInt(e.target.value))}
            className="range-input"
          />
          <div className="quality-labels">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      )}

      <div className="control-group">
        <label>Format</label>
        <div className="format-options">
          {['jpeg', 'png', 'webp'].map((fmt) => (
            <button
              key={fmt}
              className={`format-btn ${settings.format === fmt ? 'active' : ''}`}
              onClick={() => handleChange('format', fmt)}
            >
              {fmt.toUpperCase()}
              {settings.format === fmt && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>

      <button 
        className="download-btn" 
        onClick={onDownload} 
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <RefreshCw size={18} className="spin" /> Processing...
          </>
        ) : (
          <>
            <Download size={18} /> Download Image
          </>
        )}
      </button>

      <style>{`
        .controls-panel {
          background: var(--bg-panel);
          border-left: 1px solid var(--border-light);
          padding: var(--spacing-lg);
          width: 320px;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
          height: 100%;
          overflow-y: auto;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-main);
          font-weight: 600;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: var(--spacing-md);
        }
        
        .panel-header h2 {
           font-size: 1.1rem;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .control-group label {
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .dimensions-grid {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          background: var(--bg-app);
          border: 1px solid var(--border-active);
          border-radius: var(--radius-sm);
          padding: 0 8px;
          flex: 1;
        }

        .input-wrapper:focus-within {
          border-color: var(--primary);
        }

        .label-sm {
          color: var(--text-dim);
          font-size: 0.75rem;
          margin-right: 4px;
        }

        .input-wrapper input {
          width: 100%;
          background: transparent;
          border: none;
          color: var(--text-main);
          padding: 8px 0;
          font-size: 0.9rem;
          outline: none;
        }
        
        /* Remove arrows from number input */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }

        .link-icon {
          color: var(--text-dim);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
        
        .link-icon:hover {
           background: var(--bg-surface);
           color: var(--text-main);
        }

        .label-row {
          display: flex;
          justify-content: space-between;
        }

        .value-display {
          color: var(--primary);
          font-size: 0.875rem;
          font-family: monospace;
        }

        .range-input {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          background: var(--bg-surface);
          border-radius: 2px;
          outline: none;
        }

        .range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          border: 2px solid var(--bg-panel);
          box-shadow: 0 0 10px var(--primary-glow);
        }

        .quality-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-dim);
        }

        .format-options {
          display: flex;
          gap: 8px;
        }

        .format-btn {
          flex: 1;
          padding: 8px;
          background: var(--bg-app);
          border: 1px solid var(--border-active);
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: all var(--transition-fast);
        }

        .format-btn:hover {
          background: var(--bg-surface);
          color: var(--text-main);
        }

        .format-btn.active {
          background: rgba(0, 240, 255, 0.1);
          border-color: var(--primary);
          color: var(--primary);
        }

        .download-btn {
          margin-top: auto;
          background: var(--primary);
          color: #000;
          padding: 12px;
          border-radius: var(--radius-md);
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: var(--transition-fast);
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
        }

        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(0, 240, 255, 0.4);
        }

        .download-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
           .controls-panel {
              width: 100%;
              height: auto;
              border-left: none;
              border-top: 1px solid var(--border-light);
           }
        }
      `}</style>
    </div>
  );
};

export default Controls;
