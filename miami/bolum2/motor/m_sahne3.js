// Miami · Bölüm 2 — sahne 3: su altı ve sular altındaki Miami
'use strict';

function car(ctx, x, y, s, col, o = {}) {   // yandan araba; (x,y) alt orta
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s); ctx.rotate(o.rot ?? 0);
  ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-210, 0); ctx.lineTo(-215, -60); ctx.quadraticCurveTo(-200, -90, -140, -96); ctx.lineTo(-90, -150); ctx.quadraticCurveTo(-60, -170, -10, -170);
  ctx.lineTo(90, -168); ctx.quadraticCurveTo(130, -160, 150, -100); ctx.lineTo(205, -90); ctx.quadraticCurveTo(222, -70, 218, 0); ctx.closePath(); inked(ctx, col, 5);
  ctx.beginPath(); ctx.moveTo(-84, -104); ctx.lineTo(-52, -150); ctx.lineTo(-6, -150); ctx.lineTo(-6, -104); ctx.closePath(); inked(ctx, o.glass ?? '#1c2e3a', 4);
  ctx.beginPath(); ctx.moveTo(6, -104); ctx.lineTo(6, -150); ctx.lineTo(84, -148); ctx.lineTo(120, -104); ctx.closePath(); inked(ctx, o.glass ?? '#1c2e3a', 4);
  if (o.taxi) { ctx.fillStyle = '#1b1b1b'; for (let i = 0; i < 8; i++) if (i % 2 === 0) ctx.fillRect(-170 + i * 22, -70, 22, 14); ctx.fillStyle = '#1b1b1b'; ctx.fillRect(-14, -184, 40, 14); }
  [[-130, 0], [130, 0]].forEach(([wx]) => { ctx.beginPath(); ctx.arc(wx, 0, 46, 0, Math.PI * 2); inked(ctx, '#1c1c20', 5); ctx.beginPath(); ctx.arc(wx, 0, 20, 0, Math.PI * 2); inked(ctx, '#b9bcc2', 3); });
  ctx.restore();
}
function cooler(ctx, x, y, s, col = '#f4f1e8') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ptsPath(ctx, [[-90, -60], [90, -60], [110, -20], [-110, -20]]); inked(ctx, '#ffffff', 4);
  ptsPath(ctx, [[-110, -20], [110, -20], [110, 70], [-110, 70]]); inked(ctx, col, 4);
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(40, -18, 70, 86);
  ctx.restore();
}
function underBG(ctx, t, o = {}) {
  const g = ctx.createRadialGradient(540, o.cy ?? 520, 60, 540, o.cy ?? 520, 1300);
  g.addColorStop(0, o.c0 ?? '#86d3c4'); g.addColorStop(0.45, o.c1 ?? '#45a095'); g.addColorStop(1, o.c2 ?? '#1d6460');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // yüzey penceresi ve ışık lekeleri
  ctx.save(); ctx.beginPath(); ctx.ellipse(540, o.cy ?? 520, o.rx ?? 620, o.ry ?? 560, 0, 0, Math.PI * 2); ctx.fillStyle = 'rgba(200,238,228,0.28)'; ctx.fill(); ctx.clip();
  const R = seededRand(o.seed ?? 4);
  for (let i = 0; i < 34; i++) {
    const x = R() * W, y = (o.cy ?? 520) - 520 + R() * 1040 + Math.sin(t * 0.7 + i) * 14, rx = 22 + R() * 90, ry = 12 + R() * 50;
    ctx.beginPath(); ctx.ellipse(x + Math.sin(t * 0.5 + i * 2) * 12, y, rx, ry, R() * 3, 0, Math.PI * 2); ctx.fillStyle = `rgba(222,248,240,${0.3 + R() * 0.3})`; ctx.fill();
  }
  ctx.restore();
}
function seaFloor(ctx, y0, t, o = {}) {
  ctx.fillStyle = vgrad(ctx, y0, H, [[0, o.a ?? '#6a9d8a'], [1, o.b ?? '#a9b48e']]); ctx.fillRect(0, y0, W, H - y0);
  const R = seededRand(o.seed ?? 9);
  for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.ellipse(R() * W, y0 + 20 + R() * (H - y0), 30 + R() * 90, 8 + R() * 24, 0, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,230,${0.05 + R() * 0.08})`; ctx.fill(); }
}
function bubbles(ctx, t, n, seed = 2, a = 0.35) {
  const R = seededRand(seed);
  for (let i = 0; i < n; i++) { const x = R() * W, sp = 90 + R() * 160, y = H - ((R() * H + t * sp) % H), r = 4 + R() * 14; ctx.beginPath(); ctx.arc(x + Math.sin(t * 2 + i) * 10, y, r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(220,252,244,${a})`; ctx.lineWidth = 3; ctx.stroke(); }
}

