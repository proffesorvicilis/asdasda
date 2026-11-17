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
  // merdiven sahnesi: günlükten sonraki efekt yuvasında
  const ms = tl.cues.find(c => c.fx === 'slot_merdiven');
  if (ms) {
    const i = order.findIndex(o => o.name === 'lamba');
    order.splice(i, 0, { name: 'merdiven', s: ms.t + 0.05 });
  }
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
  const G = (on, saved, a = 1) => [
    on ? { text: 'IŞIK: AÇIK', col: '#3ddc8f', icon: 'tik' } : { text: '● IŞIK: KAPALI', col: '#ff6a5e' },
    saved ? { text: 'KURTARILAN GEMİ: 1', col: '#3ddc8f', icon: 'tik' } : { text: 'KURTARILAN GEMİ: 0', col: '#e8edf5' },
  ];
  const night1 = ['masa_sessiz', 'telsiz_acilir', 'masa_sessiz2', 'gemi'];
  const day = ['gunduz', 'moss_telsiz'];
  const night2 = ['lamba', 'yatak', 'kapi_ic', 'kapi_bekci'];
  if (night1.includes(S)) {
    const saved = (wT('L05', /Sağ/) ?? 1e9) <= t;
    const clock = S === 'masa_sessiz' ? '03:01' : S === 'gemi' ? '04:10' : '03:05';
    return { a: 1, stage: 'GECE 1 / 7', filled: 1, clock, chips: G(true, saved) };
  }
  if (day.includes(S)) {
    return { a: 1, stage: 'GÜN 2', stageCol: '#e8edf5', dots: false, clock: '12:00', chips: [{ text: 'IŞIK: KAPALI · GÜNDÜZ', col: '#e8edf5' }, { text: 'KURTARILAN GEMİ: 1', col: '#3ddc8f', icon: 'tik' }] };
  }
  if (night2.includes(S)) {
    const on = S !== 'lamba' || (E.ignite2 != null && t >= E.ignite2);
    return { a: 1, stage: 'GECE 2 / 7', filled: 2, clock: S === 'lamba' ? '18:41' : '01:30', chips: G(on, true) };
  }
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
  const cut = /^(telsiz_acilir|kapi_ic|merdiven)$/.test(S.name);
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
  cozyGrade(ctx, S.name === 'gunduz' || S.name === 'moss_telsiz' ? 0.5 : 1);
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
