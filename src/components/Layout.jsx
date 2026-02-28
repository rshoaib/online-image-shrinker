import { Github, Coffee, Globe, Moon, Sun } from 'lucide-react';
import InstallPrompt from './InstallPrompt';
import AdSlot from './AdSlot';
import logoUrl from '../assets/logo.png';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { usePWA } from '../hooks/usePWA';

const Layout = ({ children, onNavigate }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isInstallable, install } = usePWA();

  // Language selector is now handled via the dropdown directly

  return (
    <div className="layout">
      <header className="header">
        <div className="logo-container" onClick={() => onNavigate && onNavigate('home')} style={{cursor: 'pointer'}}>
          <img src={logoUrl} alt="Online Image Shrinker" className="logo-img" />
          <div className="logo-text">
            Online<span className="text-highlight">ImageShrinker</span>
          </div>
        </div>
        <nav className="nav">
          <button className="lang-btn" onClick={toggleTheme} title="Toggle Theme">
             {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <div className="lang-selector-wrapper">
             <Globe size={18} className="lang-icon" aria-hidden="true"/>
             <label htmlFor="language-select" className="sr-only">Select Language</label>
             <select 
               id="language-select"
               className="lang-select" 
               value={i18n.language} 
               onChange={(e) => i18n.changeLanguage(e.target.value)}
               aria-label="Select language"
             >
               <option value="en">English</option>
               <option value="es">Español</option>
               <option value="de">Deutsch</option>
               <option value="fr">Français</option>
               <option value="pt">Português</option>
               <option value="it">Italiano</option>
             </select>
          </div>
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('home'); }} className="nav-link">{t('common.back')}</a>
          <a href="/blog" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('blog'); }} className="nav-link">{t('common.blog')}</a>
          <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('about'); }} className="nav-link">About</a>
          <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('contact'); }} className="nav-link">Contact</a>
        </nav>
      </header>

      <main className="main-content">
        {children}
      </main>

      <InstallPrompt />

      {/* AdSense: responsive banner above footer — safe distance from interactive elements */}
      <AdSlot format="responsive" slot={import.meta.env.VITE_AD_SLOT_FOOTER || ''} className="footer-ad" />

      <footer className="footer">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} OnlineImageShrinker. 100% Client-Side Privacy.
        </p>
        <div className="footer-links">
           <a 
             href="https://www.buymeacoffee.com/rshoaib" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="footer-link coffee-link"
           >
             <Coffee size={16} /> <span>Donate</span>
           </a>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('privacy'); }} className="footer-link">{t('common.privacy_policy')}</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('terms'); }} className="footer-link">Terms</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('contact'); }} className="footer-link">Contact</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('about'); }} className="footer-link">About Us</a>
            {isInstallable && (
              <button onClick={install} className="footer-link install-btn-footer">
                Install App
              </button>
            )}
            <a href="/blog" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('blog'); }} className="footer-link">{t('common.blog')}</a>
           <a href="https://github.com/rshoaib/online-image-shrinker" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="View source code on GitHub"><Github size={16} aria-hidden="true" /></a>
        </div>
        <div className="footer-crosslinks" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.5rem' }}>Our Other Free Tools</p>
          <div className="footer-links" style={{ fontSize: '0.75rem' }}>
            <a href="https://dailysmartcalc.com" target="_blank" rel="noopener noreferrer" className="footer-link">Smart Calculators</a>
            <a href="https://mycalcfinance.com" target="_blank" rel="noopener noreferrer" className="footer-link">Finance Calculators</a>
            <a href="https://legalpolicygen.com" target="_blank" rel="noopener noreferrer" className="footer-link">Legal Policy Generator</a>
            <a href="https://tinypdftools.com" target="_blank" rel="noopener noreferrer" className="footer-link">Tiny PDF Tools</a>
            <a href="https://imrizwan.com" target="_blank" rel="noopener noreferrer" className="footer-link">Developer Blog</a>
          </div>
        </div>
      </footer>

      <div className="quick-links">
        <span>Popular Tools:</span>
        <a href="/resize-passport-photo" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('resize-passport-photo'); }}>Passport Photo</a>
        <a href="/resize-for-youtube" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('resize-for-youtube'); }}>YouTube Thumbnail</a>
        <a href="/jpg-to-pdf" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('jpg-to-pdf'); }}>Image to PDF</a>
        <a href="/compress-png" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('compress-png'); }}>Compress PNG</a>
        <a href="/resize-for-instagram" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('resize-for-instagram'); }}>Instagram Resizer</a>
        <a href="/photo-filters-online" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('photo-filters-online'); }}>Photo Filters</a>
        <a href="/qr-code-generator" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('qr-code-generator'); }}>QR Code Generator</a>
        <a href="/remove-background" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('remove-background'); }}>Remove Background</a>
        <a href="/collage-maker" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('collage-maker'); }}>Collage Maker</a>
        <a href="/meme-generator-online" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('meme-generator-online'); }}>Meme Generator</a>
      </div>

      <div className="quick-links" style={{ borderTop: 'none', paddingTop: '0' }}>
        <span>Our Other Tools:</span>
        <a href="https://dailysmartcalc.com" target="_blank" rel="noopener noreferrer">Smart Calculators</a>
        <a href="https://mycalcfinance.com" target="_blank" rel="noopener noreferrer">Finance Calculators</a>
        <a href="https://legalpolicygen.com" target="_blank" rel="noopener noreferrer">Legal Policy Generator</a>
        <a href="https://imrizwan.com" target="_blank" rel="noopener noreferrer">Developer Blog</a>
      </div>

      <style>{`
        .layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--spacing-xl);
          height: 80px;
          border-bottom: 1px solid var(--border-light);
          background-color: var(--bg-panel);
          opacity: 0.95;
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .logo-img {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          object-fit: cover;
          border: 1px solid rgba(0, 240, 255, 0.2);
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
        }

        .text-highlight {
          color: var(--primary);
        }

        .nav {
          display: flex;
          gap: var(--spacing-lg);
          align-items: center;
        }

        .lang-selector-wrapper {
           display: flex;
           align-items: center;
           background: transparent;
           border: 1px solid var(--border-light);
           border-radius: 20px;
           padding: 2px 12px; /* Adjusted padding */
           gap: 6px;
           position: relative;
           transition: 0.2s;
        }

        .lang-selector-wrapper:hover {
           background: var(--bg-surface);
           border-color: var(--primary);
        }

        .lang-icon {
           color: var(--text-muted);
           pointer-events: none; /* Let clicks pass through if needed, though select handles it */
        }

        .lang-select {
           background: transparent;
           border: none;
           color: var(--text-main);
           font-size: 0.85rem;
           font-weight: 600;
           cursor: pointer;
           outline: none;
           appearance: none; /* Hides default arrow */
           padding: 4px 16px 4px 4px; /* Space for custom arrow if we added one, or just clean look */
           /* Re-enabling standard arrow for usability if appearance:none is too aggressive without replacement */
           appearance: auto; 
           -webkit-appearance: auto;
           max-width: 100px;
        }

        .lang-select option {
           background-color: var(--bg-panel);
           color: var(--text-main);
        }

        .nav-link {
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition-fast);
        }

        .nav-link:hover, .nav-link.active {
          color: var(--text-main);
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: var(--spacing-xl);
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .footer {
          border-top: 1px solid var(--border-light);
          padding: var(--spacing-lg) var(--spacing-xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--text-muted);
          font-size: 0.875rem;
          background-color: var(--bg-panel);
        }

        .footer-link {
          color: var(--text-muted);
          transition: var(--transition-fast);
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: inherit;
          padding: 0;
        }
        
        .footer-link:hover {
          color: var(--primary);
        }

        .coffee-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #FFDD00;
        }
        .coffee-link:hover {
          color: #FFC000;
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .quick-links {
           padding: 20px var(--spacing-xl);
           background: var(--bg-surface);
           border-top: 1px solid var(--border-light);
           display: flex;
           flex-wrap: wrap;
           gap: 16px;
           justify-content: center;
           font-size: 0.8rem;
           color: var(--text-muted);
        }

        .quick-links a {
           color: var(--text-muted);
           text-decoration: none;
           padding: 4px 8px;
           border-radius: var(--radius-sm);
           transition: 0.2s;
        }

        .quick-links a:hover {
           background: var(--bg-panel);
           color: var(--primary);
        }

        .install-btn-footer {
          color: var(--primary);
          font-weight: 600;
        }

        @media (max-width: 600px) {
          .header {
            padding: 0 var(--spacing-md);
            height: 60px;
          }

          .logo-text {
            font-size: 1.1rem;
          }

          .logo-img {
            width: 28px;
            height: 28px;
          }

          .nav {
             gap: var(--spacing-md);
             font-size: 0.9rem;
          }

          .footer {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
          
          .footer-links {
             flex-wrap: wrap;
             justify-content: center;
          }
          
          .main-content {
             padding: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
