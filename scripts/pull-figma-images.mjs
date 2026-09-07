/**
 * Pulls every image used in the Smira Club Figma file down into
 * public/img/figma/, so the site can use the real photography instead of the
 * placeholder scenery.
 *
 *   1. Make a Figma personal access token:
 *      Figma → your avatar → Settings → Security → Personal access tokens
 *      → Generate new token. File content: Read-only is enough.
 *
 *   2. Put it in .env.local (which is gitignored — never commit a token):
 *      FIGMA_TOKEN=figd_xxxxxxxxxxxxxxxx
 *
 *   3. npm run figma:pull
 *
 * It downloads the raw image fills, names them by their Figma reference, and
 * writes a contact sheet you can open to see what came down.
 */

import fs from 'node:fs';
import path from 'node:path';

const FILE_KEY = process.env.FIGMA_FILE_KEY || 'Kx1Xe97uW5pqTPP1jD2inb';
const OUT = path.join(process.cwd(), 'public', 'img', 'figma');

/** Reads FIGMA_TOKEN from the environment or straight out of .env.local. */
function readToken() {
  if (process.env.FIGMA_TOKEN) return process.env.FIGMA_TOKEN.trim();

  const envFile = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envFile)) {
    const line = fs
      .readFileSync(envFile, 'utf8')
      .split(/\r?\n/)
      .find((l) => l.startsWith('FIGMA_TOKEN='));
    if (line) return line.slice('FIGMA_TOKEN='.length).trim();
  }
  return null;
}

const token = readToken();

if (!token) {
  console.error(`
No Figma token found.

  1. Figma → avatar → Settings → Security → Personal access tokens
  2. Generate one with "File content: Read-only"
  3. Add it to .env.local:

       FIGMA_TOKEN=figd_your_token_here

  4. npm run figma:pull
`);
  process.exit(1);
}

const headers = { 'X-Figma-Token': token };

async function main() {
  console.log(`Reading the image fills in ${FILE_KEY}…`);

  const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/images`, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      res.status === 403
        ? 'Figma refused the token — check it is valid and can read this file.'
        : `Figma answered ${res.status}. ${body.slice(0, 200)}`
    );
  }

  const { meta } = await res.json();
  const images = meta?.images || {};
  const refs = Object.entries(images);

  if (!refs.length) {
    console.log('Figma returned no image fills for that file.');
    return;
  }

  fs.mkdirSync(OUT, { recursive: true });
  console.log(`Found ${refs.length}. Downloading…\n`);

  const saved = [];
  for (const [ref, url] of refs) {
    if (!url) continue;
    try {
      const img = await fetch(url);
      if (!img.ok) {
        console.log(`  skipped ${ref} — the link answered ${img.status}`);
        continue;
      }
      const type = img.headers.get('content-type') || '';
      const ext = type.includes('jpeg') ? 'jpg' : type.includes('svg') ? 'svg' : 'png';
      const name = `${ref.slice(0, 12)}.${ext}`;

      const buffer = Buffer.from(await img.arrayBuffer());
      fs.writeFileSync(path.join(OUT, name), buffer);
      saved.push({ name, kb: Math.round(buffer.length / 1024) });
      console.log(`  ${name.padEnd(20)} ${String(Math.round(buffer.length / 1024)).padStart(5)} KB`);
    } catch (err) {
      console.log(`  skipped ${ref} — ${err.message}`);
    }
  }

  // A contact sheet, so you can see at a glance what arrived.
  const sheet = `<!doctype html>
<meta charset="utf-8">
<title>Figma images — Smira Club</title>
<style>
  body { font: 14px system-ui; margin: 24px; background: #f4f6f8; }
  h1 { font-size: 18px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
  figure { margin: 0; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
  img { width: 100%; height: 160px; object-fit: cover; display: block; }
  figcaption { padding: 8px 10px; font-size: 12px; color: #5f6b7c; word-break: break-all; }
</style>
<h1>${saved.length} images pulled from Figma</h1>
<p>Tell Claude which of these belongs in each slot, or rename them yourself to match <code>public/img/MANIFEST.md</code>.</p>
<div class="grid">
${saved.map((s) => `  <figure><img src="./${s.name}" loading="lazy"><figcaption>${s.name} · ${s.kb} KB</figcaption></figure>`).join('\n')}
</div>
`;
  fs.writeFileSync(path.join(OUT, 'index.html'), sheet);

  console.log(`
${saved.length} images are in public/img/figma/

Open public/img/figma/index.html to see them, then tell me which goes where —
or drop them straight into public/img/ using the names in
public/img/MANIFEST.md and the site picks them up.
`);
}

main().catch((err) => {
  console.error(`\nCould not pull the images: ${err.message}`);
  process.exit(1);
});
