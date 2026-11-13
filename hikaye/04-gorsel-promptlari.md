# Profesör: Düşüş — Görsel Üretim Dosyası (Claude için)

> Bu dosya Claude sohbetine (claude.ai) yüklenmek için hazırlandı. Claude bu dosyayı okuyup Higgsfield ile bütün görselleri üretecek.

---

## 0. CLAUDE İÇİN TALİMAT (önce bunu oku)

Sen "Profesör: Düşüş" adlı dikey (9:16) bir Instagram Reels serisinin görsellerini üreteceksin. Karanlık, yetişkinlere yönelik bir gerilim hikayesi. Görseller grafik roman tarzında.

**Araç ve ayarlar**
- Higgsfield `generate_image` ve birden fazla görsel için `generate_image_batch` kullan.
- Model: `gpt_image_2_6`, `quality: "high"`, `use_unlim: true` (sınırsız üretim hakkı bu sohbette geçerli). Sınırsız hak reddedilirse kredi harcamadan önce kullanıcıya sor.
- En-boy oranı: sahneler için `9:16`. Karakter ve mekân kartları için `16:9`.
- Batch üretimde en fazla 12 görsel gönder, `jobs_wait` ile bekle, sonra hepsini tek bir `show_generation_by_ids` ile göster.

**Referans görseller (kullanıcı bu dosyayla birlikte yükleyecek)**
- `stil-1-grup.jpg` ve `stil-2-ayakta.jpg`: Çizim stilinin kaynağı. **Her üretime bu ikisini `image_references` olarak ekle.** Bu karelerdeki karakterleri (kasketli adam, hardal ceket) ve yazıları kopyalama, sadece stili al.
- `profesor.png`, `bora.png`, `tuna.png`, `omer.png`, `kiz.png`: İlk karakter çizimleri. Bunlar karakter kartlarına başlangıç olacak. Profesör'e sakal eklenecek, kızın maskesi çıkarılacak.

**Çalışma sırası**
1. **Karakter kartlarını üret (C-01 – C-05).** Kullanıcıya göster, onay al.
2. **Mekân kartlarını üret (L-01 – L-07).** İçlerinde insan olmasın. Kullanıcıya göster, onay al.
3. **Sahneleri üret (Part 1 → Part 4).** Her sahnede, "Referanslar" satırında yazan karakter ve mekân kartlarını **onaylanmış hallerinin job_id'leriyle** `image_references` olarak ver. Stil karelerini de ekle.
4. Her part bitince kullanıcıya göster. Tutarsız görselleri (yanlış kıyafet, maske takan kız, sakalsız Profesör, görünen yazı) aynı promptla yeniden üret.

**Değişmez kurallar**
- Her promptun başına aşağıdaki **STYLE** bloğunu birebir ekle.
- Karakterlerin tarifi asla değişmez. Promptta bir karakter geçiyorsa aşağıdaki **KARAKTER TARİFLERİ** bölümündeki tam tarifini kullan.
- **Kız hiçbir görselde maske takmıyor.** Uçaktaki diğer herkes sarı oksijen maskesi takıyor ve uyuyor.
- **Mimar hiçbir görselde görünmez.** Bombalı kadın (Saadet) da hiçbir görselde görünmez.
- Görsellerde **okunabilir yazı, rakam, harf, logo, altyazı ya da arayüz olmaz.** Telefon ekranlarındaki yazılar ("GİZLİ NUMARA", "CEVAP?") ve üst bardaki sayaçlar kurguda eklenecek.
- Kadrajın üst %15'i daha karanlık ve sade kalsın, üst bar oraya gelecek. Ana özne ortada dursun, altyazı alt-orta bölgeye gelecek.

---

## 1. STYLE BLOĞU (her promptun başına birebir eklenecek)

```
STYLE: Graphic-novel comic illustration that matches the attached style references exactly. Bold black ink outlines, dense cross-hatched ink shading, slightly gritty paper texture. All characters have smooth round white egg-shaped heads with simple solid black oval eyes and minimal, expressive eyebrows and mouths; their bodies and clothing have realistic proportions and detailed folds. Backgrounds are realistic, richly detailed and painterly. Cinematic, moody lighting: deep teal-blue shadows against warm amber-orange candle and lamp light, high contrast, subtle film grain. Keep the top 15% of the frame darker and uncluttered, keep the main subject in the center. No text, no letters, no numbers, no captions, no subtitles, no logos, no UI, no watermark.
```

---

