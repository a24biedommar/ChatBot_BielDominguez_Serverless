---
description: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.
handoffs: 
  - label: Analyze For Consistency
    agent: speckit.analyze
    prompt: Run a project analysis for consistency
    send: true
  - label: Implement Project
    agent: speckit.implement
    prompt: Start the implementation in phases
    send: true
---

## Project Default Tasks (Oni-chan Chatbot PWA)

Quan generis `tasks.md` per al xatbot Oni-chan, utilitza aquestes tasques com a referència/plantilla. Organitza-les per milestones M1 → M2 → M3 → M4.

**Estàndards de codi**: Respectar `speckit.implement.md`: **JavaScript** (no TypeScript), Composition API, PascalCase, prefix `use`, IndexedDB, Capacitor, `GEMINI_API_KEY`, sense ternaris ni `.map`/`.filter`/`.reduce` (usar bucles), blocs de comentaris IMPORTS/VARIABLES/FUNCIONS/EXPORTS, documentació de funcions amb A-B-C.

### Phase 1: Setup — Project Skeleton (M1)

**Purpose**: Crear especificacions agents; inicialitzar Nuxt 4.3.1 amb **JavaScript** (no TypeScript), arquitectura de capes i Capacitor per APK.

- [ ] T001 Crear carpeta `agents/` a la arrel amb especificacions per cada tecnologia (conventions.md, nuxt.md, vue.md, dexie.md, supabase.md, gemini.md, tailwind.md, capacitor.md, pwa.md); respectar metodologia (sense ternaris, bucles imperatius, blocs IMPORTS/VARIABLES/FUNCIONS/EXPORTS, JSDoc A-B-C)
- [ ] T002 Inicialitzar projecte Nuxt 4.3.1 en `./` amb JavaScript
- [ ] T003 [P] Configurar Tailwind CSS (v4) i Lucide Vue a `nuxt.config.js`
- [ ] T004 [P] Configurar `@vite-pwa/nuxt` (latest) — Service Worker PWA i manifest
- [ ] T005 [P] Configurar **Capacitor** (latest) per APK: `@capacitor/core`, `@capacitor/android`
- [ ] T006 [P] Configurar ESLint/Prettier i estàndards de codi
- [ ] T007 Estructurar carpetes per capes: `composables/`, `components/`, `layouts/`, `pages/`, `server/`
- [ ] T008 Crear layout base responsive a `layouts/default.vue`
- [ ] T009 Crear `.env.example` amb variables: `GEMINI_API_KEY`, `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_ANON_KEY`

### Phase 2: Foundational — IndexedDB i Supabase (M2)

**Purpose**: **IndexedDB** (Dexie.js) per blobs i metadades locals; **Supabase** per Auth i sincronització de metadades. **Prioritat**: completar abans de transcripció i xat.

