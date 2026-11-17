"""Tuhaf Saat Hikâyeleri · Eksi Seksen · Gün 1 — "Soğuk Hava Dalgası" (~140 sn)

Sesler: N anlatıcı (Orhan) · SPIKER haber spikeri · ARAS (telefon / görüntülü) · CINAR
fx: 'tv' televizyon, 'tel' telefon, 'video' görüntülü arama filtresi
"""

MODEL = 'eleven_v3'
ATEMPO = {'N': 1.22, 'SPIKER': 1.12, 'ARAS': 1.12, 'CINAR': 1.12}
VOICES = {
    'N': 'y6X1mFgtBqHFtQwrOezf',        # Orhan
    'SPIKER': 'Vbx8qgYYdsXg0blBt1S8',   # Mustafa Erkek — haber spikeri
    'ARAS': 'qLctY6uJSzrtjp23kPzO',     # Agit — sakin, genç
    'CINAR': '9q3uhh453wT9R7x3sW1i',    # Alper — sıcak, esprili
}
STAB = {'N': 0.5, 'SPIKER': 0.5, 'ARAS': 0.5, 'CINAR': 0.5}

N = '[calm]'
T = '[tense] [low voice]'
ET_H = 'HABER'
ET_AT = 'ARAS · TELEFON'
ET_AV = 'ARAS · GÖRÜNTÜLÜ'
ET_CT = 'ÇINAR · TELEFON'
ET_C = 'ÇINAR'

