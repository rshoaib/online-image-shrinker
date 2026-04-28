'use client';
import React from 'react';
import {
    BookOpen,
    FileImage,
    Shield,
    Palette,
    ShoppingBag,
    Sparkles,
    Tag,
    Info,
    Zap,
    // Topic-specific icons
    Instagram,
    Facebook,
    Twitter,
    Youtube,
    Linkedin,
    MessageCircle,
    Mail,
    FileText,
    Film,
    Music,
    QrCode,
    Crop,
    RotateCw,
    Layers,
    EyeOff,
    Search,
    Smile,
    Home,
    PenLine,
    Monitor,
    LayoutGrid,
    Globe,
    Wand2,
    Minimize2,
    Eraser,
    Camera,
    GitCompare,
} from 'lucide-react';

// Category-keyed visual theme — used as a fallback when no specific topic
// matches the post's slug/title/tags.
const CATEGORY_THEME = {
    Tutorials:     { from: '#6366f1', to: '#a855f7', accent: '#c4b5fd', Icon: BookOpen },
    Guides:        { from: '#2563eb', to: '#06b6d4', accent: '#67e8f9', Icon: FileImage },
    Explained:     { from: '#0ea5e9', to: '#14b8a6', accent: '#5eead4', Icon: Info },
    Privacy:       { from: '#059669', to: '#10b981', accent: '#6ee7b7', Icon: Shield },
    Design:        { from: '#db2777', to: '#f43f5e', accent: '#fda4af', Icon: Palette },
    'E-commerce':  { from: '#ea580c', to: '#f59e0b', accent: '#fcd34d', Icon: ShoppingBag },
    'Social Media':{ from: '#0891b2', to: '#3b82f6', accent: '#93c5fd', Icon: FileImage },
    Optimization:  { from: '#ca8a04', to: '#f59e0b', accent: '#fde68a', Icon: Zap },
    Workflow:      { from: '#475569', to: '#0f172a', accent: '#94a3b8', Icon: Tag },
    Updates:       { from: '#7c3aed', to: '#ec4899', accent: '#f0abfc', Icon: Sparkles },
    Fun:           { from: '#d946ef', to: '#f43f5e', accent: '#fbcfe8', Icon: Sparkles },
};

