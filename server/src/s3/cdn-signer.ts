import { ConfigService } from '@nestjs/config';

export function getPublicImageUrl(imageKey: string, configService: ConfigService): string {
  if (!imageKey) return imageKey;
  if (imageKey.startsWith('http://') || imageKey.startsWith('https://')) return imageKey;
  const domain = configService.get<string>('CDN_DOMAIN', 'https://cdn.yourdomain.com');
  const base = domain.replace(/\/$/, '');
  const key = imageKey.startsWith('/') ? imageKey.slice(1) : imageKey;
  return `${base}/${key}`;
}
