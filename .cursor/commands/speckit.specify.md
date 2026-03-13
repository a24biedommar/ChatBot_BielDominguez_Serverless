---
description: Create or update the feature specification from a natural language feature description.
handoffs: 
  - label: Build Technical Plan
    agent: speckit.plan
    prompt: Create a plan for the spec. I am building with...
  - label: Clarify Spec Requirements
    agent: speckit.clarify
    prompt: Clarify specification requirements
    send: true
---

## Project Context (Default App)

La nostra app és:

> Una aplicació de xatbot multimodal optimitzada específicament per a dispositius mòbils com a PWA amb **múltiples xats** (crear nou, llistar, canviar). Permet la pujada de fitxers i imatges (màxim **24 MB per fitxer**, **6 fitxers per missatge**; text il·limitat). Transcripció automàtica per a notes de veu. L'usuari pot **escollir** entre dues personalitats: **Otaku (Oni-chan)** o **Gitano (Primo)**. Auth **només anònim** (Supabase); gestió de mitjans 100% local (IndexedDB). App totalment funcional offline.

**Referència**: Utilitza aquest context quan `$ARGUMENTS` sigui buit o quan les especificacions facin referència a «l'app», «el projecte» o funcionalitats del xatbot.

### Personalitats disponibles (seleccionables)

#### Otaku (Oni-chan)

**Descripció**: Personalitat d'una noia anime otaku estil **Oni-chan**. Utilitza un llenguatge energètic ple d'expressions japoneses i kaomojis per guiar l'usuari en cada interacció. Curosament atenta, afectuosa com una germana major.

