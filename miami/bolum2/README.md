# Miami · Bölüm 2 · "Kapağı seçtin, sonra kapak açılmadı"

İngilizce videonun ("POV - Part 2 - you chose the hatch, then the lid wouldn't open") birebir Türkçe çevirisi. Görüntü aynı sahne sırası ve kamera düzeniyle, bu motorda yeniden çizildi.

- **Video:** `cikti/miami_bolum2.mp4` (1080×1920, 30 fps, 0:44; ses −13,6 LUFS)
- **Kapak:** `cikti/kapak.png` ("KAPAĞI SEÇTİN / KAPAK AÇILMADI")
- **Orijinalle fark:** Orijinal 42,4 sn. Bu sürümde seçim ekranı Türkçe metni okunabilsin diye biraz uzun (son 2,7 sn).

## Çeviri (orijinal → Türkçe)

| Zaman | Konuşan (altyazı rengi) | Orijinal | Türkçe |
|---|---|---|---|
| 0.3 | Alex (sarı) | Grab my hand! | Elimi tut! |
| 2.9 | Sam (beyaz) | Pull it shut. | Çek, kapat! |
| 8.5 | Sam | Is it holding?! | Dayanıyor mu?! |
| 9.6 | Alex | It's holding! | Dayanıyor! |
| 12.0 | Alex | Ah! | Ah! (altyazısız çığlık) |
| 12.9 | Sam | It's coming in! | İçeri giriyor! |
| 14.6 | Sam | It won't open! | Açılmıyor! |
| 15.9 | Alex | The boat's on it! | Üstünde tekne var! |
| 17.3 | Alex | Push! | İt şunu! |
| 27.3 | Sam | Alex?! | Alex?! |
| 27.9 | Alex | Sam! Here! | Sam! Burada! |
| 29.4 | Sam (nane yeşili) | Another one's coming! | Bir tane daha geliyor! |
| 31.5 | Pilot (mor) | One pass! | Tek geçiş! |
| 32.6 | Pilot | Grab the ladder! | Merdiveni tut! |
| 34.6 | Alex | I'm slipping! | Kayıyorum! |
| 36.0 | Sam | Hey! Over here! | Hey! Buraya! |
| 37.6 | Pilot | Now! Both hands! | Şimdi! İki elinle! |
| 39.1 | Alex | Just go! | Hadi GİT! |
| 39.8 | Tekneci (beyaz) | Swim to the boat! | Tekneye yüz! |

Ekrandaki yazılar: "MARLIN BEACH · 6:42 PM / Miami · Part 2" → "MARLIN PLAJI · 18:42 / Miami · Bölüm 2"; "YOU CHOSE THE HATCH" → "SEN SEÇTİN / KAPAĞI"; "STORM VAULT / LIFEGUARD USE" → "FIRTINA SIĞINAĞI / CAN KURTARAN KULLANIMI"; "PART 3 · YOU DECIDE / WHAT WOULD YOU DO? / BOAT OR HELICOPTER / Comment below" → "BÖLÜM 3 · SEN KARAR VER / SEN NE YAPARDIN? / TEKNE VEYA HELİKOPTER / Aşağıya yorum yaz". Bina adları (Mango Bar, Luna Hotel, Pelican Surf) aynı kaldı.

## Sesler

ElevenLabs `eleven_v3` (duygu etiketli: bağırma, panik, nefes nefese). Her satırdan 3 geçerli kayıt üretilip en güçlüsü seçildi; satır içi uzun duraklamalar kısaltıldı, planlanandan uzun satırlar hafifçe hızlandırıldı. Her satır orijinaldeki saniyeye sabitlendi.

| Karakter | Ses |
|---|---|
| Alex | Mark – Cartoonish, Funny and Cheerful |
| Sam (sen) | Fatih Yıldırım – young energetic |
| Pilot | Cem – Heroic, Intense and Crisp (hoparlör filtresi) |
| Tekneci | Cavit – Energetic and Fast-Paced |

**Doğrulama:** Son sesin tamamı iki kez yazıya döktürüldü; kelimelerin hepsi senaryoyla eşleşti (yalnızca bağırma uzatması: "tuuut", "aaa"). Yazıya döküm ses efektlerini de doğru tanıdı ("kapı kapanma sesi", "baloncuk sesleri").

**Efektler (ElevenLabs sound-generation):** yaklaşan dalga, kapak çarpması, çark çevirme, dalga çarpması, sığınak içi uğultu, su sızması, tekne darbesi, alarm, su altı, nefes ve öksürük, şehir ve su, ufukta dalga, helikopter, merdiven, seçim sesleri. Ortam sesleri konuşma sırasında kısılır.

## Görüntü

- Karakterler ve ortamlar canvas'ta çizildi; kamera geniş açı (balık gözü) efektiyle WebGL üzerinden bükülür. Birinci şahıs kollar efektin dışında kalır, köşelerde büyük görünür.
- 22 sahne: plaj ve sığınak, kapağı çekme, çark ve lomboz, sığınağın içi (Alex, tavan, su sızıntısı, lomboz, itme), su altı (3), sular altındaki Miami (yüzey, salın yanında, ufukta dalga, salda), helikopter (4), tekne ve seçim ekranı.
- Altyazı konuşmacı renkli, en fazla 3 kelime, aktif kelime parlar. Açılış göstergesi ve altyazı Reels güvenli alanında.

## Paylaşım açıklaması

```
POV · Bölüm 2 🌊

Kapağı seçtin. Ama kapak açılmadı.
Üstünde bir tekne var, içeri su doluyor.

Şimdi karar zamanı:
Tekneye mi yüzersin, helikoptere mi tutunursun?
👇 Yorumlara yaz: TEKNE ya da HELİKOPTER
Çoğunluk ne derse 3. bölümde o olacak.

#pov #povstory #miami #hayattakalma #etkileşimlihikaye
```

## Üretim

```bash
python3 miami/bolum2/araclar/ses_yap.py && python3 miami/bolum2/araclar/efekt_yap.py
cd miami/bolum2/motor && node render.js video "$PWD/../cikti/_sessiz.mp4" 4 && node render.js marka ../cikti
cd ../../.. && python3 miami/bolum2/araclar/miks.py miami/bolum2/cikti/_sessiz.mp4 miami/bolum2/cikti/miami_bolum2.mp4
```