// ---------------------------------------------------------------- 19.4 Su altı: yüzeye bakış
SC.alt1 = {
  draw(ctx, t, lt, d, E) {
    underBG(ctx, t, { cy: 560 });
    // tekne gövdesi (ilk anlarda solda, sonra uzaklaşır)
    const hv = 1 - smooth(clamp((lt - 0.2) / 1.2));
    if (hv > 0.01) { ctx.save(); ctx.translate(-hv * -0 - (1 - hv) * 700, 0); ctx.beginPath(); ctx.ellipse(120, 1350, 560, 340, -0.45, 0, Math.PI * 2); inked(ctx, '#11273b', 6); rr(ctx, 380, 1020, 90, 60, 14); inked(ctx, '#e0b43a', 4); ctx.restore(); }
    seaFloor(ctx, 1560, t);
    // enkaz: şemsiye, soğutucu
    umbrella(ctx, 880, 1700, 2.2, '#e8517f', '#fff'); cooler(ctx, 260, 1760, 0.8, '#3a84c8');
    bubbles(ctx, t, 22);
    povArms(OV, { hx: 190, hy: 1560, hs: 1.9, pose: 'open', ang: -0.5, bx: -120, by: 2100 }, { hx: 890, hy: 1560, hs: 1.9, pose: 'open', ang: 0.5, bx: 1200, by: 2100 });
    return { k: 0.85, vig: 0.4, shake: 0.006, roll: 0.01 };
  },
};
// ---------------------------------------------------------------- 22.0 Alex su altında
SC.alt2 = {
  draw(ctx, t, lt, d, E) {
    underBG(ctx, t, { cy: 120, ry: 380, c0: '#7ccbbd', c1: '#3f9a90', c2: '#215f60', seed: 12 });
    seaFloor(ctx, 1020, t);
    umbrella(ctx, 150, 1180, 2.4, '#e8d23c', '#6a4aa0'); umbrella(ctx, 960, 1120, 2.2, '#e8517f', '#fff');
    ctx.fillStyle = '#4a5560'; ctx.fillRect(120, 1230, 160, 110); ctx.fillStyle = '#b53a4a'; ctx.fillRect(210, 1330, 150, 30);
    // yüzen Alex: kollar çapraz
    const bob = Math.sin(t * 2.2) * 14;
    alexFigure(ctx, 560, 1560 + bob, 1.55, { arms: 'x', head: { look: [0, 0.1], mouth: 'cizgi', brow: 'korku' } });
    cooler(ctx, 430, 1700, 0.9, '#3a84c8'); ctx.fillStyle = '#e8d23c'; ptsPath(ctx, [[780, 1640], [980, 1620], [1020, 1740], [800, 1770]]); ctx.fill();
    bubbles(ctx, t, 26, 5);
    povArms(OV, { hx: 60, hy: 1560, hs: 1.5, pose: 'open', ang: 0.9, bx: -140, by: 2050 }, { hx: 1030, hy: 1560, hs: 1.5, pose: 'open', ang: -0.9, bx: 1220, by: 2050 });
    return { k: 0.75, vig: 0.4, shake: 0.005, roll: 0.008 };
  },
};
// ---------------------------------------------------------------- 24.0 Su altı: araçlar
SC.alt3 = {
  draw(ctx, t, lt, d, E) {
    underBG(ctx, t, { cy: 300, ry: 420, c0: '#80cfc0', c1: '#41998f', c2: '#20625f', seed: 21 });
    ctx.fillStyle = 'rgba(30,100,100,0.25)'; ctx.fillRect(0, 760, W, 140);
    const fl = 940; seaFloor(ctx, fl, t, { a: '#5c9684', b: '#8fa98a', seed: 14 });
    // yüzen sarı taksi (yukarıda)
    const dx = Math.sin(t * 0.8) * 18;
    car(ctx, 600 + dx, 520, 1.3, '#d9d24a', { taxi: true, rot: -0.12 + Math.sin(t) * 0.02 });
    // dipte yeşil cip ve şemsiye, kırmızı araç
    car(ctx, 330, 1280, 1.0, '#2f6a54', { rot: -0.08 }); umbrella(ctx, 470, 1270, 2.4, '#36b99c', '#fff');
    car(ctx, 1120, 1380, 1.2, '#8a3a34', { rot: 0.14, flip: true });
    ctx.fillStyle = '#4a8bd0'; ptsPath(ctx, [[790, 1430], [880, 1380], [900, 1410], [800, 1470]]); ctx.fill();
    ctx.fillStyle = '#e6e4d8'; ptsPath(ctx, [[150, 1450], [230, 1430], [250, 1480], [170, 1500]]); ctx.fill();
    bubbles(ctx, t, 18, 8);
    povArms(OV, { hx: 350, hy: 1560, hs: 1.55, pose: 'open', ang: -0.3, bx: -100, by: 2050 }, { hx: 760, hy: 1560, hs: 1.55, pose: 'open', ang: 0.35, bx: 1180, by: 2050 });
    return { k: 0.8, vig: 0.4, shake: 0.005, roll: 0.008 };
  },
};

