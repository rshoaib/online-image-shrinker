import { ArrowLeft, Users, Shield, Cpu, Globe, Code, Heart, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const About = () => {
  const navigate = useNavigate();

  // Inject Organization + Person schema for E-E-A-T
  useEffect(() => {
    const schema = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Online Image Shrinker",
        "url": "https://onlineimageshrinker.com",
        "logo": "https://onlineimageshrinker.com/og-image.jpg",
        "description": "Free, privacy-first image tools that run entirely in your browser. No uploads, no accounts, no tracking.",
        "foundingDate": "2025",
        "sameAs": [
          "https://github.com/rshoaib"
        ],
        "founder": {
          "@type": "Person",
          "name": "Riz Shoaib",
          "url": "https://onlineimageshrinker.com/about"
        },
        "knowsAbout": [
          "Image Compression",
          "WebAssembly",
          "Client-Side Processing",
          "AI Image Processing",
          "Privacy-First Software"
        ]
      }
    ];

    let script = document.getElementById('about-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'about-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      const el = document.getElementById('about-jsonld');
      if (el) el.remove();
    };
  }, []);

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
          <h1>About Online Image Shrinker</h1>
          <p className="subtitle">Privacy-First Image Tools — Built by Developers, for Everyone</p>
        </header>

        <div className="about-content">
          {/* Mission */}
          <section className="mission-section">
            <h2>Our Mission</h2>
            <p>
              We built <strong>Online Image Shrinker</strong> because we were tired of uploading personal photos 
              to random servers just to resize or compress them. Every "free" tool online either charges after 3 uses, 
              slaps on watermarks, or silently stores your files.
            </p>
            <p>
              Our mission is simple: <strong>provide 20+ professional-grade image tools that never touch a server.</strong> Every 
              compression, conversion, AI background removal, and edit happens 100% in your browser using WebAssembly and TensorFlow.js. 
              Zero bytes leave your device.
            </p>
          </section>

          {/* Trust Pillars */}
          <section className="trust-grid">
            <div className="trust-card">
              <Shield size={32} className="trust-icon" />
              <h3>Zero-Upload Privacy</h3>
              <p>
                Your photos never leave your device. We use <strong>WebAssembly (WASM)</strong> and <strong>TensorFlow.js</strong> to 
                process everything on your CPU/GPU. You can literally disconnect WiFi after loading the page — the tools still work.
              </p>
            </div>
            <div className="trust-card">
              <Cpu size={32} className="trust-icon" />
              <h3>Client-Side Power</h3>
              <p>
                By using your device's processing power, we eliminate server costs entirely. This means the tools 
                stay <strong>free forever</strong> — no subscriptions, no "credits", no limits.
              </p>
            </div>
            <div className="trust-card">
              <Globe size={32} className="trust-icon" />
              <h3>Works Everywhere</h3>
              <p>
                Available in <strong>6 languages</strong> (English, Spanish, German, French, Portuguese, Italian), 
                works offline as a <strong>PWA</strong>, and runs on any device with a modern browser.
              </p>
            </div>
            <div className="trust-card">
              <Code size={32} className="trust-icon" />
              <h3>Modern Tech Stack</h3>
              <p>
                Built with React, Vite, WebAssembly, TensorFlow.js, ONNX Runtime, and FFmpeg.wasm. 
                We use the same AI models that power professional editors — but entirely in your browser.
              </p>
            </div>
          </section>

          {/* Founder */}
          <section className="founder-section">
            <h2>Meet the Founder</h2>
            <div className="founder-card">
              <div className="founder-avatar">R</div>
              <div className="founder-info">
                <h3>Riz Shoaib</h3>
                <p className="founder-role">Founder & Developer</p>
                <p className="founder-bio">
                  Full-stack developer with a passion for privacy-first software. Started building Online Image Shrinker 
                  to solve a personal frustration with cloud-based tools that compromise user data. Believes that 
                  essential digital utilities should be free, fast, and private.
                </p>
                <div className="founder-links">
                  <a href="https://github.com/rshoaib" target="_blank" rel="noopener noreferrer" className="founder-link">
                    <ExternalLink size={14} /> GitHub
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* What We Offer */}
          <section className="tools-overview">
            <h2>What We Offer</h2>
            <p>Over 20 free tools, all running locally in your browser:</p>
            <div className="tools-list">
              <div className="tool-group">
                <h4>Core Tools</h4>
                <ul>
                  <li>Image Compressor (JPEG, PNG, WebP)</li>
                  <li>Image Resizer & Cropper</li>
                  <li>Format Converter (JPG, PNG, WebP, HEIC)</li>
                  <li>Images to PDF Merger</li>
                  <li>Batch Processor</li>
                </ul>
              </div>
              <div className="tool-group">
                <h4>AI-Powered</h4>
                <ul>
                  <li>AI Background Remover</li>
                  <li>AI Image Upscaler (2x/4x)</li>
                  <li>OCR Text Extractor</li>
                  <li>Magic Eraser</li>
                  <li>Color Palette Extractor</li>
                </ul>
              </div>
              <div className="tool-group">
                <h4>Creative</h4>
                <ul>
                  <li>Meme Generator</li>
                  <li>Screenshot Beautifier</li>
                  <li>Profile Picture Maker</li>
                  <li>Social Media Preview Generator</li>
                  <li>Collage Maker</li>
                </ul>
              </div>
              <div className="tool-group">
                <h4>Privacy & Security</h4>
                <ul>
                  <li>EXIF Metadata Remover</li>
                  <li>Privacy Blur / Redactor</li>
                  <li>Batch Watermarker</li>
                  <li>Digital Signature Creator</li>
                  <li>Image Compare Tool</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="cta-section">
            <Heart size={24} color="var(--primary)" />
            <h2>Try It Now — No Sign-Up Needed</h2>
            <p>Just open a tool, drop your image, and download the result. It's that simple.</p>
            <button onClick={() => navigate('/')} className="cta-button">
              Explore All Tools
            </button>
          </section>
        </div>
      </div>

      <style>{`
        .about-page {
          min-height: 80vh;
          padding: var(--spacing-xxl, 64px) var(--spacing-md, 16px);
          background: var(--bg-app);
          color: var(--text-main);
          animation: fadeIn 0.5s ease-out;
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
          margin-bottom: var(--spacing-xl, 48px);
          transition: color 0.2s;
        }
        .back-btn:hover { color: var(--primary); }

        .about-header {
          text-align: center;
          margin-bottom: var(--spacing-xxl, 64px);
        }

        .icon-wrapper {
          display: inline-flex;
          padding: 16px;
          background: var(--bg-surface);
          border-radius: 50%;
          margin-bottom: var(--spacing-lg, 32px);
          border: 1px solid var(--border-light);
        }

        .about-header h1 {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-sm, 8px);
          line-height: 1.2;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .about-content {
          display: flex;
          flex-direction: column;
          gap: 56px;
        }

        section h2 {
          font-size: 1.8rem;
          margin-bottom: var(--spacing-md, 16px);
          color: var(--text-main);
        }

        section p {
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 16px;
          font-size: 1.05rem;
        }

        /* Trust Grid */
        .trust-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .trust-card {
          background: var(--bg-panel);
          padding: 30px;
          border-radius: var(--radius-lg, 16px);
          border: 1px solid var(--border-light);
          transition: border-color 0.2s, transform 0.2s;
        }
        .trust-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
        }

        .trust-icon { color: var(--primary); margin-bottom: 16px; }
        .trust-card h3 { font-size: 1.2rem; margin-bottom: 12px; }
        .trust-card p { font-size: 0.95rem; margin-bottom: 0; }

        /* Founder */
        .founder-card {
          display: flex;
          gap: 24px;
          background: var(--bg-panel);
          padding: 32px;
          border-radius: var(--radius-lg, 16px);
          border: 1px solid var(--border-light);
          align-items: flex-start;
        }

        .founder-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), #7928CA);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .founder-info { flex: 1; }
        .founder-info h3 { font-size: 1.4rem; margin-bottom: 4px; }
        .founder-role { 
          color: var(--primary) !important; 
          font-weight: 600; 
          font-size: 0.95rem !important;
          margin-bottom: 12px !important;
        }
        .founder-bio { font-size: 0.95rem !important; }

        .founder-links {
          display: flex;
          gap: 16px;
          margin-top: 12px;
        }

        .founder-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .founder-link:hover { color: var(--primary); }

        /* Tools Overview */
        .tools-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 20px;
        }

        .tool-group {
          background: var(--bg-surface);
          padding: 24px;
          border-radius: var(--radius-lg, 16px);
          border: 1px solid var(--border-light);
        }

        .tool-group h4 {
          font-size: 1rem;
          color: var(--primary);
          margin-bottom: 12px;
          font-weight: 600;
        }

        .tool-group ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .tool-group li {
          padding: 6px 0;
          color: var(--text-muted);
          font-size: 0.9rem;
          border-bottom: 1px solid var(--border-light);
        }
        .tool-group li:last-child { border-bottom: none; }

        /* CTA */
        .cta-section {
          text-align: center;
          background: linear-gradient(135deg, var(--bg-surface), var(--bg-panel));
          padding: 48px 32px;
          border-radius: var(--radius-lg, 16px);
          border: 1px solid var(--border-light);
        }

        .cta-section h2 { font-size: 1.6rem; }
        .cta-section p { margin-bottom: 24px; }

        .cta-button {
          display: inline-block;
          background: var(--primary);
          color: black;
          font-weight: 600;
          padding: 12px 32px;
          border-radius: var(--radius-md, 12px);
          border: none;
          cursor: pointer;
          font-size: 1rem;
          transition: transform 0.2s;
        }
        .cta-button:hover { transform: translateY(-2px); }

        @media (max-width: 600px) {
          .trust-grid, .tools-list { grid-template-columns: 1fr; }
          .founder-card { flex-direction: column; align-items: center; text-align: center; }
          .founder-links { justify-content: center; }
          .about-header h1 { font-size: 2rem; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default About;
