/**
 * Convert Example SVG Assets to PNG
 *
 * Converts the example SVG files to 1024x1024 PNG files for use in the avatar system.
 * Uses the canvas library to render SVGs.
 *
 * Usage: node scripts/convertExampleAssets.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const size = 1024;
const assetsDir = path.join(__dirname, '../public/avatar/assets');

async function convertSvgToPng(svgPath, pngPath) {
  try {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, size, size);

    // Read SVG content
    const svgContent = fs.readFileSync(svgPath, 'utf8');

    // Create a data URL for the SVG
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;

    // Load the SVG as an image
    const img = await loadImage(svgDataUrl);

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0, size, size);

    // Write the PNG file
    const pngBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pngPath, pngBuffer);

    console.log(`✅ Converted: ${path.relative(__dirname, svgPath)} → ${path.relative(__dirname, pngPath)}`);
  } catch (error) {
    console.error(`❌ Error converting ${svgPath}:`, error.message);
  }
}

async function convertExampleAssets() {
  console.log('🎨 Converting example SVG assets to PNG...\n');

  const examples = [
    { category: 'heads', name: 'head_example_warm_medium' },
    { category: 'eyes', name: 'eye_example_neutral' },
    { category: 'noses', name: 'nose_example_neutral' },
    { category: 'mouths', name: 'mouth_example_neutral' },
    { category: 'hair', name: 'hair_example_messy' },
    { category: 'facialHair', name: 'facialHair_example_beard' },
    { category: 'accessories', name: 'accessory_example_glasses' }
  ];

  for (const example of examples) {
    const svgPath = path.join(assetsDir, example.category, `${example.name}.svg`);
    const pngPath = path.join(assetsDir, example.category, `${example.name}.png`);

    if (fs.existsSync(svgPath)) {
      await convertSvgToPng(svgPath, pngPath);
    } else {
      console.log(`⚠️  SVG not found: ${path.relative(__dirname, svgPath)}`);
    }
  }

  console.log('\n📊 Conversion complete!');
  console.log('\n📝 These PNG files can be used as reference examples for artists.');
  console.log('   They demonstrate the painterly style and quality level expected.');
}

// Run the conversion
convertExampleAssets().catch(console.error);