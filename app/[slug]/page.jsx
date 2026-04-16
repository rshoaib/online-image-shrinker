import { notFound } from 'next/navigation';
import SeoLandingPageClient from '../../src/components/SeoLandingPageClient';
import { getToolDataFromSlug, getAllSlugs } from '../../src/utils/routeHelper';
import { getToolContent } from '../../src/content/toolContent';

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const data = getToolDataFromSlug(resolvedParams.slug);
    if (!data) return { title: 'Not Found' };
    const content = getToolContent(resolvedParams.slug);
    const description = content?.metaDesc || data.desc;
    return {
        title: data.title + ' - Online Image Shrinker',
        description,
        alternates: {
            canonical: `/${resolvedParams.slug}`,
        },
        openGraph: {
            title: data.title,
            description,
            type: 'website',
            url: `/${resolvedParams.slug}`,
        },
    };
}

export function generateStaticParams() {
    return getAllSlugs().map(slug => ({ slug }));
}

// Force any slug not produced by generateStaticParams to 404 instead of rendering the SPA fallback.
export const dynamicParams = false;

export default async function Page({ params }) {
    const resolvedParams = await params;
    const data = getToolDataFromSlug(resolvedParams.slug);

    if (!data) {
        notFound();
    }

    return <SeoLandingPageClient slug={resolvedParams.slug} isToolRoute={false} />;
}