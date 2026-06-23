const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src/components');
files.push('./src/app/dashboard/page.tsx');

let changedCount = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  
  // Fix <h2>...</div>
  content = content.replace(/<h2([^>]*)>([\s\S]*?)<\/div>/g, (match, p1, p2) => {
    if (!p2.includes('</h2')) {
      return `<h2${p1}>${p2}</h2>`;
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    changedCount++;
    console.log('Fixed:', f);
  }
});
console.log('Total fixed:', changedCount);
