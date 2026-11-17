// Tuhaf Saat · Fener — bu bölüme özel çizim parçaları
'use strict';

const NAVY = { top: '#0c1430', bot: '#1a2650', sea: '#0f1b3a', seaBot: '#08112a', wave: '#22325e' };

// ---------- Gece gökyüzü + deniz (referanstaki koyu lacivert)
function nightBackdrop(ctx, t, hy, o = {}) {
  const p = { skyTop: NAVY.top, skyBot: NAVY.bot, sea: NAVY.sea, seaBot: NAVY.seaBot, wave: NAVY.wave };
  drawSky(ctx, p, t, { horizon: hy, moon: o.moon, stars: o.stars ?? 0.25 });
  if (o.clouds !== false) drawClouds(ctx, t, { n: o.nClouds ?? 3, y0: o.cy0 ?? 160, yr: 320, color: 'rgba(28,40,78,0.95)', speed: 0.8, seed: o.seed ?? 11 });
  drawSea(ctx, p, t, { horizon: hy, rough: o.rough ?? 0.9 });
}

// ---------- Çapraz iskele (alt sağdan adaya)
function drawPierDiag(ctx, x1, y1, x2, y2, w1, w2) {
  // (x1,y1): uzak uç (ince), (x2,y2): yakın uç (geniş)
  const ang = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(ang), ny = Math.cos(ang);
  const P = (x, y, w, sgn) => [x + nx * w * sgn, y + ny * w * sgn];
  // direkler
  ctx.fillStyle = '#3b2a1c';
  for (let k = 0.15; k < 1; k += 0.22) {
    const x = lerp(x1, x2, k), y = lerp(y1, y2, k), w = lerp(w1, w2, k);
    const [px, py] = P(x, y, w, 1);
    ctx.fillRect(px - 5 - k * 8, py, 10 + k * 16, 40 + k * 140);
  }
  ctx.fillStyle = '#6b4b31';
  ctx.beginPath();
  ctx.moveTo(...P(x1, y1, w1, -1)); ctx.lineTo(...P(x1, y1, w1, 1)); ctx.lineTo(...P(x2, y2, w2, 1)); ctx.lineTo(...P(x2, y2, w2, -1));
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#4a3322';
  for (let k = 0; k <= 1.001; k += 0.035) {
    const x = lerp(x1, x2, k), y = lerp(y1, y2, k), w = lerp(w1, w2, k);
    ctx.lineWidth = 1 + k * 3;
    ctx.beginPath(); ctx.moveTo(...P(x, y, w, -1)); ctx.lineTo(...P(x, y, w, 1)); ctx.stroke();
  }
  ctx.fillStyle = '#52392a';
  ctx.beginPath();
  ctx.moveTo(...P(x1, y1, w1, 1)); ctx.lineTo(...P(x2, y2, w2, 1));
  const [ex, ey] = P(x2, y2, w2, 1); ctx.lineTo(ex, ey + 18); const [fx, fy] = P(x1, y1, w1, 1); ctx.lineTo(fx, fy + 4);
  ctx.closePath(); ctx.fill();
}

// ---------- Tuğla duvar
function brickWall(ctx, col = '#272f45', line = 'rgba(10,14,24,0.55)', bw = 150, bh = 62, x0 = -60, y0 = -60, x1 = W + 60, y1 = H + 60) {
  ctx.fillStyle = col; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.strokeStyle = line; ctx.lineWidth = 3;
  for (let r = 0, y = y0; y < y1; r++, y += bh) {
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    for (let x = x0 + (r % 2 ? bw / 2 : 0); x < x1; x += bw) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + bh); ctx.stroke(); }
  }
}

