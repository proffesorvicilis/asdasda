# Profesör: Düşüş — Ses Planı (ElevenLabs)

> Seslendirme metinleri `03-part-1-4-senaryo.md` dosyasında. Her ses seçimi ve her üretim bu plana göre yapılır.

---

## 1. Genel ayarlar

- **Model:** `eleven_v3`. Duygu etiketlerini (`[crying]`, `[whispers]` gibi) destekleyen ve Türkçe konuşabilen model bu.
- **Her replikte en az bir etiket olacak.** Etiket olmadan ses düz ve duygusuz çıkıyor. Etiketler duruma göre seçilecek, aşağıda her karakterin etiket paleti var.
- **Stability:**
  - Kız ve rehineler: Creative. Duygu daha geniş, ağlama ve titreme daha gerçek çıkıyor.
  - Profesör, Bora, Tuna, Ömer: Natural.
  - Hiçbir karakterde Robust kullanılmayacak, ses robotlaşıyor.
- **Çıktı:** `mp3_44100_128`.
- **Duraklama yok:** Her replikteki baştaki ve sondaki sessizlik kırpılacak. Replikler arasında en fazla 0,1–0,2 saniye boşluk olacak. Kesilen cümlelerde ("Benim adım—") ses, hat cızırtısıyla üst üste binecek.
- **Telefondaki sesler** (kız, rehineler) için üretimden sonra telefon filtresi uygulanacak (300–3400 Hz bant geçiren filtre, hafif sıkıştırma).
- **Dosya düzeni:** `hikaye/ses/part1/01_kiz.mp3` gibi tek tek replikler, ayrıca her part için birleştirilmiş `hikaye/ses/part1_tam.mp3`.
- **Her ton ayrı üretilir:** Aynı replikte iki farklı ton varsa (örneğin normal konuşup sonra fısıldamak) iki ayrı üretim yapılır ve birleştirilir.

---

## 2. Oyuncu seçimi

Sesler ElevenLabs Voice Library'den **ana dili Türkçe olan** seslerden seçilecek. Her karakter için aranan özellikler ve kaçınılacak şeyler aşağıda. Kütüphanede uygun ses yoksa Voice Design ile tarif üzerinden ses tasarlanacak.

### Profesör
- **Profil:** Erkek, 35–40 yaş. Orta-alçak tını, net diksiyon, İstanbul Türkçesi. Ekibe karşı soğuk, hızlı ve kısa. Kıza karşı yumuşayabilen, sıcaklaşabilen bir ses.
- **Aranacak:** Türkçe, erkek, orta yaş; "calm", "deep", "sophisticated", "narrative" etiketli sesler.
- **Kaçınılacak:** Reklam ya da radyo spikeri tonu, aşırı bas, yaşlı tını.
- **Etiket paleti:** `[calm]` `[cold]` `[firm]` `[focused]` `[thinking]` `[gentle]` `[softly]` `[warm]` `[whispers]` `[quiet]`

### Kız (7 yaş)
- **Profil:** Kız çocuk, 7 yaş. İnce, küçük, titrek bir ses. Korkmuş, ağlayan, burnunu çeken bir çocuk.
- **Aranacak:** Türkçe, "child", "young girl", "kid" tarifli sesler.
- **Not:** ElevenLabs'te gerçek çocuk sesleri sınırlı. Türkçe çocuk sesi yoksa Voice Design ile denenecek ("frightened seven-year-old Turkish girl, thin trembling voice"). O da mümkün değilse çok genç, ince ve küçük tınılı bir kadın sesi seçilecek. Sonuç kullanıcıya dinletilip onay alınacak.
- **Etiket paleti:** `[crying]` `[sobbing]` `[sniffles]` `[scared]` `[panicked]` `[small voice]` `[whispers]` `[screaming]` `[hesitant]`

### Bora
- **Profil:** Erkek, 38 yaş. Kalın, hafif boğuk, az konuşan bir asker sesi. Kuru, kara mizahlı.
- **Aranacak:** Türkçe, erkek, "gruff", "deep", "raspy" tarifli sesler.
- **Kaçınılacak:** Fazla yumuşak ya da genç tını.
- **Etiket paleti:** `[dry]` `[low]` `[grim]` `[gruff]` `[tense]` `[urgent]`

### Tuna
- **Profil:** Erkek, 27 yaş. Genç, hızlı konuşan, gergin, zeki.
- **Aranacak:** Türkçe, genç erkek, "young", "casual", "conversational" tarifli sesler.
- **Kaçınılacak:** Çocuksu ya da aşırı enerjik YouTuber tonu.
- **Etiket paleti:** `[tense]` `[fast]` `[nervous]` `[uneasy]` `[focused]` `[stunned]`

### Ömer
- **Profil:** Erkek, 54 yaş. Yorgun, ağırbaşlı, otoriter bir savcı sesi. Az ama ağır konuşuyor.
- **Aranacak:** Türkçe, olgun erkek, "mature", "authoritative", "serious" tarifli sesler.
- **Kaçınılacak:** Çok yaşlı ya da titrek tını.
- **Etiket paleti:** `[serious]` `[tired]` `[grave]` `[whispers]` `[shocked]` `[quiet]` `[suspicious]`

