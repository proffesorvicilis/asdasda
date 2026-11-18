// Miami · Bölüm 2 — sahne 1: plaj, kapağı çekme, kapak yakın plan
'use strict';

const SC = {};

function cam(ctx, z, px, py, sx = W / 2, sy = H / 2) { ctx.translate(sx, sy); ctx.scale(z, z); ctx.translate(-px, -py); }
function crestFn(pts) {   // [[u,y],...] → u'dan y (yumuşak doğrusal)
  return u => {
    for (let i = 1; i < pts.length; i++) if (u <= pts[i][0]) { const [a, ya] = pts[i - 1], [b, yb] = pts[i]; return lerp(ya, yb, smooth(clamp((u - a) / (b - a)))); }
    return pts[pts.length - 1][1];
  };
}
function seededRand(seed) { return mulberry32(seed); }

// Sarı merdiven (perspektif): alt (cx0,cy0,yarı genişlik hw0) → üst (cx1,cy1,hw1)
function ladderPersp(ctx, cx0, cy0, hw0, cx1, cy1, hw1, n = 5, rail = 14) {
  const L = [[cx0 - hw0, cy0], [cx1 - hw1, cy1]], R = [[cx0 + hw0, cy0], [cx1 + hw1, cy1]];
  for (let i = 0; i < n; i++) {
    const p = (i + 0.6) / n, pp = Math.pow(p, 0.85);
    const lx = lerp(L[0][0], L[1][0], pp), rx = lerp(R[0][0], R[1][0], pp), y = lerp(cy0, cy1, pp), th = lerp(rail * 1.1, rail * 0.55, pp);
    rr(ctx, lx, y - th / 2, rx - lx, th, th / 2); inked(ctx, '#e5b32c', 3.6);
  }
  [L, R].forEach(r => {
    const th = rail; ctx.beginPath(); ctx.moveTo(r[0][0] - th / 2, r[0][1]); ctx.lineTo(r[1][0] - th / 3, r[1][1]); ctx.lineTo(r[1][0] + th / 3, r[1][1]); ctx.lineTo(r[0][0] + th / 2, r[0][1]); ctx.closePath(); inked(ctx, '#f0c43a', 3.6);
  });
}
function redWheel(ctx, x, y, R, a) {
  ctx.save(); ctx.translate(x, y); ctx.lineCap = 'round';
  ctx.save(); ctx.rotate(a);
  for (let k = 0; k < 3; k++) { const an = k * Math.PI * 2 / 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(an) * R * 0.92, Math.sin(an) * R * 0.92); ctx.lineWidth = R * 0.17 + 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = R * 0.17; ctx.strokeStyle = '#c61f2a'; ctx.stroke(); }
  ctx.restore();
  ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.lineWidth = R * 0.22 + 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = R * 0.22; ctx.strokeStyle = '#c61f2a'; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, R, Math.PI * 1.08, Math.PI * 1.45); ctx.lineWidth = R * 0.07; ctx.strokeStyle = '#f0646a'; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, R * 0.9, Math.PI * 0.1, Math.PI * 0.55); ctx.lineWidth = R * 0.05; ctx.strokeStyle = '#8d1119'; ctx.stroke();
  ctx.rotate(a); ctx.beginPath(); for (let k = 0; k < 6; k++) { const an = k * Math.PI / 3; ctx.lineTo(Math.cos(an) * R * 0.2, Math.sin(an) * R * 0.2); } ctx.closePath(); inked(ctx, '#2b2a2e', 4);
  ctx.restore();
}
function porthole(ctx, x, y, r, content) {   // content(ctx, r): dairenin içine
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); inked(ctx, '#3b3936', 6);
  ctx.beginPath(); ctx.arc(x, y, r * 0.82, 0, Math.PI * 2); ctx.fillStyle = '#10100f'; ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * 0.78, 0, Math.PI * 2); ctx.clip(); ctx.translate(x, y); content(ctx, r * 0.78); ctx.restore();
  ctx.beginPath(); ctx.arc(x, y, r * 0.78, 0, Math.PI * 2); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, r * 0.66, Math.PI * 1.15, Math.PI * 1.55); ctx.lineWidth = r * 0.06; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.stroke();
}

