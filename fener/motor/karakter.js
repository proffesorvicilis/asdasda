// Gece Nöbeti — karakterler (yumurta kafa) ve iç mekân parçaları
'use strict';

const INK = '#15171c';
const SKIN = '#f3efe6';

// x: merkez, y: ayak tabanı, s: ölçek. Boy ~ 340*s
function drawPerson(ctx, x, y, s, o = {}) {
  const who = o.who ?? 'sen', f = o.face ?? 1, t = o.t ?? 0;
  const bob = Math.sin(t * 2.1 + (o.seed ?? 0)) * 2.2 * s;
  const coat = who === 'riza' ? '#2f4a3a' : who === 'balikci' ? '#c8752a' : '#22304d';
  const coatD = who === 'riza' ? '#223729' : who === 'balikci' ? '#9c5a1e' : '#18233a';
  const legY = y, hipY = y - 74 * s, shY = y - 230 * s + bob, headY = shY - 62 * s;
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // bacaklar
  ctx.strokeStyle = INK; ctx.lineWidth = 9 * s;
  const st = o.step ?? 0;
  if (!o.noLegs) {
  ctx.beginPath();
  ctx.moveTo(x - 16 * s, hipY); ctx.lineTo(x - 18 * s + Math.sin(st) * 14 * s, legY - 6 * s);
  ctx.moveTo(x + 16 * s, hipY); ctx.lineTo(x + 18 * s - Math.sin(st) * 14 * s, legY - 6 * s);
  ctx.stroke();
  ctx.fillStyle = INK;
  [[-18 + Math.sin(st) * 14, 0], [18 - Math.sin(st) * 14, 0]].forEach(([dx]) => {
    ctx.beginPath(); ctx.ellipse(x + dx * s + f * 7 * s, legY - 4 * s, 15 * s, 7 * s, 0, 0, Math.PI * 2); ctx.fill();
  });
  }
  // palto
  ctx.fillStyle = coat;
  ctx.beginPath();
  ctx.moveTo(x - 52 * s, shY + 8 * s);
  ctx.quadraticCurveTo(x - 60 * s, shY - 6 * s, x - 40 * s, shY - 10 * s);
  ctx.lineTo(x + 40 * s, shY - 10 * s);
  ctx.quadraticCurveTo(x + 60 * s, shY - 6 * s, x + 52 * s, shY + 8 * s);
  const hem = o.noLegs ? hipY - 6 * s : hipY + 6 * s;
  ctx.lineTo(x + 66 * s, hem);
  ctx.quadraticCurveTo(x, hem + 10 * s, x - 66 * s, hem);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 4.5 * s; ctx.stroke();
  // palto gölgesi ve düğmeler
  ctx.fillStyle = coatD;
  ctx.beginPath(); ctx.moveTo(x + f * 4 * s, shY - 8 * s); ctx.lineTo(x + f * 10 * s, hipY + 10 * s); ctx.lineTo(x + f * 60 * s, hipY + 6 * s); ctx.lineTo(x + f * 48 * s, shY + 4 * s); ctx.closePath(); ctx.fill();
  if (who === 'sen') {
    ctx.fillStyle = '#d8b25a';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x - f * 10 * s, shY + 30 * s + i * 36 * s, 4.5 * s, 0, Math.PI * 2); ctx.fill(); }
  }
  // kollar
  const arm = o.arm ?? 'asagi';
  const shL = [x - 46 * s, shY + 6 * s], shR = [x + 46 * s, shY + 6 * s];
  let hL = [x - 58 * s, hipY - 10 * s], hR = [x + 58 * s, hipY - 10 * s];
  if (arm === 'canta') { hR = [x + 70 * s, hipY - 4 * s]; }
  if (arm === 'cek' || arm === 'tut') {  // tek kol yukarı: zincir/kol
    const p = o.pull ?? 0;
    const tx = o.hand?.[0] ?? (x + f * 70 * s), ty = (o.hand?.[1] ?? (shY - 60 * s)) + p * 60 * s;
    if (f > 0) hR = [tx, ty]; else hL = [tx, ty];
  }
  if (arm === 'kavra') { // iki el önde (şalter)
    hR = o.hand ?? [x + f * 80 * s, shY + 40 * s];
    hL = [hR[0] - f * 16 * s, hR[1] + 18 * s];
  }
  ctx.strokeStyle = INK; ctx.lineWidth = 7 * s;
  ctx.beginPath(); ctx.moveTo(...shL); ctx.lineTo(...hL); ctx.moveTo(...shR); ctx.lineTo(...hR); ctx.stroke();
  ctx.fillStyle = SKIN;
  [hL, hR].forEach(([hx, hy]) => { ctx.beginPath(); ctx.arc(hx, hy, 11 * s, 0, Math.PI * 2); ctx.fill(); ctx.lineWidth = 4 * s; ctx.stroke(); });
  if (arm === 'canta') { // sırt çantası/el çantası
    ctx.fillStyle = '#4a3b2c';
    rr(ctx, hR[0] - 30 * s, hR[1] + 4 * s, 70 * s, 54 * s, 14 * s); ctx.fill();
    ctx.lineWidth = 4 * s; ctx.stroke();
  }
  drawHead(ctx, x, headY, s, o);
  // ıslaklık damlaları
  if (o.wet) {
    const R = mulberry32(9);
    ctx.fillStyle = 'rgba(190,215,240,0.85)';
    for (let i = 0; i < 9; i++) {
      const dx = (R() - 0.5) * 120 * s, base = R() > 0.5 ? hipY : headY + 40 * s;
      const yy = base + ((t * 160 + R() * 200) % 120) * s;
      ctx.beginPath(); ctx.ellipse(x + dx, yy, 2.5 * s, 4.5 * s, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}

function drawHead(ctx, x, cy, s, o = {}) {
  const who = o.who ?? 'sen', f = o.face ?? 1, t = o.t ?? 0, r = 56 * s;
  ctx.save();
  ctx.lineCap = 'round';
  // kafa
  ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 5 * s;
  ctx.beginPath(); ctx.ellipse(x, cy, r, r * 1.04, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  if (o.wet) { // ıslak parlama
    ctx.fillStyle = 'rgba(160,190,220,0.25)';
    ctx.beginPath(); ctx.ellipse(x - f * 20 * s, cy - 10 * s, 14 * s, 26 * s, 0.3, 0, Math.PI * 2); ctx.fill();
  }
  if (!o.back) {
    const dx = f * 14 * s;
    const ex = [x - 19 * s + dx, x + 19 * s + dx], ey = cy - 2 * s;
    const blink = o.blink ?? (((t * 0.37 + (o.seed ?? 0) * 0.13) % 1) < 0.035);
    const eyes = o.eyes ?? 'nokta';
    ctx.fillStyle = INK;
    ex.forEach(X => {
      if (blink) { ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(X - 7 * s, ey); ctx.lineTo(X + 7 * s, ey); ctx.stroke(); return; }
      if (eyes === 'iri') {
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(X, ey, 11 * s, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 3 * s; ctx.stroke();
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(X + f * 2 * s, ey + 1 * s, 4.5 * s, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.beginPath(); ctx.ellipse(X, ey, 5.5 * s, 7 * s, 0, 0, Math.PI * 2); ctx.fill();
      }
    });
    // kaşlar
    const brow = o.brow ?? 'notr';
    const bw = 5 * s;
    if (who !== 'riza') {
    ctx.strokeStyle = INK; ctx.lineWidth = bw;
    const by = ey - 20 * s;
    const ang = { notr: [0, 0], endise: [6, -6], kizgin: [-7, 7], uzgun: [8, -2], korku: [9, -9] }[brow] || [0, 0];
    ctx.beginPath();
    ctx.moveTo(ex[0] - 10 * s, by + ang[0] * s * 0.0); ctx.lineTo(ex[0] + 10 * s, by - ang[0] * s);
    ctx.moveTo(ex[1] - 10 * s, by - ang[1] * s * -1); ctx.lineTo(ex[1] + 10 * s, by + ang[1] * s * 0.0);
    ctx.stroke();
    }
    // ağız
    const mouth = o.mouth ?? 'cizgi';
    const mx = x + dx, my = cy + 26 * s;
    ctx.strokeStyle = INK; ctx.lineWidth = 4.5 * s; ctx.fillStyle = INK;
    if (who !== 'riza') {
      if (mouth === 'o' || (mouth === 'konus' && (o.talk ?? 0) > 0.3)) {
        const k = mouth === 'o' ? 1 : o.talk;
        ctx.beginPath(); ctx.ellipse(mx, my, 6 * s, (4 + 6 * k) * s, 0, 0, Math.PI * 2); ctx.fill();
      } else if (mouth === 'asagi') {
        ctx.beginPath(); ctx.arc(mx, my + 10 * s, 12 * s, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else if (mouth === 'yukari') {
        ctx.beginPath(); ctx.arc(mx, my - 8 * s, 12 * s, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(mx - 10 * s, my); ctx.lineTo(mx + 10 * s, my); ctx.stroke();
      }
    }
  }
  // şapkalar / sakal
  if (who === 'sen') {         // kırmızı yün bere
    ctx.fillStyle = '#b8352a'; ctx.strokeStyle = INK; ctx.lineWidth = 4.5 * s;
    ctx.beginPath(); ctx.ellipse(x, cy - r * 0.42, r * 1.0, r * 0.78, 0, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#962a21';
    rr(ctx, x - r * 1.04, cy - r * 0.52, r * 2.08, r * 0.36, 10 * s); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c9463a'; ctx.beginPath(); ctx.arc(x, cy - r * 1.22, 13 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (who === 'riza') { // kasket + sakal
    const dx = f * 12 * s;
    const top = cy + r * 0.24;
    ctx.strokeStyle = INK; ctx.lineWidth = 4 * s; ctx.lineJoin = 'round';
    // sakal: yanaklardan başlayıp çenenin altına taşan bulut
    ctx.fillStyle = '#ecebe6';
    ctx.beginPath();
    ctx.moveTo(x - r * 0.97 + dx * 0.3, cy + r * 0.02);
    const n = 7, ccx = x + dx * 0.4, ccy = cy + r * 0.3;
    let px = x - r * 0.97 + dx * 0.3, py = cy + r * 0.02;
    for (let i = 1; i <= n; i++) {
      const a = Math.PI - Math.PI * (i / n);
      const nx = ccx + Math.cos(a) * r * 0.98, ny = ccy + Math.sin(a) * r * 1.0;
      const mxp = (px + nx) / 2, myp = (py + ny) / 2;
      const ox = (mxp - ccx) * 0.16, oy = (myp - ccy) * 0.16;
      ctx.quadraticCurveTo(mxp + ox, myp + oy, nx, ny);
      px = nx; py = ny;
    }
    // bıyık çizgisi (üst kenar)
    ctx.quadraticCurveTo(x + r * 0.62 + dx, cy + r * 0.12, x + r * 0.34 + dx, top);
    ctx.quadraticCurveTo(x + r * 0.16 + dx, top - r * 0.16, x + dx, top + r * 0.02);
    ctx.quadraticCurveTo(x - r * 0.16 + dx, top - r * 0.16, x - r * 0.34 + dx, top);
    ctx.quadraticCurveTo(x - r * 0.62 + dx, cy + r * 0.12, x - r * 0.97 + dx * 0.3, cy + r * 0.02);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // bıyık altı ince çizgi
    ctx.lineWidth = 2.5 * s;
    ctx.beginPath(); ctx.moveTo(x - r * 0.3 + dx, top + r * 0.16); ctx.quadraticCurveTo(x + dx, top + r * 0.26, x + r * 0.3 + dx, top + r * 0.16); ctx.stroke();
    if (o.mouth === 'konus' && (o.talk ?? 0) > 0.2) {
      ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(x + dx, top + r * 0.3, 9 * s, (3 + 10 * o.talk) * s, 0, 0, Math.PI * 2); ctx.fill();
    }
    // gür beyaz kaşlar
    if (!o.back) {
      const ey = cy - 2 * s, by = ey - 21 * s;
      const tilt = { notr: 0, endise: 0.25, korku: 0.35, uzgun: 0.3, kizgin: -0.3 }[o.brow ?? 'notr'] ?? 0;
      [[-19, -1], [19, 1]].forEach(([ox, side]) => {
        ctx.save(); ctx.translate(x + ox * s + dx, by); ctx.rotate(tilt * side);
        ctx.fillStyle = '#f2f1ec'; rr(ctx, -15 * s, -6 * s, 30 * s, 12 * s, 6 * s); ctx.fill();
        ctx.lineWidth = 2.5 * s; ctx.stroke(); ctx.restore();
      });
    }
    // kasket
    ctx.lineWidth = 4 * s;
    ctx.fillStyle = '#3d4249';
    ctx.beginPath(); ctx.ellipse(x - f * 4 * s, cy - r * 0.6, r * 1.04, r * 0.52, 0, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#30353b';
    ctx.beginPath(); ctx.ellipse(x + f * r * 0.58, cy - r * 0.6, r * 0.6, r * 0.15, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (who === 'balikci') {
    ctx.fillStyle = '#20252c'; ctx.strokeStyle = INK; ctx.lineWidth = 4 * s;
    ctx.beginPath(); ctx.ellipse(x, cy - r * 0.45, r, r * 0.7, 0, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

// ---------- İç mekân: bekçi odası
function drawRoom(ctx, t, o = {}) {
  // taş duvar
  ctx.fillStyle = '#262b36'; ctx.fillRect(-60, -60, W + 120, H + 120);
  ctx.strokeStyle = 'rgba(12,14,20,0.55)'; ctx.lineWidth = 3;
  for (let r = 0; r < 26; r++) {
    const y = r * 66;
    ctx.beginPath(); ctx.moveTo(-60, y); ctx.lineTo(W + 60, y); ctx.stroke();
    for (let c = 0; c < 9; c++) {
      const x = c * 150 + (r % 2 ? 75 : 0);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 66); ctx.stroke();
    }
  }
  // pencere (fırtınalı deniz)
  const wx = o.winX ?? 120, wy = o.winY ?? 420, ww = 330, wh = 420;
  ctx.save();
  rr(ctx, wx, wy, ww, wh, 18); ctx.clip();
  drawSky(ctx, o.pal ?? PAL.firtina, t, { horizon: wy + wh * 0.62 });
  ctx.save(); ctx.translate(0, 0);
  drawSea(ctx, o.pal ?? PAL.firtina, t, { horizon: wy + wh * 0.62, bottom: wy + wh + 40, rough: 1.4 });
  ctx.restore();
  drawRain(ctx, t, { n: 70, a: 0.45 });
  ctx.restore();
  ctx.strokeStyle = '#3b2d22'; ctx.lineWidth = 18;
  rr(ctx, wx, wy, ww, wh, 18); ctx.stroke();
  ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.stroke();
  // duvardaki kâğıt
  const px = o.paperX ?? 620, py = o.paperY ?? 470;
  ctx.save(); ctx.translate(px, py); ctx.rotate(-0.03);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(8, 10, 230, 300);
  ctx.fillStyle = '#efe5cf'; ctx.fillRect(0, 0, 230, 300);
  ctx.strokeStyle = 'rgba(40,50,90,0.55)'; ctx.lineWidth = 4;
  for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(26, 50 + i * 26); ctx.lineTo(26 + 120 + (i * 37 % 60), 50 + i * 26); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(120,40,30,0.7)'; ctx.beginPath(); ctx.moveTo(26, 266); ctx.lineTo(160, 270); ctx.stroke();
  ctx.fillStyle = '#5a4a3a'; ctx.beginPath(); ctx.arc(115, 14, 7, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // duvar saati
  const cx = o.clockX ?? 900, cy = o.clockY ?? 330;
  ctx.fillStyle = '#e8e1cf'; ctx.strokeStyle = '#3b2d22'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(cx, cy, 74, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineCap = 'round';
  const hh = o.hour ?? 4, mm = o.min ?? 20;
  const ha = (hh % 12 + mm / 60) / 12 * Math.PI * 2 - Math.PI / 2, ma = mm / 60 * Math.PI * 2 - Math.PI / 2;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ha) * 38, cy + Math.sin(ha) * 38); ctx.stroke();
  ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ma) * 56, cy + Math.sin(ma) * 56); ctx.stroke();
  // masa
  const dy = o.deskY ?? 1360;
  ctx.fillStyle = '#5a3e2a'; ctx.fillRect(-60, dy, W + 120, H - dy + 60);
  ctx.fillStyle = '#6e4d34'; ctx.fillRect(-60, dy, W + 120, 26);
  // defter, kupa
  ctx.fillStyle = '#e9e1cf'; ctx.save(); ctx.translate(430, dy - 6); ctx.rotate(-0.05); ctx.fillRect(-120, -18, 240, 22); ctx.restore();
  ctx.fillStyle = '#334a6b'; rr(ctx, 700, dy - 74, 56, 70, 10); ctx.fill();
  ctx.strokeStyle = '#334a6b'; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(760, dy - 42, 18, -1.2, 1.2); ctx.stroke();
  // gaz lambası
  drawOilLamp(ctx, o.lampX ?? 880, dy, t, o.lampOn ?? 1);
}

function drawOilLamp(ctx, x, base, t, on = 1) {
  const fl = 0.85 + 0.15 * Math.sin(t * 13) * Math.sin(t * 7.3);
  if (on > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, base - 120, 0, x, base - 120, 900);
    g.addColorStop(0, `rgba(255,190,100,${0.42 * on * fl})`); g.addColorStop(0.35, `rgba(255,160,80,${0.16 * on * fl})`); g.addColorStop(1, 'rgba(255,150,70,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 900, base - 1020, 1800, 1800);
    ctx.restore();
  }
  ctx.fillStyle = '#b58a3c'; rr(ctx, x - 46, base - 30, 92, 30, 8); ctx.fill();
  ctx.fillStyle = 'rgba(255,236,190,0.55)';
  ctx.beginPath(); ctx.ellipse(x, base - 100, 38, 70, 0, 0, Math.PI * 2); ctx.fill();
  if (on > 0) {
    ctx.fillStyle = `rgba(255,214,120,${on})`;
    ctx.beginPath(); ctx.ellipse(x, base - 95, 9 * fl, 22 * fl, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = '#7a5a26'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.ellipse(x, base - 100, 38, 70, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#7a5a26'; rr(ctx, x - 30, base - 182, 60, 16, 6); ctx.fill();
}

// ---------- Fener odası içi: dev mercek + şalter
function drawLampRoom(ctx, t, o = {}) {
  const lit = o.lit ?? 0, fog = o.fog ?? 0;
  // dış pencereler
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0a1124'); g.addColorStop(1, '#14223f');
  ctx.fillStyle = g; ctx.fillRect(-60, -60, W + 120, H + 120);
  if (o.dusk) { drawSky(ctx, PAL.aksam, t, { horizon: 1180, sun: { x: 820, y: 1120, r: 46 } }); drawSea(ctx, PAL.aksam, t, { horizon: 1180, bottom: 1500 }); }
  else { drawSky(ctx, PAL.gece, t, { horizon: 1180, stars: fog > 0.3 ? 0 : 0.6 }); drawSea(ctx, PAL.gece, t, { horizon: 1180, bottom: 1500 }); }
  if (fog > 0) drawFog(ctx, t, { d: fog, veil: 0.18 });
  // pencere çerçeveleri
  ctx.strokeStyle = '#1a1d23'; ctx.lineWidth = 26;
  [0, 360, 720, 1080].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1500); ctx.stroke(); });
  ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(0, 520); ctx.lineTo(W, 520); ctx.moveTo(0, 1060); ctx.lineTo(W, 1060); ctx.stroke();
  // zemin
  ctx.fillStyle = '#1f232a'; ctx.fillRect(-60, 1500, W + 120, 500);
  ctx.strokeStyle = '#2c313a'; ctx.lineWidth = 5;
  for (let x = -40; x < W + 60; x += 46) { ctx.beginPath(); ctx.moveTo(x, 1500); ctx.lineTo(x - 30, 1980); ctx.stroke(); }
  // mercek
  const mx = o.lensX ?? 400, my = o.lensY ?? 900, ms = o.lensS ?? 1;
  drawLens(ctx, mx, my, ms, t, lit);
  // şalter kutusu
  if (o.lever !== false) drawLever(ctx, o.leverX ?? 890, o.leverY ?? 1400, 1.1, o.pull ?? 0);
}

function drawLens(ctx, x, y, s, t, lit) {
  // pirinç kaide
  ctx.fillStyle = '#6d5326'; rr(ctx, x - 70 * s, y + 300 * s, 140 * s, 220 * s, 12 * s); ctx.fill();
  ctx.fillStyle = '#8c6c32'; rr(ctx, x - 120 * s, y + 280 * s, 240 * s, 40 * s, 10 * s); ctx.fill();
  // mercek gövdesi (kademeli prizma bantları)
  const rw = 190 * s, rh = 300 * s;
  ctx.save();
  ctx.beginPath(); ctx.ellipse(x, y, rw, rh, 0, 0, Math.PI * 2); ctx.clip();
  const base = lit > 0 ? `rgba(255,${210 + 30 * lit},${140 + 80 * lit},1)` : '#8ea3bf';
  ctx.fillStyle = lit > 0 ? mix('#8ea3bf', '#ffe2a0', lit) : '#7f93ad'; ctx.fillRect(x - rw, y - rh, rw * 2, rh * 2);
  const rot = t * 0.9;
  for (let i = -12; i <= 12; i++) {
    const yy = y + i * 24 * s;
    ctx.fillStyle = (i % 2 === 0) ? `rgba(255,255,255,${0.18 + 0.25 * lit})` : `rgba(40,60,90,${0.25 - 0.18 * lit})`;
    ctx.fillRect(x - rw, yy, rw * 2, 12 * s);
  }
  // dönen panel parlaması
  const px = x + Math.sin(rot) * rw * 0.7;
  const pg = ctx.createRadialGradient(px, y, 0, px, y, 140 * s);
  pg.addColorStop(0, `rgba(255,255,240,${0.2 + 0.7 * lit})`); pg.addColorStop(1, 'rgba(255,255,240,0)');
  ctx.fillStyle = pg; ctx.fillRect(x - rw, y - rh, rw * 2, rh * 2);
  // boğa gözü halkaları
  ctx.strokeStyle = `rgba(255,255,255,${0.35 + 0.3 * lit})`; ctx.lineWidth = 4 * s;
  [30, 60, 92].forEach(r => { ctx.beginPath(); ctx.arc(px, y, r * s, 0, Math.PI * 2); ctx.stroke(); });
  ctx.restore();
  ctx.strokeStyle = '#a07a34'; ctx.lineWidth = 10 * s;
  ctx.beginPath(); ctx.ellipse(x, y, rw, rh, 0, 0, Math.PI * 2); ctx.stroke();
  for (let i = -2; i <= 2; i++) { ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(x - rw * 0.97, y + i * 110 * s); ctx.lineTo(x + rw * 0.97, y + i * 110 * s); ctx.stroke(); }
  if (lit > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y, 0, x, y, 620 * s);
    g.addColorStop(0, `rgba(255,224,150,${0.55 * lit})`); g.addColorStop(0.4, `rgba(255,200,120,${0.2 * lit})`); g.addColorStop(1, 'rgba(255,190,110,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 700 * s, y - 700 * s, 1400 * s, 1400 * s);
    ctx.restore();
  }
}

function leverKnob(x, y, s, pull) { return [x, y - 70 * s + pull * 140 * s]; }
function drawLever(ctx, x, y, s, pull) {
  ctx.fillStyle = '#3a3f48'; rr(ctx, x - 64 * s, y - 130 * s, 128 * s, 260 * s, 14 * s); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 5 * s; ctx.stroke();
  ctx.fillStyle = '#20242b'; rr(ctx, x - 9 * s, y - 86 * s, 18 * s, 172 * s, 9 * s); ctx.fill();
  ctx.font = `700 ${24 * s}px Oswald`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = pull < 0.5 ? '#3ddc8f' : '#7d8693'; ctx.fillText('AÇIK', x, y - 108 * s);
  ctx.fillStyle = pull >= 0.5 ? '#ff6a5e' : '#7d8693'; ctx.fillText('KAPALI', x, y + 110 * s);
  const [kx, ky] = leverKnob(x, y, s, pull);
  ctx.fillStyle = '#9aa1ad'; rr(ctx, kx - 34 * s, ky - 12 * s, 68 * s, 24 * s, 8 * s); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(kx + 44 * s, ky, 16 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#9aa1ad'; ctx.fillRect(kx + 26 * s, ky - 5 * s, 14 * s, 10 * s);
}
