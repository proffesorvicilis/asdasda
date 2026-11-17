#!/usr/bin/env python3
"""Tuhaf Saat Hikâyeleri · Fener Gece 1 seslerini üretir ve zaman çizelgesini çıkarır.

- Her satır ElevenLabs eleven_v3 ile (tag'li) seslendirilir, sessizlikleri kırpılır.
- STT (scribe_v1) ile metin kontrol edilir; uyuşmazsa yeniden üretilir.
- Satırlar boşluklar ve efekt yuvalarıyla birleştirilir.
Çıktı: fener/ses/anlatim.wav, fener/motor/timeline.json
"""
import os, sys, json, re, hashlib, subprocess, difflib, shutil
sys.path.insert(0, os.path.dirname(__file__))
import senaryo as S

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
CACHE = f'{ROOT}/ses/_parca'
WORK = '/tmp/tuhaf_ses'
OUT_WAV = f'{ROOT}/ses/anlatim.wav'
OUT_TL = f'{ROOT}/motor/timeline.json'
TRIM = ("silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,"
        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,"
        "silenceremove=stop_periods=-1:stop_duration=0.22:stop_threshold=-45dB:stop_silence=0.16")
SAYI = {'1': 'bir', '2': 'iki', '3': 'üç', '5': 'beş', '7': 'yedi', '41': 'kırk bir'}


def run(c):
    subprocess.run(c, check=True)


def clean(t):
    return re.sub(r'\[[^\]]*\]\s*', '', t).strip()


def norm(w):
    w = w.lower().replace('i̇', 'i')
    return re.sub(r'[^a-zçğıöşü0-9]', '', w)


def words_of(t):
    out = []
    for w in clean(t).split():
        n = norm(w)
        if n in SAYI:
            out += [norm(x) for x in SAYI[n].split()]
        elif n:
            out.append(n)
    return out


def dur(p):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def tts(text, out, voice, stab=0.5):
    body = {'text': text, 'model_id': S.MODEL, 'language_code': 'tr', 'voice_settings': {'stability': stab}}
    r = subprocess.run(['curl', '-sS', '-o', out, '-w', '%{http_code}', '-X', 'POST',
                        f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128',
                        '-H', 'Content-Type: application/json', '--data-binary', json.dumps(body, ensure_ascii=False)],
                       capture_output=True, text=True)
    if r.stdout != '200':
        raise RuntimeError(f'TTS {r.stdout}: {open(out, "rb").read()[:300]}')


def stt(path):
    r = subprocess.run(['curl', '-sS', '-X', 'POST', 'https://api.elevenlabs.io/v1/speech-to-text', '-F', 'model_id=scribe_v1',
                        '-F', 'language_code=tur', '-F', 'timestamps_granularity=word', '-F', 'tag_audio_events=true', '-F', f'file=@{path}'],
                       capture_output=True, text=True)
    d = json.loads(r.stdout)
    ev = ' '.join(w.get('text', '') for w in d.get('words', []) if w.get('type') == 'audio_event').lower()
    txt = d.get('text', '')
    if re.search(r'gül|kahkaha|laugh|kıkır', ev):
        txt = '[GÜLME] ' + txt
    return txt, [w for w in d.get('words', []) if w.get('type') == 'word']


def score(expected, got):
    if got.startswith('[GÜLME]'):
        return False, 0.0
    e, g = words_of(expected), words_of(got)
    r = difflib.SequenceMatcher(None, ''.join(e), ''.join(g)).ratio()
    if len(e) <= 3:
        return (''.join(e) == ''.join(g)), r
    if not g or e[0] != g[0]:
        return False, r * 0.5
    return r >= 0.9, r


def make_line(L, retries=4):
    voice = S.VOICES[L['v']]
    h = hashlib.sha1(f"{voice}|{S.MODEL}|{L['t']}|{S.STAB[L['v']]}".encode()).hexdigest()[:14]
    wav, meta = f'{CACHE}/{L["id"]}_{h}.wav', f'{CACHE}/{L["id"]}_{h}.json'
    if os.path.exists(wav) and os.path.exists(meta):
        return wav, json.load(open(meta))
    best = None
    for a in range(retries + 1):
        raw, tw = f'{WORK}/{L["id"]}_{a}.mp3', f'{WORK}/{L["id"]}_{a}.wav'
        tts(L['t'], raw, voice, S.STAB[L['v']])
        run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', TRIM, '-ar', '44100', '-ac', '1', tw])
        got, words = stt(tw)
        good, r = score(L['t'], got)
        print(f"  {L['id']} deneme{a} uyum={r:.2f} {'OK' if good else 'TEKRAR'} :: {got}", flush=True)
        if best is None or r > best[2]:
            best = (tw, words, r, got)
        if good:
            break
    tw, words, r, got = best
    shutil.copy(tw, wav)
    json.dump(dict(words=words, stt=got, score=r), open(meta, 'w'), ensure_ascii=False)
    return wav, json.load(open(meta))


