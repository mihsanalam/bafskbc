const fs = require('fs');
const path = require('path');

const urls = JSON.parse(fs.readFileSync('scripts/network_images.json', 'utf8'));

const inspectDir = path.join(__dirname, '../assets/inspect');
if (!fs.existsSync(inspectDir)) fs.mkdirSync(inspectDir, { recursive: true });

async function download(url, filename) {
  const dest = path.join(inspectDir, filename);
  if (fs.existsSync(dest)) return;
  try {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buf));
    console.log(`Saved ${filename} (${buf.byteLength} bytes)`);
  } catch (e) {
    console.error(`Failed ${url}:`, e.message);
  }
}

async function main() {
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    if (!u.includes('/images/')) continue;
    const clean = u.split('?')[0];
    const ext = path.extname(clean);
    const base = path.basename(clean, ext);
    await download(u, `${i}_${base}${ext}`);
  }
  console.log('All images downloaded for inspection!');
}

main();
