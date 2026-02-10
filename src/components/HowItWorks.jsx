import { Upload, Cpu, Download } from 'lucide-react';

const HowItWorks = ({ toolType = 'general' }) => {
  const getSteps = () => {
    switch (toolType) {
      case 'pdf':
        return [
          { title: 'Upload PDF', desc: 'Select your PDF document. Files stay on your device.' },
          { title: 'Compress', desc: 'Choose your compression level (Extreme, Recommended, Less).' },
          { title: 'Download', desc: 'Get your smaller PDF instantly.' }
        ];
      case 'resize':
        return [
          { title: 'Upload Image', desc: 'Upload JPG, PNG, or WebP images.' },
          { title: 'Set Dimensions', desc: 'Enter width/height or choose a percentage.' },
          { title: 'Download', desc: 'Save your resized image instantly.' }
        ];
      case 'crop':
        return [
          { title: 'Upload Photo', desc: 'Select the photo you want to crop.' },
          { title: 'Crop', desc: 'Choose a preset (e.g. Instagram) or drag handles.' },
          { title: 'Download', desc: 'Get your perfectly cropped image.' }
        ];
      case 'passport':
        return [
          { title: 'Upload Photo', desc: 'Use a photo with even lighting and plain background.' },
          { title: 'Select Country', desc: 'Choose US, UK, EU, or Custom size.' },
          { title: 'Download', desc: 'Download the printable sheet or single photo.' }
        ];
      default:
        return [
          { title: 'Upload', desc: 'Select your photos or videos. Files processed locally.' },
          { title: 'Process', desc: 'Our powerful engine optimizes your files instantly.' },
          { title: 'Download', desc: 'Get your optimized files immediately.' }
        ];
    }
  };

  const steps = getSteps();

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
          <h3>{steps[0].title}</h3>
          <p>{steps[0].desc}</p>
        </div>

        <div className="step-line"></div>

        <div className="step-card">
          <div className="step-number">2</div>
          <div className="step-icon"><Cpu size={32} /></div>
          <h3>{steps[1].title}</h3>
          <p>{steps[1].desc}</p>
        </div>

        <div className="step-line"></div>

        <div className="step-card">
          <div className="step-number">3</div>
          <div className="step-icon"><Download size={32} /></div>
          <h3>{steps[2].title}</h3>
          <p>{steps[2].desc}</p>
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
