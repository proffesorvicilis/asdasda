// Gece Nöbeti — zaman çizelgesi ve kare üretimi
'use strict';

const CANVAS = document.getElementById('c');
const CTX = CANVAS.getContext('2d');
let E = null;        // ortam
let SCENES = [];
let CAPS = [];
const XF = 0.22;     // geçiş süresi

function setTimeline(tl) {
  const ln = id => tl.lines.find(l => l.id === id);
  E = { tl, ln, cues: tl.cues, ignite: null };
  // sahne başlangıçları
  const order = [];
  tl.lines.forEach((L, i) => {
    if (!order.length || order[order.length - 1].name !== L.sc) {
      const prev = tl.lines[i - 1];
      const s = i === 0 ? 0 : Math.max(prev.e, L.s - (L.pre ?? 0.12));
      order.push({ name: L.sc, s });
    }
  });
  // efekt yuvalarına giren sahneler (konuşmasız ara planlar)
  const INSERT = { slot_disari: 'fener_dis', slot_kural2: 'kural2' };
  tl.cues.filter(c => INSERT[c.fx]).forEach(c => order.push({ name: INSERT[c.fx], s: c.t + 0.05 }));
  order.sort((a, b) => a.s - b.s);
  order.forEach((o, i) => { o.e = i + 1 < order.length ? order[i + 1].s : tl.duration; o.d = o.e - o.s; });
  SCENES = order;
  CAPS = buildCaptions(tl);
  return SCENES.map(s => `${s.name} ${s.s.toFixed(2)}-${s.e.toFixed(2)}`);
}

function sceneAt(t) {
  for (let i = SCENES.length - 1; i >= 0; i--) if (t >= SCENES[i].s) return i;
  return 0;
}

function wT(id, re) { const w = E.tl.words.filter(x => x.line === id).find(x => re.test(x.w)); return w ? w.s : null; }
function hudState(t) {
  const S = SCENES[sceneAt(t)].name;
  const DUN = { text: 'DÜN +10°C', col: '#e8edf5' };
  const GUN = { text: 'GÜNEŞ %52 ↓', col: '#ff6a5e' };
  const PAN = { text: 'GÜNEŞ PANELLERİ %50', col: '#ff6a5e' };
  const M = {   // saat, sıcaklık (gün içinde de düzensiz), yer, etiketler
    yatak: ['07:40', '−1°C', 'ÇANKAYA  ·  ANKARA', [DUN]],
    mutfak: ['07:50', '−1°C', 'ÇANKAYA  ·  ANKARA', [DUN]],
    mutfak2: ['07:53', '−1°C', 'ÇANKAYA  ·  ANKARA', [DUN]],
    park: ['09:00', '−2°C', 'KUĞULU PARK  ·  ANKARA', [DUN]],
    kafe: ['12:00', '−1°C', 'TUNALI  ·  ANKARA', [DUN]],
    telefon_app: ['12:00', '−1°C', 'TUNALI  ·  ANKARA', [DUN]],
    kafe2: ['12:05', '−1°C', 'TUNALI  ·  ANKARA', [DUN]],
    eczane: ['13:10', '−1°C', 'KIZILAY  ·  ANKARA', [{ text: 'ÖĞLEN BİLE ISINMADI', col: '#ff6a5e' }]],
    tel_aras: ['14:30', '−1°C', 'ANKARA  ·  KIZILCAHAMAM', [PAN]],
    ciftlik: ['14:31', '−3°C', 'KIZILCAHAMAM  ·  ÇİFTLİK', [PAN]],
    kapi: ['19:00', '−3°C', 'ÇANKAYA  ·  ANKARA', [DUN]],
    mutfak_aksam: ['19:40', '−4°C', 'ÇANKAYA  ·  ANKARA', [DUN]],
    masa: ['21:10', '−4°C', 'ÇANKAYA  ·  ANKARA', [GUN]],
  };
  const m = M[S];
  if (!m) return null;
  return { clock: m[0], temp: m[1], place: m[2], chips: m[3], stage: 'GÜN 1 / 9', filled: 1 };
}

function drawSceneInto(ctx, i, t) {
  const S = SCENES[i];
  ctx.save();
  SC[S.name].draw(ctx, t, t - S.s, S.d, E);
  ctx.restore();
}

function renderFrame(t) {
  const ctx = CTX;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const i = sceneAt(t);
  const S = SCENES[i];
  const cut = /^(tv_haber|telefon_app|haber_bandi|tel_aras|tel_cinar|grafik|aras_video|masa2|hesap)$/.test(S.name);
  const into = t - S.s;
  if (i > 0 && into < XF && !cut) {
    const [c, x] = off('prev');
    drawSceneInto(x, i - 1, t);
    ctx.drawImage(c, 0, 0);
    ctx.globalAlpha = smooth(into / XF);
    const [c2, x2] = off('cur');
    drawSceneInto(x2, i, t);
    ctx.drawImage(c2, 0, 0);
    ctx.globalAlpha = 1;
  } else {
    drawSceneInto(ctx, i, t);
  }
  const COLD = { yatak: 0.5, mutfak: 0.45, mutfak2: 0.45, park: 1, kafe: 0.55, telefon_app: 0.3, kafe2: 0.55, eczane: 1, tel_aras: 0.8, ciftlik: 0.9, tel_cinar: 0.6 };
  const WARM = { kapi: 0.8, mutfak_aksam: 1, masa: 1, hesap: 0.8, masa2: 1, aras_video: 0.6, grafik: 0.4, secim: 0.6, foto: 0.5 };
  if (COLD[S.name]) coldGrade(ctx, COLD[S.name]);
  if (WARM[S.name]) cozyGrade(ctx, WARM[S.name]);
  drawHUDE(ctx, t, hudState(t));
  const capY = typeof SC[S.name].cap === 'function' ? SC[S.name].cap(t, E) : SC[S.name].cap;
  drawCaption(ctx, t, CAPS, capY, {});
  // sahne başında hafif karartma (kesmelerde)
  if (cut && into < 0.12) { ctx.fillStyle = `rgba(0,0,0,${0.5 * (1 - into / 0.12)})`; ctx.fillRect(0, 0, W, H); }
  return true;
}

window.setTimeline = setTimeline;
window.renderFrame = renderFrame;
window.grab = (q = 0.92) => CANVAS.toDataURL('image/jpeg', q);