// ---------------------------------------------------------------- Plaj
function lifeguardTower(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = '#6b4a30'; ctx.lineWidth = 9; [[-70, 0], [70, 0]].forEach(([dx]) => { ctx.beginPath(); ctx.moveTo(dx, -110); ctx.lineTo(dx * 1.12, 0); ctx.stroke(); });
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-70, -60); ctx.lineTo(70, -20); ctx.moveTo(70, -60); ctx.lineTo(-70, -20); ctx.stroke();
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(86, -105); ctx.lineTo(128, -2); ctx.stroke(); for (let i = 1; i < 5; i++) { ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(86 + 11 * i, -105 + 24 * i); ctx.lineTo(70 + 12 * i, -105 + 24 * i); ctx.stroke(); }
  rr(ctx, -92, -230, 184, 120, 6); inked(ctx, '#f3f1ea', 4);
  rr(ctx, -70, -214, 126, 54, 4); inked(ctx, '#27406b', 3);
  ctx.fillStyle = '#e8c9a0'; ctx.fillRect(-70, -152, 126, 8);
  rr(ctx, -110, -258, 220, 32, 5); inked(ctx, '#2b5aa6', 4);
  ctx.strokeStyle = '#444'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-100, -258); ctx.lineTo(-100, -330); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-100, -330); ctx.lineTo(-52, -316); ctx.lineTo(-100, -300); ctx.closePath(); inked(ctx, '#d8283a', 3);
  ctx.restore();
}
function umbrella(ctx, x, y, s, c1, c2) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = '#444'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -38); ctx.stroke();
  for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(0, -38); ctx.arc(0, -38, 30, Math.PI + k * Math.PI / 4, Math.PI + (k + 1) * Math.PI / 4); ctx.closePath(); inked(ctx, k % 2 ? c1 : c2, 2); }
  ctx.restore();
}
function stormVault(ctx, cx, by, s, o = {}) {
  ctx.save(); ctx.translate(cx, by); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // açık kapak (menteşe arka kenarda) — arkada
  const lid = o.lid ?? 1;   // 1 açık, 0 kapalı
  if (lid > 0) {
    const L = [[-170, -110], [120, -110], [lerp(120, 110, 1 - lid), -110 - 190 * lid], [lerp(-170, -150, 1 - lid), -110 - 175 * lid]];
    ctx.beginPath(); L.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); inked(ctx, '#7b7a77', 5);
    ctx.save(); ctx.beginPath(); L.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(-220, -330, 130, 260); ctx.restore();
    redWheelSmall(ctx, -120, -110 - 150 * lid, 26);
    ctx.beginPath(); ctx.arc(-20, -110 - 118 * lid, 26, 0, Math.PI * 2); inked(ctx, '#3b3936', 5); ctx.beginPath(); ctx.arc(-20, -110 - 118 * lid, 17, 0, Math.PI * 2); ctx.fillStyle = '#d7e8ee'; ctx.fill();
    ctx.strokeStyle = '#17161a'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-60, -110 - 175 * lid); ctx.lineTo(-48, -110 - 235 * lid); ctx.stroke();
  }
  // üst yüz
  ptsPath(ctx, [[-170, -110], [170, -110], [205, -60], [-205, -60]]); inked(ctx, '#b9b8b2', 4);
  // açıklık
  ptsPath(ctx, [[-135, -103], [135, -103], [160, -68], [-160, -68]]); inked(ctx, '#3a3632', 3);
  // içeride sarı merdiven
  ctx.strokeStyle = '#e5b32c'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(96, -100); ctx.lineTo(104, -70); ctx.moveTo(122, -100); ctx.lineTo(132, -70); ctx.stroke();
  // Alex (açıklıktan görünüyor)
  if (o.alex !== false) {
    const wv = Math.sin((o.t ?? 0) * 7) * 6;
    ctx.save(); ctx.beginPath(); ctx.rect(-170, -190, 340, 124); ctx.clip();
    limb(ctx, 30, -90, 52, -128, 22, 18, SKIN_A[0], 3); limb(ctx, 52, -128, 54 + wv * 0.3, -164, 18, 15, SKIN_A[0], 3); hand(ctx, 54 + wv * 0.3, -164, 0.08 * wv / 6, 0.34, 'open', SKIN_A);
    ctx.beginPath(); ctx.moveTo(-40, -60); ctx.lineTo(-34, -94); ctx.quadraticCurveTo(0, -110, 36, -94); ctx.lineTo(44, -60); ctx.closePath(); inked(ctx, '#c9232c', 3);
    alexHead(ctx, 2, -112, 20, { look: [0.2, -0.4], mouth: 'o', brow: 'korku' });
    ctx.restore();
  }
  // ön dudak ve ön yüz
  ptsPath(ctx, [[-160, -68], [160, -68], [205, -60], [-205, -60]]); inked(ctx, '#c4c3bd', 3);
  rr(ctx, -205, -60, 410, 92, 3); inked(ctx, '#8d8c87', 4);
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(100, -58, 100, 88);
  rr(ctx, -96, -40, 192, 48, 3); inked(ctx, '#e8c52a', 3);
  ctx.fillStyle = '#2a2418'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '800 19px Inter'; ctx.fillText('FIRTINA SIĞINAĞI', 0, -23);
  ctx.font = '800 13px Inter'; ctx.fillText('CAN KURTARAN KULLANIMI', 0, -3);
  ctx.restore();
}
function redWheelSmall(ctx, x, y, R) { redWheel(ctx, x, y, R, 0.3); }