// ---------- Eski telsiz (küçük, masada)
function drawRadioSmall(ctx, x, y, s, glow = 0.6) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#4b4136'; rr(ctx, -130, -110, 260, 150, 16); ctx.fill();
  ctx.fillStyle = '#3a3229'; rr(ctx, -130, -110, 260, 20, 10); ctx.fill();
  ctx.fillStyle = '#2b251f';
  for (let i = 0; i < 6; i++) for (let j = 0; j < 7; j++) { ctx.beginPath(); ctx.arc(-108 + j * 13, -78 + i * 18, 3.6, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = `rgba(255,${170 + 40 * glow},60,1)`; rr(ctx, 10, -86, 96, 40, 6); ctx.fill();
  ctx.fillStyle = '#2b251f';
  ctx.beginPath(); ctx.arc(34, -10, 20, 0, Math.PI * 2); ctx.arc(86, -10, 20, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2b251f'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(100, -110); ctx.lineTo(150, -230); ctx.stroke();
  if (glow > 0) {
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(58, -66, 0, 58, -66, 160);
    g.addColorStop(0, `rgba(255,170,60,${0.35 * glow})`); g.addColorStop(1, 'rgba(255,170,60,0)');
    ctx.fillStyle = g; ctx.fillRect(-120, -240, 360, 360);
  }
  ctx.restore();
}

// ---------- Cam lamba (masada)
function drawGlassLamp(ctx, x, base, s, t, on = 1) {
  const fl = 0.88 + 0.12 * Math.sin(t * 13) * Math.sin(t * 7.3);
  if (on > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, base - 120 * s, 0, x, base - 120 * s, 820 * s);
    g.addColorStop(0, `rgba(255,190,90,${0.5 * on * fl})`); g.addColorStop(0.4, `rgba(255,150,60,${0.16 * on * fl})`); g.addColorStop(1, 'rgba(255,140,50,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 900 * s, base - 1000 * s, 1800 * s, 1800 * s);
    ctx.restore();
  }
  ctx.fillStyle = '#e09a2a'; rr(ctx, x - 40 * s, base - 30 * s, 80 * s, 30 * s, 8 * s); ctx.fill();
  ctx.fillStyle = '#e09a2a'; ctx.fillRect(x - 14 * s, base - 80 * s, 28 * s, 52 * s);
  ctx.fillStyle = 'rgba(255,240,200,0.8)'; rr(ctx, x - 30 * s, base - 186 * s, 60 * s, 110 * s, 30 * s); ctx.fill();
  ctx.strokeStyle = '#c47d1c'; ctx.lineWidth = 5 * s; rr(ctx, x - 30 * s, base - 186 * s, 60 * s, 110 * s, 30 * s); ctx.stroke();
  ctx.fillStyle = `rgba(255,214,90,${on})`; ctx.beginPath(); ctx.ellipse(x, base - 132 * s, 12 * s * fl, 32 * s * fl, 0, 0, Math.PI * 2); ctx.fill();
}

// ---------- Masa sahnesi (bekçi masada, telsiz ve lamba)
function drawDeskScene(ctx, t, o = {}) {
  brickWall(ctx, '#2a3046');
  // lomboz pencere
  const px = o.portX ?? 230, py = o.portY ?? 700, pr = 190;
  ctx.save(); ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = '#0d1427'; ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);
  drawRain(ctx, t, { n: 40, a: 0.35 });
  ctx.restore();
  ctx.strokeStyle = '#1b1f2a'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(px - pr, py); ctx.lineTo(px + pr, py); ctx.moveTo(px, py - pr); ctx.lineTo(px, py + pr); ctx.stroke();
  // duvardaki kâğıt
  const qx = o.paperX ?? 720, qy = o.paperY ?? 560;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(qx + 8, qy + 8, 210, 250);
  ctx.fillStyle = '#efe6cf'; ctx.fillRect(qx, qy, 210, 250);
  ctx.strokeStyle = 'rgba(80,90,120,0.45)'; ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(qx + 24, qy + 56 + i * 32); ctx.lineTo(qx + 186, qy + 56 + i * 32); ctx.stroke(); }
  ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(qx + 105, qy + 10, 7, 0, Math.PI * 2); ctx.fill();
  // bekçi (masanın arkasında)
  const kx = o.keeperX ?? 560, ky = o.keeperY ?? 1500;
  drawPerson(ctx, kx, ky, o.ks ?? 1.25, { who: 'bekci', face: o.face ?? 0, t, brow: o.brow ?? 'notr', eyes: o.eyes ?? 'nokta', mouth: o.mouth ?? 'cizgi',
    arm: o.arm ?? 'asagi', hand: o.hand, seed: 2, noLegs: true });
  // masa
  const dy = o.deskY ?? 1360;
  ctx.fillStyle = '#9a5a26'; ctx.fillRect(-60, dy, W + 120, H - dy + 60);
  ctx.fillStyle = '#b36c30'; ctx.fillRect(-60, dy, W + 120, 22);
  ctx.strokeStyle = 'rgba(70,35,10,0.35)'; ctx.lineWidth = 3;
  for (let y = dy + 70; y < H; y += 90) { ctx.beginPath(); ctx.moveTo(-60, y); ctx.lineTo(W + 60, y); ctx.stroke(); }
  // açık defter
  ctx.fillStyle = '#f1ead8';
  ctx.beginPath(); ctx.moveTo(kx - 150, dy + 2); ctx.lineTo(kx + 150, dy + 2); ctx.lineTo(kx + 170, dy - 18); ctx.lineTo(kx - 170, dy - 18); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#9b927e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(kx, dy - 18); ctx.lineTo(kx, dy + 2); ctx.stroke();
  // eller masada
  if (!o.arm || o.arm === 'asagi') {
    ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 4;
    [[kx - 80, dy - 12], [kx + 80, dy - 12]].forEach(([hx, hy]) => { ctx.beginPath(); ctx.arc(hx, hy, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
  }
  drawRadioSmall(ctx, o.radioX ?? 230, dy - 6, 1.15, o.radioGlow ?? 0.6);
  drawGlassLamp(ctx, o.lampX ?? 830, dy, 1.0, t, 1);
}

// ---------- Büyük telsiz (yakın plan)
function drawRadioBig(ctx, t, level = 0, dy = -230) {
  const g = ctx.createRadialGradient(W / 2, 760 + dy, 100, W / 2, 900 + dy, 1200);
  g.addColorStop(0, '#3c3226'); g.addColorStop(1, '#0f0c0a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(-40, dy);
  ctx.fillStyle = '#7a4a22'; ctx.fillRect(0, 1530, W, 400);
  ctx.fillStyle = '#8f5a2a'; ctx.fillRect(0, 1530, W, 18);
  // anten
  ctx.strokeStyle = '#2b251f'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(860, 640); ctx.lineTo(990, 280); ctx.stroke();
  // gövde
  ctx.fillStyle = '#5a4d3f'; rr(ctx, 70, 620, 940, 920, 46); ctx.fill();
  ctx.fillStyle = '#4c4135'; rr(ctx, 70, 620, 940, 60, 30); ctx.fill();
  // hoparlör ızgarası
  ctx.fillStyle = '#2f2821';
  for (let i = 0; i < 17; i++) for (let j = 0; j < 9; j++) { ctx.beginPath(); ctx.arc(150 + j * 34, 740 + i * 44, 9, 0, Math.PI * 2); ctx.fill(); }
  // ekran
  const glow = 0.75 + 0.25 * level;
  ctx.fillStyle = '#2f2821'; rr(ctx, 560, 740, 380, 230, 18); ctx.fill();
  ctx.fillStyle = `rgb(255,${200 + 20 * glow},${70 + 30 * glow})`; rr(ctx, 580, 760, 340, 190, 12); ctx.fill();
  ctx.fillStyle = '#5c3a0e'; ctx.font = '700 66px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('KANAL 16', 750, 820);
  ctx.strokeStyle = '#5c3a0e'; ctx.lineWidth = 4;
  ctx.beginPath();
  for (let x = 600; x <= 900; x += 4) {
    const k = (x - 600) / 300;
    const env = Math.sin(k * Math.PI);
    const y = 900 + Math.sin(x * 0.09 + t * 30) * 26 * level * env + Math.sin(x * 0.23 + t * 47) * 10 * level * env;
    x === 600 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(750, 862); ctx.lineTo(750, 940); ctx.stroke();
  // düğmeler
  ctx.fillStyle = '#2f2821';
  ctx.beginPath(); ctx.arc(640, 1130, 80, 0, Math.PI * 2); ctx.arc(860, 1130, 80, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(230,220,200,0.7)'; ctx.font = '600 30px Inter';
  ctx.fillText('SES', 640, 1250); ctx.fillText('KANAL', 860, 1250);
  // sıcak ışık
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const lg = ctx.createRadialGradient(750, 850, 0, 750, 850, 620);
  lg.addColorStop(0, `rgba(255,170,60,${0.22 + 0.18 * level})`); lg.addColorStop(1, 'rgba(255,170,60,0)');
  ctx.fillStyle = lg; ctx.fillRect(100, 200, 1000, 1300);
  ctx.restore();
  ctx.restore();
  ctx.fillStyle = '#7a4a22'; ctx.fillRect(0, 1530 + dy, W, H);
  ctx.fillStyle = '#8f5a2a'; ctx.fillRect(0, 1530 + dy, W, 18);
}

// ---------- Büyük saat
function drawClockBig(ctx, cx, cy, r, hh, mm, ss) {
  ctx.fillStyle = '#ece4cf'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#6e4423'; ctx.lineWidth = 30; ctx.stroke();
  ctx.strokeStyle = INK;
  for (let i = 0; i < 60; i++) {
    const a = i / 60 * Math.PI * 2, big = i % 5 === 0;
    ctx.lineWidth = big ? 9 : 3;
    const r1 = r - 34, r2 = r - (big ? 80 : 54);
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); ctx.stroke();
  }
  const ha = ((hh % 12) + mm / 60) / 12 * Math.PI * 2 - Math.PI / 2;
  const ma = (mm + ss / 60) / 60 * Math.PI * 2 - Math.PI / 2;
  const sa = ss / 60 * Math.PI * 2 - Math.PI / 2;
  ctx.lineCap = 'round';
  ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ha) * r * 0.5, cy + Math.sin(ha) * r * 0.5); ctx.stroke();
  ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ma) * r * 0.78, cy + Math.sin(ma) * r * 0.78); ctx.stroke();
  ctx.strokeStyle = '#d23b2c'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sa) * r * 0.84, cy + Math.sin(sa) * r * 0.84); ctx.stroke();
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill();
}

