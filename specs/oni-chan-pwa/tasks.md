# Tasks: Oni-chan Chatbot PWA

**Input**: Design documents from `specs/oni-chan-pwa/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- Paths relative to repository root
- **Estructura**: `frontend/` (Nuxt, Tailwind, PWA, Capacitor...) i `backend/` (API Nitro); cada secció organitzada per tecnologia amb tota la instal·lació inclosa.

---

## Phase 1: Setup — Project Skeleton (M1)

**Purpose**: Crear especificacions agents, inicialitzar frontend i backend, Docker per provar en local.

---

### Frontend (`frontend/`)

#### Tecnologia: Agents + Convencions
- [x] T001 Crear carpeta `agents/` a la arrel amb especificacions per cada tecnologia (conventions.md, nuxt.md, vue.md, dexie.md, supabase.md, gemini.md, tailwind.md, capacitor.md, pwa.md, nitro.md, docker.md); respectar metodologia (sense ternaris, bucles imperatius, blocs IMPORTS/VARIABLES/FUNCIONS/EXPORTS, JSDoc A-B-C)

#### Tecnologia: Nuxt
- [x] T002 Crear carpeta `frontend/` i inicialitzar Nuxt 4.3.1 amb JavaScript (no TypeScript) dins `frontend/`
- [x] T003 Estructurar carpetes per capes dins `frontend/`: `composables/`, `components/`, `layouts/`, `pages/`
- [x] T004 Crear layout base responsive a `frontend/layouts/default.vue`
- [x] T005 Crear `.env.example` a `frontend/` amb variables: `GEMINI_API_KEY`, `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_ANON_KEY`, `NUXT_PUBLIC_API_URL` (URL del backend)

#### Tecnologia: Tailwind CSS
- [x] T006 [P] Configurar Tailwind CSS (v4) i Lucide Vue a `frontend/nuxt.config.js`
- [x] T007 [P] Mòbil-first: disseny optimitzat per mòbils; icones Lucide Vue (`lucide-vue-next`)

#### Tecnologia: PWA
- [x] T008 [P] Configurar `@vite-pwa/nuxt` (latest) dins `frontend/` — Service Worker PWA i manifest

#### Tecnologia: Capacitor
- [x] T009 [P] Configurar **Capacitor** (latest) dins `frontend/`: `@capacitor/core`, `@capacitor/android`; `capacitor.config.js` amb `webDir` correcte

#### Tecnologia: ESLint/Prettier
- [x] T010 [P] Configurar ESLint/Prettier i estàndards de codi dins `frontend/`

---

### Backend (`backend/`)

#### Tecnologia: Nitro (API)
- [x] T011 Crear carpeta `backend/` i inicialitzar projecte Nitro standalone amb JavaScript
- [x] T012 Configurar `nitro.config.js` a `backend/`; variables d'entorn `GEMINI_API_KEY`
- [x] T013 Crear estructura `backend/server/api/` per les rutes API
- [x] T014 Configurar CORS per permetre peticions des de `frontend/` (origen del client)

---

### Docker (provar en local)

#### Tecnologia: Docker
- [x] T015 Crear `docker/Dockerfile.frontend` per a la imatge del frontend Nuxt
- [x] T016 Crear `docker/Dockerfile.backend` per a la imatge del backend Nitro
- [x] T017 Crear `docker/docker-compose.yml` que orquestri frontend i backend; variables d'entorn; ports exposats (ex: frontend 3000, backend 3001)
- [x] T018 Documentar a `quickstart.md` els comandos Docker: `docker compose up` per provar l'aplicació en local

---

## Phase 2: Foundational — IndexedDB i Supabase (M2)

**Purpose**: IndexedDB (Dexie.js) per blobs i metadades; Supabase per Auth anònim.

---

### Frontend (`frontend/`)

#### Tecnologia: Dexie (IndexedDB)
- [x] T019 [P] Instal·lar `dexie` (latest) dins `frontend/`; configurar IndexedDB
- [x] T020 Crear composable `frontend/composables/useIndexedDB.js` amb object stores `blobs`, `chat_metadata`, `messages`, `preferences` (Dexie.js)
- [x] T021 Implementar CRUD (get, add, put, delete) amb bucles; sense .map/.filter/.reduce
- [x] T022 Emmagatzematge local de blobs (imatges, àudio, documents); validació 24 MB/fitxer, 6 fitxers/missatge, 60 s màxim per àudio; IDs locals com a referències

#### Tecnologia: Supabase
- [x] T023 [M2] Configurar Supabase Auth anònim (`@supabase/supabase-js`) dins `frontend/`; variables `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] T024 [M2] Validació de dades (Zod o manual) als payloads del client

---

## Phase 3: Transcription Endpoint (M3)

