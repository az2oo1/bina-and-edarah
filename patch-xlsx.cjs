const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walkDir(file));
    } else { 
      if (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.cjs')) {
        results.push(file);
      }
    }
  });
  return results;
}

try {
  const xlsxDir = 'node_modules/xlsx';
  if (fs.existsSync(xlsxDir)) {
    const files = walkDir(xlsxDir);
    files.forEach(file => {
      let content = fs.readFileSync(file, 'utf8');
      let patched = false;
      
      const toReplace = [
        [/throw new Error\("Sheet name cannot exceed 31 chars"\)/g, 'return true'],
        [/throw new Error\("Sheet name cannot start or end with apostrophe \('\)"\)/g, 'return true'],
        [/throw new Error\("Sheet name cannot be 'History'"\)/g, 'return true'],
        [/throw new Error\("Sheet name cannot contain : \\\\ \/ \? \* \[ \]"\)/g, 'return true'],
        [/throw new Error\("Sheet name cannot be blank"\)/g, 'return true']
      ];

      toReplace.forEach(([regex, replacement]) => {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          patched = true;
        }
      });

      if (patched) {
        fs.writeFileSync(file, content);
        console.log(`${file} patched successfully!`);
      }
    });
  }
} catch (e) {
  console.error('Failed to patch xlsx files', e);
}

