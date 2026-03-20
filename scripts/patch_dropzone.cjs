const fs = require('fs');
let dz = fs.readFileSync('src/components/DropZone.jsx', 'utf8');

if (dz.includes('sample-btn')) {
  console.log('Already patched');
  process.exit(0);
}

// Add a sample image click handler after handleInputChange
const sampleHandler = `
  const handleSample = async () => {
    // Use a free, permissive-license sample photo from an always-available path
    try {
      const res = await fetch('/sample-photo.jpg');
      if (!res.ok) throw new Error('Not found');
      const blob = await res.blob();
      const file = new File([blob], 'sample-photo.jpg', { type: 'image/jpeg' });
      onFileSelect([file]);
    } catch (_) {
      // Fallback: create a canvas-generated sample image
      const canvas = document.createElement('canvas');
      canvas.width = 1200; canvas.height = 800;
      const ctx = canvas.getContext('2d');
      const g = ctx.createLinearGradient(0, 0, 1200, 800);
      g.addColorStop(0, '#1a1f3c'); g.addColorStop(1, '#0f3460');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1200, 800);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(Math.random()*1200, Math.random()*800, 60+Math.random()*120, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.fillStyle = 'white'; ctx.font = 'bold 48px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Sample Image', 600, 380);
      ctx.font = '24px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText('1200 × 800 · Try the tool!', 600, 440);
      canvas.toBlob(blob => {
        const file = new File([blob], 'sample-photo.jpg', { type: 'image/jpeg' });
        onFileSelect([file]);
      }, 'image/jpeg', 0.9);
    }
  };
`;

// Insert before the return
dz = dz.replace(
  '  return (\n    <div',
  sampleHandler + '\n  return (\n    <div'
);

// Add sample button below supported-formats
const sampleButton = `
      <div className="sample-row" onClick={e => { e.stopPropagation(); handleSample(); }}>
        <span className="sample-btn">⚡ Try with a sample photo</span>
      </div>
`;

dz = dz.replace(
  '</div>\n\n      {isDragging',
  `${sampleButton}</div>\n\n      {isDragging`
);

// Add CSS styles for sample button
const sampleCss = `
        .sample-row {
          margin-top: var(--spacing-md);
          cursor: pointer;
          z-index: 1;
        }
        .sample-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--primary);
          padding: 5px 14px;
          border: 1px solid var(--primary-glow);
          border-radius: var(--radius-full);
          background: rgba(0, 102, 255, 0.06);
          transition: all 0.2s;
          font-weight: 500;
        }
        .sample-btn:hover {
          background: rgba(0, 102, 255, 0.12);
          transform: translateY(-1px);
        }
`;

dz = dz.replace(
  '/* Inline toast notifications */',
  sampleCss + '\n        /* Inline toast notifications */'
);

fs.writeFileSync('src/components/DropZone.jsx', dz);
console.log('✅ DropZone sample button added');
