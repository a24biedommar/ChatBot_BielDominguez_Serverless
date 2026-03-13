# Nitro (Backend) — Especificació

**Framework**: Nitro standalone (API server).
**Ubicació**: `backend/`

## Estructura

```text
backend/
├── package.json
├── nitro.config.js
└── server/
    └── api/
        ├── transcribe.post.js
        └── chat.post.js
```

## Regles

- **Fitxers**: `.js`; mai `.ts`.
- **API routes**: Sufix del mètode HTTP. Exemple: `transcribe.post.js` → `POST /api/transcribe`.
- **Variables d'entorn**: `process.env.GEMINI_API_KEY` (mai exposar al client).
- **CORS**: Configurar per permetre peticions des del frontend (origen configurable).

## Endpoints

- `POST /api/transcribe` — Rep àudio (FormData); retorna `{ text, duration }`.
- `POST /api/chat` — Rep messages, personality, imatges; retorna `{ text }`.

## Convencions aplicades

- Seguir `conventions.md`: bucles imperatius, sense ternaris, sense .map/.filter/.reduce.
- Blocs IMPORTS / VARIABLES / FUNCIONS / EXPORTS.
- JSDoc amb desglossament A, B, C.
- Validar payloads amb Zod abans de processar.
