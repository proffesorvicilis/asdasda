// Gece Nöbeti — üst katman: altyazı, gösterge (HUD), kartlar
'use strict';

const HL = { y: '#ffc83d', r: '#ff5148', a: '#f2a541' };
const strip = w => normWord(w).replace(/[^a-zçğıöşü0-9]/g, '');

// ---------- Altyazı parçaları
function buildCaptions(tl) {
  const out = [];
  tl.lines.forEach((L, li) => {
    const ws = tl.words.filter(w => w.line === L.id);
    const hl = {};
    Object.entries(L.hl || {}).forEach(([k, v]) => hl[strip(k)] = v);
    let cur = [];
    const flush = () => { if (cur.length) { out.push({ line: L.id, words: cur }); cur = []; } };
    ws.forEach((w, i) => {
      cur.push({ ...w, c: hl[strip(w.w)] });
      const txt = cur.map(x => x.w).join(' ');
      const punct = /[.,:?!…]$/.test(w.w) || w.w.endsWith('...');
      if (punct || cur.length >= 3 || txt.length >= 17) flush();
    });
    flush();
  });
  // tek kalan kısa kelimeyi öncekine bağla (yalnız aynı satırda)
  for (let i = out.length - 1; i > 0; i--) {
    const a = out[i - 1], b = out[i];
    const joined = a.words.concat(b.words).map(x => x.w).join(' ');
    if (a.line === b.line && b.words.length === 1 && !/[.?!:]$/.test(a.words[a.words.length - 1].w) && a.words.length < 3 && joined.length <= 24) {
      a.words = a.words.concat(b.words); out.splice(i, 1);
    }
  }
  out.forEach(c => { c.s = c.words[0].s - 0.06; });
  out.forEach((c, i) => {
    const L = tl.lines.find(x => x.id === c.line);
    const nxt = out[i + 1];
    let e = Math.min(L.e + 0.35, nxt ? nxt.s - 0.02 : L.e + 0.6);
    if (nxt && nxt.line === c.line) e = nxt.s - 0.02;
    c.e = e;
  });
  return out;
}

function drawCaption(ctx, t, caps, y, o = {}) {
  const c = caps.find(c => t >= c.s && t < c.e);
  if (!c) return;
  const k = clamp((t - c.s) / 0.09);
  const size = o.size ?? 88;
  ctx.save();
  ctx.font = `700 ${size}px Oswald`;
  ctx.textBaseline = 'middle';
  const words = c.words.map(w => ({ ...w, T: trUpper(w.w) }));
  const sp = size * 0.26;
  let widths = words.map(w => ctx.measureText(w.T).width);
  let total = widths.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  let scale = total > 960 ? 960 / total : 1;
  const sc = scale * (1 + (1 - easeOut(k)) * 0.12);
  ctx.translate(W / 2, y);
  ctx.scale(sc, sc);
  ctx.globalAlpha = k;
  let x = -total / 2;
  words.forEach((w, i) => {
    ctx.lineJoin = 'round';
    ctx.lineWidth = 15; ctx.strokeStyle = 'rgba(4,6,12,0.92)';
    ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    ctx.strokeText(w.T, x, 0);
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = w.c ? HL[w.c] : '#ffffff';
    ctx.fillText(w.T, x, 0);
    x += widths[i] + sp;
  });
  ctx.restore();
}

// ---------- Gösterge
function chip(ctx, x, y, text, col, o = {}) {
  ctx.font = `700 26px Oswald`;
  const w = ctx.measureText(text).width + 34 + (o.icon ? 26 : 0);
  ctx.fillStyle = o.fill ?? 'rgba(8,12,22,0.55)';
  rr(ctx, x, y, w, 46, 10); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = col; ctx.textBaseline = 'middle';
  let tx = x + 17;
  if (o.icon === 'tik') {
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(tx, y + 24); ctx.lineTo(tx + 7, y + 31); ctx.lineTo(tx + 19, y + 15); ctx.stroke();
    tx += 26;
  }
  ctx.fillText(text, tx, y + 24);
  return w;
}

