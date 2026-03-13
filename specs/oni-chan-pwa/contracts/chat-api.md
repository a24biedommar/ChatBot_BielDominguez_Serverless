# Contract: API Chat

**Endpoint**: `POST /api/chat`

## Request

**Content-Type**: `application/json` o `multipart/form-data` (si hi ha imatges)

### JSON (text només)

```json
{
  "messages": [
    { "role": "user", "text": "Hola!", "blobIds": [] },
    { "role": "assistant", "text": "Sugoi! ..." }
  ],
  "personality": "otaku"
}
```

### Amb imatges

FormData amb:
- `messages`: JSON string del vector de missatges
- `personality`: "otaku" | "gitano"
- `images`: Blobs (opcional) — imatges en base64 o File

| Camp | Tipus | Requerit | Descripció |
|------|-------|----------|------------|
| messages | array | Sí | Historial de missatges { role, text, blobIds? } |
| personality | string | Sí | "otaku" \| "gitano" |
| images | Blob[] | No | Imatges adjuntes (màx. 6, 24 MB cadascuna). Formats: JPEG, PNG, WebP, GIF |
| documents | Blob[] | No | Documents adjunts (màx. 6 total amb imatges). Formats: PDF, TXT |

## Response

**Content-Type**: `application/json`

### Success (200)

```json
{
  "text": "Resposta de l'IA amb la personalitat triada..."
}
```

### Error (4xx, 5xx)

```json
{
  "error": "Descripció de l'error"
}
```

## Validació (Zod)

- `messages`: array no buit; cada element amb role ("user"|"assistant"), text (string), blobIds (array opcional, màx. 6)
- `personality`: enum ["otaku", "gitano"]
