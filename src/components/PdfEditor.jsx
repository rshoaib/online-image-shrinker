import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { ArrowLeft, FileText, Download, Trash2, GripVertical } from 'lucide-react';
import useImageProcessor from '../hooks/useImageProcessor';

const PdfEditor = ({ files: initialFiles, onBack, onRemove }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // We use initialFiles as the source. 
  // Ideally, valid files strictly for this editor should be managed here or passed down.
  
  const generatePdf = async () => {
    if (initialFiles.length === 0) return;
    setIsGenerating(true);
    setProgress(10);

    try {
      const doc = new jsPDF();
      
      for (let i = 0; i < initialFiles.length; i++) {
        const file = initialFiles[i];
        
        // If not first page, add new page
        if (i > 0) doc.addPage();

        // Load image to get dimensions
        const img = await loadImage(file);
        
        // Calculate dimensions to fit A4 (210mm x 297mm) maintaining aspect ratio
        const pageWidth = 210;
        const pageHeight = 297;
        const pageRatio = pageWidth / pageHeight;
        const imgRatio = img.width / img.height;

        let renderWidth = pageWidth;
        let renderHeight = pageWidth / imgRatio;

        if (renderHeight > pageHeight) {
          renderHeight = pageHeight;
          renderWidth = pageHeight * imgRatio;
        }

        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;

        // Draw image
        // We need base64 or Image element. jsPDF supports Image element in recent versions or data URL
        // Let's use a canvas triggers to get data URL if needed, but jspdf 'addImage' works nicely with data URI.
        const dataUrl = await fileToDataURL(file);
        const format = file.type === 'image/png' ? 'PNG' : 'JPEG';
        
        doc.addImage(dataUrl, format, x, y, renderWidth, renderHeight);
        
        setProgress(Math.round(((i + 1) / initialFiles.length) * 90));
      }

      doc.save('converted-images.pdf');
      setProgress(100);
    } catch (err) {
      console.error("PDF Generation failed", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const loadImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  const fileToDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Images to PDF</h2>
        <div className="file-count">
           <FileText size={16} /> {initialFiles.length} Images
        </div>
      </div>

      <div className="pdf-workspace">
        <div className="pdf-list">
          {initialFiles.map((file, index) => (
            <div key={index} className="pdf-list-item">
               <div className="drag-handle"><GripVertical size={16} /></div>
               <div className="file-preview">
                 <img src={URL.createObjectURL(file)} alt="preview" />
               </div>
               <div className="file-meta">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
               </div>
               <button className="remove-btn" onClick={() => onRemove(index)}>
                  <Trash2 size={16} />
               </button>
            </div>
          ))}
        </div>

        <div className="pdf-actions">
           <button 
             className="generate-btn" 
             onClick={generatePdf}
             disabled={isGenerating}
           >
             {isGenerating ? `Generating ${progress}%...` : (
                <>
                  <Download size={20} /> Download PDF
                </>
             )}
           </button>
        </div>
      </div>

      <style>{`
        .editor-container {
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
          min-height: 60vh;
          display: flex;
          flex-direction: column;
        }

        .editor-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .editor-header h2 {
          flex: 1;
        }

        .back-btn {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          cursor: pointer;
        }
        
        .pdf-workspace {
           background: var(--bg-panel);
           border-radius: var(--radius-lg);
           border: 1px solid var(--border-light);
           padding: 30px;
        }

        .pdf-list {
           display: flex;
           flex-direction: column;
           gap: 12px;
           margin-bottom: 30px;
           max-height: 400px;
           overflow-y: auto;
        }

        .pdf-list-item {
           display: flex;
           align-items: center;
           gap: 16px;
           background: var(--bg-surface);
           padding: 12px;
           border-radius: var(--radius-md);
           border: 1px solid var(--border-light);
        }

        .file-preview img {
           width: 40px;
           height: 40px;
           object-fit: cover;
           border-radius: 4px;
        }

        .file-meta {
           flex: 1;
           display: flex;
           flex-direction: column;
        }

        .file-name {
           font-weight: 500;
           color: var(--text-main);
        }

        .file-size {
           font-size: 0.8rem;
           color: var(--text-muted);
        }

        .remove-btn {
           background: rgba(255, 0, 0, 0.1);
           color: var(--error);
           border: none;
           width: 32px;
           height: 32px;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           cursor: pointer;
           transition: 0.2s;
        }

        .remove-btn:hover {
           background: var(--error);
           color: white;
        }

        .generate-btn {
           width: 100%;
           padding: 16px;
           background: var(--primary);
           color: #000;
           font-weight: 700;
           font-size: 1.1rem;
           border: none;
           border-radius: var(--radius-md);
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 12px;
           transition: 0.2s;
        }

        .generate-btn:hover:not(:disabled) {
           box-shadow: 0 0 20px var(--primary-glow);
           transform: translateY(-2px);
        }

        .generate-btn:disabled {
           opacity: 0.6;
           cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default PdfEditor;
