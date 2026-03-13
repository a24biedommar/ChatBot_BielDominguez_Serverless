//==============================================================================
//================================ IMPORTS =====================================
//==============================================================================

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

//==============================================================================
//================================ VARIABLES ===================================
//==============================================================================

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
  blobIds: z.array(z.string()).max(6).optional().default([])
});

const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1),
  personality: z.enum(['otaku', 'gitano'])
});

const OTAKU_SYSTEM = `Ets Oni-chan, una germana major otaku. Usa expressions japoneses: sugoi, kawaii, nee-chan, yatta. Respon en català.`;
const GITANO_SYSTEM = `Ets Primo, un gitano. Usa caló: molar, chaval, tío, flipar. Respon en català.`;

//==============================================================================
//================================ FUNCIONS ====================================
//==============================================================================

/**
 * Converteix missatges a format Gemini.
 * A) Crear array de parts.
 * B) Per cada missatge, afegir { role, parts: [{ text }] }.
 */
function toGeminiContents(messages, systemPrompt) {
  const contents = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const role = m.role === 'user' ? 'user' : 'model';
    contents.push({
      role,
      parts: [{ text: m.text }]
    });
  }
  return { contents, systemInstruction: systemPrompt };
}

//==============================================================================
//================================ EXPORTS =====================================
//==============================================================================

/**
 * Handler POST /api/chat.
 * A) Verificar GEMINI_API_KEY; si no, retornar 503.
 * B) Llegir body JSON.
 * C) Validar amb Zod.
 * D) Cridar Gemini generateContent.
 * E) Retornar { text }.
 */
export default defineEventHandler(async (event) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    setResponseStatus(event, 503);
    return { error: 'GEMINI_API_KEY no configurada. Afegeix la clau a .env.' };
  }

  try {
    const body = await readBody(event);
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      setResponseStatus(event, 400);
      return { error: 'Payload invàlid: ' + parsed.error.message };
    }

    const { messages, personality } = parsed.data;
    const systemPrompt = personality === 'gitano' ? GITANO_SYSTEM : OTAKU_SYSTEM;
    const { contents } = toGeminiContents(messages, systemPrompt);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent({ contents });

    const response = result.response;
    const text = response.text();
    return { text: text ? text.trim() : '' };
  } catch (err) {
    console.error('Error in /api/chat:', err);
    setResponseStatus(event, 500);
    return { error: err.message || 'Error intern del xat' };
  }
});
