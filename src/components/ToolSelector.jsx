import { Minimize2, Maximize2, ArrowRight, Crop, Type, FileText, Eraser, Zap } from 'lucide-react';

const ToolSelector = ({ onSelectTool }) => {
  return (
    <div className="selector-container">
      <div className="selector-header">
        <h2>Select a Tool</h2>
        <p>Choose how you want to optimize your images today.</p>
      </div>

      <div className="cards-grid">
        <button className="tool-card compress" onClick={() => onSelectTool('compress')}>
          <div className="icon-wrapper">
             <Minimize2 size={32} />
          </div>
          <div className="card-content">
            <h3>Compress Image</h3>
            <p>Reduce file size while maintaining the best quality.</p>
          </div>
          <div className="card-action">
            <span>Select</span> <ArrowRight size={16} />
          </div>
        </button>

        <button className="tool-card resize" onClick={() => onSelectTool('resize')}>
          <div className="icon-wrapper">
             <Maximize2 size={32} />
          </div>
          <div className="card-content">
            <h3>Resize Image</h3>
            <p>Change dimensions (width & height) by pixels or percentage.</p>
          </div>
          <div className="card-action">
             <span>Select</span> <ArrowRight size={16} />
          </div>
        </button>

        <button className="tool-card crop" onClick={() => onSelectTool('crop')}>
          <div className="icon-wrapper">
             <Crop size={32} />
          </div>
          <div className="card-content">
            <h3>Crop Image</h3>
            <p>Crop for Instagram, YouTube, and other social media platforms.</p>
          </div>
          <div className="card-action">
             <span>Select</span> <ArrowRight size={16} />
          </div>
        </button>

       <button className="tool-card watermark" onClick={() => onSelectTool('watermark')}>
          <div className="icon-wrapper">
             <Type size={32} />
          </div>
          <div className="card-content">
            <h3>Watermark</h3>
            <p>Protect your work by adding text or logo overlays.</p>
          </div>
          <div className="card-action">
             <span>Select</span> <ArrowRight size={16} />
          </div>
        </button>

        <button className="tool-card pdf" onClick={() => onSelectTool('pdf')}>
          <div className="icon-wrapper">
             <FileText size={32} />
          </div>
          <div className="card-content">
            <h3>Images to PDF</h3>
            <p>Convert multiple images into a single PDF document instantly.</p>
          </div>
          <div className="card-action">
             <span>Select</span> <ArrowRight size={16} />
          </div>
        </button>

        <button className="tool-card remove-bg" onClick={() => onSelectTool('remove-bg')}>
          <div className="icon-wrapper">
             <Eraser size={32} />
          </div>
          <div className="card-content">
            <h3>Remove Background <span className="badge">AI</span></h3>
            <p>Automatically remove image backgrounds in one click.</p>
          </div>
          <div className="card-action">
             <span>Select</span> <ArrowRight size={16} />
          </div>
        </button>

        <button className="tool-card upscale" onClick={() => onSelectTool('upscale')}>
          <div className="icon-wrapper">
             <Zap size={32} />
          </div>
          <div className="card-content">
            <h3>AI Upscale <span className="badge">AI</span></h3>
            <p>Increase image resolution (2x, 4x) without losing quality.</p>
          </div>
          <div className="card-action">
             <span>Select</span> <ArrowRight size={16} />
          </div>
        </button>
      </div>

      <style>{`
        .selector-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          padding: 40px 20px;
          animation: fadeIn 0.5s ease-out;
        }

        .selector-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .selector-header h2 {
          font-size: 2rem;
          margin-bottom: 8px;
          background: linear-gradient(to right, #fff, #a1a1aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .selector-header p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 800px;
        }

        .tool-card {
          background: var(--bg-panel);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .tool-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .tool-card:hover .icon-wrapper {
          background: var(--primary);
          color: black;
          transform: scale(1.1);
        }

        .icon-wrapper {
          width: 56px;
          height: 56px;
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: var(--primary);
          transition: all 0.3s ease;
        }

        .card-content {
          margin-bottom: 24px;
        }

        .card-content h3 {
           font-size: 1.25rem;
           margin-bottom: 8px;
           color: var(--text-main);
        }

        .card-content p {
           color: var(--text-muted);
           font-size: 0.95rem;
           line-height: 1.5;
        }

        .card-action {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: var(--primary);
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
        }

        .tool-card:hover .card-action {
          opacity: 1;
          transform: translateX(0);
        }

        .badge {
          display: inline-block;
          background: linear-gradient(135deg, #FF0080, #7928CA);
          color: white;
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 12px;
          margin-left: 8px;
          vertical-align: middle;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

export default ToolSelector;
