// Miami · Bölüm 2 — üst katman: konuşmacı renkli altyazı, açılış göstergesi, seçim ekranı
'use strict';

const CAPCOL = { ALEX: '#f7d84a', SAM: '#ffffff', PILOT: '#c3a0ff', TEKNE: '#ffffff', mint: '#a6f5c8', mor: '#c3a0ff' };

function buildCaps(tl) {
  const out = [];
  tl.lines.forEach(L => {
    if (L.nocap) return;
    const ws = tl.words.filter(w => w.line === L.id);
    const base = CAPCOL[L.col] || CAPCOL[L.v] || '#ffffff';
    const n = ws.length, parts = n <= 3 ? 1 : Math.ceil(n / 3);
    let i = 0;
    for (let p = 0; p < parts; p++) {
      const take = Math.ceil((n - i) / (parts - p));
      out.push({ line: L.id, v: L.v, col: base, words: ws.slice(i, i + take).map(w => ({ ...w })) });
      i += take;
    }
  });
  out.forEach(c => { c.s = c.words[0].s - 0.06; });
  out.forEach((c, i) => {
    const L = E.ln(c.line), nxt = out[i + 1];
    let e = Math.min(L.e + 0.3, nxt ? nxt.s - 0.02 : L.e + 0.6);
    if (nxt && nxt.line === c.line) e = nxt.s - 0.02;
    c.e = Math.max(e, c.s + 0.4);
  });
  return out;
}

function drawCapM(ctx, t, caps, y, o = {}) {
  const c = caps.find(c => t >= c.s && t < c.e);
  if (!c) return;
  const k = clamp((t - c.s) / 0.07), size = o.size ?? 76;
  ctx.save();
  ctx.font = `800 ${size}px Inter`; ctx.textBaseline = 'middle';
  const sp = size * 0.3, widths = c.words.map(w => ctx.measureText(w.w).width);
  const total = widths.reduce((a, b) => a + b, 0) + sp * (c.words.length - 1);
  const scale = Math.min(1, 800 / total) * (1 + (1 - easeOut(k)) * 0.12);
  let ai = 0; c.words.forEach((w, i) => { if (t >= w.s - 0.04) ai = i; });
  ctx.translate(o.x ?? 520, y); ctx.scale(scale, scale); ctx.globalAlpha = k;
  let x = -total / 2;
  c.words.forEach((w, i) => {
    const act = i === ai;
    const pop = act ? 1 + 0.08 * (1 - clamp((t - w.s) / 0.14)) : 1;
    ctx.save(); ctx.translate(x + widths[i] / 2, 0); ctx.scale(pop, pop);
    ctx.lineJoin = 'round'; ctx.lineWidth = 17; ctx.strokeStyle = 'rgba(8,10,16,0.95)';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6;
    ctx.strokeText(w.w, -widths[i] / 2, 0); ctx.shadowColor = 'transparent';
    ctx.fillStyle = act ? mix(c.col, '#ffffff', 0.55) : mix(c.col, '#10131a', 0.1);
    ctx.fillText(w.w, -widths[i] / 2, 0);
    ctx.restore();
    x += widths[i] + sp;
  });
  ctx.restore();
}

// Açılış: yer-saat yazısı ve "SEN SEÇTİN KAPAĞI" etiketi (ilk 2,6 sn)
function drawHUDM(ctx, t) {
  const a = 1 - smooth(clamp((t - 2.45) / 0.35));
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.lineJoin = 'round';
  const txt = (s, x, y, font, fill) => { ctx.font = font; ctx.lineWidth = 10; ctx.strokeStyle = 'rgba(8,10,16,0.85)'; ctx.strokeText(s, x, y); ctx.fillStyle = fill; ctx.fillText(s, x, y); };
  txt('MARLIN PLAJI  ·  18:42', 56, 292, '800 46px Inter', '#ffffff');
  txt('Miami  ·  Bölüm 2', 58, 342, '800 30px Inter', '#f2c63c');
  // etiket
  const k = easeBack(clamp(t / 0.4)); ctx.translate(540, 470); ctx.scale(k, k);
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
  rr(ctx, -270, -62, 540, 124, 24); ctx.fillStyle = '#d8283a'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = 5; ctx.strokeStyle = '#7d1220'; ctx.stroke();
  ctx.textAlign = 'center';
  ctx.font = '800 26px Inter'; ctx.fillStyle = '#ffd6d9'; ctx.fillText('SEN SEÇTİN', 20, -30);
  ctx.font = '800 66px Inter'; ctx.fillStyle = '#ffffff'; ctx.fillText('KAPAĞI', 20, 22);
  // kapak simgesi
  ctx.translate(-205, 4); ctx.beginPath(); ctx.moveTo(-34, 4); ctx.lineTo(-24, -20); ctx.lineTo(24, -20); ctx.lineTo(34, 4); ctx.lineTo(34, 18); ctx.lineTo(-34, 18); ctx.closePath();
  ctx.fillStyle = '#c9ccd2'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#444'; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, -8, 12, 7, 0, 0, Math.PI * 2); ctx.fillStyle = '#6b7380'; ctx.fill();
  ctx.restore();
}

