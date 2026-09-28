# York Güvenlik Rehberi — Agent Referansı

Bu dosya York projesine (NestJS backend + Next.js web-app + Next.js place-admin-panel) yönelik
tüm bilinen saldırı vektörlerini, mevcut güvenlik açıklarını ve bunlara karşı alınacak önlemleri
belgeler. Backend tasarımı veya kod incelemesi sırasında bu listeye başvur.

---

## Stack Özeti

| Katman | Teknoloji |
|---|---|
| Backend API | NestJS + Express, `server/src/` |
| Veritabanı | PostgreSQL + Prisma 7 (adapter-pg) |
| Dosya Depolama | Cloudflare R2 (S3 compat.) |
| Müşteri Web | Next.js 16 — `web-app/` |
| Yönetim Paneli | Next.js 16 — `place-admin-panel/` |
| Kimlik Doğrulama | **YOK** (tüm endpointler açık) |

---

## 1. KRİTİK — Kimlik Doğrulama Yok

### Sorun
`place-admin-panel` ve tüm yazma endpointleri (`POST /cocktails`, `PATCH /menu/sections/:id`,
`DELETE /menu/groups/:id` vb.) hiçbir auth kontrolü olmadan herkese açık.

### Saldırı Senaryoları
- Saldırgan tüm menüyü silir: `DELETE /api/v1/menu/sections/:id` döngüsü
- Sahte cocktail ve malzeme ekler, içerikleri bozar
- `GET /api/v1/menu/admin` → gizli (`isVisible: false`) tüm menü öğelerini görür
- `place-admin-panel` URL'i tahmin edilirse (veya deploy edilirse) tarayıcıdan tam yönetim

### Mevcut Koruma
Yok.

### Çözüm Yönü
- Admin paneli için IP allowlist veya HTTP Basic Auth (Nginx/Cloudflare seviyesinde)
- Backend yazma endpointlerine statik `X-Admin-Secret` başlığı veya JWT guard
- `GET /menu/admin` → auth guard arkasına al

---

## 2. KRİTİK — Upload Presign Endpoint Kötüye Kullanımı

**Endpoint:** `POST /api/v1/upload/presign`

### Sorun
`contentType` alanı sadece `@IsString()` ile doğrulanıyor. Bu şu anlama gelir:

```
{ "folder": "cocktails", "contentType": "text/html" }
{ "folder": "cocktails", "contentType": "image/svg+xml" }
{ "folder": "cocktails", "contentType": "application/javascript" }
```

hepsi geçerli kabul edilerek R2'ye presigned URL üretiliyor.

### Saldırı Senaryoları
- `image/svg+xml` → XSS içeren SVG yükle → CDN'den servis edilirse kullanıcı tarayıcısında çalışır
- `text/html` → CDN üzerinde phishing sayfası barındır
- Global throttle 200 req/60s → dakikada 200 presigned URL üret → R2 depolama doldur
- `application/x-executable` gibi MIME'lar → binary dosyalar R2'ye yazılır

### Mevcut Koruma
- `folder` alanı `@IsIn(['ingredients', 'cocktails'])` ile sınırlı ✓
- Global throttle 200 req/min (yetersiz bu endpoint için)

### Çözüm Yönü
```typescript
// PresignDto içinde:
@IsString()
@Matches(/^image\/(jpeg|jpg|png|webp|gif)$/)
contentType: string;
```
- Presign endpointine ayrı throttle: 10 req/min/IP
- R2 bucket CORS policy: sadece kendi domaininden PUT izni
- R2 bucket public READ ama sadece `image/*` content-type'ları için serving (Cloudflare Transform Rules)

---

## 3. YÜKSEK — Throttle Çok Gevşek

### Mevcut Ayar
`ThrottlerModule.forRoot([{ ttl: 60000, limit: 200 }])` — herkese 200 istek/dakika

### Saldırı Senaryoları
- Tüm cocktail/ingredient ID'lerini (cuid format) kaba kuvvetle tarama: 200/dk yeterli
- Menü verilerini otomatik scraping: tüm içerik dakikalar içinde çıkarılır
- `POST /cocktails` loopa alınırsa 200 sahte cocktail/dakika veritabanına yazılır

### Endpointlere Özel Önerilen Limitler

| Endpoint grubu | Önerilen limit |
|---|---|
| `POST /upload/presign` | 10 req/min/IP |
| `DELETE *` | 20 req/min/IP |
| `POST *` | 30 req/min/IP |
| `GET /cocktails`, `GET /menu` | 60 req/min/IP |
| `GET /health` | sınırsız |

---

## 4. YÜKSEK — Admin Panel'de Auth Yok (Ayrı Uygulama)

### Sorun
`place-admin-panel` bir Next.js uygulaması ve sayfaları:
- `/` — Ana panel
- `/menu` — Menü yönetimi
- `/leaderboard` — Sıralama yönetimi
- `/cocktail-lab` — Cocktail laboratuvarı
- `/settings` — Ayarlar

Bunların hiçbirinde auth middleware yok.

### Saldırı Senaryoları
- Subdomain tahmin: `admin.york.com`, `panel.york.com`, `cms.york.com`
- Google indexlemesi: Next.js sitemap varsa veya link verilmişse Google indeksler
- Ağ trafiği analizi: cocktail app açık bir yerde kullanılıyorsa aynı ağdaki kişi admin paneli bulur

### Çözüm Yönü
- Deploy sırasında Cloudflare Zero Trust Access → email/pin ile koruma
- Veya Next.js middleware ile IP whitelist
- Veya Nginx `auth_basic` HTTP Basic Auth

---

## 5. ORTA — SSRF / Harici URL Enjeksiyonu

