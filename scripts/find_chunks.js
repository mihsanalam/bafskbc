const fs = require('fs');

async function main() {
  const content = fs.readFileSync('/Users/naitikpatidar/.gemini/antigravity-ide/brain/fed54fa3-5bad-437b-9bf7-3da0accd048d/.system_generated/steps/254/content.md', 'utf8');
  
  // Find all module scripts in HTML
  const moduleUrls = [...content.matchAll(/https:\/\/framerusercontent\.com\/modules\/[a-zA-Z0-9_\-\.\/]+/g)].map(m => m[0]);
  console.log('Module URLs:', moduleUrls.length);

  // If there are scripts or chunk references
  const chunkUrls = [...content.matchAll(/https:\/\/[a-zA-Z0-9_\-\.\/]+\.js/g)].map(m => m[0]);
  console.log('Chunk URLs:', chunkUrls);

  // Let's also check all assets in searchIndex
  // Let's search for "Situate" in all fetched text
}

main();
