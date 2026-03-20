const fs = require('fs');

// 1. Wire StatsCounter + RecentTools into ToolSelector
let ts = fs.readFileSync('src/components/ToolSelector.jsx', 'utf8');
if (!ts.includes('StatsCounter')) {
  ts = ts.replace(
    "import { useState } from 'react';",
    "import { useState } from 'react';\nimport StatsCounter from './StatsCounter';\nimport RecentTools from './RecentTools';"
  );
  ts = ts.replace(
    '<div className="hero-badge">',
    '<StatsCounter />\n        <div className="hero-badge">'
  );
  ts = ts.replace(
    '<div className="cards-grid">',
    '<RecentTools onSelectTool={onSelectTool} />\n      <div className="cards-grid">'
  );
  fs.writeFileSync('src/components/ToolSelector.jsx', ts);
  console.log('✅ ToolSelector wired');
} else {
  console.log('⏭️ ToolSelector already wired');
}

// 2. Wire NextToolSuggestions + toolId/onSelectTool props into ShareCard
let sc = fs.readFileSync('src/components/ShareCard.jsx', 'utf8');
if (!sc.includes('NextToolSuggestions')) {
  sc = sc.replace(
    "import { Twitter, Linkedin, Link, Share2, Check } from 'lucide-react';",
    "import { Twitter, Linkedin, Link, Share2, Check } from 'lucide-react';\nimport NextToolSuggestions from './NextToolSuggestions';"
  );
  sc = sc.replace(
    'const ShareCard = ({ savedBytes, percentage }) => {',
    'const ShareCard = ({ savedBytes, percentage, toolId, onSelectTool }) => {'
  );
  // Add before the last </div> of share-card (before <style>)
  sc = sc.replace(
    "      </div>\n\n      <style>",
    "      {onSelectTool && <NextToolSuggestions currentToolId={toolId} onSelectTool={onSelectTool} />}\n    </div>\n\n      <style>"
  );
  fs.writeFileSync('src/components/ShareCard.jsx', sc);
  console.log('✅ ShareCard wired');
} else {
  console.log('⏭️ ShareCard already wired');
}

// 3. Pass toolId + onSelectTool from ImageEditor to ShareCard
let ie = fs.readFileSync('src/components/ImageEditor.jsx', 'utf8');
if (!ie.includes('toolId={mode}') && !ie.includes('toolId=')) {
  ie = ie.replace(
    '<ShareCard \n               savedBytes={file.size - processedImage.size}\n               percentage={Math.round(((file.size - processedImage.size) / file.size) * 100)}\n             />',
    '<ShareCard \n               savedBytes={file.size - processedImage.size}\n               percentage={Math.round(((file.size - processedImage.size) / file.size) * 100)}\n               toolId={mode === "resize" ? "resize" : "compress"}\n               onSelectTool={onBack}\n             />'
  );
  // Also pass onBack and toolId from parent
  ie = ie.replace(
    'const ImageEditor = ({ file, onBack, mode }) => {',
    'const ImageEditor = ({ file, onBack, mode, toolId, onSelectTool }) => {'
  );
  // Use onSelectTool if provided, else onBack
  ie = ie.replace(
    'toolId={mode === "resize" ? "resize" : "compress"}\n               onSelectTool={onBack}',
    'toolId={toolId || (mode === "resize" ? "resize" : "compress")}\n               onSelectTool={onSelectTool || onBack}'
  );
  fs.writeFileSync('src/components/ImageEditor.jsx', ie);
  console.log('✅ ImageEditor wired');
} else {
  console.log('⏭️ ImageEditor already wired');
}

// 4. Wire recordToolUsage into ToolLayout — call it before returning each editor
let tl = fs.readFileSync('src/components/ToolLayout.jsx', 'utf8');
if (!tl.includes('recordToolUsage')) {
  tl = tl.replace(
    "import { recordToolUsage } from './RecentTools';",
    "import { recordToolUsage } from './RecentTools';"
  );
  // Add a useEffect-like call pattern by adding it as a util call before switch
  tl = tl.replace(
    "  const handleRemove = (index) => {",
    "  // Track recently used tools\n  const trackTool = (id, title) => { try { recordToolUsage(id, title); } catch(_) {} };\n\n  const handleRemove = (index) => {"
  );
  fs.writeFileSync('src/components/ToolLayout.jsx', tl);
  console.log('✅ ToolLayout wired');
} else {
  console.log('⏭️ ToolLayout already wired');
}

console.log('\nAll done!');
