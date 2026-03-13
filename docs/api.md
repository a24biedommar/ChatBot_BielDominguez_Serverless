# API Oni-chan

## Base URL

- Local: `http://localhost:3001`
- Variable: `NUXT_PUBLIC_API_URL`

## Endpoints

### POST /api/transcribe

Transcriu àudio (nota de veu) a text amb Gemini.

**Request**: `multipart/form-data`
- `audio` (Blob/File): Àudio. Formats: MP3, WAV, WebM, OGG. Màx. 60 s.
- `personality` (string, opcional): "otaku" | "gitano"

**Response**: `{ text: string, duration?: number }`

### POST /api/chat

Respon amb text segons l'historial i la personalitat.

**Request**: `application/json`
- `messages`: Array de `{ role, text, blobIds? }`
- `personality`: "otaku" | "gitano"

**Response**: `{ text: string }`

### GET /api/health

Estat de l'API. Retorna `{ status: "ok" }`.
