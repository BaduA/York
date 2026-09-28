# Menu Builder Spec

Admin panelden tam kontrol edilebilen menü sistemi.
Bu dosyayı okuyup onayladıktan sonra backend şeması + frontend render sistemi yazılır.

---

## Nasıl Çalışır

```
Section
  └── description-box (opsiyonel, sabit full-width kutu — sözlük gibi)
  └── Grid (column template tanımı)
        └── Column 1
              └── Card A     ← grup tipi: card
              └── Card B     ← aynı kolona stack edilmiş
        └── Column 2
              └── Card C     ← col-span: 2 alabilir, daha geniş
```

Section içindeki her şey yukarıdan aşağı sırayla eklenir:
description-box (varsa) → grid → grid içinde sütunlar → sütunlarda kartlar

---

## 1. Section (Bölüm)

Zaten var (slug, title, subtitle, icon, badge). Değişen yok.

---

## 2. Grid Template (Section'ın layout tanımı)

Her section'ın bir `gridTemplate` değeri olur.

**Formatı:** boşlukla ayrılmış `fr` değerleri
```
"1fr 1fr 1fr"      → 3 eşit kolon   (Promo Bar, Ana Mutfak)
"5fr 7fr"          → sol dar sağ geniş   (Sushi Bar)
"1fr 1fr 1fr 1fr"  → 4 eşit kolon   (Noodle, Coffee)
"1fr"              → tek kolon
"1fr 1fr"          → 2 eşit kolon
```

Gap sabit, değiştirilemez (24px).

**Mevcut section'ların template'leri:**
| Section | gridTemplate |
|---|---|
| promo-bar | `"1fr 1fr 1fr"` |
| sushi-bar | `"5fr 7fr"` |
| bentolar | — (card-item tipi, ayrı çalışır) |
| noodles-rice | `"1fr 1fr 1fr 1fr"` |
| main-kitchen | `"1fr 1fr 1fr"` |
| aperatifler | `"1fr 1fr 1fr"` |
| coffee-soft | `"1fr 1fr 1fr 1fr"` |

---

## 3. Group Tipleri

Her group şu 3 tipten biri olur. Tip seçilince o tipe özel opsiyonlar açılır.

---

### Tip A: `card`
Standart kart. İçinde başlık + item listesi var. En yaygın tip.

**Mevcut örnekler:** Sashimi, Nigiri, Maki, Uramaki, Bira, Wine & Shot, Günün Balığı, Egg Noodle, Tavuk, Aperatifler, Kahveler...

**Grid yerleşimi:**
- `colStart`: hangi kolona girdiği (1, 2, 3...)
- `colSpan`: kaç kolon kapladığı (1, 2, 3...)
- Aynı `colStart`'a sahip birden fazla card → o kolonda üst üste (stack) durur
- Stack'te height: en uzun olan row'u belirler; daha kısa kart alt kısmına otomatik padding alır

**Kart dış görünüm opsiyonları:**
| Opsiyon | Tip | Açıklama | Örnek |
|---|---|---|---|
| `borderHighlight` | boolean | Kart borderi primary renk mi (parlak) mi standart mı | Günün Balığı = true |
| `cornerBadge` | string \| null | Sağ üst köşede fiyat/not etiketi | Günün Balığı = "Sadece 675₺" |
| `glowEffect` | boolean | Arka planda bulanık yuvarlak ışıma efekti | Bira kartı = true |

**Başlık opsiyonları (hepsi opsiyonel, hepsi bağımsız seçilir):**
| Opsiyon | Tip | Açıklama | Örnek |
|---|---|---|---|
| `titleStyle` | `"plain"` \| `"badge-primary"` \| `"badge-secondary"` | Başlığın arka planı var mı | Bira = badge-primary, Günün Balığı = badge-secondary, Sashimi = plain |
| `titleNote` | string \| null | Başlığın yanında `(4 pcs)` gibi parantezli açıklama | Sashimi = "4 pcs", Maki = "8 pcs" |
| `titleRightIcon` | string \| null | Başlığın sağında iconify icon kodu | Sashimi = "solar:fire-square-bold" |
| `titleRightLabel` | string \| null | Başlığın sağında kırmızı küçük metin | Egg Noodle = "Yumurtalı Buğday" |
| `titleRightBadge` | string \| null | Başlığın sağında primary arka planlı küçük badge | Uramaki = "İmza" |
| `titleBorderBottom` | boolean | Başlık altında ince border çizgisi var mı | Sashimi = true, Bira = false |
| `subtitle` | string \| null | Başlığın altında küçük açıklama metni | Uramaki = "Tüm rulo sosları şefin..." |
| `descriptionText` | string \| null | Başlık bloğunun altında serbest metin paragrafı | Günün Balığı = "Her gün taze deniz..." |

