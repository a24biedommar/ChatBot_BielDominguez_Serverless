# Dexie.js — IndexedDB — Especificació

**Llibreria**: Dexie.js (latest) per gestionar IndexedDB.

## Object stores

| Store | Key | Descripció |
|-------|-----|------------|
| `blobs` | id | Imatges, àudio, fitxers com a Blobs. Camps: id, blob, mimeType, chatId, messageId, createdAt |
| `chat_metadata` | id | Metadades dels xats. Camps: id, title, personality, messageIds, createdAt, updatedAt |
| `messages` | id | Missatges. Camps: id, chatId, role, text, blobIds, createdAt. Índex per chatId |
| `preferences` | key | Preferències (personality, etc.). Camps: key, value |

## Regles

- **Arquitectura**: Blobs mai a Supabase. Tots els mitjans (imatges, àudio, fitxers) a IndexedDB.
- **IDs locals**: Els missatges referencien blobs per ID local (string).
- **Validacions**: Màxim 24 MB per Blob; màxim 6 blobIds per missatge.
- **CRUD**: Implementar get, add, put, delete amb bucles; sense .map/.filter/.reduce.

## Composable

- `composables/useIndexedDB.js`: Inicialitza Dexie, defineix stores, exporta mètodes CRUD.

## Convencions aplicades

- Seguir `conventions.md`: bucles imperatius, sense ternaris, sense .map/.filter/.reduce.
- Blocs IMPORTS / VARIABLES / FUNCIONS / EXPORTS.
- JSDoc amb desglossament A, B, C.

## Formats acceptats

- **Imatges**: JPEG, PNG, WebP, GIF.
- **Àudio**: MP3, WAV, WebM, OGG — màxim 60 segons per nota de veu.
- **Documents**: PDF, TXT.
