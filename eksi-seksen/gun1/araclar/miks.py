#!/usr/bin/env python3
"""Eksi Seksen · Gün 1 ses miksi: sesler + ortam yatakları (yan zincirle kısılır) + efektler.
Kullanım: python3 eksi-seksen/gun1/araclar/miks.py [video_sessiz.mp4 çıktı.mp4]
"""
import json, os, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TL = json.load(open(f'{ROOT}/motor/timeline.json'))
FX = f'{ROOT}/ses/efekt'
NAR = f'{ROOT}/ses/anlatim.wav'
OUT = f'{ROOT}/ses/miks.wav'
DUR = TL['duration']
ln = lambda i: next(x for x in TL['lines'] if x['id'] == i)
word = lambda lid, pat: next((w for w in TL['words'] if w['line'] == lid and pat in w['w'].lower()), None)
cues = lambda fx: [c['t'] for c in TL['cues'] if c['fx'] == fx]


def scenes():
    order, L = [], TL['lines']
    for i, x in enumerate(L):
        if not order or order[-1]['name'] != x['sc']:
            order.append(dict(name=x['sc'], s=0 if i == 0 else max(L[i - 1]['e'], x['s'] - x.get('pre', 0.12))))
    for i, o in enumerate(order):
        o['e'] = order[i + 1]['s'] if i + 1 < len(order) else DUR
    return {o['name']: o for o in order}


SC = scenes()
s_ = lambda n: SC[n]['s']
e_ = lambda n: SC[n]['e']
w27 = word('L27', 'yarısı'); HALF = w27['s'] if w27 else ln('L27')['e'] - 0.6
BEDS = [
    ('sehir', 0.0, s_('park') + 0.3, -21, 0.5, 0.4),
    ('kosu', s_('park'), e_('park') + 0.2, -11, 0.2, 0.4),
    ('ruzgar_kapi', s_('park'), e_('park') + 0.2, -22, 0.4, 0.4),
    ('kafe', s_('kafe'), s_('eczane') + 0.2, -15, 0.3, 0.3),
    ('sehir', s_('eczane'), s_('haber_bandi') + 0.3, -14, 0.2, 0.3),
    ('kafe', s_('haber_bandi'), ln('L13')['s'], -21, 0.2, 0.3),
    ('drone', ln('L13')['s'] - 0.2, s_('tel_aras') + 0.4, -20, 0.4, 0.5),
    ('ruzgar_kapi', s_('tel_aras'), s_('foto') + 0.3, -19, 0.4, 0.5),
    ('drone', s_('foto'), s_('tel_cinar'), -25, 0.5, 0.4),
    ('sehir', s_('tel_cinar'), s_('kapi'), -22, 0.3, 0.3),
    ('oda_gece', s_('kapi'), DUR, -19, 0.6, 2.0),
    ('tencere', s_('mutfak_aksam') - 0.2, s_('tv_aksam') + 0.6, -12, 0.4, 0.8),
    ('drone', s_('grafik'), DUR, -18, 1.5, 2.5),
    ('ruzgar_kapi', s_('grafik'), DUR, -24, 1.0, 2.0),
]
ONE = [
    ('alarm', 0.0, -8, 3.4, 0.4),
    ('kahve', s_('mutfak') + 0.1, -12, None, 0.5),
    ('gulus', ln('L10')['s'] - 0.05, -10, None, 0.4),
    ('gecis', ln('L13')['s'] - 0.25, -12, None, 0.3),
    ('gecis', s_('ciftlik') - 0.2, -14, None, 0.3),
    ('kalp', HALF - 0.1, -11, 3.0, 1.0),
    ('kalp', ln('L35')['s'], -12, 3.0, 1.0),
    ('vurus', s_('secim') + 0.05, -7, None, 2.0),
    ('kalp', s_('secim') + 1.0, -11, None, 2.0),
]
for c in cues('tv_jingle'):
    ONE.append(('tv_jingle', c, -9, None, 0.4))
for c in cues('arama_ton'):
    ONE.append(('arama_ton', c, -8, None, 0.3))
for c in cues('kapi_zil'):
    ONE.append(('kapi_zil', c, -6, None, 0.4))
ONE.append(('tv_jingle', s_('tv_aksam') - 0.05, -15, None, 0.4))


def bekci_yanki():
    return None


def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p],
                                capture_output=True, text=True).stdout)


def build():
    bekci_yanki()
    args = ['ffmpeg', '-v', 'error', '-y', '-i', NAR]
    filt = ['[0:a]aformat=channel_layouts=stereo,asplit=2[nar][sc]']
    idx, beds, ones = 1, [], []
    for name, s, e, db, fi, fo in BEDS:
        d = max(0.1, e - s)
        args += ['-stream_loop', '-1', '-i', f'{FX}/{name}.wav']
        filt.append(f'[{idx}:a]atrim=0:{d:.3f},asetpts=PTS-STARTPTS,aformat=channel_layouts=stereo,volume={db}dB,'
                    f'afade=t=in:d={fi},afade=t=out:st={max(0, d - fo):.3f}:d={fo},adelay={int(s * 1000)}|{int(s * 1000)}[b{idx}]')
        beds.append(f'[b{idx}]'); idx += 1
    filt.append(f'{"".join(beds)}amix=inputs={len(beds)}:normalize=0:duration=longest[bedmix]')
    filt.append('[bedmix][sc]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=400:makeup=1[beds]')
    for name, t0, db, trim, fo in ONE:
        args += ['-i', f'{FX}/{name}.wav']
        dd = trim if trim else dur(f'{FX}/{name}.wav')
        tr = f'atrim=0:{trim},' if trim else ''
        filt.append(f'[{idx}:a]{tr}asetpts=PTS-STARTPTS,aformat=channel_layouts=stereo,volume={db}dB,'
                    f'afade=t=out:st={max(0, dd - fo):.3f}:d={fo},adelay={int(max(0, t0) * 1000)}|{int(max(0, t0) * 1000)}[o{idx}]')
        ones.append(f'[o{idx}]'); idx += 1
    filt.append(f'[nar][beds]{"".join(ones)}amix=inputs={2 + len(ones)}:normalize=0:duration=first,'
                f'atrim=0:{DUR:.3f},alimiter=limit=0.95:level=disabled,loudnorm=I=-13.2:TP=-1.5:LRA=11,alimiter=limit=0.72:level=disabled[out]')
    args += ['-filter_complex', ';'.join(filt), '-map', '[out]', '-ar', '48000', '-ac', '2', OUT]
    subprocess.run(args, check=True)
    print('miks:', OUT)


def mux(video, out):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-i', OUT, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], check=True)
    print('video:', out)


if __name__ == '__main__':
    build()
    if len(sys.argv) == 3:
        mux(sys.argv[1], sys.argv[2])
