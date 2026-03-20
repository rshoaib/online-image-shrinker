'use client';
import { useState } from 'react';
import StatsCounter from './StatsCounter';
import RecentTools from './RecentTools';
import HowItWorks from './HowItWorks';
import FAQSection from './FAQSection';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { passportPages, ecommercePages } from '../data/seoTemplates';
import { 
  Maximize2, Zap, Type, FileText, Eraser, Crop, Grid, EyeOff, 
  User, Monitor, Settings, Repeat, Palette, PenTool, ScanLine, 
  Minimize2, Wand2, QrCode, Video, Film, Music, LayoutTemplate, Smile, Sparkles, ArrowLeftRight, Share2, Code, RotateCw,
  Search, Globe, ShieldCheck
} from 'lucide-react';

const ToolSelector = ({ onSelectTool }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const programmaticTools = [
    ...passportPages.map(p => ({
      id: `prog-pass-${p.slug}`,
      title: p.label,
      desc: `Make a ${p.label}`,
      icon: <User size={32} />,
      isProgrammatic: true,
      route: `/passport-photo-${p.slug}`
    })),
    ...ecommercePages.map(p => ({
      id: `prog-eco-${p.slug}`,
      title: p.label,
      desc: `Format image for ${p.label}`,
      icon: <Crop size={32} />,
      isProgrammatic: true,
      route: `/${p.slug}-image-requirements-checker`
    }))
  ];

  const tools = [
    { id: 'compress', i18nKey: 'compress', icon: <Minimize2 size={32} />, featured: true },
    { id: 'resize', i18nKey: 'resize', icon: <Maximize2 size={32} />, featured: true },
    { id: 'crop', i18nKey: 'crop', icon: <Crop size={32} /> },
    { id: 'remove-bg', i18nKey: 'remove_bg', icon: <Eraser size={32} />, badge: 'AI', featured: true },
    { id: 'upscale', i18nKey: 'upscale', icon: <Zap size={32} />, badge: 'AI' },
    { id: 'magic-eraser', i18nKey: 'magic_eraser', icon: <Wand2 size={32} />, badge: 'AI' },
    { id: 'image-converter', i18nKey: 'converter', icon: <Repeat size={32} />, featured: true },
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
    { id: 'base64-converter', i18nKey: 'base64', icon: <Code size={32} /> },
    { id: 'rotate-flip', i18nKey: 'rotate_flip', icon: <RotateCw size={32} /> },
    { id: 'favicon-generator', i18nKey: 'favicon', icon: <Globe size={32} /> },
    { id: 'blur-face', i18nKey: 'blur_face', icon: <ShieldCheck size={32} /> },
  ];

  // Filter tools by search query
  const filteredTools = searchQuery.trim()
    ? [...tools, ...programmaticTools].filter(tool => {
        const title = tool.isProgrammatic ? tool.title.toLowerCase() : t(`home.tools.${tool.i18nKey}.title`).toLowerCase();
        const desc = tool.isProgrammatic ? tool.desc.toLowerCase() : t(`home.tools.${tool.i18nKey}.desc`).toLowerCase();
        const q = searchQuery.toLowerCase();
        return title.includes(q) || desc.includes(q) || tool.id.includes(q);
      })
    : tools;

  return (
    <div className="selector-container">
      {/* ... existing header ... */}
      <div className="selector-header">
        <StatsCounter />
        <div className="hero-badge">✨ 100% Private & Free</div>
        <h1>{t('home.title')}</h1>
        <p>{t('home.subtitle')}</p>
      </div>

      {/* Search/Filter Bar */}
      <div className="search-bar-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={t('home.search_placeholder') || 'Search tools...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search tools"
          id="tool-search"
        />
        {searchQuery && (
          <button
            className="search-clear"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      <RecentTools onSelectTool={onSelectTool} />
      <div className="cards-grid">
        {filteredTools.length === 0 && (
          <div className="no-results">
            <p>No tools found for "{searchQuery}"</p>
          </div>
        )}
        {filteredTools.map((tool, index) => (
          <div 
            key={tool.id} 
            className={`tool-card ${tool.featured ? 'featured-card' : ''}`}
            onClick={() => tool.route ? router.push(tool.route) : onSelectTool(tool.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tool.route ? router.push(tool.route) : onSelectTool(tool.id);
              }
            }}
            role="button"
            tabIndex={0}
            style={{ animationDelay: `${index * 0.04}s` }}
          >
            <div className="icon-wrapper">
              {tool.icon}
            </div>
            <div className="card-content">
              <h3>
                {tool.isProgrammatic ? tool.title : t(`home.tools.${tool.i18nKey}.title`)}
                {tool.badge && <span className="badge">{tool.badge}</span>}
              </h3>
              <p>{tool.isProgrammatic ? tool.desc : t(`home.tools.${tool.i18nKey}.desc`)}</p>
            </div>
            {tool.featured && (
              <div className="card-action">
                 Try it out <span>→</span>
              </div>
            )}
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
          margin-bottom: 40px;
          position: relative;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(0, 102, 255, 0.1);
          color: var(--primary);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 24px;
          border: 1px solid var(--primary-glow);
          backdrop-filter: blur(4px);
        }

        .selector-header h1 {
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

        /* Search Bar */
        .search-bar-wrapper {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 500px;
          margin-bottom: 40px;
          background: var(--bg-panel);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          padding: 10px 20px;
          gap: 10px;
          transition: all var(--transition-smooth);
        }

        .search-bar-wrapper:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .search-icon {
          color: var(--text-dim);
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--text-main);
          font-size: 1rem;
          outline: none;
          font-family: inherit;
        }

        .search-input::placeholder {
          color: var(--text-dim);
        }

        .search-clear {
          background: var(--bg-surface);
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
          line-height: 1;
        }

        .search-clear:hover {
          background: var(--border-active);
          color: var(--text-main);
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px 20px;
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 1000px; /* Wider for Bento */
          perspective: 1000px;
          grid-auto-flow: dense;
        }

        .tool-card {
          background: var(--bg-panel);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-light);
          box-shadow: 0 4px 24px -4px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
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
          animation: fadeInUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .tool-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--primary);
          background: var(--bg-surface);
          box-shadow: 0 20px 40px -5px var(--primary-glow);
        }

        .tool-card:hover .icon-wrapper {
          background: var(--primary);
          color: white;
          transform: scale(1.1) rotate(-8deg);
          box-shadow: 0 10px 20px -5px var(--primary-glow);
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
           from { opacity: 0; transform: translateY(40px); }
           to { opacity: 1; transform: translateY(0); }
        }

        @keyframes gradientFlow {
           0% { background-position: 0% 50%; }
           50% { background-position: 100% 50%; }
           100% { background-position: 0% 50%; }
        }

        @media (min-width: 768px) {
          .featured-card {
             grid-column: span 2;
          }
          .featured-card .card-content p {
             max-width: 80%;
          }
        }

        @media (max-width: 600px) {
          .selector-header h1 {
            font-size: 2rem;
          }
          .selector-header {
            margin-bottom: 24px;
          }
          .search-bar-wrapper {
            margin-bottom: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default ToolSelector;
