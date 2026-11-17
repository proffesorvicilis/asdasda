#!/usr/bin/env python3
"""Eksi Seksen Gün 1 ses efektlerini ElevenLabs sound-generation ile üretir ve işler.

Çıktı: fener/ses/efekt/<ad>.wav  (ham üretimler: fener/ses/efekt/ham/)
Var olan dosyalar yeniden üretilmez.
"""
import os, json, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
HAM = f'{ROOT}/ses/efekt/ham'
OUT = f'{ROOT}/ses/efekt'

# ad: (istem, süre sn)
EFEKT = {
    # Fener'den gelenler (ham dosyalar hazır)
    'drone': ('', 22), 'kalp': ('', 8), 'vurus': ('', 5), 'gecis': ('', 1.5), 'ruzgar_kapi': ('', 10),
    # Eksi Seksen · Gün 1
    'alarm': ('A modern smartphone alarm ringing softly on a bedside table in a quiet bedroom, gentle repeating marimba tone', 4),
    'kahve': ('An espresso machine grinding and brewing coffee in a quiet kitchen in the morning', 5),
    'tv_jingle': ('A short dramatic TV news intro sting, electronic, three seconds, no voice', 3),
    'kosu': ('Footsteps of a person jogging on frozen crunchy gravel in a quiet winter park, steady breathing, no birds', 10),
    'kafe': ('Busy cafe ambience at noon, people chatting softly in Turkish, cups and spoons clinking, espresso machine in background', 15),
    'gulus': ('A small group of friends at a cafe table laughing briefly and casually', 3),
    'sehir': ('Cold winter city morning ambience, distant traffic, a bus passing, light cold wind, no birds', 15),
    'arama_ton': ('Two rings of a modern phone call ringback tone heard from a smartphone earpiece', 2.5),
    'kapi_zil': ('An apartment doorbell ding dong, then a door unlocking and opening', 3),
    'tencere': ('A pot of soup simmering on a stove and a pressure cooker softly hissing in a cozy kitchen at night', 12),
    'oda_gece': ('Quiet warm apartment at night, a refrigerator hum, cold wind faintly outside the window', 15),
}

# işleme: ad -> (kaynak, ffmpeg filtre)
ISLE = {}


def run(c):
    subprocess.run(c, check=True)


def gen(name, prompt, d):
    raw = f'{HAM}/{name}.mp3'
    if os.path.exists(raw):
        return raw
    body = {'text': prompt, 'duration_seconds': d, 'prompt_influence': 0.45}
    r = subprocess.run(['curl', '-sS', '-o', raw, '-w', '%{http_code}', '-X', 'POST',
                        'https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128',
                        '-H', 'Content-Type: application/json', '--data-binary', json.dumps(body)],
                       capture_output=True, text=True)
    if r.stdout != '200':
        err = open(raw, 'rb').read()[:300]
        os.remove(raw)
        raise RuntimeError(f'{name}: {r.stdout} {err}')
    print('  üretildi:', name, flush=True)
    return raw


def main():
    os.makedirs(HAM, exist_ok=True)
    only = sys.argv[1:]
    for name, (prompt, d) in EFEKT.items():
        if only and name not in only:
            continue
        raw = gen(name, prompt, d)
        out = f'{OUT}/{name}.wav'
        run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-ar', '44100', '-ac', '2', out])
    for name, (src, af) in ISLE.items():
        run(['ffmpeg', '-v', 'error', '-y', '-i', f'{OUT}/{src}.wav', '-af', af, '-ar', '44100', '-ac', '2', f'{OUT}/{name}.wav'])
    print('efektler hazır:', len(os.listdir(OUT)) - 1)


if __name__ == '__main__':
    main()
