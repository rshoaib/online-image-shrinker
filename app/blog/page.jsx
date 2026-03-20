import BlogList from '../../src/components/BlogList';

export const metadata = {
    title: 'Image Editing Guides & Tutorials - Online Image Shrinker',
    description: 'Free guides on compressing, resizing, converting, and editing images. Tips for Instagram grids, ecommerce photos, real estate, and more.',
    alternates: {
        canonical: '/blog',
    },
};

export default function Page() {
    return <BlogList />;
}