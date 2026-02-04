import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeftRight } from 'lucide-react';

const CompareSlider = ({ originalUrl, processedUrl }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);

  const resize = useCallback((e) => {
    if (isResizing && containerRef.current) {
      const { left, width } = containerRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const newPos = ((clientX - left) / width) * 100;
      setSliderPosition(Math.min(100, Math.max(0, newPos)));
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    window.addEventListener('touchmove', resize);
    window.addEventListener('touchend', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      window.removeEventListener('touchmove', resize);
      window.removeEventListener('touchend', stopResizing);
    };
  }, [isResizing, resize]);

  return (
    <div 
      className="compare-container" 
      ref={containerRef}
      onMouseDown={startResizing}
      onTouchStart={startResizing}
    >
      <div className="img-layer original">
        <img src={originalUrl} alt="Original" />
        <span className="label">Original</span>
      </div>
      
      <div 
        className="img-layer processed" 
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={processedUrl} alt="Processed" />
        <span className="label">Compressed</span>
      </div>

      <div 
        className="slider-handle" 
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="handle-line"></div>
        <div className="handle-circle">
          <ArrowLeftRight size={16} />
        </div>
      </div>

      <style>{`
        .compare-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          cursor: col-resize;
          user-select: none;
          max-width: 100%;
          max-height: 100%;
          display: flex;
          justify-content: center;
        }

        .img-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .img-layer img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          pointer-events: none;
        }

        .label {
          position: absolute;
          top: 16px;
          background: rgba(0,0,0,0.6);
          color: white;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          pointer-events: none;
        }

        .original .label { left: 16px; }
        .processed .label { right: 16px; color: var(--primary); }

        .slider-handle {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          pointer-events: none; /* Let clicks pass to container to handle drag better */
        }

        .handle-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          background: var(--primary);
          color: black;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
};

export default CompareSlider;
