---
description: Execute the implementation plan by processing and executing all tasks defined in tasks.md
---

## Implementation Step-by-Step (Oni-chan Chatbot PWA)

Quan implementis el xatbot Oni-chan PWA, segueix aquest pas a pas per fases. Cada fase té un checkpoint de validació obligatori.

---

### Pas 1: Phase 1 — Setup (M1)

| Pas | Acció | Fitxers / Comandes | Checkpoint |
|-----|-------|--------------------|------------|
| 1.0 | **Crear carpeta `agents/`** a la arrel | Especificacions: `conventions.md`, `nuxt.md`, `vue.md`, `dexie.md`, `supabase.md`, `gemini.md`, `tailwind.md`, `capacitor.md`, `pwa.md`; metodologia (sense ternaris, bucles imperatius, blocs IMPORTS/VARIABLES/FUNCIONS/EXPORTS, JSDoc A-B-C) | Carpeta `agents/` amb tots els fitxers |
| 1.1 | Inicialitzar projecte Nuxt 4.3.1 | `npm create nuxt@4.3.1 <nom>` o `npx nuxi@4.3.1 init` | `npm list nuxt` → 4.3.1 |
| 1.2 | Configurar **JavaScript** (no TypeScript) | Eliminar `lang="ts"`, fitxers `.js`, `nuxt.config.js` | Cap fitxer `.ts` |
| 1.3 | Instal·lar Tailwind v4, Lucide Vue | `npm install -D tailwindcss @tailwindcss/vite` + `lucide-vue-next` | `nuxt.config.js` amb `vite.plugins` |
| 1.4 | Configurar PWA (Service Worker) | `npx nuxi module add @vite-pwa/nuxt` (latest) | Manifest i Service Worker generats |
| 1.5 | Configurar **Capacitor** (latest) per APK | `npm install @capacitor/core @capacitor/cli @capacitor/android` | `capacitor.config.js`, `android/` |
| 1.6 | Configurar ESLint/Prettier | `.eslintrc.cjs`, `.prettierrc` | `npm run lint` passa |
| 1.7 | Crear estructura de carpetes | `composables/`, `components/`, `layouts/`, `pages/`, `server/api/` | Carpetes existeixen |
| 1.8 | Layout base responsive | `layouts/default.vue` amb viewport mòbil | Pàgina carrega en mòbil |
| 1.9 | `.env.example` | Variables: `GEMINI_API_KEY`, `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Fitxer complet |

**Validació Phase 1**: `npm run build` i `npm run dev` executen sense errors.

---

### Pas 2: Phase 2 — IndexedDB i Supabase (M2)

| Pas | Acció | Fitxers / Comandes | Checkpoint |
|-----|-------|--------------------|------------|
| 2.1 | Configurar **IndexedDB** (Dexie.js o localForage) | `npm install dexie` o `npm install localforage`; `composables/useIndexedDB.js` | DB accessible al client |
| 2.2 | Object Stores | Crear stores: `blobs`, `chat_metadata`, `messages`, `preferences` (Dexie.js) | Dades persisteixen |
| 2.3 | Composable IndexedDB | `composables/useIndexedDB.js` (get, add, put, delete amb bucles) | CRUD funcional |
| 2.4 | Emmagatzematge local de blobs | Blobs a IndexedDB; validació 24 MB/fitxer, 6 fitxers/missatge; missatges referencien per ID local | Fitxers i àudios locals |
| 2.5 | Supabase Auth anònim | `@supabase/supabase-js`; només usuari anònim; variables Supabase | Auth anònim funcional |
| 2.6 | Validació | Zod o validació manual als payloads | Dades consistents |

**Validació Phase 2**: Guardar i recuperar missatges, blobs i metadades des d'IndexedDB; Supabase Auth operatiu.

---

### Pas 3: Phase 3 — Transcription (M3)

| Pas | Acció | Fitxers / Comandes | Checkpoint |
|-----|-------|--------------------|------------|
| 3.1 | API route Nitro | `server/api/transcribe.post.js` | Endpoint accessible |
| 3.2 | Integrar transcripció | Gemini (àudio natiu); `GEMINI_API_KEY` | Àudio → text |
| 3.3 | Flux: Blob local → transcribir | Client envia Blob/FormData des d'IndexedDB; si falla, mostrar error i mantenir botó per reintentar | Transcripció correcta |
| 3.4 | Prompt personalitat | Variable per Otaku/Gitano | Preparat per injecció |
| 3.5 | Resposta validada amb Zod | Schema per a `{ text, duration, ... }` | Tipus segur |

**Validació Phase 3**: Enviar àudio (Blob local) via API; rebre transcripció vàlida.

---

### Pas 4: Phase 4 — Chat UI amb selector Otaku/Gitano (M4)

| Pas | Acció | Fitxers / Comandes | Checkpoint |
|-----|-------|--------------------|------------|
| 4.1 | Pàgina xat | `pages/index.vue`: xat buit per defecte; botó esquerra → menú lateral (historial, crear nou, eliminar) | UI visible |
| 4.2 | **Dropdown personalitat** | Adalt dreta; triar **Otaku** o **Gitano** (global) | Canvi de personalitat funciona |
| 4.3 | Composable personalitats | `composables/usePersonality.js` amb system prompts Otaku i Gitano (llenguatge, gerga) | Ambdues personalitats definides |
| 4.4 | Llista de missatges | `components/chat/ChatMessageList.vue` | Missatges es mostren |
| 4.5 | Input multimodal | `components/chat/ChatInput.vue` (text, imatge, àudio) | Tots els tipus funcionen |
| 4.6 | Notes de veu | Blob → IndexedDB → crida `/api/transcribe`; si falla, mostrar error i botó per reintentar | VEU → text al xat |
| 4.7 | Endpoint chat IA | `server/api/chat.post.js` amb `@google/generative-ai` (Gemini) | Respostes de l’IA |
| 4.8 | Injectar personalitat | Rebre `personality` (Otaku/Gitano) i injectar system prompt corresponent | Tonalitat segons tria |
| 4.9 | Visió per imatges | Model multimodal; imatges com a Blob des del client (IndexedDB) | Imatges processades |
| 4.10 | Galeria per xat | Llistar IDs mitjans; carregar imatges des d'IndexedDB (Object URLs); accés instantani | Galeria funcional |
| 4.11 | Títol xat | Generar per IA (resum primer intercanvi); editable per l'usuari | Títol correcte |
| 4.12 | Persistir historial + preferència | IndexedDB: `chat_metadata`, `messages`, `blobs`, `preferences`; sincronitzar metadades | Historial i tria guardats |
| 4.13 | UX fitxers pesats | Lazy thumbnails, Blob URLs temporals; evitar bloquejar main thread | UI fluid |
| 4.14 | PWA offline + notificacions | Service Worker `@vite-pwa/nuxt` (latest), Notification API | App instal·lable i offline |
| 4.15 | Build APK amb Capacitor | `npx cap add android`, `npx cap sync`, build des d'Android Studio | APK generat |

**Validació Phase 4**: Triar Otaku → resposta amb llenguatge otaku; triar Gitano → resposta amb gerga gitana.

---

### Pas 5: Phase 5 — Polish

| Pas | Acció | Fitxers / Comandes | Checkpoint |
|-----|-------|--------------------|------------|
| 5.1 | Documentació | `docs/` (API, composables, setup) | README actualitzat |
| 5.2 | Core Web Vitals | Lighthouse, optimització d’imatges | LCP, FID, CLS dins de marge |
| 5.3 | Seguretat | IndexedDB és per usuari/dispositiu; no exposar dades sensibles | Dades locals protegides |
| 5.4 | Validació quickstart | Seguir `quickstart.md` pas a pas | Flux end-to-end validat |

---

### Ordre d’execució i dependències

```
Phase 1 (Setup)     →  BLOCA tot
       ↓
