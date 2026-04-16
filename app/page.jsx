
import ToolSelector from '../src/components/ToolSelector';
import '../src/styles/hero.css';

export const metadata = {
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <ToolSelector />
    </>
  );
}
