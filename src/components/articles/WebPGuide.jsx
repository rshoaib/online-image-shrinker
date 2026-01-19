import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, Zap, Gauge } from 'lucide-react';
import SeoWrapper from '../SeoWrapper';

const WebPGuide = () => {
  return (
    <SeoWrapper
      title="How to Speed Up Your Website with WebP Compression - Free Guide"
      description="Website loading too slow? Learn how to convert your images to WebP format to reduce file size by 80% and pass Google's Core Web Vitals test."
    >
      <div className="article-container">
        <article className="blog-post">
          <header className="post-header">
            <span className="post-tag">Performance</span>
            <h1 className="post-title">How to Fix "Serve Images in Next-Gen Formats" & Speed Up Your Site</h1>
            <p className="post-date">Updated: {new Date().toLocaleDateString()}</p>
          </header>

          <div className="post-content">
            <div className="alert-box warning">
              <strong>The Problem:</strong> Google hates slow websites. If your portfolio or e-commerce store is loading heavy PNGs or JPEGs, your search ranking (and sales) will suffer.
            </div>

            <p>
              The easiest "quick win" for website speed is converting your old images to <strong>WebP</strong>. 
              It's a modern format developed by Google that is <strong>25-35% smaller</strong> than JPEG and keeps transparency like PNG.
            </p>

            <h2>Why WebP?</h2>
            <p>
              Most website builders (WordPress, Wix, Shopify) now recommend WebP. It helps you pass the 
              <strong> Core Web Vitals</strong> assessment, specifically the "Largest Contentful Paint" (LCP) metric.
            </p>

            <h2>Step 1: Gather Your Heavy Images</h2>
            <p>
              Find the banner images or product photos that are slowing you down. 
              Usually, anything over <strong>200KB</strong> is a candidate for optimization.
            </p>

            <h2>Step 2: Drag & Drop to Converter</h2>
            <p>
              Use our <Link to="/compress-webp" className="text-link">Batch WebP Converter</Link>. 
              You can select 50+ files at once. The processing happens on your device, so it's incredibly fast and private.
            </p>

            <h2>Step 3: Adjust Quality & Convert</h2>
            <p>
              Set the quality slider to around <strong>80%</strong>. This is the sweet spot where the human eye can't tell the difference, 
              but the file size drops dramatically.
            </p>

            <div className="feature-showcase">
              <h3>Start Optimizing Now:</h3>
              <Link to="/compress-webp" className="cta-button primary">
                <Zap size={18} /> Open WebP Converter
              </Link>
            </div>

            <h2>The Results You Can Expect</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <Gauge className="text-primary" />
                <span><strong>Faster Load:</strong> Improved LCP score.</span>
              </div>
              <div className="benefit-item">
                <BadgeCheck className="text-primary" />
                <span><strong>SEO Boost:</strong> Google favors fast sites.</span>
              </div>
              <div className="benefit-item">
                <BadgeCheck className="text-primary" />
                <span><strong>Quality:</strong> Sharp images, tiny size.</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </SeoWrapper>
  );
};

export default WebPGuide;
