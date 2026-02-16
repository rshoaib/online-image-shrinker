# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.3.0] - 2026-02-16

### Added
- **Social Media Preview Generator**: New tool to create platform-ready images for Twitter/X, Facebook, LinkedIn, Instagram (Post & Story), YouTube, and Pinterest. Features gradient/solid/image backgrounds, heading & subheading text overlays, and one-click export (`/social-media-preview-generator`).
- **Image Compare Tool**: Side-by-side image comparison with slider, overlay, and split view modes (`/compare-images-online`).
- **Blog Posts**: 3 new SEO articles — Social Media Image Sizes 2026, How to Compare Photos Online, Best Privacy-First Image Tools.

### Improved
- **Build Optimization**: Split heavy dependencies (TF.js, ONNX, Tesseract, FFmpeg, heic2any) into dedicated chunks for faster loading and better caching.

## [1.2.1] - 2026-02-04
### Fixed
- **Site Health**: Resolved numerous linting errors and synchronous state update issues across multiple editors.
- **Performance**: Refactored `useImageProcessor` and `ThemeContext` for better stability and Fast Refresh support.

### Added
- **Legal Pages**: Added `TermsOfService` and `Contact` pages.
- **Navigation**: Updated footer with links to new legal pages.

## [1.2.0] - 2026-01-23
### Added
- **Screenshot Beautifier**: New tool to add backgrounds, shadows, and window frames to screenshots (`/screenshot-beautifier`).
- **Profile Picture Maker**: New privacy-first tool to remove backgrounds and create professional profile photos (`/profile-picture-maker`).
- **SEO Optimization**: Landing pages with metadata for both new tools.
- **Sitemap**: Updated `sitemap.xml` to include new tool routes.

## [1.1.0] - 2025-12-25 (Approximate)
### Added
- **Image Compression**: Tools for JPEG, PNG, and WebP compression.
- **Batch Processing**: Ability to process multiple images at once.
- **Client-Side Privacy**: Core architecture ensuring images stay in the browser.

### Changed
- Improved mobile responsiveness for the tool selector grid.
