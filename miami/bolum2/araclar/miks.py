#!/usr/bin/env python3
"""Miami · Bölüm 2 ses miksi: sesler + ortam yatakları (konuşmayla kısılır) + efektler.
Kullanım: python3 miami/bolum2/araclar/miks.py [video_sessiz.mp4 çıktı.mp4]
Zamanlar orijinal videoya göre sabittir (konuşma da o saniyelere sabitlenmiştir).
"""
import json, os, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TL = json.load(open(f'{ROOT}/motor/timeline.json'))
FX = f'{ROOT}/ses/efekt'
NAR = f'{ROOT}/ses/anlatim.wav'
OUT = f'{ROOT}/ses/miks.wav'
DUR = TL['duration']

# (ad, başlangıç, bitiş, dB, giriş solması, çıkış solması)
BEDS = [
    ('dalga_yaklasma', 0.0, 4.4, -12, 0.3, 0.6),
    ('bunker_ic', 4.6, 17.8, -16, 1.0, 0.4),
    ('su_sizma', 11.8, 17.7, -13, 1.4, 0.3),
    ('su_alti', 17.7, 26.9, -10, 0.5, 0.6),
    ('su_sehir', 26.6, 31.5, -17, 0.6, 0.8),
    ('dalga_uzak', 29.2, 31.8, -13, 0.8, 0.6),
    ('heli_yaklasma', 30.9, 33.8, -11, 0.9, 0.5),
    ('helikopter', 33.3, DUR, -10, 0.8, 1.2),
]
# (ad, zaman, dB, kırpma sn, çıkış solması)
ONE = [
    ('kapak_kapanis', 3.85, -4, 3.0, 0.8),
    ('cark_cevir', 4.3, -9, 3.0, 0.5),
    ('dalga_carpma', 3.0, -8, 6.6, 1.4),
    ('tekne_darbe', 15.5, -6, None, 0.4),
    ('nefes_oksuru', 17.75, -10, 0.9, 0.2),
    ('alarm_siren', 18.4, -12, 1.3, 0.25),
    ('nefes_oksuru', 26.3, -7, None, 0.6),
    ('su_sicrama', 26.3, -8, None, 0.5),
    ('merdiven', 33.9, -13, None, 0.4),
    ('merdiven', 38.3, -15, None, 0.4),
    ('secim_pop', 41.85, -10, None, 0.2),
    ('secim_pop', 42.25, -10, None, 0.2),
    ('secim_pop', 42.7, -10, None, 0.2),
]


def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)


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
    filt.append('[bedmix][sc]sidechaincompress=threshold=0.02:ratio=6:attack=15:release=300:makeup=1[beds]')
    for name, t0, db, trim, fo in ONE:
        args += ['-i', f'{FX}/{name}.wav']
        dd = trim if trim else dur(f'{FX}/{name}.wav')
        tr = f'atrim=0:{trim},' if trim else ''
        filt.append(f'[{idx}:a]{tr}asetpts=PTS-STARTPTS,aformat=channel_layouts=stereo,volume={db}dB,'
                    f'afade=t=out:st={max(0, dd - fo):.3f}:d={fo},adelay={int(max(0, t0) * 1000)}|{int(max(0, t0) * 1000)}[o{idx}]')
        ones.append(f'[o{idx}]'); idx += 1
    filt.append(f'[nar][beds]{"".join(ones)}amix=inputs={2 + len(ones)}:normalize=0:duration=first,'
                f'atrim=0:{DUR:.3f},alimiter=limit=0.95:level=disabled,loudnorm=I=-13.5:TP=-1.5:LRA=11,alimiter=limit=0.72:level=disabled[out]')
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
