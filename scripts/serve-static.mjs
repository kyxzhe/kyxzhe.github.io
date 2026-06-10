import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(rootDir, 'out');
const host = process.env.HOST ?? '127.0.0.1';
const port = parsePort();

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.ttf', 'font/ttf'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

const server = createServer(async (request, response) => {
  const pathname = getPathname(request);

  if (pathname === null) {
    sendStatus(response, 400);
    return;
  }

  const assetPath = await resolveAssetPath(pathname);

  if (assetPath === null) {
    const fallbackPath = path.join(outDir, '404.html');
    const fallbackExists = await fileExists(fallbackPath);

    if (fallbackExists) {
      response.writeHead(404, {
        'Content-Type': contentTypes.get('.html'),
      });
      createReadStream(fallbackPath).pipe(response);
      return;
    }

    sendStatus(response, 404);
    return;
  }

  response.writeHead(200, {
    'Cache-Control': cacheControlFor(assetPath),
    'Content-Type': contentTypeFor(assetPath),
  });
  createReadStream(assetPath).pipe(response);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Choose another port with --port <number>.`);
    process.exit(1);
  }

  if (error.code === 'EPERM') {
    console.error(`Could not bind to ${host}:${port}. Check local permissions and sandbox restrictions.`);
    process.exit(1);
  }

  throw error;
});

server.listen(port, host, () => {
  console.log(`Serving ${path.relative(rootDir, outDir)} at http://${host}:${port}`);
});

function parsePort() {
  const explicitPort = readArg('--port') ?? readArg('-p') ?? process.env.PORT ?? '3000';
  const parsedPort = Number.parseInt(explicitPort, 10);

  if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    throw new Error(`Invalid port: ${explicitPort}`);
  }

  return parsedPort;
}

function readArg(name) {
  const index = process.argv.indexOf(name);

  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
}

function getPathname(request) {
  try {
    const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? host}`);
    return decodeURIComponent(requestUrl.pathname);
  } catch {
    return null;
  }
}

async function resolveAssetPath(pathname) {
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const candidates = candidatePaths(requestedPath);

  for (const candidate of candidates) {
    const resolvedPath = path.resolve(outDir, candidate.replace(/^\/+/, ''));

    if (!isWithinOutDir(resolvedPath)) {
      return null;
    }

    const filePath = await resolveFilePath(resolvedPath);

    if (filePath !== null) {
      return filePath;
    }
  }

  return null;
}

function candidatePaths(requestedPath) {
  const extension = path.extname(requestedPath);

  if (extension) {
    return [requestedPath];
  }

  return [`${requestedPath}.html`, path.join(requestedPath, 'index.html')];
}

async function resolveFilePath(resolvedPath) {
  try {
    const fileStat = await stat(resolvedPath);

    if (fileStat.isDirectory()) {
      const indexPath = path.join(resolvedPath, 'index.html');
      return (await fileExists(indexPath)) ? indexPath : null;
    }

    return fileStat.isFile() ? resolvedPath : null;
  } catch {
    return null;
  }
}

function isWithinOutDir(filePath) {
  const relativePath = path.relative(outDir, filePath);
  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
}

function contentTypeFor(filePath) {
  return contentTypes.get(path.extname(filePath)) ?? 'application/octet-stream';
}

function cacheControlFor(filePath) {
  return filePath.includes(`${path.sep}_next${path.sep}static${path.sep}`)
    ? 'public, max-age=31536000, immutable'
    : 'no-cache';
}

async function fileExists(filePath) {
  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}

function sendStatus(response, statusCode) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
  });
  response.end(`${statusCode}\n`);
}
