import About from '../../src/components/About';

export const metadata = {
    title: 'About - Online Image Shrinker',
    description: 'Learn about Online Image Shrinker — free, privacy-first image compression and editing tools that run entirely in your browser. No uploads, no servers.',
    alternates: {
        canonical: '/about',
    },
};

export default function Page() {
    return <About />;
}