// ---------------------------------------------------------------- Sular altındaki Miami silueti
function glassTower(ctx, x, hy, w, h, o = {}) {
  ctx.save();
  const lean = o.lean ?? 0;
  ctx.beginPath(); ctx.moveTo(x, hy); ctx.lineTo(x + lean, hy - h); ctx.lineTo(x + lean + w * (o.top ?? 1), hy - h); ctx.lineTo(x + w, hy); ctx.closePath();
  inked(ctx, o.col ?? '#7da6cc', 3.4);
  ctx.save(); ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 3;
  for (let i = 1; i < 12; i++) { const yy = hy - h * i / 12; ctx.beginPath(); ctx.moveTo(x - 20, yy); ctx.lineTo(x + w + lean + 20, yy); ctx.stroke(); }
  for (let i = 1; i < 6; i++) { const xx = x + w * i / 6; ctx.beginPath(); ctx.moveTo(xx, hy); ctx.lineTo(xx + lean, hy - h); ctx.stroke(); }
  ctx.fillStyle = 'rgba(20,40,70,0.18)'; ctx.fillRect(x + w * 0.55, hy - h, w, h);
  ctx.restore(); ctx.restore();
}
function lowBuilding(ctx, x, hy, w, h, col, name, o = {}) {
  rr(ctx, x, hy - h, w, h, 4); inked(ctx, col, 4);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; const rows = Math.max(1, Math.floor(h / 70)), cols = Math.floor(w / 62);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { ctx.fillStyle = '#4a7fb0'; ctx.fillRect(x + 20 + c * 62, hy - h + 40 + r * 62, 34, 30); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(x + 20 + c * 62, hy - h + 40 + r * 62, 34, 30); }
  rr(ctx, x + w * 0.15, hy - h - 4, w * 0.7, 36, 4); inked(ctx, o.sign ?? '#f7f1e8', 3);
  ctx.fillStyle = o.ink ?? '#c44a6a'; ctx.font = '800 22px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(name, x + w / 2, hy - h + 14);
}
function palmTree(ctx, x, hy, s) {
  ctx.save(); ctx.translate(x, hy); ctx.scale(s, s); ctx.lineCap = 'round';
  ctx.strokeStyle = INK; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(20, -90, 8, -190); ctx.stroke(); ctx.strokeStyle = '#8a6a44'; ctx.lineWidth = 14; ctx.stroke();
  for (let k = 0; k < 7; k++) { const a = -Math.PI * 0.95 + k * (Math.PI * 0.9 / 6); ctx.beginPath(); ctx.moveTo(8, -190); ctx.quadraticCurveTo(8 + Math.cos(a) * 70, -190 + Math.sin(a) * 60 - 20, 8 + Math.cos(a) * 130, -190 + Math.sin(a) * 40 + 40); ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = '#3a9a52'; ctx.stroke(); }
  ctx.restore();
}
function miamiCity(ctx, hy, t, o = {}) {
  const sky = o.sunset ? [[0, '#8fa6d8'], [0.55, '#d8c4dc'], [1, '#f6d6c4']] : [[0, '#86aee0'], [0.6, '#bcd4ea'], [1, '#e8dcd2']];
  ctx.fillStyle = vgrad(ctx, 0, hy, sky); ctx.fillRect(0, 0, W, hy + 4);
  if (o.sunset) { ctx.fillStyle = 'rgba(255,214,196,0.5)'; ctx.fillRect(0, hy - 160, W, 160); }
  // bulutlar
  (o.clouds ?? []).forEach(([cx, cy, s]) => { ctx.fillStyle = '#f7d9d9'; [[0, 0, 70], [60, 12, 56], [-64, 14, 54], [120, 20, 40]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(cx + dx * s, cy + dy * s, r * s, 0, Math.PI * 2); ctx.fill(); }); ctx.fillStyle = '#e8a8b0'; ctx.fillRect(cx - 120 * s, cy + 30 * s, 260 * s, 14 * s); });
  // uzak gökdelenler
  const T = o.tall ?? 1;
  [[20, 90, 560], [100, 120, 700], [210, 100, 620], [300, 70, 480], [330, 110, 760], [430, 80, 540], [520, 90, 440]].forEach(([x, w, h], i) => glassTower(ctx, x, hy - 60, w, h * T, { col: ['#7da6cc', '#9ab7d6', '#6f97c2'][i % 3] }));
  glassTower(ctx, 800, hy - 60, 160, 1000 * T, { col: '#74a2cf', lean: 70, top: 0.7 });
  glassTower(ctx, 650, hy - 60, 110, 640 * T, { col: '#a2bcd8' });
  // alçak binalar
  lowBuilding(ctx, -20, hy, 170, 150, '#f2b8c2', 'PELICAN SURF', { ink: '#4a8a70' });
  lowBuilding(ctx, 150, hy, 330, 150, '#a9cdeb', 'MANGO BAR', { ink: '#c4467a' });
  lowBuilding(ctx, 470, hy, 260, 230, '#f0b6b6', 'LUNA HOTEL', { ink: '#c44a6a' });
  palmTree(ctx, 740, hy, 0.8); palmTree(ctx, 1040, hy, 0.95);
  if (!o.noUmbrella) umbrella(ctx, 360, hy + 6, 1.3, '#e8d23c', '#2a7fb8');
}
function floodWater(ctx, hy, t, o = {}) {
  ctx.fillStyle = vgrad(ctx, hy, H, [[0, o.a ?? '#7fbfa8'], [0.15, o.b ?? '#4a9d86'], [1, o.c ?? '#2b6d5e']]); ctx.fillRect(0, hy, W, H - hy);
  ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, hy); ctx.lineTo(W, hy); ctx.stroke();
  ctx.lineCap = 'round';
  for (let i = 0; i < 14; i++) {
    const yy = hy + 24 + i * 24 * (1 + i * 0.18), a = Math.sin(t * 0.9 + i * 1.3) * 26;
    ctx.strokeStyle = `rgba(210,245,235,${0.1 + 0.015 * i})`; ctx.lineWidth = 3 + i * 1.1; ctx.beginPath(); ctx.moveTo(-40, yy); ctx.bezierCurveTo(260 + a, yy - 16 - i, 700 - a, yy + 16 + i, W + 40, yy); ctx.stroke();
  }
}
function vaultFar(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ptsPath(ctx, [[-120, 0], [100, -20], [140, 30], [-80, 50]]); inked(ctx, '#2b2b30', 4);
  ptsPath(ctx, [[-100, -2], [90, -22], [120, -60], [-70, -38]]); inked(ctx, '#e3bc34', 4);
  ctx.restore();
}

