
import ToolSelector from '../src/components/ToolSelector';
import FeaturesSection from '../src/components/FeaturesSection';
import FAQSection from '../src/components/FAQSection';
import '../src/styles/hero.css';

export default function HomePage() {
  return (
    <>
      <ToolSelector />
      <FeaturesSection />
      <FAQSection />
    </>
  );
}
