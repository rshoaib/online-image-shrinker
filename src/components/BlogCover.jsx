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
} from 'lucide-react';

// Category-keyed visual theme. Every post picks one of these by `post.category`,
// so the cover stays consistent within a category but varies across categories.
// Falls back to "Guides" if the category is unknown.
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

// Hash a string deterministically into a 32-bit integer. Used to vary the
// decorative-shape positions per post so two posts in the same category
// don't look identical.
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
 * - variant="hero" → wide (16:9), used at the top of BlogPost
 * Always renders as inline <svg> so there's no dependency on external files
 * or the public/ directory.
 */
const BlogCover = ({ post, variant = 'hero' }) => {
    const theme = CATEGORY_THEME[post?.category] || CATEGORY_THEME.Guides;
    const { Icon } = theme;

    // Deterministic randomness — same post always gets the same composition.
    const rand = mulberry32(hashString(post?.slug || post?.title || ''));
    // Pre-compute decorative circle positions inside a 16:9 viewBox.
    const shapes = Array.from({ length: 5 }, () => ({
        cx: rand() * 1200,
        cy: rand() * 675,
        r: 80 + rand() * 220,
        opacity: 0.06 + rand() * 0.10,
    }));
    // Diagonal accent line offsets
    const lineOffset = Math.floor(rand() * 200);

    const isCard = variant === 'card';
    // viewBox: square for card, 16:9 for hero. The same shapes stretch into both.
    const viewBox = isCard ? '0 0 600 600' : '0 0 1200 675';
    // For card variant we crop the wider composition into a square by translating
    // the decorations so the icon stays centered.
    const gradientId = `bgcover-${isCard ? 'c' : 'h'}-${(post?.slug || 'post').replace(/[^a-z0-9_-]/gi, '')}`;
    const iconSize = isCard ? 140 : 220;

    return (
        <div
            className={`blog-cover blog-cover--${variant}`}
            aria-hidden="true"
            style={{
                width: '100%',
                aspectRatio: isCard ? '1 / 1' : '16 / 9',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-md, 8px)',
                background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
            }}
        >
            <svg
                viewBox={viewBox}
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
                <rect
                    x="0"
                    y="0"
                    width={isCard ? 600 : 1200}
                    height={isCard ? 600 : 675}
                    fill={`url(#${gradientId})`}
                />
                {/* Decorative blurred circles, seeded by slug */}
                {shapes.map((s, i) => {
                    const cx = isCard ? (s.cx / 2) : s.cx;
                    const cy = isCard ? (s.cy * 600 / 675) : s.cy;
                    const r = isCard ? s.r * 0.7 : s.r;
                    return (
                        <circle
                            key={i}
                            cx={cx}
                            cy={cy}
                            r={r}
                            fill={theme.accent}
                            opacity={s.opacity}
                        />
                    );
                })}
                {/* Diagonal accent stripe */}
                <line
                    x1={isCard ? 0 : 0}
                    y1={isCard ? 600 : 675}
                    x2={isCard ? 600 : 1200}
                    y2={isCard ? 0 : 0}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="2"
                    transform={`translate(${lineOffset - 100}, 0)`}
                />
            </svg>
            {/* Centered category icon — lucide-react renders inline SVG. */}
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
                        top: 16,
                        left: 16,
                        padding: '4px 12px',
                        borderRadius: 999,
                        background: 'rgba(0,0,0,0.25)',
                        color: 'rgba(255,255,255,0.95)',
                        fontSize: '0.75rem',
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
