# Tuhaf Saat Hikâyeleri · Fener · Gece 3/7

- **Video:** `cikti/gece3.mp4` (1080×1920, 30 fps, 1:20)
- **Kapak:** `cikti/kapak.png` ("GECE 3 · SENİN SESİN")
- **Sesler:** anlatıcı (Orhan), Moss (Aykut, telsiz filtresiyle), telsizdeki "senin sesin" (genç erkek sesi, telsiz filtresiyle)
- **Görünüm:** Gece 2 ile aynı çizim ve sıcak ışık, karaoke altyazı, Reels güvenli alanı
- **Yeni sahneler:** camın dışındaki el izleri, Harlan'ın 29 Eylül günlüğü, kâğıdı lambaya tutunca okunan 5. kural, kendi sesinle konuşan telsiz

**Paylaşım açıklaması:**

```
Fener Bekçisi · Gece 3/7 🌊

Saat 03:20. Telsiz kendi kendine açıldı.
Moss'la senin sesinle konuşan bir şey var.
Ama kural açık: Gece üçten sonra telsize asla cevap verme.

Moss'u şimdi uyarıyor musun?
👇 Yorumlara yaz: ŞİMDİ KONUŞ ya da ÖĞLENİ BEKLE
Çoğunluk ne derse 4. gece o olacak.

#korku #korkuhikayesi #gerilim #fenerbekçisi #etkileşimlihikaye
```

## Metin (orijinal → birebir Türkçe)

| Orijinal | Türkçe |
|---|---|
| You chose to keep it locked. | Kapıyı kilitli tutmayı seçtin. |
| It knocked a while longer. Then it was gone. | Kapıyı bir süre daha çaldı. Sonra gitti. |
| In the morning, handprints on the outside of the glass. | Sabah, camın dışında el izleri vardı. |
| At noon, you told Moss about the visitor. | Öğlen, Moss'a ziyaretçiyi anlattın. |
| MOSS: Harlan's cap? | MOSS: Harlan'ın kasketi mi? |
| MOSS: Stay inside, kid. | MOSS: İçeride kal, evlat. |
| MOSS: After the seventh night, I'm there at first light. | MOSS: Yedinci geceden sonra, sabahın ilk ışığıyla oradayım. |
| Harlan's journal. | Harlan'ın günlüğü. |
| It can't cross the beam. It needs the light out or the door open. It will try both. | Işığın içinden geçemez. Işığın sönmesi ya da kapının açılması lazım. İkisini de deneyecek. |
| Ninety-nine steps. Good. | Doksan dokuz basamak. Güzel. |
| Dusk. The light is on. | Alacakaranlık. Işık yandı. |
| Ten to midnight. You couldn't sleep. | Gece yarısına on var. Uyuyamadın. |
| (5. kural, karalamanın altında) Never let anyone out there in. | Dışarıdaki kimseyi asla içeri alma. |
| Harlan knew. | Harlan biliyordu. |
| At twenty past three, the radio switched on by itself. | Üçü yirmi geçe, telsiz kendi kendine açıldı. |
| RADIO: Moss, it's me. Everything's fine out here. | TELSİZ: Moss, benim. Burada her şey yolunda. |
| That's your voice. | Bu senin sesin. |
| RADIO: Listen, don't come after the seventh night. I've decided to stay another week. | TELSİZ: Dinle, yedinci geceden sonra gelme. Bir hafta daha kalmaya karar verdim. |
| RADIO (Moss): Another week? Kid, you sure you're all right out there? | TELSİZ (Moss): Bir hafta daha mı? Evlat, orada iyi olduğuna emin misin? |
| If that was Moss, nobody is coming for you. | Eğer o Moss'tuysa... seni almaya kimse gelmiyor. |
| (kart) RULE 2 · Never answer the radio after 3 AM. | KURAL 2 · Gece üçten sonra telsize asla cevap verme. |
| Do you warn Moss now? | Moss'u şimdi uyarıyor musun? |

**Seçim ekranı:** 03:20. SENİN SESİNİ KULLANIYOR. / MOSS'U ŞİMDİ UYARIYOR MUSUN? / ŞİMDİ KONUŞ · ÖĞLENİ BEKLE / ÇOĞUNLUK 4. GECEDE NE OLACAĞINI BELİRLER / SEÇİMİNİ YORUMLARA YAZ / 4. GECEDE NE OLACAK? TAKİP ET

**Ekran yazıları:** GECE 2/7 01:30 → 01:34 · GÜN 3 07:10 ve 12:00 · IŞIK: KAPALI · GÜNDÜZ · GECE 3/7 18:40, 23:50, 03:20 · KURTARILAN GEMİ: 1 · BASAMAK sayacı · günlük: "H. HARLAN · BEKÇİ GÜNLÜĞÜ · 2024 · 29 Eylül."

## Üretim

```bash
python3 tuhaf/gece3/araclar/ses_yap.py
cd tuhaf/gece3/motor && node render.js video ../cikti/_sessiz.mp4 4 && node render.js marka ../cikti
cd ../../.. && python3 tuhaf/gece3/araclar/miks.py tuhaf/gece3/cikti/_sessiz.mp4 tuhaf/gece3/cikti/gece3.mp4
```
