import NotFound from '../src/components/NotFound';

export const metadata = {
  title: 'Page Not Found - Online Image Shrinker',
  description: 'The page you are looking for does not exist. Browse our free privacy-first image tools from the homepage.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFoundPage() {
  return <NotFound />;
}
