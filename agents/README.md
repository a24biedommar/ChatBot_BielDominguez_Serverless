# Agents — Especificacions per tecnologia

Aquesta carpeta conté les especificacions que han de seguir els agents (IA o desenvolupadors) quan implementen codi per cada tecnologia del projecte Oni-chan PWA.

**Totes les especificacions hereden les convencions comuns** definides a `conventions.md`. Cal llegir aquest fitxer primer.

## Índex

| Fitxer | Tecnologia | Descripció |
|--------|------------|------------|
| [conventions.md](./conventions.md) | Comuns | Metodologia de programació, comentaris, JSDoc A-B-C |
| [nuxt.md](./nuxt.md) | Nuxt 4.3.1 | Framework, estructura, server API |
| [vue.md](./vue.md) | Vue 3 | Composition API, components, composables |
| [dexie.md](./dexie.md) | Dexie.js | IndexedDB, stores blobs, chat_metadata, messages, preferences |
| [supabase.md](./supabase.md) | Supabase | Auth anònim, sincronització metadades |
| [gemini.md](./gemini.md) | Google Gemini | Chat, transcripció, visió |
| [tailwind.md](./tailwind.md) | Tailwind CSS | Estils, mòbil-first |
| [capacitor.md](./capacitor.md) | Capacitor | Build APK Android |
| [pwa.md](./pwa.md) | @vite-pwa/nuxt | Service Worker, offline |

## Ús

Quan implementis codi relacionat amb una tecnologia, consulta la spec corresponent i respecta tant les convencions comuns com les específiques d'aquella tecnologia.
