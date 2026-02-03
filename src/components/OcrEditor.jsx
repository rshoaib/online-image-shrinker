import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Copy, Download, RefreshCw, AlertCircle } from 'lucide-react';
import Tesseract from 'tesseract.js';
import ShareCard from './ShareCard';

const OcrEditor = ({ file, onBack }) => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      startOcr(); // Auto-start
    }
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [file]);

  const startOcr = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setText('');
    setStatus('Initializing Tesseract...');

    try {
      const result = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
              setStatus(`Recognizing Text... ${Math.round(m.progress * 100)}%`);
            } else {
              setStatus(m.status);
            }
          }
        }
      );
      
      setText(result.data.text);
      setStatus('Completed');
    } catch (err) {
      console.error(err);
      setError('Failed to extract text. Please try again with a clearer image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    // Could show a toast here, but for now simple is fine.
    // Or change button text temporarily.
    const btn = document.getElementById('copy-btn');
    if(btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Copied!</span>';
        setTimeout(() => btn.innerHTML = originalText, 2000);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const fileBlob = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(fileBlob);
    element.download = "extracted_text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="file-info">
          <FileText size={16} />
          <span>Image to Text (OCR)</span>
        </div>
      </div>

      <div className="workspace">
        <div className="preview-area">
           <div className="image-container">
             {previewUrl && <img src={previewUrl} alt="Original" />}
           </div>
        </div>

        <div className="sidebar">
          <div className="result-area">
             <h3>Extracted Text</h3>
             {error ? (
                <div className="error-message">
                    <AlertCircle size={20} />
                    {error}
                </div>
             ) : (
                <textarea 
                    value={isProcessing ? status : text} 
                    readOnly={isProcessing}
                    placeholder="Text will appear here..."
                    onChange={(e) => setText(e.target.value)}
                    className={isProcessing ? 'processing' : ''}
                />
             )}
             
             {isProcessing && (
                <div className="progress-bar">
                    <div className="fill" style={{ width: `${progress}%` }}></div>
                </div>
             )}
          </div>

          <div className="actions">
            <button 
                id="copy-btn"
                className="action-btn primary" 
                onClick={handleCopy} 
                disabled={!text || isProcessing}
            >
                <Copy size={16} /> Copy Text
            </button>
            <button 
                className="action-btn secondary" 
                onClick={handleDownload} 
                disabled={!text || isProcessing}
            >
                <Download size={16} /> Download .txt
            </button>
            <button 
                className="action-btn ghost" 
                onClick={startOcr}
                disabled={isProcessing}
            >
                <RefreshCw size={16} className={isProcessing ? 'spin' : ''} /> Rerun
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .editor-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 160px);
          background: var(--bg-app);
        }

        .editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--spacing-md);
          height: 60px;
          border-bottom: 1px solid var(--border-light);
          flex-shrink: 0;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-weight: 500;
          transition: 0.2s;
        }

        .back-btn:hover { color: var(--text-main); }

        .file-info {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-main);
            font-weight: 600;
        }

        .workspace {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .preview-area {
          flex: 1;
          background: #0f0f10;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .image-container {
            max-width: 100%;
            max-height: 100%;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .image-container img {
            max-width: 100%;
            max-height: 100%;
            display: block;
            border-radius: 8px;
        }

        .sidebar {
          width: 400px;
          border-left: 1px solid var(--border-light);
          background: var(--bg-panel);
          display: flex;
          flex-direction: column;
          padding: 24px;
          gap: 20px;
        }

        .result-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-height: 0; 
        }

        .result-area h3 {
            font-size: 1.1rem;
            color: var(--text-main);
            font-weight: 600;
        }

        textarea {
            flex: 1;
            background: var(--bg-surface);
            border: 1px solid var(--border-light);
            border-radius: 8px;
            padding: 16px;
            color: var(--text-main);
            font-family: monospace;
            font-size: 0.9rem;
            line-height: 1.6;
            resize: none;
            outline: none;
            transition: 0.2s;
        }

        textarea:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
        }

        textarea.processing {
            color: var(--text-muted);
            font-style: italic;
        }

        .progress-bar {
            height: 4px;
            background: var(--bg-surface);
            border-radius: 2px;
            overflow: hidden;
        }

        .fill {
            height: 100%;
            background: var(--primary);
            transition: width 0.3s ease;
        }

        .actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px;
            border-radius: 8px;
            font-weight: 600;
            transition: 0.2s;
        }

        .action-btn.primary {
            background: var(--primary);
            color: white;
        }
        .action-btn.primary:hover { filter: brightness(1.1); }

        .action-btn.secondary {
            background: var(--bg-surface);
            border: 1px solid var(--border-light);
            color: var(--text-main);
        }
        .action-btn.secondary:hover { border-color: var(--text-muted); }

        .action-btn.ghost {
            background: transparent;
            color: var(--text-muted);
        }
        .action-btn.ghost:hover { color: var(--text-main); }
        
        .action-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            filter: none;
        }

        .error-message {
            background: rgba(255, 0, 0, 0.1);
            color: #ff4d4d;
            padding: 12px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        @media (max-width: 768px) {
            .workspace { flex-direction: column; overflow-y: auto; }
            .sidebar { width: 100%; height: auto; flex: none; }
            .preview-area { min-height: 300px; }
            .editor-container { height: auto; }
        }
      `}</style>
    </div>
  );
};

export default OcrEditor;
