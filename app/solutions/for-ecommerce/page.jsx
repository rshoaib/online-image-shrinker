import EcommerceHub from '../../../src/components/EcommerceHub';

export const metadata = {
    title: 'E-commerce Product Photo Optimizer - Online Image Shrinker',
    description: 'Prepare product photos for Shopify, Etsy & Amazon. Remove backgrounds and crop for sales.',
    alternates: {
        canonical: '/solutions/for-ecommerce',
    },
    openGraph: {
        title: 'E-commerce Product Photo Optimizer',
        description: 'Prepare product photos for Shopify, Etsy & Amazon. Remove backgrounds and crop for sales.',
        type: 'website',
        url: '/solutions/for-ecommerce',
    },
};

export default function Page() {
    return <EcommerceHub />;
}