'use client';
import Link from 'next/link';
import { FileImage, BookOpen, Shield, Palette, ShoppingBag, Sparkles, Tag, ArrowRight } from 'lucide-react';
import React from 'react';

const categoryIconMap = {
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

const BlogList = ({ articles = [] }) => {
  const sortedArticles = [...articles].sort((a, b) => {
    const getTime = (d) => {
      if (!d) return 0;
      const time = new Date(d).getTime();
      return isNaN(time) ? 0 : time;
    };
    return getTime(b.date) - getTime(a.date);
  });

  return (
    <>
      <div className="blog-container">
        <div className="blog-header">
          <h1>Guides & Tutorials</h1>
          <p>Master your digital images with our expert guides.</p>
        </div>

        <div className="articles-grid">
          {sortedArticles.length === 0 ? (
            <div className="empty-state">No guides found.</div>
          ) : (
            sortedArticles.map((article) => (
              <Link href={`/blog/${article.slug}`} key={article.slug} className="article-card">
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
    </>
  );
};

export default BlogList;
