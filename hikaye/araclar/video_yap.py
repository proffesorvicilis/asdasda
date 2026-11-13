#!/usr/bin/env python3
"""Profesör: Düşüş — Part videolarını üretir.

Kullanım:  python3 hikaye/araclar/video_yap.py 1 2 3 4
Girdiler:  hikaye/ses/partN_tam.mp3, partN_zamanlama.md, partN_kelimeler.json,
           hikaye/ses/efektler/*.mp3, hikaye/gorseller/<SAHNE>.png (yoksa yer tutucu)
Çıktı:     hikaye/video/partN.mp4 (1080x1920, 30 fps)
"""
import json, os, re, subprocess, sys, difflib, unicodedata, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SES, GOR, OUT = f'{ROOT}/ses', f'{ROOT}/gorseller', f'{ROOT}/video'
WORK = os.environ.get('VIDEO_WORK', '/tmp/profesor_video')
W, H, FPS, HUD_FPS = 1080, 1920, 30, 10
ORANGE, WHITE, GREY, RED = (255, 122, 26), (255, 255, 255), (150, 150, 150), (235, 60, 50)
F_BLACK = '/usr/share/fonts/opentype/inter/Inter-Black.otf'
F_BOLD = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'
F_XB = '/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf'

# ---------------------------------------------------------------- sahne planı
# anchor: ('t', sn) | ('line', k, oran, ofset) | ('word', kelime, ofset) | ('tail', sn)
# fx: shake | static | flash | memory
OLD = {
 1: dict(preroll=3.0, tail=1.8, clock='03:17', shots=[
   ('P1-01', ('t', -3.0)), ('P1-02', ('t', -1.5)), ('P1-03', ('line', 1, 0)), ('P1-04', ('line', 1, .5)),
   ('P1-05', ('line', 2, 0)), ('P1-06', ('line', 3, 0)), ('P1-07', ('line', 3, .6)), ('P1-08', ('line', 4, 0)),
   ('P1-09', ('line', 5, 0)), ('P1-10', ('line', 6, 0)), ('P1-11', ('line', 7, 0)), ('P1-12', ('line', 9, 0)),
   ('P1-13', ('line', 11, 0)), ('P1-14', ('line', 15, 0)), ('P1-15', ('line', 17, 0), 'shake'),
   ('P1-16', ('line', 18, 0)), ('P1-17', ('line', 20, 0)), ('P1-18', ('line', 22, 0)), ('P1-19', ('tail', 0))],
   cards=[(('t', -2.2), ('line', 1, .3), 'GELEN ARAMA', 'GİZLİ NUMARA')],
   sfx=[('keman', ('t', -3.0), .55, None, 2.9), ('telefon_titresim', ('t', -2.0), .9, None, None),
        ('ucak_ugultu', ('line', 1, 0), .16, 'bed', ('end',)), ('kabin_uyari', ('line', 1, .1), .3, None, None),
        ('klavye', ('line', 4, .5), .22, None, None), ('turbulans', ('line', 17, 0, -.2), .55, None, None)],
   hud=dict(digits=None)),
 2: dict(preroll=0.0, tail=1.0, clock='03:20', shots=[
   ('P2-01', ('line', 1, 0)), ('P2-02', ('line', 2, 0)), ('P2-03', ('line', 3, 0)), ('P2-04', ('line', 4, 0)),
   ('P2-05', ('line', 5, 0)), ('P2-06', ('line', 6, 0)), ('P2-07', ('line', 7, 0)), ('P2-08', ('line', 8, 0)),
   ('P2-09', ('line', 9, 0)), ('P2-10', ('line', 9, .75)), ('P2-11', ('line', 10, 0)), ('P2-12', ('line', 11, 0)),
   ('P2-13', ('line', 12, 0)), ('P2-14', ('line', 14, .45)), ('P2-15', ('line', 16, 0), 'static'),
   ('P2-16', ('line', 17, 0))],
   cards=[],
   sfx=[('klavye', ('t', 0), .2, None, None), ('ucak_ugultu', ('t', 0), .14, 'bed', ('line', 16, 0)),
        ('kabin_uyari', ('line', 7, 0, -.2), .28, None, None), ('hat_cizirti', ('line', 16, 0), .5, None, None),
        ('ruzgar_marti', ('line', 17, 0), .22, 'bed', ('end',))],
   hud=dict(radar_after=('line', 4, 1))),
 3: dict(preroll=0.0, tail=1.2, clock='03:24', shots=[
   ('P3-01', ('line', 1, 0)), ('P3-02', ('line', 1, .7)), ('P3-03', ('line', 2, 0)), ('P3-04', ('line', 2, .8)),
   ('P3-05', ('line', 3, 0)), ('P3-06', ('line', 4, 0)), ('P3-07', ('line', 5, 0)), ('P3-08', ('word', 'ne', 0)),
   ('P3-09', ('word', 'bu', -.1)), ('P3-10', ('word', 'cevabı', -.1)), ('P3-11', ('line', 7, 0)),
   ('P3-12', ('line', 8, 0)), ('P3-13', ('line', 9, 0))],
   cards=[(('word', 'çözene', -.1), ('line', 3, 1, .3), 'KURAL', 'Çözene kadar kızla konuşamazsın.'),
          (('line', 6, 1), ('tail', .9), 'YENİ MESAJ', 'CEVAP?')],
   sfx=[('ruzgar_marti', ('t', 0), .2, 'bed', ('line', 6, 0)), ('bomba_bip', ('t', 0), .16, 'bed', ('line', 6, 0)),
        ('vapur_duduk', ('word', 'bu', -.3), .35, None, None), ('hat_cizirti', ('line', 6, 0), .45, None, None),
        ('mesaj_bildirim', ('line', 6, 1), .7, None, None), ('saat_tiktak', ('line', 6, 1), .3, 'bed', ('end',))],
   hud=dict(digits_after=('word', 'rakam', .3), timer_from=('word', 'kırk', 0), timer_start=40 * 60)),
 4: dict(preroll=0.0, tail=2.2, clock='03:33', shots=[
   ('P4-01', ('line', 1, 0)), ('P4-02', ('line', 2, 0)), ('P4-03', ('line', 3, 0)), ('P4-04', ('line', 4, 0)),
   ('P4-05', ('line', 5, 0)), ('P4-06', ('line', 6, 0)), ('P4-07', ('line', 7, 0)), ('P4-08', ('word', 'iskele', 0)),
   ('P4-09', ('line', 8, 0)), ('P4-10', ('line', 9, 0)), ('P4-11', ('line', 10, 0, -.35)), ('P4-12', ('line', 10, .2)),
   ('P4-13', ('line', 11, 0)), ('P4-14', ('line', 12, 0)), ('P4-15', ('line', 14, 0), 'flash'),
   ('P4-16', ('line', 14, 1)), ('P4-17', ('line', 15, 0, -.35), 'memory'), ('P4-18', ('line', 15, 0, .15)),
   ('P4-19', ('tail', .3))],
   cards=[(('tail', .5), ('tail', 2.2), 'GELEN ARAMA', 'GİZLİ NUMARA')],
   sfx=[('saat_tiktak', ('t', 0), .22, 'bed', ('line', 10, 0)), ('telefon_arama', ('line', 9, 1), .3, None, .4),
        ('ruzgar_marti', ('line', 10, 1), .22, 'bed', ('line', 14, 0)), ('bomba_bip', ('line', 10, 1), .18, 'bed', ('line', 14, 0)),
        ('patlama_uzak', ('line', 14, 0), .9, None, None), ('telefon_titresim', ('tail', .3), .9, None, None)],
   hud=dict(digits0=True, zero_at=('word', 'sıfır', 0), timer_from=('t', 0), timer_start=32 * 60 + 5,
            timer_stop=('line', 14, 0))),
}
TEXT_OVERRIDE = {(2, 15): 'Benim adım—'}
STOP = {'ve', 'ama', 'bu', 'bir', 'da', 'de', 'ya', 'ki', 'mi', 'mı', 'mu', 'mü', 'ne', 'o', 'şu', 'ben', 'sen', 'ile', 'en'}


