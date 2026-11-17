// Gece Nöbeti — sahneler
'use strict';

// Kamera: (cx,cy) noktası ekran merkezine gelir, z kadar yakınlaşır
function cam(ctx, z, cx = W / 2, cy = H / 2) {
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy);
}
function sway(t, a = 6) { return [noise1(t * 0.6, 1) * a, noise1(t * 0.5, 7) * a]; }

const SC = {};
// Her sahne: { cap: altyazı y, draw(ctx, t, lt, d, E) }

// ---------------------------------------------------------------- VARIŞ
SC.varis = {
  cap: 760,
  draw(ctx, t, lt, d, E) {
    const p = PAL.firtina;
    const [sx, sy] = sway(t, 5);
    ctx.save();
    cam(ctx, 1.0 + lt * 0.006, W / 2 + sx, H / 2 + sy);
    drawSky(ctx, p, t, { horizon: 1040 });
    drawClouds(ctx, t, { n: 7, y0: 80, yr: 700, color: 'rgba(40,50,64,0.9)', speed: 2 });
    drawClouds(ctx, t * 1.3, { n: 5, seed: 4, y0: 300, yr: 600, color: 'rgba(58,70,86,0.85)', speed: 2 });
    drawSea(ctx, p, t, { horizon: 1040, rough: 1.5 });
    // tekne: önce bekliyor, sonra dönüp uzaklaşıyor
    const L2 = E.ln('L02');
    const leave = seg(t, L2.s + 0.6, L2.e + 1.2);
    const bx = lerp(780, 1180, easeIn(leave)), by = lerp(1150, 1062, leave), bs = lerp(0.95, 0.42, leave);
    drawBoat(ctx, bx, by, bs, { facing: leave > 0.05 ? 1 : -1, t, lights: 1, cabinLit: 1 });
    // balıkçı köşk penceresinde
    // köpük izi
    if (leave > 0.05) {
      ctx.strokeStyle = 'rgba(220,230,240,0.5)'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(bx - 160 * bs, by + 30 * bs); ctx.quadraticCurveTo(bx - 400 * bs, by + 60 * bs, bx - 700 * bs, by + 40 * bs); ctx.stroke();
    }
    // atılan sandıklar
    const L1 = E.ln('L01');
    [[L1.s + 1.0, 330, 1555, 0.25], [L1.s + 2.0, 470, 1585, -0.3]].forEach(([t0, tx, ty, rot]) => {
      const k = seg(t, t0, t0 + 0.75);
      if (t < t0) return;
      const x0 = 720, y0 = 1060;
      const x = lerp(x0, tx, k), y = lerp(y0, ty, k) - Math.sin(k * Math.PI) * 260;
      drawCrate(ctx, x, y, 0.95, rot * k * 4 + (k >= 1 ? 0 : t * 4));
    });
    drawRocks(ctx, 330, 1660, 1000, p, { h: 170, t, seed: 3 });
    drawRain(ctx, t, { n: 120, a: 0.32 });
    // sen
    const worried = t > L2.s + 1 ? 'endise' : 'notr';
    drawPerson(ctx, 270, 1690, 1.3, { who: 'sen', face: 1, t, arm: 'canta', brow: worried, seed: 1 });
    drawRain(ctx, t * 1.2, { n: 50, a: 0.45, seed: 9, w: 3 });
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- GENİŞ
SC.genis = {
  cap: 1560,
  draw(ctx, t, lt, d, E) {
    const p = PAL.firtina;
    ctx.save();
    const z = lerp(1.18, 1.0, easeOut(clamp(lt / d)));
    cam(ctx, z, 560, 1000);
    drawSky(ctx, p, t, { horizon: 1180 });
    drawClouds(ctx, t, { n: 8, y0: 60, yr: 600, color: 'rgba(40,50,64,0.92)', speed: 2 });
    drawSea(ctx, p, t, { horizon: 1180, rough: 1.3 });
    const g = lighthouseGeom(620, 1190, 560, 1.05);
    drawRocks(ctx, 560, 1255, 820, p, { h: 140, t, seed: 8 });
    drawHouse(ctx, 300, 1200, 0.85, p);
    drawLighthouse(ctx, g, { lit: 0 });
    drawPier(ctx, 90, 330, 1250, 0.8, p);
    drawPerson(ctx, 170, 1238, 0.26, { who: 'sen', face: 1, t, arm: 'canta' });
    drawRain(ctx, t, { n: 110, a: 0.3 });
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- RIZA USTA (eski fotoğraf)
SC.riza_eski = {
  cap: 1600,
  draw(ctx, t, lt, d, E) {
    ctx.fillStyle = '#1d1a17'; ctx.fillRect(0, 0, W, H);
    drawRoomWallOnly(ctx);
    const [c, x] = off('foto', 760, 940);
    // fotoğraf içeriği
    x.save();
    x.scale(760 / W, 940 / 1300);
    drawSky(x, PAL.safak, 0, { horizon: 900 });
    drawSea(x, PAL.safak, 0, { horizon: 900, bottom: 1300, rough: 0.5 });
    const g = lighthouseGeom(720, 980, 640, 1.1);
    drawRocks(x, 600, 1040, 1100, PAL.safak, { h: 110, foam: false, seed: 4 });
    drawLighthouse(x, g, { lit: 0 });
    drawPerson(x, 380, 1150, 1.35, { who: 'riza', face: 1, t: 0, brow: 'notr', mouth: 'yukari', blink: false });
    x.restore();
    ctx.save();
    const z = lerp(1.0, 1.12, smooth(clamp(lt / d)));
    cam(ctx, z, W / 2, 900);
    ctx.translate(W / 2, 880); ctx.rotate(-0.045);
    ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
    ctx.fillStyle = '#e9e1cf'; ctx.fillRect(-420, -540, 840, 1080);
    ctx.shadowColor = 'transparent';
    ctx.filter = 'sepia(0.9) contrast(1.05) brightness(0.92)';
    ctx.drawImage(c, -380, -500, 760, 940);
    ctx.filter = 'none';
    ctx.fillStyle = '#3b2f24'; ctx.font = '600 54px Caveat'; ctx.textAlign = 'right';
    ctx.fillText('Rıza, 1983', 380, 505);
    ctx.fillStyle = '#5a4a3a'; ctx.beginPath(); ctx.arc(0, -515, 10, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    drawGrain(ctx, t, 0.05);
    drawVignette(ctx, 0.65);
  },
};
function drawRoomWallOnly(ctx) {
  ctx.fillStyle = '#2a251f'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(10,8,6,0.5)'; ctx.lineWidth = 3;
  for (let r = 0; r < 30; r++) {
    const y = r * 66; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    for (let c = 0; c < 9; c++) { const x = c * 150 + (r % 2 ? 75 : 0); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 66); ctx.stroke(); }
  }
  const g = ctx.createRadialGradient(W / 2, 800, 100, W / 2, 800, 1100);
  g.addColorStop(0, 'rgba(255,190,120,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// ---------------------------------------------------------------- İSKELE ŞAFAK
SC.iskele_safak = {
  cap: 760,
  draw(ctx, t, lt, d, E) {
    const p = PAL.safak;
    const L7 = E.ln('L07');
    const push = smooth(seg(t, L7.s - 0.3, L7.e + 0.3));
    ctx.save();
    cam(ctx, lerp(1.25, 1.75, push), lerp(600, 500, push), lerp(1100, 1190, push));
    drawSky(ctx, p, t, { horizon: 1000 });
    drawClouds(ctx, t, { n: 5, y0: 120, yr: 500, color: 'rgba(150,160,175,0.55)', speed: 0.6 });
    drawSea(ctx, p, t, { horizon: 1000, rough: 0.45 });
    drawFog(ctx, t, { d: 0.5, color: '#dfe3ea', speed: 0.4 });
    drawPier(ctx, 380, 1200, 1300, 1.2, p);
    // bulan tekne (iskeleye bağlı)
    drawBoat(ctx, 930, 1390, 0.6, { facing: -1, t, lights: 0, hull: '#3f5a73' });
    // Rıza iskelenin ucunda oturuyor
    drawSitting(ctx, 450, 1283, 1.0, { who: 'riza', face: -1, t, wet: 1, eyes: 'nokta', brow: 'notr', mouth: 'konus', talk: (Math.sin(t * 9) > 0.3 ? 0.5 : 0) });
    ctx.restore();
    drawVignette(ctx, 0.45);
  },
};
function drawSitting(ctx, x, y, s, o) {
  // y: oturduğu yüzey. Uyluklar öne, baldırlar kenardan aşağı sarkıyor.
  ctx.save(); ctx.lineCap = 'round';
  const f = o.face ?? 1, t = o.t ?? 0;
  const kx = x + f * 62 * s;
  ctx.strokeStyle = '#2a2e35'; ctx.lineWidth = 26 * s;
  ctx.beginPath(); ctx.moveTo(x - f * 6 * s, y - 12 * s); ctx.lineTo(kx, y - 10 * s); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 10 * s;
  ctx.beginPath();
  ctx.moveTo(kx, y - 8 * s); ctx.lineTo(kx + f * 4 * s, y + 70 * s + Math.sin(t * 1.3) * 4 * s);
  ctx.moveTo(kx - f * 10 * s, y - 6 * s); ctx.lineTo(kx - f * 4 * s, y + 66 * s + Math.sin(t * 1.1 + 1) * 4 * s);
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.beginPath(); ctx.ellipse(kx + f * 12 * s, y + 74 * s, 15 * s, 7 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  drawPerson(ctx, x, y + 62 * s, s, { ...o, step: 0, noLegs: true });
}

// ---------------------------------------------------------------- RIZA YAKIN
SC.riza_yakin = {
  cap: 1640,
  draw(ctx, t, lt, d, E) {
    const p = PAL.safak;
    const [c, x] = off('bg');
    drawSky(x, p, t, { horizon: 1100 });
    drawSea(x, p, t, { horizon: 1100, rough: 0.4 });
    ctx.filter = 'blur(14px)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
    drawFog(ctx, t, { d: 0.6, color: '#e2e6ec', speed: 0.3 });
    // konuşma: kelime anlarında ağız açılır
    const L8 = E.ln('L08');
    const ws = E.tl.words.filter(w => w.line === 'L08');
    const inw = ws.some(w => t >= w.s && t <= w.e);
    const talk = inw ? 0.45 + 0.4 * Math.abs(Math.sin(t * 16)) : 0;
    ctx.save();
    const z = lerp(1.0, 1.12, clamp(lt / d));
    cam(ctx, z, W / 2, 1000);
    drawHead(ctx, 540, 1010, 4.4, { who: 'riza', face: 0.2, t, wet: 1, eyes: 'iri', brow: 'korku', mouth: 'konus', talk, blink: false });
    // damlalar
    const R = mulberry32(31);
    ctx.fillStyle = 'rgba(200,220,240,0.8)';
    for (let i = 0; i < 14; i++) {
      const dx = (R() - 0.5) * 420, y0 = 820 + R() * 300, sp = 60 + R() * 90;
      const yy = y0 + ((t * sp + R() * 300) % 300);
      ctx.beginPath(); ctx.ellipse(540 + dx, yy, 6, 11, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    drawVignette(ctx, 0.6);
  },
};

// ---------------------------------------------------------------- ŞAFAK: FENER SÖNÜK
SC.safak_sonuk = {
  cap: 1560,
  draw(ctx, t, lt, d, E) {
    const p = PAL.safak;
    ctx.save();
    cam(ctx, lerp(1.0, 1.1, smooth(clamp(lt / d))), 600, 900);
    drawSky(ctx, p, t, { horizon: 1160 });
    drawClouds(ctx, t, { n: 6, y0: 80, yr: 500, color: 'rgba(150,160,175,0.55)', speed: 0.5 });
    drawSea(ctx, p, t, { horizon: 1160, rough: 0.5 });
    const g = lighthouseGeom(600, 1180, 640, 1.15);
    drawRocks(ctx, 560, 1250, 860, p, { h: 140, t, seed: 8 });
    drawHouse(ctx, 260, 1190, 0.9, p);
    drawLighthouse(ctx, g, { lit: 0 });
    drawFog(ctx, t, { d: 0.55, color: '#dfe3ea', speed: 0.4 });
    ctx.restore();
    // söndü vurgusu: lambanın etrafında soğuk halka
    drawVignette(ctx, 0.55);
  },
};

// ---------------------------------------------------------------- ODA
SC.oda = {
  cap: 1600,
  draw(ctx, t, lt, d, E) {
    ctx.save();
    const k = smooth(clamp(lt / d));
    cam(ctx, lerp(1.0, 1.32, k), lerp(W / 2, 735, k), lerp(H / 2, 640, k));
    drawRoom(ctx, t, { hour: 16, min: 40 });
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- KURALLAR (kâğıt yakın)
const PAPER = { x: 90, y: 230, w: 900, h: 1300 };
function rulesLayout(ctx, tl) {
  // her kural için satırlar ve konumlar
  const out = [];
  let y = PAPER.y + 300;
  tl.rules.forEach((r, i) => {
    const five = i === 4;
    ctx.font = five ? '600 64px Caveat' : '700 47px Kalam';
    const maxW = 700;
    const words = r.split(' '); const lines = []; let cur = '';
    words.forEach(w => { const tst = cur ? cur + ' ' + w : w; if (ctx.measureText(tst).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tst; });
    if (cur) lines.push(cur);
    const lh = five ? 72 : 64;
    out.push({ i, y, lines, lh, five });
    y += lines.length * lh + (five ? 30 : 34);
  });
  return out;
}
SC.kurallar = {
  cap: 1760,
  draw(ctx, t, lt, d, E) {
    const tl = E.tl;
    ctx.fillStyle = '#231e19'; ctx.fillRect(0, 0, W, H);
    drawRoomWallOnly(ctx);
    const L15 = E.ln('L15'), L16 = E.ln('L16');
    const zk = smooth(seg(t, L15.s - 0.2, L15.s + 1.6));
    const lay = rulesLayout(ctx, tl);
    const r5 = lay[4];
    ctx.save();
    const [sx, sy] = sway(t, 4);
    cam(ctx, lerp(1.0, 1.24, zk), lerp(W / 2, 565, zk) + sx, lerp(H / 2 - 40, r5.y + 40, zk) + sy);
    // kâğıt
    ctx.save();
    ctx.translate(PAPER.x + PAPER.w / 2, PAPER.y + PAPER.h / 2); ctx.rotate(-0.012);
    ctx.translate(-PAPER.w / 2, -PAPER.h / 2);
    ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
    ctx.fillStyle = '#efe3c6';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(PAPER.w, 0); ctx.lineTo(PAPER.w, PAPER.h - 40); ctx.lineTo(PAPER.w - 60, PAPER.h); ctx.lineTo(120, PAPER.h - 8); ctx.lineTo(60, PAPER.h - 30); ctx.lineTo(0, PAPER.h - 10); ctx.closePath(); ctx.fill();
    ctx.shadowColor = 'transparent';
    // eskime lekeleri
    const g = ctx.createRadialGradient(PAPER.w * 0.5, PAPER.h * 0.45, 200, PAPER.w * 0.5, PAPER.h * 0.5, 900);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(120,80,30,0.28)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, PAPER.w, PAPER.h);
    ctx.strokeStyle = 'rgba(120,80,40,0.25)'; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(PAPER.w - 150, PAPER.h - 120, 70, 0.3, Math.PI * 1.85); ctx.stroke();
    // satır çizgileri
    ctx.strokeStyle = 'rgba(70,90,140,0.18)'; ctx.lineWidth = 2;
    for (let yy = 260; yy < PAPER.h - 60; yy += 64) { ctx.beginPath(); ctx.moveTo(60, yy + 26); ctx.lineTo(PAPER.w - 50, yy + 26); ctx.stroke(); }
    ctx.restore();
    // çivi
    ctx.fillStyle = '#4a3a2c'; ctx.beginPath(); ctx.arc(PAPER.x + PAPER.w / 2, PAPER.y + 34, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.arc(PAPER.x + PAPER.w / 2 - 4, PAPER.y + 30, 4, 0, Math.PI * 2); ctx.fill();
    // başlık
    ctx.fillStyle = '#1f2b4d'; ctx.font = '600 84px Caveat'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(tl.rules_title, PAPER.x + 90, PAPER.y + 180);
    ctx.strokeStyle = '#1f2b4d'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(PAPER.x + 90, PAPER.y + 200); ctx.quadraticCurveTo(PAPER.x + 400, PAPER.y + 214, PAPER.x + 660, PAPER.y + 196); ctx.stroke();
    // kurallar: anlatımla birlikte yazılır
    lay.forEach(R => {
      const L = E.ln('L' + (11 + R.i));
      const t0 = L.s - 0.15, dur = R.five ? 2.2 : 1.7;
      const k = seg(t, t0, t0 + dur);
      if (k <= 0) return;
      const ink = R.five ? '#7c2416' : '#1f2b4d';
      ctx.fillStyle = ink;
      const total = R.lines.reduce((a, l) => a + l.length, 0);
      let shown = Math.floor(total * k), done = 0;
      R.lines.forEach((l, j) => {
        const n = clamp(shown - done, 0, l.length); done += l.length;
        if (n <= 0) return;
        ctx.save();
        if (R.five) { ctx.translate(PAPER.x + 90, R.y + j * R.lh); ctx.rotate(-0.025 + Math.sin(j * 3) * 0.01); ctx.font = '600 64px Caveat'; }
        else { ctx.translate(PAPER.x + 90, R.y + j * R.lh); ctx.font = '700 47px Kalam'; }
        if (j === 0) { ctx.fillStyle = R.five ? '#7c2416' : '#b0362a'; ctx.fillText(`${R.i + 1}.`, 0, 0); ctx.fillStyle = ink; }
        ctx.fillText(l.slice(0, n), 58, 0);
        ctx.restore();
      });
      if (R.five && k >= 1) { // imza ve mürekkep lekesi
        ctx.fillStyle = '#7c2416'; ctx.font = '600 60px Caveat';
        ctx.fillText('— R.', PAPER.x + 560, R.y + R.lines.length * R.lh + 30);
        ctx.fillStyle = 'rgba(124,36,22,0.35)';
        ctx.beginPath(); ctx.ellipse(PAPER.x + 720, R.y - 20, 26, 14, 0.5, 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.restore();
    // lamba titremesi
    const fl = 0.06 + 0.04 * Math.sin(t * 11) * Math.sin(t * 6.1);
    ctx.fillStyle = `rgba(255,170,80,${fl})`; ctx.fillRect(0, 0, W, H);
    // 5. kural okunurken kararma
    const dk = smooth(seg(t, L16.s - 0.3, L16.s + 0.6)) * 0.35;
    if (dk > 0) { ctx.fillStyle = `rgba(0,0,0,${dk})`; ctx.fillRect(0, 0, W, H); }
    drawVignette(ctx, 0.6);
  },
};

// ---------------------------------------------------------------- YAKMA (gün batımı → şalter → huzme)
SC.yakma = {
  cap: 760,
  draw(ctx, t, lt, d, E) {
    const L = E.ln('L17');
    const wA = E.tl.words.filter(w => w.line === 'L17');
    const tB = (wA[2]?.s ?? L.s + 1.3) - 0.15;     // "Feneri yakıyorsun"
    const tC = tB + 1.35;                            // ateşleme sonrası dış çekim
    E.ignite = tB + 0.75;
    if (t < tB) {
      drawDuskExterior(ctx, t, 0, lt);
    } else if (t < tC) {
      const k = seg(t, tB, tB + 0.7);
      ctx.save();
      cam(ctx, 1.1, 640, 1150);
      const pull = 1 - smooth(k);
      drawLampRoom(ctx, t, { dusk: true, lit: smooth(seg(t, E.ignite, E.ignite + 0.25)), pull });
      const [kx, ky] = leverKnob(890, 1400, 1.1, pull);
      drawPerson(ctx, 720, 1720, 1.35, { who: 'sen', face: 1, t, arm: 'kavra', hand: [kx + 48, ky], brow: 'notr' });
      ctx.restore();
      // ateşleme flaşı
      const fl = Math.max(0, 1 - Math.abs(t - E.ignite) / 0.25);
      if (fl > 0) { ctx.fillStyle = `rgba(255,236,200,${fl * 0.7})`; ctx.fillRect(0, 0, W, H); }
    } else {
      drawDuskExterior(ctx, t, 1, lt);
    }
    drawVignette(ctx, 0.45);
  },
};
function drawDuskExterior(ctx, t, on, lt) {
  const p = PAL.aksam;
  ctx.save();
  cam(ctx, 1.0 + lt * 0.01, W / 2, H / 2);
  drawSky(ctx, p, t, { horizon: 1260, sun: { x: 820, y: 1250, r: 54 } });
  drawClouds(ctx, t, { n: 5, y0: 200, yr: 600, color: 'rgba(60,40,80,0.75)', speed: 0.8 });
  drawSea(ctx, p, t, { horizon: 1260, rough: 0.8 });
  const g = lighthouseGeom(470, 1300, 700, 1.15);
  const rig = lightRig(ctx, g, t, { on, speed: 0.12, len: 1400 });
  drawRocks(ctx, 420, 1360, 900, p, { h: 150, t, seed: 8 });
  drawLighthouse(ctx, g, { lit: on, shade: 0.55 });
  if (on) { rig.front(); drawReflection(ctx, g.lx + 200, 1265, 500, 0.5 * (0.4 + 0.6 * Math.max(0, rig.facing))); }
  ctx.restore();
}

// ---------------------------------------------------------------- SİS
SC.sis = {
  cap: 1580,
  draw(ctx, t, lt, d, E) {
    const p = PAL.gece;
    const fog = smooth(clamp(lt / (d * 0.85)));
    ctx.save();
    cam(ctx, 1.0 + lt * 0.012, W / 2, 1000);
    drawSky(ctx, p, t, { horizon: 1250, stars: 1 - fog, moon: { x: 820, y: 330, r: 60, a: 1 - fog * 0.8 } });
    drawClouds(ctx, t, { n: 6, y0: 120, yr: 600, color: 'rgba(20,32,60,0.9)' });
    drawSea(ctx, p, t, { horizon: 1250, rough: 0.9 });
    const g = lighthouseGeom(540, 1290, 680, 1.1);
    const rig = lightRig(ctx, g, t, { on: 1, speed: 0.13, len: 1450, fog });
    drawRocks(ctx, 520, 1350, 880, p, { h: 140, t, seed: 8 });
    drawHouse(ctx, 230, 1300, 0.85, p, { shade: 0.6, lit: 0.9 });
    drawLighthouse(ctx, g, { lit: 1, shade: 0.45, winLit: 0.8 });
    rig.front();
    drawReflection(ctx, g.lx, 1255, 600, 0.6 * Math.max(0, rig.facing) * (1 - fog * 0.5));
    // sis soldan geliyor
    ctx.save(); ctx.translate(lerp(-900, 0, easeOut(fog)), 0);
    drawFog(ctx, t, { d: 1.0, speed: 2.2, layers: [
      { y: 900, h: 500, n: 8, sp: 30, a: 0.26, r: 380 },
      { y: 1200, h: 600, n: 9, sp: 46, a: 0.30, r: 420 },
      { y: 1500, h: 700, n: 8, sp: 60, a: 0.26, r: 460 }] });
    ctx.restore();
    if (fog > 0.2) drawFog(ctx, t, { d: fog, veil: 0.12, layers: [] });
    ctx.restore();
    drawVignette(ctx, 0.55);
  },
};

// ---------------------------------------------------------------- DÜDÜK (galeri)
function drawGallery(ctx, t, E, o) {
  // o: { pullT (zincir çekme anı), hornT (düdük başladığı an), zoom, brow, fog }
  const p = PAL.gece;
  const fog = o.fog ?? 1;
  ctx.save();
  const [sx, sy] = sway(t, 4);
  cam(ctx, o.zoom ?? 1.0, (o.cx ?? W / 2) + sx, (o.cy ?? H / 2) + sy);
  drawSky(ctx, p, t, { horizon: 1300 });
  drawSea(ctx, p, t, { horizon: 1300, rough: 0.8 });
  drawFog(ctx, t, { d: fog, veil: 0.14, speed: 1.2 });
  // fener odası (sol üst): camlar, kubbe, huzme
  const lx = 150, ly = 470;
  const ph = t * Math.PI * 2 * 0.13;
  const parts = beamParts(ph);
  parts.forEach(b => drawBeam(ctx, lx, ly, b, { len: 1600, fog, s: 1.2, droop: 60 }));
  const facing = Math.max(...parts.map(b => b.dz));
  ctx.fillStyle = '#b8392b';
  ctx.beginPath(); ctx.moveTo(-80, 150); ctx.quadraticCurveTo(150, -40, 380, 150); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1a1d23'; ctx.fillRect(-80, 140, 460, 26);
  const gl = 0.55 + 0.45 * Math.max(0, facing);
  const gg = ctx.createLinearGradient(0, 170, 0, 760);
  gg.addColorStop(0, `rgba(255,236,190,${gl})`); gg.addColorStop(1, `rgba(255,190,110,${gl * 0.8})`);
  ctx.fillStyle = gg; ctx.fillRect(-60, 166, 420, 594);
  ctx.strokeStyle = '#121418'; ctx.lineWidth = 16;
  [-60, 80, 220, 360].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 166); ctx.lineTo(x, 760); ctx.stroke(); });
  ctx.beginPath(); ctx.moveTo(-60, 460); ctx.lineTo(360, 460); ctx.stroke();
  ctx.fillStyle = '#1a1d23'; ctx.fillRect(-80, 760, 470, 40);
  ctx.fillRect(-80, 800, 430, 1300);
  drawGlare(ctx, lx, ly, 0.35 + 0.65 * Math.pow(Math.max(0, facing), 4), 1.5, fog);
  // galeri zemini
  ctx.fillStyle = '#16191f'; ctx.fillRect(-60, 1600, W + 120, 500);
  // düdük (korkuluğun üstündeki dirsekte) ve zincir
  const hornX = 700, hornY = 1210;
  const age = o.hornT != null ? t - o.hornT : -1;
  const vib = age >= 0 && age < 2.4 ? 1 - age / 2.6 : 0;
  ctx.strokeStyle = '#2a2d33'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(hornX, hornY + 40); ctx.lineTo(hornX, 1620); ctx.stroke();
  drawHorn(ctx, hornX, hornY, 1.5, vib);
  if (age >= 0) drawRings(ctx, hornX + 190, hornY - 30, age, { n: 6, sp: 560, life: 2.6, dir: 0, spread: 0.75, flat: 0.55, a: 0.8, w: 10 });
  const pull = o.pullT != null ? smooth(seg(t, o.pullT - 0.25, o.pullT)) * (1 - smooth(seg(t, o.pullT + 2.2, o.pullT + 2.6))) : 0;
  const chainY = 1250 + pull * 70;
  ctx.strokeStyle = '#9aa1ad'; ctx.lineWidth = 6; ctx.setLineDash([12, 9]);
  ctx.beginPath(); ctx.moveTo(hornX - 30, hornY + 40); ctx.lineTo(hornX - 52, chainY); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#9aa1ad'; ctx.beginPath(); ctx.arc(hornX - 52, chainY + 12, 15, 0, Math.PI * 2); ctx.fill();
  // sen
  drawPerson(ctx, 470, 1720, 1.55, { who: 'sen', face: 1, t, arm: 'cek', hand: [hornX - 52, chainY + 12], pull: 0, brow: o.brow ?? 'endise', eyes: o.eyes ?? 'nokta', seed: 3 });
  // korkuluk (önde)
  ctx.strokeStyle = '#0d0f13'; ctx.lineWidth = 16;
  ctx.beginPath(); ctx.moveTo(-60, 1500); ctx.lineTo(W + 60, 1500); ctx.moveTo(-60, 1600); ctx.lineTo(W + 60, 1600);
  for (let x = 40; x < W + 60; x += 130) { ctx.moveTo(x, 1500); ctx.lineTo(x, 1760); }
  ctx.stroke();
  drawFog(ctx, t * 1.4, { d: fog * 0.6, seed: 5, speed: 1.5, layers: [{ y: 1550, h: 600, n: 6, sp: 50, a: 0.16, r: 420 }] });
  ctx.restore();
}
function hornCue(E, slot) { return E.cues.find(c => c.slot === slot && c.fx === 'sis_duduk').t; }
function replyCue(E, slot) { return E.cues.find(c => c.slot === slot && c.fx.startsWith('cevap')).t; }

SC.duduk1 = {
  cap: 760,
  draw(ctx, t, lt, d, E) {
    const ht = hornCue(E, 'duduk1');
    drawGallery(ctx, t, E, { hornT: ht, pullT: ht, zoom: 1.0, brow: 'notr' });
    drawVignette(ctx, 0.55);
  },
};
SC.duduk2 = {
  cap: 760,
  draw(ctx, t, lt, d, E) {
    const ht = hornCue(E, 'duduk2');
    drawGallery(ctx, t, E, { hornT: ht, pullT: ht, zoom: 1.15, cx: 560, cy: 1180, brow: 'endise' });
    drawVignette(ctx, 0.6);
  },
};
SC.duduk3 = {
  cap: 760,
  draw(ctx, t, lt, d, E) {
    const ht = hornCue(E, 'duduk3');
    // düdükten sonra sessizlik: kamera yüzüne yaklaşır
    const k = smooth(seg(t, ht + 1.6, ht + 3.3));
    drawGallery(ctx, t, E, { hornT: ht, pullT: ht, zoom: lerp(1.15, 2.4, k), cx: lerp(560, 490, k), cy: lerp(1180, 1240, k), brow: k > 0.4 ? 'korku' : 'endise', eyes: k > 0.4 ? 'iri' : 'nokta' });
    drawVignette(ctx, 0.6 + 0.2 * k);
  },
};

// ---------------------------------------------------------------- CEVAP (sise bakış)
function drawFogView(ctx, t, E, o) {
  const p = PAL.gece;
  ctx.save();
  const sh = o.shake ?? 0;
  const [sx, sy] = sway(t, 5);
  ctx.translate(noise1(t * 47, 3) * sh * 34, noise1(t * 53, 9) * sh * 34);
  cam(ctx, o.zoom ?? 1.0, W / 2 + sx, H / 2 + sy);
  drawSky(ctx, p, t, { horizon: 1180 });
  drawSea(ctx, p, t, { horizon: 1180, rough: 0.7 });
  drawFog(ctx, t, { d: 1.2, veil: 0.2, speed: 0.9, layers: [
    { y: 700, h: 600, n: 8, sp: 18, a: 0.22, r: 380 },
    { y: 1050, h: 500, n: 9, sp: 26, a: 0.28, r: 420 },
    { y: 1350, h: 700, n: 8, sp: 36, a: 0.24, r: 460 }] });
  // huzme sisin içinden geçer
  const ph = t * Math.PI * 2 * 0.13 + 1.3;
  beamParts(ph).forEach(b => { if (b.dx > 0) drawBeam(ctx, -260, 260, b, { len: 2000, fog: 1, s: 1.3, droop: 260 }); });
  // cevap halkaları
  if (o.replyT != null && t >= o.replyT) {
    const age = t - o.replyT;
    drawRings(ctx, o.rx, o.ry, age, { n: 6, sp: o.sp ?? 200, life: 3.2, dir: Math.PI / 2, spread: 1.45, flat: 0.32, a: o.ra ?? 0.6, w: o.rw ?? 6, color: '205,220,240' });
    // sisteki karanlık leke (bir şey var mı?)
    if (o.shadow) {
      const a = o.shadow * clamp(age / 0.6) * (0.7 + 0.3 * Math.sin(t * 2));
      const g = ctx.createRadialGradient(o.rx, o.ry - 60, 0, o.rx, o.ry - 60, 220 * (o.shScale ?? 1));
      g.addColorStop(0, `rgba(5,8,16,${0.55 * a})`); g.addColorStop(1, 'rgba(5,8,16,0)');
      ctx.fillStyle = g; ctx.fillRect(o.rx - 300, o.ry - 400, 600, 700);
    }
  }
  if (o.bow) { // önden görünen karanlık gemi burnu, ışıksız
    ctx.save(); ctx.globalAlpha = 0.9 * o.bow;
    const rise = (1 - o.bow) * 120;
    ctx.translate(0, rise);
    ctx.fillStyle = '#06080d';
    ctx.beginPath();
    ctx.moveTo(250, 760); ctx.quadraticCurveTo(540, 700, 830, 760);
    ctx.quadraticCurveTo(760, 1250, 560, 1720); ctx.lineTo(520, 1720);
    ctx.quadraticCurveTo(320, 1250, 250, 760); ctx.closePath(); ctx.fill();
    // küpeşte ve direkler
    ctx.strokeStyle = '#06080d'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(240, 700); ctx.quadraticCurveTo(540, 640, 840, 700);
    for (let i = 0; i <= 8; i++) { const xx = 240 + i * 75; const yy = 700 - Math.sin(i / 8 * Math.PI) * 50; ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + 62); }
    ctx.stroke();
    // baş bodoslama çizgisi ve iki çapa deliği
    ctx.strokeStyle = 'rgba(150,170,200,0.22)'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(540, 720); ctx.lineTo(540, 1700); ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.beginPath(); ctx.ellipse(430, 880, 26, 20, 0, 0, Math.PI * 2); ctx.ellipse(650, 880, 26, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(150,170,200,0.25)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(430, 880, 30, 24, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(650, 880, 30, 24, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  drawFog(ctx, t * 1.3, { d: 0.9, seed: 3, speed: 1.4, layers: [{ y: 1200, h: 500, n: 6, sp: 44, a: 0.2, r: 420 }] });
  // ön planda korkuluk
  ctx.strokeStyle = '#090b0f'; ctx.lineWidth = 18;
  ctx.beginPath(); ctx.moveTo(-60, 1700); ctx.lineTo(W + 60, 1700); ctx.moveTo(-60, 1800); ctx.lineTo(W + 60, 1800);
  for (let x = 40; x < W + 60; x += 160) { ctx.moveTo(x, 1700); ctx.lineTo(x, 1990); }
  ctx.stroke();
  ctx.restore();
}
SC.cevap1 = {
  cap: 760,
  draw(ctx, t, lt, d, E) {
    drawFogView(ctx, t, E, { replyT: replyCue(E, 'duduk1'), rx: 760, ry: 1100, sp: 230, ra: 0.75, rw: 8, zoom: 1.0 + lt * 0.01 });
    drawVignette(ctx, 0.6);
  },
};
SC.cevap2 = {
  cap: (t, E) => (t < E.ln('L25').s - 0.1 ? 760 : 1600),
  draw(ctx, t, lt, d, E) {
    const L25 = E.ln('L25');
    if (t < L25.s - 0.1) {
      drawFogView(ctx, t, E, { replyT: replyCue(E, 'duduk2'), rx: 620, ry: 1230, sp: 260, ra: 0.7, rw: 7, shadow: 0.7, zoom: 1.04 + lt * 0.012 });
      drawVignette(ctx, 0.6);
    } else {
      // yüz yakın: huzme yüzünden geçer
      const p = PAL.gece;
      const [c, x] = off('bg2');
      drawSky(x, p, t, { horizon: 1200 }); drawSea(x, p, t, { horizon: 1200 }); drawFog(x, t, { d: 1.2, veil: 0.25 });
      ctx.filter = 'blur(10px)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
      ctx.save();
      const k = clamp((t - L25.s) / 3);
      cam(ctx, lerp(1.0, 1.08, k), W / 2, 1000);
      drawHead(ctx, 540, 1020, 4.2, { who: 'sen', face: 0.25, t, eyes: 'iri', brow: 'korku', mouth: 'asagi', blink: false });
      ctx.restore();
      const sweep = ((t * 0.13) % 1);
      const bx = lerp(-400, W + 400, sweep);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createLinearGradient(bx - 260, 0, bx + 260, 0);
      g.addColorStop(0, 'rgba(255,210,140,0)'); g.addColorStop(0.5, 'rgba(255,210,140,0.35)'); g.addColorStop(1, 'rgba(255,210,140,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
      drawVignette(ctx, 0.7);
    }
  },
};
SC.cevap3 = {
  cap: 1000,
  draw(ctx, t, lt, d, E) {
    const rt = replyCue(E, 'duduk3');
    const sh = Math.max(0, 1 - (t - rt) / 1.1);
    drawFogView(ctx, t, E, { replyT: rt, rx: 540, ry: 1600, sp: 900, ra: 0.95, rw: 14, shadow: 1.2, shScale: 2.2, shake: sh, zoom: 1.12, bow: clamp((t - rt) / 0.5) });
    const fl = Math.max(0, 1 - (t - rt) / 0.35);
    if (fl > 0) { ctx.fillStyle = `rgba(230,240,255,${fl * 0.45})`; ctx.fillRect(0, 0, W, H); }
    drawVignette(ctx, 0.75);
  },
};

// ---------------------------------------------------------------- 4. KURAL
SC.kural4 = {
  cap: 1560,
  draw(ctx, t, lt, d, E) {
    const [c, x] = off('lr');
    drawLampRoom(x, t, { lit: 1, fog: 1, lever: true, pull: 0 });
    ctx.filter = 'blur(8px) brightness(0.45)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
    drawRuleCard(ctx, t, clamp(lt / 0.45), E.tl.rules[3], 4);
    drawVignette(ctx, 0.6);
  },
};

// ---------------------------------------------------------------- TEKNE
SC.tekne = {
  cap: 700,
  draw(ctx, t, lt, d, E) {
    const p = PAL.gece;
    const k = clamp(lt / d);
    ctx.save();
    cam(ctx, 1.0 + k * 0.05, W / 2, H / 2);
    drawSky(ctx, p, t, { horizon: 1180 });
    drawSea(ctx, p, t, { horizon: 1180, rough: 0.9 });
    drawFog(ctx, t, { d: 1.1, veil: 0.16, speed: 0.8 });
    // fener (solda, yukarıda) ve huzmesi
    const g = lighthouseGeom(80, 1150, 760, 1.0);
    const rig = lightRig(ctx, g, t, { on: 1, speed: 0.13, len: 1700, fog: 1, phase0: 0.6 });
    drawLighthouse(ctx, g, { lit: 1, shade: 0.75 });
    rig.front();
    // yaklaşan tekne: önce sadece ışıklar
    const bx = lerp(820, 600, k), by = lerp(1200, 1420, easeIn(k)), bs = lerp(0.38, 1.25, easeIn(k));
    ctx.save(); ctx.globalAlpha = 0.25 + 0.35 * k; drawBoat(ctx, bx, by, bs, { facing: -1, t, lights: 0, hull: '#33302c', cabinLit: 1 }); ctx.restore();
    drawFog(ctx, t * 1.2, { d: 0.9, seed: 7, speed: 1.1, layers: [{ y: 1200, h: 400, n: 7, sp: 30, a: 0.24, r: 380 }] });
    drawBoat(ctx, bx, by, bs, { facing: -1, t, lights: 1, glowK: 2.2, hull: 'rgba(0,0,0,0)' });
    // ön planda kayalar
    drawRocks(ctx, 250, 1980, 800, p, { h: 330, t, seed: 12 });
    drawRocks(ctx, 900, 2000, 700, p, { h: 280, t, seed: 13 });
    ctx.restore();
    drawVignette(ctx, 0.6);
  },
};

// ---------------------------------------------------------------- ŞALTER
SC.salter = {
  cap: 600,
  draw(ctx, t, lt, d, E) {
    ctx.save();
    const k = smooth(clamp(lt / d));
    cam(ctx, lerp(1.1, 1.45, k), lerp(640, 820, k), lerp(1150, 1280, k));
    drawLampRoom(ctx, t, { lit: 1, fog: 1, pull: 0 });
    const [kx, ky] = leverKnob(890, 1400, 1.1, 0);
    drawPerson(ctx, 720, 1720, 1.35, { who: 'sen', face: 1, t, arm: 'kavra', hand: [kx + 48, ky], brow: 'korku', eyes: 'iri', seed: 4 });
    ctx.restore();
    const hb = Math.pow(Math.max(0, Math.sin(t * Math.PI * 1.2)), 12);
    ctx.fillStyle = `rgba(120,0,0,${0.12 * hb})`; ctx.fillRect(0, 0, W, H);
    drawVignette(ctx, 0.65);
  },
};

// ---------------------------------------------------------------- SEÇİM
SC.secim = {
  cap: 1330,
  draw(ctx, t, lt, d, E) {
    const [c, x] = off('sec');
    drawLampRoom(x, t, { lit: 1, fog: 1, pull: 0 });
    const [kx, ky] = leverKnob(890, 1400, 1.1, 0);
    drawPerson(x, 720, 1720, 1.35, { who: 'sen', face: 1, t, arm: 'kavra', hand: [kx + 48, ky], brow: 'korku', eyes: 'iri', seed: 4 });
    ctx.filter = 'blur(12px) brightness(0.35)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
    drawChoice(ctx, t, clamp(lt / 0.5));
    drawVignette(ctx, 0.5);
  },
};
