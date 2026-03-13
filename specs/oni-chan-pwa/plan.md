# Implementation Plan: Oni-chan Chatbot PWA

**Branch**: `oni-chan-pwa` | **Date**: 2025-03-10 | **Spec**: [spec.md](./spec.md)

## Summary

Xatbot multimodal PWA per a mòbils amb múltiples xats, selector de personalitat (Otaku/Gitano), pujada de fitxers (24 MB, 6/missatge) i transcripció de veu. Storage local amb IndexedDB; Supabase només per Auth anònim i metadades. App totalment funcional offline.

## Technical Context

| Aspecte | Valor |
|---------|-------|
| **Llenguatge** | JavaScript (no TypeScript) |
| **Frontend** | Nuxt 4.3.1, Tailwind v4, PWA, Capacitor |
| **Backend** | Nitro standalone (API transcribe + chat); Google Gemini |
| **Storage local** | IndexedDB (**Dexie.js**) |
| **Auth** | Supabase Auth anònim (client) |
| **Distribució** | PWA + Capacitor (APK Android) |
| **Desenvolupament** | Docker Compose per provar en local |
| **Rendiment** | LCP < 2.5s, FID < 100ms, CLS < 0.1 |

## Milestones

| Milestone | Contingut |
|-----------|-----------|
| **M1** | Setup del Project Skeleton amb Nuxt 4.3.1 |
| **M2** | IndexedDB (Dexie.js): stores `blobs`, `chat_metadata`, `messages`, `preferences`; Supabase Auth anònim |
| **M3** | Endpoint transcripció (Blob des del client) |
| **M4** | Interfície de xat: múltiples xats, selector Otaku/Gitano, galeria (Mobile UI) |

## Project Structure

### Documentation (aquesta feature)

```text
specs/oni-chan-pwa/
├── plan.md
├── spec.md
├── research.md
├── data-model.md
├── quickstart.md
├── tasks.md
├── contracts/
│   ├── transcribe-api.md
│   └── chat-api.md
└── checklists/
    └── requirements.md
```

### Source Code (monorepo amb frontend/ i backend/)

```text
agents/                   # Especificacions per tecnologia (conventions, nuxt, vue, dexie, etc.)
frontend/                 # Aplicació Nuxt (client)
├── nuxt.config.js
├── package.json
├── composables/
│   ├── useIndexedDB.js   (Dexie.js)
│   └── usePersonality.js
├── components/
│   └── chat/
│       ├── ChatMessageList.vue
│       ├── ChatInput.vue
│       └── ...
├── layouts/
│   └── default.vue
└── pages/
    └── index.vue

backend/                  # API Nitro (transcribe, chat)
├── package.json
├── nitro.config.js
└── server/
    └── api/
        ├── transcribe.post.js
        └── chat.post.js

docker/                   # Configuració per provar en local
├── docker-compose.yml
├── Dockerfile.frontend
└── Dockerfile.backend
```

## Decisions

- **Idioma UI**: Català
- **Ordre xats**: Per data de modificació (més recent dalt)
- **Galeria**: Accés fent clic al div del títol del xat
- **Títol xat**: Generat per IA després de 2-3 intercanvis; editable
- **Nota de veu**: Màxim 60 segons
- **Documents**: PDF, TXT acceptats

## Constitution Check

- **Stack**: Nuxt 4.3.1, JavaScript, IndexedDB, Supabase, Capacitor, Gemini ✓
- **Auth**: Només anònim ✓
- **Límits**: 24 MB/fitxer, 6 fitxers/missatge ✓
- **Convencions**: Sense ternaris, sense .map/.filter/.reduce; bucles imperatius ✓
