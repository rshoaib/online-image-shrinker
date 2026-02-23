import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Maximize2, Zap, Type, FileText, Eraser, Crop, Grid, EyeOff,
  User, Monitor, Settings, Repeat, Palette, PenTool, ScanLine,
  Minimize2, Wand2, QrCode, Video, Film, Music, LayoutTemplate, Smile, Sparkles, ArrowLeftRight, Share2
} from 'lucide-react';

const toolMeta = {
  'compress':              { icon: Minimize2, i18n: 'compress', path: '/tool/compress' },
  'resize':                { icon: Maximize2, i18n: 'resize', path: '/tool/resize' },
  'crop':                  { icon: Crop, i18n: 'crop', path: '/tool/crop' },
  'remove-bg':             { icon: Eraser, i18n: 'remove_bg', path: '/remove-background' },
  'upscale':               { icon: Zap, i18n: 'upscale', path: '/ai-image-upscaler' },
  'magic-eraser':          { icon: Wand2, i18n: 'magic_eraser', path: '/magic-eraser' },
  'image-converter':       { icon: Repeat, i18n: 'converter', path: '/image-converter-online' },
  'pdf':                   { icon: FileText, i18n: 'pdf', path: '/tool/pdf' },
  'watermark':             { icon: Type, i18n: 'watermark', path: '/watermark-photos-online' },
  'collage-maker':         { icon: LayoutTemplate, i18n: 'collage', path: '/collage-maker' },
  'ocr':                   { icon: ScanLine, i18n: 'ocr', path: '/image-to-text' },
  'qr-code-generator':     { icon: QrCode, i18n: 'qr_code', path: '/qr-code-generator' },
  'signature-maker':       { icon: PenTool, i18n: 'signature', path: '/signature-maker' },
  'profile-picture':       { icon: User, i18n: 'profile', path: '/profile-picture-maker' },
  'grid-splitter':         { icon: Grid, i18n: 'grid', path: '/instagram-grid-maker' },
  'redact':                { icon: EyeOff, i18n: 'redact', path: '/blur-image-online' },
  'screenshot-beautifier': { icon: Monitor, i18n: 'screenshot', path: '/screenshot-beautifier' },
  'social-preview':        { icon: Share2, i18n: 'social_preview', path: '/social-media-preview-generator' },
  'exif':                  { icon: Settings, i18n: 'exif', path: '/exif-remover' },
  'palette-generator':     { icon: Palette, i18n: 'palette', path: '/color-palette-generator' },
  'meme-generator':        { icon: Smile, i18n: 'meme', path: '/meme-generator-online' },
  'photo-filters':         { icon: Sparkles, i18n: 'photo_filters', path: '/photo-filters-online' },
  'video-compressor':      { icon: Video, i18n: 'video_compressor', path: '/tool/video-compressor' },
  'video-to-gif':          { icon: Film, i18n: 'video_to_gif', path: '/tool/video-to-gif' },
  'video-to-audio':        { icon: Music, i18n: 'video_to_audio', path: '/tool/video-to-audio' },
  'image-compare':         { icon: ArrowLeftRight, i18n: 'image_compare', path: '/compare-images-online' },
  'passport':              { icon: User, i18n: 'profile', path: '/resize-passport-photo' },
  'favicon-generator':     { icon: Monitor, i18n: 'favicon', path: '/favicon-generator' },
  'svg-to-png':            { icon: Repeat, i18n: 'svg_to_png', path: '/svg-to-png' },
};

