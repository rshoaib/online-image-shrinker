import { Link } from 'react-router-dom';
import SeoWrapper from '../SeoWrapper';

const HeicGuide = () => {
  return (
    <SeoWrapper
      title="What is a HEIC file? How to Convert HEIC to JPG on Windows"
      description="Can't open iPhone photos on your PC? Learn what HEIC files are and how to convert them to JPG for free."
    >
      <div className="article-container">
        <Link to="/blog" className="back-link">← Back to Guides</Link>
        
        <article>
          <header>
            <h1>What is a HEIC file? (And how to open it)</h1>
            <p className="subtitle">The definitive guide to iPhone's image format.</p>
          </header>

          <div className="content">
            <p>If you have an iPhone, you've probably tried to send a photo to your Windows PC only to find a file ending in <code>.HEIC</code> that you can't open. Frustrating, right?</p>

            <h2>What is HEIC?</h2>
            <p><strong>HEIC</strong> (High Efficiency Image Container) is the file format used by Apple for photos on iOS devices. It's actually quite smart—it compresses images to be about half the size of a JPEG with better quality.</p>
            <p>The problem? <strong>Windows and Android often don't support it by default.</strong></p>

            <h2>How to convert HEIC to JPG?</h2>
            <p>You have a few options:</p>
            
            <h3>Option 1: Change iPhone Settings</h3>
            <p>You can tell your iPhone to stop using HEIC:</p>
            <ul>
                <li>Go to <strong>Settings &gt; Camera &gt; Formats</strong>.</li>
                <li>Select "Most Compatible".</li>
            </ul>
            <p><em>Note: This only works for new photos. Old photos will stay as HEIC.</em></p>

            <h3>Option 2: Use an Online Converter (Recommended)</h3>
            <p>If you already have the files on your computer, the easiest way is to use a free privacy-first converter.</p>
            
            <div className="tip-box">
              <strong>Security Warning:</strong> Many online converters upload your personal photos to their servers. We don't. Our tool converts your HEIC files 100% locally in your browser.
            </div>

            <Link to="/convert-heic-to-jpg" className="cta-button">Convert HEIC to JPG (Private)</Link>

            <h3>Option 3: Windows Extensions</h3>
            <p>You can buy the "HEIF Image Extensions" from the Microsoft Store for $0.99. It adds system support, but costs money.</p>

            <h2>Summary</h2>
            <p>HEIC saves space, but JPG is universal. When in doubt, convert to JPG for sharing with friends on Android or Windows.</p>
          </div>
        </article>

        <style>{`
          .article-container {
            max-width: 700px;
            margin: 0 auto;
            padding: 40px 20px;
          }

          .back-link {
            color: var(--text-dim);
            text-decoration: none;
            display: inline-block;
            margin-bottom: 30px;
            font-size: 0.9rem;
          }
          
          .back-link:hover { color: var(--text-main); }

          article header {
            margin-bottom: 40px;
            border-bottom: 1px solid var(--border-light);
            padding-bottom: 20px;
          }

          h1 {
            font-size: 2.5rem;
            color: var(--text-main);
            margin-bottom: 12px;
            line-height: 1.2;
          }

          .subtitle {
            font-size: 1.2rem;
            color: var(--text-muted);
          }

          .content {
            font-size: 1.05rem;
            line-height: 1.8;
            color: var(--text-secondary);
          }

          h2 {
            font-size: 1.5rem;
            color: var(--text-main);
            margin-top: 40px;
            margin-bottom: 16px;
          }
          
          h3 {
             font-size: 1.25rem;
             color: var(--text-main);
             margin-top: 24px;
             margin-bottom: 12px;
          }

          ul {
            margin-bottom: 24px;
            padding-left: 20px;
          }

          li {
            margin-bottom: 8px;
          }
          
          code {
             background: var(--bg-surface);
             padding: 2px 4px;
             border-radius: 4px;
             color: var(--primary);
             font-family: monospace;
          }

          .tip-box {
            background: rgba(0, 240, 255, 0.05); /* Neon cyan hint */
            border-left: 4px solid var(--primary);
            padding: 16px;
            border-radius: 4px;
            margin: 24px 0;
            color: var(--text-main);
          }

          strong {
             color: var(--text-main);
          }

          .cta-button {
            display: inline-block;
            background: var(--primary);
            color: black;
            font-weight: 600;
            padding: 12px 24px;
            border-radius: var(--radius-md);
            text-decoration: none;
            margin: 20px 0;
            transition: 0.2s;
          }

          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 240, 255, 0.3);
          }
          
          a { color: var(--primary); }
        `}</style>
      </div>
    </SeoWrapper>
  );
};

export default HeicGuide;
