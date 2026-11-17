// Tuhaf Saat · Fener · Gece 1 — sahneler (referans videonun sahne akışı)
'use strict';

function cam(ctx, z, cx = W / 2, cy = H / 2) { ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); }
function sway(t, a = 5) { return [noise1(t * 0.6, 1) * a, noise1(t * 0.5, 7) * a]; }
function lineWords(E, id) { return E.tl.words.filter(w => w.line === id); }
function speaking(E, ids, t) {
  // konuşma zarfı: kelime içindeyse 0.55..1 arası titreşim
  const on = E.tl.words.some(w => ids.includes(w.line) && t >= w.s && t <= w.e + 0.05);
  return on ? 0.55 + 0.45 * Math.abs(Math.sin(t * 23) * Math.sin(t * 7.1)) : 0.06;
}

const SC = {};

// ---------------------------------------------------------------- ADA (geniş)
SC.ada = {
  cap: 1300,
  draw(ctx, t, lt, d, E) {
    ctx.save();
    cam(ctx, 1.0 + lt * 0.015, 520, 960);
    nightBackdrop(ctx, t, 1000, { moon: { x: 820, y: 230, r: 62 }, nClouds: 2, cy0: 300 });
    const g = lighthouseGeom(300, 1000, 560, 1.05);
    drawRocks(ctx, 330, 1050, 680, { rock: '#151a25', rockHi: '#222a38' }, { h: 110, t, seed: 4 });
    drawLighthouse(ctx, g, { lit: 0, stripes: true });
    drawPierDiag(ctx, 520, 1040, 1010, 1990, 24, 150);
    drawPerson(ctx, 512, 1036, 0.27, { who: 'bekci', face: 0, t });
    drawRain(ctx, t, { n: 150, a: 0.4 });
    drawRain(ctx, t * 1.15, { n: 50, a: 0.55, seed: 9, w: 3 });
    ctx.restore();
    drawVignette(ctx, 0.45);
  },
};

// ---------------------------------------------------------------- İSKELE (arkadan, Moss teknede)
SC.iskele = {
  cap: 1180,
  draw(ctx, t, lt, d, E) {
    const L2 = E.ln('L02');
    const go = smooth(seg(t, L2.e - 0.8, L2.e + 1.8));
    ctx.save();
    const [sx, sy] = sway(t, 3);
    cam(ctx, 1.0, W / 2 + sx, H / 2 + sy);
    nightBackdrop(ctx, t, 1060, { moon: { x: 860, y: 300, r: 58 }, nClouds: 2, cy0: 420 });
    // tekne ve Moss
    const bx = lerp(640, 900, go), by = lerp(1085, 1062, go), bs = lerp(0.62, 0.42, go);
    drawPerson(ctx, bx + 70 * bs, by - 22 * bs, 0.32 * bs / 0.62, { who: 'moss', face: -1, t, arm: speaking(E, ['L02'], t) > 0.3 ? 'tut' : 'asagi', hand: [bx + 20 * bs, by - 170 * bs], seed: 7 });
    drawBoat(ctx, bx, by, bs, { facing: -1, t, lights: 0, hull: '#2d2f38', cabinLit: 1 });
    // yeşil direk ışığı
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gx = bx - 60 * bs, gy = by - 172 * bs;
    const gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, 40); gg.addColorStop(0, 'rgba(70,255,140,0.95)'); gg.addColorStop(1, 'rgba(70,255,140,0)');
    ctx.fillStyle = gg; ctx.fillRect(gx - 40, gy - 40, 80, 80); ctx.restore();
    // iskele zemini
    ctx.fillStyle = '#6b4b31';
    ctx.beginPath(); ctx.moveTo(-60, 1500); ctx.lineTo(820, 1440); ctx.lineTo(1000, H + 60); ctx.lineTo(-60, H + 60); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#4a3322'; ctx.lineWidth = 4;
    for (let y = 1500; y < H + 60; y += 46) { ctx.beginPath(); ctx.moveTo(-60, y + (y - 1500) * 0.0); ctx.lineTo(lerp(820, 1000, (y - 1440) / 540), y - 60 * (1 - (y - 1440) / 540)); ctx.stroke(); }
    ctx.fillStyle = '#3b2a1c'; ctx.fillRect(760, 1360, 34, 330);
    drawPerson(ctx, 430, 1990, 1.5, { who: 'bekci', face: 0, back: true, t, seed: 1 });
    drawRain(ctx, t, { n: 150, a: 0.4 });
    drawRain(ctx, t * 1.15, { n: 50, a: 0.55, seed: 9, w: 3 });
    ctx.restore();
    drawVignette(ctx, 0.45);
  },
};

