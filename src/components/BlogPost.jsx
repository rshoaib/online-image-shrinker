import { useParams, Navigate, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import SeoWrapper from './SeoWrapper';
import { articles } from '../data/articles';

const BlogPost = () => {
  const { slug } = useParams();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <SeoWrapper 
      title={`${article.title} - Online Image Shrinker`}
      description={article.excerpt}
      schemaType="Article"
      date={article.date}
      author={article.author}
    >
      <div className="article-container">
        <Link to="/blog" className="back-link">
          <ArrowLeft size={16} /> Back to Guides
        </Link>
        
        <article className="blog-post">
          <header className="post-header">
            <span className="category-badge">{article.category}</span>
            <h1>{article.title}</h1>
            <div className="post-meta">
              <span className="meta-item"><Calendar size={14} /> {article.date}</span>
              <span className="meta-item"><User size={14} /> {article.author}</span>
            </div>
          </header>

          {article.coverImage && (
            <div className="post-cover-image">
              <img src={article.coverImage} alt={article.title} />
            </div>
          )}

          <div className="post-content">
            <Markdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </Markdown>
          </div>
          
          <div className="post-footer">
             <div className="share-cta">
               <h3>Find this helpful?</h3>
               <p>Check out our free tools to speed up your workflow.</p>
               <Link to="/" className="cta-button">Exlore Tools</Link>
             </div>
          </div>
        </article>
      </div>

      <style>{`
        .article-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 40px 20px;
          animation: fadeIn 0.5s ease-out;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          text-decoration: none;
          margin-bottom: 32px;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .back-link:hover { color: var(--primary); }

        .post-header {
          margin-bottom: 40px;
          text-align: center;
        }

        .category-badge {
          display: inline-block;
          padding: 4px 12px;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 20px;
          font-size: 0.8rem;
          color: var(--primary);
          margin-bottom: 16px;
          font-weight: 500;
        }

        .post-header h1 {
          font-size: 2.5rem;
          line-height: 1.2;
          margin-bottom: 16px;
          background: linear-gradient(to right, #fff, #a1a1aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .post-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .post-cover-image {
          margin-bottom: 40px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.2);
        }
        
        .post-cover-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Markdown Styles */
        .post-content {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-secondary);
        }

        .post-content h2 {
          font-size: 1.8rem;
          color: var(--text-main);
          margin-top: 48px;
          margin-bottom: 24px;
        }

        .post-content h3 {
          font-size: 1.4rem;
          color: var(--text-main);
          margin-top: 32px;
          margin-bottom: 16px;
        }

        .post-content p {
          margin-bottom: 24px;
        }

        .post-content ul, .post-content ol {
          margin-bottom: 24px;
          padding-left: 24px;
        }

        .post-content li {
          margin-bottom: 8px;
        }
        
        .post-content strong {
          color: var(--text-main);
        }

        .post-content a {
          color: var(--primary);
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .post-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 32px 0;
          font-size: 0.95rem;
        }
        
        .post-content th, .post-content td {
          border: 1px solid var(--border-light);
          padding: 12px;
          text-align: left;
        }
        
        .post-content th {
          background: var(--bg-surface);
          color: var(--text-main);
        }

        .post-footer {
          margin-top: 60px;
          padding-top: 40px;
          border-top: 1px solid var(--border-light);
        }

        .share-cta {
          background: linear-gradient(135deg, var(--bg-surface), var(--bg-panel));
          padding: 32px;
          border-radius: var(--radius-lg);
          text-align: center;
          border: 1px solid var(--border-light);
        }
        
        .share-cta h3 { margin-bottom: 8px; color: var(--text-main); }
        .share-cta p { color: var(--text-muted); margin-bottom: 24px; }
        
        .cta-button {
          display: inline-block;
          background: var(--primary);
          color: black;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: transform 0.2s;
        }
        .cta-button:hover { transform: translateY(-2px); }

        @keyframes fadeIn {
           from { opacity: 0; transform: translateY(10px); }
           to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </SeoWrapper>
  );
};

export default BlogPost;