// ---------- Merdiven
function drawStairs(ctx, t, prog, o = {}) {
  brickWall(ctx, '#252c42');
  // duvar lambası
  const lx = 210, ly = 640;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 520);
  g.addColorStop(0, 'rgba(255,160,90,0.35)'); g.addColorStop(1, 'rgba(255,160,90,0)');
  ctx.fillStyle = g; ctx.fillRect(lx - 520, ly - 520, 1040, 1040); ctx.restore();
  const lg = ctx.createLinearGradient(0, ly - 130, 0, ly + 130);
  lg.addColorStop(0, '#ffb067'); lg.addColorStop(1, '#a35bb0');
  ctx.fillStyle = '#1b1f2a'; rr(ctx, lx - 50, ly - 140, 100, 280, 50); ctx.fill();
  ctx.fillStyle = lg; rr(ctx, lx - 38, ly - 128, 76, 256, 38); ctx.fill();
  // basamaklar: sol alttan sağ üste
  const n = 14, sx = 40, sy = 1760, stepW = 70, stepH = 52;
  ctx.fillStyle = '#3d3a3c';
  ctx.beginPath(); ctx.moveTo(sx, H + 60);
  for (let i = 0; i < n; i++) { ctx.lineTo(sx + i * stepW, sy - i * stepH); ctx.lineTo(sx + (i + 1) * stepW, sy - i * stepH); }
  ctx.lineTo(W + 60, sy - (n - 1) * stepH); ctx.lineTo(W + 60, H + 60); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#57525a'; ctx.lineWidth = 6;
  for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.moveTo(sx + i * stepW, sy - i * stepH); ctx.lineTo(sx + (i + 1) * stepW, sy - i * stepH); ctx.stroke(); }
  // korkuluk
  ctx.strokeStyle = '#8a5a34'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(sx + 30, sy - 230); ctx.lineTo(sx + n * stepW + 40, sy - n * stepH - 230); ctx.stroke();
  ctx.lineWidth = 4;
  for (let i = 1; i < n; i += 2) { const x = sx + i * stepW + 35, y = sy - i * stepH; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 230 - 0); ctx.stroke(); }
  // basamağa yazılmış numara (üstte)
  ctx.fillStyle = 'rgba(230,225,215,0.75)'; ctx.font = '700 38px Oswald'; ctx.textAlign = 'center';
  ctx.fillText(String(o.topNum ?? 99), sx + (n - 1) * stepW + 40, sy - (n - 1) * stepH + 44);
  // bekçi yürüyor
  const pos = prog * (n - 4) + 0.5;
  const i0 = Math.floor(pos), fr = pos - i0;
  const x = sx + (i0 + 0.5 + fr) * stepW, y = sy - (i0 + (fr > 0.5 ? 1 : 0)) * stepH - Math.sin(fr * Math.PI) * 10;
  drawPerson(ctx, x, y, 1.15, { who: 'bekci', face: 1, t, step: t * 7, brow: o.brow ?? 'kizgin', seed: 5 });
}

