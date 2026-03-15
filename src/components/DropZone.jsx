'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const DropZone = ({ onFileSelect }) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [sizeWarning, setSizeWarning] = useState(null);
  const inputRef = useRef(null);

  // Auto-dismiss messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (sizeWarning) {
      const timer = setTimeout(() => setSizeWarning(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [sizeWarning]);

  const handleFiles = useCallback((files) => {
    setError(null);
    setSizeWarning(null);

    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || 
      file.name.toLowerCase().endsWith('.heic') || 
      file.name.toLowerCase().endsWith('.heif')
    );

    if (validFiles.length === 0) {
      setError(t('dropzone.invalid_file') || 'Please upload image files (JPG, PNG, WebP, HEIC).');
      return;
    }

    // Check for large files
    const largeFiles = validFiles.filter(f => f.size > MAX_FILE_SIZE_BYTES);
    if (largeFiles.length > 0) {
      setSizeWarning(
        t('dropzone.file_too_large', { size: MAX_FILE_SIZE_MB }) || 
        `File over ${MAX_FILE_SIZE_MB}MB detected. Processing may be slow.`
      );
    }

    onFileSelect(validFiles);
  }, [onFileSelect, t]);

  // Global Paste Listener
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = Array.from(e.clipboardData.items);
        const imageFiles = items
          .filter(item => item.type.startsWith('image/'))
          .map(item => item.getAsFile())
          .filter(file => file !== null);

        if (imageFiles.length > 0) {
          e.preventDefault();
          handleFiles(imageFiles);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFiles]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  return (
    <div 
      className={`dropzone ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        ref={inputRef} 
        className="hidden-input" 
        accept="image/*,.heic,.heif"
        multiple
        onChange={handleInputChange}
      />
      
      <div className={`dz-icon-wrapper ${!isDragging && !error ? 'idle-pulse' : ''}`}>
        <UploadCloud size={56} color={isDragging ? 'var(--primary)' : 'var(--text-muted)'} />
      </div>
      
      <div className="text-content">
        <h3 className="drop-title">
          {isDragging 
            ? (t('dropzone.title_dragging') || "Drop it like it's hot!")
            : (t('dropzone.title') || 'Drag & Drop your image here')
          }
        </h3>
        <p className="drop-subtitle">
          {t('dropzone.subtitle') || 'or click to browse or paste (Ctrl+V)'}
        </p>
      </div>

      <div className="supported-formats">
        <span className="pill">JPG</span>
        <span className="pill">PNG</span>
        <span className="pill">WEBP</span>
        <span className="pill">HEIC</span>
      </div>

      {isDragging && (
        <div className="dz-backdrop-blur"></div>
      )}

      {/* Inline Toast Messages */}
      {error && (
        <div className="dz-toast dz-toast-error" role="alert">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}
      {sizeWarning && (
        <div className="dz-toast dz-toast-warning" role="status">
          <AlertTriangle size={16} />
          <span>{sizeWarning}</span>
        </div>
      )}

      <style>{`
        .dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 600px;
          min-height: 400px;
          margin: 0 auto;
          border: 2px dashed var(--border-active);
          border-radius: var(--radius-lg);
          background-color: var(--bg-panel);
          transition: all var(--transition-smooth);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .dropzone:hover {
          border-color: var(--primary);
          background-color: var(--bg-surface);
        }

        .dropzone.dragging {
          border-color: var(--primary);
          background-color: rgba(0, 102, 255, 0.05);
          transform: scale(1.02);
          box-shadow: 0 0 40px var(--primary-glow);
          background-image: repeating-linear-gradient(
            45deg,
            var(--primary-glow) 25%,
            transparent 25%,
            transparent 50%,
            var(--primary-glow) 50%,
            var(--primary-glow) 75%,
            transparent 75%,
            transparent
          );
          background-size: 40px 40px;
          animation: barberpole 2s linear infinite;
        }

        @keyframes barberpole {
          100% {
            background-position: 40px 0;
          }
        }

        .dz-backdrop-blur {
          position: absolute;
          inset: 0;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 0;
          pointer-events: none;
        }
        
        .dz-icon-wrapper, .text-content, .supported-formats, .hidden-input {
          z-index: 1;
        }

        .hidden-input {
          display: none;
        }

        .dz-icon-wrapper {
          margin-bottom: var(--spacing-lg);
          padding: var(--spacing-lg);
          border-radius: 50%;
          background: var(--bg-panel);
          border: 1px solid var(--border-light);
          transition: all var(--transition-smooth);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
        }

        .idle-pulse {
          animation: gentlePulse 3s infinite ease-in-out;
        }

        @keyframes gentlePulse {
          0% { box-shadow: 0 0 0 0 var(--primary-glow); border-color: var(--border-light); }
          50% { box-shadow: 0 0 20px 5px var(--primary-glow); border-color: var(--primary-glow); }
          100% { box-shadow: 0 0 0 0 var(--primary-glow); border-color: var(--border-light); }
        }

        .dropzone:hover .dz-icon-wrapper {
          border-color: var(--primary);
          transform: translateY(-8px) scale(1.1);
          color: var(--primary);
        }

        .text-content {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .drop-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          color: var(--text-main);
        }

        .drop-subtitle {
          color: var(--text-muted);
          font-size: 1rem;
        }

        .supported-formats {
          display: flex;
          gap: var(--spacing-sm);
        }

        .pill {
          padding: 4px 12px;
          background: var(--bg-app);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          color: var(--text-dim);
          font-weight: 600;
        }

        /* Inline toast notifications */
        .dz-toast {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 500;
          animation: toastSlideUp 0.3s ease-out;
          white-space: nowrap;
          z-index: 10;
        }

        .dz-toast-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--error);
        }

        .dz-toast-warning {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #f59e0b;
        }

        @keyframes toastSlideUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};

export default DropZone;
