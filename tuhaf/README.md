# Tuhaf Saat Hikâyeleri — Türkçe hesap (oddhourtales)

Referans videonun birebir Türkçe çevirisi; görseller kendi çizim motorumuzla, referansa benzer şekilde yeniden çizildi.

## Hesap

| Alan | Değer |
|---|---|
| Görünen ad | **Tuhaf Saat Hikâyeleri** |
| Kullanıcı adı önerileri | `@tuhafsaathikayeleri` · `@tuhafsaat.tr` · `@tuhafsaathikaye` |
| Profil fotoğrafı | `cikti/pp.png` (mumlu, kapüşonlu anlatıcı) |

**Biyografi (birebir çeviri):**

```
Kararı SENİN verdiğin tuhaf hikâyeler.
Seçimini yorumlara yaz. Çoğunluk kazanır.
Şimdi: Son Gözcü
```

## Fener · Gece 1/7

- **Video:** `cikti/gece1.mp4` (1080×1920, 30 fps, 1:19)
- **Kapak:** `cikti/kapak.png` ("GECE 1 · FENER BEKÇİSİ")
- **Sesler:** anlatıcı (Orhan), kayıkçı Moss (Aykut), telsizdeki kaptan (Emre, telsiz filtresiyle)
- **Altyazı:** en fazla 3 kelime; o an söylenen kelime sarı (karaoke)
- **Güvenli alan:** üst 250 px, alt 420 px ve sağ ~140 px (beğen/yorum/paylaş sütunu) boş bırakıldı; her şey x 60–940, y 250–1500 arasında
- **Kontrol:** son ses iki ayrı yazıya dökme denemesinde kelimesi kelimesine doğru

**Paylaşım açıklaması:**

```
Fener Bekçisi · Gece 1/7 🌊

Gece 03:00. Telsizden bir imdat çağrısı geliyor.
Ama kural açık: Saat üçten sonra telsize asla cevap verme.

Cevap veriyor musun?
👇 Yorumlara yaz: CEVAP VER ya da SESSİZ KAL
Çoğunluk ne derse 2. gece o olacak.

#korku #korkuhikayesi #gerilim #fenerbekçisi #etkileşimlihikaye
```

### Metin (orijinal → birebir Türkçe)

| Orijinal | Türkçe |
|---|---|
| You took a job no one else wanted. | Kimsenin istemediği işi sen aldın. |
| MOSS: Seven nights! I'll be back in the morning, kid! Never at night! | MOSS: Yedi gece! Sabah dönerim, evlat! Gece asla gelmem! |
| The last keeper, Harlan, kept this light for thirty years. | Önceki bekçi Harlan, bu ışığı otuz yıl boyunca yaktı. |
| A month ago, he vanished. | Bir ay önce... ortadan kayboldu. |
| His rules were still pinned to the wall. | Kuralları hâlâ duvarda asılıydı. |
| Rule one: the light must burn from dusk to dawn, always. | Birinci kural: Işık, alacakaranlıktan şafağa kadar yanmalı. Her zaman. |
| Rule two: never answer the radio after three AM. | İkinci kural: Gece üçten sonra telsize asla cevap verme. |
| Rule three: nobody comes to the island at night. Nobody. | Üçüncü kural: Geceleri adaya kimse gelmez. Kimse. |
| Rule four: there are ninety-nine steps to the lamp. If you count a hundred, go back down. | Dördüncü kural: Lambaya kadar doksan dokuz basamak var. Yüz sayarsan... aşağı in. |
| Rule five was scratched out, hard. | Beşinci kural karalanmıştı. Bastıra bastıra. |
| Ninety-nine steps. Count them. Harlan always did. | Doksan dokuz basamak. Say onları. Harlan hep sayardı. |
| Dusk. The light is on. | Alacakaranlık. Işık yandı. |
| You write it down, like Harlan did, every night. | Bunu deftere yazıyorsun, Harlan'ın yaptığı gibi. Her gece. |
| Three o'clock. | Saat üç. |
| RADIO: Mayday. Mayday. Fishing vessel Marigold. We've lost our engine. We can't see your light. | TELSİZ: Mayday. Mayday. Balıkçı teknesi Marigold. Motorumuz durdu. Işığınızı göremiyoruz. |
| The light is on, and there is no boat out there. | Işık yanıyor... ve dışarıda hiçbir tekne yok. |
| RADIO: Keeper, please answer. We have children on board. | TELSİZ: Bekçi? Lütfen cevap ver. Teknede çocuklar var! |
| The call started at three o'clock. Do you answer? | Çağrı saat üçte başladı. Cevap veriyor musun? |

**Seçim bölümü:** GECE 1/7 · KARAR ANI şeridi, ikonlu **CEVAP VER / SESSİZ KAL** kartı, yorum düğmesini gösteren "SEÇİMİNİ YORUMLARA YAZ" oku; arka planda telsizden yankılanan "Bekçi?".

## Üretim

```bash
python3 tuhaf/araclar/ses_yap.py      # sesler + motor/timeline.json (STT ile doğrulamalı, gülme kontrollü)
python3 tuhaf/araclar/efekt_yap.py    # efektler
cd tuhaf/motor && node render.js video ../cikti/_sessiz.mp4 4 && node render.js marka ../cikti
cd ../.. && python3 tuhaf/araclar/miks.py tuhaf/cikti/_sessiz.mp4 tuhaf/cikti/gece1.mp4
```
