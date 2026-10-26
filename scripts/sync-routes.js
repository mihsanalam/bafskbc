/**
 * IITian Tattva — Route Parity Synchronizer
 * 
 * Guarantees Single-Source-of-Truth (SSOT) parity across the repository.
 * In a static multi-page deployment, clean URLs (e.g. /about) may be served
 * either from directory indexes (/about/index.html) or extensionless root files (/about.html).
 * 
 * This script ensures that any edits made to the primary canonical files
 * are automatically propagated to their directory counterparts.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Canonical source -> target duplicates
const ROUTE_MAPPINGS = [
  { source: 'about.html', targets: ['about/index.html'] },
  { source: 'blog.html', targets: ['blog/index.html'] },
  { source: 'contact.html', targets: ['contact/index.html'] },
  { source: 'join.html', targets: ['join/index.html'] },
  { source: 'resources.html', targets: ['resources/index.html'] },
  { source: 'profile.html', targets: ['profile/index.html'] },
  { source: 'resources-quiz.html', targets: ['resources/quiz.html', 'resources/quiz/index.html'] },
  { source: 'resources-roadmap.html', targets: ['resources/roadmap.html', 'resources/roadmap/index.html'] }
];

function syncRoutes() {
  console.log('🔄 Checking and synchronizing route parity...');
  let syncCount = 0;

  for (const { source, targets } of ROUTE_MAPPINGS) {
    const srcPath = path.join(ROOT_DIR, source);
    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️  Source file missing: ${source}`);
      continue;
    }

    const srcContent = fs.readFileSync(srcPath, 'utf8');

    for (const target of targets) {
      const targetPath = path.join(ROOT_DIR, target);
      const targetDir = path.dirname(targetPath);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const needsUpdate = !fs.existsSync(targetPath) || fs.readFileSync(targetPath, 'utf8') !== srcContent;
      if (needsUpdate) {
        fs.writeFileSync(targetPath, srcContent, 'utf8');
        console.log(`  ✓ Synced ${source} -> ${target}`);
        syncCount++;
      }
    }
  }

  if (syncCount === 0) {
    console.log('  ✔ All routes are already in 100% parity.');
  } else {
    console.log(`  ✔ Successfully synchronized ${syncCount} route file(s).`);
  }
}

if (require.main === module) {
  syncRoutes();
}

module.exports = { syncRoutes, ROUTE_MAPPINGS };
