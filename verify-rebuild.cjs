const fs = require('fs');
const c = fs.readFileSync('c:/Users/Administrator/Desktop/临时/claude/mental-age/frontend/js/nbti.js', 'utf8');

console.log('=== File Verification ===');
console.log('File size:', c.length, 'bytes');

// Check debugInfo
console.log('\nHas debugInfo reference:', c.includes('debugInfo'));

// Check all 16 types
const typeKeys = ['ENRS','ENRM','ENCS','ENCM','EIRS','EIRM','EICS','EICM','IDRS','IDRM','IDCS','IDCM','IIRS','IIRM','IICS','IICM'];
console.log('\n--- Type Keys Check ---');
let allPresent = true;
typeKeys.forEach(k => {
  const found = c.includes('"' + k + '"');
  console.log(`  ${k}: ${found ? '✅' : '❌ MISSING'}`);
  if (!found) allPresent = false;
});
console.log('\nAll 16 present:', allPresent);

// JS syntax check
console.log('\n--- JS Syntax Check ---');
try {
  new Function(c);
  console.log('✅ JS PARSE: No syntax errors');
} catch(e) {
  console.log('❌ JS PARSE ERROR:', e.message);
}

// Brace balance
const open = (c.match(/{/g) || []).length;
const close = (c.match(/}/g) || []).length;
console.log('\n--- Brace Balance ---');
console.log(`  { = ${open}, } = ${close}, balance = ${open - close}`);
