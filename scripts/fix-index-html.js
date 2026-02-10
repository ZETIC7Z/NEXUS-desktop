const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../dist-web/index.html');

console.log(`Processing ${indexPath}...`);

try {
  let content = fs.readFileSync(indexPath, 'utf8');

  // Remove crossorigin attributes from script and link tags
  // This is necessary because Vite injects them by default, but they cause
  // CORS issues when loading assets via file:// protocol in Electron.
  const complexRegex = /<script[^>]*crossorigin[^>]*>|<link[^>]*crossorigin[^>]*>/g;

  let matchCount = 0;
  content = content.replace(
    /(<script|<link)([^>]*?)\s+crossorigin(?:="[^"]*")?([^>]*>)/gi,
    (match, tag, before, after) => {
      matchCount++;
      return `${tag}${before}${after}`;
    },
  );

  // Also clean up any double spaces that might have resulted
  content = content.replace(/\s{2,}/g, ' ');

  fs.writeFileSync(indexPath, content);
  console.log(`Successfully removed 'crossorigin' from ${matchCount} tags.`);
} catch (err) {
  console.error('Error processing index.html:', err);
  process.exit(1);
}
