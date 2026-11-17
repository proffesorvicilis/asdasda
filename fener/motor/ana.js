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
      const s = i === 0 ? 0 : Math.max(prev.e, L.s - 0.12);
      order.push({ name: L.sc, s });
    }
  });
  // cevap sahneleri cevap düdüğüyle başlar
  order.forEach(o => {
    const m = o.name.match(/^cevap(\d)$/);
    if (m) {
      const c = tl.cues.find(c => c.slot === 'duduk' + m[1] && c.fx.startsWith('cevap'));
      if (c) o.s = c.t - 0.04;
    }
  });
  order.forEach((o, i) => { o.e = i + 1 < order.length ? order[i + 1].s : tl.duration; o.d = o.e - o.s; });
  SCENES = order;
  CAPS = buildCaptions(tl);
  // ateşleme anı (HUD için)
  const L17 = ln('L17'); const w = tl.words.filter(x => x.line === 'L17');
  E.ignite = (w[2]?.s ?? L17.s + 1.3) - 0.15 + 0.75;
  return SCENES.map(s => `${s.name} ${s.s.toFixed(2)}-${s.e.toFixed(2)}`);
}

function sceneAt(t) {
  for (let i = SCENES.length - 1; i >= 0; i--) if (t >= SCENES[i].s) return i;
  return 0;
}

function hudState(t) {
  const tl = E.tl, ln = E.ln;
  const sec = SCENES.find(s => s.name === 'secim');
  const st = { a: 0, clock: '17:48', sis: 0, cevap: 0, cevapA: 0, flash: 0 };
  if (t < E.ignite) return st;
  st.a = clamp((t - E.ignite) / 0.5) * (1 - clamp((t - sec.s) / 0.3));
  const sis = SCENES.find(s => s.name === 'sis');
  // saat
  const toMin = (h, m) => h * 60 + m;
  const fmt = m => { m = ((Math.round(m) % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  const a = toMin(17, 48), b = toMin(25, 58);
  const k = smooth(seg(t, sis.s + 0.2, sis.e - 0.3));
  let clock = lerp(a, b, k);
  const L19 = ln('L19'), L22 = ln('L22'), L26 = ln('L26');
  if (t >= L19.s - 0.1) clock = toMin(26, 0);
  if (t >= L22.s - 0.1) clock = toMin(26, 5);
  if (t >= L26.s - 0.1) clock = toMin(26, 10);
  st.clock = fmt(clock);
  st.sis = clamp((t - (sis.s + 0.8)) / 0.4);
  const replies = tl.cues.filter(c => c.fx.startsWith('cevap')).map(c => c.t).sort((x, y) => x - y);
  st.cevap = replies.filter(r => t >= r).length;
  st.cevapA = clamp((t - (L19.s - 0.2)) / 0.3);
  const last = replies.filter(r => t >= r).pop();
  if (last != null) st.flash = Math.max(0, 1 - (t - last) / 0.6) * (st.cevap >= 3 ? 1 : 0.5);
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
  const cut = /^(cevap\d|duduk\d)$/.test(S.name);
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
  const ba = clamp(t / 0.4) * (1 - clamp((t - 11.4) / 0.6));
  if (ba > 0) {
    ctx.save(); ctx.globalAlpha = ba;
    ctx.font = '700 30px Oswald'; ctx.textBaseline = 'middle';
    const tag = 'GECE NÖBETİ', ep = 'BÖLÜM 1';
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
