async function main() {
  const res = await fetch('https://framerusercontent.com/sites/JXKyP1bcKeZ5COcTAXRaf/script_main.DYi_cwwN.mjs');
  const code = await res.text();
  console.log('Main bundle size:', code.length);
  
  // Find all imports / framer URLs
  const imports = [...code.matchAll(/https:\/\/framerusercontent\.com\/[^\s"',\)]+/g)].map(m => m[0]);
  console.log('Imports in main:', [...new Set(imports)]);
}

main().catch(console.error);
