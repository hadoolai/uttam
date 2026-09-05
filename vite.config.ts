import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function sitemapHeadersPlugin(): Plugin {
  return {
    name: 'sitemap-headers-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/sitemap.xml') {
          const sitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');
          if (fs.existsSync(sitemapPath)) {
            const content = fs.readFileSync(sitemapPath, 'utf8');
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.statusCode = 200;
            res.end(content);
            return;
          }
        }
        if (url === '/robots.txt') {
          const robotsPath = path.resolve(process.cwd(), 'public/robots.txt');
          if (fs.existsSync(robotsPath)) {
            const content = fs.readFileSync(robotsPath, 'utf8');
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.statusCode = 200;
            res.end(content);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), sitemapHeadersPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