- [ ] T010 [P] [M2] Instal·lar `dexie` (latest); configurar IndexedDB
- [ ] T011 [M2] Crear composable `composables/useIndexedDB.js` amb object stores `blobs`, `chat_metadata`, `messages`, `preferences`
- [ ] T012 [M2] Implementar CRUD (get, add, put, delete) amb bucles; sense .map/.filter/.reduce
- [ ] T013 [M2] Emmagatzematge local de blobs (imatges, àudio, fitxers) com a Blobs a IndexedDB; validació límits 24 MB/fitxer, 6 fitxers/missatge; IDs locals com a referències
- [ ] T014 [M2] Configurar Supabase Auth anònim (`@supabase/supabase-js`); només usuari anònim; variables `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] T015 [M2] Validació de dades (Zod o manual) als payloads

### Phase 3: Transcription Endpoint (M3)

**Purpose**: Endpoint Nitro que rep àudio (Blob/FormData des del client, llegit d'IndexedDB local), el transcribe amb Gemini i retorna text.

- [ ] T016 [M3] Crear API route `server/api/transcribe.post.js` (Nitro)
- [ ] T017 [M3] Integrar transcripció: Gemini (àudio natiu); token Google AI Studio (`GEMINI_API_KEY`)
- [ ] T018 [M3] Client envia àudio com a Blob/FormData (llegit des d'IndexedDB local); no Supabase Storage
- [ ] T019 [M3] Incloure prompt de personalitat (Otaku/Gitano) al flux de transcripció
- [ ] T020 [M3] Retornar transcripció i metadades amb validació Zod

### Phase 4: Chat Interface amb selector Otaku/Gitano (M4)

**Purpose**: Interfície de xat multimodal amb múltiples xats (crear/llistar/canviar), selector Otaku/Gitano, galeria per xat, UX per fitxers pesats. Transcripció: mostrar error si falla; botó actiu per reintentar.

- [ ] T021 [M4] Crear pàgina principal: xat buit per defecte; botó esquerra → menú lateral (historial, crear nou, eliminar amb paperera) `pages/index.vue`
- [ ] T022 [M4] **Dropdown personalitat** adalt dreta: triar **Otaku** o **Gitano** (global)
- [ ] T023 [M4] Crear composable `composables/usePersonality.js` amb system prompts: Otaku i Gitano (speckit.specify.md)
- [ ] T024 [M4] Implementar component de llista de missatges `components/chat/ChatMessageList.vue` per xat actiu; missatges referencien fitxers per ID local; validació 6 fitxers màxim per missatge
- [ ] T025 [M4] Implementar input multimodal `components/chat/ChatInput.vue` (text il·limitat, imatge, àudio); validació 24 MB/fitxer, 6 fitxers/missatge; blobs a IndexedDB
- [ ] T026 [M4] Implementar grabació i notes de veu: Blob → IndexedDB → transcripció; si falla (offline, error API), mostrar missatge i mantenir botó per reintentar
- [ ] T027 [M4] Integrar chatbot Gemini a `server/api/chat.post.js` (Nitro); visió per imatges (Blob des del client)
- [ ] T028 [M4] Injectar personalitat triada (Otaku/Gitano) a cada petició; rebre `personality` del client
- [ ] T029 [M4] Galeria per xat: llistar IDs de mitjans; carregar imatges des d'IndexedDB (Object URLs)
- [ ] T028b [M4] Títol xat: generar per IA (resum primer intercanvi); editable per l'usuari
- [ ] T030 [M4] Persistir historial i preferència a **IndexedDB** (`chat_metadata`, `messages`, `blobs`, `preferences`); sincronitzar metadades a Supabase quan online
- [ ] T031 [M4] UX fitxers pesats: lazy thumbnails, Blob URLs temporals, evitar bloquejar main thread; notificacions PWA i mode offline

### Phase 5: Polish & Cross-Cutting

**Purpose**: Documentació, rendiment i seguretat.

- [ ] T032 [P] Documentar API i composables a `docs/`
- [ ] T033 Validar Core Web Vitals i optimitzar assets
- [ ] T034 Revisar seguretat de dades locals (IndexedDB per dispositiu); Supabase Auth no exposa secrets
- [ ] T035 Build APK amb Capacitor: `npx cap add android`, `npx cap sync`, generar APK des d'Android Studio
- [ ] T036 Executar validació de `quickstart.md` (si existeix)

---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pre-Execution Checks

**Check for extension hooks (before tasks generation)**:
- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_tasks` key
- If the YAML cannot be parsed or is invalid, skip hook checking silently and continue normally
- Filter to only hooks where `enabled: true`
- For each remaining hook, do **not** attempt to interpret or evaluate hook `condition` expressions:
  - If the hook has no `condition` field, or it is null/empty, treat the hook as executable
  - If the hook defines a non-empty `condition`, skip the hook and leave condition evaluation to the HookExecutor implementation
- For each executable hook, output the following based on its `optional` flag:
  - **Optional hook** (`optional: true`):
    ```
    ## Extension Hooks

    **Optional Pre-Hook**: {extension}
    Command: `/{command}`
    Description: {description}

    Prompt: {prompt}
    To execute: `/{command}`
    ```
  - **Mandatory hook** (`optional: false`):
    ```
    ## Extension Hooks

    **Automatic Pre-Hook**: {extension}
    Executing: `/{command}`
    EXECUTE_COMMAND: {command}
    
    Wait for the result of the hook command before proceeding to the Outline.
    ```
- If no hooks are registered or `.specify/extensions.yml` does not exist, skip silently

## Outline

1. **Setup**: Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load design documents**: Read from FEATURE_DIR:
   - **Required**: plan.md (tech stack, libraries, structure), spec.md (user stories with priorities)
   - **Optional**: data-model.md (entities), contracts/ (interface contracts), research.md (decisions), quickstart.md (test scenarios)
   - Note: Not all projects have all documents. Generate tasks based on what's available.

3. **Execute task generation workflow**:
   - If plan.md/spec.md are missing or sparse, use **Project Default Tasks** above as base template
   - Load plan.md and extract tech stack, libraries, project structure, milestones (M1–M4)
   - Load spec.md and extract user stories with their priorities (P1, P2, P3, etc.)
   - If data-model.md exists: Extract entities and map to user stories
   - If contracts/ exists: Map interface contracts to user stories
   - If research.md exists: Extract decisions for setup tasks
   - Generate tasks organized by user story (see Task Generation Rules below)
   - Generate dependency graph showing user story completion order
   - Create parallel execution examples per user story
   - Validate task completeness (each user story has all needed tasks, independently testable)

4. **Generate tasks.md**: Use `.specify/templates/tasks-template.md` as structure, fill with:
   - Correct feature name from plan.md
   - Phase 1: Setup tasks (project initialization)
   - Phase 2: Foundational tasks (blocking prerequisites for all user stories)
   - Phase 3+: One phase per user story (in priority order from spec.md)
   - Each phase includes: story goal, independent test criteria, tests (if requested), implementation tasks
   - Final Phase: Polish & cross-cutting concerns
   - All tasks must follow the strict checklist format (see Task Generation Rules below)
   - Clear file paths for each task
   - Dependencies section showing story completion order
   - Parallel execution examples per story
   - Implementation strategy section (MVP first, incremental delivery)

