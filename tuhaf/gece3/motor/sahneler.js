// Tuhaf Saat · Fener · Gece 3 — sahneler (referans videonun sahne akışı, sıcak ışık)
'use strict';

function cam(ctx, z, cx = W / 2, cy = H / 2) { ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); }
function sway(t, a = 5) { return [noise1(t * 0.6, 1) * a, noise1(t * 0.5, 7) * a]; }
function lineWords(E, id) { return E.tl.words.filter(w => w.line === id); }
function wordT(E, id, re, which = 's') { const w = lineWords(E, id).find(w => re.test(w.w)); return w ? w[which] : null; }
function speaking(E, ids, t) {
  const on = E.tl.words.some(w => ids.includes(w.line) && t >= w.s && t <= w.e + 0.05);
  return on ? 0.55 + 0.45 * Math.abs(Math.sin(t * 23) * Math.sin(t * 7.1)) : 0.06;
}
const sceneIds = (E, name) => E.tl.lines.filter(l => l.sc === name).map(l => l.id);
const KNOCKS = [0.62, 0.88, 1.13, 1.43];
function knockShake(E, t) {
  const c = E.cues.find(c => c.fx === 'kapi_vurus');
  if (!c) return 0;
  return KNOCKS.reduce((m, k) => Math.max(m, Math.max(0, 1 - Math.abs(t - c.t - k) / 0.12)), 0);
}

const SC = {};

// ---------------------------------------------------------------- KAPI KİLİTLİ (gece 2, 01:30 → 01:34)
SC.kapi_kilitli = {
  cap: 1190,
  draw(ctx, t, lt, d, E) {
    const gone = wordT(E, 'L03', /gitti/) ?? E.ln('L03').s + 0.4;
    const fa = 1 - smooth(clamp((t - gone) / 0.35));
    const sh = knockShake(E, t);
    ctx.save();
    ctx.translate(noise1(t * 60, 2) * 12 * sh, noise1(t * 53, 4) * 8 * sh);
    cam(ctx, 1.0 + lt * 0.01, 520, 1080);
    drawDoorInside(ctx, t, { face: fa, shiver: 1 });
    drawPerson(ctx, 830, 1740, 1.3, { who: 'bekci', face: -1, t, arm: 'tut', hand: [905, 1430], brow: 'korku', eyes: 'iri', seed: 2 });
    drawLantern(ctx, 905, 1520, 1.0, t);
    ctx.restore();
    if (sh > 0) { ctx.fillStyle = `rgba(0,0,0,${0.12 * sh})`; ctx.fillRect(0, 0, W, H); }
    drawVignette(ctx, 0.55);
  },
};

// ---------------------------------------------------------------- SABAH: CAMIN DIŞINDA EL İZLERİ
SC.el_izleri = {
  cap: 1330,
  draw(ctx, t, lt, d, E) {
    const pT = wordT(E, 'L04', /^el$/) ?? E.ln('L04').s + 1.0;
    const prints = clamp((t - (pT - 0.45)) / 0.9);
    const zk = smooth(clamp((t - (pT - 0.7)) / 1.7));
    ctx.save();
    cam(ctx, lerp(1.0, 1.6, zk), 530, lerp(1000, 830, zk));
    drawDoorDay(ctx, t, { prints });
    ctx.restore();
    drawVignette(ctx, 0.3);
  },
};

// ---------------------------------------------------------------- ÖĞLEN: MOSS'A ANLATIYORSUN
SC.gunduz3 = {
  cap: 1430,
  draw(ctx, t, lt, d, E) {
    const talk = speaking(E, ['L05'], t) > 0.3;
    ctx.save();
    cam(ctx, 1.04 + lt * 0.01, W / 2, 1020);
    drawDeskScene(ctx, t, { day: true, lampOn: 0, face: 0.35, brow: 'endise', eyes: 'nokta', mouth: talk ? 'o' : 'cizgi', arm: 'tut', hand: [640, 1180], mic: true, radioGlow: 0.5 });
    ctx.restore();
    drawVignette(ctx, 0.35);
  },
};
SC.moss_telsiz = {
  cap: 1390,
  draw(ctx, t, lt, d, E) {
    const lvl = speaking(E, sceneIds(E, 'moss_telsiz'), t);
    ctx.save();
    const [sx, sy] = sway(t, 3);
    cam(ctx, 1.0 + lt * 0.006, W / 2 + sx, 980 + sy);
    drawRadioBig(ctx, t, lvl, -230, 1);
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(150,185,230,0.25)'; ctx.fillRect(0, 0, W, H); ctx.restore();
    drawVignette(ctx, 0.45);
  },
};

