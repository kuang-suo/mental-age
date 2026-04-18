const fs = require('fs');
const c = fs.readFileSync('c:/Users/Administrator/Desktop/临时/claude/mental-age/frontend/js/nbti.js', 'utf8');

// Extract just TYPE_LIBRARY
const start = c.indexOf('const TYPE_LIBRARY = {');
const dimStart = c.indexOf('const DIM_EXPLANATIONS = {');
const libContent = c.substring(start + 'const TYPE_LIBRARY = {'.length, dimStart);

// Find every top-level type key and track depth
let depth = 0;
let pos = 0;
let currentKey = '';
let keyPositions = [];
let issues = [];

while (pos < libContent.length) {
  const ch = libContent[pos];
  
  if (ch === '{') {
    depth++;
    // At depth 1, right after {, capture the key
    if (depth === 1) {
      const remaining = libContent.substring(pos);
      const keyMatch = remaining.match(/"([A-Z]{4})"\s*:/);
      if (keyMatch) {
        currentKey = keyMatch[1];
        keyPositions.push({ key: currentKey, start: pos });
      }
    }
  }
  
  if (ch === '}') {
    depth--;
    if (depth === 0) {
      console.log('=== TYPE_LIBRARY ends prematurely! ===');
      console.log('Last known key:', currentKey);
      console.log('Position:', pos);
      console.log('Context around closing }:');
      console.log(libContent.substring(Math.max(0,pos-80), Math.min(libContent.length, pos+20)));
      
      // Show what comes AFTER this premature closing
      console.log('\n=== What comes AFTER premature close ===');
      const afterClose = libContent.substring(pos+1);
      console.log(afterClose.substring(0, 200));
      break;
    }
    
    // At depth returning to 1, a type entry just closed
    if (depth === 1 && currentKey) {
      const kp = keyPositions.find(k => k.key === currentKey);
      if (kp) kp.end = pos;
    }
  }
  
  pos++;
}

console.log('\n=== All keys found before premature close ===');
keyPositions.forEach(kp => {
  console.log(kp.key + ': ' + (kp.end ? 'OK' : 'INCOMPLETE'));
});
