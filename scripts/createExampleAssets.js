/**
 * Create Example Avatar Assets
 *
 * Generates simple but recognizable example avatar assets for artists to reference.
 * These are actual drawn elements (not just geometric shapes) that show expected style.
 *
 * Usage: node scripts/createExampleAssets.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '../public/avatar/assets');

const size = 512;
const centerX = size / 2;
const centerY = size / 2;

// Helper function to draw a simple eye
function drawEye(ctx, x, y, style = 'neutral') {
  ctx.save();
  ctx.translate(x, y);

  // Eye white
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(0, 0, 25, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Iris
  ctx.fillStyle = '#4A90E2';
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupil
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(0, 0, 6, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(-3, -3, 3, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyelid adjustments based on style
  if (style === 'tired') {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-25, -8);
    ctx.quadraticCurveTo(0, -12, 25, -8);
    ctx.stroke();
  } else if (style === 'wide') {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-25, -12);
    ctx.quadraticCurveTo(0, -18, 25, -12);
    ctx.stroke();
  }

  ctx.restore();
}

// Helper function to draw a simple mouth
function drawMouth(ctx, x, y, style = 'neutral') {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;

  if (style === 'smile') {
    ctx.beginPath();
    ctx.arc(0, 5, 20, 0, Math.PI, false);
    ctx.stroke();
  } else if (style === 'frown') {
    ctx.beginPath();
    ctx.arc(0, -5, 20, Math.PI, 0, true);
    ctx.stroke();
  } else if (style === 'open') {
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI, false);
    ctx.stroke();
    // Tongue
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.ellipse(0, 8, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Neutral
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
  }

  ctx.restore();
}

// Helper function to draw simple hair
function drawHair(ctx, x, y, style = 'neutral') {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#8B4513';
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 1;

  if (style === 'spiky') {
    // Spiky hair
    ctx.beginPath();
    ctx.moveTo(-30, -40);
    ctx.lineTo(-20, -60);
    ctx.lineTo(-10, -40);
    ctx.lineTo(0, -70);
    ctx.lineTo(10, -40);
    ctx.lineTo(20, -60);
    ctx.lineTo(30, -40);
    ctx.lineTo(20, -20);
    ctx.lineTo(-20, -20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (style === 'curly') {
    // Curly hair
    ctx.beginPath();
    ctx.arc(-25, -30, 15, Math.PI, 0, false);
    ctx.arc(-10, -30, 15, Math.PI, 0, false);
    ctx.arc(5, -30, 15, Math.PI, 0, false);
    ctx.arc(20, -30, 15, Math.PI, 0, false);
    ctx.lineTo(35, -15);
    ctx.lineTo(-35, -15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    // Neutral hair
    ctx.beginPath();
    ctx.ellipse(0, -35, 35, 25, 0, Math.PI, 0, false);
    ctx.lineTo(35, -10);
    ctx.lineTo(-35, -10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

// Helper function to draw a simple head shape
function drawHead(ctx, x, y, style = 'neutral') {
  ctx.save();
  ctx.translate(x, y);

  // Head shape
  ctx.fillStyle = '#FFDAB9';
  ctx.strokeStyle = '#D2B48C';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 40, 50, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Neck hint
  ctx.beginPath();
  ctx.rect(-8, 45, 16, 15);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Helper function to draw facial hair
function drawFacialHair(ctx, x, y, style = 'beard') {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#8B4513';
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 1;

  if (style === 'beard') {
    // Full beard
    ctx.beginPath();
    ctx.ellipse(0, 25, 25, 15, 0, 0, Math.PI);
    ctx.fill();
    ctx.stroke();
  } else if (style === 'mustache') {
    // Mustache
    ctx.beginPath();
    ctx.ellipse(-15, 15, 12, 8, 0, 0, Math.PI);
    ctx.ellipse(15, 15, 12, 8, 0, 0, Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

// Helper function to draw accessories
function drawAccessory(ctx, x, y, style = 'glasses') {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;

  if (style === 'glasses') {
    // Round glasses
    ctx.beginPath();
    ctx.arc(-20, 0, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(20, 0, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(5, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-35, 0);
    ctx.lineTo(-35, -20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(35, 0);
    ctx.lineTo(35, -20);
    ctx.stroke();
  } else if (style === 'headphones') {
    // Headphones
    ctx.beginPath();
    ctx.arc(0, -10, 25, Math.PI * 0.3, Math.PI * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-25, 0, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(25, 0, 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function createExampleAsset(category, filename, style) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Transparent background
  ctx.clearRect(0, 0, size, size);

  // Draw based on category
  switch (category) {
    case 'heads':
      drawHead(ctx, centerX, centerY, style);
      break;

    case 'eyes':
      if (style === 'pair') {
        drawEye(ctx, centerX - 40, centerY - 20, 'neutral');
        drawEye(ctx, centerX + 40, centerY - 20, 'neutral');
      } else {
        drawEye(ctx, centerX, centerY, style);
      }
      break;

    case 'mouths':
      drawMouth(ctx, centerX, centerY + 30, style);
      break;

    case 'hair':
      drawHair(ctx, centerX, centerY - 50, style);
      break;

    case 'facialHair':
      drawFacialHair(ctx, centerX, centerY + 20, style);
      break;

    case 'accessories':
      drawAccessory(ctx, centerX, centerY, style);
      break;

    case 'noses':
      // Simple nose
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 10);
      ctx.lineTo(centerX - 8, centerY + 15);
      ctx.moveTo(centerX, centerY - 10);
      ctx.lineTo(centerX + 8, centerY + 15);
      ctx.stroke();
      break;

    case 'shading':
      // Simple shading
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 20, 35, 25, 0, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'paper':
      // Paper texture hint
      ctx.fillStyle = '#F5F5DC';
      ctx.fillRect(10, 10, size - 20, size - 20);
      ctx.strokeStyle = '#D2B48C';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, size - 20, size - 20);
      break;
  }

  return canvas.toBuffer('image/png');
}

function createExampleAssets() {
  console.log('🎨 Creating example avatar assets...\n');

  const examples = [
    // Heads
    { category: 'heads', filename: 'head_light.png', style: 'neutral' },
    { category: 'heads', filename: 'head_medium.png', style: 'neutral' },

    // Eyes
    { category: 'eyes', filename: 'eyes_neutral_blue.png', style: 'pair' },
    { category: 'eyes', filename: 'eyes_wide_brown.png', style: 'wide' },
    { category: 'eyes', filename: 'eyes_tired_green.png', style: 'tired' },

    // Mouths
    { category: 'mouths', filename: 'mouth_smile.png', style: 'smile' },
    { category: 'mouths', filename: 'mouth_neutral.png', style: 'neutral' },
    { category: 'mouths', filename: 'mouth_frown.png', style: 'frown' },
    { category: 'mouths', filename: 'mouth_open.png', style: 'open' },

    // Hair
    { category: 'hair', filename: 'hair_spiky_black.png', style: 'spiky' },
    { category: 'hair', filename: 'hair_curly_red.png', style: 'curly' },
    { category: 'hair', filename: 'hair_neutral_blonde.png', style: 'neutral' },

    // Facial Hair
    { category: 'facialHair', filename: 'facialHair_beard_brown.png', style: 'beard' },
    { category: 'facialHair', filename: 'facialHair_mustache_black.png', style: 'mustache' },

    // Accessories
    { category: 'accessories', filename: 'accessory_glasses_round.png', style: 'glasses' },
    { category: 'accessories', filename: 'accessory_headphones_dj.png', style: 'headphones' },

    // Noses
    { category: 'noses', filename: 'nose_neutral.png', style: 'neutral' },

    // Shading
    { category: 'shading', filename: 'shading_soft.png', style: 'soft' },

    // Paper
    { category: 'paper', filename: 'paper_clean.png', style: 'clean' }
  ];

  for (const example of examples) {
    const categoryDir = path.join(assetsDir, example.category);
    const filePath = path.join(categoryDir, example.filename);

    try {
      const imageBuffer = createExampleAsset(example.category, example.filename, example.style);
      fs.writeFileSync(filePath, imageBuffer);
      console.log(`✅ Created: ${example.category}/${example.filename}`);
    } catch (error) {
      console.error(`❌ Error creating ${example.category}/${example.filename}:`, error.message);
    }
  }

  console.log('\n📊 Example assets created successfully!');
  console.log('\n📝 These are simple but recognizable examples showing:');
  console.log('   - Basic drawing techniques for each asset type');
  console.log('   - Proper sizing and positioning');
  console.log('   - Color palettes and styles');
  console.log('   - Layer compositing expectations');
  console.log('\n🎨 Use these as starting points for creating your own assets!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createExampleAssets().catch(console.error);
}

export { createExampleAssets };