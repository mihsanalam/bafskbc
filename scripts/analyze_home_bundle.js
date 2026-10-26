const fs = require('fs');

async function main() {
  const res = await fetch('https://framerusercontent.com/sites/JXKyP1bcKeZ5COcTAXRaf/17572GP1T2IB-_5NxxKgZv6TG6Gv4dFJYg6C-G9yRFU.BsCIy6TM.mjs');
  const code = await res.text();
  console.log('Home page bundle size:', code.length);

  // Find all image URLs
  const imgs = [...code.matchAll(/https:\/\/framerusercontent\.com\/images\/[a-zA-Z0-9_\-\.]+\.(?:png|jpg|jpeg|webp|svg)/g)].map(m => m[0]);
  console.log('Total images found in bundle:', imgs.length);
  const unique = [...new Set(imgs)];
  fs.writeFileSync('scripts/home_bundle_images.json', JSON.stringify(unique, null, 2));
  console.log('Unique images:', unique.length);

  // Search for phrases in the user screenshot
  ['Prestige', 'Awards', 'Custom Sites', 'Situate', 'AMIK', 'Felty', 'Trail Homes', 'Wack', 'Winston', 'Purposeful'].forEach(term => {
    const idx = code.indexOf(term);
    console.log(`Term "${term}": ${idx !== -1 ? 'FOUND at ' + idx : 'NOT FOUND'}`);
  });
}

main().catch(console.error);
