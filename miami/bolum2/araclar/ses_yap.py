#!/usr/bin/env python3
"""Miami · Bölüm 2 konuşmalarını üretir, doğrular ve zaman çizelgesini çıkarır.

- Her satır ElevenLabs eleven_v3 ile (duygu etiketli) seslendirilir.
- STT (scribe_v1) ile söylenen metin kontrol edilir; geçen kayıtlardan en güçlüsü (ses şiddeti) seçilir.
- Satırlar orijinaldeki saniyelere (at) yerleştirilir.
Çıktı: ses/anlatim.wav, motor/timeline.json
"""
import os, sys, json, re, hashlib, subprocess, difflib, shutil, wave, math
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
import senaryo as S

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
CACHE = f'{ROOT}/ses/_parca'
WORK = '/tmp/miami2_ses'
OUT_WAV = f'{ROOT}/ses/anlatim.wav'
OUT_TL = f'{ROOT}/motor/timeline.json'
TRIM = ("silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,"
        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse")


def run(c):
    subprocess.run(c, check=True)


def clean(t):
    return re.sub(r'\[[^\]]*\]\s*', '', t).strip()


def norm(w):
    w = w.lower().replace('i̇', 'i')
    w = re.sub(r'[^a-zçğıöşü0-9]', '', w)
    return {'alex': 'aleks'}.get(w, w)


def words_of(t):
    return [n for n in (norm(w) for w in clean(t).split()) if n]


def dur(p):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True)
    return float(r.stdout.strip())


def tts(L, out):
    body = {'text': L['tts'], 'model_id': S.MODEL, 'voice_settings': S.SETTINGS[L['v']]}
    r = subprocess.run(['curl', '-sS', '-o', out, '-w', '%{http_code}', '-X', 'POST',
                        f'https://api.elevenlabs.io/v1/text-to-speech/{S.VOICES[L["v"]]}?output_format=mp3_44100_128',
                        '-H', 'Content-Type: application/json', '--data-binary', json.dumps(body, ensure_ascii=False)],
                       capture_output=True, text=True)
    if r.stdout != '200':
        raise RuntimeError(f'TTS {r.stdout}: {open(out, "rb").read()[:300]}')


def stt(path):
    r = subprocess.run(['curl', '-sS', '-X', 'POST', 'https://api.elevenlabs.io/v1/speech-to-text', '-F', 'model_id=scribe_v1',
                        '-F', 'language_code=tur', '-F', 'timestamps_granularity=word', '-F', f'file=@{path}'],
                       capture_output=True, text=True)
    d = json.loads(r.stdout)
    return d.get('text', ''), [w for w in d.get('words', []) if w.get('type') == 'word']


def intensity(path):
    """Konuşulan bölümün ortalama ses şiddeti (dB): bağıran kayıt daha yüksek çıkar."""
    run(['ffmpeg', '-v', 'error', '-y', '-i', path, '-ar', '22050', '-ac', '1', path + '.int.wav'])
    with wave.open(path + '.int.wav') as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
    win = 441
    rms = np.array([math.sqrt(np.mean(x[i:i + win] ** 2) + 1e-12) for i in range(0, max(1, len(x) - win), win)])
    act = rms > 10 ** (-40 / 20)
    return 20 * math.log10(math.sqrt(np.mean(rms[act] ** 2)) + 1e-9) if act.any() else -99.0


def passes(L, got):
    g = words_of(got)
    ok = [''.join(words_of(x)) for x in L.get('ok', [])]
    if ''.join(g) in ok:
        return True
    if L.get('ok_re') and re.fullmatch(L['ok_re'], ''.join(g)):
        return True
    e = words_of(L['say'])
    if len(e) <= 3:
        return ''.join(e) == ''.join(g)
    return difflib.SequenceMatcher(None, ''.join(e), ''.join(g)).ratio() >= 0.93 and e[0] == g[0] and e[-1] == g[-1]


FX_CHAINS = {
    # helikopter hoparlörü / telsiz: dar bant, sıkıştırılmış, hafif bozulma
    'radio': 'highpass=f=320,lowpass=f=3800,equalizer=f=1600:t=q:w=1:g=4,acompressor=threshold=-22dB:ratio=5:attack=3:release=60,volume=4dB,asoftclip=type=tanh',
}


def apply_fx(src, dst, kind):
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', FX_CHAINS[kind] + ',alimiter=limit=0.9', '-ar', '44100', '-ac', '1', dst])


