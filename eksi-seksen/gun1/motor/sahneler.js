// Eksi Seksen · Gün 1 — sahneler (ayrıntılı çizimler)
'use strict';

function cam(ctx, z, cx = W / 2, cy = H / 2) { ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); }
function sway(t, a = 5) { return [noise1(t * 0.6, 1) * a, noise1(t * 0.5, 7) * a]; }
function lineWords(E, id) { return E.tl.words.filter(w => w.line === id); }
function wordT(E, id, re, which = 's') { const w = lineWords(E, id).find(w => re.test(w.w)); return w ? w[which] : null; }
function speaking(E, ids, t) {
  const on = E.tl.words.some(w => ids.includes(w.line) && t >= w.s && t <= w.e + 0.05);
  return on ? 0.55 + 0.45 * Math.abs(Math.sin(t * 23) * Math.sin(t * 7.1)) : 0;
}

const SC = {};

// ---------------------------------------------------------------- 07.40 ÇATI KATI YATAK ODASI
SC.yatak = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    const L01 = E.ln('L01'), L03 = E.ln('L03');
    const awake = t > L01.e;
    ctx.save();
    cam(ctx, 1.02 + lt * 0.006, 560, 1000);
    drawBedroomLux(ctx, t, { alarm: t < L01.e + 0.3, frost: 0.6 + 0.4 * clamp((t - L03.s) / 2), brow: awake ? (t > L03.s ? 'endise' : 'notr') : 'notr', face: 0.4 });
    ctx.restore();
    const ak = clamp(1 - (t - (L01.e - 0.4)) / 0.4);
    if (ak > 0) drawPhone(ctx, 540, lerp(2300, 1030, smooth(clamp(lt / 0.35))), 1.2, { mode: 'alarm', t, rot: -0.03 });
    const tp = wordT(E, 'L03', /^telefon/i) ?? L03.s + 1.5;
    const pk = smooth(clamp((t - tp + 0.35) / 0.45)) * (1 - smooth(clamp((t - L03.e + 0.1) / 0.3)));
    if (pk > 0 && ak <= 0) drawPhone(ctx, 540, lerp(2400, 1030, pk), 1.25, { mode: 'hava', temp: '−1°', sub: 'Dün: +10°  ·  Güneşli', rot: 0.02 });
    drawVignette(ctx, 0.35);
  },
};

// ---------------------------------------------------------------- 07.50 MUTFAK + TV
const NEWS1 = { title: 'SOĞUK HAVA DALGASI', tag: 'GÜNDEM', clock: '07:52' };
SC.mutfak = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    const on = (wordT(E, 'L04', /açtın/) ?? E.ln('L04').e - 0.5) + 0.15;
    ctx.save(); cam(ctx, 1.02 + lt * 0.01, W / 2, 1000);
    drawKitchenLux(ctx, t, { steam: true, tv: t > on ? NEWS1 : null, people: [{ who: 'kahraman', outfit: 'hoodie', x: 820, y: 1560, face: -1, brow: 'notr', arm: 'tut', hand: [730, 1210], seed: 3 }], mug: [730, 1210] });
    ctx.restore();
    drawVignette(ctx, 0.35);
  },
};
SC.tv_haber = {
  cap: 1450,
  draw(ctx, t, lt, d, E) {
    ctx.fillStyle = '#14161c'; ctx.fillRect(0, 0, W, H);
    ctx.save(); cam(ctx, 1.0 + lt * 0.012, W / 2, 800);
    ctx.fillStyle = '#050608'; rr(ctx, 20, 440, 1040, 680, 18); ctx.fill();
    drawNewsLux(ctx, 40, 460, 1000, 640, t, { ...NEWS1, talk: speaking(E, ['L05'], t) });
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};
SC.mutfak2 = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.18 + lt * 0.01, 780, 980);
    drawKitchenLux(ctx, t, { steam: true, tv: { ...NEWS1, clock: '07:53' }, people: [{ who: 'kahraman', outfit: 'hoodie', x: 800, y: 1560, face: 1, brow: 'notr', mouth: 'yukari', arm: 'tut', hand: [880, 1210], seed: 3 }], mug: [880, 1210] });
    ctx.restore();
    drawVignette(ctx, 0.35);
  },
};

