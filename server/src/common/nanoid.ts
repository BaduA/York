import { randomBytes } from 'crypto';

export function nanoid(size = 21): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  const bytes = randomBytes(size);
  return Array.from(bytes, (b) => chars[b % 64]).join('');
}
