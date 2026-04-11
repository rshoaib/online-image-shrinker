import BlogPost from '../../../src/components/BlogPost';
import { supabaseServer } from '../../../src/lib/supabaseServer';

export async function generateMetadata({ params }) {
    const { slug } = await params;

    if (!supabaseServer) {
        return { title: 'Blog Post - Online Image Shrinker' };
    }

    const { data: article } = await supabaseServer
        .from('blog_posts')
        .select('title, excerpt, image, slug, date, display_date')
        .eq('slug', slug)
        .single();

    if (!article) {
        return { title: 'Not Found - Online Image Shrinker' };
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

export default function Page() {
    return <BlogPost />;
}