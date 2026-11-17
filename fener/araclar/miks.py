#!/usr/bin/env python3
"""Bölüm 1 ses miksi: anlatım + ambiyans yatakları (yan zincirle kısılır) + tek seferlik efektler.

Çıktı: fener/ses/miks.wav  (-14 LUFS, Instagram için)
Kullanım: python3 fener/araclar/miks.py [video_sessiz.mp4 çıktı.mp4]  (video verilirse birleştirir)
"""
import json, os, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TL = json.load(open(f'{ROOT}/motor/timeline.json'))
FX = f'{ROOT}/ses/efekt'
NAR = f'{ROOT}/ses/anlatim.wav'
OUT = f'{ROOT}/ses/miks.wav'
DUR = TL['duration']


def ln(i):
    return next(x for x in TL['lines'] if x['id'] == i)


def scenes():
    order = []
    L = TL['lines']
    for i, x in enumerate(L):
        if not order or order[-1]['name'] != x['sc']:
            s = 0 if i == 0 else max(L[i - 1]['e'], x['s'] - 0.12)
            order.append(dict(name=x['sc'], s=s))
    for o in order:
        if o['name'].startswith('cevap'):
            n = o['name'][-1]
            c = next(c for c in TL['cues'] if c.get('slot') == 'duduk' + n and c['fx'].startswith('cevap'))
            o['s'] = c['t'] - 0.04
    for i, o in enumerate(order):
        o['e'] = order[i + 1]['s'] if i + 1 < len(order) else DUR
    return {o['name']: o for o in order}


SC = scenes()
cue = lambda slot, kind: next(c['t'] for c in TL['cues'] if c.get('slot') == slot and c['fx'].startswith(kind))
w17 = [w for w in TL['words'] if w['line'] == 'L17']
IGNITE = w17[2]['s'] - 0.15 + 0.75

# --- Yataklar: (dosya, başlangıç, bitiş, ses düzeyi dB, giriş fade, çıkış fade)
BEDS = [
    ('deniz_ruzgar', 0.0, SC['riza_eski']['s'] + 0.3, -14, 0.3, 0.6),
    ('ic_mekan', SC['riza_eski']['s'], SC['iskele_safak']['s'] + 0.3, -4, 0.4, 0.4),
    ('safak_iskele', SC['iskele_safak']['s'], SC['oda']['s'] + 0.3, -6, 0.5, 0.6),
    ('ic_mekan', SC['oda']['s'], SC['yakma']['s'] + 1.4, -2, 0.5, 0.5),
    ('deniz_ruzgar', SC['yakma']['s'], SC['kural4']['s'] + 0.3, -12, 0.8, 0.4),
    ('ic_mekan', SC['kural4']['s'], SC['tekne']['s'] + 0.3, -5, 0.3, 0.3),
    ('deniz_ruzgar', SC['tekne']['s'], SC['salter']['s'] + 0.4, -10, 0.3, 0.6),
    ('ic_mekan', SC['salter']['s'], DUR, -5, 0.4, 2.0),
    ('drone', SC['riza_yakin']['s'] - 1, SC['oda']['s'], -20, 1.0, 1.2),
    ('drone', SC['kurallar']['s'] + 20, DUR, -17, 4.0, 2.5),
]

# --- Tek seferlik efektler: (dosya, zaman, dB, kırpma süresi veya None, çıkış fade)
L01, L02 = ln('L01'), ln('L02')
ONE = [
    ('tekne_motor', 0.0, -15, 9.0, 2.0),
    ('sandik', L01['s'] + 1.72, -7, 0.9, 0.3),
    ('sandik', L01['s'] + 2.72, -9, 0.9, 0.3),
    ('dalga_vurus', 7.0, -15, None, 0.8),
    ('gecis', SC['riza_eski']['s'] - 0.35, -10, None, 0.3),
    ('vurus', ln('L09')['s'] - 0.05, -12, None, 1.5),
    ('kagit', SC['oda']['s'] + 0.3, 2, None, 0.4),
    ('gecis', SC['kurallar']['s'] - 0.3, -12, None, 0.3),
    ('gecis', SC['yakma']['s'] - 0.25, -10, None, 0.3),
    ('fener_yak', IGNITE - 0.45, -2, 5.5, 1.5),
    ('saat_hizli', SC['sis']['s'] + 0.2, 0, None, 0.5),
    ('dalga_vurus', SC['tekne']['s'] + 2.8, -10, None, 0.8),
    ('tekne_yaklas', SC['tekne']['s'], -6, None, 1.5),
    ('kalp', cue('duduk3', 'sis_duduk') + 2.2, -4, 1.4, 0.2),
    ('vurus', cue('duduk3', 'cevap'), -3, None, 2.0),
    ('dalga_vurus', cue('duduk3', 'cevap') + 0.2, -6, None, 0.8),
    ('kalp', SC['salter']['s'], -6, None, 1.0),
    ('vurus', SC['secim']['s'] + 0.05, -8, None, 2.0),
    ('kalp', SC['secim']['s'] + 1.0, -9, None, 2.0),
]
for i in range(5):  # kalem: kurallar yazılırken
    t0 = ln(f'L{11 + i}')['s'] - 0.15
    ONE.append(('kalem', t0, -3, 2.0 if i == 4 else 1.6, 0.3))
for c in TL['cues']:
    if c['fx'] == 'sis_duduk':
        ONE.append(('sis_duduk', c['t'], -2, 2.7, 0.6))
    elif c['fx'].startswith('cevap_duduk'):
        ONE.append((c['fx'], c['t'], 0, None, 0.6))


def build():
    args = ['ffmpeg', '-v', 'error', '-y', '-i', NAR]
    filt = ['[0:a]aformat=channel_layouts=stereo,volume=1.0,asplit=2[nar][sc]']
    idx = 1
    beds = []
    for name, s, e, db, fi, fo in BEDS:
        d = max(0.1, e - s)
        args += ['-stream_loop', '-1', '-i', f'{FX}/{name}.wav']
        filt.append(f'[{idx}:a]atrim=0:{d:.3f},asetpts=PTS-STARTPTS,aformat=channel_layouts=stereo,volume={db}dB,'
                    f'afade=t=in:d={fi},afade=t=out:st={max(0, d - fo):.3f}:d={fo},adelay={int(s * 1000)}|{int(s * 1000)}[b{idx}]')
        beds.append(f'[b{idx}]')
        idx += 1
    filt.append(f'{"".join(beds)}amix=inputs={len(beds)}:normalize=0:duration=longest[bedmix]')
    filt.append('[bedmix][sc]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=400:makeup=1[beds]')
    ones = []
    for name, t0, db, trim, fo in ONE:
        args += ['-i', f'{FX}/{name}.wav']
        tr = f'atrim=0:{trim},' if trim else ''
        dd = trim if trim else float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{FX}/{name}.wav'], capture_output=True, text=True).stdout)
        filt.append(f'[{idx}:a]{tr}asetpts=PTS-STARTPTS,aformat=channel_layouts=stereo,volume={db}dB,'
                    f'afade=t=out:st={max(0, dd - fo):.3f}:d={fo},adelay={int(max(0, t0) * 1000)}|{int(max(0, t0) * 1000)}[o{idx}]')
        ones.append(f'[o{idx}]')
        idx += 1
    filt.append(f'[nar][beds]{"".join(ones)}amix=inputs={2 + len(ones)}:normalize=0:duration=first,'
                f'atrim=0:{DUR:.3f},alimiter=limit=0.95:level=disabled,loudnorm=I=-14:TP=-1.5:LRA=11[out]')
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
