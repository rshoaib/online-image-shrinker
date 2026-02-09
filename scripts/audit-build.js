
import fs from 'fs';
import path from 'path';
import { load } from 'cheerio';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '../dist');

async function auditBuild() {
  console.log('🔍 Starting SEO & Accessibility Audit...');
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Build directory (dist) not found. Run "npm run build" first.');
    process.exit(1);
  }

  const files = await glob('**/*.html', { cwd: DIST_DIR });
  let errorCount = 0;
  let warnCount = 0;

  console.log(`📂 Scanning ${files.length} HTML files...`);

  for (const file of files) {
    const filePath = path.join(DIST_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = load(content);
    
    // 1. Check Title
    const title = $('title').text();
    if (!title) {
      console.error(`❌ [${file}] Missing <title> tag`);
      errorCount++;
    } else if (title.length < 10) {
      console.warn(`⚠️ [${file}] Title too short: "${title}"`);
      warnCount++;
    }

    // 2. Check Meta Description
    const desc = $('meta[name="description"]').attr('content');
    if (!desc) {
      console.error(`❌ [${file}] Missing meta description`);
      errorCount++;
    } else if (desc.length < 50) {
      console.warn(`⚠️ [${file}] Meta description too short (<50 chars)`);
      warnCount++;
    }

    // 3. Check H1
    const h1Count = $('h1').length;
    if (h1Count === 0) {
      console.error(`❌ [${file}] Missing <h1> tag`);
      errorCount++;
    } else if (h1Count > 1) {
      console.warn(`⚠️ [${file}] Multiple <h1> tags found (${h1Count})`);
      warnCount++;
    }

    // 4. Check Images (Alt Text)
    $('img').each((i, el) => {
      const alt = $(el).attr('alt');
      const src = $(el).attr('src');
      if (!alt) {
        // Ignore decorative images if marked explicitly (e.g. role="presentation") but usually alt="" is best
        console.warn(`⚠️ [${file}] Image missing alt text: ${src}`);
        warnCount++;
      }
    });

    // 5. Check Canonical
    const canonical = $('link[rel="canonical"]').attr('href');
    if (!canonical) {
       console.warn(`⚠️ [${file}] Missing canonical link`);
       warnCount++;
    }
  }

  console.log('\n📊 Audit Summary:');
  console.log(`   Checked: ${files.length} pages`);
  console.log(`   Errors:  ${errorCount}`);
  console.log(`   Warnings: ${warnCount}`);

  if (errorCount > 0) {
    console.error('❌ Audit Failed! Please fix critical SEO errors.');
    process.exit(1);
  } else {
    console.log('✅ Audit Passed!');
  }
}

auditBuild();
