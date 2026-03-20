const fs = require('fs');
let ts = fs.readFileSync('src/components/ToolSelector.jsx', 'utf8');

// Remove duplicate imports
const dupImport = "import StatsCounter from './StatsCounter';\nimport RecentTools from './RecentTools';\nimport StatsCounter from './StatsCounter';\nimport RecentTools from './RecentTools';";
const singleImport = "import StatsCounter from './StatsCounter';\nimport RecentTools from './RecentTools';";
if (ts.includes('StatsCounter') && ts.split('StatsCounter').length > 3) {
  ts = ts.replace(dupImport, singleImport);
  console.log('Removed duplicate imports');
}

// Wire JSX if not already done
if (!ts.includes('<StatsCounter />')) {
  ts = ts.replace('<div className="hero-badge">', '<StatsCounter />\n        <div className="hero-badge">');
  console.log('Added StatsCounter');
}
if (!ts.includes('<RecentTools')) {
  ts = ts.replace('<div className="cards-grid">', '<RecentTools onSelectTool={onSelectTool} />\n      <div className="cards-grid">');
  console.log('Added RecentTools');
}

fs.writeFileSync('src/components/ToolSelector.jsx', ts);
console.log('ToolSelector OK');
