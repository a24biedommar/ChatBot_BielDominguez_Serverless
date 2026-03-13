//==============================================================================
//================================ IMPORTS =====================================
//==============================================================================

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import formidable from 'formidable';
import { readFileSync } from 'node:fs';
import { unlinkSync } from 'node:fs';

//==============================================================================
//================================ VARIABLES ===================================
//==============================================================================

const TRANSCRIBE_PROMPT_OTAKU = `Transcriu aquest àudio de nota de veu. Mantén el to i les expressions. El context és una app de xat amb personalitat Otaku (Oni-chan).`;
const TRANSCRIBE_PROMPT_GITANO = `Transcriu aquest àudio de nota de veu. Mantén el to i les expressions. El context és una app de xat amb personalitat Gitano (Primo).`;

const responseSchema = z.object({
  text: z.string().min(1),
  duration: z.number().min(0).optional()
});

const AUDIO_MIME_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/x-wav', 'audio/wave'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB (marge sobre 24 MB)

//==============================================================================
//================================ FUNCIONS ====================================
//==============================================================================

/**
 * Parsea el FormData multipart i extreu audio i personality.
 * A) Crear parser formidable.
 * B) Parsear el request.
 * C) Retornar { audioPath, mimeType, personality }.
 */
async function parseFormData(event) {
  const req = event.node.req;
  const form = formidable({
    maxFileSize: MAX_FILE_SIZE,
    allowEmptyFiles: false
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      const audioFile = files.audio;
      let audioPath = null;
      let mimeType = 'audio/mpeg';
      if (audioFile && audioFile.length > 0) {
        audioPath = audioFile[0].filepath;
        mimeType = audioFile[0].mimetype || 'audio/mpeg';
      } else if (audioFile && !Array.isArray(audioFile)) {
        audioPath = audioFile.filepath;
        mimeType = audioFile.mimetype || 'audio/mpeg';
      }
      let personality = 'otaku';
      if (fields.personality && (Array.isArray(fields.personality) ? fields.personality[0] : fields.personality)) {
        const p = Array.isArray(fields.personality) ? fields.personality[0] : fields.personality;
        if (p === 'gitano') {
          personality = 'gitano';
        }
      }
      resolve({ audioPath, mimeType, personality });
    });
  });
}

/**
 * Transcribe l'àudio amb Gemini.
 * A) Verificar que hi ha API key.
 * B) Llegir fitxer i convertir a base64.
 * C) Cridar Gemini generateContent amb inlineData.
 * D) Retornar text i duration.
 */
async function transcribeWithGemini(audioPath, mimeType, personality) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const fileBuffer = readFileSync(audioPath);
  const base64Data = fileBuffer.toString('base64');

  const prompt = personality === 'gitano' ? TRANSCRIBE_PROMPT_GITANO : TRANSCRIBE_PROMPT_OTAKU;

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: mimeType || 'audio/mpeg',
        data: base64Data
      }
    },
    { text: prompt }
  ]);

  const response = result.response;
  const text = response.text();
  return text ? text.trim() : '';
}

//==============================================================================
//================================ EXPORTS =====================================
//==============================================================================

/**
 * Handler POST /api/transcribe.
 * A) Verificar que GEMINI_API_KEY existeix; si no, retornar 503.
 * B) Parsear FormData (audio, personality).
 * C) Cridar Gemini per transcriure.
 * D) Validar resposta amb Zod.
 * E) Retornar { text, duration }.
 */
export default defineEventHandler(async (event) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    setResponseStatus(event, 503);
    return { error: 'GEMINI_API_KEY no configurada. Afegeix la clau a .env per habilitar la transcripció.' };
  }

  try {
    const { audioPath, mimeType, personality } = await parseFormData(event);
    if (!audioPath) {
      setResponseStatus(event, 400);
      return { error: 'Falta el camp audio (Blob/File)' };
    }

    const startTime = Date.now();
    const text = await transcribeWithGemini(audioPath, mimeType, personality);

    try {
      unlinkSync(audioPath);
    } catch (_) {
      // Ignorar errors al eliminar fitxer temporal
    }

    const duration = (Date.now() - startTime) / 1000;
    const validated = responseSchema.safeParse({ text: text || '(Sense text)', duration });

    if (!validated.success) {
      setResponseStatus(event, 500);
      return { error: 'Error validant la resposta de transcripció' };
    }

    return validated.data;
  } catch (err) {
    setResponseStatus(event, 500);
    return { error: err.message || 'Error intern en la transcripció' };
  }
});
