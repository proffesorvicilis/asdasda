"""Profesör: Düşüş — anlatıcılı 6 bölüm senaryosu (tek ses: Orhan).

Anlatıcı ana karakterden "sen" diye bahseder. Diğer karakterlerin repliklerini onları taklit ederek söyler.
Her öğe: v = ses türü, t = metin, shot = bu öğeyle başlayan sahne, fx = tek seferlik efekt,
card = bilgi kartı, hud = üst bar değişikliği, cut = sesi bu kelimede kes, static = hat cızırtısı.
"""

VOICE = 'y6X1mFgtBqHFtQwrOezf'  # Orhan

TAG = {
    'N': ('[tense] [low voice]', 0.5),
    'KIZ': ('[imitating a frightened little girl, high-pitched, crying]', 0.0),
    'KIZ_SMALL': ('[imitating a little girl, small sad voice, sniffling]', 0.0),
    'KIZ_WHISPER': ('[imitating a scared little girl, whispering]', 0.0),
    'KIZ_SCREAM': ('[imitating a little girl, screaming in fear]', 0.0),
    'PROF': ('[imitating a calm, cold man]', 0.5),
    'PROF_SOFT': ('[imitating a calm man, speaking gently]', 0.5),
    'PROF_THINK': ('[imitating a man thinking aloud, focused]', 0.5),
    'PROF_EXC': ('[imitating a man, sudden excited realization]', 0.5),
    'SAADET': ('[imitating a trembling old woman reading word by word from a paper, crying]', 0.0),
    'SAADET_OWN': ('[imitating a desperate old woman, sobbing]', 0.0),
    'SAADET_SHOUT': ('[imitating a desperate old woman, shouting]', 0.0),
    'SAADET_TERR': ('[imitating a terrified old woman, reading slowly]', 0.0),
    'BORA': ('[imitating a gruff, deep-voiced soldier]', 0.5),
    'TUNA': ('[imitating a nervous young man, speaking fast]', 0.5),
    'OMER': ('[imitating a tired, serious older man]', 0.5),
    'OMER_W': ('[imitating an older man, whispering]', 0.5),
    'OMER_SUSP': ('[imitating an older man, suspicious]', 0.5),
}
DEEPEN = {'BORA'}  # bu taklitlerde ses biraz pesleştirilir

PARTS = {
 1: dict(hud=dict(clock='03:17'), beds=[('ucak_ugultu', .12, 4, 26), ('ruzgar_marti', .17, 28, 'end')], tail=4.5, items=[
  dict(v='N', t='Gece üç on yedi. Uyuyamıyorsun. Odanda keman çalıyorsun.', shot='P1-01', fx=[('keman', .45, 0, 6)]),
  dict(v='N', t='Telefon titriyor. Gizli numara.', shot='P1-02', fx=[('telefon_titresim', .8, 0)], card=('GELEN ARAMA', 'GİZLİ NUMARA', 2.6)),
  dict(v='N', t='Açıyorsun.', shot='P1-03'),
  dict(v='KIZ', t='Lütfen biri yardım etsin! Uçak düşecek! Herkes uyuyor!', shot='P1-04', fx=[('kabin_uyari', .25, 0)]),
  dict(v='N', t='[calm] Sakin bir sesle soruyorsun.', shot='P1-05'),
  dict(v='PROF', t='Neredesin?'),
  dict(v='KIZ', t='Uçaktayım... Kimse uyanmıyor.', shot='P1-06'),
  dict(v='N', t='Salona çıkıyorsun. Ekip zaten ayakta.', shot='P1-07', shot2=('P1-08', .6), fx=[('klavye', .18, .8)]),
  dict(v='PROF_SOFT', t='Kimle uçuyorsun?', shot='P1-09'),
  dict(v='KIZ_SMALL', t='Yalnızım... Yedi yaşındayım.', shot='P1-10'),
  dict(v='PROF', t='Pilotlar nerede?', shot='P1-11'),
  dict(v='KIZ', t='Kokpitin kapısı açık. İkisi de uyuyor.', shot='P1-12'),
  dict(v='KIZ_WHISPER', t='Pencereden hiçbir şey görünmüyor... Kapkaranlık.', shot='P1-14'),
  dict(v='N', t='Ve uçak sarsılıyor.', shot=('P1-15', 'shake'), fx=[('turbulans', .5, -.1)]),
  dict(v='KIZ_SCREAM', t='Korkuyorum!'),
  dict(v='PROF_SOFT', t='Biliyorum. Ben de korkardım. Ama sesimi duyuyorsun, değil mi?', shot='P1-16'),
  dict(v='KIZ', t='Koltuğun cebinde bir kâğıt vardı. "Uçak düşerse Profesörü ara" yazıyor.', shot='P1-17'),
  dict(v='OMER_W', t='O ismi bu odanın dışında kimse bilmez.', shot='P1-18'),
  dict(v='TUNA', t='Sinyal aynı anda üç şehirden geliyor. Bunu ya bir devlet yapar... ya da devletin içindeki biri.', shot='P2-03', fx=[('klavye', .18, 0)], hud=dict(clock='03:20')),
  dict(v='OMER', t='Radarda kaybolan tek bir uçak yok.', shot='P2-04', hud=dict(radar=True)),
  dict(v='PROF', t='Transponderi kapatmışlar. Bu bir kaza değil.', shot='P2-06'),
  dict(v='KIZ', t='Profesör? Gittin mi?', shot='P2-07', fx=[('kabin_uyari', .2, 0)]),
  dict(v='PROF_SOFT', t='Buradayım. En sevdiğin oyun ne?', shot='P2-08'),
  dict(v='KIZ_SMALL', t='Uçak oyunu... Ama bu oyun değil, değil mi?', shot='P2-09', shot2=('P2-11', .5)),
  dict(v='PROF_SOFT', t='Değil. Ama seni eve götüreceğim. Adın ne?', shot='P2-12', shot2=('P2-14', .7)),
  dict(v='KIZ_SMALL', t='Benim adım Ela.', cut='Ela', sub='Benim adım—'),
  dict(static=.5, shot=('P2-15', 'static'), fx=[('hat_cizirti', .45, 0)]),
  dict(v='N', t='Hat kesiliyor. Sonra bir kadın sesi. Yaşlı. Ağlıyor. Bir kâğıttan okuyor.', shot='P2-16'),
  dict(v='SAADET', t='Merhaba... Profesör. Uyuyamadın mı... yine? Ben de.'),
  dict(v='SAADET_OWN', t='Göğsümde... bir bomba var...', fx=[('bomba_bip', .25, 0)]),
  dict(v='N', t='Ömer telefonuna uzanıyor. Polisi arasın mı?', shot='P3-02'),
  dict(v='N', t='Yorumlara yaz. Ara, ya da arama. Çoğunluk ne derse, ikinci bölüm o.', shot='P3-04',
       card=('SEÇİM', 'ARA|ARAMA', 99)),
 ]),
}