**Not:** `titleStyle: "badge"` seçilince `titleBorderBottom` otomatik false olur. Badge ve border birlikte olmaz.

**İçerik (item listesi) opsiyonları:**
| Opsiyon | Tip | Açıklama | Örnek |
|---|---|---|---|
| `itemLayout` | `"rows"` \| `"grid-2col"` | Itemler tek sütun liste mi, 2 sütun grid mi | Maki = grid-2col, Sashimi = rows |
| `itemSize` | `"normal"` \| `"compact"` | Item satırı boyutu | Kova Fırsatları = compact, diğerleri = normal |

---

### Tip B: `card-item`
Group yoktur, section'ın itemleri doğrudan kart olarak grid'e dağılır.
Sadece **Bentolar** bunu kullanıyor.

- Her item ayrı bir kart olarak render edilir
- Kart içi: üstte `name + price` yanyana, altında `description`
- Grid template section'dan gelir (bentolar için `"1fr 1fr 1fr"`)
- Group'a başlık veya ek opsiyon yoktur

---

### Tip C: `description-box`
Grid dışında, section'ın en üstüne veya en altına sabitlenmiş full-width bilgi kutusu.
Sadece **Sushi Sözlüğü** bunu kullanıyor.

- Grid'e girmez, her zaman full-width
- `position`: `"top"` (gridden önce) | `"bottom"` (gridden sonra)
- İçerik: `SushiVocabEntry` listesinden gelir (term → translation çiftleri)
- Görünüm sabittir: primary başlık + nokta ile ayrılmış `**term:** translation` listesi

---

## 4. Item Tipleri

Her group içindeki item'ın nasıl görüneceği `itemVariant` ile belirlenir.

---

### `simple`
```
Sake Sashimi (Somon)          440₺
```
- Sol: name
- Sağ: price (primary renk)
- Açıklama yok
- **Örnekler:** Sashimi, Nigiri, Noodle, Coffee

---

### `with-description`
```
Moğol İşi Tavuk
Özel Moğol sos, taze soğan    485₺
```
- Sol üst: name (bold)
- Sol alt: description (muted, xs)
- Sağ: price
- **Örnekler:** Tavuk & Etler, Burgerler

---

### `with-pricenote-below`
```
Bud Fıçı                      245₺
33 cl / 50 cl              → 275₺  (primary, xs, altta)
```
- Sol üst: name (bold)
- Sol alt: description (muted, xs)
- Sağ üst: price
- Sağ alt: priceNote (primary renk, xs) — "kova fırsatı" veya "eski fiyat" gibi ek not
- **Örnekler:** Bira itemleri

---

### `with-pricenote-strikethrough`
```
5+1 Tekila
1.560₺ (üstü çizili)          1.450₺
```
- Sol üst: name (bold)
- Sol alt: priceNote (üstü çizili, soluklaştırılmış)
- Sağ: price (primary)
- **Örnekler:** Wine & Shot itemleri

---

### `property`
```
Pazartesi          Somon Izgara
```
- Sol: name (muted)
- Sağ: description (bold, foreground) — description fiyat değil, özellik/değer
- Price kullanılmaz
- **Örnekler:** Günün Balığı

---

### `sub-header`
```
── KOVA FIRSATLARI ──
```
- Item değil, grup içinde bir bölüm başlığı
- `name` alanı başlık metni olur
- Price, description kullanılmaz
- Sadece compact gruplarda kullanılır
- **Örnekler:** Kova Fırsatları başlığı

---

### `mini-card`
```
┌─────────────────────────────┐
│ Mi-Sake Roll         555₺   │
│ İçi: Tempura Somon, ...     │
└─────────────────────────────┘
```
- Her item kendi içinde küçük kart (border, rounded, hover)
- Üst: name (bold) + price (sağda)
- Alt: description (xs, muted)
- Grid'de `itemLayout: "grid-2col"` ile birlikte çalışır
- **Örnekler:** Special Uramaki Rolls

---

## 5. Mevcut Menu'nun Bu Sisteme Tam Mapping'i

