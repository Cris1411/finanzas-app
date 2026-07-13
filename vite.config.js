import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192x192-v2.svg', 'pwa-512x512-v2.svg'],
      manifest: {
        // Un `id` único evita que el navegador asocie esta instalación
        // con otra PWA ya instalada que comparta nombre/start_url.
        id: '/finanzas-app-v2',
        name: 'FinanzasApp — Gestor Personal (v2)',
        short_name: 'FinanzasApp v2',
        description: 'Gestioná tus ingresos, gastos y cuentas bancarias',
        theme_color: '#0f0f1a',
        background_color: '#0f0f1a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        // `start_url` con query-string ayuda a diferenciar la instalación
        // aunque se sirva desde la misma raíz.
        start_url: '/?app=finanzas-app-v2',
        icons: [
          {
            src: 'pwa-192x192-v2.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'pwa-512x512-v2.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
          {
            src: 'pwa-512x512-v2.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
