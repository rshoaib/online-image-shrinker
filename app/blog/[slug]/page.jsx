import { notFound } from 'next/navigation';
import BlogPost from '../../../src/components/BlogPost';
import { supabaseServer } from '../../../src/lib/supabaseServer';

async function fetchArticle(slug) {
    if (!supabaseServer) return null;
    const { data } = await supabaseServer
        .from('blog_posts')
        .select('title, excerpt, image, slug, date, display_date')
        .eq('slug', slug)
        .single();
    return data || null;
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const article = await fetchArticle(slug);

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
    const article = await fetchArticle(slug);
    // Return a real HTTP 404 (not a soft 404) when the slug doesn't match a post.
    if (!article) notFound();
    return <BlogPost />;
}