def run(cmd):
    subprocess.run(cmd, check=True)


def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p],
                                capture_output=True, text=True).stdout)


def tr_upper(s):
    return s.replace('i', 'İ').replace('ı', 'I').upper()


def norm(s):
    s = s.lower().replace('ı', 'i').replace('İ', 'i')
    s = unicodedata.normalize('NFKD', s)
    return re.sub(r'[^a-z0-9]', '', ''.join(c for c in s if not unicodedata.combining(c)))


def load_timeline(n):
    rows = []
    for line in open(f'{SES}/part{n}_zamanlama.md'):
        m = re.match(r'\|\s*(\d+)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|\s*([^|]+?)\s*\|\s*(.*?)\s*\|\s*$', line)
        if m:
            k = int(m.group(1))
            rows.append(dict(k=k, s=float(m.group(2)), e=float(m.group(3)), sp=m.group(4),
                             text=TEXT_OVERRIDE.get((n, k), m.group(5).replace(' / ', ' '))))
    return rows


def load_words(n):
    d = json.load(open(f'{SES}/part{n}_kelimeler.json'))
    return [w for w in d.get('words', []) if w.get('type') == 'word']


class Clock:
    """Diyalog zamanını (preroll'suz) video zamanına çevirir ve çapaları çözer."""

    def __init__(self, n, tl, words, audio_dur):
        self.n, self.tl, self.words, self.cfg = n, {r['k']: r for r in tl}, words, OLD[n]
        self.pre, self.adur = self.cfg['preroll'], audio_dur

    def at(self, a, after=0.0):
        kind = a[0]
        if kind == 't':
            return a[1] + self.pre
        if kind == 'line':
            r = self.tl[a[1]]
            off = a[3] if len(a) > 3 else 0
            return r['s'] + a[2] * (r['e'] - r['s']) + off + self.pre
        if kind == 'word':
            target = norm(a[1])
            for w in self.words:
                if w['start'] + self.pre >= after - 0.05 and norm(w['text']).startswith(target):
                    return w['start'] + a[2] + self.pre
            raise ValueError(f'kelime bulunamadı: {a}')
        if kind == 'tail':
            return self.pre + self.adur + a[1]
        if kind == 'end':
            return self.total
        raise ValueError(a)

    @property
    def total(self):
        return self.pre + self.adur + self.cfg['tail']


