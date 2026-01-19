import { Link } from 'react-router-dom';
import SeoWrapper from '../SeoWrapper';

const InstagramGuide = () => {
  return (
    <SeoWrapper
      title="How to Resize Images for Instagram (2025 Guide) - Online Image Shrinker"
      description="The ultimate guide to Instagram image sizes. Learn the perfect dimensions for Posts, Stories, and Reels."
    >
      <div className="article-container">
        <Link to="/blog" className="back-link">← Back to Guides</Link>
        
        <article>
          <header>
            <h1>How to Resize Images for Instagram</h1>
            <p className="subtitle">Stop your photos from getting cropped or blurry.</p>
          </header>

          <div className="content">
            <p>Instagram is picky. If your photo isn't the exact right size, they will compress it, crop it, or make it look blurry. Here is the cheat sheet you need for 2026.</p>

            <h2>1. Instagram Profile Picture</h2>
            <p><strong>Size:</strong> 320 x 320 pixels</p>
            <p>Your profile picture is small but important. Uploading a massive 4000px image here is a waste and often results in bad compression artifacts.</p>

            <h2>2. Instagram Feed Posts</h2>
            <ul>
              <li><strong>Square:</strong> 1080 x 1080 px (1:1 ratio)</li>
              <li><strong>Portrait (Best for Reach):</strong> 1080 x 1350 px (4:5 ratio)</li>
              <li><strong>Landscape:</strong> 1080 x 566 px (1.91:1 ratio)</li>
            </ul>
            <div className="tip-box">
              <strong>Pro Tip:</strong> Always use the "Portrait" (4:5) size. It takes up more screen space on the user's phone, which statistically increases engagement!
            </div>
            <Link to="/resize-for-instagram" className="cta-button">Resize for Instagram Now</Link>

            <h2>3. Instagram Stories & Reels</h2>
            <p><strong>Size:</strong> 1080 x 1920 pixels (9:16 aspect ratio)</p>
            <p>If you upload an image that isn't this ratio, Instagram will add ugly black bars or zoom in awkwardly.</p>

            <h2>How to fix your images instantly?</h2>
            <p>You don't need Photoshop. You can use our free tool right here:</p>
            <ol>
              <li>Go to <Link to="/tool/crop">Social Media Cropper</Link>.</li>
              <li>Upload your photo.</li>
              <li>Select "Instagram Portrait" or "Instagram Story".</li>
              <li>Download!</li>
            </ol>
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

          ul, ol {
            margin-bottom: 24px;
            padding-left: 20px;
          }

          li {
            margin-bottom: 8px;
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

export default InstagramGuide;
