import { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieCheck');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'accepted') {
      // Initialize GA if already accepted
       // Note: GA initialization usually happens in main app, 
       // but we could trigger specific events here if needed.
       // For now, we assume the user just wants the banner to go away.
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieCheck', 'accepted');
    setShowBanner(false);
    // Optionally trigger GA if it was deferred
  };

  const handleDecline = () => {
    localStorage.setItem('cookieCheck', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <p>
          We use cookies to analyze traffic and improve your experience. 
          Your personal data is not sold to third parties.
        </p>
        <div className="cookie-buttons">
          <button onClick={handleDecline} className="btn-decline">Decline</button>
          <button onClick={handleAccept} className="btn-accept">Accept</button>
        </div>
      </div>
      <style>{`
        .cookie-banner {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 500px;
          background: var(--bg-panel);
          border: 1px solid var(--border-light);
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          z-index: 1000;
          animation: slideUp 0.3s ease-out;
        }

        .cookie-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .cookie-content p {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.4;
        }

        .cookie-buttons {
          display: flex;
          gap: 10px;
        }

        .btn-accept, .btn-decline {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
          white-space: nowrap;
        }

        .btn-accept {
          background: var(--primary);
          color: #000;
          border: none;
        }

        .btn-accept:hover {
          opacity: 0.9;
        }

        .btn-decline {
          background: transparent;
          border: 1px solid var(--border-active);
          color: var(--text-main);
        }

        .btn-decline:hover {
          background: var(--bg-surface);
          color: var(--text-main);
        }

        @media (max-width: 600px) {
          .cookie-content {
            flex-direction: column;
            align-items: flex-start;
          }
          .cookie-buttons {
            width: 100%;
            justify-content: flex-end;
          }
        }

        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CookieConsent;