# ---------------------------------------------------------------- görseller
def placeholder(sid, path):
    img = Image.new('RGB', (W, H), (12, 18, 24))
    d = ImageDraw.Draw(img)
    for y in range(H):
        c = int(18 + 30 * y / H)
        d.line([(0, y), (W, y)], fill=(c // 2, c, c + 8))
    f1, f2 = ImageFont.truetype(F_BLACK, 150), ImageFont.truetype(F_BOLD, 44)
    d.text((W / 2, H / 2 - 60), sid, font=f1, fill=ORANGE, anchor='mm')
    d.text((W / 2, H / 2 + 80), 'GÖRSEL BEKLENİYOR', font=f2, fill=GREY, anchor='mm')
    img.save(path)


def shot_clip(i, sid, fx, d, out):
    src = None
    for ext in ('png', 'jpg', 'jpeg', 'webp'):
        p = f'{GOR}/{sid}.{ext}'
        if os.path.exists(p):
            src = p
            break
    if not src:
        src = f'{WORK}/ph_{sid}.png'
        placeholder(sid, src)
    N = max(1, round(d * FPS))
    zin = (i % 2 == 0)
    z = f"1+0.07*on/{N}" if zin else f"1.07-0.07*on/{N}"
    y = "ih/2-(ih/zoom/2)" if i % 3 else f"(ih-ih/zoom)*(0.35+0.3*on/{N})"
    vf = (f"scale={int(W*1.1)}:{int(H*1.1)}:force_original_aspect_ratio=increase,crop={int(W*1.1)}:{int(H*1.1)},"
          f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='{y}':d=1:s={W}x{H}:fps={FPS}")
    if fx == 'shake':
        vf += f",crop={W-60}:{H-108}:x='30+22*sin(n*1.9)':y='54+22*cos(n*2.7)',scale={W}:{H}"
    elif fx == 'static':
        vf += ",noise=alls=70:allf=t,hue=s=0.3,eq=contrast=1.3"
    elif fx == 'flash':
        vf += f",crop={W-60}:{H-108}:x='30+18*sin(n*3.1)':y='54+18*cos(n*2.3)',scale={W}:{H},eq=brightness='0.5*exp(-t*4)'"
    elif fx == 'memory':
        vf += ",gblur=sigma=2,eq=brightness=0.08:contrast=1.2:saturation=0.6,noise=alls=25:allf=t"
    vf += ",format=yuv420p"
    run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-framerate', str(FPS), '-t', f'{d:.3f}', '-i', src,
         '-vf', vf, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', str(FPS), out])


# ---------------------------------------------------------------- altyazı
def align_line(row, words, pre):
    toks = row['text'].split()
    cand = [w for w in words if row['s'] - 0.15 <= w['start'] <= row['e'] + 0.05]
    a, b = [norm(t) for t in toks], [norm(w['text']) for w in cand]
    times = [None] * len(toks)
    for blk in difflib.SequenceMatcher(None, a, b).get_matching_blocks():
        for j in range(blk.size):
            times[blk.a + j] = cand[blk.b + j]['start']
    # eşleşmeyenleri karakter uzunluğuna göre doldur
    known = [(i, t) for i, t in enumerate(times) if t is not None]
    anchors = [(-1, row['s'])] + known + [(len(toks), row['e'])]
    for (i0, t0), (i1, t1) in zip(anchors, anchors[1:]):
        for i in range(i0 + 1, i1):
            times[i] = t0 + (t1 - t0) * (i - i0) / (i1 - i0)
    return [(tok, t + pre) for tok, t in zip(toks, times)]


def chunks(tw):
    out, cur = [], []
    for tok, t in tw:
        cur.append((tok, t))
        punct = re.search(r'[.?!…,—:]$', tok) is not None
        if len(cur) >= 3 or (punct and len(cur) >= 1):
            if len(cur) == 1 and not punct and len(tok) < 4:
                continue
            out.append(cur)
            cur = []
    if cur:
        if out and len(cur) == 1 and len(out[-1]) < 4:
            out[-1] += cur
        else:
            out.append(cur)
    return out


def ass_time(t):
    t = max(t, 0)
    h, m, s = int(t // 3600), int(t % 3600 // 60), t % 60
    return f'{h}:{m:02d}:{s:05.2f}'


def build_ass(n, clock, tl, words, path):
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Inter Black,76,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,1,0,1,6,4,5,60,60,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ev = []
    for row in tl:
        if row['sp'] == '—':
            continue
        cs = chunks(align_line(row, words, clock.pre))
        for ci, c in enumerate(cs):
            st = c[0][1]
            en = cs[ci + 1][0][1] if ci + 1 < len(cs) else row['e'] + clock.pre + 0.12
            en = max(en, st + 0.35)
            hl = next((k for k, (tok, _) in enumerate(c) if norm(tok) not in {norm(x) for x in STOP}), 0)
            parts = []
            for k, (tok, _) in enumerate(c):
                w = tr_upper(tok)
                parts.append('{\\c&H1A7AFF&}' + w + '{\\c&HFFFFFF&}' if k == hl else w)
            txt = '{\\pos(540,1130)\\fscx88\\fscy88\\t(0,90,\\fscx100\\fscy100)}' + ' '.join(parts)
            ev.append(f'Dialogue: 0,{ass_time(st)},{ass_time(en)},Sub,,0,0,0,,{txt}')
    open(path, 'w').write(head + '\n'.join(ev) + '\n')


# ---------------------------------------------------------------- üst bar ve kartlar
def rr(d, box, r, fill, outline=None, w=0):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=w)


def hud_frames(n, clock, folder):
    cfg, hcfg = OLD[n], OLD[n]['hud']
    os.makedirs(folder, exist_ok=True)
    fl, fv, ft, fc1, fc2 = (ImageFont.truetype(F_BOLD, 24), ImageFont.truetype(F_BLACK, 46),
                            ImageFont.truetype(F_XB, 30), ImageFont.truetype(F_XB, 30), ImageFont.truetype(F_BLACK, 50))
    T = clock.total
    digits_t = clock.at(hcfg['digits_after']) if 'digits_after' in hcfg else (0 if hcfg.get('digits0') else None)
    zero_t = clock.at(hcfg['zero_at']) if 'zero_at' in hcfg else None
    radar_t = clock.at(hcfg['radar_after']) if 'radar_after' in hcfg else None
    tim_t = clock.at(hcfg['timer_from']) if 'timer_from' in hcfg else None
    tim_stop = clock.at(hcfg['timer_stop']) if 'timer_stop' in hcfg else None
    cards = [(clock.at(a), clock.at(b), t1, t2) for a, b, t1, t2 in cfg['cards']]
    for fi in range(int(T * HUD_FPS) + 2):
        t = fi / HUD_FPS
        img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        # başlık şeridi
        rr(d, (40, 48, W - 40, 112), 32, (18, 18, 20, 215), ORANGE, 3)
        d.ellipse((58, 58, 102, 102), fill=ORANGE)
        d.text((80, 80), 'P', font=ft, fill=(20, 20, 20), anchor='mm')
        d.text((120, 80), 'PROFESÖR: DÜŞÜŞ', font=ft, fill=WHITE, anchor='lm')
        for k in range(4):
            cx = W - 250 + k * 52
            on = (k + 1) == n
            d.ellipse((cx - 19, 61, cx + 19, 99), fill=ORANGE if on else (45, 45, 48), outline=(90, 90, 90), width=2)
            d.text((cx, 80), str(k + 1), font=ft, fill=(20, 20, 20) if on else (150, 150, 150), anchor='mm')
        # kutular
        boxes = [('SAAT', cfg['clock'], WHITE, None)]
        if digits_t is not None and t >= digits_t:
            val = '0 _ _ _' if (zero_t is not None and t >= zero_t) else '_ _ _ _'
            boxes.append(('RAKAMLAR', val, ORANGE, zero_t))
        if radar_t is not None and t >= radar_t:
            boxes.append(('UÇAK', 'RADARDA YOK', RED, radar_t))
        if tim_t is not None and t >= tim_t:
            if tim_stop is not None and t >= tim_stop:
                val, col = '--:--', RED
            else:
                rem = max(0, hcfg['timer_start'] - (t - tim_t))
                val, col = f'{int(rem // 60):02d}:{int(rem % 60):02d}', RED if rem < 60 * 35 else ORANGE
            boxes.append(('SÜRE', val, col, tim_t))
        bw = (W - 80 - 20 * (len(boxes) - 1)) / len(boxes)
        for k, (lab, val, col, flash_t) in enumerate(boxes):
            x0 = 40 + k * (bw + 20)
            hot = flash_t is not None and 0 <= t - flash_t < 1.2
            rr(d, (x0, 126, x0 + bw, 206), 18, (18, 18, 20, 210), ORANGE if hot else (85, 85, 88), 3)
            d.text((x0 + 18, 140), lab, font=fl, fill=GREY, anchor='lt')
            d.text((x0 + bw - 18, 176), val, font=fv if len(val) < 9 else ft, fill=col, anchor='rm')
        # bilgi kartları
        for a, b, t1, t2 in cards:
            if a <= t < b:
                k = min(1.0, (t - a) / 0.15)
                y0 = 1460 + int(30 * (1 - k))
                rr(d, (110, y0, W - 110, y0 + 190), 26, (14, 14, 16, int(225 * k)), ORANGE, 4)
                d.text((W / 2, y0 + 50), t1, font=fc1, fill=ORANGE, anchor='mm')
                d.text((W / 2, y0 + 120), t2, font=fc2 if len(t2) < 22 else fc1, fill=WHITE, anchor='mm')
        img.save(f'{folder}/h_{fi:05d}.png', compress_level=1)


# ---------------------------------------------------------------- ses miksajı
def mix_audio(n, clock, out):
    cfg = PARTS[n]
    T = clock.total
    inputs, filt, labels = [], [], []
    inputs += ['-i', f'{SES}/part{n}_tam.mp3']
    filt.append(f"[0:a]adelay={int(clock.pre*1000)}:all=1,apad=whole_dur={T:.3f},volume=1.0[d]")
    labels.append('[d]')
    for k, (name, at, vol, kind, until) in enumerate(cfg['sfx'], 1):
        st = clock.at(at)
        f = f'{SES}/efektler/{name}.mp3'
        if kind == 'bed':
            en = clock.at(until) if until else T
            ln = max(0.1, en - st)
            inputs += ['-stream_loop', '-1', '-i', f]
            filt.append(f"[{k}:a]atrim=0:{ln:.3f},afade=t=in:d=0.4,afade=t=out:st={max(0, ln-0.5):.3f}:d=0.5,"
                        f"volume={vol},adelay={int(st*1000)}:all=1[s{k}]")
        else:
            inputs += ['-i', f]
            cut = f"atrim=0:{until},afade=t=out:st={max(0, until-0.3):.3f}:d=0.3," if until else ''
            filt.append(f"[{k}:a]{cut}volume={vol},adelay={int(max(st,0)*1000)}:all=1[s{k}]")
        labels.append(f'[s{k}]')
    filt.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0:duration=first,"
                f"atrim=0:{T:.3f},alimiter=limit=0.95,loudnorm=I=-15:TP=-1.5:LRA=11[a]")
    run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(filt), '-map', '[a]',
         '-ar', '48000', '-c:a', 'pcm_s16le', out])


