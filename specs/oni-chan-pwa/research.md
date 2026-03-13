# Research: Oni-chan Chatbot PWA

**Date**: 2025-03-10

## Decisió 1: Llibreria IndexedDB (Dexie.js vs localForage)

**Status**: Decidit — **Dexie.js**

**Context**: Cal triar entre Dexie.js i localForage per gestionar IndexedDB dins de Nuxt 4.

**Decision**: Dexie.js

**Rationale**: Els stores `blobs`, `chat_metadata`, `messages`, `preferences` amb queries per chatId, messageId beneficien d'una API més estructurada i índexs.

**Alternatives considerades**: localForage (menys flexible), idb (wrapper mínim), raw IndexedDB API (massa verbós).

---

## Decisió 2: Format de dades per transcripció

**Decision**: FormData amb Blob d'àudio

**Rationale**: El client envia el Blob des d'IndexedDB via FormData; l'API Nitro rep multipart/form-data. Evita base64 (overhead) i manté compatibilitat amb Gemini.

**Alternatives considerades**: base64 (JSON) — més pes; Stream — complexitat extra.
