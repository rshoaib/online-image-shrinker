import { useState } from 'react';
import { Twitter, Linkedin, Link, Share2, Check } from 'lucide-react';

const ShareCard = ({ savedBytes, percentage }) => {
  const [copied, setCopied] = useState(false);

  // Format bytes to legible string (e.g. 2.4 MB)
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const savedText = formatBytes(savedBytes);
  const shareText = `I just saved ${percentage}% (${savedText}) using OnlineImageShrinker.com! ⚡ 100% Private & Free.`;
  const shareUrl = "https://onlineimageshrinker.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    if (window.gtag) {
      window.gtag('event', 'share_click', { method: 'copy' });
    }
  };

  const handleSocial = (platform) => {
    let url = '';
    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    }

    if (window.gtag) {
      window.gtag('event', 'share_click', { method: platform });
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="share-card">
      <div className="share-header">
        <div className="icon-badge">
          <Share2 size={18} color="var(--primary)" />
        </div>
        <div>
           <h4>Share your savings!</h4>
           <p>Help others save space & privacy.</p>
        </div>
      </div>
      
      <div className="share-stats">
        <span>⚡ Saved <strong>{percentage}%</strong></span>
        <span>📦 <strong>{savedText}</strong></span>
      </div>

      <div className="share-buttons">
        <button onClick={() => handleSocial('twitter')} className="share-btn twitter" title="Share on X">
          <Twitter size={16} />
        </button>
        <button onClick={() => handleSocial('linkedin')} className="share-btn linkedin" title="Share on LinkedIn">
          <Linkedin size={16} />
        </button>
        <button onClick={() => handleSocial('whatsapp')} className="share-btn whatsapp" title="Share on WhatsApp">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </button>
        <button onClick={handleCopy} className={`share-btn copy ${copied ? 'copied' : ''}`} title="Copy Link">
          {copied ? <Check size={16} /> : <Link size={16} />}
        </button>
      </div>

      <style>{`
        .share-card {
          margin-top: 20px;
          padding: 16px;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          animation: slideUp 0.3s ease-out;
        }

        .share-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .icon-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 240, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .share-header h4 {
          margin: 0;
          font-size: 0.95rem;
          color: var(--text-main);
        }

        .share-header p {
          margin: 0;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .share-stats {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          background: var(--bg-panel);
          padding: 8px 12px;
          border-radius: var(--radius-md);
        }
        
        .share-stats strong {
           color: var(--primary);
        }

        .share-buttons {
          display: flex;
          gap: 8px;
        }

        .share-btn {
          flex: 1;
          height: 36px;
          border: none;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
          color: white;
        }

        .share-btn:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        .twitter { background: #1DA1F2; }
        .linkedin { background: #0A66C2; }
        .whatsapp { background: #25D366; }
        .copy { background: var(--surface-hover); color: var(--text-main); border: 1px solid var(--border-light); }
        .copy.copied { background: var(--success); color: white; border-color: var(--success); }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ShareCard;
