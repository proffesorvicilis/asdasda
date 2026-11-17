// Eksi Seksen · Gün 1 — sahneler
'use strict';

function cam(ctx, z, cx = W / 2, cy = H / 2) { ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); }
function sway(t, a = 5) { return [noise1(t * 0.6, 1) * a, noise1(t * 0.5, 7) * a]; }
function lineWords(E, id) { return E.tl.words.filter(w => w.line === id); }
function wordT(E, id, re, which = 's') { const w = lineWords(E, id).find(w => re.test(w.w)); return w ? w[which] : null; }
function speaking(E, ids, t) {
  const on = E.tl.words.some(w => ids.includes(w.line) && t >= w.s && t <= w.e + 0.05);
  return on ? 0.55 + 0.45 * Math.abs(Math.sin(t * 23) * Math.sin(t * 7.1)) : 0;
}
function lineProg(E, id, t) { const L = E.ln(id); return clamp((t - L.s) / Math.max(0.2, L.e - L.s)); }

const SC = {};

// ---------------------------------------------------------------- 07.40 YATAK ODASI
SC.yatak = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    const L02 = E.ln('L02');
    const awake = t > E.ln('L01').s + 1.2;
    ctx.save();
    cam(ctx, 1.0 + lt * 0.012, 560, 1000);
    drawBedroom2(ctx, t, { alarm: t < E.ln('L01').e + 0.3, frost: 0.6 + 0.4 * clamp(lt / 4), brow: awake ? 'endise' : 'notr', eyes: awake ? 'nokta' : 'nokta' });
    ctx.restore();
    // alarm ekranı (ilk saniyeler)
    const ak = clamp(1 - (t - (E.ln('L01').e - 0.4)) / 0.4);
    if (ak > 0) drawPhone(ctx, 540, lerp(2300, 1030, smooth(clamp(lt / 0.35))) , 1.2, { mode: 'alarm', t, rot: -0.03 });
    // hava durumu (telefon)
    const tp = wordT(E, 'L02', /Telefon/) ?? L02.s + 1.5;
    const pk = smooth(clamp((t - tp + 0.35) / 0.45));
    if (pk > 0 && ak <= 0) drawPhone(ctx, 540, lerp(2400, 1030, pk), 1.25, { mode: 'hava', temp: '0°', sub: 'Dün: +10°  ·  Güneşli', rot: 0.02 });
    drawVignette(ctx, 0.4);
  },
};

// ---------------------------------------------------------------- 07.50 MUTFAK + TV
SC.mutfak = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    const on = (wordT(E, 'L03', /açtın/) ?? E.ln('L03').e - 0.5) + 0.2;
    ctx.save(); cam(ctx, 1.02 + lt * 0.01, W / 2, 980);
    drawKitchen(ctx, t, {
      steam: true, tv: t > on ? { title: 'SOĞUK HAVA DALGASI', tag: 'GÜNDEM', clock: '07:52' } : null,
      people: [{ who: 'kahraman', x: 860, y: 1500, face: -1, brow: 'notr', arm: 'tut', hand: [770, 1150], seed: 3 }],
      mug: [770, 1150],
    });
    if (t <= on) { ctx.fillStyle = '#0b0c10'; rr(ctx, 46, 586, 588, 358, 12); ctx.fill(); }
    ctx.restore();
    drawVignette(ctx, 0.4);
  },
};
SC.tv_haber = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    ctx.fillStyle = '#14161c'; ctx.fillRect(0, 0, W, H);
    ctx.save(); cam(ctx, 1.0 + lt * 0.015, W / 2, 800);
    ctx.fillStyle = '#050608'; rr(ctx, 20, 440, 1040, 680, 18); ctx.fill();
    drawNews(ctx, 40, 460, 1000, 640, t, { title: 'SOĞUK HAVA DALGASI', tag: 'GÜNDEM', clock: '07:52', talk: speaking(E, ['L04'], t) });
    ctx.restore();
    ctx.fillStyle = 'rgba(80,140,255,0.05)'; ctx.fillRect(0, 0, W, H);
    drawVignette(ctx, 0.5);
  },
};
SC.mutfak2 = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.12 + lt * 0.012, 720, 1000);
    drawKitchen(ctx, t, {
      steam: true, tv: { title: 'SOĞUK HAVA DALGASI', tag: 'GÜNDEM', clock: '07:53' },
      people: [{ who: 'kahraman', x: 820, y: 1500, face: 1, brow: 'notr', mouth: 'yukari', arm: 'tut', hand: [890, 1150], seed: 3 }],
      mug: [890, 1150],
    });
    ctx.restore();
    drawVignette(ctx, 0.4);
  },
};

