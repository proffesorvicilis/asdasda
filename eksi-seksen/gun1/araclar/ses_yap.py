#!/usr/bin/env python3
"""Tuhaf Saat Hikâyeleri · Eksi Seksen Gün 1 seslerini üretir ve zaman çizelgesini çıkarır.

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
WORK = '/tmp/eksi1_ses'
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
    if not g or e[0] != g[0] or e[-1] != g[-1]:
        return False, r * 0.5
    return r >= 0.9, r


def tempo_of(L):
    AT = getattr(S, 'ATEMPO', 1.0)
    return AT[L['v']] if isinstance(AT, dict) else AT


def make_line(L, retries=7):
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
        th = tw.replace('.wav', '_kontrol.wav')
        if fx_kind(L):   # filtreli sesler filtreli halleriyle kontrol edilir
            apply_fx(tw, th, tempo_of(L), fx_kind(L))
        else:
            run(['ffmpeg', '-v', 'error', '-y', '-i', tw, '-af', f'atempo={tempo_of(L)}', th])
        got, _ = stt(th)
        _, words = stt(tw)
        good, r = score(L['t'], got)
        if L.get('strict'):   # kelimesi kelimesine, iki ayrı STT denemesinde
            got2, _ = stt(th)
            e = ''.join(words_of(L['t']))
            good = good and ''.join(words_of(got)) == e and ''.join(words_of(got2)) == e
            got = got + ' | ' + got2
        print(f"  {L['id']} deneme{a} uyum={r:.2f} {'OK' if good else 'TEKRAR'} :: {got}", flush=True)
        if best is None or r > best[2]:
            best = (tw, words, r, got)
        if good:
            break
    tw, words, r, got = best
    shutil.copy(tw, wav)
    json.dump(dict(words=words, stt=got, score=r), open(meta, 'w'), ensure_ascii=False)
    return wav, json.load(open(meta))


FX_CHAINS = {
    'tel': ('highpass=f=300,lowpass=f=3400,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,volume=3dB,asoftclip=type=tanh', 0.006),
    'tv': ('highpass=f=110,lowpass=f=7800,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=90,aecho=0.6:0.35:16|28:0.16|0.1,volume=1dB', 0.0),
    'video': ('highpass=f=170,lowpass=f=6800,acompressor=threshold=-18dB:ratio=2.5:attack=5:release=80,volume=2dB', 0.003),
    'radio': ('highpass=f=260,lowpass=f=4200,acompressor=threshold=-20dB:ratio=4:attack=4:release=60,volume=5dB,asoftclip=type=tanh', 0.014),
}


def apply_fx(src, dst, k, kind):
    chain, noise = FX_CHAINS[kind]
    d0 = dur(src) / k + 0.2
    if noise > 0:
        fc = (f'[0:a]atempo={k},{chain},apad=pad_dur=0.2[v];'
              f'anoisesrc=d={d0:.2f}:c=pink:a={noise}:r=44100,highpass=f=900,lowpass=f=4200[n];'
              f'[v][n]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.9')
    else:
        fc = f'[0:a]atempo={k},{chain},apad=pad_dur=0.2,alimiter=limit=0.9'
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex', fc, '-ar', '44100', '-ac', '1', dst])


def fx_kind(L):
    if L.get('fx'):
        return L['fx']
    return 'radio' if L['v'] in getattr(S, 'RADIO', set()) else None


def silence(path, d):
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', f'{d:.3f}', path])


def main():
    os.makedirs(CACHE, exist_ok=True)
    shutil.rmtree(WORK, ignore_errors=True)
    os.makedirs(WORK, exist_ok=True)
    seq, lines, words_abs, cues = [], [], [], []
    t = S.LEAD
    p = f'{WORK}/lead.wav'; silence(p, t); seq.append(p)
    AT = getattr(S, 'ATEMPO', 1.0)
    for i, L in enumerate(S.LINES):
        k = AT[L['v']] if isinstance(AT, dict) else AT
        wav0, meta = make_line(L)
        wav = f'{WORK}/{L["id"]}_hiz.wav'
        if fx_kind(L):
            apply_fx(wav0, wav, k, fx_kind(L))
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
              cues=cues, rules_title=S.KURALLAR_BASLIK, rules=S.KURALLAR, gunluk=getattr(S, 'GUNLUK', []))
    json.dump(tl, open(OUT_TL, 'w'), ensure_ascii=False, indent=1)
    print(f'Toplam: {total:.1f} sn, {len(lines)} satır, {len(words_abs)} kelime')
    for L in lines:
        print(f"  {L['s']:6.2f}-{L['e']:6.2f} {L['id']} [{L['sc']}] {L['text']}")


if __name__ == '__main__':
    main()
