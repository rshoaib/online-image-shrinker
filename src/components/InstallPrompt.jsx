'use client';
import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

const InstallPrompt = () => {
  const { isInstallable, install } = usePWA();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isInstallable && !localStorage.getItem('pwa_prompt_dismissed')) {
      setTimeout(() => setShowToast(true), 0);
    }
  }, [isInstallable]);

  const handleDismiss = () => {
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    setShowToast(false);
  };

  if (!showToast || !isInstallable) return null;

  return (
    <div className="install-prompt-toast">
      <div className="install-content">
         <span className="install-icon">
            <Download size={20} />
         </span>
         <div className="install-text">
           <strong>Install App</strong>
           <span>Add to Home Screen for offline access</span>
         </div>
      </div>
      <div className="install-actions">
        <button onClick={install} className="install-btn">Install</button>
        <button onClick={handleDismiss} className="close-btn"><X size={16} /></button>
      </div>
      <style>{`
        .install-prompt-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          left: auto;
          transform: none;
          background: var(--bg-panel);
          border: 1px solid var(--border-light);
          padding: 12px 20px;
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 20px;
          z-index: 9999;
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          min-width: 340px;
        }

        .install-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .install-icon {
          width: 40px;
          height: 40px;
          background: var(--bg-surface);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .install-text {
          display: flex;
          flex-direction: column;
          font-size: 0.9rem;
        }
        
        .install-text strong { color: var(--text-main); }
        .install-text span { color: var(--text-muted); font-size: 0.8rem; }

        .install-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .install-btn {
          background: var(--primary);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.85rem;
          transition: 0.2s;
        }

        .install-btn:hover {
          filter: brightness(1.1);
        }

        .close-btn {
          padding: 4px;
          color: var(--text-muted);
          border-radius: 50%;
          transition: 0.2s;
          display: flex;
        }

        .close-btn:hover {
          background: var(--bg-surface);
          color: var(--text-main);
        }

        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 600px) {
          .install-prompt-toast {
             width: calc(100% - 32px);
             bottom: 16px;
             right: 16px;
             left: 16px;
             min-width: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default InstallPrompt;
