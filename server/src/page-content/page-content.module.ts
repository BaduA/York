import { Module } from '@nestjs/common';
import { PageContentController } from './page-content.controller';
import { PageContentService } from './page-content.service';
import { AdminGuard } from '../common/guards/admin.guard';

@Module({
  controllers: [PageContentController],
  providers: [PageContentService, AdminGuard],
})
export class PageContentModule {}