// Topic profiles — first match wins. Keywords are matched (case-insensitive)
// against the post slug + title + tags, so the cover hints at the actual
// subject of the article rather than just its category.
//
// Order matters: more specific platforms/formats first, generic operations
// after. e.g. an Instagram post mentioning "resize" should pick the Instagram
// theme, not the generic "resize" theme.
const TOPIC_PROFILES = [
    // --- Specific platforms (brand-tinted) ---
    { keywords: ['whatsapp'],                      theme: { from: '#075e54', to: '#25d366', accent: '#dcf8c6', Icon: MessageCircle } },
    { keywords: ['instagram'],                     theme: { from: '#833ab4', to: '#fd1d1d', accent: '#fcb045', Icon: Instagram } },
    { keywords: ['facebook'],                      theme: { from: '#1877f2', to: '#3b5998', accent: '#a8c7fa', Icon: Facebook } },
    { keywords: ['twitter'],                       theme: { from: '#0f1419', to: '#1da1f2', accent: '#7fc8f8', Icon: Twitter } },
    { keywords: ['linkedin'],                      theme: { from: '#0a66c2', to: '#0077b5', accent: '#a8d0e6', Icon: Linkedin } },
    { keywords: ['youtube'],                       theme: { from: '#cc0000', to: '#ff0000', accent: '#ffd6d6', Icon: Youtube } },
    { keywords: ['tiktok'],                        theme: { from: '#010101', to: '#ee1d52', accent: '#69c9d0', Icon: Music } },
    { keywords: ['discord'],                       theme: { from: '#404eed', to: '#5865f2', accent: '#c7d2fe', Icon: MessageCircle } },
    { keywords: ['amazon'],                        theme: { from: '#232f3e', to: '#ff9900', accent: '#ffd591', Icon: ShoppingBag } },
    { keywords: ['etsy'],                          theme: { from: '#a04400', to: '#f1641e', accent: '#fed7aa', Icon: ShoppingBag } },
    { keywords: ['shopify'],                       theme: { from: '#004c3f', to: '#95bf47', accent: '#cdebb0', Icon: ShoppingBag } },
    { keywords: ['email', 'gmail', 'outlook'],     theme: { from: '#ea4335', to: '#fbbc05', accent: '#fde68a', Icon: Mail } },
    { keywords: ['real estate', 'mls'],            theme: { from: '#0f766e', to: '#65a30d', accent: '#bbf7d0', Icon: Home } },

    // --- File formats / conversions ---
    { keywords: ['pdf'],                           theme: { from: '#dc2626', to: '#ea580c', accent: '#fecaca', Icon: FileText } },
    { keywords: ['gif'],                           theme: { from: '#7c3aed', to: '#ec4899', accent: '#f0abfc', Icon: Film } },
    { keywords: ['video', 'mp4'],                  theme: { from: '#7c3aed', to: '#3b82f6', accent: '#bfdbfe', Icon: Film } },
    { keywords: ['mp3', 'audio'],                  theme: { from: '#1e3a8a', to: '#3b82f6', accent: '#bfdbfe', Icon: Music } },
    { keywords: ['webp'],                          theme: { from: '#0e7490', to: '#06b6d4', accent: '#a5f3fc', Icon: FileImage } },
    { keywords: ['heic'],                          theme: { from: '#0369a1', to: '#0ea5e9', accent: '#bae6fd', Icon: Camera } },
    { keywords: ['svg'],                           theme: { from: '#1e3a8a', to: '#7c3aed', accent: '#c7d2fe', Icon: FileImage } },
    { keywords: ['base64'],                        theme: { from: '#0f172a', to: '#334155', accent: '#94a3b8', Icon: FileText } },

    // --- Image operations ---
    { keywords: ['qr code', 'qr-code'],            theme: { from: '#0f172a', to: '#475569', accent: '#cbd5e1', Icon: QrCode } },
    { keywords: ['watermark'],                     theme: { from: '#0f766e', to: '#14b8a6', accent: '#99f6e4', Icon: Tag } },
    { keywords: ['resize', 'crop', 'aspect ratio'], theme: { from: '#7c2d12', to: '#ea580c', accent: '#fed7aa', Icon: Crop } },
    { keywords: ['rotate', 'flip'],                theme: { from: '#0e7490', to: '#06b6d4', accent: '#a5f3fc', Icon: RotateCw } },
    { keywords: ['transparent', 'remove background', 'background remov'], theme: { from: '#4338ca', to: '#7c3aed', accent: '#c4b5fd', Icon: Eraser } },
    { keywords: ['blur', 'face'],                  theme: { from: '#1e40af', to: '#3b82f6', accent: '#bfdbfe', Icon: EyeOff } },
    { keywords: ['exif', 'metadata', 'location data'], theme: { from: '#059669', to: '#10b981', accent: '#a7f3d0', Icon: Shield } },
    { keywords: ['privacy', 'private'],            theme: { from: '#065f46', to: '#10b981', accent: '#a7f3d0', Icon: Shield } },
    { keywords: ['ocr', 'extract text'],           theme: { from: '#92400e', to: '#d97706', accent: '#fde68a', Icon: FileText } },
    { keywords: ['palette', 'color'],              theme: { from: '#db2777', to: '#a855f7', accent: '#fbcfe8', Icon: Palette } },
    { keywords: ['filter'],                        theme: { from: '#9333ea', to: '#d946ef', accent: '#f5d0fe', Icon: Wand2 } },
    { keywords: ['upscal', 'enhance', 'low-res'],  theme: { from: '#4f46e5', to: '#a855f7', accent: '#ddd6fe', Icon: Sparkles } },
    { keywords: ['favicon'],                       theme: { from: '#0c4a6e', to: '#0891b2', accent: '#a5f3fc', Icon: Globe } },
    { keywords: ['passport', 'visa'],              theme: { from: '#7e1d1d', to: '#dc2626', accent: '#fecaca', Icon: Camera } },
    { keywords: ['collage', 'mosaic', 'grid'],     theme: { from: '#9333ea', to: '#ec4899', accent: '#fbcfe8', Icon: LayoutGrid } },
    { keywords: ['signature'],                     theme: { from: '#1e293b', to: '#475569', accent: '#cbd5e1', Icon: PenLine } },
    { keywords: ['screenshot'],                    theme: { from: '#0f172a', to: '#1e40af', accent: '#bfdbfe', Icon: Monitor } },
    { keywords: ['meme'],                          theme: { from: '#d946ef', to: '#f43f5e', accent: '#fbcfe8', Icon: Smile } },
    { keywords: ['compare', 'before and after', 'before/after'], theme: { from: '#1e293b', to: '#64748b', accent: '#cbd5e1', Icon: GitCompare } },
    { keywords: ['profile picture', 'pfp'],        theme: { from: '#7c3aed', to: '#ec4899', accent: '#f0abfc', Icon: Camera } },
    { keywords: ['banner'],                        theme: { from: '#1e40af', to: '#06b6d4', accent: '#bae6fd', Icon: Layers } },
    { keywords: ['emoji', 'sticker'],              theme: { from: '#f59e0b', to: '#ec4899', accent: '#fbcfe8', Icon: Smile } },
    { keywords: ['compress', 'shrink', 'reduce size', 'file size'], theme: { from: '#ca8a04', to: '#f59e0b', accent: '#fde68a', Icon: Minimize2 } },
    { keywords: ['optimi', 'speed', 'performance'], theme: { from: '#16a34a', to: '#84cc16', accent: '#d9f99d', Icon: Zap } },
    { keywords: ['seo', 'google search'],          theme: { from: '#1e40af', to: '#16a34a', accent: '#bbf7d0', Icon: Search } },
    { keywords: ['remove object'],                 theme: { from: '#7c3aed', to: '#ec4899', accent: '#f0abfc', Icon: Eraser } },
    { keywords: ['thumbnail'],                     theme: { from: '#dc2626', to: '#7c3aed', accent: '#fbcfe8', Icon: FileImage } },
    { keywords: ['social media'],                  theme: { from: '#0891b2', to: '#3b82f6', accent: '#93c5fd', Icon: Sparkles } },
    { keywords: ['bulk', 'batch'],                 theme: { from: '#475569', to: '#0f172a', accent: '#94a3b8', Icon: LayoutGrid } },
    { keywords: ['format'],                        theme: { from: '#0e7490', to: '#06b6d4', accent: '#a5f3fc', Icon: FileImage } },
];

