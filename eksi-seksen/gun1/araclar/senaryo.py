"""Tuhaf Saat Hikâyeleri · Eksi Seksen · Gün 1 — "Soğuk Hava Dalgası" (~145 sn)

Sesler (ElevenLabs kütüphanesinde Türkçede en çok kullanılan sesler, kararlı çok dilli modelle):
  N      anlatıcı      Doga – Audiobook Master
  SPIKER haber spikeri Mert Aksoy (haber sunumu)
  ARAS   Aras          Yunus – Soft and Natural
  CINAR  Çınar         Mert – Energetic, Natural and Friendly
fx: 'tv' televizyon, 'tel' telefon, 'video' görüntülü arama (hafif filtreler)
"""

MODEL = 'eleven_multilingual_v2'
ATEMPO = 1.0   # yapay hızlandırma yok; hız ses ayarında
VOICES = {
    'N': 'ctoYieZ4J7WwcdhujpMq',
    'SPIKER': 'z2ObNnp0E5ZGeTlSXkX0',
    'ARAS': 'fXhoW006nc5Wf8xkGVSy',
    'CINAR': '01p4omegjS2n3rSDCM5u',
}
SETTINGS = {
    'N': {'stability': 0.5, 'similarity_boost': 0.8, 'style': 0.25, 'use_speaker_boost': True, 'speed': 1.08},
    'SPIKER': {'stability': 0.55, 'similarity_boost': 0.8, 'style': 0.15, 'use_speaker_boost': True, 'speed': 1.05},
    'ARAS': {'stability': 0.5, 'similarity_boost': 0.8, 'style': 0.2, 'use_speaker_boost': True, 'speed': 1.05},
    'CINAR': {'stability': 0.45, 'similarity_boost': 0.8, 'style': 0.35, 'use_speaker_boost': True, 'speed': 1.05},
}
STAB = {k: v['stability'] for k, v in SETTINGS.items()}

ET_H = 'HABER'
ET_AT = 'ARAS · TELEFON'
ET_AV = 'ARAS · GÖRÜNTÜLÜ'
ET_CT = 'ÇINAR · TELEFON'
ET_C = 'ÇINAR'