// Seçim ekranı (son sahne): koyu örtü + iki seçenek
function iconBoat(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(34, 0); ctx.lineTo(24, 18); ctx.lineTo(-24, 18); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f4a3a8'; ctx.fillRect(-20, -16, 30, 16); ctx.fillStyle = '#ffffff'; ctx.fillRect(-8, -28, 12, 12);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-38, 30); ctx.quadraticCurveTo(-26, 22, -14, 30); ctx.quadraticCurveTo(-2, 38, 10, 30); ctx.quadraticCurveTo(22, 22, 36, 30); ctx.stroke();
  ctx.restore();
}
function iconHeli(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-40, -22); ctx.lineTo(40, -22); ctx.moveTo(0, -22); ctx.lineTo(0, -12); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(-4, 2, 24, 15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(18, -2, 28, 6); ctx.fillRect(-26, 22, 44, 5);
  ctx.restore();
}
function drawChoiceM(ctx, t, lt) {
  const a = smooth(clamp(lt / 0.4));
  ctx.save(); ctx.globalAlpha = a * 0.82; ctx.fillStyle = '#13161c'; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const pop = (d, f) => { const k = clamp((lt - d) / 0.32); if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 2); const e = easeBack(k); f(e); ctx.restore(); };
  pop(0.15, e => { ctx.font = '800 36px Inter'; ctx.fillStyle = '#f2c14e'; ctx.fillText('BÖLÜM 3  ·  SEN KARAR VER', 520, 520 + (1 - e) * 20); });
  pop(0.3, e => {
    ctx.save(); ctx.translate(520, 700); ctx.scale(e, e);
    ctx.font = '800 104px Inter'; ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.strokeText('SEN NE', 0, -62); ctx.strokeText('YAPARDIN?', 0, 62); ctx.fillStyle = '#ffffff'; ctx.fillText('SEN NE', 0, -62); ctx.fillText('YAPARDIN?', 0, 62);
    ctx.restore();
  });
  const btn = (cx, cy, label, col, dark, icon, d) => pop(d, e => {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(e, e);
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12;
    rr(ctx, -390, -80, 780, 160, 22); ctx.fillStyle = col; ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.lineWidth = 5; ctx.strokeStyle = dark; ctx.stroke();
    icon(ctx, -300, 0, 1.15);
    ctx.textAlign = 'left'; ctx.font = '800 62px Inter'; ctx.fillStyle = '#ffffff'; ctx.fillText(label, -230, 4);
    ctx.restore();
  });
  const pulse = 1 + 0.015 * Math.sin(t * 5);
  ctx.save(); ctx.translate(0, 0);
  btn(520, 1000, 'TEKNE', '#2f7fd6', '#1c4f8f', iconBoat, 0.55);
  pop(0.75, e => { ctx.font = '800 48px Inter'; ctx.fillStyle = '#f2c14e'; ctx.fillText('VEYA', 520, 1140); });
  btn(520, 1280, 'HELİKOPTER', '#d6242f', '#8c131b', iconHeli, 0.95);
  ctx.restore();
  pop(1.35, e => { ctx.font = '800 44px Inter'; ctx.fillStyle = '#ffffff'; ctx.fillText('Aşağıya yorum yaz ↓', 520, 1420 + Math.sin(t * 6) * 6); });
  ctx.restore();
}
