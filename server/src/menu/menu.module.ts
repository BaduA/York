import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { AdminGuard } from '../common/guards/admin.guard';

@Module({
  controllers: [MenuController],
  providers: [MenuService, AdminGuard],
})
export class MenuModule {}
