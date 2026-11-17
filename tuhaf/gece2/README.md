# Tuhaf Saat Hikâyeleri · Fener · Gece 2/7

- **Video:** `cikti/gece2.mp4` (1080×1920, 30 fps, 1:15)
- **Kapak:** `cikti/kapak.png` ("GECE 2 · HARLAN'IN KASKETİ")
- **Sesler:** anlatıcı (Orhan), telsizdeki kadın (Nuray), Moss (Aykut, telsiz filtresiyle), kapıdaki yaşlı adam (Cihan)
- **Görünüm:** 1. bölümle aynı çizim; daha sıcak ışık (yumuşak turuncu ton + hafif parıltı), karaoke altyazı, Reels güvenli alanı
- **Kontrol:** son ses iki ayrı yazıya dökme denemesinde metinle aynı

**Paylaşım açıklaması:**

```
Fener Bekçisi · Gece 2/7 🌊

Sessiz kalmayı seçtin. Telsiz yine de kendi kendine açıldı.
Gece 01:30. Biri kapıyı çalıyor.
Kapıdaki yaşlı adam Harlan'ın kasketini takıyor.
Ama kural açık: Geceleri adaya kimse gelmez.

Kapıyı açıyor musun?
👇 Yorumlara yaz: AÇ ya da KİLİTLİ KALSIN
Çoğunluk ne derse 3. gece o olacak.

1. geceyi kaçırdıysan profilde 🔦

#korku #korkuhikayesi #gerilim #fenerbekçisi #etkileşimlihikaye
```

## Metin (orijinal → birebir Türkçe)

| Orijinal | Türkçe |
|---|---|
| You chose to stay silent. | Sessiz kalmayı seçtin. |
| At five past three, the radio switched on by itself. | Üçü beş geçe, telsiz kendi kendine açıldı. |
| RADIO: ...I know you can hear me. | TELSİZ: Beni duyduğunu biliyorum. |
| Then nothing. | Sonra... hiçbir şey. |
| At ten past four, a cargo ship passed the rocks, safely. | Dördü on geçe, bir yük gemisi kayaların yanından geçti. Sağ salim. |
| At noon, the radio is safe. | Öğle vakti telsiz güvenli. |
| You asked Moss about the Marigold. | Moss'a Marigold'u sordun. |
| MOSS: Marigold? Lost her engine in a storm. Drifted onto the rocks. | MOSS: Marigold mu? Fırtınada motoru bozuldu. Sürüklenip kayalara çarptı. |
| MOSS: All hands, twelve years ago. | MOSS: Kimse kurtulamadı. On iki yıl önce. |
| MOSS: Stick to Harlan's rules, kid. | MOSS: Harlan'ın kurallarına uy, evlat. |
| Harlan's journal. Thirty years of quiet. Then, the last page. | Harlan'ın günlüğü. Otuz yıl boyunca hep sakin. Sonra... son sayfa. |
| She calls every night now. She knows things only she would know. | O kadın artık her gece arıyor. Sadece onun bilebileceği şeyleri biliyor. |
| Rule five is wrong. Tonight, I'll let her in. | Beşinci kural yanlış. Bu gece onu içeri alacağım. |
| Dusk. The light is on. | Alacakaranlık. Işık yandı. |
| Night two, half past one. Someone knocks. | İkinci gece. Saat bir buçuk. Biri kapıyı çalıyor. |
| AT THE DOOR: Please, it's me. Let me in. I'm so cold. | KAPIDA: Lütfen... benim. Beni içeri al. Çok üşüyorum. |
| You know that cap. | O kasketi tanıyorsun. |
| AT THE DOOR: You wouldn't let an old man freeze, would you? | KAPIDA: Yaşlı bir adamı donmaya bırakmazsın... değil mi? |
| Do you open the door? | Kapıyı açıyor musun? |

**Ekran yazıları:** GECE 1/7 → GÜN 2 → GECE 2/7 · 03:01, 03:05, 04:10, 12:00, 18:41, 01:30 · IŞIK: AÇIK / KAPALI · GÜNDÜZ ·
KURTARILAN GEMİ: 0 → 1 · günlük sayfaları (1994, 2007, 2019, 2024) · KURAL 3 kartı ·
seçim: HARLAN'IN KASKETİNİ TAKIYOR. / KAPIYI AÇIYOR MUSUN? / AÇ · KİLİTLİ KALSIN / 3. GECEDE NE OLACAK? TAKİP ET

## Üretim

```bash
python3 tuhaf/gece2/araclar/ses_yap.py && python3 tuhaf/gece2/araclar/efekt_yap.py
cd tuhaf/gece2/motor && node render.js video ../cikti/_sessiz.mp4 4 && node render.js marka ../cikti
cd ../../.. && python3 tuhaf/gece2/araclar/miks.py tuhaf/gece2/cikti/_sessiz.mp4 tuhaf/gece2/cikti/gece2.mp4
```
