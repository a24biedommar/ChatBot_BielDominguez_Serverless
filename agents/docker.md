# Docker — Especificació

**Propòsit**: Provar l'aplicació en local (frontend + backend) amb contenidors.

## Ubicació

```text
docker/
├── docker-compose.yml
├── Dockerfile.frontend
└── Dockerfile.backend
```

## Configuració

- **Frontend**: Imatge basada en Node 18+; serveix l'app Nuxt (port 3000).
- **Backend**: Imatge basada en Node 18+; serveix l'API Nitro (port 3001).
- **docker-compose.yml**: Defineix els dos serveis; variables d'entorn des de `.env` o environment; xarxa interna entre frontend i backend.

## Variables d'entorn

- `GEMINI_API_KEY` — Requerida pel backend.
- `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_ANON_KEY` — Per al frontend.
- `NUXT_PUBLIC_API_URL` — URL del backend (ex: `http://backend:3001` dins Docker, `http://localhost:3001` en local).

## Comandos

```bash
# Executar frontend i backend
docker compose -f docker/docker-compose.yml up

# Executar en segon pla
docker compose -f docker/docker-compose.yml up -d
```