LINES = [
    dict(id='L01', v='N', sc='yatak', t=f'{N} On sekiz Aralık sabahı alarmın çaldığında, yerler buz gibiydi.', gap=0.2),
    dict(id='L02', v='N', sc='yatak', strict=True, t=f'{N} Pencerenin kenarları buz tutmuştu. Telefon sıfır dereceyi gösteriyordu. Dün artı ondu.', gap=0.2,
         hl={'sıfır': 'y', 'artı': 'y', 'ondu.': 'y'}),
    dict(id='L03', v='N', sc='mutfak', t=f'{N} On derece düşmüş. Kahveni koyup televizyonu açtın.', slot=('tv', 0.8)),
    dict(id='L04', v='SPIKER', sc='tv_haber', fx='tv', etiket=ET_H,
         t='[professional news anchor] Sibirya kaynaklı soğuk hava dalgası etkisini artırıyor.', gap=0.2),
    dict(id='L05', v='N', sc='mutfak2', t=f"{N} Kış işte, dedin. Ankara'nın ayazı.", gap=0.2),
    dict(id='L06', v='N', sc='park', t=f'{N} Sabah koşusuna çıktın. Parktaki havuz buz tutmuştu. Ağaçlarda tek bir kuş yoktu.', gap=0.2,
         hl={'kuş': 'r', 'yoktu.': 'r'}),
    dict(id='L07', v='N', sc='park', t=f'{N} Güneş tepedeydi ama yüzünü ısıtmıyordu. Soluk, eski bir ampul gibiydi.', gap=0.2,
         hl={'ısıtmıyordu.': 'y'}),
    dict(id='L08', v='N', sc='kafe', t=f'{N} Öğlen bir kafede bilgisayarını açtın. Herkes soğuktan bahsediyordu.', gap=0.2),
    dict(id='L09', v='N', sc='telefon_app', t=f'{N} Hava durumu uygulaması önümüzdeki günler için tuhaf rakamlar gösteriyordu. Eksi on. Eksi yirmi. Eksi otuz.', gap=0.2,
         hl={'eksi': 'r', 'on.': 'r', 'yirmi.': 'r', 'otuz.': 'r'}),
    dict(id='L10', v='N', sc='kafe2', t=f'{N} Masadakiler güldü. Uygulama bozulmuş.', gap=0.2),
    dict(id='L11', v='N', sc='eczane', t=f'{T} Saat birde termometre hâlâ sıfırdı. Öğlen olmasına rağmen bir derece bile yükselmemişti.', gap=0.2,
         hl={'sıfırdı.': 'y'}),
    dict(id='L12', v='N', sc='haber_bandi', t=f"{T} Haber bandında bir satır geçti: Avrupa'da, Asya'da, Amerika'da aynı anda ani soğuma.", gap=0.2,
         hl={'aynı': 'r', 'anda': 'r'}),
    dict(id='L13', v='N', sc='haber_bandi', t=f'{T} Soğuk hava dalgası dünyanın her yerine aynı anda gelmez.', gap=0.2),
    dict(id='L14', v='N', sc='tel_aras', t=f"{N} Aras'ı aradın. Kızılcahamam'daki çiftlikteydi.", slot=('arama', 0.9)),
    dict(id='L15', v='ARAS', sc='tel_aras', fx='tel', strict=True, etiket=ET_AT, t='[calm] Kanka, burada da sıfır. Dün on ikiydi. Bir de garip bir şey var.', gap=0.2),
    dict(id='L16', v='ARAS', sc='tel_aras', fx='tel', etiket=ET_AT, t='[puzzled] Gökyüzü masmavi ama güneş panelleri yarı yarıya az üretiyor. Güneş sanki kısılmış.', gap=0.2,
         hl={'kısılmış.': 'r'}),
    dict(id='L17', v='N', sc='ciftlik', t=f"{N} Aras ve Çınar'la birlikte bir akıllı tarım şirketi kurmuştunuz. İkisi de mühendis.", gap=0.2),
    dict(id='L18', v='N', sc='ciftlik', t=f'{N} Şirketi iki yıl önce sattın. Deneme çiftliğini satmadın. Aras hâlâ orada.', gap=0.2),
    dict(id='L19', v='N', sc='foto', t=f'{N} Üçünüzün de kimsesi yok. Sadece birbiriniz varsınız.', gap=0.2, hl={'birbiriniz': 'y'}),
    dict(id='L20', v='N', sc='tel_cinar', t=f"{N} Çınar'ı aradın.", slot=('arama2', 0.8)),
    dict(id='L21', v='CINAR', sc='tel_cinar', fx='tel', etiket=ET_CT, t='[friendly] Kanka, ben de tam seni arayacaktım. Bu soğuk normal değil, değil mi?', gap=0.2),
    dict(id='L22', v='N', sc='tel_cinar', t=f'{N} Akşam bana gel, dedin.', slot=('zil', 0.8)),
    dict(id='L23', v='N', sc='kapi', t=f'{N} Çınar yedide kapıdaydı. Elinde iki poşet, bir de düdüklü tencere.', gap=0.2),
    dict(id='L24', v='CINAR', sc='kapi', etiket=ET_C, t='[joking] Senin buzdolabında yumurtayla yoğurttan başka bir şey olmadığını biliyorum.', gap=0.2),
    dict(id='L25', v='N', sc='mutfak_aksam', t=f'{N} Mercimek çorbasının kokusu bütün evi sardı. Aras görüntülü aramadaydı, çiftlikteki sobanın başından.', gap=0.4),
    dict(id='L26', v='N', sc='tv_aksam', t=f"{N} Akşam haberleri hâlâ soğuk hava dalgası diyordu. Ama Aras'ın grafiği başka bir şey söylüyordu.", gap=0.2,
         hl={'grafik': 'y'}),
    dict(id='L27', v='ARAS', sc='grafik', fx='video', etiket=ET_AV,
         t='[serious] Çiftliğin hava istasyonu bütün gün güneşi ölçtü. Gökyüzü açık ama gelen ışık normalin yarısı.', gap=0.2,
         hl={'yarısı.': 'r'}),
    dict(id='L28', v='ARAS', sc='grafik', fx='video', etiket=ET_AV, t='[serious] Ve her saat biraz daha azalıyor.', gap=0.2, hl={'azalıyor.': 'r'}),
    dict(id='L29', v='CINAR', sc='masa', etiket=ET_C, t='[worried] Güneş azalırsa ne olur?', gap=0.2),
    dict(id='L30', v='N', sc='hesap', t=f'{T} Hesabı yüksek sesle yaptın. Güneş kısılırsa dünya her gün biraz daha soğur.', gap=0.2),
    dict(id='L31', v='N', sc='hesap', t=f'{T} Bugün on derece düştü. Yarın bir on derece daha.', gap=0.2, hl={'yarın': 'r'}),
    dict(id='L32', v='ARAS', sc='aras_video', fx='video', etiket=ET_AV, t='[serious] Bu bir hava olayı değil kanka.', gap=0.2),
    dict(id='L33', v='N', sc='tv_aksam2', t=f'{T} Haberlerde kimse bundan bahsetmiyordu. Henüz.', gap=0.2, hl={'henüz.': 'r'}),
    dict(id='L34', v='CINAR', sc='masa2', etiket=ET_C, t='[serious] [quietly] Kimse fark etmeden hazırlanırsak, herkesten önde oluruz.', gap=0.2),
    dict(id='L35', v='N', sc='masa2', t=f'{T} Ama bu, herkesi kendi kaderine bırakmak demekti.', gap=0.2),
    dict(id='L36', v='N', sc='secim', strict=True, t=f'{N} Sessizce hazırlanıyor musun, yoksa herkesi uyarıyor musun?', gap=0.0,
         hl={'sessizce': 'y', 'uyarıyor': 'y'}),
]

TAIL = 5.5
LEAD = 0.2
GAP = 0.2
SLOTS = {
    'tv': [('tv_jingle', 0.0)],
    'arama': [('arama_ton', 0.0)],
    'arama2': [('arama_ton', 0.0)],
    'zil': [('kapi_zil', 0.1)],
}

KURALLAR_BASLIK = ''
KURALLAR = []
GUNLUK = []
