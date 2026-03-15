'use client';
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PrivacyIndicator = () => {
  const { t } = useTranslation();

  return (
    <div className="privacy-indicator" title={t('common.privacy_guarantee', 'Your files never leave your device.')}>
      <div className="status-dot"></div>
      <ShieldCheck size={14} className="privacy-icon" />
      <span className="privacy-text">{t('common.local_processing', '100% Local Processing')}</span>

      <style>{`
        .privacy-indicator {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: var(--radius-full);
          color: var(--success);
          font-size: 0.75rem;
          font-weight: 600;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          cursor: default;
          margin-bottom: var(--spacing-sm);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background-color: var(--success);
          border-radius: 50%;
          animation: pulseDot 2s infinite;
        }

        .privacy-icon {
          opacity: 0.8;
        }

        @keyframes pulseDot {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
};

export default PrivacyIndicator;
