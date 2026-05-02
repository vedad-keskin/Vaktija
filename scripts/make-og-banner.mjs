/**
 * Builds public/assets/icons/banner.png at 1200×630 (Open Graph / Telegram preview ratio).
 * Logo + wordmark stay tight in the center so aggressive crops show less clipping.
 *
 * Run: npm run og-banner
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

/** Standard OG size (~1.91:1) — closer to crawler thumbnails than ultra-wide banners */
const W = 1200;
const H = 630;

async function main() {
  const logoPath = path.join(ROOT, 'public/assets/icons/logo-large.png');
  const outPath = path.join(ROOT, 'public/assets/icons/banner.png');

  const logoH = 220;
  const resizedLogo = await sharp(logoPath).resize({ height: logoH }).png().toBuffer();
  const lm = await sharp(resizedLogo).metadata();
  const lw = lm.width ?? 1;
  const lh = lm.height ?? 1;

  const gap = 32;
  const fontSize = 78;

  const textSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="110">
  <text x="0" y="85" font-family="Arial Black, Helvetica, system-ui, sans-serif"
        font-weight="900" font-size="${fontSize}" fill="#16181d" letter-spacing="0.02em">Vaktija</text>
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
      background: { r: 255, g: 255, b: 255 },
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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
