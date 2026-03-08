import { useState } from 'react';
import { Github, Coffee, Globe, Moon, Sun, Menu, X } from 'lucide-react';
import InstallPrompt from './InstallPrompt';
import AdSlot from './AdSlot';
import logoUrl from '../assets/logo.png';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { usePWA } from '../hooks/usePWA';
import { useLocation } from 'react-router-dom';

const Layout = ({ children, onNavigate }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isInstallable, install } = usePWA();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  const handleNavClick = (dest) => {
    setMenuOpen(false);
    onNavigate && onNavigate(dest);
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="logo-container" onClick={() => handleNavClick('home')} style={{cursor: 'pointer'}}>
          <img src={logoUrl} alt="Online Image Shrinker" className="logo-img" />
          <div className="logo-text">
            Online<span className="text-highlight">ImageShrinker</span>
          </div>
        </div>
        
        {/* Desktop Nav */}
        <nav className="nav nav-desktop">
          <button className="lang-btn" onClick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}>
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
          {!isHome && <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className="nav-link">{t('common.back')}</a>}
          <a href="/blog" onClick={(e) => { e.preventDefault(); handleNavClick('blog'); }} className="nav-link">{t('common.blog')}</a>
          <a href="/about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }} className="nav-link">About</a>
          <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }} className="nav-link">Contact</a>
        </nav>

        {/* Mobile Hamburger */}
        <div className="mobile-controls">
          <button className="lang-btn" onClick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}>
             {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button 
            className="hamburger-btn" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <nav className="mobile-menu" role="navigation" aria-label="Mobile navigation">
          <div className="mobile-menu-inner">
            <div className="lang-selector-wrapper mobile-lang">
               <Globe size={18} className="lang-icon" aria-hidden="true"/>
               <label htmlFor="language-select-mobile" className="sr-only">Select Language</label>
               <select 
                 id="language-select-mobile"
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
            {!isHome && <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className="mobile-nav-link">{t('common.back')}</a>}
            <a href="/blog" onClick={(e) => { e.preventDefault(); handleNavClick('blog'); }} className="mobile-nav-link">{t('common.blog')}</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }} className="mobile-nav-link">About</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }} className="mobile-nav-link">Contact</a>
          </div>
        </nav>
      )}

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
            <a href="/privacy" onClick={(e) => { e.preventDefault(); handleNavClick('privacy'); }} className="footer-link">{t('common.privacy_policy')}</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); handleNavClick('terms'); }} className="footer-link">Terms</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }} className="footer-link">Contact</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }} className="footer-link">About Us</a>
            {isInstallable && (
              <button onClick={install} className="footer-link install-btn-footer">
                Install App
              </button>
            )}
            <a href="/blog" onClick={(e) => { e.preventDefault(); handleNavClick('blog'); }} className="footer-link">{t('common.blog')}</a>
           <a href="https://github.com/rshoaib/online-image-shrinker" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="View source code on GitHub"><Github size={16} aria-hidden="true" /></a>
        </div>
        <div className="footer-crosslinks">
          <p className="crosslinks-label">Our Other Free Tools</p>
          <div className="footer-links">
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
        <a href="/resize-passport-photo" onClick={(e) => { e.preventDefault(); handleNavClick('resize-passport-photo'); }}>Passport Photo</a>
        <a href="/resize-for-youtube" onClick={(e) => { e.preventDefault(); handleNavClick('resize-for-youtube'); }}>YouTube Thumbnail</a>
        <a href="/jpg-to-pdf" onClick={(e) => { e.preventDefault(); handleNavClick('jpg-to-pdf'); }}>Image to PDF</a>
        <a href="/compress-png" onClick={(e) => { e.preventDefault(); handleNavClick('compress-png'); }}>Compress PNG</a>
        <a href="/resize-for-instagram" onClick={(e) => { e.preventDefault(); handleNavClick('resize-for-instagram'); }}>Instagram Resizer</a>
        <a href="/photo-filters-online" onClick={(e) => { e.preventDefault(); handleNavClick('photo-filters-online'); }}>Photo Filters</a>
        <a href="/qr-code-generator" onClick={(e) => { e.preventDefault(); handleNavClick('qr-code-generator'); }}>QR Code Generator</a>
        <a href="/remove-background" onClick={(e) => { e.preventDefault(); handleNavClick('remove-background'); }}>Remove Background</a>
        <a href="/collage-maker" onClick={(e) => { e.preventDefault(); handleNavClick('collage-maker'); }}>Collage Maker</a>
        <a href="/meme-generator-online" onClick={(e) => { e.preventDefault(); handleNavClick('meme-generator-online'); }}>Meme Generator</a>
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
          border: 1px solid var(--primary-glow);
          box-shadow: 0 0 15px var(--primary-glow);
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

        /* Desktop Nav */
        .nav-desktop {
          display: flex;
          gap: var(--spacing-lg);
          align-items: center;
        }

        .mobile-controls {
          display: none;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .hamburger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          color: var(--text-main);
          transition: var(--transition-fast);
        }

        .hamburger-btn:hover {
          background: var(--bg-surface);
        }

        /* Mobile Menu */
        .mobile-menu {
          display: none;
          background: var(--bg-panel);
          border-bottom: 1px solid var(--border-light);
          padding: var(--spacing-md) var(--spacing-xl);
          animation: slideDown 0.2s ease-out;
          position: sticky;
          top: 80px;
          z-index: 49;
        }

        .mobile-menu-inner {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .mobile-nav-link {
          display: block;
          padding: 12px 16px;
          color: var(--text-main);
          text-decoration: none;
          font-weight: 500;
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
        }

        .mobile-nav-link:hover {
          background: var(--bg-surface);
          color: var(--primary);
        }

        .mobile-lang {
          margin-bottom: var(--spacing-sm);
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid var(--border-light);
        }

        .lang-selector-wrapper {
           display: flex;
           align-items: center;
           background: transparent;
           border: 1px solid var(--border-light);
           border-radius: 20px;
           padding: 2px 12px;
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
           pointer-events: none;
        }

        .lang-select {
           background: transparent;
           border: none;
           color: var(--text-main);
           font-size: 0.85rem;
           font-weight: 600;
           cursor: pointer;
           outline: none;
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
          flex-wrap: wrap;
          gap: 20px;
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
          text-decoration: none;
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
          flex-wrap: wrap;
        }

        .footer-crosslinks {
          width: 100%;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-light);
          text-align: center;
        }

        .crosslinks-label {
          font-size: 0.7rem;
          opacity: 0.5;
          margin-bottom: 0.5rem;
        }

        .footer-crosslinks .footer-links {
          font-size: 0.75rem;
          justify-content: center;
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

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
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

          .nav-desktop {
            display: none;
          }

          .mobile-controls {
            display: flex;
          }

          .mobile-menu {
            display: block;
            top: 60px;
          }

          .footer {
            flex-direction: column;
            text-align: center;
          }
          
          .footer-links {
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
