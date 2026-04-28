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
    { keywords: ['compare