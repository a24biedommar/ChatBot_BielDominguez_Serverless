# Tailwind CSS — Especificació

**Versió**: Tailwind v4 amb `@tailwindcss/vite`.
**Ubicació**: `frontend/` — Integrat amb Nuxt.

## Regles

- **Config**: Integrar a `frontend/nuxt.config.js` via `vite.plugins`.
- **Mòbil-first**: Disseny optimitzat per mòbils; responsive per tauleta i escriptori.
- **Icones**: Lucide Vue (`lucide-vue-next`).

## Rendiment

- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1.
- Imatges: formats moderns (WebP/AVIF), lazy loading.
- Evitar bloquejar el main thread durant càrregues de fitxers.

## Convencions aplicades

- Seguir `conventions.md` per tot el codi JavaScript/Vue associat.
