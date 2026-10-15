// Production server: serves the built app from dist/ and the TMDB proxy at /api/tmdb.
// Run `npm run build` first, then `npm start`.
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTmdbProxy, credentialsFromEnv } from './tmdb-proxy.mjs';

try {
  process.loadEnvFile();
} catch {
  // No .env file; rely on the real environment.
}

const PORT = Number(process.env.PORT) || 8787;
const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const PREFIX = '/api/tmdb';
const tmdb = createTmdbProxy(credentialsFromEnv(process.env));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

async function serveStatic(pathname, res) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, '');
  let file = join(DIST, safe);
  if (!file.startsWith(DIST.endsWith(sep) ? DIST : DIST + sep) && file !== DIST) file = join(DIST, 'index.html');
  try {
    const info = await stat(file);
    if (info.isDirectory()) file = join(file, 'index.html');
  } catch {
    file = join(DIST, 'index.html'); // client-side routes fall back to the app shell
  }
  const type = TYPES[extname(file)] ?? 'application/octet-stream';
  const cache = file.includes(`${sep}assets${sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache';
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': cache });
  createReadStream(file).on('error', () => res.end()).pipe(res);
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (url.pathname === PREFIX || url.pathname.startsWith(PREFIX + '/')) {
    req.url = url.pathname.slice(PREFIX.length) + url.search;
    tmdb(req, res);
    return;
  }
  serveStatic(url.pathname, res);
}).listen(PORT, () => {
  console.log(`Reelscore running at http://localhost:${PORT}`);
});
