"""Gece Nöbeti · Bölüm 1 — "Kuzgun Adası Feneri" (Gece 1/7)

Tek anlatıcı, ikinci tekil şahıs ("sen"). Satırlar sırayla seslendirilir.
Alanlar:
  id     : satır kimliği (görsel sahne eşlemesi bunu kullanır)
  t      : okunacak metin (ElevenLabs v3 tag'leri dahil)
  sc     : sahne adı (motor/sahneler.js)
  gap    : satırdan sonra bırakılacak boşluk (sn)
  slot   : satırdan sonra efekt için ayrılan süre ve efekt adı -> (ad, sn)
  hl     : altyazıda renklenecek kelimeler {kelime: renk}  (y=sarı, r=kırmızı, a=amber)
"""

VOICE = 'y6X1mFgtBqHFtQwrOezf'   # Orhan — tiyatro kökenli, derin anlatıcı
MODEL = 'eleven_v3'
ATEMPO = 1.07   # anlatım hızı (ses doğallığını bozmadan)

N = '[low voice]'
T = '[tense] [low voice]'
W = '[whispers]'

LINES = [
    # --- Varış
    dict(id='L01', sc='varis', t=f'{N} Seni adaya bırakan balıkçı, iskeleye yanaşmadı bile.', hl={'yanaşmadı': 'r'}),
    dict(id='L02', sc='varis', t=f'{N} Erzakını kayalara attı. Arkasına bakmadan gitti.', hl={'bakmadan': 'r'}),
    dict(id='L03', sc='genis', t=f'{N} Kuzgun Adası. Yedi gece. Bir fener, bir de sen.', gap=0.5,
         hl={'kuzgun': 'a', 'adası.': 'a', 'yedi': 'y', 'gece.': 'y'}),
    # --- Rıza Usta
    dict(id='L04', sc='riza_eski', t=f'{N} Bu feneri kırk bir yıl boyunca Rıza Usta yaktı.',
         hl={'kırk': 'y', 'bir': 'y', 'yıl': 'y', 'rıza': 'a', 'usta': 'a'}),
    dict(id='L05', sc='iskele_safak', t=f'{N} Geçen ay bir sabah, onu iskelede buldular.', hl={'iskelede': 'y'}),
    dict(id='L07', sc='iskele_safak', t=f'{T} Sadece sayıyordu.', gap=0.3, hl={'sayıyordu.': 'r'}),
    dict(id='L08', sc='riza_yakin', t='[imitating an old man, whispering, trembling] Bir... iki... üç...', gap=0.45,
         hl={'üç...': 'r'}),
    dict(id='L09', sc='safak_sonuk', t=f'[slowly] {N} O sabah, fener sönüktü.', gap=0.6, hl={'sönüktü.': 'r'}),
    # --- Kurallar
    dict(id='L10', sc='oda', t=f'{N} Kuralları hâlâ duvarda asılı.', gap=0.3),
    dict(id='L11', sc='kurallar', t=f'{N} Birinci kural: Fener gün batımında yanar. Arada asla sönmez.',
         gap=0.35, hl={'asla': 'r', 'sönmez.': 'r'}),
    dict(id='L12', sc='kurallar', t=f'{N} İkinci kural: Sis gelirse, düdüğü beş dakikada bir çal.', gap=0.35,
         hl={'beş': 'y', 'dakikada': 'y'}),
    dict(id='L13', sc='kurallar', t=f'{N} Üçüncü kural: Denizden bir düdük cevap verirse... say.', gap=0.35,
         hl={'cevap': 'r', 'say.': 'y'}),
    dict(id='L14', sc='kurallar', t=f'{N} Dördüncü kural: Üçüncü cevapta feneri söndür. Sabaha kadar yakma.', gap=0.4,
         hl={'üçüncü': 'y', 'cevapta': 'y', 'söndür.': 'r'}),
    dict(id='L15', sc='kurallar', t=f'{N} Beşinci kural, başka bir mürekkeple yazılmış.', gap=0.25, hl={'başka': 'a'}),
    dict(id='L16', sc='kurallar', t=f'{W} Ben gelip kapıyı çalarsam... açma.', gap=0.7, hl={'açma.': 'r'}),
    # --- Gece 1 başlıyor
    dict(id='L17', sc='yakma', t=f'{N} Gün batıyor. Feneri yakıyorsun.', gap=0.8, hl={'yakıyorsun.': 'y'}),
    dict(id='L18', sc='sis', t=f'{N} Gece ikiye doğru, sis geliyor.', gap=0.5, hl={'sis': 'y'}),
    dict(id='L19', sc='duduk1', t=f'{T} Düdüğü çalıyorsun.', slot=('duduk1', 3.9), hl={'çalıyorsun.': 'y'}),
    dict(id='L20', sc='cevap1', t=f'{T} Denizden, bir düdük cevap veriyor.', gap=0.25, hl={'cevap': 'r'}),
    dict(id='L21', sc='cevap1', t=f'{W} Bir.', gap=0.6, hl={'bir.': 'r'}),
    dict(id='L22', sc='duduk2', t=f'{T} Beş dakika sonra, yine çalıyorsun.', slot=('duduk2', 3.6), hl={'yine': 'y'}),
    dict(id='L23', sc='cevap2', t=f'{W} İki.', gap=0.2, hl={'iki.': 'r'}),
    dict(id='L24', sc='cevap2', t=f'{T} Bu sefer daha yakından.', gap=0.35, hl={'yakından.': 'r'}),
    dict(id='L25', sc='cevap2', t=f'{N} Bu bir yankı değil. Yankı beklemez.', gap=0.5, hl={'yankı': 'y', 'beklemez.': 'r'}),
    dict(id='L26', sc='duduk3', t=f'{T} Üçüncü kez çalıyorsun.', slot=('duduk3', 5.2), hl={'üçüncü': 'y'}),
    dict(id='L27', sc='cevap3', t=f'{W} Üç.', gap=0.7, hl={'üç.': 'r'}),
    # --- İkilem
    dict(id='L28', sc='kural4', t=f'{T} Dördüncü kural: Feneri söndür.', gap=0.4, hl={'söndür.': 'r'}),
    dict(id='L29', sc='tekne', t=f'{T} Ama sisin içinde ışıklar var. Bir tekne, kayalara doğru geliyor.', gap=0.35,
         hl={'ışıklar': 'y', 'kayalara': 'r'}),
    dict(id='L30', sc='salter', t=f'{N} Fener sönerse, kayaları göremezler.', gap=0.5, hl={'göremezler.': 'r'}),
    dict(id='L31', sc='secim', t=f'[slowly] {N} Üçüncü cevap geldi. Feneri söndürüyor musun?', gap=0.0,
         hl={'söndürüyor': 'r', 'musun?': 'r'}),
]

TAIL = 3.8     # son karttan sonra bekleme (sn)
LEAD = 0.30    # baştaki sessizlik
GAP = 0.18     # varsayılan satır arası

# Efekt yuvaları içindeki zamanlama (yuvanın başına göre, sn)
#   düdük: bizim sis düdüğümüz ; cevap: denizden gelen düdük
SLOTS = {
    'duduk1': [('sis_duduk', 0.08), ('cevap_duduk_uzak', 2.50)],
    'duduk2': [('sis_duduk', 0.08), ('cevap_duduk_orta', 2.25)],
    'duduk3': [('sis_duduk', 0.08), ('cevap_duduk_yakin', 3.40)],
}

# Kâğıttaki kurallar (ekranda el yazısıyla)
KURALLAR_BASLIK = 'Bekçinin kuralları'
KURALLAR = [
    'Fener gün batımında yanar, gün doğumunda söner. Arada asla sönmez.',
    'Sis gelirse düdüğü beş dakikada bir çal.',
    'Denizden bir düdük cevap verirse, say.',
    'Üçüncü cevapta feneri söndür. Sabaha kadar yakma.',
    'Ben gelip kapıyı çalarsam, açma.',
]
