//==============================================================================
//================================ IMPORTS =====================================
//==============================================================================

import { z } from 'zod';

//==============================================================================
//================================ VARIABLES ===================================
//==============================================================================

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
  blobIds: z.array(z.string()).max(6).optional().default([])
});

const chatPayloadSchema = z.object({
  messages: z.array(messageSchema).min(1),
  personality: z.enum(['otaku', 'gitano'])
});

//==============================================================================
//================================ FUNCIONS ====================================
//==============================================================================

/**
 * Valida el payload de xat del client.
 * A) Executar chatPayloadSchema.safeParse.
 * B) Retornar { success, data, error }.
 */
export function validateChatPayload(obj) {
  const result = chatPayloadSchema.safeParse(obj);
  return {
    success: result.success,
    data: result.success ? result.data : null,
    error: result.success ? null : result.error.message
  };
}

//==============================================================================
//================================ EXPORTS =====================================
//==============================================================================

export { messageSchema, chatPayloadSchema };
