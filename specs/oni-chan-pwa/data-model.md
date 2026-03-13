# Data Model: Oni-chan Chatbot PWA

## IndexedDB Stores

### 1. `blobs`

Emmagatzema imatges, àudio i fitxers com a Blobs.

| Camp | Tipus | Descripció |
|------|-------|------------|
| id | string (key) | ID únic local (UUID o similar) |
| blob | Blob | Contingut binari |
| mimeType | string | image/*, audio/*, etc. |
| chatId | string | ID del xat al qual pertany |
| messageId | string | ID del missatge (opcional) |
| createdAt | number | Timestamp |

### 2. `chat_metadata`

Metadades dels xats (còpia local; sincronitzada a Supabase quan online).

| Camp | Tipus | Descripció |
|------|-------|------------|
| id | string (key) | ID únic del xat |
| title | string | Títol: generat per IA (resum del primer intercanvi); editable per l'usuari |
| personality | string | "otaku" \| "gitano" (heredat de preferències globals) |
| messageIds | string[] | IDs dels missatges (ordre); referència al store `messages` |
| createdAt | number | Timestamp |
| updatedAt | number | Timestamp |

### 3. `messages` (store separat)

Store independent amb índex per `chatId` per consultes eficients.

| Camp | Tipus | Descripció |
|------|-------|------------|
| id | string (key) | ID únic del missatge |
| chatId | string | ID del xat (índex) |
| role | string | "user" \| "assistant" |
| text | string | Text del missatge |
| blobIds | string[] | IDs de blobs associats (màx. 6) |
| createdAt | number | Timestamp |

### 4. `preferences`

Preferències de l'usuari.

| Camp | Tipus | Descripció |
|------|-------|------------|
| key | string (key) | "personality", etc. |
| value | string \| object | Valor de la preferència |

## Relacions

- **Chat** 1 — N **Message**
- **Message** N — N **Blob** (via blobIds; màx. 6 per missatge)
- **Preferences** independent

## Validacions

- Màxim 6 blobIds per missatge
- Màxim 24 MB per Blob
- Text il·limitat

## Formats de fitxer acceptats

- **Imatges**: JPEG, PNG, WebP, GIF
- **Àudio**: MP3, WAV, WebM, OGG — màxim 60 segons per nota de veu
- **Documents**: PDF, TXT

## Ordre i idioma

- **Llista de xats**: Ordenada per `updatedAt` descendent (més recent dalt)
- **Idioma UI**: Català
