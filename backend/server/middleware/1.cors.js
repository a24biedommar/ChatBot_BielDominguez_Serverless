/**
 * Middleware CORS per Nitro.
 * Respon a les peticions preflight OPTIONS que el navegador envia abans
 * de fer POST cross-origin. Sense això, el preflight rep 404/405 i CORS falla.
 *
 * @see https://github.com/unjs/nitro/issues/2340
 */
export default defineEventHandler((event) => {
  if (event.method === 'OPTIONS') {
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    setResponseStatus(event, 204);
    return null;
  }
});