// ---------------------------------------------------------------- KAPI
SC.kapi = {
  cap: 1010,
  draw(ctx, t, lt, d, E) {
    ctx.save();
    cam(ctx, 1.0 + lt * 0.008, W / 2, H / 2);
    ctx.translate(-80, 0);
    ctx.fillStyle = '#05070d'; ctx.fillRect(-60, -60, W + 120, H + 120);
    // kule duvarı
    const g = ctx.createLinearGradient(-60, 0, 760, 0);
    g.addColorStop(0, '#f1ece3'); g.addColorStop(0.75, '#e2dbcf'); g.addColorStop(1, '#bdb5a8');
    ctx.fillStyle = g; ctx.fillRect(-60, -60, 820, 1800);
    ctx.fillStyle = '#d2402f'; ctx.fillRect(-60, 200, 820, 170);
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(600, -60, 160, 1800);
    // kapı çerçevesi ve kapı
    ctx.fillStyle = '#8c8a87'; ctx.fillRect(160, 560, 470, 1040);
    ctx.fillStyle = '#5a3a24'; ctx.fillRect(196, 596, 398, 1004);
    ctx.strokeStyle = '#3e271a'; ctx.lineWidth = 5;
    for (let x = 246; x < 594; x += 50) { ctx.beginPath(); ctx.moveTo(x, 596); ctx.lineTo(x, 1600); ctx.stroke(); }
    [720, 1090, 1450].forEach(y => {
      ctx.fillStyle = '#2b2f36'; ctx.fillRect(196, y - 12, 398, 24);
      ctx.fillStyle = '#6e7480'; for (let x = 216; x < 594; x += 46) { ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill(); }
    });
    ctx.fillStyle = '#1b2235'; ctx.beginPath(); ctx.arc(395, 820, 48, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2b2f36'; ctx.lineWidth = 10; ctx.stroke();
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(347, 820); ctx.lineTo(443, 820); ctx.moveTo(395, 772); ctx.lineTo(395, 868); ctx.stroke();
    ctx.fillStyle = '#c7a24a'; ctx.beginPath(); ctx.arc(560, 1160, 12, 0, Math.PI * 2); ctx.fill();
    // zemin
    ctx.fillStyle = '#1d1f26'; ctx.fillRect(-60, 1600, W + 120, 400);
    // bekçi kapının kolunda
    drawPerson(ctx, 850, 1720, 1.32, { who: 'bekci', face: -1, t, arm: 'tut', hand: [568, 1170], brow: 'kizgin', seed: 3 });
    drawRain(ctx, t, { n: 120, a: 0.38 });
    ctx.restore();
    // şimşek: "kayboldu" anında
    const kw = lineWords(E, 'L06').find(w => /kayboldu/.test(w.w));
    if (kw) {
      const f = Math.max(0, 1 - Math.abs(t - kw.s) / 0.12) + 0.6 * Math.max(0, 1 - Math.abs(t - kw.s - 0.25) / 0.1);
      if (f > 0) { ctx.fillStyle = `rgba(220,230,255,${0.55 * f})`; ctx.fillRect(0, 0, W, H); }
    }
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- MASA
SC.masa = {
  cap: 1430,
  draw(ctx, t, lt, d, E) {
    ctx.save();
    const k = smooth(clamp(lt / d));
    cam(ctx, lerp(1.0, 1.18, k), lerp(W / 2, 760, k), lerp(H / 2, 820, k));
    drawDeskScene(ctx, t, { face: 0.2, brow: 'notr', eyes: 'nokta' });
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- KURALLAR
const PAPER = { x: 110, y: 150, w: 860, h: 1290 };
function rulesLayout(ctx, tl) {
  const out = []; let y = PAPER.y + 300;
  tl.rules.forEach((r, i) => {
    ctx.font = '600 56px Caveat';
    const maxW = 660; const words = r.split(' '); const lines = []; let cur = '';
    words.forEach(w => { const tst = cur ? cur + ' ' + w : w; if (ctx.measureText(tst).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tst; });
    if (cur) lines.push(cur);
    out.push({ i, y, lines, lh: 66 }); y += lines.length * 66 + 34;
  });
  return out;
}
SC.kurallar = {
  cap: 1320,
  draw(ctx, t, lt, d, E) {
    const tl = E.tl;
    // ahşap duvar
    ctx.fillStyle = '#3a2516'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(15,8,3,0.6)'; ctx.lineWidth = 4;
    for (let x = 0; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    const lg = ctx.createRadialGradient(W / 2, 700, 100, W / 2, 800, 1100);
    lg.addColorStop(0, 'rgba(255,200,130,0.12)'); lg.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
    const lay = rulesLayout(ctx, tl);
    const L12 = E.ln('L12');
    const sw = lineWords(E, 'L12');
    const scribT = (sw.find(w => /karalan/.test(w.w))?.e ?? L12.s + 1.4) - 0.05;
    const hardT = (sw.find(w => /bastıra/i.test(w.w))?.s ?? L12.e - 0.6);
    const zk = smooth(seg(t, L12.s - 0.1, L12.s + 1.2));
    const r5 = lay[4];
    ctx.save();
    const [sx, sy] = sway(t, 3);
    const shake = Math.max(0, 1 - Math.abs(t - hardT) / 0.25);
    cam(ctx, lerp(1.0, 1.32, zk), lerp(W / 2, 520, zk) + sx + noise1(t * 60, 2) * 12 * shake, lerp(H / 2 - 120, r5.y + 10, zk) + sy + noise1(t * 57, 5) * 12 * shake);
    // kâğıt
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
    ctx.fillStyle = '#f4ecdc';
    const P = PAPER;
    ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(P.x + P.w, P.y); ctx.lineTo(P.x + P.w, P.y + P.h - 150);
    ctx.lineTo(P.x + P.w - 40, P.y + P.h - 110); ctx.lineTo(P.x + P.w - 10, P.y + P.h - 70); ctx.lineTo(P.x + P.w - 60, P.y + P.h - 30);
    ctx.lineTo(P.x + P.w - 30, P.y + P.h); ctx.lineTo(P.x, P.y + P.h); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = 'rgba(90,110,150,0.28)'; ctx.lineWidth = 2;
    for (let yy = P.y + 236; yy < P.y + P.h - 30; yy += 66) { ctx.beginPath(); ctx.moveTo(P.x + 10, yy + 18); ctx.lineTo(P.x + P.w - 70, yy + 18); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(210,70,60,0.55)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(P.x + 92, P.y + 10); ctx.lineTo(P.x + 92, P.y + P.h - 10); ctx.stroke();
    ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(P.x + P.w / 2, P.y + 20, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1f1f24'; ctx.font = '700 80px Caveat'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(tl.rules_title, P.x + 150, P.y + 170);
    ctx.strokeStyle = '#1f1f24'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(P.x + 150, P.y + 190); ctx.lineTo(P.x + 640, P.y + 190); ctx.stroke();
    // kurallar yazılır
    lay.forEach(R => {
      const L = E.ln('L' + String(8 + R.i).padStart(2, '0'));
      const t0 = L.s - 0.1, dur = 1.5;
      const k = seg(t, t0, t0 + dur);
      if (k <= 0) return;
      const total = R.lines.reduce((a, l) => a + l.length, 0);
      let shown = Math.floor(total * k), done = 0;
      R.lines.forEach((l, j) => {
        const n = clamp(shown - done, 0, l.length); done += l.length;
        if (n <= 0) return;
        ctx.font = '600 56px Caveat';
        if (j === 0) { ctx.fillStyle = '#c0392b'; ctx.fillText(`${R.i + 1}.`, P.x + 110, R.y); }
        ctx.fillStyle = '#26262c'; ctx.fillText(l.slice(0, n), P.x + 160, R.y + j * R.lh);
      });
      // 5. kural karalanır
      if (R.i === 4) {
        const sk = seg(t, scribT, scribT + 0.9);
        if (sk > 0) {
          const R2 = mulberry32(77);
          ctx.strokeStyle = '#141418'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          [10, 14].forEach((lw, pass) => {
            ctx.lineWidth = lw;
            ctx.beginPath();
            const x0 = P.x + 150, x1 = P.x + 160 + ctx.measureText(R.lines[0]).width + 20;
            const steps = 26;
            const m = Math.floor(steps * sk);
            for (let q = 0; q <= m; q++) {
              const xx = lerp(x0, x1, q / steps), yy = R.y - 18 + (q % 2 ? -26 : 18) + (R2() - 0.5) * 16 + pass * 6;
              q === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
            }
            ctx.stroke();
          });
        }
      }
    });
    ctx.restore();
    const fl = 0.05 + 0.03 * Math.sin(t * 11) * Math.sin(t * 6.1);
    ctx.fillStyle = `rgba(255,170,80,${fl})`; ctx.fillRect(0, 0, W, H);
    drawVignette(ctx, 0.55);
  },
};

// ---------------------------------------------------------------- MERDİVEN
SC.merdiven = {
  cap: (t, E) => (t < E.ln('L14').s - 0.1 ? 1300 : 1300),
  draw(ctx, t, lt, d, E) {
    const L13 = E.ln('L13'), L14 = E.ln('L14');
    if (t < L14.s - 0.1) {
      const prog = clamp((t - (L13.s - 0.6)) / (L14.s - L13.s + 0.4));
      ctx.save();
      cam(ctx, 1.0, W / 2, H / 2);
      drawStairs(ctx, t, prog, { brow: 'kizgin' });
      ctx.restore();
      drawStepCounter(ctx, Math.min(98, 86 + Math.floor(prog * 12)));
    } else {
      // bakış açısı: duvarda boyalı 99, aşağıda 98 ve ayaklar
      ctx.fillStyle = '#2b2826'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#4b4540'; ctx.fillRect(0, 0, W, 560);
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 4;
      for (let x = 0; x < W; x += 160) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 560); ctx.stroke(); }
      ctx.fillStyle = '#6d655d'; ctx.fillRect(0, 560, W, 560);
      ctx.fillStyle = '#3a3532'; ctx.fillRect(0, 1120, W, 40);
      ctx.fillStyle = '#5a534c'; ctx.fillRect(0, 1160, W, 760);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#efe9df'; ctx.font = '700 300px Oswald'; ctx.fillText('99', W / 2, 840);
      ctx.fillStyle = 'rgba(30,28,26,0.55)'; ctx.font = '700 240px Oswald'; ctx.fillText('98', W / 2, 1560);
      // ayaklar
      const bob = Math.sin(t * 2) * 4;
      ctx.strokeStyle = INK; ctx.lineWidth = 16;
      ctx.beginPath(); ctx.moveTo(360, H + 20); ctx.lineTo(420, 1080 + bob); ctx.moveTo(720, H + 20); ctx.lineTo(660, 1080 + bob); ctx.stroke();
      ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 6;
      [[420, 1050], [660, 1050]].forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(x, y + bob, 92, 52, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
      drawStepCounter(ctx, 99, '#3ddc8f');
      drawVignette(ctx, 0.5);
    }
  },
};

// ---------------------------------------------------------------- LAMBA
SC.lamba = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    const L16 = E.ln('L16');
    const pullT = L16.s - 0.35;
    const p = smooth(seg(t, pullT - 0.25, pullT));
    const lit = smooth(seg(t, pullT, pullT + 0.18));
    ctx.save();
    cam(ctx, 1.0 + lt * 0.01, W / 2, H / 2);
    drawLampRoomB(ctx, t, { lit, pull: p, brow: lit > 0 ? 'notr' : 'kizgin' });
    ctx.restore();
    const fl = Math.max(0, 1 - Math.abs(t - pullT - 0.05) / 0.22);
    if (fl > 0) { ctx.fillStyle = `rgba(255,240,200,${0.6 * fl})`; ctx.fillRect(0, 0, W, H); }
    drawVignette(ctx, 0.45);
  },
};

// ---------------------------------------------------------------- DEFTER
SC.defter = {
  cap: 1430,
  draw(ctx, t, lt, d, E) {
    const L17 = E.ln('L17');
    ctx.save();
    cam(ctx, 1.06, W / 2, 1000);
    const wx = 520 + Math.sin(t * 9) * 26, wy = 1346 + Math.sin(t * 17) * 4;
    drawDeskScene(ctx, t, { face: 0, brow: 'notr', eyes: 'nokta', arm: 'tut', hand: [wx, wy] });
    ctx.restore();
    drawNoteCard(ctx, t, clamp((t - L17.s + 0.2) / 3.2));
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- SAAT
SC.saat = {
  cap: 1400,
  draw(ctx, t, lt, d, E) {
    const g = ctx.createRadialGradient(W / 2, 760, 100, W / 2, 900, 1200);
    g.addColorStop(0, '#1b2440'); g.addColorStop(1, '#070a14');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const w3 = lineWords(E, 'L18').find(w => /üç/.test(w.w));
    const t3 = (w3?.s ?? E.ln('L18').s + 0.5);
    const ss = clamp(60 - (t3 - t), 52, 60);
    const isThree = t >= t3;
    drawClockBig(ctx, 520, 830, 300, isThree ? 3 : 2, isThree ? 0 : 59, isThree ? 0 : ss);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '700 140px Oswald';
    ctx.fillStyle = isThree ? '#ff5148' : '#ffffff';
    ctx.fillText(isThree ? '03:00' : '02:59', 520, 1260);
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- TELSİZ
SC.telsiz = {
  cap: 1390,
  draw(ctx, t, lt, d, E) {
    const lvl = speaking(E, ['L19', 'L20', 'L21', 'L22'], t);
    ctx.save();
    const [sx, sy] = sway(t, 3);
    cam(ctx, 1.0 + lt * 0.006, W / 2 + sx, 980 + sy);
    drawRadioBig(ctx, t, lvl);
    ctx.restore();
    drawVignette(ctx, 0.55);
  },
};

// ---------------------------------------------------------------- PENCERE
SC.pencere = {
  cap: 1400,
  draw(ctx, t, lt, d, E) {
    ctx.save();
    cam(ctx, 1.0 + lt * 0.01, W / 2, H / 2);
    drawWindowRain(ctx, t);
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- MASA 2 (cevap ver?)
SC.masa2 = {
  cap: 1430,
  draw(ctx, t, lt, d, E) {
    const L24 = E.ln('L24'), L25 = E.ln('L25');
    const reach = smooth(seg(t, L25.e + 0.2, L25.e + 2.2));
    const lvl = speaking(E, ['L24', 'L25'], t);
    const shock = t > L25.s + 0.4;
    ctx.save();
    const k = smooth(clamp(lt / d));
    cam(ctx, lerp(1.04, 1.16, k), lerp(W / 2, 480, k), lerp(1000, 1080, k));
    drawDeskScene(ctx, t, {
      face: shock ? -0.5 : 0, brow: shock ? 'korku' : 'uzgun', eyes: shock ? 'iri' : 'nokta', mouth: shock ? 'o' : 'asagi',
      arm: reach > 0.02 ? 'tut' : 'asagi', hand: [lerp(520, 330, reach), lerp(1346, 1230, reach)], radioGlow: 0.5 + 0.5 * lvl,
    });
    ctx.restore();
    drawRuleCard2(ctx, t, clamp((t - L25.e - 0.1) / 0.5));
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- SEÇİM
SC.secim = {
  cap: 1390,
  draw(ctx, t, lt, d, E) {
    const [c, x] = off('sec');
    drawRadioBig(x, t, 0.1);
    ctx.filter = 'blur(10px) brightness(0.35)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
    drawChoice(ctx, t, lt);
    drawVignette(ctx, 0.5);
  },
};
