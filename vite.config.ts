import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { getRandomQuote } from './src/server/quotes.js';

function sendJson(res: any, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(payload));
}

function localApiPlugin() {
  return {
    name: 'hitokoto-local-api',
    configureServer(server: any) {
      server.middlewares.use('/api/random', (req: any, res: any) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
          res.end();
          return;
        }

        if (req.method !== 'GET') {
          sendJson(res, 405, { error: 'Method not allowed' });
          return;
        }

        try {
          const url = new URL(req.url || '/', 'http://localhost');
          sendJson(res, 200, getRandomQuote(url.searchParams.get('category')));
        } catch (error) {
          const statusCode =
            typeof error === 'object' && error !== null && 'statusCode' in error
              ? Number((error as { statusCode?: number }).statusCode) || 500
              : 500;

          sendJson(res, statusCode, {
            error: error instanceof Error ? error.message : 'Internal server error',
          });
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), localApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR can be disabled in constrained preview environments via DISABLE_HMR.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during previews.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
