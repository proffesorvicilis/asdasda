// Tuhaf Saat · Fener · Gece 2 — yeni çizim parçaları ve sıcak ışık
'use strict';

// ---------- Sıcak (cozy) renk düzeni: yumuşak turuncu ışık + hafif parıltı
function cozyGrade(ctx, k = 1) {
  if (k <= 0) return;
  const [c, x] = off('cozy');
  x.drawImage(ctx.canvas, 0, 0);
  ctx.save();
  ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.16 * k;
  ctx.filter = 'blur(18px)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = `rgba(255,168,92,${0.30 * k})`; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'multiply';
  const g = ctx.createRadialGradient(W / 2, H * 0.48, H * 0.25, W / 2, H * 0.5, H * 0.78);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, `rgba(70,40,30,${1 - 0.0 * k})`);
  ctx.globalAlpha = 0.35 * k; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
function warmGlow(ctx, x, y, r, a = 0.35, col = '255,180,100') {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(0.45, `rgba(${col},${a * 0.35})`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
}

// ---------- Yük gemisi (konteynerli)
function drawCargoShip(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 0.9) * 0.008);
  ctx.fillStyle = '#121722';
  ctx.beginPath(); ctx.moveTo(-420, -10); ctx.lineTo(430, -10); ctx.lineTo(470, -60); ctx.lineTo(480, -60); ctx.lineTo(440, 40); ctx.lineTo(-400, 40); ctx.closePath(); ctx.fill();
  const cols = ['#a8423a', '#3c5f8f', '#c99a3a', '#3f7d74', '#8a4b6b', '#5a6f3a'];
  for (let i = 0; i < 9; i++) for (let j = 0; j < 2; j++) {
    ctx.fillStyle = cols[(i * 2 + j * 3) % cols.length];
    ctx.fillRect(-300 + i * 72, -66 - j * 44, 66, 40);
  }
  ctx.fillStyle = '#1b2230'; ctx.fillRect(-400, -150, 90, 140);
  ctx.fillStyle = '#ffd77a'; for (let i = 0; i < 3; i++) ctx.fillRect(-390 + i * 28, -134, 18, 14);
  ctx.restore();
  const glow = (gx, gy, col, r) => warmGlow(ctx, gx, gy, r, 0.9, col);
  glow(x - 355 * s, y - 190 * s, '255,250,230', 26 * s * 2);
  glow(x + 470 * s, y - 40 * s, '255,70,60', 22 * s * 2);
  glow(x - 410 * s, y - 20 * s, '70,255,140', 22 * s * 2);
}

