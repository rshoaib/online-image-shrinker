import SeoLandingPageClient from '../../../src/components/SeoLandingPageClient';
import en from '../../../src/locales/en.json';

const toolI18nMap = {
    'compress': 'compress', 'resize': 'resize', 'crop': 'crop',
    'watermark': 'watermark', 'pdf': 'pdf', 'remove-bg': 'remove_bg',
    'upscale': 'upscale', 'grid-splitter': 'grid', 'redact': 'redact',
    'profile-picture': 'profile', 'screenshot-beautifier': 'screenshot',
    'exif': 'exif', 'image-converter': 'converter', 'meme-generator': 'meme',
    'palette-generator': 'palette', 'magic-eraser': 'magic_eraser',
    'ocr': 'ocr', 'qr-code-generator': 'qr_code', 'photo-filters': 'photo_filters',
    'image-compare': 'image_compare', 'social-preview': 'social_preview',
    'video-compressor': 'video_compressor', 'video-to-gif': 'video_to_gif',
    'video-to-audio': 'video_to_audio', 'collage-maker': 'collage',
    'signature-maker': 'signature',
    'favicon-generator': 'favicon', 'svg-to-png': 'svg_to_png',
    'base64-converter': 'base64',
    'rotate-flip': 'rotate_flip',
    'blur-face': 'blur_face',
    'change-bg-color': 'change_bg_color',
};

export async function generateMetadata({ params }) {
    const { toolId } = await params;
    const key = toolI18nMap[toolId];
    const tool = key ? en.home.tools[key] : null;

    const title = tool ? `${tool.title} - Free Online Tool` : 'Image Tool - Online Image Shrinker';
    const description = tool
        ? `${tool.desc} Free, privacy-first — runs entirely in your browser. No uploads required.`
        : 'Free privacy-first image tools that run entirely in your browser.';

    return {
        title: `${title} | Online Image Shrinker`,
        description,
        alternates: {
            canonical: `/tool/${toolId}`,
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: `/tool/${toolId}`,
        },
    };
}

export default async function Page({ params }) {
    const resolvedParams = await params;

    return <SeoLandingPageClient slug={resolvedParams.toolId} isToolRoute={true} />;
}