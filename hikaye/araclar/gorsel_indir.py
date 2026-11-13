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
    best = {}
    for it in items:
        if it.get('status') != 'completed':
            continue
        p = (it.get('params') or {}).get('prompt', '')
        if not p.startswith('STYLE: Graphic-novel'):
            continue
        k = key(p)
        kk = re.sub(r'[^a-z0-9 ]', '', k)
        scores = []
        for x, sents in SENTS.items():
            hit = sum(1 for z in sents if z in kk)
            scores.append((hit / max(1, len(sents)), hit, difflib.SequenceMatcher(None, kk[-400:], TN[x][-400:]).ratio(), x))
        scores.sort(reverse=True)
        frac, hit, sim, sid = scores[0]
        sc = frac if hit >= 2 else sim
        url = ((it.get('results') or {}).get('rawUrl')) or ''
        ts = it.get('created_at') or it.get('createdAt') or 0
        if sc < 0.34 or not url:
            print(f'eşleşmedi ({sc:.2f}): {it.get("id")}', file=sys.stderr)
            continue
        if sid not in best or ts > best[sid][0]:
            best[sid] = (ts, url, sc, it.get('id'))
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