# ================================================================ 6 partlık kurgu (her part ≤ 45 sn)
# Her yeni part, eski partlardaki replik aralıklarından oluşur: (eski part, ilk replik, son replik)
NEW = {
    1: [(1, 1, 17)],
    2: [(1, 18, 22), (2, 1, 6)],
    3: [(2, 7, 17), (3, 1, 1)],
    4: [(3, 2, 6)],
    5: [(3, 7, 9), (4, 1, 7)],
    6: [(4, 8, 15)],
}
MAXLEN, BASE_SPEED, MAX_SPEED, PIECE_GAP = 45.0, 1.04, 1.08, 0.18
OLD_CLOCK = {1: '03:17', 2: '03:20', 3: '03:24', 4: '03:33'}
KURGU = f'{SES}/kurgu'


class Old:
    def __init__(self, op):
        self.op = op
        self.tl = load_timeline(op)
        self.rows = {r['k']: r for r in self.tl}
        self.words = load_words(op)
        self.adur = dur(f'{SES}/part{op}_tam.mp3')
        self.clock = Clock(op, self.tl, self.words, self.adur)

    def t(self, anchor, after=0.0):
        """Çapayı eski partın diyalog zamanına (preroll'suz) çevirir."""
        return self.clock.at(anchor, after=after + self.clock.pre) - self.clock.pre