## 2. KARAKTER TARİFLERİ (promptlarda birebir kullanılacak)

- **[PROFESÖR]** = `the Professor: a tall, thin man in his late thirties; round thin wire-rimmed glasses; a short, neatly trimmed dark beard covering his jaw, chin and upper lip; short neat dark hair; a long charcoal wool coat over a black turtleneck; dark trousers; polished black shoes`
- **[KIZ]** = `a 7-year-old girl: small and thin; shoulder-length curly dark brown hair; a simple dark navy dress with a small white collar; white socks; black shoes; big, teary, frightened eyes; she wears NO oxygen mask, her face is completely uncovered`
- **[BORA]** = `Bora: a broad-shouldered, muscular man of 38; a very short military buzz-cut; dark stubble; a small scar on his cheek; a dark olive field jacket; black tactical trousers; worn combat boots; a pistol in a hip holster`
- **[TUNA]** = `Tuna: a lean, slightly hunched man of 27; messy dark hair; a scar cutting through his right eyebrow; dark circles under his eyes; a black hoodie; dark cargo trousers; worn sneakers`
- **[ÖMER]** = `Omer: a 54-year-old man of medium build; neatly combed grey hair and a short grey beard; tired, heavy-lidded eyes; a dark navy suit with a loosened dark tie and white shirt; an old leather wristwatch`

---

## 3. KARAKTER KARTLARI (16:9)

**C-01 · Profesör**
Referanslar: stil-1, stil-2, profesor.png
```
[STYLE] Character reference sheet on a plain dark stone-wall background, three panels side by side: (1) full-body front view, (2) full-body three-quarter view holding a violin and bow at his side, (3) head-and-shoulders close-up with three small expression insets: cold focused stare, gentle worried softness, a faint, barely visible smile. Character: [PROFESÖR]. Same character in every panel, consistent clothing, glasses and beard. Warm candle key light from the left, teal shadows.
```

**C-02 · Kız**
Referanslar: stil-1, stil-2, kiz.png (sadece kız için; maskesini çıkar)
```
[STYLE] Character reference sheet on a plain dark background, three panels side by side: (1) full-body front view, (2) full-body three-quarter view pressing an old mobile phone to her ear with both hands, (3) close-up face with three small expression insets: crying with tears, wide-eyed terror, a tiny sad half-smile through tears. Character: [KIZ]. No oxygen mask anywhere on her face or around her neck. Same character in every panel. Cold flickering light with a faint red warning glow.
```

**C-03 · Bora**
Referanslar: stil-1, stil-2, bora.png
```
[STYLE] Character reference sheet on a plain dark stone-wall background, three panels: (1) full-body front view, arms crossed, (2) full-body three-quarter view holding a pistol pointed at the floor, (3) close-up with three expression insets: stern watchful, grim, a dry tired half-smirk. Character: [BORA]. Consistent across panels. Warm lamp light, teal shadows.
```

**C-04 · Tuna**
Referanslar: stil-1, stil-2, tuna.png
```
[STYLE] Character reference sheet on a plain dark background, three panels: (1) full-body front view holding a cheap old keypad phone, (2) seated three-quarter view at a keyboard, face lit by a cold blue screen, (3) close-up with three expression insets: tense focus, uneasy fear, tired smirk. Character: [TUNA]. Consistent across panels.
```

**C-05 · Ömer**
Referanslar: stil-1, stil-2, omer.png
```
[STYLE] Character reference sheet on a plain dark stone-wall background, three panels: (1) full-body front view holding a closed case file, (2) three-quarter view with a phone at his ear, back close to a wall, (3) close-up with three expression insets: grave and tired, shocked, suspicious side-glance. Character: [ÖMER]. Consistent across panels. Warm lamp light.
```

---

## 4. MEKÂN KARTLARI (16:9, içlerinde insan yok)

**L-01 · Mahzen, ana salon**
Referanslar: stil-1, stil-2
```
[STYLE] Wide establishing view of a secret underground gallery hidden beneath Galata, Istanbul, inspired by V's Shadow Gallery in "V for Vendetta": an old Genoese cellar with vaulted brick and stone ceilings and a sequence of arched chambers opening into each other. Walls crowded with oil paintings in heavy gilded frames, marble busts and statues, floor-to-ceiling shelves of old leather-bound books, layered Persian rugs on stone floors, antique leather armchairs, a long heavy wooden table in the center with brass lamps and dozens of candles. In one corner, an understated tech nook: three slim server racks with small blinking green and blue LEDs, cables running along the stone floor, three or four monitors on an antique desk. On one wall, an evidence wall with pinned photographs, maps and red string. Warm amber candlelight against deep teal shadows. Empty, no people.
```

