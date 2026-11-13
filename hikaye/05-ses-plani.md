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
- **Profil:** Kadın, 54 yaş. Mimar'ın sözlerini okurken titrek ama ezberlenmiş gibi düz, zorla sakin. Kendi sözlerinde panik, hıçkırık, bağırış.
- **Aranacak:** Türkçe, olgun kadın, "emotional", "dramatic" tarifli sesler.
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

## 4. Durum

- [ ] ElevenLabs anahtarı doğrulanacak (`onboard check`).
- [ ] Sesler kütüphaneden seçilecek ve her karakter için kısa bir deneme cümlesi üretilip kullanıcıya dinletilecek.
- [ ] Onaydan sonra Part 1–4'ün bütün replikleri üretilip birleştirilecek.
