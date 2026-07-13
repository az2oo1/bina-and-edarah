// Generates public/favicon.ico and public/favicon.svg from the brand logo (src/lib/logo.ts).
// Google's favicon crawler cannot fetch data: URIs, so we emit real, fetchable files.
// Pure Node (zlib only) — no image libraries required.

import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 497" fill="currentColor" role="img" aria-label="Benaa &amp; Edara">
  <path d="M216.70 496.61 c-0.21 -0.32 -3.05 -2.79 -6.38 -5.52 -3.32 -2.73 -11.79 -9.75 -18.80 -15.64 -7.02 -5.89 -14.52 -12.11 -16.71 -13.88 l-3.91 -3.16 0 -95.41 0 -95.46 9.27 -9.64 c5.04 -5.30 15.70 -16.34 23.63 -24.59 7.88 -8.25 14.84 -15.05 15.38 -15.16 1.02 -0.16 1.02 2.89 1.02 139.39 l0 139.61 -1.55 0 c-0.91 0 -1.77 -0.27 -1.93 -0.54z"/>
  <path d="M253.39 339.75 l0 -157.39 7.66 -9.43 c17.68 -21.86 39.21 -47.57 39.80 -47.57 0.38 0 2.52 2.36 4.88 5.20 2.30 2.89 8.14 10.02 12.96 15.91 4.82 5.84 13.45 16.45 19.13 23.46 l10.39 12.80 0 157.23 0 157.18 -47.41 0 -47.41 0 0 -157.39z"/>
  <path d="M381.96 357.59 c0 -112.18 0.11 -139.55 0.70 -139.55 0.59 0 11.73 11.41 40.71 41.68 l7.34 7.61 0 95.57 0 95.57 -13.77 11.52 c-7.61 6.32 -18.05 15 -23.20 19.34 -6.05 5.04 -9.75 7.82 -10.55 7.82 l-1.23 0 0 -139.55z"/>
  <path d="M124.61 435.70 c-11.46 -11.73 -26.30 -26.84 -32.95 -33.64 -6.70 -6.75 -21.43 -21.86 -32.73 -33.48 -11.36 -11.63 -28.82 -29.52 -38.84 -39.80 -10.02 -10.23 -18.32 -18.86 -18.38 -19.13 -0.11 -0.32 5.57 -6.38 12.59 -13.55 7.02 -7.13 27 -27.54 44.36 -45.38 17.41 -17.84 42.11 -43.13 54.91 -56.25 43.34 -44.36 63.43 -64.98 92.14 -94.55 15.75 -16.18 33.54 -34.50 39.59 -40.71 6.11 -6.16 15.59 -15.96 21.21 -21.70 5.57 -5.73 14.79 -15.16 20.41 -20.89 5.68 -5.73 10.93 -11.25 11.73 -12.16 0.80 -0.96 1.71 -1.77 2.09 -1.77 0.38 0 2.57 1.98 4.93 4.39 5.84 6.11 80.57 82.93 93.16 95.79 5.63 5.73 18.64 19.13 28.93 29.73 10.34 10.61 29.84 30.64 43.39 44.46 26.09 26.68 76.13 77.89 106.93 109.55 10.23 10.45 19.34 19.93 20.30 21.05 l1.77 2.04 -7.18 7.34 c-3.96 4.02 -16.34 16.77 -27.54 28.23 -30.75 31.55 -86.46 88.55 -98.68 100.98 l-10.88 10.98 0 -47.30 0 -47.36 16.23 -16.61 c8.89 -9.11 20.95 -21.54 26.84 -27.54 l10.61 -10.98 -3.11 -3.32 c-1.71 -1.82 -7.23 -7.55 -12.21 -12.70 -5.04 -5.14 -17.95 -18.43 -28.66 -29.46 -10.77 -11.04 -24.86 -25.50 -31.39 -32.14 -6.48 -6.64 -21.96 -22.39 -34.29 -35.09 -12.38 -12.64 -39.32 -40.07 -59.95 -60.91 l-37.45 -37.93 -17.73 17.52 c-9.75 9.70 -24.48 23.95 -32.73 31.77 -22.93 21.64 -35.68 34.50 -119.46 120.54 -16.50 16.93 -32.36 33.27 -35.30 36.32 l-5.36 5.46 5.89 6.05 c3.21 3.27 15.11 15.48 26.46 27.11 11.36 11.57 20.79 21.38 21.05 21.75 0.21 0.43 0.32 21.86 0.27 47.68 l-0.16 46.98 -20.84 -21.38z"/>
