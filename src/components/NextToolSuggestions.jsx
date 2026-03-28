'use client';
import { ArrowRight } from 'lucide-react';

// Map each toolId to 2-3 contextually relevant next tools
const SUGGESTIONS = {
  'compress': [
    { id: 'resize', label: 'Resize Image', emoji: '📐' },
    { id: 'remove-bg', label: 'Remove Background', emoji: '✂️' },
    { id: 'watermark', label: 'Add Watermark', emoji: '🔒' },
  ],
  'resize': [
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'crop', label: 'Crop Image', emoji: '✂️' },
    { id: 'photo-filters', label: 'Add Filters', emoji: '🎨' },
  ],
  'remove-bg': [
    { id: 'change-bg-color', label: 'Change Background', emoji: '🎨' },
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'profile-picture', label: 'Profile Pic Maker', emoji: '👤' },
  ],
  'crop': [
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'watermark', label: 'Add Watermark', emoji: '🔒' },
    { id: 'photo-filters', label: 'Add Filters', emoji: '🎨' },
  ],
  'watermark': [
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'resize', label: 'Resize It', emoji: '📐' },
  ],
  'photo-filters': [
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'crop', label: 'Crop Image', emoji: '✂️' },
    { id: 'watermark', label: 'Add Watermark', emoji: '🔒' },
  ],
  'blur-face': [
    { id: 'exif', label: 'Strip EXIF Data', emoji: '🛡️' },
    { id: 'redact', label: 'Redact Text', emoji: '🖊️' },
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
  ],
  'exif': [
    { id: 'blur-face', label: 'Blur Faces', emoji: '🫥' },
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
  ],
  'rotate-flip': [
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'crop', label: 'Crop Image', emoji: '✂️' },
    { id: 'photo-filters', label: 'Add Filters', emoji: '🎨' },
  ],
  'image-converter': [
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'resize', label: 'Resize It', emoji: '📐' },
    { id: 'svg-to-png', label: 'SVG → PNG', emoji: '🖼️' },
  ],
  'favicon-generator': [
    { id: 'svg-to-png', label: 'SVG to PNG', emoji: '🖼️' },
    { id: 'compress', label: 'Compress PNGs', emoji: '⚡' },
  ],
  'batch': [
    { id: 'compress', label: 'Compress Images', emoji: '⚡' },
    { id: 'resize', label: 'Resize Images', emoji: '📐' },
    { id: 'image-converter', label: 'Convert Format', emoji: '🔄' },
  ],
  'magic-eraser': [
    { id: 'remove-bg', label: 'Remove Background', emoji: '✂️' },
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'upscale', label: 'Upscale Image', emoji: '🔍' },
  ],
  'upscale': [
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'watermark', label: 'Add Watermark', emoji: '🔒' },
    { id: 'photo-filters', label: 'Add Filters', emoji: '🎨' },
  ],
  'meme': [
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'crop', label: 'Crop Image', emoji: '✂️' },
    { id: 'watermark', label: 'Add Watermark', emoji: '🔒' },
  ],
  'qr-code': [
    { id: 'compress', label: 'Compress Output', emoji: '⚡' },
    { id: 'favicon-generator', label: 'Make a Favicon', emoji: '⭐' },
  ],
  'svg-to-png': [
    { id: 'compress', label: 'Compress PNG', emoji: '⚡' },
    { id: 'favicon-generator', label: 'Make a Favicon', emoji: '⭐' },
    { id: 'resize', label: 'Resize It', emoji: '📐' },
  ],
  'collage': [
    { id: 'compress', label: 'Compress Result', emoji: '⚡' },
    { id: 'watermark', label: 'Add Watermark', emoji: '🔒' },
    { id: 'photo-filters', label: 'Add Filters', emoji: '🎨' },
  ],
  'screenshot': [
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'crop', label: 'Crop Screenshot', emoji: '✂️' },
    { id: 'redact', label: 'Redact Sensitive Data', emoji: '🖊️' },
  ],
  'signature': [
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'watermark', label: 'Add Watermark', emoji: '🔒' },
  ],
  'ocr': [
    { id: 'compress', label: 'Compress Image First', emoji: '⚡' },
    { id: 'redact', label: 'Redact Private Data', emoji: '🖊️' },
  ],
  'redact': [
    { id: 'blur-face', label: 'Blur Faces Too', emoji: '🫥' },
    { id: 'exif', label: 'Strip EXIF Data', emoji: '🛡️' },
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
  ],
  'social-preview': [
    { id: 'compress', label: 'Compress Image', emoji: '⚡' },
    { id: 'resize', label: 'Resize It', emoji: '📐' },
    { id: 'watermark', label: 'Add Watermark', emoji: '🔒' },
  ],
  'video-to-gif': [
    { id: 'compress', label: 'Compress GIF', emoji: '⚡' },
    { id: 'video-to-audio', label: 'Extract Audio', emoji: '🎵' },
  ],
  'video-to-audio': [
    { id: 'video-to-gif', label: 'Convert to GIF', emoji: '🎬' },
    { id: 'compress', label: 'Compress Video', emoji: '⚡' },
  ],
  'profile-picture': [
    { id: 'change-bg-color', label: 'Change Background', emoji: '🎨' },
    { id: 'remove-bg', label: 'Remove Background', emoji: '✂️' },
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
  ],
  'grid-splitter': [
    { id: 'compress', label: 'Compress Pieces', emoji: '⚡' },
    { id: 'collage', label: 'Make a Collage', emoji: '🖼️' },
  ],
  'default': [
    { id: 'compress', label: 'Compress Image', emoji: '⚡' },
    { id: 'resize', label: 'Resize Image', emoji: '📐' },
    { id: 'remove-bg', label: 'Remove Background', emoji: '✂️' },
  ],
  'change-bg-color': [
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'remove-bg', label: 'Remove Background', emoji: '✂️' },
    { id: 'profile-picture', label: 'Profile Pic Maker', emoji: '👤' },
  ],
};


const NextToolSuggestions = ({ currentToolId, onSelectTool }) => {
  const suggestions = SUGGESTIONS[currentToolId] || SUGGESTIONS['default'];

  return (
    <div className="next-tools">
      <p className="next-label">What do you want to do next?</p>
      <div className="next-chips">
        {suggestions.map(s => (
          <button
            key={s.id}
            className="next-chip"
            onClick={() => onSelectTool(s.id)}
          >
            <span>{s.emoji}</span>
            <span>{s.label}</span>
            <ArrowRight size={12} />
          </button>
        ))}
      </div>

      <style>{`
        .next-tools {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }
        .next-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 10px;
          text-align: center;
        }
        .next-chips {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .next-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--bg-app);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
        }
        .next-chip:hover {
          border-color: var(--primary);
          color: var(--text-main);
          background: rgba(0, 102, 255, 0.04);
          transform: translateX(2px);
        }
        .next-chip svg {
          margin-left: auto;
          flex-shrink: 0;
          opacity: 0.5;
        }
        .next-chip:hover svg { opacity: 1; }
      `}</style>
    </div>
  );
};

export default NextToolSuggestions;
