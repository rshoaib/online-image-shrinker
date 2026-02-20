export const pdfSizePages = [
  { slug: '100kb', size: '100KB' },
  { slug: '200kb', size: '200KB' },
  { slug: '300kb', size: '300KB' },
  { slug: '500kb', size: '500KB' },
  { slug: '1mb', size: '1MB' },
  { slug: '2mb', size: '2MB' },
  { slug: '5mb', size: '5MB' },
  { slug: '10mb', size: '10MB' }
];

export const imageResizePages = [
  { slug: '1920x1080', width: 1920, height: 1080, label: '1920x1080 (Full HD)' },
  { slug: '1280x720', width: 1280, height: 720, label: '1280x720 (HD)' },
  { slug: '1080x1080', width: 1080, height: 1080, label: '1080x1080 (Instagram)' },
  { slug: '4x6-inch', label: '4x6 inch' },
  { slug: '5x7-inch', label: '5x7 inch' },
  { slug: 'a4', label: 'A4 Document' },
  { slug: '500x500', width: 500, height: 500, label: '500x500 (Square)' },
  { slug: '800x600', width: 800, height: 600, label: '800x600 (SVGA)' },
  { slug: '3840x2160', width: 3840, height: 2160, label: '3840x2160 (4K UHD)' },
  { slug: '2560x1440', width: 2560, height: 1440, label: '2560x1440 (QHD)' },
  { slug: '640x480', width: 640, height: 480, label: '640x480 (VGA)' },
  { slug: '300x300', width: 300, height: 300, label: '300x300 (Thumbnail)' },
  { slug: '1200x628', width: 1200, height: 628, label: '1200x628 (OG Image)' },
  { slug: '600x400', width: 600, height: 400, label: '600x400 (Blog Featured)' },
  { slug: '2048x1152', width: 2048, height: 1152, label: '2048x1152 (YouTube Banner)' },
  { slug: '8x10-inch', label: '8x10 inch' },
];

export const conversionPages = [
  { slug: 'png-to-jpg', from: 'PNG', to: 'JPG' },
  { slug: 'jpg-to-png', from: 'JPG', to: 'PNG' },
  { slug: 'webp-to-png', from: 'WebP', to: 'PNG' },
  { slug: 'webp-to-jpg', from: 'WebP', to: 'JPG' },
  { slug: 'heic-to-png', from: 'HEIC', to: 'PNG' },
  { slug: 'bmp-to-jpg', from: 'BMP', to: 'JPG' },
  { slug: 'bmp-to-png', from: 'BMP', to: 'PNG' },
  { slug: 'gif-to-png', from: 'GIF', to: 'PNG' },
  { slug: 'gif-to-jpg', from: 'GIF', to: 'JPG' },
  { slug: 'tiff-to-jpg', from: 'TIFF', to: 'JPG' },
  { slug: 'tiff-to-png', from: 'TIFF', to: 'PNG' },
  { slug: 'png-to-webp', from: 'PNG', to: 'WebP' },
  { slug: 'jpg-to-webp', from: 'JPG', to: 'WebP' },
];

export const videoToGifPages = [
  { slug: 'mp4-to-gif', from: 'MP4', to: 'GIF' },
  { slug: 'mov-to-gif', from: 'MOV', to: 'GIF' },
  { slug: 'webm-to-gif', from: 'WebM', to: 'GIF' }
];

export const videoToAudioPages = [
  { slug: 'mp4-to-mp3', from: 'MP4', to: 'MP3' },
  { slug: 'mov-to-mp3', from: 'MOV', to: 'MP3' },
  { slug: 'webm-to-mp3', from: 'WebM', to: 'MP3' },
  { slug: 'extract-audio-from-mp4', from: 'MP4', to: 'Audio' }
];

