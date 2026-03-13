# Contract: API Transcribe

**Endpoint**: `POST /api/transcribe`

## Request

**Content-Type**: `multipart/form-data`

| Camp | Tipus | Requerit | Descripció |
|------|-------|----------|------------|
| audio | Blob/File | Sí | Fitxer d'àudio. Formats: MP3, WAV, WebM, OGG. Màxim **60 segons** de durada |
| personality | string | No | "otaku" \| "gitano" — per ajustar el context de transcripció |

## Response

**Content-Type**: `application/json`

### Success (200)

```json
{
  "text": "Transcripció del àudio...",
  "duration": 5.2
}
```

| Camp | Tipus | Descripció |
|------|-------|------------|
| text | string | Text transcrit |
| duration | number | Durada en segons (opcional) |

### Error (4xx, 5xx)

```json
{
  "error": "Descripció de l'error"
}
```

## Validació (Zod)

- `text`: string no buit
- `duration`: number >= 0 (opcional)
