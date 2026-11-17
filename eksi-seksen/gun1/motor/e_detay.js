// Eksi Seksen · Gün 1 — ayrıntılı çevreler: Ankara panoraması, çatı katı, mutfak, Kuğulu Park, Tunalı kafe,
// Kızılay sokağı, haber stüdyosu, çiftlik, ofis, giriş holü, akşam sofrası
'use strict';

const dk = (c, k) => mix(c, '#000000', k);
const lt_ = (c, k) => mix(c, '#ffffff', k);

// ======================================================================= ŞEHİR
function smokePlume(ctx, x, y, t, s = 1, a = 0.35, seed = 0) {
  for (let i = 0; i < 5; i++) {
    const ph = (t * 0.12 + i / 5 + seed * 0.37) % 1;
    ctx.fillStyle = `rgba(225,228,234,${a * (1 - ph)})`;
    ctx.beginPath(); ctx.ellipse(x + ph * 60 * s + Math.sin(t * 0.6 + i + seed) * 6 * s, y - ph * 140 * s, (8 + ph * 34) * s, (6 + ph * 22) * s, 0, 0, Math.PI * 2); ctx.fill();
  }
}

function drawBuildingD(ctx, x, base, w, h, o = {}) {
  const R = mulberry32(o.seed ?? 1);
  const col = o.col ?? '#cfc6b8';
  const night = o.night ?? 0;
  const fh = o.fh ?? 40, gh = o.gh ?? 0;
  ctx.fillStyle = col; ctx.fillRect(x, base - h, w, h + 2);
  ctx.fillStyle = dk(col, 0.13); ctx.fillRect(x + w * 0.87, base - h, w * 0.13, h + 2);
  ctx.fillStyle = dk(col, 0.22); ctx.fillRect(x - 3, base - h - 6, w + 6, 7);
  ctx.fillStyle = 'rgba(248,250,253,0.9)'; ctx.fillRect(x - 3, base - h - 8, w + 6, 3);
  if (R() < 0.75) { const tx = x + w * (0.12 + R() * 0.45); ctx.fillStyle = dk(col, 0.28); ctx.fillRect(tx, base - h - 24, w * 0.2, 18); ctx.fillStyle = 'rgba(248,250,253,0.85)'; ctx.fillRect(tx, base - h - 26, w * 0.2, 3); }
  if (R() < 0.6) { ctx.strokeStyle = dk(col, 0.4); ctx.lineWidth = 1.5; const ax = x + w * (0.6 + R() * 0.3); ctx.beginPath(); ctx.moveTo(ax, base - h - 6); ctx.lineTo(ax, base - h - 40); ctx.moveTo(ax - 8, base - h - 34); ctx.lineTo(ax + 8, base - h - 34); ctx.stroke(); }
  if (o.chimney !== false && R() < 0.8) {
    const cx = x + w * (0.2 + R() * 0.6);
    ctx.fillStyle = dk(col, 0.3); ctx.fillRect(cx, base - h - 22, 7, 16);
    if (o.t != null) smokePlume(ctx, cx + 3, base - h - 26, o.t, (o.smokeS ?? 0.5), o.smokeA ?? 0.3, o.seed ?? 0);
  }
  const floors = Math.max(1, Math.floor((h - gh - 6) / fh));
  const cols = o.cols ?? Math.max(2, Math.round(w / 38));
  const cw = w / cols;
  for (let f = 0; f < floors; f++) {
    const fy = base - gh - (f + 1) * fh;
    ctx.fillStyle = dk(col, 0.06); ctx.fillRect(x, fy + fh - 2, w, 2);
    for (let c = 0; c < cols; c++) {
      const wx = x + c * cw + cw * 0.2, ww = cw * 0.6, wy = fy + fh * 0.18, wh = fh * 0.6;
      const lit = night && R() < (o.lit ?? 0.55);
      ctx.fillStyle = lit ? mix('#ffd486', '#ffae55', R()) : (night ? mix('#141c2b', '#1f2a3f', R()) : mix('#73849c', '#a8b7ca', R()));
      ctx.fillRect(wx, wy, ww, wh);
      if (!night) { ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(wx, wy, ww * 0.35, wh); }
      else if (lit && R() < 0.5) { ctx.fillStyle = 'rgba(120,60,30,0.35)'; ctx.fillRect(wx, wy, ww * 0.28, wh); }
      ctx.strokeStyle = dk(col, 0.3); ctx.lineWidth = 1.2; ctx.strokeRect(wx, wy, ww, wh);
      ctx.fillStyle = 'rgba(250,252,255,0.85)'; ctx.fillRect(wx - 1, wy + wh, ww + 2, 2.2);
      if (o.ac && !night && R() < 0.12) { ctx.fillStyle = '#e8e8e6'; ctx.fillRect(wx + ww * 0.1, wy + wh + 3, ww * 0.6, fh * 0.16); }
    }
    if (o.balcony && f % 2 === 1) {
      ctx.fillStyle = dk(col, 0.18); ctx.fillRect(x + 4, fy + fh - 4, w - 8, 4);
      ctx.strokeStyle = dk(col, 0.45); ctx.lineWidth = 1.2;
      for (let bx = x + 6; bx < x + w - 6; bx += 6) { ctx.beginPath(); ctx.moveTo(bx, fy + fh - 4); ctx.lineTo(bx, fy + fh - 16); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(x + 4, fy + fh - 16); ctx.lineTo(x + w - 4, fy + fh - 16); ctx.stroke();
    }
  }
}

function drawAtakuleD(ctx, x, base, h, o = {}) {
  const col = o.col ?? '#6c778a', night = o.night ?? 0, t = o.t ?? 0;
  ctx.fillStyle = dk(col, 0.12); ctx.fillRect(x - 44, base - 26, 88, 26);
  const top = base - h * 0.78;
  const g = ctx.createLinearGradient(x - 16, 0, x + 16, 0);
  g.addColorStop(0, lt_(col, 0.18)); g.addColorStop(1, dk(col, 0.18));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 16, base - 26); ctx.lineTo(x + 16, base - 26); ctx.lineTo(x + 11, top); ctx.lineTo(x - 11, top); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.16)'; ctx.lineWidth = 1.4;
  for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(x + k * 7, base - 26); ctx.lineTo(x + k * 5, top); ctx.stroke(); }
  const hy = top - 8;
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - 11, top); ctx.lineTo(x - 44, hy - 18); ctx.lineTo(x + 44, hy - 18); ctx.lineTo(x + 11, top); ctx.closePath(); ctx.fill();
  ctx.fillStyle = night ? '#ffd27a' : '#a9bdd2'; ctx.fillRect(x - 48, hy - 42, 96, 24);
  ctx.strokeStyle = dk(col, 0.25); ctx.lineWidth = 1.4;
  for (let k = -44; k <= 44; k += 11) { ctx.beginPath(); ctx.moveTo(x + k, hy - 42); ctx.lineTo(x + k, hy - 18); ctx.stroke(); }
  ctx.fillStyle = col; ctx.fillRect(x - 50, hy - 46, 100, 5);
  ctx.beginPath(); ctx.ellipse(x, hy - 46, 46, 24, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.ellipse(x - 16, hy - 56, 14, 8, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = dk(col, 0.1); ctx.fillRect(x - 3, hy - 70 - h * 0.14, 6, h * 0.14 + 4);
  if (night && Math.sin(t * 3) > 0) { ctx.fillStyle = '#ff3b2f'; ctx.beginPath(); ctx.arc(x, hy - 72 - h * 0.14, 4, 0, Math.PI * 2); ctx.fill(); }
}

function drawKocatepe(ctx, x, base, s, col) {
  ctx.save(); ctx.translate(x, base); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.fillRect(-100, -62, 200, 62);
  ctx.beginPath(); ctx.ellipse(-64, -62, 36, 26, 0, Math.PI, 0); ctx.fill();
  ctx.beginPath(); ctx.ellipse(64, -62, 36, 26, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(-62, -78, 124, 16);
  ctx.beginPath(); ctx.ellipse(0, -78, 62, 52, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(-2, -150, 4, 22); ctx.beginPath(); ctx.arc(0, -152, 5, 0, Math.PI * 2); ctx.fill();
  [-150, -122, 122, 150].forEach(mx => {
    ctx.fillRect(mx - 5, -250, 10, 250);
    ctx.fillRect(mx - 9, -170, 18, 6); ctx.fillRect(mx - 9, -212, 18, 6);
    ctx.beginPath(); ctx.moveTo(mx - 6, -250); ctx.lineTo(mx, -292); ctx.lineTo(mx + 6, -250); ctx.closePath(); ctx.fill();
  });
  ctx.restore();
}

// Ankara manzarası (gündüz / gece). Pencerelerin içine çizilir.
function drawAnkaraView(ctx, x, y, w, h, t, o = {}) {
  const night = o.night ?? 0;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const hz = y + h * (o.horizon ?? 0.62);
  const g = ctx.createLinearGradient(0, y, 0, hz);
  if (night) { g.addColorStop(0, '#081120'); g.addColorStop(1, '#1b2a45'); }
  else { g.addColorStop(0, '#8fa3bd'); g.addColorStop(0.7, '#c9d3df'); g.addColorStop(1, '#e3e8ee'); }
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  if (!night) paleSun(ctx, x + w * (o.sunX ?? 0.72), y + h * (o.sunY ?? 0.2), (o.sunR ?? 34), 1);
  // uzak tepeler (Çankaya sırtları)
  ctx.fillStyle = night ? '#121c30' : '#aeb9c8';
  ctx.beginPath(); ctx.moveTo(x, hz - h * 0.06);
  for (let i = 0; i <= 10; i++) ctx.lineTo(x + w * i / 10, hz - h * (0.06 + 0.05 * Math.sin(i * 1.3 + 0.7) + 0.03 * Math.sin(i * 3.1)));
  ctx.lineTo(x + w, hz + 10); ctx.lineTo(x, hz + 10); ctx.closePath(); ctx.fill();
  // uzak siluetler
  const R = mulberry32(o.seed ?? 3);
  let bx = x - 10;
  while (bx < x + w) {
    const bw = 18 + R() * 40, bh = h * (0.04 + R() * 0.08);
    ctx.fillStyle = night ? '#172238' : '#a3afbf'; ctx.fillRect(bx, hz - bh, bw, bh + 4);
    if (night) { ctx.fillStyle = 'rgba(255,205,130,0.75)'; for (let k = 0; k < 4; k++) if (R() < 0.6) ctx.fillRect(bx + 3 + R() * (bw - 8), hz - bh + 4 + R() * (bh - 8), 2.5, 3); }
    bx += bw + 2;
  }
  // simgeler
  drawKocatepe(ctx, x + w * (o.kx ?? 0.3), hz - 2, h * 0.0011 * (o.ks ?? 1), night ? '#1d2a42' : '#8794a8');
  drawAtakuleD(ctx, x + w * (o.ax ?? 0.68), hz - h * 0.08, h * (o.ah ?? 0.5), { col: night ? '#25334f' : '#6f7c92', night, t });
  // orta plan: ayrıntılı apartmanlar
  const pal = ['#d9cfc0', '#c7c1b6', '#e3d9cb', '#cdb9a8', '#bfc5cc', '#d6c4b4'];
  const n = o.count ?? 9;
  for (let i = 0; i < n; i++) {
    const bw = w / n * (0.9 + R() * 0.5), bh = h * (1 - (o.horizon ?? 0.62)) * (0.55 + R() * 0.35) * (o.tall ?? 1);
    const bx2 = x + (i / n) * w - 20 + R() * 20;
    drawBuildingD(ctx, bx2, y + h + 4, bw, bh, {
      col: night ? dk(pal[i % pal.length], 0.72) : pal[i % pal.length], night, seed: (o.seed ?? 3) * 10 + i, fh: 26 + R() * 8, balcony: true, ac: true, t, smokeA: 0.28,
    });
  }
  // sis
  const hg = ctx.createLinearGradient(0, hz - h * 0.2, 0, y + h);
  hg.addColorStop(0, night ? 'rgba(20,30,50,0)' : 'rgba(235,240,246,0)'); hg.addColorStop(0.5, night ? 'rgba(30,40,60,0.25)' : 'rgba(235,240,246,0.35)'); hg.addColorStop(1, night ? 'rgba(10,15,25,0.2)' : 'rgba(225,232,240,0.15)');
  ctx.fillStyle = hg; ctx.fillRect(x, y, w, h);
  ctx.restore();
}

// ======================================================================= İÇ MEKÂN PARÇALARI
function woodFloor(ctx, y0, y1, o = {}) {
  const base = o.col ?? '#c8a47a';
  ctx.fillStyle = base; ctx.fillRect(-40, y0, W + 80, y1 - y0);
  const R = mulberry32(o.seed ?? 9);
  const rows = 14;
  for (let i = 0; i < rows; i++) {
    const ya = y0 + (y1 - y0) * (i / rows) ** 1.4, yb = y0 + (y1 - y0) * ((i + 1) / rows) ** 1.4;
    let px = -40 + R() * 200;
    while (px < W + 40) {
      const pw = 160 + R() * 260;
      ctx.fillStyle = mix(base, R() < 0.5 ? '#ffffff' : '#000000', R() * 0.08); ctx.fillRect(px, ya, pw, yb - ya);
      ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(px, ya, 2, yb - ya);
      px += pw;
    }
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-40, ya, W + 80, 2);
  }
  if (o.glow) {
    const g = ctx.createRadialGradient(o.glow[0], y0 + 40, 10, o.glow[0], y0 + 120, o.glow[1]);
    g.addColorStop(0, 'rgba(255,255,255,0.28)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(-40, y0, W + 80, y1 - y0);
  }
}

function drawPlantBig(ctx, x, base, s, t) {
  ctx.fillStyle = '#9a9690'; ctx.beginPath(); ctx.moveTo(x - 60 * s, base - 150 * s); ctx.lineTo(x + 60 * s, base - 150 * s); ctx.lineTo(x + 48 * s, base); ctx.lineTo(x - 48 * s, base); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(x + 20 * s, base - 150 * s, 40 * s, 150 * s);
  ctx.strokeStyle = '#4a3a2a'; ctx.lineWidth = 6 * s; ctx.beginPath(); ctx.moveTo(x, base - 150 * s); ctx.quadraticCurveTo(x - 10 * s, base - 400 * s, x + 10 * s, base - 620 * s); ctx.stroke();
  const leaves = [[-70, -260, -0.8], [60, -320, 0.7], [-60, -400, -0.6], [70, -450, 0.6], [-40, -530, -0.4], [40, -590, 0.4], [0, -650, 0]];
  leaves.forEach(([lx, ly, a], i) => {
    const sw = Math.sin(t * 0.8 + i) * 0.03;
    ctx.save(); ctx.translate(x + lx * s * 0.4, base + ly * s); ctx.rotate(a + sw);
    ctx.fillStyle = i % 2 ? '#2f5d3a' : '#3b6e45';
    ctx.beginPath(); ctx.ellipse(lx > 0 ? 50 * s : -50 * s, 0, 62 * s, 36 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(200,230,200,0.35)'; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(lx > 0 ? 100 * s : -100 * s, 0); ctx.stroke();
    ctx.restore();
  });
}

function drawPendant(ctx, x, y, s, on, col = '#b8893a') {
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, -10); ctx.lineTo(x, y - 40 * s); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, 60 * s, 46 * s, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = dk(col, 0.3); ctx.fillRect(x - 60 * s, y - 2, 120 * s, 6 * s);
  if (on) {
    ctx.fillStyle = '#fff4d6'; ctx.beginPath(); ctx.ellipse(x, y + 4, 30 * s, 10 * s, 0, 0, Math.PI * 2); ctx.fill();
    warmGlow(ctx, x, y + 120 * s, 340 * s, 0.35 * on, '255,200,120');
  }
}

function glassWall(ctx, x, y, w, h, t, o = {}) {
  drawAnkaraView(ctx, x, y, w, h, t, o.view ?? {});
  const panes = o.panes ?? 3;
  for (let i = 0; i < panes; i++) frostEdges(ctx, x + w * i / panes, y, w / panes, h, o.frost ?? 0.8, 40 + i);
  ctx.fillStyle = o.frame ?? '#1d2127';
  for (let i = 0; i <= panes; i++) ctx.fillRect(x + w * i / panes - 7, y - 4, 14, h + 8);
  ctx.fillRect(x - 7, y - 10, w + 14, 14); ctx.fillRect(x - 7, y + h - 4, w + 14, 14);
  if (o.night) {   // camda iç ışık yansımaları
    ctx.fillStyle = 'rgba(255,210,150,0.07)'; ctx.fillRect(x, y, w, h);
  }
}

function sheerCurtain(ctx, x, y, w, h, t) {
  for (let i = 0; i < 8; i++) {
    const fx = x + i * w / 8 + Math.sin(t * 0.4 + i) * 3;
    const g = ctx.createLinearGradient(fx, 0, fx + w / 8, 0);
    g.addColorStop(0, 'rgba(250,250,248,0.55)'); g.addColorStop(0.5, 'rgba(250,250,248,0.25)'); g.addColorStop(1, 'rgba(250,250,248,0.5)');
    ctx.fillStyle = g; ctx.fillRect(fx, y, w / 8 + 2, h);
  }
}

// ======================================================================= ÇATI KATI YATAK ODASI (sabah)
function drawBedroomLux(ctx, t, o = {}) {
  ctx.fillStyle = '#e9e6e1'; ctx.fillRect(0, 0, W, H);
  // tavan ve gömme spotlar
  ctx.fillStyle = '#f2f0ec'; ctx.fillRect(0, 0, W, 210);
  ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(0, 205, W, 6);
  [180, 540, 900].forEach(sx => { ctx.fillStyle = '#d9d6d0'; ctx.beginPath(); ctx.ellipse(sx, 120, 22, 8, 0, 0, Math.PI * 2); ctx.fill(); });
  glassWall(ctx, 0, 230, W, 1020, t, { view: { horizon: 0.66, ax: 0.7, kx: 0.28, seed: 5, sunX: 0.8, sunY: 0.16 }, frost: o.frost ?? 0.9 });
  sheerCurtain(ctx, -10, 220, 190, 1040, t);
  woodFloor(ctx, 1250, H + 20, { col: '#caa57a', glow: [540, 700] });
  // halı
  ctx.fillStyle = '#d9cdb8'; ctx.beginPath(); ctx.moveTo(140, 1520); ctx.lineTo(1100, 1520); ctx.lineTo(1160, 1860); ctx.lineTo(60, 1860); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(140,110,80,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(180, 1560); ctx.lineTo(1080, 1560); ctx.lineTo(1120, 1820); ctx.lineTo(110, 1820); ctx.closePath(); ctx.stroke();
  // bitki
  drawPlantBig(ctx, 1010, 1430, 0.9, t);
  // yatak başlığı + yatak
  ctx.fillStyle = '#6b4a33'; rr(ctx, 300, 1080, 760, 290, 16); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 3; for (let k = 330; k < 1060; k += 48) { ctx.beginPath(); ctx.moveTo(k, 1092); ctx.lineTo(k, 1360); ctx.stroke(); }
  ctx.fillStyle = '#4f3524'; rr(ctx, 280, 1480, 800, 70, 12); ctx.fill();
  ctx.fillStyle = '#f4f2ee'; rr(ctx, 300, 1310, 760, 190, 30); ctx.fill();
  ctx.fillStyle = '#ffffff'; rr(ctx, 340, 1255, 220, 90, 34); ctx.fill(); rr(ctx, 780, 1255, 220, 90, 34); ctx.fill();
  ctx.fillStyle = '#c8ccd3'; rr(ctx, 290, 1370, 780, 150, 40); ctx.fill();
  ctx.strokeStyle = 'rgba(80,90,110,0.25)'; ctx.lineWidth = 4;
  [[380, 1400, 520, 1460], [640, 1395, 760, 1470], [860, 1410, 980, 1450]].forEach(([a, b, c, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo((a + c) / 2, d + 10, c, d); ctx.stroke(); });
  ctx.fillStyle = '#c9952e'; rr(ctx, 290, 1450, 780, 56, 20); ctx.fill();
  ctx.strokeStyle = 'rgba(120,80,20,0.4)'; ctx.lineWidth = 3; for (let k = 300; k < 1060; k += 22) { ctx.beginPath(); ctx.moveTo(k, 1455); ctx.lineTo(k + 8, 1500); ctx.stroke(); }
  // kahraman
  drawPerson(ctx, 560, 1420, 1.25, { who: 'kahraman', outfit: 'tee', face: o.face ?? 0.4, t, noLegs: true, brow: o.brow ?? 'notr', eyes: o.eyes ?? 'nokta', mouth: o.mouth ?? 'cizgi', seed: 3 });
  ctx.fillStyle = '#c8ccd3'; rr(ctx, 290, 1385, 780, 135, 40); ctx.fill();
  ctx.fillStyle = '#c9952e'; rr(ctx, 290, 1450, 780, 56, 20); ctx.fill();
  // komodin, lamba, telefon, kitap, su bardağı
  ctx.fillStyle = '#5a3d2a'; rr(ctx, 90, 1330, 180, 170, 8); ctx.fill();
  ctx.fillStyle = '#4a3222'; ctx.fillRect(90, 1400, 180, 5);
  ctx.fillStyle = '#c9a15a'; ctx.fillRect(176, 1180, 8, 150); ctx.fillStyle = '#efe6d5';
  ctx.beginPath(); ctx.moveTo(130, 1190); ctx.lineTo(230, 1190); ctx.lineTo(210, 1120); ctx.lineTo(150, 1120); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2f5d7a'; ctx.fillRect(110, 1310, 70, 18); ctx.fillStyle = '#8a3b2a'; ctx.fillRect(116, 1296, 62, 14);
  ctx.fillStyle = 'rgba(220,235,250,0.7)'; rr(ctx, 210, 1282, 26, 46, 4); ctx.fill();
  if (o.alarm) { const p = 0.5 + 0.5 * Math.sin(t * 8); ctx.fillStyle = `rgba(255,205,110,${0.25 + 0.35 * p})`; ctx.beginPath(); ctx.ellipse(180, 1330, 80, 18, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#111317'; rr(ctx, 130, 1322, 70, 12, 4); ctx.fill();
  // camdan vuran soluk ışık
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = 'rgba(200,215,235,0.12)'; ctx.beginPath(); ctx.moveTo(360, 1250); ctx.lineTo(900, 1250); ctx.lineTo(1080, 1920); ctx.lineTo(180, 1920); ctx.closePath(); ctx.fill();
  ctx.restore();
  // soğuk nefes
  const bt = (t * 0.6) % 1;
  ctx.fillStyle = `rgba(240,246,255,${0.3 * (1 - bt)})`; ctx.beginPath(); ctx.ellipse(620 + bt * 50, 1090 - bt * 40, 16 + bt * 26, 10 + bt * 14, 0, 0, Math.PI * 2); ctx.fill();
}

// ======================================================================= AÇIK MUTFAK / SALON (sabah ya da gece)
function drawKitchenLux(ctx, t, o = {}) {
  const night = o.night ?? 0;
  ctx.fillStyle = night ? '#2a2420' : '#ebe7e1'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = night ? '#221d1a' : '#f3f1ed'; ctx.fillRect(0, 0, W, 200);
  // sağda camdan şehir
  glassWall(ctx, 560, 230, 520, 1010, t, { panes: 2, view: { night, horizon: 0.6, ax: 0.55, kx: 0.18, seed: 7, count: 6, sunX: 0.7, sunY: 0.18 }, frost: 0.9, night });
  // solda ahşap çıtalı duvar + TV
  ctx.fillStyle = night ? '#4a3527' : '#8c6545'; ctx.fillRect(0, 230, 560, 1010);
  ctx.fillStyle = night ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.14)';
  for (let k = 14; k < 560; k += 28) ctx.fillRect(k, 230, 8, 1010);
  if (o.tv !== false) {
    const tx = 50, ty = 420, tw = 460, th = 270;
    ctx.fillStyle = '#060708'; rr(ctx, tx - 10, ty - 10, tw + 20, th + 20, 8); ctx.fill();
    if (o.tv) drawNewsLux(ctx, tx, ty, tw, th, t, o.tv);
    else { ctx.fillStyle = '#0b0c0f'; ctx.fillRect(tx, ty, tw, th); ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + tw * 0.4, ty); ctx.lineTo(tx, ty + th * 0.6); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = night ? '#2a1f18' : '#3a2a1f'; rr(ctx, 30, 760, 500, 70, 8); ctx.fill();
    ctx.fillStyle = '#c9a15a'; ctx.fillRect(60, 780, 120, 6); ctx.fillStyle = '#5c6b45'; ctx.beginPath(); ctx.ellipse(440, 740, 40, 30, 0, 0, Math.PI * 2); ctx.fill();
  }
  // tezgâh arkası koyu dolaplar
  ctx.fillStyle = night ? '#1f2226' : '#2d3238'; ctx.fillRect(0, 900, 560, 340);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 3; for (let k = 140; k < 560; k += 140) { ctx.beginPath(); ctx.moveTo(k, 900); ctx.lineTo(k, 1240); ctx.stroke(); }
  ctx.fillStyle = '#e9e5df'; ctx.fillRect(0, 890, 560, 14);
  // ada (mermer)
  const iy = 1250;
  ctx.fillStyle = night ? '#d8d2c8' : '#f3f1ec'; ctx.fillRect(-20, iy, W + 40, 60);
  ctx.strokeStyle = 'rgba(120,120,130,0.35)'; ctx.lineWidth = 2;
  [[40, 1262, 300, 1300], [380, 1258, 620, 1296], [700, 1266, 980, 1290]].forEach(([a, b, c, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.bezierCurveTo(a + 80, b + 30, c - 80, d - 30, c, d); ctx.stroke(); });
  ctx.fillStyle = night ? '#2a2420' : '#3a3f46'; ctx.fillRect(-20, iy + 60, W + 40, H - iy);
  ctx.fillStyle = 'rgba(255,255,255,0.06)'; for (let k = 0; k < W; k += 180) ctx.fillRect(k, iy + 60, 4, H - iy);
  // bar tabureleri
  [180, 540, 900].forEach(bx => {
    ctx.fillStyle = '#7a5236'; rr(ctx, bx - 70, iy + 120, 140, 34, 14); ctx.fill();
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bx - 50, iy + 154); ctx.lineTo(bx - 64, iy + 420); ctx.moveTo(bx + 50, iy + 154); ctx.lineTo(bx + 64, iy + 420); ctx.stroke();
  });
  // espresso makinesi
  const ex = o.espX ?? 120;
  ctx.fillStyle = '#c9ccd2'; rr(ctx, ex, iy - 170, 170, 170, 14); ctx.fill();
  ctx.fillStyle = '#9aa0a8'; ctx.fillRect(ex + 14, iy - 150, 142, 40);
  ctx.fillStyle = '#1b1c20'; ctx.fillRect(ex + 50, iy - 100, 70, 12);
  ctx.fillStyle = '#f2efe8'; rr(ctx, ex + 66, iy - 60, 40, 36, 6); ctx.fill();
  if (o.steam) for (let i = 0; i < 3; i++) { const ph = (t * 0.6 + i / 3) % 1; ctx.fillStyle = `rgba(250,250,250,${0.35 * (1 - ph)})`; ctx.beginPath(); ctx.ellipse(ex + 86 + Math.sin(t * 2 + i) * 6, iy - 80 - ph * 110, 8 + ph * 16, 10 + ph * 18, 0, 0, Math.PI * 2); ctx.fill(); }
  // meyve kâsesi
  ctx.fillStyle = '#e9e4da'; ctx.beginPath(); ctx.ellipse(470, iy - 6, 70, 18, 0, 0, Math.PI); ctx.fill();
  [['#d9472b', 440], ['#e8a33a', 475], ['#7aa23a', 505]].forEach(([c, fx]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(fx, iy - 22, 18, 0, Math.PI * 2); ctx.fill(); });
  if (o.pot) {   // ocakta çorba tenceresi
    ctx.fillStyle = '#1b1c20'; ctx.fillRect(250, iy - 8, 230, 8);
    ctx.fillStyle = '#b44a2e'; rr(ctx, 280, iy - 110, 170, 100, 16); ctx.fill();
    ctx.fillStyle = '#8e3a24'; rr(ctx, 270, iy - 120, 190, 22, 8); ctx.fill();
    for (let i = 0; i < 4; i++) { const ph = (t * 0.45 + i / 4) % 1; ctx.fillStyle = `rgba(250,240,225,${0.4 * (1 - ph)})`; ctx.beginPath(); ctx.ellipse(365 + Math.sin(t * 1.7 + i * 2) * 20, iy - 130 - ph * 220, 16 + ph * 40, 20 + ph * 36, 0, 0, Math.PI * 2); ctx.fill(); }
  }
  if (o.cooker) {
    ctx.fillStyle = '#c9ccd2'; rr(ctx, 600, iy - 96, 140, 88, 14); ctx.fill();
    ctx.fillStyle = '#2b2d33'; ctx.fillRect(590, iy - 104, 160, 14); ctx.fillRect(738, iy - 110, 60, 12);
  }
  (o.people ?? []).forEach(p => drawPerson(ctx, p.x, p.y, p.s ?? 1.25, { t, noLegs: true, ...p }));
  if (o.mug) {
    const [mx, my] = o.mug;
    ctx.fillStyle = '#f2efe8'; rr(ctx, mx - 22, my - 20, 44, 40, 8); ctx.fill();
    ctx.strokeStyle = '#f2efe8'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(mx + 24, my, 12, -1.2, 1.2); ctx.stroke();
    const ph = (t * 0.6) % 1;
    ctx.fillStyle = `rgba(245,245,245,${0.3 * (1 - ph)})`; ctx.beginPath(); ctx.ellipse(mx, my - 30 - ph * 60, 8 + ph * 14, 10 + ph * 14, 0, 0, Math.PI * 2); ctx.fill();
  }
  if (o.tablet) drawTablet(ctx, o.tablet.x, o.tablet.y, o.tablet.s ?? 1, t, o.tablet);
  // sarkıt lambalar
  if (o.pendants !== false) [260, 540, 820].forEach(px => drawPendant(ctx, px, 520, 1, night ? 1 : 0.2));
}

// ======================================================================= HABER STÜDYOSU (Türkiye haritası)
const TR_SHAPE = [[26.0, 41.0], [26.6, 41.8], [28.0, 42.0], [29.1, 41.25], [31.0, 41.1], [33.3, 42.0], [35.0, 41.7], [36.3, 41.3], [38.0, 40.95], [40.0, 41.0],
  [41.6, 41.5], [43.5, 41.1], [44.8, 39.7], [44.3, 38.2], [44.2, 37.2], [42.3, 37.1], [40.0, 37.0], [38.0, 36.8], [36.6, 36.2], [36.0, 35.9], [35.5, 36.6],
  [34.0, 36.3], [32.5, 36.1], [30.6, 36.85], [29.6, 36.2], [28.0, 36.6], [27.2, 37.4], [26.4, 38.3], [26.7, 39.4], [26.2, 40.0], [26.4, 40.6]];
function trMap(ctx, x, y, w, h, o = {}) {
  const P = ([lon, lat]) => [x + (lon - 25.5) / 19.7 * w, y + (42.3 - lat) / 6.7 * h];
  ctx.beginPath(); TR_SHAPE.forEach((p, i) => { const [a, b] = P(p); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.closePath();
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#7fb0e8'); g.addColorStop(1, '#3d77c4');
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = Math.max(1.5, w / 300); ctx.stroke();
  (o.cities ?? []).forEach(([name, lon, lat, tmp]) => {
    const [a, b] = P([lon, lat]);
    const fs = Math.max(10, w / 26);
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(a, b, fs * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(10,25,50,0.85)'; rr(ctx, a - fs * 1.6, b - fs * 1.9, fs * 3.2, fs * 1.4, fs * 0.3); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = `700 ${fs}px Oswald`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`${name} ${tmp}`, a, b - fs * 1.2);
  });
}
function drawNewsLux(ctx, x, y, w, h, t, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, '#0f2a52'); g.addColorStop(1, '#081830');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  // stüdyo ekran duvarı
  ctx.fillStyle = 'rgba(80,140,230,0.15)';
  for (let i = 0; i < 6; i++) ctx.fillRect(x + w * (0.48 + i * 0.09), y + h * 0.08, w * 0.085, h * 0.5);
  const mx = x + w * 0.47, my = y + h * 0.1, mw = w * 0.5, mh = h * 0.48;
  ctx.fillStyle = '#0a1d3a'; ctx.fillRect(mx, my, mw, mh);
  if (o.map !== false) trMap(ctx, mx + mw * 0.04, my + mh * 0.14, mw * 0.92, mh * 0.8, { cities: o.cities ?? [['ANKARA', 32.85, 39.93, '0°'], ['İSTANBUL', 28.97, 41.0, '4°'], ['İZMİR', 27.14, 38.42, '7°'], ['ERZURUM', 41.27, 39.9, '−16°']] });
  // ışık şeritleri
  ctx.fillStyle = 'rgba(120,180,255,0.18)'; ctx.fillRect(x, y + h * 0.6, w, 3);
  // spiker masası
  const s = h / 700;
  ctx.save(); ctx.translate(x + w * 0.24, y + h * 0.98); ctx.scale(s, s);
  drawPerson(ctx, 0, 0, 1.3, { who: 'spiker', outfit: 'suit', face: 0.15, t, noLegs: true, brow: o.brow ?? 'notr', mouth: o.talk ? 'konus' : 'cizgi', talk: o.talk ?? 0, seed: 8 });
  ctx.restore();
  const dg = ctx.createLinearGradient(x, y + h * 0.76, x, y + h);
  dg.addColorStop(0, '#1d3e6e'); dg.addColorStop(1, '#0b1a33');
  ctx.fillStyle = dg; ctx.beginPath(); ctx.moveTo(x, y + h * 0.78); ctx.lineTo(x + w * 0.46, y + h * 0.76); ctx.lineTo(x + w * 0.46, y + h); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(160,210,255,0.5)'; ctx.fillRect(x, y + h * 0.78, w * 0.46, 2);
  // alt başlık
  const lb = y + h * 0.66;
  ctx.fillStyle = o.red ? '#c8302a' : '#1e5fbf'; ctx.fillRect(x + w * 0.03, lb, w * 0.2, h * 0.075);
  ctx.fillStyle = '#fff'; ctx.font = `700 ${h * 0.05}px Oswald`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(o.tag ?? 'GÜNDEM', x + w * 0.13, lb + h * 0.038);
  ctx.fillStyle = 'rgba(245,247,252,0.97)'; ctx.fillRect(x + w * 0.23, lb, w * 0.74, h * 0.075);
  ctx.fillStyle = '#10213d'; ctx.textAlign = 'left'; ctx.font = `700 ${h * 0.052}px Oswald`;
  ctx.fillText(o.title ?? 'SOĞUK HAVA DALGASI', x + w * 0.255, lb + h * 0.04);
  // kayan bant
  const by = y + h * 0.745;
  ctx.fillStyle = '#05080f'; ctx.fillRect(x, by, w, h * 0.07);
  ctx.fillStyle = '#ffc83d'; ctx.fillRect(x, by, w * 0.12, h * 0.07);
  ctx.fillStyle = '#111'; ctx.textAlign = 'center'; ctx.font = `700 ${h * 0.04}px Oswald`; ctx.fillText(o.clock ?? '07:52', x + w * 0.06, by + h * 0.036);
  ctx.save(); ctx.beginPath(); ctx.rect(x + w * 0.12, by, w * 0.88, h * 0.07); ctx.clip();
  const tick = o.ticker ?? 'SİBİRYA KAYNAKLI SOĞUK HAVA DALGASI ETKİSİNİ ARTIRIYOR  •  OKULLARDA TATİL KARARI VALİLİKLERE BIRAKILDI  •  ';
  ctx.fillStyle = '#e9edf5'; ctx.textAlign = 'left'; ctx.font = `600 ${h * 0.04}px Oswald`;
  const tw = ctx.measureText(tick).width;
  const off0 = (t * (o.speed ?? 110) * (w / 1000)) % tw;
  for (let k = -1; k < 3; k++) ctx.fillText(tick, x + w * 0.13 - off0 + k * tw, by + h * 0.037);
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = `700 ${h * 0.045}px Oswald`; ctx.textAlign = 'right';
  ctx.fillText('HABER', x + w * 0.96, y + h * 0.075);
  ctx.fillStyle = '#ff3b2f'; ctx.beginPath(); ctx.arc(x + w * 0.83, y + h * 0.06, h * 0.012, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `700 ${h * 0.03}px Oswald`; ctx.fillText('CANLI', x + w * 0.88, y + h * 0.065);
  ctx.restore();
}

function snowFlakes(ctx, x, y, w, h, t, n = 40, a = 0.8) {
  const R = mulberry32(17);
  ctx.fillStyle = `rgba(250,252,255,${a})`;
  for (let i = 0; i < n; i++) {
    const sp = 30 + R() * 50, px = x + ((R() * w + Math.sin(t * 0.8 + i) * 8) % w), py = y + ((R() * h + t * sp) % h);
    ctx.beginPath(); ctx.arc(px, py, 1.5 + R() * 2, 0, Math.PI * 2); ctx.fill();
  }
}
// Dünyadan canlı yayınlar: Paris, Tokyo, New York
function miniCity(ctx, x, y, w, h, kind, t) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#5f7493'); g.addColorStop(1, '#c9d3df'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  paleSun(ctx, x + w * 0.75, y + h * 0.2, h * 0.06, 0.8);
  const base = y + h * 0.88;
  ctx.fillStyle = '#3d4a60';
  if (kind === 'paris') {
    ctx.beginPath(); ctx.moveTo(x + w * 0.38, base); ctx.quadraticCurveTo(x + w * 0.47, base - h * 0.3, x + w * 0.495, base - h * 0.62);
    ctx.lineTo(x + w * 0.505, base - h * 0.62); ctx.quadraticCurveTo(x + w * 0.53, base - h * 0.3, x + w * 0.62, base); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mix('#5f7493', '#c9d3df', 0.6); ctx.beginPath(); ctx.ellipse(x + w * 0.5, base, w * 0.06, h * 0.1, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#3d4a60'; ctx.fillRect(x + w * 0.42, base - h * 0.28, w * 0.16, h * 0.02);
  } else if (kind === 'tokyo') {
    ctx.fillStyle = '#c0392b';
    ctx.beginPath(); ctx.moveTo(x + w * 0.42, base); ctx.lineTo(x + w * 0.495, base - h * 0.66); ctx.lineTo(x + w * 0.505, base - h * 0.66); ctx.lineTo(x + w * 0.58, base); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f2f2f2'; ctx.fillRect(x + w * 0.45, base - h * 0.32, w * 0.1, h * 0.03); ctx.fillRect(x + w * 0.47, base - h * 0.5, w * 0.06, h * 0.025);
  } else {
    [[0.1, 0.4], [0.2, 0.55], [0.32, 0.45], [0.45, 0.75], [0.6, 0.5], [0.72, 0.62], [0.85, 0.42]].forEach(([fx, fh]) => ctx.fillRect(x + w * fx, base - h * fh, w * 0.1, h * fh));
    ctx.fillRect(x + w * 0.495, base - h * 0.86, w * 0.01, h * 0.12);
  }
  ctx.fillStyle = 'rgba(30,40,58,0.85)'; ctx.fillRect(x, base, w, h * 0.12);
  snowFlakes(ctx, x, y, w, h, t, 26, 0.8);
}
function drawWorldFeeds(ctx, x, y, w, h, t, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = '#0a1426'; ctx.fillRect(x, y, w, h);
  const feeds = [['PARİS', 'paris', '−8°'], ['TOKYO', 'tokyo', '−6°'], ['NEW YORK', 'ny', '−12°']];
  const pw = w * 0.31, ph = h * 0.52;
  feeds.forEach(([name, kind, tmp], i) => {
    const px = x + w * 0.02 + i * (pw + w * 0.015), py = y + h * 0.08;
    const a = clamp(((o.k ?? 1) * 3) - i);
    if (a <= 0) return;
    ctx.globalAlpha = a;
    miniCity(ctx, px, py, pw, ph, kind, t);
    ctx.fillStyle = '#c8302a'; ctx.fillRect(px + 8, py + 8, pw * 0.3, h * 0.07);
    ctx.fillStyle = '#fff'; ctx.font = `700 ${h * 0.045}px Oswald`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('CANLI', px + 8 + pw * 0.15, py + 8 + h * 0.036);
    ctx.fillStyle = 'rgba(5,10,20,0.85)'; ctx.fillRect(px, py + ph - h * 0.1, pw, h * 0.1);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(name, px + 10, py + ph - h * 0.05);
    ctx.fillStyle = '#9fd3ff'; ctx.textAlign = 'right'; ctx.font = `700 ${h * 0.06}px Oswald`; ctx.fillText(tmp, px + pw - 10, py + ph - h * 0.05);
    ctx.globalAlpha = 1;
  });
  ctx.fillStyle = 'rgba(245,247,252,0.97)'; ctx.fillRect(x + w * 0.03, y + h * 0.66, w * 0.94, h * 0.09);
  ctx.fillStyle = '#c8302a'; ctx.fillRect(x + w * 0.03, y + h * 0.66, w * 0.2, h * 0.09);
  ctx.fillStyle = '#fff'; ctx.font = `700 ${h * 0.05}px Oswald`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('DÜNYA', x + w * 0.13, y + h * 0.705);
  ctx.fillStyle = '#10213d'; ctx.textAlign = 'left'; ctx.fillText('AYNI ANDA ANİ SOĞUMA', x + w * 0.26, y + h * 0.705);
  const by = y + h * 0.8;
  ctx.fillStyle = '#05080f'; ctx.fillRect(x, by, w, h * 0.08);
  ctx.save(); ctx.beginPath(); ctx.rect(x, by, w, h * 0.08); ctx.clip();
  const tick = "AVRUPA'DA, ASYA'DA VE AMERİKA'DA AYNI ANDA ANİ SOĞUMA  •  BİLİM İNSANLARI NEDENİNİ ARAŞTIRIYOR  •  ";
  ctx.fillStyle = '#ffd36a'; ctx.font = `600 ${h * 0.045}px Oswald`; ctx.textAlign = 'left';
  const tw = ctx.measureText(tick).width, off0 = (t * 120 * (w / 1000)) % tw;
  for (let k = -1; k < 3; k++) ctx.fillText(tick, x + 10 - off0 + k * tw, by + h * 0.042);
  ctx.restore();
  ctx.restore();
}

// ======================================================================= KUĞULU PARK
function bareTreeD(ctx, x, y, s, seed, frost = 1) {
  const R = mulberry32(seed);
  ctx.lineCap = 'round';
  const br = (bx, by, a, len, w, d) => {
    if (d === 0 || len < 6) return;
    const ex = bx + Math.cos(a) * len, ey = by + Math.sin(a) * len;
    ctx.strokeStyle = '#3d3a3a'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.stroke();
    if (frost && w < 5) { ctx.strokeStyle = 'rgba(245,248,252,0.6)'; ctx.lineWidth = w * 0.5; ctx.beginPath(); ctx.moveTo(bx, by - 1); ctx.lineTo(ex, ey - 1); ctx.stroke(); }
    const n = R() < 0.3 ? 3 : 2;
    for (let i = 0; i < n; i++) br(ex, ey, a + (i - (n - 1) / 2) * (0.5 + R() * 0.3), len * (0.68 + R() * 0.1), w * 0.66, d - 1);
  };
  br(x, y, -Math.PI / 2 + (R() - 0.5) * 0.1, 170 * s, 20 * s, 7);
}
function bench(ctx, x, y, s) {
  ctx.fillStyle = '#3e5a3e'; for (let i = 0; i < 3; i++) rr(ctx, x - 90 * s, y - 50 * s + i * 14 * s, 180 * s, 10 * s, 3 * s), ctx.fill();
  ctx.fillStyle = '#2b2b2b'; ctx.fillRect(x - 80 * s, y - 50 * s, 8 * s, 60 * s); ctx.fillRect(x + 72 * s, y - 50 * s, 8 * s, 60 * s);
  ctx.fillStyle = 'rgba(248,250,253,0.9)'; ctx.fillRect(x - 90 * s, y - 52 * s, 180 * s, 4 * s);
}
function lampPost(ctx, x, y, s) {
  ctx.fillStyle = '#1f2326'; ctx.fillRect(x - 5 * s, y - 300 * s, 10 * s, 300 * s); ctx.fillRect(x - 14 * s, y - 20 * s, 28 * s, 20 * s);
  ctx.beginPath(); ctx.moveTo(x - 22 * s, y - 300 * s); ctx.lineTo(x + 22 * s, y - 300 * s); ctx.lineTo(x + 14 * s, y - 350 * s); ctx.lineTo(x - 14 * s, y - 350 * s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#d9d2b5'; ctx.fillRect(x - 12 * s, y - 344 * s, 24 * s, 38 * s);
  ctx.fillStyle = '#1f2326'; ctx.beginPath(); ctx.moveTo(x - 26 * s, y - 350 * s); ctx.lineTo(x + 26 * s, y - 350 * s); ctx.lineTo(x, y - 380 * s); ctx.closePath(); ctx.fill();
}
function drawKugulu(ctx, t, o = {}) {
  drawAnkaraView(ctx, 0, 0, W, 1120, t, { horizon: 0.78, ax: 0.18, kx: 0.62, ah: 0.38, seed: 21, count: 7, sunX: 0.72, sunY: 0.26, sunR: 46 });
  ctx.fillStyle = '#e4e9ee'; ctx.fillRect(0, 1060, W, H - 1060);
  ctx.fillStyle = 'rgba(160,175,190,0.25)'; for (let k = 0; k < 40; k++) { const R = mulberry32(k + 3); ctx.beginPath(); ctx.ellipse(R() * W, 1080 + R() * 820, 30 + R() * 60, 4, 0, 0, Math.PI * 2); ctx.fill(); }
  bareTreeD(ctx, 120, 1150, 1.3, 3); bareTreeD(ctx, 960, 1130, 1.25, 8); bareTreeD(ctx, 560, 1080, 0.75, 5);
  // havuz
  const px = 540, py = 1330;
  ctx.fillStyle = '#9da8b3'; ctx.beginPath(); ctx.ellipse(px, py, 470, 150, 0, 0, Math.PI * 2); ctx.fill();
  const ig = ctx.createLinearGradient(0, py - 130, 0, py + 130);
  ig.addColorStop(0, '#cfe2f0'); ig.addColorStop(1, '#a9c6dc');
  ctx.fillStyle = ig; ctx.beginPath(); ctx.ellipse(px, py, 440, 128, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 2.5;
  [[260, 1300, 380, 1350, 470, 1310], [600, 1360, 700, 1300, 820, 1340], [420, 1390, 520, 1400, 600, 1380]].forEach(([a, b, c, d, e, f]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.lineTo(e, f); ctx.stroke(); });
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(px - 120, py - 40, 160, 26, -0.1, 0, Math.PI * 2); ctx.fill();
  // kuğu evi (boş)
  ctx.fillStyle = '#5a4636'; ctx.fillRect(700, 1250, 8, 40); ctx.fillRect(780, 1250, 8, 40);
  ctx.fillStyle = '#f4f1ea'; ctx.fillRect(690, 1200, 110, 56);
  ctx.fillStyle = '#b8402e'; ctx.beginPath(); ctx.moveTo(680, 1204); ctx.lineTo(745, 1160); ctx.lineTo(810, 1204); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2a2622'; ctx.beginPath(); ctx.arc(745, 1236, 14, Math.PI, 0); ctx.fill(); ctx.fillRect(731, 1236, 28, 20);
  ctx.fillStyle = 'rgba(250,252,255,0.95)'; ctx.beginPath(); ctx.moveTo(680, 1204); ctx.lineTo(745, 1160); ctx.lineTo(810, 1204); ctx.lineTo(800, 1198); ctx.lineTo(745, 1166); ctx.lineTo(690, 1198); ctx.closePath(); ctx.fill();
  // buz tutmuş fıskiye
  ctx.fillStyle = '#b9b3aa'; ctx.beginPath(); ctx.ellipse(380, 1300, 60, 16, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#a8a29a'; ctx.fillRect(372, 1250, 16, 50);
  ctx.fillStyle = 'rgba(225,240,250,0.95)';
  for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(380 + k * 10, 1252); ctx.lineTo(380 + k * 12 - 2, 1290); ctx.lineTo(380 + k * 12 + 2, 1290); ctx.closePath(); ctx.fill(); }
  // banklar, lambalar
  bench(ctx, 160, 1560, 1.0); bench(ctx, 920, 1580, 1.0);
  lampPost(ctx, 60, 1620, 1.05); lampPost(ctx, 1020, 1630, 1.05);
  // patika
  ctx.fillStyle = '#c9c4bc'; ctx.beginPath(); ctx.moveTo(380, H); ctx.quadraticCurveTo(520, 1600, 760, 1520); ctx.lineTo(860, 1530); ctx.quadraticCurveTo(620, 1640, 560, H); ctx.closePath(); ctx.fill();
  // koşan kahraman
  const rx = o.runX ?? (520 + Math.sin(t * 0.5) * 30);
  drawPerson(ctx, rx, 1760, 1.2, { who: 'kahraman', outfit: 'running', face: 1, t, step: t * 9, brow: 'endise', seed: 6 });
  for (let i = 0; i < 2; i++) { const ph = (t * 1.3 + i * 0.5) % 1; ctx.fillStyle = `rgba(250,252,255,${0.5 * (1 - ph)})`; ctx.beginPath(); ctx.ellipse(rx + 76 + ph * 50, 1430 - ph * 30, 12 + ph * 26, 8 + ph * 16, 0, 0, Math.PI * 2); ctx.fill(); }
}

// ======================================================================= TUNALI KAFE
function yellowTaxi(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#f2c12e'; rr(ctx, -120, -60, 240, 50, 14); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-70, -60); ctx.lineTo(-40, -100); ctx.lineTo(50, -100); ctx.lineTo(80, -60); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#9fb3c8'; ctx.beginPath(); ctx.moveTo(-58, -62); ctx.lineTo(-36, -92); ctx.lineTo(4, -92); ctx.lineTo(4, -62); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(10, -62); ctx.lineTo(10, -92); ctx.lineTo(46, -92); ctx.lineTo(68, -62); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1b1b1b'; rr(ctx, -16, -114, 40, 14, 4); ctx.fill();
  ctx.fillStyle = '#f2c12e'; ctx.font = '700 10px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('TAKSİ', 4, -107);
  ctx.fillStyle = '#1b1b1b'; ctx.beginPath(); ctx.arc(-70, -10, 22, 0, Math.PI * 2); ctx.arc(70, -10, 22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8a8f96'; ctx.beginPath(); ctx.arc(-70, -10, 9, 0, Math.PI * 2); ctx.arc(70, -10, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff3c4'; ctx.fillRect(110, -50, 10, 10);
  ctx.restore();
}
function drawCafeLux(ctx, t, o = {}) {
  // tuğla duvar
  ctx.fillStyle = '#8a4e3a'; ctx.fillRect(0, 0, W, H);
  for (let y = 0; y < 1300; y += 34) for (let x = (y / 34) % 2 ? -40 : 0; x < W; x += 84) { ctx.fillStyle = mix('#9b5a43', '#7d4433', ((x * 7 + y * 3) % 10) / 10); ctx.fillRect(x + 2, y + 2, 80, 30); }
  // vitrin camı: Tunalı caddesi
  const wx = 470, wy = 260, ww = 600, wh = 760;
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
  const sg = ctx.createLinearGradient(0, wy, 0, wy + wh); sg.addColorStop(0, '#a8b8cc'); sg.addColorStop(1, '#d9dfe7'); ctx.fillStyle = sg; ctx.fillRect(wx, wy, ww, wh);
  paleSun(ctx, wx + ww * 0.8, wy + 90, 26, 0.85);
  drawBuildingD(ctx, wx - 40, wy + wh - 120, 280, 520, { col: '#d9cbb8', seed: 61, balcony: true, ac: true, t });
  drawBuildingD(ctx, wx + 250, wy + wh - 120, 260, 600, { col: '#c8c0b6', seed: 62, balcony: true, t });
  drawBuildingD(ctx, wx + 520, wy + wh - 120, 200, 480, { col: '#e1d4c3', seed: 63, balcony: true, t });
  ctx.fillStyle = '#2f3540'; ctx.fillRect(wx, wy + wh - 120, ww, 50);
  [['KİTAP', '#2c5d8a'], ['FIRIN', '#a8462e'], ['ÇİÇEK', '#3e7a4a']].forEach(([n, c], i) => { ctx.fillStyle = c; ctx.fillRect(wx + 20 + i * 200, wy + wh - 116, 150, 26); ctx.fillStyle = '#fff'; ctx.font = '700 18px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n, wx + 95 + i * 200, wy + wh - 103); });
  ctx.fillStyle = '#9da3ab'; ctx.fillRect(wx, wy + wh - 70, ww, 70);
  yellowTaxi(ctx, wx + ((t * 120) % (ww + 400)) - 200, wy + wh - 6, 0.9, t);
  for (let i = 0; i < 3; i++) { const px = ((t * 40 + i * 230) % (ww + 120)) + wx - 60; drawPerson(ctx, px, wy + wh - 60, 0.45, { who: ['kisi1', 'kisi2', 'kisi3'][i], face: 1, t, step: t * 6 + i, seed: i, coat: ['#5a6b7d', '#6f5b4b', '#4b5b6b'][i] }); }
  ctx.restore();
  frostEdges(ctx, wx, wy, ww, wh, 0.7, 19);
  ctx.strokeStyle = '#2a2622'; ctx.lineWidth = 18; ctx.strokeRect(wx, wy, ww, wh);
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '600 44px Caveat'; ctx.textAlign = 'center'; ctx.fillText('Tunalı Kahve', wx + ww / 2, wy + 60);
  // kara tahta menü
  ctx.fillStyle = '#2b2f2c'; rr(ctx, 50, 540, 360, 400, 10); ctx.fill();
  ctx.strokeStyle = '#6b4a33'; ctx.lineWidth = 12; ctx.stroke();
  ctx.fillStyle = '#f2f0e8'; ctx.font = '600 46px Caveat'; ctx.textAlign = 'left';
  ['MENÜ', 'Filtre kahve  60', 'Latte  85', 'Salep  90', 'Simit  25'].forEach((l, i) => ctx.fillText(l, 80, 610 + i * 68));
  // Edison ampuller
  [130, 300, 650, 860].forEach((bx, i) => { ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, 0); ctx.lineTo(bx, 160 + i * 20); ctx.stroke(); ctx.fillStyle = '#ffd98a'; ctx.beginPath(); ctx.ellipse(bx, 180 + i * 20, 12, 18, 0, 0, Math.PI * 2); ctx.fill(); warmGlow(ctx, bx, 180 + i * 20, 120, 0.25, '255,200,120'); });
  if (o.tv) { const tx = 70, ty = 720, tw = 340, th = 200; ctx.fillStyle = '#060708'; rr(ctx, tx - 8, ty - 8, tw + 16, th + 16, 8); ctx.fill(); drawNewsLux(ctx, tx, ty, tw, th, t, o.tv); }
  // tezgâh ve barista
  ctx.fillStyle = '#5c4030'; ctx.fillRect(0, 1030, 450, 260);
  ctx.fillStyle = '#c9ccd2'; rr(ctx, 60, 950, 150, 90, 10); ctx.fill(); ctx.fillStyle = '#1b1c20'; ctx.fillRect(80, 1000, 110, 10);
  ctx.fillStyle = 'rgba(220,235,245,0.5)'; rr(ctx, 240, 960, 190, 80, 8); ctx.fill();
  ['#d9a35a', '#a86a3a', '#e8c890'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(275 + i * 55, 1010, 22, 12, 0, 0, Math.PI * 2); ctx.fill(); });
  // masalar ve insanlar
  ctx.fillStyle = '#3c2c22'; ctx.fillRect(0, 1290, W, H - 1290);
  const laugh = o.laugh ? 1 : 0;
  drawPerson(ctx, 700, 1480, 1.05, { who: 'kisi1', face: 0.6, t, noLegs: true, mouth: laugh ? 'o' : 'cizgi', seed: 11, coat: '#7a5a8a' });
  drawPerson(ctx, 930, 1480, 1.05, { who: 'kisi2', face: -0.6, t, noLegs: true, mouth: laugh ? 'o' : 'cizgi', seed: 12, coat: '#8a6a3a' });
  ctx.fillStyle = '#8a6a4d'; rr(ctx, 600, 1340, 450, 40, 10); ctx.fill();
  [[690, 1330], [940, 1330]].forEach(([cx, cy]) => { ctx.fillStyle = '#f2efe8'; rr(ctx, cx - 18, cy - 30, 36, 32, 6); ctx.fill(); });
  drawPerson(ctx, 280, 1500, 1.25, { who: 'kahraman', outfit: 'knit', face: 0.7, t, noLegs: true, brow: o.brow ?? 'notr', seed: 13 });
  ctx.fillStyle = '#c9ccd2'; ctx.beginPath(); ctx.moveTo(300, 1352); ctx.lineTo(530, 1352); ctx.lineTo(510, 1210); ctx.lineTo(320, 1210); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(160,200,255,0.45)'; ctx.beginPath(); ctx.moveTo(330, 1340); ctx.lineTo(500, 1340); ctx.lineTo(486, 1222); ctx.lineTo(342, 1222); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#8a6a4d'; rr(ctx, 40, 1350, 540, 40, 10); ctx.fill();
  ctx.fillStyle = '#f2efe8'; rr(ctx, 90, 1312, 40, 38, 6); ctx.fill();
  ctx.fillStyle = '#111317'; rr(ctx, 150, 1336, 60, 12, 4); ctx.fill();
  warmGlow(ctx, 540, 700, 900, 0.15, '255,190,120');
}

// ======================================================================= KIZILAY SOKAĞI · ECZANE
function egoBus(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#f2f4f6'; rr(ctx, -260, -170, 520, 150, 16); ctx.fill();
  ctx.fillStyle = '#2f6fb3'; ctx.fillRect(-260, -60, 520, 26);
  ctx.fillStyle = '#9fb3c8'; for (let i = 0; i < 5; i++) ctx.fillRect(-240 + i * 100, -150, 80, 70);
  ctx.fillStyle = '#1b1b1b'; ctx.beginPath(); ctx.arc(-170, -18, 26, 0, Math.PI * 2); ctx.arc(170, -18, 26, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2f6fb3'; ctx.font = '700 20px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('EGO · KIZILAY', 0, -160);
  ctx.restore();
}
function drawStreetKizilay(ctx, t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#a5b4c7'); g.addColorStop(1, '#d9dee5'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  paleSun(ctx, 900, 250, 34, 0.9);
  // apartman cephesi
  drawBuildingD(ctx, -20, 1300, 1120, 1000, { col: '#d8cbb6', seed: 77, fh: 92, cols: 6, balcony: true, ac: true, t, gh: 0, chimney: false });
  // dükkânlar
  ctx.fillStyle = '#3a3f46'; ctx.fillRect(0, 1060, W, 250);
  // eczane
  ctx.fillStyle = '#f4f4f2'; ctx.fillRect(40, 1080, 520, 80);
  ctx.fillStyle = '#d32f2f'; ctx.fillRect(55, 1088, 64, 64);
  ctx.fillStyle = '#fff'; ctx.font = '700 56px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('E', 87, 1121);
  ctx.fillStyle = '#d32f2f'; ctx.font = '700 58px Oswald'; ctx.fillText('ECZANE', 330, 1122);
  ctx.fillStyle = 'rgba(200,225,240,0.75)'; ctx.fillRect(40, 1170, 520, 140);
  ctx.fillStyle = '#ffffff'; for (let i = 0; i < 4; i++) ctx.fillRect(60 + i * 125, 1190, 100, 6);
  ['#e8504a', '#4a8ae8', '#f2b84a', '#5ab06a'].forEach((c, i) => { for (let k = 0; k < 5; k++) { ctx.fillStyle = c; ctx.fillRect(66 + i * 125 + k * 18, 1176, 12, 14); } });
  // fırın + banka
  ctx.fillStyle = '#a8462e'; ctx.fillRect(590, 1080, 220, 70); ctx.fillStyle = '#fff'; ctx.font = '700 44px Oswald'; ctx.fillText('FIRIN', 700, 1116);
  ctx.fillStyle = 'rgba(240,220,180,0.75)'; ctx.fillRect(590, 1160, 220, 150);
  ['#d9a35a', '#c98a45', '#e3b878'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(630 + i * 70, 1230, 28, 14, 0, 0, Math.PI * 2); ctx.fill(); });
  ctx.fillStyle = '#244b8a'; ctx.fillRect(840, 1080, 240, 70); ctx.fillStyle = '#fff'; ctx.font = '700 40px Oswald'; ctx.fillText('BANKA', 960, 1116);
  ctx.fillStyle = 'rgba(200,215,235,0.7)'; ctx.fillRect(840, 1160, 240, 150);
  // LED ekran
  ctx.fillStyle = '#111'; rr(ctx, 120, 860, 380, 170, 12); ctx.fill();
  ctx.strokeStyle = '#555'; ctx.lineWidth = 6; ctx.stroke();
  const show = Math.floor((o.lt ?? t) / 1.4) % 2 === 0 ? '13:00' : '0°C';
  ctx.fillStyle = '#ff3b2f'; ctx.shadowColor = '#ff3b2f'; ctx.shadowBlur = 22; ctx.font = '700 130px Oswald'; ctx.fillText(show, 310, 948); ctx.shadowColor = 'transparent';
  // kaldırım, yol
  ctx.fillStyle = '#c9ced6'; ctx.fillRect(0, 1310, W, 180);
  ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 2; for (let k = 0; k < W; k += 60) { ctx.beginPath(); ctx.moveTo(k, 1310); ctx.lineTo(k - 40, 1490); ctx.stroke(); }
  ctx.fillStyle = '#8f949b'; ctx.fillRect(0, 1490, W, 430); ctx.fillStyle = '#e9e9e9'; for (let k = 0; k < W; k += 160) ctx.fillRect(k + ((t * 0) % 160), 1700, 90, 10);
  egoBus(ctx, ((t * 70) % 1700) - 300, 1690, 0.9);
  yellowTaxi(ctx, 1200 - ((t * 140) % 1600), 1860, 1.1, t);
  for (let i = 0; i < 4; i++) { const px = ((t * 50 + i * 290) % 1300) - 100; drawPerson(ctx, px, 1460, 0.8, { who: ['kisi2', 'kisi3', 'kisi1', 'kisi2'][i], face: 1, t, step: t * 7 + i, seed: 20 + i, coat: ['#4d5a6b', '#6b4d4d', '#4d6b5a', '#5a4d6b'][i] }); }
  lampPost(ctx, 1000, 1480, 1.0);
}

// ======================================================================= ÇİFTLİK (ayrıntılı)
function pickupTruck(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#eef0f2'; rr(ctx, -150, -70, 300, 50, 10); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-150, -70); ctx.lineTo(-110, -118); ctx.lineTo(-10, -118); ctx.lineTo(10, -70); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#7d93ab'; ctx.beginPath(); ctx.moveTo(-138, -74); ctx.lineTo(-106, -110); ctx.lineTo(-20, -110); ctx.lineTo(-6, -74); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#c9ccd2'; ctx.fillRect(14, -84, 130, 14);
  ctx.fillStyle = '#1b1b1b'; ctx.beginPath(); ctx.arc(-95, -18, 24, 0, Math.PI * 2); ctx.arc(95, -18, 24, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(250,252,255,0.9)'; ctx.fillRect(-110, -122, 100, 5);
  ctx.restore();
}
function kangal(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#d9c39a'; ctx.beginPath(); ctx.ellipse(0, -60, 70, 34, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(-55, -60, 14, 60); ctx.fillRect(40, -60, 14, 60);
  ctx.beginPath(); ctx.ellipse(70, -96, 26, 22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2a2420'; ctx.beginPath(); ctx.ellipse(88, -96, 14, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(62, -110, 8, 12, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d9c39a'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-66, -70); ctx.quadraticCurveTo(-96, -100 + Math.sin(t * 6) * 8, -84, -120); ctx.stroke();
  ctx.restore();
}
function drawFarmLux(ctx, t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#93a4ba'); g.addColorStop(0.5, '#cdd5df'); g.addColorStop(1, '#eaeef2');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  paleSun(ctx, 820, 330, 40, 0.9);
  // ormanlık dağlar
  [['#8796a8', 640, 0.9], ['#6f8094', 760, 1.0]].forEach(([c, y0, k], li) => {
    ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, y0);
    for (let i = 0; i <= 12; i++) ctx.lineTo(W * i / 12, y0 - 90 * Math.abs(Math.sin(i * 0.9 + li)) * k - 20 * Math.sin(i * 2.3));
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 26; i++) { const px = (i * 43 + li * 20) % W, py = y0 + 10 + (i % 3) * 18; ctx.fillStyle = dk(c, 0.2); ctx.beginPath(); ctx.moveTo(px - 12, py); ctx.lineTo(px, py - 34); ctx.lineTo(px + 12, py); ctx.closePath(); ctx.fill(); }
  });
  // sırt ve türbinler
  ctx.fillStyle = '#d3dbe3'; ctx.beginPath(); ctx.moveTo(0, 920); ctx.quadraticCurveTo(300, 760, 640, 840); ctx.quadraticCurveTo(860, 900, W, 800); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  drawTurbine(ctx, 340, 810, 0.62, t * 1.1);
  drawTurbine(ctx, 540, 830, 0.56, t * 1.1 + 0.8);
  drawTurbine(ctx, 740, 820, 0.6, t * 1.1 + 1.7);
  ctx.fillStyle = '#e8ecf0'; ctx.beginPath(); ctx.moveTo(0, 1060); ctx.quadraticCurveTo(540, 980, W, 1070); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  for (let i = 0; i < 10; i++) pineTree(ctx, 20 + i * 118, 1080 + (i % 2) * 26, 0.85);
  // güneş paneli dizisi
  for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) {
    ctx.save(); ctx.translate(60 + i * 80, 1170 + r * 50); ctx.transform(1, 0, -0.3, 1, 0, 0);
    ctx.fillStyle = '#1f3a66'; ctx.fillRect(0, 0, 70, 36);
    ctx.strokeStyle = 'rgba(200,220,255,0.45)'; ctx.lineWidth = 1.5; for (let gx = 0; gx <= 70; gx += 17.5) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, 36); ctx.stroke(); }
    ctx.fillStyle = 'rgba(240,246,252,0.7)'; ctx.fillRect(0, 0, 70, 6);
    ctx.restore();
  }
  // sera tüneli (polikarbonat)
  const sx = 60, sy = 1440;
  ctx.fillStyle = 'rgba(255,220,160,0.55)'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy - 120); ctx.quadraticCurveTo(sx + 170, sy - 260, sx + 340, sy - 120); ctx.lineTo(sx + 340, sy); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#f2f4f6'; ctx.lineWidth = 5; ctx.stroke();
  for (let k = 1; k < 6; k++) { const fx = sx + k * 340 / 6; ctx.beginPath(); ctx.moveTo(fx, sy); ctx.lineTo(fx, sy - 120 - 70 * Math.sin(k / 6 * Math.PI)); ctx.stroke(); }
  for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? '#4f8a3e' : '#6aa04a'; ctx.beginPath(); ctx.ellipse(sx + 30 + k * 40, sy - 30, 18, 26, 0, 0, Math.PI * 2); ctx.fill(); }
  // depo (sandviç panel)
  const dx = 440, dy = 1250;
  ctx.fillStyle = '#f2f4f6'; ctx.fillRect(dx, dy, 340, 190);
  ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 2; for (let k = dx; k < dx + 340; k += 14) { ctx.beginPath(); ctx.moveTo(k, dy); ctx.lineTo(k, dy + 190); ctx.stroke(); }
  ctx.fillStyle = '#d7dce2'; ctx.fillRect(dx - 10, dy - 14, 360, 18); ctx.fillStyle = 'rgba(250,252,255,0.95)'; ctx.fillRect(dx - 10, dy - 18, 360, 6);
  ctx.fillStyle = '#9aa3ad'; ctx.fillRect(dx + 120, dy + 70, 110, 120);
  ctx.strokeStyle = 'rgba(0,0,0,0.15)'; for (let k = dy + 80; k < dy + 190; k += 10) { ctx.beginPath(); ctx.moveTo(dx + 120, k); ctx.lineTo(dx + 230, k); ctx.stroke(); }
  ctx.fillStyle = '#2d5a3a'; rr(ctx, dx + 20, dy + 20, 140, 36, 6); ctx.fill(); ctx.fillStyle = '#e8f6e8'; ctx.font = '700 26px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('FİLİZ', dx + 90, dy + 39);
  // taş ev
  const hx = 820, hy = 1260;
  ctx.fillStyle = '#8a8178'; ctx.fillRect(hx, hy, 240, 180);
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) { ctx.fillStyle = mix('#9a9086', '#7a7168', ((r * 3 + c * 7) % 10) / 10); rr(ctx, hx + 4 + c * 40 + (r % 2) * 18, hy + 4 + r * 30, 34, 24, 6); ctx.fill(); }
  ctx.fillStyle = '#5e4234'; ctx.beginPath(); ctx.moveTo(hx - 20, hy + 6); ctx.lineTo(hx + 120, hy - 90); ctx.lineTo(hx + 260, hy + 6); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 2; for (let k = 1; k < 6; k++) { ctx.beginPath(); ctx.moveTo(hx - 20 + k * 23, hy + 6 - k * 16); ctx.lineTo(hx + 260 - k * 23, hy + 6 - k * 16); ctx.stroke(); }
  ctx.fillStyle = 'rgba(250,252,255,0.95)'; ctx.beginPath(); ctx.moveTo(hx - 20, hy + 6); ctx.lineTo(hx + 120, hy - 90); ctx.lineTo(hx + 260, hy + 6); ctx.lineTo(hx + 240, hy + 2); ctx.lineTo(hx + 120, hy - 80); ctx.lineTo(hx, hy + 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffcf8a'; ctx.fillRect(hx + 30, hy + 60, 54, 56); ctx.fillRect(hx + 150, hy + 60, 54, 56);
  ctx.strokeStyle = '#4a3a2c'; ctx.lineWidth = 4; [[hx + 30, hy + 60], [hx + 150, hy + 60]].forEach(([a, b]) => { ctx.strokeRect(a, b, 54, 56); ctx.beginPath(); ctx.moveTo(a + 27, b); ctx.lineTo(a + 27, b + 56); ctx.stroke(); });
  ctx.fillStyle = '#6a5d55'; ctx.fillRect(hx + 180, hy - 70, 26, 56);
  smokePlume(ctx, hx + 193, hy - 76, t, 1.3, 0.5, 2);
  // termal havuz
  ctx.fillStyle = '#8a8178'; ctx.beginPath(); ctx.ellipse(300, 1590, 170, 46, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8fc7d6'; ctx.beginPath(); ctx.ellipse(300, 1584, 148, 34, 0, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 7; i++) { const ph = (t * 0.28 + i / 7) % 1; ctx.fillStyle = `rgba(245,248,252,${0.45 * (1 - ph)})`; ctx.beginPath(); ctx.ellipse(300 + Math.sin(t + i) * 40 + ph * 20, 1570 - ph * 320, 30 + ph * 70, 22 + ph * 50, 0, 0, Math.PI * 2); ctx.fill(); }
  pickupTruck(ctx, 700, 1560, 0.9);
  kangal(ctx, 930, 1600, 0.8, t);
  // tabela
  ctx.fillStyle = '#2d3a2f'; rr(ctx, 560, 1640, 440, 110, 14); ctx.fill();
  ctx.fillStyle = '#e8f2e8'; ctx.font = '700 42px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('FİLİZ TARIM', 780, 1680);
  ctx.font = '600 24px Inter'; ctx.fillStyle = 'rgba(232,242,232,0.8)'; ctx.fillText('DENEME ÇİFTLİĞİ · KIZILCAHAMAM', 780, 1722);
  ctx.fillStyle = '#4a3a2c'; ctx.fillRect(600, 1750, 14, 120); ctx.fillRect(946, 1750, 14, 120);
}

// ======================================================================= MÜHENDİSLİK OFİSİ (Çınar)
function drawOffice(ctx, t, o = {}) {
  ctx.fillStyle = '#d9dde3'; ctx.fillRect(0, 0, W, H);
  drawAnkaraView(ctx, 560, 120, 480, 520, t, { horizon: 0.7, ax: 0.6, kx: 0.2, seed: 33, count: 5, sunX: 0.7 });
  frostEdges(ctx, 560, 120, 480, 520, 0.8, 52); ctx.strokeStyle = '#2b2f36'; ctx.lineWidth = 14; ctx.strokeRect(560, 120, 480, 520);
  ctx.fillStyle = '#5a6270'; rr(ctx, 40, 140, 460, 300, 8); ctx.fill();
  ctx.fillStyle = '#f2f2f2'; rr(ctx, 56, 156, 428, 268, 6); ctx.fill();
  ctx.strokeStyle = '#2f6fb3'; ctx.lineWidth = 3; ctx.font = '600 36px Caveat'; ctx.fillStyle = '#2f6fb3'; ctx.textAlign = 'left';
  ctx.fillText('Q = m · c · ΔT', 80, 220); ctx.fillText('ısı kaybı ~ ΔT', 80, 280); ctx.strokeRect(300, 300, 150, 90); ctx.beginPath(); ctx.arc(375, 345, 30, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#6b4a33'; ctx.fillRect(40, 480, 460, 20); for (let i = 0; i < 9; i++) { ctx.fillStyle = ['#2f5d7a', '#8a3b2a', '#c9a15a', '#3e5b46'][i % 4]; ctx.fillRect(56 + i * 48, 500, 40, 120); }
  ctx.fillStyle = '#7d6a58'; ctx.fillRect(0, 700, W, 20);
  return null;
}

// ======================================================================= GİRİŞ HOLÜ
function drawEntranceLux(ctx, t, o = {}) {
  ctx.fillStyle = '#2b2622'; ctx.fillRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 300, 0, 1700);
  g.addColorStop(0, '#e4ddd0'); g.addColorStop(1, '#b9b0a2');
  ctx.fillStyle = g; ctx.fillRect(230, 260, 620, 1460);
  ctx.fillStyle = '#c9ccd2'; ctx.fillRect(330, 420, 200, 700); ctx.fillRect(540, 420, 200, 700);
  ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(532, 420, 8, 700);
  ctx.fillStyle = '#111'; rr(ctx, 520, 360, 50, 30, 4); ctx.fill(); ctx.fillStyle = '#ff6a3a'; ctx.font = '700 22px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('12', 545, 376);
  [260, 820].forEach(sx => { ctx.fillStyle = '#c9a15a'; rr(ctx, sx - 16, 520, 32, 60, 8); ctx.fill(); warmGlow(ctx, sx, 520, 220, 0.4, '255,210,140'); });
  ctx.fillStyle = '#e8e4dc'; ctx.fillRect(230, 1440, 620, 280);
  ctx.strokeStyle = 'rgba(120,120,130,0.3)'; ctx.lineWidth = 2; [[250, 1500, 520, 1560], [560, 1480, 830, 1620]].forEach(([a, b, c, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.bezierCurveTo(a + 90, b + 40, c - 90, d - 40, c, d); ctx.stroke(); });
  ctx.fillStyle = '#4a3324'; ctx.fillRect(200, 240, 40, 1500); ctx.fillRect(840, 240, 40, 1500); ctx.fillRect(200, 230, 680, 40);
  ctx.fillStyle = '#3a271b'; ctx.save(); ctx.translate(880, 270); ctx.transform(1, 0.1, 0, 1, 0, 0); ctx.fillRect(0, 0, 180, 1460); ctx.fillStyle = '#c9a15a'; ctx.fillRect(20, 700, 50, 10); ctx.restore();
  drawPerson(ctx, 540, 1720, 1.6, { who: 'cinar', outfit: 'parka', face: 0, t, arm: 'canta', mouth: o.talk ? 'konus' : 'yukari', talk: o.talk ?? 0, brow: 'notr', seed: 9 });
  ctx.fillStyle = '#e9e2d0'; rr(ctx, 620, 1400, 90, 100, 10); ctx.fill();
  ctx.fillStyle = '#3e7a3a'; ctx.fillRect(640, 1340, 10, 70); ctx.fillRect(660, 1330, 10, 80); ctx.fillStyle = '#d9a35a'; ctx.fillRect(680, 1350, 16, 60);
  ctx.fillStyle = '#c9ccd2'; rr(ctx, 330, 1400, 140, 90, 14); ctx.fill();
  ctx.fillStyle = '#2b2d33'; ctx.fillRect(320, 1392, 160, 14); ctx.fillRect(450, 1386, 60, 12);
  ctx.fillStyle = 'rgba(250,252,255,0.9)'; [[470, 1290], [610, 1288], [520, 1282], [580, 1284], [540, 1172]].forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(x, y, 14, 5, 0, 0, Math.PI * 2); ctx.fill(); });
  ctx.fillStyle = '#5a4a3a'; rr(ctx, 380, 1700, 320, 40, 6); ctx.fill();
}

// ======================================================================= AKŞAM SOFRASI
function teaGlass(ctx, x, y, s) {
  ctx.fillStyle = '#f2efe8'; ctx.beginPath(); ctx.ellipse(x, y + 4 * s, 26 * s, 8 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(160,40,20,0.85)'; ctx.beginPath(); ctx.moveTo(x - 12 * s, y - 50 * s); ctx.quadraticCurveTo(x - 4 * s, y - 25 * s, x - 10 * s, y); ctx.lineTo(x + 10 * s, y); ctx.quadraticCurveTo(x + 4 * s, y - 25 * s, x + 12 * s, y - 50 * s); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2 * s; ctx.stroke();
}
function drawDinnerLux(ctx, t, o = {}) {
  ctx.fillStyle = '#2a221d'; ctx.fillRect(0, 0, W, H);
  glassWall(ctx, 560, 300, 500, 700, t, { panes: 2, view: { night: 1, horizon: 0.62, ax: 0.5, kx: 0.15, seed: 51, count: 5 }, frost: 1, night: 1, frame: '#15110e' });
  ctx.fillStyle = '#3a2e26'; ctx.fillRect(0, 300, 540, 700);
  ctx.fillStyle = '#4a3a2e'; rr(ctx, 60, 380, 200, 260, 6); ctx.fill(); ctx.fillStyle = '#c99a5a'; ctx.fillRect(80, 400, 160, 220);
  ctx.fillStyle = '#8a3b2a'; ctx.beginPath(); ctx.arc(160, 510, 60, 0, Math.PI * 2); ctx.fill();
  drawPendant(ctx, 400, 640, 1.1, 1, '#2b2b2b');
  drawPerson(ctx, 300, 1520, 1.35, { who: 'kahraman', outfit: 'knit', face: 0.5, t, noLegs: true, brow: o.myBrow ?? 'endise', eyes: o.myEyes ?? 'nokta', mouth: o.myMouth ?? 'cizgi', seed: 3 });
  drawPerson(ctx, 820, 1520, 1.35, { who: 'cinar', outfit: 'knit', coat: '#7a4a2e', face: -0.5, t, noLegs: true, brow: o.cBrow ?? 'endise', mouth: o.cTalk ? 'konus' : (o.cMouth ?? 'cizgi'), talk: o.cTalk ?? 0, seed: 4 });
  ctx.fillStyle = '#6b4a33'; ctx.fillRect(-20, 1300, W + 40, 620);
  ctx.fillStyle = '#efe9dd'; ctx.fillRect(-20, 1300, W + 40, 24);
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let k = 0; k < W; k += 90) ctx.fillRect(k, 1324, 2, 600);
  // çorbalar
  [[300, 1350], [820, 1350]].forEach(([x, y], i) => {
    ctx.fillStyle = '#e9e4da'; ctx.beginPath(); ctx.ellipse(x, y, 120, 32, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d98a2b'; ctx.beginPath(); ctx.ellipse(x, y - 4, 86, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b8402e'; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(x - 40 + k * 20, y - 6 + (k % 2) * 4, 3, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#f2e27a'; ctx.beginPath(); ctx.moveTo(x + 70, y - 10); ctx.lineTo(x + 104, y - 26); ctx.lineTo(x + 100, y - 4); ctx.closePath(); ctx.fill();
    const ph = (t * 0.5 + i * 0.4) % 1; ctx.fillStyle = `rgba(250,240,225,${0.35 * (1 - ph)})`; ctx.beginPath(); ctx.ellipse(x + Math.sin(t + i) * 10, y - 40 - ph * 120, 12 + ph * 24, 14 + ph * 20, 0, 0, Math.PI * 2); ctx.fill();
  });
  // ekmek sepeti, salata, çaylar, mum
  ctx.fillStyle = '#8a5a2e'; ctx.beginPath(); ctx.ellipse(560, 1420, 110, 30, 0, 0, Math.PI * 2); ctx.fill();
  ['#e3b878', '#d9a35a', '#c98a45'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(520 + i * 40, 1404, 30, 16, 0.2, 0, Math.PI * 2); ctx.fill(); });
  ctx.fillStyle = '#e9e4da'; ctx.beginPath(); ctx.ellipse(560, 1520, 120, 30, 0, 0, Math.PI * 2); ctx.fill();
  [['#d9472b', 520], ['#3e8a3a', 560], ['#f2e8d0', 600], ['#d9472b', 580], ['#3e8a3a', 530]].forEach(([c, x], i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, 1512 - (i % 2) * 6, 11, 0, Math.PI * 2); ctx.fill(); });
  teaGlass(ctx, 160, 1440, 1.1); teaGlass(ctx, 960, 1440, 1.1);
  ctx.fillStyle = '#f2efe8'; ctx.fillRect(420, 1330, 16, 60); ctx.fillStyle = '#ffcf6a'; ctx.beginPath(); ctx.ellipse(428, 1320, 7, 12, 0, 0, Math.PI * 2); ctx.fill(); warmGlow(ctx, 428, 1320, 160, 0.35, '255,200,120');
  if (o.tablet !== false) drawTablet(ctx, 560, 1210, 0.78, t, o.tablet ?? { mode: 'video' });
}

// ======================================================================= ARAS'IN GÖRÜNTÜSÜ: çiftlikte soba başı
function arasVideoLux(ctx, x, y, w, h, t, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, '#3b2c23'); g.addColorStop(1, '#1d1511'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#0e1626'; ctx.fillRect(x + w * 0.05, y + h * 0.1, w * 0.3, h * 0.45);
  ctx.strokeStyle = '#2a1f18'; ctx.lineWidth = w * 0.012; ctx.strokeRect(x + w * 0.05, y + h * 0.1, w * 0.3, h * 0.45);
  ctx.beginPath(); ctx.moveTo(x + w * 0.2, y + h * 0.1); ctx.lineTo(x + w * 0.2, y + h * 0.55); ctx.stroke();
  frostEdges(ctx, x + w * 0.05, y + h * 0.1, w * 0.3, h * 0.45, 0.8, 71);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { ctx.fillStyle = mix('#7a5236', '#5a3a26', ((r + c) % 3) / 3); ctx.beginPath(); ctx.ellipse(x + w * (0.08 + c * 0.045), y + h * (0.9 - r * 0.06), w * 0.024, h * 0.03, 0, 0, Math.PI * 2); ctx.fill(); }
  const fl = 0.8 + 0.2 * Math.sin(t * 9) * Math.sin(t * 5.3);
  const sg = ctx.createRadialGradient(x + w * 0.82, y + h * 0.75, 4, x + w * 0.82, y + h * 0.75, w * 0.6);
  sg.addColorStop(0, `rgba(255,150,60,${0.55 * fl})`); sg.addColorStop(1, 'rgba(255,150,60,0)');
  ctx.fillStyle = sg; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#1b1b1f'; rr(ctx, x + w * 0.72, y + h * 0.48, w * 0.22, h * 0.48, 8); ctx.fill();
  ctx.fillRect(x + w * 0.81, y, w * 0.04, h * 0.5);
  ctx.fillStyle = `rgba(255,140,40,${0.9 * fl})`; rr(ctx, x + w * 0.76, y + h * 0.64, w * 0.14, h * 0.14, 4); ctx.fill();
  ctx.fillStyle = '#9aa0a8'; ctx.beginPath(); ctx.ellipse(x + w * 0.8, y + h * 0.46, w * 0.05, h * 0.04, 0, 0, Math.PI * 2); ctx.fill();
  const s = h / 520;
  ctx.save(); ctx.translate(x + w * 0.44, y + h * 1.25); ctx.scale(s, s);
  drawPerson(ctx, 0, 0, 1.5, { who: 'aras', outfit: 'flannel', face: 0.1, t, noLegs: true, brow: o.brow ?? 'notr', mouth: o.talk ? 'konus' : 'cizgi', talk: o.talk ?? 0, seed: 4 });
  ctx.restore();
  const fs = w / 400;
  ctx.fillStyle = 'rgba(0,0,0,0.45)'; rr(ctx, x + 10 * fs, y + 10 * fs, 110 * fs, 30 * fs, 8 * fs); ctx.fill();
  ctx.fillStyle = '#ff5148'; ctx.beginPath(); ctx.arc(x + 26 * fs, y + 25 * fs, 6 * fs, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `700 ${18 * fs}px Oswald`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('ARAS', x + 40 * fs, y + 26 * fs);
  ctx.restore();
}

// Bölünmüş ekran telefon görüşmesi (ayrıntılı)
function drawSplitCallLux(ctx, t, o = {}) {
  const half = 960;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, half); ctx.clip();
  ctx.fillStyle = '#e9e6e1'; ctx.fillRect(0, 0, W, half);
  glassWall(ctx, 0, 60, W, 860, t, { view: { horizon: 0.62, ax: 0.75, kx: 0.3, seed: 12, sunX: 0.85, sunY: 0.15 }, frost: 0.7 });
  drawPerson(ctx, 470, half + 280, 1.7, { who: 'kahraman', outfit: 'knit', face: 1, t, noLegs: true, arm: 'tut', hand: [565, half - 470], brow: o.myBrow ?? 'endise', seed: 2 });
  ctx.fillStyle = '#111317'; rr(ctx, 548, half - 520, 40, 78, 10); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(0, half, W, H - half); ctx.clip();
  if (o.who === 'cinar') {
    ctx.save(); ctx.translate(0, half); drawOffice(ctx, t, {}); ctx.restore();
    ctx.fillStyle = '#c9b49a'; ctx.fillRect(0, half + 740, W, 220);
    ctx.fillStyle = '#111'; rr(ctx, 70, half + 560, 260, 170, 8); ctx.fill(); ctx.fillStyle = '#1d2a3a'; ctx.fillRect(84, half + 574, 232, 142);
    ctx.strokeStyle = 'rgba(120,200,255,0.8)'; ctx.lineWidth = 2; ctx.strokeRect(110, half + 600, 90, 70); ctx.beginPath(); ctx.arc(250, half + 640, 36, 0, Math.PI * 2); ctx.stroke();
    drawPerson(ctx, 740, H + 220, 1.7, { who: 'cinar', outfit: 'knit', coat: '#7a4a2e', face: -1, t, noLegs: true, arm: 'tut', hand: [655, half + 480], mouth: o.talk ? 'konus' : 'cizgi', talk: o.talk ?? 0, brow: 'endise', seed: 5 });
    ctx.fillStyle = '#111317'; rr(ctx, 615, half + 440, 40, 78, 10); ctx.fill();
  } else {
    ctx.save(); ctx.translate(0, half - 980); drawFarmLux(ctx, t, {}); ctx.restore();
    drawPerson(ctx, 470, H + 220, 1.7, { who: 'aras', outfit: 'flannel', face: 1, t, noLegs: true, arm: 'tut', hand: [565, half + 480], mouth: o.talk ? 'konus' : 'cizgi', talk: o.talk ?? 0, brow: 'endise', seed: 7 });
    ctx.fillStyle = '#111317'; rr(ctx, 548, half + 440, 40, 78, 10); ctx.fill();
  }
  ctx.restore();
  ctx.fillStyle = '#0b0d12'; ctx.fillRect(0, half - 5, W, 10);
  ctx.fillStyle = 'rgba(10,14,22,0.88)'; rr(ctx, 350, half - 34, 380, 68, 34); ctx.fill();
  ctx.fillStyle = o.who === 'cinar' ? '#ffa94d' : '#4fd1c5'; ctx.beginPath(); ctx.arc(386, half, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '700 32px Oswald'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const sec = Math.max(0, Math.floor(o.callT ?? 0));
  ctx.fillText(`${o.who === 'cinar' ? 'ÇINAR' : 'ARAS'}  ·  00:${String(sec).padStart(2, '0')}`, 410, half + 2);
}

// Kapanış yakın planları için sıcak bulanık arka plan
function bokehRoom(ctx, t) {
  ctx.fillStyle = '#2e2622'; ctx.fillRect(0, 0, W, H);
  const R = mulberry32(5);
  for (let i = 0; i < 14; i++) {
    const x = R() * W, y = R() * 900, r = 40 + R() * 90;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,${180 + R() * 50},${100 + R() * 60},${0.25 + R() * 0.2})`); g.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  warmGlow(ctx, 540, 500, 900, 0.35, '255,190,110');
}
