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
// Support '=' in the URL by joining pieces after the first '='
const suppliedUrl = urlArg ? urlArg.split('=').slice(1).join('=') : (process.env.AVATAR_POC_URL || null);
// Default candidate URLs (try common Vite ports if none supplied)
const DEFAULT_PORTS = [5177, 5176, 5173];
const candidateUrls = suppliedUrl ? [suppliedUrl] : DEFAULT_PORTS.map(p => `http://localhost:${p}/gigmaster/?poc=avatar`);
const out = outArg ? outArg.split('=')[1] : path.join('screenshots', 'avatar-poc.png');
const waitTimeout = timeoutArg ? Number(timeoutArg.split('=')[1]) : (process.env.AVATAR_WAIT_MS ? Number(process.env.AVATAR_WAIT_MS) : 45000); // default 45s

console.log('Using candidate URLs:', candidateUrls);

(async () => {
  try {
    // Ensure output dir
    fs.mkdirSync(path.dirname(out), { recursive: true });

    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1024, height: 800 } });

    // Capture console, page errors and failed requests
    let consoleMessages = [];
    page.on('console', msg => {
      try {
        const args = msg.args ? msg.args().map(a => a.toString()) : [];
        consoleMessages.push({ type: msg.type(), text: msg.text(), args, location: msg.location() });
      } catch (err) {
        consoleMessages.push({ type: msg.type(), text: msg.text() });
      }
    });
    page.on('pageerror', err => {
      consoleMessages.push({ type: 'pageerror', text: err.message, stack: err.stack });
    });
    page.on('requestfailed', req => {
      consoleMessages.push({ type: 'requestfailed', url: req.url(), failure: req.failure() ? req.failure().errorText : null });
    });

    // Try each candidate URL until one successfully responds
    let res = null;
    let successfulUrl = null;
    for (const candidate of candidateUrls) {
      console.log(`Trying ${candidate} ...`);
      res = await page.goto(candidate, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => null);
      if (res && res.status && res.status() < 400) { successfulUrl = candidate; break; }
    }
    if (!res || !successfulUrl) {
      console.error(`Unable to reach any candidate URLs. Is the dev server running? Tried: ${candidateUrls.join(', ')}`);
      await browser.close();
      process.exit(2);
    }
    console.log(`Loaded ${successfulUrl}`);

    // Install RenderTexture snapshot interceptor to capture internal snapshot info
    await page.evaluate(() => {
      try {
        const proto = (window.Phaser && window.Phaser.GameObjects && window.Phaser.GameObjects.RenderTexture && window.Phaser.GameObjects.RenderTexture.prototype) || (window.Phaser && window.Phaser.RenderTexture && window.Phaser.RenderTexture.prototype);
        if (proto && !proto.__snapshotWrapped) {
          const orig = proto.snapshot;
          proto.snapshot = function(cb) {
            window.__rt_snapshot_called = true;
            return orig.call(this, (img) => {
              try {
                if (img && img.src) {
                  window.__rt_snapshot_src = img.src;
                } else if (img && img.toDataURL) {
                  window.__rt_snapshot_src = img.toDataURL();
                } else {
                  window.__rt_snapshot_src = null;
                }
              } catch (err) {
                window.__rt_snapshot_error = (err && err.message) || String(err);
              }
              if (typeof cb === 'function') cb(img);
            });
          };
          proto.__snapshotWrapped = true;
        }
      } catch (e) {
        window.__rt_snapshot_error = (e && e.message) || String(e);
      }
    });

    // Snapshot full page (for debugging if avatar generation never happens)
    const fullPath = path.join('screenshots', `avatar-poc-full-${Date.now()}.png`);
    try { await page.screenshot({ path: fullPath, fullPage: true }); console.log(`Saved full page screenshot to ${fullPath}`); } catch (e) { /* ignore */ }

    // Poll for available snapshot data: DOM img, RT flags, or canvas data URLs
    const start = Date.now();
    let found = null;
    while (Date.now() - start < waitTimeout) {
      const r = await page.evaluate(() => {
        const imgEl = document.querySelector('img[alt="Generated avatar"][src^="data:"]');
        if (imgEl) return { type: 'img', src: imgEl.src };
        if (window.__rt_snapshot_immediate_src) return { type: 'immediate', src: window.__rt_snapshot_immediate_src };
        if (window.__rt_snapshot_src) return { type: 'rt', src: window.__rt_snapshot_src };
        const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({ width: c.width, height: c.height, preview: (c.toDataURL ? c.toDataURL().slice(0,128) : null) }));
        return { type: 'none', canvases };
      });
      if (r && (r.src || (r.canvases && r.canvases.length && r.canvases.some(c => c.preview)))) { found = r; break; }
      await new Promise(r => setTimeout(r, 250));
    }

    if (!found) {
      console.error('Timed out waiting for avatar snapshot data (no img, RT flag, or canvas data).');
      await browser.close();
      process.exit(3);
    }

    // If we have a src from RT or immediate flags but no DOM img, inject one so we can crop it
    if ((found.type === 'immediate' || found.type === 'rt') && found.src) {
      await page.evaluate((src) => {
        const existing = document.querySelector('img[alt="Generated avatar"]');
        if (existing) { existing.src = src; return; }
        const snapHdr = Array.from(document.querySelectorAll('h3')).find(h => h.textContent && h.textContent.trim() === 'Snapshot');
        const container = snapHdr ? snapHdr.parentElement : document.body;
        const img = document.createElement('img');
        img.alt = 'Generated avatar';
        img.src = src;
        img.style.maxWidth = '1024px';
        img.style.maxHeight = '1024px';
        img.style.objectFit = 'contain';
        container.appendChild(img);
      }, found.src);

      // wait for image to load
      try {
        await page.waitForFunction(() => {
          const i = document.querySelector('img[alt="Generated avatar"]');
          return i && i.complete && i.naturalWidth > 0;
        }, { timeout: 5000 });
      } catch (e) {
        console.warn('Injected avatar image did not finish loading before timeout. Proceeding to screenshot whatever is available.');
      }
    }

    // Locate the avatar image element (should now exist) or fallback to a canvas if needed
    let img = await page.$('img[alt="Generated avatar"]');
    let box = img ? await img.boundingBox() : null;

    if (!box) {
      // try to find the largest canvas as fallback
      const canvInfo = await page.$$eval('canvas', nodes => nodes.map((n, i) => ({ index: i, w: n.width, h: n.height })));
      if (canvInfo && canvInfo.length) {
        const largest = canvInfo.reduce((a,b)=> (b.w*b.h > a.w*a.h ? b : a), canvInfo[0]);
        const canvasHandle = (await page.$$('canvas'))[largest.index];
        box = canvasHandle ? await canvasHandle.boundingBox() : null;
      }
    }

    if (!box) {
      console.error('Could not determine bounding box of avatar image or canvas to crop. Saving full-page screenshot instead.');
      const fallbackPath = path.join('screenshots', `avatar-poc-fallback-${Date.now()}.png`);
      try { await page.screenshot({ path: fallbackPath, fullPage: true }); console.log(`Saved fallback full page screenshot to ${fallbackPath}`); } catch (e) { /* ignore */ }
    } else {
      // Take a screenshot of that region
      await page.screenshot({ path: out, clip: { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) } });
      console.log(`Saved avatar screenshot to ${out}`);
    }

    // Write collected console messages to debug log
    try {
      const logPath = path.join('screenshots', `avatar-poc-console-${Date.now()}.log`);
      fs.mkdirSync(path.dirname(logPath), { recursive: true });
      fs.writeFileSync(logPath, JSON.stringify({ url: successfulUrl, out, consoleMessages }, null, 2), 'utf8');
      console.log(`Saved console log to ${logPath}`);
    } catch (err) {
      console.warn('Failed to write console log:', err.message);
    }

    await browser.close();
    process.exit(0);
  } catch (err) {
    // Write logs if available when failing
    try {
      const failLogPath = path.join('screenshots', `avatar-poc-console-failed-${Date.now()}.log`);
      fs.mkdirSync(path.dirname(failLogPath), { recursive: true });
      fs.writeFileSync(failLogPath, JSON.stringify({ url: successfulUrl || candidateUrls[0], error: (err && err.message) || String(err), consoleMessages }, null, 2), 'utf8');
      console.log(`Saved failure console log to ${failLogPath}`);
    } catch (writeErr) {
      console.warn('Failed to write failure console log:', writeErr.message);
    }

    console.error('Error capturing avatar PoC:', err);
    process.exit(1);
  }
})();