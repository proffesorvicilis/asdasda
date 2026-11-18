// Gece Nöbeti — üst katman: altyazı, gösterge (HUD), kartlar
'use strict';

const HL = { y: '#ffc83d', r: '#ff5148', a: '#f2a541', o: '#ffa94d' };
const strip = w => normWord(w).replace(/[^a-zçğıöşü0-9]/g, '');

// ---------- Altyazı parçaları (en fazla 3 kelime, karaoke vurgusu)
function buildCaptions(tl) {
  const out = [];
  tl.lines.forEach(L => {
    const ws = tl.words.filter(w => w.line === L.id);
    let cur = [];
    const flush = () => { if (cur.length) { out.push({ line: L.id, etiket: L.etiket, v: L.v, words: cur }); cur = []; } };
    ws.forEach((w, i) => {
      const nx = ws[i + 1];
      if (strip(w.w) === 'doksan' && cur.length >= 2) flush();   // "doksan dokuz" aynı parçada başlasın
      cur.push({ ...w });
      const txt = cur.map(x => x.w).join(' ');
      const punct = /[.,:?!…]$/.test(w.w);
      const keep = strip(w.w) === 'doksan' && nx && strip(nx.w) === 'dokuz';
      if (!keep && (punct || cur.length >= 3 || txt.length >= 18)) flush();
    });
    flush();
  });
  for (let i = out.length - 1; i > 0; i--) {   // tek kalan kelimeyi öncekine bağla (en fazla 3 kelime)
    const a = out[i - 1], b = out[i];
    const joined = a.words.concat(b.words).map(x => x.w).join(' ');
    if (a.line === b.line && b.words.length === 1 && a.words.length < 3 && !/[.?!:]$/.test(a.words[a.words.length - 1].w) && joined.length <= 22) {
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

const CAP_ACTIVE = '#ffc83d';
function drawCaption(ctx, t, caps, y, o = {}) {
  const c = caps.find(c => t >= c.s && t < c.e);
  if (!c) return;
  const k = clamp((t - c.s) / 0.08);
  const size = o.size ?? 86;
  ctx.save();
  ctx.font = `700 ${size}px Oswald`;
  ctx.textBaseline = 'middle';
  const words = c.words.map(w => ({ ...w, T: trUpper(w.w) }));
  const sp = size * 0.36;
  const widths = words.map(w => ctx.measureText(w.T).width);
  const total = widths.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  const scale = total > 760 ? 760 / total : 1;          // sağdaki düğme sütununa taşmasın
  const sc = scale * (1 + (1 - easeOut(k)) * 0.1);
  let ai = 0;                                            // o an söylenen kelime
  words.forEach((w, i) => { if (t >= w.s - 0.04) ai = i; });
  const cx = o.x ?? 500;
  ctx.translate(cx, y);
  if (c.etiket) {
    ctx.save();
    ctx.font = '700 34px Oswald'; ctx.textAlign = 'center';
    const ec = c.etiket.startsWith('ARAS') ? '#4fd1c5' : c.etiket.startsWith('ÇINAR') ? '#ffb15e' : c.etiket.startsWith('HABER') ? '#ff8a80' : c.etiket.startsWith('MOSS') ? '#3ddc8f' : '#ffa94d';
    ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(4,6,12,0.9)'; ctx.lineJoin = 'round';
    ctx.strokeText(c.etiket, 0, -size * 0.84); ctx.fillStyle = ec; ctx.fillText(c.etiket, 0, -size * 0.84);
    ctx.restore();
    ctx.font = `700 ${size}px Oswald`; ctx.textBaseline = 'middle';
  }
  ctx.scale(sc, sc);
  ctx.globalAlpha = k;
  let x = -total / 2;
  words.forEach((w, i) => {
    const act = i === ai;
    const pop = act ? 1 + Math.min(0.06, sp * 0.8 / widths[i]) * (1 - clamp((t - w.s) / 0.12)) : 1;
    ctx.save();
    ctx.translate(x + widths[i] / 2, 0); ctx.scale(pop, pop);
    ctx.lineJoin = 'round';
    ctx.lineWidth = 15; ctx.strokeStyle = 'rgba(4,6,12,0.92)';
    ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    ctx.strokeText(w.T, -widths[i] / 2, 0);
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = act ? CAP_ACTIVE : '#ffffff';
    ctx.fillText(w.T, -widths[i] / 2, 0);
    ctx.restore();
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

function drawStageRow(ctx, x, y, a = 1, label = 'GECE 1 / 7') {
  ctx.save(); ctx.globalAlpha *= a;
  ctx.font = '700 32px Oswald'; ctx.fillStyle = '#ff6a5e'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ff5148'; ctx.beginPath(); ctx.arc(x + 9, y, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff6a5e'; ctx.fillText(label, x + 28, y + 1);
  const w = ctx.measureText(label).width;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath(); ctx.arc(x + 28 + w + 26 + i * 26, y, 8, 0, Math.PI * 2);
    if (i === 0) { ctx.fillStyle = '#ff6a5e'; ctx.fill(); }
    else { ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 3; ctx.stroke(); }
  }
  ctx.restore();
}

function drawHUD(ctx, t, st) {
  if (st.a <= 0) return;
  ctx.save();
  ctx.globalAlpha = st.a;
  const x = 60, y = 262;                       // Reels üst ölü alanının altında
  drawStageRow(ctx, x, y + 14);
  ctx.font = '700 98px Oswald'; ctx.fillStyle = '#ffffff'; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 16;
  ctx.fillText(st.clock, x - 4, y + 96);
  ctx.shadowColor = 'transparent';
  ctx.font = '800 21px Inter'; ctx.fillStyle = 'rgba(200,210,228,0.85)';
  ctx.fillText('GREYWICK KAYASI  ·  DENİZ FENERİ', x, y + 160);
  let cx = x;
  cx += chip(ctx, cx, y + 186, 'IŞIK: AÇIK', '#3ddc8f', { icon: 'tik' }) + 12;
  if (st.gemi) chip(ctx, cx, y + 186, 'KURTARILAN GEMİ: 0', '#e8edf5');
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

// ---------- Seçim bölümü
function iconMic(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  rr(ctx, -16, -40, 32, 52, 16); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -8, 28, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 20); ctx.lineTo(0, 36); ctx.moveTo(-16, 38); ctx.lineTo(16, 38); ctx.stroke();
  ctx.restore();
}
function iconMute(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-34, -12); ctx.lineTo(-18, -12); ctx.lineTo(0, -30); ctx.lineTo(0, 30); ctx.lineTo(-18, 12); ctx.lineTo(-34, 12); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(12, -14); ctx.lineTo(38, 12); ctx.moveTo(38, -14); ctx.lineTo(12, 12); ctx.stroke();
  ctx.restore();
}
function drawChoice(ctx, t, lt) {
  const k = clamp(lt / 0.5);
  if (k <= 0) return;
  const CX = 520;                                 // sağ düğme sütunundan uzak
  // üst aşama şeridi
  ctx.save(); ctx.globalAlpha = clamp(lt / 0.4);
  drawStageRow(ctx, 70, 300, 1, 'GECE 1 / 7  ·  KARAR ANI');
  ctx.restore();
  // kart
  ctx.save();
  const e = easeBack(k);
  ctx.globalAlpha = clamp(k * 2);
  ctx.translate(CX, 740);
  ctx.scale(0.85 + 0.15 * e, 0.85 + 0.15 * e);
  const w = 820, h = 600;
  ctx.shadowColor = 'rgba(0,0,0,0.65)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 20;
  ctx.fillStyle = '#f3ece0'; rr(ctx, -w / 2, -h / 2, w, h, 36); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#c8402f'; ctx.font = '700 42px Oswald';
  ctx.fillText("ÇAĞRI SAAT 03:00'TE BAŞLADI.", 0, -222);
  ctx.fillStyle = '#151515'; ctx.font = '700 80px Oswald';
  ctx.fillText('CEVAP VERİYOR', 0, -140);
  ctx.fillText('MUSUN?', 0, -62);
  const btn = (bx, label, col, icon, delay, ph) => {
    const bk = clamp((lt - delay) / 0.3);
    if (bk <= 0) return;
    const pulse = 1 + 0.035 * Math.sin(t * 5 + ph);
    ctx.save(); ctx.translate(bx, 92); ctx.scale(easeBack(bk) * pulse, easeBack(bk) * pulse);
    ctx.shadowColor = col; ctx.shadowBlur = 24 + 16 * Math.max(0, Math.sin(t * 5 + ph));
    ctx.fillStyle = col; rr(ctx, -180, -78, 360, 156, 26); ctx.fill();
    ctx.shadowColor = 'transparent';
    icon(ctx, 0, -26, 0.75);
    ctx.fillStyle = '#fff'; ctx.font = '700 50px Oswald'; ctx.fillText(label, 0, 44);
    ctx.restore();
  };
  btn(-195, 'CEVAP VER', '#2e9e62', iconMic, 0.35, 0);
  btn(195, 'SESSİZ KAL', '#d9473a', iconMute, 0.55, Math.PI);
  ctx.fillStyle = '#4a4a4a'; ctx.font = '600 25px Oswald';
  ctx.fillText('ÇOĞUNLUK 2. GECEDE NE OLACAĞINI BELİRLER', 0, 236);
  ctx.restore();
  // yorum çağrısı + sağa bakan ok (yorum düğmesine doğru)
  const ck = clamp((lt - 0.9) / 0.35);
  if (ck > 0) {
    ctx.save(); ctx.globalAlpha = ck;
    const bob = Math.sin(t * 6) * 10;
    ctx.translate(CX, 1150);
    ctx.fillStyle = 'rgba(12,16,28,0.88)'; rr(ctx, -330, -52, 600, 104, 52); ctx.fill();
    ctx.strokeStyle = '#ffc83d'; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.font = '700 48px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('SEÇİMİNİ YORUMLARA YAZ', -40, 3);
    ctx.translate(318 + bob, 26 + bob * 0.6); ctx.rotate(0.55);
    ctx.fillStyle = '#ffc83d';
    ctx.beginPath(); ctx.moveTo(-34, -12); ctx.lineTo(8, -12); ctx.lineTo(8, -32); ctx.lineTo(44, 0); ctx.lineTo(8, 32); ctx.lineTo(8, 12); ctx.lineTo(-34, 12); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
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


// ---------- Gece 2: gösterge, kural kartı, seçim
function drawStageRow2(ctx, x, y, label, filled = 1, col = '#ff6a5e', dots = true) {
  ctx.save();
  ctx.font = '700 32px Oswald'; ctx.textBaseline = 'middle';
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + 9, y, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillText(label, x + 28, y + 1);
  if (dots) {
    const w = ctx.measureText(label).width;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath(); ctx.arc(x + 28 + w + 26 + i * 26, y, 8, 0, Math.PI * 2);
      if (i < filled) { ctx.fillStyle = col; ctx.fill(); } else { ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 3; ctx.stroke(); }
    }
  }
  ctx.restore();
}
function drawHUD2(ctx, t, st) {
  if (!st || st.a <= 0) return;
  ctx.save(); ctx.globalAlpha = st.a;
  const x = 60, y = 262;
  drawStageRow2(ctx, x, y + 14, st.stage, st.filled, st.stageCol, st.dots);
  ctx.font = '700 98px Oswald'; ctx.fillStyle = '#ffffff'; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 16;
  ctx.fillText(st.clock, x - 4, y + 96);
  ctx.shadowColor = 'transparent';
  ctx.font = '800 21px Inter'; ctx.fillStyle = 'rgba(200,210,228,0.85)';
  ctx.fillText('GREYWICK KAYASI  ·  DENİZ FENERİ', x, y + 160);
  let cx = x;
  st.chips.forEach(c => {
    ctx.globalAlpha = st.a * (c.a ?? 1);
    cx += chip(ctx, cx, y + 186, c.text, c.col, { icon: c.icon, fill: c.fill }) + 12;
  });
  ctx.restore();
}
function drawRuleCardN(ctx, t, k, title, text) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(k * 2);
  ctx.translate(500, 330 - (1 - easeOut(clamp(k))) * 40);
  ctx.shadowColor = 'rgba(255,40,30,0.4)'; ctx.shadowBlur = 40;
  ctx.fillStyle = 'rgba(58,12,12,0.95)'; rr(ctx, -420, -95, 840, 190, 20); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#d23b2c'; ctx.lineWidth = 5; ctx.stroke();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ff6a5e'; ctx.font = '700 44px Oswald'; ctx.fillText(title, 0, -44);
  ctx.font = '600 60px Caveat';
  const fs = Math.min(60, Math.floor(60 * 780 / Math.max(1, ctx.measureText(text).width)));
  ctx.fillStyle = '#f3e7d0'; ctx.font = `600 ${fs}px Caveat`; ctx.fillText(text, 0, 30);
  ctx.restore();
}
function iconDoor(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineWidth = 7; ctx.lineJoin = 'round';
  ctx.strokeRect(-26, -40, 40, 78);
  ctx.beginPath(); ctx.moveTo(-26, -40); ctx.lineTo(10, -30); ctx.lineTo(10, 46); ctx.lineTo(-26, 38); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(2, 6, 4, 0, Math.PI * 2); ctx.fillStyle = '#2e9e62'; ctx.fill();
  ctx.restore();
}
function iconLock(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(0, -10, 20, Math.PI, Math.PI * 2); ctx.lineTo(20, 4); ctx.moveTo(-20, 4); ctx.lineTo(-20, -10); ctx.stroke();
  rr(ctx, -32, 0, 64, 48, 10); ctx.fill();
  ctx.fillStyle = '#d9473a'; ctx.beginPath(); ctx.arc(0, 20, 7, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function drawChoice2(ctx, t, lt) {
  const k = clamp(lt / 0.5);
  if (k <= 0) return;
  const CX = 520;
  ctx.save(); ctx.globalAlpha = clamp(lt / 0.4);
  drawStageRow2(ctx, 70, 300, 'GECE 2 / 7  ·  KARAR ANI', 2);
  ctx.restore();
  ctx.save();
  const e = easeBack(k);
  ctx.globalAlpha = clamp(k * 2);
  ctx.translate(CX, 730);
  ctx.scale(0.85 + 0.15 * e, 0.85 + 0.15 * e);
  const w = 820, h = 600;
  ctx.shadowColor = 'rgba(0,0,0,0.65)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 20;
  ctx.fillStyle = '#f3ece0'; rr(ctx, -w / 2, -h / 2, w, h, 36); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#c8402f'; ctx.font = '700 42px Oswald';
  ctx.fillText("HARLAN'IN KASKETİNİ TAKIYOR.", 0, -222);
  ctx.fillStyle = '#151515'; ctx.font = '700 80px Oswald';
  ctx.fillText('KAPIYI', 0, -140);
  ctx.fillText('AÇIYOR MUSUN?', 0, -62);
  const btn = (bx, label, col, icon, delay, ph) => {
    const bk = clamp((lt - delay) / 0.3);
    if (bk <= 0) return;
    const pulse = 1 + 0.035 * Math.sin(t * 5 + ph);
    ctx.save(); ctx.translate(bx, 92); ctx.scale(easeBack(bk) * pulse, easeBack(bk) * pulse);
    ctx.shadowColor = col; ctx.shadowBlur = 24 + 16 * Math.max(0, Math.sin(t * 5 + ph));
    ctx.fillStyle = col; rr(ctx, -180, -78, 360, 156, 26); ctx.fill();
    ctx.shadowColor = 'transparent';
    icon(ctx, 0, -26, 0.75);
    ctx.fillStyle = '#fff'; ctx.font = '700 48px Oswald'; ctx.fillText(label, 0, 44);
    ctx.restore();
  };
  btn(-195, 'AÇ', '#2e9e62', iconDoor, 0.35, 0);
  btn(195, 'KİLİTLİ KALSIN', '#d9473a', iconLock, 0.55, Math.PI);
  ctx.fillStyle = '#4a4a4a'; ctx.font = '600 25px Oswald';
  ctx.fillText('ÇOĞUNLUK 3. GECEDE NE OLACAĞINI BELİRLER', 0, 236);
  ctx.restore();
  const ck = clamp((lt - 0.9) / 0.35);
  if (ck > 0) {
    ctx.save(); ctx.globalAlpha = ck;
    const bob = Math.sin(t * 6) * 10;
    ctx.translate(CX, 1130);
    ctx.fillStyle = 'rgba(12,16,28,0.88)'; rr(ctx, -330, -52, 600, 104, 52); ctx.fill();
    ctx.strokeStyle = '#ffc83d'; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.font = '700 48px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('SEÇİMİNİ YORUMLARA YAZ', -40, 3);
    ctx.save(); ctx.translate(318 + bob, 26 + bob * 0.6); ctx.rotate(0.55);
    ctx.fillStyle = '#ffc83d';
    ctx.beginPath(); ctx.moveTo(-34, -12); ctx.lineTo(8, -12); ctx.lineTo(8, -32); ctx.lineTo(44, 0); ctx.lineTo(8, 32); ctx.lineTo(8, 12); ctx.lineTo(-34, 12); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.restore();
  }
  const fk = clamp((lt - 1.6) / 0.35);
  if (fk > 0) {
    ctx.save(); ctx.globalAlpha = fk; ctx.translate(CX, 1262);
    ctx.fillStyle = '#ffc83d'; rr(ctx, -320, -40, 640, 80, 40); ctx.fill();
    ctx.fillStyle = '#141414'; ctx.font = '700 36px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('3. GECEDE NE OLACAK? TAKİP ET', 0, 2);
    ctx.restore();
  }
}
