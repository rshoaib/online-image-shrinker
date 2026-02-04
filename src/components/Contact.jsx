import { ArrowLeft, Mail, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="contact-page">
      <div className="contact-container">
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowLeft size={20} /> Back to Home
        </button>

        <header className="contact-header">
          <div className="icon-wrapper">
            <Mail size={48} color="var(--primary)" />
          </div>
          <h1>Contact Us</h1>
          <p className="subtitle">We'd love to hear from you!</p>
        </header>

        <div className="contact-content">
          <div className="contact-card">
            <div className="card-icon">
               <MessageSquare size={32} />
            </div>
            <h3>Support & Feedback</h3>
            <p>
              Have a question, found a bug, or want to suggest a feature? 
              Click the button below to send us an email.
            </p>
            {/* REPLACE WITH ACTUAL EMAIL */}
            <a href="mailto:support@onlineimageshrinker.com" className="contact-link">
              support@onlineimageshrinker.com
            </a>
          </div>

          <div className="info-section">
             <p>
               <strong>Note:</strong> Since our tools run locally on your device, we cannot "recover" processed files for you 
               because we never had them in the first place. Please ensure you save your work!
             </p>
          </div>
        </div>
      </div>

      <style>{`
        .contact-page {
          min-height: 80vh;
          padding: var(--spacing-xxl) var(--spacing-md);
          background: var(--bg-app);
          color: var(--text-main);
        }

        .contact-container {
          max-width: 600px;
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
        }

        .back-btn:hover {
          color: var(--primary);
        }

        .contact-header {
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

        .contact-header h1 {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-sm);
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .contact-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .contact-card {
          background: var(--bg-panel);
          padding: 40px;
          border-radius: var(--radius-lg);
          text-align: center;
          border: 1px solid var(--border-light);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .card-icon {
           margin-bottom: 20px;
           color: var(--primary);
        }

        .contact-card h3 {
          font-size: 1.5rem;
          margin-bottom: 16px;
        }

        .contact-card p {
          color: var(--text-muted);
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .contact-link {
          display: inline-block;
          background: var(--primary);
          color: #000;
          padding: 12px 24px;
          border-radius: var(--radius-md);
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.2s;
        }

        .contact-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 240, 255, 0.3);
        }

        .info-section {
           text-align: center;
           color: var(--text-muted);
           font-size: 0.9rem;
           padding: 0 20px;
        }
      `}</style>
    </div>
  );
};

export default Contact;
