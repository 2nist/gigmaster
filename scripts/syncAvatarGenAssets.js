/**
 * Sync avatar-gen outputs into public/avatar/assets
 *
 * Usage:
 *  node scripts/syncAvatarGenAssets.js [--alpha] [--category <name>] [--dry-run]
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TOOLS_DIR = path.join(ROOT, 'tools', 'avatar-gen');
const OUTPUTS_DIR = path.join(TOOLS_DIR, 'outputs');
const DEST_ROOT = path.join(ROOT, 'public', 'avatar', 'assets');

const args = process.argv.slice(2);
const useAlpha = args.includes('--alpha');
const dryRun = args.includes('--dry-run');

const categoryIndex = args.indexOf('--category');
const onlyCategory = categoryIndex !== -1 ? args[categoryIndex + 1] : null;

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function listDirectories(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function listPngFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.png'));
}

async function copyCategory(categoryName) {
  const categoryDir = path.join(OUTPUTS_DIR, categoryName);
  if (!(await pathExists(categoryDir))) return { categoryName, copied: 0, skipped: true };

  const alphaDir = path.join(categoryDir, 'alpha');
  const sourceDir = useAlpha && (await pathExists(alphaDir)) ? alphaDir : categoryDir;
  const destDir = path.join(DEST_ROOT, categoryName);
  const pngFiles = await listPngFiles(sourceDir);

  if (!pngFiles.length) return { categoryName, copied: 0, skipped: true };

  if (!dryRun) {
    await fs.mkdir(destDir, { recursive: true });
  }

  let copied = 0;
  for (const file of pngFiles) {
    const src = path.join(sourceDir, file.name);
    const dest = path.join(destDir, file.name);
    if (!dryRun) {
      await fs.copyFile(src, dest);
    }
    copied += 1;
  }

  return { categoryName, copied, skipped: false };
}

async function run() {
  if (!(await pathExists(OUTPUTS_DIR))) {
    console.error(`Missing outputs directory: ${OUTPUTS_DIR}`);
    process.exitCode = 1;
    return;
  }

  const categories = onlyCategory
    ? [onlyCategory]
    : await listDirectories(OUTPUTS_DIR);

  if (!categories.length) {
    console.log('No output categories found.');
    return;
  }

  const results = [];
  for (const categoryName of categories) {
    const result = await copyCategory(categoryName);
    results.push(result);
  }

  const copiedTotal = results.reduce((sum, r) => sum + r.copied, 0);
  const skipped = results.filter((r) => r.skipped).map((r) => r.categoryName);

  console.log(`Avatar sync complete${dryRun ? ' (dry-run)' : ''}. Copied ${copiedTotal} PNGs.`);
  if (skipped.length) {
    console.log(`Skipped categories (no PNGs): ${skipped.join(', ')}`);
  }
}

run().catch((err) => {
  console.error('Avatar sync failed:', err);
  process.exit(1);
});