class Plan:
    def __init__(self, n, olds):
        self.n, self.olds = n, olds
        self.pieces, off = [], 0.0
        for op, a_k, b_k in NEW[n]:
            o = olds[op]
            a, b = o.rows[a_k]['s'], o.rows[b_k]['e']
            self.pieces.append(dict(op=op, a=a, b=b, ka=a_k, kb=b_k, off=off, last=(b_k == max(o.rows))))
            off += (b - a) + PIECE_GAP
        raw = off - PIECE_GAP
        self.pre = 2.0 if NEW[n][0][:2] == (1, 1) else 0.0
        last = self.pieces[-1]
        self.tail = OLD[last['op']]['tail'] if last['last'] else 0.8
        need = raw / max(1.0, MAXLEN - self.pre - self.tail)
        self.f = min(MAX_SPEED, max(BASE_SPEED, need))
        self.D = raw / self.f
        self.total = self.pre + self.D + self.tail

    def m(self, op, t, clamp=False):
        """Eski zaman -> yeni video zamanı. Parça dışındaysa None."""
        for p in self.pieces:
            if p['op'] == op and p['a'] - 0.06 <= t <= p['b'] + 0.06:
                return self.pre + (min(max(t, p['a']), p['b']) - p['a'] + p['off']) / self.f
        return None

    def inv(self, tv):
        """Yeni video zamanı -> (eski part, eski zaman)."""
        x = (tv - self.pre) * self.f
        cur = self.pieces[0]
        for p in self.pieces:
            if x >= p['off'] - PIECE_GAP:
                cur = p
        return cur['op'], cur['a'] + max(0.0, x - cur['off'])


