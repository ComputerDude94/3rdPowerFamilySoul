// Captures the JS-built content so it can be baked into the static HTML (better for search engines).
const { chromium } = require('playwright'); const fs = require('fs');
const IDS = ['show-list','songs-list','members','faq-list','community-list','about-text','story','book-contact','types'];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.route(/fonts\.(googleapis|gstatic)|ytimg/, r => r.abort());
  await p.goto(process.argv[2] || 'http://localhost:8787/'); await p.waitForTimeout(1200);
  const snap = await p.evaluate((ids) => Object.fromEntries(ids.map(id => [id, document.getElementById(id).innerHTML])), IDS);
  for (const k in snap) snap[k] = snap[k].replace(/class="([^"]*)"/g, (m, c) => `class="${c.split(/\s+/).filter(t => t && t !== 'in').join(' ')}"`);
  fs.writeFileSync(process.argv[3] || 'tools/out/snapshot.json', JSON.stringify(snap)); console.log('snapshot:', Object.keys(snap).map(k => k + ':' + snap[k].length).join(' '));
  await b.close();
})();
