# PWA — @vite-pwa/nuxt — Especificació

**Mòdul**: `@vite-pwa/nuxt` (latest)

## Funcionalitat

- **Service Worker**: Per mode offline i instal·lació.
- **Manifest**: App instal·lable com a PWA.
- **Notificacions**: Notification API quan s'implementi.

## Objectiu

- App totalment funcional offline per llegir historial i visualitzar galeries.
- Transcripció i chat requereixen connexió (Gemini); en cas d'error, mostrar missatge i botó per reintentar.

## Regles

- Configurar `@vite-pwa/nuxt` a `frontend/nuxt.config.js`.
- Verificar que el Service Worker cachea recursos crítics.
- Manifest amb nom, icones, colors del tema.

## Convencions aplicades

- Seguir `conventions.md` per tot el codi del projecte.