**L-02 · Profesör'ün odası**
Referanslar: stil-1, stil-2, L-01
```
[STYLE] A small private stone room at the far end of the same underground gallery. No windows. Floor-to-ceiling bookshelves packed with old books, a narrow antique writing desk with a single brass desk lamp, many melted candles, an open violin case lined with worn velvet, loose sheets of paper, a worn leather armchair. Intimate, quiet, golden candlelight with deep shadows in the corners. Empty, no people.
```

**L-03 · Teknik köşe (yakın)**
Referanslar: stil-1, stil-2, L-01
```
[STYLE] Closer view of the tech nook inside the underground gallery: three or four monitors on an antique carved desk showing abstract glowing maps and waveforms (no readable text), slim server racks with blinking LEDs, tangled cables, an old keypad phone and an empty tea glass on the desk, a marble bust and gilded painting frames visible behind. Cold blue screen glow mixing with warm candlelight. Empty, no people.
```

**L-04 · Delil duvarı**
Referanslar: stil-1, stil-2, L-01
```
[STYLE] An evidence wall on old stone inside the underground gallery: pinned photographs, newspaper clippings and handwritten notes (no readable text), a large map of Istanbul and the Princes' Islands, red string connecting pins, a brass lamp casting a warm pool of light, candle wax on a small shelf below. Empty, no people.
```

**L-05 · Uçak kabini (gece)**
Referanslar: stil-1, stil-2
```
[STYLE] Interior of a narrow-body passenger airliner cabin at night, seen down the central aisle toward the front. Dim emergency lighting, a pulsing red warning light near the ceiling, flickering cold cabin lights. Every passenger in every seat wears a yellow oxygen mask and is slumped unconscious, heads fallen to the side. Extra yellow masks dangle on thin cords from the open ceiling panels and, in the half-light, subtly resemble yellow plastic cups hanging on strings. All windows are pitch black: no clouds, no stars, no lights outside. At the far end, the cockpit door stands slightly ajar with a thin line of instrument glow. The aisle is empty.
```

**L-06 · Kokpit (kapı aralığından)**
Referanslar: stil-1, stil-2, L-05
```
[STYLE] View through a slightly open cockpit door of a passenger airliner at night: two pilots slumped in their seats, both wearing yellow oxygen masks, unconscious; the control yokes moving very slightly on their own (autopilot); dim instrument glow in green and amber with no readable text; the windscreen is completely black. Seen from a child's low eye level.
```

**L-07 · Heybeliada iskelesi (gece, boş)**
Referanslar: stil-1, stil-2
```
[STYLE] The ferry pier of Heybeliada island, Istanbul, at night in strong wind: an old wooden-and-stone pier with iron bollards, dark choppy water, seagulls circling in the wind, the silhouette of the island's hills and old wooden mansions behind. Far out at the end of the breakwater, a tiny red light blinks in the darkness. Nobody visible. Cold teal and black palette with a single red point of light.
```

---

## 5. SAHNELER

Her satırda: **ID · süre · seslendirme · referanslar**, sonra prompt. Bütün sahneler 9:16.

---

### PART 1 · "Gizli Numara" (~55 sn)

**P1-01** · 0:00–0:03 · (keman) · Ref: C-01, L-02
```
[STYLE] Inside the Professor's small book-lined stone room, candlelit, no windows. [PROFESÖR] stands with his back three-quarters to the camera, violin under his chin, bow in motion, lost in playing. Medium shot from behind his shoulder, warm golden candlelight, deep shadows, dust in the air.
```

**P1-02** · 0:03–0:05 · (telefon titriyor) · Ref: L-02
```
[STYLE] Extreme close-up on the antique writing desk: a smartphone vibrating next to an open velvet-lined violin case, its screen glowing cold white with an incoming call (screen content abstract and blurred, no readable text). Candle flames trembling. Shallow depth of field.
```

**P1-03** · 0:05–0:08 · KIZ: "Alo? Lütfen biri yardım etsin! Uçak düşecek! Herkes uyuyor!" · Ref: C-01, L-02
```
[STYLE] [PROFESÖR] turns his head sharply toward the desk, the bow frozen in the air, its tip just touching the phone's screen to put it on speaker. His eyes behind the glasses snap from dreamy to fully alert. Medium close-up, candlelight on one side of his face, cold phone glow on the other.
```

