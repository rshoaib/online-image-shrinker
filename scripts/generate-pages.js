import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appDir = path.join(__dirname, '../app');

// Ensure directory exists
function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const staticPages = ['about', 'contact', 'privacy', 'terms'];
staticPages.forEach(page => {
    const componentName = page.charAt(0).toUpperCase() + page.slice(1) + (page === 'privacy' ? 'Policy' : page === 'terms' ? 'OfService' : '');
    ensureDir(path.join(appDir, page));
    fs.writeFileSync(path.join(appDir, page, 'page.jsx'), `
import ${componentName} from '../../src/components/${componentName}';

export default function Page() {
    return <${componentName} />;
}
    `.trim());
});

// 2. Solutions Pages
ensureDir(path.join(appDir, 'solutions/for-realtors'));
fs.writeFileSync(path.join(appDir, 'solutions/for-realtors/page.jsx'), `
import RealtorHub from '../../../src/components/RealtorHub';

export const metadata = {
    title: 'Real Estate Photo Editor & Resizer - Online Image Shrinker',
    description: 'Optimize property photos for MLS & Zillow. Resize, brighten, and watermark images instantly.',
};

export default function Page() {
    return <RealtorHub />;
}
`.trim());

ensureDir(path.join(appDir, 'solutions/for-ecommerce'));
fs.writeFileSync(path.join(appDir, 'solutions/for-ecommerce/page.jsx'), `
import EcommerceHub from '../../../src/components/EcommerceHub';

export const metadata = {
    title: 'E-commerce Product Photo Optimizer - Online Image Shrinker',
    description: 'Prepare product photos for Shopify, Etsy & Amazon. Remove backgrounds and crop for sales.',
};

export default function Page() {
    return <EcommerceHub />;
}
`.trim());

// 3. Tool Route
ensureDir(path.join(appDir, 'tool/[toolId]'));
fs.writeFileSync(path.join(appDir, 'tool/[toolId]/page.jsx'), `
import SeoLandingPageClient from '../../../src/components/SeoLandingPageClient';

// Using a simplified dynamic approach for /tool/*
export default async function Page({ params }) {
    const resolvedParams = await params;
    
    // We pass toolId to SeoLandingPageClient, which uses toolI18nMap to derive the exact tool string client-side
    return <SeoLandingPageClient slug={resolvedParams.toolId} isToolRoute={true} />;
}
`.trim());

// 4. Root Slug Route for SEO Landing Pages
ensureDir(path.join(appDir, '[slug]'));
fs.writeFileSync(path.join(appDir, '[slug]/page.jsx'), `
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
`.trim());

// 5. Blog
ensureDir(path.join(appDir, 'blog'));
fs.writeFileSync(path.join(appDir, 'blog/page.jsx'), `
import BlogList from '../../src/components/BlogList';

export default function Page() {
    return <BlogList />;
}
`.trim());

ensureDir(path.join(appDir, 'blog/[slug]'));
fs.writeFileSync(path.join(appDir, 'blog/[slug]/page.jsx'), `
import BlogPost from '../../../src/components/BlogPost';

export default function Page() {
    return <BlogPost />;
}
`.trim());

console.log("Next.js app directory structure created!");
