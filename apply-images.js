const fs = require('fs');

const csvData = fs.readFileSync('c:/Users/rajes/Downloads/FoodItem-ImageURL-ImageID.csv', 'utf8');
const lines = csvData.split('\n').filter(Boolean).slice(1); // skip header
const mapping = {};

for (const line of lines) {
  const parts = line.split('","');
  if (parts.length >= 2) {
    const name = parts[0].replace(/"/g, '').trim();
    const url = parts[1].replace(/"/g, '').trim();
    mapping[name] = url;
  }
}

let menuData = fs.readFileSync('lib/menu-data.ts', 'utf8');

// Remove import statements for local images
menuData = menuData.replace(/^import\s+.*?from\s+['"]\.\.\/public\/images\/.*?['"];\s*$/gm, '');

for (const [name, url] of Object.entries(mapping)) {
  const escapedName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`("name"\\s*:\\s*"${escapedName}"[\\s\\S]*?"image"\\s*:\\s*)(?:".*?"|[^,]*)(,|\\n)`, 'g');
  menuData = menuData.replace(regex, `$1"${url}"$2`);
}

fs.writeFileSync('lib/menu-data.ts', menuData);
console.log('Updated menu-data.ts with image URLs from CSV.');
