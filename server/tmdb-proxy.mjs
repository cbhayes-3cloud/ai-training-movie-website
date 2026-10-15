// Server-side proxy for the TMDB API. The browser calls /api/tmdb/<path>; this
// adds the credentials, so the access token never reaches the client bundle.
// Used by the Vite dev server (vite.config.ts) and the production server (server/index.mjs).

const TMDB_BASE = 'https://api.themoviedb.org/3';
const CACHE_TTL_MS = 10 * 60 * 1000; // TMDB terms allow up to 6 months; 10 minutes keeps lists fresh
const CACHE_MAX_ENTRIES = 500;
const TIMEOUT_MS = 10_000;

// Only the read endpoints the app uses. Anything else is rejected.
const ALLOWED_PATHS = [
  /^\/trending\/movie\/(day|week)$/,
  /^\/movie\/(top_rated|upcoming|now_playing|popular)$/,
  /^\/movie\/\d+$/,
  /^\/movie\/\d+\/(release_dates|videos|images|credits|recommendations|similar)$/,
  /^\/discover\/movie$/,
  /^\/genre\/movie\/list$/,
  /^\/search\/movie$/,
  /^\/configuration$/,
];

/**
 * @param {{ accessToken?: string, apiKey?: string }} credentials
 * @returns {(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => Promise<void>}
 *   Handles a request whose `url` is the path after the /api/tmdb prefix.
 */
export function createTmdbProxy({ accessToken, apiKey }) {
  /** @type {Map<string, { expires: number, status: number, body: string }>} */
  const cache = new Map();

  return async function handle(req, res) {
    const send = (status, body, extra = {}) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...extra });
      res.end(typeof body === 'string' ? body : JSON.stringify(body));
    };

    if (req.method !== 'GET') return send(405, { error: 'Only GET requests are supported.' }, { Allow: 'GET' });
    if (!accessToken && !apiKey) {
      return send(500, { error: 'TMDB credentials are missing. Add TMDB_ACCESS_TOKEN (or TMDB_API_KEY) to .env and restart the server.' });
    }

    const incoming = new URL(req.url ?? '/', 'http://localhost');
    if (!ALLOWED_PATHS.some((re) => re.test(incoming.pathname))) {
      return send(404, { error: `Unsupported TMDB path: ${incoming.pathname}` });
    }

    const upstream = new URL(TMDB_BASE + incoming.pathname);
    incoming.searchParams.forEach((value, key) => {
      if (key !== 'api_key') upstream.searchParams.set(key, value);
    });
    upstream.searchParams.sort();
    const cacheKey = upstream.toString();

    const hit = cache.get(cacheKey);
    if (hit && hit.expires > Date.now()) return send(hit.status, hit.body, { 'X-Cache': 'HIT' });

    const headers = { Accept: 'application/json' };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    else upstream.searchParams.set('api_key', apiKey);

    let response;
    try {
      response = await fetch(upstream, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
    } catch (err) {
      return send(502, { error: `Could not reach TMDB: ${err instanceof Error ? err.message : String(err)}` });
    }

    const body = await response.text();
    const extra = { 'X-Cache': 'MISS' };
    const retryAfter = response.headers.get('retry-after');
    if (retryAfter) extra['Retry-After'] = retryAfter;

    if (response.ok) {
      if (cache.size >= CACHE_MAX_ENTRIES) cache.delete(cache.keys().next().value);
      cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, status: response.status, body });
    }
    send(response.status, body, extra);
  };
}

/** Reads credentials from an env object (process.env, or Vite's loadEnv result). */
export function credentialsFromEnv(env) {
  return { accessToken: env.TMDB_ACCESS_TOKEN || undefined, apiKey: env.TMDB_API_KEY || undefined };
}