</svg>`;

const FILL = [0x34, 0x50, 0x5e]; // LOGO_BRAND_COLOR #34505e

// ---- Parse SVG path `d` data (only M, c, l, z are used) ----
function parsePath(d) {
  const tokens = d.match(/[Mclz]|-?\d*\.?\d+/gi) || [];
  const paths = [];
  let cur = { x: 0, y: 0 };
  let start = { x: 0, y: 0 };
  let poly = [];
  let i = 0;
  while (i < tokens.length) {
    const cmd = tokens[i++];
    if (cmd === "M") {
      cur = { x: +tokens[i++], y: +tokens[i++] };
      start = { ...cur };
      poly = [cur];
    } else if (cmd === "l") {
      cur = { x: cur.x + +tokens[i++], y: cur.y + +tokens[i++] };
      poly.push(cur);
    } else if (cmd === "c") {
      const pts = [];
      for (let k = 0; k < 3; k++) pts.push({ x: cur.x + +tokens[i++], y: cur.y + +tokens[i++] });
      const p0 = cur, p1 = pts[0], p2 = pts[1], p3 = pts[2];
      const steps = 24;
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const mt = 1 - t;
        const x = mt*mt*mt*p0.x + 3*mt*mt*t*p1.x + 3*mt*t*t*p2.x + t*t*t*p3.x;
        const y = mt*mt*mt*p0.y + 3*mt*mt*t*p1.y + 3*mt*t*t*p2.y + t*t*t*p3.y;
        cur = { x, y };
        poly.push(cur);
      }
    } else if (cmd === "z") {
      poly.push({ ...start });
      paths.push(poly);
      poly = [];
    }
  }
  if (poly.length) paths.push(poly);
  return paths;
}

const PATHS = [...LOGO_SVG.matchAll(/<path d="([^"]+)"/g)].flatMap((m) => parsePath(m[1]));

// ---- Rasterize filled paths (nonzero winding) into an S x S RGBA buffer ----
function rasterize(S) {
  const buf = Buffer.alloc(S * S * 4); // transparent
  const scale = S / 600; // viewBox is 600 wide, 497 tall
  const offY = (S - 497 * scale) / 2;
  const edges = [];
  for (const poly of PATHS) {
    for (let k = 0; k < poly.length - 1; k++) {
      const a = poly[k], b = poly[k + 1];
      const x1 = a.x * scale, y1 = a.y * scale + offY;
      const x2 = b.x * scale, y2 = b.y * scale + offY;
      edges.push({ x1, y1, x2, y2, dir: Math.sign(y2 - y1) || 1 });
    }
  }
  for (let py = 0; py < S; py++) {
    const y = py + 0.5;
    const xs = [];
    const ds = [];
    for (const e of edges) {
      if ((e.y1 <= y && e.y2 > y) || (e.y2 <= y && e.y1 > y)) {
        const x = e.x1 + ((y - e.y1) / (e.y2 - e.y1)) * (e.x2 - e.x1);
        xs.push(x);
        ds.push(e.dir);
      }
    }
    const order = xs.map((x, idx) => idx).sort((a, b) => xs[a] - xs[b]);
    let wind = 0;
    const crossings = [];
    for (const idx of order) {
      wind += ds[idx];
      crossings.push({ x: xs[idx], wind });
    }
    for (let k = 0; k < crossings.length - 1; k++) {
      if (crossings[k].wind !== 0) {
        const xa = Math.max(0, Math.floor(crossings[k].x));
        const xb = Math.min(S - 1, Math.floor(crossings[k + 1].x));
        for (let px = xa; px <= xb; px++) {
          const o = (py * S + px) * 4;
          buf[o] = FILL[0];
          buf[o + 1] = FILL[1];
          buf[o + 2] = FILL[2];
          buf[o + 3] = 255;
        }
      }
    }
  }
  return buf;
}

// ---- PNG encoding (zlib only) ----
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function encodePNG(S, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(S, 0);
  ihdr.writeUInt32BE(S, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const raw = Buffer.alloc((S * 4 + 1) * S);
  for (let y = 0; y < S; y++) {
    raw[y * (S * 4 + 1)] = 0;
    rgba.copy(raw, y * (S * 4 + 1) + 1, y * S * 4, (y + 1) * S * 4);
  }
  const idat = deflateSync(raw);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---- ICO container wrapping PNG images ----
function encodeICO(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  const entries = [];
  let offset = 6 + count * 16;
  const images = [];
  for (const p of pngs) {
    const e = Buffer.alloc(16);
    e[0] = p.size >= 256 ? 0 : p.size;
    e[1] = p.size >= 256 ? 0 : p.size;
    e[2] = 0; // palette
    e[3] = 0;
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(p.data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    images.push(p.data);
    offset += p.data.length;
  }
  return Buffer.concat([header, ...entries, ...images]);
}

const SIZES = [16, 32, 48, 64, 128];
const pngs = SIZES.map((s) => ({ size: s, data: encodePNG(s, rasterize(s)) }));
writeFileSync(join(PUBLIC_DIR, "favicon.ico"), encodeICO(pngs));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 497" fill="#34505e" role="img" aria-label="Benaa &amp; Edara">${[
  ...LOGO_SVG.matchAll(/<path d="([^"]+)"/g),
].map((m) => `<path d="${m[1]}"/>`).join("")}</svg>`;
writeFileSync(join(PUBLIC_DIR, "favicon.svg"), svg);

console.log("Wrote favicon.ico and favicon.svg (" + SIZES.join(",") + "px)");
