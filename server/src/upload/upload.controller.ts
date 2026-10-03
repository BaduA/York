import { Controller, Post, Body } from '@nestjs/common';
import { IsString, IsIn } from 'class-validator';
import { S3Service } from '../s3/s3.service';
import { nanoid } from '../common/nanoid';

class PresignDto {
  @IsString()
  @IsIn(['ingredients', 'cocktails', 'lab-items', 'menu-sections'])
  folder: string;

  @IsString()
  contentType: string;
}

@Controller('upload')
export class UploadController {
  constructor(private s3: S3Service) {}

  @Post('presign')
  async presign(@Body() dto: PresignDto) {
    const ext = dto.contentType.split('/')[1] ?? 'jpg';
    const key = `${dto.folder}/${nanoid()}.${ext}`;
    return this.s3.requestUploadUrl(key, dto.contentType);
  }
}
