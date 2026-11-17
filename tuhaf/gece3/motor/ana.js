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
  const G = (on, saved = true) => [
    on ? { text: 'IŞIK: AÇIK', col: '#3ddc8f', icon: 'tik' } : { text: '● IŞIK: KAPALI', col: '#ff6a5e' },
    saved ? { text: 'KURTARILAN GEMİ: 1', col: '#3ddc8f', icon: 'tik' } : { text: 'KURTARILAN GEMİ: 0', col: '#e8edf5' },
  ];
  const DAY = [{ text: 'IŞIK: KAPALI · GÜNDÜZ', col: '#e8edf5' }, { text: 'KURTARILAN GEMİ: 1', col: '#3ddc8f', icon: 'tik' }];
  if (S === 'kapi_kilitli') {
    const clock = t < E.ln('L03').s - 0.1 ? '01:30' : '01:34';
    return { a: 1, stage: 'GECE 2 / 7', filled: 2, clock, chips: G(true) };
  }
  if (S === 'el_izleri') return { a: 1, stage: 'GÜN 3', stageCol: '#e8edf5', dots: false, clock: '07:10', chips: DAY };
  if (S === 'gunduz3' || S === 'moss_telsiz') return { a: 1, stage: 'GÜN 3', stageCol: '#e8edf5', dots: false, clock: '12:00', chips: DAY };
  if (S === 'lamba') {
    const on = E.ignite2 != null && t >= E.ignite2;
    return { a: 1, stage: 'GECE 3 / 7', filled: 3, clock: '18:40', chips: G(on) };
  }
  if (S === 'uykusuz') return { a: 1, stage: 'GECE 3 / 7', filled: 3, clock: '23:50', chips: G(true) };
  if (['telsiz_acilir3', 'ses_telsiz', 'yuz_sok', 'ses_telsiz2', 'yuz_sok2'].includes(S))
    return { a: 1, stage: 'GECE 3 / 7', filled: 3, clock: '03:20', chips: G(true) };
  return null;
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
  const cut = /^(ses_telsiz|ses_telsiz2|yuz_sok|yuz_sok2|merdiven|kural2)$/.test(S.name);
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
  cozyGrade(ctx, ['el_izleri', 'gunduz3', 'moss_telsiz'].includes(S.name) ? 0.5 : 1);
  drawHUD2(ctx, t, hudState(t));
  const capY = typeof SC[S.name].cap === 'function' ? SC[S.name].cap(t, E) : SC[S.name].cap;
  drawCaption(ctx, t, CAPS, capY, {});
  // sahne başında hafif karartma (kesmelerde)
  if (cut && into < 0.12) { ctx.fillStyle = `rgba(0,0,0,${0.5 * (1 - into / 0.12)})`; ctx.fillRect(0, 0, W, H); }
  return true;
}

window.setTimeline = setTimeline;
window.renderFrame = renderFrame;
window.grab = (q = 0.92) => CANVAS.toDataURL('image/jpeg', q);
