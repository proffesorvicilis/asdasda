#!/usr/bin/env python3
"""Tuhaf Saat · Fener Gece 3 ses miksi: sesler + yağmur/gündüz yatakları (yan zincirle kısılır) + efektler.
Kullanım: python3 tuhaf/gece3/araclar/miks.py [video_sessiz.mp4 çıktı.mp4]
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
cue = lambda fx: next(c['t'] for c in TL['cues'] if c['fx'] == fx)


def scenes():
    order, L = [], TL['lines']
    for i, x in enumerate(L):
        if not order or order[-1]['name'] != x['sc']:
            order.append(dict(name=x['sc'], s=0 if i == 0 else max(L[i - 1]['e'], x['s'] - x.get('pre', 0.12))))
    INSERT = {'slot_disari': 'fener_dis', 'slot_kural2': 'kural2'}
    for c in TL['cues']:
        if c['fx'] in INSERT:
            order.append(dict(name=INSERT[c['fx']], s=c['t'] + 0.05))
    order.sort(key=lambda o: o['s'])
    for i, o in enumerate(order):
        o['e'] = order[i + 1]['s'] if i + 1 < len(order) else DUR
    return {o['name']: o for o in order}


SC = scenes()
w03 = word('L03', 'gitti'); GONE = w03['s'] if w03 else ln('L03')['s'] + 0.4
w04 = word('L04', 'el'); PRINTS = w04['s'] if w04 else ln('L04')['s'] + 1.0
w15 = word('L15', 'yandı'); IGN = (w15['s'] if w15 else ln('L15')['e'] - 0.5) - 0.35
w19 = word('L19', 'açıldı'); ON = (w19['s'] if w19 else ln('L19')['e'] - 0.6) - 0.05
BEDS = [
    ('ruzgar_kapi', 0.0, SC['el_izleri']['s'] + 0.3, -10, 0.3, 0.5),
    ('yagmur_ic', 0.0, SC['el_izleri']['s'] + 0.3, -11, 0.2, 0.4),
    ('drone', 0.0, SC['el_izleri']['s'] + 0.2, -19, 0.5, 0.5),
    ('gunduz', SC['el_izleri']['s'], SC['gunluk3']['s'] + 0.4, -11, 0.4, 0.6),
    ('telsiz_parazit', SC['moss_telsiz']['s'], SC['gunluk3']['s'] + 0.3, -19, 0.2, 0.4),
    ('yagmur_ic', SC['gunluk3']['s'], SC['fener_dis']['s'] + 0.3, -23, 0.6, 0.4),
    ('yagmur_deniz', SC['fener_dis']['s'], SC['merdiven']['s'] + 0.4, -7, 0.2, 0.4),
    ('yagmur_ic', SC['merdiven']['s'], DUR, -11, 0.3, 2.0),
    ('drone', SC['uykusuz']['s'], DUR, -17, 1.5, 2.5),
    ('telsiz_parazit', ON + 0.3, ln('L26')['e'] + 0.3, -17, 0.2, 0.3),
]
ONE = [
    ('kapi_vurus', cue('kapi_vurus'), 0, None, 0.5),
    ('gecis', GONE - 0.1, -12, None, 0.3),
    ('kalp', PRINTS - 0.2, -9, 2.5, 0.8),
    ('telsiz_cizirti', SC['moss_telsiz']['s'], -4, None, 0.3),
    ('sayfa', SC['gunluk3']['s'] - 0.1, -6, 0.9, 0.3),
    ('gecis', SC['fener_dis']['s'] - 0.1, -12, None, 0.3),
    ('adim_tas', cue('adim_tas'), -4, 3.4, 0.8),
    ('fener_yak', IGN - 0.25, -2, 4.5, 1.2),
    ('kagit', cue('kagit'), -4, None, 0.4),
    ('kalp', SC['kural5']['s'] + 0.8, -9, 2.5, 1.0),
    ('telsiz_acilma', ON, 0, None, 0.4),
    ('telsiz_cizirti', ln('L24')['e'] + 0.08, -6, 0.4, 0.15),
    ('vurus', cue('vurus'), -8, None, 1.5),
    ('vurus', SC['secim']['s'] + 0.05, -7, None, 2.0),
    ('kalp', SC['secim']['s'] + 1.0, -10, None, 2.0),
    ('ses_yanki', ln('L28')['e'] + 0.8, -11, None, 0.5),
]


def bekci_yanki():
    """Son ekranda 'Moss, benim.' telsizden yankılanır (senin sesin)."""
    L = ln('L20')
    wb = word('L20', 'benim')
    end = (wb['e'] if wb else L['s'] + 1.0) + 0.15
    out = f'{FX}/ses_yanki.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f"{L['s'] - 0.03:.3f}", '-t', f"{end - L['s'] + 0.03:.3f}", '-i', NAR,
                    '-af', 'highpass=f=300,lowpass=f=3000,aecho=0.8:0.7:220|440:0.4|0.25,afade=t=out:st=0.9:d=0.6,apad=pad_dur=0.8',
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
