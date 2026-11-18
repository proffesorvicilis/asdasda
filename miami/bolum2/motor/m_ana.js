// Miami · Bölüm 2 — zaman çizelgesi ve kare üretimi (sahne → balık gözü → altyazı)
'use strict';

const CANVAS = document.getElementById('c');
const CTX = CANVAS.getContext('2d');
let E = null;
let SCENES = [];
let CAPS = [];
let OV = null;   // balık gözünün dışında kalan üst katman (birinci şahıs kollar)

// Orijinal videonun kesim noktaları (saniye) — ses bu saniyelere sabitlenmiştir.
const PLAN = [
  [0.00, 'plaj'], [2.78, 'kapak_cek'], [4.25, 'kapak_yakin'], [7.00, 'alex_ayakta'], [8.50, 'tavan1'],
  [12.00, 'su_duvar'], [14.35, 'tavan2'], [15.80, 'iluminator'], [17.45, 'itme'],
  [19.40, 'alt1'], [22.00, 'alt2'], [24.00, 'alt3'],
  [26.80, 'yuzey'], [28.80, 'sal_alex'], [30.00, 'ufuk'], [31.30, 'sal_heli'], [33.00, 'heli_ust'],
  [34.45, 'heli_alex'], [35.95, 'tekne'], [37.50, 'heli_ikili'], [39.10, 'heli_git'], [41.30, 'secim'],
];

function setTimeline(tl) {
  const ln = id => tl.lines.find(l => l.id === id);
  E = { tl, ln };
  SCENES = PLAN.map(([s, name], i) => ({ name, s, e: i + 1 < PLAN.length ? PLAN[i + 1][0] : tl.duration }));
  SCENES.forEach(o => { o.d = o.e - o.s; });
  CAPS = buildCaps(tl);
  return SCENES.map(s => `${s.name} ${s.s.toFixed(2)}-${s.e.toFixed(2)}`);
}

function sceneAt(t) {
  for (let i = SCENES.length - 1; i >= 0; i--) if (t >= SCENES[i].s) return i;
  return 0;
}
function wordT(id, re, which = 's') {
  const w = E.tl.words.filter(x => x.line === id).find(x => re.test(x.w));
  return w ? w[which] : null;
}

// Kısa beyaz parlamalar (kapak çarpması, dalga vuruşu)
const FLASHES = [[3.98, 0.12, 0.55], [4.9, 0.18, 0.4]];

function renderFrame(t) {
  const ctx = CTX;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  const i = sceneAt(t), S = SCENES[i], lt = t - S.s;
  const [src, sx] = off('scn');
  const [ovc, ov] = off('ovl'); OV = ov;
  const p = SC[S.name].draw(sx, t, lt, S.d, E) || {};
  if (p.flat) ctx.drawImage(src, 0, 0);
  else {
    const sh = p.shake ?? 0.004;
    ctx.drawImage(FE.render(src, {
      k: p.k ?? 0.5, zoom: (p.zoom ?? 1) * 1.03, vig: p.vig ?? 0.3,
      rot: (p.rot ?? 0) + noise1(t * 1.3, 5) * (p.roll ?? 0.006),
      ox: (p.ox ?? 0) + noise1(t * 3.1, 3) * sh, oy: (p.oy ?? 0) + noise1(t * 2.7, 9) * sh,
    }), 0, 0);
  }
  ctx.drawImage(ovc, 0, 0);
  FLASHES.forEach(([ft, fd, fa]) => { if (t >= ft && t < ft + fd) { ctx.fillStyle = `rgba(255,255,255,${fa * (1 - (t - ft) / fd)})`; ctx.fillRect(0, 0, W, H); } });
  if (S.name === 'secim') drawChoiceM(ctx, t, lt);
  drawHUDM(ctx, t);
  drawCapM(ctx, t, CAPS, 1380);
  return true;
}

window.setTimeline = setTimeline;
window.renderFrame = renderFrame;
window.grab = (q = 0.92) => CANVAS.toDataURL('image/jpeg', q);
