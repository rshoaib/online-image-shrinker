'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Minimize2, Maximize2, Eraser, FileText, Repeat, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FloatingDock = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  // Highlighted/Featured tools for quick access
  const dockTools = [
    { id: 'compress', route: '/compress-image', icon: <Minimize2 size={22} />, label: t('home.tools.compress.title', 'Compress') },
    { id: 'resize', route: '/resize-image', icon: <Maximize2 size={22} />, label: t('home.tools.resize.title', 'Resize') },
    { id: 'remove-bg', route: '/remove-background', icon: <Eraser size={22} />, label: 'Remove BG' },
    { id: 'converter', route: '/image-converter', icon: <Repeat size={22} />, label: 'Convert' },
    { id: 'pdf', route: '/jpg-to-pdf', icon: <FileText size={22} />, label: 'To PDF' },
  ];

  return (
    <div className="dock-container">
      <div className="dock">
        {dockTools.map((tool) => {
          const isActive = pathname.includes(tool.route);
          return (
            <Link 
              key={tool.id} 
              href={tool.route} 
              className={`dock-item ${isActive ? 'active' : ''}`}
              title={tool.label}
            >
              <div className="dock-icon-wrapper">
                {tool.icon}
              </div>
              <span className="dock-tooltip">{tool.label}</span>
            </Link>
          );
        })}
        
        {/* Divider */}
        <div className="dock-divider"></div>
        
        {/* All Tools Link */}
        <Link href="/" className="dock-item" title="All Tools">
          <div className="dock-icon-wrapper">
             <Star size={22} />
          </div>
          <span className="dock-tooltip">All Tools</span>
        </Link>
      </div>

      <style>{`
        .dock-container {
          position: fixed;
          bottom: var(--spacing-lg);
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          pointer-events: none; /* Let clicks pass through the container... */
          animation: slideUpFade 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .dock {
          pointer-events: auto; /* ...but catch them on the dock itself */
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          background: var(--bg-panel);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border-light);
          border-radius: 24px;
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .dock-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 16px;
          color: var(--text-muted);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
        }

        .dock-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dock-item:hover {
          color: var(--primary);
          background: var(--bg-surface);
        }

        .dock-item:hover .dock-icon-wrapper {
          transform: translateY(-4px) scale(1.1);
        }

        .dock-item.active {
          color: white;
          background: var(--primary);
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        .dock-tooltip {
          position: absolute;
          top: -40px;
          background: var(--bg-panel);
          color: var(--text-main);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .dock-item:hover .dock-tooltip {
          opacity: 1;
          visibility: visible;
          top: -48px;
        }

        .dock-divider {
          width: 1px;
          height: 24px;
          background-color: var(--border-active);
          margin: 0 4px;
          opacity: 0.5;
        }
        
        @keyframes slideUpFade {
           from { opacity: 0; transform: translate(-50%, 20px) scale(0.95); }
           to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }

        @media (max-width: 600px) {
           .dock-item {
              width: 40px;
              height: 40px;
           }
           .dock-item svg {
              width: 18px;
              height: 18px;
           }
        }
      `}</style>
    </div>
  );
};

export default FloatingDock;
