#!/usr/bin/env python3
"""Miami · Bölüm 2 ses efektlerini ElevenLabs sound-generation ile üretir ve işler.

Çıktı: ses/efekt/<ad>.wav  (ham üretimler: ses/efekt/ham/)
Var olan dosyalar yeniden üretilmez.
"""
import os, json, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
HAM = f'{ROOT}/ses/efekt/ham'
OUT = f'{ROOT}/ses/efekt'

# ad: (istem, süre sn)
EFEKT = {
    'dalga_yaklasma': ('A distant deep rumbling roar of a gigantic tsunami wave approaching a sandy beach, ominous, slowly building louder, faint wind, no voices', 8),
    'dalga_carpma': ('A massive tsunami wave crashing with a thunderous roar against a concrete bunker, heard muffled from inside, deep rumble and creaking metal', 8),
    'kapak_kapanis': ('A heavy steel hatch slamming shut with a deep metallic clang echoing, then a big metal wheel handle being cranked tight with squeaking and clunking', 6),
    'bunker_ic': ('Inside a sealed concrete underground bunker during a tsunami, muffled deep rumbling outside, metal creaking and groaning, occasional water drips, tense atmosphere', 15),
    'su_sizma': ('Water spraying and gushing through gaps around a metal hatch into an enclosed bunker, loud hissing streams of water increasing in force, metal creaking', 10),
    'tekne_darbe': ('A heavy muffled thud and a boat hull scraping and grinding over a metal hatch, heard from underneath inside a bunker', 3),
    'alarm_siren': ('A flood warning klaxon alarm blaring loudly inside a flooding bunker, pulsing electronic alarm, rushing water', 3),
    'su_alti': ('Underwater ambience in murky sea water, muffled deep rumbling, bubbles rising, distant debris scraping, eerie and tense', 15),
    'nefes_oksuru': ('A young man bursting up through the water surface, gasping loudly for air and then coughing and spluttering violently', 3),
    'su_sicrama': ('A person breaking through the surface of the water with a splash', 2),
    'su_sehir': ('Gentle lapping of floodwater in a flooded city street at sunset, a distant siren, light wind, eerie quiet', 15),
    'dalga_uzak': ('A distant gigantic ocean wave rumbling and rising on the horizon, ominous deep roar slowly growing', 8),
    'heli_yaklasma': ('A rescue helicopter approaching from far away, rotor blades chopping getting louder and louder', 6),
    'helikopter': ('A rescue helicopter hovering right overhead, loud rotor chopping and strong downwash wind and spray, steady', 15),
    'merdiven': ('A metal rope ladder rattling and clanking in strong wind beneath a helicopter', 3),
    'cark_cevir': ('A heavy metal submarine hatch wheel being cranked and turned tight, loud creaking, squeaking and clunking metal, close up, no voices', 4),
    'secim_pop': ('A short soft UI pop sound for a button appearing', 1),
}

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
        run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-ar', '44100', '-ac', '2', f'{OUT}/{name}.wav'])
    print('efektler hazır:', len([f for f in os.listdir(OUT) if f.endswith('.wav')]))


if __name__ == '__main__':
    main()
