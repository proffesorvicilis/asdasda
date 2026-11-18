// Miami · Bölüm 2 — sahne 2: sığınağın içi (Alex ayakta, tavan, su sızıntısı, lombozdaki tekne, itme)
'use strict';

function rectLerp(A, B, f) { return { x0: lerp(A.x0, B.x0, f), y0: lerp(A.y0, B.y0, f), x1: lerp(A.x1, B.x1, f), y1: lerp(A.y1, B.y1, f) }; }

// Yukarı bakınca görünen şaft: dış çerçeve (ekran) → iç çerçeve (kapak)
function shaftWalls(ctx, Rin, o = {}) {
  const Ro = { x0: -160, y0: -160, x1: W + 160, y1: H + 160 };
  const quads = [
    ['#5a4533', [[Ro.x0, Ro.y0], [Ro.x1, Ro.y0], [Rin.x1, Rin.y0], [Rin.x0, Rin.y0]]],
    ['#715a42', [[Ro.x0, Ro.y1], [Ro.x1, Ro.y1], [Rin.x1, Rin.y1], [Rin.x0, Rin.y1]]],
    ['#7b5f46', [[Ro.x0, Ro.y0], [Rin.x0, Rin.y0], [Rin.x0, Rin.y1], [Ro.x0, Ro.y1]]],
    ['#4f3d2e', [[Ro.x1, Ro.y0], [Rin.x1, Rin.y0], [Rin.x1, Rin.y1], [Ro.x1, Ro.y1]]],
  ];
  quads.forEach(([c, q]) => { ptsPath(ctx, q); ctx.fillStyle = c; ctx.fill(); });
  const R = seededRand(o.seed ?? 3);
  for (let f = 0.1; f < 0.97; f += 0.1) {
    const r = rectLerp(Ro, Rin, Math.pow(f, 0.8));
    ctx.strokeStyle = `rgba(20,12,6,${0.28})`; ctx.lineWidth = 4;
    ctx.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
    for (let i = 0; i < 26; i++) {   // tuğla izleri
      const side = Math.floor(R() * 4), u = R(), r2 = rectLerp(Ro, Rin, Math.pow(Math.min(0.97, f + 0.06), 0.8));
      const P = side === 0 ? [lerp(r.x0, r.x1, u), r.y0, lerp(r2.x0, r2.x1, u), r2.y0] : side === 1 ? [lerp(r.x0, r.x1, u), r.y1, lerp(r2.x0, r2.x1, u), r2.y1] : side === 2 ? [r.x0, lerp(r.y0, r.y1, u), r2.x0, lerp(r2.y0, r2.y1, u)] : [r.x1, lerp(r.y0, r.y1, u), r2.x1, lerp(r2.y0, r2.y1, u)];
      ctx.strokeStyle = 'rgba(20,12,6,0.22)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(P[0], P[1]); ctx.lineTo(P[2], P[3]); ctx.stroke();
    }
  }
  // sağ duvarda sarı merdiven
  if (o.ladder !== false) {
    const rails = [[[W + 160, lerp(Ro.y0, Rin.y0, 0.0) + 520], [Rin.x1, Rin.y0 + 70]], [[W + 160, lerp(Ro.y1, Rin.y1, 0.0) - 560], [Rin.x1, Rin.y1 - 70]]];
    const n = 7;
    for (let i = 0; i < n; i++) { const f = (i + 0.5) / n; const a = [lerp(rails[0][0][0], rails[1][0][0], f), lerp(rails[0][0][1], rails[1][0][1], f)], b = [lerp(rails[0][1][0], rails[1][1][0], f), lerp(rails[0][1][1], rails[1][1][1], f)]; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineWidth = 20; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 12; ctx.strokeStyle = '#e5b32c'; ctx.stroke(); }
    rails.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineWidth = 34; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 24; ctx.strokeStyle = '#f0c43a'; ctx.stroke(); });
  }
}
// Tavandaki kapak: çark + lombozda girdaplı su
function ceilingLid(ctx, Rin, t, o = {}) {
  const w = Rin.x1 - Rin.x0, h = Rin.y1 - Rin.y0;
  rr(ctx, Rin.x0 - 26, Rin.y0 - 26, w + 52, h + 52, 14); inked(ctx, '#8b7d6a', 6);
  rr(ctx, Rin.x0, Rin.y0, w, h, 10); inked(ctx, '#74726f', 6);
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(Rin.x0 + w * 0.5, Rin.y0, w * 0.5, h);
  redWheel(ctx, Rin.x0 + w * 0.28, Rin.y0 + h * 0.5, Math.min(w, h) * 0.2, o.wheel ?? 0.3);
  porthole(ctx, Rin.x0 + w * 0.7, Rin.y0 + h * 0.5, Math.min(w, h) * 0.21, (c, r) => {
    c.fillStyle = o.dark ? '#0d1c22' : '#1f7a82'; c.fillRect(-r, -r, r * 2, r * 2);
    if (!o.dark) { c.strokeStyle = 'rgba(190,240,232,0.85)'; c.lineWidth = r * 0.07; c.lineCap = 'round'; for (let k = 0; k < 3; k++) { c.beginPath(); for (let a = 0; a < 7; a += 0.2) { const rad = r * (0.12 + 0.12 * a + k * 0.0); const ang = a + t * 4 + k * 2.1; c.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad); } c.stroke(); } }
  });
}
function streaks(ctx, Rin, n, t, thick = 8, seed = 1) {
  const R = seededRand(seed);
  for (let i = 0; i < n; i++) {
    const cx = lerp(Rin.x0, Rin.x1, R()), cy = lerp(Rin.y0, Rin.y1, R()), side = Math.floor(R() * 4);
    const ex = side === 2 ? -80 : side === 3 ? W + 80 : lerp(-40, W + 40, R()), ey = side === 0 ? -80 : side === 1 ? H + 80 : lerp(200, H - 100, R());
    const sx = lerp(Rin.x0, Rin.x1, R()), sy = side === 0 ? Rin.y0 : side === 1 ? Rin.y1 : cy, w = thick * (0.7 + R() * 0.8);
    const mid = [(sx + ex) / 2 + (R() - 0.5) * 120, (sy + ey) / 2 + 60 + (R() - 0.5) * 80];
    const pts = []; for (let k = 0; k <= 12; k++) { const u = k / 12; pts.push([(1 - u) * (1 - u) * sx + 2 * (1 - u) * u * mid[0] + u * u * ex, (1 - u) * (1 - u) * sy + 2 * (1 - u) * u * mid[1] + u * u * ey]); }
    waterRibbon(ctx, pts, w, { fill: 'rgba(205,245,238,0.9)', stroke: 'rgba(40,90,100,0.6)' });
  }
}
function shirtBust(ctx, x, y, r) {   // Alex'in baş ve omuzları, aşağı doğru taşar
  ctx.beginPath(); ctx.moveTo(x - r * 2.3, y + r * 3.2); ctx.lineTo(x - r * 1.95, y + r * 1.35); ctx.quadraticCurveTo(x - r * 1.1, y + r * 0.85, x - r * 0.45, y + r * 0.95); ctx.lineTo(x + r * 0.45, y + r * 0.95);
  ctx.quadraticCurveTo(x + r * 1.1, y + r * 0.85, x + r * 1.95, y + r * 1.35); ctx.lineTo(x + r * 2.3, y + r * 3.2); ctx.closePath(); inked(ctx, '#c9232c', 4);
  ctx.beginPath(); ctx.moveTo(x - r * 0.45, y + r * 0.95); ctx.quadraticCurveTo(x, y + r * 1.35, x + r * 0.45, y + r * 0.95); inked(ctx, '#a21c24', 4);
}
function bunkerBackdrop(ctx) { ctx.fillStyle = '#4c3a2b'; ctx.fillRect(0, 0, W, H); }
function floorWater(ctx, y0, t) {
  ctx.fillStyle = vgrad(ctx, y0, H, [[0, '#3c8a7c'], [1, '#2a6a60']]); ctx.fillRect(0, y0, W, H - y0);
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i++) { const yy = y0 + 30 + i * (H - y0) / 8, a = Math.sin(t * 2 + i) * 18; ctx.strokeStyle = 'rgba(200,240,230,0.18)'; ctx.lineWidth = 5 + i; ctx.beginPath(); ctx.moveTo(-20, yy); ctx.bezierCurveTo(300 + a, yy - 14, 700 - a, yy + 14, W + 20, yy); ctx.stroke(); }
  ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(W, y0); ctx.stroke();
}
function barrel(ctx, x, y, rx, ry) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); inked(ctx, '#d4651e', 4);
  ctx.beginPath(); ctx.ellipse(x - rx * 0.1, y - ry * 0.05, rx * 0.72, ry * 0.76, 0, 0, Math.PI * 2); ctx.strokeStyle = '#a24a14'; ctx.lineWidth = 5; ctx.stroke();
}