**P1-04** · 0:08–0:11 · (KIZ devam) · Ref: C-02, L-05
```
[STYLE] Wide shot down the dark airplane cabin aisle at night: every passenger slumped asleep wearing a yellow oxygen mask; in the middle of the aisle stands [KIZ], tiny and alone, pressing an old phone to her ear with both hands, crying. Her face is uncovered. Pulsing red warning light, pitch-black windows.
```

**P1-05** · 0:11–0:14 · PROFESÖR: "Seni duyuyorum. Ben buradayım. Neredesin sen?" · Ref: C-01, L-02
```
[STYLE] Close-up of [PROFESÖR] lowering the violin, leaning toward the phone, voice calm. His expression is serious but his eyes are unexpectedly gentle. Candlelight reflected in his round glasses.
```

**P1-06** · 0:14–0:16 · KIZ: "Uçaktayım! Kimse uyanmıyor!" · Ref: C-02, L-05
```
[STYLE] Close-up of [KIZ] in the dark cabin, tears running down her round white face, mouth open mid-sob, the phone pressed to her ear; behind her, out of focus, a masked passenger slumped in a seat. Red warning light flashing across her face.
```

**P1-07** · 0:16–0:19 · (Profesör salona çıkıyor) · Ref: C-01, C-03, C-04, C-05, L-01
```
[STYLE] [PROFESÖR] strides out of a narrow stone doorway into the vaulted main hall of the underground gallery, phone held in front of him. In the hall, three men look up at him at the same moment: [TUNA] at the glowing monitors in the tech nook, [BORA] in an antique leather armchair with a disassembled pistol on his knee, [ÖMER] under a brass lamp with a case file open. Candles, paintings, statues. Wide shot.
```

**P1-08** · 0:19–0:21 · PROFESÖR: "Tuna." · Ref: C-04, L-03
```
[STYLE] [TUNA] spins his chair back to the keyboard without a word, fingers already on the keys, his face lit cold blue by the monitors showing abstract maps and waveforms. Over-the-shoulder medium shot.
```

**P1-09** · 0:21–0:24 · PROFESÖR: "Tamam. Kapatmıyorum. Kimle uçuyorsun?" · Ref: C-01, L-01
```
[STYLE] [PROFESÖR] holds the phone close to his mouth with both hands, head slightly bowed, speaking softly; behind him the candlelit gallery blurs. His usual coldness is gone. Medium close-up.
```

**P1-10** · 0:24–0:27 · KIZ: "Yalnızım..." · Ref: C-02, L-05
```
[STYLE] High wide shot looking down the long dark cabin: rows and rows of masked, slumped passengers, and [KIZ] very small in the middle of the aisle, alone, holding the phone. Emphasize how tiny and alone she is. Red light, black windows.
```

**P1-11** · 0:27–0:30 · PROFESÖR: "Kaç yaşındasın?" KIZ: "Yedi." · Ref: C-03, C-05, L-01
```
[STYLE] Two-shot in the candlelit gallery: [BORA] slowly sets his pistol down on a side table, his face hardening; beside him [ÖMER] quietly closes his case file. Both stare toward the phone off-screen. Warm lamp light, teal shadows.
```

**P1-12** · 0:30–0:33 · PROFESÖR: "Pilotlar nerede?" KIZ: "Kokpitin kapısı açık... İkisi de uyuyor. Seslendim, uyanmadılar." · Ref: C-02, L-06
```
[STYLE] Low child's-eye view from the cabin aisle toward the slightly open cockpit door: inside, two pilots slumped with yellow oxygen masks, unconscious, the yokes moving slightly by themselves. In the foreground, the small hand of [KIZ] rests on the door frame. Black windscreen.
```

**P1-13** · 0:33–0:36 · PROFESÖR: "Nereye gidiyordunuz?" KIZ: "Eve..." PROFESÖR: "Ev nerede?" KIZ: "Bilmiyorum..." · Ref: C-01, L-01
```
[STYLE] Close-up of [PROFESÖR], eyes narrowed in concentration, listening hard, one finger pressed to his lips. Behind him, out of focus, the evidence wall with red string. Warm side light.
```

**P1-14** · 0:36–0:39 · PROFESÖR: "Pencereden bakabilir misin? Dışarıda ne görüyorsun?" KIZ: "Hiçbir şey... Kapkaranlık." · Ref: C-02, L-05
```
[STYLE] [KIZ] presses her face and both palms against an airplane window. Outside there is absolutely nothing: pure black, no clouds, no stars, no lights. Her faint reflection in the glass. Shot from beside her, cold dim light.
```

