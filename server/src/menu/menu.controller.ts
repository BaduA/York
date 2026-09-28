import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { MenuService } from './menu.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ReorderDto } from './dto/reorder.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly service: MenuService) {}

  // ─── Public ───────────────────────────────────────────────────────────────

  @Get()
  findPublic() {
    return this.service.findPublic();
  }

  // ─── Admin — read ─────────────────────────────────────────────────────────

  @UseGuards(AdminGuard)
  @Get('admin')
  findAll() {
    return this.service.findAll();
  }

  // ─── Sections ─────────────────────────────────────────────────────────────

  @UseGuards(AdminGuard)
  @Post('sections')
  createSection(@Body() dto: CreateSectionDto) {
    return this.service.createSection(dto);
  }

  @UseGuards(AdminGuard)
  @Patch('sections/reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  reorderSections(@Body() dto: ReorderDto) {
    return this.service.reorderSections(dto);
  }

  @UseGuards(AdminGuard)
  @Patch('sections/:id')
  updateSection(@Param('id') id: string, @Body() dto: UpdateSectionDto) {
    return this.service.updateSection(id, dto);
  }

  @UseGuards(AdminGuard)
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  @Delete('sections/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSection(@Param('id') id: string) {
    return this.service.deleteSection(id);
  }

  // ─── Groups ───────────────────────────────────────────────────────────────

  @UseGuards(AdminGuard)
  @Post('sections/:sectionId/groups')
  createGroup(@Param('sectionId') sectionId: string, @Body() dto: CreateGroupDto) {
    return this.service.createGroup(sectionId, dto);
  }

  @UseGuards(AdminGuard)
  @Patch('groups/reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  reorderGroups(@Body() dto: ReorderDto) {
    return this.service.reorderGroups(dto);
  }

  @UseGuards(AdminGuard)
  @Patch('groups/:id')
  updateGroup(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.service.updateGroup(id, dto);
  }

  @UseGuards(AdminGuard)
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  @Delete('groups/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteGroup(@Param('id') id: string) {
    return this.service.deleteGroup(id);
  }

  // ─── Items ────────────────────────────────────────────────────────────────

  @UseGuards(AdminGuard)
  @Post('groups/:groupId/items')
  createItem(@Param('groupId') groupId: string, @Body() dto: CreateItemDto) {
    return this.service.createItem(groupId, dto);
  }

  @UseGuards(AdminGuard)
  @Patch('items/reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  reorderItems(@Body() dto: ReorderDto) {
    return this.service.reorderItems(dto);
  }

  @UseGuards(AdminGuard)
  @Patch('items/:id')
  updateItem(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.service.updateItem(id, dto);
  }

  @UseGuards(AdminGuard)
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteItem(@Param('id') id: string) {
    return this.service.deleteItem(id);
  }
}
