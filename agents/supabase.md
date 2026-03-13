# Supabase — Especificació

**Ús**: Només **Auth anònim** i **sincronització de metadades**.

## Regles

- **Auth**: Només usuari anònim. Sense registre ni login.
- **Blobs**: Mai pujar blobs a Supabase Storage. Els blobs resideixen exclusivament a IndexedDB.
- **Metadades**: Sincronitzar text dels xats, IDs de fitxers locals, personalitat triada quan online.
- **Variables**: `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_ANON_KEY` a `.env`.

## Llibreria

- `@supabase/supabase-js`
- Configurar client Supabase al client (Nuxt plugin o composable).

## Què sincronitzar

- `chat_metadata`: id, title, personality, messageIds, timestamps.
- `messages`: id, chatId, role, text, blobIds, createdAt.
- `preferences`: key, value (personality).

## Què NO sincronitzar

- Contingut binari (Blobs). Només referències (IDs locals).

## Convencions aplicades

- Seguir `conventions.md`: bucles imperatius, sense ternaris, sense .map/.filter/.reduce.
- Blocs IMPORTS / VARIABLES / FUNCIONS / EXPORTS.
- JSDoc amb desglossament A, B, C.
