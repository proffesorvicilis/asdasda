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
    'yagmur_deniz': ('Heavy rain falling on a stormy sea at night, strong wind gusts, waves hitting rocks, steady ambience, '
                     'no music, no voices', 22),
    'yagmur_ic': ('Inside an old stone lighthouse room at night during a storm: heavy rain beating on a small round window, '
                  'muffled wind, occasional distant thunder, no music', 22),
    'tekne_motor': ('A small old wooden fishing boat with a diesel engine idling close by on choppy water, '
                    'then throttling up and motoring away into the distance', 11),
    'kapi': ('A heavy old wooden door with iron studs: the metal handle turns, the latch clacks and the door creaks open slowly', 3.5),
    'gok_gurultu': ('A loud thunder crack followed by a long deep rolling rumble over the sea', 6),
    'adim_tas': ('Steady footsteps climbing worn stone stairs inside a tall lighthouse tower, echoing, unhurried', 8),
    'fener_yak': ('A heavy iron lever switch clunks, a large lighthouse lamp powers on with a rising electrical hum, '
                  'then a big rotating gear mechanism starts turning with slow mechanical clicks', 7),
    'kalem': ('A pencil writing quickly on paper in a logbook, scratching handwriting sounds', 4),
    'saat_tik': ('A single old wall clock ticking loudly in a silent room, slow steady tick tock', 5),
    'saat_vurus': ('An old pendulum clock striking three times, deep warm bell chimes in a quiet room', 6),
    'telsiz_cizirti': ('A VHF marine radio suddenly crackles to life: squelch burst, static noise and a sharp click', 2),
    'telsiz_parazit': ('Marine radio static hiss with faint broken interference and crackles, eerie, no voices', 6),
    'drone': ('Dark ambient horror drone: very low ominous synth pad and deep strings, slowly evolving tension, '
              'no melody, no drums', 22),
    'kalp': ('A slow, heavy, low human heartbeat, muffled, tense', 8),
    'vurus': ('A deep cinematic boom impact with a long dark reverb tail, horror trailer hit', 5),
    'gecis': ('A soft dark whoosh transition sound', 1.5),
    'kagit': ('An old sheet of paper pinned to a wall flutters and rustles in a draft', 2.5),
    'karalama': ('A pen violently scribbling over words on paper, harsh fast scratching', 2.5),
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
