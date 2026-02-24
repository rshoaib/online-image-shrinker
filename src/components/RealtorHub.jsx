import { useNavigate } from 'react-router-dom';
import { Home, Zap, Maximize2, Type, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RealtorHub = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tools = [
    {
      id: 'resize',
      icon: <Maximize2 size={24} />,
      title: 'Resize for MLS',
      desc: 'Resize photos to fit MLS & Zillow requirements instantly.',
      action: () => navigate('/tool/resize')
    },
    {
      id: 'upscale',
      icon: <Zap size={24} />,
      title: 'Brighten & Upscale',
      desc: 'Fix dark property photos and increase resolution with AI.',
      action: () => navigate('/tool/upscale')
    },
    {
      id: 'watermark',
      icon: <Type size={24} />,
      title: 'Brand Your Photos',
      desc: 'Add your agency logo or watermark to protect your listings.',
      action: () => navigate('/watermark-photos-online')
    }
  ];

  return (
    <div className="hub-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="badge-pill"><Home size={14} /> For Real Estate Agents</div>
          <h1>Sell Homes Faster with Perfect Photos</h1>
          <p>The all-in-one toolkit for Realtors to prepare listing photos. Resize for MLS, brighten dark rooms, and brand your images in seconds.</p>
          <div className="trust-badges">
            <span><CheckCircle2 size={16} /> MLS Compliant</span>
            <span><CheckCircle2 size={16} /> 100% Private</span>
            <span><CheckCircle2 size={16} /> No Sign-up</span>
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
          background: linear-gradient(180deg, rgba(0, 102, 255, 0.05) 0%, transparent 100%);
          border-radius: 24px;
          margin-bottom: 60px;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #E0F2FE;
          color: #0284C7;
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
          border-color: #0EA5E9;
        }

        .icon-box {
          width: 56px;
          height: 56px;
          background: #F0F9FF;
          color: #0EA5E9;
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
          color: #0EA5E9;
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

export default RealtorHub;
