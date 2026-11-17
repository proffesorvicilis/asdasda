# Gece Nöbeti — Instagram hesabı

Kararı izleyicinin verdiği, gece geçen karanlık hikâyeler. Her bölümün sonunda bir seçim var; izleyici yorumlara yazar, çoğunluğun seçimi bir sonraki bölümü belirler.

## Hesap

| Alan | Değer |
|---|---|
| Görünen ad | **Gece Nöbeti** |
| Kullanıcı adı önerileri | `@gecenobeti` · `@gece.nobeti` · `@gecenobeti.tr` |
| Profil fotoğrafı | `cikti/pp.png` (elinde fener tutan bekçi, arkada deniz feneri) |

**Biyografi:**

```
Kararı senin verdiğin karanlık hikâyeler.
Seçimini yorumlara yaz, çoğunluk kazanır.
Şimdi: Kuzgun Adası Feneri 🌊
```

## Bölüm 1 — Kuzgun Adası Feneri · Gece 1/7

- **Video:** `cikti/bolum1.mp4` (1080×1920, 30 fps, 1:47, ses -14 LUFS)
- **Kapak:** `cikti/kapak.png`

**Paylaşım açıklaması:**

```
Gece 1/7 · Kuzgun Adası Feneri 🌊
Üçüncü cevap geldi. Feneri söndürüyor musun?
👇 Yorumlara SÖNDÜR ya da YANIK TUT yaz. Çoğunluk 2. geceyi belirler.

#korku #gerilim #korkuhikayesi #gizem #denizfeneri #hikaye #seçimsenin #reels #keşfet
```

### Anlatım metni

> Seni adaya bırakan balıkçı, iskeleye yanaşmadı bile.
> Erzakını kayalara attı. Arkasına bakmadan gitti.
> Kuzgun Adası. Yedi gece. Bir fener, bir de sen.
>
> Bu feneri kırk bir yıl boyunca Rıza Usta yaktı.
> Geçen ay bir sabah, onu iskelede buldular.
> Sadece sayıyordu. *(fısıltı)* Bir... iki... üç...
> O sabah, fener sönüktü.
>
> Kuralları hâlâ duvarda asılı.
> Birinci kural: Fener gün batımında yanar. Arada asla sönmez.
> İkinci kural: Sis gelirse, düdüğü beş dakikada bir çal.
> Üçüncü kural: Denizden bir düdük cevap verirse... say.
> Dördüncü kural: Üçüncü cevapta feneri söndür. Sabaha kadar yakma.
> Beşinci kural, başka bir mürekkeple yazılmış.
> *(fısıltı)* Ben gelip kapıyı çalarsam... açma.
>
> Gün batıyor. Feneri yakıyorsun.
> Gece ikiye doğru, sis geliyor.
> Düdüğü çalıyorsun. *(sis düdüğü)* *(uzaktan cevap)*
> Denizden, bir düdük cevap veriyor. Bir.
> Beş dakika sonra, yine çalıyorsun. *(düdük)* *(daha yakından cevap)*
> İki. Bu sefer daha yakından.
> Bu bir yankı değil. Yankı beklemez.
> Üçüncü kez çalıyorsun. *(düdük)* *(uzun sessizlik)* *(çok yakından cevap)*
> Üç.
>
> Dördüncü kural: Feneri söndür.
> Ama sisin içinde ışıklar var. Bir tekne, kayalara doğru geliyor.
> Fener sönerse, kayaları göremezler.
> Üçüncü cevap geldi. Feneri söndürüyor musun?
>
> **[ SÖNDÜR | YANIK TUT ]** · Seçimini yorumlara yaz · Çoğunluk 2. geceyi belirler

**Duvardaki kâğıt (el yazısı):** *Bekçinin kuralları*
1. Fener gün batımında yanar, gün doğumunda söner. Arada asla sönmez.
2. Sis gelirse düdüğü beş dakikada bir çal.
3. Denizden bir düdük cevap verirse, say.
4. Üçüncü cevapta feneri söndür. Sabaha kadar yakma.
5. *(başka mürekkeple)* Ben gelip kapıyı çalarsam, açma. — R.

Birinci ve dördüncü kural birbirini tutmuyor: 1. kural "asla sönmez" diyor, 4. kural "söndür". Seçimin özü bu çelişki.

### Sonraki geceler için açık uçlar
- **Rıza Usta neden sayıyordu, fener neden sönüktü?** Söndürüp kurtuldu mu, söndürmediği için mi böyle oldu?
- **5. kural:** "Ben gelip kapıyı çalarsam, açma." Rıza Usta artık karada. Kapıyı çalan kim olacak?
- **Sisten çıkan ışıksız gemi pruvası** ve sonra gelen ışıklı tekne aynı mı?

## Üretim

Görüntüler Higgsfield olmadan, kodla çizildi (Chromium Canvas). Ses ElevenLabs.

```bash
python3 fener/araclar/ses_yap.py      # anlatım + zaman çizelgesi (motor/timeline.json)
python3 fener/araclar/efekt_yap.py    # efektler (ses/efekt/)
cd fener/motor && node render.js video ../cikti/_sessiz.mp4 4   # kareler → sessiz video
node render.js marka ../cikti                                   # pp.png + kapak.png
cd ../.. && python3 fener/araclar/miks.py fener/cikti/_sessiz.mp4 fener/cikti/bolum1.mp4
```

- `araclar/senaryo.py`: satırlar, tag'ler, boşluklar, efekt yuvaları, kurallar
- `motor/sahneler.js`: 20 sahne; `motor/art.js`, `motor/karakter.js`: çizim parçaları
- `motor/ust.js`: altyazı, gösterge, kartlar; `motor/marka.js`: profil ve kapak