### Saadet (birinci rehine, sadece ses)
- **Profil:** Yaşlı kadın, 65 yaş. Kısık, ince, titrek bir ses. Ağlıyor. Mimar'ın sözlerini elindeki kâğıttan, sanki biri zorla okutuyormuş gibi kelime kelime, mekanik ve kesik kesik okuyor. Kendi sözlerinde panik, hıçkırık, bağırış.
- **Kaynak:** Kütüphanede yaşlı Türkçe kadın sesi yok. Ses Voice Design ile tasarlandı (yetişkin bir kadın tarifi, engellenmedi).
- **Etiket paleti:**
  - Mimar'ın sözleri: `[trembling]` `[crying softly]` `[forced calm]` `[reading]` `[shaky voice]`
  - Kendi sözleri: `[panicked]` `[sobbing]` `[shouting]` `[desperate]`

### Sonraki partlar için (şimdilik üretilmeyecek)
- **Dr. Ferit:** Erkek, 70 yaş, hırıltılı ve nefessiz.
- **Rauf Ergin:** Erkek, 66 yaş, ağırbaşlı bir yargıç sesi, çökmüş.
- **Müdire Nevin:** Kadın, 78 yaş, kibar ve soğuk.
- **Mimar'ın kendi sesi (Part 23):** Erkek, 40'larında. Kadife gibi yumuşak, alaycı, oyunbaz, kelimelerin tadını çıkararak konuşan, Moriarty tarzı bir ses.

---

## 3. Etiket kullanım kuralları

- Her replik bir duygu etiketiyle başlar. Gerekirse cümlenin ortasına ikinci bir etiket eklenir (örneğin `[sobbing] Bilmiyorum... [sniffles]`).
- Aynı karakterin aynı etiketi art arda kullanması engellenir. Duygu replikten repliğe değişmeli.
- Profesör'ün kıza ve ekibe karşı tonu ayrıdır: ekibe `[cold]` `[firm]`, kıza `[gentle]` `[warm]` `[softly]`.
- Rehineler Mimar'ın sözlerini okurken `[reading]` ya da `[forced calm]`, kendi sözlerinde `[panicked]` ya da `[sobbing]` kullanır. Bu zıtlık, izleyicinin sözlerin kime ait olduğunu anlamasını sağlar.
- "Tik tak, tik tak" gibi tekrarlar `[whispers]` ya da `[trembling]` ile okunur.

---

## 4. Seçilen sesler

| Karakter | Ses | Voice ID | Stability | Not |
|---|---|---|---|---|
| Kız | Gamze | `Hr3W7yWIljG9YBJn39oK` | Creative | Çizgi film karakteri sesi, en ince perde (medyan 381 Hz). Telefon filtresi uygulanıyor. |
| Profesör | Emin | `DsbR47WNEv8o9x37ib9X` | Natural | Keskin, karizmatik seslendirme sanatçısı (3. turdaki ilk aday) |
| Bora | Emre | `euBhqSy9BY3XHNLwxF7J` | Natural | Doğal bariton |
| Tuna | Agit Taşdemir | `qLctY6uJSzrtjp23kPzO` | Natural | Doğal, gerçekçi, nefesli |
| Ömer | Aykut Ertuğrul | `E38heb42yln7Ox5qE9i9` | Natural | Sakin, ifadeli |
| Saadet (rehine) | Tasarım 1 | `gXhtBWsl0fhuAbNHKhjA` | Creative | Voice Design ile tasarlandı. Mimar'ın sözlerini "kelime kelime" yöntemiyle okuyor. Telefon filtresi uygulanıyor. |

**Saadet'in okuma yöntemi (kelime kelime):** Mimar'ın sözleri `[crying] [reading slowly from a paper, word by word]` etiketleriyle, kelime öbeklerinin arasına "..." konarak ve araya `[sniffles]`, `[sobbing]`, `[gasps]` serpiştirilerek üretiliyor. Kendi sözleri (`Lütfen... torunlarım evde yalnız`, `O gece çayı o verdi!`) ayrı üretiliyor: `[sobbing] [desperate]` ya da `[desperate] [shouting]`.

**Kız sesi hakkında:** ElevenLabs Voice Design, 7 yaşında bir çocuk sesi tarifini güvenlik kuralları gereği engelledi. Kütüphanede de gerçek bir Türkçe çocuk sesi yok. Gamze, çocuksu tınıya en yakın ses.

## 5. Adaylar: 2. tur

