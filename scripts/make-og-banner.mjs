/**
 * Builds the social banner and browser/install icons from the shared logo.
 *
 * Run: npm run brand-assets
 */
import sharp from 'sharp';
import path from 'path';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

/** Standard OG size (~1.91:1) — closer to crawler thumbnails than ultra-wide banners */
const W = 1200;
const H = 630;

async function main() {
  const logoPath = path.join(ROOT, 'public/assets/icons/logo.png');
  const outPath = path.join(ROOT, 'public/assets/icons/banner.png');

  const logo = await sharp(logoPath).trim({ background: '#00000000' }).png().toBuffer();
  const logoH = 240;
  const resizedLogo = await sharp(logo).resize({ height: logoH }).png().toBuffer();
  const lm = await sharp(resizedLogo).metadata();
  const lw = lm.width ?? 1;
  const lh = lm.height ?? 1;

  const gap = 32;
  const fontSize = 90;

  const textSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="110">
  <text x="0" y="85" font-family="Georgia, serif"
        font-weight="700" font-size="${fontSize}" fill="#123d33">Vaktija</text>
</svg>`;

  let textRaster = await sharp(Buffer.from(textSvg)).png().toBuffer();
  textRaster = await sharp(textRaster).trim().png().toBuffer();
  const tm = await sharp(textRaster).metadata();
  const tw = tm.width ?? 1;
  const th = tm.height ?? 1;

  const groupW = lw + gap + tw;
  const groupH = Math.max(lh, th);

  const gx = Math.round((W - groupW) / 2);
  const gy = Math.round((H - groupH) / 2);

  await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: '#faf7ed',
    },
  })
    .composite([
      {
        input: resizedLogo,
        left: gx,
        top: gy + Math.round((groupH - lh) / 2),
      },
      {
        input: textRaster,
        left: gx + lw + gap,
        top: gy + Math.round((groupH - th) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  console.log(`Wrote ${outPath} (${groupW}px × ${groupH}px centred in ${W}×${H})`);

  let favicon;
  for (const [name, size, scale] of [
    ['favicon-16.png', 16, 0.85],
    ['favicon-32.png', 32, 0.85],
    ['apple-touch-icon.png', 180, 0.78],
    ['icon-192.png', 192, 0.78],
    ['icon-512.png', 512, 0.78],
    ['icon-maskable-512.png', 512, 0.58],
  ]) {
    const transparent = name.startsWith('favicon');
    const mark = await sharp(logo).resize({ height: Math.round(size * scale) }).png().toBuffer();
    const { width: markWidth, height: markHeight } = await sharp(mark).metadata();
    const left = Math.floor((size - markWidth) / 2);
    const top = Math.floor((size - markHeight) / 2);
    const layers = [];
    if (transparent) {
      const alpha = await sharp(mark).extractChannel('alpha').toBuffer();
      const outline = await sharp({ create: { width: markWidth, height: markHeight, channels: 3, background: '#faf7ed' } })
        .joinChannel(alpha).png().toBuffer();
      for (const x of [-1, 0, 1]) {
        for (const y of [-1, 0, 1]) {
          if (x || y) layers.push({ input: outline, left: left + x, top: top + y });
        }
      }
    }
    layers.push(transparent ? { input: mark, left, top } : { input: mark, gravity: 'centre' });
    const icon = await sharp({ create: { width: size, height: size, channels: 4, background: transparent ? '#00000000' : '#faf7ed' } })
      .composite(layers)
      .png()
      .toBuffer();
    const { width, height } = await sharp(icon).metadata();
    assert.equal(width, size);
    assert.equal(height, size);
    if (transparent) {
      const corner = await sharp(icon).extract({ left: 0, top: 0, width: 1, height: 1 }).ensureAlpha().raw().toBuffer();
      assert.equal(corner[3], 0);
    }
    await writeFile(path.join(ROOT, name.startsWith('favicon') || name.startsWith('apple') ? 'public' : 'public/assets/icons', name), icon);
    if (name === 'favicon-32.png') favicon = icon;
  }

  // ICO accepts PNG data as an image entry; this covers browsers requesting /favicon.ico directly.
  const icoHeader = Buffer.alloc(22);
  icoHeader.writeUInt16LE(1, 2);
  icoHeader.writeUInt16LE(1, 4);
  icoHeader[6] = icoHeader[7] = 32;
  icoHeader.writeUInt16LE(1, 10);
  icoHeader.writeUInt16LE(32, 12);
  icoHeader.writeUInt32LE(favicon.length, 14);
  icoHeader.writeUInt32LE(22, 18);
  await writeFile(path.join(ROOT, 'public/favicon.ico'), Buffer.concat([icoHeader, favicon]));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
