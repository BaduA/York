import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import type { IncomingMessage } from 'http';
import { PrismaModule } from './prisma';
import { S3Module } from './s3/s3.module';
import { HealthModule } from './health/health.module';
import { IngredientTypesModule } from './ingredient-types/ingredient-types.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { CocktailsModule } from './cocktails/cocktails.module';
import { UploadModule } from './upload/upload.module';
import { MenuModule } from './menu/menu.module';
import { PageContentModule } from './page-content/page-content.module';

const isDev = process.env.NODE_ENV !== 'production';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: isDev ? 'debug' : 'info',
        ...(isDev && {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, singleLine: true, ignore: 'pid,hostname' },
          },
        }),
        redact: { paths: ['req.headers.authorization'], remove: true },
        autoLogging: {
          ignore: (req: IncomingMessage) => (req.url ?? '').includes('/health'),
        },
        serializers: {
          req: (req: { method: string; url: string }) => ({ method: req.method, url: req.url }),
          res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
        },
      },
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 200 }]),
    PrismaModule,
    S3Module,
    HealthModule,
    IngredientTypesModule,
    IngredientsModule,
    CocktailsModule,
    UploadModule,
    MenuModule,
    PageContentModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