SC.plaj = {
  draw(ctx, t, lt, d, E) {
    const u = easeInOut(clamp(lt / 1.9)), z = lerp(0.85, 2.15, u);
    ctx.fillStyle = vgrad(ctx, 0, 1100, [[0, '#a7cdea'], [1, '#d6e7f1']]); ctx.fillRect(0, 0, W, H);
    // dev dalga (ekran uzayı)
    ctx.save(); const wz = 1 + 0.1 * u + lt * 0.012; ctx.translate(540, 1000); ctx.scale(wz, wz); ctx.translate(-540, -1000);
    const cr = crestFn([[0, 400], [0.12, 250], [0.3, 120], [0.5, 60], [0.72, 110], [0.9, 210], [1, 290]]);
    waveBody(ctx, -80, W + 80, 1300, cr, { t, foam: 20, swirls: 7, wob: 5 });
    // sol üst köşede köpük kıvrımı
    ctx.fillStyle = 'rgba(238,250,247,0.95)'; ctx.beginPath(); ctx.moveTo(-40, 300); ctx.bezierCurveTo(60, 250, 120, 180, 210, 150); ctx.bezierCurveTo(150, 230, 90, 300, 40, 380); ctx.closePath(); ctx.fill();
    ctx.restore();
    // zemin ve nesneler (kamera yaklaşır)
    ctx.save(); cam(ctx, z, 470, 1100, 540, 1090);
    ctx.fillStyle = vgrad(ctx, 1000, 1500, [[0, '#dcc092'], [1, '#cfa874']]); ctx.fillRect(-2000, 1000, 5000, 4000);
    const R = seededRand(7);
    for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(150,110,60,${0.05 + R() * 0.06})`; ctx.beginPath(); ctx.ellipse(-300 + R() * 1700, 1030 + R() * 500, 8 + R() * 26, 3 + R() * 7, 0, 0, Math.PI * 2); ctx.fill(); }
    // uzak şemsiyeler ve insanlar
    [[370, '#e8517f', '#fff'], [585, '#f2c63c', '#2aa198'], [690, '#e8517f', '#fff'], [790, '#d8283a', '#fff'], [905, '#f2c63c', '#2aa198'], [1010, '#e8517f', '#fff'], [18, '#f2c63c', '#2aa198']].forEach(([x, a, b], i) => umbrella(ctx, x, 1004 + (i % 3) * 3, 0.55, a, b));
    ctx.fillStyle = '#6b4a34'; [[420, 1006], [610, 1008], [740, 1005], [860, 1009]].forEach(([x, y]) => { ctx.fillRect(x, y - 14, 5, 14); ctx.beginPath(); ctx.arc(x + 2, y - 17, 3.5, 0, Math.PI * 2); ctx.fill(); });
    lifeguardTower(ctx, 190, 1000, 0.9);
    stormVault(ctx, 470, 1190, 1, { t, lid: 1 });
    ctx.restore();
    // birinci şahıs kollar
    const e = easeInOut(clamp(lt / 2.3));
    povArms(ctx,
      { hx: lerp(215, 540, e), hy: lerp(1560, 1650, e), hs: lerp(1.45, 1.7, e), pose: 'open', ang: lerp(0.35, 0.5, e) },
      { hx: lerp(850, 760, e), hy: lerp(1575, 1320, e), hs: lerp(1.45, 1.8, e), pose: 'open', ang: lerp(-0.5, -0.12, e) });
    return { k: 0.55, zoom: 1, vig: 0.28 };
  },
};

// ---------------------------------------------------------------- Kapağı çek
SC.kapak_cek = {
  draw(ctx, t, lt, d, E) {
    const u = smooth(clamp((lt - 0.45) / 0.95));
    ctx.fillStyle = vgrad(ctx, 0, 1500, [[0, '#9fc6e6'], [0.6, '#cfe3f0'], [1, '#e8dcc4']]); ctx.fillRect(0, 0, W, H);
    const cr = crestFn([[0, 700], [0.25, 560], [0.55, 330], [0.8, 210], [1, 120]]);
    waveBody(ctx, 380, W + 80, 1500, cr, { t, foam: 22, swirls: 5, wob: 4 });
    ctx.fillStyle = 'rgba(236,250,246,0.9)'; ctx.beginPath(); ctx.moveTo(380, 760); ctx.bezierCurveTo(520, 640, 760, 470, 1000, 330); ctx.lineTo(1060, 380); ctx.bezierCurveTo(800, 520, 600, 700, 480, 830); ctx.closePath(); ctx.fill();
    // kapak (açık → kapalı): dört köşe doğrusal geçiş
    const A = [[-90, 170], [470, 330], [440, 1260], [-90, 1420]], B = [[-140, -140], [1220, -140], [1220, 1560], [-140, 1560]];
    const Q = A.map((a, i) => [lerp(a[0], B[i][0], u), lerp(a[1], B[i][1], u)]);
    const bil = (a, b) => { const top = [lerp(Q[0][0], Q[1][0], a), lerp(Q[0][1], Q[1][1], a)], bot = [lerp(Q[3][0], Q[2][0], a), lerp(Q[3][1], Q[2][1], a)]; return [lerp(top[0], bot[0], b), lerp(top[1], bot[1], b)]; };
    ptsPath(ctx, Q); inked(ctx, '#7f7d79', 6);
    ctx.save(); ptsPath(ctx, Q); ctx.clip();
    const gl = ctx.createLinearGradient(Q[0][0], 0, Q[1][0], 0); gl.addColorStop(0, 'rgba(255,255,255,0.14)'); gl.addColorStop(1, 'rgba(0,0,0,0.22)'); ctx.fillStyle = gl; ctx.fillRect(-200, -200, 1600, 2000);
    ctx.restore();
    const sc = Math.hypot(Q[1][0] - Q[0][0], Q[1][1] - Q[0][1]) / 1320;
    const [wx, wy] = bil(0.318, 0.42), [px, py] = bil(0.5, 0.74);
    redWheel(ctx, wx, wy, 190 * Math.max(0.3, sc), 0.2);
    porthole(ctx, px, py, 200 * Math.max(0.3, sc), (c, r) => { c.fillStyle = vgrad(c, -r, r, [[0, '#f6dcc0'], [0.6, '#f1c8a6'], [0.62, '#2f9a96'], [1, '#1f5a74']]); c.fillRect(-r, -r, r * 2, r * 2); });
    // sarı merdiven (altta)
    ladderPersp(ctx, 700, 1960, 330, 820, 1450, 250, 5, 26);
    // kol sapı: siyah çubuk ve kırmızı sekizgen
    const [hx, hy] = bil(0.99, 0.5);
    const gx = lerp(hx - 10, 560, u * 0.6), gy = lerp(hy, 1180, u * 0.6);
    ctx.strokeStyle = INK; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(gx - 230, gy + 14); ctx.lineTo(gx + 10, gy - 14); ctx.stroke();
    ctx.strokeStyle = '#2a2a2e'; ctx.lineWidth = 14; ctx.stroke();
    ctx.beginPath(); for (let k = 0; k < 8; k++) { const an = Math.PI / 8 + k * Math.PI / 4; ctx.lineTo(gx + 20 + Math.cos(an) * 74, gy - 14 + Math.sin(an) * 74); } ctx.closePath(); inked(ctx, '#d8283a', 5);
    ctx.beginPath(); ctx.arc(gx + 8, gy - 38, 34, Math.PI * 1.1, Math.PI * 1.7); ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(255,160,160,0.7)'; ctx.stroke();
    // eller sapı tutuyor
    const pull = smooth(clamp((lt - 0.2) / 0.9));
    povArms(ctx,
      { hx: gx - 120, hy: gy + 30 + pull * 20, hs: 1.7, pose: 'fist', ang: -0.2 },
      { hx: gx + 70, hy: gy + 70 + pull * 20, hs: 1.7, pose: 'fist', ang: 0.5 });
    return { k: 0.7, zoom: 1, vig: 0.3, shake: 0.006 + 0.004 * u };
  },
};

// ---------------------------------------------------------------- Kapak yakın plan: çark ve lombozdaki dalga
SC.kapak_yakin = {
  draw(ctx, t, lt, d, E) {
    ctx.fillStyle = '#58534d'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = vgrad(ctx, 0, H, [[0, '#6e6a64'], [1, '#4a4640']]); ctx.fillRect(0, 0, W, H);
    // kapak yüzü
    ctx.beginPath(); ctx.ellipse(540, 860, 700, 760, 0, 0, Math.PI * 2); inked(ctx, '#7f7d79', 8);
    ctx.beginPath(); ctx.ellipse(540, 860, 640, 700, 0, 0, Math.PI * 2); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.stroke();
    for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; ctx.beginPath(); ctx.arc(540 + Math.cos(a) * 665, 860 + Math.sin(a) * 725, 13, 0, Math.PI * 2); inked(ctx, '#6a6864', 3); }
    // çark: hızla döner
    const w = easeOut(clamp((lt - 0.2) / 1.6)) * 4.2 + (lt > 1.8 ? (lt - 1.8) * 0.15 : 0);
    const wa = 0.4 + w * 1.7;
    redWheel(ctx, 300, 520, 200, wa);
    // lombozdaki görünüm: gün batımı → dalga duvarı → köpüklü su
    const ph = clamp((lt - 0.5) / 2.2);
    porthole(ctx, 560, 1090, 215, (c, r) => {
      c.fillStyle = vgrad(c, -r, r, [[0, '#f8e6cf'], [1, '#f1c8a6']]); c.fillRect(-r, -r, r * 2, r * 2);
      const lv = lerp(0.45, -1.3, smooth(clamp(ph * 1.5)));      // su yüzeyi yükselir
      c.fillStyle = vgrad(c, lv * r, r, [[0, '#46b1a6'], [0.2, '#25788a'], [1, '#17465a']]); c.beginPath(); c.moveTo(-r, r); for (let i = 0; i <= 12; i++) { const x = -r + i * r / 6; c.lineTo(x, lv * r + Math.sin(i * 1.3 + t * 5) * 10); } c.lineTo(r, r); c.closePath(); c.fill();
      if (ph > 0.5) { const R2 = seededRand(5); c.fillStyle = `rgba(190,238,228,${0.35 + 0.4 * clamp((ph - 0.5) * 2)})`; for (let i = 0; i < 16; i++) { c.beginPath(); c.ellipse((R2() - 0.5) * 2 * r, (R2() - 0.5) * 2 * r + Math.sin(t * 4 + i) * 6, 18 + R2() * 40, 14 + R2() * 28, R2() * 3, 0, Math.PI * 2); c.fill(); } }
    });
    // eller çarkı çeviriyor (çarkın kenarında dönerler)
    const hp = a => [300 + Math.cos(a) * 200, 520 + Math.sin(a) * 200];
    const [rx, ry] = hp(wa + 0.15), [lx, ly] = hp(wa + Math.PI * 0.82);
    povArms(ctx, { hx: lx, hy: ly, hs: 1.9, pose: 'fist', ang: -0.5, bend: 40, w0: 150, w1: 66 }, { hx: rx, hy: ry, hs: 1.9, pose: 'fist', ang: 0.6, bend: -40, w0: 150, w1: 66 }, { lx: -160, ly: 1000, rx: 1260, ry: 620 });
    // merdiven (altta)
    ladderPersp(ctx, 540, 1990, 470, 560, 1560, 360, 4, 34);
    return { k: 0.75, zoom: 1, vig: 0.35, shake: 0.012, roll: 0.012 };
  },
};
