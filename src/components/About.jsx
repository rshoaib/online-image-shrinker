import { ArrowLeft, Users, Shield, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="about-container">
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowLeft size={20} /> Back to Home
        </button>

        <header className="about-header">
          <div className="icon-wrapper">
            <Users size={48} color="var(--primary)" />
          </div>
          <h1>About Us</h1>
          <p className="subtitle">Privacy-First Image Tools for Everyone</p>
        </header>

        <div className="about-content">
          <section className="mission-section">
            <h2>Our Mission</h2>
            <p>
              We built <strong>Online Image Shrinker</strong> with a simple goal: to provide powerful, professional-grade image editing tools 
              that are completely free and respectful of your privacy.
            </p>
            <p>
              In a web filled with tools that require sign-ups, subscriptions, or upload your sensitive photos to remote servers, 
              we wanted to create a safe alternative.
            </p>
          </section>

          <section className="features-grid">
            <div className="feature-card">
              <Shield size={32} className="feature-icon" />
              <h3>100% Private</h3>
              <p>
                We utilize <strong>WebAssembly</strong> technology to process your images directly in your browser. 
                Your files never leave your device.
              </p>
            </div>
            <div className="feature-card">
              <Cpu size={32} className="feature-icon" />
              <h3>Client-Side Power</h3>
              <p>
                By harnessing your device's CPU, we can offer unlimited usage without server costs—meaning the tool stays free forever.
              </p>
            </div>
          </section>

          <section className="story-section">
            <h2>The Story</h2>
            <p>
              This project started as a frustration with existing "free" tools that were full of ads and limitations. 
              We believe that basic digital utilities like resizing an image for a passport or compressing a PDF shouldn't vary by cost 
              or compromise your data.
            </p>
          </section>
        </div>
      </div>

      <style>{`
        .about-page {
          min-height: 80vh;
          padding: var(--spacing-xxl) var(--spacing-md);
          background: var(--bg-app);
          color: var(--text-main);
        }

        .about-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-weight: 500;
          margin-bottom: var(--spacing-xl);
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: var(--primary);
        }

        .about-header {
          text-align: center;
          margin-bottom: var(--spacing-xxl);
        }

        .icon-wrapper {
          display: inline-flex;
          padding: 16px;
          background: var(--bg-surface);
          border-radius: 50%;
          margin-bottom: var(--spacing-lg);
          border: 1px solid var(--border-light);
        }

        .about-header h1 {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-sm);
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .about-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xxl);
        }

        section h2 {
          font-size: 1.8rem;
          margin-bottom: var(--spacing-md);
          color: var(--text-main);
        }

        section p {
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 16px;
          font-size: 1.05rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin: 20px 0;
        }

        .feature-card {
          background: var(--bg-panel);
          padding: 30px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
        }

        .feature-icon {
          color: var(--primary);
          margin-bottom: 16px;
        }

        .feature-card h3 {
          font-size: 1.2rem;
          margin-bottom: 12px;
        }

        .feature-card p {
          font-size: 0.95rem;
          margin-bottom: 0;
        }

        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
