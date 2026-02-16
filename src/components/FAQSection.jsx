import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQSection = ({ toolType = 'general' }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const getFaqs = () => {
    const commonFaqs = [
      {
        question: "Is my data private? Do you upload my photos?",
        answer: "Yes, your data is 100% private. All processing happens locally in your browser. Your photos are never uploaded to our servers."
      },
      {
        question: "Is this tool really free?",
        answer: "Yes, our base tools are completely free to use without limits. We believe in providing accessible, high-quality tools for everyone."
      }
    ];

    const specifics = {
      'pdf': [
        { question: "Does this reduce PDF quality?", answer: "We optimize the PDF structure and images to reduce size while maintaining readability. You can choose different compression levels." },
        { question: "Can I merge PDF files?", answer: "Currently we focus on compression, but merging features are coming soon!" }
      ],
      'resize': [
        { question: "Will my image lose quality?", answer: "Resizing down (shrinking) usually maintains quality. Upscaling may cause pixelation unless you use our AI Upscaler." },
        { question: "What dimensions should I use for Instagram?", answer: "For posts use 1080x1080, for stories use 1080x1920." }
      ],
      'crop': [
        { question: "Do you have presets for Social Media?", answer: "Yes! We have built-in presets for Instagram, Facebook, Twitter, YouTube, and LinkedIn." },
        { question: "Can I crop specifically for passport photos?", answer: "Yes, check our Passport Photo tool for specific country requirements." }
      ],
      'passport': [
        { question: "Is this guaranteed to be accepted?", answer: "We provide the correct aspect ratio and dimensions, but please ensure your lighting and background meet official requirements." },
        { question: "How do I print this?", answer: "Download the image and print it on 4x6 inch photo paper at a local kiosk or pharmacy." }
      ],
      'compress': [
        { question: "How much can I reduce the file size?", answer: "Typically we can reduce file size by 50-80% without noticeable quality loss using advanced compression algorithms." },
        { question: "Does it work with WebP?", answer: "Yes, we support JPG, PNG, and WebP compression." }
      ]
    };

    return [...(specifics[toolType] || []), ...commonFaqs];
  };

  const faqs = getFaqs();

  // Inject FAQPage JSON-LD structured data for AEO
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    let script = document.getElementById('faq-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'faq-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(faqSchema);

    return () => {
      const el = document.getElementById('faq-jsonld');
      if (el) el.remove();
    };
  }, [faqs]);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h2><HelpCircle size={24} /> Frequently Asked Questions</h2>
        <p>Everything you need to know about our tools.</p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`} onClick={() => toggle(index)}>
            <div className="faq-question">
              <h3>{faq.question}</h3>
              {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .faq-container {
          max-width: 800px;
          margin: 60px auto;
          padding: 0 20px;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .faq-header h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 2rem;
          color: var(--text-main);
          margin-bottom: 10px;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-item {
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .faq-item:hover {
          border-color: var(--primary);
        }

        .faq-question {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--text-main);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
          background: rgba(0,0,0,0.02);
        }

        .faq-item.open .faq-answer {
          max-height: 200px;
          padding: 20px;
          border-top: 1px solid var(--border-light);
        }

        .faq-answer p {
          color: var(--text-muted);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default FAQSection;
