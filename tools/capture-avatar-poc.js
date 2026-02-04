#!/usr/bin/env node
/**
 * Capture an avatar snapshot from the Phaser PoC page using Playwright.
 * Usage: node tools/capture-avatar-poc.js [--url=http://localhost:5173/gigmaster/?poc=avatar] [--out=screenshots/avatar-poc.png]
 */
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const argv = process.argv.slice(2);
const urlArg = argv.find(a => a.startsWith('--url='));
const outArg = argv.find(a => a.startsWith('--out='));
const timeoutArg = argv.find(a => a.startsWith('--timeout='));
const url = urlArg ? urlArg.split('=')[1] : 'http://localhost:5173/gigmaster/?poc=avatar';
const out = outArg ? outArg.split('=')[1] : path.join('screenshots', 'avatar-poc.png');
const waitTimeout = timeoutArg ? Number(timeoutArg.split('=')[1]) : (process.env.AVATAR_WAIT_MS ? Number(process.env.AVATAR_WAIT_MS) : 30000);

(async () => {
  try {
    // Ensure output dir
    fs.mkdirSync(path.dirname(out), { recursive: true });

    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1024, height: 800 } });
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => null);
    if (!res || res.status() >= 400) {
      console.error(`Unable to reach ${url}. Is the dev server running?`);
      await browser.close();
      process.exit(2);
    }

    // Snapshot full page (for debugging if avatar generation never happens)
    const fullPath = path.join('screenshots', `avatar-poc-full-${Date.now()}.png`);
    try { await page.screenshot({ path: fullPath, fullPage: true }); console.log(`Saved full page screenshot to ${fullPath}`); } catch (e) { /* ignore */ }

    // Wait for generated snapshot image to appear (img alt="Generated avatar")
    await page.waitForSelector('img[alt="Generated avatar"][src^="data:"]', { timeout: waitTimeout });
    const img = await page.$('img[alt="Generated avatar"]');
    if (!img) {
      console.error('Generated avatar image not found on page.');
      await browser.close();
      process.exit(3);
    }

    // Crop to the image's bounding box
    const box = await img.boundingBox();
    if (!box) {
      console.error('Could not determine bounding box of avatar image.');
      await browser.close();
      process.exit(4);
    }

    // Take a screenshot of that region
    await page.screenshot({ path: out, clip: { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) } });
    console.log(`Saved avatar screenshot to ${out}`);

    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Error capturing avatar PoC:', err);
    process.exit(1);
  }
})();