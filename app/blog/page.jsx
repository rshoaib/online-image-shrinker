import BlogList from '../../src/components/BlogList';
import { getAllPosts } from '../../src/lib/blogPosts';

export const metadata = {
    title: 'Image Editing Guides & Tutorials - Online Image Shrinker',
    description: 'Free guides on compressing, resizing, converting, and editing images. Tips for Instagram grids, ecommerce photos, real estate, and more.',
    alternates: {
        canonical: '/blog',
    },
};

export default function Page() {
    // Hardcoded posts loaded from src/content/blog/*.md at build time.
    // We strip `content` so the full markdown bodies don't bloat the listing
    // page payload — only metadata is needed for the cards.
    const articles = getAllPosts().map(({ content, ...meta }) => meta);
    return <BlogList articles={articles} />;
}
