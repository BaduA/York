# York Backend — Agent Kuralları

NestJS + Prisma 7 (adapter-pg) + Cloudflare R2 backend. Bu dosyayı okumadan kod yazma.

---

## Stack

| | |
|---|---|
| Framework | NestJS (Express platform) |
| ORM | Prisma 7, `@prisma/adapter-pg` |
| Veritabanı | PostgreSQL |
| Dosya depolama | Cloudflare R2 (S3 compat.) |
| Doğrulama | `class-validator` + `class-transformer` |
| Logger | `nestjs-pino` |
| Rate limiting | `@nestjs/throttler` (global guard) |
| Güvenlik başlıkları | `helmet` |

---

## Proje Yapısı

Her özellik kendi modülüne aittir. Teknik katmana göre değil, **domain'e göre** gruplama:

```
src/
  app.module.ts         ← Sadece import, hiç iş mantığı yok
  main.ts               ← Bootstrap; global pipe/filter/guard burada
  common/
    filters/            ← Exception filter'lar
    guards/             ← Auth guard'lar
    decorators/         ← Custom decorator'lar
    nanoid.ts
  prisma/               ← PrismaService ve PrismaModule
  s3/                   ← S3Service, cdn-signer
  <feature>/
    <feature>.module.ts
    <feature>.controller.ts
    <feature>.service.ts
    dto/
      create-<feature>.dto.ts
      update-<feature>.dto.ts
```

Yeni özellik = yeni klasör + module/controller/service + dto/. Bunları ayrı dosyalarda tut.

---

## Modül Kuralları

- Her modül sadece kendi controller + service + dto'sunu yönetir.
- Başka modüllere doğrudan erişim yasak; `PrismaModule` veya `S3Module` import et.
- `AppModule`'da iş mantığı yazma — sadece import.
- `forwardRef` kullanma; döngüsel bağımlılık varsa mimari yanlış demektir.

---

## DTO Kuralları

Her `POST` ve `PATCH` endpointi için ayrı DTO. Hiçbir zaman `any` veya ham `object` alma.

### Zorunlu Kurallar

```typescript
// String alan: her zaman MinLength + MaxLength + trim Transform
@IsString()
@MinLength(1)
@MaxLength(200)
@Transform(({ value }: { value: string }) => value.trim())
title: string;

// Opsiyonel alan: @IsOptional() ÖNCE gelir
@IsOptional()
@IsString()
@MaxLength(500)
description?: string;

// Enum: @IsEnum kullan
@IsEnum(CocktailOrigin)
origin: CocktailOrigin;

// Array: @IsArray() + her eleman için @IsString({ each: true })
@IsArray()
@IsString({ each: true })
ingredientIds: string[];

// URL alanı (imageUrl gibi): sadece kendi CDN domainimizden URL kabul et
@IsOptional()
@IsString()
@Matches(/^https:\/\/cdn\.yourdomain\.com\//)
imageUrl?: string;
// NOT: CDN_DOMAIN env'den al; test ortamında picsum URL'lerine izin ver

// contentType (upload): sadece beyaz liste
@IsString()
@Matches(/^image\/(jpeg|jpg|png|webp|gif)$/)
contentType: string;
```

### UpdateDTO

Her zaman `PartialType(CreateDto)` kullan, sıfırdan yazma:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateFooDto } from './create-foo.dto';
export class UpdateFooDto extends PartialType(CreateFooDto) {}
```

---

## Controller Kuralları

- Controller sadece HTTP routing + DTO alıp service'e iletmek içindir. İş mantığı yok.
- Route parametresi her zaman `@Param('id') id: string` olarak al.
- Yanıt nesnesini controller'da şekillendirme — service ne döndürürse onu dön.
- Pagination gereken `GET` listelerinde `?page=1&limit=20` query param al.

```typescript
// Pagination örneği
@Get()
findAll(@Query() query: PaginationDto) {
  return this.service.findAll(query);
}
```

`PaginationDto`:
```typescript
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
```

---

## Auth Guard — Admin Key

Tüm yazma endpoint'leri (`POST`, `PATCH`, `DELETE`) ve admin `GET` endpoint'leri `AdminGuard` ile korunur.

### Guard Implementasyonu

`src/common/guards/admin.guard.ts`:
```typescript
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const key = req.headers['x-admin-key'];
    const expected = this.config.get<string>('ADMIN_SECRET_KEY');
    if (!expected || key !== expected) throw new UnauthorizedException();
    return true;
  }
}
```

### Kullanım

```typescript
@UseGuards(AdminGuard)
@Post()
create(@Body() dto: CreateFooDto) { ... }
```

Public `GET` (müşteri menüsü, leaderboard) → guard yok.  
Admin `GET` + tüm yazma işlemleri → `@UseGuards(AdminGuard)`.

### Env Değişkeni

`.env.example`'a ekle:
```
ADMIN_SECRET_KEY=changeme
```

---

## Throttle — Per-Endpoint Sınırları

Global: `200 req/60s` (app.module.ts'de mevcut).

Hassas endpointlere özel throttle:

```typescript
import { Throttle } from '@nestjs/throttler';

// Upload presign: 10 istek/dakika
@Throttle({ default: { ttl: 60000, limit: 10 } })
@Post('presign')
presign(...) {}

// Silme işlemleri: 20 istek/dakika
@Throttle({ default: { ttl: 60000, limit: 20 } })
@Delete(':id')
remove(...) {}
```

---

## Exception Handling

Controller ve service'lerde iş mantığı hatalarını NestJS HTTP exception'larıyla fırlat:

```typescript
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

