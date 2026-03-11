import React from 'react';

const PageLoader = () => (
  <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
    <div className="skeleton-bar" style={{ width: '60%', height: '32px', marginBottom: '16px' }}></div>
    <div className="skeleton-bar" style={{ width: '40%', height: '16px', marginBottom: '40px' }}></div>
    <div className="skeleton-bar" style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-lg)' }}></div>
    <style>{`
      .skeleton-bar {
        background: linear-gradient(90deg, var(--bg-surface) 25%, var(--border-light) 50%, var(--bg-surface) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--radius-sm);
      }
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

export default PageLoader;
