import { useState, useRef, useEffect } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

const BeforeAfterSlider = ({ beforeImage, afterImage, className = "" }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  };

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e) => { 
    if (isDragging.current) handleMove(e.clientX); 
  };
  
  // Touch support
  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalUp = () => { isDragging.current = false; };
    window.addEventListener('mouseup', handleGlobalUp);
    return () => window.removeEventListener('mouseup', handleGlobalUp);
  }, []);

  return (
    <div 
        ref={containerRef}
        className={`slider-container ${className}`}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onTouchMove={handleTouchMove}
    >
      {/* After Image (Background/Base) */}
      <img src={afterImage} alt="After" className="slider-image base" />

      {/* Before Image (Clipped overlay) */}
      <div 
        className="slider-overlay" 
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={beforeImage} alt="Before" className="slider-image overlay" />
        <span className="label before-label">Original</span>
      </div>
      
      {/* After Label (Positioned absolutely) */}
      <span className="label after-label">Upscaled</span>

      {/* Slider Handle */}
      <div 
        className="slider-handle"
        style={{ left: `${position}%` }}
      >
        <div className="handle-line"></div>
        <div className="handle-circle">
            <ChevronsLeftRight size={16} color="#333" />
        </div>
      </div>

      <style>{`
        .slider-container {
            position: relative;
            width: 100%;
            overflow: hidden;
            border-radius: var(--radius-md);
            cursor: col-resize;
            user-select: none;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            line-height: 0; /* Remove gap */
        }
        
        .slider-image {
            width: 100%;
            height: auto;
            display: block;
            pointer-events: none;
        }
        
        .slider-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #fff; /* Fallback */
        }
        
        .slider-handle {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 4px;
            background: rgba(255,255,255,0.8);
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        
        .handle-line {
            width: 2px;
            height: 100%;
            background: white;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        
        .handle-circle {
            position: absolute;
            width: 32px;
            height: 32px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .label {
            position: absolute;
            top: 20px;
            padding: 4px 10px;
            border-radius: 4px;
            background: rgba(0,0,0,0.6);
            color: white;
            font-size: 0.8rem;
            font-weight: 600;
            pointer-events: none;
            z-index: 5;
            backdrop-filter: blur(4px);
        }
        .before-label { left: 20px; }
        .after-label { right: 20px; }
      `}</style>
    </div>
  );
};

export default BeforeAfterSlider;
