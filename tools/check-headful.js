#!/usr/bin/env node
import { chromium } from 'playwright';

(async() => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  await page.goto('http://localhost:5176/gigmaster/?poc=avatar', { waitUntil: 'networkidle' });

  // Inject RT snapshot wrapper
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
    } catch (e) { window.__rt_snapshot_error = (e && e.message) || String(e); }
  });

  // Wait a bit and then print window flags
  for (let i=0;i<10;i++) {
    const flags = await page.evaluate(() => ({ called: !!window.__rt_snapshot_called, srcPresent: !!window.__rt_snapshot_src, error: window.__rt_snapshot_error || null }));
    console.log('RT flags:', flags);
    if (flags.called || flags.error) break;
    await new Promise(r => setTimeout(r, 500));
  }

  await browser.close();
  process.exit(0);
})();