def make_line(L, retries=9):
    h = hashlib.sha1(f"{S.VOICES[L['v']]}|{S.MODEL}|{L['tts']}|{json.dumps(S.SETTINGS[L['v']], sort_keys=True)}|{S.FX.get(L['v'])}".encode()).hexdigest()[:14]
    wav, meta = f'{CACHE}/{L["id"]}_{h}.wav', f'{CACHE}/{L["id"]}_{h}.json'
    if os.path.exists(wav) and os.path.exists(meta):
        return wav, json.load(open(meta))
    want, good = L.get('takes', 1), []
    for a in range(retries + 1):
        raw, tw = f'{WORK}/{L["id"]}_{a}.mp3', f'{WORK}/{L["id"]}_{a}.wav'
        tts(L, raw)
        run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', TRIM, '-ar', '44100', '-ac', '1', tw])
        fx = S.FX.get(L['v'])
        if fx:
            th = tw.replace('.wav', '_fx.wav'); apply_fx(tw, th, fx); tw = th
        got, words = stt(tw)
        ok = passes(L, got)
        it = intensity(tw)
        print(f"  {L['id']} deneme{a} {'OK ' if ok else 'RED'} şiddet={it:6.1f}dB :: {got}", flush=True)
        if ok:
            good.append((it, tw, words, got))
            if len(good) >= want:
                break
    if not good:
        raise RuntimeError(f'{L["id"]}: geçerli kayıt çıkmadı')
    it, tw, words, got = max(good, key=lambda g: g[0])
    shutil.copy(tw, wav)
    json.dump(dict(words=words, stt=got, intensity=it), open(meta, 'w'), ensure_ascii=False)
    return wav, json.load(open(meta))


def silence(path, d):
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', f'{d:.3f}', path])


def main():
    os.makedirs(CACHE, exist_ok=True)
    shutil.rmtree(WORK, ignore_errors=True)
    os.makedirs(WORK, exist_ok=True)
    seq, lines, words_abs = [], [], []
    t = 0.0
    late = []
    if S.LEAD > 0:
        p = f'{WORK}/lead.wav'; silence(p, S.LEAD); seq.append(p); t += S.LEAD
    for i, L in enumerate(S.LINES):
        wav0, meta = make_line(L)
        at = L.get('at')
        if at is not None:
            if t < at - 0.001:
                p = f'{WORK}/gap{i}.wav'; silence(p, at - t); seq.append(p); t = at
            elif t > at + 0.05:
                late.append((L['id'], round(t - at, 2)))
        wav = f'{WORK}/{L["id"]}_son.wav'
        # satır içi uzun duraklamaları kısalt; hâlâ planlanandan uzunsa hafifçe hızlandır
        tmp = f'{WORK}/{L["id"]}_p1.wav'
        run(['ffmpeg', '-v', 'error', '-y', '-i', wav0, '-af', 'silenceremove=stop_periods=-1:stop_duration=0.28:stop_threshold=-42dB:stop_silence=0.18', '-ar', '44100', '-ac', '1', tmp])
        d0 = dur(tmp)
        k = min(1.3, d0 / L['maxd']) if L.get('maxd') and d0 > L['maxd'] else 1.0
        run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'atempo={k:.3f}', '-ar', '44100', '-ac', '1', wav])
        d = dur(wav)
        _, sw0 = stt(wav)                                    # işlenmiş sesin kelime zamanları
        sw = [dict(start=x['start'], end=x['end']) for x in sw0]
        exp = clean(L['t']).split()
        if len(sw) == len(exp):
            aligned = [dict(w=e, s=x['start'] + t, e=x['end'] + t) for e, x in zip(exp, sw)]
        else:   # sayı farkı: süreyi karakter sayısına göre paylaştır
            st = sw[0]['start'] if sw else 0.0
            en = sw[-1]['end'] if sw else d
            tot = sum(len(e) + 2 for e in exp)
            c = st
            aligned = []
            for e in exp:
                q = (en - st) * (len(e) + 2) / tot
                aligned.append(dict(w=e, s=c + t, e=c + q + t)); c += q
        for a in aligned:
            a['line'] = L['id']
        words_abs += aligned
        lines.append(dict(id=L['id'], v=L['v'], s=round(t, 3), e=round(t + d, 3), text=clean(L['t']), col=L.get('col'), nocap=bool(L.get('nocap'))))
        seq.append(wav); t += d
        p = f'{WORK}/pad{i}.wav'; silence(p, S.GAP); seq.append(p); t += S.GAP
    if t < S.DUR:
        p = f'{WORK}/tail.wav'; silence(p, S.DUR - t); seq.append(p); t = S.DUR
    lst = f'{WORK}/list.txt'
    open(lst, 'w').write(''.join(f"file '{x}'\n" for x in seq))
    os.makedirs(os.path.dirname(OUT_WAV), exist_ok=True)
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-ar', '44100', '-ac', '1', OUT_WAV])
    total = dur(OUT_WAV)
    tl = dict(duration=round(total, 3), fps=30, lines=lines,
              words=[dict(w=x['w'], s=round(x['s'], 3), e=round(x['e'], 3), line=x['line']) for x in words_abs])
    json.dump(tl, open(OUT_TL, 'w'), ensure_ascii=False, indent=1)
    print(f'Toplam: {total:.1f} sn, {len(lines)} satır, {len(words_abs)} kelime')
    if late:
        print('UYARI: satır planlanan saniyeden geç başladı:', late)
    for L in lines:
        print(f"  {L['s']:6.2f}-{L['e']:6.2f} {L['id']} [{L['v']}] {L['text']}")


if __name__ == '__main__':
    main()
