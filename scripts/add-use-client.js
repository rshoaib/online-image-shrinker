import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (!content.startsWith("'use client'") && !content.startsWith('"use client"')) {
        fs.writeFileSync(fullPath, "'use client';\n" + content);
        console.log('Added use client to', fullPath);
      }
    }
  }
}

['src/components', 'src/hooks'].forEach(dir => processDir(path.join(__dirname, '..', dir)));
