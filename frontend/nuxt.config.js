// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@vite-pwa/nuxt'],
  css: ['./app/assets/css/main.css'],
  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
      apiUrl: 'http://localhost:3001'
    }
  },
  vite: {
    plugins: [tailwindcss()],
    vue: {
      script: {
        propsDestructure: false
      }
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Oni-chan Chatbot',
      short_name: 'Oni-chan',
      theme_color: '#0f172a',
      icons: []
    },
    workbox: {
      // Evita "non-precached-url" amb SSR: no intentar servir "/" des de precache
      navigateFallback: null
    }
  }
})
