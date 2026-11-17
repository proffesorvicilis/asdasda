// Tuhaf Saat · Fener · Gece 2 — sahneler (referans videonun sahne akışı, daha sıcak ışık)
'use strict';

function cam(ctx, z, cx = W / 2, cy = H / 2) { ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); }
function sway(t, a = 5) { return [noise1(t * 0.6, 1) * a, noise1(t * 0.5, 7) * a]; }
function lineWords(E, id) { return E.tl.words.filter(w => w.line === id); }
function wordT(E, id, re, which = 's') { const w = lineWords(E, id).find(w => re.test(w.w)); return w ? w[which] : null; }
function speaking(E, ids, t) {
  const on = E.tl.words.some(w => ids.includes(w.line) && t >= w.s && t <= w.e + 0.05);
  return on ? 0.55 + 0.45 * Math.abs(Math.sin(t * 23) * Math.sin(t * 7.1)) : 0.06;
}
const KNOCKS = [0.62, 0.88, 1.13, 1.43];
function knockShake(E, t) {
  const c = E.cues.find(c => c.fx === 'kapi_vurus');
  if (!c) return 0;
  return KNOCKS.reduce((m, k) => Math.max(m, Math.max(0, 1 - Math.abs(t - c.t - k) / 0.12)), 0);
}

const SC = {};

// ---------------------------------------------------------------- MASA (sessiz kaldın)
SC.masa_sessiz = {
  cap: 1430,
  draw(ctx, t, lt, d, E) {
    const back = smooth(clamp(lt / 1.2));
    ctx.save();
    cam(ctx, 1.04 + lt * 0.01, W / 2, 1020);
    drawDeskScene(ctx, t, { face: 0.2, brow: 'endise', eyes: 'nokta', mouth: 'asagi', arm: 'tut', hand: [lerp(380, 500, back), lerp(1250, 1330, back)], radioGlow: 0.35 });
    ctx.restore();
    drawVignette(ctx, 0.45);
  },
};
SC.masa_sessiz2 = {
  cap: 1430,
  draw(ctx, t, lt, d, E) {
    ctx.save();
    cam(ctx, 1.08 + lt * 0.012, W / 2, 1040);
    drawDeskScene(ctx, t, { face: 0, brow: 'uzgun', eyes: 'nokta', mouth: 'asagi', radioGlow: 0.15 });
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- TELSİZ KENDİLİĞİNDEN AÇILIR
SC.telsiz_acilir = {
  cap: 1390,
  draw(ctx, t, lt, d, E) {
    const onT = (wordT(E, 'L02', /açıldı/) ?? E.ln('L02').e - 0.6);
    const fl = t < onT ? 0 : (t < onT + 0.35 ? (Math.sin((t - onT) * 60) > 0 ? 1 : 0.3) : 1);
    const lvl = speaking(E, ['L03'], t);
    ctx.save();
    const [sx, sy] = sway(t, 3);
    cam(ctx, 1.0 + lt * 0.008, W / 2 + sx, 980 + sy);
    drawRadioBig(ctx, t, lvl, -230, fl);
    ctx.restore();
    drawVignette(ctx, 0.55);
  },
};

// ---------------------------------------------------------------- YÜK GEMİSİ
SC.gemi = {
  cap: 1400,
  draw(ctx, t, lt, d, E) {
    ctx.save();
    cam(ctx, 1.0 + lt * 0.008, W / 2, H / 2);
    drawWindowRain(ctx, t);
    // pencerenin içinden geçen gemi
    ctx.save(); ctx.beginPath(); ctx.rect(40, 100, 1000, 1500); ctx.clip();
    drawCargoShip(ctx, lerp(1350, -150, clamp(lt / d)), 1035, 0.42, t);
    drawRain(ctx, t * 1.1, { n: 90, a: 0.4, seed: 4 });
    ctx.restore();
    ctx.strokeStyle = '#05070f'; ctx.lineWidth = 40; ctx.strokeRect(40, 100, 1000, 1500);
    ctx.lineWidth = 24; ctx.beginPath(); ctx.moveTo(540, 100); ctx.lineTo(540, 1600); ctx.moveTo(40, 850); ctx.lineTo(1040, 850); ctx.stroke();
    ctx.restore();
    const ok = wordT(E, 'L05', /Sağ/);
    if (ok != null && t > ok) { const f = Math.max(0, 1 - (t - ok) / 0.6); if (f > 0) { ctx.fillStyle = `rgba(80,220,140,${0.12 * f})`; ctx.fillRect(0, 0, W, H); } }
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- GÜNDÜZ: MOSS'A SORUYORSUN
SC.gunduz = {
  cap: 1430,
  draw(ctx, t, lt, d, E) {
    const talk = speaking(E, ['L07'], t) > 0.3;
    ctx.save();
    cam(ctx, 1.04 + lt * 0.01, W / 2, 1020);
    drawDeskScene(ctx, t, { day: true, lampOn: 0, face: 0.35, brow: 'kizgin', eyes: 'nokta', mouth: talk ? 'o' : 'cizgi', arm: 'tut', hand: [640, 1180], mic: true, radioGlow: 0.5 });
    ctx.restore();
    drawVignette(ctx, 0.35);
  },
};
SC.moss_telsiz = {
  cap: 1390,
  draw(ctx, t, lt, d, E) {
    const lvl = speaking(E, ['L08', 'L09', 'L10'], t);
    ctx.save();
    const [sx, sy] = sway(t, 3);
    cam(ctx, 1.0 + lt * 0.006, W / 2 + sx, 980 + sy);
    drawRadioBig(ctx, t, lvl, -230, 1);
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(150,185,230,0.25)'; ctx.fillRect(0, 0, W, H); ctx.restore();
    drawVignette(ctx, 0.45);
  },
};

// ---------------------------------------------------------------- HARLAN'IN FOTOĞRAFI
SC.harlan_foto = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    ctx.save();
    cam(ctx, 1.0 + lt * 0.02, 500, 840);
    drawHarlanPortrait(ctx, t);
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};
SC.harlan_kasket = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    const k = smooth(clamp(lt / 1.0));
    ctx.save();
    cam(ctx, lerp(1.4, 2.3, k), 460, lerp(820, 640, k));
    drawHarlanPortrait(ctx, t);
    ctx.restore();
    // kasket parıltısı
    warmGlow(ctx, 540, 820, 340, 0.18 * k, '255,210,140');
    drawVignette(ctx, 0.6);
  },
};

// ---------------------------------------------------------------- GÜNLÜK
SC.gunluk = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    const pages = E.tl.gunluk;
    const L12 = E.ln('L12'), L13 = E.ln('L13'), L14 = E.ln('L14'), L15 = E.ln('L15');
    const span = L13.s - L12.s;
    const tp = [L12.s - 0.1, L12.s + span * 0.34, L12.s + span * 0.67, L13.s - 0.1];   // sayfa geçişleri
    let pi = 0; tp.forEach((x, i) => { if (t >= x) pi = i; });
    const flip = Math.max(0, ...tp.slice(1).map(x => 1 - Math.abs(t - x) / 0.14));
    let k = 1;
    if (pi === 3) {
      const lines = pages[3][1];
      const lens = lines.map(l => l.replace('!', '').length), tot = lens.reduce((a, b) => a + b, 0);
      const c3 = lens[0] + lens[1] + lens[2], c5 = c3 + lens[3] + lens[4], c6 = c5 + lens[5];
      const red2 = wordT(E, 'L15', /^Bu$/) ?? L15.s + 1.6;
      const seg3 = [[L13.s, L13.e, 0, c3], [L14.s, L14.e, c3, c5], [L15.s, red2, c5, c6], [red2, L15.e, c6, tot]];
      let ch = 0;
      seg3.forEach(([a, b, c0, c1]) => { if (t >= a) ch = lerp(c0, c1, clamp((t - a) / Math.max(0.2, b - a))); });
      k = ch / tot;
    }
    ctx.save();
    const z = pi === 3 ? lerp(1.0, 1.12, smooth(clamp((t - L15.s) / 2))) : 1.0;
    cam(ctx, z, W / 2, pi === 3 ? lerp(H / 2, 1000, smooth(clamp((t - L15.s) / 2))) : H / 2);
    drawJournal(ctx, t, pages[pi], k, flip);
    ctx.restore();
    drawVignette(ctx, 0.55);
  },
};

