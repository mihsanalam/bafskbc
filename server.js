/**
 * IITian Tattva — Production Node HTTP Static & API Server
 * 
 * Implements:
 * 1. Clean URL resolution with directory index fallback & exact file precedence
 * 2. Strict HTTP security headers (nosniff, SAMEORIGIN, modern referrer policies)
 * 3. Cache control differentiation (immutable for static /assets/, revalidation for HTML)
 * 4. Micro-API routing delegated to modular handlers
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const apiHandler = require('./api-handler');

let PORT = parseInt(process.env.PORT, 10) || 3000;

const MIME_TYPES = Object.freeze({
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
});

const SECURITY_HEADERS = Object.freeze({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block'
});

/**
 * Resolves a requested URL path into a safe, absolute filesystem path.
 * Precedence:
 * 1. Exact matching file (e.g., /style.css, /assets/js/lenis.min.js)
 * 2. Directory with index.html (e.g., /about -> /about/index.html)
 * 3. Clean route matching file with .html extension (e.g., /about -> /about.html)
 * 
 * @param {string} urlPath
 * @returns {string|null} Resolved file path or null if not found
 */
function resolveFilePath(urlPath) {
  const cleanPath = urlPath.replace(/\/$/, '') || '/';
  const rawTarget = path.join(__dirname, cleanPath === '/' ? 'index.html' : cleanPath);

  // Prevent directory traversal attacks
  if (!rawTarget.startsWith(__dirname)) {
    return null;
  }

  // 1. Exact file match
  if (fs.existsSync(rawTarget) && fs.statSync(rawTarget).isFile()) {
    return rawTarget;
  }

  // 2. Directory route containing index.html
  if (fs.existsSync(rawTarget) && fs.statSync(rawTarget).isDirectory()) {
    const dirIndex = path.join(rawTarget, 'index.html');
    if (fs.existsSync(dirIndex) && fs.statSync(dirIndex).isFile()) {
      return dirIndex;
    }
  }

  // 3. Extensionless clean route (.html)
  const htmlVariant = rawTarget + '.html';
  if (fs.existsSync(htmlVariant) && fs.statSync(htmlVariant).isFile()) {
    return htmlVariant;
  }

  return null;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // Route API endpoints
  if (urlPath.startsWith('/api/')) {
    return apiHandler.handleApiRequest(req, res);
  }

  const resolvedPath = resolveFilePath(urlPath);

  if (!resolvedPath) {
    res.writeHead(404, {
      ...SECURITY_HEADERS,
      'Content-Type': 'text/html; charset=UTF-8'
    });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 — Page Not Found | IITian Tattva</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body style="padding: 120px 24px; text-align: center; font-family: var(--font-primary);">
  <h1 style="font-size: 38px; color: var(--color-black); margin-bottom: 12px;">Page Not Found</h1>
  <p style="color: var(--color-text-muted); font-size: 16px; margin-bottom: 28px;">
    The requested curriculum resource or portal route does not exist.
  </p>
  <a href="/" class="primary-lime-cta" style="display: inline-flex; align-items: center; text-decoration: none; padding: 12px 28px; background: var(--color-lime); color: var(--color-black); font-weight: 700; border-radius: var(--radius-pill); border: 2px solid var(--color-black);">
    Return to IITian Tattva Home &rarr;
  </a>
</body>
</html>`);
    return;
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const isHtml = ext === '.html';

  // Critical assets pushed via 103 Early Hints & HTTP Link Headers
  const earlyLinkHeaders = [
    '</style.css>; rel=preload; as=style',
    '</assets/js/lenis.min.js>; rel=preload; as=script',
    '<https://api.fontshare.com>; rel=preconnect; crossorigin',
    '<https://fonts.gstatic.com>; rel=preconnect; crossorigin'
  ];

  // Send 103 Early Hints immediately if the client is requesting an HTML document
  if (isHtml && typeof res.writeEarlyHints === 'function') {
    res.writeEarlyHints({
      link: earlyLinkHeaders
    });
  }

  // Differentiate cache headers: immutable for versioned static assets, must-revalidate for HTML documents
  const isStaticAsset = resolvedPath.includes(path.join('assets', ''));
  const cacheControl = isStaticAsset 
    ? 'public, max-age=31536000, immutable'
    : 'public, max-age=0, must-revalidate';

  fs.readFile(resolvedPath, (err, content) => {
    if (err) {
      res.writeHead(500, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end(`Internal Server Error [${err.code}]`);
      return;
    }

    const headers = {
      ...SECURITY_HEADERS,
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
      'Vary': 'Accept-Encoding'
    };

    if (isHtml) {
      headers['Link'] = earlyLinkHeaders.join(', ');
    }

    const isCompressible = /text|javascript|json|xml|svg/i.test(contentType);
    const acceptEncoding = req.headers['accept-encoding'] || '';

    // Prioritize modern Brotli (br) over Gzip, with legacy Gzip fallback
    if (isCompressible && /\bbr\b/.test(acceptEncoding) && typeof zlib.brotliCompress === 'function') {
      zlib.brotliCompress(content, {
        params: {
          [zlib.constants.BROTLI_PARAM_MODE]: contentType.includes('text') || contentType.includes('javascript') || contentType.includes('json')
            ? zlib.constants.BROTLI_MODE_TEXT
            : zlib.constants.BROTLI_MODE_GENERIC,
          [zlib.constants.BROTLI_PARAM_QUALITY]: 4 // Fast on-the-fly dynamic compression
        }
      }, (brErr, compressed) => {
        if (brErr) {
          res.writeHead(200, headers);
          res.end(content);
        } else {
          headers['Content-Encoding'] = 'br';
          headers['Content-Length'] = compressed.length;
          res.writeHead(200, headers);
          res.end(compressed);
        }
      });
    } else if (isCompressible && /\bgzip\b/.test(acceptEncoding)) {
      zlib.gzip(content, (gzipErr, compressed) => {
        if (gzipErr) {
          res.writeHead(200, headers);
          res.end(content);
        } else {
          headers['Content-Encoding'] = 'gzip';
          headers['Content-Length'] = compressed.length;
          res.writeHead(200, headers);
          res.end(compressed);
        }
      });
    } else {
      headers['Content-Length'] = content.length;
      res.writeHead(200, headers);
      res.end(content);
    }
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[Network] Port ${PORT} occupied. Incrementing to ${PORT + 1}...`);
    PORT++;
    server.listen(PORT);
  } else {
    console.error('[Server Error]', err);
  }
});

server.on('listening', () => {
  const addr = server.address();
  console.log(`[IITian Tattva] Production server active at http://localhost:${addr.port}/`);
});

server.listen(PORT);
