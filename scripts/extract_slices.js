const fs = require('fs');

async function main() {
  const res = await fetch('https://framerusercontent.com/sites/JXKyP1bcKeZ5COcTAXRaf/17572GP1T2IB-_5NxxKgZv6TG6Gv4dFJYg6C-G9yRFU.BsCIy6TM.mjs');
  const code = await res.text();

  fs.writeFileSync('scripts/home_slice_purposeful.js', code.slice(400000, 420000));
  fs.writeFileSync('scripts/home_slice_portfolio.js', code.slice(480000, 515000));
  console.log('Saved slices successfully!');
}

main().catch(console.error);