function pickTopicTheme(post) {
    const haystack = [
        post?.slug || '',
        post?.title || '',
        ...(Array.isArray(post?.tags) ? post.tags : []),
    ]
        .join(' ')
        .toLowerCase();
    if (!haystack.trim()) return null;
    for (const profile of TOPIC_PROFILES) {
        if (profile.keywords.some((k) => haystack.includes(k))) {
            return profile.theme;
        }
    }
    return null;
}

// Hash a string deterministically into a 32-bit integer.
function hashString(s = '') {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = (h * 16777619) >>> 0;
    }
    return h >>> 0;
}

// Tiny seeded PRNG (mulberry32). Returns a function that yields numbers in [0,1).
function mulberry32(seed) {
    let t = seed >>> 0;
    return function next() {
        t = (t + 0x6D2B79F5) >>> 0;
        let r = t;
        r = Math.imul(r ^ (r >>> 15), r | 1);
        r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Inline-SVG cover image for a blog post.
 * - variant="card" → square (1:1), used in the BlogList listing
 * - variant="hero" → wide banner (5:2), used at the top of BlogPost
 * Always renders as inline <svg> so there's no dependency on external files
 * or the public/ directory.
 *
 * The cover picks its theme & icon by:
 *   1. Topic detection from slug/title/tags (most specific)
 *   2. CATEGORY_THEME fallback
 *   3. Guides default
 */
const BlogCover = ({ post, variant = 'hero' }) => {
    const theme =
        pickTopicTheme(post) ||
        CATEGORY_THEME[post?.category] ||
        CATEGORY_THEME.Guides;
    const { Icon } = theme;

    const isCard = variant === 'card';

    // Hero is a slim banner (5:2) so it doesn't dominate the page; cards stay 1:1.
    const vbW = isCard ? 600 : 1200;
    const vbH = isCard ? 600 : 480;
    const aspectRatio = isCard ? '1 / 1' : '5 / 2';

    // Deterministic randomness — same post always gets the same composition.
    const rand = mulberry32(hashString(post?.slug || post?.title || ''));

    // Decorative blurred circles (fill the background with depth).
    const shapes = Array.from({ length: 5 }, () => ({
        cx: rand() * vbW,
        cy: rand() * vbH,
        r: 60 + rand() * 180,
        opacity: 0.06 + rand() * 0.10,
    }));

    // Diagonal accent stripe offset.
    const lineOffset = Math.floor(rand() * 200);

    // Two ghost echoes of the topic icon — small, low-opacity copies scattered
    // across the banner so the subject is visually reinforced.
    const echoes = isCard
        ? []
        : Array.from({ length: 2 }, () => ({
              x: 120 + rand() * (vbW - 240),
              y: 80 + rand() * (vbH - 160),
              size: 64 + rand() * 56,
              rotate: -20 + rand() * 40,
              opacity: 0.10 + rand() * 0.06,
          }));

    const gradientId = `bgcover-${isCard ? 'c' : 'h'}-${(post?.slug || 'post').replace(/[^a-z0-9_-]/gi, '')}`;

    // Smaller central icon for the slimmer banner.
    const iconSize = isCard ? 140 : 110;

    return (
        <div
            className={`blog-cover blog-cover--${variant}`}
            aria-hidden="true"
            style={{
                width: '100%',
                aspectRatio,
                maxHeight: isCard ? 'none' : 320,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-md, 8px)',
                background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
            }}
        >
            <svg
                viewBox={`0 0 ${vbW} ${vbH}`}
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={theme.from} />
                        <stop offset="100%" stopColor={theme.to} />
                    </linearGradient>
                </defs>
                <rect x="0" y="0" width={vbW} height={vbH} fill={`url(#${gradientId})`} />
                {/* Decorative blurred circles, seeded by slug */}
                {shapes.map((s, i) => (
                    <circle
                        key={i}
                        cx={s.cx}
                        cy={s.cy}
                        r={isCard ? s.r * 0.7 : s.r}
                        fill={theme.accent}
                        opacity={s.opacity}
                    />
                ))}
                {/* Diagonal accent stripe */}
                <line
                    x1="0"
                    y1={vbH}
                    x2={vbW}
                    y2="0"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="2"
                    transform={`translate(${lineOffset - 100}, 0)`}
                />
            </svg>

            {/* Background "echo" icons — small, low-opacity copies of the topic
                icon scattered around so the subject reads even at a glance. */}
            {echoes.map((e, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${(e.x / vbW) * 100}%`,
                        top: `${(e.y / vbH) * 100}%`,
                        transform: `translate(-50%, -50%) rotate(${e.rotate}deg)`,
                        color: 'rgba(255,255,255,0.95)',
                        opacity: e.opacity,
                        pointerEvents: 'none',
                        lineHeight: 0,
                    }}
                >
                    <Icon size={e.size} strokeWidth={1.2} />
                </div>
            ))}

            {/* Centered topic icon — lucide-react renders inline SVG. */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.95)',
                    filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.18))',
                }}
            >
                <Icon size={iconSize} strokeWidth={1.4} />
            </div>

            {/* Subtle category badge in the corner of the hero variant */}
            {!isCard && post?.category && (
                <span
                    style={{
                        position: 'absolute',
                        top: 14,
                        left: 14,
                        padding: '4px 10px',
                        borderRadius: 999,
                        background: 'rgba(0,0,0,0.25)',
                        color: 'rgba(255,255,255,0.95)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        backdropFilter: 'blur(4px)',
                    }}
                >
                    {post.category}
                </span>
            )}
        </div>
    );
};

export default BlogCover;