// ---------------------------------------------------------------- 26.8 Yüzeye çıkış
SC.yuzey = {
  draw(ctx, t, lt, d, E) {
    const hy = 1040 + Math.sin(t * 1.2) * 6;
    miamiCity(ctx, hy, t, {});
    floodWater(ctx, hy, t);
    vaultFar(ctx, 930, hy + 50, 0.7);
    const rd = clamp(lt / 0.5);
    ctx.fillStyle = '#c9232c'; ctx.beginPath(); ctx.arc(960, hy + 4, 9, 0, Math.PI * 2); ctx.fill();
    povArm(OV, { bx: 1180, by: 2050, hx: lerp(900, 1010, rd), hy: lerp(1760, 1520, rd), w0: 200, w1: 78, bend: -40, hs: 1.7, pose: 'open', ang: lerp(0.2, 0.95, rd) });
    povArm(OV, { bx: -80, by: 2000, hx: 190, hy: 1700, w0: 200, w1: 78, bend: 30, hs: 1.4, pose: 'open', ang: 0.2 });
    return { k: 0.6, vig: 0.3, shake: 0.004 };
  },
};
// ---------------------------------------------------------------- 28.8 Salın yanında Alex
function raftTube(ctx, o = {}) {
  // sarı şişme bot: tüp + lacivert etek
  const yt = o.top ?? 830;
  ctx.beginPath(); ctx.moveTo(-80, yt + 330); ctx.quadraticCurveTo(300, yt + 40, 700, yt); ctx.quadraticCurveTo(1000, yt + 10, 1160, yt + 110); ctx.lineTo(1160, yt + 460); ctx.quadraticCurveTo(700, yt + 390, -80, yt + 600); ctx.closePath(); inked(ctx, '#f0c42c', 6);
  ctx.beginPath(); ctx.moveTo(-80, yt + 600); ctx.quadraticCurveTo(700, yt + 390, 1160, yt + 460); ctx.lineTo(1160, yt + 800); ctx.quadraticCurveTo(700, yt + 700, -80, yt + 930); ctx.closePath(); inked(ctx, '#1f2b44', 6);
  ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.beginPath(); ctx.moveTo(-60, yt + 340); ctx.quadraticCurveTo(300, yt + 100, 700, yt + 50); ctx.lineTo(700, yt + 90); ctx.quadraticCurveTo(300, yt + 150, -60, yt + 400); ctx.closePath(); ctx.fill();
  rr(ctx, 600, yt + 200, 70, 640, 16); inked(ctx, '#e5b32c', 4);
}
SC.sal_alex = {
  draw(ctx, t, lt, d, E) {
    const hy = 760;
    miamiCity(ctx, hy, t, { tall: 0.9 });
    floodWater(ctx, hy, t);
    // Alex tüpün arkasından bakıyor, soğutucu önünde
    shirtBust(ctx, 860, 790, 62); alexHead(ctx, 860, 770, 64, { look: [-0.3, 0.2], mouth: 'o', brow: 'korku' });
    raftTube(ctx, { top: 820 });
    cooler(ctx, 950, 880, 0.9);
    povArms(OV, { hx: 170, hy: 1650, hs: 1.4, pose: 'open', ang: 0.3, bx: -100, by: 2050 }, { hx: 560, hy: 1560, hs: 1.4, pose: 'open', ang: -0.3, bx: 1000, by: 2150 });
    return { k: 0.6, vig: 0.3, shake: 0.004 };
  },
};
// ---------------------------------------------------------------- 30.0 Ufukta ikinci dalga
SC.ufuk = {
  draw(ctx, t, lt, d, E) {
    const hy = 980;
    ctx.fillStyle = vgrad(ctx, 0, hy, [[0, '#8fa0d8'], [0.5, '#d2bddc'], [1, '#f8d6c6']]); ctx.fillRect(0, 0, W, hy + 8);
    [[200, 880, 1.2], [620, 850, 1.0], [900, 890, 1.3], [-20, 930, 1.0]].forEach(([cx, cy, s]) => { ctx.fillStyle = '#f9dcdc'; [[0, 0, 60], [55, 10, 48], [-55, 12, 46], [110, 18, 36]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(cx + dx * s, cy + dy * s, r * s, 0, Math.PI * 2); ctx.fill(); }); ctx.fillStyle = '#e8a8b2'; ctx.fillRect(cx - 100 * s, cy + 28 * s, 230 * s, 12 * s); });
    // ufuktaki dalga: yükselir
    const rise = smooth(clamp(lt / 1.3)) * 50;
    const cr = crestFn([[0, hy - 20 - rise * 0.6], [0.3, hy - 40 - rise], [0.6, hy - 46 - rise], [1, hy - 24 - rise * 0.7]]);
    waveBody(ctx, -40, W + 40, hy + 140, cr, { t, foam: 10, swirls: 3, wob: 3 });
    ctx.fillStyle = 'rgba(20,50,70,0.5)'; ctx.fillRect(0, hy + 20, W, 90);
    floodWater(ctx, hy + 110, t, { a: '#6fb59f', b: '#3f927e' });
    // iri açık renkli dalgacıklar (önde)
    ctx.fillStyle = 'rgba(190,235,220,0.7)'; [[170, 1360, 90, 200], [450, 1480, 120, 260], [760, 1420, 70, 190]].forEach(([x, y, w, h]) => { ctx.beginPath(); ctx.ellipse(x, y, w, h, 0.25, 0, Math.PI * 2); ctx.fill(); });
    return { k: 0.6, vig: 0.3, shake: 0.004 };
  },
};
// ---------------------------------------------------------------- 31.3 Salda: uzakta helikopter
function heliFar(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = '#1b1d22'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-34, -16); ctx.lineTo(34, -16); ctx.stroke();
  ctx.fillStyle = '#1b1d22'; ctx.beginPath(); ctx.ellipse(0, 0, 18, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(14, -3, 30, 5);
  ctx.restore();
}
SC.sal_heli = {
  draw(ctx, t, lt, d, E) {
    const hy = 1140;
    miamiCity(ctx, hy, t, { tall: 0.95 });
    floodWater(ctx, hy, t);
    const hp = smooth(clamp(lt / 1.7));
    heliFar(ctx, lerp(720, 660, hp), lerp(800, 720, hp), lerp(1.3, 2.1, hp));
    // sarı salın yüzeyi, soğutucu ve Alex
    ctx.beginPath(); ctx.moveTo(-80, 1500); ctx.quadraticCurveTo(540, 1250, 1160, 1380); ctx.lineTo(1160, 1960); ctx.lineTo(-80, 1960); ctx.closePath(); inked(ctx, '#f0c42c', 6);
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.moveTo(-60, 1540); ctx.quadraticCurveTo(540, 1290, 1140, 1410); ctx.lineTo(1140, 1450); ctx.quadraticCurveTo(540, 1340, -60, 1590); ctx.closePath(); ctx.fill();
    shirtBust(ctx, 930, 1250, 62); alexHead(ctx, 930, 1230, 64, { look: [-0.5, -0.5], mouth: 'o', brow: 'korku' });
    cooler(ctx, 850, 1400, 1.35);
    povArms(OV, { hx: 180, hy: 1780, hs: 1.5, pose: 'fist', ang: 0.2, bx: -100, by: 2150 }, { hx: 880, hy: 1860, hs: 1.5, pose: 'fist', ang: -0.2, bx: 1200, by: 2250 });
    return { k: 0.65, vig: 0.3, shake: 0.005 };
  },
};
