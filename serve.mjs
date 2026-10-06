import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, relative as relativePath, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8080);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf',
};
const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const path = resolve(root, relative);
    const normalized = relativePath(root, path).split(sep).join('/');
    const publicFile = normalized === 'index.html' || /^(images|styles|JS|assets)\//.test(normalized);
    if (!publicFile || !path.startsWith(root + sep)) {
      response.writeHead(404).end('Fichier introuvable');
      return;
    }
    const data = await readFile(path);
    response.writeHead(200, {
      'Content-Type': types[extname(path)] || 'application/octet-stream',
      'Content-Length': data.length,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch {
    response.writeHead(404).end('Fichier introuvable');
  }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Le port ${port} est déjà utilisé. Fermez l’autre serveur ou définissez PORT.`
    : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`Portfolio : http://127.0.0.1:${port}\nCtrl+C pour arrêter.`));

