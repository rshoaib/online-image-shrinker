import { useState, useEffect } from 'react';

import Upscaler from 'upscaler';
import { Download, ArrowLeft, Zap, AlertCircle, Copy, Check } from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import { triggerConfetti } from '../utils/confetti';
import { copyUrlToClipboard } from '../utils/clipboard';

const UpscaleEditor = ({ file, onBack }) => {
  const [originalUrl, setOriginalUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('Loading Model...');
  const [scaleFactor, setScaleFactor] = useState(2); // Default to 2x
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const processImage = async () => {
    if (!originalUrl) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      setProgress('Loading AI Model...');
      
      const upscaler = new Upscaler();
      setProgress('Upscaling Image...');
      
      const upscaledSrc = await upscaler.upscale(originalUrl, {
        patchSize: 64,
        padding: 2,
        progress: (amount) => {
          setProgress(`Processing... ${Math.round(amount * 100)}%`);
        }
      });

      setProcessedUrl(upscaledSrc);
      triggerConfetti();
    } catch (err) {
      console.error('Upscale error:', err);
      setError('Failed to upscale image. Please try a smaller image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    triggerConfetti();
    const a = document.createElement('a');
    a.href = processedUrl;
    a.download = `upscaled-${scaleFactor}x-${file.name.split('.')[0]}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    if (!processedUrl) return;
    const success = await copyUrlToClipboard(processedUrl);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>AI Upscaler</h2>
        <a href="https://upscalerjs.com" target="_blank" rel="noopener noreferrer" className="help-link">
          Powered by UpscalerJS
        </a>
      </div>
      
      <div className="editor-workspace">
        {/* ... (Existing logic for workspace) ... */}
        {error ? (
           <div className="error-state">
             <AlertCircle size={48} color="var(--error)" />
             <p>{error}</p>
             <button onClick={processImage}>Try Again</button>
           </div>
        ) : processedUrl ? (
           <div className="slider-wrapper" style={{width: '100%', maxWidth: '800px', margin: '0 auto'}}>
              <BeforeAfterSlider beforeImage={originalUrl} afterImage={processedUrl} />
              <p className="slider-hint">Drag the slider to compare details</p>
           </div>
        ) : (
          <div className="comparison-view">
             {/* ... */}
             <div className="image-card original">
               <span className="label">Original</span>
               <img src={originalUrl} alt="Original" loading="lazy" />
             </div>
             
             <div className="image-card processed">
               <span className="label">Upscaled ({scaleFactor}x)</span>
               {isProcessing ? (
                 <div className="processing-overlay">
                   <div className="spinner"></div>
                   <p>{progress}</p>
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
            <>
                <button className="action-btn secondary" onClick={() => setProcessedUrl(null)}>
                    Back to Settings
                </button>
                <button className="action-btn secondary" onClick={handleCopy}>
                    {isCopied ? <Check size={20} /> : <Copy size={20} />} {isCopied ? 'Copied' : 'Copy'}
                </button>
                <button 
                  className="action-btn primary" 
                  onClick={handleDownload}
                >
                  <Download size={20} /> Download Upscaled
                </button>
            </>
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
          gap: 10px;
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
        
        .slider-wrapper {
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: 12px;
        }
        
        .slider-hint {
           color: var(--text-muted);
           font-size: 0.9rem;
           font-style: italic;
        }

        .action-btn.secondary {
           background: var(--bg-surface);
           border: 1px solid var(--border-active);
           color: var(--text-main);
        }
        .action-btn.secondary:hover {
           background: var(--bg-panel);
           border-color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default UpscaleEditor;

