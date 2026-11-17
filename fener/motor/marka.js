// Gece Nöbeti — profil fotoğrafı ve Reels kapağı
'use strict';

// Profil fotoğrafı: elinde fener tutan bekçi (fener = hem lamba hem deniz feneri)
function drawPP(ctx, S = 1080) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // gece arka planı
  const g = ctx.createRadialGradient(S * 0.5, S * 0.42, 40, S * 0.5, S * 0.5, S * 0.75);
  g.addColorStop(0, '#1d2b55'); g.addColorStop(1, '#070b1a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  // uzakta deniz feneri ve huzme
  ctx.save();
  ctx.globalAlpha = 0.9;
  const lx = S * 0.82, ly = S * 0.43;
  ctx.globalCompositeOperation = 'lighter';
  const bg = ctx.createLinearGradient(lx, ly, S * 0.1, S * 0.2);
  bg.addColorStop(0, 'rgba(255,220,150,0.35)'); bg.addColorStop(1, 'rgba(255,220,150,0)');
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.moveTo(lx, ly - 8); ctx.lineTo(S * 0.0, S * 0.05); ctx.lineTo(S * 0.0, S * 0.36); ctx.lineTo(lx, ly + 8); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#0b1022';
  ctx.beginPath(); ctx.moveTo(lx - 22, S * 0.62); ctx.lineTo(lx - 14, ly + 14); ctx.lineTo(lx + 14, ly + 14); ctx.lineTo(lx + 22, S * 0.62); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffd98a'; ctx.fillRect(lx - 12, ly - 12, 24, 22);
  ctx.fillStyle = '#0b1022'; ctx.beginPath(); ctx.moveTo(lx - 18, ly - 12); ctx.quadraticCurveTo(lx, ly - 34, lx + 18, ly - 12); ctx.closePath(); ctx.fill();
  drawGlare(ctx, lx, ly, 0.55, 0.45, 0);
  // deniz ufku
  ctx.fillStyle = '#0a1330'; ctx.fillRect(0, S * 0.62, S, S * 0.38);
  ctx.strokeStyle = 'rgba(80,110,170,0.35)'; ctx.lineWidth = 4;
  for (let i = 0; i < 7; i++) { const y = S * 0.66 + i * 28; ctx.beginPath(); ctx.moveTo(S * (0.05 + (i * 0.13) % 0.5), y); ctx.lineTo(S * (0.25 + (i * 0.17) % 0.6), y); ctx.stroke(); }
  // bekçi (büst)
  const cx = S * 0.47, base = S * 1.02, s = 2.15;
  drawPerson(ctx, cx, base + 120, s, { who: 'sen', face: 1, t: 0, arm: 'tut', hand: [cx + 150, S * 0.74], brow: 'notr', mouth: 'yukari', blink: false, seed: 0, noLegs: true });
  // el feneri (gemici feneri)
  const fx = cx + 150, fy = S * 0.74;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const lg = ctx.createRadialGradient(fx, fy + 70, 0, fx, fy + 70, 420);
  lg.addColorStop(0, 'rgba(255,200,110,0.65)'); lg.addColorStop(0.35, 'rgba(255,170,80,0.22)'); lg.addColorStop(1, 'rgba(255,160,70,0)');
  ctx.fillStyle = lg; ctx.fillRect(fx - 420, fy - 350, 840, 840);
  ctx.restore();
  ctx.strokeStyle = '#2a2116'; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.arc(fx, fy + 12, 34, Math.PI, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#3a2d1b'; rr(ctx, fx - 46, fy + 20, 92, 22, 8); ctx.fill();
  ctx.fillStyle = 'rgba(255,226,160,0.95)'; rr(ctx, fx - 38, fy + 40, 76, 96, 14); ctx.fill();
  ctx.fillStyle = '#fff3c9'; ctx.beginPath(); ctx.ellipse(fx, fy + 92, 11, 24, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#3a2d1b'; ctx.lineWidth = 7; rr(ctx, fx - 38, fy + 40, 76, 96, 14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fx - 38, fy + 88); ctx.lineTo(fx + 38, fy + 88); ctx.stroke();
  ctx.fillStyle = '#3a2d1b'; rr(ctx, fx - 48, fy + 132, 96, 22, 8); ctx.fill();
  // fener ışığı yüzde
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const fgl = ctx.createRadialGradient(fx - 60, fy - 120, 0, fx - 60, fy - 120, 260);
  fgl.addColorStop(0, 'rgba(255,190,110,0.18)'); fgl.addColorStop(1, 'rgba(255,190,110,0)');
  ctx.fillStyle = fgl; ctx.fillRect(fx - 340, fy - 400, 600, 600);
  ctx.restore();
  ctx.restore();
}

// Reels kapağı
function drawCover(ctx) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const p = PAL.gece, t = 3.2;
  drawSky(ctx, p, t, { horizon: 1240, stars: 0.6, moon: { x: 820, y: 360, r: 64 } });
  drawClouds(ctx, t, { n: 5, y0: 140, yr: 500, color: 'rgba(20,32,60,0.9)' });
  drawSea(ctx, p, t, { horizon: 1240, rough: 0.9 });
  const g = lighthouseGeom(560, 1280, 720, 1.15);
  const rig = lightRig(ctx, g, 0, { on: 1, phase0: 1.25, len: 1500, fog: 0.6 });
  drawRocks(ctx, 540, 1340, 900, p, { h: 150, t, seed: 8 });
  drawHouse(ctx, 230, 1290, 0.85, p, { shade: 0.6, lit: 0.9 });
  drawLighthouse(ctx, g, { lit: 1, shade: 0.45, winLit: 0.8 });
  rig.front();
  drawFog(ctx, t, { d: 0.6, speed: 1 });
  // alt karartma ve başlık
  const gr = ctx.createLinearGradient(0, 1000, 0, 1920);
  gr.addColorStop(0, 'rgba(5,8,16,0)'); gr.addColorStop(0.45, 'rgba(5,8,16,0.75)'); gr.addColorStop(1, 'rgba(5,8,16,0.95)');
  ctx.fillStyle = gr; ctx.fillRect(0, 1000, W, 920);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '700 46px Oswald'; ctx.fillStyle = '#ff6a5e';
  ctx.fillText('● GECE 1 / 7', W / 2, 1290);
  const title = (txt, y, size, col) => {
    ctx.font = `700 ${size}px Oswald`;
    ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(4,6,12,0.95)';
    ctx.strokeText(txt, W / 2, y); ctx.fillStyle = col; ctx.fillText(txt, W / 2, y);
  };
  title('KUZGUN ADASI', 1395, 132, '#ffffff');
  title('FENERİ', 1528, 150, '#ffc83d');
  ctx.font = '800 30px Inter'; ctx.fillStyle = 'rgba(210,220,236,0.9)';
  ctx.fillText('KARARI SEN VERİYORSUN', W / 2, 1628);
  ctx.restore();
}
