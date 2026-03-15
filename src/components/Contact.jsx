'use client';
import { ArrowLeft, Mail, MessageSquare, Clock, HelpCircle, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Contact = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:segmentbi@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  const supportTopics = [
    { icon: '🛠️', title: 'Tool Issues', desc: 'Report a bug or tool not working as expected' },
    { icon: '💡', title: 'Feature Requests', desc: 'Suggest a new tool or improvement' },
    { icon: '🖼️', title: 'File Format Support', desc: 'Questions about supported image/video formats' },
    { icon: '🔒', title: 'Privacy Concerns', desc: 'Questions about how we handle your data' },
    { icon: '📱', title: 'Mobile & PWA', desc: 'Issues with the app on mobile devices' },
    { icon: '🤝', title: 'Partnerships', desc: 'Business inquiries and collaboration' },
  ];

  return (
    <div className="contact-page">
      <div className="contact-container">
        <button onClick={() => router.push('/')} className="back-btn">
          <ArrowLeft size={20} /> Back to Home
        </button>

        <header className="contact-header">
          <div className="icon-wrapper">
            <Mail size={48} color="var(--primary)" />
          </div>
          <h1>Contact Us</h1>
          <p className="subtitle">
            Have a question, found a bug, or want to suggest a feature? We're here to help.
            Our team reads every message and strives to provide helpful, detailed responses.
          </p>
        </header>

        {/* Response Time Banner */}
        <div className="response-banner">
          <Clock size={20} />
          <p>
            <strong>Response Time:</strong> We typically respond within <strong>24–48 hours</strong> during weekdays.
            For urgent tool issues, please include your browser name and a screenshot of the problem.
          </p>
        </div>

        <div className="contact-content">
          {/* Contact Form */}
          <section className="form-section">
            <h2><MessageSquare size={22} /> Send Us a Message</h2>
            
            {submitted ? (
              <div className="success-message">
                <span className="success-icon">✅</span>
                <h3>Your email client should open now!</h3>
                <p>If it didn't, you can email us directly at <a href="mailto:segmentbi@gmail.com">segmentbi@gmail.com</a></p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject">Subject</label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a topic…</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="File Format Question">File Format Question</option>
                    <option value="Privacy Question">Privacy Question</option>
                    <option value="Mobile / PWA Issue">Mobile / PWA Issue</option>
                    <option value="Partnership Inquiry">Partnership Inquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your question or issue in detail…"
                    rows={5}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  <Send size={18} /> Send Message
                </button>
              </form>
            )}
          </section>

          {/* Common Support Topics */}
          <section className="topics-section">
            <h2><HelpCircle size={22} /> Common Support Topics</h2>
            <div className="topics-grid">
              {supportTopics.map((topic, i) => (
                <div key={i} className="topic-card">
                  <span className="topic-icon">{topic.icon}</span>
                  <div>
                    <h4>{topic.title}</h4>
                    <p>{topic.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Info Note */}
          <div className="info-section">
            <p>
              <strong>Note:</strong> Since our tools run locally on your device, we cannot "recover" processed files for you 
              because we never had them in the first place. Please ensure you save your work before closing the tab!
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
          animation: fadeIn 0.5s ease-out;
        }

        .contact-container {
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
        .back-btn:hover { color: var(--primary); }

        .contact-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
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
          font-size: 1.05rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Response Time Banner */
        .response-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: var(--bg-panel);
          border: 1px solid var(--primary);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          margin-bottom: var(--spacing-xl);
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .response-banner svg { color: var(--primary); flex-shrink: 0; margin-top: 2px; }

        .contact-content {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        /* Form Section */
        .form-section h2, .topics-section h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          margin-bottom: 24px;
          color: var(--text-main);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          color: var(--text-main);
          font-size: 0.95rem;
          font-family: inherit;
          transition: border-color 0.2s;
          outline: none;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--primary);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--primary);
          color: #000;
          padding: 14px 28px;
          border-radius: var(--radius-md);
          border: none;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          align-self: flex-start;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 240, 255, 0.3);
        }

        .success-message {
          text-align: center;
          padding: 40px;
          background: var(--bg-surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
        }
        .success-icon { font-size: 2rem; display: block; margin-bottom: 16px; }
        .success-message h3 { margin-bottom: 8px; }
        .success-message a { color: var(--primary); }

        /* Topics */
        .topics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .topic-card {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          background: var(--bg-surface);
          padding: 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          transition: border-color 0.2s;
        }
        .topic-card:hover { border-color: var(--primary); }

        .topic-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 2px; }
        .topic-card h4 { font-size: 0.95rem; margin-bottom: 4px; }
        .topic-card p { font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; }

        /* Info */
        .info-section {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9rem;
          padding: 20px;
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
        }

        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr; }
          .topics-grid { grid-template-columns: 1fr; }
          .contact-header h1 { font-size: 2rem; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Contact;
