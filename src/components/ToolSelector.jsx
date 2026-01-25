import { Minimize2, Maximize2, ArrowRight, Crop, Type, FileText, Eraser, Zap, Grid, EyeOff, User, Monitor, ShieldCheck } from 'lucide-react';

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

        <button className="tool-card screenshot" onClick={() => onSelectTool('screenshot-beautifier')}>
          <div className="icon-wrapper">
             <Monitor size={32} />
          </div>
          <div className="card-content">
            <h3>Screenshot Mockups <span className="badge">New</span></h3>
            <p>Add window frames, shadows, and backgrounds to screenshots.</p>
          </div>
          <div className="card-action">
             <span>Select</span> <ArrowRight size={16} />
          </div>
        </button>

        <button className="tool-card grid" onClick={() => onSelectTool('grid-splitter')}>
          <div className="icon-wrapper">
             <Grid size={32} />
          </div>
          <div className="card-content">
            <h3>Grid Splitter</h3>
            <p>Split images into 3x1, 3x2, or 3x3 grids for Instagram.</p>
          </div>
          <div className="card-action">
             <span>Select</span> <ArrowRight size={16} />
          </div>
        </button>

        <button className="tool-card profile" onClick={() => onSelectTool('profile-picture')}>
          <div className="icon-wrapper">
             <User size={32} />
          </div>
          <div className="card-content">
            <h3>Profile Pic Maker <span className="badge">New</span></h3>
            <p>Create professional profile pictures with custom backgrounds.</p>
          </div>
          <div className="card-action">
             <span>Select</span> <ArrowRight size={16} />
          </div>
        </button>

        <button className="tool-card exif" onClick={() => onSelectTool('exif-remover')}>
          <div className="icon-wrapper">
             <ShieldCheck size={32} />
          </div>
          <div className="card-content">
            <h3>EXIF Viewer & Remover</h3>
            <p>View and remove hidden metadata (GPS, Date) for privacy.</p>
          </div>
          <div className="card-action">
             <span>Select</span> <ArrowRight size={16} />
          </div>
        </button>

        <button className="tool-card redact" onClick={() => onSelectTool('redact')}>
          <div className="icon-wrapper">
             <EyeOff size={32} />
          </div>
          <div className="card-content">
            <h3>Privacy Blur</h3>
            <p>Redact sensitive info, faces, or text from screenshots.</p>
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
          padding: 60px 20px;
          position: relative;
          overflow: hidden;
        }

        /* Ambient Background Effect */
        .selector-container::before {
          content: '';
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 100vw;
          height: 600px;
          background: radial-gradient(circle at center, rgba(0, 102, 255, 0.08) 0%, transparent 70%);
          z-index: -1;
          pointer-events: none;
        }

        .selector-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
        }

        .selector-header h2 {
          font-size: 3rem;
          margin-bottom: 16px;
          background: linear-gradient(300deg, #000000, #555555, #0066ff);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 6s ease infinite;
          letter-spacing: -1px;
        }

        .selector-header p {
          color: var(--text-muted);
          font-size: 1.2rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 900px;
          perspective: 1000px;
        }

        .tool-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          border-radius: var(--radius-lg);
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        /* Staggered Animation delays */
        .tool-card:nth-child(1) { animation-delay: 0.1s; }
        .tool-card:nth-child(2) { animation-delay: 0.2s; }
        .tool-card:nth-child(3) { animation-delay: 0.3s; }
        .tool-card:nth-child(4) { animation-delay: 0.4s; }
        .tool-card:nth-child(5) { animation-delay: 0.5s; }
        .tool-card:nth-child(6) { animation-delay: 0.6s; }
        .tool-card:nth-child(7) { animation-delay: 0.7s; }

        .tool-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 20px 40px -5px rgba(0, 102, 255, 0.15);
        }

        .tool-card:hover .icon-wrapper {
          background: var(--primary);
          color: white;
          transform: scale(1.1) rotate(-5deg);
        }

        .icon-wrapper {
          width: 64px;
          height: 64px;
          background: var(--bg-surface);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: var(--primary);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .card-content {
          margin-bottom: 24px;
          z-index: 1;
        }

        .card-content h3 {
           font-size: 1.25rem;
           margin-bottom: 8px;
           color: var(--text-main);
           font-weight: 700;
        }

        .card-content p {
           color: var(--text-muted);
           font-size: 0.95rem;
           line-height: 1.6;
        }

        .card-action {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
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
          box-shadow: 0 2px 10px rgba(121, 40, 202, 0.3);
        }

        @keyframes fadeIn {
           from { opacity: 0; }
           to { opacity: 1; }
        }

        @keyframes fadeInUp {
           from { opacity: 0; transform: translateY(30px); }
           to { opacity: 1; transform: translateY(0); }
        }

        @keyframes gradientFlow {
           0% { background-position: 0% 50%; }
           50% { background-position: 100% 50%; }
           100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default ToolSelector;