// ---------------------------------------------------------------- 7.0 Alex ayakta
SC.alex_ayakta = {
  draw(ctx, t, lt, d, E) {
    bunkerBackdrop(ctx);
    // koridor: tavan, zemin, yan duvarlar, arka duvar
    ptsPath(ctx, [[0, 60], [W, 60], [800, 420], [280, 420]]); ctx.fillStyle = '#463627'; ctx.fill();
    ptsPath(ctx, [[0, H - 40], [W, H - 40], [820, 1540], [260, 1540]]); ctx.fillStyle = '#5b4636'; ctx.fill();
    ptsPath(ctx, [[0, 60], [280, 420], [260, 1540], [0, H - 40]]); inked(ctx, '#7a5c44', 4);
    ptsPath(ctx, [[W, 60], [800, 420], [820, 1540], [W, H - 40]]); inked(ctx, '#5f4634', 4);
    ptsPath(ctx, [[280, 420], [800, 420], [820, 1540], [260, 1540]]); inked(ctx, '#6a5240', 4);
    const R = seededRand(11);
    for (let i = 0; i < 40; i++) { ctx.strokeStyle = 'rgba(20,12,6,0.22)'; ctx.lineWidth = 3; const x = R() * 280, y = 150 + R() * 1600; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 40 + R() * 40, y + 6); ctx.stroke(); }
    // sarı tabela (sol duvar)
    ctx.save(); ptsPath(ctx, [[30, 640], [262, 610], [262, 800], [30, 830]]); inked(ctx, '#e8c52a', 4);
    ctx.fillStyle = '#2a2418'; ctx.font = '800 36px Inter'; ctx.textAlign = 'left'; ctx.save(); ctx.translate(46, 745); ctx.rotate(-0.12); ctx.fillText('SIĞINAK 2', 0, -26); ctx.font = '800 22px Inter'; ctx.fillText('CAN KURTARAN', 0, 18); ctx.restore(); ctx.restore();
    // turuncu varil / şamandıra (sağ duvar)
    barrel(ctx, 960, 960, 78, 120); barrel(ctx, 1010, 1330, 90, 130);
    // Alex
    const sway = Math.sin(t * 6) * 6;
    alexFigure(ctx, 640 + sway * 0.3, 1650, 2.3, { arms: 'yukari', head: { look: [0.1, -0.9], mouth: 'o', brow: 'korku', rot: -0.04 } });
    povArms(ctx, { hx: 170, hy: 1450, hs: 1.5, pose: 'palm', ang: 0.15, bx: -80, by: 2000 }, { hx: 940, hy: 1690, hs: 1.5, pose: 'palm', ang: -0.2, bx: 1160, by: 2000 });
    return { k: 0.85, vig: 0.4, shake: 0.006 };
  },
};

