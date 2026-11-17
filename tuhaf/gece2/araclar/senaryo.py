"""Tuhaf Saat Hikâyeleri · Fener · Gece 2/7 — referans videonun birebir, anlamlı Türkçesi.

Sesler: N anlatıcı (Orhan) · KADIN telsizdeki kadın (Nuray) · MOSS telsizde Moss (Aykut) · KAPI kapıdaki yaşlı adam (Cihan)
"""

MODEL = 'eleven_v3'
ATEMPO = {'N': 1.17, 'KADIN': 1.0, 'MOSS': 1.1, 'KAPI': 1.0}
VOICES = {
    'N': 'y6X1mFgtBqHFtQwrOezf',       # Orhan
    'KADIN': 'WgkQ6iX2TeKqW6ww3mEZ',   # Nuray
    'MOSS': 'E38heb42yln7Ox5qE9i9',    # Aykut
    'KAPI': 'Md4RAnfKt9kVIbvqUxly',    # Cihan
}
STAB = {'N': 0.5, 'KADIN': 0.0, 'MOSS': 0.0, 'KAPI': 0.0}
RADIO = {'KADIN', 'MOSS'}   # telsiz filtresi uygulanacak sesler

N = '[low voice]'
T = '[tense] [low voice]'
ET_T = 'TELSİZ · KANAL 16'
ET_M = 'MOSS · TELSİZ'
ET_K = 'KAPIDA'

# Orijinal İngilizce → birebir anlamlı Türkçe
LINES = [
    # You chose to stay silent.
    dict(id='L01', v='N', sc='masa_sessiz', strict=True, t=f'{N} Sessiz kalmayı seçtin.', gap=0.5),
    # At five past three, the radio switched on by itself.
    dict(id='L02', v='N', sc='telsiz_acilir', t=f'{T} Üçü beş geçe, telsiz kendi kendine açıldı.', gap=0.5),
    # ...I know you can hear me.
    dict(id='L03', v='KADIN', sc='telsiz_acilir', t='[whispering] [eerie] [slowly] Beni duyduğunu biliyorum.', gap=0.6, etiket=ET_T),
    # Then nothing.
    dict(id='L04', v='N', sc='masa_sessiz2', t=f'{N} Sonra... hiçbir şey.', gap=0.6),
    # At ten past four, a cargo ship passed the rocks, safely.
    dict(id='L05', v='N', sc='gemi', t=f'{N} Dördü on geçe, bir yük gemisi kayaların yanından geçti. Sağ salim.', gap=0.8),
    # At noon, the radio is safe.
    dict(id='L06', v='N', sc='gunduz', t=f'{N} Öğle vakti telsiz güvenli.', gap=0.25),
    # You asked Moss about the Marigold.
    dict(id='L07', v='N', sc='gunduz', t=f"{N} Moss'a Marigold'u sordun.", gap=0.5),
    # Marigold?
    dict(id='L08', v='MOSS', sc='moss_telsiz', t="[surprised] [gruff] Marigold mu?", gap=0.4, etiket=ET_M),
    # Lost her engine in a storm. Drifted onto the rocks.
    dict(id='L09', v='MOSS', sc='moss_telsiz', t='[gruff] [serious] Fırtınada motoru bozuldu. Sürüklenip kayalara çarptı.', gap=0.35, etiket=ET_M),
    # All hands, twelve years ago.
    dict(id='L10', v='MOSS', sc='moss_telsiz', t='[gruff] [somber] Kimse kurtulamadı. On iki yıl önce.', gap=0.5, etiket=ET_M),
    # Stick to Harlan's rules, kid.
    dict(id='L11', v='MOSS', sc='harlan_foto', t="[gruff] [serious] Harlan'ın kurallarına uy, evlat.", gap=0.6, etiket=ET_M),
    # Harlan's journal. Thirty years of quiet. Then, the last page.
    dict(id='L12', v='N', sc='gunluk', t=f"{N} Harlan'ın günlüğü. Otuz yıl boyunca hep sakin.", gap=0.35),
    dict(id='L13', v='N', sc='gunluk', t=f'{T} Sonra... son sayfa.', gap=0.5),
    # She calls every night now. She knows things only she would know.
    dict(id='L14', v='N', sc='gunluk', t=f'{T} O kadın artık her gece arıyor. Sadece onun bilebileceği şeyleri biliyor.', gap=0.4),
    # Rule five is wrong. Tonight, I'll let her in.
    dict(id='L15', v='N', sc='gunluk', t=f'{T} Beşinci kural yanlış. Bu gece onu içeri alacağım.', slot=('merdiven', 3.0)),
    # Dusk. The light is on.
    dict(id='L16', v='N', sc='lamba', t=f'{N} Alacakaranlık. Işık yandı.', gap=0.7),
    # Night two, half past one.
    dict(id='L17', v='N', sc='yatak', t=f'{N} İkinci gece. Saat bir buçuk.', gap=0.4),
    # Someone knocks.
    dict(id='L18', v='N', sc='kapi_ic', t=f'{T} Biri kapıyı çalıyor.', slot=('vurus', 2.2)),
    # Please, it's me. Let me in. I'm so cold.
    dict(id='L19', v='KAPI', sc='kapi_bekci', t='[an old man, shivering from cold] [pleading] Lütfen... benim.', gap=0.35, etiket=ET_K),
    dict(id='L20', v='KAPI', sc='kapi_bekci', t='[an old man, shivering from cold] [desperate] Beni içeri al. Çok üşüyorum.', gap=0.8, etiket=ET_K),
    # You know that cap.
    dict(id='L21', v='N', sc='harlan_kasket', t=f'{T} O kasketi tanıyorsun.', gap=0.7),
    # You wouldn't let an old man freeze, would you?
    dict(id='L22', v='KAPI', sc='kural3', t='[an old man, shivering] [softly] [pleading] Yaşlı bir adamı donmaya bırakmazsın... değil mi?', gap=0.7, etiket=ET_K),
    # Do you open the door?
    dict(id='L23', v='N', sc='secim', t=f'{N} Kapıyı açıyor musun?', gap=0.0),
]

TAIL = 5.0
LEAD = 0.2
GAP = 0.15
SLOTS = {
    'merdiven': [('adim_tas', 0.1)],
    'vurus': [('kapi_vurus', 0.15)],
}

KURALLAR_BASLIK = 'Bekçinin kuralları'
KURALLAR = [
    'Işık alacakaranlıktan şafağa kadar yanmalı. Her zaman.',
    "Gece 3'ten sonra telsize asla cevap verme.",
    'Geceleri adaya kimse gelmez. Kimse.',
    'Lambaya kadar 99 basamak. 100 sayarsan aşağı in.',
    'Asla dışarı çıkma, eğer...',
]
GUNLUK = [
    ('1994', ['3 Mart. Sakin.', '4 Mart. Sakin.', '5 Mart. Sis. Sakin.', '6 Mart. Sakin.']),
    ('2007', ['11 Ekim. Sakin.', '12 Ekim. Fırtına. Sakin.', '13 Ekim. Sakin.', '14 Ekim. Sakin.']),
    ('2019', ['2 Ocak. Sakin.', '3 Ocak. Sakin.', '4 Ocak. Sakin.', '5 Ocak. Sakin.']),
    ('2024', ['Sakin.', 'Sakin.', 'Yine aradı.', 'Sadece onun bilebileceği', 'şeyleri biliyor.', '!Beşinci kural yanlış.', '!Bu gece onu içeri alacağım.']),
]
