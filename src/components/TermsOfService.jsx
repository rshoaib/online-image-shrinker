import { ArrowLeft, FileText, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="policy-page">
      <div className="policy-container">
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowLeft size={20} /> Back to Home
        </button>

        <header className="policy-header">
          <div className="icon-wrapper">
            <FileText size={48} color="var(--primary)" />
          </div>
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: February 2026</p>
        </header>

        <div className="policy-content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Online Image Shrinker ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              Online Image Shrinker provides web-based image editing tools (compression, resizing, conversion, etc.) that run client-side in your web browser. 
              We do not store, host, or transfer your files to any external server. All processing happens locally on your device.
            </p>
          </section>

          <section className="highlight-box">
             <AlertTriangle size={24} className="highlight-icon" />
             <div>
               <h3>NO WARRANTY ("AS IS")</h3>
               <p>
                 This software is provided "as is", without warranty of any kind, express or implied. 
                 While we strive for perfection, we cannot guarantee that the Service will be uninterrupted or error-free. 
                 We are not liable for any data loss occurring on your local device while using these tools.
               </p>
             </div>
          </section>

          <section>
            <h2>3. User Conduct</h2>
            <p>
              You agree to use the Service only for lawful purposes. You are solely responsible for the content of the images you process using our tools.
            </p>
          </section>

          <section>
            <h2>4. Intellectual Property</h2>
            <p>
              The code and design of Online Image Shrinker are owned by us. 
              However, the images you process remain 100% yours. We claim no ownership over your content.
            </p>
          </section>

          <section>
            <h2>5. Changes to Terms</h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of the Service constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </div>

      <style>{`
        .policy-page {
          min-height: 80vh;
          padding: var(--spacing-xxl) var(--spacing-md);
          background: var(--bg-app);
          color: var(--text-main);
        }

        .policy-container {
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

        .policy-header {
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

        .policy-header h1 {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-sm);
        }

        .last-updated {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .policy-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
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
        
        .highlight-box {
          display: flex;
          gap: var(--spacing-lg);
          background: var(--bg-panel);
          border: 1px solid #eab308; /* Yellow warning color */
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
        }
        
        .highlight-icon {
           color: #eab308;
           flex-shrink: 0;
        }
        
        .highlight-box h3 {
           color: #eab308;
           margin-top: 0;
           margin-bottom: 8px;
           text-transform: uppercase;
           font-size: 0.9rem;
           letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
};

export default TermsOfService;
