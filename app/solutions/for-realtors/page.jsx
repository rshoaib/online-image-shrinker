import RealtorHub from '../../../src/components/RealtorHub';

export const metadata = {
    title: 'Real Estate Photo Editor & Resizer - Online Image Shrinker',
    description: 'Optimize property photos for MLS & Zillow. Resize, brighten, and watermark images instantly.',
    alternates: {
        canonical: '/solutions/for-realtors',
    },
    openGraph: {
        title: 'Real Estate Photo Editor & Resizer',
        description: 'Optimize property photos for MLS & Zillow. Resize, brighten, and watermark images instantly.',
        type: 'website',
        url: '/solutions/for-realtors',
    },
};

export default function Page() {
    return <RealtorHub />;
}