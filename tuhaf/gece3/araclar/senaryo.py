"""Tuhaf Saat Hikâyeleri · Fener · Gece 3/7 — referans videonun birebir, anlamlı Türkçesi.

Sesler: N anlatıcı (Orhan) · MOSS telsizde Moss (Aykut) · SES telsizde senin sesin (genç erkek)
"""

MODEL = 'eleven_v3'
ATEMPO = {'N': 1.17, 'MOSS': 1.1, 'SES': 1.05}
VOICES = {
    'N': 'y6X1mFgtBqHFtQwrOezf',       # Orhan
    'MOSS': 'E38heb42yln7Ox5qE9i9',    # Aykut
    'SES': 'UtI8LSMMDNx2i47tnKLQ',     # genç, doğal erkek sesi (bekçinin sesi)
}
STAB = {'N': 0.5, 'MOSS': 0.0, 'SES': 0.5}
RADIO = {'MOSS', 'SES'}   # telsiz filtresi uygulanacak sesler

N = '[low voice]'
T = '[tense] [low voice]'
ET_T = 'TELSİZ · KANAL 16'
ET_M = 'MOSS · TELSİZ'

# Orijinal İngilizce → birebir anlamlı Türkçe
LINES = [
    # You chose to keep it locked.
    dict(id='L01', v='N', sc='kapi_kilitli', strict=True, t=f'{N} Kapıyı kilitli tutmayı seçtin.', slot=('vurus', 1.7)),
    # It knocked a while longer.
    dict(id='L02', v='N', sc='kapi_kilitli', t=f'{T} Kapıyı bir süre daha çaldı.', gap=0.5),
    # Then it was gone.
    dict(id='L03', v='N', sc='kapi_kilitli', t=f'{T} Sonra gitti.', gap=0.6, hl={'gitti.': 'y'}),
    # In the morning, handprints on the outside of the glass.
    dict(id='L04', v='N', sc='el_izleri', t=f'{T} Sabah, camın dışında el izleri vardı.', gap=0.6,
         hl={'camın': 'y', 'el': 'r', 'izleri': 'r'}),
    # At noon, you told Moss about the visitor.
    dict(id='L05', v='N', sc='gunduz3', strict=True, t=f"{N} Öğlen, Moss'a ziyaretçiyi anlattın.", gap=0.4, hl={'ziyaretçiyi': 'y'}),
    # Harlan's cap?
    dict(id='L06', v='MOSS', sc='moss_telsiz', t="[surprised] [gruff] Harlan'ın kasketi mi?", gap=0.4, etiket=ET_M,
         hl={"harlan'ın": 'y', 'kasketi': 'y', 'mi?': 'y'}),
    # Stay inside, kid.
    dict(id='L07', v='MOSS', sc='moss_telsiz', t='[gruff] [serious] İçeride kal, evlat.', gap=0.3, etiket=ET_M),
    # After the seventh night, I'm there at first light.
    dict(id='L08', v='MOSS', sc='moss_telsiz', t='[gruff] [serious] Yedinci geceden sonra, sabahın ilk ışığıyla oradayım.', gap=0.5,
         etiket=ET_M, hl={'yedinci': 'y'}),
    # Harlan's journal.
    dict(id='L09', v='N', sc='gunluk3', t=f"{N} Harlan'ın günlüğü.", gap=0.35, hl={"harlan'ın": 'y'}),
    # It can't cross the beam.
    dict(id='L10', v='N', sc='gunluk3', t=f'{T} Işığın içinden geçemez.', gap=0.25),
    # It needs the light out or the door open.
    dict(id='L11', v='N', sc='gunluk3', t=f'{T} Işığın sönmesi ya da kapının açılması lazım.', gap=0.25,
         hl={'sönmesi': 'r', 'açılması': 'r'}),
    # It will try both.
    dict(id='L12', v='N', sc='gunluk3', t=f'{T} İkisini de deneyecek.', slot=('disari', 2.6), hl={'ikisini': 'r', 'deneyecek.': 'r'}),
    # Ninety-nine steps.
    dict(id='L13', v='N', sc='merdiven', pre=1.4, t=f'{N} Doksan dokuz basamak.', gap=0.4, hl={'doksan': 'y', 'dokuz': 'y'}),
    # Good.
    dict(id='L14', v='N', sc='merdiven', t=f'{N} Güzel.', gap=0.6, hl={'güzel.': 'y'}),
    # Dusk. The light is on.
    dict(id='L15', v='N', sc='lamba', t=f'{N} Alacakaranlık. Işık yandı.', gap=0.6, hl={'yandı.': 'y'}),
    # Ten to midnight.
    dict(id='L16', v='N', sc='uykusuz', t=f'{N} Gece yarısına on var.', gap=0.3, hl={'gece': 'y', 'yarısına': 'y'}),
    # You couldn't sleep.
    dict(id='L17', v='N', sc='uykusuz', t=f'{N} Uyuyamadın.', slot=('kagit', 4.2)),
    # Harlan knew.
    dict(id='L18', v='N', sc='kural5', pre=2.7, t=f'{T} Harlan biliyordu.', gap=0.7, hl={'biliyordu.': 'y'}),
    # At twenty past three, the radio switched on by itself.
    dict(id='L19', v='N', sc='telsiz_acilir3', t=f'{T} Üçü yirmi geçe, telsiz kendi kendine açıldı.', gap=0.45,
         hl={'kendi': 'r', 'kendine': 'r'}),
    # Moss, it's me. Everything's fine out here.
    dict(id='L20', v='SES', sc='ses_telsiz', t='[calm] Moss, benim. Burada her şey yolunda.', gap=0.5, etiket=ET_T, col='o'),
    # That's your voice.
    dict(id='L22', v='N', sc='yuz_sok', t=f'{T} Bu senin sesin.', gap=0.4, hl={'senin': 'r', 'sesin.': 'r'}),
    # Listen, don't come after the seventh night. I've decided to stay another week.
    dict(id='L23', v='SES', sc='ses_telsiz2', strict=True, t='[calm] Dinle, yedinci geceden sonra gelme.', gap=0.25, etiket=ET_T, col='o'),
    dict(id='L24', v='SES', sc='ses_telsiz2', t='[calm] Bir hafta daha kalmaya karar verdim.', gap=0.5, etiket=ET_T, col='o'),
    # Another week? Kid, you sure you're all right out there?
    dict(id='L25', v='MOSS', sc='ses_telsiz2', t='[surprised] [gruff] Bir hafta daha mı?', gap=0.3, etiket=ET_T, col='o'),
    dict(id='L26', v='MOSS', sc='ses_telsiz2', t='[gruff] [worried] Evlat, orada iyi olduğuna emin misin?', gap=0.6, etiket=ET_T, col='o'),
    # If that was Moss, nobody is coming for you.
    dict(id='L27', v='N', sc='yuz_sok2', t=f"{T} Eğer o Moss'tuysa... seni almaya kimse gelmiyor.", slot=('kural2', 2.4),
         hl={'kimse': 'r', 'gelmiyor.': 'r'}),
    # Do you warn Moss now?
    dict(id='L28', v='N', sc='secim', t=f"{N} Moss'u şimdi uyarıyor musun?", gap=0.0,
         hl={'şimdi': 'y', 'uyarıyor': 'y', 'musun?': 'y'}),
]

TAIL = 5.0
LEAD = 0.2
GAP = 0.15
SLOTS = {
    'vurus': [('kapi_vurus', 0.15)],
    'disari': [('adim_tas', 1.1)],
    'kagit': [('kagit', 0.5)],
    'kural2': [('vurus', 0.05)],
}

KURALLAR_BASLIK = 'Bekçinin kuralları'
KURALLAR = [
    'Işık alacakaranlıktan şafağa kadar yanmalı. Her zaman.',
    "Gece 3'ten sonra telsize asla cevap verme.",
    'Geceleri adaya kimse gelmez. Kimse.',
    'Lambaya kadar 99 basamak. 100 sayarsan aşağı in.',
    'Dışarıdaki kimseyi asla içeri alma.',
]
GUNLUK = [
    ('2024', ['29 Eylül.', 'Işığın içinden geçemez.', 'Işığın sönmesi ya da', 'kapının açılması lazım.', 'İkisini de deneyecek.']),
]