// ---------------------------------------------------------------- HARLAN'IN GÜNLÜĞÜ (29 Eylül)
SC.gunluk3 = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    const page = E.tl.gunluk[0];
    const lens = page[1].map(l => l.replace('!', '').length), tot = lens.reduce((a, b) => a + b, 0);
    const c1 = lens[0], c2 = c1 + lens[1], c4 = c2 + lens[2] + lens[3];
    const L09 = E.ln('L09'), L10 = E.ln('L10'), L11 = E.ln('L11'), L12 = E.ln('L12');
    const segs = [[L09.s + 0.2, L09.e, 0, c1], [L10.s, L10.e, c1, c2], [L11.s, L11.e, c2, c4], [L12.s, L12.e, c4, tot]];
    let ch = 0;
    segs.forEach(([a, b, x0, x1]) => { if (t >= a) ch = lerp(x0, x1, clamp((t - a) / Math.max(0.2, b - a))); });
    const zk = smooth(clamp((t - L10.s) / 3.5));
    ctx.save();
    cam(ctx, lerp(1.0, 1.1, zk), W / 2, lerp(H / 2, 900, zk));
    drawJournal(ctx, t, page, ch / tot, 0, 'H. HARLAN  ·  BEKÇİ GÜNLÜĞÜ');
    ctx.restore();
    drawVignette(ctx, 0.55);
  },
};

// ---------------------------------------------------------------- DIŞARIDA: YAĞMURDA FENER (alacakaranlık)
SC.fener_dis = {
  cap: 1300,
  draw(ctx, t, lt, d, E) {
    ctx.save();
    cam(ctx, 1.0 + lt * 0.02, 520, 960);
    nightBackdrop(ctx, t, 1000, { moon: { x: 820, y: 230, r: 62 }, nClouds: 2, cy0: 300 });
    const g = lighthouseGeom(300, 1000, 560, 1.05);
    drawRocks(ctx, 330, 1050, 680, { rock: '#151a25', rockHi: '#222a38' }, { h: 110, t, seed: 4 });
    drawLighthouse(ctx, g, { lit: 0, stripes: true });
    drawPierDiag(ctx, 520, 1040, 1010, 1990, 24, 150);
    drawRain(ctx, t, { n: 150, a: 0.4 });
    drawRain(ctx, t * 1.15, { n: 50, a: 0.55, seed: 9, w: 3 });
    ctx.restore();
    drawVignette(ctx, 0.45);
  },
};

// ---------------------------------------------------------------- MERDİVEN (sayarak çıkış, 99'da yakın plan)
SC.merdiven = {
  cap: 1300,
  draw(ctx, t, lt, d, E) {
    const L13 = E.ln('L13'), L14 = E.ln('L14');
    if (t < L14.s - 0.1) {
      const s0 = L13.s - 1.4;
      const prog = clamp((t - s0) / (L14.s - 0.1 - s0));
      ctx.save();
      cam(ctx, 1.0, W / 2, H / 2);
      drawStairs(ctx, t, prog, { brow: 'kizgin' });
      ctx.restore();
      drawStepCounter(ctx, Math.min(98, 91 + Math.floor(prog * 8)));
      drawVignette(ctx, 0.45);
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
      const bob = Math.sin(t * 2) * 4;
      ctx.strokeStyle = INK; ctx.lineWidth = 16;
      ctx.beginPath(); ctx.moveTo(360, H + 20); ctx.lineTo(420, 1080 + bob); ctx.moveTo(720, H + 20); ctx.lineTo(660, 1080 + bob); ctx.stroke();
      ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 6;
      [[420, 1050], [660, 1050]].forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(x, y + bob, 92, 52, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
      warmGlow(ctx, 160, 300, 520, 0.18, '255,170,100');
      drawStepCounter(ctx, 99, '#3ddc8f');
      drawVignette(ctx, 0.5);
    }
  },
};

// ---------------------------------------------------------------- LAMBA (alacakaranlık, ışık yanar)
SC.lamba = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    const pullT = (wordT(E, 'L15', /yandı/) ?? E.ln('L15').e - 0.5) - 0.35;
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

// ---------------------------------------------------------------- GECE YARISINA ON VAR: UYUYAMIYORSUN, KÂĞIDI LAMBAYA TUTUYORSUN
SC.uykusuz = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    const L17 = E.ln('L17');
    const grab = smooth(clamp((t - (L17.e + 0.05)) / 0.7));
    const hx = lerp(825, 830, grab), hy = lerp(685, 1150, grab);
    ctx.save();
    cam(ctx, lerp(1.04, 1.14, grab) + lt * 0.006, lerp(W / 2, 700, grab), lerp(1000, 1120, grab));
    drawDeskScene(ctx, t, {
      face: grab > 0.05 ? 0.55 : 0.25, brow: 'endise', eyes: 'iri', mouth: 'cizgi',
      arm: grab > 0.02 ? 'tut' : 'asagi', hand: grab > 0.02 ? [hx - 96, hy + 30] : undefined,
      paperX: grab > 0.02 ? -9999 : 720, radioGlow: 0.25,
    });
    if (grab > 0.02) {
      // elde tutulan kâğıt, arkasındaki lamba ışığıyla parlıyor
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(0.05 * grab);
      const pw = 210, ph = lerp(250, 290, grab);
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-pw / 2 + 8, -ph / 2 + 8, pw, ph);
      ctx.fillStyle = mix('#efe6cf', '#fff0c2', grab); ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
      const g = ctx.createRadialGradient(0, ph * 0.25, 10, 0, ph * 0.25, ph * 0.7);
      g.addColorStop(0, `rgba(255,190,80,${0.75 * grab})`); g.addColorStop(1, 'rgba(255,190,80,0)');
      ctx.fillStyle = g; ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
      ctx.strokeStyle = 'rgba(80,90,120,0.45)'; ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-pw / 2 + 22, -ph / 2 + 50 + i * 36); ctx.lineTo(pw / 2 - 22, -ph / 2 + 50 + i * 36); ctx.stroke(); }
      ctx.strokeStyle = '#141418'; ctx.lineWidth = 5; ctx.beginPath();
      for (let q = 0; q <= 8; q++) { const xx = -pw / 2 + 26 + q * 20, yy = -ph / 2 + 50 + 4 * 36 + 10 + (q % 2 ? -8 : 6); q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke();
      ctx.restore();
      warmGlow(ctx, hx, hy + 60, 330, 0.3 * grab, '255,200,110');
    }
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- 5. KURAL: IŞIKTA KARALAMANIN ALTI OKUNUYOR
SC.kural5 = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    ctx.fillStyle = '#140d08'; ctx.fillRect(0, 0, W, H);
    const pan = smooth(clamp(lt / 1.9));
    const rv = smooth(clamp((lt - 0.7) / 1.5));
    ctx.save();
    cam(ctx, lerp(1.35, 1.6, pan), 600, lerp(880, 1150, pan));
    drawRulesPaper(ctx, t, E, { x: 110, y: 260, w: 860, h: 1200 }, { glow: 0.95, reveal: rv });
    ctx.restore();
    warmGlow(ctx, W / 2, 1720, 560, 0.5, '255,190,90');
    drawVignette(ctx, 0.6);
  },
};

