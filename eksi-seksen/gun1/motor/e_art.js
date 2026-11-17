// Eksi Seksen · Gün 1 — Ankara sahneleri: yatak odası, mutfak ve TV, park, kafe, eczane, telefon, çiftlik, akşam
'use strict';

// ---------- Renk düzenleri
function coldGrade(ctx, k = 1) {
  if (k <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = `rgba(110,150,215,${0.42 * k})`; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'saturation';
  ctx.fillStyle = `rgba(128,128,128,${0.22 * k})`; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, `rgba(220,235,255,${0.10 * k})`); g.addColorStop(1, 'rgba(220,235,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// ---------- Buz tutmuş cam kenarları
function frostEdges(ctx, x, y, w, h, k = 1, seed = 3) {
  if (k <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const m = Math.min(w, h) * 0.2 * k;
  const edge = (x0, y0, x1, y1, rx, ry, rw, rh) => {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, 'rgba(236,245,255,0.92)'); g.addColorStop(0.45, 'rgba(236,245,255,0.35)'); g.addColorStop(1, 'rgba(236,245,255,0)');
    ctx.fillStyle = g; ctx.fillRect(rx, ry, rw, rh);
  };
  edge(x, 0, x + m, 0, x, y, m, h);
  edge(x + w, 0, x + w - m, 0, x + w - m, y, m, h);
  edge(0, y, 0, y + m * 0.8, x, y, w, m * 0.8);
  edge(0, y + h, 0, y + h - m * 1.5, x, y + h - m * 1.5, w, m * 1.5);
  const R = mulberry32(seed);
  ctx.strokeStyle = 'rgba(248,252,255,0.7)'; ctx.lineCap = 'round';
  const n = Math.floor(70 * k);
  for (let i = 0; i < n; i++) {
    const side = Math.floor(R() * 4);
    let px = x + R() * w, py = y + R() * h;
    const d = R() * m * 0.9;
    if (side === 0) px = x + d; else if (side === 1) px = x + w - d; else if (side === 2) py = y + d * 0.8; else py = y + h - d * 1.4;
    let a = R() * Math.PI * 2, len = 14 + R() * 30;
    ctx.lineWidth = 1.5 + R() * 1.5;
    for (let j = 0; j < 4; j++) {
      const nx = px + Math.cos(a) * len, ny = py + Math.sin(a) * len;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny); ctx.stroke();
      const b = a + (R() > 0.5 ? 0.7 : -0.7);
      ctx.beginPath(); ctx.moveTo((px + nx) / 2, (py + ny) / 2); ctx.lineTo((px + nx) / 2 + Math.cos(b) * len * 0.45, (py + ny) / 2 + Math.sin(b) * len * 0.45); ctx.stroke();
      px = nx; py = ny; a += (R() - 0.5) * 0.9; len *= 0.75;
    }
  }
  ctx.restore();
}

// ---------- Soluk güneş ("eski bir ampul")
function paleSun(ctx, x, y, r, k = 1) {
  ctx.save();
  const h = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 4.5);
  h.addColorStop(0, `rgba(255,248,225,${0.35 * k})`); h.addColorStop(1, 'rgba(255,248,225,0)');
  ctx.fillStyle = h; ctx.fillRect(x - r * 5, y - r * 5, r * 10, r * 10);
  ctx.fillStyle = `rgba(250,246,232,${0.92 * k})`;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ---------- Ankara silüeti (Atakule ile)
function ankaraSkyline(ctx, base, o = {}) {
  const R = mulberry32(o.seed ?? 11);
  const far = o.far ?? '#7f8da6', near = o.near ?? '#4a566d';
  ctx.fillStyle = far;
  let x = -30;
  while (x < W + 30) { const w = 40 + R() * 80, h = 50 + R() * 150; ctx.fillRect(x, base - h - 40, w, h + 60); x += w + R() * 6; }
  const ax = o.ax ?? 760, ah = o.ah ?? 430;
  ctx.fillStyle = near;
  ctx.fillRect(ax - 13, base - ah, 26, ah);
  ctx.beginPath(); ctx.ellipse(ax, base - ah, 50, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ax, base - ah - 18, 26, Math.PI, 0); ctx.fill();
  ctx.fillRect(ax - 3, base - ah - 96, 6, 82);
  x = -30;
  while (x < W + 30) {
    const w = 70 + R() * 120, h = 40 + R() * 110;
    ctx.fillStyle = near; ctx.fillRect(x, base - h, w, h + 600);
    if (o.lit) {
      ctx.fillStyle = `rgba(255,214,150,${o.lit})`;
      for (let wy = base - h + 16; wy < base + 200; wy += 30) for (let wx = x + 10; wx < x + w - 14; wx += 24) if (R() > 0.6) ctx.fillRect(wx, wy, 10, 14);
    }
    x += w + 8;
  }
}

// ---------- Telefon
function drawPhone(ctx, x, y, s, o = {}) {
  const w = 300 * s, h = 620 * s;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 30 * s;
  ctx.fillStyle = '#111317'; rr(ctx, -w / 2, -h / 2, w, h, 42 * s); ctx.fill();
  ctx.shadowColor = 'transparent';
  const sw = w - 22 * s, sh = h - 22 * s;
  ctx.save(); rr(ctx, -sw / 2, -sh / 2, sw, sh, 34 * s); ctx.clip();
  const mode = o.mode ?? 'hava';
  const top = -sh / 2;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (mode === 'hava' || mode === 'tahmin') {
    const g = ctx.createLinearGradient(0, top, 0, sh / 2);
    g.addColorStop(0, '#4b6a92'); g.addColorStop(1, '#22334f');
    ctx.fillStyle = g; ctx.fillRect(-sw / 2, top, sw, sh);
    ctx.fillStyle = '#fff'; ctx.font = `600 ${30 * s}px Inter`; ctx.fillText('Ankara', 0, top + 70 * s);
    ctx.font = `700 ${120 * s}px Oswald`; ctx.fillText(o.temp ?? '0°', 8 * s, top + 170 * s);
    ctx.font = `600 ${24 * s}px Inter`; ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(o.sub ?? 'Dün: +10°  ·  Güneşli', 0, top + 250 * s);
    if (mode === 'tahmin') {
      const rows = o.rows ?? [['Bugün', '0°', 0], ['Yarın', '−10°', 1], ['Cuma', '−20°', 2], ['Cumartesi', '−30°', 3]];
      const k = o.k ?? 1;
      rows.forEach(([d, tmp, i]) => {
        const a = clamp(k * rows.length - i);
        if (a <= 0) return;
        const yy = top + 320 * s + i * 62 * s;
        ctx.globalAlpha = a;
        ctx.fillStyle = 'rgba(255,255,255,0.08)'; rr(ctx, -sw / 2 + 18 * s, yy - 26 * s, sw - 36 * s, 52 * s, 12 * s); ctx.fill();
        ctx.textAlign = 'left'; ctx.fillStyle = '#e8eef8'; ctx.font = `600 ${26 * s}px Inter`; ctx.fillText(d, -sw / 2 + 36 * s, yy);
        ctx.textAlign = 'right'; ctx.fillStyle = i >= 1 ? '#ff6a5e' : '#e8eef8'; ctx.font = `700 ${34 * s}px Oswald`; ctx.fillText(tmp, sw / 2 - 36 * s, yy);
        ctx.globalAlpha = 1;
      });
      ctx.textAlign = 'center';
    }
  } else if (mode === 'alarm') {
    ctx.fillStyle = '#0d1018'; ctx.fillRect(-sw / 2, top, sw, sh);
    const p = 0.5 + 0.5 * Math.sin((o.t ?? 0) * 8);
    ctx.fillStyle = `rgba(255,200,90,${0.15 + 0.2 * p})`; ctx.beginPath(); ctx.arc(0, top + 300 * s, 120 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = `700 ${96 * s}px Oswald`; ctx.fillText('07:40', 0, top + 200 * s);
    ctx.font = `600 ${26 * s}px Inter`; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillText('Alarm', 0, top + 270 * s);
    ctx.fillStyle = '#ffc83d'; rr(ctx, -110 * s, top + 470 * s, 220 * s, 64 * s, 32 * s); ctx.fill();
    ctx.fillStyle = '#111'; ctx.font = `700 ${26 * s}px Oswald`; ctx.fillText('ERTELE', 0, top + 503 * s);
  } else if (mode === 'arama') {
    ctx.fillStyle = '#18202e'; ctx.fillRect(-sw / 2, top, sw, sh);
    ctx.fillStyle = o.col ?? '#4fd1c5'; ctx.beginPath(); ctx.arc(0, top + 190 * s, 70 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0d1018'; ctx.font = `700 ${70 * s}px Oswald`; ctx.fillText((o.name ?? 'A')[0], 0, top + 194 * s);
    ctx.fillStyle = '#fff'; ctx.font = `700 ${42 * s}px Oswald`; ctx.fillText(o.name ?? 'Aras', 0, top + 310 * s);
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = `600 ${24 * s}px Inter`; ctx.fillText(o.status ?? 'aranıyor...', 0, top + 356 * s);
    ctx.fillStyle = '#e04a3c'; ctx.beginPath(); ctx.arc(0, top + 500 * s, 40 * s, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  ctx.restore();
}

// ---------- Yatak odası (sabah)
function drawBedroom2(ctx, t, o = {}) {
  ctx.fillStyle = '#5a6577'; ctx.fillRect(0, 0, W, H);
  const wx = 70, wy = 300, ww = 560, wh = 820;
  const sg = ctx.createLinearGradient(0, wy, 0, wy + wh);
  sg.addColorStop(0, '#b9c6d8'); sg.addColorStop(0.7, '#d9dfe8'); sg.addColorStop(1, '#c4cbd6');
  ctx.fillStyle = sg; ctx.fillRect(wx, wy, ww, wh);
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
  paleSun(ctx, wx + 380, wy + 230, 34, 0.9);
  ankaraSkyline(ctx, wy + wh - 120, { ax: wx + 400, ah: 380, far: '#9aa6b8', near: '#6f7c92', seed: 5 });
  ctx.restore();
  frostEdges(ctx, wx, wy, ww, wh, o.frost ?? 1, 7);
  ctx.strokeStyle = '#e8ecf2'; ctx.lineWidth = 22; ctx.strokeRect(wx, wy, ww, wh);
  ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke();
  ctx.fillStyle = '#d7dce4'; ctx.fillRect(wx - 30, wy + wh, ww + 60, 26);
  // yatak
  ctx.fillStyle = '#3b3f4a'; rr(ctx, 380, 1290, 760, 90, 20); ctx.fill();
  ctx.fillStyle = '#e9e4da'; rr(ctx, 400, 1170, 740, 160, 40); ctx.fill();
  ctx.fillStyle = '#7d8fb0'; rr(ctx, 360, 1240, 800, 160, 50); ctx.fill();
  ctx.fillStyle = '#6a7b9b'; rr(ctx, 360, 1340, 800, 60, 30); ctx.fill();
  // komodin + telefon
  ctx.fillStyle = '#8a6a4d'; ctx.fillRect(90, 1230, 220, 180); ctx.fillStyle = '#6d533c'; ctx.fillRect(90, 1300, 220, 8);
  if (o.alarm) {
    const p = 0.5 + 0.5 * Math.sin(t * 8);
    ctx.fillStyle = `rgba(255,205,110,${0.25 + 0.35 * p})`; ctx.beginPath(); ctx.ellipse(200, 1222, 90, 22, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#111317'; rr(ctx, 150, 1206, 100, 20, 6); ctx.fill();
  // kahraman yatakta doğruluyor
  drawPerson(ctx, 720, 1330, 1.25, { who: 'kahraman', face: -1, t, noLegs: true, brow: o.brow ?? 'notr', eyes: o.eyes ?? 'nokta', mouth: o.mouth ?? 'cizgi', arm: o.arm, hand: o.hand, seed: 3 });
  ctx.fillStyle = '#7d8fb0'; rr(ctx, 520, 1300, 640, 110, 40); ctx.fill();
  // nefes buharı (oda soğuk)
  const bt = (t * 0.7) % 1;
  ctx.fillStyle = `rgba(240,246,255,${0.35 * (1 - bt)})`; ctx.beginPath(); ctx.ellipse(650 - bt * 60, 1080 - bt * 40, 20 + bt * 30, 12 + bt * 16, 0, 0, Math.PI * 2); ctx.fill();
}

// ---------- Haber stüdyosu (ekran içi)
function drawNews(ctx, x, y, w, h, t, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, '#16335e'); g.addColorStop(1, '#0b1a33');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  // arka planda dönen dünya ızgarası
  ctx.save(); ctx.translate(x + w * 0.74, y + h * 0.42);
  ctx.strokeStyle = 'rgba(120,180,255,0.25)'; ctx.lineWidth = 2;
  const R = h * 0.34;
  ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(0, 0, R * Math.abs(Math.cos((t * 0.3 + i * 0.6) % Math.PI)), R, 0, 0, Math.PI * 2); ctx.stroke(); }
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(0, i * R * 0.35, Math.sqrt(Math.max(0, 1 - (i * 0.35) ** 2)) * R, R * 0.08, 0, 0, Math.PI * 2); ctx.stroke(); }
  if (o.icy) {
    ctx.fillStyle = `rgba(160,220,255,${0.35 * o.icy})`;
    [[-0.3, -0.3, 0.32], [0.25, -0.2, 0.28], [-0.1, 0.25, 0.25], [0.35, 0.3, 0.22]].forEach(([a, b, c]) => { ctx.beginPath(); ctx.arc(a * R, b * R, c * R, 0, Math.PI * 2); ctx.fill(); });
  }
  ctx.restore();
  // spiker masada
  const s = h / 760;
  ctx.save(); ctx.translate(x + w * 0.32, y + h * 0.98); ctx.scale(s, s);
  drawPerson(ctx, 0, 0, 1.25, { who: 'spiker', face: 0.15, t, noLegs: true, brow: o.brow ?? 'notr', mouth: o.talk ? 'konus' : 'cizgi', talk: o.talk ?? 0, seed: 8 });
  ctx.restore();
  ctx.fillStyle = '#0b1424'; ctx.fillRect(x, y + h * 0.78, w, h * 0.22);
  ctx.fillStyle = '#1d3b6b'; ctx.fillRect(x, y + h * 0.78, w, 6 * s);
  // alt başlık
  const lb = y + h * 0.62;
  ctx.fillStyle = o.red ? '#c8302a' : '#1e5fbf'; ctx.fillRect(x + w * 0.04, lb, w * 0.2, h * 0.07);
  ctx.fillStyle = '#fff'; ctx.font = `700 ${h * 0.045}px Oswald`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(o.tag ?? 'GÜNDEM', x + w * 0.14, lb + h * 0.036);
  ctx.fillStyle = 'rgba(245,247,252,0.96)'; ctx.fillRect(x + w * 0.24, lb, w * 0.72, h * 0.07);
  ctx.fillStyle = '#10213d'; ctx.textAlign = 'left'; ctx.font = `700 ${h * 0.048}px Oswald`;
  ctx.fillText(o.title ?? 'SOĞUK HAVA DALGASI', x + w * 0.27, lb + h * 0.037);
  // kayan bant
  const by = y + h * 0.69;
  ctx.fillStyle = '#0a0f1a'; ctx.fillRect(x, by, w, h * 0.065);
  ctx.fillStyle = '#ffc83d'; ctx.fillRect(x, by, w * 0.12, h * 0.065);
  ctx.fillStyle = '#111'; ctx.textAlign = 'center'; ctx.font = `700 ${h * 0.036}px Oswald`; ctx.fillText(o.clock ?? '07:52', x + w * 0.06, by + h * 0.034);
  ctx.save(); ctx.beginPath(); ctx.rect(x + w * 0.12, by, w * 0.88, h * 0.065); ctx.clip();
  const tick = o.ticker ?? 'SİBİRYA KAYNAKLI SOĞUK HAVA DALGASI ETKİSİNİ ARTIRIYOR  •  OKULLARDA TATİL KARARI VALİLİKLERE BIRAKILDI  •  ';
  ctx.fillStyle = '#e9edf5'; ctx.textAlign = 'left'; ctx.font = `600 ${h * 0.036}px Oswald`;
  const tw = ctx.measureText(tick).width;
  const off0 = (t * (o.speed ?? 120) * (w / 1000)) % tw;
  for (let k = -1; k < 3; k++) ctx.fillText(tick, x + w * 0.13 - off0 + k * tw, by + h * 0.034);
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = `700 ${h * 0.04}px Oswald`; ctx.textAlign = 'right';
  ctx.fillText('HABER', x + w * 0.95, y + h * 0.07);
  ctx.restore();
}

// ---------- Mutfak (sabah/gece), duvarda TV
function drawKitchen(ctx, t, o = {}) {
  const night = o.night ?? 0;
  ctx.fillStyle = night ? '#3a3330' : '#6f7787'; ctx.fillRect(0, 0, W, H);
  // pencere
  const wx = 690, wy = 360, ww = 330, wh = 560;
  const sg = ctx.createLinearGradient(0, wy, 0, wy + wh);
  if (night) { sg.addColorStop(0, '#0f1a30'); sg.addColorStop(1, '#1d2b48'); } else { sg.addColorStop(0, '#bcc8d9'); sg.addColorStop(1, '#d7dde6'); }
  ctx.fillStyle = sg; ctx.fillRect(wx, wy, ww, wh);
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
  ankaraSkyline(ctx, wy + wh - 80, { ax: wx + 200, ah: 300, far: night ? '#1b2640' : '#9aa6b8', near: night ? '#121a2d' : '#6f7c92', lit: night ? 0.7 : 0, seed: 9 });
  ctx.restore();
  frostEdges(ctx, wx, wy, ww, wh, 0.9, 12);
  ctx.strokeStyle = night ? '#2a2420' : '#e8ecf2'; ctx.lineWidth = 18; ctx.strokeRect(wx, wy, ww, wh);
  // üst dolaplar
  ctx.fillStyle = night ? '#5c4a3e' : '#d8d2c8'; ctx.fillRect(0, 300, 640, 240);
  ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 4;
  for (let x = 160; x < 640; x += 160) { ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x, 540); ctx.stroke(); }
  // TV (sol duvar, dolapların altında)
  if (o.tv) {
    const tx = 60, ty = 600, tw = 560, th = 330;
    ctx.fillStyle = '#0b0c10'; rr(ctx, tx - 14, ty - 14, tw + 28, th + 28, 12); ctx.fill();
    drawNews(ctx, tx, ty, tw, th, t, o.tv);
    ctx.fillStyle = 'rgba(120,170,255,0.06)'; ctx.fillRect(0, 560, W, 700);
  }
  // tezgâh
  ctx.fillStyle = night ? '#2a2420' : '#3d3f46'; ctx.fillRect(-20, 1270, W + 40, 650);
  ctx.fillStyle = night ? '#8a7a68' : '#c9c3b8'; ctx.fillRect(-20, 1240, W + 40, 40);
  // kahve makinesi
  ctx.fillStyle = '#25272c'; rr(ctx, 80, 1060, 170, 190, 16); ctx.fill();
  ctx.fillStyle = '#3a3d44'; ctx.fillRect(110, 1180, 110, 14);
  ctx.fillStyle = '#f2efe8'; rr(ctx, 140, 1196, 50, 44, 8); ctx.fill();
  if (o.steam) {
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.6 + i / 3) % 1;
      ctx.fillStyle = `rgba(245,245,245,${0.35 * (1 - ph)})`;
      ctx.beginPath(); ctx.ellipse(165 + Math.sin(t * 2 + i) * 8, 1180 - ph * 120, 10 + ph * 18, 14 + ph * 20, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (o.pot) {   // ocakta tencere (gece)
    ctx.fillStyle = '#1b1c20'; ctx.fillRect(300, 1236, 260, 8);
    ctx.fillStyle = '#b44a2e'; rr(ctx, 330, 1140, 200, 100, 18); ctx.fill();
    ctx.fillStyle = '#8e3a24'; rr(ctx, 320, 1130, 220, 24, 10); ctx.fill();
    for (let i = 0; i < 4; i++) {
      const ph = (t * 0.45 + i / 4) % 1;
      ctx.fillStyle = `rgba(250,240,225,${0.4 * (1 - ph)})`;
      ctx.beginPath(); ctx.ellipse(430 + Math.sin(t * 1.7 + i * 2) * 20, 1120 - ph * 220, 16 + ph * 40, 20 + ph * 36, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (o.cooker) {   // düdüklü tencere
    ctx.fillStyle = '#c9ccd2'; rr(ctx, 600, 1150, 150, 90, 14); ctx.fill();
    ctx.fillStyle = '#2b2d33'; ctx.fillRect(590, 1140, 170, 16); ctx.fillRect(745, 1136, 60, 12);
    ctx.fillStyle = '#2b2d33'; ctx.beginPath(); ctx.arc(675, 1132, 10, 0, Math.PI * 2); ctx.fill();
  }
  // kişiler
  (o.people ?? []).forEach(p => drawPerson(ctx, p.x, p.y, p.s ?? 1.25, { t, noLegs: true, ...p }));
  if (o.mug) {   // eldeki kupa
    const [mx, my] = o.mug;
    ctx.fillStyle = '#f2efe8'; rr(ctx, mx - 22, my - 20, 44, 40, 8); ctx.fill();
    ctx.strokeStyle = '#f2efe8'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(mx + 24, my, 12, -1.2, 1.2); ctx.stroke();
    const ph = (t * 0.6) % 1;
    ctx.fillStyle = `rgba(245,245,245,${0.3 * (1 - ph)})`; ctx.beginPath(); ctx.ellipse(mx, my - 30 - ph * 60, 8 + ph * 14, 10 + ph * 14, 0, 0, Math.PI * 2); ctx.fill();
  }
  if (o.tablet) drawTablet(ctx, o.tablet.x, o.tablet.y, o.tablet.s ?? 1, t, o.tablet);
}

// ---------- Tablet (görüntülü arama ya da grafik)
function drawTablet(ctx, x, y, s, t, o = {}) {
  const w = 420 * s, h = 300 * s;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.04);
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 24 * s;
  ctx.fillStyle = '#111317'; rr(ctx, -w / 2, -h / 2, w, h, 22 * s); ctx.fill();
  ctx.shadowColor = 'transparent';
  const sw = w - 24 * s, sh = h - 24 * s;
  ctx.save(); rr(ctx, -sw / 2, -sh / 2, sw, sh, 12 * s); ctx.clip();
  if ((o.mode ?? 'video') === 'video') arasVideoLux(ctx, -sw / 2, -sh / 2, sw, sh, t, o);
  else drawGraph(ctx, -sw / 2, -sh / 2, sw, sh, t, o);
  ctx.restore();
  ctx.restore();
}

// Aras görüntülü aramada: arkada çiftlikteki soba
function arasVideo(ctx, x, y, w, h, t, o = {}) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, '#3a2a22'); g.addColorStop(1, '#1e1612'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  // soba ışığı
  const fl = 0.8 + 0.2 * Math.sin(t * 9) * Math.sin(t * 5.3);
  const sg = ctx.createRadialGradient(x + w * 0.82, y + h * 0.75, 4, x + w * 0.82, y + h * 0.75, w * 0.6);
  sg.addColorStop(0, `rgba(255,150,60,${0.55 * fl})`); sg.addColorStop(1, 'rgba(255,150,60,0)');
  ctx.fillStyle = sg; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#1b1b1f'; rr(ctx, x + w * 0.72, y + h * 0.5, w * 0.22, h * 0.45, 8); ctx.fill();
  ctx.fillStyle = `rgba(255,140,40,${0.85 * fl})`; rr(ctx, x + w * 0.76, y + h * 0.64, w * 0.14, h * 0.14, 4); ctx.fill();
  const s = h / 520;
  ctx.save(); ctx.translate(x + w * 0.42, y + h * 1.25); ctx.scale(s, s);
  drawPerson(ctx, 0, 0, 1.5, { who: 'aras', face: 0.1, t, noLegs: true, brow: o.brow ?? 'notr', mouth: o.talk ? 'konus' : 'cizgi', talk: o.talk ?? 0, seed: 4 });
  ctx.restore();
  ctx.fillStyle = 'rgba(0,0,0,0.45)'; rr(ctx, x + 10, y + 10, 110 * (w / 400), 30 * (w / 400), 8); ctx.fill();
  ctx.fillStyle = '#ff5148'; ctx.beginPath(); ctx.arc(x + 26 * (w / 400), y + 25 * (w / 400), 6 * (w / 400), 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `700 ${18 * (w / 400)}px Oswald`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('ARAS', x + 40 * (w / 400), y + 26 * (w / 400));
}

// Güneş ışınımı grafiği
function drawGraph(ctx, x, y, w, h, t, o = {}) {
  ctx.fillStyle = '#0d1420'; ctx.fillRect(x, y, w, h);
  const px = x + w * 0.12, py = y + h * 0.2, pw = w * 0.82, ph = h * 0.6;
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = Math.max(1, w / 400);
  for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(px, py + ph * i / 4); ctx.lineTo(px + pw, py + ph * i / 4); ctx.stroke(); }
  const fs = w / 400;
  ctx.fillStyle = '#e8edf5'; ctx.font = `700 ${18 * fs}px Oswald`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('GÜNEŞ IŞINIMI · ÇİFTLİK İSTASYONU', x + 14 * fs, y + 22 * fs);
  ctx.fillStyle = 'rgba(232,237,245,0.6)'; ctx.font = `600 ${12 * fs}px Inter`;
  ['06', '09', '12', '15', '18'].forEach((l, i) => { ctx.textAlign = 'center'; ctx.fillText(l, px + pw * i / 4, py + ph + 14 * fs); });
  const curve = (u, amp) => Math.sin(Math.PI * u) ** 1.6 * amp;
  // normal (kesikli)
  ctx.setLineDash([8 * fs, 6 * fs]); ctx.strokeStyle = 'rgba(160,200,255,0.75)'; ctx.lineWidth = 3 * fs;
  ctx.beginPath(); for (let i = 0; i <= 60; i++) { const u = i / 60; const yy = py + ph - curve(u, ph * 0.95); i ? ctx.lineTo(px + pw * u, yy) : ctx.moveTo(px + pw * u, yy); } ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(160,200,255,0.8)'; ctx.font = `600 ${13 * fs}px Inter`; ctx.textAlign = 'left'; ctx.fillText('NORMAL', px + pw * 0.38, py + 2 * fs);
  // bugün (kırmızı, her saat biraz daha düşük)
  const k = clamp(o.k ?? 1);
  ctx.strokeStyle = '#ff5148'; ctx.lineWidth = 4.5 * fs;
  ctx.beginPath();
  const N = Math.floor(60 * k);
  for (let i = 0; i <= N; i++) { const u = i / 60; const amp = ph * 0.95 * (0.62 - 0.2 * u); const yy = py + ph - curve(u, amp); i ? ctx.lineTo(px + pw * u, yy) : ctx.moveTo(px + pw * u, yy); }
  ctx.stroke();
  if (k > 0.55) {
    ctx.globalAlpha = clamp((k - 0.55) / 0.2);
    ctx.fillStyle = '#ff5148'; ctx.font = `700 ${40 * fs}px Oswald`; ctx.textAlign = 'right';
    ctx.fillText('%52 ↓', px + pw - 4 * fs, py + ph * 0.32);
    ctx.font = `600 ${13 * fs}px Inter`; ctx.fillText('BUGÜN · AÇIK HAVA', px + pw - 4 * fs, py + ph * 0.5);
    ctx.globalAlpha = 1;
  }
}

// ---------- Park (sabah koşusu)
function bareTree(ctx, x, y, s, seed) {
  const R = mulberry32(seed);
  ctx.strokeStyle = '#3a3f4a'; ctx.lineCap = 'round';
  const br = (bx, by, a, len, w, d) => {
    if (d === 0 || len < 8) return;
    const ex = bx + Math.cos(a) * len, ey = by + Math.sin(a) * len;
    ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.stroke();
    br(ex, ey, a - 0.35 - R() * 0.3, len * 0.72, w * 0.68, d - 1);
    br(ex, ey, a + 0.35 + R() * 0.3, len * 0.72, w * 0.68, d - 1);
  };
  br(x, y, -Math.PI / 2, 150 * s, 16 * s, 6);
}
function drawPark(ctx, t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#aab6c6'); g.addColorStop(0.55, '#d6dce4'); g.addColorStop(1, '#c7ced8');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  paleSun(ctx, 780, 420, 48, 1);
  ankaraSkyline(ctx, 980, { ax: 260, ah: 320, far: '#b3bccb', near: '#9aa5b6', seed: 21 });
  ctx.fillStyle = '#dfe5ec'; ctx.fillRect(0, 960, W, H);
  // buz tutmuş havuz
  ctx.fillStyle = '#b9d3e6'; ctx.beginPath(); ctx.ellipse(540, 1260, 430, 120, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 3;
  [[300, 1220, 420, 1290], [420, 1290, 520, 1240], [600, 1300, 760, 1250], [700, 1230, 820, 1280]].forEach(([a, b, c, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); });
  ctx.strokeStyle = '#eef3f8'; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(540, 1260, 430, 120, 0, 0, Math.PI * 2); ctx.stroke();
  // çıplak ağaçlar (kuş yok)
  bareTree(ctx, 140, 1060, 1.3, 3); bareTree(ctx, 930, 1050, 1.2, 8); bareTree(ctx, 520, 1000, 0.8, 5);
  // koşan kahraman
  const rx = o.runX ?? (300 + ((t * 70) % 500));
  drawPerson(ctx, rx, 1560, 1.15, { who: 'kahraman', face: 1, t, step: t * 9, brow: 'endise', seed: 6 });
  for (let i = 0; i < 2; i++) {
    const ph = (t * 1.3 + i * 0.5) % 1;
    ctx.fillStyle = `rgba(250,252,255,${0.5 * (1 - ph)})`;
    ctx.beginPath(); ctx.ellipse(rx + 70 + ph * 50, 1240 - ph * 30, 12 + ph * 26, 8 + ph * 16, 0, 0, Math.PI * 2); ctx.fill();
  }
}

// ---------- Kafe (öğlen)
function drawCafe(ctx, t, o = {}) {
  ctx.fillStyle = '#6b5a4c'; ctx.fillRect(0, 0, W, H);
  // büyük vitrin camı, dışarıda soğuk sokak
  const wx = 40, wy = 280, ww = 1000, wh = 640;
  const sg = ctx.createLinearGradient(0, wy, 0, wy + wh);
  sg.addColorStop(0, '#b6c2d3'); sg.addColorStop(1, '#d4d9e1'); ctx.fillStyle = sg; ctx.fillRect(wx, wy, ww, wh);
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
  paleSun(ctx, 850, 380, 30, 0.8);
  ankaraSkyline(ctx, wy + wh - 60, { ax: 300, ah: 260, far: '#a9b3c3', near: '#8b97aa', seed: 31 });
  for (let i = 0; i < 4; i++) {   // atkılı yayalar
    const px = ((t * 40 + i * 260) % 1200) - 60;
    drawPerson(ctx, px, wy + wh + 10, 0.5, { who: ['kisi1', 'kisi2', 'kisi3', 'kisi1'][i], face: 1, t, step: t * 6 + i, seed: i, coat: ['#5a6b7d', '#6f5b4b', '#4b5b6b', '#7a6b5b'][i] });
  }
  ctx.restore();
  frostEdges(ctx, wx, wy, ww, wh, 0.6, 19);
  ctx.strokeStyle = '#3d3029'; ctx.lineWidth = 16; ctx.strokeRect(wx, wy, ww, wh);
  ctx.fillStyle = 'rgba(255,190,120,0.08)'; ctx.fillRect(0, 0, W, H);
  if (o.tv) {   // köşedeki TV
    const tx = 600, ty = 300, tw = 420, th = 250;
    ctx.fillStyle = '#0b0c10'; rr(ctx, tx - 10, ty - 10, tw + 20, th + 20, 10); ctx.fill();
    drawNews(ctx, tx, ty, tw, th, t, o.tv);
  }
  // masalar
  ctx.fillStyle = '#4a3a2f'; ctx.fillRect(0, 1360, W, 560);
  ctx.fillStyle = '#8a6a4d'; rr(ctx, 80, 1270, 520, 40, 10); ctx.fill();
  ctx.fillStyle = '#8a6a4d'; rr(ctx, 640, 1250, 400, 40, 10); ctx.fill();
  // yan masa: gülen iki kişi
  const laugh = o.laugh ? 1 : 0;
  drawPerson(ctx, 720, 1390, 1.0, { who: 'kisi1', face: 0.6, t, noLegs: true, mouth: laugh ? 'o' : 'cizgi', brow: 'notr', seed: 11 });
  drawPerson(ctx, 930, 1390, 1.0, { who: 'kisi2', face: -0.6, t, noLegs: true, mouth: laugh ? 'o' : 'cizgi', seed: 12 });
  ctx.fillStyle = '#8a6a4d'; rr(ctx, 640, 1250, 400, 40, 10); ctx.fill();
  // kahraman + dizüstü
  drawPerson(ctx, 300, 1400, 1.2, { who: 'kahraman', face: 0.7, t, noLegs: true, brow: o.brow ?? 'notr', eyes: o.eyes ?? 'nokta', mouth: 'cizgi', seed: 13 });
  ctx.fillStyle = '#c9ccd2'; ctx.beginPath(); ctx.moveTo(330, 1268); ctx.lineTo(560, 1268); ctx.lineTo(540, 1130); ctx.lineTo(350, 1130); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(180,215,255,0.35)'; ctx.beginPath(); ctx.moveTo(360, 1255); ctx.lineTo(530, 1255); ctx.lineTo(515, 1142); ctx.lineTo(372, 1142); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#8a6a4d'; rr(ctx, 80, 1270, 520, 40, 10); ctx.fill();
  ctx.fillStyle = '#f2efe8'; rr(ctx, 140, 1226, 44, 40, 8); ctx.fill();
}

// ---------- Eczane tabelası (13.00 · 0°C)
function drawPharmacy(ctx, t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#b4bfcd'); g.addColorStop(1, '#d9dee5'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  paleSun(ctx, 860, 300, 36, 0.9);
  ctx.fillStyle = '#8c939e'; ctx.fillRect(0, 380, W, 1200);
  ctx.fillStyle = '#7b828d';
  for (let y = 420; y < 1500; y += 170) for (let x = 40; x < W; x += 210) ctx.fillRect(x, y, 140, 110);
  // tabela
  ctx.fillStyle = '#f4f4f2'; rr(ctx, 120, 520, 840, 230, 20); ctx.fill();
  ctx.fillStyle = '#d32f2f'; rr(ctx, 150, 550, 170, 170, 18); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '700 150px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('E', 235, 640);
  ctx.fillStyle = '#d32f2f'; ctx.font = '700 120px Oswald'; ctx.fillText('ECZANE', 630, 640);
  // LED ekran: 13:00 / 0°C dönüşümlü
  ctx.fillStyle = '#111'; rr(ctx, 300, 800, 480, 190, 14); ctx.fill();
  const show = Math.floor((o.lt ?? t) / 1.4) % 2 === 0 ? '13:00' : '0°C';
  ctx.fillStyle = '#ff3b2f'; ctx.shadowColor = '#ff3b2f'; ctx.shadowBlur = 24;
  ctx.font = '700 150px Oswald'; ctx.fillText(show, 540, 898);
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#c9ced6'; ctx.fillRect(0, 1500, W, 420);
  for (let i = 0; i < 3; i++) {
    const px = ((t * 55 + i * 380) % 1300) - 100;
    drawPerson(ctx, px, 1720, 0.95, { who: ['kisi2', 'kisi3', 'kisi1'][i], face: 1, t, step: t * 7 + i, seed: 20 + i, coat: ['#4d5a6b', '#6b4d4d', '#4d6b5a'][i] });
  }
}

// ---------- Dünya küresi: aynı anda soğuma
function drawGlobeCold(ctx, t, k) {
  ctx.fillStyle = '#0a1222'; ctx.fillRect(0, 0, W, H);
  const cx = 540, cy = 900, R = 360;
  const g = ctx.createRadialGradient(cx - 120, cy - 120, 40, cx, cy, R);
  g.addColorStop(0, '#2b5a8f'); g.addColorStop(1, '#0f2747');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
  const blobs = [[-0.42, -0.28, 0.3, 0.22], [0.0, -0.35, 0.22, 0.16], [0.38, -0.22, 0.34, 0.24], [-0.48, 0.25, 0.18, 0.3], [0.2, 0.22, 0.22, 0.2], [0.48, 0.42, 0.16, 0.1]];
  const names = ['AMERİKA', 'AVRUPA', 'ASYA', '', 'AFRİKA', ''];
  blobs.forEach(([a, b, rw, rh], i) => {
    ctx.fillStyle = mix('#5c7a52', '#d6ecff', clamp(k * 1.4 - i * 0.04));
    ctx.beginPath(); ctx.ellipse(cx + a * R, cy + b * R, rw * R, rh * R, 0.3 * i, 0, Math.PI * 2); ctx.fill();
  });
  ctx.restore();
  ctx.strokeStyle = 'rgba(180,220,255,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = `rgba(200,235,255,${0.5 * k})`; ctx.font = '700 40px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  [['AMERİKA', -0.45, -0.3], ['AVRUPA', 0.0, -0.36], ['ASYA', 0.4, -0.22]].forEach(([n, a, b]) => ctx.fillText(n, cx + a * R, cy + b * R));
  void names;
}

// ---------- Bölünmüş ekran telefon görüşmesi
function drawSplitCall(ctx, t, o = {}) {
  const half = 960;
  // üst: sen (Ankara, sokakta)
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, half); ctx.clip();
  const g = ctx.createLinearGradient(0, 0, 0, half);
  g.addColorStop(0, '#b0bccd'); g.addColorStop(1, '#d4dae3'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, half);
  ankaraSkyline(ctx, half - 120, { ax: 820, ah: 320, far: '#a7b1c2', near: '#87929f', seed: 41 });
  ctx.fillStyle = '#c3c9d2'; ctx.fillRect(0, half - 120, W, 120);
  drawPerson(ctx, 470, half + 260, 1.6, { who: 'kahraman', face: 1, t, noLegs: true, arm: 'tut', hand: [560, half - 470], brow: o.myBrow ?? 'endise', seed: 2 });
  ctx.fillStyle = '#111317'; rr(ctx, 540, half - 520, 40, 76, 10); ctx.fill();
  ctx.restore();
  // alt: arayan (çiftlik ya da ofis)
  ctx.save(); ctx.beginPath(); ctx.rect(0, half, W, H - half); ctx.clip();
  if (o.who === 'cinar') {
    ctx.fillStyle = '#3d4552'; ctx.fillRect(0, half, W, H - half);
    for (let i = 0; i < 2; i++) {   // CAD ekranları
      const mx = 90 + i * 260, my = half + 220;
      ctx.fillStyle = '#111'; rr(ctx, mx, my, 230, 150, 8); ctx.fill();
      ctx.strokeStyle = 'rgba(120,200,255,0.7)'; ctx.lineWidth = 2;
      ctx.strokeRect(mx + 30, my + 30, 80, 60); ctx.beginPath(); ctx.arc(mx + 160, my + 75, 34, 0, Math.PI * 2); ctx.stroke();
    }
    drawPerson(ctx, 760, H + 220, 1.6, { who: 'cinar', face: -1, t, noLegs: true, arm: 'tut', hand: [680, half + 480], mouth: o.talk ? 'konus' : 'cizgi', talk: o.talk ?? 0, brow: 'endise', seed: 5 });
    ctx.fillStyle = '#111317'; rr(ctx, 640, half + 440, 40, 76, 10); ctx.fill();
  } else {
    const g2 = ctx.createLinearGradient(0, half, 0, H);
    g2.addColorStop(0, '#a9b6c6'); g2.addColorStop(1, '#e3e8ee'); ctx.fillStyle = g2; ctx.fillRect(0, half, W, H - half);
    paleSun(ctx, 860, half + 150, 30, 0.85);
    drawTurbine(ctx, 160, half + 520, 0.55, t * 1.4);
    drawTurbine(ctx, 330, half + 500, 0.45, t * 1.4 + 1);
    ctx.fillStyle = '#eef2f6'; ctx.fillRect(0, half + 560, W, 400);
    for (let i = 0; i < 4; i++) {   // güneş panelleri
      ctx.save(); ctx.translate(560 + i * 120, half + 640); ctx.transform(1, 0, -0.35, 1, 0, 0);
      ctx.fillStyle = '#1f3a66'; ctx.fillRect(0, 0, 100, 60);
      ctx.strokeStyle = 'rgba(200,220,255,0.5)'; ctx.lineWidth = 2; for (let gx = 0; gx <= 100; gx += 25) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, 60); ctx.stroke(); }
      ctx.restore();
    }
    drawPerson(ctx, 470, H + 220, 1.6, { who: 'aras', face: 1, t, noLegs: true, arm: 'tut', hand: [560, half + 480], mouth: o.talk ? 'konus' : 'cizgi', talk: o.talk ?? 0, brow: 'endise', seed: 7 });
    ctx.fillStyle = '#111317'; rr(ctx, 540, half + 440, 40, 76, 10); ctx.fill();
  }
  ctx.restore();
  ctx.fillStyle = '#0b0d12'; ctx.fillRect(0, half - 5, W, 10);
  // arama çipi
  ctx.fillStyle = 'rgba(10,14,22,0.85)'; rr(ctx, 360, half - 34, 360, 68, 34); ctx.fill();
  ctx.fillStyle = o.who === 'cinar' ? '#ffa94d' : '#4fd1c5'; ctx.beginPath(); ctx.arc(396, half, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '700 32px Oswald'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const sec = Math.max(0, Math.floor(o.callT ?? 0));
  ctx.fillText(`${o.who === 'cinar' ? 'ÇINAR' : 'ARAS'}  ·  00:${String(sec).padStart(2, '0')}`, 420, half + 2);
}

// ---------- Rüzgâr türbini
function drawTurbine(ctx, x, y, s, a) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#eef1f5'; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(10, 0); ctx.lineTo(5, -420); ctx.lineTo(-5, -420); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#dfe4ea'; rr(ctx, -16, -438, 40, 22, 8); ctx.fill();
  ctx.translate(0, -428);
  for (let i = 0; i < 3; i++) {
    ctx.save(); ctx.rotate(a + i * Math.PI * 2 / 3);
    ctx.fillStyle = '#f6f8fa'; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.quadraticCurveTo(-14, -120, -2, -230); ctx.lineTo(4, -230); ctx.quadraticCurveTo(10, -120, 6, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = '#c9ced6'; ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ---------- Çiftlik (Kızılcahamam)
function pineTree(ctx, x, y, s) {
  ctx.fillStyle = '#2f4a3e';
  for (let i = 0; i < 3; i++) {
    const w = (70 - i * 16) * s, yy = y - i * 46 * s;
    ctx.beginPath(); ctx.moveTo(x - w, yy); ctx.lineTo(x + w, yy); ctx.lineTo(x, yy - 80 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#eef3f6';
    ctx.beginPath(); ctx.moveTo(x - w * 0.45, yy - 40 * s); ctx.lineTo(x, yy - 80 * s); ctx.lineTo(x + w * 0.45, yy - 40 * s); ctx.quadraticCurveTo(x, yy - 30 * s, x - w * 0.45, yy - 40 * s); ctx.fill();
    ctx.fillStyle = '#2f4a3e';
  }
  ctx.fillStyle = '#4a3a2c'; ctx.fillRect(x - 6 * s, y, 12 * s, 20 * s);
}
function drawFarm(ctx, t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#a3b0c2'); g.addColorStop(0.5, '#cfd6df'); g.addColorStop(1, '#e9edf1');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  paleSun(ctx, 820, 360, 40, 0.9);
  // tepeler
  ctx.fillStyle = '#c3ccd6'; ctx.beginPath(); ctx.moveTo(0, 900); ctx.quadraticCurveTo(300, 700, 620, 820); ctx.quadraticCurveTo(860, 900, W, 780); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  drawTurbine(ctx, 330, 790, 0.62, t * 1.2);
  drawTurbine(ctx, 520, 810, 0.55, t * 1.2 + 0.8);
  drawTurbine(ctx, 720, 800, 0.6, t * 1.2 + 1.7);
  ctx.fillStyle = '#e4e9ee'; ctx.beginPath(); ctx.moveTo(0, 1040); ctx.quadraticCurveTo(540, 960, W, 1050); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  for (let i = 0; i < 9; i++) pineTree(ctx, 40 + i * 130, 1060 + (i % 2) * 30, 0.9);
  // cam sera (sıcak ışık)
  ctx.fillStyle = 'rgba(255,214,150,0.55)'; ctx.beginPath(); ctx.moveTo(90, 1420); ctx.lineTo(90, 1300); ctx.lineTo(260, 1220); ctx.lineTo(430, 1300); ctx.lineTo(430, 1420); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#eef2f5'; ctx.lineWidth = 5; ctx.stroke();
  for (let x = 130; x < 430; x += 50) { ctx.beginPath(); ctx.moveTo(x, 1420); ctx.lineTo(x, 1300 - (x < 260 ? (x - 90) * 0.47 : (430 - x) * 0.47)); ctx.stroke(); }
  // depo (soğuk hava deposu)
  ctx.fillStyle = '#f1f3f5'; ctx.fillRect(470, 1250, 330, 170);
  ctx.fillStyle = '#d6dbe1'; ctx.fillRect(470, 1240, 330, 16);
  ctx.fillStyle = '#5b6573'; ctx.font = '700 30px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('DEPO', 635, 1320);
  ctx.fillStyle = '#9aa3ad'; ctx.fillRect(600, 1350, 70, 70);
  // taş ev + baca dumanı
  ctx.fillStyle = '#8a8178'; ctx.fillRect(830, 1260, 220, 160);
  ctx.fillStyle = '#5e4e44'; ctx.beginPath(); ctx.moveTo(815, 1265); ctx.lineTo(940, 1180); ctx.lineTo(1065, 1265); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffcf8a'; ctx.fillRect(870, 1310, 50, 50); ctx.fillRect(960, 1310, 50, 50);
  ctx.fillStyle = '#6a5d55'; ctx.fillRect(990, 1180, 26, 60);
  for (let i = 0; i < 4; i++) {
    const ph = (t * 0.25 + i / 4) % 1;
    ctx.fillStyle = `rgba(235,238,242,${0.5 * (1 - ph)})`; ctx.beginPath(); ctx.ellipse(1003 + ph * 40, 1170 - ph * 200, 14 + ph * 34, 12 + ph * 26, 0, 0, Math.PI * 2); ctx.fill();
  }
  // termal kuyu buharı
  ctx.fillStyle = '#7a8a94'; ctx.beginPath(); ctx.ellipse(300, 1560, 120, 34, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#9fd0e0'; ctx.beginPath(); ctx.ellipse(300, 1556, 100, 24, 0, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 6; i++) {
    const ph = (t * 0.3 + i / 6) % 1;
    ctx.fillStyle = `rgba(245,248,252,${0.45 * (1 - ph)})`;
    ctx.beginPath(); ctx.ellipse(300 + Math.sin(t + i) * 30 + ph * 20, 1540 - ph * 320, 30 + ph * 70, 22 + ph * 50, 0, 0, Math.PI * 2); ctx.fill();
  }
  // tabela
  ctx.fillStyle = '#2d3a2f'; rr(ctx, 560, 1500, 440, 120, 14); ctx.fill();
  ctx.fillStyle = '#e8f2e8'; ctx.font = '700 44px Oswald'; ctx.fillText('FİLİZ TARIM', 780, 1545);
  ctx.font = '600 26px Inter'; ctx.fillStyle = 'rgba(232,242,232,0.8)'; ctx.fillText('DENEME ÇİFTLİĞİ · KIZILCAHAMAM', 780, 1590);
  ctx.fillStyle = '#4a3a2c'; ctx.fillRect(600, 1620, 14, 120); ctx.fillRect(946, 1620, 14, 120);
}

// ---------- Fotoğraf: üç kurucu
function drawPhoto3(ctx, t, o = {}) {
  ctx.fillStyle = '#3a3330'; ctx.fillRect(0, 0, W, H);
  const fx = 110, fy = 420, fw = 860, fh = 980;
  ctx.save(); ctx.translate(540, 910); ctx.rotate(-0.025); ctx.translate(-540, -910);
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 40;
  ctx.fillStyle = '#e9e2d4'; ctx.fillRect(fx, fy, fw, fh);
  ctx.shadowColor = 'transparent';
  ctx.save(); ctx.beginPath(); ctx.rect(fx + 40, fy + 40, fw - 80, fh - 220); ctx.clip();
  const g = ctx.createLinearGradient(0, fy, 0, fy + fh);
  g.addColorStop(0, '#9cc7e8'); g.addColorStop(1, '#d8eccf'); ctx.fillStyle = g; ctx.fillRect(fx, fy, fw, fh);
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.moveTo(fx + 40, fy + 520); ctx.lineTo(fx + 430, fy + 300); ctx.lineTo(fx + 820, fy + 520); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5e8f4e'; ctx.fillRect(fx + 40, fy + 700, fw - 80, 200);
  ctx.fillStyle = '#2d5a3a'; rr(ctx, fx + 250, fy + 90, 360, 90, 12); ctx.fill();
  ctx.fillStyle = '#e8f6e8'; ctx.font = '700 64px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('FİLİZ', fx + 430, fy + 137);
  drawPerson(ctx, fx + 230, fy + 900, 1.25, { who: 'aras', face: 0.3, t: 0, mouth: 'yukari', seed: 1 });
  drawPerson(ctx, fx + 430, fy + 910, 1.3, { who: 'kahraman', face: 0, t: 0, mouth: 'yukari', seed: 2 });
  drawPerson(ctx, fx + 630, fy + 900, 1.25, { who: 'cinar', face: -0.3, t: 0, mouth: 'yukari', seed: 3 });
  ctx.restore();
  ctx.fillStyle = '#5a4a3a'; ctx.font = '600 56px Caveat'; ctx.textAlign = 'center';
  ctx.fillText('Filiz ekibi · ilk sera · 2021', fx + fw / 2, fy + fh - 110);
  ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,225,180,0.25)'; ctx.fillRect(0, 0, W, H); ctx.restore();
}

// ---------- Kapı: Çınar elinde poşetler ve düdüklü tencere
function drawDoorway(ctx, t, o = {}) {
  ctx.fillStyle = '#2b2622'; ctx.fillRect(0, 0, W, H);
  // koridor ışığı
  const g = ctx.createLinearGradient(0, 300, 0, 1700);
  g.addColorStop(0, '#d8cdb8'); g.addColorStop(1, '#a89c88');
  ctx.fillStyle = g; ctx.fillRect(250, 300, 580, 1400);
  ctx.fillStyle = '#6a4b35'; ctx.fillRect(800, 300, 40, 1400);
  ctx.fillStyle = '#5a3d2a'; ctx.save(); ctx.translate(840, 300); ctx.transform(1, 0.12, 0, 1, 0, 0); ctx.fillRect(0, 0, 200, 1400); ctx.restore();
  drawPerson(ctx, 540, 1700, 1.6, { who: 'cinar', face: 0, t, arm: 'canta', mouth: o.talk ? 'konus' : 'yukari', talk: o.talk ?? 0, brow: 'notr', seed: 9 });
  // sol elde düdüklü tencere
  ctx.fillStyle = '#c9ccd2'; rr(ctx, 330, 1380, 140, 90, 14); ctx.fill();
  ctx.fillStyle = '#2b2d33'; ctx.fillRect(320, 1372, 160, 14); ctx.fillRect(450, 1366, 60, 12);
  // omuzlarda kar
  ctx.fillStyle = 'rgba(250,252,255,0.9)';
  [[470, 1270], [610, 1268], [520, 1262], [580, 1264]].forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(x, y, 16, 6, 0, 0, Math.PI * 2); ctx.fill(); });
  ctx.fillStyle = '#fff3c4'; ctx.fillRect(250, 300, 580, 14);
}

// ---------- Akşam sofrası
function drawTable(ctx, t, o = {}) {
  ctx.fillStyle = '#2e2622'; ctx.fillRect(0, 0, W, H);
  // pencere: gece, buz
  const wx = 640, wy = 520, ww = 380, wh = 520;
  ctx.fillStyle = '#0f1a30'; ctx.fillRect(wx, wy, ww, wh);
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
  ankaraSkyline(ctx, wy + wh - 60, { ax: wx + 120, ah: 300, far: '#1b2640', near: '#121a2d', lit: 0.75, seed: 51 });
  ctx.restore();
  frostEdges(ctx, wx, wy, ww, wh, 1, 23);
  ctx.strokeStyle = '#1e1814'; ctx.lineWidth = 16; ctx.strokeRect(wx, wy, ww, wh);
  // sarkıt lamba
  ctx.strokeStyle = '#111'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(420, 0); ctx.lineTo(420, 620); ctx.stroke();
  ctx.fillStyle = '#2b2b2b'; ctx.beginPath(); ctx.moveTo(340, 670); ctx.lineTo(500, 670); ctx.lineTo(450, 620); ctx.lineTo(390, 620); ctx.closePath(); ctx.fill();
  warmGlow(ctx, 420, 760, 700, 0.5, '255,190,110');
  // kişiler
  drawPerson(ctx, 330, 1460, 1.35, { who: 'kahraman', face: 0.5, t, noLegs: true, brow: o.myBrow ?? 'endise', eyes: o.myEyes ?? 'nokta', mouth: o.myMouth ?? 'cizgi', seed: 3 });
  drawPerson(ctx, 800, 1460, 1.35, { who: 'cinar', face: -0.5, t, noLegs: true, brow: o.cBrow ?? 'endise', mouth: o.cTalk ? 'konus' : (o.cMouth ?? 'cizgi'), talk: o.cTalk ?? 0, arm: o.cArm, hand: o.cHand, seed: 4 });
  // masa
  ctx.fillStyle = '#6b4a33'; ctx.fillRect(-20, 1300, W + 40, 620);
  ctx.fillStyle = '#7d5a40'; ctx.fillRect(-20, 1300, W + 40, 26);
  [[330, 1330], [800, 1330]].forEach(([x, y]) => {
    ctx.fillStyle = '#e9e4da'; ctx.beginPath(); ctx.ellipse(x, y, 110, 30, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d98a2b'; ctx.beginPath(); ctx.ellipse(x, y - 4, 80, 18, 0, 0, Math.PI * 2); ctx.fill();
    const ph = (t * 0.5 + x / 1000) % 1;
    ctx.fillStyle = `rgba(250,240,225,${0.35 * (1 - ph)})`; ctx.beginPath(); ctx.ellipse(x + Math.sin(t + x) * 10, y - 40 - ph * 120, 12 + ph * 24, 14 + ph * 20, 0, 0, Math.PI * 2); ctx.fill();
  });
  if (o.tablet !== false) drawTablet(ctx, 565, 1180, 0.8, t, o.tablet ?? { mode: 'video' });
}

// ---------- Hesap defteri (el yazısı)
function drawCalcNote(ctx, t, lines, k) {
  ctx.fillStyle = '#2a211c'; ctx.fillRect(0, 0, W, H);
  warmGlow(ctx, 540, 700, 900, 0.35, '255,190,120');
  const px = 120, py = 340, pw = 840, ph = 1100;
  ctx.save(); ctx.translate(540, 890); ctx.rotate(0.02); ctx.translate(-540, -890);
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30;
  ctx.fillStyle = '#f2ead8'; ctx.fillRect(px, py, pw, ph);
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(90,110,150,0.25)'; ctx.lineWidth = 2;
  for (let y = py + 140; y < py + ph - 40; y += 90) { ctx.beginPath(); ctx.moveTo(px + 30, y + 30); ctx.lineTo(px + pw - 30, y + 30); ctx.stroke(); }
  const total = lines.reduce((a, l) => a + l.replace('!', '').length, 0);
  let shown = Math.floor(total * k), done = 0;
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  lines.forEach((l0, i) => {
    const red = l0.startsWith('!'); const l = red ? l0.slice(1) : l0;
    const n = clamp(shown - done, 0, l.length); done += l.length;
    if (n <= 0) return;
    ctx.fillStyle = red ? '#b3261e' : '#24242a'; ctx.font = `600 ${red ? 84 : 76}px Caveat`;
    ctx.fillText(l.slice(0, n), px + 70, py + 200 + i * 180);
  });
  ctx.restore();
}

// ---------- Seçim ekranı (Gün 1)
function iconMega(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.moveTo(-36, -14); ctx.lineTo(10, -36); ctx.lineTo(10, 36); ctx.lineTo(-36, 14); ctx.closePath(); ctx.fill();
  ctx.fillRect(-50, -14, 16, 28);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(14, 0, 28, -0.6, 0.6); ctx.stroke(); ctx.beginPath(); ctx.arc(14, 0, 44, -0.5, 0.5); ctx.stroke();
  ctx.restore();
}
function iconShh(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(0, 24); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-18, 6); ctx.lineTo(18, 6); ctx.stroke();
  ctx.restore();
}
function drawStageRow9(ctx, x, y, label, filled = 1, col = '#ff6a5e') {
  ctx.save();
  ctx.font = '700 34px Oswald'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + 9, y, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillText(label, x + 28, y + 1);
  let dx = x + 40 + ctx.measureText(label).width;
  for (let i = 0; i < 9; i++) {
    ctx.beginPath(); ctx.arc(dx + i * 22, y, 7, 0, Math.PI * 2);
    if (i < filled) { ctx.fillStyle = col; ctx.fill(); } else { ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 3; ctx.stroke(); }
  }
  ctx.restore();
}
function drawChoiceE1(ctx, t, lt) {
  const k = clamp(lt / 0.5);
  if (k <= 0) return;
  const CX = 520;
  ctx.save(); ctx.globalAlpha = clamp(lt / 0.4);
  drawStageRow9(ctx, 70, 300, 'GÜN 1  ·  KARAR ANI', 1);
  ctx.restore();
  ctx.save();
  const e = easeBack(k);
  ctx.globalAlpha = clamp(k * 2);
  ctx.translate(CX, 730);
  ctx.scale(0.85 + 0.15 * e, 0.85 + 0.15 * e);
  const w = 840, h = 620;
  ctx.shadowColor = 'rgba(0,0,0,0.65)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 20;
  ctx.fillStyle = '#f3ece0'; rr(ctx, -w / 2, -h / 2, w, h, 36); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#c8402f'; ctx.font = '700 42px Oswald';
  ctx.fillText('HENÜZ KİMSE BİLMİYOR.', 0, -232);
  ctx.fillStyle = '#151515'; ctx.font = '700 78px Oswald';
  ctx.fillText('SUSUYOR MUSUN,', 0, -150);
  ctx.fillText('UYARIYOR MUSUN?', 0, -70);
  const btn = (bx, label, col, icon, delay, ph) => {
    const bk = clamp((lt - delay) / 0.3);
    if (bk <= 0) return;
    const pulse = 1 + 0.035 * Math.sin(t * 5 + ph);
    ctx.save(); ctx.translate(bx, 86); ctx.scale(easeBack(bk) * pulse, easeBack(bk) * pulse);
    ctx.shadowColor = col; ctx.shadowBlur = 24 + 16 * Math.max(0, Math.sin(t * 5 + ph));
    ctx.fillStyle = col; rr(ctx, -190, -78, 380, 156, 26); ctx.fill();
    ctx.shadowColor = 'transparent';
    icon(ctx, 0, -28, 0.72);
    ctx.fillStyle = '#fff'; ctx.font = '700 46px Oswald'; ctx.fillText(label, 0, 44);
    ctx.restore();
  };
  btn(-200, 'SESSİZ KAL', '#2f6fb3', iconShh, 0.35, 0);
  btn(200, 'HERKESİ UYAR', '#d9673a', iconMega, 0.55, Math.PI);
  ctx.fillStyle = '#4a4a4a'; ctx.font = '600 24px Oswald';
  ctx.fillText('SESSİZ KAL: RAFLAR DOLU, KİMSE PANİK YAPMIYOR', 0, 214);
  ctx.fillText('UYAR: BİRKAÇ KİŞİ KURTULUR, PANİĞİ SEN BAŞLATIRSIN', 0, 252);
  ctx.restore();
  const ck = clamp((lt - 0.9) / 0.35);
  if (ck > 0) {
    ctx.save(); ctx.globalAlpha = ck;
    const bob = Math.sin(t * 6) * 10;
    ctx.translate(CX, 1140);
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
    ctx.save(); ctx.globalAlpha = fk; ctx.translate(CX, 1272);
    ctx.fillStyle = '#ffc83d'; rr(ctx, -320, -40, 640, 80, 40); ctx.fill();
    ctx.fillStyle = '#141414'; ctx.font = '700 36px Oswald'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('2. GÜN: EKSİ ON. TAKİP ET', 0, 2);
    ctx.restore();
  }
}

// ---------- Üst bilgi (Eksi Seksen)
function drawHUDE(ctx, t, st) {
  if (!st) return;
  ctx.save();
  const x = 60, y = 262;
  drawStageRow9(ctx, x, y + 14, st.stage ?? 'GÜN 1 / 9', st.filled ?? 1);
  ctx.font = '700 98px Oswald'; ctx.fillStyle = '#ffffff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 16;
  ctx.fillText(st.clock, x - 4, y + 96);
  const cw = ctx.measureText(st.clock).width;
  // sıcaklık
  ctx.font = '700 78px Oswald'; ctx.fillStyle = '#a8dcff';
  ctx.fillText(st.temp ?? '0°C', x + cw + 34, y + 100);
  ctx.shadowColor = 'transparent';
  ctx.font = '800 21px Inter'; ctx.fillStyle = 'rgba(225,232,244,0.9)';
  ctx.fillText(st.place ?? 'ÇANKAYA  ·  ANKARA', x, y + 160);
  let cx = x;
  (st.chips ?? []).forEach(c => { cx += chip(ctx, cx, y + 186, c.text, c.col, { icon: c.icon }) + 12; });
  ctx.restore();
}