**Purpose**: Endpoint Nitro al backend que rep àudio (Blob/FormData des del client), transcribe amb Gemini i retorna text.

---

### Backend (`backend/`)

#### Tecnologia: Nitro + Gemini (Transcripció)
- [x] T025 [M3] Crear API route `backend/server/api/transcribe.post.js` (Nitro)
- [x] T026 [M3] Integrar transcripció: Gemini (àudio natiu); token Google AI Studio (`GEMINI_API_KEY`)
- [x] T027 [M3] Client envia àudio com a Blob/FormData (llegit des d'IndexedDB local); no Supabase Storage
- [x] T028 [M3] Incloure prompt de personalitat (Otaku/Gitano) al flux de transcripció
- [x] T029 [M3] Retornar transcripció i metadades amb validació Zod

---

## Phase 4: Chat Interface amb selector Otaku/Gitano (M4)

**Purpose**: Interfície multimodal amb múltiples xats, selector de personalitat, galeria, UX fitxers pesats.

---

### Frontend (`frontend/`)

#### Tecnologia: Vue + Composables
- [x] T030 [M4] Crear pàgina principal amb xat buit per defecte; botó adalt esquerra → menú lateral (historial xats, crear nou, eliminar amb paperera); `frontend/pages/index.vue` (layout mòbil tàctil)
- [x] T031 [M4] **Dropdown personalitat**: Adalt a la dreta; triar **Otaku (Oni-chan)** o **Gitano (Primo)** (global per tota l'app)
- [x] T032 [M4] Crear composable `frontend/composables/usePersonality.js` amb system prompts Otaku i Gitano (speckit.specify.md)
- [x] T033 [M4] Implementar component de llista de missatges `frontend/components/chat/ChatMessageList.vue` per xat actiu; missatges referencien fitxers per ID local; validació 6 fitxers màxim per missatge
- [x] T034 [M4] Implementar input multimodal `frontend/components/chat/ChatInput.vue` (text, imatge, àudio, documents PDF/TXT); validació 24 MB/fitxer, 6 fitxers/missatge, 60 s màxim per àudio; blobs a IndexedDB; textos UI en català
- [x] T035 [M4] Implementar grabació i notes de veu: Blob → IndexedDB → transcripció (crida a `backend/api/transcribe`); si falla (offline, error API), mostrar missatge i mantenir botó per reintentar
- [x] T036 [M4] Integrar chatbot: crides a `backend/api/chat` (Nitro); visió per imatges (Blob des del client)
- [x] T037 [M4] Injectar personalitat triada (Otaku/Gitano) a cada petició; rebre `personality` del client
- [x] T038 [M4] Galeria per xat: clic al div del títol → obre galeria; llistar IDs de mitjans; carregar des d'IndexedDB (Object URLs)
- [x] T038b [M4] Títol del xat: generar per IA (resum) després de 2-3 intercanvis; camp editable per l'usuari
- [x] T039 [M4] Persistir historial i preferència a **IndexedDB** (`chat_metadata`, `messages`, `blobs`, `preferences`); sincronitzar metadades a Supabase quan online
- [x] T040 [M4] UX fitxers pesats: lazy thumbnails, Blob URLs temporals, evitar bloquejar main thread; notificacions PWA i mode offline

---

### Backend (`backend/`)

#### Tecnologia: Nitro + Gemini (Chat)
- [x] T041 [M4] Crear API route `backend/server/api/chat.post.js` (Nitro)
- [x] T042 [M4] Integrar chatbot Gemini; rebre `personality` i `messages` del client; processar imatges (Blob)
- [x] T043 [M4] Validació Zod dels payloads

---

## Phase 5: Polish & Cross-Cutting

**Purpose**: Documentació, rendiment i seguretat.

- [x] T044 [P] Documentar API i composables a `docs/`
- [x] T045 Validar Core Web Vitals i optimitzar assets al frontend
- [x] T046 Revisar seguretat de dades locals (IndexedDB per dispositiu); Supabase Auth no exposa secrets
- [x] T047 Build APK amb Capacitor des de `frontend/`: `npx cap add android`, `npx cap sync`, generar APK des d'Android Studio
- [ ] T048 Executar validació de `quickstart.md` (incloent Docker: `docker compose up`)

---

## Dependencies & Execution Order

```
Phase 1 (Setup)  →  BLOCA tot
       ↓
Phase 2 (IndexedDB + Supabase Auth)  →  BLOCA M3 i M4
       ↓
Phase 3 (Transcribe)  i  Phase 4 (Chat)  poden solapar parcialment
       ↓
Phase 5 (Polish)  →  Després de M4 complet
```

### Parallel Opportunities

- T006, T007, T008, T009, T010 (Frontend setup, després de T001–T005)
- T019, T023 (Dexie install, Supabase config)
