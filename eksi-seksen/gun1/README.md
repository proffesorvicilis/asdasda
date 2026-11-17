# Eksi Seksen · Gün 1/9 · "Soğuk Hava Dalgası"

- **Video:** `cikti/gun1.mp4` (1080×1920, 30 fps, 2:30)
- **Kapak:** `cikti/kapak.png` ("GÜN 1 · 0°C · EKSİ SEKSEN", buz tutmuş camın ardında Atakule ve Kocatepe)
- **Sesler:** Türkçede en çok kullanılan ElevenLabs sesleri, kararlı çok dilli modelle (multilingual v2), yapay hızlandırma olmadan:
  - **Anlatıcı:** Doga – Audiobook Master
  - **Haber spikeri:** Mert Aksoy (hafif televizyon filtresi)
  - **Aras:** Yunus – Soft and Natural (telefon ve görüntülü arama filtresi)
  - **Çınar:** Mert – Energetic, Natural and Friendly
- **Görünüm:**
  - Ayrıntılı çizimler: Çankaya'da çatı katı (yerden tavana cam, Ankara panoraması, Atakule ve Kocatepe), mermer adalı mutfak, Kuğulu Park (buz tutmuş havuz, kuğu evi), Tunalı'da kafe, Kızılay'da eczane, fırın ve banka, sarı taksi ve otobüs, Türkiye haritalı haber stüdyosu, dünyadan canlı yayınlar, ayrıntılı çiftlik, giriş holü ve akşam sofrası (mercimek çorbası, ince belli çay bardakları).
  - Gündüz soğuk mavi, akşam sıcak turuncu.
  - Karaoke altyazı (en fazla 3 kelime), Reels güvenli alanı.

**Paylaşım açıklaması:**

```
Eksi Seksen · Gün 1/9 ❄️

Çankaya'da bir çatı katı. Kurduğun şirketi milyonlarca dolara sattın.
Bir sabah Ankara'da hava on derece düştü.
Haberler "soğuk hava dalgası" diyor.
Ama gökyüzü açıkken güneş panelleri yarı yarıya üretiyor.
Güneş kısılıyor. Ve henüz kimse bilmiyor.

Susuyor musun, uyarıyor musun?
👇 Yorumlara yaz: SESSİZ KAL ya da HERKESİ UYAR
Çoğunluk ne derse 2. gün o olacak.

#hayattakalma #kıyamet #gerilim #etkileşimlihikaye #eksiseksen
```

## Sahne akışı

| Saat | Sahne |
|---|---|
| 07.40 | Çatı katı yatak odası: alarm, Ankara panoraması, şirketi milyonlarca dolara satmışsın; telefonda 0° (dün +10°) |
| 07.50 | Mutfak, kahve, televizyonda "soğuk hava dalgası" |
| 09.00 | Kuğulu Park: buz tutmuş havuz, boş kuğu evi, kuşsuz ağaçlar, soluk güneş |
| 12.00 | Tunalı'da kafe: hava durumu uygulamasında −10, −20, −30; masadakiler gülüyor |
| 13.00 | Kızılay: eczane tabelası 13.00 / 0°C, fırın, banka, taksi, otobüs |
| 13.05 | Dünyadan canlı yayınlar: Paris, Tokyo, New York; haber bandı |
| 14.30 | Aras'la telefon (bölünmüş ekran): paneller yarı yarıya üretiyor |
| 14.31 | Çiftlik ve kurucuların fotoğrafı (Filiz, 2021) |
| 15.00 | Çınar'la telefon |
| 19.00 | Çınar kapıda: poşetler ve düdüklü tencere |
| 19.40 | Mutfakta mercimek çorbası, tablette Aras |
| 21.00 | Akşam haberleri, ardından güneş ışınımı grafiği (%52 ↓) |
| 21.10 | Sofra, hesap defteri, Aras: "Bu bir hava olayı değil kanka." |
| 21.20 | Televizyonda "soğukta sıcak çorba tarifleri" |
| 21.25 | Çınar ve sen yakın plan; seçim ekranı |

**Seçim ekranı:**

- Üstte: GÜN 1 · KARAR ANI
- Kırmızı satır: HENÜZ KİMSE BİLMİYOR.
- Soru: SUSUYOR MUSUN, UYARIYOR MUSUN?
- Butonlar: [SESSİZ KAL] [HERKESİ UYAR]
- Altında: SESSİZ KAL: RAFLAR DOLU, KİMSE PANİK YAPMIYOR / UYAR: BİRKAÇ KİŞİ KURTULUR, PANİĞİ SEN BAŞLATIRSIN
- En altta: SEÇİMİNİ YORUMLARA YAZ / 2. GÜN: EKSİ ON. TAKİP ET

## Üretim

```bash
python3 eksi-seksen/gun1/araclar/ses_yap.py && python3 eksi-seksen/gun1/araclar/efekt_yap.py
cd eksi-seksen/gun1/motor && node render.js video "$PWD/../cikti/_sessiz.mp4" 4 && node render.js marka ../cikti
cd ../../.. && python3 eksi-seksen/gun1/araclar/miks.py eksi-seksen/gun1/cikti/_sessiz.mp4 eksi-seksen/gun1/cikti/gun1.mp4
```