**P1-15** · 0:39–0:42 · KIZ: "Uçak sallanıyor! Korkuyorum!" · Ref: C-02, L-05
```
[STYLE] The cabin violently tilts: yellow oxygen masks swing wildly on their cords, the slumped masked passengers lurch in their seats, a cup rolls across the aisle floor. [KIZ] clutches a seat back with both arms, screaming, eyes squeezed shut. Dutch angle, motion lines, red warning light.
```

**P1-16** · 0:42–0:46 · PROFESÖR: "Biliyorum. Ben de korkardım. Ama sesimi duyuyorsun, değil mi? Ben buradayım." · Ref: C-01, L-01
```
[STYLE] Tight close-up of [PROFESÖR], his face softened in a way we have not seen: gentle, almost tender, eyes slightly glistening behind his glasses, speaking quietly into the phone. A single candle flame between him and the camera, out of focus.
```

**P1-17** · 0:46–0:50 · PROFESÖR: "Bu numarayı nereden buldun?" KIZ: "Koltuğun cebinde bir telefon vardı. Yanında da bir kâğıt..." · Ref: C-02, L-05
```
[STYLE] Extreme close-up of the small hands of [KIZ] holding a folded piece of paper next to an old mobile phone, just pulled from an airplane seat-back pocket. Handwritten lines on the paper are blurred and unreadable. Red warning light flickering over the paper.
```

**P1-18** · 0:50–0:53 · ÖMER: "O ismi bu odanın dışında kimse bilmez." · Ref: C-05, C-03, C-04, L-01
```
[STYLE] In the candlelit gallery, [ÖMER] in the foreground whispering, eyes wide; behind him [BORA] and [TUNA] frozen mid-motion, all three staring at the same point off-screen. Tense, still composition, warm light, deep shadows.
```

**P1-19** · 0:53–0:55 · (sessizlik, PART 2) · Ref: C-01, L-01
```
[STYLE] [PROFESÖR] standing over the long wooden table, staring down at the phone lying on it; the cold screen glow and two candle flames reflected in his round glasses. Slow, ominous, centered composition, darkness closing in at the edges.
```

---

### PART 2 · "Görünmeyen Uçak" (~50 sn)

**P2-01** · 0:00–0:04 · TUNA: "Arama uçağın internetinden geliyor. Ama sinyal aynı anda İstanbul, Ankara ve Bakü'den geçirilmiş." · Ref: C-04, L-03
```
[STYLE] Over-the-shoulder shot of [TUNA] at the monitors: a dark map with three glowing points pulsing at the same time, connected by thin lines (no labels, no readable text). His face reflected in the screen, tense.
```

**P2-02** · 0:04–0:06 · PROFESÖR: "Yani?" · Ref: C-01, L-01
```
[STYLE] Profile close-up of [PROFESÖR], cold and impatient, one eyebrow raised, candlelight edging his beard and glasses.
```

**P2-03** · 0:06–0:09 · TUNA: "Yani bunu yapan ya bir devlet... ya da devletin içindeki biri." · Ref: C-04, L-03
```
[STYLE] Close-up of [TUNA] turning from the screen to look back, uneasy, blue light on half of his face, the scar through his eyebrow visible.
```

**P2-04** · 0:09–0:12 · ÖMER: "Hava trafikle konuştum. Radarda kaybolan tek bir uçak yok." · Ref: C-05, L-01
```
[STYLE] [ÖMER] lowering his phone from his ear, back against the stone wall, grave and puzzled, under a brass lamp.
```

**P2-05** · 0:12–0:14 · BORA: "Kız yalan mı söylüyor?" · Ref: C-03, L-01
```
[STYLE] [BORA] standing with arms crossed, skeptical frown, leaning against a marble statue's pedestal in the gallery.
```

**P2-06** · 0:14–0:18 · PROFESÖR: "Hayır. Transponderi kapatmışlar. Uçak havada ama kimse göremiyor. Bu bir kaza değil." · Ref: C-01, L-04
```
[STYLE] [PROFESÖR] at the evidence wall, turning to face the others with absolute certainty, one hand pressed flat on the map of Istanbul. Strong warm key light, long shadow on the wall.
```

