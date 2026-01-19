import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, FileImage, Zap, Eraser } from 'lucide-react';
import SeoWrapper from './SeoWrapper';

const BlogList = () => {
  const articles = [
    {
      slug: 'how-to-remove-background',
      title: 'How to Remove Background from Image Free (2026 Guide)',
      excerpt: 'The easiest AI-powered way to create transparent images in seconds. No Photoshop needed.',
      icon: <Eraser size={32} color="#FF0080" />,
      date: 'Jan 19, 2026'
    },
    {
      slug: 'ai-image-upscaler-guide',
      title: 'How to Upscale Images without Losing Quality',
      excerpt: 'Turn blurry, low-resolution photos into crisp, high-definition images using AI.',
      icon: <Zap size={32} color="#7928CA" />,
      date: 'Jan 19, 2026'
    },
    {
      slug: 'resize-instagram',
      title: 'How to Resize Images for Instagram (2025 Guide)',
      excerpt: 'Learn the perfect dimensions for Instagram Posts, Stories, and Reels to avoid cropping and blurs.',
      icon: <Instagram size={32} color="#E1306C" />,
      date: 'Jan 16, 2026'
    },
    {
      slug: 'heic-to-jpg',
      title: 'What is a HEIC file and how to convert it to JPG?',
      excerpt: 'Why iPhone photos are HEIC and how to convert them to JPG for free.',
      icon: <FileImage size={32} color="#007AFF" />,
      date: 'Jan 15, 2026'
    },
    {
      slug: 'passport-photo-guide',
      title: 'How to Resize Photo for Passport (3.5x4.5cm)',
      excerpt: 'Stop paying for visa photos. Crop them to the exact 35mm x 45mm standard instantly.',
      icon: <FileImage size={32} color="#007AFF" />, 
      date: 'Jan 16, 2026'
    },
    {
      slug: 'speed-up-website-webp',
      title: 'How to Speed Up Your Website with WebP Compression',
      excerpt: 'Reduce file size by 80% and pass Google Core Web Vitals by converting to WebP.',
      icon: <Zap size={32} color="#FFD700" />,
      date: 'Jan 17, 2026'
    }
  ];

  return (
    <SeoWrapper 
      title="Image Optimization Guides - Online Image Shrinker"
      description="Tips, tutorials, and guides on how to optimize, resize, and compress your images for the web and social media."
    >
      <div className="blog-container">
        <div className="blog-header">
          <h1>Guides & Tutorials</h1>
          <p>Master your digital images with our expert guides.</p>
        </div>

        <div className="articles-grid">
          {articles.map((article) => (
            <Link to={`/blog/${article.slug}`} key={article.slug} className="article-card">
              <div className="article-icon">
                {article.icon}
              </div>
              <div className="article-content">
                <span className="article-date">{article.date}</span>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className="read-more">
                  Read Guide <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <style>{`
          .blog-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
          }

          .blog-header {
            text-align: center;
            margin-bottom: 60px;
          }

          .blog-header h1 {
            font-size: 2.5rem;
            margin-bottom: 16px;
            background: linear-gradient(to right, #fff, #a1a1aa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .blog-header p {
            color: var(--text-muted);
            font-size: 1.1rem;
          }

          .articles-grid {
            display: grid;
            gap: 24px;
          }

          .article-card {
            display: flex;
            gap: 24px;
            background: var(--bg-panel);
            padding: 24px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-light);
            transition: all 0.2s;
            text-decoration: none;
            color: inherit;
          }

          .article-card:hover {
            border-color: var(--primary);
            transform: translateY(-2px);
          }

          .article-icon {
            flex-shrink: 0;
            width: 60px;
            height: 60px;
            background: var(--bg-surface);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .article-content {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .article-date {
            font-size: 0.8rem;
            color: var(--text-dim);
            margin-bottom: 8px;
          }

          .article-content h3 {
            font-size: 1.25rem;
            margin-bottom: 8px;
            color: var(--text-main);
          }

          .article-content p {
            color: var(--text-muted);
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 16px;
          }

          .read-more {
             display: flex;
             align-items: center;
             gap: 6px;
             color: var(--primary);
             font-weight: 500;
             font-size: 0.9rem;
          }

          @media (max-width: 600px) {
            .article-card {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </SeoWrapper>
  );
};

export default BlogList;