// ---------- Basamak sayacı paneli
function drawStepCounter(ctx, n, col = '#ffc83d') {
  ctx.fillStyle = 'rgba(14,16,24,0.85)'; rr(ctx, 690, 290, 230, 170, 22); ctx.fill();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(230,234,242,0.8)'; ctx.font = '700 30px Oswald'; ctx.fillText('BASAMAK', 805, 330);
  ctx.fillStyle = col; ctx.font = '700 96px Oswald'; ctx.fillText(String(n), 805, 402);
  // ilerleme çubuğu
  ctx.fillStyle = '#e9e6df'; rr(ctx, 790, 490, 30, 360, 15); ctx.fill();
  ctx.fillStyle = '#d23b2c'; ctx.beginPath(); ctx.arc(805, 490 + 360 * (1 - n / 99), 20, 0, Math.PI * 2); ctx.fill();
}

// ---------- Arı kovanı mercek (fener odası)
function drawBeehive(ctx, x, y, s, t, lit) {
  const rows = 15, hh = 760 * s, top = y - hh / 2;
  // ışık hâlesi
  if (lit > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y, 0, x, y, 700 * s);
    g.addColorStop(0, `rgba(255,236,160,${0.7 * lit})`); g.addColorStop(0.35, `rgba(255,210,110,${0.28 * lit})`); g.addColorStop(1, 'rgba(255,200,100,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 800 * s, y - 800 * s, 1600 * s, 1600 * s);
    ctx.restore();
  }
  // kaide
  ctx.fillStyle = '#2e2b29'; ctx.fillRect(x - 30 * s, y + hh / 2, 60 * s, 160 * s);
  ctx.fillStyle = '#3a3633'; rr(ctx, x - 120 * s, y + hh / 2 + 150 * s, 240 * s, 30 * s, 8 * s); ctx.fill();
  // tepe
  ctx.fillStyle = '#b8862e';
  ctx.beginPath(); ctx.moveTo(x - 70 * s, top + 4); ctx.lineTo(x - 30 * s, top - 50 * s); ctx.lineTo(x + 30 * s, top - 50 * s); ctx.lineTo(x + 70 * s, top + 4); ctx.closePath(); ctx.fill();
  ctx.fillRect(x - 6 * s, top - 90 * s, 12 * s, 44 * s);
  for (let i = 0; i < rows; i++) {
    const k = (i + 0.5) / rows;
    const wk = Math.sin(Math.min(1, k * 1.15 + 0.05) * Math.PI) * 0.75 + 0.25;
    const w = 300 * s * wk, yy = top + i * hh / rows;
    const offK = (i % 2 === 0) ? 0 : 1;
    const c0 = lit > 0 ? mix('#cfd9e6', '#fff1b8', lit) : (offK ? '#8fa2bc' : '#a9b9cf');
    const c1 = lit > 0 ? mix('#9fb2cc', '#ffd76a', lit) : (offK ? '#7488a4' : '#91a4bf');
    const g = ctx.createLinearGradient(x - w, 0, x + w, 0);
    g.addColorStop(0, c1); g.addColorStop(0.5, c0); g.addColorStop(1, c1);
    ctx.fillStyle = g;
    rr(ctx, x - w, yy + 2, w * 2, hh / rows - 4, 6 * s); ctx.fill();
  }
  if (lit <= 0) { // hedef halkaları (sönükken)
    ctx.strokeStyle = 'rgba(70,90,130,0.6)'; ctx.lineWidth = 4 * s;
    [26, 56, 90].forEach(r => { ctx.beginPath(); ctx.arc(x, y, r * s, 0, Math.PI * 2); ctx.stroke(); });
  }
}