def silence(path, d):
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', f'{d:.3f}', path])


def main():
    os.makedirs(CACHE, exist_ok=True)
    shutil.rmtree(WORK, ignore_errors=True)
    os.makedirs(WORK, exist_ok=True)
    seq, lines, words_abs, cues = [], [], [], []
    t = S.LEAD
    p = f'{WORK}/lead.wav'; silence(p, t); seq.append(p)
    k = getattr(S, 'ATEMPO', 1.0)
    for i, L in enumerate(S.LINES):
        wav0, meta = make_line(L)
        wav = f'{WORK}/{L["id"]}_hiz.wav'
        if L['v'] == 'TELSIZ':
            d0 = dur(wav0) / k + 0.2
            run(['ffmpeg', '-v', 'error', '-y', '-i', wav0, '-filter_complex',
                 f'[0:a]atempo={k},highpass=f=300,lowpass=f=3500,acompressor=threshold=-20dB:ratio=5:attack=4:release=60,'
                 f'volume=5dB,asoftclip=type=tanh,apad=pad_dur=0.2[v];'
                 f'anoisesrc=d={d0:.2f}:c=pink:a=0.022:r=44100,highpass=f=900,lowpass=f=4200[n];'
                 f'[v][n]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.9',
                 '-ar', '44100', '-ac', '1', wav])
        else:
            run(['ffmpeg', '-v', 'error', '-y', '-i', wav0, '-af', f'atempo={k}', '-ar', '44100', '-ac', '1', wav])
        d = dur(wav)
        # Kelime zamanları: STT kelimelerini senaryodaki kelimelere hizala (yazım senaryodan gelsin)
        sw = [dict(x, start=x['start'] / k, end=x['end'] / k) for x in meta['words']]
        exp = clean(L['t']).split()
        aligned = []
        if len(sw) == len(exp):
            aligned = [dict(w=e, s=x['start'] + t, e=x['end'] + t) for e, x in zip(exp, sw)]
        else:  # sayı/ayrım farkı: süreyi karakter sayısına göre paylaştır
            st = sw[0]['start'] if sw else 0.0
            en = sw[-1]['end'] if sw else d
            tot = sum(len(e) + 2 for e in exp)
            c = st
            for e in exp:
                q = (en - st) * (len(e) + 2) / tot
                aligned.append(dict(w=e, s=c + t, e=c + q + t))
                c += q
        for a in aligned:
            a['line'] = L['id']
        words_abs += aligned
        lines.append(dict(id=L['id'], sc=L['sc'], v=L['v'], s=round(t, 3), e=round(t + d, 3), text=clean(L['t']),
                          hl=L.get('hl', {}), col=L.get('col'), etiket=L.get('etiket'), pre=L.get('pre', 0.12)))
        seq.append(wav)
        t += d
        if L.get('slot'):
            name, sd = L['slot']
            for fx, off in S.SLOTS[name]:
                cues.append(dict(fx=fx, t=round(t + off, 3), slot=name))
            cues.append(dict(fx='slot_' + name, t=round(t, 3), d=sd))
            p = f'{WORK}/slot{i}.wav'; silence(p, sd); seq.append(p)
            t += sd
        g = L.get('gap', S.GAP)
        if g > 0:
            p = f'{WORK}/gap{i}.wav'; silence(p, g); seq.append(p)
            t += g
    p = f'{WORK}/tail.wav'; silence(p, S.TAIL); seq.append(p)
    t += S.TAIL
    lst = f'{WORK}/list.txt'
    open(lst, 'w').write(''.join(f"file '{x}'\n" for x in seq))
    os.makedirs(os.path.dirname(OUT_WAV), exist_ok=True)
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-ar', '44100', '-ac', '1', OUT_WAV])
    total = dur(OUT_WAV)
    tl = dict(duration=round(total, 3), fps=30, lines=lines,
              words=[dict(w=x['w'], s=round(x['s'], 3), e=round(x['e'], 3), line=x['line']) for x in words_abs],
              cues=cues, rules_title=S.KURALLAR_BASLIK, rules=S.KURALLAR)
    json.dump(tl, open(OUT_TL, 'w'), ensure_ascii=False, indent=1)
    print(f'Toplam: {total:.1f} sn, {len(lines)} satır, {len(words_abs)} kelime')
    for L in lines:
        print(f"  {L['s']:6.2f}-{L['e']:6.2f} {L['id']} [{L['sc']}] {L['text']}")


if __name__ == '__main__':
    main()
