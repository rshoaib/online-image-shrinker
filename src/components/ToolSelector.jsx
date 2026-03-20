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
  const [showAll, setShowAll] = useState(false);
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
    { id: 'compress', i18nKey: 'compress', icon: <Minimize2 size={32} />, featured: true, category: 'essential' },
    { id: 'resize', i18nKey: 'resize', icon: <Maximize2 size={32} />, featured: true, category: 'essential' },
    { id: 'crop', i18nKey: 'crop', icon: <Crop size={32} />, category: 'essential' },
    { id: 'remove-bg', i18nKey: 'remove_bg', icon: <Eraser size={32} />, badge: 'AI', featured: true, category: 'essential' },
    { id: 'upscale', i18nKey: 'upscale', icon: <Zap size={32} />, badge: 'AI', category: 'essential' },
    { id: 'magic-eraser', i18nKey: 'magic_eraser', icon: <Wand2 size={32} />, badge: 'AI', category: 'essential' },
    { id: 'image-converter', i18nKey: 'converter', icon: <Repeat size={32} />, featured: true, category: 'essential' },
    { id: 'pdf', i18nKey: 'pdf', icon: <FileText size={32} />, category: 'essential' },
    { id: 'watermark', i18nKey: 'watermark', icon: <Type size={32} />, category: 'creative' },
    { id: 'collage-maker', i18nKey: 'collage', icon: <LayoutTemplate size={32} />, category: 'creative' },
    { id: 'ocr', i18nKey: 'ocr', icon: <ScanLine size={32} />, category: 'essential' },
    { id: 'qr-code-generator', i18nKey: 'qr_code', icon: <QrCode size={32} />, category: 'creative' },
    { id: 'signature-maker', i18nKey: 'signature', icon: <PenTool size={32} />, category: 'creative' },
    { id: 'profile-picture', i18nKey: 'profile', icon: <User size={32} />, category: 'creative' },
    { id: 'grid-splitter', i18nKey: 'grid', icon: <Grid size={32} />, category: 'creative' },
    { id: 'redact', i18nKey: 'redact', icon: <EyeOff size={32} />, category: 'privacy' },
    { id: 'screenshot-beautifier', i18nKey: 'screenshot', icon: <Monitor size={32} />, category: 'creative' },
    { id: 'social-preview', i18nKey: 'social_preview', icon: <Share2 size={32} />, category: 'creative' },
    { id: 'exif', i18nKey: 'exif', icon: <Settings size={32} />, category: 'privacy' },
    { id: 'palette-generator', i18nKey: 'palette', icon: <Palette size={32} />, category: 'creative' },
    { id: 'meme-generator', i18nKey: 'meme', icon: <Smile size={32} />, category: 'creative' },
    { id: 'photo-filters', i18nKey: 'photo_filters', icon: <Sparkles size={32} />, category: 'creative' },
    { id: 'video-compressor', i18nKey: 'video_compressor', icon: <Video size={32} />, category: 'video' },
    { id: 'video-to-gif', i18nKey: 'video_to_gif', icon: <Film size={32} />, category: 'video' },
    { id: 'video-to-audio', i18nKey: 'video_to_audio', icon: <Music size={32} />, category: 'video' },
    { id: 'image-compare', i18nKey: 'image_compare', icon: <ArrowLeftRight size={32} />, category: 'essential' },
    { id: 'base64-converter', i18nKey: 'base64', icon: <Code size={32} />, category: 'developer' },
    { id: 'rotate-flip', i18nKey: 'rotate_flip', icon: <RotateCw size={32} />, category: 'essential' },
    { id: 'favicon-generator', i18nKey: 'favicon', icon: <Globe size={32} />, category: 'developer' },
    { id: 'blur-face', i18nKey: 'blur_face', icon: <ShieldCheck size={32} />, category: 'privacy' },
  ];

  // Filter tools by search query
  const isSearching = searchQuery.trim().length > 0;
  const filteredTools = isSearching
    ? [...tools, ...programmaticTools].filter(tool => {
        const title = tool.isProgrammatic ? tool.title.toLowerCase() : t(`home.tools.${tool.i18nKey}.title`).toLowerCase();
        const desc = tool.isProgrammatic ? tool.desc.toLowerCase() : t(`home.tools.${tool.i18nKey}.desc`).toLowerCase();
        const q = searchQuery.toLowerCase();
        return title.includes(q) || desc.includes(q) || tool.id.includes(q);
      })
    : tools;

  const renderTile = (tool, index) => (
    <div 
      key={tool.id} 
      className="tool-tile"
      onClick={() => tool.route ? router.push(tool.route) : onSelectTool(tool.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tool.route ? router.push(tool.route) : onSelectTool(tool.id);
        }
      }}
      role="button"
      tabIndex={0}
      style={{ animationDelay: `${index * 0.025}s` }}
    >
      <div className="tile-icon">
        {tool.icon}
      </div>
      <span className="tile-label">
        {tool.isProgrammatic ? tool.title : t(`home.tools.${tool.i18nKey}.title`)}
      </span>
      {tool.badge && <span className="tile-badge">{tool.badge}</span>}
    </div>
  );

  /* Group tools by category for organized display */
  const categories = [
    { key: 'essential', label: '🔧 Essential', ids: ['compress','resize','convert','batch'] },
    { key: 'creative', label: '🎨 Creative', ids: ['crop','rotate','filters','watermark','collage','meme','screenshot','color-picker','favicon','image-to-ascii'] },
    { key: 'ai', label: '🤖 AI-Powered', ids: ['remove-bg','upscale','ai-enhance'] },
    { key: 'privacy', label: '🔒 Privacy', ids: ['blur','redact','strip-exif'] },
    { key: 'convert', label: '📄 Convert & Export', ids: ['jpg-to-pdf','svg-to-png','ico-convert','base64','image-compare'] },
    { key: 'social', label: '📱 Social & QR', ids: ['social-resize','profile-pic','qr-code'] },
    { key: 'video', label: '🎬 Video & GIF', ids: ['gif-maker','video-compress','video-to-gif'] },
  ];

  const categorizedTools = categories.map(cat => ({
    ...cat,
    tools: cat.ids.map(id => tools.find(t => t.id === id)).filter(Boolean)
  })).filter(cat => cat.tools.length > 0);

  /* Uncategorized tools fallback */
  const categorizedIds = new Set(categories.flatMap(c => c.ids));
  const uncategorized = tools.filter(t => !categorizedIds.has(t.id));

  return (
    <div className="selector-container">
      <div className="selector-header">
        <div className="hero-badge">✨ 100% Private & Free — No Uploads</div>
        <h1>{t('home.title')}</h1>
        <p>{t('home.subtitle')}</p>
      </div>

      <StatsCounter />

      {/* Search */}
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
          <button className="search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">×</button>
        )}
      </div>

      <RecentTools onSelectTool={onSelectTool} />

      {isSearching ? (
        <div className="tile-grid">
          {filteredTools.length === 0 && (
            <div className="no-results"><p>No tools found for &quot;{searchQuery}&quot;</p></div>
          )}
          {filteredTools.map((tool, i) => renderTile(tool, i))}
        </div>
      ) : (
        <div className="tools-dashboard">
          {categorizedTools.map((cat) => (
            <div key={cat.key} className="tool-category">
              <h2 className="category-label">{cat.label}</h2>
              <div className="tile-grid">
                {cat.tools.map((tool, i) => renderTile(tool, i))}
              </div>
            </div>
          ))}
          {uncategorized.length > 0 && (
            <div className="tool-category">
              <h2 className="category-label">🧰 More Tools</h2>
              <div className="tile-grid">
                {uncategorized.map((tool, i) => renderTile(tool, i))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="trust-sections">
        <HowItWorks />
        <FAQSection />
      </div>

      <style>{`
        .selector-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          padding: 32px 20px;
          position: relative;
          overflow: hidden;
        }

        .selector-container::before {
          content: '';
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 100vw;
          height: 400px;
          background: radial-gradient(circle at center, rgba(0, 102, 255, 0.06) 0%, transparent 70%);
          z-index: -1;
          pointer-events: none;
        }

        .selector-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(0, 102, 255, 0.1);
          color: var(--primary);
          padding: 5px 14px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 12px;
          border: 1px solid var(--primary-glow);
        }

        .selector-header h1 {
          font-size: 2.2rem;
          margin-bottom: 8px;
          background: linear-gradient(300deg, var(--text-main), var(--text-muted), var(--primary));
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 6s ease infinite;
          letter-spacing: -0.5px;
        }

        .selector-header p {
          color: var(--text-muted);
          font-size: 1rem;
          max-width: 460px;
          margin: 0 auto;
        }

        .search-bar-wrapper {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 420px;
          margin-bottom: 16px;
          background: var(--bg-panel);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          padding: 8px 16px;
          gap: 8px;
          transition: all var(--transition-smooth);
        }

        .search-bar-wrapper:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .search-icon { color: var(--text-dim); flex-shrink: 0; }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--text-main);
          font-size: 0.9rem;
          outline: none;
          font-family: inherit;
        }

        .search-input::placeholder { color: var(--text-dim); }

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
          padding: 24px;
          color: var(--text-muted);
        }

        .trust-sections {
          width: 100%;
          margin-top: 32px;
        }

        /* ===== Tools Dashboard ===== */
        .tools-dashboard {
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .tool-category {
          width: 100%;
        }

        .category-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 10px;
          padding-left: 4px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        /* ===== Icon Tile Grid ===== */
        .tile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 10px;
          width: 100%;
          max-width: 900px;
        }

        .tool-tile {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 14px 8px;
          border-radius: var(--radius-md);
          background: var(--bg-panel);
          border: 1px solid var(--border-light);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          opacity: 0;
          animation: tileIn 0.35s ease forwards;
        }

        .tool-tile:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: 0 8px 24px -4px var(--primary-glow);
          background: var(--bg-surface);
        }

        .tool-tile:active {
          transform: translateY(-1px) scale(0.98);
        }

        .tile-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--bg-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          margin-bottom: 8px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .tile-icon svg {
          width: 20px;
          height: 20px;
        }

        .tool-tile:hover .tile-icon {
          background: var(--primary);
          color: white;
          transform: scale(1.1) rotate(-5deg);
          box-shadow: 0 6px 16px -4px var(--primary-glow);
        }

        .tile-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tile-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: linear-gradient(135deg, #FF0080, #7928CA);
          color: white;
          font-size: 0.55rem;
          padding: 1px 5px;
          border-radius: 8px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        @keyframes tileIn {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @media (max-width: 768px) {
          .selector-header h1 {
            font-size: 1.6rem;
          }
          .selector-header {
            margin-bottom: 14px;
          }
          .tile-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 8px;
          }
          .tool-tile {
            padding: 10px 6px;
          }
          .tile-icon {
            width: 34px;
            height: 34px;
          }
          .tile-icon svg {
            width: 17px;
            height: 17px;
          }
          .tile-label {
            font-size: 0.7rem;
          }
        }

        @media (max-width: 480px) {
          .tile-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default ToolSelector;
