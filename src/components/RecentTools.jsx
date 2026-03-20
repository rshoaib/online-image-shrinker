'use client';
import { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';

const MAX_RECENT = 5;
const STORAGE_KEY = 'ois_recent_tools';

export function recordToolUsage(toolId, title, icon) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = [
      { id: toolId, title, icon, ts: Date.now() },
      ...existing.filter(t => t.id !== toolId)
    ].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (_) {}
}

const RecentTools = ({ onSelectTool }) => {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setRecent(stored);
    } catch (_) {}
  }, []);

  const handleDismiss = (id, e) => {
    e.stopPropagation();
    const updated = recent.filter(t => t.id !== id);
    setRecent(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  if (recent.length === 0) return null;

  return (
    <div className="recent-tools">
      <div className="recent-header">
        <Clock size={14} />
        <span>Recently used</span>
      </div>
      <div className="recent-chips">
        {recent.map(tool => (
          <button
            key={tool.id}
            className="recent-chip"
            onClick={() => onSelectTool(tool.id)}
            title={tool.title}
          >
            <span className="chip-title">{tool.title}</span>
            <span
              className="chip-dismiss"
              onClick={(e) => handleDismiss(tool.id, e)}
              role="button"
              tabIndex={0}
              aria-label={`Remove ${tool.title} from recent`}
            >
              <X size={11} />
            </span>
          </button>
        ))}
      </div>

      <style>{`
        .recent-tools {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          animation: fadeIn 0.4s ease-out;
          flex-wrap: wrap;
          justify-content: center;
        }
        .recent-header {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .recent-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .recent-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px 5px 12px;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s;
        }
        .recent-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(0, 102, 255, 0.05);
        }
        .chip-title {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .chip-dismiss {
          display: flex;
          align-items: center;
          padding: 2px;
          border-radius: 50%;
          opacity: 0.4;
          transition: opacity 0.15s;
          cursor: pointer;
        }
        .chip-dismiss:hover { opacity: 1; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RecentTools;
