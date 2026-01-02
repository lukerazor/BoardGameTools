import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    /*VitePWA({ 
      registerType: 'autoUpdate', 
      manifest: {
        background_color: "#ffffff",
        display: "standalone",
        lang: "en",
        scope: "./",
        start_url: "./",
        theme_color: "#42b883",
        name: "boardgame-tools",
        short_name: "bg-tools",
        description: "A collection of board game tools",
        includeAssets: ["favicon.ico"],
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          }
        ]
      }
    })*/
  ]
})
