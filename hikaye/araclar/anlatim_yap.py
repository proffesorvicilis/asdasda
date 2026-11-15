#!/usr/bin/env python3
"""Anlatıcılı bölümleri seslendirir ve videoya çevirir.

Kullanım: python3 hikaye/araclar/anlatim_yap.py [1 2 3 4 5 6]
Çıktı: hikaye/ses/anlatim/partN.mp3 + partN_zamanlama.md, hikaye/video/partN.mp4
"""
import os, sys, json, re, hashlib, subprocess, difflib, shutil
sys.path.insert(0, os.path.dirname(__file__))
from anlatim import PARTS, TAG, VOICE, DEEPEN
import video_yap as V
from PIL import Image, ImageDraw, ImageFont

ROOT = V.ROOT
ADIR = f'{ROOT}/ses/anlatim'
CACHE = f'{ADIR}/_parca'
WORK = '/tmp/profesor_anlatim'
MAXLEN, MAXSPEED, GAP = 80.0, 1.08, 0.12
TRIM = ("silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,"
        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse,"
        "silenceremove=stop_periods=-1:stop_duration=0.15:stop_threshold=-45dB:stop_silence=0.12")
SAD = re.compile(r'crying|sobbing|scared|screaming|desperate|terrified|frightened|whisper|sad')
LAUGH = re.compile(r'\[(güler|gülme|gülüyor|kahkaha|laugh)', re.I)


def run(c):
    subprocess.run(c, check=True)


def clean(t):
    return re.sub(r'\[[^\]]*\]\s*', '', t).strip()


def norm_words(t):
    return [V.norm(w) for w in clean(t).split() if V.norm(w)]


def tts(text, stab, out):
    body = {'text': text, 'model_id': 'eleven_v3', 'language_code': 'tr', 'voice_settings': {'stability': stab}}
    r = subprocess.run(['curl', '-sS', '-o', out, '-w', '%{http_code}', '-X', 'POST',
                        f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128',
                        '-H', 'Content-Type: application/json', '--data-binary', json.dumps(body, ensure_ascii=False)],
                       capture_output=True, text=True)
    if r.stdout != '200':
        raise RuntimeError(f'TTS {r.stdout}: {open(out, "rb").read()[:200]}')


def stt(path):
    r = subprocess.run(['curl', '-sS', '-X', 'POST', 'https://api.elevenlabs.io/v1/speech-to-text', '-F', 'model_id=scribe_v1',
                        '-F', 'language_code=tur', '-F', 'timestamps_granularity=word', '-F', f'file=@{path}'],
                       capture_output=True, text=True)
    d = json.loads(r.stdout)
    return d.get('text', ''), [w for w in d.get('words', []) if w.get('type') == 'word']


def ok(expected, got, tagtext):
    if SAD.search(tagtext) and LAUGH.search(got):
        return False, 0.0
    expected = expected.replace('üç on yedi', '317')
    e, g = norm_words(expected), norm_words(got)
    if not e:
        return True, 1.0
    r = difflib.SequenceMatcher(None, ''.join(e), ''.join(g)).ratio()
    return (r >= 0.88 if len(e) > 2 else ''.join(g) == ''.join(e)), r


