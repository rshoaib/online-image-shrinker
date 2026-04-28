import { notFound } from 'next/navigation';
import BlogPost from '../../../src/components/BlogPost';
import { getPostBySlug, getAllSlugs } from '../../../src/lib/blogPosts';

// Pre-render every blog post at build time. Since all posts are now hardcoded
// as .md files in src/content/blog, the set is fully known up front.
export function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const article = getPostBySlug(slug);

    if (!article) {
        // Tell crawlers this URL is a 404. Pairs with notFound() in the page
        // component to return a real 404 status instead of a soft 404.
        return {
            title: 'Page Not Found - Online Image Shrinker',
            robots: { index: false, follow: false },
        };
    }

    const publishDate = article.date || article.display_date;

    return {
        title: `${article.title} - Online Image Shrinker`,
        description: article.excerpt,
        alternates: {
            canonical: `/blog/${article.slug}`,
        },
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: 'article',
            url: `/blog/${article.slug}`,
            ...(publishDate && { publishedTime: publishDate }),
            ...(article.image && { images: [article.image] }),
        },
        other: {
            'article:published_time': publishDate || '',
        },
    };
}

export default async function Page({ params }) {
    const { slug } = await params;
    const article = getPostBySlug(slug);
    // Return a real HTTP 404 (not a soft 404) when the slug doesn't match a post.
    if (!article) notFound();
    return <BlogPost article={article} />;
}