function drawLampRoomB(ctx, t, o = {}) {
  const lit = o.lit ?? 0;
  // camlar: gece, yağmur
  ctx.fillStyle = '#0d1531'; ctx.fillRect(-60, -60, W + 120, 1500);
  ctx.fillStyle = '#132045'; ctx.fillRect(-60, 1000, W + 120, 500);
  ctx.strokeStyle = 'rgba(120,150,210,0.25)'; ctx.lineWidth = 2;
  for (let y = 1030; y < 1490; y += 26) { ctx.beginPath(); ctx.moveTo(-60, y); ctx.lineTo(W + 60, y); ctx.stroke(); }
  drawRain(ctx, t, { n: 110, a: 0.3 });
  ctx.strokeStyle = '#15192a'; ctx.lineWidth = 24;
  [0, 360, 720, 1080].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1500); ctx.stroke(); });
  ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(0, 1000); ctx.lineTo(W, 1000); ctx.stroke();
  // zemin
  ctx.fillStyle = '#2a2826'; ctx.fillRect(-60, 1500, W + 120, 500);
  ctx.fillStyle = '#34312e'; ctx.fillRect(-60, 1500, W + 120, 30);
  drawBeehive(ctx, o.lensX ?? 350, o.lensY ?? 960, o.lensS ?? 0.95, t, lit);
  // şalter direği
  const sx = o.swX ?? 690, sy = o.swY ?? 1200;
  ctx.fillStyle = '#2e2b29'; ctx.fillRect(sx - 8, sy + 60, 16, 1500 - sy - 60);
  ctx.fillStyle = '#6d7480'; rr(ctx, sx - 50, sy - 70, 100, 140, 12); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = lit > 0.5 ? '#3ddc8f' : '#e9e6df'; ctx.font = '700 30px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(lit > 0.5 ? 'AÇIK' : 'KAPALI', sx, sy - 100);
  const p = o.pull ?? 0;
  const ky = sy + lerp(30, -30, p);
  ctx.strokeStyle = '#cfd3da'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx - 40, ky); ctx.stroke();
  ctx.fillStyle = '#d23b2c'; ctx.beginPath(); ctx.arc(sx - 44, ky, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // bekçi
  drawPerson(ctx, o.kx ?? 830, o.ky ?? 1600, 1.2, { who: 'bekci', face: -1, t, arm: 'tut', hand: [sx - 44, ky], brow: o.brow ?? 'kizgin', seed: 6 });
}

