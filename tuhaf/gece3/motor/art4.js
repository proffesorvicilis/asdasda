// Tuhaf Saat · Fener · Gece 3 — yeni çizimler: gündüz kapı ve el izleri, kurallar kâğıdı (arkadan ışıkla), saat ikonu, seçim ekranı
'use strict';

// ---------- El izi (avuç + parmaklar), lekeli ve hafif akıntılı
function handPrint(ctx, x, y, s, rot, a) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.globalAlpha = a;
  ctx.filter = 'blur(1.2px)';
  ctx.fillStyle = 'rgba(243,246,250,0.8)';
  ctx.strokeStyle = 'rgba(95,105,120,0.35)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(0, 20, 54, 62, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  const fingers = [[-46, -40, -0.42, 15, 46], [-22, -66, -0.16, 15, 62], [4, -74, 0.02, 15, 68], [30, -64, 0.2, 14, 60], [58, 6, 0.95, 15, 46]];
  fingers.forEach(([fx, fy, fr, fw, fl]) => {
    ctx.save(); ctx.translate(fx, fy); ctx.rotate(fr);
    rr(ctx, -fw, -fl, fw * 2, fl + 20, fw); ctx.fill(); ctx.stroke();
    ctx.restore();
  });
  // aşağı akıntılar
  ctx.fillStyle = 'rgba(236,240,246,0.38)';
  [[-30, 70, 60], [8, 78, 96], [36, 70, 44]].forEach(([dx, dy, dl]) => { rr(ctx, dx - 4, dy, 8, dl, 4); ctx.fill(); });
  ctx.filter = 'none';
  ctx.restore();
}

// ---------- Gündüz: içeriden kapı, lombozda el izleri
function drawDoorDay(ctx, t, o = {}) {
  ctx.fillStyle = '#d8d3cb'; ctx.fillRect(-60, -60, W + 120, H + 120);
  brickWall(ctx, '#dcd7cf', 'rgba(140,130,120,0.35)');
  const dx = 250, dw = 560, dy = 520, dh = 1300;
  ctx.fillStyle = '#3a3f48'; ctx.fillRect(dx - 30, dy - 30, dw + 60, dh + 60);
  ctx.fillStyle = '#8a5a32'; ctx.fillRect(dx, dy, dw, dh);
  ctx.strokeStyle = '#6b4325'; ctx.lineWidth = 6;
  for (let x = dx + 70; x < dx + dw; x += 70) { ctx.beginPath(); ctx.moveTo(x, dy); ctx.lineTo(x, dy + dh); ctx.stroke(); }
  [dy + 60, dy + 640, dy + 1220].forEach(y => {
    ctx.fillStyle = '#3b3f47'; ctx.fillRect(dx, y - 14, dw, 28);
    ctx.fillStyle = '#9aa0aa'; for (let x = dx + 20; x < dx + dw; x += 56) { ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill(); }
  });
  const px = dx + dw / 2, py = dy + 300, pr = 150;
  ctx.save(); ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.clip();
  const sg = ctx.createLinearGradient(0, py - pr, 0, py + pr);
  sg.addColorStop(0, '#9fb0c2'); sg.addColorStop(0.6, '#7b8da2'); sg.addColorStop(1, '#5f7187');
  ctx.fillStyle = sg; ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  cloudShape(ctx, px - 60 + Math.sin(t * 0.2) * 10, py - 70, 0.55);
  const k = o.prints ?? 0;
  handPrint(ctx, px - 52, py + 8, 1.05, -0.28, smooth(clamp(k * 1.6)));
  handPrint(ctx, px + 58, py - 6, 1.0, 0.24, smooth(clamp(k * 1.6 - 0.45)));
  handPrint(ctx, px + 8, py + 112, 0.7, 0.05, smooth(clamp(k * 1.6 - 0.8)) * 0.8);
  // cam parlaması
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath(); ctx.moveTo(px - pr, py - 40); ctx.lineTo(px - 40, py - pr); ctx.lineTo(px + 10, py - pr); ctx.lineTo(px - pr, py + 10); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#2b2f37'; ctx.lineWidth = 26; ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(px - pr, py); ctx.lineTo(px + pr, py); ctx.moveTo(px, py - pr); ctx.lineTo(px, py + pr); ctx.stroke();
  ctx.fillStyle = '#9aa0aa'; ctx.fillRect(dx + dw - 150, dy + 700, 120, 26);
  return { px, py };
}

