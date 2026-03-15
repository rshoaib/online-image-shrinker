'use client';
import { useState, useRef } from 'react';
import { ArrowLeft, Copy, Upload, Download, CheckCircle, Code } from 'lucide-react';

const Base64Editor = ({ onBack }) => {
  const [image, setImage] = useState(null);
  const [base64String, setBase64String] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [base64Size, setBase64Size] = useState(0);
  const [mimeType, setMimeType] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedDataUri, setCopiedDataUri] = useState(false);
  const [mode, setMode] = useState('encode'); // encode | decode
  const [decodePreview, setDecodePreview] = useState(null);
  const [decodeError, setDecodeError] = useState('');
  const textareaRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setImage(dataUrl);
      // Extract raw base64 (without data URI prefix)
      const raw = dataUrl.split(',')[1];
      setBase64String(raw);
      setBase64Size(new Blob([raw]).size);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const input = document.getElementById('base64-upload');
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      handleUpload({ target: { files: dt.files } });
    }
  };

  const handleCopyRaw = async () => {
    try {
      await navigator.clipboard.writeText(base64String);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      textareaRef.current?.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyDataUri = async () => {
    try {
      await navigator.clipboard.writeText(`data:${mimeType};base64,${base64String}`);
      setCopiedDataUri(true);
      setTimeout(() => setCopiedDataUri(false), 2000);
    } catch {
      setCopiedDataUri(true);
      setTimeout(() => setCopiedDataUri(false), 2000);
    }
  };

  const handleDecodeInput = (value) => {
    setDecodeError('');
    setDecodePreview(null);

    if (!value.trim()) return;

    try {
      // Check if it's a data URI or raw base64
      let dataUrl = value.trim();
      if (!dataUrl.startsWith('data:')) {
        // Try to auto-detect mime type from base64 header
        dataUrl = `data:image/png;base64,${dataUrl}`;
      }

      // Validate by creating an image
      const img = new Image();
      img.onload = () => {
        setDecodePreview(dataUrl);
        setDecodeError('');
      };
      img.onerror = () => {
        setDecodeError('Invalid Base64 image string. Please check your input.');
        setDecodePreview(null);
      };
      img.src = dataUrl;
    } catch {
      setDecodeError('Failed to decode Base64 string.');
    }
  };

  const handleDownloadDecoded = () => {
    if (!decodePreview) return;
    const a = document.createElement('a');
    a.href = decodePreview;
    a.download = 'decoded-image.png';
    a.click();
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="base64-editor">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} />
          Back
        </button>
        <h3>Image ↔ Base64 Converter</h3>
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'encode' ? 'active' : ''}`}
            onClick={() => setMode('encode')}
          >
            Encode
          </button>
          <button
            className={`mode-btn ${mode === 'decode' ? 'active' : ''}`}
            onClick={() => setMode('decode')}
          >
            Decode
          </button>
        </div>
      </div>

      {mode === 'encode' ? (
        <div className="encode-workspace">
          {!image ? (
            <div
              className="upload-zone"
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <input type="file" accept="image/*" id="base64-upload" onChange={handleUpload} hidden />
              <label htmlFor="base64-upload" className="upload-label">
                <Upload size={48} strokeWidth={1.5} />
                <span className="upload-title">Upload an Image</span>
                <span className="upload-hint">Drop an image here or click to browse</span>
                <span className="upload-formats">JPG, PNG, WebP, GIF, SVG, ICO</span>
              </label>
            </div>
          ) : (
            <div className="result-layout">
              <div className="preview-column">
                <div className="image-preview">
                  <img src={image} alt="Uploaded" />
                </div>
                <div className="file-info">
                  <div className="info-row">
                    <span className="info-label">File</span>
                    <span className="info-value">{fileName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Type</span>
                    <span className="info-value">{mimeType}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Original Size</span>
                    <span className="info-value">{formatBytes(fileSize)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Base64 Size</span>
                    <span className="info-value">{formatBytes(base64Size)} (~{Math.round((base64Size / fileSize) * 100)}%)</span>
                  </div>
                </div>
                <button
                  className="reset-btn"
                  onClick={() => { setImage(null); setBase64String(''); setFileName(''); }}
                >
                  Upload Different Image
                </button>
              </div>

              <div className="output-column">
                <div className="output-section">
                  <div className="output-header">
                    <span className="output-label">Raw Base64</span>
                    <button className="copy-btn" onClick={handleCopyRaw}>
                      {copied ? <><CheckCircle size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                    </button>
                  </div>
                  <textarea
                    ref={textareaRef}
                    className="base64-output"
                    value={base64String}
                    readOnly
                    rows={6}
                  />
                </div>

                <div className="output-section">
                  <div className="output-header">
                    <span className="output-label">Data URI (HTML/CSS ready)</span>
                    <button className="copy-btn" onClick={handleCopyDataUri}>
                      {copiedDataUri ? <><CheckCircle size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                    </button>
                  </div>
                  <textarea
                    className="base64-output"
                    value={`data:${mimeType};base64,${base64String}`}
                    readOnly
                    rows={6}
                  />
                </div>

                <div className="output-section">
                  <div className="output-header">
                    <span className="output-label">HTML &lt;img&gt; Tag</span>
                  </div>
                  <textarea
                    className="base64-output code-output"
                    value={`<img src="data:${mimeType};base64,${base64String}" alt="${fileName}" />`}
                    readOnly
                    rows={3}
                  />
                </div>

                <div className="output-section">
                  <div className="output-header">
                    <span className="output-label">CSS Background</span>
                  </div>
                  <textarea
                    className="base64-output code-output"
                    value={`background-image: url('data:${mimeType};base64,${base64String}');`}
                    readOnly
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="decode-workspace">
          <div className="decode-input-area">
            <label className="decode-label">
              <Code size={18} /> Paste Base64 String
            </label>
            <textarea
              className="decode-input"
              placeholder="Paste a raw base64 string or a data:image/... URI here..."
              rows={8}
              onChange={(e) => handleDecodeInput(e.target.value)}
            />
            {decodeError && <p className="decode-error">{decodeError}</p>}
          </div>

          {decodePreview && (
            <div className="decode-preview-area">
              <div className="decode-preview-img">
                <img src={decodePreview} alt="Decoded" />
              </div>
              <button className="download-decoded-btn" onClick={handleDownloadDecoded}>
                <Download size={18} /> Download Image
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .base64-editor {
          background: var(--bg-panel);
          border-radius: var(--radius-lg);
          padding: 24px;
          min-height: 600px;
          display: flex;
          flex-direction: column;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 20px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          transition: 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
        }
        .back-btn:hover { color: var(--primary); }

        .mode-toggle {
          display: flex;
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-light);
        }

        .mode-btn {
          padding: 8px 20px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-muted);
          transition: all 0.2s;
          border: none;
          background: none;
          cursor: pointer;
        }
        .mode-btn.active {
          background: var(--primary);
          color: white;
        }
        .mode-btn:hover:not(.active) {
          color: var(--text-main);
        }

        /* Upload Zone */
        .upload-zone {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 60px;
          border: 2px dashed var(--border-light);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all 0.3s;
          color: var(--text-muted);
          text-align: center;
        }
        .upload-label:hover {
          border-color: var(--primary);
          background: var(--bg-surface);
        }
        .upload-title { font-size: 1.2rem; font-weight: 600; color: var(--text-main); }
        .upload-hint { font-size: 0.9rem; }
        .upload-formats { font-size: 0.8rem; color: var(--text-dim); }

        /* Encode Results */
        .result-layout {
          display: flex;
          gap: 30px;
          flex: 1;
        }

        .preview-column {
          width: 280px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .image-preview {
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-light);
        }
        .image-preview img {
          max-width: 100%;
          max-height: 200px;
          object-fit: contain;
          border-radius: 4px;
        }

        .file-info {
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          padding: 16px;
          border: 1px solid var(--border-light);
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 0.85rem;
        }
        .info-row + .info-row { border-top: 1px solid var(--border-light); }
        .info-label { color: var(--text-muted); }
        .info-value { color: var(--text-main); font-weight: 500; font-family: monospace; }

        .reset-btn {
          padding: 10px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          background: none;
          transition: 0.2s;
        }
        .reset-btn:hover { border-color: var(--primary); color: var(--primary); }

        .output-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        .output-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .output-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .copy-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-muted);
          background: var(--bg-surface);
          cursor: pointer;
          transition: 0.2s;
        }
        .copy-btn:hover { border-color: var(--primary); color: var(--primary); }

        .base64-output {
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          color: var(--text-main);
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 0.8rem;
          padding: 12px;
          resize: vertical;
          line-height: 1.5;
          word-break: break-all;
        }
        .base64-output:focus { border-color: var(--primary); outline: none; }
        .code-output { font-size: 0.78rem; color: var(--primary); }

        /* Decode Mode */
        .decode-workspace {
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex: 1;
        }

        .decode-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-main);
          margin-bottom: 10px;
        }

        .decode-input {
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          color: var(--text-main);
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 0.85rem;
          padding: 16px;
          resize: vertical;
          line-height: 1.5;
          word-break: break-all;
        }
        .decode-input:focus { border-color: var(--primary); outline: none; }
        .decode-input::placeholder { color: var(--text-dim); }

        .decode-error {
          color: #ef4444;
          font-size: 0.85rem;
          margin-top: 8px;
        }

        .decode-preview-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .decode-preview-img {
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 24px;
          max-width: 500px;
        }
        .decode-preview-img img {
          max-width: 100%;
          max-height: 400px;
          object-fit: contain;
        }

        .download-decoded-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .download-decoded-btn:hover { transform: translateY(-2px); }

        @media (max-width: 800px) {
          .result-layout { flex-direction: column; }
          .preview-column { width: 100%; }
          .editor-header { flex-wrap: wrap; gap: 12px; }
        }
      `}</style>
    </div>
  );
};

export default Base64Editor;
