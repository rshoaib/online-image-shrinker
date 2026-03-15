import SeoLandingPageClient from '../../src/components/SeoLandingPageClient';
import { getToolDataFromSlug, getAllSlugs } from '../../src/utils/routeHelper';

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const data = getToolDataFromSlug(resolvedParams.slug);
    if (!data) return { title: 'Not Found' };
    return {
        title: data.title + ' - Online Image Shrinker',
        description: data.desc,
    };
}

export function generateStaticParams() {
    return getAllSlugs().map(slug => ({ slug }));
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    
    return <SeoLandingPageClient slug={resolvedParams.slug} isToolRoute={false} />;
}