// ---------------------------------------------------------------- 09.00 KUĞULU PARK
SC.park = {
  cap: 1450,
  draw(ctx, t, lt, d, E) {
    const L07 = E.ln('L07');
    const gs = wordT(E, 'L07', /^güneş/i) ?? L07.s + 2;
    const zk = smooth(clamp((t - gs + 0.2) / 2.2));
    ctx.save();
    cam(ctx, lerp(1.0, 1.9, zk), lerp(540, 777, zk), lerp(960, 300, zk));
    drawKugulu(ctx, t, {});
    ctx.restore();
    drawVignette(ctx, 0.3);
  },
};

// ---------------------------------------------------------------- 12.00 TUNALI KAFE
SC.kafe = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.02 + lt * 0.01, W / 2, 1000);
    drawCafeLux(ctx, t, {});
    ctx.restore();
    drawVignette(ctx, 0.35);
  },
};
SC.telefon_app = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    const [c, x] = off('kafebg');
    drawCafeLux(x, t, {});
    ctx.filter = 'blur(12px) brightness(0.55)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
    const ws = lineWords(E, 'L08');
    const marks = ws.filter(w => /^eksi$/i.test(w.w)).map(w => w.s);
    let k = 0.25;
    marks.forEach((m, i) => { if (t >= m - 0.1) k = (i + 2) / 4; });
    const pk = smooth(clamp(lt / 0.45));
    drawPhone(ctx, 540, lerp(2300, 980, pk), 1.45, { mode: 'tahmin', temp: '−1°', sub: 'Ankara · Güneşli', k, rot: -0.02, rows: [['Bugün', '−1°', 0], ['Yarın', '−10°', 1], ['Cuma', '−24°', 2], ['Cumartesi', '−32°', 3]] });
    drawVignette(ctx, 0.35);
  },
};
SC.kafe2 = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.2 + lt * 0.012, 620, 1250);
    drawCafeLux(ctx, t, { laugh: true, brow: 'endise', menu: false });
    ctx.restore();
    drawVignette(ctx, 0.4);
  },
};

// ---------------------------------------------------------------- 13.00 KIZILAY · ECZANE
SC.eczane = {
  cap: 1450,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.0 + lt * 0.02, W / 2, 1000);
    drawStreetKizilay(ctx, t, { lt });
    ctx.restore();
    drawVignette(ctx, 0.3);
  },
};

// ---------------------------------------------------------------- 13.05 DÜNYADAN CANLI YAYINLAR
SC.haber_bandi = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    const L13 = E.ln('L10');
    ctx.fillStyle = '#14161c'; ctx.fillRect(0, 0, W, H);
    const zk = smooth(clamp((t - L13.s - 2.2) / 2.5));
    ctx.save(); cam(ctx, lerp(1.0, 1.15, zk) + lt * 0.008, W / 2, 800);
    ctx.fillStyle = '#050608'; rr(ctx, 20, 440, 1040, 680, 18); ctx.fill();
    const k = clamp((t - L13.s - 0.8) / 3.5);
    drawWorldFeeds(ctx, 40, 460, 1000, 640, t, { k });
    ctx.restore();
    drawVignette(ctx, 0.45);
  },
};

// ---------------------------------------------------------------- 14.30 ARAS'LA TELEFON
SC.tel_aras = {
  cap: 1450,
  draw(ctx, t, lt, d, E) {
    const L16 = E.ln('L13');
    drawSplitCallLux(ctx, t, { who: 'aras', talk: speaking(E, ['L13'], t), callT: t - L16.s + 1, myBrow: 'endise' });
    if (t < L16.s - 0.1) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 960, W, 960);
      drawPhone(ctx, 540, 1430, 0.95, { mode: 'arama', name: 'Aras', status: 'aranıyor...', col: '#4fd1c5' });
    }
    drawVignette(ctx, 0.3);
  },
};

