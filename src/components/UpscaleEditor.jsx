import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Upscaler from 'upscaler';
import { Download, ArrowLeft, Zap, AlertCircle } from 'lucide-react';

const UpscaleEditor = ({ file, onBack }) => {
  const [originalUrl, setOriginalUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('Loading Model...');
  const [scaleFactor, setScaleFactor] = useState(2); // Default to 2x

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const processImage = async () => {
    if (!originalUrl) return;
    
    setIsProcessing(true);
    setError(null);
    setProcessedUrl(null);
    setProgress('Loading AI Model...');

    try {
      const upscaler = new Upscaler({
        model: scaleFactor === 4 ? 'div2k/rdn-C3-D10-G64-G064-x4' : 'div2k/rdn-C3-D10-G64-G064-x2',
      });
      
      const startTime = Date.now();
      
      // Load image object
      const img = new Image();
      img.src = originalUrl;
      await new Promise(r => img.onload = r);

      setProgress('Upscaling... This may take a while.');
      
      const result = await upscaler.execute(originalUrl, {
        patchSize: 64,
        padding: 2,
        progress: (amount) => {
           setProgress(`Upscaling: ${Math.round(amount * 100)}%`);
        }
      });
      
      setProcessedUrl(result);
    } catch (err) {
      console.error(err);
      // Fallback or generic error
      setError("Upscaling failed. You might need a GPU-enabled browser or the image is too large.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    const a = document.createElement('a');
    a.href = processedUrl;
    a.download = `upscaled-${scaleFactor}x-${file.name.split('.')[0]}.png`;
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
        <h2>AI Image Upscaler</h2>
        <Link to="/blog/ai-image-upscaler-guide" className="help-link">How to use?</Link>
      </div>

      <div className="editor-workspace">
        {error ? (
           <div className="error-state">
             <AlertCircle size={48} color="var(--error)" />
             <p>{error}</p>
             <button onClick={processImage}>Try Again</button>
           </div>
        ) : (
          <div className="comparison-view">
             <div className="image-card original">
               <span className="label">Original</span>
               <img src={originalUrl} alt="Original" />
             </div>
             
             <div className="image-card processed">
               <span className="label">Upscaled ({scaleFactor}x)</span>
               {isProcessing ? (
                 <div className="processing-overlay">
                   <div className="spinner"></div>
                   <p>{progress}</p>
                 </div>
               ) : processedUrl ? (
                 <div className="result-wrapper">
                    <img src={processedUrl} alt="Processed" />
                 </div>
               ) : (
                 <div className="start-prompt">
                    <Zap size={48} color="var(--primary)" />
                    <p>Ready to upscale</p>
                    <div className="scale-options">
                        <button 
                          className={scaleFactor === 2 ? 'active' : ''} 
                          onClick={() => setScaleFactor(2)}
                        >2x</button>
                        <button 
                          className={scaleFactor === 4 ? 'active' : ''} 
                          onClick={() => setScaleFactor(4)}
                        >4x</button>
                    </div>
                    <button className="action-btn primary" onClick={processImage}>Start Upscaling</button>
                 </div>
               )}
             </div>
          </div>
        )}
      </div>

      <div className="editor-actions">
         {processedUrl && (
            <button 
              className="action-btn primary" 
              onClick={handleDownload}
            >
              <Download size={20} /> Download Upscaled Image
            </button>
         )}
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
          min-height: 300px;
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

        .start-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 16px;
          color: var(--text-muted);
        }

        .scale-options {
           display: flex;
           gap: 10px;
           margin-bottom: 10px;
        }
        
        .scale-options button {
           padding: 8px 16px;
           border: 1px solid var(--border-light);
           background: var(--bg-surface);
           border-radius: var(--radius-md);
           cursor: pointer;
           color: var(--text-main);
        }

        .scale-options button.active {
           border-color: var(--primary);
           background: var(--primary);
           color: white;
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
          color: white;
        }

        .error-state {
          text-align: center;
          color: var(--error);
        }
      `}</style>
    </div>
  );
};

export default UpscaleEditor;
