const fs = require('fs');
const c = fs.readFileSync('c:/Users/Administrator/Desktop/临时/claude/mental-age/frontend/js/nbti.js', 'utf8');

// Extract TYPE_LIBRARY section
const tlStart = c.indexOf('const TYPE_LIBRARY = {');
const tlEnd = c.indexOf('const DIM_EXPLANATIONS');
const tlSection = c.substring(tlStart, tlEnd);

console.log('=== TYPE_LIBRARY Key Extraction ===');
console.log('Section length:', tlSection.length);

// Find all type keys (top-level keys in the object)
const keyPattern = /"\n\s*"(ENRS|ENRM|ENCS|ENCM|EIRS|EIRM|EICS|EICM|IDRS|IDRM|IDCS|IDCM|IIRS|IIRM|IICS|IICM)"\s*:/g;
// Actually let's just find all "XXXX": patterns at the start of lines

const lines = tlSection.split('\n');
const foundKeys = [];
lines.forEach((line, i) => {
  const m = line.match(/^\s*"([A-Z]{4})"\s*:/);
  if (m) {
    foundKeys.push({ key: m[1], line: i + 1 });
  }
});

console.log('\nFound', foundKeys.length, 'type keys:');
foundKeys.forEach(k => console.log(`  ${k.key} at line ${k.line}`));

// Check all 16 expected keys
const expected = ['ENRS','ENRM','ENCS','ENCM','EIRS','EIRM','EICS','EICM','IDRS','IDRM','IDCS','IDCM','IIRS','IIRM','IICS','IICM'];
const missing = expected.filter(k => !foundKeys.some(f => f.key === k));
if (missing.length > 0) {
  console.log('\n❌ MISSING KEYS:', missing.join(', '));
} else {
  console.log('\n✅ All 16 keys present!');
}

// Check if IIDM exists (this is what the user's test should produce)
console.log('\n--- IIDM check ---');
console.log('IIDM in file:', c.includes('"IIDM"'));
