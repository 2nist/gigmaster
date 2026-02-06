/**
 * Create Template Assets
 *
 * Generates 512x512 PNG template files with guide lines for artists.
 * Each template shows outlines and center guides for drawing each asset type.
 *
 * Usage: node scripts/createTemplateAssets.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, '../public/avatar/templates');

const size = 512;
const centerX = size / 2;
const centerY = size / 2;

function drawCenterGuides(ctx) {
  ctx.strokeStyle = '#FF0000';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);

  // Vertical line
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, size);
  ctx.stroke();

  // Horizontal line
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(size, centerY);
  ctx.stroke();

  ctx.setLineDash([]);
}

function createTemplateImage(category) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Transparent background
  ctx.clearRect(0, 0, size, size);

  // Draw center guides
  drawCenterGuides(ctx);

  // Draw category-specific guide lines
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;

  switch (category) {
    case 'heads':
      // Large oval for head
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 150, 180, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case 'eyes':
      // Two almond-shaped eyes
      ctx.beginPath();
      ctx.ellipse(centerX - 50, centerY - 30, 20, 10, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(centerX + 50, centerY - 30, 20, 10, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case 'noses':
      // Small triangle for nose
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 20);
      ctx.lineTo(centerX - 10, centerY + 20);
      ctx.lineTo(centerX + 10, centerY + 20);
      ctx.closePath();
      ctx.stroke();
      break;

    case 'mouths':
      // Horizontal line for mouth
      ctx.beginPath();
      ctx.moveTo(centerX - 40, centerY + 50);
      ctx.lineTo(centerX + 40, centerY + 50);
      ctx.stroke();
      break;

    case 'hair':
      // Arc for hair outline
      ctx.beginPath();
      ctx.arc(centerX, centerY - 100, 150, Math.PI, 0, false);
      ctx.stroke();
      break;

    case 'facialHair':
      // Beard area
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 80, 80, 40, 0, 0, Math.PI);
      ctx.stroke();
      break;

    case 'accessories':
      // Generic accessory area
      ctx.beginPath();
      ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case 'shading':
      // Shading area
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 100, 80, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      break;

    case 'paper':
      // Full area
      ctx.strokeRect(10, 10, size - 20, size - 20);
      break;
  }

  // Add label
  ctx.fillStyle = '#000000';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${category.toUpperCase()} TEMPLATE`, centerX, size - 20);

  return canvas.toBuffer('image/png');
}

function createTemplateAssets() {
  console.log('🎨 Creating template PNG files...\n');

  // Create templates directory
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
    console.log(`📁 Created directory: templates/`);
  }

  const categories = ['heads', 'eyes', 'noses', 'mouths', 'hair', 'facialHair', 'accessories', 'shading', 'paper'];

  for (const category of categories) {
    const filePath = path.join(templatesDir, `${category}_template.png`);

    try {
      const imageBuffer = createTemplateImage(category);
      fs.writeFileSync(filePath, imageBuffer);
      console.log(`✅ Created: templates/${category}_template.png`);
    } catch (error) {
      console.error(`❌ Error creating ${category}_template.png:`, error.message);
    }
  }

  console.log('\n📊 All template PNGs created successfully!');
  console.log('\n📝 Guide:');
  console.log('   - Red dashed lines: Center alignment guides');
  console.log('   - Black solid lines: Asset outline guides');
  console.log('   - Draw your assets within these boundaries');
  console.log('   - Keep center at (256, 256) for proper alignment');
}

// Check if canvas package is available
try {
  createTemplateAssets();
} catch (error) {
  if (error.message.includes('canvas')) {
    console.error('❌ Error: "canvas" package not installed.');
    console.error('   Install with: npm install canvas');
  } else {
    throw error;
  }
}