// ---------------------------------------------------------------- 09.00 PARK
SC.park = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    const L07 = E.ln('L07');
    const zk = smooth(clamp((t - L07.s) / 2.2));
    ctx.save();
    cam(ctx, lerp(1.0, 1.9, zk), lerp(540, 780, zk), lerp(960, 470, zk));
    drawPark(ctx, t, {});
    ctx.restore();
    drawVignette(ctx, 0.35);
  },
};

// ---------------------------------------------------------------- 12.00 KAFE
SC.kafe = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.02 + lt * 0.01, W / 2, 1000);
    drawCafe(ctx, t, {});
    ctx.restore();
    drawVignette(ctx, 0.4);
  },
};
SC.telefon_app = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    const [c, x] = off('kafebg');
    drawCafe(x, t, {});
    ctx.filter = 'blur(12px) brightness(0.55)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
    const L09 = E.ln('L09');
    const ws = lineWords(E, 'L09');
    const ei = ws.findIndex(w => /^eksi$/i.test(w.w));
    const tk = ei >= 0 ? ws[ei].s : L09.s + 3;
    // satırlar: bugün hep açık, sonra eksi on / yirmi / otuz kelimeleriyle tek tek
    const marks = ws.filter(w => /^(on|yirmi|otuz)\.?$/i.test(w.w)).map(w => w.s);
    let k = 0.25;
    marks.forEach((m, i) => { if (t >= m - 0.1) k = (i + 2) / 4; });
    if (t < tk - 0.2) k = 0.25;
    const pk = smooth(clamp(lt / 0.45));
    drawPhone(ctx, 540, lerp(2300, 980, pk), 1.45, { mode: 'tahmin', temp: '0°', sub: 'Ankara · Güneşli', k, rot: -0.02 });
    drawVignette(ctx, 0.35);
  },
};
SC.kafe2 = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.15 + lt * 0.012, 620, 1150);
    drawCafe(ctx, t, { laugh: true, brow: 'endise' });
    ctx.restore();
    drawVignette(ctx, 0.4);
  },
};

// ---------------------------------------------------------------- 13.00 ECZANE TABELASI
SC.eczane = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.0 + lt * 0.02, W / 2, 900);
    drawPharmacy(ctx, t, { lt });
    ctx.restore();
    drawVignette(ctx, 0.35);
  },
};

// ---------------------------------------------------------------- 13.05 HABER BANDI + KÜRE
SC.haber_bandi = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    const L13 = E.ln('L13');
    if (t < L13.s - 0.1) {
      ctx.fillStyle = '#14161c'; ctx.fillRect(0, 0, W, H);
      ctx.save(); cam(ctx, 1.25 + lt * 0.03, 560, 1020);
      ctx.fillStyle = '#050608'; rr(ctx, 20, 440, 1040, 680, 18); ctx.fill();
      drawNews(ctx, 40, 460, 1000, 640, t, {
        title: 'SOĞUK HAVA DALGASI', tag: 'GÜNDEM', clock: '13:05', speed: 150,
        ticker: "AVRUPA'DA, ASYA'DA VE AMERİKA'DA AYNI ANDA ANİ SOĞUMA  •  BİLİM İNSANLARI NEDENİNİ ARAŞTIRIYOR  •  ",
      });
      ctx.restore();
    } else {
      const k = clamp((t - L13.s) / 2.2);
      ctx.save(); cam(ctx, 1.0 + (t - L13.s) * 0.02, W / 2, 900);
      drawGlobeCold(ctx, t, k);
      ctx.restore();
    }
    drawVignette(ctx, 0.45);
  },
};

// ---------------------------------------------------------------- 14.30 ARAS'LA TELEFON
SC.tel_aras = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    const L15 = E.ln('L15');
    drawSplitCall(ctx, t, { who: 'aras', talk: speaking(E, ['L15', 'L16'], t), callT: t - L15.s + 1, myBrow: 'endise' });
    if (t < L15.s - 0.1) {   // çalıyor
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 960, W, 960);
      drawPhone(ctx, 540, 1430, 0.95, { mode: 'arama', name: 'Aras', status: 'aranıyor...', col: '#4fd1c5' });
    }
    drawVignette(ctx, 0.35);
  },
};

