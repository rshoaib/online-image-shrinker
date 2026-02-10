import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Is my data private? Do you upload my photos?",
      answer: "Yes, your data is 100% private. All processing happens locally in your browser. Your photos are never uploaded to our servers, ensuring maximum security for your personal and professional images."
    },
    {
      question: "Is this tool really free?",
      answer: "Yes, our base tools are completely free to use without limits. We believe in providing accessible, high-quality tools for everyone. We may introduce premium features for power users in the future."
    },
    {
      question: "What file formats do you support?",
      answer: "We support all major image formats including JPG, PNG, WebP, GIF, and HEIC (iPhone photos). We also handle PDF compression and MP4 video processing."
    },
    {
      question: "Can I use this on my phone?",
      answer: "Absolutely! Our website is fully responsive and works perfectly on iPhone, Android, and tablets. It's like having a pro photo editor in your pocket."
    }
  ];

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
