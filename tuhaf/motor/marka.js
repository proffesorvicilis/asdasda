// Tuhaf Saat Hikâyeleri — profil fotoğrafı (mumlu kapüşonlu anlatıcı) ve Gece 1 kapağı
'use strict';

function drawPP(ctx, S = 1080) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createRadialGradient(S * 0.5, S * 0.5, 40, S * 0.5, S * 0.5, S * 0.72);
  g.addColorStop(0, '#222a55'); g.addColorStop(1, '#0a0e22');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  const cx = S * 0.48;
  // mum ışığı hâlesi
  const fx = S * 0.6, fy = S * 0.6;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const hg = ctx.createRadialGradient(fx, fy, 0, fx, fy, S * 0.42);
  hg.addColorStop(0, 'rgba(255,190,110,0.32)'); hg.addColorStop(1, 'rgba(255,190,110,0)');
  ctx.fillStyle = hg; ctx.fillRect(0, 0, S, S); ctx.restore();
  // cüppe
  ctx.fillStyle = '#3a2b5e';
  ctx.beginPath(); ctx.moveTo(cx - 150, S * 0.6); ctx.lineTo(cx - 260, S * 1.02); ctx.lineTo(cx + 270, S * 1.02); ctx.lineTo(cx + 160, S * 0.6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2c2148';
  ctx.beginPath(); ctx.moveTo(cx + 20, S * 0.62); ctx.lineTo(cx + 40, S * 1.02); ctx.lineTo(cx + 270, S * 1.02); ctx.lineTo(cx + 160, S * 0.6); ctx.closePath(); ctx.fill();
  // kapüşon
  ctx.fillStyle = '#433268';
  ctx.beginPath(); ctx.ellipse(cx, S * 0.43, 205, 225, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1c1433';
  ctx.beginPath(); ctx.ellipse(cx, S * 0.45, 150, 158, 0, 0, Math.PI * 2); ctx.fill();
  // yüz
  ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.ellipse(cx, S * 0.455, 122, 128, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // gözler, kaşlar (biri havada), sinsi gülümseme
  ctx.fillStyle = INK;
  ctx.beginPath(); ctx.ellipse(cx - 42, S * 0.45, 12, 15, 0, 0, Math.PI * 2); ctx.ellipse(cx + 42, S * 0.45, 12, 15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx - 70, S * 0.4); ctx.lineTo(cx - 20, S * 0.41); ctx.moveTo(cx + 18, S * 0.405); ctx.lineTo(cx + 70, S * 0.385); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx + 6, S * 0.475, 46, Math.PI * 0.2, Math.PI * 0.75); ctx.stroke();
  // kol ve el
  ctx.strokeStyle = '#140f22'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(cx + 40, S * 0.72); ctx.lineTo(fx - 10, S * 0.7); ctx.stroke();
  // mum
  ctx.fillStyle = '#efe6cf'; rr(ctx, fx - 24, S * 0.53, 48, 150, 10); ctx.fill();
  ctx.strokeStyle = '#c9bfa6'; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.arc(fx, S * 0.7, 32, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // alev
  const fl = ctx.createRadialGradient(fx, S * 0.49, 0, fx, S * 0.49, 46);
  fl.addColorStop(0, '#fff6d0'); fl.addColorStop(0.5, '#ffc95a'); fl.addColorStop(1, 'rgba(255,140,40,0)');
  ctx.fillStyle = fl; ctx.beginPath(); ctx.ellipse(fx, S * 0.49, 26, 50, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff8e6'; ctx.beginPath(); ctx.ellipse(fx, S * 0.5, 9, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawCover(ctx) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const t = 2.0;
  nightBackdrop(ctx, t, 1060, { moon: { x: 800, y: 330, r: 64 }, nClouds: 2, cy0: 420 });
  const g = lighthouseGeom(320, 1060, 620, 1.15);
  const rig = lightRig(ctx, g, 0, { on: 1, phase0: 1.2, len: 1400, fog: 0.2 });
  drawRocks(ctx, 350, 1110, 720, { rock: '#151a25', rockHi: '#222a38' }, { h: 110, t, seed: 4 });
  drawLighthouse(ctx, g, { lit: 1, stripes: true });
  rig.front();
  drawPierDiag(ctx, 560, 1100, 1050, 1990, 26, 150);
  drawRain(ctx, t, { n: 140, a: 0.35 });
  const gr = ctx.createLinearGradient(0, 1050, 0, 1920);
  gr.addColorStop(0, 'rgba(5,8,16,0)'); gr.addColorStop(0.5, 'rgba(5,8,16,0.7)'); gr.addColorStop(1, 'rgba(5,8,16,0.92)');
  ctx.fillStyle = gr; ctx.fillRect(0, 1050, W, 870);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const title = (txt, y, size, col) => {
    ctx.font = `700 ${size}px Oswald`; ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(4,6,12,0.95)';
    ctx.strokeText(txt, W / 2, y); ctx.fillStyle = col; ctx.fillText(txt, W / 2, y);
  };
  title('GECE 1', 1390, 150, '#ffffff');
  title('SAAT 3 ÇAĞRISI', 1530, 120, '#ff5148');
  ctx.restore();
}