İlk turdaki adayların hepsi (kız hariç) reddedildi. 2. turda spiker ve reklam sesleri elendi. Ağırlık tiyatro eğitimli, oyuncu ve karakter seslerine verildi. Denemeler `hikaye/ses/denemeler2/` klasöründe. **Her ton ayrı üretilip birleştirildi** (örneğin Profesör'ün soğuk ve yumuşak cümleleri iki ayrı üretim).

| Karakter | Aday | Voice ID | Not |
|---|---|---|---|
| Profesör | A · Levent | `AMjkpTkYyZF0aFQa3oLV` | Derin, sakin, gizemli. Tarifi "psikolojik gerilim için" |
| Profesör | B · Orhan | `y6X1mFgtBqHFtQwrOezf` | Otuzlarında, İstanbul aksanı, tiyatro eğitimli |
| Profesör | C · Toprak | `pa0LgEk5MjYFGCuG6I3V` | Otuzlarının sonu, sakin ama güçlü, sinematik |
| Bora | A · Arthur | `OMPrkDOvnYasPecb05Rb` | Bas, derin, oyun karakteri sesi |
| Bora | B · Metehan | `cPBqJ26VaZXIGAxXxtvc` | Derin, güçlü, komuta eden |
| Bora | C · Emre | `euBhqSy9BY3XHNLwxF7J` | Doğal bariton, sinema |
| Tuna | A · Agit Taşdemir | `qLctY6uJSzrtjp23kPzO` | Doğal, gerçekçi, nefesli |
| Tuna | B · Marcus | `UtI8LSMMDNx2i47tnKLQ` | Genç, doğal sohbet tonu |
| Tuna | C · Alper | `9q3uhh453wT9R7x3sW1i` | Genç, dinamik |
| Ömer | A · Nihat | `MuOq11XzQTthwLhmGZ2V` | Yaşlıca, kadife bariton, ağırlığı var |
| Ömer | B · Cihan | `Md4RAnfKt9kVIbvqUxly` | Doğal, sohbet tonu |
| Ömer | C · Aykut Ertuğrul | `E38heb42yln7Ox5qE9i9` | Sakin, ifade gücü yüksek |
| Saadet | A · Tasarım 1 | `gXhtBWsl0fhuAbNHKhjA` | Voice Design, yaşlı, ağlayarak zorla okuyor |
| Saadet | B · Tasarım 2 | `BY4osAwZyk2ZkhsD1tY2` | Voice Design, metni en temiz okuyan |
| Saadet | C · Tasarım 3 | `NFyBCbFHwfxCIVUHeKqe` | Voice Design |

**Reddedilenler (1. tur):** Mustafa Erkek, Celil, Akay, Umtu, Furkan, Selim Mercan, Mahmut Hoca, Şefik, Mimoza, Nuray, Tuana Öztürk, Gözde.

## 6. Üretim kuralları (denemelerden çıkanlar)

- **Her ton ayrı üretilir.** Fısıltı ile normal ses, soğuk ile yumuşak gibi farklı tonlar aynı üretimde birleştirilmez. Her parça ayrı üretilir, baştaki ve sondaki sessizlik kırpılır, sonra arka arkaya eklenir.
- **Metin doğrulaması:** Her üretilen parça konuşmayı yazıya çeviren servisle (Scribe) kontrol edilir. Creative ayarı bazen kelime ekleyip çıkarabiliyor (bir denemede "torunlarım evde yalnız" yerine "torunlarımı evde yalnız bırakma" dendi). Metin senaryodan farklıysa parça yeniden üretilir.

## 7. Durum

- [x] ElevenLabs anahtarı doğrulandı (Starter plan).
- [x] 1. tur denemeler üretildi. Sadece kız sesi (Gamze) seçildi.
- [x] 2. tur denemeler üretildi (her ton ayrı). Rehine sesi Voice Design ile tasarlandı.
- [x] Bütün sesler seçildi. Seçilmeyen tasarım sesleri hesaptan silindi.
- [x] Part 1–4 üretildi: `hikaye/ses/partN_tam.mp3` (birleşik), `hikaye/ses/partN/` (tek tek replikler), `hikaye/ses/partN_zamanlama.md` (her repliğin başlangıç ve bitiş saniyesi).

## 8. Üretim notları (Part 1–4)

- Her parça yazıya çevrilip senaryoyla karşılaştırıldı. Uymayan parçalar otomatik olarak yeniden üretildi. Yakalanan hatalar: "Yedi" yerine "Yeter", "Duyuyorum" yerine "Duyuyor o", "Yani" yerine "Eee, yani", "Ada büyük" yerine "Adı büyük", "Telefonu bırak" yerine uydurulmuş İngilizce kelimeler.
- Ağlaması gereken satırlarda gülme algılanırsa satır yeniden üretiliyor (kızın "Bilmiyorum" repliği bu yüzden 4 kez üretildi).
- Satır içindeki duraklamalar en fazla yaklaşık 0,25 saniyeye sıkıştırıldı.
- Part 2'de kız "Benim adım Ela" diyor ama ses "E" harfinde cızırtıyla kesiliyor (kesme noktası kelime zamanlarından bulundu).
- Hattın kesildiği yerlerde kısa bir cızırtı var. Patlama, motor sesi, keman, martı gibi efektler bu dosyalarda yok, kurguda ayrıca eklenecek.
- Bütün part dosyaları -16 LUFS'a normalize edildi.
