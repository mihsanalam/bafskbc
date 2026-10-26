const fs = require('fs');
const code = fs.readFileSync('scripts/home_slice_portfolio.js', 'utf8');

// Search for images around "16x" and "100+"
const idx16 = code.indexOf('16x');
const idx100 = code.indexOf('100+');

console.log('16x index:', idx16);
console.log('100+ index:', idx100);

// Print the code around 100+ to see what comes next (Column 2, Column 3, Column 4)
console.log(code.slice(idx100 - 500, idx100 + 4000));
