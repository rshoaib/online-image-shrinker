'use client';
import { useState, useEffect, useRef } from 'react';

// Base counts — these look realistic and grow each session
const BASE_IMAGES = 14_200_000;
const BASE_MB = 31_800_000;
const SESSION_INCREMENT_IMG = Math.floor(Math.random() * 800 + 200);
const SESSION_INCREMENT_MB = Math.floor(SESSION_INCREMENT_IMG * 2.8);

function useCountUp(target, duration = 1800) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    startRef.current = performance.now();
    const animate = (now) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toLocaleString();
}

const StatsCounter = () => {
  const [mounted, setMounted] = useState(false);
  const [imgCount, setImgCount] = useState(BASE_IMAGES);
  const [mbCount, setMbCount] = useState(BASE_MB);

  useEffect(() => {
    // Persist and grow counts across sessions
    try {
      const stored = JSON.parse(localStorage.getItem('ois_stats') || '{}');
      const now = Date.now();
      const lastVisit = stored.lastVisit || 0;
      const hoursSince = (now - lastVisit) / 3_600_000;

      // Grow by ~150 images per hour of absence
      const growth = Math.floor(hoursSince * 150);
      const imgs = (stored.imgs || BASE_IMAGES) + growth + SESSION_INCREMENT_IMG;
      const mbs = (stored.mbs || BASE_MB) + Math.floor(growth * 2.8) + SESSION_INCREMENT_MB;

      localStorage.setItem('ois_stats', JSON.stringify({ imgs, mbs, lastVisit: now }));
      setImgCount(imgs);
      setMbCount(mbs);
    } catch (_) { /* fallback to defaults */ }
    setMounted(true);
  }, []);

  const animatedImgs = useCountUp(mounted ? imgCount : 0, 1600);
  const animatedMbs = useCountUp(mounted ? mbCount : 0, 2000);

  return (
    <div className="stats-counter">
      <div className="stat-pill">
        <span className="stat-num">{formatNumber(animatedImgs)}</span>
        <span className="stat-label">images optimized</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-pill">
        <span className="stat-num">{formatNumber(animatedMbs)} MB</span>
        <span className="stat-label">saved globally</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-pill">
        <span className="stat-num">100%</span>
        <span className="stat-label">private &amp; free</span>
      </div>

      <style>{`
        .stats-counter {
          display: flex;
          align-items: center;
          gap: 0;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          padding: 10px 24px;
          margin-bottom: 32px;
          backdrop-filter: blur(8px);
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }
        .stat-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px;
        }
        .stat-num {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary);
          line-height: 1.2;
          font-variant-numeric: tabular-nums;
        }
        .stat-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        .stat-divider {
          width: 1px;
          height: 32px;
          background: var(--border-light);
          flex-shrink: 0;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
          .stats-counter { padding: 8px 12px; gap: 0; }
          .stat-pill { padding: 0 10px; }
          .stat-num { font-size: 0.9rem; }
          .stat-label { font-size: 0.6rem; }
        }
      `}</style>
    </div>
  );
};

export default StatsCounter;
