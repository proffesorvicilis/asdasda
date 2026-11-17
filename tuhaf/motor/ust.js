// Gece Nöbeti — üst katman: altyazı, gösterge (HUD), kartlar
'use strict';

const HL = { y: '#ffc83d', r: '#ff5148', a: '#f2a541', o: '#ffa94d' };
const strip = w => normWord(w).replace(/[^a-zçğıöşü0-9]/g, '');

// ---------- Altyazı parçaları
function buildCaptions(tl) {
  const out = [];
  tl.lines.forEach((L, li) => {
    const ws = tl.words.filter(w => w.line === L.id);
    const hl = {};
    Object.entries(L.hl || {}).forEach(([k, v]) => hl[strip(k)] = v);
    let cur = [];
    const flush = () => { if (cur.length) { out.push({ line: L.id, etiket: L.etiket, words: cur }); cur = []; } };
    ws.forEach((w, i) => {
      cur.push({ ...w, c: hl[strip(w.w)] || L.col });
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
  if (c.etiket) {
    ctx.save(); ctx.globalAlpha = 1;
    ctx.font = '700 34px Oswald'; ctx.textAlign = 'center';
    const ec = c.etiket.startsWith('MOSS') ? '#3ddc8f' : '#ffa94d';
    ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(4,6,12,0.9)'; ctx.lineJoin = 'round';
    ctx.strokeText(c.etiket, 0, -size * 0.82); ctx.fillStyle = ec; ctx.fillText(c.etiket, 0, -size * 0.82);
    ctx.restore();
    ctx.font = `700 ${size}px Oswald`; ctx.textBaseline = 'middle';
  }
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
  ctx.fillStyle = '#ff5148'; ctx.beginPath(); ctx.arc(x + 9, y + 15, 8, 0, Math.PI * 2); ctx.fill();
  ctx.font = '700 30px Oswald'; ctx.fillStyle = '#ff6a5e'; ctx.textBaseline = 'middle';
  ctx.fillText('GECE 1 / 7', x + 28, y + 15);
  ctx.font = '700 108px Oswald'; ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 16;
  ctx.fillText(st.clock, x - 4, y + 98);
  ctx.shadowColor = 'transparent';
  ctx.font = '800 21px Inter'; ctx.fillStyle = 'rgba(200,210,228,0.85)';
  ctx.fillText('GREYWICK KAYASI  ·  DENİZ FENERİ', x, y + 170);
  let cx = x;
  cx += chip(ctx, cx, y + 200, 'IŞIK: AÇIK', '#3ddc8f', { icon: 'tik' }) + 12;
  if (st.gemi) chip(ctx, cx, y + 200, 'KURTARILAN GEMİ: 0', '#e8edf5');
  ctx.restore();
}

function drawRuleCard2(ctx, t, k) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(k * 2);
  const y = 640 - (1 - easeOut(clamp(k))) * 40;
  ctx.translate(W / 2, y);
  ctx.shadowColor = 'rgba(255,40,30,0.4)'; ctx.shadowBlur = 40;
  ctx.fillStyle = 'rgba(58,12,12,0.94)'; rr(ctx, -460, -120, 920, 240, 20); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#d23b2c'; ctx.lineWidth = 5; ctx.stroke();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ff6a5e'; ctx.font = '700 46px Oswald'; ctx.fillText('KURAL 2', 0, -58);
  ctx.fillStyle = '#f3e7d0'; ctx.font = '600 62px Caveat'; ctx.fillText("Gece 3'ten sonra telsize asla cevap verme.", 0, 30);
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
  ctx.translate(W / 2, 800);
  ctx.scale(0.86 + 0.14 * e, 0.86 + 0.14 * e);
  const w = 960, h = 520;
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 20;
  ctx.fillStyle = '#f3ece0'; rr(ctx, -w / 2, -h / 2, w, h, 34); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#c8402f'; ctx.font = '700 46px Oswald';
  ctx.fillText("ÇAĞRI SAAT 03:00'TE BAŞLADI.", 0, -180);
  ctx.fillStyle = '#151515'; ctx.font = '700 84px Oswald';
  ctx.fillText('CEVAP VERİYOR MUSUN?', 0, -88);
  const pulse = 1 + 0.03 * Math.sin(t * 5);
  [[-215, 'CEVAP VER', '#2e9e62'], [215, 'SESSİZ KAL', '#d9473a']].forEach(([bx, label, c1], i) => {
    ctx.save(); ctx.translate(bx, 50); const p = i === 0 ? pulse : 2 - pulse; ctx.scale(p, p);
    ctx.fillStyle = c1; rr(ctx, -195, -62, 390, 124, 22); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '700 60px Oswald'; ctx.fillText(label, 0, 4);
    ctx.restore();
  });
  ctx.fillStyle = '#4a4a4a'; ctx.font = '600 25px Oswald';
  ctx.fillText('SEÇİMİNİ YORUMLARA YAZ  ·  ÇOĞUNLUK SONRAKİNİ BELİRLER', 0, 190);
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