def make_item(it, retries=4):
    """Bir repliği üretir; önbellekten döner. (wav yolu, kelimeler)"""
    tag, stab = TAG[it['v']]
    text = it['t'] if it['t'].startswith('[') else f"{tag} {it['t']}"
    if it['v'] == 'N' and it['t'].startswith('['):
        text = it['t']
    h = hashlib.sha1(f"{VOICE}|{text}|{stab}|{it.get('cut')}|{it['v']}".encode()).hexdigest()[:16]
    wav, meta = f'{CACHE}/{h}.wav', f'{CACHE}/{h}.json'
    if os.path.exists(wav) and os.path.exists(meta):
        return wav, json.load(open(meta))
    best = None
    for a in range(retries + 1):
        raw, tw = f'{WORK}/{h}_{a}.mp3', f'{WORK}/{h}_{a}.wav'
        tts(text, stab, raw)
        run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', TRIM, '-ar', '44100', '-ac', '1', tw])
        got, words = stt(tw)
        good, r = ok(it['t'], got, text)
        print(f"   [{it['v']}] d{a} uyum={r:.2f} {'OK' if good else 'TEKRAR'} :: {got[:70]}", flush=True)
        if best is None or r > best[2]:
            best = (tw, words, r)
        if good:
            break
    tw, words, r = best
    if it['v'] in DEEPEN:
        dw = tw.replace('.wav', '_deep.wav')
        run(['ffmpeg', '-v', 'error', '-y', '-i', tw, '-af', 'asetrate=44100*0.87,aresample=44100,atempo=1.1494', dw])
        tw = dw
        words = [dict(w, start=w['start'], end=w['end']) for w in words]
    if it.get('cut'):
        tg = [w for w in words if V.norm(w['text']) == V.norm(it['cut'])]
        if tg:
            cut = tg[-1]['start'] + 0.11
            cw = tw.replace('.wav', '_cut.wav')
            run(['ffmpeg', '-v', 'error', '-y', '-i', tw, '-t', f'{cut:.3f}', '-af', f'afade=t=out:st={cut-0.015:.3f}:d=0.015', cw])
            tw = cw
            words = [w for w in words if w['start'] < cut - 0.05]
    shutil.copy(tw, wav)
    json.dump(words, open(meta, 'w'), ensure_ascii=False)
    return wav, words


def silence(path, d):
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', f'{d:.3f}', path])


def static(path, d):
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'anoisesrc=d={d}:c=white:a=0.2:r=44100', '-af',
         f'highpass=f=700,lowpass=f=5000,afade=t=in:d=0.02,afade=t=out:st={max(0, d-0.12):.3f}:d=0.12', '-ac', '1', path])


