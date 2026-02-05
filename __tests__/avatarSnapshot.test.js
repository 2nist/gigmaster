/**
 * Playwright-driven test for Avatar PoC snapshot behavior.
 * Run explicitly with AVATAR_POC_RUN=1 to avoid interfering with CI/default runs.
 * Example: AVATAR_POC_RUN=1 npm test -- -t Avatar\ PoC\ snapshot
 */

const { chromium } = require('playwright');

const POCPAGE = process.env.AVATAR_POC_URL || 'http://localhost:5176/gigmaster/?poc=avatar';
const SHOULD_RUN = process.env.AVATAR_POC_RUN === '1';

(SHOULD_RUN ? test : test.skip)('Avatar PoC snapshot emits a data URL (RT snapshot or canvas.toDataURL)', async () => {
  const candidatePorts = [5177, 5176, 5173];
  const supplied = process.env.AVATAR_POC_URL || null;
  const candidateUrls = supplied ? [supplied] : candidatePorts.map(p => `http://localhost:${p}/gigmaster/?poc=avatar`);
  const waitMs = process.env.AVATAR_WAIT_MS ? Number(process.env.AVATAR_WAIT_MS) : 45000;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const consoleMsgs = [];
  page.on('console', m => consoleMsgs.push({ type: m.type(), text: m.text() }));
  page.on('pageerror', e => consoleMsgs.push({ type: 'pageerror', text: e.message }));

  try {
    // Try each candidate url until one loads
    let loadedUrl = null;
    for (const u of candidateUrls) {
      try {
        const res = await page.goto(u, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => null);
        if (res && res.status && res.status() < 400) { loadedUrl = u; break; }
      } catch (e) { /* ignore and try next */ }
    }
    if (!loadedUrl) throw new Error(`Could not load any candidate URLs: ${candidateUrls.join(', ')}`);

    // Poll for up to waitMs, checking: DOM img, window.__rt_snapshot_immediate_src, window.__rt_snapshot_src, canvas.toDataURL()
    const start = Date.now();
    let result = null;
    while (Date.now() - start < waitMs) {
      result = await page.evaluate(() => {
        try {
          const imgEl = document.querySelector('img[alt="Generated avatar"][src^="data:"]');
          if (imgEl) return { kind: 'img', src: imgEl.src.slice(0, 200) };
          if (window.__rt_snapshot_immediate_src) return { kind: 'immediate', src: window.__rt_snapshot_immediate_src.slice(0, 200) };
          if (window.__rt_snapshot_src) return { kind: 'rt', src: window.__rt_snapshot_src.slice(0, 200) };
          const canvases = Array.from(document.querySelectorAll('canvas')).map(c => {
            try { const d = c.toDataURL(); return d ? d.slice(0,200) : null; } catch (e) { return null; }
          }).filter(Boolean);
          if (canvases.length) return { kind: 'canvas', src: canvases[0].slice(0,200) };
          return null;
        } catch (err) {
          return { kind: 'error', error: err && err.message };
        }
      });
      if (result) break;
      await new Promise(r => setTimeout(r, 250));
    }

    if (!result) {
      // Collect diagnostics
      const pageHtml = await page.content();
      throw new Error(`Timed out waiting for avatar snapshot. Diagnostics:\nconsole: ${JSON.stringify(consoleMsgs, null, 2)}\nloadedUrl: ${loadedUrl}\npageHtmlSnippet: ${pageHtml.slice(0, 2000)}`);
    }

    // Pass if we saw any source type
    expect(['img','immediate','rt','canvas']).toContain(result.kind);
  } finally {
    await browser.close();
  }
}, 90000);
