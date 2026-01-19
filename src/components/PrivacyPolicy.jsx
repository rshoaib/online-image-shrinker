import { ArrowLeft, ShieldCheck, Lock, EyeOff } from 'lucide-react';

const PrivacyPolicy = ({ onBack }) => {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back to Tools
        </button>

        <header className="privacy-header">
          <div className="icon-wrapper">
            <ShieldCheck size={48} color="var(--primary)" />
          </div>
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: January 2026</p>
        </header>

        <div className="privacy-content">
          <section className="highlight-box">
            <Lock size={24} className="highlight-icon" />
            <div>
              <h3>files never leave your device</h3>
              <p>
                Online Image Shrinker operates entirely in your browser using WebAssembly technology. 
                Your images are <strong>never</strong> uploaded to our servers. We cannot see, store, or share your photos.
              </p>
            </div>
          </section>

          <section>
            <h2>1. Data Collection</h2>
            <p>
              We do not collect any personal data, IP addresses, or uploaded files. 
              The application runs client-side (on your computer/phone).
            </p>
          </section>

          <section>
            <h2>2. Analytics</h2>
            <p>
              We use aggregated, anonymous analytics (Google Analytics 4) to understand general usage patterns 
              (e.g., "how many users visited from France", "which tool is most popular"). 
              This data is strictly non-personally identifiable.
            </p>
          </section>

          <section>
            <h2>3. Local Storage</h2>
            <p>
              We may use your browser's Local Storage to save your preferences (like "Dark Mode" or "Last Used Settings"). 
              This data stays on your device and can be cleared by deleting your browser cache.
            </p>
          </section>

          <section>
            <h2>4. Third-Party Services</h2>
            <p>
              Our website is hosted on Vercel. You can review <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel's Privacy Policy</a> regarding their server logs.
            </p>
          </section>

          <section className="contact-section">
            <EyeOff size={24} />
            <p>
              Because we don't store your data, we have nothing to direct you to delete. 
              It's already gone the moment you close the tab.
            </p>
          </section>
        </div>
      </div>

      <style>{`
        .privacy-page {
          min-height: 80vh;
          padding: var(--spacing-xxl) var(--spacing-md);
          background: var(--bg-app);
          color: var(--text-main);
        }

        .privacy-container {
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

        .privacy-header {
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

        .privacy-header h1 {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-sm);
        }

        .last-updated {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .privacy-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .highlight-box {
          display: flex;
          gap: var(--spacing-lg);
          background: var(--bg-panel);
          border: 1px solid var(--primary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 20px rgba(0, 240, 255, 0.05);
        }

        .highlight-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        .highlight-box h3 {
          margin-top: 0;
          margin-bottom: var(--spacing-xs);
          color: var(--primary);
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
        }

        section h2 {
          font-size: 1.5rem;
          margin-bottom: var(--spacing-md);
          color: var(--text-main);
        }

        section p {
          color: var(--text-muted);
          line-height: 1.7;
        }

        a {
          color: var(--primary);
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        .contact-section {
          margin-top: var(--spacing-xl);
          padding-top: var(--spacing-xl);
          border-top: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          color: var(--text-dim);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