Phase 2 (IndexedDB + Supabase Auth)  →  BLOCA M3 i M4
       ↓
Phase 3 (Transcribe)  i  Phase 4 (Chat)  poden solapar parcialment
       ↓
Phase 5 (Polish)    →  Després de M4 complet
```

**Regla**: No saltar fases. Cada checkpoint ha de passar abans de continuar.

---

## Project Coding Standards (OBLIGATORI)

Tot el codi generat ha de seguir aquestes convencions:

### Llenguatge i format

| Regla | Valor |
|-------|-------|
| **Llenguatge** | **JavaScript** (no TypeScript). Fitxers `.js`; cap `.ts` |
| **Idioma** | Codi i noms en anglès; comentaris i missatges d'usuari en català |
| **Formatting** | Prettier: 2 espais, cometes simples, punt i coma obligatori |
| **Línia màx** | 100 caràcters; tallar amb indentació clara |

### Vue / Nuxt

| Regla | Valor |
|-------|-------|
| **Composition API** | `<script setup>` (sense `lang="ts"`); no Options API |
| **Components** | PascalCase: `ChatMessageList.vue`, `ChatInput.vue` |
| **Composables** | Prefix `use`: `usePersonality.js`, `useIndexedDB.js` |
| **Props** | Definir amb `defineProps()` (sense genèrics) |
| **Emits** | Definir amb `defineEmits()` |

### Nomenclatura

| Tipus | Convenció | Exemple |
|-------|-----------|---------|
| Variables/funcions | camelCase | `getUserMessage`, `isLoading` |
| Classes/tipus/components | PascalCase | `ChatMessage`, `UserProfile` |
| Constants | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE`, `ONI_CHAN_SYSTEM_PROMPT` |
| Fitxers (no components) | kebab-case | `chat-schemas.js`, `indexed-db-utils.js` |