// ---------------------------------------------------------------- ÇİFTLİK + FOTOĞRAF
SC.ciftlik = {
  cap: 1300,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.08 - lt * 0.012, 560 + lt * 8, 1150);
    drawFarm(ctx, t, {});
    ctx.restore();
    drawVignette(ctx, 0.35);
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
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    const L21 = E.ln('L21');
    drawSplitCall(ctx, t, { who: 'cinar', talk: speaking(E, ['L21'], t), callT: t - L21.s + 1, myBrow: 'endise' });
    if (t < L21.s - 0.1) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 960, W, 960);
      drawPhone(ctx, 540, 1430, 0.95, { mode: 'arama', name: 'Çınar', status: 'aranıyor...', col: '#ffa94d' });
    }
    drawVignette(ctx, 0.35);
  },
};

// ---------------------------------------------------------------- 19.00 KAPI
SC.kapi = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.0 + lt * 0.012, W / 2, 1050);
    drawDoorway(ctx, t, { talk: speaking(E, ['L24'], t) });
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};

// ---------------------------------------------------------------- 19.40 MUTFAK (AKŞAM)
SC.mutfak_aksam = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.save(); cam(ctx, 1.04 + lt * 0.01, W / 2, 1000);
    drawKitchen(ctx, t, {
      night: 1, pot: true, cooker: true,
      people: [
        { who: 'cinar', x: 460, y: 1520, face: 1, arm: 'tut', hand: [470, 1110], brow: 'notr', mouth: 'yukari', seed: 5 },
        { who: 'kahraman', x: 880, y: 1520, face: -1, brow: 'notr', seed: 3 },
      ],
      tablet: { x: 780, y: 1120, s: 0.75, mode: 'video', rot: -0.06 },
    });
    ctx.restore();
    drawVignette(ctx, 0.45);
  },
};

// ---------------------------------------------------------------- 21.00 AKŞAM HABERLERİ
function eveningTV(ctx, t, lt, o) {
  ctx.fillStyle = '#0e0d10'; ctx.fillRect(0, 0, W, H);
  ctx.save(); cam(ctx, 1.0 + lt * 0.015, W / 2, 820);
  ctx.fillStyle = '#050608'; rr(ctx, 20, 440, 1040, 680, 18); ctx.fill();
  drawNews(ctx, 40, 460, 1000, 640, t, o);
  ctx.restore();
  ctx.fillStyle = 'rgba(60,110,220,0.07)'; ctx.fillRect(0, 0, W, H);
  // ön planda kanepe siluetleri
  ctx.fillStyle = '#111014'; rr(ctx, -40, 1380, 1160, 600, 60); ctx.fill();
  drawVignette(ctx, 0.55);
}
SC.tv_aksam = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    eveningTV(ctx, t, lt, { title: 'SOĞUK HAVA DALGASI SÜRÜYOR', tag: 'ANA HABER', clock: '21:00', ticker: 'KAYAK MERKEZLERİNDE YOĞUNLUK  •  METEOROLOJİ: SOĞUK HAVA BİR HAFTA SÜREBİLİR  •  ' });
    const gk = smooth(clamp((t - ((wordT(E, 'L26', /grafiği/) ?? E.ln('L26').e - 1.2) - 0.2)) / 0.4));
    if (gk > 0) drawTablet(ctx, 540, lerp(2300, 1250, gk), 1.5, t, { mode: 'graph', k: 0.35, rot: -0.03 });
  },
};
SC.tv_aksam2 = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    eveningTV(ctx, t, lt, { title: 'SOĞUKTA SICAK ÇORBA TARİFLERİ', tag: 'YAŞAM', clock: '21:20', ticker: 'HAFTA SONU KAYAK İÇİN İDEAL HAVA  •  KAR TATİLİ SEVİNCİ  •  ' });
  },
};