def build_audio(plan):
    os.makedirs(KURGU, exist_ok=True)
    inputs, filt, labs = [], [], []
    for i, p in enumerate(plan.pieces):
        inputs += ['-i', f"{SES}/part{p['op']}_tam.mp3"]
        filt.append(f"[{i}:a]atrim={p['a']:.3f}:{p['b']:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,"
                    f"afade=t=out:st={max(0, p['b']-p['a']-0.02):.3f}:d=0.02,apad=pad_dur={PIECE_GAP}[p{i}]")
        labs.append(f'[p{i}]')
    filt.append(f"{''.join(labs)}concat=n={len(labs)}:v=0:a=1,atempo={plan.f:.4f},atrim=0:{plan.D:.3f}[a]")
    out = f'{KURGU}/part{plan.n}_tam.mp3'
    run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(filt), '-map', '[a]',
         '-c:a', 'libmp3lame', '-b:a', '192k', out])
    return out


def new_timeline_words(plan):
    rows, words = [], []
    for p in plan.pieces:
        o = plan.olds[p['op']]
        for k in range(p['ka'], p['kb'] + 1):
            r = o.rows[k]
            rows.append(dict(k=len(rows) + 1, s=plan.m(p['op'], r['s']) - plan.pre, e=plan.m(p['op'], r['e']) - plan.pre,
                             sp=r['sp'], text=r['text']))
        for w in o.words:
            if p['a'] - 0.05 <= w['start'] <= p['b'] + 0.05:
                ww = dict(w)
                ww['start'] = plan.m(p['op'], w['start']) - plan.pre
                ww['end'] = (plan.m(p['op'], min(w['end'], p['b'])) or plan.pre) - plan.pre
                words.append(ww)
    md = [f'# Part {plan.n} · Ses zamanlaması\n', f'Toplam video süresi: **{plan.total:.1f} sn** · Ses hızı ×{plan.f:.2f}\n',
          '| # | Başlangıç | Bitiş | Kim | Replik |', '|---|---|---|---|---|']
    for r in rows:
        md.append(f"| {r['k']} | {r['s'] + plan.pre:5.2f} | {r['e'] + plan.pre:5.2f} | {r['sp']} | {r['text']} |")
    open(f'{KURGU}/part{plan.n}_zamanlama.md', 'w').write('\n'.join(md) + '\n')
    return rows, words


def resolve_items(plan):
    shots, cards, sfx = [], [], []
    for p in plan.pieces:
        op, o = p['op'], plan.olds[p['op']]
        cfg = OLD[op]
        prev = -9.0
        for s in cfg['shots']:
            a = s[1]
            if a[0] == 't' and a[1] < 0:
                if op == 1 and p['ka'] == 1 and plan.pre > 0:
                    shots.append((plan.pre * (1 + a[1] / OLD[1]['preroll']), s[0], s[2] if len(s) > 2 else None))
                continue
            if a[0] == 'tail':
                if p['kb'] == max(o.rows):
                    tv = (plan.pre + plan.D + a[1]) if p is plan.pieces[-1] else plan.m(op, p['b'])
                    shots.append((tv, s[0], s[2] if len(s) > 2 else None))
                continue
            t_old = o.t(a, after=prev)
            prev = t_old
            tv = plan.m(op, t_old)
            if tv is not None:
                shots.append((tv, s[0], s[2] if len(s) > 2 else None))
        for a, b, t1, t2 in cfg['cards']:
            if a[0] == 't' and a[1] < 0:
                if op == 1 and p['ka'] == 1 and plan.pre > 0:
                    cards.append((plan.pre * (1 + a[1] / OLD[1]['preroll']), plan.m(op, o.t(b)) or plan.pre + 0.5, t1, t2))
                continue
            if a[0] == 'tail':
                if p is plan.pieces[-1] and p['kb'] == max(o.rows):
                    cards.append((plan.pre + plan.D + a[1], plan.total, t1, t2))
                continue
            ta = plan.m(op, o.t(a))
            if ta is None:
                continue
            tb = (ta + 2.5) if b[0] == 'tail' else (plan.m(op, o.t(b)) or ta + 2.5)
            cards.append((ta, min(tb, plan.total), t1, t2))
        for name, at, vol, kind, until in cfg['sfx']:
            if at[0] == 't' and at[1] < 0:
                if op == 1 and p['ka'] == 1 and plan.pre > 0:
                    sfx.append((name, plan.pre * (1 + at[1] / OLD[1]['preroll']), vol, None, until))
                continue
            if at[0] == 'tail':
                if p is plan.pieces[-1] and p['kb'] == max(o.rows):
                    sfx.append((name, plan.pre + plan.D + at[1], vol, None, until))
                continue
            t0 = o.t(at)
            if kind == 'bed':
                t1 = o.adur if (until is None or until[0] == 'end') else o.t(until)
                lo, hi = max(t0, p['a']), min(t1, p['b'])
                if hi - lo > 0.3:
                    end = plan.total if (p is plan.pieces[-1] and until and until[0] == 'end' and p['last']) else plan.m(op, hi)
                    sfx.append((name, plan.m(op, lo), vol, 'bed', end))
            else:
                tv = plan.m(op, t0)
                if tv is not None:
                    sfx.append((name, tv, vol, None, until))
    shots.sort()
    shots[0] = (0.0, shots[0][1], shots[0][2])
    return shots, sorted(cards), sfx


