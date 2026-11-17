"""Tuhaf Saat Hikâyeleri · Fener · Gece 1/7 — referans videonun birebir Türkçe çevirisi.

Sesler:
  N      : anlatıcı (Orhan)
  MOSS   : kayıkçı Moss (yaşlı, fırtınada bağırıyor)
  TELSIZ : telsizdeki kaptan (panik, telsiz filtresiyle)
Alanlar: id, v (ses), t (metin, v3 tag'li), sc (sahne), gap, slot (ad, sn), hl (renkli kelimeler),
         col (satırın tümü için renk), etiket (altyazı üstü konuşmacı etiketi)
"""

MODEL = 'eleven_v3'
ATEMPO = {'N': 1.17, 'MOSS': 1.12, 'TELSIZ': 1.12}   # hızlı tempo: toplam ~1:20
VOICES = {
    'N': 'y6X1mFgtBqHFtQwrOezf',       # Orhan
    'MOSS': 'E38heb42yln7Ox5qE9i9',    # Aykut — yaşlı erkek
    'TELSIZ': 'euBhqSy9BY3XHNLwxF7J',  # Emre — sert erkek sesi
}
STAB = {'N': 0.5, 'MOSS': 0.0, 'TELSIZ': 0.0}

N = '[low voice]'
T = '[tense] [low voice]'
MOSS_TAG = '[shouting over the wind and rain] [gruff]'
TEL = '[panicked] [breathless] [shouting into a radio]'
ET = 'TELSİZ · KANAL 16'

