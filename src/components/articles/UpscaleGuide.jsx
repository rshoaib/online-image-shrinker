import { Link } from 'react-router-dom';
import SeoWrapper from '../SeoWrapper';
import { Zap, Check } from 'lucide-react';

const UpscaleGuide = () => {
  return (
    <SeoWrapper
      title="How to Upscale Images without Losing Quality (AI Tool) - Online Image Shrinker"
      description="Increase image resolution by 2x or 4x using free AI upscaling technology. Restore old photos and print with high quality."
    >
      <div className="article-container">
        <Link to="/blog" className="back-link">← Back to Guides</Link>
        
        <article>
          <header>
            <div className="icon-badge">
               <Zap size={32} color="white" />
            </div>
            <h1>How to Upscale Images without Losing Quality</h1>
            <p className="subtitle">Turn blurry, low-resolution photos into crisp, high-definition images using AI.</p>
          </header>

          <img 
            src="/guide-images/upscale-guide.png" 
            alt="AI Image Upscaler Interface" 
            className="hero-image"
          />

          <div className="content">
            <p>One of the most common problems in digital photography is low resolution. Maybe you cropped a photo too much, or you have an old image from a 2010 smartphone. Traditional resizing makes these images pixelated and blurry. AI Upscaling solves this.</p>

            <h2>What is AI Upscaling?</h2>
            <p>Unlike standard resizing (which just stretches pixels), AI Upscaling uses machine learning models trained on millions of images to "guess" and reconstruct the missing details. It literally adds new pixels to the image that look natural, resulting in sharp edges and clear textures.</p>

            <h2>When should you upscale?</h2>
            <ul>
              <li><strong>Printing:</strong> If your image is too small to print on a poster or canvas.</li>
              <li><strong>Restoration:</strong> Fixing old, grainy family photos.</li>
              <li><strong>Web Assets:</strong> Improving the quality of product images for your store.</li>
              <li><strong>Wallpapers:</strong> Making a small image fit your 4K monitor.</li>
            </ul>

            <div className="step-box">
               <h3>How to use our AI Upscaler:</h3>
               <ol>
                 <li>Go to <Link to="/tool/upscale">AI Image Upscaler</Link>.</li>
                 <li>Upload your small or blurry image.</li>
                 <li>Select <strong>2x</strong> or <strong>4x</strong> magnification.</li>
                 <li>Click "Start Upscaling". The AI runs directly in your browser!</li>
                 <li>Download the enhanced image.</li>
               </ol>
            </div>

            <Link to="/ai-image-upscaler" className="cta-button">Upscale Image Now</Link>

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

export default UpscaleGuide;