// ---------------------------------------------------------------- 8.5 Tavana bak
SC.tavan1 = {
  draw(ctx, t, lt, d, E) {
    const Rin = { x0: 400, y0: 340, x1: 860, y1: 840 };
    shaftWalls(ctx, Rin);
    ceilingLid(ctx, Rin, t, { wheel: 0.3 });
    streaks(ctx, Rin, Math.min(10, 2 + Math.floor(lt * 2.4)), t, 7 + lt * 2, 4);
    // alt solda Alex
    shirtBust(ctx, 230, 1700, 120);
    limb(ctx, 380, 1830, 410, 1600, 70, 52, SKIN_A[0]); hand(ctx, 412, 1560, 0.1, 0.95, 'open', SKIN_A);
    alexHead(ctx, 230, 1700, 120, { look: [0.35, -0.7], mouth: 'o', brow: 'korku', rot: 0.05 });
    povArms(ctx, { hx: 170, hy: 1290, hs: 1.45, pose: 'open', ang: 0.5, bx: -100, by: 1700 }, { hx: 950, hy: 900, hs: 1.45, pose: 'open', ang: -0.7, bx: 1230, by: 1250 });
    return { k: 0.95, zoom: 1, vig: 0.4, shake: 0.007 };
  },
};

// ---------------------------------------------------------------- 12.0 Duvardan giren su
SC.su_duvar = {
  draw(ctx, t, lt, d, E) {
    ctx.fillStyle = vgrad(ctx, 0, 1300, [[0, '#3f3023'], [1, '#6e5640']]); ctx.fillRect(0, 0, W, H);
    const R = seededRand(21);
    for (let r = 0; r < 14; r++) for (let c = 0; c < 8; c++) { const x = c * 150 + (r % 2) * 75 - 30, y = 50 + r * 96; ctx.strokeStyle = 'rgba(20,12,6,0.22)'; ctx.lineWidth = 3; ctx.strokeRect(x, y, 150, 96); if (R() < 0.3) { ctx.fillStyle = 'rgba(0,0,0,0.07)'; ctx.fillRect(x, y, 150, 96); } }
    // kırmızı boru ve ilk yardım tabelası
    ctx.fillStyle = '#c61f2a'; ctx.fillRect(560, 760, 560, 36); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.strokeRect(560, 760, 560, 36);
    rr(ctx, 880, 900, 190, 170, 6); inked(ctx, '#f3efe8', 4); ctx.fillStyle = '#d8283a'; ctx.fillRect(950, 925, 50, 120); ctx.fillRect(915, 960, 120, 50);
    // merdiven (dikey, ortada)
    ctx.beginPath(); ctx.moveTo(380, 120); ctx.lineTo(700, 120); ctx.lineTo(760, 1250); ctx.lineTo(330, 1250); ctx.closePath(); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fill();
    for (let i = 0; i < 12; i++) { const y = 200 + i * 90, x0 = lerp(388, 350, i / 12), x1 = lerp(692, 740, i / 12); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.lineWidth = 20; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 12; ctx.strokeStyle = '#e5b32c'; ctx.stroke(); }
    [[388, 350], [692, 740]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a, 120); ctx.lineTo(b, 1250); ctx.lineWidth = 34; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 24; ctx.strokeStyle = '#f0c43a'; ctx.stroke(); });
    barrel(ctx, 70, 980, 80, 120); barrel(ctx, 175, 1050, 70, 110);
    floorWater(ctx, 1230 - Math.min(160, lt * 40), t);
    // yükselen su şeritleri (cam gibi)
    const a = clamp(lt / 0.5);
    ctx.globalAlpha = a;
    waterRibbon(ctx, [[140, 260], [110, 560], [150, 920], [210, 1340]], 54, { taper: true });
    waterRibbon(ctx, [[660, 210], [650, 560], [700, 960], [760, 1500]], 150 + lt * 20, { taper: true });
    waterRibbon(ctx, [[720, 330], [740, 700], [760, 1100]], 40);
    waterRibbon(ctx, [[40, 560], [70, 900], [100, 1260]], 30);
    ctx.globalAlpha = 1;
    povArms(ctx, { hx: 230, hy: 1010, hs: 1.5, pose: 'palm', ang: 0.15, bx: -80, by: 2000 }, { hx: 870, hy: 790, hs: 1.5, pose: 'palm', ang: -0.2, bx: 1160, by: 2000 });
    return { k: 0.9, vig: 0.4, shake: 0.008 };
  },
};

