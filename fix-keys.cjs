const fs = require('fs');

let c = fs.readFileSync('c:/Users/Administrator/Desktop/临时/claude/mental-age/frontend/js/nbti.js', 'utf8');

// Mapping: old TL key -> new CR key (matching computeResult output)
// computeResult format: [E/I][R/I][C/D][S/M]
const keyMap = {
  'ENRS': 'ERCS',  // 热情浪漫闪电型
  'ENRM': 'ERCM',  // 浪漫主动考察型
  'ENCS': 'ERDS',  // 粘人甜蜜型
  'ENCM': 'ERDM',  // 深情专一型
  'EIRS': 'EICS',  // 氛围制造机
  'EIRM': 'EICM',  // 理性外交官
  'EICS': 'EIDS',  // 甜蜜粘人精
  'EICM': 'EIDM',  // 深情浪漫家
  'IDRS': 'IRCS',  // 被动浪漫型
  'IDRM': 'IRCM',  // 慢热理想型
  'IDCS': 'IRDS',  // 外冷内热型
  'IDCM': 'IRDM',  // 深情内敛型
  'IIRS': 'IICS',  // 浪漫绝缘体
  'IIRM': 'IICM',  // 理性分析派
  'IICS': 'IIDS',  // 独立粘人精
  'IICM': 'IIDM'   // 完美主义者
};

console.log('=== Renaming TYPE_LIBRARY keys ===');

// Step 1: Rename all top-level object keys ("OLD": -> "NEW":)
for (const [oldKey, newKey] of Object.entries(keyMap)) {
  // Match object key pattern: "OLD":\n  {
  const oldPattern = '"' + oldKey + '":';
  const newPattern = '"' + newKey + '":';
  if (c.includes(oldPattern)) {
    c = c.replace(oldPattern, newPattern);
    console.log(`  Key: ${oldKey} → ${newKey} ✅`);
  } else {
    console.log(`  Key: ${oldKey} → ${newKey} ❌ NOT FOUND`);
  }
}

// Step 2: Rename "code" field values inside each type object
for (const [oldKey, newKey] of Object.entries(keyMap)) {
  // Pattern: "code": "OLD"  (inside each type object)
  const codePattern = '"code": "' + oldKey + '"';
  const newCodePattern = '"code": "' + newKey + '"';
  let count = 0;
  c = c.replace(new RegExp(codePattern, 'g'), () => { count++; return newCodePattern; });
  if (count > 0) {
    console.log(`  Code field: ${oldKey} → ${newKey} (${count} occurrences)`);
  }
}

// Step 3: Rename bestMatch and avoidMatch code references
for (const [oldKey, newKey] of Object.entries(keyMap)) {
  // Pattern: "code": "OLD" in bestMatch/avoidMatch sub-objects
  const refPatterns = [
    new RegExp('"code":\\s*"' + oldKey + '"', 'g')
  ];
  let count = 0;
  c = c.replace(refPatterns[0], () => { count++; return '"code": "' + newKey + '"'; });
  if (count > 0) {
    console.log(`  Reference: ${oldKey} → ${newKey} (${count} refs)`);
  }
}

// Write fixed file
fs.writeFileSync('c:/Users/Administrator/Desktop/临时/claude/mental-age/frontend/js/nbti.js', c, 'utf8');
console.log('\nFile written! Size:', c.length);

// Verification
console.log('\n=== Verification ===');

// Check all new keys exist
let allNewKeysPresent = true;
for (const [oldKey, newKey] of Object.entries(keyMap)) {
  if (!c.includes('"' + newKey + '":')) {
    console.log(`❌ Missing new key: ${newKey}`);
    allNewKeysPresent = false;
  }
}
if (allNewKeysPresent) console.log('✅ All 16 new keys present');

// Check no old keys remain (except as part of other strings)
let oldKeyRemnants = 0;
for (const oldKey of Object.keys(keyMap)) {
  // Check for old key as an object key pattern
  const pattern = '"' + oldKey + '":';
  if (c.includes(pattern)) {
    console.log(`⚠️  Old key still exists: ${oldKey}`);
    oldKeyRemnants++;
  }
}
if (oldKeyRemnants === 0) console.log('✅ No old keys remain as object keys');

// Check brace balance
const openBraces = (c.match(/{/g) || []).length;
const closeBraces = (c.match(/}/g) || []).length;
console.log(`✅ Brace balance: {=${openBraces} }=${closeBraces}`);

// JS syntax check
try {
  new Function(c);
  console.log('✅ JS syntax: OK');
} catch(e) {
  console.log('❌ JS syntax error:', e.message);
}

// Final: verify the specific user case - IIDM
console.log('\n--- User test case (IIDM) ---');
console.log('IIDM exists as key:', c.includes('"IIDM":'));
