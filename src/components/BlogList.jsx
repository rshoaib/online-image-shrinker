import { Link } from 'react-router-dom';
import { FileImage, BookOpen, Shield, Palette, ShoppingBag, Sparkles, Tag, ArrowRight } from 'lucide-react';
import SeoWrapper from './SeoWrapper';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const categoryIconMap = {
  // ... (keep existing map)
  'Tutorials': BookOpen,
  'Guides': FileImage,
  'Explained': BookOpen,
  'Privacy': Shield,
  'Design': Palette,
  'E-commerce': ShoppingBag,
  'Social Media': FileImage,
  'Optimization': Sparkles,
  'Workflow': Tag,
  'Updates': Sparkles,
  'Fun': Sparkles,
};

const BlogSkeleton = () => (
  <div className="article-card skeleton-card">
    <div className="article-icon skeleton-icon"></div>
    <div className="article-content">
      <div className="skeleton-text skeleton-date"></div>
      <div className="skeleton-text skeleton-title"></div>
      <div className="skeleton-text skeleton-desc line-1"></div>
      <div className="skeleton-text skeleton-desc line-2"></div>
      <div className="skeleton-text skeleton-desc line-3"></div>
      <div className="skeleton-text skeleton-button"></div>
    </div>
  </div>
);

const BlogList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        setArticles(data || []);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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
          {loading ? (
             <React.Fragment>
               <BlogSkeleton />
               <BlogSkeleton />
               <BlogSkeleton />
               <BlogSkeleton />
             </React.Fragment>
          ) : articles.length === 0 ? (
            <div className="empty-state">No guides found.</div>
          ) : (
            [...articles]
              .sort((a, b) => {
                const getTime = (d) => {
                  if (!d) return 0;
                  const time = new Date(d).getTime();
                  return isNaN(time) ? 0 : time;
                };
                return getTime(b.date) - getTime(a.date);
              })
              .map((article) => (
              <Link to={`/blog/${article.slug}`} key={article.slug} className="article-card">
                <div className="article-icon">
                  {(() => {
                    const IconComponent = categoryIconMap[article.category] || FileImage;
                    return <IconComponent size={32} color="var(--primary)" />;
                  })()}
                </div>
                <div className="article-content">
                  <span className="article-date">{article.display_date || article.date}{article.read_time ? ` · ${article.read_time}` : ''}</span>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="read-more">
                    Read Guide <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))
          )}
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
            background: linear-gradient(to right, var(--text-main), var(--text-muted));
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

          .loading-state, .empty-state {
            text-align: center;
            padding: 40px;
            color: var(--text-muted);
            font-size: 1.1rem;
            grid-column: 1 / -1;
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
          
          /* Skeleton Loader Styles */
          .skeleton-card {
            pointer-events: none;
          }
          .skeleton-icon {
            background: var(--bg-surface);
            animation: shimmer 1.5s infinite linear;
          }
          .skeleton-text {
            background: var(--bg-surface);
            border-radius: var(--radius-sm);
            margin-bottom: 8px;
            animation: shimmer 1.5s infinite linear;
          }
          .skeleton-date { width: 30%; height: 14px; margin-bottom: 12px; }
          .skeleton-title { width: 80%; height: 24px; margin-bottom: 16px; }
          .skeleton-desc { height: 14px; margin-bottom: 6px; }
          .skeleton-desc.line-1 { width: 100%; }
          .skeleton-desc.line-2 { width: 90%; }
          .skeleton-desc.line-3 { width: 60%; margin-bottom: 24px; }
          .skeleton-button { width: 100px; height: 18px; margin-bottom: 0px; }

          @keyframes shimmer {
            0% {
              background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0));
              background-position: -150px 0;
            }
            100% {
              background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0));
              background-position: 150px 0;
            }
          }

          [data-theme='light'] .skeleton-icon,
          [data-theme='light'] .skeleton-text {
            background-color: var(--border-light);
          }
          
          [data-theme='light'] @keyframes shimmer {
             0% { background-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.02) 20%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0)); background-position: -150px 0; }
             100% { background-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.02) 20%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0)); background-position: 150px 0; }
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
