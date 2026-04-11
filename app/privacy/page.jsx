import PrivacyPolicy from '../../src/components/PrivacyPolicy';

export const metadata = {
    title: 'Privacy Policy - Online Image Shrinker',
    description: 'Read the Online Image Shrinker privacy policy. All image processing happens in your browser — we never upload, store, or access your files.',
    alternates: {
        canonical: '/privacy',
    },
};

export default function Page() {
    return <PrivacyPolicy />;
}