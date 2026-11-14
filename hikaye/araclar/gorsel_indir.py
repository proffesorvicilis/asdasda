#!/usr/bin/env python3
"""Higgsfield geçmişinden (show_generations JSON dökümleri) sahne görsellerini eşleştirip indirir.

Kullanım: python3 hikaye/araclar/gorsel_indir.py <döküm1.json> [döküm2.json ...] [--indir]
Eşleştirme: her üretimin promptu, 06 dosyasındaki sahne/mekân promptlarıyla karşılaştırılır.
Aynı sahne birden çok kez üretildiyse en yeni tamamlanan alınır.
"""
import json, re, sys, os, difflib, subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = f'{ROOT}/06-mekan-ve-sahneler-tek-seferde.md'
GOR = f'{ROOT}/gorseller'


def templates():
    txt = open(SRC).read()
    out = {}
    for m in re.finditer(r'\*\*((?:P\d-\d\d)|(?:L-\d\d))[^\n]*\n(?:[^\n]*\n)*?```\n(.*?)```', txt, re.S):
        sid, body = m.group(1), m.group(2)
        body = body.replace('[STYLE]', '')
        out[sid] = re.sub(r'\[[A-ZÖÜÇŞİĞ]+\]', '', body).strip()
    return out


def key(s):
    s = s.split('no watermark.')[-1]
    return re.sub(r'\s+', ' ', s.lower()).strip()


def main(files, download):
    T = {k: key(v) for k, v in templates().items()}
    TN = {sid: re.sub(r'[^a-z0-9 ]', '', v) for sid, v in T.items()}
    SENTS = {}
    for sid, v in T.items():
        parts = [re.sub(r'[^a-z0-9 ]', '', x).strip() for x in re.split(r'[.:;,]', v)]
        SENTS[sid] = [x for x in parts if len(x) > 18]
    items = []
    for f in files:
        d = json.load(open(f))
        items += d.get('items', d if isinstance(d, list) else [])
    STOPW = set('the a an of and in on with to his her their at from by is are as it its into one two three while for no not this that'.split())
    def bag(x):
        return set(w for w in re.findall(r'[a-z]{3,}', x) if w not in STOPW)
    gens = []
    for it in items:
        if it.get('status') != 'completed':
            continue
        p = (it.get('params') or {}).get('prompt', '')
        if not p.startswith('STYLE: Graphic') or 'character reference sheet' in p.lower():
            continue
        url = ((it.get('results') or {}).get('rawUrl')) or ''
        ts = it.get('createdAt') or it.get('created_at') or 0
        k = key(p)
        kk = re.sub(r'[^a-z0-9 ]', '', k)
        body = re.split(r'single vertical cinematic frame\.|consistent\.', k)[-1]
        sc = {x: sum(1 for z in SENTS[x] if z in kk) / max(1, len(SENTS[x])) for x in T}
        jac = {x: len(bag(body) & bag(T[x])) / max(1, len(bag(body) | bag(T[x]))) for x in T}
        gens.append(dict(id=it.get('id'), ts=ts, url=url, sc=sc, jac=jac))
    gens.sort(key=lambda g: -g['ts'])  # en yeni önce
    best, used = {}, set()
    # 1. aşama: kesin eşleşmeler (cümle örtüşmesi >= 0.5)
    for g in gens:
        x, v = max(g['sc'].items(), key=lambda kv: kv[1])
        if v >= 0.5 and x not in best:
            best[x] = (g['ts'], g['url'], v, g['id']); used.add(g['id'])
        elif v >= 0.5:
            used.add(g['id'])  # aynı sahnenin eski sürümü
    # 2. aşama: kalanlar, kelime benzerliğine göre açgözlü eşleştirme
    pairs = sorted(((g['jac'][x] + g['sc'][x], g['id'], x, g) for g in gens if g['id'] not in used for x in T if x not in best), key=lambda t: -t[0])
    for v, gid, x, g in pairs:
        if gid in used or x in best or v < 0.12:
            continue
        best[x] = (g['ts'], g['url'], round(v, 2), gid); used.add(gid)
    for g in gens:
        if g['id'] not in used:
            print(f'eşleşmedi: {g["id"]}', file=sys.stderr)
    have = sorted(best)
    miss = [s for s in T if s not in best]
    print(f'eşleşen: {len(have)} / {len(T)}')
    for s in have:
        print(f'  {s}  uyum={best[s][2]:.2f}  {best[s][3]}')
    print('eksik:', ' '.join(sorted(miss)) or '-')
    if download:
        os.makedirs(GOR, exist_ok=True)
        for s in have:
            ext = os.path.splitext(best[s][1].split('?')[0])[1] or '.png'
            out = f'{GOR}/{s}{ext}'
            subprocess.run(['curl', '-sS', '-L', '-o', out, best[s][1]], check=True)
        print(f'{len(have)} görsel indirildi -> {GOR}')
    return miss


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    main(args, '--indir' in sys.argv)
