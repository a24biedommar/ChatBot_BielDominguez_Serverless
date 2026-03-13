# Google Gemini — Especificació

**SDK**: `@google/generative-ai`
**Token**: Google AI Studio — https://aistudio.google.com/apikey
**Variable**: `GEMINI_API_KEY` (només al servidor; mai al client).

## Ús al projecte

- **Chat**: Respostes amb personalitat Otaku/Gitano.
- **Transcripció**: Àudio → text (notes de veu).
- **Visió**: Processar imatges en el xat.

## Models

- `gemini-1.5-flash` o `gemini-1.5-pro`; àudio natiu per transcripció.

## Endpoints Nitro (backend/)

- `backend/server/api/chat.post.js`: Rep messages, personality; retorna text de l'IA.
- `backend/server/api/transcribe.post.js`: Rep Blob/FormData d'àudio; retorna `{ text, duration }`.

## Seguretat

- **Mai** hardcodar `GEMINI_API_KEY`. Ús exclusiu de `process.env.GEMINI_API_KEY` al servidor.
- Validar input amb Zod abans de cridar l'API.

## Personalitats

- **Otaku (Oni-chan)**: Llenguatge energètic, expressions japoneses, kaomojis. System prompt a `usePersonality.js`.
- **Gitano (Primo)**: Caló i gerga romaní. System prompt a `usePersonality.js`.

## Convencions aplicades

- Seguir `conventions.md`: bucles imperatius, sense ternaris, sense .map/.filter/.reduce.
- Blocs IMPORTS / VARIABLES / FUNCIONS / EXPORTS.
- JSDoc amb desglossament A, B, C.
