import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SeoWrapper = ({ title, description, children }) => {
  const location = useLocation();

  useEffect(() => {
    // Determine the current full URL
    const currentUrl = window.location.href;
    const defaultImage = "https://onlineimageshrinker.com/og-image.jpg"; // Placeholder, needs actual image
    const finalTitle = title || "Online Image Shrinker - Free Privacy-First Tool";
    const finalDescription = description || "Compress, resize, and optimize images locally in your browser. No uploads, 100% privacy guaranteed.";

    // Update Title
    document.title = finalTitle;

    // Helper function to update or create meta tags
    const updateMeta = (name, content, attrName = 'name') => {
      let element = document.querySelector(`meta[${attrName}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Update Standard Meta Description
    updateMeta('description', finalDescription);

    // Update OpenGraph Tags (Facebook, LinkedIn, Discord)
    updateMeta('og:title', finalTitle, 'property');
    updateMeta('og:description', finalDescription, 'property');
    updateMeta('og:url', currentUrl, 'property');
    updateMeta('og:type', 'website', 'property');
    updateMeta('og:image', defaultImage, 'property');

    // Update Twitter Card Tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', finalTitle);
    updateMeta('twitter:description', finalDescription);
    updateMeta('twitter:image', defaultImage);

    // Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = "canonical";
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = currentUrl;

    // JSON-LD Structured Data
    let scriptJsonLd = document.querySelector('script[type="application/ld+json"]');
    if (!scriptJsonLd) {
      scriptJsonLd = document.createElement('script');
      scriptJsonLd.type = "application/ld+json";
      document.head.appendChild(scriptJsonLd);
    }
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online Image Shrinker",
      "url": currentUrl,
      "description": finalDescription,
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };
    scriptJsonLd.textContent = JSON.stringify(schemaData);

    // Google Search Console Verification
    const gscCode = import.meta.env.VITE_GSC_CODE;
    if (gscCode) {
       updateMeta('google-site-verification', gscCode);
    }

  }, [title, description, location]);

  return children;
};

export default SeoWrapper;
