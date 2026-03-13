---
description: Execute the implementation planning workflow using the plan template to generate design artifacts.
handoffs:
  - label: Create Tasks
    agent: speckit.tasks
    prompt: Break the plan into tasks
    send: true
  - label: Create Checklist
    agent: speckit.checklist
    prompt: Create a checklist for the following domain...
---

## Project Technical Specifications

Utilitza aquestes especificacions com a context tècnic per defecte quan generis plans per al xatbot Oni-chan PWA:

### Frontend
- **Nuxt 4.3.1** (latest) amb **JavaScript** (no TypeScript). Arquitectura de capes i components optimitzats per a mòbil.

### Infraestructura Serverless
- Backend a **Nitro Engine** integrant **Google Gemini** (`@google/generative-ai`) per a funcions multimodals. Veure secció «Provider d'IA i Token».

### Persistència i Arquitectura de Dades

**Storage local (IndexedDB)** — substitució total de Supabase Storage:
- Llibreria: **Dexie.js**.
- Object stores: `blobs`, `chat_metadata`, `messages`, `preferences`.
- Objectiu: aplicació **totalment funcional en mode offline**.

**Supabase** — ús restringit:
- **Auth**: Només **usuari anònim**; metadades associades a ID anònim. Sense registre ni login.
- **Database**: Sincronització de metadades dels xats (text, IDs fitxers locals, personalitat). Els blobs NO es pugen; només referències (IDs locals).

**Límits de fitxers**: 24 MB per fitxer; 6 fitxers per missatge; text il·limitat.

**Múltiples xats**: Crear nou xat, llistar xats, canviar entre xats; cada un amb historial i galeria propis.

### Intel·ligència Multimodal
- **Chatbot Gemini**: Models de visió per a imatges i transcripció d'àudio (natiu). Token de **Google AI Studio**.

### Distribució PWA i APK
- **@vite-pwa/nuxt** (latest): Service Worker per PWA, experiència instal·lable, offline-first i notificacions.
- **Capacitor** (latest): Build APK Android. `@capacitor/core`, `@capacitor/android`.

### Prioritat del Pla
Organitza les tasques per:
1. Establir primer **IndexedDB** i la lògica de **transcripció**
2. Implementar **selector de personalitat** (Otaku / Gitano) i injectar la personalitat triada en cada interacció

### Milestones (Ordre Recomanat)

| Milestone | Contingut |
|-----------|-----------|
| **M1** | Setup del «Project Skeleton» amb Nuxt 4.3.1 |
| **M2** | Configuració IndexedDB (Dexie.js/localForage): stores `blobs`, `chat_metadata`, `preferences`; Supabase Auth + metadades |
| **M3** | Endpoint transcripció (Nitro): rep Blob/FormData des del client; àudio des d'IndexedDB local |
| **M4** | Interfície de xat: múltiples xats (crear/llistar/canviar), selector Otaku/Gitano, galeria per xat (Mobile UI) |

### Provider d'IA i Token (OBLIGATORI)

- **Chatbot**: **Google Gemini** — únic provider (chat, visió, transcripció)
- **Token**: Generat a **Google AI Studio** → https://aistudio.google.com/apikey
- **Variable d'entorn**: `GEMINI_API_KEY` (mai al codi; només `.env`)
- **SDK**: `@google/generative-ai`
- **Models**: `gemini-1.5-flash` o `gemini-1.5-pro`; àudio natiu
- **Configuració**: Clau només al servidor (Nitro) via `process.env.GEMINI_API_KEY`

### Personalitats (OBLIGATORI)

L'app ofereix **dues personalitats** seleccionables per l'usuari:
- **Otaku (Oni-chan)**: Noia anime otaku. Llenguatge energètic amb expressions japoneses (sugoi, kawaii, nee-chan, yatta, gambatte…) i kaomojis (´・ω・`, ≧▽≦…). Guiar l'usuari en cada interacció. Veure speckit.specify.md.
- **Gitano**: Personalitat càlida i directa. Llenguatge amb caló i gerga romaní (molar, chaval, tío, cante, parné, jalar, menda, pirarse, flipar, mola mazo, nanai, chungo…). Guiar l'usuari amb confiança. Veure speckit.specify.md.
- Selector a la UI; preferència guardada a IndexedDB i sincronitzada a Supabase (metadades) quan online.

---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Setup**: Run `.specify/scripts/powershell/setup-plan.ps1 -Json` from repo root and parse JSON for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load context**: Read FEATURE_SPEC and `.specify/memory/constitution.md`. Load IMPL_PLAN template (already copied).

3. **Execute plan workflow**: Follow the structure in IMPL_PLAN template to:
   - Fill Technical Context using **Project Technical Specifications** above as default; mark unknowns as "NEEDS CLARIFICATION"
   - Structure milestones as M1 → M2 → M3 → M4 (Skeleton → Storage → Transcription → Chat UI)
   - Fill Constitution Check section from constitution
   - Evaluate gates (ERROR if violations unjustified)
   - Phase 0: Generate research.md (resolve all NEEDS CLARIFICATION)
   - Phase 1: Generate data-model.md, contracts/, quickstart.md
   - Phase 1: Update agent context by running the agent script
   - Re-evaluate Constitution Check post-design

4. **Stop and report**: Command ends after Phase 2 planning. Report branch, IMPL_PLAN path, and generated artifacts.

## Phases

### Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```text
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

### Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Define interface contracts** (if project has external interfaces) → `/contracts/`:
   - Identify what interfaces the project exposes to users or other systems
   - Document the contract format appropriate for the project type
   - Examples: public APIs for libraries, command schemas for CLI tools, endpoints for web services, grammars for parsers, UI contracts for applications
   - Skip if project is purely internal (build scripts, one-off tools, etc.)

3. **Agent context update**:
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType cursor-agent`
   - These scripts detect which AI agent is in use
   - Update the appropriate agent-specific context file
   - Add only new technology from current plan
   - Preserve manual additions between markers

**Output**: data-model.md, /contracts/\*, quickstart.md, agent-specific file

## Key rules

- Use absolute paths
- ERROR on gate failures or unresolved clarifications