// ---------------------------------------------------------------- MERDİVEN (lambaya çıkış)
SC.merdiven = {
  cap: 1300,
  draw(ctx, t, lt, d, E) {
    const prog = clamp(0.35 + lt / d * 0.65);
    ctx.save(); cam(ctx, 1.0, W / 2, H / 2);
    drawStairs(ctx, t, prog, { brow: 'kizgin' });
    ctx.restore();
    drawStepCounter(ctx, Math.min(99, 92 + Math.floor(prog * 8)), prog > 0.97 ? '#3ddc8f' : '#ffc83d');
    drawVignette(ctx, 0.45);
  },
};

// ---------------------------------------------------------------- LAMBA
SC.lamba = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    const pullT = (wordT(E, 'L16', /yandı/) ?? E.ln('L16').e - 0.5) - 0.35;
    const p = smooth(seg(t, pullT - 0.25, pullT));
    const lit = smooth(seg(t, pullT, pullT + 0.18));
    E.ignite2 = pullT;
    ctx.save(); cam(ctx, 1.0 + lt * 0.01, W / 2, H / 2);
    drawLampRoomB(ctx, t, { lit, pull: p, brow: lit > 0 ? 'notr' : 'kizgin' });
    ctx.restore();
    const fl = Math.max(0, 1 - Math.abs(t - pullT - 0.05) / 0.22);
    if (fl > 0) { ctx.fillStyle = `rgba(255,240,200,${0.55 * fl})`; ctx.fillRect(0, 0, W, H); }
    drawVignette(ctx, 0.45);
  },
};

