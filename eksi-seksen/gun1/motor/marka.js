// Tuhaf Saat Hikâyeleri — profil fotoğrafı (mumlu kapüşonlu anlatıcı) ve Gece 1 kapağı
'use strict';

function drawPP(ctx, S = 1080) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // gece mavisi zemin, ortada hafif ışık
  const g = ctx.createRadialGradient(S * 0.5, S * 0.46, 30, S * 0.5, S * 0.5, S * 0.7);
  g.addColorStop(0, '#26306a'); g.addColorStop(0.55, '#161c40'); g.addColorStop(1, '#090c1e');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  const cx = S * 0.5;
  const fx = S * 0.61, fy = S * 0.545;          // mum alevi
  // mum ışığı hâlesi
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const hg = ctx.createRadialGradient(fx, fy, 0, fx, fy, S * 0.36);
  hg.addColorStop(0, 'rgba(255,196,120,0.42)'); hg.addColorStop(0.4, 'rgba(255,170,90,0.14)'); hg.addColorStop(1, 'rgba(255,160,80,0)');
  ctx.fillStyle = hg; ctx.fillRect(0, 0, S, S); ctx.restore();
  // cüppe (iki tonlu)
  ctx.fillStyle = '#3b2b62';
  ctx.beginPath(); ctx.moveTo(cx - 120, S * 0.6); ctx.quadraticCurveTo(cx - 200, S * 0.78, cx - 250, S * 1.02);
  ctx.lineTo(cx + 250, S * 1.02); ctx.quadraticCurveTo(cx + 200, S * 0.78, cx + 120, S * 0.6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2d2150';
  ctx.beginPath(); ctx.moveTo(cx + 18, S * 0.62); ctx.lineTo(cx + 34, S * 1.02); ctx.lineTo(cx + 250, S * 1.02); ctx.quadraticCurveTo(cx + 200, S * 0.78, cx + 120, S * 0.6); ctx.closePath(); ctx.fill();
  // kapüşon
  ctx.fillStyle = '#44336f';
  ctx.beginPath(); ctx.ellipse(cx, S * 0.425, 180, 200, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3a2b61';
  ctx.beginPath(); ctx.ellipse(cx + 40, S * 0.44, 140, 182, 0, -0.6, 1.6); ctx.fill();
  ctx.fillStyle = '#17112b';
  ctx.beginPath(); ctx.ellipse(cx, S * 0.445, 128, 136, 0, 0, Math.PI * 2); ctx.fill();
  // yüz
  ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.ellipse(cx, S * 0.452, 104, 110, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // sinsi bakış: içe eğik kaşlar, nokta gözler, yan gülümseme
  ctx.fillStyle = INK; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.ellipse(cx - 36, S * 0.448, 10, 13, 0, 0, Math.PI * 2); ctx.ellipse(cx + 36, S * 0.448, 10, 13, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(cx - 62, S * 0.398); ctx.lineTo(cx - 20, S * 0.414); ctx.moveTo(cx + 20, S * 0.414); ctx.lineTo(cx + 62, S * 0.398); ctx.stroke();
  ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(cx - 30, S * 0.5); ctx.quadraticCurveTo(cx + 2, S * 0.528, cx + 36, S * 0.494); ctx.stroke();
  // kol ve el, mum
  ctx.strokeStyle = '#120d20'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(cx + 30, S * 0.72); ctx.quadraticCurveTo(cx + 70, S * 0.7, fx - 6, S * 0.682); ctx.stroke();
  ctx.fillStyle = '#efe6cf'; rr(ctx, fx - 20, fy + 20, 40, 118, 9); ctx.fill();
  ctx.strokeStyle = '#cfc4a8'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#efe6cf'; ctx.beginPath(); ctx.ellipse(fx - 8, fy + 24, 8, 14, 0, 0, Math.PI * 2); ctx.fill();   // eriyen mum
  ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(fx, S * 0.686, 27, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // alev
  const fl = ctx.createRadialGradient(fx, fy - 6, 0, fx, fy - 6, 40);
  fl.addColorStop(0, '#fff7d6'); fl.addColorStop(0.45, '#ffcf5e'); fl.addColorStop(1, 'rgba(255,140,40,0)');
  ctx.fillStyle = fl; ctx.beginPath(); ctx.ellipse(fx, fy - 4, 22, 42, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.ellipse(fx, fy + 2, 8, 17, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2a2116'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(fx, fy + 14); ctx.lineTo(fx, fy + 22); ctx.stroke();
  // yüzde mum yansıması
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const rg = ctx.createRadialGradient(cx + 70, S * 0.47, 0, cx + 70, S * 0.47, 120);
  rg.addColorStop(0, 'rgba(255,190,110,0.16)'); rg.addColorStop(1, 'rgba(255,190,110,0)');
  ctx.fillStyle = rg; ctx.fillRect(cx - 60, S * 0.32, 260, 300); ctx.restore();
  ctx.restore();
}

function drawCover(ctx) {
  // Kapak: GÜN 1 · EKSİ SEKSEN (buz tutmuş camdan soluk güneşli Ankara)
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawAnkaraView(ctx, 0, 0, W, H, 2.0, { horizon: 0.6, ax: 0.32, kx: 0.74, ah: 0.46, seed: 5, count: 7, sunX: 0.72, sunY: 0.2, sunR: 70 });
  frostEdges(ctx, 0, 0, W, H, 2.4, 31);
  coldGrade(ctx, 0.8);
  const gr = ctx.createLinearGradient(0, 1100, 0, 1920);
  gr.addColorStop(0, 'rgba(5,10,22,0)'); gr.addColorStop(0.35, 'rgba(5,10,22,0.6)'); gr.addColorStop(1, 'rgba(5,10,22,0.9)');
  ctx.fillStyle = gr; ctx.fillRect(0, 1100, W, 820);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const title = (txt, y, size, col) => {
    ctx.font = `700 ${size}px Oswald`; ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(4,6,12,0.95)';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 20; ctx.strokeText(txt, W / 2, y); ctx.shadowColor = 'transparent';
    ctx.fillStyle = col; ctx.fillText(txt, W / 2, y);
  };
  title('GÜN 1  ·  −1°C', 1282, 64, '#ffffff');
  title('EKSİ', 1420, 160, '#ffffff');
  title('SEKSEN', 1585, 170, '#a8dcff');
  ctx.restore();
}

// ---------------------------------------------------------------- Buz Kıyameti profil fotoğrafı
// Yalnızca buzlu, kalın yazı ve yağan kar. Dairesel kırpmaya göre ortada, kenarlardan içeride.
function drawPPBuz(ctx, S = 1080) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  let sd = 11;
  const R = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  // zemin: koyu buz mavisi, ortada soğuk ışık
  const bg = ctx.createRadialGradient(S * 0.5, S * 0.42, 30, S * 0.5, S * 0.5, S * 0.8);
  bg.addColorStop(0, '#1a4380'); bg.addColorStop(0.5, '#0b2252'); bg.addColorStop(1, '#030914');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const gl = ctx.createRadialGradient(S * 0.5, S * 0.5, 0, S * 0.5, S * 0.5, S * 0.55);
  gl.addColorStop(0, 'rgba(110,190,255,0.30)'); gl.addColorStop(1, 'rgba(110,190,255,0)');
  ctx.fillStyle = gl; ctx.fillRect(0, 0, S, S); ctx.restore();

  // kar: yağış izli yuvarlak taneler ve altıgen kar tanesi
  const dots = (n, rMin, rMax, aMin, aMax, soft) => {
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const x = R() * S, y = R() * S, r = rMin + (rMax - rMin) * R() ** 1.6, a = aMin + (aMax - aMin) * R();
      if (soft) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(235,247,255,${a})`); g.addColorStop(1, 'rgba(235,247,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.strokeStyle = `rgba(235,247,255,${a * 0.35})`; ctx.lineWidth = r * 1.4;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + r * 1.1, y - r * 4.5); ctx.stroke();
        ctx.fillStyle = `rgba(245,251,255,${a})`; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  };
  const flake = (x, y, r, a, lw) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(R() * Math.PI); ctx.globalAlpha = a;
    ctx.strokeStyle = '#f2faff'; ctx.lineWidth = lw; ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(160,215,255,0.9)'; ctx.shadowBlur = 8;
    for (let k = 0; k < 6; k++) {
      ctx.save(); ctx.rotate(k * Math.PI / 3);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r);
      ctx.moveTo(0, -r * 0.55); ctx.lineTo(-r * 0.27, -r * 0.82); ctx.moveTo(0, -r * 0.55); ctx.lineTo(r * 0.27, -r * 0.82);
      ctx.stroke(); ctx.restore();
    }
    ctx.restore();
  };
  dots(110, 1.4, 4, 0.25, 0.6, false);   // uzak kar
  dots(16, 12, 26, 0.12, 0.3, true);     // bulanık, yakın kar

  // ---- yazı
  const B = 16;       // kalınlaştırma (çizgi payı)
  const D = 26;       // buz bloğu derinliği
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round'; ctx.miterLimit = 2;
  const info = [['BUZ', 720], ['KIYAMETİ', 748]].map(([txt, w]) => {
    ctx.font = '700 200px Oswald';
    const size = 200 * (w - B) / ctx.measureText(txt).width;
    ctx.font = `700 ${size}px Oswald`;
    return { txt, size, capH: ctx.measureText('H').actualBoundingBoxAscent };
  });
  const gap = 104, ice = 84;
  const total = info[0].capH + gap + info[1].capH + D + ice;
  let y = (S - total) / 2 + 6;
  info.forEach(o => { y += o.capH; o.base = y; y += gap; });
  const cx = S / 2;
  const mix = (a, b, f) => { const p = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const A = p(a), Bc = p(b); return '#' + A.map((v, i) => Math.round(v + (Bc[i] - v) * f).toString(16).padStart(2, '0')).join(''); };

  info.forEach((o, li) => {
    ctx.font = `700 ${o.size}px Oswald`;
    const top = o.base - o.capH;
    // dış buz parıltısı
    ctx.save(); ctx.shadowColor = 'rgba(120,205,255,0.9)'; ctx.shadowBlur = 60;
    ctx.fillStyle = ctx.strokeStyle = '#4fa6ee'; ctx.lineWidth = B + 14;
    ctx.strokeText(o.txt, cx, o.base + D / 2); ctx.restore();
    // koyu dış hat ve derinlik
    ctx.strokeStyle = '#04122b'; ctx.lineWidth = B + 18;
    for (let i = D; i >= 0; i -= 2) ctx.strokeText(o.txt, cx, o.base + i);
    ctx.lineWidth = B;
    for (let i = D; i >= 1; i--) {
      const c = mix('#3a8ee0', '#0a2b5e', i / D);
      ctx.fillStyle = ctx.strokeStyle = c;
      ctx.strokeText(o.txt, cx, o.base + i); ctx.fillText(o.txt, cx, o.base + i);
    }
    // ön yüz: ayrı tuvalde buz dokusu
    const tc = document.createElement('canvas'); tc.width = tc.height = S;
    const t = tc.getContext('2d');
    t.textAlign = 'center'; t.lineJoin = 'round'; t.font = ctx.font;
    const fg = t.createLinearGradient(0, top, 0, o.base);
    fg.addColorStop(0, '#ffffff'); fg.addColorStop(0.28, '#e4f8ff'); fg.addColorStop(0.62, '#9bd8ff'); fg.addColorStop(1, '#4fa3ea');
    t.fillStyle = t.strokeStyle = fg; t.lineWidth = B;
    t.strokeText(o.txt, cx, o.base); t.fillText(o.txt, cx, o.base);
    t.globalCompositeOperation = 'source-atop';
    t.strokeStyle = 'rgba(60,140,230,0.9)'; t.lineWidth = 12; t.strokeText(o.txt, cx, o.base);      // iç kenar (eğim)
    t.strokeStyle = 'rgba(255,255,255,0.75)'; t.lineWidth = 3; t.strokeText(o.txt, cx - 1, o.base - 1);
    const sh = t.createLinearGradient(0, top, 0, top + o.capH * 0.3);
    sh.addColorStop(0, 'rgba(255,255,255,0.95)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
    t.fillStyle = sh; t.fillRect(0, top - 70, S, o.capH * 0.3 + 70);
    const bs = t.createLinearGradient(0, o.base - o.capH * 0.4, 0, o.base + 8);
    bs.addColorStop(0, 'rgba(15,80,170,0)'); bs.addColorStop(1, 'rgba(15,80,170,0.42)');
    t.fillStyle = bs; t.fillRect(0, o.base - o.capH * 0.4, S, o.capH * 0.4 + 12);
    for (let k = 0; k < 4; k++) {                                   // çapraz parıltı bantları
      const x0 = 150 + k * 215 + R() * 60, sl = o.capH * 0.55;
      t.fillStyle = `rgba(255,255,255,${0.2 + 0.15 * R()})`;
      t.beginPath(); t.moveTo(x0, top - 40); t.lineTo(x0 + 26 + R() * 18, top - 40); t.lineTo(x0 + 26 - sl, o.base + 40); t.lineTo(x0 - sl, o.base + 40); t.closePath(); t.fill();
    }
    for (let k = 0; k < 300; k++) {                                  // kırağı tanecikleri
      t.fillStyle = `rgba(255,255,255,${0.2 + 0.6 * R()})`;
      t.beginPath(); t.arc(130 + R() * 820, top - 20 + R() * (o.capH + 30), 0.8 + R() * 1.9, 0, Math.PI * 2); t.fill();
    }
    for (let k = 0; k < 7; k++) {                                    // buz çatlakları
      let px = 160 + R() * 760, py = top + R() * o.capH, ang = R() * Math.PI * 2;
      const pts = [[px, py]];
      for (let s = 0; s < 6 + Math.floor(R() * 4); s++) { ang += (R() - 0.5) * 1.5; px += Math.cos(ang) * (16 + R() * 26); py += Math.sin(ang) * (16 + R() * 26); pts.push([px, py]); }
      [['rgba(40,110,195,0.5)', 3.4, 1.5], ['rgba(255,255,255,0.85)', 1.4, 0]].forEach(([c, lw, off]) => {
        t.strokeStyle = c; t.lineWidth = lw; t.beginPath(); pts.forEach(([a, b], i) => i ? t.lineTo(a + off, b + off) : t.moveTo(a + off, b + off)); t.stroke();
      });
    }
    ctx.drawImage(tc, 0, 0);
    // sarkıtlar (yalnız alt satırda)
    if (li === 1) {
      ctx.font = `700 ${o.size}px Oswald`;
      const full = ctx.measureText(o.txt).width, x0 = cx - full / 2;
      const icicle = (x, y0, len, w) => {
        const path = () => { ctx.beginPath(); ctx.moveTo(x - w / 2, y0 - 6); ctx.lineTo(x - w * 0.18, y0 + len * 0.88); ctx.quadraticCurveTo(x, y0 + len * 1.1, x + w * 0.18, y0 + len * 0.88); ctx.lineTo(x + w / 2, y0 - 6); ctx.closePath(); };
        path(); ctx.lineJoin = 'round'; ctx.lineWidth = 9; ctx.strokeStyle = '#04122b'; ctx.stroke();
        const g = ctx.createLinearGradient(0, y0, 0, y0 + len);
        g.addColorStop(0, '#4f9fe6'); g.addColorStop(0.45, '#b9e6ff'); g.addColorStop(1, '#ffffff');
        ctx.fillStyle = g; path(); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x - w * 0.2, y0 + 8); ctx.lineTo(x - w * 0.06, y0 + len * 0.68); ctx.stroke();
      };
      for (let i = 0; i < o.txt.length; i++) {
        const wb = ctx.measureText(o.txt.slice(0, i)).width, wl = ctx.measureText(o.txt[i]).width, xc = x0 + wb + wl / 2;
        if (R() < 0.12) continue;
        const wide = wl > o.size * 0.4;
        (wide ? [-0.24, 0.24] : [0]).forEach(f => icicle(xc + f * wl + (R() - 0.5) * 8, o.base + D - 4, 26 + R() * 56, 14 + R() * 10));
      }
    }
    // parıltı yıldızları
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    [[0.18, 0.3], [0.82, 0.55], [0.5, 0.15]].forEach(([fx, fy]) => {
      const sx = 130 + fx * 820 + (R() - 0.5) * 30, sy = top + fy * o.capH, r = 20 + R() * 16;
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
      g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(sx - r * 1.5, sy); ctx.lineTo(sx + r * 1.5, sy); ctx.moveTo(sx, sy - r * 1.5); ctx.lineTo(sx, sy + r * 1.5); ctx.stroke();
    });
    ctx.restore();
  });

  // ön plandaki kar
  dots(46, 2.2, 6.5, 0.55, 0.95, false);
  const y0 = info[0].base - info[0].capH - 24, y1 = info[1].base + D + ice;
  for (let i = 0, n = 0; i < 400 && n < 12; i++) {                 // büyük taneler yazının dışına düşsün
    const x = R() * S, yy = R() * S, r = 16 + R() * 20, a = 0.55 + R() * 0.4, lw = 2.6 + R() * 1.4;
    if (x > 100 && x < 980 && yy > y0 && yy < y1) continue;
    flake(x, yy, r, a, lw); n++;
  }
  ctx.restore();
}