### Sorun
`cdn-signer.ts`:
```typescript
if (imageKey.startsWith('http://') || imageKey.startsWith('https://')) return imageKey;
```

`Cocktail.imageUrl` ve `Ingredient.imageUrl` veritabanında harici URL olarak saklanabiliyor.
Admin paneli üzerinden `imageUrl` alanına `https://evil.com/tracker.gif` gibi bir URL yazılırsa,
bu URL doğrudan kullanıcıya servis edilir.

### Saldırı Senaryoları
- Malware hosting sitesine yönlendiren resim URL'leri
- Tracking pixel: kimin ne zaman menüye baktığını üçüncü taraf sunucuya sızdır
- İç ağ erişim denemesi (SSRF — server-side fetch varsa)

### Çözüm Yönü
- `imageUrl` kaydetmeden önce: `if (!url.startsWith(CDN_DOMAIN)) throw new BadRequestException()`
- Yalnızca kendi CDN domaininizden URL kabul edin

---

## 6. ORTA — Pagination Yok → Veri Tabanı DoS

### Sorun
`GET /api/v1/cocktails` → tüm cocktail'leri döner (limit yok)  
`GET /api/v1/menu/admin` → tüm menü ağacını döner

### Saldırı Senaryoları
- Yüzlerce cocktail eklenince her `GET /cocktails` büyük bir response üretir
- Saldırgan 1000 cocktail ekler → her ziyaretçi için 1000 kayıt yükler → yavaşlama
- Nested `MenuSection → MenuGroup → MenuItem` ilişkisi: büyüdükçe tek sorgu ağırlaşır

### Çözüm Yönü
- `GET /cocktails?page=1&limit=20` pagination ekle
- `GET /menu` için derinlik sınırı veya ayrı endpoint

---

## 7. ORTA — Trust Proxy + IP Spoofing

### Sorun
```typescript
app.set('trust proxy', 1);
```

Bu ayar, `X-Forwarded-For` başlığının ilk değerini gerçek IP olarak kabul eder.
Eğer uygulama **reverse proxy olmadan** direkt internete açılırsa, herhangi bir istemci
`X-Forwarded-For: 127.0.0.1` göndererek throttle'ı atlatabilir.

### Çözüm Yönü
- Uygulama daima bir reverse proxy (Nginx, Cloudflare) arkasında olmalı
- Cloudflare kullanılıyorsa: `trust proxy` değerini Cloudflare IP aralıklarıyla sınırla

---

## 8. DÜŞÜK — Hata Mesajlarında Yol Sızıntısı

### Sorun
`AllExceptionsFilter` her hatada `path: request.url` döner:
```json
{ "statusCode": 500, "message": "Internal server error", "path": "/api/v1/cocktails/cuid123" }
```

Stack trace client'a gönderilmiyor ✓ ama URL yapısı teyit edilmiş oluyor.

### Çözüm Yönü
Production'da `path` alanını kaldır veya generalize et (`/api/...`).

---

## 9. DÜŞÜK — `.env` Dosyası

### Sorun
`server/.env` repo içinde mevcut (`.gitignore`'da olmalı, kontrol et).

### Çözüm Yönü
- `.gitignore`'da `*.env` ve `.env` olduğunu doğrula
- CI/CD sırlarını environment variables olarak inject et, dosya olarak commit etme

---

## 10. DÜŞÜK — Leaderboard Korumasız

Leaderboard verisi (sıralama tablosu) auth gerektirmeden okunup yazılabiliyor.

### Saldırı Senaryoları
- Skor manipülasyonu: sahte yüksek skorlar ekle
- Tüm kullanıcı adı/skor verilerini toplu çıkar (GDPR riski varsa)

### Çözüm Yönü
- Skor yazma endpointleri için rate limiting + anti-cheat (aynı IP'den X dakikada bir)
- Admin CRUD işlemleri için auth

---

## Güvenlik Durumu Özeti

| # | Başlık | Risk | Durum |
|---|---|---|---|
| 1 | Kimlik doğrulama yok | Kritik | Açık |
| 2 | Upload presign kötüye kullanımı | Kritik | Açık |
| 3 | Throttle yetersiz | Yüksek | Kısmen (200/dk) |
| 4 | Admin panel auth yok | Yüksek | Açık |
| 5 | SSRF / harici URL enjeksiyonu | Orta | Açık |
| 6 | Pagination yok | Orta | Açık |
| 7 | Trust proxy IP spoofing | Orta | Koşullu |
| 8 | Hata mesajı sızıntısı | Düşük | Açık |
| 9 | .env dosyası riski | Düşük | Kontrol et |
| 10 | Leaderboard korumasız | Düşük | Açık |

### Mevcut Korumaların Özeti (İyi Taraf)
- Helmet HTTP güvenlik başlıkları ✓
- ValidationPipe whitelist + forbidNonWhitelisted ✓
- Global ThrottlerGuard (200/dk) ✓
- CORS production'da ALLOWED_ORIGINS ile kısıtlı ✓
- Pino logger auth header redaction ✓
- Exception filter stack trace sızdırmıyor ✓
- Prisma parameterized queries (SQL injection yok) ✓

---

## Backend Tasarımında Öncelik Sırası

Backend tasarlanırken şu sırada ele alınmalı:

1. **Auth guard** → en az admin secret header (`X-York-Key`) tüm yazma endpoint'lerine
2. **Upload MIME whitelist** → sadece `image/(jpeg|png|webp|gif)`
3. **Per-endpoint throttle** → presign 10/dk, delete 20/dk
4. **Pagination** → `GET /cocktails`, `GET /menu`
5. **imageUrl domain validation** → sadece kendi CDN'in
6. **Admin panel deploy güvenliği** → Cloudflare Access veya Basic Auth