// ---------------------------------------------------------------- YATAK
SC.yatak = {
  cap: 1300,
  draw(ctx, t, lt, d, E) {
    const awake = t > E.ln('L17').e - 0.5 ? 1 : 0;
    ctx.save(); cam(ctx, 1.02 + lt * 0.01, W / 2, 1000);
    drawBedroom(ctx, t, { awake });
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- KAPI (içeriden)
SC.kapi_ic = {
  cap: 1300,
  draw(ctx, t, lt, d, E) {
    const sh = knockShake(E, t);
    ctx.save();
    ctx.translate(noise1(t * 60, 2) * 14 * sh, noise1(t * 53, 4) * 10 * sh);
    cam(ctx, 1.0 + lt * 0.015, 530, 1100);
    drawDoorInside(ctx, t, {});
    ctx.restore();
    if (sh > 0) { ctx.fillStyle = `rgba(0,0,0,${0.12 * sh})`; ctx.fillRect(0, 0, W, H); }
    drawVignette(ctx, 0.6);
  },
};
SC.kapi_bekci = {
  cap: 1190,
  draw(ctx, t, lt, d, E) {
    const fa = clamp((t - (E.ln('L19').s - 0.6)) / 0.6);
    ctx.save();
    cam(ctx, 1.0 + lt * 0.012, 520, 1080);
    const pos = drawDoorInside(ctx, t, { face: fa, shiver: 1 });
    // bekçi, elinde fenerle kapıya bakıyor
    drawPerson(ctx, 830, 1740, 1.3, { who: 'bekci', face: -1, t, arm: 'tut', hand: [905, 1430], brow: 'korku', eyes: 'iri', seed: 2 });
    drawLantern(ctx, 905, 1520, 1.0, t);
    ctx.restore();
    drawVignette(ctx, 0.55);
  },
};

// ---------------------------------------------------------------- KURAL 3 (kâğıt + kart)
SC.kural3 = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    ctx.fillStyle = '#3a2516'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(15,8,3,0.6)'; ctx.lineWidth = 4;
    for (let x = 0; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    ctx.save(); cam(ctx, 1.0 + lt * 0.01, W / 2, 900);
    const P = { x: 110, y: 260, w: 860, h: 1200 };
    ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 40;
    ctx.fillStyle = '#f4ecdc'; ctx.fillRect(P.x, P.y, P.w, P.h);
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(90,110,150,0.28)'; ctx.lineWidth = 2;
    for (let yy = P.y + 236; yy < P.y + P.h - 30; yy += 66) { ctx.beginPath(); ctx.moveTo(P.x + 10, yy + 18); ctx.lineTo(P.x + P.w - 10, yy + 18); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(210,70,60,0.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(P.x + 92, P.y + 10); ctx.lineTo(P.x + 92, P.y + P.h - 10); ctx.stroke();
    ctx.fillStyle = '#1f1f24'; ctx.font = '700 80px Caveat'; ctx.textAlign = 'left'; ctx.fillText(E.tl.rules_title, P.x + 150, P.y + 170);
    let y = P.y + 300;
    E.tl.rules.forEach((r, i) => {
      ctx.font = '600 54px Caveat';
      const words = r.split(' '); const lines = []; let cur = '';
      words.forEach(w => { const tst = cur ? cur + ' ' + w : w; if (ctx.measureText(tst).width > 660 && cur) { lines.push(cur); cur = w; } else cur = tst; });
      if (cur) lines.push(cur);
      ctx.fillStyle = '#c0392b'; ctx.fillText(`${i + 1}.`, P.x + 110, y);
      ctx.fillStyle = '#26262c'; lines.forEach((l, j) => ctx.fillText(l, P.x + 160, y + j * 64));
      if (i === 4) { ctx.strokeStyle = '#141418'; ctx.lineWidth = 12; ctx.beginPath(); for (let q = 0; q <= 22; q++) { const xx = P.x + 150 + q * 26, yy = y - 18 + (q % 2 ? -24 : 16); q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
      y += lines.length * 64 + 30;
    });
    ctx.restore();
    drawRuleCardN(ctx, t, clamp(lt / 0.4), 'KURAL 3', 'Geceleri adaya kimse gelmez.');
    drawVignette(ctx, 0.55);
  },
};

// ---------------------------------------------------------------- SEÇİM
SC.secim = {
  cap: 1390,
  draw(ctx, t, lt, d, E) {
    const [c, x] = off('sec');
    drawDoorInside(x, t, { face: 1, shiver: 1 });
    drawPerson(x, 830, 1740, 1.3, { who: 'bekci', face: -1, t, arm: 'tut', hand: [905, 1430], brow: 'korku', eyes: 'iri', seed: 2 });
    drawLantern(x, 905, 1520, 1.0, t);
    ctx.filter = 'blur(10px) brightness(0.4)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
    drawChoice2(ctx, t, lt);
    drawVignette(ctx, 0.45);
  },
};