def build_part(n):
    P = PARTS[n]
    w = f'{WORK}/p{n}'
    shutil.rmtree(w, ignore_errors=True)
    os.makedirs(w, exist_ok=True)
    print(f'== Bölüm {n}', flush=True)
    seq, tl, words_abs, t = [], [], [], 0.25  # baştaki küçük boşluk
    lead = f'{w}/lead.wav'
    silence(lead, t)
    seq.append(lead)
    for i, it in enumerate(P['items'], 1):
        if 'static' in it:
            p = f'{w}/static{i}.wav'
            static(p, it['static'])
            d = it['static']
            tl.append(dict(i=i, s=t, e=t + d, it=it))
        else:
            p, words = make_item(it)
            d = V.dur(p)
            tl.append(dict(i=i, s=t, e=t + d, it=it))
            words_abs += [dict(text=x['text'], start=x['start'] + t, end=x['end'] + t) for x in words]
        seq.append(p)
        t += d
        g = it.get('gap', GAP)
        gp = f'{w}/gap{i}.wav'
        silence(gp, g)
        seq.append(gp)
        t += g
    tail = P.get('tail', 0.8)
    raw_total = t + tail
    f = max(1.0, min(MAXSPEED, (t - 0.25) / (MAXLEN - tail - 0.25)))
    lst = f'{w}/list.txt'
    open(lst, 'w').write(''.join(f"file '{x}'\n" for x in seq))
    os.makedirs(ADIR, exist_ok=True)
    audio = f'{ADIR}/part{n}.wav'
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-af', f'atempo={f:.4f}', '-ar', '44100', audio])
    sc = lambda x: x / f
    for r in tl:
        r['s'], r['e'] = sc(r['s']), sc(r['e'])
    for x in words_abs:
        x['start'], x['end'] = sc(x['start']), sc(x['end'])
    D = V.dur(audio)
    total = D + tail
    # zamanlama dosyası
    md = [f'# Bölüm {n} · Anlatım zamanlaması\n', f'Toplam video: **{total:.1f} sn** · Ses hızı ×{f:.2f}\n',
          '| # | Başlangıç | Bitiş | Ses | Metin | Sahne |', '|---|---|---|---|---|---|']
    for r in tl:
        it = r['it']
        sh = it.get('shot')
        sh = sh[0] if isinstance(sh, tuple) else (sh or '')
        md.append(f"| {r['i']} | {r['s']:.2f} | {r['e']:.2f} | {it.get('v', '—')} | {clean(it.get('t', '(hat cızırtısı)'))} | {sh} |")
    open(f'{ADIR}/part{n}_zamanlama.md', 'w').write('\n'.join(md) + '\n')

    # sahneler
    shots = []
    for r in tl:
        it = r['it']
        if it.get('shot'):
            sh = it['shot'] if isinstance(it['shot'], tuple) else (it['shot'], None)
            shots.append((r['s'] if shots else 0.0, sh[0], sh[1]))
        if it.get('shot2'):
            sid, frac = it['shot2']
            shots.append((r['s'] + frac * (r['e'] - r['s']), sid, None))
    shots.sort()
    starts = []
    for s in shots:
        starts.append(max(s[0], starts[-1] + 0.4) if starts else 0.0)
    clips = []
    for k, (st, sid, fx) in enumerate(shots):
        d = (starts[k + 1] if k + 1 < len(shots) else total) - starts[k]
        c = f'{w}/c{k:02d}.mp4'
        V.shot_clip(k, sid, fx, d, c)
        clips.append(c)
    open(f'{w}/clips.txt', 'w').write(''.join(f"file '{c}'\n" for c in clips))
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{w}/clips.txt', '-c', 'copy', f'{w}/base.mp4'])

    # altyazı
    rows = []
    for r in tl:
        it = r['it']
        if 'static' in it:
            continue
        rows.append(dict(k=r['i'], s=r['s'], e=r['e'], sp=it['v'], text=it.get('sub') or clean(it['t'])))

    class C:
        pre = 0.0
    V.build_ass(n, C, rows, words_abs, f'{w}/sub.ass')

    # üst bar + kartlar
    events = []  # (zaman, değişiklik)
    for r in tl:
        it = r['it']
        if it.get('hud'):
            events.append((r['s'], it['hud']))
        if it.get('hud_end'):
            events.append((r['e'], it['hud_end']))
    cards = [(r['s'], r['s'] + r['it']['card'][2], r['it']['card'][0], r['it']['card'][1]) for r in tl if r['it'].get('card')]
    render_hud(n, P['hud'], sorted(events, key=lambda e: e[0]), cards, total, f'{w}/hud')

    # efektler
    sfx = []
    for r in tl:
        for fx in r['it'].get('fx', []):
            name, vol, off = fx[0], fx[1], fx[2]
            ln = fx[3] if len(fx) > 3 else None
            sfx.append((name, max(0, r['s'] + off), vol, None, ln))
    for name, vol, a, b in P.get('beds', []):
        st = tl[a - 1]['s']
        en = total if b == 'end' else tl[b - 1]['e']
        sfx.append((name, st, vol, 'bed', en))

    class PL:
        pre = 0.0
    PL.total = total
    V.mix(PL, audio, sfx, f'{w}/mix.wav')
    os.makedirs(V.OUT, exist_ok=True)
    out = f'{V.OUT}/part{n}.mp4'
    run(['ffmpeg', '-v', 'error', '-y', '-i', f'{w}/base.mp4', '-framerate', str(V.HUD_FPS), '-i', f'{w}/hud/h_%05d.png',
         '-i', f'{w}/mix.wav', '-filter_complex', f"[1:v]fps={V.FPS}[h];[0:v][h]overlay=0:0:eof_action=pass,ass={w}/sub.ass[v]",
         '-map', '[v]', '-map', '2:a', '-t', f'{total:.3f}', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
         '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out])
    print(f'Bölüm {n}: {V.dur(out):.1f} sn | ses hızı ×{f:.2f} | {len(shots)} sahne', flush=True)


def render_hud(n, init, events, cards, total, folder):
    os.makedirs(folder, exist_ok=True)
    fl, fv, ft, fc2 = (ImageFont.truetype(V.F_BOLD, 24), ImageFont.truetype(V.F_BLACK, 46),
                       ImageFont.truetype(V.F_XB, 30), ImageFont.truetype(V.F_BLACK, 50))
    seen = {}
    for fi in range(int(total * V.HUD_FPS) + 2):
        tv = fi / V.HUD_FPS
        st = dict(init)
        timer_t0 = 0.0 if 'timer' in init else None
        for et, ch in events:
            if et <= tv:
                st.update(ch)
                if 'timer' in ch and ch['timer'] != 'stop':
                    timer_t0 = et
        img = Image.new('RGBA', (V.W, V.H), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        V.rr(d, (40, 48, V.W - 40, 112), 32, (18, 18, 20, 215), V.ORANGE, 3)
        d.ellipse((58, 58, 102, 102), fill=V.ORANGE)
        d.text((80, 80), 'P', font=ft, fill=(20, 20, 20), anchor='mm')
        d.text((120, 80), 'PROFESÖR · KARA KUTU', font=ft, fill=V.WHITE, anchor='lm')
        bw0 = d.textlength(f'BÖLÜM {n}', font=ft)
        V.rr(d, (V.W - 70 - bw0 - 30, 62, V.W - 58, 98), 18, V.ORANGE)
        d.text((V.W - 64 - (bw0 + 30) / 2, 80), f'BÖLÜM {n}', font=ft, fill=(20, 20, 20), anchor='mm')
        boxes = [('SAAT', st['clock'], V.WHITE)]
        if st.get('digits'):
            boxes.append(('RAKAMLAR', st['digits'], V.ORANGE))
        if st.get('radar'):
            boxes.append(('UÇAK', 'RADARDA YOK', V.RED))
        if 'timer' in st:
            if st['timer'] == 'stop':
                boxes.append(('SÜRE', '--:--', V.RED))
            else:
                rem = max(0, st['timer'] - (tv - (timer_t0 or 0)))
                boxes.append(('SÜRE', f'{int(rem // 60):02d}:{int(rem % 60):02d}', V.RED if rem < 35 * 60 else V.ORANGE))
        bw = (V.W - 80 - 20 * (len(boxes) - 1)) / len(boxes)
        for k, (lab, val, col) in enumerate(boxes):
            key = (lab, val if lab != 'SÜRE' else val == '--:--')
            seen.setdefault(key, tv)
            hot = tv - seen[key] < 1.2 and tv > 0.3
            x0 = 40 + k * (bw + 20)
            V.rr(d, (x0, 126, x0 + bw, 206), 18, (18, 18, 20, 210), V.ORANGE if hot else (85, 85, 88), 3)
            d.text((x0 + 18, 140), lab, font=fl, fill=V.GREY, anchor='lt')
            d.text((x0 + bw - 18, 176), val, font=fv if len(val) < 9 else ft, fill=col, anchor='rm')
        for a, b, t1, t2 in cards:
            if a <= tv < b and t1 == 'SEÇİM':
                k = min(1.0, (tv - a) / 0.2)
                y0 = 1500 + int(30 * (1 - k))
                left, right = t2.split('|')
                V.rr(d, (120, y0, 520, y0 + 130), 30, (14, 14, 16, int(230 * k)), V.ORANGE, 5)
                V.rr(d, (560, y0, 960, y0 + 130), 30, (14, 14, 16, int(230 * k)), V.WHITE, 5)
                d.text((320, y0 + 65), left, font=fc2, fill=V.ORANGE, anchor='mm')
                d.text((760, y0 + 65), right, font=fc2, fill=V.WHITE, anchor='mm')
                V.rr(d, (330, y0 + 165, 750, y0 + 225), 16, V.ORANGE)
                d.text((540, y0 + 195), '2. BÖLÜM YAKINDA', font=ft, fill=(15, 15, 15), anchor='mm')
                continue
            if a <= tv < b:
                k = min(1.0, (tv - a) / 0.15)
                y0 = 1460 + int(30 * (1 - k))
                V.rr(d, (110, y0, V.W - 110, y0 + 190), 26, (14, 14, 16, int(225 * k)), V.ORANGE, 4)
                d.text((V.W / 2, y0 + 50), t1, font=ft, fill=V.ORANGE, anchor='mm')
                d.text((V.W / 2, y0 + 120), t2, font=fc2 if len(t2) < 22 else ft, fill=V.WHITE, anchor='mm')
        img.save(f'{folder}/h_{fi:05d}.png', compress_level=1)


if __name__ == '__main__':
    os.makedirs(WORK, exist_ok=True)
    os.makedirs(CACHE, exist_ok=True)
    for a in sys.argv[1:] or [str(k) for k in PARTS]:
        build_part(int(a))
