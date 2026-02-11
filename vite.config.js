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
        }
      }
    },
    // Increase warning limit since we expect some large AI chunks
    chunkSizeWarningLimit: 1000,
  },
})
