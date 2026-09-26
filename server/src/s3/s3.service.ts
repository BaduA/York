import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getPublicImageUrl } from './cdn-signer';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3: S3Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    const endpoint = config.get<string>('AWS_ENDPOINT_URL');
    this.s3 = new S3Client({
      region: config.get<string>('AWS_REGION', 'auto'),
      ...(endpoint && { endpoint }),
      credentials: {
        accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID') ?? '',
        secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
      },
    });
    this.bucket = config.get<string>('AWS_S3_BUCKET_NAME') ?? '';
  }

  async requestUploadUrl(
    key: string,
    contentType: string,
    expiresIn = 3600,
  ): Promise<{ uploadUrl: string; storeUrl: string }> {
    if (process.env.NODE_ENV !== 'production') {
      const seed = key.split('/').pop() ?? key;
      return { uploadUrl: '', storeUrl: `https://picsum.photos/seed/${seed}/400/400` };
    }
    const command = new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType });
    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn });
    const storeUrl = getPublicImageUrl(key, this.config);
    return { uploadUrl, storeUrl };
  }

  extractKey(address: string): string {
    return address.startsWith('http') ? new URL(address).pathname.slice(1) : address;
  }

  async deleteImage(key: string): Promise<void> {
    if (process.env.NODE_ENV !== 'production') return;
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  deleteImageByAddress(address: string): void {
    const key = this.extractKey(address);
    this.deleteImage(key).catch((err: Error) =>
      this.logger.error(`S3 delete failed for key ${key}: ${err.message}`),
    );
  }
}
