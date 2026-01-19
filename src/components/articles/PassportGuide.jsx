import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, Crop } from 'lucide-react';
import SeoWrapper from '../SeoWrapper';

const PassportGuide = () => {
  return (
    <SeoWrapper
      title="How to Resize Photo for Passport Online (3.5x4.5cm) - Free Guide"
      description="Visa photo rejected? Learn how to crop your photo to the exact 35x45mm (3.5x4.5cm) size required for Schengen, UK, and EU passports instantly for free."
    >
      <div className="article-container">
        <article className="blog-post">
          <header className="post-header">
            <span className="post-tag">Tutorial</span>
            <h1 className="post-title">How to Resize Your Photo for a Passport (3.5x4.5cm) in Seconds</h1>
            <p className="post-date">Updated: {new Date().toLocaleDateString()}</p>
          </header>

          <div className="post-content">
            <div className="alert-box warning">
              <strong>The Problem:</strong> Visa applications are strict. If your photo isn't exactly <strong>35mm x 45mm</strong> (or 3.5cm x 4.5cm) with the face centered, it gets rejected.
            </div>

            <p>
              You don't need to pay a pharmacy or studio $15 just to get a digital copy of your passport photo. 
              You can take a selfie and crop it to the legal standards right here, 100% privately.
            </p>

            <h2>Step 1: Take a Good Photo</h2>
            <p>Before you crop, make sure your source image is good:</p>
            <ul>
              <li>Stand against a plain <strong>white or off-white wall</strong>.</li>
              <li>Ensure even lighting (no harsh shadows on face).</li>
              <li>Keep a neutral expression (mouth closed, eyes open).</li>
              <li>Leave plenty of space around your head.</li>
            </ul>

            <h2>Step 2: Upload to the Cropper</h2>
            <p>
              Go to our free <Link to="/resize-passport-photo" className="text-link">Passport Photo Tool</Link>. 
              Since we process everything locally, your face data <strong>never leaves your device</strong>.
            </p>

            <h2>Step 3: Select the "Passport" Preset</h2>
            <p>
              In the crop tool, you will see several buttons. Click the one labeled <strong>Passport (3.5:4.5)</strong>.
              This instantly locks the aspect ratio to the international standard.
            </p>

            <h2>Step 4: Align and Download</h2>
            <p>
              Move the box so your chin and top of head fit comfortably within the grid. 
              Click <strong>"Crop Now"</strong> and then <strong>"Download"</strong>.
            </p>

            <div className="feature-showcase">
              <h3>Try it now:</h3>
              <Link to="/resize-passport-photo" className="cta-button primary">
                <Crop size={18} /> Open Passport Cropper
              </Link>
            </div>

            <h2>Why use this tool?</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <BadgeCheck className="text-primary" />
                <span><strong>Exact Size:</strong> 3.5 x 4.5 cm preset built-in.</span>
              </div>
              <div className="benefit-item">
                <BadgeCheck className="text-primary" />
                <span><strong>Private:</strong> No server uploads.</span>
              </div>
              <div className="benefit-item">
                <BadgeCheck className="text-primary" />
                <span><strong>Free:</strong> Unlimited uses.</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </SeoWrapper>
  );
};

export default PassportGuide;