// ---------- Yağmurlu pencere (dışarıda huzme)
function drawWindowRain(ctx, t) {
  ctx.fillStyle = '#070b18'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#0c1430'; ctx.fillRect(40, 100, 1000, 1500);
  ctx.fillStyle = '#0f1b3a'; ctx.fillRect(40, 1050, 1000, 550);
  ctx.strokeStyle = 'rgba(80,110,170,0.35)'; ctx.lineWidth = 3;
  for (let y = 1080; y < 1590; y += 34) { ctx.beginPath(); ctx.moveTo(40 + (y * 7) % 90, y); ctx.lineTo(1040, y); ctx.stroke(); }
  // huzmeler (yukarıdan süpürür)
  const ph = t * 0.9;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  [0, 1].forEach(i => {
    const cx = 120 + ((ph * 260 + i * 520) % 1100);
    const g = ctx.createLinearGradient(cx, 100, cx, 1050);
    g.addColorStop(0, 'rgba(255,236,190,0.45)'); g.addColorStop(1, 'rgba(255,236,190,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(cx - 90, 100); ctx.lineTo(cx + 90, 100); ctx.lineTo(cx + 40, 1050); ctx.lineTo(cx - 40, 1050); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,236,190,0.25)'; ctx.beginPath(); ctx.ellipse(cx, 1060, 120, 14, 0, 0, Math.PI * 2); ctx.fill();
  });
  ctx.restore();
  drawRain(ctx, t, { n: 160, a: 0.45, w: 3 });
  ctx.strokeStyle = '#05070f'; ctx.lineWidth = 40; ctx.strokeRect(40, 100, 1000, 1500);
  ctx.lineWidth = 24; ctx.beginPath(); ctx.moveTo(540, 100); ctx.lineTo(540, 1600); ctx.moveTo(40, 850); ctx.lineTo(1040, 850); ctx.stroke();
}

// ---------- Not kartı (deftere yazılan)
function drawNoteCard(ctx, t, k) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(k * 3);
  ctx.translate(520, 700 - (1 - easeOut(clamp(k * 3))) * 40); ctx.rotate(-0.01);
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 30;
  ctx.fillStyle = '#efe6cf'; ctx.fillRect(-310, -130, 620, 260);
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(80,90,120,0.3)'; ctx.lineWidth = 2;
  [-40, 50].forEach(y => { ctx.beginPath(); ctx.moveTo(-280, y + 12); ctx.lineTo(280, y + 12); ctx.stroke(); });
  ctx.fillStyle = '#1d2233'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  const l1 = 'Gece 1. Sakin.', l2 = "Işık 18:42'de yandı.";
  const n1 = Math.floor(l1.length * clamp(k * 1.6)), n2 = Math.floor(l2.length * clamp(k * 1.6 - 0.6));
  ctx.font = '600 76px Caveat'; ctx.fillText(l1.slice(0, n1), -270, -40);
  ctx.fillStyle = '#5a6074'; ctx.font = '600 48px Caveat'; ctx.fillText(l2.slice(0, Math.max(0, n2)), -270, 52);
  ctx.restore();
}