def hud_state(plan, tv):
    op, t = plan.inv(tv)
    o = plan.olds[op]
    st = dict(clock=OLD_CLOCK[op], digits=None, radar=False, timer=None)
    if op == 2 and t >= o.t(('line', 4, 1)):
        st['radar'] = True
    if op == 3:
        if t >= o.t(('word', 'rakam', .3)):
            st['digits'] = '_ _ _ _'
        tk = o.t(('word', 'kırk', 0))
        if t >= tk:
            rem = max(0, 2400 - (t - tk))
            st['timer'] = (f'{int(rem // 60):02d}:{int(rem % 60):02d}', ORANGE)
    if op == 4:
        st['digits'] = '0 _ _ _' if t >= o.t(('word', 'sıfır', 0)) else '_ _ _ _'
        if t >= o.t(('line', 14, 0)):
            st['timer'] = ('--:--', RED)
        else:
            rem = max(0, 32 * 60 + 5 - t)
            st['timer'] = (f'{int(rem // 60):02d}:{int(rem % 60):02d}', RED)
    return st


def render_hud(plan, cards, folder):
    os.makedirs(folder, exist_ok=True)
    fl, fv, ft, fc2 = (ImageFont.truetype(F_BOLD, 24), ImageFont.truetype(F_BLACK, 46),
                       ImageFont.truetype(F_XB, 30), ImageFont.truetype(F_BLACK, 50))
    seen = {}
    for fi in range(int(plan.total * HUD_FPS) + 2):
        tv = fi / HUD_FPS
        st = hud_state(plan, tv)
        img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        rr(d, (40, 48, W - 40, 112), 32, (18, 18, 20, 215), ORANGE, 3)
        d.ellipse((58, 58, 102, 102), fill=ORANGE)
        d.text((80, 80), 'P', font=ft, fill=(20, 20, 20), anchor='mm')
        d.text((120, 80), 'PROFESÖR: DÜŞÜŞ', font=ft, fill=WHITE, anchor='lm')
        for k in range(6):
            cx = W - 340 + k * 52
            on = (k + 1) == plan.n
            d.ellipse((cx - 19, 61, cx + 19, 99), fill=ORANGE if on else (45, 45, 48), outline=(90, 90, 90), width=2)
            d.text((cx, 80), str(k + 1), font=ft, fill=(20, 20, 20) if on else (150, 150, 150), anchor='mm')
        boxes = [('SAAT', st['clock'], WHITE)]
        if st['digits']:
            boxes.append(('RAKAMLAR', st['digits'], ORANGE))
        if st['radar']:
            boxes.append(('UÇAK', 'RADARDA YOK', RED))
        if st['timer']:
            boxes.append(('SÜRE', st['timer'][0], st['timer'][1]))
        bw = (W - 80 - 20 * (len(boxes) - 1)) / len(boxes)
        for k, (lab, val, col) in enumerate(boxes):
            key = (lab, val if lab != 'SÜRE' else val in ('--:--',))
            if key not in seen:
                seen[key] = tv
            hot = tv - seen[key] < 1.2 and tv > 0.3
            x0 = 40 + k * (bw + 20)
            rr(d, (x0, 126, x0 + bw, 206), 18, (18, 18, 20, 210), ORANGE if hot else (85, 85, 88), 3)
            d.text((x0 + 18, 140), lab, font=fl, fill=GREY, anchor='lt')
            d.text((x0 + bw - 18, 176), val, font=fv if len(val) < 9 else ft, fill=col, anchor='rm')
        for a, b, t1, t2 in cards:
            if a <= tv < b:
                k = min(1.0, (tv - a) / 0.15)
                y0 = 1460 + int(30 * (1 - k))
                rr(d, (110, y0, W - 110, y0 + 190), 26, (14, 14, 16, int(225 * k)), ORANGE, 4)
                d.text((W / 2, y0 + 50), t1, font=ft, fill=ORANGE, anchor='mm')
                d.text((W / 2, y0 + 120), t2, font=fc2 if len(t2) < 22 else ft, fill=WHITE, anchor='mm')
        img.save(f'{folder}/h_{fi:05d}.png', compress_level=1)


