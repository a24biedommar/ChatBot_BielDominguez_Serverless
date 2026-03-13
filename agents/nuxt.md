# Nuxt 4.3.1 — Especificació

**Framework**: Nuxt 4.3.1 amb **JavaScript** (no TypeScript).
**Ubicació**: `frontend/` — El backend (API) està separat a `backend/`.

## Estructura de carpetes (frontend/)

```text
frontend/
├── composables/     # useIndexedDB.js, usePersonality.js
├── components/      # components/chat/ChatMessageList.vue, etc.
├── layouts/         # default.vue
├── pages/           # index.vue
└── nuxt.config.js
```

## Regles

- **Fitxers**: `.js`; mai `.ts`. Sense `lang="ts"` en cap fitxer.
- **API routes**: Sufix del mètode HTTP. Exemple: `transcribe.post.js` → `POST /api/transcribe`.
- **Config**: `nuxt.config.js` (no .ts).
- **Variables d'entorn**: `process.env.GEMINI_API_KEY` al servidor; `useRuntimeConfig()` per `NUXT_PUBLIC_*` al client.

## Backend (separat)

- Les APIs viuen a `backend/server/api/` (Nitro standalone).
- El frontend crida l'API via `NUXT_PUBLIC_API_URL` (ex: `http://localhost:3001`).
- Mai exposar `GEMINI_API_KEY` al client.

## Convencions aplicades

- Seguir `conventions.md`: bucles imperatius, sense ternaris, sense .map/.filter/.reduce.
- Blocs IMPORTS / VARIABLES / FUNCIONS / EXPORTS.
- JSDoc amb desglossament A, B, C.
