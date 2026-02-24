import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Eraser, Minimize2, Crop, ArrowRight, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EcommerceHub = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tools = [
    {
      id: 'remove-bg',
      icon: <Eraser size={24} />,
      title: 'Remove Background',
      desc: 'Create professional white-background product shots instantly.',
      action: () => navigate('/tool/remove-bg')
    },
    {
      id: 'compress',
      icon: <Minimize2 size={24} />,
      title: 'Compress for Web',
      desc: 'Reduce file size by 80% for faster page loads (SEO friendly).',
      action: () => navigate('/tool/compress')
    },
    {
      id: 'crop',
      icon: <Crop size={24} />,
      title: 'Square Crop',
      desc: 'Perfect 1:1 ratio crops for Instagram, Amazon, and Shopify.',
      action: () => navigate('/tool/crop')
    }
  ];

  return (
    <div className="hub-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="badge-pill"><ShoppingBag size={14} /> For E-commerce Sellers</div>
          <h1>Boost Sales with Professional Product Photos</h1>
          <p>Optimize your images for Shopify, Etsy, and Amazon. Remove backgrounds, reduce file size, and crop perfectly—all in one place.</p>
          <div className="trust-badges">
            <span><TrendingUp size={16} /> Fast Loading</span>
            <span><TrendingUp size={16} /> SEO Optimized</span>
            <span><TrendingUp size={16} /> Conversion Ready</span>
          </div>
        </div>
      </div>

      <div className="tools-grid">
        {tools.map((tool, index) => (
          <div key={index} className="hub-card" onClick={tool.action}>
            <div className="icon-box">{tool.icon}</div>
            <h3>{tool.title}</h3>
            <p>{tool.desc}</p>
            <div className="link-text">Open Tool <ArrowRight size={16} /></div>
          </div>
        ))}
      </div>

      <style>{`
        .hub-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          animation: fadeIn 0.5s ease-out;
        }

        .hero-section {
          text-align: center;
          padding: 60px 20px;
          background: linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%);
          border-radius: 24px;
          margin-bottom: 60px;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ECFDF5;
          color: #059669;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 24px;
        }

        h1 {
          font-size: 3rem;
          margin-bottom: 20px;
          background: linear-gradient(90deg, var(--text-main), var(--text-muted));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -1px;
        }

        .hero-content p {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto 32px auto;
          line-height: 1.6;
        }

        .trust-badges {
          display: flex;
          justify-content: center;
          gap: 24px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .trust-badges span {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }

        .hub-card {
          background: var(--bg-panel);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 32px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .hub-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: #10B981;
        }

        .icon-box {
          width: 56px;
          height: 56px;
          background: #ECFDF5;
          color: #10B981;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .hub-card h3 {
          font-size: 1.5rem;
          margin-bottom: 12px;
          color: var(--text-main);
        }

        .hub-card p {
          color: var(--text-muted);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .link-text {
          color: #10B981;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        @media (max-width: 768px) {
          h1 { font-size: 2rem; }
          .trust-badges { flex-direction: column; gap: 12px; }
        }
      `}</style>
    </div>
  );
};

export default EcommerceHub;
