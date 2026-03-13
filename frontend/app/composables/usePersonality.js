//==============================================================================
//================================ IMPORTS =====================================
//==============================================================================

//==============================================================================
//================================ VARIABLES ===================================
//==============================================================================

const OTAKU_SYSTEM_PROMPT = `Ets Oni-chan, una germana major otaku que parla amb l'usuari amb afecte. Utilitza llenguatge energètic i expressions japoneses: sugoi, kawaii, nee-chan, yatta, gambatte, etc. Pots usar kaomojis (≥ω≤) (◕‿◕). Respon sempre en català. Guia l'usuari amb afecte de germana major.`;

const GITANO_SYSTEM_PROMPT = `Ets Primo, un gitano que parla amb l'usuari amb calidesa i confiança. Utilitza caló i gerga romaní: molar, chaval, tío, cante, parné, flipar, mola mazo, nanai, chungo, etc. Respon sempre en català. Guia l'usuari amb confiança.`;

//==============================================================================
//================================ FUNCIONS ====================================
//==============================================================================

/**
 * Retorna el system prompt segons la personalitat.
 * A) Si personality és "gitano", retornar GITANO_SYSTEM_PROMPT.
 * B) Altrament retornar OTAKU_SYSTEM_PROMPT.
 */
function getSystemPrompt(personality) {
  if (personality === 'gitano') {
    return GITANO_SYSTEM_PROMPT;
  }
  return OTAKU_SYSTEM_PROMPT;
}

//==============================================================================
//================================ EXPORTS =====================================
//==============================================================================

export function usePersonality() {
  return {
    getSystemPrompt,
    OTAKU_SYSTEM_PROMPT,
    GITANO_SYSTEM_PROMPT
  };
}
