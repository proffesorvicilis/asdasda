#!/usr/bin/env python3
"""Tuhaf Saat · Fener Gece 1 ses efektlerini ElevenLabs sound-generation ile üretir ve işler.

Çıktı: fener/ses/efekt/<ad>.wav  (ham üretimler: fener/ses/efekt/ham/)
Var olan dosyalar yeniden üretilmez.
"""
import os, json, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
HAM = f'{ROOT}/ses/efekt/ham'
OUT = f'{ROOT}/ses/efekt'

# ad: (istem, süre sn)
EFEKT = {
    # 1. geceden gelenler (ham dosyalar hazır)
    'yagmur_deniz': ('', 22), 'yagmur_ic': ('', 22), 'adim_tas': ('', 8), 'fener_yak': ('', 7), 'kalem': ('', 4),
    'telsiz_cizirti': ('', 2), 'telsiz_parazit': ('', 6), 'drone': ('', 22), 'kalp': ('', 8), 'vurus': ('', 5),
    'gecis': ('', 1.5), 'kagit': ('', 2.5),
    # 2. gece için yeni
    'kapi_vurus': ('Three slow, heavy knocks on a thick old wooden door at night, echoing inside a stone room', 3.5),
    'telsiz_acilma': ('An old marine radio switches on by itself: a sharp click, a rising electrical hum and soft static', 3),
    'yuk_gemisi': ('A large cargo ship passing far away at night in the rain: deep engine rumble and one long low ship horn', 8),
    'sayfa': ('Old notebook pages being turned one after another, dry paper flips', 3),
    'ruzgar_kapi': ('Cold wind howling outside a heavy wooden door at night, gusts whistling through the cracks', 10),
    'gunduz': ('Calm daytime on a rocky island: gentle waves, light wind and seagulls in the distance, no music', 15),
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
