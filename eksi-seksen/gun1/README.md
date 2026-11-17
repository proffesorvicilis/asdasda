# Eksi Seksen · Gün 1/9 · "Soğuk Hava Dalgası"

- **Video:** `cikti/gun1.mp4` (1080×1920, 30 fps, ~2:23)
- **Kapak:** `cikti/kapak.png` ("GÜN 1 · 0°C · EKSİ SEKSEN")
- **Sesler:** anlatıcı (Orhan), haber spikeri (televizyon filtresi), Aras (telefon ve görüntülü arama filtresi), Çınar
- **Görünüm:** Fener'le aynı çizim dili. Gündüz sahneleri soğuk mavi, akşam sahneleri sıcak turuncu. Karaoke altyazı (en fazla 3 kelime), Reels güvenli alanı. Üstte GÜN 1/9, saat, sıcaklık ve yer.

**Paylaşım açıklaması:**

```
Eksi Seksen · Gün 1/9 ❄️

Ankara'da hava bir gecede on derece düştü.
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
| 07.40 | Yatak odası, alarm, buz tutmuş cam, telefonda 0° (dün +10°) |
| 07.50 | Mutfak, kahve, televizyonda "soğuk hava dalgası" |
| 09.00 | Park: buz tutmuş havuz, kuşsuz ağaçlar, soluk güneş |
| 12.00 | Kafe: hava durumu uygulamasında −10, −20, −30; masadakiler gülüyor |
| 13.00 | Eczane tabelası: 13.00 / 0°C |
| 13.05 | Haber bandı ve dünya küresi: her yerde aynı anda soğuma |
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