### Estructura de fitxers

- **Components**: `components/chat/ChatMessageList.vue` (carpeta per domini)
- **Composables**: `composables/usePersonality.js` (Otaku/Gitano), `composables/useIndexedDB.js` (un composable per fitxer)
- **Server**: `server/api/chat.post.js` (sufix HTTP method)
- **Utils**: `server/utils/schemas.js` o `lib/` per codi compartit

### Base de dades i APK

- **IndexedDB**: Llibreria **Dexie.js** o **localForage**. Stores: `blobs` (imatges, àudio, fitxers), `chat_metadata`, `preferences`. Substitució total de Supabase Storage; app totalment offline.
- **Supabase**: Només **Auth** i **sincronització de metadades** (text xats, IDs fitxers locals, personalitat). Blobs mai a Supabase.
- **APK Android**: **Capacitor** (latest). `@capacitor/core`, `@capacitor/android`. Build: `nuxt build` → `npx cap sync` → Android Studio.
- **PWA**: **@vite-pwa/nuxt** (latest) — Service Worker per offline i instal·lació.

### Seguretat i secrets

- **Mai** hardcodar `GEMINI_API_KEY` ni cap secret
- Ús exclusiu de variables d'entorn; documentar a `.env.example`
- Validar tot input amb Zod abans de processar

### Referència IA