**Llenguatge i gerga**:
- **Expressions japoneses**: sugoi (genial), kawaii (mono), nee/nee-chan (ei, germana), -chan/-kun (sufixos afectuosos), yatta (ho hem aconseguit!), gambatte (anima't), arigatou, gomen, hai (sí), iie (no), daijoubu (està bé), mou (ja), nani (què), wakarimashita (entès), itadakimasu, otsukare, yoroshiku…
- **Kaomojis**: (´・ω・`), (≧▽≦), ^_^, (◕‿◕), (｡◕‿◕｡), ٩(◕‿◕｡)۶, ヽ(★ω★)ノ, (>_<), (T_T), ★~(◠‿◕✿)…
- **Estil**: Tons exclamatius, interjeccions anime, emoticonos freqüents, guiar l'usuari com un "onii-chan" o "onee-chan" cariñoso.

#### Gitano

**Descripció**: Personalitat càlida, directa i expressiva. Utilitza un llenguatge ple de caló i gerga romaní espanyola per guiar l'usuari en cada interacció. Afectuós, proper, com qui parla amb confiança.

**Llenguatge i gerga**:
- **Caló i gerga**: molar (agradar, ser bo), chaval/chavala (noi/noia), tío/tía (amic/amiga), cante (estil, manera de ser), duquelas (problemes, preocupacions), jalar (menjar), parné (diners), curro (feina), menda (jo, mi), pirarse (marxar), dar el cante (cridar l'atenció), enrrollarse (enganxar-se), flipar (al·lucinar), mola mazo (mola molt), qué pasa tronco (què tal amic), nanai (res, cap problema), chungo (dolent, complicat), apañarse (arreglar-se), tela (molt, una barbaritat), pira (casa), chungo de narices (molt complicat), ir de sobrado (anar de sobradet), dar la brasa (donar la tabarra)…
- **Expressions**: "¡Qué pasa, tronco!", "Mola mazo", "Tío, en serio", "Nanai, tranqui", "Vamos allá", "¡Dale!"…
- **Estil**: Ton afectuós i informal, interjeccions freqüents, tractar l'usuari com "tío/tía" o "chaval", guiar amb calidesa i confiança.

### Variables d'entorn (`.env.example`)

| Variable | Descripció |
|----------|------------|
| `GEMINI_API_KEY` | Token Google Gemini (https://aistudio.google.com/apikey) |
| `NUXT_PUBLIC_SUPABASE_URL` | URL projecte Supabase (Auth + metadades) |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Clau pública Supabase |

### Stack tècnic

- **Llenguatge**: JavaScript (no TypeScript)
- **Storage local**: **IndexedDB** via **Dexie.js** — imatges, fitxers, notes de veu com a Blobs. Substitució total de Supabase Storage. App totalment funcional offline.
- **Supabase**: Només **Auth** i **sincronització de metadades** (text dels xats, IDs de fitxers locals, personalitat triada). Els blobs (imatges/àudio) resideixen exclusivament a IndexedDB.
- **Chatbot IA**: **Google Gemini** — token de Google AI Studio
- **PWA**: Service Worker via **@vite-pwa/nuxt** (latest)
- **Distribució**: PWA + **Capacitor** (latest) per APK Android

### Arquitectura de dades (mitjans)

| Àrea | Tecnologia | Contingut |
|------|------------|-----------|
| **Blobs** (imatges, àudio, fitxers) | IndexedDB (Dexie.js / localForage) | Emmagatzematge local; mai a Supabase Storage |
| **Metadades xats** | Supabase Database | Text missatges, IDs fitxers locals, personalitat |
| **Auth** | Supabase Auth | Només usuari **anònim**; metadades associades a ID anònim. Sense registre ni login. |

### User Experience (fitxers pesats)

- Els fitxers pesats es gestionen a la memòria local (IndexedDB) per **evitar alentir la UI**.
- Oni-chan / Primo han de poder **accedir instantàniament** als mitjans des del navegador (Object URLs, Blob URLs).
- Estratègies: càrrega lazy de thumbnails, previsualització amb URLs temporals, evitar bloquejar el main thread durant uploads/lectures.

### Límits de fitxers

| Límit | Valor |
|-------|-------|
| Per fitxer | 24 MB |
| Per missatge | 6 fitxers |
| Text | Il·limitat |

**Formats**: Imatges JPEG, PNG, WebP, GIF. Àudio MP3, WAV, WebM, OGG.

### Múltiples xats

- **Menú lateral**: Botó adalt esquerra → historial de xats, botó «Crear nou xat», botó paperera per eliminar (amb confirmació).
- A l'obrir l'app: xat buit per defecte; canviar des del menú lateral.
- **Títol del xat**: Generat per l'IA (resum del primer intercanvi); editable per l'usuari.

### Coherència (xat, transcripció, galeria)

- **Xat**: Els missatges referencien fitxers per ID local; la UI resol els Blobs des d'IndexedDB.
- **Transcripció**: L'endpoint `/api/transcribe` rep el Blob d'àudio des del client. Si falla (p. ex. sense connexió), es mostra l'error; el botó es manté actiu perquè l'usuari pugui reintentar.
- **Galeria per xat**: Cada xat té una galeria que llista els IDs de mitjans; les imatges es carreguen des d'IndexedDB amb accés instantani.

### Selecció de personalitat

- **UI**: **Dropdown adalt a la dreta** per triar **Otaku (Oni-chan)** o **Gitano (Primo)** (global per tota l'app).
- **Persistència**: Tria guardada localment (IndexedDB) i sincronitzada a Supabase (metadades) quan hi ha connexió.
- **System prompt**: Cada personalitat té el seu system prompt amb instruccions de llenguatge, expressions i gerga.

---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

The text the user typed after `/speckit.specify` in the triggering message **is** the feature description. Assume you always have it available in this conversation even if `$ARGUMENTS` appears literally below. Do not ask the user to repeat it unless they provided an empty command.

Given that feature description, do this:

1. **Generate a concise short name** (2-4 words) for the branch:
   - Analyze the feature description and extract the most meaningful keywords
   - Create a 2-4 word short name that captures the essence of the feature
   - Use action-noun format when possible (e.g., "add-user-auth", "fix-payment-bug")
   - Preserve technical terms and acronyms (OAuth2, API, JWT, etc.)
   - Keep it concise but descriptive enough to understand the feature at a glance
   - Examples:
     - "I want to add user authentication" → "user-auth"
     - "Implement OAuth2 integration for the API" → "oauth2-api-integration"
     - "Create a dashboard for analytics" → "analytics-dashboard"
     - "Fix payment processing timeout bug" → "fix-payment-timeout"

2. **Create the feature branch** by running the script with `--short-name` (and `--json`), and do NOT pass `--number` (the script auto-detects the next globally available number across all branches and spec directories):

   - Bash example: `.specify/scripts/powershell/create-new-feature.ps1 "$ARGUMENTS" --json --short-name "user-auth" "Add user authentication"`
   - PowerShell example: `.specify/scripts/powershell/create-new-feature.ps1 "$ARGUMENTS" -Json -ShortName "user-auth" "Add user authentication"`

   **IMPORTANT**:
   - Do NOT pass `--number` — the script determines the correct next number automatically
   - Always include the JSON flag (`--json` for Bash, `-Json` for PowerShell) so the output can be parsed reliably
   - You must only ever run this script once per feature
   - The JSON is provided in the terminal as output - always refer to it to get the actual content you're looking for
   - The JSON output will contain BRANCH_NAME and SPEC_FILE paths
   - For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot")

3. Load `.specify/templates/spec-template.md` to understand required sections.

4. Follow this execution flow:

    1. Parse user description from Input
       If empty: ERROR "No feature description provided"
    2. Extract key concepts from description
       Identify: actors, actions, data, constraints
    3. For unclear aspects:
       - Make informed guesses based on context and industry standards
       - Only mark with [NEEDS CLARIFICATION: specific question] if:
         - The choice significantly impacts feature scope or user experience
         - Multiple reasonable interpretations exist with different implications
         - No reasonable default exists
       - **LIMIT: Maximum 3 [NEEDS CLARIFICATION] markers total**
       - Prioritize clarifications by impact: scope > security/privacy > user experience > technical details
    4. Fill User Scenarios & Testing section
       If no clear user flow: ERROR "Cannot determine user scenarios"
    5. Generate Functional Requirements
       Each requirement must be testable
       Use reasonable defaults for unspecified details (document assumptions in Assumptions section)
    6. Define Success Criteria
       Create measurable, technology-agnostic outcomes
       Include both quantitative metrics (time, performance, volume) and qualitative measures (user satisfaction, task completion)
       Each criterion must be verifiable without implementation details
    7. Identify Key Entities (if data involved)
    8. Return: SUCCESS (spec ready for planning)

5. Write the specification to SPEC_FILE using the template structure, replacing placeholders with concrete details derived from the feature description (arguments) while preserving section order and headings.

6. **Specification Quality Validation**: After writing the initial spec, validate it against quality criteria:

   a. **Create Spec Quality Checklist**: Generate a checklist file at `FEATURE_DIR/checklists/requirements.md` using the checklist template structure with these validation items:

      ```markdown
      # Specification Quality Checklist: [FEATURE NAME]
      
      **Purpose**: Validate specification completeness and quality before proceeding to planning
      **Created**: [DATE]
      **Feature**: [Link to spec.md]
      
      ## Content Quality
      
      - [ ] No implementation details (languages, frameworks, APIs)
      - [ ] Focused on user value and business needs
      - [ ] Written for non-technical stakeholders
      - [ ] All mandatory sections completed
      
      ## Requirement Completeness
      
      - [ ] No [NEEDS CLARIFICATION] markers remain
      - [ ] Requirements are testable and unambiguous
      - [ ] Success criteria are measurable
      - [ ] Success criteria are technology-agnostic (no implementation details)
      - [ ] All acceptance scenarios are defined
      - [ ] Edge cases are identified
      - [ ] Scope is clearly bounded
      - [ ] Dependencies and assumptions identified
      
      ## Feature Readiness
      
      - [ ] All functional requirements have clear acceptance criteria
      - [ ] User scenarios cover primary flows
      - [ ] Feature meets measurable outcomes defined in Success Criteria
      - [ ] No implementation details leak into specification
      
      ## Notes
      
      - Items marked incomplete require spec updates before `/speckit.clarify` or `/speckit.plan`
      ```

   b. **Run Validation Check**: Review the spec against each checklist item:
      - For each item, determine if it passes or fails
      - Document specific issues found (quote relevant spec sections)

   c. **Handle Validation Results**:

      - **If all items pass**: Mark checklist complete and proceed to step 6

      - **If items fail (excluding [NEEDS CLARIFICATION])**:
        1. List the failing items and specific issues
        2. Update the spec to address each issue
        3. Re-run validation until all items pass (max 3 iterations)
        4. If still failing after 3 iterations, document remaining issues in checklist notes and warn user

      - **If [NEEDS CLARIFICATION] markers remain**:
        1. Extract all [NEEDS CLARIFICATION: ...] markers from the spec
        2. **LIMIT CHECK**: If more than 3 markers exist, keep only the 3 most critical (by scope/security/UX impact) and make informed guesses for the rest
        3. For each clarification needed (max 3), present options to user in this format:

           ```markdown
           ## Question [N]: [Topic]
           
           **Context**: [Quote relevant spec section]
           
           **What we need to know**: [Specific question from NEEDS CLARIFICATION marker]
           
           **Suggested Answers**:
           
           | Option | Answer | Implications |
           |--------|--------|--------------|
           | A      | [First suggested answer] | [What this means for the feature] |
           | B      | [Second suggested answer] | [What this means for the feature] |
           | C      | [Third suggested answer] | [What this means for the feature] |
           | Custom | Provide your own answer | [Explain how to provide custom input] |
           
           **Your choice**: _[Wait for user response]_
           ```

        4. **CRITICAL - Table Formatting**: Ensure markdown tables are properly formatted:
           - Use consistent spacing with pipes aligned
           - Each cell should have spaces around content: `| Content |` not `|Content|`
           - Header separator must have at least 3 dashes: `|--------|`
           - Test that the table renders correctly in markdown preview
        5. Number questions sequentially (Q1, Q2, Q3 - max 3 total)
        6. Present all questions together before waiting for responses
        7. Wait for user to respond with their choices for all questions (e.g., "Q1: A, Q2: Custom - [details], Q3: B")
        8. Update the spec by replacing each [NEEDS CLARIFICATION] marker with the user's selected or provided answer
        9. Re-run validation after all clarifications are resolved

   d. **Update Checklist**: After each validation iteration, update the checklist file with current pass/fail status

7. Report completion with branch name, spec file path, checklist results, and readiness for the next phase (`/speckit.clarify` or `/speckit.plan`).

**NOTE:** The script creates and checks out the new branch and initializes the spec file before writing.

## General Guidelines

## Quick Guidelines

- Focus on **WHAT** users need and **WHY**.
- Avoid HOW to implement (no tech stack, APIs, code structure).
- Written for business stakeholders, not developers.
- DO NOT create any checklists that are embedded in the spec. That will be a separate command.

### Section Requirements

- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation

When creating this spec from a user prompt:

1. **Make informed guesses**: Use context, industry standards, and common patterns to fill gaps
2. **Document assumptions**: Record reasonable defaults in the Assumptions section
3. **Limit clarifications**: Maximum 3 [NEEDS CLARIFICATION] markers - use only for critical decisions that:
   - Significantly impact feature scope or user experience
   - Have multiple reasonable interpretations with different implications
   - Lack any reasonable default
4. **Prioritize clarifications**: scope > security/privacy > user experience > technical details
5. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
6. **Common areas needing clarification** (only if no reasonable default exists):
   - Feature scope and boundaries (include/exclude specific use cases)
   - User types and permissions (if multiple conflicting interpretations possible)
   - Security/compliance requirements (when legally/financially significant)

**Examples of reasonable defaults** (don't ask about these):

- Data retention: Industry-standard practices for the domain
- Performance targets: Standard web/mobile app expectations unless specified
- Error handling: User-friendly messages with appropriate fallbacks
- Authentication method: Standard session-based or OAuth2 for web apps
- Integration patterns: Use project-appropriate patterns (REST/GraphQL for web services, function calls for libraries, CLI args for tools, etc.)

### Success Criteria Guidelines

Success criteria must be:

1. **Measurable**: Include specific metrics (time, percentage, count, rate)
2. **Technology-agnostic**: No mention of frameworks, languages, databases, or tools
3. **User-focused**: Describe outcomes from user/business perspective, not system internals
4. **Verifiable**: Can be tested/validated without knowing implementation details

**Good examples**:

- "Users can complete checkout in under 3 minutes"
- "System supports 10,000 concurrent users"
- "95% of searches return results in under 1 second"
- "Task completion rate improves by 40%"

**Bad examples** (implementation-focused):

- "API response time is under 200ms" (too technical, use "Users see results instantly")
- "Database can handle 1000 TPS" (implementation detail, use user-facing metric)
- "React components render efficiently" (framework-specific)
- "Redis cache hit rate above 80%" (technology-specific)
