import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
    const faqs = [
        {
            q: "How do I compress images without losing quality?",
            a: "Our smart lossy compression algorithm reduces file size by selectively decreasing the number of colors in the image, requiring fewer bytes to store data. The effect is nearly invisible to the eye but it makes a very large difference in file size!"
        },
        {
            q: "Is it safe to upload my private photos?",
            a: "Yes! Online Image Shrinker operates entirely in your browser. Unlike other sites, we do NOT upload your images to any server. Your photos stay on your device 100% of the time."
        },
        {
            q: "Can I convert HEIC to JPG?",
            a: "Absentulley! We support converting iPhone/iPad HEIC photos to widely supported formats like JPG or PNG directly in your browser."
        },
        {
            q: "Why should I resize images for my website?",
            a: "Large images slow down your website, which hurts your Google rankings. Resizing images to the exact dimensions you need (e.g., 800px wide for a blog post) ensures the fastest possible load times."
        }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="faq-section">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-list">
                {faqs.map((item, i) => (
                    <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`} onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                        <div className="faq-question">
                            <h3>{item.q}</h3>
                            {openIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        {openIndex === i && <p className="faq-answer">{item.a}</p>}
                    </div>
                ))}
            </div>

            <style>{`
        .faq-section {
          padding: var(--spacing-xxl) 0;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .section-title {
            text-align: center;
            font-size: 2rem;
            margin-bottom: var(--spacing-xl);
            color: var(--text-main);
        }

        .faq-list {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
        }

        .faq-item {
            background: var(--bg-panel);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: var(--transition-fast);
            overflow: hidden;
        }

        .faq-item:hover {
            border-color: var(--border-active);
        }

        .faq-question {
            padding: var(--spacing-lg);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 500;
            color: var(--text-main);
        }
        
        .faq-question h3 {
             font-size: 1.1rem;
             margin: 0;
        }

        .faq-answer {
            padding: 0 var(--spacing-lg) var(--spacing-lg);
            color: var(--text-muted);
            line-height: 1.6;
            animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
};

export default FAQSection;