export const socialMediaPages = [
  { slug: 'instagram-story', width: 1080, height: 1920, label: 'Instagram Story', toolId: 'crop' },
  { slug: 'instagram-portrait', width: 1080, height: 1350, label: 'Instagram Portrait', toolId: 'crop' },
  { slug: 'instagram-post', width: 1080, height: 1080, label: 'Instagram Post', toolId: 'crop' },
  { slug: 'facebook-cover', width: 820, height: 312, label: 'Facebook Cover', toolId: 'crop' },
  { slug: 'facebook-post', width: 1200, height: 630, label: 'Facebook Post', toolId: 'crop' },
  { slug: 'youtube-thumbnail', width: 1280, height: 720, label: 'YouTube Thumbnail', toolId: 'crop' },
  { slug: 'twitter-header', width: 1500, height: 500, label: 'Twitter Header', toolId: 'crop' },
  { slug: 'linkedin-banner', width: 1584, height: 396, label: 'LinkedIn Banner', toolId: 'crop' },
  { slug: 'tiktok-video', width: 1080, height: 1920, label: 'TikTok Video Cover', toolId: 'crop' },
  { slug: 'pinterest-pin', width: 1000, height: 1500, label: 'Pinterest Pin', toolId: 'crop' },
  { slug: 'twitch-banner', width: 1200, height: 480, label: 'Twitch Profile Banner', toolId: 'crop' },
  { slug: 'twitter-post', width: 1200, height: 675, label: 'Twitter/X Post', toolId: 'crop' },
  { slug: 'discord-server-icon', width: 512, height: 512, label: 'Discord Server Icon', toolId: 'crop' },
  { slug: 'whatsapp-dp', width: 500, height: 500, label: 'WhatsApp Profile Picture', toolId: 'crop' },
];

export const printReadyPages = [
  { slug: 'a4', width: 2480, height: 3508, label: 'A4 Document (300 DPI)', toolId: 'resize' },
  { slug: 'a3', width: 3508, height: 4961, label: 'A3 Poster (300 DPI)', toolId: 'resize' },
  { slug: 'a5', width: 1748, height: 2480, label: 'A5 Flyer (300 DPI)', toolId: 'resize' },
  { slug: 'letter', width: 2550, height: 3300, label: 'US Letter (300 DPI)', toolId: 'resize' },
  { slug: 'business-card', width: 1050, height: 600, label: 'Business Card (3.5x2")', toolId: 'crop' }
];

export const passportPages = [
  { slug: 'us-passport', width: 600, height: 600, label: 'US Passport Photo (2x2")', toolId: 'passport' },
  { slug: 'uk-passport', width: 826, height: 1062, label: 'UK Passport Photo (35x45mm)', toolId: 'passport' },
  { slug: 'eu-passport', width: 826, height: 1062, label: 'EU Passport Photo (35x45mm)', toolId: 'passport' },
  { slug: 'india-passport', width: 600, height: 600, label: 'Indian Passport Photo (2x2")', toolId: 'passport' },
  { slug: 'canada-passport', width: 600, height: 780, label: 'Canadian Passport Photo (50x70mm)', toolId: 'passport' },
  { slug: 'australia-passport', width: 826, height: 1062, label: 'Australian Passport Photo (35x45mm)', toolId: 'passport' },
  { slug: 'china-passport', width: 780, height: 1024, label: 'Chinese Passport Photo (33x48mm)', toolId: 'passport' },
  { slug: 'japan-passport', width: 826, height: 1062, label: 'Japanese Passport Photo (35x45mm)', toolId: 'passport' },
  { slug: 'schengen-visa', width: 826, height: 1062, label: 'Schengen Visa Photo (35x45mm)', toolId: 'passport' },
  { slug: 'saudi-arabia-passport', width: 600, height: 600, label: 'Saudi Arabia Passport Photo (2x2")', toolId: 'passport' },
];

// ─── Image Compress by File Size pages ────────────────────────────────
export const imageCompressSizePages = [
  { slug: '20kb', size: '20KB' },
  { slug: '50kb', size: '50KB' },
  { slug: '100kb', size: '100KB' },
  { slug: '200kb', size: '200KB' },
  { slug: '500kb', size: '500KB' },
  { slug: '1mb', size: '1MB' },
  { slug: '2mb', size: '2MB' },
  { slug: '5mb', size: '5MB' },
];
