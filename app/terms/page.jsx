import TermsOfService from '../../src/components/TermsOfService';

export const metadata = {
    title: 'Terms of Service - Online Image Shrinker',
    description: 'Terms of service for using Online Image Shrinker free image tools. Understand your rights and responsibilities.',
    alternates: {
        canonical: '/terms',
    },
};

export default function Page() {
    return <TermsOfService />;
}