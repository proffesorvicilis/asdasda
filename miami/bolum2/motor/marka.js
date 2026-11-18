// Miami · Bölüm 2 — kapak
'use strict';

function drawCover(ctx) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const [src, sx] = off('kapakscn');
  OV = off('kapakovl')[1];
  SC.plaj.draw(sx, 1.0, 1.0, 2.78, E);
  ctx.drawImage(FE.render(src, { k: 0.55, zoom: 1.03, vig: 0.35 }), 0, 0);
  ctx.drawImage(off('kapakovl')[0], 0, 0);
  const gr = ctx.createLinearGradient(0, 1000, 0, 1920); gr.addColorStop(0, 'rgba(8,14,26,0)'); gr.addColorStop(0.5, 'rgba(8,14,26,0.62)'); gr.addColorStop(1, 'rgba(8,14,26,0.9)');
  ctx.fillStyle = gr; ctx.fillRect(0, 1000, W, 920);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const title = (txt, y, size, col) => { ctx.font = `800 ${size}px Inter`; ctx.lineWidth = 20; ctx.strokeStyle = 'rgba(4,6,12,0.95)'; ctx.strokeText(txt, W / 2, y); ctx.fillStyle = col; ctx.fillText(txt, W / 2, y); };
  title('POV  ·  BÖLÜM 2', 1330, 46, '#f2c63c');
  title('KAPAĞI SEÇTİN', 1450, 100, '#ffffff');
  title('KAPAK AÇILMADI', 1570, 100, '#ff6b5e');
  ctx.restore();
}