// ---------------------------------------------------------------- ÇİFTLİK + FOTOĞRAF
SC.ciftlik = {
  cap: 1330,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.08 - lt * 0.01, 560 + lt * 6, 1150);
    drawFarmLux(ctx, t, {});
    ctx.restore();
    drawVignette(ctx, 0.3);
  },
};
SC.foto = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.0 + lt * 0.03, 540, 1050);
    drawPhoto3(ctx, t, {});
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- 15.00 ÇINAR'LA TELEFON
SC.tel_cinar = {
  cap: 1450,
  draw(ctx, t, lt, d, E) {
    const L21 = E.ln('L21');
    drawSplitCallLux(ctx, t, { who: 'cinar', talk: speaking(E, ['L21'], t), callT: t - L21.s + 1, myBrow: 'endise' });
    if (t < L21.s - 0.1) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 960, W, 960);
      drawPhone(ctx, 540, 1430, 0.95, { mode: 'arama', name: 'Çınar', status: 'aranıyor...', col: '#ffa94d' });
    }
    drawVignette(ctx, 0.3);
  },
};

// ---------------------------------------------------------------- 19.00 GİRİŞ HOLÜ
SC.kapi = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.0 + lt * 0.012, W / 2, 1050);
    drawEntranceLux(ctx, t, { talk: 0 });
    ctx.restore();
    drawVignette(ctx, 0.45);
  },
};

// ---------------------------------------------------------------- 19.40 MUTFAK (AKŞAM)
SC.mutfak_aksam = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.04 + lt * 0.01, W / 2, 1000);
    drawKitchenLux(ctx, t, {
      night: 1, pot: true, cooker: true, tv: false,
      people: [
        { who: 'cinar', outfit: 'apron', coat: '#7a4a2e', x: 380, y: 1580, face: 1, arm: 'tut', hand: [380, 1120], brow: 'notr', mouth: 'yukari', seed: 5 },
        { who: 'kahraman', outfit: 'knit', x: 880, y: 1580, face: -1, brow: 'notr', seed: 3 },
      ],
      tablet: { x: 720, y: 1150, s: 0.72, mode: 'video', rot: -0.06 },
    });
    ctx.restore();
    drawVignette(ctx, 0.4);
  },
};

// ---------------------------------------------------------------- 21.00 AKŞAM HABERLERİ (salonda TV)
function eveningTV(ctx, t, lt, news) {
  ctx.save(); cam(ctx, 1.75 + lt * 0.01, 280, 560);
  drawKitchenLux(ctx, t, { night: 1, tv: news, pendants: false });
  ctx.restore();
  ctx.fillStyle = 'rgba(40,70,140,0.08)'; ctx.fillRect(0, 0, W, H);
  drawVignette(ctx, 0.55);
}
SC.tv_aksam = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    eveningTV(ctx, t, lt, { title: 'SOĞUK HAVA DALGASI SÜRÜYOR', tag: 'ANA HABER', clock: '21:00', ticker: 'KAYAK MERKEZLERİNDE YOĞUNLUK  •  METEOROLOJİ: SOĞUK HAVA BİR HAFTA SÜREBİLİR  •  ' });
    const gk = smooth(clamp((t - ((wordT(E, 'L25', /grafiği/) ?? E.ln('L25').e - 1.2) - 0.2)) / 0.4));
    if (gk > 0) drawTablet(ctx, 540, lerp(2300, 1250, gk), 1.5, t, { mode: 'graph', k: 0.35, rot: -0.03 });
  },
};
SC.tv_aksam2 = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    eveningTV(ctx, t, lt, { title: 'SOĞUKTA SICAK ÇORBA TARİFLERİ', tag: 'YAŞAM', clock: '21:20', map: false, ticker: 'HAFTA SONU KAYAK İÇİN İDEAL HAVA  •  KAR TATİLİ SEVİNCİ  •  ' });
  },
};

