/**
 * AdSlot — A reusable AdSense placeholder component.
 * 
 * When AdSense is approved and a data-ad-slot is provided via env,
 * this renders a standard Google ad unit. Otherwise, it renders
 * an empty reserved space that can be activated later.
 * 
 * Sizes supported:
 *   - "banner" → 728x90 leaderboard (default)
 *   - "rectangle" → 300x250 medium rectangle
 *   - "responsive" → fluid/responsive ad
 */
import { useEffect, useRef } from 'react';

const AD_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || '';

const sizeMap = {
  banner: { width: '728px', height: '90px' },
  rectangle: { width: '300px', height: '250px' },
  responsive: { width: '100%', height: 'auto' },
};

const AdSlot = ({ format = 'banner', slot = '', className = '' }) => {
  const adRef = useRef(null);

  useEffect(() => {
    // Only push ads if the AdSense script is loaded and we have a slot
    if (AD_CLIENT && slot && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Ad push failed, silent fail
      }
    }
  }, [slot]);

  const size = sizeMap[format] || sizeMap.banner;
  const isResponsive = format === 'responsive';

  // If no client ID configured, render a placeholder
  if (!AD_CLIENT) {
    return (
      <div
        className={`ad-slot-placeholder ${className}`}
        style={{
          width: size.width,
          maxWidth: '100%',
          height: isResponsive ? '90px' : size.height,
          margin: '20px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={`ad-slot ${className}`} style={{ margin: '20px auto', textAlign: 'center' }}>
      <ins
        className="adsbygoogle"
        style={{
          display: isResponsive ? 'block' : 'inline-block',
          width: isResponsive ? '100%' : size.width,
          height: isResponsive ? undefined : size.height,
        }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        {...(isResponsive ? { 'data-ad-format': 'auto', 'data-full-width-responsive': 'true' } : {})}
        ref={adRef}
      />
    </div>
  );
};

export default AdSlot;
