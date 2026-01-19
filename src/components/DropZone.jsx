import { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';

const DropZone = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

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

  const handleFiles = (files) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || 
      file.name.toLowerCase().endsWith('.heic') || 
      file.name.toLowerCase().endsWith('.heif')
    );
    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    } else {
      alert('Please upload image files (JPG, PNG, WebP, HEIC).');
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
      
      <div className="icon-wrapper">
        <UploadCloud size={48} color={isDragging ? 'var(--primary)' : 'var(--text-muted)'} />
      </div>
      
      <div className="text-content">
        <h3 className="drop-title">
          {isDragging ? 'Drop it like it\'s hot!' : 'Drag & Drop your image here'}
        </h3>
        <p className="drop-subtitle">or click to browse</p>
      </div>

      <div className="supported-formats">
        <span className="pill">JPG</span>
        <span className="pill">PNG</span>
        <span className="pill">WEBP</span>
        <span className="pill">HEIC</span>
      </div>

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
          border-color: var(--text-muted);
          background-color: var(--bg-surface);
        }

        .dropzone.dragging {
          border-color: var(--primary);
          background-color: rgba(0, 240, 255, 0.05);
          transform: scale(1.02);
          box-shadow: 0 0 30px rgba(0, 240, 255, 0.15);
        }

        .hidden-input {
          display: none;
        }

        .icon-wrapper {
          margin-bottom: var(--spacing-lg);
          padding: var(--spacing-lg);
          border-radius: 50%;
          background: var(--bg-app);
          border: 1px solid var(--border-light);
          transition: var(--transition-fast);
        }

        .dropzone:hover .icon-wrapper {
          border-color: var(--primary);
          transform: translateY(-5px);
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
      `}</style>
    </div>
  );
};

export default DropZone;