// ---------------------------------------------------------------- GRAFİK (güneş ışınımı)
SC.grafik = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.fillStyle = '#121014'; ctx.fillRect(0, 0, W, H);
    warmGlow(ctx, 540, 900, 900, 0.25, '255,170,100');
    const L27 = E.ln('L27'), L28 = E.ln('L28');
    const k = 0.35 + 0.65 * clamp((t - L27.s) / Math.max(0.5, L28.e - L27.s));
    ctx.save(); cam(ctx, 1.0 + lt * 0.012, W / 2, 860);
    ctx.fillStyle = '#111317'; rr(ctx, 40, 420, 1000, 720, 34); ctx.fill();
    ctx.save(); rr(ctx, 64, 444, 952, 672, 20); ctx.clip();
    drawGraph(ctx, 64, 444, 952, 672, t, { k });
    ctx.restore();
    // köşede Aras'ın küçük görüntüsü
    ctx.save(); rr(ctx, 760, 900, 230, 170, 16); ctx.clip();
    arasVideo(ctx, 760, 900, 230, 170, t, { talk: speaking(E, ['L27', 'L28'], t), brow: 'endise' });
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
    drawTable(ctx, t, { cTalk: speaking(E, ['L29'], t), cBrow: 'endise', myBrow: 'endise', tablet: { mode: 'video', brow: 'endise' } });
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};
SC.hesap = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    const L30 = E.ln('L30'), L31 = E.ln('L31');
    const lines = ['Güneş: %52 ↓', 'Dün: +10°   Bugün: 0°', '!Yarın: −10°', '!Sonraki gün: −20° ?'];
    const lens = lines.map(l => l.replace('!', '').length), tot = lens.reduce((a, b) => a + b, 0);
    const c2 = lens[0] + lens[1];
    let ch = 0;
    [[L30.s, L30.e, 0, c2], [L31.s, L31.e, c2, tot]].forEach(([a, b, x0, x1]) => { if (t >= a) ch = lerp(x0, x1, clamp((t - a) / Math.max(0.3, b - a))); });
    ctx.save(); cam(ctx, 1.0 + lt * 0.015, W / 2, 900);
    drawCalcNote(ctx, t, lines, ch / tot);
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};
SC.aras_video = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    ctx.fillStyle = '#0d0c0f'; ctx.fillRect(0, 0, W, H);
    ctx.save(); cam(ctx, 1.0 + lt * 0.03, W / 2, 900);
    ctx.fillStyle = '#111317'; rr(ctx, 40, 400, 1000, 760, 34); ctx.fill();
    ctx.save(); rr(ctx, 64, 424, 952, 712, 20); ctx.clip();
    arasVideo(ctx, 64, 424, 952, 712, t, { talk: speaking(E, ['L32'], t), brow: 'kizgin' });
    ctx.restore();
    ctx.restore();
    drawVignette(ctx, 0.5);
  },
};
function faceClose(ctx, t, lt, who, o) {
  ctx.fillStyle = '#2e2622'; ctx.fillRect(0, 0, W, H);
  warmGlow(ctx, 540, 500, 900, 0.45, '255,190,110');
  ctx.save(); cam(ctx, 1.0 + lt * 0.03, W / 2, 1000);
  drawPerson(ctx, 540, 1900, 2.6, { who, face: o.face ?? 0, t, noLegs: true, ...o });
  ctx.restore();
  drawVignette(ctx, 0.55);
}
SC.masa2 = {
  cap: 1500,
  draw(ctx, t, lt, d, E) {
    const L35 = E.ln('L35');
    if (t < L35.s - 0.1) faceClose(ctx, t, lt, 'cinar', { face: -0.25, brow: 'endise', mouth: 'konus', talk: speaking(E, ['L34'], t), seed: 4 });
    else faceClose(ctx, t, t - L35.s, 'kahraman', { face: 0.2, brow: 'endise', eyes: 'nokta', mouth: 'cizgi', seed: 3 });
  },
};

// ---------------------------------------------------------------- SEÇİM
SC.secim = {
  cap: 1440,
  draw(ctx, t, lt, d, E) {
    const [c, x] = off('sec');
    drawTable(x, t, { cBrow: 'endise', myBrow: 'endise', tablet: { mode: 'video', brow: 'endise' } });
    ctx.filter = 'blur(10px) brightness(0.4)'; ctx.drawImage(c, 0, 0); ctx.filter = 'none';
    drawChoiceE1(ctx, t, lt);
    drawVignette(ctx, 0.45);
  },
};
