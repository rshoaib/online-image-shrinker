import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import SeoWrapper from './SeoWrapper';

const NotFound = () => {
  return (
    <SeoWrapper 
      title="Page Not Found - Online Image Shrinker"
      description="The page you're looking for doesn't exist. Browse our free image tools instead."
    >
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-code">404</div>
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-desc">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="nf-btn nf-btn-primary">
              <Home size={18} /> Go to Homepage
            </Link>
            <Link to="/blog" className="nf-btn nf-btn-secondary">
              <Search size={18} /> Browse Guides
            </Link>
          </div>
        </div>

        <style>{`
          .not-found-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            text-align: center;
            padding: 40px 20px;
            animation: fadeIn 0.5s ease-out;
          }

          .not-found-code {
            font-size: 8rem;
            font-weight: 800;
            line-height: 1;
            background: linear-gradient(135deg, var(--primary), #0044cc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 16px;
          }

          .not-found-title {
            font-size: 2rem;
            color: var(--text-main);
            margin-bottom: 12px;
          }

          .not-found-desc {
            color: var(--text-muted);
            font-size: 1.1rem;
            margin-bottom: 32px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
          }

          .not-found-actions {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .nf-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            border-radius: var(--radius-md);
            font-weight: 600;
            font-size: 0.95rem;
            text-decoration: none;
            transition: all 0.3s;
          }

          .nf-btn-primary {
            background: linear-gradient(135deg, #0066ff, #0044cc);
            color: white;
            box-shadow: 0 4px 15px rgba(0, 102, 255, 0.3);
          }
          .nf-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 102, 255, 0.4);
          }

          .nf-btn-secondary {
            background: var(--bg-surface);
            color: var(--text-main);
            border: 1px solid var(--border-light);
          }
          .nf-btn-secondary:hover {
            border-color: var(--primary);
            color: var(--primary);
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </SeoWrapper>
  );
};

export default NotFound;
