// Gece Nöbeti — çizim parçaları (düz vektör, yumurta kafa karakterler)
'use strict';

const PAL = {
  gece:  { skyTop: '#070d1f', skyBot: '#16264a', sea: '#0b1830', seaBot: '#06101f', wave: '#1d3358', rock: '#141a24', rockHi: '#222c3a', fogC: '#9fb2cc', amb: 0 },
  firtina: { skyTop: '#2a3443', skyBot: '#55657a', sea: '#26364a', seaBot: '#141f2d', wave: '#41556f', rock: '#1b222c', rockHi: '#2e3a48', fogC: '#b9c4d2', amb: 0 },
  safak: { skyTop: '#5d6c80', skyBot: '#c9b9b4', sea: '#5a6b7f', seaBot: '#36465a', wave: '#8796a8', rock: '#2a313b', rockHi: '#414b57', fogC: '#d9dde4', amb: 0 },
  aksam: { skyTop: '#1d1d45', skyBot: '#e2774a', sea: '#2c2f52', seaBot: '#14162e', wave: '#8a5560', rock: '#16151f', rockHi: '#2a2632', fogC: '#d7a48c', amb: 0 },
};

// ---------- Gökyüzü, ay, bulut, yıldız
function drawSky(ctx, p, t, o = {}) {
  const hy = o.horizon ?? 1050;
  const g = ctx.createLinearGradient(0, 0, 0, hy);
  g.addColorStop(0, p.skyTop); g.addColorStop(1, p.skyBot);
  ctx.fillStyle = g; ctx.fillRect(-60, -60, W + 120, hy + 60);
  if (o.stars) {
    const R = mulberry32(7);
    for (let i = 0; i < 90; i++) {
      const x = R() * W, y = R() * hy * 0.7, s = R() * 2.2 + 0.6;
      const tw = 0.5 + 0.5 * Math.sin(t * (1 + R() * 2) + i);
      ctx.fillStyle = `rgba(230,236,255,${0.25 + 0.5 * tw * o.stars})`;
      ctx.fillRect(x, y, s, s);
    }
  }
  if (o.sun) { // akşam güneşi
    const { x, y, r } = o.sun;
    const gg = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
    gg.addColorStop(0, 'rgba(255,200,120,0.55)'); gg.addColorStop(1, 'rgba(255,140,80,0)');
    ctx.fillStyle = gg; ctx.fillRect(x - r * 5, y - r * 5, r * 10, r * 10);
    ctx.fillStyle = '#ffd38a'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  if (o.moon) {
    const { x, y, r, a = 1 } = o.moon;
    ctx.save(); ctx.globalAlpha = a;
    const gg = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 3.2);
    gg.addColorStop(0, 'rgba(220,228,255,0.18)'); gg.addColorStop(1, 'rgba(220,228,255,0)');
    ctx.fillStyle = gg; ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
    ctx.fillStyle = '#e9e4cf'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(160,150,120,0.35)';
    [[-.3, -.2, .18], [.25, .1, .13], [-.05, .35, .1], [.32, -.3, .08]].forEach(([dx, dy, rr2]) => {
      ctx.beginPath(); ctx.arc(x + dx * r, y + dy * r, rr2 * r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }
}

function cloudShape(ctx, x, y, s) {
  ctx.beginPath();
  ctx.ellipse(x, y, 120 * s, 34 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 50 * s, y - 18 * s, 52 * s, 40 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 30 * s, y - 30 * s, 62 * s, 50 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 85 * s, y - 6 * s, 44 * s, 30 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}
function drawClouds(ctx, t, o = {}) {
  const R = mulberry32(o.seed ?? 11);
  const n = o.n ?? 6;
  for (let i = 0; i < n; i++) {
    const s = 0.6 + R() * 1.1, y = (o.y0 ?? 120) + R() * (o.yr ?? 520), sp = (6 + R() * 10) * (o.speed ?? 1);
    let x = (R() * (W + 600) + t * sp) % (W + 600) - 300;
    ctx.fillStyle = o.color ?? 'rgba(25,40,75,0.85)';
    cloudShape(ctx, x, y, s);
  }
}

// ---------- Deniz
function drawSea(ctx, p, t, o = {}) {
  const hy = o.horizon ?? 1050, by = o.bottom ?? H + 60;
  const g = ctx.createLinearGradient(0, hy, 0, by);
  g.addColorStop(0, p.sea); g.addColorStop(1, p.seaBot);
  ctx.fillStyle = g; ctx.fillRect(-60, hy, W + 120, by - hy + 60);
  // dalga çizgileri (perspektif)
  const rough = o.rough ?? 1;
  ctx.strokeStyle = o.waveColor ?? p.wave;
  ctx.lineCap = 'round';
  let row = 0;
  for (let y = hy + 6; y < by; row++) {
    const k = (y - hy) / (by - hy);
    const gap = 6 + k * k * 120;
    ctx.lineWidth = 1.2 + k * 3.5;
    ctx.globalAlpha = 0.35 + 0.45 * k;
    const R = mulberry32(row * 31 + 3);
    const segs = 3 + Math.floor(R() * 4);
    for (let i = 0; i < segs; i++) {
      const L = (40 + R() * 160) * (0.4 + k * 1.6);
      const sp = (8 + R() * 18) * (0.5 + k) * rough * (row % 2 ? 1 : -1);
      let x = (R() * (W + 400) + t * sp) % (W + 400);
      if (x < 0) x += W + 400;
      x -= 200;
      const yy = y + Math.sin(t * 1.4 * rough + row + i) * (1 + k * 6) * rough;
      ctx.beginPath(); ctx.moveTo(x, yy);
      ctx.quadraticCurveTo(x + L / 2, yy - (2 + k * 7) * rough, x + L, yy);
      ctx.stroke();
    }
    y += gap;
  }
  ctx.globalAlpha = 1;
}

// Işık yansıması (deniz üstünde dikey parıltı)
function drawReflection(ctx, x, hy, h, a, color = '255,214,140') {
  if (a <= 0.01) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 14; i++) {
    const y = hy + 8 + i * (h / 14);
    const w = (30 + i * 9) * (0.7 + 0.3 * Math.sin(i * 1.7));
    ctx.fillStyle = `rgba(${color},${a * (1 - i / 14) * 0.5})`;
    ctx.fillRect(x - w / 2, y, w, 3 + i * 0.4);
  }
  ctx.restore();
}

// ---------- Yağmur
function drawRain(ctx, t, o = {}) {
  const R = mulberry32(o.seed ?? 5);
  const n = o.n ?? 140, a = o.a ?? 0.35, slant = o.slant ?? 0.18;
  ctx.strokeStyle = o.color ?? `rgba(200,215,240,${a})`;
  ctx.lineWidth = o.w ?? 2;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const x0 = R() * (W + 400) - 200, y0 = R() * H, sp = 1400 + R() * 900, L = 26 + R() * 34;
    const y = (y0 + t * sp) % (H + 100) - 50;
    const x = x0 + y * slant;
    ctx.moveTo(x, y); ctx.lineTo(x + L * slant, y + L);
  }
  ctx.stroke();
}

// ---------- Sis
function drawFog(ctx, t, o = {}) {
  const dens = o.d ?? 1;
  if (dens <= 0.01) return;
  const col = hex2rgb(o.color ?? '#9fb2cc');
  const layers = o.layers ?? [
    { y: 820, h: 420, n: 7, sp: 14, a: 0.20, r: 300 },
    { y: 1000, h: 500, n: 8, sp: 26, a: 0.24, r: 360 },
    { y: 1250, h: 700, n: 7, sp: 40, a: 0.22, r: 420 },
  ];
  layers.forEach((L, li) => {
    const R = mulberry32(100 + li * 17 + (o.seed ?? 0));
    for (let i = 0; i < L.n; i++) {
      const r = L.r * (0.7 + R() * 0.6);
      const span = W + r * 2;
      let x = (R() * span + t * L.sp * (o.speed ?? 1)) % span; x -= r;
      const y = L.y + (R() - 0.5) * L.h;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const a = L.a * dens * (0.6 + R() * 0.6);
      g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r * 0.55, r * 2, r * 1.1);
    }
  });
  if (o.veil) { // genel perde
    ctx.fillStyle = `rgba(${col},${o.veil * dens})`;
    ctx.fillRect(-60, -60, W + 120, H + 120);
  }
}

// ---------- Kayalık ada
function drawRocks(ctx, cx, y, w, p, o = {}) {
  const R = mulberry32(o.seed ?? 21);
  const pts = [];
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const k = i / n;
    const x = cx - w / 2 + k * w;
    const hh = Math.sin(k * Math.PI) * (o.h ?? 120) * (0.75 + R() * 0.5);
    pts.push([x, y - hh]);
  }
  ctx.fillStyle = p.rock;
  ctx.beginPath(); ctx.moveTo(cx - w / 2 - 30, y + 40);
  pts.forEach(([x, yy]) => ctx.lineTo(x, yy));
  ctx.lineTo(cx + w / 2 + 30, y + 40); ctx.closePath(); ctx.fill();
  // üst yüzey parlaklıkları
  ctx.fillStyle = p.rockHi;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, yy] = pts[i];
    ctx.beginPath();
    ctx.moveTo(x - 30, yy + 6); ctx.lineTo(x, yy); ctx.lineTo(x + 40, yy + 10); ctx.lineTo(x + 10, yy + 22);
    ctx.closePath(); ctx.fill();
  }
  // köpük
  if (o.foam !== false) {
    const t = o.t ?? 0;
    ctx.fillStyle = 'rgba(220,232,245,0.55)';
    for (let i = 0; i < 12; i++) {
      const x = cx - w / 2 - 20 + i * (w + 40) / 11;
      const s = 10 + 8 * Math.sin(t * 2 + i * 1.3);
      ctx.beginPath(); ctx.ellipse(x, y + 26 + Math.sin(t * 1.6 + i) * 4, s * 2.4, s * 0.6, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
}

// ---------- Deniz feneri (beyaz sekizgen kule, siyah kuşak, kırmızı fener odası)
// x: kule merkezi, base: zemin y, h: kule yüksekliği (fener odası hariç), s: ölçek
// dönen: fener odasının merkezi {lx, ly}
function lighthouseGeom(x, base, h, s = 1) {
  const bw = 120 * s, tw = 82 * s;
  const top = base - h;
  return { x, base, h, s, bw, tw, top, lx: x, ly: top - 62 * s };
}
function drawLighthouse(ctx, g, o = {}) {
  const { x, base, h, s, bw, tw, top } = g;
  const shade = o.shade ?? 0;     // 0 gündüz/gece normal, 1 tam siluet
  const white = mix(o.white ?? '#e9e4d8', '#1a1f29', shade);
  const whiteD = mix(o.whiteD ?? '#c4beb0', '#11151c', shade);
  const band = mix('#22252b', '#0c0e12', shade);
  const red = mix(o.red ?? '#b8392b', '#2a0f0c', shade);
  // gövde (iki tonlu yüzey)
  ctx.fillStyle = white;
  ctx.beginPath(); ctx.moveTo(x - bw / 2, base); ctx.lineTo(x - tw / 2, top); ctx.lineTo(x + tw / 2, top); ctx.lineTo(x + bw / 2, base); ctx.closePath(); ctx.fill();
  ctx.fillStyle = whiteD;
  ctx.beginPath(); ctx.moveTo(x + bw * 0.12, base); ctx.lineTo(x + tw * 0.12, top); ctx.lineTo(x + tw / 2, top); ctx.lineTo(x + bw / 2, base); ctx.closePath(); ctx.fill();
  // kuşaklar: siyah tek kuşak ya da kırmızı çizgiler
  const wAt = y => lerp(tw, bw, (y - top) / h);
  const bands = o.stripes ? [[0.10, 0.23], [0.38, 0.51], [0.66, 0.79]] : [[0.42, 0.56]];
  ctx.fillStyle = o.stripes ? mix('#d2402f', '#2a0f0c', shade) : band;
  bands.forEach(([k1, k2]) => {
    const b1 = top + h * k1, b2 = top + h * k2;
    ctx.beginPath(); ctx.moveTo(x - wAt(b1) / 2, b1); ctx.lineTo(x + wAt(b1) / 2, b1); ctx.lineTo(x + wAt(b2) / 2, b2); ctx.lineTo(x - wAt(b2) / 2, b2); ctx.closePath(); ctx.fill();
  });
  // pencereler
  ctx.fillStyle = mix('#2b3446', '#0a0c10', shade);
  [0.22, 0.7].forEach(k => {
    const yy = top + h * k;
    rr(ctx, x - 9 * s, yy - 16 * s, 18 * s, 30 * s, 9 * s); ctx.fill();
  });
  if (o.winLit) {
    ctx.fillStyle = `rgba(255,205,120,${o.winLit})`;
    rr(ctx, x - 9 * s, top + h * 0.7 - 16 * s, 18 * s, 30 * s, 9 * s); ctx.fill();
  }
  // kapı
  ctx.fillStyle = mix('#3a2a1e', '#0d0a08', shade);
  rr(ctx, x - 18 * s, base - 62 * s, 36 * s, 62 * s, 16 * s); ctx.fill();
  // galeri (balkon)
  const gy = top;
  ctx.fillStyle = mix('#2a2d33', '#0b0c0f', shade);
  ctx.fillRect(x - tw / 2 - 26 * s, gy - 8 * s, tw + 52 * s, 12 * s);
  ctx.strokeStyle = mix('#2a2d33', '#0b0c0f', shade); ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(x - tw / 2 - 22 * s, gy - 34 * s); ctx.lineTo(x + tw / 2 + 22 * s, gy - 34 * s);
  for (let i = 0; i <= 8; i++) { const xx = x - tw / 2 - 22 * s + i * (tw + 44 * s) / 8; ctx.moveTo(xx, gy - 34 * s); ctx.lineTo(xx, gy - 8 * s); }
  ctx.stroke();
  // fener odası (cam)
  const lw = tw * 0.78, lh = 70 * s, ly0 = gy - 8 * s - lh;
  const lit = o.lit ?? 0;
  const glass = lit > 0 ? `rgba(255,${200 + 30 * lit},${120 + 60 * lit},${0.35 + 0.65 * lit})` : mix('#1b2433', '#07090c', shade);
  ctx.fillStyle = glass;
  ctx.fillRect(x - lw / 2, ly0, lw, lh);
  ctx.strokeStyle = mix('#1a1c20', '#060708', shade); ctx.lineWidth = 3 * s;
  ctx.strokeRect(x - lw / 2, ly0, lw, lh);
  ctx.beginPath(); ctx.moveTo(x - lw / 6, ly0); ctx.lineTo(x - lw / 6, ly0 + lh); ctx.moveTo(x + lw / 6, ly0); ctx.lineTo(x + lw / 6, ly0 + lh); ctx.stroke();
  // kubbe
  ctx.fillStyle = red;
  ctx.beginPath(); ctx.moveTo(x - lw / 2 - 10 * s, ly0); ctx.quadraticCurveTo(x, ly0 - 70 * s, x + lw / 2 + 10 * s, ly0); ctx.closePath(); ctx.fill();
  ctx.fillRect(x - 3 * s, ly0 - 64 * s, 6 * s, 16 * s);
  ctx.beginPath(); ctx.arc(x, ly0 - 66 * s, 7 * s, 0, Math.PI * 2); ctx.fill();
  g.ly = ly0 + lh / 2;
  return g;
}

// Dönen ışık huzmesi. phase: dönüş açısı (rad). Arkaya bakan huzmeyi kule önce, öne bakanı sonra çiz.
function beamParts(phase) {
  return [phase, phase + Math.PI].map(a => ({ a, dx: Math.sin(a), dz: Math.cos(a) }));
}
function drawBeam(ctx, lx, ly, b, o = {}) {
  const len = o.len ?? 1300, fog = o.fog ?? 0, k = o.k ?? 1;
  const side = Math.abs(b.dx);
  const L = len * (0.15 + 0.85 * side);
  const ex = lx + b.dx * L, ey = ly + (o.droop ?? 30) * side;
  const w0 = 14 * (o.s ?? 1), w1 = (90 + 320 * (1 - side) + fog * 160) * (o.s ?? 1);
  const a = (0.16 + 0.22 * fog) * k * (b.dz > 0 ? 1 : 0.55);
  const [c, x] = off('beam');
  const g = x.createLinearGradient(lx, ly, ex, ey);
  g.addColorStop(0, `rgba(255,226,160,${a * 1.6})`);
  g.addColorStop(0.5, `rgba(255,220,150,${a * 0.6})`);
  g.addColorStop(1, 'rgba(255,220,150,0)');
  x.fillStyle = g;
  const nx = -(ey - ly), ny = ex - lx, nl = Math.hypot(nx, ny) || 1;
  x.beginPath();
  x.moveTo(lx + nx / nl * w0, ly + ny / nl * w0);
  x.lineTo(ex + nx / nl * w1, ey + ny / nl * w1);
  x.lineTo(ex - nx / nl * w1, ey - ny / nl * w1);
  x.lineTo(lx - nx / nl * w0, ly - ny / nl * w0);
  x.closePath(); x.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.filter = `blur(${10 + fog * 18}px)`;
  ctx.drawImage(c, 0, 0);
  ctx.filter = 'none';
  ctx.restore();
}
// Fener camındaki parlama (huzme kameraya dönünce büyür)
function drawGlare(ctx, lx, ly, intensity, s = 1, fog = 0) {
  if (intensity <= 0.01) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const r = (60 + 260 * intensity + fog * 120) * s;
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, r);
  g.addColorStop(0, `rgba(255,240,200,${0.85 * intensity})`);
  g.addColorStop(0.25, `rgba(255,214,140,${0.45 * intensity})`);
  g.addColorStop(1, 'rgba(255,200,120,0)');
  ctx.fillStyle = g; ctx.fillRect(lx - r, ly - r, r * 2, r * 2);
  ctx.restore();
}
function lightRig(ctx, g, t, o = {}) {
  // o.on (0..1), o.speed (tur/sn), o.fog
  const on = o.on ?? 1;
  if (on <= 0) return { front: () => {} };
  const ph = (o.phase0 ?? 0) + t * Math.PI * 2 * (o.speed ?? 0.13);
  const parts = beamParts(ph);
  parts.filter(b => b.dz <= 0).forEach(b => drawBeam(ctx, g.lx, g.ly, b, { ...o, k: on, s: g.s }));
  return {
    front: () => {
      parts.filter(b => b.dz > 0).forEach(b => drawBeam(ctx, g.lx, g.ly, b, { ...o, k: on, s: g.s }));
      const facing = Math.max(...parts.map(b => b.dz));
      drawGlare(ctx, g.lx, g.ly, on * (0.25 + 0.75 * Math.pow(Math.max(0, facing), 6)), g.s, o.fog ?? 0);
    },
    facing: Math.max(...parts.map(b => b.dz)),
  };
}

// ---------- Ev, iskele, sandık, tekne
function drawHouse(ctx, x, base, s, p, o = {}) {
  const shade = o.shade ?? 0;
  ctx.fillStyle = mix('#cfc8b8', '#151920', shade);
  ctx.fillRect(x, base - 90 * s, 150 * s, 90 * s);
  ctx.fillStyle = mix('#8e3a2e', '#1a0d0b', shade);
  ctx.beginPath(); ctx.moveTo(x - 12 * s, base - 88 * s); ctx.lineTo(x + 75 * s, base - 140 * s); ctx.lineTo(x + 162 * s, base - 88 * s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = o.lit ? `rgba(255,200,110,${o.lit})` : mix('#2b3446', '#0a0c10', shade);
  ctx.fillRect(x + 22 * s, base - 64 * s, 30 * s, 28 * s);
  ctx.fillRect(x + 98 * s, base - 64 * s, 30 * s, 28 * s);
}
function drawPier(ctx, x1, x2, y, s, p, o = {}) {
  const shade = o.shade ?? 0;
  const wood = mix('#5b4130', '#120d0a', shade), woodD = mix('#3e2c20', '#0a0806', shade);
  ctx.fillStyle = woodD;
  for (let x = x1 + 20 * s; x < x2; x += 90 * s) ctx.fillRect(x, y, 12 * s, 90 * s);
  ctx.fillStyle = wood; ctx.fillRect(x1, y - 14 * s, x2 - x1, 16 * s);
  ctx.strokeStyle = woodD; ctx.lineWidth = 2;
  for (let x = x1; x < x2; x += 34 * s) { ctx.beginPath(); ctx.moveTo(x, y - 14 * s); ctx.lineTo(x, y + 2 * s); ctx.stroke(); }
}
function drawCrate(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = '#8a6a44'; ctx.fillRect(-36 * s, -28 * s, 72 * s, 56 * s);
  ctx.strokeStyle = '#5c4329'; ctx.lineWidth = 5 * s;
  ctx.strokeRect(-36 * s, -28 * s, 72 * s, 56 * s);
  ctx.beginPath(); ctx.moveTo(-36 * s, -28 * s); ctx.lineTo(36 * s, 28 * s); ctx.stroke();
  ctx.restore();
}
function drawBoat(ctx, x, y, s, o = {}) {
  const f = o.facing ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(f * s, s);
  ctx.rotate(Math.sin((o.t ?? 0) * 1.8) * 0.03);
  // gövde
  ctx.fillStyle = o.hull ?? '#9b3326';
  ctx.beginPath(); ctx.moveTo(-170, -20); ctx.lineTo(190, -20); ctx.lineTo(150, 40); ctx.lineTo(-150, 40); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e8e2d2'; ctx.fillRect(-170, -26, 360, 10);
  // kaptan köşkü
  ctx.fillStyle = '#d9d2c2'; ctx.fillRect(-90, -100, 110, 80);
  ctx.fillStyle = o.cabinLit ? '#ffd27a' : '#2b3446';
  ctx.fillRect(-78, -86, 34, 26); ctx.fillRect(-34, -86, 34, 26);
  // direk ve ışıklar
  ctx.strokeStyle = '#2a2d33'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(60, -20); ctx.lineTo(60, -170); ctx.stroke();
  ctx.restore();
  const lights = o.lights ?? 1;
  if (lights > 0) {
    const glow = (lx, ly, col, r) => {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, r);
      g.addColorStop(0, `rgba(${col},${0.95 * lights})`); g.addColorStop(0.2, `rgba(${col},${0.5 * lights})`); g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g; ctx.fillRect(lx - r, ly - r, r * 2, r * 2); ctx.restore();
    };
    glow(x + f * 60 * s, y - 172 * s, '255,248,225', 46 * s * (o.glowK ?? 1));
    glow(x + f * 170 * s, y - 30 * s, '255,70,60', 34 * s * (o.glowK ?? 1));
    glow(x - f * 150 * s, y - 30 * s, '70,255,140', 34 * s * (o.glowK ?? 1));
  }
}

// ---------- Ses halkaları (düdük)
function drawRings(ctx, x, y, age, o = {}) {
  // age: düdük başlangıcından beri geçen sn
  const n = o.n ?? 5, sp = o.sp ?? 420, life = o.life ?? 2.4, dir = o.dir ?? 0, spread = o.spread ?? 0.9;
  const col = o.color ?? '230,238,255';
  for (let i = 0; i < n; i++) {
    const a0 = age - i * 0.28;
    if (a0 < 0 || a0 > life) continue;
    const r = 30 + a0 * sp;
    const al = (1 - a0 / life) * (o.a ?? 0.7);
    ctx.strokeStyle = `rgba(${col},${al})`;
    ctx.lineWidth = (o.w ?? 7) * (1 - a0 / life * 0.6);
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (o.flat ?? 0.42), 0, dir - spread, dir + spread);
    ctx.stroke();
  }
}

// ---------- Sis düdüğü (pirinç boru)
function drawHorn(ctx, x, y, s, vib = 0) {
  ctx.save(); ctx.translate(x + Math.sin(vib * 90) * 2 * vib, y);
  ctx.scale(s, s);
  ctx.fillStyle = '#7b5a25';
  ctx.fillRect(-30, -10, 60, 60);
  const g = ctx.createLinearGradient(0, -60, 0, 40);
  g.addColorStop(0, '#e2b85a'); g.addColorStop(1, '#9a7230');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-20, -24); ctx.lineTo(120, -70); ctx.lineTo(120, 30); ctx.lineTo(-20, 4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5c4219'; ctx.beginPath(); ctx.ellipse(120, -20, 16, 50, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2d200c'; ctx.beginPath(); ctx.ellipse(122, -20, 10, 40, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