// Bulunamadı
throw new NotFoundException(`Cocktail ${id} bulunamadı`);

// Unique kısıt ihlali (Prisma P2002 → filter zaten yakalar ama service'de de fırlat)
throw new ConflictException('Bu isim zaten kullanılıyor');

// Geçersiz input (validation pipe yakalamaz ama iş mantığı hatası varsa)
throw new BadRequestException('Geçersiz işlem');
```

Prisma exception filter (`src/common/filters/prisma-exception.filter.ts`) P2002, P2025 hatalarını
otomatik yakalar. Service'de Prisma hatalarını tekrar `try/catch` ile sarma.

Stack trace hiçbir zaman client'a gönderilmez (AllExceptionsFilter bunu sağlar).

---

## Service Kuralları

```typescript
@Injectable()
export class FooService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page, limit } = query;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.foo.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.foo.count(),
    ]);
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const item = await this.prisma.foo.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Foo ${id} bulunamadı`);
    return item;
  }
}
```

- Service her zaman `async`/`await` kullanır.
- `findOne` içinde null kontrolü yap, bulunamazsa `NotFoundException` fırlat.
- Toplu sorgu = `$transaction` kullan.
- Prisma sorgularına `select` ekle, gereksiz field döndürme.

---

## S3 / Upload Kuralları

- `contentType` sadece `image/(jpeg|jpg|png|webp|gif)` MIME'larına izin ver.
- `imageUrl` kaydederken domain kontrolü yap: sadece `CDN_DOMAIN` ile başlayanlar.
- Development'ta `picsum.photos` URL'leri geçerlidir (mevcut mock davranış korunur).
- Presign sonrası verilen URL doğrudan client'a dönülür; backend asla R2'ye binary upload yapmaz.

---

## Logging

`nestjs-pino` kullan. Controller veya service'de `console.log` yazma.

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class FooService {
  private readonly logger = new Logger(FooService.name);

  async doSomething() {
    this.logger.log('Bir şey yapılıyor');
    this.logger.error('Hata!', error.stack);
  }
}
```

---

## Prisma Kuralları

- Schema değişikliği = migration yaz (`prisma migrate dev`), seed güncelle.
- `@id` için `cuid()` kullan (mevcut pattern'i koru).
- İlişkili kayıt silme: `onDelete: Cascade` veya `Restrict` — rastgele bırakma.
- Büyük listeler için her zaman `take` + `skip` ile paginate et.
- `prisma.foo.findMany()` içinde `select: { id: true, title: true }` ile sadece gereken alanları çek.
- `updatedAt` alanı olan modellerde `@updatedAt` direktifi zorunlu.

---

## Güvenlik Kontrol Listesi

Yeni endpoint yazarken her maddeyi kafadan geç:

- [ ] Yazma işlemi mi? → `@UseGuards(AdminGuard)` ekle
- [ ] Input al mı? → DTO + class-validator kullan, `any` yasak
- [ ] String alan? → `MaxLength` sınırı var mı?
- [ ] URL/dosya al mı? → domain veya MIME whitelist var mı?
- [ ] Liste döndürüyor mu? → pagination var mı?
- [ ] Hassas endpoint mi (upload, delete)? → `@Throttle` ile sıkıştır
- [ ] `findOne` var mı? → `null` kontrolü + `NotFoundException` var mı?
- [ ] `imageUrl` kaydediyor mu? → CDN domain kontrolü var mı?

---

## Anti-Pattern'ler — Bunları Yapma

```typescript
// ❌ Controller'da iş mantığı
@Post()
create(@Body() dto: any) {
  const item = await this.prisma.foo.create({ data: dto }); // any yasak, Prisma doğrudan controller'da yasak
}

// ❌ Sınırsız liste
return this.prisma.foo.findMany(); // take/skip zorunlu

// ❌ Tüm alanları çek
prisma.foo.findMany() // select eksik, gereksiz data

// ❌ try/catch ile Prisma hatalarını yutma
try { ... } catch { return null; } // hataları saklamayın

// ❌ Magic string ID
if (id === 'admin') // URL'de özel anlam taşıyan ID'ler yasak

// ❌ console.log
console.log('debug') // Logger kullan

// ❌ Güvensiz contentType
@IsString() contentType: string; // @Matches ile MIME whitelist şart

// ❌ Herhangi bir URL kabul et
@IsUrl() imageUrl?: string; // CDN domain kontrolü olmadan @IsUrl() yetmez
```

---

## Naming Conventions

| | |
|---|---|
| Dosyalar | `kebab-case.ts` |
| Sınıflar | `PascalCase` |
| Değişkenler/metodlar | `camelCase` |
| Enum değerleri | `UPPER_SNAKE_CASE` |
| Route'lar | `kebab-case` (`/cocktail-lab` gibi) |
| Env değişkenleri | `UPPER_SNAKE_CASE` |
| DTO sınıfı | `CreateFooDto`, `UpdateFooDto`, `PaginationDto` |
| Guard | `AdminGuard`, `FooGuard` |
| Filter | `PrismaExceptionFilter`, `HttpExceptionFilter` |

---

## .env Değişkenleri (Tümü)

```
PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://...
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=auto
AWS_ENDPOINT_URL=https://<id>.r2.cloudflarestorage.com
AWS_S3_BUCKET_NAME=
CDN_DOMAIN=https://cdn.yourdomain.com
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
ADMIN_SECRET_KEY=changeme
```

`ConfigService` ile oku; asla `process.env.X` doğrudan kullanma (test edilemez olur).
