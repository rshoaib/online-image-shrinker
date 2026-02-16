import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      workbox: {
        maximumFileSizeToCacheInBytes: 30000000,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Online Image Shrinker',
        short_name: 'ImageShrinker',
        description: 'Privacy-first online image optimizer',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
      },
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor - React + Router (loaded on every page)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // i18n bundle - loaded on every page but can be cached separately
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],

          // Icons - loaded on most pages
          'vendor-icons': ['lucide-react'],

          // Heavy libs - PDF, QR, etc
          'vendor-pdf': ['jspdf'],
          'vendor-qr': ['qrcode.react'],
          'vendor-crop': ['react-easy-crop'],

          // AI / ML bundles (loaded only by specific tools)
          'vendor-ai-tf': ['@tensorflow/tfjs', 'onnxruntime-web', 'upscaler'],
          'vendor-ai-bg': ['@imgly/background-removal'],
          'vendor-ocr': ['tesseract.js'],

          // Media processing
          'vendor-ffmpeg': ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
          'vendor-heic': ['heic2any'],
        }
      }
    },
    // TF.js + ONNX runtime are inherently ~2MB; they're already lazy-loaded via manualChunks
    chunkSizeWarningLimit: 2500,
  },
})
