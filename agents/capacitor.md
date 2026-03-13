# Capacitor — APK Android — Especificació

**Llibreries**: `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`.

## Config

- `capacitor.config.js` a `frontend/` (arrel del projecte Nuxt).
- Carpeta `android/` generada per `npx cap add android`.

## Build

1. `nuxt build`
2. `npx cap sync`
3. Obrir `android/` amb Android Studio i generar APK.

## Regles

- Configurar correctament `webDir` (ex: `dist` o `.output/public` segons build de Nuxt).
- Permisos Android necessaris per a micròfon (notes de veu), càmera/galeria si s'usa.

## Convencions aplicades

- Seguir `conventions.md` per tot el codi JavaScript del projecte.
