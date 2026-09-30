import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve('next/package.json'))('sharp');
const directory = new URL('../public/artwork/', import.meta.url);
const files = (await readdir(directory)).filter((name) => name.endsWith('.webp'));
assert.ok(files.length > 0, 'No artwork found');

for (const name of files) {
  const file = fileURLToPath(new URL(name, directory));
  const image = sharp(file);
  const { data, info } = await image.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1254, `${name}: unexpected source width`);
  assert.equal(info.height, info.width, `${name}: artwork must be square`);
  let minX = info.width, minY = info.height, maxX = -1, maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const offset = (y * info.width + x) * info.channels;
      if ((data[offset] + data[offset + 1] + data[offset + 2]) / 3 < 128) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  assert.ok(maxX >= 0, `${name}: missing symbol`);
  const bounds = [minX / info.width, minY / info.height, (maxX + 1) / info.width, (maxY + 1) / info.height];
  for (const ratio of [1.68, 1.55, 1.36, 4 / 3, 1, 4 / 5]) {
    const visibleWidth = Math.min(1, ratio) / 1.04;
    const visibleHeight = Math.min(1, 1 / ratio) / 1.04;
    assert.ok(bounds[0] > (1 - visibleWidth) / 2 && bounds[2] < (1 + visibleWidth) / 2,
      `${name}: horizontal clipping at ${ratio}`);
    assert.ok(bounds[1] > (1 - visibleHeight) / 2 && bounds[3] < (1 + visibleHeight) / 2,
      `${name}: vertical clipping at ${ratio}`);
  }
  assert.ok(bounds[1] > 0.25 && bounds[3] < 0.75, `${name}: clipping in 2:1 social preview`);
  const thumbnail = await sharp(file).resize(104, 104).removeAlpha().raw().toBuffer();
  let darkPixels = 0;
  for (let i = 0; i < thumbnail.length; i += 3) {
    if ((thumbnail[i] + thumbnail[i + 1] + thumbnail[i + 2]) / 3 < 160) darkPixels++;
  }
  assert.ok(darkPixels > 50, `${name}: symbol disappears at 104px`);
  console.log(`${name}: crop, hover, social preview, and 104px checks passed`);
}
