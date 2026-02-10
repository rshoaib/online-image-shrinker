import { Upload, Cpu, Download } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="hiw-container">
      <div className="hiw-header">
        <h2>How It Works</h2>
        <p>Professional results in 3 simple steps.</p>
      </div>

      <div className="steps-grid">
        <div className="step-card">
          <div className="step-number">1</div>
          <div className="step-icon"><Upload size={32} /></div>
          <h3>Upload</h3>
          <p>Select your photos or videos. Files are strictly processed locally on your device.</p>
        </div>

        <div className="step-line"></div>

        <div className="step-card">
          <div className="step-number">2</div>
          <div className="step-icon"><Cpu size={32} /></div>
          <h3>Process</h3>
          <p>Our powerful engine resizes, compresses, or edits your files instantly.</p>
        </div>

        <div className="step-line"></div>

        <div className="step-card">
          <div className="step-number">3</div>
          <div className="step-icon"><Download size={32} /></div>
          <h3>Download</h3>
          <p>Get your optimized files immediately. No watermarks, no sign-up required.</p>
        </div>
      </div>

      <style>{`
        .hiw-container {
          max-width: 1000px;
          margin: 60px auto;
          padding: 40px 20px;
          text-align: center;
        }

        .hiw-header { margin-bottom: 50px; }
        .hiw-header h2 { font-size: 2.5rem; margin-bottom: 10px; color: var(--text-main); }
        .hiw-header p { color: var(--text-muted); font-size: 1.2rem; }

        .steps-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .step-card {
          flex: 1;
          min-width: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          position: relative;
        }

        .step-number {
          width: 32px;
          height: 32px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .step-icon {
          width: 80px;
          height: 80px;
          background: var(--bg-surface);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          margin-bottom: 10px;
        }

        .step-card h3 { font-size: 1.25rem; font-weight: 700; color: var(--text-main); }
        .step-card p { color: var(--text-muted); line-height: 1.5; font-size: 0.95rem; }

        .step-line {
          width: 60px;
          height: 2px;
          background: var(--border-light);
          display: block;
        }

        @media (max-width: 768px) {
          .step-line { display: none; }
          .steps-grid { flex-direction: column; gap: 40px; }
        }
      `}</style>
    </div>
  );
};

export default HowItWorks;
