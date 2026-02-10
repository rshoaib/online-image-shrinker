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
  { slug: 'a4', label: 'A4 Document' }
];

export const conversionPages = [
  { slug: 'png-to-jpg', from: 'PNG', to: 'JPG' },
  { slug: 'jpg-to-png', from: 'JPG', to: 'PNG' },
  { slug: 'webp-to-png', from: 'WebP', to: 'PNG' },
  { slug: 'webp-to-jpg', from: 'WebP', to: 'JPG' },
  { slug: 'heic-to-png', from: 'HEIC', to: 'PNG' }
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
