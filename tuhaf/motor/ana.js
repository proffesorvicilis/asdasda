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
  // telsiz sahnesi cızırtıyla başlar
  order.forEach(o => {
    if (o.name === 'telsiz') {
      const c = tl.cues.find(c => c.fx === 'telsiz_cizirti');
      if (c) o.s = c.t - 0.04;
    }
  });
  order.forEach((o, i) => { o.e = i + 1 < order.length ? order[i + 1].s : tl.duration; o.d = o.e - o.s; });
  SCENES = order;
  CAPS = buildCaptions(tl);
  // ışığın yandığı an (HUD için)
  E.ignite = ln('L16').s - 0.3;
  return SCENES.map(s => `${s.name} ${s.s.toFixed(2)}-${s.e.toFixed(2)}`);
}

function sceneAt(t) {
  for (let i = SCENES.length - 1; i >= 0; i--) if (t >= SCENES[i].s) return i;
  return 0;
}

function hudState(t) {
  const ln = E.ln;
  const sec = SCENES.find(s => s.name === 'secim');
  const st = { a: 0, clock: '18:42', gemi: 0 };
  if (t < E.ignite) return st;
  st.a = clamp((t - E.ignite) / 0.4) * (1 - clamp((t - sec.s) / 0.3));
  st.gemi = clamp((t - ln('L17').s + 0.3) / 0.4);
  const w3 = E.tl.words.filter(w => w.line === 'L18').find(w => /üç/.test(w.w));
  const saat = SCENES.find(s => s.name === 'saat');
  if (t >= saat.s) st.clock = '02:59';
  if (w3 && t >= w3.s) st.clock = '03:00';
  if (t >= ln('L24').s - 0.2) st.clock = '03:01';
  return st;
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
  const cut = /^(saat|telsiz)$/.test(S.name);
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
  drawHUD(ctx, t, hudState(t));
  // açılış etiketi
  const ba = clamp(t / 0.4) * (1 - clamp((t - 8.4) / 0.6));
  if (ba > 0) {
    ctx.save(); ctx.globalAlpha = ba;
    ctx.font = '700 30px Oswald'; ctx.textBaseline = 'middle';
    const tag = 'TUHAF SAAT HİKÂYELERİ', ep = 'GECE 1';
    const w1 = ctx.measureText(tag).width, w2 = ctx.measureText(ep).width;
    ctx.fillStyle = 'rgba(8,12,22,0.6)'; rr(ctx, 44, 52, w1 + w2 + 74, 54, 12); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.fillText(tag, 64, 80);
    ctx.fillStyle = '#ffc83d'; rr(ctx, 64 + w1 + 14, 62, w2 + 22, 36, 8); ctx.fill();
    ctx.fillStyle = '#121212'; ctx.fillText(ep, 64 + w1 + 25, 81);
    ctx.restore();
  }
  const capY = typeof SC[S.name].cap === 'function' ? SC[S.name].cap(t, E) : SC[S.name].cap;
  drawCaption(ctx, t, CAPS, capY, {});
  // sahne başında hafif karartma (kesmelerde)
  if (cut && into < 0.12) { ctx.fillStyle = `rgba(0,0,0,${0.5 * (1 - into / 0.12)})`; ctx.fillRect(0, 0, W, H); }
  return true;
}

window.setTimeline = setTimeline;
window.renderFrame = renderFrame;
window.grab = (q = 0.92) => CANVAS.toDataURL('image/jpeg', q);