| Section | Group | Tip | colStart | colSpan | titleStyle | titleNote | titleRightIcon | titleRightLabel | titleRightBadge | titleBorderBottom | itemVariant | itemLayout |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| promo-bar | Buzzz Gibi Bira | card | 1 | 1 | badge-primary | — | — | — | — | false | with-pricenote-below | rows |
| promo-bar | Kova Fırsatları | card | 1 | 1 | — | — | — | — | — | false | simple | rows |
| promo-bar | Wine & Shot | card | 2 | 1 | badge-primary | — | — | — | — | false | with-pricenote-strikethrough | rows |
| promo-bar | Günün Balığı | card | 3 | 1 | badge-secondary | — | — | — | — | false | property | rows |
| sushi-bar | [vocab box] | description-box | — | — | — | — | — | — | — | — | — | — |
| sushi-bar | Sashimi | card | 1 | 1 | plain | "4 pcs" | solar:fire-square-bold | — | — | true | simple | rows |
| sushi-bar | Nigiri | card | 1 | 1 | plain | "2 pcs" | — | — | — | true | simple | rows |
| sushi-bar | Maki | card | 1 | 1 | plain | "8 pcs" | — | — | — | true | simple | grid-2col |
| sushi-bar | Special Uramaki | card | 2 | 1 | plain | "8 pcs" | — | — | "İmza" | true | mini-card | grid-2col |
| bentolar | (card-item) | card-item | — | — | — | — | — | — | — | — | — | — |
| noodles-rice | Egg Noodle | card | 1 | 1 | plain | — | — | "Yumurtalı Buğday" | — | true | simple | rows |
| noodles-rice | Udon Noodle | card | 2 | 1 | plain | — | — | "Kalın Japon" | — | true | simple | rows |
| noodles-rice | Pad Thai | card | 3 | 1 | plain | — | — | "Pirinç Eriştesi" | — | true | simple | rows |
| noodles-rice | Özel Pirinçler | card | 4 | 1 | plain | — | — | "Wok Fried" | — | true | simple | rows |
| main-kitchen | Tavuk & Kırmızı Etler | card | 1 | 1 | plain | — | — | — | — | true | with-description | rows |
| main-kitchen | Balık & Deniz Ürünleri | card | 2 | 1 | plain | — | — | — | — | true | with-description | rows |
| main-kitchen | Bilkent Burgerler | card | 3 | 1 | plain | — | — | — | — | true | with-description | rows |
| aperatifler | Aperatifler | card | 1 | 1 | plain | — | — | — | — | true | simple | rows |
| aperatifler | Salatalar | card | 2 | 1 | plain | — | — | — | — | true | simple | rows |
| aperatifler | Çorbalar | card | 3 | 1 | plain | — | — | — | — | true | simple | rows |
| aperatifler | Kids York | card | 3 | 1 | plain | — | — | — | — | true | simple | rows |
| coffee-soft | Sıcak Kahveler | card | 1 | 1 | plain | — | — | — | — | true | simple | rows |
| coffee-soft | Soğuk Kahveler | card | 2 | 1 | plain | — | — | — | — | true | simple | rows |
| coffee-soft | Çaylar (Fincan) | card | 3 | 1 | plain | — | — | — | — | true | simple | rows |
| coffee-soft | Tatlılar & Soft | card | 4 | 1 | plain | — | — | — | — | true | simple | rows |

---

## 6. Backend Şema Değişiklikleri (özet)

Mevcut `MenuGroup` modeline eklenecekler:

```prisma
groupType          String  @default("card")      // "card" | "card-item" | "description-box"
gridTemplate       String?                        // Section seviyesinde: "1fr 1fr 1fr"
colStart           Int     @default(1)
colSpan            Int     @default(1)
borderHighlight    Boolean @default(false)
cornerBadge        String?
glowEffect         Boolean @default(false)
titleStyle         String  @default("plain")     // "plain" | "badge-primary" | "badge-secondary"
titleNote          String?
titleRightIcon     String?
titleRightLabel    String?
titleRightBadge    String?
titleBorderBottom  Boolean @default(true)
descriptionText    String?
descriptionBoxPos  String?                        // "top" | "bottom" (sadece description-box için)
itemVariant        String  @default("simple")    // aşağıdaki 7 tipten biri
itemLayout         String  @default("rows")      // "rows" | "grid-2col"
itemSize           String  @default("normal")    // "normal" | "compact"
```

`gridTemplate` aslında Section'a ait ama Group'tan da okunabilir (Section'a eklenecek).

---

## 7. Admin Panel'de Akış

1. Section seç
2. "Yeni Grup Ekle" → Group tipi seç (`card` / `card-item` / `description-box`)
3. **Eğer `card`:**
   - `colStart` ve `colSpan` seç (section'ın grid template'ine göre görsel preview)
   - Dış görünüm opsiyonlarını seç (borderHighlight, cornerBadge, glowEffect)
   - Başlık opsiyonlarını seç (titleStyle, titleNote, titleRightIcon, vb.)
   - Item opsiyonlarını seç (itemVariant, itemLayout, itemSize)
   - Item ekle / düzenle / sil
4. **Eğer `card-item`:** Direkt item ekle, her item kart olarak görünür
5. **Eğer `description-box`:** Pozisyon seç (top/bottom), vocab entry ekle/düzenle/sil

---

## Onay

Bu spec'i okuduktan sonra:
- Değiştirmek istediğin bir şey var mı?
- Eksik gördüğün varyasyon var mı?
- Onaylarsan backend şema migration + frontend render sistemi yazılır.
