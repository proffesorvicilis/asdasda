// Miami · Bölüm 2 — ortak çizim kütüphanesi: balık gözü, birinci şahıs kollar, Alex, dalga, su
'use strict';

const INK = '#1c1a22';
const SKIN_S = ['#eab07f', '#c98a5c'];   // Sam (birinci şahıs kollar)
const SKIN_A = ['#cd9564', '#a9744a'];   // Alex

// ---------------------------------------------------------------- balık gözü (WebGL)
const FE = (() => {
  const gc = document.createElement('canvas'); gc.width = W; gc.height = H;
  const gl = gc.getContext('webgl', { premultipliedAlpha: false, preserveDrawingBuffer: true });
  const sh = (t, c) => { const x = gl.createShader(t); gl.shaderSource(x, c); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x)); return x; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 p; varying vec2 uv; void main(){ uv = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }'));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, `precision highp float; varying vec2 uv; uniform sampler2D tex;
    uniform float k, zoom, rot, vig; uniform vec2 ctr;
    void main(){
      float a = 0.5625;
      vec2 q = (uv - 0.5) * vec2(2.0*a, 2.0);
      float r2 = dot(q, q), rm = a*a + 1.0;
      vec2 s = q * (1.0 + k*r2) / (1.0 + k*rm);
      float c = cos(rot), sn = sin(rot);
      s = vec2(c*s.x - sn*s.y, sn*s.x + c*s.y) / zoom;
      vec2 t = s / vec2(2.0*a, 2.0) + 0.5 + ctr;
      vec3 col = texture2D(tex, t).rgb;
      col *= 1.0 - vig * smoothstep(0.55, 1.35, sqrt(r2));
      gl_FragColor = vec4(col, 1.0);
    }`));
  gl.linkProgram(pr); gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(([a, b]) => gl.texParameteri(gl.TEXTURE_2D, a, b));
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const U = n => gl.getUniformLocation(pr, n);
  const u = { k: U('k'), zoom: U('zoom'), rot: U('rot'), vig: U('vig'), ctr: U('ctr') };
  return {
    render(src, p = {}) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      gl.viewport(0, 0, W, H);
      gl.uniform1f(u.k, p.k ?? 0.5); gl.uniform1f(u.zoom, p.zoom ?? 1); gl.uniform1f(u.rot, p.rot ?? 0); gl.uniform1f(u.vig, p.vig ?? 0.25);
      gl.uniform2f(u.ctr, p.ox ?? 0, p.oy ?? 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      return gc;
    },
  };
})();

// ---------------------------------------------------------------- küçük yardımcılar
function ptsPath(ctx, pts, close = true) {
  ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); if (close) ctx.closePath();
}
function inked(ctx, fill, lw = 3.5, stroke = INK) {
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
}
function vgrad(ctx, y0, y1, stops) {
  const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g;
}
function hand(ctx, x, y, ang, s, pose = 'open', sk = SKIN_S) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = 3.4; ctx.fillStyle = sk[0];
  if (pose === 'fist') {
    rr(ctx, -30, -52, 60, 58, 20); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = sk[1]; ctx.lineWidth = 2.8;
    [-12, 0, 12].forEach(dx => { ctx.beginPath(); ctx.moveTo(dx, -50); ctx.lineTo(dx, -30); ctx.stroke(); });
    ctx.strokeStyle = INK; ctx.lineWidth = 3.4; ctx.fillStyle = sk[0];
    ctx.save(); ctx.translate(-28, -20); ctx.rotate(-0.55); rr(ctx, -9, -32, 18, 38, 9); ctx.fill(); ctx.stroke(); ctx.restore();
  } else {
    const sp = pose === 'palm' ? 0.2 : 0.09;
    ctx.save(); ctx.translate(-22, -14); ctx.rotate(-0.95); rr(ctx, -9, -38, 18, 46, 9); ctx.fill(); ctx.stroke(); ctx.restore();
    rr(ctx, -28, -58, 56, 64, 18); ctx.fill(); ctx.stroke();
    [[-19, 34, -sp * 1.6], [-6.5, 43, -sp * 0.5], [6.5, 40, sp * 0.5], [19, 30, sp * 1.6]].forEach(([fx, len, a]) => {
      ctx.save(); ctx.translate(fx, -44); ctx.rotate(a); rr(ctx, -6.8, -len, 13.6, len + 12, 6.8); ctx.fill(); ctx.stroke(); ctx.restore();
    });
    ctx.fillStyle = sk[0]; rr(ctx, -24, -50, 48, 44, 12); ctx.fill();
  }
  ctx.restore();
}
// Birinci şahıs kol: tabandan (ekran dışı) bileğe; elin yönü varsayılan olarak kolun yönüdür.
function povArm(ctx, o) {
  const dx = o.hx - o.bx, dy = o.hy - o.by, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const bend = o.bend ?? 0, mx = (o.bx + o.hx) / 2 + nx * bend, my = (o.by + o.hy) / 2 + ny * bend;
  const w0 = o.w0 ?? 170, w1 = o.w1 ?? 64, sk = o.skin ?? SKIN_S;
  const ang = o.ang ?? Math.atan2(dx, -dy);
  ctx.save();
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(o.bx + nx * w0 / 2, o.by + ny * w0 / 2);
    ctx.quadraticCurveTo(mx + nx * (w0 + w1) / 4, my + ny * (w0 + w1) / 4, o.hx + nx * w1 / 2, o.hy + ny * w1 / 2);
    ctx.lineTo(o.hx - nx * w1 / 2, o.hy - ny * w1 / 2);
    ctx.quadraticCurveTo(mx - nx * (w0 + w1) / 4, my - ny * (w0 + w1) / 4, o.bx - nx * w0 / 2, o.by - ny * w0 / 2);
    ctx.closePath();
  };
  const g = ctx.createLinearGradient(o.bx, o.by, o.hx, o.hy); g.addColorStop(0, sk[1]); g.addColorStop(0.35, sk[0]); g.addColorStop(1, sk[0]);
  path(); ctx.fillStyle = g; ctx.fill();
  if (o.sleeve !== null) {   // kol manşeti
    ctx.save(); path(); ctx.clip();
    const a = o.sleeveLen ?? 0.2;
    ctx.fillStyle = o.sleeve ?? '#2f6fa8';
    ctx.beginPath(); ctx.moveTo(o.bx + nx * w0, o.by + ny * w0); ctx.lineTo(o.bx - nx * w0, o.by - ny * w0);
    ctx.lineTo(o.bx - nx * w0 + dx * a, o.by - ny * w0 + dy * a); ctx.lineTo(o.bx + nx * w0 + dx * a, o.by + ny * w0 + dy * a); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(o.bx + nx * w0 + dx * a, o.by + ny * w0 + dy * a); ctx.lineTo(o.bx - nx * w0 + dx * a, o.by - ny * w0 + dy * a); ctx.stroke();
    ctx.restore();
  }
  path(); ctx.lineWidth = 3.8; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  hand(ctx, o.hx, o.hy, ang, o.hs ?? 1.5, o.pose ?? 'open', sk);
  ctx.restore();
}
// İki kol: sol ve sağ alt köşeden
function povArms(ctx, l, r, base = {}) {
  if (l) povArm(ctx, { bx: base.lx ?? -60, by: base.ly ?? H + 60, w0: 190, w1: 72, bend: 30, ...l });
  if (r) povArm(ctx, { bx: base.rx ?? W + 60, by: base.ry ?? H + 60, w0: 190, w1: 72, bend: -30, ...r });
}

// ---------------------------------------------------------------- Alex
function alexHead(ctx, x, y, r, o = {}) {
  const look = o.look ?? [0, 0], skin = SKIN_A;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(o.sx ?? 1, o.sy ?? 1);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // boyun
  ctx.fillStyle = skin[1]; rr(ctx, -r * 0.34, r * 0.55, r * 0.68, r * 0.7, r * 0.2); ctx.fill(); ctx.lineWidth = 3.4; ctx.strokeStyle = INK; ctx.stroke();
  // kulaklar
  ctx.fillStyle = skin[0];
  [-1, 1].forEach(sd => { ctx.beginPath(); ctx.ellipse(sd * r * 0.98, r * 0.05, r * 0.17, r * 0.24, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
  // kafa
  ctx.beginPath(); ctx.ellipse(0, 0, r, r * 1.08, 0, 0, Math.PI * 2); ctx.fillStyle = skin[0]; ctx.fill(); ctx.lineWidth = 3.6; ctx.stroke();
  // saç
  ctx.fillStyle = '#3a2417';
  ctx.beginPath(); ctx.moveTo(-r * 1.0, -r * 0.1);
  ctx.bezierCurveTo(-r * 1.1, -r * 0.95, -r * 0.4, -r * 1.35, r * 0.15, -r * 1.2);
  ctx.bezierCurveTo(r * 0.85, -r * 1.15, r * 1.12, -r * 0.7, r * 1.0, -r * 0.1);
  ctx.bezierCurveTo(r * 0.8, -r * 0.55, r * 0.35, -r * 0.62, 0, -r * 0.5);
  ctx.bezierCurveTo(-r * 0.4, -r * 0.62, -r * 0.8, -r * 0.5, -r * 1.0, -r * 0.1); ctx.closePath(); ctx.fill(); ctx.stroke();
  // gözler
  const ex = r * 0.38, ey = r * 0.02, er = r * 0.26;
  [-1, 1].forEach(sd => {
    ctx.beginPath(); ctx.arc(sd * ex, ey, er, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.arc(sd * ex + look[0] * er * 0.45, ey + look[1] * er * 0.45, er * 0.46, 0, Math.PI * 2); ctx.fillStyle = '#17141a'; ctx.fill();
    ctx.beginPath(); ctx.arc(sd * ex + look[0] * er * 0.45 - er * 0.14, ey + look[1] * er * 0.45 - er * 0.16, er * 0.12, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
  });
  // kaşlar
  const br = o.brow ?? 'korku';
  ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = r * 0.1;
  [-1, 1].forEach(sd => {
    ctx.beginPath();
    if (br === 'korku') { ctx.moveTo(sd * ex - sd * er * 0.9, ey - er * 1.35); ctx.lineTo(sd * ex + sd * er * 0.8, ey - er * 1.75); }
    else if (br === 'kizgin') { ctx.moveTo(sd * ex + sd * er * 0.9, ey - er * 1.55); ctx.lineTo(sd * ex - sd * er * 0.9, ey - er * 1.1); }
    else { ctx.moveTo(sd * ex - er * 0.9, ey - er * 1.5); ctx.lineTo(sd * ex + er * 0.9, ey - er * 1.5); }
    ctx.stroke();
  });
  // burun ve ağız
  ctx.strokeStyle = skin[1]; ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.moveTo(0, r * 0.18); ctx.quadraticCurveTo(-r * 0.1, r * 0.4, r * 0.08, r * 0.42); ctx.stroke();
  const m = o.mouth ?? 'o';
  ctx.lineWidth = 3.2; ctx.strokeStyle = INK;
  if (m === 'o') { ctx.beginPath(); ctx.ellipse(0, r * 0.66, r * 0.14, r * 0.17, 0, 0, Math.PI * 2); ctx.fillStyle = '#5a2418'; ctx.fill(); ctx.stroke(); }
  else if (m === 'bagir') { ctx.beginPath(); ctx.ellipse(0, r * 0.66, r * 0.3, r * 0.24, 0, 0, Math.PI * 2); ctx.fillStyle = '#5a2418'; ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fillRect(-r * 0.22, r * 0.5, r * 0.44, r * 0.1); }
  else if (m === 'cizgi') { ctx.beginPath(); ctx.moveTo(-r * 0.2, r * 0.7); ctx.lineTo(r * 0.2, r * 0.7); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(-r * 0.24, r * 0.64); ctx.quadraticCurveTo(0, r * 0.84, r * 0.24, r * 0.64); ctx.stroke(); }
  ctx.restore();
}
// Mitten kol: omuzdan ele kalın, yuvarlak uçlu
function limb(ctx, x0, y0, x1, y1, w0, w1, col, lw = 3.4) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  ctx.beginPath(); ctx.moveTo(x0 + nx * w0 / 2, y0 + ny * w0 / 2); ctx.lineTo(x1 + nx * w1 / 2, y1 + ny * w1 / 2);
  ctx.arc(x1, y1, w1 / 2, Math.atan2(ny, nx), Math.atan2(ny, nx) + Math.PI, true);
  ctx.lineTo(x0 - nx * w0 / 2, y0 - ny * w0 / 2); ctx.arc(x0, y0, w0 / 2, Math.atan2(-ny, -nx), Math.atan2(-ny, -nx) + Math.PI, true);
  ctx.closePath(); inked(ctx, col, lw);
}
// Ayakta Alex: tam gövde (kırmızı tişört, lacivert şort). o.arms: 'yukari' | 'x' | 'asagi' | 'merdiven'
function alexFigure(ctx, x, y, s, o = {}) {
  const sk = SKIN_A, red = '#c9232c', redD = '#9d1a22';
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // bacaklar (y: ayak tabanı)
  if (!o.noLegs) {
    limb(ctx, -28, -150, -32, -34, 40, 34, sk[0]); limb(ctx, 28, -150, 32, -34, 40, 34, sk[0]);
    [-1, 1].forEach(sd => { rr(ctx, sd * 32 - 24, -22, 48, 22, 9); inked(ctx, '#c9a56a', 3); });
  }
  // şort
  ctx.beginPath(); ctx.moveTo(-62, -230); ctx.lineTo(62, -230); ctx.lineTo(70, -126); ctx.lineTo(8, -112); ctx.lineTo(0, -140); ctx.lineTo(-8, -112); ctx.lineTo(-70, -126); ctx.closePath(); inked(ctx, '#243a5e', 3.6);
  // kollar
  const A = o.arms ?? 'asagi';
  const arm = (sd, ex, ey, hx, hy) => { limb(ctx, sd * 70, -330, ex, ey, 40, 34, sk[0]); limb(ctx, ex, ey, hx, hy, 34, 28, sk[0]); hand(ctx, hx, hy, Math.atan2(hx - ex, -(hy - ey)), 0.5, o.pose ?? 'open', sk); };
  // gövde
  ctx.beginPath(); ctx.moveTo(-68, -350); ctx.quadraticCurveTo(0, -372, 68, -350); ctx.lineTo(78, -228); ctx.lineTo(-78, -228); ctx.closePath(); inked(ctx, red, 3.8);
  ctx.fillStyle = redD; ctx.beginPath(); ctx.moveTo(10, -352); ctx.lineTo(70, -350); ctx.lineTo(78, -228); ctx.lineTo(22, -228); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#7e141b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-30, -330); ctx.quadraticCurveTo(-24, -290, -34, -250); ctx.stroke();
  // yaka
  ctx.beginPath(); ctx.ellipse(0, -352, 36, 14, 0, 0, Math.PI * 2); inked(ctx, '#a21c24', 3);
  if (A === 'yukari') { arm(-1, -130, -420, -138, -520); arm(1, 130, -420, 140, -520); }
  else if (A === 'x') { limb(ctx, -66, -330, -20, -380, 36, 32, sk[0]); limb(ctx, -20, -380, 60, -420, 32, 28, sk[0]); limb(ctx, 66, -330, 20, -380, 36, 32, sk[0]); limb(ctx, 20, -380, -60, -420, 32, 28, sk[0]); hand(ctx, 62, -421, 1.3, 0.45, 'open', sk); hand(ctx, -62, -421, -1.3, 0.45, 'open', sk); }
  else if (A === 'merdiven') { arm(-1, -60, -430, -48, -540); arm(1, 62, -420, 56, -520); }
  else { arm(-1, -92, -240, -98, -150); arm(1, 92, -240, 98, -150); }
  // kafa
  alexHead(ctx, 0, -450, 62, o.head ?? {});
  ctx.restore();
}

// ---------------------------------------------------------------- dalga ve su
// Dev dalga: tepe çizgisi crest(u) (0..1 → y), alt sınır y1; köpük bandı ve girdap çizgileri
function waveBody(ctx, x0, x1, y1, crest, o = {}) {
  const N = 40, t = o.t ?? 0;
  const top = u => crest(u) + (o.wob ?? 0) * Math.sin(u * 14 + t * 2);
  const yMin = Math.min(...Array.from({ length: N + 1 }, (_, i) => top(i / N)));
  ctx.save();
  ctx.beginPath(); ctx.moveTo(x0, y1);
  for (let i = 0; i <= N; i++) ctx.lineTo(lerp(x0, x1, i / N), top(i / N));
  ctx.lineTo(x1, y1); ctx.closePath();
  ctx.fillStyle = vgrad(ctx, yMin, y1, [[0, '#4fc0b0'], [0.12, '#35a09a'], [0.34, '#23697f'], [0.7, '#1a4660'], [1, '#143349']]); ctx.fill();
  ctx.clip();
  // girdap çizgileri (hacim)
  ctx.lineCap = 'round';
  for (let k = 0; k < (o.swirls ?? 6); k++) {
    const yy = yMin + (y1 - yMin) * (0.12 + k * 0.13);
    ctx.strokeStyle = `rgba(150,225,215,${0.22 - k * 0.025})`; ctx.lineWidth = 7 - k * 0.7;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const u = i / N; const y = yy + (top(u) - yMin) * (0.9 - k * 0.08) + Math.sin(u * 9 + k + t) * 9; i ? ctx.lineTo(lerp(x0, x1, u), y) : ctx.moveTo(lerp(x0, x1, u), y); }
    ctx.stroke();
  }
  ctx.restore();
  // köpük kenarı
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); for (let i = 0; i <= N; i++) { const u = i / N; i ? ctx.lineTo(lerp(x0, x1, u), top(u)) : ctx.moveTo(lerp(x0, x1, u), top(u)); }
  ctx.strokeStyle = '#d9f6ef'; ctx.lineWidth = o.foam ?? 14; ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.stroke();
  ctx.restore();
}
// Duvardan fışkıran su şeritleri: nokta dizisi boyunca ince uçlu şerit
function waterRibbon(ctx, pts, w, o = {}) {
  const n = pts.length, L = [], Rr = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const u = i / (n - 1), ww = w * (o.taper === false ? 1 : Math.sin(Math.PI * (0.15 + 0.85 * u)) ** 0.6) / 2;
    L.push([pts[i][0] - dy / l * ww, pts[i][1] + dx / l * ww]); Rr.push([pts[i][0] + dy / l * ww, pts[i][1] - dx / l * ww]);
  }
  ctx.beginPath(); L.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); Rr.reverse().forEach(([x, y]) => ctx.lineTo(x, y)); ctx.closePath();
  ctx.fillStyle = o.fill ?? 'rgba(196,240,232,0.92)'; ctx.fill();
  ctx.lineWidth = 2.4; ctx.strokeStyle = o.stroke ?? 'rgba(30,70,80,0.75)'; ctx.lineJoin = 'round'; ctx.stroke();
}
function seaSurface(ctx, y0, t, o = {}) {
  const g = vgrad(ctx, y0, H, [[0, o.c0 ?? '#6fb8a6'], [0.25, o.c1 ?? '#3f9585'], [1, o.c2 ?? '#2a6a5e']]);
  ctx.fillStyle = g; ctx.fillRect(0, y0, W, H - y0);
  ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const yy = y0 + 30 + i * ((H - y0) / 12) * (1 + i * 0.12), a = Math.sin(t * 0.8 + i) * 22;
    ctx.strokeStyle = `rgba(210,245,235,${0.14 + 0.02 * i})`; ctx.lineWidth = 4 + i * 0.9;
    ctx.beginPath(); ctx.moveTo(-40, yy); ctx.bezierCurveTo(W * 0.3 + a, yy - 18 - i * 2, W * 0.6 - a, yy + 18 + i * 2, W + 40, yy); ctx.stroke();
  }
}
