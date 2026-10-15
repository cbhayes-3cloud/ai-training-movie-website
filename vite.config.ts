import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createTmdbProxy, credentialsFromEnv } from './server/tmdb-proxy.mjs';

/** Serves the TMDB proxy at /api/tmdb from the Vite dev and preview servers. */
function tmdbProxy(env: Record<string, string>): Plugin {
  const handle = createTmdbProxy(credentialsFromEnv(env));
  return {
    name: 'reelscore-tmdb-proxy',
    configureServer(server) {
      server.middlewares.use('/api/tmdb', (req, res) => void handle(req, res));
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/tmdb', (req, res) => void handle(req, res));
    },
  };
}

export default defineConfig(({ mode }) => {
  // '' loads every variable, including the server-only TMDB_* ones. Only VITE_* reach the browser.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tmdbProxy(env)],
    resolve: {
      // reelscore-ds is a linked local package with its own copy of React for the
      // design-sync tooling. Dedupe so the app and the components share one React.
      dedupe: ['react', 'react-dom'],
    },
  };
});
