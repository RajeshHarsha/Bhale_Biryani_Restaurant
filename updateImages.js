const fs = require('fs');

const text = fs.readFileSync('menu_text.txt', 'utf-8');
const lines = text.split('\n').map(l => l.trim());

const items = [];
let currentCategory = 'biryani';

const makeId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const existingIds = new Set();

const getImageFor = (name, cat) => {
  const n = name.toLowerCase();
  
  if (n.includes('mutton') && n.includes('biryani')) return 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80';
  if (n.includes('prawn') && n.includes('biryani')) return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80';
  if (n.includes('egg') && n.includes('biryani')) return 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80';
  if (n.includes('biryani')) return 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=500&q=80';
  
  if (n.includes('noodle')) return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80';
  if (n.includes('soup')) return 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80';
  if (n.includes('prawn') || n.includes('loose prawn')) return 'https://images.unsplash.com/photo-1559742811-822873691df8?w=500&q=80';
  if (cat === 'rice' || n.includes('rice')) return 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80';
  
  if (n.includes('chilli') || n.includes('manchuri') || n.includes('dragon')) return 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&q=80';
  if (n.includes('wings') || n.includes('lollypop')) return 'https://images.unsplash.com/photo-1524114664604-cd8133cd67bf?w=500&q=80';
  if (n.includes('curry') || n.includes('masala')) return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80';
  if (n.includes('fry') || n.includes('pakoda') || n.includes('65') || n.includes('555')) return 'https://images.unsplash.com/photo-1599487405270-ed07cb129c78?w=500&q=80';
  
  if (n.includes('egg') || n.includes('bhurji') || n.includes('boiled')) return 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=500&q=80';

  return 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80';
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.match(/^[A-Za-z\s]+\(\d+\)$/)) {
    const catName = line.split('(')[0].trim().toLowerCase();
    if (catName.includes('starters')) currentCategory = 'sides';
    else if (catName.includes('rice') || catName.includes('fried rice')) currentCategory = 'rice';
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
      image: getImageFor(name, currentCategory),
      category: currentCategory,
      popular: existingIds.size < 8, 
      available: true
    });
  }
}

const updatedFile = `import { MenuItem } from "./types";

export const defaultMenuItems: MenuItem[] = ${JSON.stringify(items, null, 2)};
`;

fs.writeFileSync('lib/menu-data.ts', updatedFile);
console.log("Extracted " + items.length + " items with internet images and saved to lib/menu-data.ts");
