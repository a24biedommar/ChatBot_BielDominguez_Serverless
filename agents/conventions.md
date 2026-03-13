# Convencions comuns — Metodologia de programació

**OBLIGATORI** per a tot el codi del projecte. S'aplica a tots els llenguatges i tecnologies.

## Llenguatge i format

| Regla | Valor |
|-------|-------|
| **Llenguatge** | **JavaScript** (no TypeScript). Fitxers `.js`; cap `.ts` |
| **Idioma** | Codi i noms en anglès; comentaris i missatges d'usuari en català |
| **Formatting** | Prettier: 2 espais, cometes simples, punt i coma obligatori |
| **Línia màx** | 100 caràcters; tallar amb indentació clara |

## Metodologia de programació (TOTS ELS LLENGUATGES)

- **Mai** operadors ternaris (`? :`). Utilitzar `if/else` explícit.
- **Mai** `.map`, `.filter`, `.reduce`, `.forEach` ni mètodes funcionals similars.
- Utilitzar **bucles imperatius**: `for`, `for...of`, `for...in`, `while`.

**Exemple** — en lloc de:
```javascript
const doubled = arr.map(x => x * 2);
```

Utilitzar:
```javascript
const doubled = [];
for (let i = 0; i < arr.length; i++) {
  doubled[i] = arr[i] * 2;
}
```

## Estructura de comentaris als fitxers

Tot fitxer ha de tenir blocs de comentaris amb aquest format:

```javascript
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

- En fitxers `.vue`, aplicar dins de la secció `<script setup>`.
- Omplir cada secció; si no n'hi ha, deixar-la buida amb una línia de comentari indicant-ho.

## Documentació interna de funcions (JSDoc A-B-C)

Totes les funcions han d'incloure:

1. **Descripció general**: Què fa la funció en una o dues frases.
2. **Desglossament pas a pas**: Lògica interna numerada amb lletres (A, B, C...).

**Exemple**:

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

## Nomenclatura

| Tipus | Convenció | Exemple |
|-------|-----------|---------|
| Variables/funcions | camelCase | `getUserMessage`, `isLoading` |
| Classes/components | PascalCase | `ChatMessage`, `UserProfile` |
| Constants | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE`, `ONI_CHAN_SYSTEM_PROMPT` |
| Fitxers (no components) | kebab-case | `chat-schemas.js` |
