import HowItWorks from './HowItWorks';
import FAQSection from './FAQSection';

import { useTranslation } from 'react-i18next';
import { 
  Maximize2, Zap, Type, FileText, Eraser, Crop, Grid, EyeOff, 
  User, Monitor, Settings, Repeat, Palette, PenTool, ScanLine, 
  Minimize2, Wand2, QrCode, Video, Film, Music, LayoutTemplate, Smile, Sparkles, ArrowLeftRight, Share2 
} from 'lucide-react';

const ToolSelector = ({ onSelectTool }) => {
  const { t } = useTranslation();

  const tools = [
    { id: 'compress', i18nKey: 'compress', icon: <Minimize2 size={32} /> },
    { id: 'resize', i18nKey: 'resize', icon: <Maximize2 size={32} /> },
    { id: 'crop', i18nKey: 'crop', icon: <Crop size={32} /> },
    { id: 'remove-bg', i18nKey: 'remove_bg', icon: <Eraser size={32} />, badge: 'AI' },
    { id: 'upscale', i18nKey: 'upscale', icon: <Zap size={32} />, badge: 'AI' },
    { id: 'magic-eraser', i18nKey: 'magic_eraser', icon: <Wand2 size={32} />, badge: 'AI' },
    { id: 'image-converter', i18nKey: 'converter', icon: <Repeat size={32} /> },
    { id: 'pdf', i18nKey: 'pdf', icon: <FileText size={32} /> },
    { id: 'watermark', i18nKey: 'watermark', icon: <Type size={32} /> },
    { id: 'collage-maker', i18nKey: 'collage', icon: <LayoutTemplate size={32} /> },
    { id: 'ocr', i18nKey: 'ocr', icon: <ScanLine size={32} /> },
    { id: 'qr-code-generator', i18nKey: 'qr_code', icon: <QrCode size={32} /> },
    { id: 'signature-maker', i18nKey: 'signature', icon: <PenTool size={32} /> },
    { id: 'profile-picture', i18nKey: 'profile', icon: <User size={32} /> },
    { id: 'grid-splitter', i18nKey: 'grid', icon: <Grid size={32} /> },
    { id: 'redact', i18nKey: 'redact', icon: <EyeOff size={32} /> },
    { id: 'screenshot-beautifier', i18nKey: 'screenshot', icon: <Monitor size={32} /> },
    { id: 'social-preview', i18nKey: 'social_preview', icon: <Share2 size={32} /> },
    { id: 'exif', i18nKey: 'exif', icon: <Settings size={32} /> },
    { id: 'palette-generator', i18nKey: 'palette', icon: <Palette size={32} /> },
    { id: 'meme-generator', i18nKey: 'meme', icon: <Smile size={32} /> },
    { id: 'photo-filters', i18nKey: 'photo_filters', icon: <Sparkles size={32} /> },
    { id: 'video-compressor', i18nKey: 'video_compressor', icon: <Video size={32} /> },
    { id: 'video-to-gif', i18nKey: 'video_to_gif', icon: <Film size={32} /> },
    { id: 'video-to-audio', i18nKey: 'video_to_audio', icon: <Music size={32} /> },
    { id: 'image-compare', i18nKey: 'image_compare', icon: <ArrowLeftRight size={32} /> },
  ];

  return (
    <div className="selector-container">
      {/* ... existing header ... */}
      <div className="selector-header">
        <h2>{t('home.title')}</h2>
        <p>{t('home.subtitle')}</p>
      </div>

      <div className="cards-grid">
        {tools.map((tool) => (
          <div 
            key={tool.id} 
            className="tool-card" 
            onClick={() => onSelectTool(tool.id)}
            role="button"
            tabIndex={0}
          >
            <div className="icon-wrapper">
              {tool.icon}
            </div>
            <div className="card-content">
              <h3>
                {t(`home.tools.${tool.i18nKey}.title`)}
                {tool.badge && <span className="badge">{tool.badge}</span>}
              </h3>
              <p>{t(`home.tools.${tool.i18nKey}.desc`)}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="trust-sections">
        <HowItWorks />
        <FAQSection />
      </div>

      <style>{`
        /* ... existing styles ... */
        .trust-sections {
           width: 100%;
           margin-top: 40px;
        }

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

        .trust-sections {
           width: 100%;
           margin-top: 40px;
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
          background: linear-gradient(300deg, var(--text-main), var(--text-muted), var(--primary));
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
          background: var(--bg-panel);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-light);
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
          background: var(--bg-surface);
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