5. **Report**: Output path to generated tasks.md and summary:
   - Total task count
   - Task count per user story
   - Parallel opportunities identified
   - Independent test criteria for each story
   - Suggested MVP scope (typically just User Story 1)
   - Format validation: Confirm ALL tasks follow the checklist format (checkbox, ID, labels, file paths)

6. **Check for extension hooks**: After tasks.md is generated, check if `.specify/extensions.yml` exists in the project root.
   - If it exists, read it and look for entries under the `hooks.after_tasks` key
   - If the YAML cannot be parsed or is invalid, skip hook checking silently and continue normally
   - Filter to only hooks where `enabled: true`
   - For each remaining hook, do **not** attempt to interpret or evaluate hook `condition` expressions:
     - If the hook has no `condition` field, or it is null/empty, treat the hook as executable
     - If the hook defines a non-empty `condition`, skip the hook and leave condition evaluation to the HookExecutor implementation
   - For each executable hook, output the following based on its `optional` flag:
     - **Optional hook** (`optional: true`):
       ```
       ## Extension Hooks

       **Optional Hook**: {extension}
       Command: `/{command}`
       Description: {description}

       Prompt: {prompt}
       To execute: `/{command}`
       ```
     - **Mandatory hook** (`optional: false`):
       ```
       ## Extension Hooks

       **Automatic Hook**: {extension}
       Executing: `/{command}`
       EXECUTE_COMMAND: {command}
       ```
   - If no hooks are registered or `.specify/extensions.yml` does not exist, skip silently

Context for task generation: $ARGUMENTS

The tasks.md should be immediately executable - each task must be specific enough that an LLM can complete it without additional context.

## Task Generation Rules

**CRITICAL**: Tasks MUST be organized by user story to enable independent implementation and testing.

**Tests are OPTIONAL**: Only generate test tasks if explicitly requested in the feature specification or if user requests TDD approach.

### Checklist Format (REQUIRED)

Every task MUST strictly follow this format:

```text
- [ ] [TaskID] [P?] [Story?] Description with file path
```

**Format Components**:

1. **Checkbox**: ALWAYS start with `- [ ]` (markdown checkbox)
2. **Task ID**: Sequential number (T001, T002, T003...) in execution order
3. **[P] marker**: Include ONLY if task is parallelizable (different files, no dependencies on incomplete tasks)
4. **[Story] label**: REQUIRED for user story phase tasks only
   - Format: [US1], [US2], [US3], etc. (maps to user stories from spec.md)
   - Setup phase: NO story label
   - Foundational phase: NO story label  
   - User Story phases: MUST have story label
   - Polish phase: NO story label
5. **Description**: Clear action with exact file path

**Examples**:

- ✅ CORRECT: `- [ ] T001 Create project structure per implementation plan`
- ✅ CORRECT: `- [ ] T005 [P] Implement authentication middleware in src/middleware/auth.py`
- ✅ CORRECT: `- [ ] T012 [P] [US1] Create User model in src/models/user.py`
- ✅ CORRECT: `- [ ] T014 [US1] Implement UserService in src/services/user_service.py`
- ❌ WRONG: `- [ ] Create User model` (missing ID and Story label)
- ❌ WRONG: `T001 [US1] Create model` (missing checkbox)
- ❌ WRONG: `- [ ] [US1] Create User model` (missing Task ID)
- ❌ WRONG: `- [ ] T001 [US1] Create model` (missing file path)

### Task Organization

1. **From User Stories (spec.md)** - PRIMARY ORGANIZATION:
   - Each user story (P1, P2, P3...) gets its own phase
   - Map all related components to their story:
     - Models needed for that story
     - Services needed for that story
     - Interfaces/UI needed for that story
     - If tests requested: Tests specific to that story
   - Mark story dependencies (most stories should be independent)

2. **From Contracts**:
   - Map each interface contract → to the user story it serves
   - If tests requested: Each interface contract → contract test task [P] before implementation in that story's phase

3. **From Data Model**:
   - Map each entity to the user story(ies) that need it
   - If entity serves multiple stories: Put in earliest story or Setup phase
   - Relationships → service layer tasks in appropriate story phase

4. **From Setup/Infrastructure**:
   - Shared infrastructure → Setup phase (Phase 1)
   - Foundational/blocking tasks → Foundational phase (Phase 2)
   - Story-specific setup → within that story's phase

### Phase Structure

- **Phase 1**: Setup (project initialization)
- **Phase 2**: Foundational (blocking prerequisites - MUST complete before user stories)
- **Phase 3+**: User Stories in priority order (P1, P2, P3...)
  - Within each story: Tests (if requested) → Models → Services → Endpoints → Integration
  - Each phase should be a complete, independently testable increment
- **Final Phase**: Polish & Cross-Cutting Concerns