**P2-07** · 0:18–0:20 · KIZ: "Profesör? Gittin mi?" · Ref: C-02, L-05
```
[STYLE] [KIZ] sitting on the floor of the dark aisle, hugging her knees, the phone pressed to her ear, crying quietly. Masked passengers' legs and arms hang into the frame around her. Red light.
```

**P2-08** · 0:20–0:24 · PROFESÖR: "Buradayım. Hiçbir yere gitmiyorum. Bana bir şey söyle... En sevdiğin oyun ne?" · Ref: C-01, L-01
```
[STYLE] [PROFESÖR] quickly bends over the table toward the phone, both hands on the table edge, speaking gently, reassuring. Close-up, warm candlelight.
```

**P2-09** · 0:24–0:26 · KIZ: "Uçak oyunu..." · Ref: C-02, L-05
```
[STYLE] Close-up of [KIZ] sniffling, a tiny sad half-smile appearing through her tears for a second. Dim cabin light.
```

**P2-10** · 0:26–0:28 · (Bora ile Ömer bakışıyor) · Ref: C-03, C-05, L-01
```
[STYLE] Two-shot: [BORA] and [ÖMER] exchange a silent, uneasy look across the candlelit table.
```

**P2-11** · 0:28–0:30 · KIZ: "Ama bu oyun değil, değil mi?" · Ref: C-02, L-05
```
[STYLE] Extreme close-up of the eyes of [KIZ], fear returning, a tear about to fall, red light reflected in her pupils.
```

**P2-12** · 0:30–0:34 · PROFESÖR: "Değil. Ama seni eve götüreceğim. Söz veriyorum." · Ref: C-01, L-01
```
[STYLE] [PROFESÖR] closes his eyes for a brief moment as if something hurts, then opens them, determined, making a promise. Tight close-up, a single candle flame beside his face.
```

**P2-13** · 0:34–0:39 · BORA: "Uçağı şu an kim uçuruyor?" PROFESÖR: "Otopilot... ve yedi yaşında bir kız." · Ref: C-03, C-01, L-01
```
[STYLE] Two-shot over the long table: [BORA] in the foreground speaking low, [PROFESÖR] behind him answering grimly, the glowing phone on the table between them.
```

**P2-14** · 0:39–0:42 · PROFESÖR: "Bana adını söyler misin?" KIZ: "Benim adım—" · Ref: C-02, L-05
```
[STYLE] Close-up of [KIZ] taking a breath, lips parted, about to say her name, a strange calm on her face for the first time. The red light freezes mid-pulse.
```

**P2-15** · 0:42–0:44 · (hat cızırdıyor, uçak sesi kesiliyor) · Ref: L-01
```
[STYLE] The phone on the wooden table: its screen glitches into harsh digital static, the candles beside it flicker violently as if from a draft. Extreme close-up.
```

**P2-16** · 0:44–0:50 · KADIN: "Merhaba Profesör. Uyuyamadın mı yine? Ben de." · Ref: C-01, C-03, C-04, C-05, L-01
```
[STYLE] Wide shot of the four men frozen around the long table in the candlelit gallery, all staring at the phone in the center; the room suddenly feels colder, teal shadows creeping over the paintings and statues. Nobody moves.
```

---

### PART 3 · "Mesaj" (~45 sn)

**P3-01** · 0:00–0:03 · KADIN: "Kızla tanıştın. Tatlı, değil mi?" · Ref: L-01
```
[STYLE] Top-down shot of the phone in the middle of the long wooden table, surrounded by candles and the hands of four men resting tensely on the table edge.
```

**P3-02** · 0:03–0:05 · (Ömer telefonuna uzanıyor) · Ref: C-05, L-01
```
[STYLE] Close-up of the hand of [ÖMER] slowly sliding his own phone out of his jacket pocket, under the table, out of sight. His old leather wristwatch visible.
```

**P3-03** · 0:05–0:08 · KADIN: "Telefonu bırak, savcı bey. Polis zaten benim." · Ref: C-05, L-01
```
[STYLE] [ÖMER] freezes with his phone half out of his pocket, eyes wide in shock, slowly looking up. Close-up, warm lamp light turning cold.
```

**P3-04** · 0:08–0:11 · (izleniyorlar) · Ref: C-01, C-03, C-04, C-05, L-01
```
[STYLE] High-angle shot from a dark corner of the vaulted ceiling, as if from a hidden camera, looking down at the four men below as they look up and around at the walls, ceiling and paintings, searching for who is watching them. Unsettling surveillance angle.
```

