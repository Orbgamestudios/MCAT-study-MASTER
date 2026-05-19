// Hand-rolls a 180×180 PNG app icon for iOS "Add to Home Screen".
// Pure Node, no deps — uses zlib for the deflate stream and constructs PNG chunks by hand.
// Design: indigo→fuchsia diagonal gradient with a chunky white "M" — matches the
// in-app brand mark exactly.
//
// Run with:    node gen-icon.js
// Writes:      apple-touch-icon.png  (and icon-512.png for PWAs)

const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function makePng(width, height, pixels /* Uint8Array RGBA */) {
  const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // RGBA
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  // Add filter byte (0) at the start of each row.
  const stride = width * 4;
  const pxBuf = Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength);
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    pxBuf.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    SIG,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- palette ----
const ACCENT = [79, 70, 229];    // indigo-600
const ACCENT_2 = [217, 70, 239]; // fuchsia-500
const WHITE = [255, 255, 255];

function lerp(a, b, t) { return a + (b - a) * t; }
function lerpColor(c1, c2, t) {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
}

function renderIcon(size) {
  const px = new Uint8Array(size * size * 4);
  const inset = Math.round(size * 0.005); // tiny safe margin
  const radius = Math.round(size * 0.22); // generous rounding — iOS masks anyway, but desktop uses raw image

  // M parameters — chunky brand mark, centered.
  const mPad = size * 0.22;
  const mTop = size * 0.30;
  const mBot = size * 0.74;
  const mLeft = mPad;
  const mRight = size - mPad;
  const stroke = size * 0.10;
  const mid = (mLeft + mRight) / 2;
  // Diagonals: left diag goes from (mLeft, mTop) -> (mid, mBot - stroke/2)
  //            right diag goes from (mRight, mTop) -> (mid, mBot - stroke/2)

  function pointInRoundedRect(x, y) {
    const minX = inset, maxX = size - inset, minY = inset, maxY = size - inset;
    if (x < minX || x > maxX || y < minY || y > maxY) return false;
    // Inside rounded corners?
    const r = radius;
    if (x < minX + r && y < minY + r) {
      const dx = minX + r - x, dy = minY + r - y;
      return dx * dx + dy * dy <= r * r;
    }
    if (x > maxX - r && y < minY + r) {
      const dx = maxX - r - x, dy = minY + r - y;
      return dx * dx + dy * dy <= r * r;
    }
    if (x < minX + r && y > maxY - r) {
      const dx = minX + r - x, dy = maxY - r - y;
      return dx * dx + dy * dy <= r * r;
    }
    if (x > maxX - r && y > maxY - r) {
      const dx = maxX - r - x, dy = maxY - r - y;
      return dx * dx + dy * dy <= r * r;
    }
    return true;
  }

  function distToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(px - ax, py - ay);
    let t = ((px - ax) * dx + (py - ay) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }

  function pointInM(x, y) {
    if (y < mTop - stroke / 2 || y > mBot + stroke / 2) return false;
    // Left vertical
    if (distToSegment(x, y, mLeft, mTop, mLeft, mBot) <= stroke / 2) return true;
    // Right vertical
    if (distToSegment(x, y, mRight, mTop, mRight, mBot) <= stroke / 2) return true;
    // Left diagonal
    if (distToSegment(x, y, mLeft, mTop, mid, mBot - stroke * 0.3) <= stroke / 2) return true;
    // Right diagonal
    if (distToSegment(x, y, mRight, mTop, mid, mBot - stroke * 0.3) <= stroke / 2) return true;
    return false;
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Diagonal gradient based on (x + y) / (2*size)
      const t = (x + y) / (2 * size);
      let [r, g, b] = lerpColor(ACCENT, ACCENT_2, t);

      // M brand mark
      if (pointInM(x, y)) [r, g, b] = WHITE;

      // Mask to rounded rect for fallbacks (desktop / Android)
      const inside = pointInRoundedRect(x, y);
      px[idx + 0] = inside ? Math.round(r) : 0;
      px[idx + 1] = inside ? Math.round(g) : 0;
      px[idx + 2] = inside ? Math.round(b) : 0;
      px[idx + 3] = inside ? 255 : 0;
    }
  }
  return makePng(size, size, px);
}

const out180 = path.join(__dirname, 'apple-touch-icon.png');
const out512 = path.join(__dirname, 'icon-512.png');
fs.writeFileSync(out180, renderIcon(180));
fs.writeFileSync(out512, renderIcon(512));
console.log('Wrote', out180, fs.statSync(out180).size, 'bytes');
console.log('Wrote', out512, fs.statSync(out512).size, 'bytes');
