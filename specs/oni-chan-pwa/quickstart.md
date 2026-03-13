# Quickstart: Oni-chan Chatbot PWA

Validació end-to-end del flux de l'aplicació.

## Prerequisits

- Node.js 18+
- Compte a Google AI Studio (https://aistudio.google.com/apikey)
- Projecte Supabase configurat (Auth anònim habilitat)
- Docker i Docker Compose (opcional, per provar amb contenidors)

## Estructura del projecte

- `frontend/` — Aplicació Nuxt (Tailwind, PWA, Capacitor)
- `backend/` — API Nitro (transcribe, chat)
- `docker/` — Configuració per provar en local

---

## Opció A: Executar amb Docker (recomanat per provar en local)

```bash
# Des de la arrel del repositori
cd RA2-IA

# Crear .env amb les variables necessàries (veure secció Configuració)
# GEMINI_API_KEY=...
# NUXT_PUBLIC_SUPABASE_URL=...
# NUXT_PUBLIC_SUPABASE_ANON_KEY=...

# Executar frontend i backend amb Docker Compose
docker compose -f docker/docker-compose.yml up

# L'app està disponible a http://localhost:3000
# L'API backend a http://localhost:3001
```

---

## Opció B: Executar sense Docker

### 1. Configuració

```bash
# Clonar/obrir projecte
cd RA2-IA

# Frontend
cd frontend && npm install
# Copiar .env.example a .env i omplir variables

# Backend
cd ../backend && npm install
# Copiar .env.example a .env i omplir GEMINI_API_KEY
```

### 2. Variables d'entorn

**frontend/.env**:
```
GEMINI_API_KEY=...
NUXT_PUBLIC_SUPABASE_URL=...
NUXT_PUBLIC_SUPABASE_ANON_KEY=...
NUXT_PUBLIC_API_URL=http://localhost:3001
```

**backend/.env**:
```
GEMINI_API_KEY=...
```

### 3. Executar

```bash
# Terminal 1: Backend (des de backend/)
npm run dev

# Terminal 2: Frontend (des de frontend/)
npm run dev
```

### 3. Validació

1. **Auth**: Obrir app → sessió anònima activa automàticament
2. **Personalitat**: Triar Otaku → enviar "Hola" → resposta amb llenguatge otaku
3. **Personalitat**: Triar Gitano → enviar "Hola" → resposta amb gerga gitana
4. **Múltiples xats**: Botó esquerra → menú lateral → crear nou xat → canviar entre xats → historial correcte per cada un
5. **Eliminar xat**: Botó paperera al costat del xat → confirmació → xat eliminat
6. **Galeria**: Fer clic al títol del xat → s'obre la galeria amb imatges del xat
7. **Imatge**: Pujar imatge (< 24 MB) → es mostra i l'IA la processa
8. **Nota de veu**: Gravar (≤60 s) i enviar → transcripció correcta
9. **Offline**: Desconnectar xarxa → llegir historial i galeria funciona
10. **Transcripció offline**: Sense xarxa, enviar nota de veu → error mostrat, botó per reintentar

### 4. Build PWA

```bash
cd frontend
npm run build
# Verificar dist/ i Service Worker
```

### 5. Build APK (opcional)

```bash
cd frontend
npx cap add android
npx cap sync
# Obrir Android Studio i generar APK
```
