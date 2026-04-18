const fs = require('fs');
const c = fs.readFileSync('c:/Users/Administrator/Desktop/临时/claude/mental-age/frontend/js/nbti.js', 'utf8');

// Find each type definition by its code pattern
const types = ['ENRS','ENRM','ENCS','ENCM','EIRS','EIRM','EICS','EICM','IDRS','IDRM','IDCS','IDCM','IIRS','IIRM','IICS','IICM'];

types.forEach((type, idx) => {
  // Search for pattern: "TYPECODE": {\n    code: "TYPECODE"
  const pattern = new RegExp('"' + type + '"\\s*:\\s*\\{\\s*code:\\s*"' + type + '"', 'g');
  const match = pattern.exec(c);
  if (!match) {
    console.log(type + ': ❌ PATTERN NOT FOUND');
    return;
  }
  
  const start = match.index;
  
  // Now find the matching close by counting braces from this point
  let depth = 0;
  let pos = start;
  let foundOpen = false;
  while (pos < c.length) {
    if (c[pos] === '{') { depth++; foundOpen = true; }
    if (c[pos] === '}') {
      depth--;
      if (foundOpen && depth === 0) {
        // Check if next non-whitespace char is , or }
        const after = c.substring(pos+1).trimStart();
        const isValidEnd = after[0] === ',' || after[0] === '}';
        console.log(type + ': ' + (isValidEnd ? '✅' : '⚠️ SUSPICIOUS END') + ' endPos=' + pos + ' after="' + after.substring(0,20) + '" length=' + (pos-start));
        return;
      }
    }
    pos++;
  }
  console.log(type + ': ❌ NEVER CLOSED (reached end of file)');
});
