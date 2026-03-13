---
description: Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync.
handoffs: 
  - label: Build Specification
    agent: speckit.specify
    prompt: Implement the feature specification based on the updated constitution. I want to build...
---

## Default Principles (Quality-Focused)

Quan l'usuari demani principis centrats en qualitat, testing, UX o rendiment, utilitza aquestes definicions com a base per a `[PRINCIPLE_1_NAME]` fins a `[PRINCIPLE_4_NAME]` (i ajusta la numeració si n'hi ha més).

### I. Qualitat del Codi (Code Quality)

- El codi ha de ser llegible, mantenible i seguir convencions del projecte.
- MUST: Ús d’ESLint/Prettier (o equivalents) amb configuració compartida.
- MUST: Components i funcions han de tenir una responsabilitat clara (Single Responsibility).
- MUST: Noms descriptius per a variables, funcions i components; evitar abreviacions ambiguves.
- MUST: Documentació JSDoc/TSDoc per a APIs públiques i composables complexos.
- Duplicació de codi: refactoritzar abans de superar 3 repeticions del mateix patró.
- **Estil**: Vue Composition API (`<script setup>`), PascalCase components, prefix `use` en composables. **JavaScript** (no TypeScript). Detalls a `speckit.implement.md` → Project Coding Standards.
- **Metodologia**: Mai operadors ternaris; mai `.map`/`.filter`/`.reduce`; usar bucles `for`/`while`. Tots els llenguatges.
- **Comentaris**: Blocs IMPORTS / VARIABLES / FUNCIONS / EXPORTS; funcions amb descripció i desglossament A, B, C...

### II. Estàndards de Testing

- TDD recomanat per a lògica de negoci crítica; com a mínim, tests escrits abans del merge.
- MUST: Cada feature nova o modificació important ha de tenir tests unitaris associats.
- MUST: Coverage mínim del 80% per a composables, utils i serveis (excloses UIs visuals).
- Integració: tests E2E per a fluxos crítics (login, checkout, etc.).
- Tests han de ser deterministes, ràpids i aïllats (sense side effects compartits).

### III. Consistència de l’Experiència d’Usuari (UX Consistency)

- MUST: Ús del sistema de disseny definit al projecte (tokens, components, icones).
- MUST: Comportament coherent entre pantalles similars (formularis, llistats, accions).
- Feedback visual obligatori per a accions asíncrones (loading, success, error).
- Accesibilitat: suport bàsic de teclat, ARIA on calgui i contrast mínim WCAG 2.1 AA.
- Responsive: disseny funcional en mòbil, tauleta i escriptori.

### IV. Requisits de Rendiment

- MUST: LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals).
- Imatges: formats moderns (WebP/AVIF), lazy loading i dimensions adequades.
- API: paginació o infinite scroll per llistats grans; evitar càrregues massives.
- PWA: Service Worker configurat; mode offline bàsic per a recursos crítics.
- Bundle: code splitting per rutes; evitar dependències pesades sense justificació.

---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are updating the project constitution at `.specify/memory/constitution.md`. This file is a TEMPLATE containing placeholder tokens in square brackets (e.g. `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`). Your job is to (a) collect/derive concrete values, (b) fill the template precisely, and (c) propagate any amendments across dependent artifacts.

**Note**: If `.specify/memory/constitution.md` does not exist yet, it should have been initialized from `.specify/templates/constitution-template.md` during project setup. If it's missing, copy the template first.

Follow this execution flow:

1. Load the existing constitution at `.specify/memory/constitution.md`.
   - Identify every placeholder token of the form `[ALL_CAPS_IDENTIFIER]`.
   **IMPORTANT**: The user might require less or more principles than the ones used in the template. If a number is specified, respect that - follow the general template. You will update the doc accordingly.

2. Collect/derive values for placeholders:
   - If user input (conversation) supplies a value, use it.
   - If user requests principles for **code quality, testing standards, UX consistency, or performance**, use the definitions from the "Default Principles (Quality-Focused)" section above.
   - Otherwise infer from existing repo context (README, docs, prior constitution versions if embedded).
   - For governance dates: `RATIFICATION_DATE` is the original adoption date (if unknown ask or mark TODO), `LAST_AMENDED_DATE` is today if changes are made, otherwise keep previous.
   - `CONSTITUTION_VERSION` must increment according to semantic versioning rules:
     - MAJOR: Backward incompatible governance/principle removals or redefinitions.
     - MINOR: New principle/section added or materially expanded guidance.
     - PATCH: Clarifications, wording, typo fixes, non-semantic refinements.
   - If version bump type ambiguous, propose reasoning before finalizing.

3. Draft the updated constitution content:
   - Replace every placeholder with concrete text (no bracketed tokens left except intentionally retained template slots that the project has chosen not to define yet—explicitly justify any left).
   - Preserve heading hierarchy and comments can be removed once replaced unless they still add clarifying guidance.
   - Ensure each Principle section: succinct name line, paragraph (or bullet list) capturing non‑negotiable rules, explicit rationale if not obvious.
   - Ensure Governance section lists amendment procedure, versioning policy, and compliance review expectations.

4. Consistency propagation checklist (convert prior checklist into active validations):
   - Read `.specify/templates/plan-template.md` and ensure any "Constitution Check" or rules align with updated principles.
   - Read `.specify/templates/spec-template.md` for scope/requirements alignment—update if constitution adds/removes mandatory sections or constraints.
   - Read `.specify/templates/tasks-template.md` and ensure task categorization reflects new or removed principle-driven task types (e.g., observability, versioning, testing discipline).
   - Read each command file in `.specify/templates/commands/*.md` (including this one) to verify no outdated references (agent-specific names like CLAUDE only) remain when generic guidance is required.
   - Read any runtime guidance docs (e.g., `README.md`, `docs/quickstart.md`, or agent-specific guidance files if present). Update references to principles changed.

5. Produce a Sync Impact Report (prepend as an HTML comment at top of the constitution file after update):
   - Version change: old → new
   - List of modified principles (old title → new title if renamed)
   - Added sections
   - Removed sections
   - Templates requiring updates (✅ updated / ⚠ pending) with file paths
   - Follow-up TODOs if any placeholders intentionally deferred.

6. Validation before final output:
   - No remaining unexplained bracket tokens.
   - Version line matches report.
   - Dates ISO format YYYY-MM-DD.
   - Principles are declarative, testable, and free of vague language ("should" → replace with MUST/SHOULD rationale where appropriate).

7. Write the completed constitution back to `.specify/memory/constitution.md` (overwrite).

8. Output a final summary to the user with:
   - New version and bump rationale.
   - Any files flagged for manual follow-up.
   - Suggested commit message (e.g., `docs: amend constitution to vX.Y.Z (principle additions + governance update)`).

Formatting & Style Requirements:

- Use Markdown headings exactly as in the template (do not demote/promote levels).
- Wrap long rationale lines to keep readability (<100 chars ideally) but do not hard enforce with awkward breaks.
- Keep a single blank line between sections.
- Avoid trailing whitespace.

If the user supplies partial updates (e.g., only one principle revision), still perform validation and version decision steps.

If critical info missing (e.g., ratification date truly unknown), insert `TODO(<FIELD_NAME>): explanation` and include in the Sync Impact Report under deferred items.

Do not create a new template; always operate on the existing `.specify/memory/constitution.md` file.
