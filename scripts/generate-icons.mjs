import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const PUBLIC     = join(__dirname, '..', 'public');
const LOGO       = join(__dirname, '..', 'src', 'assets', 'gallery', 'logo.webp');

const buffer = readFileSync(LOGO);

await sharp(buffer).resize(180, 180, { fit: 'contain', background: { r: 13, g: 13, b: 13, alpha: 1 } }).png().toFile(join(PUBLIC, 'apple-touch-icon.png'));
console.log('apple-touch-icon.png');

await sharp(buffer).resize(180, 180, { fit: 'contain', background: { r: 13, g: 13, b: 13, alpha: 1 } }).png().toFile(join(PUBLIC, 'apple-touch-icon-precomposed.png'));
console.log('apple-touch-icon-precomposed.png');

await sharp(buffer).resize(192, 192, { fit: 'contain', background: { r: 13, g: 13, b: 13, alpha: 1 } }).png().toFile(join(PUBLIC, 'pwa-192x192.png'));
console.log('pwa-192x192.png');

await sharp(buffer).resize(512, 512, { fit: 'contain', background: { r: 13, g: 13, b: 13, alpha: 1 } }).png().toFile(join(PUBLIC, 'pwa-512x512.png'));
console.log('pwa-512x512.png');

const png32 = await sharp(buffer).resize(32, 32, { fit: 'contain', background: { r: 13, g: 13, b: 13, alpha: 1 } }).png().toBuffer();
const png16 = await sharp(buffer).resize(16, 16, { fit: 'contain', background: { r: 13, g: 13, b: 13, alpha: 1 } }).png().toBuffer();
const png48 = await sharp(buffer).resize(48, 48, { fit: 'contain', background: { r: 13, g: 13, b: 13, alpha: 1 } }).png().toBuffer();

function pngToIco(pngs) {
  const count = pngs.length;
  const headerSize = 6 + 16 * count;
  let offset = headerSize;
  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(count, 4);
  const entries = [];
  const images = [];
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    images.push(data);
    offset += data.length;
  }
  return Buffer.concat([dir, ...entries, ...images]);
}

const ico = pngToIco([
  { size: 16, data: png16 },
  { size: 32, data: png32 },
  { size: 48, data: png48 },
]);
writeFileSync(join(PUBLIC, 'favicon.ico'), ico);
console.log('favicon.ico');

await sharp(buffer).resize(32, 32, { fit: 'contain', background: { r: 13, g: 13, b: 13, alpha: 1 } }).png().toFile(join(PUBLIC, 'favicon-32x32.png'));
console.log('favicon-32x32.png');

await sharp(buffer).resize(16, 16, { fit: 'contain', background: { r: 13, g: 13, b: 13, alpha: 1 } }).png().toFile(join(PUBLIC, 'favicon-16x16.png'));
console.log('favicon-16x16.png');

const svgRounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0D0D0D"/>
  <image href="data:image/webp;base64,${buffer.toString('base64')}" x="6" y="6" width="52" height="52"/>
</svg>`;
writeFileSync(join(PUBLIC, 'favicon.svg'), svgRounded);
console.log('favicon.svg');

console.log('All icons generated.');
