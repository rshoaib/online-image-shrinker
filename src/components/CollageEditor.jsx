import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Download, LayoutTemplate, Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CollageEditor = ({ files, setFiles, onBack }) => {
  const { t } = useTranslation();
  const [layout, setLayout] = useState('2-side'); // '2-side', '2-vert', '4-grid'
  const [canvasUrl, setCanvasUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // We need at least 2 images for a collage usually, but can support 1-4
  // We'll maintain a local state of images to allow adding more
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (files && files.length > 0) {
        // Load initial files
        const loaded = files.map(f => ({
            id: Math.random().toString(36),
            file: f,
            url: URL.createObjectURL(f)
        }));
        setImages(loaded.slice(0, 4)); // Max 4 for now
    }
  }, []);

  useEffect(() => {
    if (images.length > 0) {
        drawCollage();
    }
  }, [images, layout]);

  const handleAddFile = (e) => {
    if (e.target.files && e.target.files.length > 0 && images.length < 4) {
        const newFiles = Array.from(e.target.files).map(f => ({
            id: Math.random().toString(36),
            file: f,
            url: URL.createObjectURL(f)
        }));
        setImages(prev => [...prev, ...newFiles].slice(0, 4));
    }
  };

  const handleRemove = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const drawCollage = async () => {
    setLoading(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Standard output size 2000px wide
    const width = 2000;
    const height = layout === '2-side' ? 1500 : (layout === '4-grid' ? 2000 : 3000); 
    
    canvas.width = width;
    canvas.height = height;
    
    // Fill white bg
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Load all images
    const loadedImgs = await Promise.all(images.map(item => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = item.url;
        });
    }));

    if (loadedImgs.length === 0) {
        setLoading(false);
        return;
    }

    // Drawing Logic
    const gap = 20;

    if (layout === '2-side') {
        // img1 left, img2 right
        const w = (width - gap) / 2;
        const h = height;
        
        if (loadedImgs[0]) drawCover(ctx, loadedImgs[0], 0, 0, w, h);
        if (loadedImgs[1]) drawCover(ctx, loadedImgs[1], w + gap, 0, w, h);
        
    } else if (layout === '2-vert') {
        const w = width;
        const h = (height - gap) / 2;
        
        if (loadedImgs[0]) drawCover(ctx, loadedImgs[0], 0, 0, w, h);
        if (loadedImgs[1]) drawCover(ctx, loadedImgs[1], 0, h + gap, w, h);

    } else if (layout === '4-grid') {
        const w = (width - gap) / 2;
        const h = (height - gap) / 2;
        
        // 0 1
        // 2 3
        if (loadedImgs[0]) drawCover(ctx, loadedImgs[0], 0, 0, w, h);
        if (loadedImgs[1]) drawCover(ctx, loadedImgs[1], w + gap, 0, w, h);
        if (loadedImgs[2]) drawCover(ctx, loadedImgs[2], 0, h + gap, w, h);
        if (loadedImgs[3]) drawCover(ctx, loadedImgs[3], w + gap, h + gap, w, h);
    }

    setCanvasUrl(canvas.toDataURL('image/jpeg', 0.9));
    setLoading(false);
  };

  const drawCover = (ctx, img, x, y, w, h) => {
      // Scale image to cover the area x,y,w,h
      const ratio = w / h;
      const imgRatio = img.width / img.height;
      
      let sx, sy, sw, sh;
      
      if (imgRatio > ratio) {
          // Image is wider than area, crop sides
          sh = img.height;
          sw = img.height * ratio;
          sy = 0;
          sx = (img.width - sw) / 2;
      } else {
          // Image is taller than area, crop top/bottom
          sw = img.width;
          sh = img.width / ratio;
          sx = 0;
          sy = (img.height - sh) / 2;
      }
      
      ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  };

  const handleDownload = () => {
      if (!canvasUrl) return;
      const link = document.createElement('a');
      link.download = 'collage.jpg';
      link.href = canvasUrl;
      link.click();
  };

  return (
    <div className="collage-editor">
       <div className="editor-header">
         <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Collage Maker</h2>
        <button className="primary-btn" onClick={handleDownload} disabled={!canvasUrl}>
           <Download size={18} /> Download
        </button>
      </div>

      <div className="workspace">
         <div className="sidebar">
            <h3>Layout</h3>
            <div className="layout-options">
                <button className={layout === '2-side' ? 'active' : ''} onClick={() => setLayout('2-side')}>
                    <LayoutTemplate size={16} /> Side by Side
                </button>
                <button className={layout === '2-vert' ? 'active' : ''} onClick={() => setLayout('2-vert')}>
                    <LayoutTemplate size={16} style={{transform: 'rotate(90deg)'}}/> Vertical
                </button>
                <button className={layout === '4-grid' ? 'active' : ''} onClick={() => setLayout('4-grid')}>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:2, width:16, height:16}}>
                        <div style={{background:'currentColor'}}></div><div style={{background:'currentColor'}}></div>
                        <div style={{background:'currentColor'}}></div><div style={{background:'currentColor'}}></div>
                    </div> Grid 2x2
                </button>
            </div>

            <h3>Images ({images.length}/4)</h3>
            <div className="image-list">
                {images.map(img => (
                    <div key={img.id} className="img-item">
                        <img src={img.url} alt="thumb" />
                        <button className="remove-btn" onClick={() => handleRemove(img.id)}>
                            <X size={14} />
                        </button>
                    </div>
                ))}
                
                {images.length < 4 && (
                    <label className="add-btn">
                        <Plus size={24} />
                        <input type="file" accept="image/*" onChange={handleAddFile} hidden />
                    </label>
                )}
            </div>
         </div>

         <div className="preview-area">
             {loading ? <p>Generating...</p> : (
                 canvasUrl && <img src={canvasUrl} className="collage-preview" alt="Collage" />
             )}
         </div>
      </div>

      <style>{`
        .collage-editor {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 80px);
          background: #111;
        }

        .editor-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 0 20px;
           height: 60px;
           border-bottom: 1px solid #333;
           background: var(--bg-surface);
        }

        .workspace {
           display: flex;
           flex: 1;
           overflow: hidden;
        }

        .sidebar {
           width: 300px;
           background: var(--bg-surface);
           border-right: 1px solid var(--border);
           padding: 20px;
           display: flex;
           flex-direction: column;
           gap: 20px;
        }

        .layout-options {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
        }

        .layout-options button {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: var(--bg-app);
            border: 1px solid var(--border-light);
            border-radius: 6px;
            cursor: pointer;
            transition: 0.2s;
        }

        .layout-options button.active {
            border-color: var(--primary);
            background: rgba(0, 102, 255, 0.05);
            color: var(--primary);
        }

        .image-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .img-item {
            position: relative;
            aspect-ratio: 1;
            border-radius: 6px;
            overflow: hidden;
        }

        .img-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .remove-btn {
            position: absolute;
            top: 4px;
            right: 4px;
            background: rgba(0,0,0,0.6);
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            cursor: pointer;
        }

        .add-btn {
            aspect-ratio: 1;
            border: 2px dashed var(--border-light);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text-muted);
        }
        .add-btn:hover {
            border-color: var(--primary);
            color: var(--primary);
        }

        .preview-area {
            flex: 1;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            overflow: auto;
        }

        .collage-preview {
            max-width: 100%;
            max-height: 100%;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        .primary-btn {
             background: var(--primary);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            gap: 8px;
            align-items: center;
        }
         .primary-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
         }

         @media (max-width: 768px) {
            .workspace { flex-direction: column-reverse; }
            .sidebar { width: 100%; flex: none; height: auto; }
            .preview-area { height: 50vh; }
         }
      `}</style>
    </div>
  );
};

export default CollageEditor;
