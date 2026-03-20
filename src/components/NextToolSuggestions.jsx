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
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'profile-picture', label: 'Profile Pic Maker', emoji: '👤' },
    { id: 'watermark', label: 'Add Watermark', emoji: '🔒' },
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
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
  ],
  'exif': [
    { id: 'blur-face', label: 'Blur Faces', emoji: '🫥' },
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
  ],
  'rotate-flip': [
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'crop', label: 'Crop Image', emoji: '✂️' },
  ],
  'image-converter': [
    { id: 'compress', label: 'Compress It', emoji: '⚡' },
    { id: 'resize', label: 'Resize It', emoji: '📐' },
  ],
  'favicon-generator': [
    { id: 'svg-to-png', label: 'SVG to PNG', emoji: '🖼️' },
    { id: 'compress', label: 'Compress PNGs', emoji: '⚡' },
  ],
  'default': [
    { id: 'compress', label: 'Compress Image', emoji: '⚡' },
    { id: 'resize', label: 'Resize Image', emoji: '📐' },
    { id: 'remove-bg', label: 'Remove Background', emoji: '✂️' },
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
