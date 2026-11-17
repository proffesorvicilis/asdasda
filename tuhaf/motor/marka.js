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
  // Kapak: GECE 1 · FENER BEKÇİSİ
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const t = 1.6;
  nightBackdrop(ctx, t, 1180, { moon: { x: 760, y: 520, r: 60 }, nClouds: 0, stars: 0.3 });
  ctx.fillStyle = 'rgba(28,40,78,0.95)'; cloudShape(ctx, 560, 640, 0.8);
  const g = lighthouseGeom(400, 1190, 520, 1.0);
  // huzme sağa
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const bg = ctx.createLinearGradient(g.lx, g.ly, 1080, g.ly + 40);
  bg.addColorStop(0, 'rgba(255,236,190,0.55)'); bg.addColorStop(1, 'rgba(255,236,190,0)');
  ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(g.lx, g.ly - 10); ctx.lineTo(1120, g.ly - 90); ctx.lineTo(1120, g.ly + 130); ctx.lineTo(g.lx, g.ly + 10); ctx.closePath(); ctx.fill();
  ctx.restore();
  drawRocks(ctx, 400, 1240, 560, { rock: '#151a25', rockHi: '#222a38' }, { h: 100, t, seed: 4 });
  drawLighthouse(ctx, g, { lit: 1, stripes: true });
  drawGlare(ctx, g.lx, g.ly, 0.5, 0.8, 0);
  drawPierDiag(ctx, 660, 1230, 1100, 1980, 26, 140);
  drawRain(ctx, t, { n: 90, a: 0.25 });
  // başlık (3:4 ızgara kırpımının içinde)
  const gr = ctx.createLinearGradient(0, 1200, 0, 1920);
  gr.addColorStop(0, 'rgba(5,8,16,0)'); gr.addColorStop(0.35, 'rgba(5,8,16,0.55)'); gr.addColorStop(1, 'rgba(5,8,16,0.85)');
  ctx.fillStyle = gr; ctx.fillRect(0, 1200, W, 720);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const title = (txt, y, size, col) => {
    ctx.font = `700 ${size}px Oswald`; ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(4,6,12,0.95)';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 20; ctx.strokeText(txt, W / 2, y); ctx.shadowColor = 'transparent';
    ctx.fillStyle = col; ctx.fillText(txt, W / 2, y);
  };
  title('GECE 1', 1330, 64, '#ffffff');
  title('FENER', 1440, 150, '#ffffff');
  title('BEKÇİSİ', 1585, 150, '#ffc83d');
  ctx.restore();
}
