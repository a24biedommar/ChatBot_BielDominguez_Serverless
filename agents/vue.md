# Vue 3 — Especificació

**Versió**: Vue 3 amb Composition API.

## Regles

- **Composition API**: `<script setup>` sense `lang="ts"`. No Options API.
- **Components**: PascalCase. Exemple: `ChatMessageList.vue`, `ChatInput.vue`.
- **Composables**: Prefix `use`. Exemple: `usePersonality.js`, `useIndexedDB.js`. Un composable per fitxer.
- **Props**: Definir amb `defineProps()` (sense genèrics TypeScript).
- **Emits**: Definir amb `defineEmits()`.

## Estructura de components

```vue
<template>
  <!-- ... -->
</template>

<script setup>
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
</script>
```

## Carpeta per domini

- Components dins de carpetes per domini. Exemple: `components/chat/ChatMessageList.vue`.
- Layout base: `layouts/default.vue` amb viewport mòbil.

## Convencions aplicades

- Seguir `conventions.md`: bucles imperatius, sense ternaris, sense .map/.filter/.reduce.
- Blocs IMPORTS / VARIABLES / FUNCIONS / EXPORTS dins de `<script setup>`.
- JSDoc amb desglossament A, B, C a totes les funcions.