// ---------------------------------------------------------------- 14.35 Tavan, kapak açılmıyor
SC.tavan2 = {
  draw(ctx, t, lt, d, E) {
    const Rin = { x0: 290, y0: 250, x1: 840, y1: 820 };
    shaftWalls(ctx, Rin, { seed: 8 });
    ceilingLid(ctx, Rin, t, { wheel: 0.5, dark: true });
    streaks(ctx, Rin, 9, t, 14 + lt * 6, 9);
    shirtBust(ctx, 930, 1780, 100);
    limb(ctx, 840, 1860, 760, 1640, 60, 44, SKIN_A[0]); hand(ctx, 756, 1600, -0.3, 0.8, 'open', SKIN_A);
    alexHead(ctx, 930, 1780, 100, { look: [-0.3, -0.7], mouth: 'o', brow: 'korku', rot: -0.1 });
    povArms(ctx, { hx: 170, hy: 560, hs: 1.45, pose: 'open', ang: 1.0, bx: -100, by: 1200 }, { hx: 970, hy: 330, hs: 1.45, pose: 'open', ang: -1.15, bx: 1230, by: 900 });
    return { k: 0.95, vig: 0.4, shake: 0.01 };
  },
};

// ---------------------------------------------------------------- 15.8 Karanlık lomboz: üstünde tekne var
SC.iluminator = {
  draw(ctx, t, lt, d, E) {
    bunkerBackdrop(ctx);
    ctx.fillStyle = vgrad(ctx, 0, 1500, [[0, '#5a4331'], [1, '#6e563f']]); ctx.fillRect(0, 0, W, H);
    const R = seededRand(5);
    for (let i = 0; i < 60; i++) { ctx.strokeStyle = 'rgba(20,12,6,0.2)'; ctx.lineWidth = 3; const x = R() * W, y = R() * 1400; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 50 + R() * 60, y + 4); ctx.stroke(); }
    redWheel(ctx, 20, 560, 190, 0.6);
    // büyük karanlık lomboz (eğik bakış)
    ctx.save(); ctx.translate(560, 470); ctx.scale(1, 0.58);
    ctx.beginPath(); ctx.arc(0, 0, 400, 0, Math.PI * 2); inked(ctx, '#6a4a38', 8);
    ctx.beginPath(); ctx.arc(0, 0, 340, 0, Math.PI * 2); ctx.fillStyle = '#0b161b'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 300, Math.PI * 1.55, Math.PI * 1.95); ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(120,200,200,0.55)'; ctx.stroke();
    ctx.restore();
    // sarı merdiven sağda
    for (let i = 0; i < 4; i++) { const y = 860 + i * 120; ctx.beginPath(); ctx.moveTo(900, y); ctx.lineTo(1100, y - 60); ctx.lineWidth = 18; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 10; ctx.strokeStyle = '#e5b32c'; ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(900, 1380); ctx.lineTo(900, 820); ctx.lineWidth = 30; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 20; ctx.strokeStyle = '#f0c43a'; ctx.stroke();
    floorWater(ctx, 1300, t);
    // Alex: kafa ve omuzlar, kolu yukarıda
    shirtBust(ctx, 540, 1230, 150);
    limb(ctx, 330, 1480, 250, 1230, 80, 60, SKIN_A[0]); limb(ctx, 250, 1230, 215, 1040, 60, 48, SKIN_A[0]); hand(ctx, 213, 995, -0.1, 1.0, 'open', SKIN_A);
    alexHead(ctx, 540, 1230, 150, { look: [0.1, -0.8], mouth: 'o', brow: 'korku' });
    return { k: 0.9, vig: 0.4, shake: 0.006 };
  },
};

