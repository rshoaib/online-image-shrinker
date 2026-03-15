import SeoLandingPageClient from '../../../src/components/SeoLandingPageClient';

// Using a simplified dynamic approach for /tool/*
export default async function Page({ params }) {
    const resolvedParams = await params;
    
    // We pass toolId to SeoLandingPageClient, which uses toolI18nMap to derive the exact tool string client-side
    return <SeoLandingPageClient slug={resolvedParams.toolId} isToolRoute={true} />;
}