// Related tools grouped by semantic similarity
const relatedMap = {
  'compress':              ['resize', 'pdf', 'image-converter', 'photo-filters'],
  'resize':                ['crop', 'compress', 'profile-picture', 'grid-splitter'],
  'crop':                  ['resize', 'profile-picture', 'passport', 'grid-splitter'],
  'remove-bg':             ['upscale', 'profile-picture', 'magic-eraser', 'photo-filters'],
  'upscale':               ['remove-bg', 'compress', 'photo-filters', 'resize'],
  'magic-eraser':          ['remove-bg', 'redact', 'photo-filters', 'upscale'],
  'image-converter':       ['compress', 'resize', 'svg-to-png', 'pdf'],
  'pdf':                   ['compress', 'image-converter', 'ocr', 'watermark'],
  'watermark':             ['pdf', 'screenshot-beautifier', 'social-preview', 'meme-generator'],
  'collage-maker':         ['grid-splitter', 'crop', 'resize', 'photo-filters'],
  'ocr':                   ['pdf', 'exif', 'image-converter', 'crop'],
  'qr-code-generator':     ['signature-maker', 'favicon-generator', 'social-preview', 'watermark'],
  'signature-maker':       ['qr-code-generator', 'watermark', 'pdf', 'profile-picture'],
  'profile-picture':       ['remove-bg', 'crop', 'resize', 'photo-filters'],
  'grid-splitter':         ['crop', 'collage-maker', 'resize', 'social-preview'],
  'redact':                ['magic-eraser', 'exif', 'remove-bg', 'crop'],
  'screenshot-beautifier': ['social-preview', 'watermark', 'crop', 'meme-generator'],
  'social-preview':        ['screenshot-beautifier', 'watermark', 'resize', 'meme-generator'],
  'exif':                  ['redact', 'compress', 'image-converter', 'ocr'],
  'palette-generator':     ['photo-filters', 'profile-picture', 'image-converter', 'collage-maker'],
  'meme-generator':        ['watermark', 'social-preview', 'screenshot-beautifier', 'crop'],
  'photo-filters':         ['palette-generator', 'upscale', 'compress', 'profile-picture'],
  'video-compressor':      ['compress', 'video-to-gif', 'video-to-audio', 'pdf'],
  'video-to-gif':          ['video-compressor', 'video-to-audio', 'meme-generator', 'crop'],
  'video-to-audio':        ['video-compressor', 'video-to-gif', 'ocr', 'compress'],
  'image-compare':         ['compress', 'upscale', 'photo-filters', 'resize'],
  'passport':              ['crop', 'remove-bg', 'resize', 'profile-picture'],
  'favicon-generator':     ['svg-to-png', 'resize', 'image-converter', 'crop'],
  'svg-to-png':            ['favicon-generator', 'image-converter', 'resize', 'compress'],
};

const RelatedTools = ({ currentTool }) => {
  const { t } = useTranslation();
  const ids = relatedMap[currentTool];
  if (!ids) return null;

  // Take first 4 related tools
  const related = ids.slice(0, 4).map(id => ({ id, ...toolMeta[id] })).filter(r => r.icon);

  if (related.length === 0) return null;

  return (
    <nav className="related-tools" aria-label="Related tools">
      <div className="related-header">
        <h2>You May Also Like</h2>
        <p>Explore more free, privacy-first tools.</p>
      </div>
      <div className="related-grid">
        {related.map(tool => {
          const Icon = tool.icon;
          return (
            <Link key={tool.id} to={tool.path} className="related-card">
              <div className="related-icon"><Icon size={24} /></div>
              <div className="related-info">
                <h3>{t(`home.tools.${tool.i18n}.title`)}</h3>
                <p>{t(`home.tools.${tool.i18n}.desc`)}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <style>{`
        .related-tools {
          max-width: 900px;
          margin: 60px auto;
          padding: 0 20px;
        }
        .related-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .related-header h2 {
          font-size: 1.8rem;
          color: var(--text-main);
          margin-bottom: 8px;
        }
        .related-header p {
          color: var(--text-muted);
          font-size: 1rem;
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        .related-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
        }
        .related-card:hover {
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,102,255,0.1);
        }
        .related-card:hover .related-icon {
          background: var(--primary);
          color: white;
        }
        .related-icon {
          width: 44px;
          height: 44px;
          min-width: 44px;
          background: rgba(0,102,255,0.08);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          transition: all 0.3s ease;
        }
        .related-info h3 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 2px;
        }
        .related-info p {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .related-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </nav>
  );
};

export default RelatedTools;
