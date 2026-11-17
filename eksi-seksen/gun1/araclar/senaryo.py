"""Tuhaf Saat Hikâyeleri · Eksi Seksen · Gün 1 — "Soğuk Hava Dalgası" (en fazla 1:40)

Sıcaklıklar düzensiz düşer: dün +10, bugün −1 (11 derece), yarın −10 (9), sonra −24 (14), −32 (8) ...

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
ET_C = 'ÇINAR'

LINES = [
    dict(id='L01', v='N', sc='yatak', t="On sekiz Aralık sabahı, Çankaya'daki çatı katında alarmın çaldı."),
    dict(id='L02', v='N', sc='yatak', t='Otuz üç yaşındaydın. Şirketini milyonlarca dolara satmıştın.'),
    dict(id='L03', v='N', sc='yatak', strict=True, t='Ama o sabah telefon eksi bir dereceyi gösteriyordu. Dün artı ondu.', gap=0.26),
    dict(id='L04', v='N', sc='mutfak', t='Televizyonu açtın.', slot=('tv', 0.55), gap=0.0),
    dict(id='L05', v='SPIKER', sc='tv_haber', fx='tv', etiket=ET_H, t='Sibirya kaynaklı soğuk hava dalgası etkisini artırıyor.'),
    dict(id='L06', v='N', sc='mutfak2', t="Kış işte, dedin. Ankara'nın ayazı.", gap=0.28),
    dict(id='L07', v='N', sc='park', t="Kuğulu Park'ta havuz buz tutmuştu. Güneş tepedeydi ama ısıtmıyordu.", gap=0.26),
    dict(id='L08', v='N', sc='telefon_app', strict=True,
         t='Öğlen hava durumu uygulaması tuhaf rakamlar gösterdi. Eksi on. Eksi yirmi dört. Eksi otuz iki.'),
    dict(id='L09', v='N', sc='kafe2', t='Kafedekiler güldü. Uygulama bozulmuş.', gap=0.26),
    dict(id='L10', v='N', sc='haber_bandi', t="Haber bandında: Avrupa'da, Asya'da, Amerika'da aynı anda ani soğuma."),
    dict(id='L11', v='N', sc='eczane', t='Soğuk hava dalgası her yere aynı anda gelmez.', gap=0.26),
    dict(id='L12', v='N', sc='tel_aras', t="Ortağın Aras'ı aradın.", slot=('arama', 0.6), gap=0.0),
    dict(id='L13', v='ARAS', sc='tel_aras', fx='tel', etiket=ET_AT,
         t='Kanka, gökyüzü masmavi ama paneller yarı yarıya üretiyor. Güneş sanki kısılmış.', gap=0.26),
    dict(id='L14', v='N', sc='ciftlik', t="Kızılcahamam'daki çiftliği satmamıştın. Türbinler, seralar, kocaman bir depo."),
    dict(id='L15', v='N', sc='foto', t='Aras, Çınar ve sen. Üçünüzün de kimsesi yok.', slot=('zil', 0.55), gap=0.0),
    dict(id='L16', v='N', sc='kapi', t='Akşam Çınar elinde poşetler ve düdüklü tencereyle geldi.'),
    dict(id='L17', v='N', sc='mutfak_aksam', t='Mercimek çorbası kaynarken Aras görüntülü aradı.'),
    dict(id='L18', v='ARAS', sc='grafik', fx='video', etiket=ET_AV,
         t='Bütün gün ölçtüm. Gelen ışık her saat biraz daha azalıyor.', gap=0.26),
    dict(id='L19', v='N', sc='hesap', strict=True,
         t='Bugün on bir derece düştü. Yarın belki dokuz, belki on dört. Ama hep aşağı.', gap=0.26),
    dict(id='L20', v='ARAS', sc='aras_video', fx='video', etiket=ET_AV, t='Bu bir hava olayı değil kanka.', gap=0.28),
    dict(id='L21', v='CINAR', sc='masa2', etiket=ET_C, t='Kimse fark etmeden hazırlanırsak herkesten önde oluruz.'),
    dict(id='L22', v='N', sc='masa2', t='Ama bu, herkesi kendi kaderine bırakmak demekti.', gap=0.3),
    dict(id='L23', v='N', sc='secim', strict=True, t='Sessizce hazırlanıyor musun, yoksa herkesi uyarıyor musun?', gap=0.3),
    dict(id='L24', v='N', sc='secim', strict=True, t='Susarsan kilerin dört ay yeter. Ama bir gün biri sana, biliyordun, diyecek.', gap=0.26),
    dict(id='L25', v='N', sc='secim', strict=True, t='Uyarırsan birkaç kişi kurtulur. Ama paniği sen başlatırsın.', gap=0.0),
]

TAIL = 2.1
LEAD = 1.0   # alarm önce tek başına çalsın
GAP = 0.2
SLOTS = {
    'tv': [('tv_jingle', 0.0)],
    'arama': [('arama_ton', 0.0)],
    'zil': [('kapi_zil', 0.05)],
}

KURALLAR_BASLIK = ''
KURALLAR = []
GUNLUK = []
