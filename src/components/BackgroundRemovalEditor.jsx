import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { removeBackground } from '@imgly/background-removal';
import { Download, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

const BackgroundRemovalEditor = ({ file, onBack }) => {
  const [originalUrl, setOriginalUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('Initializing AI Model...');

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
    setProcessedUrl(null);
    
    try {
      // Config for imgly - download assets from public CDN or public folder
      // Default behavior usually works well.
      const blob = await removeBackground(imageUrl, {
        progress: (key, current, total) => {
           setProgress(`Downloading AI Model: ${Math.round((current/total)*100)}%`);
        }
      });
      
      const resultUrl = URL.createObjectURL(blob);
      setProcessedUrl(resultUrl);
    } catch (err) {
      console.error(err);
      setError("Failed to remove background. Please try a different image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    const a = document.createElement('a');
    a.href = processedUrl;
    a.download = `removed-bg-${file.name.split('.')[0]}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Background Remover</h2>
        <Link to="/blog/how-to-remove-background" className="help-link">How to use?</Link>
      </div>

      <div className="editor-workspace">
        {error ? (
           <div className="error-state">
             <AlertCircle size={48} color="var(--error)" />
             <p>{error}</p>
             <button onClick={() => processImage(originalUrl)}>Try Again</button>
           </div>
        ) : (
          <div className="comparison-view">
             <div className="image-card original">
               <span className="label">Original</span>
               <img src={originalUrl} alt="Original" loading="lazy" />
             </div>
             
             <div className="image-card processed">
               <span className="label">Removed Background</span>
               {isProcessing ? (
                 <div className="processing-overlay">
                   <div className="spinner"></div>
                   <p>{progress}</p>
                 </div>
               ) : (
                 <div className="result-wrapper">
                    <img src={processedUrl} alt="Processed" className="checkerboard-bg" loading="lazy" />
                 </div>
               )}
             </div>
          </div>
        )}
      </div>

      <div className="editor-actions">
         <button 
           className="action-btn primary" 
           disabled={!processedUrl || isProcessing}
           onClick={handleDownload}
         >
           <Download size={20} /> Download PNG
         </button>
      </div>

      <style>{`
        .editor-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 20px;
          animation: fadeIn 0.3s ease-out;
        }
        .editor-header {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 1rem;
        }
        .back-btn:hover { color: var(--text-main); }
        
        .back-btn:hover { color: var(--text-main); }

        .help-link {
          font-size: 0.9rem;
          color: var(--primary);
          margin-left: auto;
          text-decoration: none;
        }
        .help-link:hover { text-decoration: underline; }
        
        .editor-workspace {
          flex: 1;
          background: var(--bg-panel);
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-light);
          min-height: 400px;
        }

        .comparison-view {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          width: 100%;
          justify-content: center;
        }

        .image-card {
          flex: 1;
          min-width: 300px;
          max-width: 500px;
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border: 1px solid var(--border-light);
          position: relative;
        }

        .label {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .image-card img {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: contain;
          border-radius: 4px;
        }

        .checkerboard-bg {
          background-image:
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          background-color: #fff; 
        }

        .processing-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          border-radius: var(--radius-md);
          z-index: 10;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255,255,255,0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .editor-actions {
          display: flex;
          justify-content: flex-end;
          padding: 20px 0;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .action-btn.primary {
          background: var(--primary);
          color: white; /* Always white for primary buttons */
        }
        .action-btn.primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .action-btn.primary:hover:not(:disabled) {
          filter: brightness(1.1);
        }

        .error-state {
          text-align: center;
          color: var(--error);
        }
      `}</style>
    </div>
  );
};

export default BackgroundRemovalEditor;
