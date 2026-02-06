#!/usr/bin/env node
/**
 * Light inspection of the Avatar PoC page: collects DOM snapshots and asset list
 * Usage: node tools/inspect-avatar-poc.js --url=http://localhost:5176/gigmaster/?poc=avatar --out=tools/inspect-output.json
 */
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const argv = process.argv.slice(2);
const urlArg = argv.find(a => a.startsWith('--url='));
const outArg = argv.find(a => a.startsWith('--out='));
// Support '=' in the URL by joining pieces after the first '='
const url = urlArg ? urlArg.split('=').slice(1).join('=') : 'http://localhost:5176/gigmaster/?poc=avatar';
const out = outArg ? outArg.split('=')[1] : path.join('tools', 'inspect-output.json');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

  const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => null);
  const pageUrl = page.url();

  // Collect simple diagnostics
  const networkResponses = [];
  const consoleMessages = [];
  const pageErrors = [];

  page.on('response', resp => {
    try {
      const url = resp.url();
      if (url.includes('/avatar/assets/') || url.includes('/avatar/templates/')) {
        networkResponses.push({ url, status: resp.status(), ok: resp.ok() });
      }
    } catch (e) {}
  });
  page.on('requestfailed', req => {
    try {
      const url = req.url();
      if (url.includes('/avatar/assets/') || url.includes('/avatar/templates/')) {
        networkResponses.push({ url, status: 'failed', failure: req.failure() ? req.failure().errorText : null });
      }
    } catch (e) {}
  });

  page.on('console', msg => {
    try {
      consoleMessages.push({ type: msg.type(), text: msg.text(), location: msg.location ? msg.location() : null });
    } catch (e) {}
  });

  page.on('pageerror', err => {
    try { pageErrors.push(String(err)); } catch (e) {}
  });

  const diagnostics = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img')).map(i => ({ src: i.src || i.getAttribute('src'), alt: i.alt }));
    const texts = document.body ? document.body.innerText.slice(0, 4000) : '';
    const scripts = Array.from(document.scripts).map(s => s.src || '[inline]');
    const errors = window.__avatar_errors || null;
    return { imgs, texts, scripts, title: document.title, errors };
  });
  diagnostics.pageUrl = pageUrl;
  diagnostics.gotoRespStatus = res ? res.status() : null;
  diagnostics.networkResponses = networkResponses;

  // Check for any RenderTexture snapshot intercept signals
  try {
    const rtSnapshot = await page.evaluate(() => ({
      called: !!window.__rt_snapshot_called,
      srcPresent: window.__rt_snapshot_src ? true : false,
      srcPreview: window.__rt_snapshot_src ? window.__rt_snapshot_src.slice(0, 200) : null,
      error: window.__rt_snapshot_error || null
    }));
    diagnostics.rtSnapshot = rtSnapshot;
  } catch (e) {
    diagnostics.rtSnapshot = { error: String(e) };
  }

  // Probe canvas-toDataURL directly to detect tainting / readback issues
  try {
    const canvasChecks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('canvas')).map((c, i) => {
        try {
          const d = c.toDataURL();
          return { index: i, width: c.width, height: c.height, dataUrlPreview: d ? d.slice(0, 200) : null };
        } catch (err) {
          return { index: i, width: c.width, height: c.height, error: String(err) };
        }
      });
    });
    diagnostics.canvasChecks = canvasChecks;
  } catch (e) {
    diagnostics.canvasChecks = { error: String(e) };
  }

  // Attempt to query for generated avatar img and other useful nodes
  const generatedImgSrc = await page.$eval('img[alt="Generated avatar"]', el => el.src).catch(() => null);
  const avatarContainerHtml = await page.$eval('div', el => el.outerHTML.slice(0, 4000)).catch(() => null);

  diagnostics.generatedImgSrc = generatedImgSrc;
  diagnostics.avatarContainerHtml = avatarContainerHtml;

  // Include console & page errors captured during run
  diagnostics.consoleMessages = consoleMessages;
  diagnostics.pageErrors = pageErrors;

  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ url, timestamp: Date.now(), diagnostics }, null, 2), 'utf8');

  console.log(`Wrote inspection output to ${out}`);

  await browser.close();
  process.exit(0);
})().catch(err => { console.error('Inspect failed:', err); process.exit(1); });