#!/usr/bin/env python3
"""Bölüm 1 ses efektlerini ElevenLabs sound-generation ile üretir ve işler.

Çıktı: fener/ses/efekt/<ad>.wav  (ham üretimler: fener/ses/efekt/ham/)
Var olan dosyalar yeniden üretilmez.
"""
import os, json, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
HAM = f'{ROOT}/ses/efekt/ham'
OUT = f'{ROOT}/ses/efekt'

# ad: (istem, süre sn)
EFEKT = {
    'deniz_ruzgar': ('Night at sea on a rocky island: heavy waves crashing against rocks, strong cold wind gusts, '
                     'steady ambience, no music, no voices, no birds', 22),
    'tekne_motor': ('A small old wooden fishing boat with a diesel engine idling close by on choppy water, '
                    'then throttling up and motoring away into the distance', 11),
    'sandik': ('Two heavy wooden crates thrown onto wet rocks, two loud thuds and a splash', 3),
    'ic_mekan': ('Inside a small stone room of an old lighthouse at night: muffled howling wind and distant waves outside, '
                 'a quiet wall clock ticking, calm, no music', 22),
    'kalem': ('An old fountain pen writing quickly on rough paper, scratching handwriting sounds', 4),
    'kagit': ('An old sheet of paper pinned to a wall flutters and rustles in a draft', 2.5),
    'fener_yak': ('A heavy iron lever switch clunks, a large lighthouse lamp powers on with a rising electrical hum, '
                  'then a big rotating gear mechanism starts turning with slow mechanical clicks', 7),
    'sis_duduk': ('A lighthouse fog horn blast outdoors over the sea: one long, very deep two-tone diaphone '
                  '"beee-ohhh", powerful and low, with natural outdoor echo', 4),
    'cevap_duduk': ('A ship fog horn answering from out at sea in thick fog: a single long, low, mournful horn tone, '
                    'slightly out of tune and eerie, outdoors', 4),
    'drone': ('Dark ambient horror drone: very low ominous synth pad and deep strings, slowly evolving tension, '
              'no melody, no drums', 22),
    'saat_hizli': ('A mechanical clock ticking very fast as time rushes forward, ending with a soft whoosh', 3),
    'vurus': ('A deep cinematic boom impact with a long dark reverb tail, horror trailer hit', 5),
    'kalp': ('A slow, heavy, low human heartbeat, muffled, tense', 8),
    'gecis': ('A soft dark whoosh transition sound', 1.5),
    'tekne_yaklas': ('A distant boat engine slowly approaching through thick fog at night, muffled, with waves', 8),
    'safak_iskele': ('Calm grey dawn at sea: gentle small waves lapping against a wooden pier, light wind, '
                     'a few very distant seagulls', 10),
    'merdiven': ('Footsteps climbing an iron spiral staircase inside a lighthouse tower, metallic echoing steps', 4),
    'dalga_vurus': ('A single big wave crashing hard against rocks with spray', 3),
}

# işleme: ad -> (kaynak, ffmpeg filtre)
ISLE = {
    'cevap_duduk_uzak': ('cevap_duduk', 'lowpass=f=700,volume=-14dB,aecho=0.8:0.85:600|1100:0.35|0.25,afade=t=in:d=0.4,afade=t=out:st=2.9:d=0.9'),
    'cevap_duduk_orta': ('cevap_duduk', 'lowpass=f=1300,volume=-7dB,aecho=0.8:0.8:400|800:0.3|0.2,afade=t=in:d=0.25,afade=t=out:st=2.9:d=0.9'),
    'cevap_duduk_yakin': ('cevap_duduk', 'asetrate=44100*0.9,aresample=44100,bass=g=6:f=90,volume=2dB,afade=t=in:d=0.08,afade=t=out:st=3.2:d=1.0'),
}


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
