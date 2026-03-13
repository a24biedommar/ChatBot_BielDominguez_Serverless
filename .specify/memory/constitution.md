<!--
Sync Impact Report:
- Version: 1.0.0 → 1.1.0
- Modified principles: Additional Constraints (arquitectura Storage local + Supabase)
- Added sections: Storage local, Arquitectura de dades (IndexedDB blobs, Supabase Auth + metadades)
- Removed sections: N/A
- Templates: ✅ plan, spec, tasks, implement aligned
- Follow-up TODOs: None
-->

# RA2-IA Constitution

## Core Principles

### I. Qualitat del Codi (Code Quality)

- El codi ha de ser llegible, mantenible i seguir convencions del projecte.
- **MUST**: Ús d'ESLint/Prettier (o equivalents) amb configuració compartida.
- **MUST**: Components i funcions han de tenir una responsabilitat clara (Single Responsibility).
- **MUST**: Noms descriptius per a variables, funcions i components; evitar abreviacions ambiguves.
- **MUST**: Documentació JSDoc/TSDoc per a APIs públiques i composables complexos.
- Duplicació de codi: refactoritzar abans de superar 3 repeticions del mateix patró.
- **Estil**: Vue Composition API (`<script setup>`), PascalCase components, prefix `use` composables. **JavaScript** (no TypeScript). Detalls a speckit.implement.md.
- **Metodologia**: Mai operadors ternaris; mai `.map`/`.filter`/`.reduce`; usar bucles imperatius. Aplica a tots els llenguatges.
- **Comentaris**: Blocs IMPORTS / VARIABLES / FUNCIONS / EXPORTS; funcions amb descripció i desglossament pas a pas (A, B, C...).

### II. Estàndards de Testing

- TDD recomanat per a lògica de negoci crítica; com a mínim, tests escrits abans del merge.
- **MUST**: Cada feature nova o modificació important ha de tenir tests unitaris associats.
- **MUST**: Coverage mínim del 80% per a composables, utils i serveis (excloses UIs visuals).
- Integració: tests E2E per a fluxos crítics (login, checkout, etc.).
- Tests han de ser deterministes, ràpids i aïllats (sense side effects compartits).

### III. Consistència de l'Experiència d'Usuari (UX Consistency)

- **MUST**: Ús del sistema de disseny definit al projecte (tokens, components, icones).
- **MUST**: Comportament coherent entre pantalles similars (formularis, llistats, accions).
- Feedback visual obligatori per a accions asíncrones (loading, success, error).
- Accesibilitat: suport bàsic de teclat, ARIA on calgui i contrast mínim WCAG 2.1 AA.
- Responsive: disseny funcional en mòbil, tauleta i escriptori.

### IV. Requisits de Rendiment

- **MUST**: LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals).
- Imatges: formats moderns (WebP/AVIF), lazy loading i dimensions adequades.
- API: paginació o infinite scroll per llistats grans; evitar càrregues massives.
- PWA: Service Worker configurat; mode offline bàsic per a recursos crítics.
- Bundle: code splitting per rutes; evitar dependències pesades sense justificació.

## Additional Constraints

- **Stack**: Nuxt 4.3.1, **JavaScript** (no TypeScript), **IndexedDB** (Dexie.js o localForage), **Supabase** (Auth + metadades), **Capacitor** (APK), Tailwind, Gemini.
- **Storage local**: IndexedDB per a blobs (imatges, àudio, fitxers). Substitució total de Supabase Storage. App totalment funcional offline.
- **Arquitectura de dades**: Supabase només per Auth i sincronització de metadades (text xats, IDs fitxers locals, personalitat). Els blobs resideixen exclusivament a IndexedDB.
- **IA**: Google Gemini (`@google/generative-ai`); variable `GEMINI_API_KEY`. Token a https://aistudio.google.com/apikey
- **Auth**: Només usuari **anònim** (Supabase). Sense registre ni login.
- **Personalitats**: Selector Otaku (Oni-chan) o Gitano (Primo). Preferència a IndexedDB i sincronitzada a Supabase quan online.
- **Límits**: 24 MB per fitxer, 6 fitxers per missatge; text il·limitat.
- **Seguretat**: Credencials i secrets mai al codi; ús exclusiu de variables d'entorn.
- **Validació**: Zod per a totes les dades d'entrada (formularis, API).

## Development Workflow

- Code review obligatori abans de merge; revisió de compliment amb aquesta constitució.
- Totes les PRs han de passar els tests i el linter.
- Especificació (specs) completada abans de començar la implementació (SDD).

## Governance

La constitució té prioritat sobre pràctiques ad hoc. Les modificacions requereixen documentació i aprovació. Tots els PRs han de verificar el compliment amb aquests principis.

**Version**: 1.1.0 | **Ratified**: 2025-03-10 | **Last Amended**: 2025-03-10
