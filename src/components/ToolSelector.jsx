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
  Search, Globe, ShieldCheck, Shield, Lock, Cpu
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
      icon: <User size={22} />,
      isProgrammatic: true,
      route: `/passport-photo-${p.slug}`
    })),
    ...ecommercePages.map(p => ({
      id: `prog-eco-${p.slug}`,
      title: p.label,
      desc: `Format image for ${p.label}`,
      icon: <Crop size={22} />,
      isProgrammatic: true,
      route: `/${p.slug}-image-requirements-checker`
    }))
  ];

  const tools = [
    { id: 'compress', i18nKey: 'compress', icon: <Minimize2 size={22} />, featured: true },
    { id: 'resize', i18nKey: 'resize', icon: <Maximize2 size={22} />, featured: true },
    { id: 'crop', i18nKey: 'crop', icon: <Crop size={22} /> },
    { id: 'remove-bg', i18nKey: 'remove_bg', icon: <Eraser size={22} />, badge: 'AI', featured: true },
    { id: 'upscale', i18nKey: 'upscale', icon: <Zap size={22} />, badge: 'AI' },
    { id: 'magic-eraser', i18nKey: 'magic_eraser', icon: <Wand2 size={22} />, badge: 'AI' },
    { id: 'image-converter', i18nKey: 'converter', icon: <Repeat size={22} />, featured: true },
    { id: 'pdf', i18nKey: 'pdf', icon: <FileText size={22} /> },
    { id: 'watermark', i18nKey: 'watermark', icon: <Type size={22} /> },
    { id: 'collage-maker', i18nKey: 'collage', icon: <LayoutTemplate size={22} /> },
    { id: 'ocr', i18nKey: 'ocr', icon: <ScanLine size={22} /> },
    { id: 'qr-code-generator', i18nKey: 'qr_code', icon: <QrCode size={22} /> },
    { id: 'signature-maker', i18nKey: 'signature', icon: <PenTool size={22} /> },
    { id: 'profile-picture', i18nKey: 'profile', icon: <User size={22} /> },
    { id: 'grid-splitter', i18nKey: 'grid', icon: <Grid size={22} /> },
    { id: 'redact', i18nKey: 'redact', icon: <EyeOff size={22} /> },
    { id: 'screenshot-beautifier', i18nKey: 'screenshot', icon: <Monitor size={22} /> },
    { id: 'social-preview', i18nKey: 'social_preview', icon: <Share2 size={22} /> },
    { id: 'exif', i18nKey: 'exif', icon: <Settings size={22} /> },
    { id: 'palette-generator', i18nKey: 'palette', icon: <Palette size={22} /> },
    { id: 'meme-generator', i18nKey: 'meme', icon: <Smile size={22} /> },
    { id: 'photo-filters', i18nKey: 'photo_filters', icon: <Sparkles size={22} /> },
    { id: 'video-compressor', i18nKey: 'video_compressor', icon: <Video size={22} /> },
    { id: 'video-to-gif', i18nKey: 'video_to_gif', icon: <Film size={22} /> },
    { id: 'video-to-audio', i18nKey: 'video_to_audio', icon: <Music size={22} /> },
    { id: 'image-compare', i18nKey: 'image_compare', icon: <ArrowLeftRight size={22} /> },
    { id: 'base64-converter', i18nKey: 'base64', icon: <Code size={22} /> },
    { id: 'rotate-flip', i18nKey: 'rotate_flip', icon: <RotateCw size={22} /> },
    { id: 'favicon-generator', i18nKey: 'favicon', icon: <Globe size={22} /> },
    { id: 'blur-face', i18nKey: 'blur_face', icon: <ShieldCheck size={22} /> },
    { id: 'change-bg-color', i18nKey: 'change_bg_color', icon: <Palette size={22} />, badge: 'AI' },
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
      <div className="selector-header">
        <div className="hero-badge">🔒 100% Private & Free</div>
        <h1>{t('home.title')}</h1>
        <p>{t('home.subtitle')}</p>
      </div>

      <StatsCounter />

      {/* Trust Strip — compact value props */}
      <div className="trust-strip">
        <div className="trust-item">
          <Shield size={16} />
          <span>100% Private</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">
          <Zap size={16} />
          <span>Lightning Fast</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">
          <Cpu size={16} />
          <span>Runs Locally</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">
          <Lock size={16} />
          <span>No Sign-up</span>
        </div>
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
            ✕
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
            className="tool-card"
            onClick={() => tool.route ? router.push(tool.route) : onSelectTool(tool.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tool.route ? router.push(tool.route) : onSelectTool(tool.id);
              }
            }}
            role="button"
            tabIndex={0}
            style={{ animationDelay: `${index * 0.03}s` }}
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
          </div>
        ))}
      </div>
      
      <div className="trust-sections">
        <HowItWorks />
        <FAQSection />
      </div>

      <style>{`
        .selector-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          padding: 36px 20px 40px;
          position: relative;
          overflow: hidden;
        }

        .trust-sections {
           width: 100%;
           margin-top: 32px;
        }

        /* Subtle warm gradient accent */
        .selector-container::before {
          content: '';
          position: absolute;
          top: -30%;
          left: 50%;
          transform: translateX(-50%);
          width: 120vw;
          height: 500px;
          background: radial-gradient(ellipse at center, rgba(0, 102, 255, 0.04) 0%, rgba(120, 80, 255, 0.02) 40%, transparent 70%);
          z-index: -1;
          pointer-events: none;
        }

        .selector-header {
          text-align: center;
          margin-bottom: 24px;
          position: relative;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(0, 102, 255, 0.06);
          color: var(--primary);
          padding: 5px 14px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 16px;
          border: 1px solid rgba(0, 102, 255, 0.12);
        }

        .selector-header h1 {
          font-size: 2.75rem;
          margin-bottom: 12px;
          background: linear-gradient(300deg, var(--text-main), var(--text-muted), var(--primary));
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 6s ease infinite;
          letter-spacing: -1px;
        }

        .selector-header p {
          color: var(--text-muted);
          font-size: 1.1rem;
          max-width: 480px;
          margin: 0 auto;
        }

        /* Trust Strip */
        .trust-strip {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 20px;
          padding: 8px 20px;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          animation: fadeInUp 0.5s ease-out 0.2s both;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 14px;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .trust-item svg {
          color: var(--primary);
          flex-shrink: 0;
        }

        .trust-divider {
          width: 1px;
          height: 20px;
          background: var(--border-light);
          flex-shrink: 0;
        }

        /* Search Bar */
        .search-bar-wrapper {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 460px;
          margin-bottom: 24px;
          background: var(--bg-panel);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          padding: 8px 18px;
          gap: 10px;
          transition: all var(--transition-smooth);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
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
          font-size: 0.95rem;
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
          font-size: 1.1rem;
          width: 22px;
          height: 22px;
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
          padding: 32px 20px;
          color: var(--text-muted);
          font-size: 1rem;
        }

        /* Compact Card Grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px;
          width: 100%;
          max-width: 1000px;
        }

        .tool-card {
          background: var(--bg-panel);
          border: 1px solid var(--border-light);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          text-align: left;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          opacity: 0;
          animation: fadeInUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .tool-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: 0 8px 24px -4px rgba(0, 102, 255, 0.12);
        }

        .tool-card:hover .icon-wrapper {
          background: var(--primary);
          color: white;
          transform: scale(1.08);
          box-shadow: 0 4px 12px -2px var(--primary-glow);
        }

        .icon-wrapper {
          width: 44px;
          height: 44px;
          min-width: 44px;
          background: var(--bg-surface);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .card-content {
          flex: 1;
          min-width: 0;
        }

        .card-content h3 {
           font-size: 0.95rem;
           margin-bottom: 3px;
           color: var(--text-main);
           font-weight: 650;
           line-height: 1.3;
        }

        .card-content p {
           color: var(--text-muted);
           font-size: 0.8rem;
           line-height: 1.5;
           display: -webkit-box;
           -webkit-line-clamp: 2;
           -webkit-box-orient: vertical;
           overflow: hidden;
        }

        .badge {
          display: inline-block;
          background: linear-gradient(135deg, #FF0080, #7928CA);
          color: white;
          font-size: 0.6rem;
          padding: 1px 6px;
          border-radius: 10px;
          margin-left: 6px;
          vertical-align: middle;
          font-weight: 700;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(121, 40, 202, 0.25);
        }

        @keyframes fadeIn {
           from { opacity: 0; }
           to { opacity: 1; }
        }

        @keyframes fadeInUp {
           from { opacity: 0; transform: translateY(20px); }
           to { opacity: 1; transform: translateY(0); }
        }

        @keyframes gradientFlow {
           0% { background-position: 0% 50%; }
           50% { background-position: 100% 50%; }
           100% { background-position: 0% 50%; }
        }

        @media (max-width: 600px) {
          .selector-header h1 {
            font-size: 1.9rem;
          }
          .selector-header {
            margin-bottom: 16px;
          }
          .selector-header p {
            font-size: 0.95rem;
          }
          .search-bar-wrapper {
            margin-bottom: 16px;
          }
          .cards-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .trust-strip {
            flex-wrap: wrap;
            border-radius: var(--radius-lg);
            gap: 4px;
            padding: 8px 12px;
            justify-content: center;
          }
          .trust-divider {
            display: none;
          }
          .trust-item {
            padding: 4px 10px;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ToolSelector;