**P3-05** · 0:11–0:16 · KADIN: "Kurallar basit. Ben sorarım, sen çözersin. Çözene kadar kızla konuşamazsın. Her doğru cevap bir rakam." · Ref: C-01, L-01
```
[STYLE] Close-up of [PROFESÖR] listening, jaw clenched, the anger contained; candlelight flickering on his glasses.
```

**P3-06** · 0:16–0:19 · KADIN: "Lütfen... çocuklarım evde yalnız..." · Ref: L-07
```
[STYLE] Dark choppy sea at night in strong wind; far away at the end of a breakwater, a tiny red light blinks. Seagulls circling. Nobody visible. Lonely, cold, wide.
```

**P3-07** · 0:19–0:23 · KADIN: "Birinci bilmece. Dokuz kardeşiz, denizin ortasında..." · Ref: C-04, L-03
```
[STYLE] Close-up of [TUNA], horror on his face, the blue screen light trembling on his skin.
```

**P3-08** · 0:23–0:27 · KADIN: "...Ne en büyüğüyüm ne en küçüğü. Sırtımda yük taşırım." · Ref: C-01, L-01
```
[STYLE] Extreme close-up of the eyes of [PROFESÖR] behind his glasses, narrowing with sudden interest, a spark of intellectual hunger he tries to hide.
```

**P3-09** · 0:27–0:30 · KADIN: "Bu hanımefendi neredeyse, orası. Kırk dakika." · Ref: L-07
```
[STYLE] Seagulls fighting the wind over black water at night, a distant island silhouette, a single blinking red light. Moody, wind-blown.
```

**P3-10** · 0:30–0:33 · KADIN: "Cevabı bulunca beni ara. Tik tak, tik tak." · Ref: L-01
```
[STYLE] Extreme close-up of the phone screen on the table as the call ends and a new message notification lights up (screen content blurred, no readable text). Candle smoke drifting across the glow.
```

**P3-11** · 0:33–0:36 · TUNA: "Numara hiçbir yere kayıtlı değil." · Ref: C-04, L-03
```
[STYLE] [TUNA] typing fast, then stopping, staring at the monitor in disbelief; blue glow.
```

**P3-12** · 0:36–0:39 · BORA: "Kırk dakika." · Ref: C-03, L-01
```
[STYLE] [BORA] glances at his wristwatch, jaw tight, already reaching for his jacket. Medium shot, warm light.
```

**P3-13** · 0:39–0:45 · PROFESÖR: "Sus. Düşünüyorum." · Ref: C-01, L-01
```
[STYLE] [PROFESÖR] closes his eyes, fingertips pressed together under his chin, perfectly still in the middle of the candlelit gallery while the others move around him slightly blurred. Centered, calm, intense.
```

---

### PART 4 · "Dokuz Kardeş" (~55 sn)

**P4-01** · 0:00–0:03 · PROFESÖR: "Dokuz kardeş, denizin ortasında... Adalar." · Ref: C-01, L-04
```
[STYLE] [PROFESÖR] walks briskly to the evidence wall, coat swinging, eyes fixed on the map. Medium shot from behind his shoulder.
```

**P4-02** · 0:03–0:06 · TUNA: "Adalar dokuz tane. En büyüğü Büyükada." · Ref: C-04, L-03
```
[STYLE] Over-the-shoulder shot of [TUNA]: the monitor shows a dark map of a cluster of nine islands in the sea, the largest one highlighted (no labels, no text).
```

**P4-03** · 0:06–0:09 · PROFESÖR: "Ne en büyük ne en küçük. Geriye yedi ada kalıyor." · Ref: C-01, L-04
```
[STYLE] Close-up of the finger of [PROFESÖR] tracing across the islands on the wall map, red string brushing past his hand.
```

**P4-04** · 0:09–0:10 · BORA: "Hangisi?" · Ref: C-03, L-01
```
[STYLE] [BORA] leaning in close behind the Professor, impatient, jacket half on.
```

**P4-05** · 0:10–0:14 · PROFESÖR: "Sırtında yük taşıyan... Yük... heybe. Heybeliada." · Ref: C-01, L-04
```
[STYLE] Close-up of [PROFESÖR] as the answer clicks: his eyes widen slightly and light up, a spark of triumph behind the glasses, his finger stopping on one island.
```

**P4-06** · 0:14–0:16 · ÖMER: "Ada büyük. Kadın adanın neresinde?" · Ref: C-05, L-01
```
[STYLE] [ÖMER] standing near the wall, arms folded, worried, pressing for more.
```

