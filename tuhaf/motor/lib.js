// Gece Nöbeti — çizim motoru yardımcıları
'use strict';
const W = 1080, H = 1920;

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const smooth = k => k * k * (3 - 2 * k);
const easeOut = k => 1 - Math.pow(1 - k, 3);
const easeIn = k => k * k * k;
const easeInOut = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const easeBack = k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };

function hex2rgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgba(h, a = 1) { const [r, g, b] = hex2rgb(h); return `rgba(${r},${g},${b},${a})`; }
function mix(h1, h2, k) {
  const a = hex2rgb(h1), b = hex2rgb(h2);
  const c = a.map((v, i) => Math.round(lerp(v, b[i], k)));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}

function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Ekran dışı tuval havuzu (parıltı katmanları için)
const _off = {};
function off(name, w = W, h = H) {
  let c = _off[name];
  if (!c || c.width !== w || c.height !== h) {
    c = _off[name] = document.createElement('canvas');
    c.width = w; c.height = h;
  }
  const x = c.getContext('2d');
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none';
  x.clearRect(0, 0, w, h);
  return [c, x];
}

// Gürültü (kamera titremesi, el kamerası salınımı)
function noise1(t, seed = 1) {
  return (Math.sin(t * 1.7 + seed) * 0.5 + Math.sin(t * 2.9 + seed * 2.3) * 0.3 + Math.sin(t * 5.3 + seed * 4.1) * 0.2);
}

function trUpper(s) { return s.toLocaleUpperCase('tr-TR'); }
function normWord(w) { return w.toLocaleLowerCase('tr-TR'); }
