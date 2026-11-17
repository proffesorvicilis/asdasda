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
    ms = next((c for c in TL['cues'] if c['fx'] == 'slot_merdiven'), None)
    if ms:
        i = next(i for i, o in enumerate(order) if o['name'] == 'lamba')
        order.insert(i, dict(name='merdiven', s=ms['t'] + 0.05))
    for i, o in enumerate(order):
        o['e'] = order[i + 1]['s'] if i + 1 < len(order) else DUR
    return {o['name']: o for o in order}


SC = scenes()
cue = lambda fx: next(c['t'] for c in TL['cues'] if c['fx'] == fx)
w02 = word('L02', 'açıldı'); ON = (w02['s'] if w02 else ln('L02')['e'] - 0.6) - 0.05
w16 = word('L16', 'yandı'); IGN = (w16['s'] if w16 else ln('L16')['e'] - 0.5) - 0.35
L12, L13 = ln('L12'), ln('L13'); span = L13['s'] - L12['s']
FLIPS = [L12['s'] + span * 0.34, L12['s'] + span * 0.67, L13['s'] - 0.1]
BEDS = [
    ('yagmur_ic', 0.0, SC['gemi']['s'] + 0.3, -8, 0.2, 0.4),
    ('yagmur_deniz', SC['gemi']['s'], SC['gunduz']['s'] + 0.3, -10, 0.3, 0.4),
    ('yagmur_ic', SC['masa_sessiz2']['s'], SC['gemi']['s'] + 0.2, -9, 0.2, 0.3),
    ('telsiz_parazit', ON + 0.4, SC['masa_sessiz2']['s'], -16, 0.2, 0.3),
    ('gunduz', SC['gunduz']['s'], SC['harlan_foto']['s'] + 0.4, -10, 0.4, 0.6),
    ('telsiz_parazit', SC['moss_telsiz']['s'], SC['harlan_foto']['s'] + 1.5, -19, 0.2, 0.6),
    ('yagmur_ic', SC['harlan_foto']['s'], SC['lamba']['s'] + 0.3, -13, 0.6, 0.4),
    ('yagmur_ic', SC['lamba']['s'], SC['kapi_ic']['s'] + 0.3, -8, 0.3, 0.4),
    ('ruzgar_kapi', SC['kapi_ic']['s'], DUR, -9, 0.4, 2.0),
    ('drone', SC['gunluk']['s'] + 4, SC['kapi_ic']['s'], -20, 2.0, 1.0),
    ('drone', SC['kapi_ic']['s'] - 0.3, DUR, -15, 0.8, 2.5),
]
ONE = [
    ('telsiz_acilma', ON, 0, None, 0.4),
    ('yuk_gemisi', SC['gemi']['s'], -6, None, 1.5),
    ('telsiz_cizirti', SC['moss_telsiz']['s'], -4, None, 0.3),
    ('gecis', SC['gunluk']['s'] - 0.25, -12, None, 0.3),
    ('kalem', ln('L14')['s'] + 0.8, -12, 2.0, 0.4),
    ('kalem', ln('L15')['s'] + 0.8, -12, 2.4, 0.4),
    ('adim_tas', cue('adim_tas'), -4, 3.0, 0.8),
    ('fener_yak', IGN - 0.25, -2, 4.5, 1.2),
    ('kapi_vurus', cue('kapi_vurus'), 0, None, 0.5),
    ('kalp', SC['kapi_bekci']['s'], -8, None, 1.5),
    ('vurus', SC['harlan_kasket']['s'] + 0.05, -9, None, 1.5),
    ('vurus', SC['secim']['s'] + 0.05, -7, None, 2.0),
    ('kalp', SC['secim']['s'] + 1.0, -10, None, 2.0),
    ('lutfen_yanki', ln('L23')['e'] + 0.6, -9, None, 0.5),
    ('lutfen_yanki', ln('L23')['e'] + 2.5, -15, None, 0.5),
]
for f in FLIPS:
    ONE.append(('sayfa', f - 0.15, -6, 0.9, 0.3))


def bekci_yanki():
    L = ln('L19')
    out = f'{FX}/lutfen_yanki.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f"{L['s'] - 0.03:.3f}", '-t', f"{L['e'] - L['s'] + 0.12:.3f}", '-i', NAR,
                    '-af', 'highpass=f=300,lowpass=f=3000,aecho=0.8:0.7:220|440:0.4|0.25,afade=t=out:st=1.2:d=0.6,apad=pad_dur=0.8',
                    '-ar', '44100', '-ac', '2', out], check=True)
    return out


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