# Orijinal İngilizce metin satır satır, karşısında birebir anlamlı Türkçe:
LINES = [
    # You took a job no one else wanted.
    dict(id='L01', v='N', sc='ada', strict=True, t=f'{N} Kimsenin istemediği işi sen aldın.', gap=0.35, hl={'kimsenin': 'r'}),
    # Seven nights! I'll be back in the morning, kid! Never at night!
    dict(id='L02', v='MOSS', sc='iskele', t=f'{MOSS_TAG} Yedi gece! Sabah dönerim, evlat! Gece asla gelmem!', gap=0.5,
         hl={'yedi': 'y', 'asla': 'r'}, etiket='MOSS'),
    # The last keeper, Harlan, kept this light for thirty years.
    dict(id='L05', v='N', sc='kapi', pre=0.45, t=f'{N} Önceki bekçi Harlan, bu ışığı otuz yıl boyunca yaktı.', gap=0.2,
         hl={'harlan,': 'y'}),
    # A month ago, he vanished.
    dict(id='L06', v='N', sc='kapi', t=f'{T} Bir ay önce... ortadan kayboldu.', gap=0.4, hl={'kayboldu.': 'r'}),
    # His rules were still pinned to the wall.
    dict(id='L07', v='N', sc='masa', t=f'{N} Kuralları hâlâ duvarda asılıydı.', gap=0.25),
    # Rule one: the light must burn from dusk to dawn, always.
    dict(id='L08', v='N', sc='kurallar', t=f'{N} Birinci kural: Işık, alacakaranlıktan şafağa kadar yanmalı. Her zaman.', gap=0.2,
         hl={'her': 'y', 'zaman.': 'y'}),
    # Rule two: never answer the radio after three AM.
    dict(id='L09', v='N', sc='kurallar', t=f'{N} İkinci kural: Gece üçten sonra telsize asla cevap verme.', gap=0.2,
         hl={'asla': 'r'}),
    # Rule three: nobody comes to the island at night. Nobody.
    dict(id='L10', v='N', sc='kurallar', t=f'{N} Üçüncü kural: Geceleri adaya kimse gelmez. Kimse.', gap=0.2,
         hl={'kimse': 'r', 'kimse.': 'r'}),
    # Rule four: there are ninety-nine steps to the lamp. If you count a hundred, go back down.
    dict(id='L11', v='N', sc='kurallar', t=f'{N} Dördüncü kural: Lambaya kadar doksan dokuz basamak var. Yüz sayarsan... aşağı in.', gap=0.3,
         hl={'doksan': 'y', 'dokuz': 'y', 'yüz': 'r'}),
    # Rule five was scratched out, hard.
    dict(id='L12', v='N', sc='kurallar', t=f'{T} Beşinci kural karalanmıştı. Bastıra bastıra.', gap=0.35,
         hl={'beşinci': 'y', 'bastıra': 'r', 'bastıra.': 'r'}),
    # Ninety-nine steps. Count them.
    dict(id='L13', v='N', sc='merdiven', t=f'{N} Doksan dokuz basamak. Say onları.', gap=0.25, hl={'doksan': 'y', 'dokuz': 'y'}),
    # Harlan always did.
    dict(id='L14', v='N', sc='merdiven', t=f'{N} Harlan hep sayardı.', gap=0.4, hl={'harlan': 'y'}),
    # Dusk.
    dict(id='L15', v='N', sc='lamba', t=f'{N} Alacakaranlık.', gap=0.15, hl={'alacakaranlık.': 'y'}),
    # The light is on.
    dict(id='L16', v='N', sc='lamba', t=f'{N} Işık yandı.', gap=0.5, hl={'yandı.': 'y'}),
    # You write it down, like Harlan did, every night.
    dict(id='L17', v='N', sc='defter', t=f"{N} Bunu deftere yazıyorsun, Harlan'ın yaptığı gibi. Her gece.", gap=0.5,
         hl={'her': 'y', 'gece.': 'y'}),
    # Three o'clock.
    dict(id='L18', v='N', sc='saat', t=f'{T} Saat üç.', slot=('cizirti', 0.9), hl={'saat': 'r', 'üç.': 'r'}),
    # Mayday. Mayday. Fishing vessel Marigold. We've lost our engine. We can't see your light.
    dict(id='L19', v='TELSIZ', sc='telsiz', t=f'{TEL} Mayday. Mayday.', gap=0.12, col='o', etiket=ET),
    dict(id='L20', v='TELSIZ', sc='telsiz', strict=True, t=f'{TEL} Balıkçı teknesi Marigold.', gap=0.12, col='o', etiket=ET),
    dict(id='L21', v='TELSIZ', sc='telsiz', t=f'{TEL} Motorumuz durdu.', gap=0.12, col='o', etiket=ET),
    dict(id='L22', v='TELSIZ', sc='telsiz', t=f'{TEL} Işığınızı göremiyoruz.', gap=0.35, col='o', etiket=ET),
    # The light is on, and there is no boat out there.
    dict(id='L23', v='N', sc='pencere', t=f'{T} Işık yanıyor... ve dışarıda hiçbir tekne yok.', gap=0.6,
         hl={'hiçbir': 'r', 'tekne': 'r'}),
    # Keeper, please answer. We have children on board.
    dict(id='L24', v='TELSIZ', sc='masa2', t='[desperate] [pleading] [into a radio] Bekçi? Lütfen cevap ver.', gap=0.2, col='o',
         etiket=ET),
    dict(id='L25', v='TELSIZ', sc='masa2', t='[desperate] [shouting into a radio] Teknede çocuklar var!', slot=('kural2', 2.6), col='o',
         hl={'çocuklar': 'r'}, etiket=ET),
    # The call started at three o'clock. Do you answer?
    dict(id='L26', v='N', sc='secim', t=f'{N} Çağrı saat üçte başladı. Cevap veriyor musun?', gap=0.0,
         hl={'saat': 'r', 'üçte': 'r', 'cevap': 'y', 'veriyor': 'y', 'musun?': 'y'}),
]

TAIL = 4.4
LEAD = 0.2
GAP = 0.12
SLOTS = {
    'cizirti': [('telsiz_cizirti', 0.15)],
    'kural2': [('telsiz_parazit', 0.2)],
}

KURALLAR_BASLIK = 'Bekçinin kuralları'
KURALLAR = [
    'Işık alacakaranlıktan şafağa kadar yanmalı. Her zaman.',
    "Gece 3'ten sonra telsize asla cevap verme.",
    'Geceleri adaya kimse gelmez. Kimse.',
    "Lambaya kadar 99 basamak. 100 sayarsan aşağı in.",
    'Asla dışarı çıkma, eğer...',
]