// ---------- Kurallar kâğıdı (masa/duvar üstünde). reveal: karalamanın altını gösterir, glow: arkadan lamba ışığı
function drawRulesPaper(ctx, t, E, P, o = {}) {
  const glow = o.glow ?? 0, reveal = o.reveal ?? 0;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 40;
  ctx.fillStyle = glow > 0 ? mix('#f4ecdc', '#fff3cf', glow) : '#f4ecdc'; ctx.fillRect(P.x, P.y, P.w, P.h);
  ctx.shadowColor = 'transparent';
  if (glow > 0) {  // arkadan vuran ışık: kâğıdın altında sıcak bir leke
    const g = ctx.createRadialGradient(P.x + P.w / 2, P.y + P.h * 0.86, 20, P.x + P.w / 2, P.y + P.h * 0.86, P.w * 0.75);
    g.addColorStop(0, `rgba(255,200,90,${0.85 * glow})`); g.addColorStop(0.45, `rgba(255,190,90,${0.35 * glow})`); g.addColorStop(1, 'rgba(255,190,90,0)');
    ctx.fillStyle = g; ctx.fillRect(P.x, P.y, P.w, P.h);
  }
  ctx.strokeStyle = 'rgba(90,110,150,0.28)'; ctx.lineWidth = 2;
  for (let yy = P.y + 236; yy < P.y + P.h - 30; yy += 66) { ctx.beginPath(); ctx.moveTo(P.x + 10, yy + 18); ctx.lineTo(P.x + P.w - 10, yy + 18); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(210,70,60,0.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(P.x + 92, P.y + 10); ctx.lineTo(P.x + 92, P.y + P.h - 10); ctx.stroke();
  ctx.fillStyle = '#1f1f24'; ctx.font = '700 80px Caveat'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(E.tl.rules_title, P.x + 150, P.y + 170);
  let y = P.y + 300;
  E.tl.rules.forEach((r, i) => {
    ctx.font = '600 54px Caveat';
    const words = r.split(' '); const lines = []; let cur = '';
    words.forEach(w => { const tst = cur ? cur + ' ' + w : w; if (ctx.measureText(tst).width > 660 && cur) { lines.push(cur); cur = w; } else cur = tst; });
    if (cur) lines.push(cur);
    ctx.fillStyle = '#c0392b'; ctx.fillText(`${i + 1}.`, P.x + 110, y);
    if (i === 4) {
      // karalamanın altındaki yazı: ışık arkadan vurunca okunuyor
      ctx.save(); ctx.globalAlpha = 0.18 + 0.82 * reveal;
      ctx.fillStyle = '#2a2a30'; lines.forEach((l, j) => ctx.fillText(l, P.x + 160, y + j * 64));
      ctx.restore();
      ctx.save(); ctx.globalAlpha = 1 - 0.72 * reveal;
      ctx.strokeStyle = '#141418'; ctx.lineWidth = 12; ctx.lineJoin = 'round';
      for (let row = 0; row < lines.length; row++) {
        ctx.beginPath();
        for (let q = 0; q <= 24; q++) { const xx = P.x + 150 + q * 26, yy = y + row * 64 - 18 + (q % 2 ? -22 : 16) + Math.sin(q * 1.7) * 4; q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
        ctx.stroke();
      }
      ctx.restore();
    } else {
      ctx.fillStyle = '#26262c'; lines.forEach((l, j) => ctx.fillText(l, P.x + 160, y + j * 64));
    }
    y += lines.length * 64 + 30;
  });
  ctx.restore();
}

// Ahşap zemin + kâğıt (kural kartı sahneleri için)
function drawRulesBoard(ctx, t, lt, E, o = {}) {
  ctx.fillStyle = '#3a2516'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(15,8,3,0.6)'; ctx.lineWidth = 4;
  for (let x = 0; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  ctx.save(); cam(ctx, 1.0 + lt * 0.01, W / 2, 900);
  drawRulesPaper(ctx, t, E, { x: 110, y: 260, w: 860, h: 1200 }, o);
  ctx.restore();
}

// ---------- Saat ikonu (öğleni bekle)
function iconClock(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -26); ctx.moveTo(0, 0); ctx.lineTo(18, 10); ctx.stroke();
  ctx.restore();
}

// ---------- Seçim ekranı (Gece 3)
function drawChoice3(ctx, t, lt) {
  const k = clamp(lt / 0.5);
  if (k <= 0) return;
  const CX = 520;
  ctx.save(); ctx.globalAlpha = clamp(lt / 0.4);
  drawStageRow2(ctx, 70, 300, 'GECE 3 / 7  ·  KARAR ANI', 3);
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
  ctx.fillText('03:20. SENİN SESİNİ KULLANIYOR.', 0, -222);
  ctx.fillStyle = '#151515'; ctx.font = '700 80px Oswald';
  ctx.fillText("MOSS'U ŞİMDİ", 0, -140);
  ctx.fillText('UYARIYOR MUSUN?', 0, -62);
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
  btn(-195, 'ŞİMDİ KONUŞ', '#2e9e62', iconMic, 0.35, 0);
  btn(195, 'ÖĞLENİ BEKLE', '#d9473a', iconClock, 0.55, Math.PI);
  ctx.fillStyle = '#4a4a4a'; ctx.font = '600 25px Oswald';
  ctx.fillText('ÇOĞUNLUK 4. GECEDE NE OLACAĞINI BELİRLER', 0, 236);
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
    ctx.fillText('4. GECEDE NE OLACAK? TAKİP ET', 0, 2);
    ctx.restore();
  }
}