// ---------- Yatak odası (bekçi yatakta)
function drawBedroom(ctx, t, o = {}) {
  brickWall(ctx, '#2a3046');
  // arka masa: telsiz, şapka, kâğıtlar
  ctx.fillStyle = '#7a4a24'; ctx.fillRect(-60, 760, W + 120, 40);
  ctx.fillStyle = '#5c3618'; ctx.fillRect(-60, 800, W + 120, 360);
  drawRadioSmall(ctx, 250, 760, 1.3, 0.25);
  ctx.fillStyle = '#f2c230'; ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(200, 744, 70, 34, 0, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(200, 748, 110, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ece4d0'; ctx.save(); ctx.translate(800, 748); ctx.rotate(-0.04); ctx.fillRect(-140, -22, 280, 26); ctx.restore();
  // yatak
  ctx.fillStyle = '#3a2e2a'; ctx.fillRect(40, 1360, 1000, 60); ctx.fillRect(60, 1420, 26, 120); ctx.fillRect(994, 1420, 26, 120);
  ctx.fillStyle = '#d9d0bf'; rr(ctx, 70, 1150, 230, 110, 40); ctx.fill();
  // yorgan
  ctx.fillStyle = '#7f72b8'; rr(ctx, 230, 1130, 820, 240, 40); ctx.fill();
  ctx.fillStyle = '#6a5ea3'; rr(ctx, 230, 1300, 820, 70, 30); ctx.fill();
  // kafa (yan yatmış)
  const open = o.awake ?? 0;
  ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.ellipse(190, 1170, 70, 74, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK;
  if (open > 0.5) { ctx.beginPath(); ctx.ellipse(196, 1150, 7, 10, 0, 0, Math.PI * 2); ctx.ellipse(226, 1156, 7, 10, 0, 0, Math.PI * 2); ctx.fill(); }
  else { ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(186, 1150); ctx.lineTo(204, 1152); ctx.moveTo(218, 1156); ctx.lineTo(236, 1158); ctx.stroke(); }
  // gece lambası sıcak ışığı
  warmGlow(ctx, 860, 700, 520, 0.22);
}

// ---------- Kapının içi (lombozdan bakan yüz)
function drawHarlanFace(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.globalAlpha = o.a ?? 1;
  ctx.fillStyle = o.tint ?? '#9fb0d6'; ctx.strokeStyle = 'rgba(10,14,24,0.9)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.ellipse(0, 0, 56, 58, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#10141f';
  ctx.beginPath(); ctx.ellipse(-20, -2, 7, 9, 0, 0, Math.PI * 2); ctx.ellipse(20, -2, 7, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(70,80,110,0.8)'; ctx.beginPath(); ctx.ellipse(-12, 22, 14, 6, 0.1, 0, Math.PI * 2); ctx.ellipse(12, 22, 14, 6, -0.1, 0, Math.PI * 2); ctx.fill();
  // kaptan kasketi + rozet
  ctx.fillStyle = '#1c2236';
  ctx.beginPath(); ctx.ellipse(0, -44, 64, 26, 0, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fill();
  ctx.fillRect(-60, -48, 120, 16);
  ctx.fillStyle = '#0f1322'; ctx.beginPath(); ctx.ellipse(0, -32, 58, 9, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = '#c9a24a'; ctx.beginPath(); ctx.arc(0, -56, 9, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function drawDoorInside(ctx, t, o = {}) {
  ctx.fillStyle = '#121620'; ctx.fillRect(-60, -60, W + 120, H + 120);
  brickWall(ctx, '#1a1f2c', 'rgba(5,7,12,0.6)');
  const dx = o.dx ?? 250, dw = 560, dy = 520, dh = 1300;
  ctx.fillStyle = '#0b0d12'; ctx.fillRect(dx - 30, dy - 30, dw + 60, dh + 60);
  ctx.fillStyle = '#5b3a22'; ctx.fillRect(dx, dy, dw, dh);
  ctx.strokeStyle = '#3f2717'; ctx.lineWidth = 6;
  for (let x = dx + 70; x < dx + dw; x += 70) { ctx.beginPath(); ctx.moveTo(x, dy); ctx.lineTo(x, dy + dh); ctx.stroke(); }
  [dy + 60, dy + 640, dy + 1220].forEach(y => {
    ctx.fillStyle = '#23262d'; ctx.fillRect(dx, y - 14, dw, 28);
    ctx.fillStyle = '#6e7480'; for (let x = dx + 20; x < dx + dw; x += 56) { ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill(); }
  });
  // lomboz
  const px = dx + dw / 2, py = dy + 300, pr = 150;
  ctx.save(); ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = '#0b1230'; ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);
  const R = mulberry32(3); ctx.fillStyle = 'rgba(220,230,255,0.7)';
  for (let i = 0; i < 14; i++) ctx.fillRect(px - pr + R() * pr * 2, py - pr + R() * pr * 2, 3, 3);
  drawRain(ctx, t, { n: 30, a: 0.35 });
  if (o.face) drawHarlanFace(ctx, px + Math.sin(t * 30) * 2 * (o.shiver ?? 1), py + 26 + Math.sin(t * 27) * 1.5, 1.75, { a: o.face });
  ctx.restore();
  ctx.strokeStyle = '#1c1f26'; ctx.lineWidth = 26; ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(px - pr, py); ctx.lineTo(px + pr, py); ctx.moveTo(px, py - pr); ctx.lineTo(px, py + pr); ctx.stroke();
  // sürgü
  ctx.fillStyle = '#7a7f88'; ctx.fillRect(dx + dw - 150, dy + 700, 120, 26);
  return { px, py };
}
function drawLantern(ctx, x, y, s, t) {
  const fl = 0.85 + 0.15 * Math.sin(t * 11) * Math.sin(t * 5.7);
  warmGlow(ctx, x, y - 30 * s, 520 * s, 0.42 * fl);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = '#2a2116'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -78, 20, Math.PI, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#3a2d1b'; rr(ctx, -32, -74, 64, 14, 6); ctx.fill();
  ctx.fillStyle = `rgba(255,${210 + 20 * fl},140,0.95)`; rr(ctx, -26, -60, 52, 66, 10); ctx.fill();
  ctx.fillStyle = '#fff4cf'; ctx.beginPath(); ctx.ellipse(0, -28, 7 * fl, 16 * fl, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3a2d1b'; rr(ctx, -34, 4, 68, 14, 6); ctx.fill();
  ctx.restore();
}

// ---------- Harlan'ın sepya portresi
function drawHarlanPortrait(ctx, t, o = {}) {
  brickWall(ctx, '#232a3d');
  const cx = o.cx ?? 500, cy = o.cy ?? 840, w = 600, h = 760;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
  ctx.fillStyle = '#5a3a1e'; ctx.fillRect(cx - w / 2 - 40, cy - h / 2 - 40, w + 80, h + 80);
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#d9c7a1'; ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  ctx.beginPath(); ctx.rect(cx - w / 2 + 24, cy - h / 2 + 24, w - 48, h - 48); ctx.clip();
  const g = ctx.createLinearGradient(0, cy - h / 2, 0, cy + h / 2);
  g.addColorStop(0, '#d8c39a'); g.addColorStop(0.7, '#c9b083'); g.addColorStop(0.71, '#b39a70'); g.addColorStop(1, '#a58c62');
  ctx.fillStyle = g; ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  // arka planda çizgili fener
  ctx.fillStyle = '#efe0c0'; ctx.fillRect(cx + 140, cy - 300, 90, 520);
  ctx.fillStyle = '#5a4630'; [[-240, 40], [-100, 40], [40, 40]].forEach(([dy, hh]) => ctx.fillRect(cx + 140, cy + dy, 90, hh));
  // Harlan
  const s = 1.25, hx = cx - 40, base = cy + 300;
  ctx.fillStyle = '#4c3b28';
  ctx.beginPath(); ctx.moveTo(hx - 60 * s, base - 300 * s); ctx.lineTo(hx + 60 * s, base - 300 * s); ctx.lineTo(hx + 82 * s, base - 70 * s); ctx.lineTo(hx - 82 * s, base - 70 * s); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#2e2418'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hx, base - 296 * s); ctx.lineTo(hx, base - 72 * s); ctx.stroke();
  ctx.strokeStyle = '#2e2418'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(hx - 24 * s, base - 70 * s); ctx.lineTo(hx - 26 * s, base); ctx.moveTo(hx + 24 * s, base - 70 * s); ctx.lineTo(hx + 26 * s, base); ctx.stroke();
  ctx.fillStyle = '#2e2418'; ctx.beginPath(); ctx.ellipse(hx - 30 * s, base, 16 * s, 8 * s, 0, 0, Math.PI * 2); ctx.ellipse(hx + 30 * s, base, 16 * s, 8 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#efe3c8'; ctx.strokeStyle = '#2e2418'; ctx.lineWidth = 4;
  [[-74, -150], [74, -150]].forEach(([ax, ay]) => { ctx.beginPath(); ctx.arc(hx + ax * s, base + ay * s, 12 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
  drawHarlanFace(ctx, hx, base - 360 * s, 1.15 * s, { tint: '#efe3c8' });
  ctx.restore();
  ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(cx, cy - h / 2 - 22, 9, 0, Math.PI * 2); ctx.fill();
  warmGlow(ctx, cx, cy - 100, 700, 0.12);
}

// ---------- Harlan'ın günlüğü
function drawJournal(ctx, t, page, k, flip = 0) {
  ctx.fillStyle = '#2a1a12'; ctx.fillRect(0, 0, W, H);
  const lg = ctx.createRadialGradient(W / 2, 760, 100, W / 2, 820, 1100);
  lg.addColorStop(0, 'rgba(255,190,120,0.22)'); lg.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  const px = 90, py = 280, pw = 860, ph = 1120;
  ctx.save();
  ctx.translate(px + pw / 2, 0); ctx.scale(1 - 0.85 * flip, 1); ctx.translate(-(px + pw / 2), 0);
  ctx.fillStyle = '#7a2a1e'; ctx.fillRect(px - 26, py - 20, pw + 52, ph + 40);       // kapak
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30;
  ctx.fillStyle = '#f2ead8'; ctx.fillRect(px, py, pw, ph);
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(90,110,150,0.25)'; ctx.lineWidth = 2;
  for (let y = py + 210; y < py + ph - 30; y += 76) { ctx.beginPath(); ctx.moveTo(px + 20, y + 22); ctx.lineTo(px + pw - 20, y + 22); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(210,70,60,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px + 70, py); ctx.lineTo(px + 70, py + ph); ctx.stroke();
  const [year, lines] = page;
  ctx.textAlign = 'center'; ctx.fillStyle = '#9a3a2a'; ctx.font = '700 72px Oswald'; ctx.fillText(year, px + pw / 2, py + 120);
  ctx.textAlign = 'left';
  const total = lines.reduce((a, l) => a + l.replace('!', '').length, 0);
  let shown = Math.floor(total * k), done = 0;
  lines.forEach((l0, i) => {
    const red = l0.startsWith('!'); const l = red ? l0.slice(1) : l0;
    const n = clamp(shown - done, 0, l.length); done += l.length;
    if (n <= 0) return;
    ctx.fillStyle = red ? '#a32416' : '#23232a'; ctx.font = `600 ${red ? 66 : 62}px Caveat`;
    ctx.fillText(l.slice(0, n), px + 100, py + 230 + i * 76);
  });
  ctx.restore();
}
