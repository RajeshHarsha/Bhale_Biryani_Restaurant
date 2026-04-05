const fs = require('fs');

const text = fs.readFileSync('menu_text.txt', 'utf-8');
const lines = text.split('\n').map(l => l.trim());

const items = [];
let currentCategory = 'biryani';

const makeId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const existingIds = new Set();

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.match(/^[A-Za-z\s]+\(\d+\)$/)) {
    const catName = line.split('(')[0].trim().toLowerCase();
    if (catName.includes('starters')) currentCategory = 'sides';
    else if (catName.includes('rice')) currentCategory = 'rice';
    else if (catName.includes('biryani')) currentCategory = 'biryani';
    else if (catName.includes('curries') || catName.includes('soups') || catName.includes('noodles')) currentCategory = 'sides'; 
    else currentCategory = 'extras';
    continue;
  }

  const match = line.match(/(?:Non-veg item\.\s*)?(.*?)\.\s*Costs:\s*(\d+)\s*rupees[,\.]\s*(?:Description:\s*(.*?)\s*)?Swipe/i);
  if (match) {
    const name = match[1].trim();
    const priceStr = match[2];
    const desc = match[3] ? match[3].trim() : name;
    
    let id = makeId(name);
    if (existingIds.has(id)) {
      id = id + '-' + Math.floor(Math.random()*1000);
    }
    existingIds.add(id);

    items.push({
      id: id,
      name: name,
      description: desc,
      originalPrice: parseInt(priceStr) + 40,
      price: parseInt(priceStr),
      image: "/images/placeholder.jpg",
      category: currentCategory,
      popular: items.length < 5,
      available: true
    });
  }
}

const currentFile = fs.readFileSync('lib/menu-data.ts', 'utf-8');

const updatedFile = `import { MenuItem } from "./types";

export const defaultMenuItems: MenuItem[] = ${JSON.stringify(items, null, 2)};
`;

fs.writeFileSync('lib/menu-data.ts', updatedFile);
console.log("Extracted " + items.length + " items and saved to lib/menu-data.ts");
