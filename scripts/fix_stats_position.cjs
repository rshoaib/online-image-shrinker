const fs = require('fs');
let ts = fs.readFileSync('src/components/ToolSelector.jsx', 'utf8');

// Check current state
const hasCounterInHeader = ts.includes('<StatsCounter />\n        <div className="hero-badge">');
const hasCounterOutside = ts.includes('<StatsCounter />\n\n      {/* Search/Filter Bar */}');

console.log('Counter inside header:', hasCounterInHeader);
console.log('Counter outside header:', hasCounterOutside);

if (hasCounterInHeader) {
  // Remove from inside header
  ts = ts.replace('<StatsCounter />\n        <div className="hero-badge">', '<div className="hero-badge">');
  console.log('Removed from header');
}

if (!hasCounterOutside) {
  // Place between header and search bar
  ts = ts.replace(
    '      {/* Search/Filter Bar */}',
    '      <StatsCounter />\n\n      {/* Search/Filter Bar */}'
  );
  console.log('Added between header and search');
}

fs.writeFileSync('src/components/ToolSelector.jsx', ts);
console.log('Done');