LINES = [
    dict(id='L01', v='N', sc='yatak', t="On sekiz Aralık sabahı, Çankaya'daki çatı katında alarmın çaldı.", gap=0.24),
    dict(id='L02', v='N', sc='yatak', t='Otuz üç yaşındaydın. Kurduğun şirketi milyonlarca dolara satmıştın. Bir daha çalışmana gerek yoktu.', gap=0.28,
         hl={'milyonlarca': 'y', 'dolara': 'y'}),
    dict(id='L03', v='N', sc='yatak', strict=True, t='Ama o sabah yerler buz gibiydi. Telefon sıfır dereceyi gösteriyordu. Dün artı ondu.', gap=0.24,
         hl={'sıfır': 'y', 'artı': 'y', 'ondu.': 'y'}),
    dict(id='L04', v='N', sc='mutfak', t='Kahveni alıp televizyonu açtın.', slot=('tv', 0.7)),
    dict(id='L05', v='SPIKER', sc='tv_haber', fx='tv', etiket=ET_H, t='Sibirya kaynaklı soğuk hava dalgası etkisini artırıyor.', gap=0.24),
    dict(id='L06', v='N', sc='mutfak2', t="Kış işte, dedin. Ankara'nın ayazı.", gap=0.32),
    dict(id='L07', v='N', sc='park', t="Kuğulu Park'ta havuz buz tutmuştu. Ağaçlarda tek bir kuş yoktu.", gap=0.24, hl={'kuş': 'r', 'yoktu.': 'r'}),
    dict(id='L08', v='N', sc='park', t='Güneş tepedeydi ama ısıtmıyordu. Soluk, eski bir ampul gibiydi.', gap=0.32, hl={'ısıtmıyordu.': 'y'}),
    dict(id='L09', v='N', sc='kafe', t="Öğlen Tunalı'da bir kafede herkes soğuktan bahsediyordu.", gap=0.2),
    dict(id='L10', v='N', sc='telefon_app', t='Hava durumu uygulaması tuhaf rakamlar gösteriyordu. Eksi on. Eksi yirmi. Eksi otuz.', gap=0.28,
         hl={'eksi': 'r', 'on.': 'r', 'yirmi.': 'r', 'otuz.': 'r'}),
    dict(id='L11', v='N', sc='kafe2', t='Masadakiler güldü. Uygulama bozulmuş.', gap=0.32),
    dict(id='L12', v='N', sc='eczane', t='Saat birde termometre hâlâ sıfırdı. Öğlen bile bir derece yükselmemişti.', gap=0.24, hl={'sıfırdı.': 'y'}),
    dict(id='L13', v='N', sc='haber_bandi', t="Haber bandında bir satır geçti: Avrupa'da, Asya'da, Amerika'da aynı anda ani soğuma.", gap=0.24,
         hl={'aynı': 'r', 'anda': 'r'}),
    dict(id='L14', v='N', sc='haber_bandi', t='Soğuk hava dalgası dünyanın her yerine aynı anda gelmez.', gap=0.32),
    dict(id='L15', v='N', sc='tel_aras', t="Aras'ı aradın. Şirketi birlikte kurduğunuz mühendis. Kızılcahamam'daki çiftlikte yaşıyor.", slot=('arama', 0.8)),
    dict(id='L16', v='ARAS', sc='tel_aras', fx='tel', etiket=ET_AT, t='Kanka, burada da sıfır. Dün on ikiydi. Bir de garip bir şey var.', gap=0.2),
    dict(id='L17', v='ARAS', sc='tel_aras', fx='tel', etiket=ET_AT, t='Gökyüzü masmavi ama güneş panelleri yarı yarıya az üretiyor. Güneş sanki kısılmış.', gap=0.32,
         hl={'kısılmış.': 'r'}),
    dict(id='L18', v='N', sc='ciftlik', t='Şirketi satarken deneme çiftliğini satmamıştın. Rüzgâr türbinleri, seralar, kocaman bir depo. Hepsi senindi.', gap=0.24,
         hl={'senindi.': 'y'}),
    dict(id='L19', v='N', sc='foto', t='Aras, Çınar ve sen. Üçünüzün de kimsesi yok. Sadece birbiriniz varsınız.', gap=0.32, hl={'birbiriniz': 'y'}),
    dict(id='L20', v='N', sc='tel_cinar', t="Çınar'ı aradın.", slot=('arama2', 0.7)),
    dict(id='L21', v='CINAR', sc='tel_cinar', fx='tel', etiket=ET_CT, t='Kanka, ben de tam seni arayacaktım. Bu soğuk normal değil, değil mi?', slot=('zil', 0.8)),
    dict(id='L22', v='N', sc='kapi', t='Akşam yedide Çınar kapıdaydı. Elinde iki poşet, bir de düdüklü tencere.', gap=0.2),
    dict(id='L23', v='CINAR', sc='kapi', etiket=ET_C, t='Senin buzdolabında yumurtayla yoğurttan başka bir şey olmadığını biliyorum.', gap=0.32),
    dict(id='L24', v='N', sc='mutfak_aksam', t='Mercimek çorbasının kokusu evi sardı. Aras görüntülü aramadaydı.', gap=0.24),
    dict(id='L25', v='N', sc='tv_aksam', t="Haberler hâlâ soğuk hava dalgası diyordu. Ama Aras'ın grafiği başka bir şey söylüyordu.", gap=0.24, hl={'grafiği': 'y'}),
    dict(id='L26', v='ARAS', sc='grafik', fx='video', etiket=ET_AV,
         t='Çiftliğin hava istasyonu bütün gün güneşi ölçtü. Gelen ışık normalin yarısı. Ve her saat azalıyor.', gap=0.32,
         hl={'yarısı.': 'r', 'azalıyor.': 'r'}),
    dict(id='L27', v='CINAR', sc='masa', etiket=ET_C, t='Güneş azalırsa ne olur?', gap=0.32),
    dict(id='L28', v='N', sc='hesap', t='Hesabı yüksek sesle yaptın. Güneş kısılırsa dünya her gün biraz daha soğur.', gap=0.2),
    dict(id='L29', v='N', sc='hesap', t='Bugün on derece düştü. Yarın bir on derece daha.', gap=0.32, hl={'yarın': 'r'}),
    dict(id='L30', v='ARAS', sc='aras_video', fx='video', etiket=ET_AV, t='Bu bir hava olayı değil kanka.', gap=0.32),
    dict(id='L31', v='N', sc='tv_aksam2', t='Haberlerde kimse bundan bahsetmiyordu. Henüz.', gap=0.32, hl={'henüz.': 'r'}),
    dict(id='L32', v='CINAR', sc='masa2', etiket=ET_C, t='Kimse fark etmeden hazırlanırsak, herkesten önde oluruz.', gap=0.24),
    dict(id='L33', v='N', sc='masa2', t='Ama bu, herkesi kendi kaderine bırakmak demekti.', gap=0.36),
    dict(id='L34', v='N', sc='secim', strict=True, t='Sessizce hazırlanıyor musun, yoksa herkesi uyarıyor musun?', gap=0.0,
         hl={'sessizce': 'y', 'uyarıyor': 'y'}),
]

TAIL = 5.0
LEAD = 0.2
GAP = 0.24
SLOTS = {
    'tv': [('tv_jingle', 0.0)],
    'arama': [('arama_ton', 0.0)],
    'arama2': [('arama_ton', 0.0)],
    'zil': [('kapi_zil', 0.1)],
}

KURALLAR_BASLIK = ''
KURALLAR = []
GUNLUK = []
