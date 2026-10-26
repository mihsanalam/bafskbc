const fs = require('fs');

async function searchFramerChunks() {
  // Let's get searchIndex-0roQR6UJIff8.json
  const res = await fetch('https://framerusercontent.com/sites/JXKyP1bcKeZ5COcTAXRaf/searchIndex-0roQR6UJIff8.json');
  const searchIndex = await res.json();
  console.log('Search index keys:', Object.keys(searchIndex));
  fs.writeFileSync('scripts/searchIndex.json', JSON.stringify(searchIndex, null, 2));

  // Find all images mentioned
  const str = JSON.stringify(searchIndex);
  const images = [...str.matchAll(/https:\/\/framerusercontent\.com\/[^\s"',\)]+/g)].map(m => m[0]);
  console.log('Images in searchIndex:', [...new Set(images)]);
}

searchFramerChunks().catch(console.error);
