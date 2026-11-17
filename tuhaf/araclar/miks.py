#!/usr/bin/env python3
"""Tuhaf Saat · Fener Gece 1 ses miksi: sesler + yağmur yatakları (yan zincirle kısılır) + efektler. -14 LUFS.
Kullanım: python3 tuhaf/araclar/miks.py [video_sessiz.mp4 çıktı.mp4]
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


def scenes():
    order, L = [], TL['lines']
    for i, x in enumerate(L):
        if not order or order[-1]['name'] != x['sc']:
            order.append(dict(name=x['sc'], s=0 if i == 0 else max(L[i - 1]['e'], x['s'] - x.get('pre', 0.12))))
    for o in order:
        if o['name'] == 'telsiz':
            c = next(c for c in TL['cues'] if c['fx'] == 'telsiz_cizirti')
            o['s'] = c['t'] - 0.04
    for i, o in enumerate(order):
        o['e'] = order[i + 1]['s'] if i + 1 < len(order) else DUR
    return {o['name']: o for o in order}


SC = scenes()
cue = lambda fx: next(c['t'] for c in TL['cues'] if c['fx'] == fx)
BEDS = [
    ('yagmur_deniz', 0.0, SC['masa']['s'] + 0.4, -7, 0.3, 0.6),
    ('yagmur_ic', SC['masa']['s'], SC['saat']['s'] + 0.2, -5, 0.5, 0.5),
    ('yagmur_ic', SC['saat']['s'], SC['telsiz']['s'], -17, 0.2, 0.3),
    ('yagmur_ic', SC['telsiz']['s'], SC['pencere']['s'] + 0.3, -11, 0.3, 0.3),
    ('yagmur_deniz', SC['pencere']['s'], SC['masa2']['s'] + 0.3, -9, 0.3, 0.4),
    ('yagmur_ic', SC['masa2']['s'], DUR, -8, 0.3, 2.0),
    ('telsiz_parazit', SC['telsiz']['s'] + 0.6, SC['pencere']['s'], -16, 0.3, 0.4),
    ('drone', SC['kurallar']['s'] + 10, SC['lamba']['s'], -22, 2.0, 1.0),
    ('drone', SC['saat']['s'] - 0.5, DUR, -16, 1.5, 2.5),
]
L06w = word('L06', 'kayboldu')
L12k = word('L12', 'karalan')
L12s = word('L12', 'sertçe')
L18w = word('L18', 'üç')
pullT = ln('L16')['s'] - 0.35
ONE = [
    ('tekne_motor', SC['iskele']['s'] - 0.3, -11, 10.0, 2.0),
    ('kapi', SC['kapi']['s'] + 0.02, -6, 2.2, 0.5),
    ('gok_gurultu', (L06w['s'] if L06w else ln('L06')['s']) - 0.05, -2, None, 1.5),
    ('gecis', SC['kurallar']['s'] - 0.3, -12, None, 0.3),
    ('kagit', SC['kurallar']['s'] + 0.1, 0, None, 0.4),
    ('karalama', (L12k['s'] if L12k else ln('L12')['s'] + 1) - 0.1, -2, None, 0.5),
    ('vurus', (L12s['s'] if L12s else ln('L12')['e'] - 0.6) - 0.05, -12, None, 1.5),
    ('adim_tas', SC['merdiven']['s'], -5, 5.0, 1.0),
    ('fener_yak', pullT - 0.25, -1, 5.5, 1.5),
    ('kalem', ln('L17')['s'] - 0.1, -5, 3.2, 0.4),
    ('saat_tik', SC['saat']['s'], -2, None, 0.5),
    ('saat_vurus', (L18w['s'] if L18w else ln('L18')['s']) - 0.05, -6, None, 1.5),
    ('telsiz_cizirti', cue('telsiz_cizirti'), 0, None, 0.3),
    ('telsiz_parazit', cue('telsiz_parazit'), -6, 4.6, 1.0),
    ('kalp', cue('telsiz_parazit'), -6, 4.6, 1.0),
    ('vurus', SC['secim']['s'] + 0.05, -7, None, 2.0),
    ('kalp', SC['secim']['s'] + 1.0, -10, None, 2.0),
]
for i in range(4):
    ONE.append(('kalem', ln(f'L{8 + i:02d}')['s'] - 0.1, -7, 1.5, 0.3))


def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p],
                                capture_output=True, text=True).stdout)


def build():
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
                f'atrim=0:{DUR:.3f},alimiter=limit=0.95:level=disabled,loudnorm=I=-13.2:TP=-1.5:LRA=11,alimiter=limit=0.82:level=disabled[out]')
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
