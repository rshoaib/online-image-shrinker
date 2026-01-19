import { Shield, Zap, Search, Globe } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield size={32} color="var(--primary)" />,
      title: "100% Privacy Guaranteed",
      desc: "Your photos never leave your device. All compression and resizing happens locally in your browser."
    },
    {
      icon: <Zap size={32} color="var(--secondary)" />,
      title: "Lightning Fast",
      desc: "No uploading or downloading wait times. Process gigabytes of images instantly using WebAssembly technology."
    },
    {
      icon: <Globe size={32} color="var(--success)" />,
      title: "SEO Optimized Images",
      desc: "Perfectly sized images improve your Core Web Vitals and PageSpeed scores, helping you rank higher on Google."
    },
    {
      icon: <Search size={32} color="#f59e0b" />,
      title: "Multiple Formats",
      desc: "Convert HEIC to JPG, PNG to WebP, and more. We support all modern next-gen image formats."
    }
  ];

  return (
    <section className="features-section">
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card">
            <div className="icon-box">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <style>{`
        .features-section {
          padding: var(--spacing-xxl) 0;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-xl);
          padding: 0 var(--spacing-md);
        }

        .feature-card {
          background: var(--bg-panel);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          transition: var(--transition-smooth);
        }

        .feature-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
        }

        .icon-box {
          margin-bottom: var(--spacing-md);
          display: inline-flex;
          padding: 12px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
        }

        .feature-card h3 {
          margin-bottom: var(--spacing-sm);
          font-size: 1.25rem;
          color: var(--text-main);
        }

        .feature-card p {
          color: var(--text-muted);
          line-height: 1.6;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
