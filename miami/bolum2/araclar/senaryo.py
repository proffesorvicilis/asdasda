"""Miami · Bölüm 2 — "Kapağı seçtin, sonra kapak açılmadı" (İngilizce videonun birebir Türkçe çevirisi)

Zamanlar orijinal videoya göre sabitlenmiştir (at = saniye); her satır o ana yerleştirilir.
Altyazı renkleri orijinaldeki gibi konuşana göredir:
  ALEX   kırmızı tişörtlü arkadaş (sarı)          Mark – Cartoonish, Funny and Cheerful
  SAM    sen / birinci şahıs (beyaz)               Fatih Yıldırım – young energetic
  PILOT  helikopter pilotu (mor, hoparlör sesi)    Cem – Heroic, Intense and Crisp
  TEKNE  teknedeki cankurtaran (beyaz)             Cavit – Energetic and Fast-Paced
Çeviri tablosu:
  Grab my hand!          Elimi tut!            Pull it shut.        Çek, kapat!
  Is it holding?!        Dayanıyor mu?!        It's holding!        Dayanıyor!
  Ah!                    Ah!                   It's coming in!      İçeri giriyor!
  It won't open!         Açılmıyor!            The boat's on it!    Üstünde tekne var!
  Push!                  İt şunu!                 Alex?!               Alex?!
  Sam! Here!             Sam! Burada!          Another one's coming!  Bir tane daha geliyor!
  One pass!              Tek geçiş!            Grab the ladder!     Merdiveni tut!
  I'm slipping!          Kayıyorum!            Hey! Over here!      Hey! Buraya!
  Now! Both hands!       Şimdi! İki elinle!    Just go!             Hadi git!
  Swim to the boat!      Tekneye yüz!
"""

MODEL = 'eleven_v3'
VOICES = {
    'ALEX': 'DUnzBkwtjRWXPr6wRbmL',
    'SAM': '7VqWGAWwo2HMrylfKrcm',
    'PILOT': 'D1xRw7f8ZHedI7xJgfvz',
    'TEKNE': 'lxZLq5dcyw12UangGJgN',
}
SETTINGS = {k: {'stability': 0.5, 'similarity_boost': 0.75, 'style': 0.0, 'use_speaker_boost': True} for k in VOICES}
FX = {'PILOT': 'radio'}          # hoparlör / telsiz sesi

# t: ekranda görünen metin (büyük/küçük harf orijinaldeki gibi) · say: söylenen metin (doğrulama)
# tts: ElevenLabs'e giden metin (v3 duygu etiketleriyle) · at: başlangıç saniyesi · takes: denenecek geçerli kayıt sayısı
LINES = [
    dict(id='L01', maxd=1.5, v='ALEX', at=0.30, t='ELİMİ TUT!', say='Elimi tut', tts='[shouting] Elimi tut!', takes=3),
    dict(id='L02', maxd=1.3, v='SAM', at=2.88, t='ÇEK, KAPAT!', say='Çek kapat', tts='[panicked, shouting] Çek, kapat!', takes=3),
    dict(id='L03', maxd=1.0, v='SAM', at=8.50, t='Dayanıyor mu?!', say='Dayanıyor mu', tts='[panicked] Dayanıyor mu?', takes=3),
    dict(id='L04', maxd=1.0, v='ALEX', at=9.60, t='Dayanıyor!', say='Dayanıyor', tts='[breathless] Dayanıyor!', takes=3),
    dict(id='L05', maxd=0.7, v='ALEX', at=12.00, t='Ah!', say='Ah', tts='[screams] Ah!', ok_re=r'(?:a+h*|ha+h*)+', nocap=True, takes=3),
    dict(id='L06', maxd=1.0, v='SAM', at=12.90, t='İçeri giriyor!', say='İçeri giriyor', tts='[panicked] İçeri giriyor!', takes=3),
    dict(id='L07', maxd=1.2, v='SAM', at=14.55, t='Açılmıyor!', say='Açılmıyor', tts='[panicked] Açılmıyor!', takes=3),
    dict(id='L08', maxd=1.4, v='ALEX', at=15.90, t='Üstünde tekne var!', say='Üstünde tekne var', tts='[panicked] Üstünde tekne var!', takes=3),
    dict(id='L09', maxd=1.0, v='ALEX', at=17.25, t='İT ŞUNU!', say='İt şunu', tts='[straining] İt şunu!', takes=3),
    dict(id='L10', maxd=0.8, v='SAM', at=27.25, t='ALEX?!', say='Aleks', tts='[desperate, hoarse] Aleks?!', ok=['aleks', 'alex', 'aleksi'], takes=3),
    dict(id='L11', maxd=1.4, v='ALEX', at=27.90, t='SAM! BURADA!', say='Sam burada', tts='[relieved, shouting] Sam! Burada!', takes=3),
    dict(id='L12', maxd=1.5, v='SAM', at=29.40, t='BİR TANE DAHA GELİYOR!', say='Bir tane daha geliyor', tts='[panicked] Bir tane daha geliyor!', col='mint', takes=3),
    dict(id='L13', maxd=0.9, v='PILOT', at=31.50, t='TEK GEÇİŞ!', say='Tek geçiş', tts='Tek geçiş!', col='mor', takes=3),
    dict(id='L14', maxd=1.0, v='PILOT', at=32.55, t='MERDİVENİ TUT!', say='Merdiveni tut', tts='Merdiveni tut!', col='mor', takes=3),
    dict(id='L15', maxd=1.2, v='ALEX', at=34.55, t='Kayıyorum!', say='Kayıyorum', tts='[panicked, straining] Kayıyorum!', takes=3),
    dict(id='L16', maxd=1.5, v='SAM', at=36.00, t='HEY! BURAYA!', say='Hey hey buraya', tts='[shouting] Hey! Hey, buraya!', takes=3),
    dict(id='L17', maxd=1.3, v='PILOT', at=37.55, t='ŞİMDİ! İKİ ELİNLE!', say='Şimdi iki elinle', tts='Şimdi, iki elinle!', col='mor', takes=3),
    dict(id='L18', maxd=0.8, v='ALEX', at=39.05, t='Hadi GİT!', say='Hadi git', tts='[shouting] Hadi git!', takes=3),
    dict(id='L19', maxd=1.2, v='TEKNE', at=39.80, t='TEKNEYE YÜZ!', say='Tekneye yüz', tts='[shouting] Tekneye yüz!', takes=3),
]

LEAD = 0.0
DUR = 44.0            # video süresi (son 3 sn seçim ekranı)
GAP = 0.12