**P4-07** · 0:16–0:20 · PROFESÖR: "Mesajda vapur düdüğü vardı. Martılar, rüzgar. İskele. Heybeliada iskelesi." · Ref: C-01, L-04
```
[STYLE] [PROFESÖR] turning from the wall, speaking fast and sure, almost energized, hands moving as he thinks. Dynamic medium shot, warm light.
```

**P4-08** · 0:20–0:22 · (iskele) · Ref: L-07
```
[STYLE] The Heybeliada ferry pier at night in the wind, empty, dark water slapping the stones, the tiny red light blinking at the end of the breakwater.
```

**P4-09** · 0:22–0:24 · ÖMER: "Gülümsüyorsun." · Ref: C-05, L-01
```
[STYLE] [ÖMER] watching the Professor with a suspicious side-glance, half in shadow.
```

**P4-10** · 0:24–0:26 · PROFESÖR: "Hayır." · Ref: C-01, L-01
```
[STYLE] Close-up of [PROFESÖR]: the faint smile at the corner of his mouth fading as he realizes he has been caught enjoying it. Cold again.
```

**P4-11** · 0:26–0:29 · (Profesör numarayı arıyor) · Ref: C-01, L-01
```
[STYLE] [PROFESÖR] dialing on the phone and setting it on speaker in the middle of the table; the others gathering close around it, candles between them.
```

**P4-12** · 0:29–0:31 · PROFESÖR: "Heybeliada. İskele." · Ref: C-01, C-03, C-04, C-05, L-01
```
[STYLE] Low angle from the table surface: the phone in the foreground, the four men leaning over it from above, faces lit from below by candlelight.
```

**P4-13** · 0:31–0:36 · KADIN: "Dokuz dakika, Profesörcüğüm. Eskiden üç dakikada çözerdin. İlk rakam: sıfır." · Ref: C-01, L-01
```
[STYLE] Close-up of [PROFESÖR] as the mocking reply comes: his composure cracks for a split second, confusion and a flicker of something old and painful behind his glasses.
```

**P4-14** · 0:36–0:40 · KADIN: "O gece çayı o verdi! Hepimiz uyuduk! Ela'yı bırakmamalıydık—" · Ref: C-03, C-04, C-05, L-01
```
[STYLE] The team reacting in shock to a woman's sudden screaming from the phone: [BORA] stepping back, [TUNA] covering his mouth, [ÖMER] grabbing the table edge. Candle flames bending.
```

**P4-15** · 0:40–0:43 · KADIN: "Fazla konuştun, Saadet." + (patlama) · Ref: L-07
```
[STYLE] Far away across black water at night, a sudden orange explosion flash at the end of the breakwater of the island pier, lighting up the waves and scattering seagulls. Wide, silent and distant.
```

**P4-16** · 0:43–0:46 · (sessizlik) · Ref: C-01, C-03, C-04, C-05, L-01
```
[STYLE] The four men frozen around the table in the candlelit gallery, the phone screen dark, silence; one candle goes out, leaving a thin line of smoke.
```

**P4-17** · 0:46–0:48 · (hafıza: sarı bardak) · Ref: stil-1, stil-2
```
[STYLE] A brief memory flash: in total darkness, a single yellow plastic tea cup hanging from a string, slowly swinging, lit by a faint warm glow. Grainy, dreamlike, slightly overexposed edges.
```

**P4-18** · 0:48–0:51 · PROFESÖR: "Ela..." · Ref: C-01, L-01
```
[STYLE] Extreme close-up of [PROFESÖR] whispering a name, eyes wide and distant, a single tear he does not notice, candlelight trembling on his glasses.
```

**P4-19** · 0:51–0:55 · (telefon yeniden titriyor, PART 5) · Ref: L-01
```
[STYLE] The phone on the wooden table starts vibrating again, its screen lighting up with an incoming call (no readable text), the candle smoke swirling around it. Centered, ominous.
```

---

## 6. ÜRETİM ÖZETİ

| Grup | Adet | En-boy |
|---|---|---|
| Karakter kartları (C-01 – C-05) | 5 | 16:9 |
| Mekân kartları (L-01 – L-07) | 7 | 16:9 |
| Part 1 sahneleri | 19 | 9:16 |
| Part 2 sahneleri | 16 | 9:16 |
| Part 3 sahneleri | 13 | 9:16 |
| Part 4 sahneleri | 19 | 9:16 |
| **Toplam** | **79** | |
