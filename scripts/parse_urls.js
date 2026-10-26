const fs = require('fs');
const content = fs.readFileSync('/Users/naitikpatidar/.gemini/antigravity-ide/brain/fed54fa3-5bad-437b-9bf7-3da0accd048d/.system_generated/steps/254/content.md', 'utf8');
const matches = content.match(/https:\/\/framerusercontent\.com\/[^\s"'<>)]+/g) || [];
const unique = [...new Set(matches)];
console.log('Total framer URLs:', unique.length);
unique.forEach(u => console.log(u));