// ---------------------------------------------------------------- 17.45 Alex kapağı itiyor (su yükseliyor)
SC.itme = {
  draw(ctx, t, lt, d, E) {
    bunkerBackdrop(ctx);
    ctx.fillStyle = vgrad(ctx, 0, H, [[0, '#6c5a48'], [1, '#4a3a2c']]); ctx.fillRect(0, 0, W, H);
    // kapağın alt yüzü
    ctx.beginPath(); ctx.ellipse(540, 640, 600, 520, 0, 0, Math.PI * 2); inked(ctx, '#7a7774', 6);
    ctx.beginPath(); ctx.ellipse(540, 640, 520, 440, 0, 0, Math.PI * 2); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.stroke();
    porthole(ctx, 540, 640, 250, (c, r) => { c.fillStyle = '#0f2a30'; c.fillRect(-r, -r, r * 2, r * 2); c.fillStyle = 'rgba(120,210,200,0.25)'; c.fillRect(-r, -r, r * 2, r * 0.5); });
    redWheel(ctx, 150, 330, 140, 0.9);
    // Alex iki elle kapağı itiyor
    const push = Math.sin(lt * 9) * 14;
    shirtBust(ctx, 540, 1400, 140);
    limb(ctx, 400, 1560, 360, 1260 + push, 80, 64, SKIN_A[0]); limb(ctx, 680, 1560, 720, 1260 + push, 80, 64, SKIN_A[0]);
    hand(ctx, 355, 1200 + push, -0.1, 1.15, 'palm', SKIN_A); hand(ctx, 725, 1200 + push, 0.1, 1.15, 'palm', SKIN_A);
    alexHead(ctx, 540, 1400, 140, { look: [0, -0.9], mouth: 'bagir', brow: 'kizgin', rot: Math.sin(lt * 9) * 0.03 });
    povArms(ctx, { hx: 150, hy: 1000 + push, hs: 1.5, pose: 'palm', ang: 0.1, bx: -80, by: 1800 }, { hx: 930, hy: 1000 + push, hs: 1.5, pose: 'palm', ang: -0.1, bx: 1160, by: 1800 });
    // su yükseliyor: yeşil-turkuaz örtü
    const k = smooth(clamp(lt / 1.9));
    ctx.fillStyle = `rgba(36,120,112,${0.12 + 0.4 * k})`; ctx.fillRect(0, 0, W, H);
    const R = seededRand(3);
    for (let i = 0; i < 26; i++) { const x = R() * W, y = H - ((R() * H + t * (80 + R() * 160)) % H); ctx.beginPath(); ctx.arc(x, y, 4 + R() * 12, 0, Math.PI * 2); ctx.strokeStyle = `rgba(210,250,240,${0.3 * k})`; ctx.lineWidth = 3; ctx.stroke(); }
    return { k: 0.9, vig: 0.45, shake: 0.012, roll: 0.012 };
  },
};