- **Chatbot**: **Google Gemini** (`@google/generative-ai`). Token de **Google AI Studio** (https://aistudio.google.com/apikey)
- **Variable**: `GEMINI_API_KEY`
- Llegir només al servidor; mai exposar al client

### Personalitats Otaku i Gitano

- **Otaku (Oni-chan)**: Noia anime otaku. System prompt amb llenguatge energètic, expressions japoneses (sugoi, kawaii, nee-chan, yatta, gambatte…), kaomojis. Guiar l'usuari. Veure speckit.specify.md.
- **Gitano**: Personalitat càlida. System prompt amb caló i gerga (molar, chaval, tío, cante, parné, jalar, menda, flipar, mola mazo, nanai, chungo…). Guiar l'usuari. Veure speckit.specify.md.
- **Selector**: L’usuari tria; la preferència es persisteix a IndexedDB i s’envia amb cada petició al chat.

### Metodologia de programació (TOTS ELS LLENGUATGES)

- **Mai** operadors ternaris (`? :`). Utilitzar `if/else` explícit.
- **Mai** `.map`, `.filter`, `.reduce`, `.forEach` ni mètodes funcionals similars. Utilitzar bucles imperatius: `for`, `for...of`, `for...in`, `while`.
  - Exemple: en lloc de `arr.map(x => x * 2)`, usar `for (let i = 0; i < arr.length; i++) { result[i] = arr[i] * 2; }`
- Aquesta metodologia s'aplica a **tots els llenguatges** del projecte (JavaScript, Vue, SQL, etc.).

### Estructura de comentaris als fitxers

Tot fitxer ha de tenir blocs de comentaris amb aquest format:

```text
//==============================================================================
//================================ IMPORTS =====================================
//==============================================================================

//==============================================================================
//================================ VARIABLES ===================================
//==============================================================================

//==============================================================================
//================================ FUNCIONS ====================================
//==============================================================================

//==============================================================================
//================================ EXPORTS =====================================
//==============================================================================
```

- Ajustar les seccions al llenguatge (p. ex. Python: `# === IMPORTS ===`, SQL: `-- === ... ===`, Vue: dins de `<script>`).
- En fitxers `.vue`, aplicar dins de la secció `<script setup>`.
- Omplir cada secció; si no n'hi ha, deixar-la buida amb una línia de comentari indicant-ho.

### Documentació interna de funcions

Totes les funcions han d'incloure:

1. **Descripció general**: Què fa la funció en una o dues frases.
2. **Desglossament pas a pas**: Lògica interna numerada amb lletres (A, B, C...).

**Exemple** (JavaScript):

```javascript
/**
 * Retorna els missatges filtrats per usuari.
 * A) Obtenir l'ID de l'usuari actual.
 * B) Recórrer tots els missatges amb un bucle for.
 * C) Si el missatge pertany a l'usuari, afegir-lo al resultat.
 * D) Retornar el resultat.
 */
function getMessagesByUser(messages, userId) {
  const result = [];
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].userId === userId) {
      result.push(messages[i]);
    }
  }
  return result;
}
```

---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pre-Execution Checks

**Check for extension hooks (before implementation)**:
- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_implement` key
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

1. Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Check checklists status** (if FEATURE_DIR/checklists/ exists):
   - Scan all checklist files in the checklists/ directory
   - For each checklist, count:
     - Total items: All lines matching `- [ ]` or `- [X]` or `- [x]`
     - Completed items: Lines matching `- [X]` or `- [x]`
     - Incomplete items: Lines matching `- [ ]`
   - Create a status table:

     ```text
     | Checklist | Total | Completed | Incomplete | Status |
     |-----------|-------|-----------|------------|--------|
     | ux.md     | 12    | 12        | 0          | ✓ PASS |
     | test.md   | 8     | 5         | 3          | ✗ FAIL |
     | security.md | 6   | 6         | 0          | ✓ PASS |
     ```

   - Calculate overall status:
     - **PASS**: All checklists have 0 incomplete items
     - **FAIL**: One or more checklists have incomplete items

   - **If any checklist is incomplete**:
     - Display the table with incomplete item counts
     - **STOP** and ask: "Some checklists are incomplete. Do you want to proceed with implementation anyway? (yes/no)"
     - Wait for user response before continuing
     - If user says "no" or "wait" or "stop", halt execution
     - If user says "yes" or "proceed" or "continue", proceed to step 3

   - **If all checklists are complete**:
     - Display the table showing all checklists passed
     - Automatically proceed to step 3

3. Load and analyze the implementation context:
   - **REQUIRED**: Read tasks.md for the complete task list and execution plan
   - **REQUIRED**: Read plan.md for tech stack, architecture, and file structure
   - **IF EXISTS**: Read data-model.md for entities and relationships
   - **IF EXISTS**: Read contracts/ for API specifications and test requirements
   - **IF EXISTS**: Read research.md for technical decisions and constraints
   - **IF EXISTS**: Read quickstart.md for integration scenarios

4. **Project Setup Verification**:
   - **REQUIRED**: Create/verify ignore files based on actual project setup:

   **Detection & Creation Logic**:
   - Check if the following command succeeds to determine if the repository is a git repo (create/verify .gitignore if so):

     ```sh
     git rev-parse --git-dir 2>/dev/null
     ```

   - Check if Dockerfile* exists or Docker in plan.md → create/verify .dockerignore
   - Check if .eslintrc* exists → create/verify .eslintignore
   - Check if eslint.config.* exists → ensure the config's `ignores` entries cover required patterns
   - Check if .prettierrc* exists → create/verify .prettierignore
   - Check if .npmrc or package.json exists → create/verify .npmignore (if publishing)
   - Check if terraform files (*.tf) exist → create/verify .terraformignore
   - Check if .helmignore needed (helm charts present) → create/verify .helmignore

   **If ignore file already exists**: Verify it contains essential patterns, append missing critical patterns only
   **If ignore file missing**: Create with full pattern set for detected technology

   **Common Patterns by Technology** (from plan.md tech stack):
   - **Node.js/JavaScript/TypeScript**: `node_modules/`, `dist/`, `build/`, `*.log`, `.env*`
   - **Python**: `__pycache__/`, `*.pyc`, `.venv/`, `venv/`, `dist/`, `*.egg-info/`
   - **Java**: `target/`, `*.class`, `*.jar`, `.gradle/`, `build/`
   - **C#/.NET**: `bin/`, `obj/`, `*.user`, `*.suo`, `packages/`
   - **Go**: `*.exe`, `*.test`, `vendor/`, `*.out`
   - **Ruby**: `.bundle/`, `log/`, `tmp/`, `*.gem`, `vendor/bundle/`
   - **PHP**: `vendor/`, `*.log`, `*.cache`, `*.env`
   - **Rust**: `target/`, `debug/`, `release/`, `*.rs.bk`, `*.rlib`, `*.prof*`, `.idea/`, `*.log`, `.env*`
   - **Kotlin**: `build/`, `out/`, `.gradle/`, `.idea/`, `*.class`, `*.jar`, `*.iml`, `*.log`, `.env*`
   - **C++**: `build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.so`, `*.a`, `*.exe`, `*.dll`, `.idea/`, `*.log`, `.env*`
   - **C**: `build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.a`, `*.so`, `*.exe`, `*.dll`, `autom4te.cache/`, `config.status`, `config.log`, `.idea/`, `*.log`, `.env*`
   - **Swift**: `.build/`, `DerivedData/`, `*.swiftpm/`, `Packages/`
   - **R**: `.Rproj.user/`, `.Rhistory`, `.RData`, `.Ruserdata`, `*.Rproj`, `packrat/`, `renv/`
   - **Universal**: `.DS_Store`, `Thumbs.db`, `*.tmp`, `*.swp`, `.vscode/`, `.idea/`

   **Tool-Specific Patterns**:
   - **Docker**: `node_modules/`, `.git/`, `Dockerfile*`, `.dockerignore`, `*.log*`, `.env*`, `coverage/`
   - **ESLint**: `node_modules/`, `dist/`, `build/`, `coverage/`, `*.min.js`
   - **Prettier**: `node_modules/`, `dist/`, `build/`, `coverage/`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   - **Terraform**: `.terraform/`, `*.tfstate*`, `*.tfvars`, `.terraform.lock.hcl`
   - **Kubernetes/k8s**: `*.secret.yaml`, `secrets/`, `.kube/`, `kubeconfig*`, `*.key`, `*.crt`

5. Parse tasks.md structure and extract:
   - **Task phases**: Setup, Tests, Core, Integration, Polish
   - **Task dependencies**: Sequential vs parallel execution rules
   - **Task details**: ID, description, file paths, parallel markers [P]
   - **Execution flow**: Order and dependency requirements

6. Execute implementation following the task plan:
   - **If implementing Oni-chan PWA**: Use **Implementation Step-by-Step** and **Project Coding Standards** sections above
   - **Phase-by-phase execution**: Complete each phase before moving to the next
   - **Respect dependencies**: Run sequential tasks in order, parallel tasks [P] can run together  
   - **Follow TDD approach**: Execute test tasks before their corresponding implementation tasks
   - **File-based coordination**: Tasks affecting the same files must run sequentially
   - **Validation checkpoints**: Verify each phase completion before proceeding

7. Implementation execution rules:
   - **Setup first**: Initialize project structure, dependencies, configuration
   - **Tests before code**: If you need to write tests for contracts, entities, and integration scenarios
   - **Core development**: Implement models, services, CLI commands, endpoints
   - **Integration work**: Database connections, middleware, logging, external services
   - **Polish and validation**: Unit tests, performance optimization, documentation

8. Progress tracking and error handling:
   - Report progress after each completed task
   - Halt execution if any non-parallel task fails
   - For parallel tasks [P], continue with successful tasks, report failed ones
   - Provide clear error messages with context for debugging
   - Suggest next steps if implementation cannot proceed
   - **IMPORTANT** For completed tasks, make sure to mark the task off as [X] in the tasks file.

9. Completion validation:
   - Verify all required tasks are completed
   - Check that implemented features match the original specification
   - Validate that tests pass and coverage meets requirements
   - Confirm the implementation follows the technical plan
   - Report final status with summary of completed work

Note: This command assumes a complete task breakdown exists in tasks.md. If tasks are incomplete or missing, suggest running `/speckit.tasks` first to regenerate the task list.

10. **Check for extension hooks**: After completion validation, check if `.specify/extensions.yml` exists in the project root.
    - If it exists, read it and look for entries under the `hooks.after_implement` key
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
