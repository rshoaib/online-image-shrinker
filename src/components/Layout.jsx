import { Github } from 'lucide-react';
import logoUrl from '../assets/logo.png';

const Layout = ({ children, onNavigate }) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="logo-container" onClick={() => onNavigate && onNavigate('home')} style={{cursor: 'pointer'}}>
          <img src={logoUrl} alt="Online Image Shrinker" className="logo-img" />
          <h1 className="logo-text">
            Online<span className="text-highlight">ImageShrinker</span>
          </h1>
        </div>
        <nav className="nav">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('home'); }} className="nav-link">Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('blog'); }} className="nav-link">Guides</a>
        </nav>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} OnlineImageShrinker. 100% Client-Side Privacy.
        </p>
        <div className="footer-links">
           <button onClick={() => onNavigate && onNavigate('privacy')} className="footer-link">Privacy Policy</button>
           <button onClick={() => onNavigate && onNavigate('blog')} className="footer-link">Guides</button>
           <a href="#" className="footer-link"><Github size={16} /></a>
        </div>
      </footer>

      <div className="quick-links">
        <span>Popular Tools:</span>
        <a href="/resize-passport-photo" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('resize-passport-photo'); }}>Passport Photo Maker</a>
        <a href="/resize-for-youtube" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('resize-for-youtube'); }}>YouTube Thumbnail Resizer</a>
        <a href="/jpg-to-pdf" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('jpg-to-pdf'); }}>Image to PDF</a>
        <a href="/compress-png" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('compress-png'); }}>Compress PNG</a>
        <a href="/resize-for-instagram" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('resize-for-instagram'); }}>Instagram Resizer</a>
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
        }

        .text-highlight {
          color: var(--primary);
        }

        .nav {
          display: flex;
          gap: var(--spacing-lg);
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
      `}</style>
    </div>
  );
};

export default Layout;
