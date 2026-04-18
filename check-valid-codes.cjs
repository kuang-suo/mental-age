// Generate all 16 valid typeCodes from computeResult logic
const positions = [
  { p: 'E', pos: ['E', 'I'] },  // dimScores.E >= 3 ? 'E' : 'I'
  { p: 'R', pos: ['R', 'I'] },  // dimScores.R >= 3 ? 'R' : 'I'
  { p: 'C', pos: ['C', 'D'] },  // dimScores.C >= 3 ? 'C' : 'D'
  { p: 'S', pos: ['S', 'M'] }  // dimScores.S >= 3 ? 'S' : 'M'
];

const validCodes = [];
for (const a of positions[0].pos) {
  for (const b of positions[1].pos) {
    for (const c of positions[2].pos) {
      for (const d of positions[3].pos) {
        validCodes.push(a + b + c + d);
      }
    }
  }
}

console.log('=== All 16 Valid Type Codes ===');
validCodes.forEach(c => console.log(' ', c));

const fs = require('fs');
const c = fs.readFileSync('c:/Users/Administrator/Desktop/临时/claude/mental-age/frontend/js/nbti.js', 'utf8');

console.log('\n=== Check Which Valid Codes Exist in TYPE_LIBRARY ===');
let allOk = true;
const missing = [];
const extra = [];

validCodes.forEach(code => {
  // Look for "CODE": pattern as object key
  const regex = new RegExp('"' + code + '"\\s*:\\s*\\{');
  const found = regex.test(c);
  if (!found) {
    missing.push(code);
    console.log(`  ❌ ${code} - MISSING`);
    allOk = false;
  } else {
    console.log(`  ✅ ${code}`);
  }
});

// Also find any keys that don't match valid patterns
const keyRegex = /"(ENRS|ENRM|ENCS|ENCM|EIRS|EIRM|EICS|EICM|IDRS|IDRM|IDCS|IDCM|IIRS|IIRM|IICS|IICM|II[DSCM][DSCM])"\s*:/g;
let m;
const fileKeys = new Set();
while ((m = keyRegex.exec(c)) !== null) {
  fileKeys.add(m[1]);
}

fileKeys.forEach(k => {
  if (!validCodes.includes(k)) {
    extra.push(k);
    console.log(`  ⚠️  ${k} - INVALID CODE (not produced by computeResult)`);
  }
});

console.log('\n=== Summary ===');
console.log('Total valid codes:', validCodes.length);
console.log('Missing from file:', missing.length, missing.length > 0 ? missing.join(', ') : 'none');
console.log('Invalid codes in file:', extra.length, extra.length > 0 ? extra.join(', ') : 'none');