function drawHUD(ctx, t, st) {
  if (st.a <= 0) return;
  ctx.save();
  ctx.globalAlpha = st.a;
  const x = 48, y = 58;
  // üst satır
  const blink = (Math.sin(t * 5) > -0.2) ? 1 : 0.35;
  ctx.fillStyle = `rgba(255,81,72,${blink})`; ctx.beginPath(); ctx.arc(x + 9, y + 15, 8, 0, Math.PI * 2); ctx.fill();
  ctx.font = '700 30px Oswald'; ctx.fillStyle = '#ff6a5e'; ctx.textBaseline = 'middle';
  ctx.fillText('GECE 1 / 7', x + 28, y + 15);
  // gece noktaları
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = i === 0 ? '#ff6a5e' : 'rgba(255,255,255,0.22)';
    ctx.beginPath(); ctx.arc(x + 196 + i * 20, y + 15, 6, 0, Math.PI * 2); ctx.fill();
  }
  // saat
  ctx.font = '700 104px Oswald'; ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 16;
  ctx.fillText(st.clock, x - 4, y + 96);
  ctx.shadowColor = 'transparent';
  ctx.font = '800 21px Inter'; ctx.fillStyle = 'rgba(200,210,228,0.85)';
  ctx.fillText('KUZGUN ADASI  ·  FENER', x, y + 166);
  // çipler
  let cx = x;
  cx += chip(ctx, cx, y + 196, 'FENER: AÇIK', '#3ddc8f', { icon: 'tik' }) + 12;
  if (st.sis > 0) { ctx.globalAlpha = st.a * st.sis; cx += chip(ctx, cx, y + 196, 'SİS: YOĞUN', '#9fb6d6') + 12; ctx.globalAlpha = st.a; }
  if (st.cevapA > 0) {
    ctx.globalAlpha = st.a * st.cevapA;
    const col = st.cevap >= 3 ? '#ff5148' : st.cevap === 2 ? '#ff9b3d' : st.cevap === 1 ? '#ffc83d' : '#e8edf5';
    const fill = st.flash > 0 ? `rgba(255,60,50,${0.55 * st.flash})` : undefined;
    chip(ctx, cx, y + 196, `CEVAP: ${st.cevap}/3`, col, { fill });
  }
  ctx.restore();
}

// ---------- Kural kartı (4. kural)
function drawRuleCard(ctx, t, k, text, num) {
  if (k <= 0) return;
  ctx.save();
  const y = lerp(1100, 760, easeOut(k));
  ctx.globalAlpha = clamp(k * 1.4);
  ctx.translate(W / 2, y); ctx.rotate(-0.02);
  ctx.shadowColor = 'rgba(255,60,40,0.55)'; ctx.shadowBlur = 50;
  ctx.fillStyle = '#efe4cc'; ctx.fillRect(-440, -160, 880, 320);
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#c23a2c'; ctx.lineWidth = 8; ctx.strokeRect(-440, -160, 880, 320);
  ctx.fillStyle = '#c23a2c'; ctx.font = '700 46px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`${num}. KURAL`, 0, -98);
  ctx.fillStyle = '#1f2b4d'; ctx.font = '700 58px Kalam';
  wrapText(ctx, text, 0, -10, 780, 70, 'center');
  ctx.restore();
}

function wrapText(ctx, text, x, y, maxW, lh, align = 'left') {
  const words = text.split(' ');
  const lines = []; let cur = '';
  words.forEach(w => {
    const tst = cur ? cur + ' ' + w : w;
    if (ctx.measureText(tst).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tst;
  });
  if (cur) lines.push(cur);
  ctx.textAlign = align;
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
  return lines;
}

// ---------- Seçim kartı
function drawChoice(ctx, t, k) {
  if (k <= 0) return;
  ctx.save();
  const e = easeBack(clamp(k));
  ctx.globalAlpha = clamp(k * 2);
  ctx.translate(W / 2, 780);
  ctx.scale(0.86 + 0.14 * e, 0.86 + 0.14 * e);
  const w = 960, h = 560;
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 20;
  ctx.fillStyle = 'rgba(12,18,32,0.96)'; rr(ctx, -w / 2, -h / 2, w, h, 34); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#f2b33d'; ctx.lineWidth = 4; ctx.stroke();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffc83d'; ctx.font = '700 40px Oswald';
  ctx.fillText('02:10  ·  ÜÇÜNCÜ CEVAP GELDİ.', 0, -200);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 84px Oswald';
  ctx.fillText('FENERİ', 0, -110);
  ctx.fillText('SÖNDÜRÜYOR MUSUN?', 0, -20);
  const pulse = 1 + 0.035 * Math.sin(t * 5);
  [[-220, 'SÖNDÜR', '#e0473c', '#ff6b5f'], [220, 'YANIK TUT', '#23a862', '#39d98a']].forEach(([bx, label, c1, c2], i) => {
    ctx.save(); ctx.translate(bx, 115); const p = i === 0 ? pulse : 2 - pulse; ctx.scale(p, p);
    const g = ctx.createLinearGradient(0, -55, 0, 55); g.addColorStop(0, c2); g.addColorStop(1, c1);
    ctx.fillStyle = g; rr(ctx, -190, -55, 380, 110, 22); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '700 58px Oswald'; ctx.fillText(label, 0, 4);
    ctx.restore();
  });
  ctx.fillStyle = 'rgba(200,210,228,0.8)'; ctx.font = '800 23px Inter';
  ctx.fillText('SEÇİMİNİ YORUMLARA YAZ  ·  ÇOĞUNLUK 2. GECEYİ BELİRLER', 0, 225);
  ctx.restore();
}

// ---------- Film tanesi ve vinyet
function drawGrain(ctx, t, a = 0.06) {
  const R = mulberry32(Math.floor(t * 30) + 1);
  ctx.fillStyle = `rgba(255,255,255,${a})`;
  for (let i = 0; i < 900; i++) ctx.fillRect(R() * W, R() * H, 2, 2);
  ctx.fillStyle = `rgba(0,0,0,${a * 1.4})`;
  for (let i = 0; i < 900; i++) ctx.fillRect(R() * W, R() * H, 2, 2);
}
function drawVignette(ctx, a = 0.55) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