def mix(plan, audio, sfx, out):
    T = plan.total
    inputs = ['-i', audio]
    filt = [f"[0:a]adelay={int(plan.pre*1000)}:all=1,apad=whole_dur={T:.3f}[d]"]
    labs = ['[d]']
    for k, (name, st, vol, kind, until) in enumerate(sfx, 1):
        f = f'{SES}/efektler/{name}.mp3'
        if kind == 'bed':
            ln = max(0.1, until - st)
            inputs += ['-stream_loop', '-1', '-i', f]
            filt.append(f"[{k}:a]atrim=0:{ln:.3f},afade=t=in:d=0.3,afade=t=out:st={max(0, ln-0.4):.3f}:d=0.4,"
                        f"volume={vol},adelay={int(max(st,0)*1000)}:all=1[s{k}]")
        else:
            inputs += ['-i', f]
            cut = f"atrim=0:{until},afade=t=out:st={max(0, until-0.3):.3f}:d=0.3," if isinstance(until, (int, float)) else ''
            filt.append(f"[{k}:a]{cut}volume={vol},adelay={int(max(st,0)*1000)}:all=1[s{k}]")
        labs.append(f'[s{k}]')
    filt.append(f"{''.join(labs)}amix=inputs={len(labs)}:normalize=0:duration=first,atrim=0:{T:.3f},"
                f"alimiter=limit=0.95,loudnorm=I=-15:TP=-1.5:LRA=11[a]")
    run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(filt), '-map', '[a]',
         '-ar', '48000', '-c:a', 'pcm_s16le', out])


def build(n, olds):
    plan = Plan(n, olds)
    w = f'{WORK}/yeni{n}'
    shutil.rmtree(w, ignore_errors=True)
    os.makedirs(w, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    audio = build_audio(plan)
    rows, words = new_timeline_words(plan)
    shots, cards, sfx = resolve_items(plan)
    # sahne süreleri
    starts = []
    for tv, sid, fx in shots:
        starts.append(tv if not starts else max(tv, starts[-1] + 0.4))
    lst = []
    for i, (tv, sid, fx) in enumerate(shots):
        d = (starts[i + 1] if i + 1 < len(shots) else plan.total) - starts[i]
        clip = f'{w}/c{i:02d}.mp4'
        shot_clip(i, sid, fx, d, clip)
        lst.append(clip)
    open(f'{w}/list.txt', 'w').write(''.join(f"file '{c}'\n" for c in lst))
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{w}/list.txt', '-c', 'copy', f'{w}/base.mp4'])

    class C:  # altyazı için basit saat
        pre = plan.pre
    build_ass(n, C, rows, words, f'{w}/sub.ass')
    render_hud(plan, cards, f'{w}/hud')
    mix(plan, audio, sfx, f'{w}/mix.wav')
    out = f'{OUT}/part{n}.mp4'
    run(['ffmpeg', '-v', 'error', '-y', '-i', f'{w}/base.mp4', '-framerate', str(HUD_FPS), '-i', f'{w}/hud/h_%05d.png',
         '-i', f'{w}/mix.wav', '-filter_complex', f"[1:v]fps={FPS}[h];[0:v][h]overlay=0:0:eof_action=pass,ass={w}/sub.ass[v]",
         '-map', '[v]', '-map', '2:a', '-t', f'{plan.total:.3f}', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
         '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out])
    miss = [sid for _, sid, _ in shots if not any(os.path.exists(f'{GOR}/{sid}.{e}') for e in ('png', 'jpg', 'jpeg', 'webp'))]
    print(f'part{n}.mp4: {dur(out):.1f} sn | hız ×{plan.f:.2f} | {len(shots)} sahne | yer tutucu: {len(miss)}', flush=True)
    return miss


if __name__ == '__main__':
    os.makedirs(WORK, exist_ok=True)
    olds = {op: Old(op) for op in (1, 2, 3, 4)}
    allmiss = []
    for a in sys.argv[1:] or [str(k) for k in NEW]:
        allmiss += build(int(a), olds)
    if allmiss:
        print('Eksik görseller:', ' '.join(sorted(set(allmiss))))
