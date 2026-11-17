// Gece Nöbeti — kare üretici (Chromium Canvas + Playwright)
// Önizleme : node render.js onizle <çıktı_klasörü> t1 t2 ...
// Video    : node render.js video <çıktı.mp4> [işçi=4]
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DIR = __dirname;
const TL = JSON.parse(fs.readFileSync(path.join(DIR, 'timeline.json'), 'utf8'));
const FPS = 30;

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('SAYFA HATASI:', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('konsol:', m.text()); });
  await page.goto('file://' + path.join(DIR, 'index.html'));
  const ok = await page.evaluate('window.fontsReady');
  if (!ok) console.error('UYARI: yazı tipi yüklenemedi');
  const sc = await page.evaluate(tl => window.setTimeline(tl), TL);
  return { page, sc };
}

async function onizle(out, times) {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const { page, sc } = await openPage(browser);
  console.log(sc.join('\n'));
  for (const t of times) {
    const url = await page.evaluate(t => { window.renderFrame(t); return window.grab(0.9); }, t);
    const f = path.join(out, `k_${String(t.toFixed(2)).padStart(7, '0')}.jpg`);
    fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64'));
  }
  await browser.close();
}

function ffmpegSeg(file) {
  return spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), file], { stdio: ['pipe', 'inherit', 'inherit'] });
}

async function worker(browser, frames, file, id) {
  const { page } = await openPage(browser);
  const ff = ffmpegSeg(file);
  const done = new Promise(r => ff.on('close', r));
  let n = 0;
  for (const f of frames) {
    const url = await page.evaluate(t => { window.renderFrame(t); return window.grab(0.93); }, f / FPS);
    const buf = Buffer.from(url.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (++n % 150 === 0) console.log(`  işçi${id}: ${n}/${frames.length}`);
  }
  ff.stdin.end();
  await done;
  await page.close();
}

async function video(out, workers = 4) {
  const total = Math.ceil(TL.duration * FPS);
  const per = Math.ceil(total / workers);
  const tmp = path.join(path.dirname(out), '_parca');
  fs.mkdirSync(tmp, { recursive: true });
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const jobs = [];
  const files = [];
  for (let w = 0; w < workers; w++) {
    const frames = [];
    for (let f = w * per; f < Math.min(total, (w + 1) * per); f++) frames.push(f);
    const file = path.join(tmp, `p${w}.mp4`);
    files.push(file);
    jobs.push(worker(browser, frames, file, w));
  }
  const t0 = Date.now();
  await Promise.all(jobs);
  await browser.close();
  fs.writeFileSync(path.join(tmp, 'liste.txt'), files.map(f => `file '${f}'`).join('\n'));
  await new Promise((res, rej) => {
    const p = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'liste.txt'), '-c', 'copy', out], { stdio: 'inherit' });
    p.on('close', c => c === 0 ? res() : rej(new Error('concat ' + c)));
  });
  console.log(`video: ${out} (${total} kare, ${((Date.now() - t0) / 1000).toFixed(0)} sn)`);
}

async function marka(outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const { page } = await openPage(browser);
  const shots = [['kapak', 1080, 1920, 'drawCover']];
  for (const [name, w, h, fn] of shots) {
    const url = await page.evaluate(([w, h, fn]) => {
      const c = document.getElementById('c'); c.width = w; c.height = h;
      const x = c.getContext('2d'); window[fn](x); return c.toDataURL('image/png');
    }, [w, h, fn]);
    fs.writeFileSync(path.join(outDir, name + '.png'), Buffer.from(url.split(',')[1], 'base64'));
  }
  await browser.close();
}

(async () => {
  const [mode, out, ...rest] = process.argv.slice(2);
  if (mode === 'marka') return marka(out);
  if (mode === 'onizle') await onizle(out, rest.map(Number));
  else if (mode === 'video') await video(out, Number(rest[0] || 4));
  else console.log('kullanım: node render.js onizle <klasör> t... | video <çıktı.mp4> [işçi]');
})().catch(e => { console.error(e); process.exit(1); });
