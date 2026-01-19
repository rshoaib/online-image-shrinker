import { Link } from 'react-router-dom';
import SeoWrapper from '../SeoWrapper';
import { Eraser, Check } from 'lucide-react';

const RemoveBackgroundGuide = () => {
  return (
    <SeoWrapper
      title="How to Remove Background from Image Free (2026 Guide) - Online Image Shrinker"
      description="Learn how to remove backgrounds from images instantly for free using AI. Perfect for e-commerce, logos, and profile pictures."
    >
      <div className="article-container">
        <Link to="/blog" className="back-link">← Back to Guides</Link>
        
        <article>
          <header>
            <div className="icon-badge">
               <Eraser size={32} color="white" />
            </div>
            <h1>How to Remove Background from Image Free</h1>
            <p className="subtitle">The easiest AI-powered way to create transparent images in seconds.</p>
          </header>

          <img 
            src="/guide-images/remove-bg-guide.png" 
            alt="AI Background Remover Interface" 
            className="hero-image"
          />

          <div className="content">
            <p>Removing backgrounds used to take hours of tedious work in Photoshop. Now, thanks to the power of Artificial Intelligence, you can do it instantaneously in your browser using our free tool.</p>

            <h2>Why remove the background?</h2>
            <p>Transparent images are essential for:</p>
            <ul>
              <li><strong>E-commerce:</strong> Making products pop against a clean white background.</li>
              <li><strong>Logos:</strong> Placing your company logo on any colored website or document.</li>
              <li><strong>Profile Pictures:</strong> Create professional headshots by replacing a messy room with a solid color.</li>
              <li><strong>Marketing Materials:</strong> Creating collage-style graphics for social media.</li>
            </ul>

            <div className="step-box">
               <h3>How to use our tool:</h3>
               <ol>
                 <li>Go to <Link to="/tool/remove-bg">AI Background Remover</Link>.</li>
                 <li>Upload or drag & drop your image.</li>
                 <li>Wait a few seconds for the AI to process.</li>
                 <li>Download your high-quality PNG with a transparent background!</li>
               </ol>
            </div>

            <h2>Why use our tool?</h2>
            <div className="benefits-grid">
               <div className="benefit">
                 <Check size={20} color="var(--primary)" />
                 <span><strong>100% Free:</strong> No credits, no subscriptions.</span>
               </div>
               <div className="benefit">
                 <Check size={20} color="var(--primary)" />
                 <span><strong>Private:</strong> Images are processed locally on your device.</span>
               </div>
               <div className="benefit">
                 <Check size={20} color="var(--primary)" />
                 <span><strong>High Quality:</strong> Maintains edge details perfectly.</span>
               </div>
            </div>

            <Link to="/remove-background" className="cta-button">Remove Background Now</Link>

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
            text-align: center;
            margin-bottom: 40px;
          }

          .icon-badge {
             width: 64px;
             height: 64px;
             background: linear-gradient(135deg, #FF0080, #7928CA);
             border-radius: 50%;
             display: flex;
             align-items: center;
             justify-content: center;
             margin: 0 auto 20px;
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

          .hero-image {
             width: 100%;
             border-radius: var(--radius-lg);
             border: 1px solid var(--border-light);
             margin-bottom: 40px;
             box-shadow: 0 10px 40px rgba(0,0,0,0.1);
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
             font-size: 1.2rem;
             color: var(--text-main);
             margin-bottom: 16px; 
          }

          ul, ol {
            margin-bottom: 24px;
            padding-left: 20px;
          }

          li {
            margin-bottom: 8px;
          }

          .step-box {
            background: var(--bg-surface);
            border: 1px solid var(--border-light);
            padding: 24px;
            border-radius: var(--radius-md);
            margin: 30px 0;
          }

          .benefits-grid {
             display: grid;
             gap: 12px;
             margin-bottom: 30px;
          }

          .benefit {
             display: flex;
             align-items: center;
             gap: 10px;
          }

          .cta-button {
            display: block;
            width: 100%;
            text-align: center;
            background: var(--primary);
            color: black;
            font-weight: 600;
            padding: 16px;
            border-radius: var(--radius-md);
            text-decoration: none;
            margin: 40px 0;
            transition: 0.2s;
            font-size: 1.1rem;
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

export default RemoveBackgroundGuide;
