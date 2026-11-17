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

- **Video:** `cikti/gece1.mp4` (1080×1920, 30 fps, 1:40)
- **Kapak:** `cikti/kapak.png` ("GECE 1 · SAAT 3 ÇAĞRISI")
- **Sesler:** anlatıcı (Orhan), kayıkçı Moss (Aykut), telsizdeki kaptan (Emre, telsiz filtresiyle)

**Paylaşım açıklaması:**

```
Gece 1/7 · Greywick Feneri 🌊
Çağrı saat 03:00'te başladı. Cevap veriyor musun?
👇 Yorumlara CEVAP VER ya da SESSİZ KAL yaz. Çoğunluk kazanır.

#korku #gerilim #korkuhikayesi #gizem #denizfeneri #hikaye #reels #keşfet
```

### Metin (birebir çeviri)

> Kimsenin istemediği bir işi aldın.
> **MOSS:** Yedi gece! Sabah gelirim, evlat! Gece asla!
> Son bekçi Harlan, bu ışığı otuz yıl boyunca yaktı.
> Bir ay önce... ortadan kayboldu.
> Kuralları hâlâ duvarda asılıydı.
> Birinci kural: Işık, alacakaranlıktan şafağa kadar yanmalı. Her zaman.
> İkinci kural: Gece üçten sonra telsize asla cevap verme.
> Üçüncü kural: Geceleri adaya kimse gelmez. Kimse.
> Dördüncü kural: Lambaya doksan dokuz basamak var. Yüz sayarsan... aşağı in.
> Beşinci kuralın üstü karalanmıştı. Sertçe.
> Doksan dokuz basamak. Say onları. Harlan hep sayardı.
> Alacakaranlık. Işık yandı.
> Bunu deftere yazıyorsun. Harlan'ın yaptığı gibi. Her gece.
> Saat üç.
> **TELSİZ:** Mayday. Mayday. Balıkçı teknesi Marigold. Motorumuz durdu. Işığınızı göremiyoruz.
> Işık yanıyor... ve dışarıda hiçbir tekne yok.
> **TELSİZ:** Bekçi? Lütfen cevap ver. Teknede çocuklar var!
> Çağrı saat üçte başladı. Cevap veriyor musun?
>
> **[ CEVAP VER | SESSİZ KAL ]** · Seçimini yorumlara yaz · Çoğunluk sonrakini belirler

**Ekran yazıları:** GECE 1 / 7 · 18:42 / 02:59 / 03:00 / 03:01 · GREYWICK KAYASI · DENİZ FENERİ · IŞIK: AÇIK · KURTARILAN GEMİ: 0 ·
BASAMAK 92…99 · TELSİZ · KANAL 16 · "Gece 1. Sakin. / Işık 18:42'de yandı." · KURAL 2 kartı

## Üretim

```bash
python3 tuhaf/araclar/ses_yap.py      # sesler + motor/timeline.json (STT ile doğrulamalı, gülme kontrollü)
python3 tuhaf/araclar/efekt_yap.py    # efektler
cd tuhaf/motor && node render.js video ../cikti/_sessiz.mp4 4 && node render.js marka ../cikti
cd ../.. && python3 tuhaf/araclar/miks.py tuhaf/cikti/_sessiz.mp4 tuhaf/cikti/gece1.mp4
```
