'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getToolContent } from '../content/toolContent';

// Turn "**bold**" markers into <strong> tags without pulling in a markdown lib.
// Safe: we only render content we authored in toolContent.js.
function renderInlineBold(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) return <strong key={i}>{m[1]}</strong>;
    return <React.Fragment key={i}>{renderInlineLinks(part)}</React.Fragment>;
  });
}

// Turn "[label](path)" markers into internal <a> tags.
function renderInlineLinks(text) {
  if (!text) return null;
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      return (
        <a key={i} href={m[2]} className="tc-link">
          {m[1]}
        </a>
      );
    }
    return part;
  });
}

/**
 * Long-form body content for a tool page: intro, sections, use cases, FAQs.
 * Also injects FAQPage JSON-LD for rich search results.
 *
 * Renders nothing if no content is defined for the given key — keeping the
 * page identical to before on tools we haven't written copy for yet.
 */
const ToolContent = ({ toolKey }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const content = getToolContent(toolKey);
  if (!content) return null;

  const { intro, sections = [], useCases = [], faq = [] } = content;

  const faqJsonLd = faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      }
    : null;

  return (
    <section className="tc-wrap" aria-label="About this tool">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {intro && (
        <div className="tc-intro">
          <p>{renderInlineBold(intro)}</p>
        </div>
      )}

      {sections.map((s, i) => (
        <div key={i} className="tc-section">
          <h2>{s.heading}</h2>
          <p>{renderInlineBold(s.body)}</p>
        </div>
      ))}

      {useCases.length > 0 && (
        <div className="tc-section">
          <h2>Common ways people use it</h2>
          <div className="tc-use-grid">
            {useCases.map((u, i) => (
              <div key={i} className="tc-use-card">
                <h3>{u.title}</h3>
                <p>{renderInlineBold(u.body)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {faq.length > 0 && (
        <div className="tc-section">
          <h2>Frequently asked questions</h2>
          <div className="tc-faq-list">
            {faq.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className={`tc-faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="tc-faq-q"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={18} className="tc-faq-chevron" />
                  </button>
                  {isOpen && (
                    <div className="tc-faq-a">
                      <p>{renderInlineBold(item.a)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .tc-wrap {
          max-width: 860px;
          margin: 40px auto 0;
          padding: 0 20px;
          color: var(--text-main);
        }
        .tc-intro p {
          font-size: 1.1rem;
          line-height: 1.65;
          color: var(--text-main);
          margin: 0 0 24px;
        }
        .tc-section {
          margin: 32px 0;
        }
        .tc-section h2 {
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0 0 12px;
          color: var(--text-main);
        }
        .tc-section > p {
          font-size: 1rem;
          line-height: 1.65;
          color: var(--text-main);
          margin: 0;
        }
        .tc-link {
          color: var(--primary);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
        }
        .tc-link:hover { text-decoration-thickness: 2px; }
        .tc-use-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-top: 14px;
        }
        .tc-use-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 16px 18px;
        }
        .tc-use-card h3 {
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 6px;
          color: var(--text-main);
        }
        .tc-use-card p {
          font-size: 0.92rem;
          line-height: 1.5;
          color: var(--text-muted);
          margin: 0;
        }
        .tc-faq-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 14px;
        }
        .tc-faq-item {
          border: 1px solid var(--border-light);
          border-radius: 10px;
          background: var(--bg-surface);
          overflow: hidden;
        }
        .tc-faq-q {
          width: 100%;
          background: transparent;
          border: none;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 0.98rem;
          font-weight: 600;
          color: var(--text-main);
          cursor: pointer;
          text-align: left;
        }
        .tc-faq-q:hover { background: rgba(0,0,0,0.03); }
        .tc-faq-chevron {
          transition: transform 0.2s ease;
          flex-shrink: 0;
          color: var(--text-muted);
        }
        .tc-faq-item.open .tc-faq-chevron {
          transform: rotate(180deg);
        }
        .tc-faq-a {
          padding: 0 16px 16px;
        }
        .tc-faq-a p {
          margin: 0;
          line-height: 1.6;
          color: var(--text-main);
          font-size: 0.95rem;
        }
      `}</style>
    </section>
  );
};

export default ToolContent;
