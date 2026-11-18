// Miami · Bölüm 2 — sahne 4: helikopter, merdiven, tekne ve seçim
'use strict';

// Aşağıdan görünen helikopter: pervane diski, beyaz-lacivert gövde, kuyruk ve iskidler
function heliBelow(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const sp = (o.t ?? 0) * 11;
  ctx.beginPath(); ctx.arc(0, 0, 330, 0, Math.PI * 2); ctx.fillStyle = 'rgba(112,128,156,0.34)'; ctx.fill();
  for (let k = 0; k < 8; k++) { const a = sp + k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 320, Math.sin(a) * 320); ctx.lineWidth = 17; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#4a5160'; ctx.stroke(); }
  // kuyruk
  ctx.beginPath(); ctx.moveTo(40, -20); ctx.lineTo(300, -150); ctx.lineTo(320, -128); ctx.lineTo(60, 56); ctx.closePath(); inked(ctx, '#f4f6f8', 5);
  ctx.beginPath(); ctx.moveTo(296, -158); ctx.lineTo(340, -176); ctx.lineTo(352, -150); ctx.lineTo(318, -126); ctx.closePath(); inked(ctx, '#f4f6f8', 4); ctx.fillStyle = '#d8402a'; ctx.fillRect(334, -178, 16, 10);
  // iskidler
  ctx.strokeStyle = INK; ctx.lineWidth = 12; [[-84, -60, -80, 120], [84, -60, 88, 120]].forEach(([a, b, c, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); });
  // gövde
  ctx.beginPath(); ctx.ellipse(0, 20, 96, 150, 0, 0, Math.PI * 2); inked(ctx, '#f6f7f9', 6);
  ctx.beginPath(); ctx.ellipse(0, 78, 94, 96, 0, 0, Math.PI * 2); ctx.fillStyle = '#26406a'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 20, 96, 150, 0, 0, Math.PI * 2); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = '#e8702a'; ctx.beginPath(); ctx.moveTo(-96, -50); ctx.lineTo(-60, -110); ctx.lineTo(-44, -90); ctx.lineTo(-78, -30); ctx.closePath(); ctx.fill();
  rr(ctx, -26, -16, 52, 40, 6); inked(ctx, '#d8dce2', 4);
  ctx.restore();
}
// Askıda merdiven: (x,y) üst nokta, boy L, eğim a
function hangLadder(ctx, x, y, L, w, a = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.lineCap = 'round';
  const n = Math.max(4, Math.floor(L / 34));
  for (let i = 1; i <= n; i++) { ctx.beginPath(); ctx.moveTo(-w / 2, i * L / n); ctx.lineTo(w / 2, i * L / n); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = '#cfd3d9'; ctx.stroke(); }
  [-w / 2, w / 2].forEach(xx => { ctx.beginPath(); ctx.moveTo(xx, 0); ctx.lineTo(xx, L); ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#aab0b9'; ctx.stroke(); });
  ctx.restore();
}
function ladderPos(x0, y0, a, L) { return [x0 - L * Math.sin(a), y0 + L * Math.cos(a)]; }
// Merdivendeki küçük kişi (arkadan/önden basit): renk gömlek
function ladderMan(ctx, x, y, s, shirt, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  limb(ctx, -14, 10, -22, -46, 12, 10, o.skin ?? SKIN_A[0], 2.6); limb(ctx, 14, 10, 20, -50, 12, 10, o.skin ?? SKIN_A[0], 2.6);
  limb(ctx, -10, 90, -14, 150, 14, 12, o.pants ?? '#243a5e', 2.6); limb(ctx, 10, 90, 12, 150, 14, 12, o.pants ?? '#243a5e', 2.6);
  rr(ctx, -26, 0, 52, 96, 14); inked(ctx, shirt, 3);
  if (o.vest) { ctx.fillStyle = '#e8e23a'; ctx.fillRect(-22, 12, 44, 70); ctx.fillStyle = '#9aa0a8'; ctx.fillRect(-22, 40, 44, 6); }
  ctx.beginPath(); ctx.arc(0, -22, 24, 0, Math.PI * 2); inked(ctx, o.skin ?? SKIN_A[0], 3);
  ctx.beginPath(); ctx.arc(0, -30, 25, Math.PI, Math.PI * 2); inked(ctx, o.hair ?? '#3a2417', 3);
  if (o.helmet) { ctx.beginPath(); ctx.arc(0, -28, 27, Math.PI, Math.PI * 2); inked(ctx, '#20242c', 3); }
  ctx.restore();
}
function sunsetSky(ctx, y1 = 1400) { ctx.fillStyle = vgrad(ctx, 0, y1, [[0, '#86a8de'], [0.55, '#bcc6e6'], [1, '#f2d4d0']]); ctx.fillRect(0, 0, W, H); }
function boatWithRing(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  // tekne: beyaz güverte, kırmızı bant
  ctx.beginPath(); ctx.moveTo(-460, 40); ctx.lineTo(380, -10); ctx.lineTo(470, 50); ctx.lineTo(-420, 120); ctx.closePath(); inked(ctx, '#d84432', 5);
  ctx.beginPath(); ctx.moveTo(-460, 20); ctx.lineTo(380, -30); ctx.lineTo(420, -4); ctx.lineTo(-440, 50); ctx.closePath(); inked(ctx, '#f6f2e8', 5);
  rr(ctx, -380, -130, 130, 120, 6); inked(ctx, '#1f3a60', 4);
  ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-260, -20); ctx.lineTo(-260, -140); ctx.stroke(); umbrella(ctx, -180, -10, 1.6, '#e8517f', '#fff');
  // kişi: sarı saçlı, kırmızı tişört, turuncu simiti başının üstünde tutuyor
  const px = o.px ?? 60;
  ladderMan(ctx, px, -250, 1.1, '#d8283a', { skin: '#e8b890', hair: '#e8d070' });
  ctx.beginPath(); ctx.arc(px, -330, 52, 0, Math.PI * 2); ctx.lineWidth = 28; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 18; ctx.strokeStyle = '#ee7a2a'; ctx.stroke();
  ctx.strokeStyle = '#f8f2e8'; ctx.lineWidth = 10; [0, 1, 2, 3].forEach(k => { ctx.beginPath(); ctx.arc(px, -330, 52, k * Math.PI / 2 + 0.2, k * Math.PI / 2 + 0.7); ctx.stroke(); });
  ctx.restore();
}
function waveWall(ctx, t, o = {}) {
  const cr = crestFn(o.crest ?? [[0, 700], [0.22, 560], [0.5, 470], [0.78, 560], [1, 700]]);
  waveBody(ctx, -60, W + 60, o.y1 ?? 1360, cr, { t, foam: 16, swirls: 6, wob: 4 });
}

// ---------------------------------------------------------------- 33.0 Helikopter tepemizde
SC.heli_ust = {
  draw(ctx, t, lt, d, E) {
    sunsetSky(ctx);
    const hy = 1380;
    ctx.save(); ctx.translate(0, 620); miamiCity(ctx, hy - 620 + 160, t, { tall: 0.55, noUmbrella: true }); ctx.restore();
    floodWater(ctx, hy, t);
    const gr = smooth(clamp(lt / 1.4));
    heliBelow(ctx, 520, lerp(560, 440, gr), lerp(0.9, 1.15, gr), { t, rot: -0.05 });
    hangLadder(ctx, 520, lerp(640, 600, gr), 380, 56, 0.02);
    // salda Alex (sağda), soğutucu
    ctx.beginPath(); ctx.moveTo(-80, 1650); ctx.quadraticCurveTo(540, 1480, 1160, 1560); ctx.lineTo(1160, 1960); ctx.lineTo(-80, 1960); ctx.closePath(); inked(ctx, '#f0c42c', 6);
    cooler(ctx, 760, 1600, 1.3);
    ladderMan(ctx, 930, 1380, 2.0, '#c9232c', {});
    povArms(OV, { hx: 190, hy: 1760, hs: 1.5, pose: 'fist', ang: 0.2, bx: -100, by: 2150 }, { hx: 900, hy: 1820, hs: 1.5, pose: 'fist', ang: -0.2, bx: 1200, by: 2250 });
    return { k: 0.65, vig: 0.3, shake: 0.006 };
  },
};
// ---------------------------------------------------------------- 34.45 Alex merdivende kayıyor
SC.heli_alex = {
  draw(ctx, t, lt, d, E) {
    sunsetSky(ctx);
    ctx.save(); ctx.translate(0, 560); miamiCity(ctx, 1420 - 560, t, { tall: 0.6, noUmbrella: true }); ctx.restore();
    floodWater(ctx, 1420, t);
    heliBelow(ctx, 590, 420, 1.45, { t, rot: 0.25 });
    hangLadder(ctx, 700, 640, 540, 70, 0.28);
    // Alex merdivenin ucunda: kafası yan, eli yüzünde
    const sw = Math.sin(t * 5) * 0.06;
    ctx.save(); ctx.translate(810, 1040); ctx.rotate(0.35 + sw);
    limb(ctx, -20, 0, -38, -140, 40, 34, SKIN_A[0]); hand(ctx, -40, -170, -0.2, 0.7, 'fist', SKIN_A);
    limb(ctx, 20, 20, 90, -60, 40, 34, SKIN_A[0]); hand(ctx, 96, -80, 0.4, 0.7, 'open', SKIN_A);
    limb(ctx, -20, 190, -34, 330, 44, 38, SKIN_A[0]); limb(ctx, 30, 190, 40, 330, 44, 38, SKIN_A[0]);
    ptsPath(ctx, [[-62, 160], [62, 160], [74, 250], [-74, 250]]); inked(ctx, '#243a5e', 4);
    ctx.beginPath(); ctx.moveTo(-70, -30); ctx.quadraticCurveTo(0, -60, 70, -30); ctx.lineTo(78, 168); ctx.lineTo(-78, 168); ctx.closePath(); inked(ctx, '#c9232c', 4);
    alexHead(ctx, 0, -92, 54, { look: [0.5, 0.6], mouth: 'bagir', brow: 'korku', rot: -0.2 });
    ctx.restore();
    povArm(OV, { bx: 1240, by: 1500, hx: lerp(1010, 960, smooth(clamp(lt / 1.2))), hy: lerp(1100, 960, smooth(clamp(lt / 1.2))), w0: 230, w1: 100, bend: -50, hs: 2.1, pose: 'open', ang: -0.7 });
    return { k: 0.6, rot: 0.2, vig: 0.3, shake: 0.007 };
  },
};
// ---------------------------------------------------------------- 35.95 Tekne ve dev dalga
SC.tekne = {
  draw(ctx, t, lt, d, E) {
    ctx.fillStyle = vgrad(ctx, 0, 1000, [[0, '#9aa8dc'], [0.6, '#d4c4e0'], [1, '#f6d6ce']]); ctx.fillRect(0, 0, W, H);
    waveWall(ctx, t, { crest: [[0, 620], [0.25, 500], [0.55, 380], [0.8, 440], [1, 560]], y1: 1280 });
    ctx.fillStyle = 'rgba(236,250,246,0.9)'; ctx.beginPath(); ctx.moveTo(-40, 700); ctx.bezierCurveTo(200, 560, 520, 400, 780, 380); ctx.lineTo(820, 420); ctx.bezierCurveTo(540, 470, 260, 620, 0, 760); ctx.closePath(); ctx.fill();
    floodWater(ctx, 1180, t, { a: '#58a896', b: '#3f9080' });
    boatWithRing(ctx, 420 + Math.sin(t * 1.5) * 8, 1180 + Math.sin(t * 1.7) * 6, 1.0);
    heliBelow(ctx, 1000, 80, 0.9, { t, rot: 0.2 });
    ctx.fillStyle = 'rgba(190,235,220,0.7)'; [[160, 1560, 100, 230], [520, 1700, 130, 300], [900, 1580, 80, 200]].forEach(([x, y, w, h]) => { ctx.beginPath(); ctx.ellipse(x, y, w, h, 0.3, 0, Math.PI * 2); ctx.fill(); });
    return { k: 0.6, vig: 0.3, shake: 0.006, roll: 0.01 };
  },
};
// ---------------------------------------------------------------- 37.5 Helikopter, merdiven ve dalga
function heliLadderScene(ctx, t, lt, o = {}) {
  sunsetSky(ctx);
  waveWall(ctx, t, { crest: [[0, 760], [0.25, 620], [0.5, 520], [0.75, 620], [1, 800]], y1: 1400 });
  ctx.fillStyle = 'rgba(236,250,246,0.85)'; ctx.beginPath(); ctx.moveTo(-40, 820); ctx.bezierCurveTo(240, 640, 560, 480, 860, 520); ctx.lineTo(900, 566); ctx.bezierCurveTo(600, 560, 300, 720, 0, 900); ctx.closePath(); ctx.fill();
  palmTree(ctx, 1000, 1180, 0.9);
  floodWater(ctx, 1300, t, { a: '#58a896', b: '#3f9080' });
  const sw = Math.sin(t * 2.2) * 0.03;
  heliBelow(ctx, 560, 300, 1.2, { t, rot: 0.28 + sw });
  hangLadder(ctx, 600, 520, 640, 66, 0.3);
  const [px, py] = ladderPos(600, 520, 0.3, 150), [ax, ay] = ladderPos(600, 520, 0.3, 430 + (o.alexY ?? 0));
  ladderMan(ctx, px, py, 0.95, '#2a2d34', { vest: true, helmet: true, pants: '#1b1d22', skin: '#d9a77a', rot: 0.3 });
  ladderMan(ctx, ax, ay, 0.95, '#c9232c', { pants: '#243a5e', rot: 0.3 });
  if (o.boat) boatWithRing(ctx, 140, 1420, 0.8, { px: 120 });
  ctx.fillStyle = 'rgba(190,235,220,0.7)'; [[200, 1620, 120, 260], [620, 1740, 150, 320], [980, 1600, 90, 210]].forEach(([x, y, w, h]) => { ctx.beginPath(); ctx.ellipse(x, y, w, h, 0.3, 0, Math.PI * 2); ctx.fill(); });
}
SC.heli_ikili = {
  draw(ctx, t, lt, d, E) {
    heliLadderScene(ctx, t, lt, { alexY: 40 });
    // dev el yukarıdan (merdivene uzanıyor)
    const hk = smooth(clamp((lt - 0.3) / 0.6)) * (1 - smooth(clamp((lt - 1.2) / 0.4)));
    if (hk > 0.01) povArm(OV, { bx: 1240, by: -300, hx: 880, hy: lerp(-120, 360, hk), w0: 260, w1: 130, bend: 40, hs: 2.4, pose: 'open', ang: 2.6 });
    return { k: 0.6, rot: -0.1, vig: 0.3, shake: 0.007 };
  },
};
SC.heli_git = {
  draw(ctx, t, lt, d, E) {
    const u = smooth(clamp(lt / 1.6));
    heliLadderScene(ctx, t, lt, { alexY: 40 - u * 190, boat: true });
    return { k: 0.6, rot: -0.1, vig: 0.3, shake: 0.007 };
  },
};
// ---------------------------------------------------------------- 41.3 Seçim ekranı (son kare koyulaşır)
SC.secim = {
  draw(ctx, t, lt, d, E) {
    const u = smooth(clamp((lt + 2.2) / 1.6));
    heliLadderScene(ctx, t, lt + 2.2, { alexY: 40 - u * 190, boat: true });
    ctx.filter = 'none';
    return { k: 0.6, rot: -0.1, vig: 0.4, shake: 0.002 };
  },
};