// ---------------------------------------------------------------- 03:20 TELSİZ KENDİLİĞİNDEN AÇILIR (masada)
SC.telsiz_acilir3 = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    const onT = wordT(E, 'L19', /açıldı/) ?? E.ln('L19').e - 0.6;
    const on = t >= onT;
    const fl = !on ? 0.04 : (t < onT + 0.35 ? (Math.sin((t - onT) * 60) > 0 ? 1 : 0.2) : 0.95);
    ctx.save();
    cam(ctx, 1.06 + lt * 0.012, W / 2, 1040);
    drawDeskScene(ctx, t, { face: on ? 0 : 0.25, brow: on ? 'korku' : 'endise', eyes: on ? 'iri' : 'nokta', mouth: on ? 'o' : 'cizgi', radioGlow: fl });
    ctx.restore();
    if (on) warmGlow(ctx, 240, 1290, 400, 0.22 * fl, '255,170,80');
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- TELSİZ YAKIN PLAN (senin sesin / Moss)
function radioScene(name) {
  return {
    cap: 1390,
    draw(ctx, t, lt, d, E) {
      const lvl = speaking(E, sceneIds(E, name), t);
      ctx.save();
      const [sx, sy] = sway(t, 3);
      cam(ctx, 1.0 + lt * 0.008, W / 2 + sx, 980 + sy);
      drawRadioBig(ctx, t, lvl, -230, 1);
      ctx.restore();
      drawVignette(ctx, 0.55);
    },
  };
}
SC.ses_telsiz = radioScene('ses_telsiz');
SC.ses_telsiz2 = radioScene('ses_telsiz2');

// ---------------------------------------------------------------- BEKÇİNİN YÜZÜ
function faceScene(z0, mouth) {
  return {
    cap: 1440,
    draw(ctx, t, lt, d, E) {
      ctx.save();
      cam(ctx, z0 + lt * 0.04, 560, 1090);
      drawDeskScene(ctx, t, { face: 0, brow: 'korku', eyes: 'iri', mouth, radioGlow: 0.95 });
      ctx.restore();
      warmGlow(ctx, 230, 1300, 400, 0.2, '255,170,80');
      drawVignette(ctx, 0.6);
    },
  };
}
SC.yuz_sok = faceScene(1.45, 'o');
SC.yuz_sok2 = faceScene(1.55, 'asagi');

// ---------------------------------------------------------------- KURAL 2 (kâğıt + kart)
SC.kural2 = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    drawRulesBoard(ctx, t, lt, E, {});
    drawRuleCardN(ctx, t, clamp(lt / 0.4), 'KURAL 2', 'Gece üçten sonra telsize asla cevap verme.');
    drawVignette(ctx, 0.55);
  },
};

// ---------------------------------------------------------------- SEÇİM
SC.secim = {
  cap: 1390,
  draw(ctx, t, lt, d, E) {
    const [c, x] = off('sec');
    x.save(); cam(x, 1.06, W / 2, 1040);
    drawDeskScene(x, t, { face: 0, brow: 'korku', eyes: 'iri', mouth: 'asagi', radioGlow: 0.95 });
    x.restore();
    ctx.filter = 'blur(10px) brightness(0.4)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
    drawChoice3(ctx, t, lt);
    drawVignette(ctx, 0.45);
  },
};
