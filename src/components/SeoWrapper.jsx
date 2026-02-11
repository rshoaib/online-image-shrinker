import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SeoWrapper = ({ title, description, children, ...props }) => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    // Determine the current full URL
    const currentUrl = window.location.href;
    const defaultImage = "https://onlineimageshrinker.com/og-image.jpg"; // Placeholder, needs actual image
    const finalTitle = title || t('seo.home.title');
    const finalDescription = description || t('seo.home.description');

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

    // Hreflang tags for multilingual SEO
    const supportedLangs = ['en', 'es', 'de', 'fr', 'pt', 'it'];
    // Remove any old hreflang link tags
    document.querySelectorAll('link[hreflang]').forEach(el => el.remove());
    supportedLangs.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = currentUrl; // Same URL, language handled client-side
      document.head.appendChild(link);
    });
    // x-default hreflang
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = currentUrl;
    document.head.appendChild(xDefault);

    // Dynamic html lang attribute
    document.documentElement.lang = i18n.language || 'en';

    // JSON-LD Structured Data
    let scriptJsonLd = document.querySelector('script[type="application/ld+json"]');
    if (!scriptJsonLd) {
      scriptJsonLd = document.createElement('script');
      scriptJsonLd.type = "application/ld+json";
      document.head.appendChild(scriptJsonLd);
    }

    let schemaData;
    if (props.schemaType === 'Article') {
      schemaData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": finalTitle,
        "image": [currentUrl], // Ideally this would be the specific article image
        "datePublished": props.date,
        "author": [{
            "@type": "Person",
            "name": props.author || "Image Shrinker Team"
        }]
      };
    } else {
       schemaData = {
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
    }
    scriptJsonLd.textContent = JSON.stringify(schemaData);

    // Google Search Console Verification
    const gscCode = import.meta.env.VITE_GSC_CODE;
    if (gscCode) {
       updateMeta('google-site-verification', gscCode);
    }

  }, [title, description, location, t, i18n.language, props.schemaType, props.date, props.author]);

  return children;
};

export default SeoWrapper;
