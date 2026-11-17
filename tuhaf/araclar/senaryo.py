"""Tuhaf Saat Hikâyeleri · Fener · Gece 1/7 — referans videonun birebir Türkçe çevirisi.

Sesler:
  N      : anlatıcı (Orhan)
  MOSS   : kayıkçı Moss (yaşlı, fırtınada bağırıyor)
  TELSIZ : telsizdeki kaptan (panik, telsiz filtresiyle)
Alanlar: id, v (ses), t (metin, v3 tag'li), sc (sahne), gap, slot (ad, sn), hl (renkli kelimeler),
         col (satırın tümü için renk), etiket (altyazı üstü konuşmacı etiketi)
"""

MODEL = 'eleven_v3'
ATEMPO = 1.04
VOICES = {
    'N': 'y6X1mFgtBqHFtQwrOezf',       # Orhan
    'MOSS': 'E38heb42yln7Ox5qE9i9',    # Aykut — yaşlı, yorgun erkek
    'TELSIZ': 'euBhqSy9BY3XHNLwxF7J',  # Emre — sert erkek sesi
}
STAB = {'N': 0.5, 'MOSS': 0.0, 'TELSIZ': 0.0}

N = '[low voice]'
T = '[tense] [low voice]'
MOSS_TAG = '[shouting over the wind and rain] [gruff]'
TEL = '[panicked] [breathless] [shouting into a radio]'

LINES = [
    dict(id='L01', v='N', sc='ada', t=f'{N} Kimsenin istemediği bir işi aldın.', gap=0.9, hl={'kimsenin': 'r'}),
    dict(id='L02', v='MOSS', sc='iskele', t=f'{MOSS_TAG} Yedi gece!', gap=0.3, hl={'yedi': 'y'}, etiket='MOSS'),
    dict(id='L03', v='MOSS', sc='iskele', t=f'{MOSS_TAG} Sabah gelirim, evlat!', gap=0.3, etiket='MOSS'),
    dict(id='L04', v='MOSS', sc='iskele', t=f'{MOSS_TAG} Gece asla!', gap=1.4, hl={'asla!': 'r'}, etiket='MOSS'),
    dict(id='L05', v='N', sc='kapi', pre=0.75, t=f'{N} Son bekçi Harlan, bu ışığı otuz yıl boyunca yaktı.', gap=0.4,
         hl={'harlan,': 'y'}),
    dict(id='L06', v='N', sc='kapi', t=f'{T} Bir ay önce... ortadan kayboldu.', gap=0.8, hl={'kayboldu.': 'r'}),
    dict(id='L07', v='N', sc='masa', t=f'{N} Kuralları hâlâ duvarda asılıydı.', gap=0.6),
    dict(id='L08', v='N', sc='kurallar', t=f'{N} Birinci kural: Işık, alacakaranlıktan şafağa kadar yanmalı. Her zaman.', gap=0.5,
         hl={'her': 'y', 'zaman.': 'y'}),
    dict(id='L09', v='N', sc='kurallar', t=f'{N} İkinci kural: Gece üçten sonra telsize asla cevap verme.', gap=0.5,
         hl={'asla': 'r'}),
    dict(id='L10', v='N', sc='kurallar', t=f'{N} Üçüncü kural: Geceleri adaya kimse gelmez. Kimse.', gap=0.5,
         hl={'kimse': 'r', 'kimse.': 'r'}),
    dict(id='L11', v='N', sc='kurallar', t=f'{N} Dördüncü kural: Lambaya doksan dokuz basamak var. Yüz sayarsan... aşağı in.', gap=0.7,
         hl={'doksan': 'y', 'dokuz': 'y', 'yüz': 'r'}),
    dict(id='L12', v='N', sc='kurallar', t=f'{T} Beşinci kuralın üstü karalanmıştı. Sertçe.', gap=0.9,
         hl={'beşinci': 'y', 'sertçe.': 'r'}),
    dict(id='L13', v='N', sc='merdiven', t=f'{N} Doksan dokuz basamak. Say onları.', gap=0.6, hl={'doksan': 'y', 'dokuz': 'y'}),
    dict(id='L14', v='N', sc='merdiven', t=f'{N} Harlan hep sayardı.', gap=1.0, hl={'harlan': 'y'}),
    dict(id='L15', v='N', sc='lamba', t=f'{N} Alacakaranlık.', gap=0.5, hl={'alacakaranlık.': 'y'}),
    dict(id='L16', v='N', sc='lamba', t=f'{N} Işık yandı.', gap=1.2, hl={'yandı.': 'y'}),
    dict(id='L17', v='N', sc='defter', t=f'{N} Bunu deftere yazıyorsun. Harlan\'ın yaptığı gibi. Her gece.', gap=1.2,
         hl={'her': 'y', 'gece.': 'y'}),
    dict(id='L18', v='N', sc='saat', t=f'{T} Saat üç.', slot=('cizirti', 1.6), hl={'saat': 'r', 'üç.': 'r'}),
    dict(id='L19', v='TELSIZ', sc='telsiz', t=f'{TEL} Mayday. Mayday.', gap=0.25, col='o', etiket='TELSİZ · KANAL 16'),
    dict(id='L20', v='TELSIZ', sc='telsiz', t=f'{TEL} Balıkçı teknesi Marigold.', gap=0.25, col='o', etiket='TELSİZ · KANAL 16'),
    dict(id='L21', v='TELSIZ', sc='telsiz', t=f'{TEL} Motorumuz durdu.', gap=0.25, col='o', etiket='TELSİZ · KANAL 16'),
    dict(id='L22', v='TELSIZ', sc='telsiz', t=f'{TEL} Işığınızı göremiyoruz.', gap=0.9, col='o', etiket='TELSİZ · KANAL 16'),
    dict(id='L23', v='N', sc='pencere', t=f'{T} Işık yanıyor... ve dışarıda hiçbir tekne yok.', gap=1.6,
         hl={'hiçbir': 'r', 'tekne': 'r'}),
    dict(id='L24', v='TELSIZ', sc='masa2', t='[desperate] [pleading] [into a radio] Bekçi? Lütfen cevap ver.', gap=0.5, col='o',
         etiket='TELSİZ · KANAL 16'),
    dict(id='L25', v='TELSIZ', sc='masa2', t='[desperate] [shouting into a radio] Teknede çocuklar var!', slot=('kural2', 4.6), col='o',
         hl={'çocuklar': 'r'}, etiket='TELSİZ · KANAL 16'),
    dict(id='L26', v='N', sc='secim', t=f'{N} Çağrı saat üçte başladı. Cevap veriyor musun?', gap=0.0,
         hl={'saat': 'r', 'üçte': 'r', 'cevap': 'y', 'veriyor': 'y', 'musun?': 'y'}),
]

TAIL = 4.8
LEAD = 0.45
GAP = 0.25
SLOTS = {
    'cizirti': [('telsiz_cizirti', 0.25)],
    'kural2': [('telsiz_parazit', 0.3)],
}

KURALLAR_BASLIK = 'Bekçinin kuralları'
KURALLAR = [
    'Işık alacakaranlıktan şafağa kadar yanmalı. Her zaman.',
    "Gece 3'ten sonra telsize asla cevap verme.",
    'Geceleri adaya kimse gelmez. Kimse.',
    "Lambaya 99 basamak. 100 sayarsan aşağı in.",
    'Asla dışarı çıkma, eğer...',
]