// ---------------------------------------------------------------- GRAFİK (güneş ışınımı)
SC.grafik = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    bokehRoom(ctx, t);
    const L26 = E.ln('L18');
    const k = 0.35 + 0.65 * clamp((t - L26.s) / Math.max(0.5, L26.e - L26.s));
    ctx.save(); cam(ctx, 1.0 + lt * 0.012, W / 2, 860);
    ctx.fillStyle = '#111317'; rr(ctx, 40, 420, 1000, 720, 34); ctx.fill();
    ctx.save(); rr(ctx, 64, 444, 952, 672, 20); ctx.clip();
    drawGraph(ctx, 64, 444, 952, 672, t, { k });
    ctx.restore();
    ctx.save(); rr(ctx, 760, 900, 230, 170, 16); ctx.clip();
    arasVideoLux(ctx, 760, 900, 230, 170, t, { talk: speaking(E, ['L18'], t), brow: 'endise' });
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3; rr(ctx, 760, 900, 230, 170, 16); ctx.stroke();
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- SOFRA
SC.masa = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.05 + lt * 0.01, W / 2, 1050);
    drawDinnerLux(ctx, t, { cTalk: speaking(E, ['L27'], t), cBrow: 'endise', myBrow: 'endise', tablet: { mode: 'video', brow: 'endise' } });
    ctx.restore();
    drawVignette(ctx, 0.45);
  },
};
SC.hesap = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    const L19 = E.ln('L19');
    const lines = ['Güneş: %52 ↓', 'Dün +10°  →  Bugün −1°', '!Düşüş: 11°', '!Yarın: 9°? 14°?', '!HEP AŞAĞI ↓'];
    const lens = lines.map(l => l.replace('!', '').length), tot = lens.reduce((a, b) => a + b, 0);
    const acc = i => lens.slice(0, i).reduce((a, b) => a + b, 0);
    const at = (re, f) => wordT(E, 'L19', re) ?? (L19.s + f * (L19.e - L19.s));
    const keys = [[L19.s - 0.2, 0], [at(/^bugün/i, 0.15), acc(2)], [at(/^düştü/i, 0.4), acc(3)], [at(/^dört/i, 0.75), acc(4)], [at(/^aşağı/i, 0.95), tot]];
    let ch = 0;
    for (let i = 0; i + 1 < keys.length; i++) {
      const [a, x0] = keys[i], [b, x1] = keys[i + 1];
      if (t >= a) ch = lerp(x0, x1, clamp((t - a) / Math.max(0.25, b - a)));
    }
    ctx.save(); cam(ctx, 1.0 + lt * 0.015, W / 2, 900);
    drawCalcNote(ctx, t, lines, ch / tot);
    teaGlass(ctx, 930, 1500, 1.4);
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};
SC.aras_video = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    bokehRoom(ctx, t);
    ctx.save(); cam(ctx, 1.0 + lt * 0.03, W / 2, 900);
    ctx.fillStyle = '#111317'; rr(ctx, 40, 400, 1000, 760, 34); ctx.fill();
    ctx.save(); rr(ctx, 64, 424, 952, 712, 20); ctx.clip();
    arasVideoLux(ctx, 64, 424, 952, 712, t, { talk: speaking(E, ['L20'], t), brow: 'kizgin' });
    ctx.restore();
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};
function faceClose(ctx, t, lt, who, o) {
  bokehRoom(ctx, t);
  ctx.save(); cam(ctx, 1.0 + lt * 0.03, W / 2, 1000);
  drawPerson(ctx, 540, 1900, 2.6, { who, face: o.face ?? 0, t, noLegs: true, ...o });
  ctx.restore();
  drawVignette(ctx, 0.55);
}
SC.masa2 = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    const L33 = E.ln('L22');
    if (t < L33.s - 0.1) faceClose(ctx, t, lt, 'cinar', { outfit: 'knit', coat: '#7a4a2e', face: -0.25, brow: 'endise', mouth: 'konus', talk: speaking(E, ['L21'], t), seed: 4 });
    else faceClose(ctx, t, t - L33.s, 'kahraman', { outfit: 'knit', face: 0.2, brow: 'endise', eyes: 'nokta', mouth: 'cizgi', seed: 3 });
  },
};

// ---------------------------------------------------------------- SEÇİM
SC.secim = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    const [c, x] = off('sec');
    drawDinnerLux(x, t, { cBrow: 'endise', myBrow: 'endise', tablet: { mode: 'video', brow: 'endise' } });
    ctx.filter = 'blur(10px) brightness(0.4)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
    drawChoiceE1(ctx, t, lt, E);
    drawVignette(ctx, 0.45);
  },
};
